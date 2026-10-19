---
sidebar_position: 3
title: "Inicio rápido"
description: "Primeros pasos con @powerduck/x-to-openapi: convierte comandos curl y colecciones Postman, y registra adaptadores con XToOpenApi."
---

# Inicio rápido

Esta guía cubre las tres opciones más habituales: las funciones `curlToOpenApi` y `postmanToOpenApi`, y la clase `XToOpenApi` para integraciones personalizadas.

Requisito previo: instala el paquete. [Instalación](/docs/es-ES/x-to-openapi/installation/)

:::note
Todas las funciones de conversión son **asíncronas** y devuelven un [`ConvertResult`](/docs/es-ES/x-to-openapi/api-reference/#convertresult). Utiliza siempre `await`.
:::

## 1. Convertir un comando curl

Pasa un único comando curl a [`curlToOpenApi`](/docs/es-ES/x-to-openapi/api-reference/#curltoopenapi). El campo `document` del resultado contiene el objeto OpenAPI 3.2 generado.

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  `curl -X POST https://api.example.com/users \
    -H 'Content-Type: application/json' \
    --data '{"name":"Ada","age":36}'`,
);

console.log(JSON.stringify(result.document, null, 2));
```

El documento generado tiene este aspecto, abreviado:

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

Comprueba si la conversión se ha completado correctamente y revisa los diagnósticos:

```typescript
if (!result.ok) {
  for (const d of result.diagnostics) {
    console.error(`[${d.severity}] ${d.code}: ${d.message}`);
  }
}
console.log("Document valid:", result.documentValid);
```

## 2. Convertir una colección Postman

Pasa un objeto de colección ya analizado o una cadena JSON a [`postmanToOpenApi`](/docs/es-ES/x-to-openapi/api-reference/). Los scripts de prueba se conservan como `x-postman-scripts`.

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

También puedes usar una cadena JSON:

```typescript
const fromText = await postmanToOpenApi('{"info":{"name":"API"},"item":[]}');
```

## 3. Usar la clase `XToOpenApi` con opciones personalizadas

Utiliza la clase para controlar explícitamente los adaptadores registrados y las [`ConvertOptions`](/docs/es-ES/x-to-openapi/api-reference/#convertoptions).

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

### Registrar varios adaptadores y usar `"auto"`

```typescript
import { XToOpenApi, CurlAdapter, PostmanAdapter } from "@powerduck/x-to-openapi";

const converter = new XToOpenApi()
  .register(new CurlAdapter())
  .register(new PostmanAdapter());

// "auto" picks the first adapter whose canHandle(input) returns true.
const result = await converter.convert("auto", postmanCollectionOrCurlText);
```

## 4. Diagnósticos y modo estricto

Por defecto, la conversión recopila los problemas como entradas [`Diagnostic`](/docs/es-ES/x-to-openapi/api-reference/) y devuelve un resultado de todos modos. Usa `strict: true` para lanzar una [`ConversionError`](/docs/es-ES/x-to-openapi/api-reference/#conversionerror) ante el primer diagnóstico de nivel de error.

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

## Siguientes pasos

- [Ejemplos](/docs/es-ES/x-to-openapi/examples/) — Comandos curl por lotes, inferencia de parámetros de ruta, autenticación Postman y un adaptador personalizado.
- [Referencia de API](/docs/es-ES/x-to-openapi/api-reference/) — Todas las exportaciones, opciones y códigos de diagnóstico.
