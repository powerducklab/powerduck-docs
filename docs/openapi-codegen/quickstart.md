---
sidebar_position: 3
title: Quick Start
description: "Generate your first runnable request example with @powerduck/openapi-codegen and list the available generators."
---

# Quick Start

This guide generates your first runnable request example and discovers the
available generators.

## 1. Install

```bash npm2yarn2pnpm
npm install @powerduck/openapi-codegen
```

## 2. Generate from a document

Pass a **parsed** OpenAPI document plus the target `path`, `method`,
`language`, and `client`. `generate()` returns the source code as a string.

```typescript
import { generate } from "@powerduck/openapi-codegen";
import document from "./openapi.json" with { type: "json" };

const code = generate({
  document,
  path: "/pets/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
});

console.log(code);
```

CommonJS equivalent:

```javascript
const { generate } = require("@powerduck/openapi-codegen");
const fs = require("node:fs");

const document = JSON.parse(fs.readFileSync("./openapi.json", "utf8"));

const code = generate({
  document,
  path: "/pets",
  method: "post",
  language: "python",
  client: "requests",
});

console.log(code);
```

## 3. List available generators

`list()` returns every registered generator descriptor:

```typescript
import { list } from "@powerduck/openapi-codegen";

for (const { language, client } of list()) {
  console.log(`${language}/${client}`);
}
```

Each descriptor is `{ language: string; client: string }`. The identifiers are
case-sensitive; use them exactly as shown in the
[API reference generator list](./api-reference.md#built-in-generators-21-languages-41-clients).

You can select one programmatically:

```typescript
import { generate, list } from "@powerduck/openapi-codegen";

const picked = list().find(
  (g) => g.language === "javascript" && g.client === "fetch",
);

if (!picked) throw new Error("Generator not available");

const code = generate({
  document,
  path: "/pets",
  method: "get",
  language: picked.language,
  client: picked.client,
});
```

## 4. Provide credentials

Use `securityValues` to fill in named security schemes. Keys must match the
security scheme names in the document:

```typescript
const code = generate({
  document,
  path: "/pets/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
  securityValues: {
    bearerAuth: "YOUR_ACCESS_TOKEN",
    apiKey: "YOUR_API_KEY",
  },
});
```

## 5. Override the server URL

```typescript
const code = generate({
  document,
  path: "/pets",
  method: "get",
  language: "shell",
  client: "curl",
  serverUrl: "https://staging.example.com/v1",
});
```

## Error handling

`generate()` throws for missing input or unsupported generators. Wrap calls when
processing untrusted documents:

```typescript
try {
  const code = generate({
    document,
    path: "/pets/{id}",
    method: "get",
    language: "javascript",
    client: "fetch",
  });
  console.log(code);
} catch (error) {
  console.error("Generation failed:", error instanceof Error ? error.message : error);
}
```

## What's next?

- [Configuration](./configuration.md) — `GenerateOptions`, `RequestIR`, `Generator`, `Plugin`.
- [Examples](./examples.md) — JavaScript fetch, Python requests, cURL, custom generator, plugin, direct `RequestIR`.
- [API Reference](./api-reference.md) — every export.
