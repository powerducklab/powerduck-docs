---
sidebar_position: 5
title: "Esempi"
description: "Esempi pratici ed eseguibili basati sull’API pubblica"
---

# Esempi

Esempi pratici ed eseguibili basati sull’API pubblica. Le funzioni di conversione sono asincrone: usa `await`. Analizzano l’input in locale senza inviare le richieste HTTP registrate.

---

## 1. Comando curl di base

Converti un comando curl ed esamina il documento generato.

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

La diagnostica viene restituita anche in caso di successo:

```typescript
for (const d of result.diagnostics) {
  console.log(`[${d.severity}] ${d.code}: ${d.message}`);
}
```

---

## 2. Più comandi curl in batch

Passa un array di comandi o una stringa che ne contenga diversi. Le richieste con lo stesso metodo e percorso vengono unite; gli schemi sono combinati strutturalmente.

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

### Output del browser “Copia tutto come cURL”

Incolla l’intero blocco: [`splitCurlCommands`](./api-reference.md#splitcurlcommands) gestisce virgolette, continuazioni di riga, prompt e `curl.exe`.

```typescript
const block = `
$ curl 'https://api.example.com/users/1?active=true'
> curl 'https://api.example.com/users/2' -X POST \
  -H 'Content-Type: application/json' --data '{"name":"Ada"}'`;

const result = await curlToOpenApi(block, { title: "Pasted traffic" });
```

---

## 3. Collezione Postman

Converti un oggetto collezione. Vengono rispettate le cartelle annidate, l’ereditarietà dell’autenticazione e gli script di test.

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

Funziona anche con una stringa JSON:

```typescript
const fromText = await postmanToOpenApi(JSON.stringify(collection));
```

---

## 4. Inferenza dei parametri del percorso

Con `inferPathParameters` attivo, come avviene per impostazione predefinita, le richieste sono raggruppate per metodo, origine e struttura del percorso. Un segmento diventa parametro solo se il gruppo contiene almeno `pathParameterMinSamples` richieste, i valori variano e **tutti** sembrano identificatori: numeri, UUID, ULID o stringhe esadecimali di almeno 8 caratteri.

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

I nomi dei parametri derivano dal segmento statico precedente più vicino, trasformato al singolare e in camelCase:

| Modello del percorso | Nomi dei parametri |
|---|---|
| `/users/{}` | `userId` |
| `/users/{}/posts/{}` | `userId`, `postId` |
| `/categories/{}/items/{}` | `categoryId`, `itemId` |
| `/{}` | `param1` |

I nomi duplicati nello stesso percorso ricevono suffissi numerici (`userId`, `userId2`).

Disattiva l’inferenza per mantenere i segmenti letterali:

```typescript
await curlToOpenApi(commands, { inferPathParameters: false });
```

---

## 5. Adattatore personalizzato

Implementa [`SourceAdapter`](./api-reference.md) per aggiungere una fonte come HAR, HTTPie o Insomnia, poi registrala in `XToOpenApi`.

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

## 6. Gestione degli errori e modalità rigorosa

I problemi vengono raccolti in `result.diagnostics`. Con `strict: true`, le segnalazioni di livello errore generano una [`ConversionError`](./api-reference.md#conversionerror); i soli avvisi non lo fanno. Anche opzioni non valide e ID di adattatore sconosciuti possono generare eccezioni.

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

Il controllo attuale delle dimensioni genera `ConversionError` quando una stringa, o la somma degli elementi stringa di un array, supera 10 × 1024 × 1024 unità di codice JavaScript, indipendentemente da `strict`. Non è un limite di byte UTF-8 e non misura gli oggetti già analizzati; applica un tuo limite in byte prima di accettare input non affidabili.

---

## Passaggi successivi

- [Riferimento API](./api-reference.md): valori predefiniti delle opzioni e codici diagnostici.
- [Guida rapida](./quickstart.md): la tua prima conversione completa.
