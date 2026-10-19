---
sidebar_position: 5
title: "Beispiele"
description: "Praktische, ausführbare Beispiele mit der öffentlichen API"
---

# Beispiele

Praktische, ausführbare Beispiele mit der öffentlichen API. Konvertierungsfunktionen sind asynchron; verwenden Sie `await`. Die Eingaben werden lokal geparst, ohne die aufgezeichneten HTTP-Anfragen zu senden.

---

## 1. Einfacher curl-Befehl

Konvertieren Sie einen einzelnen curl-Befehl und prüfen Sie das erzeugte Dokument.

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  `curl -X POST https://api.example.com/users \
    -H 'Content-Type: application/json' \
    --data '{"name":"Ada","age":36,"tags":["admin","user"]}'`,
);

console.log(result.document.openapi);            // "3.2.0"
console.log(result.ok, result.documentValid);    // true true

const post = result.document.paths["/users"].post;
const body = post?.requestBody;
if (!body || !("content" in body)) throw new Error("Expected an inline request body");
const media = body.content["application/json"];
console.log(media && "schema" in media ? media.schema : undefined);
// {
//   type: "object",
//   properties: {
//     name: { type: "string" },
//     age: { type: "integer" },
//     tags: { type: "array", items: { type: "string" } }
//   },
//   required: ["name", "age", "tags"]
// }
```

Diagnosen werden auch bei Erfolg zurückgegeben:

```typescript
for (const d of result.diagnostics) {
  console.log(`[${d.severity}] ${d.code}: ${d.message}`);
}
```

---

## 2. Mehrere curl-Befehle im Stapel

Übergeben Sie ein Befehlsarray oder eine Zeichenfolge mit mehreren Befehlen. Anfragen mit gleicher Methode und gleichem Pfad werden zusammengeführt; Schemas werden strukturell kombiniert.

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  [
    "curl https://api.example.com/users",
    "curl https://api.example.com/users/123",
    "curl https://api.example.com/users/456",
    `curl -X POST https://api.example.com/users \
       -H 'Content-Type: application/json' \
       --data '{"name":"Ada"}'`,
  ],
  {
    title: "User API",
    version: "2.0.0",
    useServerBasePath: false,
    inferPathParameters: true,
  },
);

// The two detail requests are grouped; /users remains a separate path.
console.log(Object.keys(result.document.paths)); // ["/users", "/users/{userId}"]
```

### Browserausgabe „Alle als cURL kopieren“

Fügen Sie den gesamten Block ein. [`splitCurlCommands`](./api-reference.md#splitcurlcommands) verarbeitet Anführungszeichen, Zeilenfortsetzungen, Eingabeaufforderungen und `curl.exe`.

```typescript
const block = `
$ curl 'https://api.example.com/users/1?active=true'
> curl 'https://api.example.com/users/2' -X POST \
  -H 'Content-Type: application/json' --data '{"name":"Ada"}'`;

const result = await curlToOpenApi(block, { title: "Pasted traffic" });
```

---

## 3. Postman Collection

Konvertieren Sie ein Collection-Objekt. Verschachtelte Ordner, vererbte Authentifizierung und Testskripte werden berücksichtigt.

```typescript
import { postmanToOpenApi } from "@powerduck/x-to-openapi";

const collection = {
  info: {
    name: "User API",
    schema: "https://schema.postman.com/json/collection/v2.1.0/collection.json",
  },
  auth: { type: "bearer", bearer: [{ key: "token", value: "{{token}}" }] },
  item: [
    {
      name: "Users",
      item: [
        {
          name: "Create user",
          request: {
            method: "POST",
            url: "https://api.example.com/users",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: '{"name":"Ada","role":"admin"}',
              options: { raw: { language: "json" } },
            },
          },
          event: [
            {
              listen: "test",
              script: {
                type: "text/javascript",
                exec: ["pm.test('status is 201', () => pm.response.to.have.status(201));"],
              },
            },
          ],
        },
      ],
    },
  ],
};

const result = await postmanToOpenApi(collection, {
  title: collection.info.name,
  inferPathParameters: true,
});

// Collection-level bearer auth becomes a securityScheme + operation security.
console.log(result.document.components?.securitySchemes);
// { bearerAuth: { type: "http", scheme: "bearer" } }

// The Postman test script is preserved:
console.log(result.document.paths["/users"].post["x-postman-scripts"]);
// { test: "pm.test('status is 201', () => ...)" }
```

Auch eine JSON-Zeichenfolge ist möglich:

```typescript
const fromText = await postmanToOpenApi(JSON.stringify(collection));
```

---

## 4. Ableitung von Pfadparametern

Bei aktiviertem `inferPathParameters` (Standard) werden Anfragen nach Methode, Ursprung und Pfadstruktur gruppiert. Ein Segment wird nur dann durch einen Parameter ersetzt, wenn die Gruppe mindestens `pathParameterMinSamples` Anfragen enthält, die Werte variieren und **jeder** Wert wie ein Bezeichner aussieht: Zahl, UUID, ULID oder Hexadezimalzeichenfolge mit mindestens 8 Zeichen.

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  [
    "curl https://api.example.com/users/123",
    "curl https://api.example.com/users/456",
    "curl https://api.example.com/users/123/posts/abc12345",
    "curl https://api.example.com/users/456/posts/def45678",
  ],
  { pathParameterMinSamples: 2 },
);

console.log(Object.keys(result.document.paths));
// [ "/users/{userId}", "/users/{userId}/posts/{postId}" ]
```

Parameternamen werden aus dem nächstgelegenen vorangehenden statischen Segment abgeleitet, in den Singular gesetzt und in camelCase umgewandelt:

| Pfadmuster | Parameternamen |
|---|---|
| `/users/{}` | `userId` |
| `/users/{}/posts/{}` | `userId`, `postId` |
| `/categories/{}/items/{}` | `categoryId`, `itemId` |
| `/{}` | `param1` |

Doppelte Namen innerhalb eines Pfads erhalten numerische Suffixe (`userId`, `userId2`).

Deaktivieren Sie die Ableitung, um wörtliche Pfadsegmente beizubehalten:

```typescript
await curlToOpenApi(commands, { inferPathParameters: false });
```

---

## 5. Benutzerdefinierter Adapter

Implementieren Sie [`SourceAdapter`](./api-reference.md), um eine neue Quelle wie HAR, HTTPie oder Insomnia hinzuzufügen, und registrieren Sie sie anschließend in `XToOpenApi`.

```typescript
import {
  XToOpenApi,
  CurlAdapter,
  type SourceAdapter,
  type NormalizedRequest,
  type AdapterContext,
} from "@powerduck/x-to-openapi";

// A trivial adapter that emits a single GET request.
class PingAdapter implements SourceAdapter<{ url: string }> {
  readonly id = "ping";

  canHandle(input: unknown): boolean {
    return (
      typeof input === "object" &&
      input !== null &&
      "url" in (input as Record<string, unknown>)
    );
  }

  async parse(
    input: { url: string },
    context: AdapterContext,
  ): Promise<NormalizedRequest[]> {
    let url: URL;
    try {
      url = new URL(input.url);
    } catch (cause) {
      context.report({
        code: "ADAPTER_PARSE_FAILED",
        severity: "error",
        source: this.id,
        message: `Invalid URL: ${input.url}`,
        cause,
      });
      return [];
    }

    return [
      {
        source: this.id,
        sourceIndex: 0,
        method: "get",
        url,
        urlString: url.toString(),
        headers: [],
        query: [],
        cookies: [],
      },
    ];
  }
}

const converter = new XToOpenApi()
  .register(new PingAdapter())
  .register(new CurlAdapter());

// Explicit adapter id:
const a = await converter.convert("ping", { url: "https://api.example.com/health" });

// Auto-detect:
const b = await converter.convert("auto", { url: "https://api.example.com/health" });

console.log(a.document.paths["/health"]?.get?.operationId);
```

---

## 6. Fehlerbehandlung und strikter Modus

Probleme werden in `result.diagnostics` gesammelt. Mit `strict: true` lösen Diagnosen der Stufe Fehler eine [`ConversionError`](./api-reference.md#conversionerror) aus; reine Warnungen tun dies nicht. Ungültige Optionen und unbekannte Adapter-IDs können ebenfalls Ausnahmen auslösen.

```typescript
import { curlToOpenApi, ConversionError } from "@powerduck/x-to-openapi";

// Soft mode: inspect diagnostics yourself.
const soft = await curlToOpenApi("curl https://api.example.com/health");
if (!soft.ok) {
  for (const d of soft.diagnostics) {
    console.error(`[${d.severity}] ${d.code}: ${d.message}`);
  }
}

// Strict mode: throw on the first error-severity diagnostic.
try {
  await curlToOpenApi("not a curl command at all", { strict: true });
} catch (error) {
  if (error instanceof ConversionError) {
    console.error("Conversion failed:", error.message);
    for (const d of error.diagnostics) console.error(`  ${d.code}`);
  }
}
```

Die aktuelle Größenprüfung wirft unabhängig von `strict` eine `ConversionError`, wenn eine Zeichenfolge oder die Summe der Zeichenfolgenelemente eines Arrays 10 × 1024 × 1024 JavaScript-Codeeinheiten überschreitet. Dies ist keine UTF-8-Bytegrenze und erfasst keine bereits geparsten Objekte. Begrenzen Sie nicht vertrauenswürdige Eingaben daher selbst nach ihrer Bytegröße.

---

## Nächste Schritte

- [API-Referenz](./api-reference.md): Standardwerte der Optionen und Diagnosecodes.
- [Schnellstart](./quickstart.md): Ihre erste vollständige Konvertierung.
