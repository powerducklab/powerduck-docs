---
sidebar_position: 3
title: "Início rápido"
description: "Primeiros passos com @powerduck/x-to-openapi: converta comandos curl e coleções Postman e registre adaptadores com XToOpenApi."
---

# Início rápido

Este guia apresenta os três caminhos mais comuns: as funções `curlToOpenApi` e `postmanToOpenApi` e a classe `XToOpenApi` para integrações personalizadas.

Pré-requisito: instale o pacote. [Instalação](/docs/pt-BR/x-to-openapi/installation/)

:::note
Todas as funções de conversão são **assíncronas** e retornam um [`ConvertResult`](/docs/pt-BR/x-to-openapi/api-reference/#convertresult). Sempre use `await`.
:::

## 1. Converter um comando curl

Passe um único comando curl para [`curlToOpenApi`](/docs/pt-BR/x-to-openapi/api-reference/#curltoopenapi). O campo `document` do resultado contém o objeto OpenAPI 3.2 gerado.

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  `curl -X POST https://api.example.com/users \
    -H 'Content-Type: application/json' \
    --data '{"name":"Ada","age":36}'`,
);

console.log(JSON.stringify(result.document, null, 2));
```

O documento gerado fica assim, de forma resumida:

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

Verifique se a conversão foi bem-sucedida e examine os diagnósticos:

```typescript
if (!result.ok) {
  for (const d of result.diagnostics) {
    console.error(`[${d.severity}] ${d.code}: ${d.message}`);
  }
}
console.log("Document valid:", result.documentValid);
```

## 2. Converter uma coleção Postman

Passe um objeto de coleção já analisado ou uma string JSON para [`postmanToOpenApi`](/docs/pt-BR/x-to-openapi/api-reference/). Os scripts de teste são preservados como `x-postman-scripts`.

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

Uma string JSON também funciona:

```typescript
const fromText = await postmanToOpenApi('{"info":{"name":"API"},"item":[]}');
```

## 3. Usar a classe `XToOpenApi` com opções personalizadas

Use a classe para controlar explicitamente os adaptadores registrados e as [`ConvertOptions`](/docs/pt-BR/x-to-openapi/api-reference/#convertoptions).

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

### Registrar vários adaptadores e usar `"auto"`

```typescript
import { XToOpenApi, CurlAdapter, PostmanAdapter } from "@powerduck/x-to-openapi";

const converter = new XToOpenApi()
  .register(new CurlAdapter())
  .register(new PostmanAdapter());

// "auto" picks the first adapter whose canHandle(input) returns true.
const result = await converter.convert("auto", postmanCollectionOrCurlText);
```

## 4. Diagnósticos e modo estrito

Por padrão, a conversão reúne os problemas em entradas [`Diagnostic`](/docs/pt-BR/x-to-openapi/api-reference/) e ainda retorna um resultado. Defina `strict: true` para lançar uma [`ConversionError`](/docs/pt-BR/x-to-openapi/api-reference/#conversionerror) no primeiro diagnóstico com nível de erro.

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

## Próximos passos

- [Exemplos](/docs/pt-BR/x-to-openapi/examples/) — Comandos curl em lote, inferência de parâmetros de caminho, autenticação Postman e um adaptador personalizado.
- [Referência da API](/docs/pt-BR/x-to-openapi/api-reference/) — Todas as exportações, opções e códigos de diagnóstico.
