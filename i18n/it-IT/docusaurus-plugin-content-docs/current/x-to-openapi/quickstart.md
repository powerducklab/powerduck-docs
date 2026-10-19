---
sidebar_position: 3
title: "Guida rapida"
description: "Primi passi con @powerduck/x-to-openapi: converti comandi curl e raccolte Postman e registra adattatori con XToOpenApi."
---

# Guida rapida

Questa guida presenta i tre percorsi più comuni: le funzioni `curlToOpenApi` e `postmanToOpenApi` e la classe `XToOpenApi` per integrazioni personalizzate.

Prerequisito: installa il pacchetto. [Installazione](/docs/it-IT/x-to-openapi/installation/)

:::note
Tutte le funzioni di conversione sono **asincrone** e restituiscono un [`ConvertResult`](/docs/it-IT/x-to-openapi/api-reference/#convertresult). Usa sempre `await`.
:::

## 1. Convertire un comando curl

Passa un singolo comando curl a [`curlToOpenApi`](/docs/it-IT/x-to-openapi/api-reference/#curltoopenapi). Il campo `document` del risultato contiene l'oggetto OpenAPI 3.2 generato.

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  `curl -X POST https://api.example.com/users \
    -H 'Content-Type: application/json' \
    --data '{"name":"Ada","age":36}'`,
);

console.log(JSON.stringify(result.document, null, 2));
```

Il documento generato ha questo aspetto, in forma abbreviata:

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

Controlla l'esito della conversione ed esamina la diagnostica:

```typescript
if (!result.ok) {
  for (const d of result.diagnostics) {
    console.error(`[${d.severity}] ${d.code}: ${d.message}`);
  }
}
console.log("Document valid:", result.documentValid);
```

## 2. Convertire una raccolta Postman

Passa un oggetto raccolta già analizzato o una stringa JSON a [`postmanToOpenApi`](/docs/it-IT/x-to-openapi/api-reference/). Gli script di test vengono conservati come `x-postman-scripts`.

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

È possibile usare anche una stringa JSON:

```typescript
const fromText = await postmanToOpenApi('{"info":{"name":"API"},"item":[]}');
```

## 3. Usare la classe `XToOpenApi` con opzioni personalizzate

Usa la classe per controllare esplicitamente gli adattatori registrati e le [`ConvertOptions`](/docs/it-IT/x-to-openapi/api-reference/#convertoptions).

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

### Registrare più adattatori e usare `"auto"`

```typescript
import { XToOpenApi, CurlAdapter, PostmanAdapter } from "@powerduck/x-to-openapi";

const converter = new XToOpenApi()
  .register(new CurlAdapter())
  .register(new PostmanAdapter());

// "auto" picks the first adapter whose canHandle(input) returns true.
const result = await converter.convert("auto", postmanCollectionOrCurlText);
```

## 4. Diagnostica e modalità rigorosa

Per impostazione predefinita, la conversione raccoglie i problemi come voci [`Diagnostic`](/docs/it-IT/x-to-openapi/api-reference/) e restituisce comunque un risultato. Imposta `strict: true` per generare una [`ConversionError`](/docs/it-IT/x-to-openapi/api-reference/#conversionerror) al primo messaggio di livello errore.

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

## Passaggi successivi

- [Esempi](/docs/it-IT/x-to-openapi/examples/) — Comandi curl in batch, inferenza dei parametri di percorso, autenticazione Postman e un adattatore personalizzato.
- [Riferimento API](/docs/it-IT/x-to-openapi/api-reference/) — Tutti gli export, le opzioni e i codici diagnostici.
