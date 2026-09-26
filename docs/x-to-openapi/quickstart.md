---
sidebar_position: 3
title: "Quickstart"
description: "Get started with @powerduck/x-to-openapi: convert a real curl command, a Postman Collection, and register a custom adapter on the XToOpenApi class."
keywords: ["x-to-openapi quickstart", "curlToOpenApi", "postmanToOpenApi", "XToOpenApi", "custom adapter"]
---

# Quickstart

This quickstart covers the three most common paths: the `curlToOpenApi` helper, the `postmanToOpenApi` helper, and the `XToOpenApi` class for custom wiring.

Prerequisite: [install the package](./installation.md).

:::note
All conversion functions are **async** and return a [`ConvertResult`](./api-reference.md#convertresult). Always `await` them.
:::

---

## 1. Convert a curl command

Pass a single curl command to [`curlToOpenApi`](./api-reference.md#curltoopenapi). The result's `document` is the generated OpenAPI 3.2 object.

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  `curl -X POST https://api.example.com/users \
    -H 'Content-Type: application/json' \
    --data '{"name":"Ada","age":36}'`,
);

console.log(JSON.stringify(result.document, null, 2));
```

The generated document looks like this (trimmed):

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

Check whether conversion succeeded and inspect diagnostics:

```typescript
if (!result.ok) {
  for (const d of result.diagnostics) {
    console.error(`[${d.severity}] ${d.code}: ${d.message}`);
  }
}
console.log("Document valid:", result.documentValid);
```

---

## 2. Convert a Postman Collection

Pass a parsed collection object (or a JSON string) to [`postmanToOpenApi`](./api-reference.md). Test scripts are preserved as `x-postman-scripts`.

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
console.log(result.document.paths["/users/{userId}"]?.get?.["x-postman-scripts"]);
```

A JSON string also works:

```typescript
const fromText = await postmanToOpenApi('{"info":{"name":"API"},"item":[]}');
```

---

## 3. Use the `XToOpenApi` class with custom options

Use the class when you want explicit control over registered adapters and [`ConvertOptions`](./api-reference.md#convertoptions).

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

### Register multiple adapters and use `"auto"`

```typescript
import { XToOpenApi, CurlAdapter, PostmanAdapter } from "@powerduck/x-to-openapi";

const converter = new XToOpenApi()
  .register(new CurlAdapter())
  .register(new PostmanAdapter());

// "auto" picks the first adapter whose canHandle(input) returns true.
const result = await converter.convert("auto", postmanCollectionOrCurlText);
```

---

## 4. Diagnostics and strict mode

By default, conversion collects problems as [`Diagnostic`](./api-reference.md) entries and still returns a result. Set `strict: true` to throw a [`ConversionError`](./api-reference.md#conversionerror) on the first error-severity diagnostic.

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

---

## Next steps

- [Examples](./examples.md) — batch curl, path parameter inference, Postman auth, and a custom adapter.
- [API reference](./api-reference.md) — every export, option, and diagnostic code.
