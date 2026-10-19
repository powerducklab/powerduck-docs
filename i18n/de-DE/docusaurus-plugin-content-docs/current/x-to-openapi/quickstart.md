---
sidebar_position: 3
title: "Schnellstart"
description: "Erste Schritte mit @powerduck/x-to-openapi: curl und Postman Collections konvertieren und eigene Adapter mit XToOpenApi registrieren."
---

# Schnellstart

Diese Anleitung zeigt die drei häufigsten Wege: die Hilfsfunktionen `curlToOpenApi` und `postmanToOpenApi` sowie die Klasse `XToOpenApi` für eigene Konfigurationen.

Voraussetzung: Installieren Sie zunächst das Paket. [Installation](/docs/de-DE/x-to-openapi/installation/)

:::note
Alle Konvertierungsfunktionen sind **asynchron** und geben ein [`ConvertResult`](/docs/de-DE/x-to-openapi/api-reference/#convertresult) zurück. Verwenden Sie immer `await`.
:::

## 1. Einen curl-Befehl konvertieren

Übergeben Sie einen einzelnen curl-Befehl an [`curlToOpenApi`](/docs/de-DE/x-to-openapi/api-reference/#curltoopenapi). Das Feld `document` des Ergebnisses enthält das erzeugte OpenAPI-3.2-Objekt.

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  `curl -X POST https://api.example.com/users \
    -H 'Content-Type: application/json' \
    --data '{"name":"Ada","age":36}'`,
);

console.log(JSON.stringify(result.document, null, 2));
```

Das erzeugte Dokument sieht gekürzt so aus:

```json
{
  "openapi": "3.2.0",
  "info": { "title": "Generated API", "version": "1.0.0" },
  "servers": [{ "url": "https://api.example.com" }],
  "paths": {
    "/users": {
      "post": {
        "operationId": "postUsers",
        "tags": ["users"],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "name": { "type": "string" },
                  "age": { "type": "integer" }
                },
                "required": ["name", "age"]
              }
            }
          }
        },
        "responses": { "default": { "description": "Successful response" } }
      }
    }
  }
}
```

Prüfen Sie den Erfolg der Konvertierung und die Diagnosemeldungen:

```typescript
if (!result.ok) {
  for (const d of result.diagnostics) {
    console.error(`[${d.severity}] ${d.code}: ${d.message}`);
  }
}
console.log("Document valid:", result.documentValid);
```

## 2. Eine Postman Collection konvertieren

Übergeben Sie ein bereits geparstes Collection-Objekt oder eine JSON-Zeichenfolge an [`postmanToOpenApi`](/docs/de-DE/x-to-openapi/api-reference/). Testskripte bleiben als `x-postman-scripts` erhalten.

```typescript
import { postmanToOpenApi } from "@powerduck/x-to-openapi";

const collection = {
  info: {
    name: "User API",
    schema: "https://schema.postman.com/json/collection/v2.1.0/collection.json",
  },
  item: [
    {
      name: "Get user",
      request: {
        method: "GET",
        url: "https://api.example.com/users/123",
        header: [{ key: "Authorization", value: "Bearer token" }],
      },
      event: [
        {
          listen: "test",
          script: {
            type: "text/javascript",
            exec: ["pm.test('status is 200', () => pm.response.to.have.status(200));"],
          },
        },
      ],
    },
  ],
  auth: { type: "bearer", bearer: [{ key: "token", value: "{{token}}" }] },
};

const result = await postmanToOpenApi(collection, {
  title: collection.info.name,
  inferPathParameters: true,
});

// The Postman test script survives on the operation:
console.log(result.document.paths["/users/123"]?.get?.["x-postman-scripts"]);
```

Eine JSON-Zeichenfolge funktioniert ebenfalls:

```typescript
const fromText = await postmanToOpenApi('{"info":{"name":"API"},"item":[]}');
```

## 3. Die Klasse `XToOpenApi` mit eigenen Optionen verwenden

Verwenden Sie die Klasse, wenn Sie registrierte Adapter und [`ConvertOptions`](/docs/de-DE/x-to-openapi/api-reference/#convertoptions) ausdrücklich steuern möchten.

```typescript
import { XToOpenApi, CurlAdapter } from "@powerduck/x-to-openapi";

const converter = new XToOpenApi().register(new CurlAdapter());

const result = await converter.convert(
  "curl",
  "curl https://api.example.com/users/123",
  {
    title: "My API",
    version: "1.0.0",
    description: "Generated from curl commands",
    inferPathParameters: true,
    pathParameterMinSamples: 2,
    inferSecurity: true,
    includeCommonHeaders: false,
    includeCookies: false,
    includeExamples: false,
    useServerBasePath: false,
    validate: true,
    strict: false,
  },
);

console.log(result.document);
```

### Mehrere Adapter registrieren und `"auto"` verwenden

```typescript
import { XToOpenApi, CurlAdapter, PostmanAdapter } from "@powerduck/x-to-openapi";

const converter = new XToOpenApi()
  .register(new CurlAdapter())
  .register(new PostmanAdapter());

// "auto" picks the first adapter whose canHandle(input) returns true.
const result = await converter.convert("auto", postmanCollectionOrCurlText);
```

## 4. Diagnosen und strikter Modus

Standardmäßig sammelt die Konvertierung Probleme als [`Diagnostic`](/docs/de-DE/x-to-openapi/api-reference/)-Einträge und gibt trotzdem ein Ergebnis zurück. Mit `strict: true` wird bei der ersten Diagnose mit Fehlerschwere ein [`ConversionError`](/docs/de-DE/x-to-openapi/api-reference/#conversionerror) ausgelöst.

```typescript
import { curlToOpenApi, ConversionError } from "@powerduck/x-to-openapi";

try {
  await curlToOpenApi("curl https://api.example.com/users", { strict: true });
} catch (error) {
  if (error instanceof ConversionError) {
    console.error("Failed:", error.message);
    for (const d of error.diagnostics) console.error(`  [${d.code}] ${d.message}`);
  }
}
```

## Nächste Schritte

- [Beispiele](/docs/de-DE/x-to-openapi/examples/) — Mehrere curl-Befehle, Ableitung von Pfadparametern, Postman-Authentifizierung und ein eigener Adapter.
- [API-Referenz](/docs/de-DE/x-to-openapi/api-reference/) — Alle Exporte, Optionen und Diagnosecodes.
