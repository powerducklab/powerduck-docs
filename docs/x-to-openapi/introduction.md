---
sidebar_position: 1
title: "Introduction"
description: "Overview of @powerduck/x-to-openapi v0.2.2 — an extensible TypeScript framework that converts curl commands and Postman Collections into valid OpenAPI 3.2 documents via a plugin adapter architecture."
keywords: ["x-to-openapi", "curl", "postman", "OpenAPI 3.2", "converter", "adapter", "Reverse engineering"]
---

# @powerduck/x-to-openapi

**@powerduck/x-to-openapi** is a production-grade, extensible TypeScript framework that converts source formats — **curl commands** and **Postman Collections (v2.0 / v2.1.0)** — into valid **OpenAPI 3.2** documents. It is built for CI pipelines, API documentation generation, and reverse-engineering HTTP traffic.

It is also the **canonical source of truth for OpenAPI types and validation** used by every other `@powerduck/*` library (`@powerduck/openapi-request`, `@powerduck/cli`, and friends).

- **Version:** `0.2.0`
- **License:** MIT
- **Node.js requirement:** `>= 18.0.0`
- **Output:** OpenAPI **3.2.0** only
- **Source:** [github.com/powerducklab/x-to-openapi](https://github.com/powerducklab/x-to-openapi)

---

## What it does

```
 curl command ─┐
                ├─►  CurlAdapter   ─┐
                │                    │
 Postman collection ─► PostmanAdapter ─► NormalizedRequest[]
                                     │
                                     ▼
                          buildOpenApi32()  ─►  OpenAPI 3.2 document
                                     │
                                     ▼
                          validateOpenApi32()  ─►  diagnostics
```

1. An **adapter** parses a source (curl text, a Postman collection) into a list of [`NormalizedRequest`](./api-reference#normalizedrequest) objects.
2. The **builder** merges requests by method + path, infers schemas, path parameters, and security, and produces an OpenAPI 3.2 document.
3. The **validator** checks the output against the OpenAPI schema (via `@powerduck/openapi-parser`) and reports diagnostics.

---

## Features

- **Two built-in adapters** — [`CurlAdapter`](./api-reference#curladapter) (single, batch, and browser "Copy all as cURL" output) and [`PostmanAdapter`](./api-reference#postmanadapter) (v2.0/v2.1.0, nested folders, auth inheritance).
- **Zero-config helpers** — [`curlToOpenApi`](./api-reference#curltoopenapi) and [`postmanToOpenApi`](./api-reference) register an adapter and convert in one call.
- **OpenAPI 3.2 output** — every generated document is `openapi: "3.2.0"` and validated.
- **Multi-request merging** — same method+path operations are combined; query/header/cookie params and body schemas are structurally merged.
- **Path parameter inference** — numeric IDs, UUIDs, ULIDs, and long hex segments are templated (`/users/{userId}`) when they vary across at least N samples.
- **Security inference** — Bearer, Basic, and API key (header/query/cookie) detection with proper `securitySchemes`.
- **All body types** — JSON, XML, form-urlencoded, multipart/form-data (text + file), GraphQL, text, binary.
- **Postman test-script preservation** — `pm.test()` / `pm.expect()` are emitted as `x-postman-scripts` on each operation.
- **Diagnostics** — every issue carries a severity, code, and source index; [`strict`](./api-reference#convertoptions) mode throws on errors.
- **Extensible** — implement [`SourceAdapter`](./api-reference) to add HAR, HTTPie, or Insomnia sources.

---

## Plugin architecture

The framework is built around a tiny adapter interface:

```typescript
interface SourceAdapter<I = unknown> {
  readonly id: string;                       // e.g. "curl", "postman", "har"
  canHandle?(input: unknown): boolean;       // used by "auto" detection
  parse(input: I, context: AdapterContext): Promise<NormalizedRequest[]>;
}
```

Adapters are registered on an [`XToOpenApi`](./api-reference#xtoopenapi) instance through an [`AdapterRegistry`](./api-reference#adapterregistry):

```typescript
const converter = new XToOpenApi()
  .register(new CurlAdapter())
  .register(new PostmanAdapter());

// Explicit source id:
await converter.convert("curl", curlText);

// Auto-detect via canHandle():
await converter.convert("auto", someInput);
```

The two built-in adapters are pre-wired into the zero-config helpers, so most users never touch the registry directly.

---

## When to use the helpers vs. the class

| Use case | API |
|---|---|
| Convert one curl command or a batch | [`curlToOpenApi`](./api-reference#curltoopenapi) |
| Convert one Postman collection object/string | [`postmanToOpenApi`](./api-reference) |
| Custom options, multiple adapters, `"auto"` detection, or a custom adapter | [`new XToOpenApi()`](./api-reference#xtoopenapi) |

---

## Next steps

- [Installation](./installation) — add the package and understand the zero-config helpers.
- [Quickstart](./quickstart) — convert a real curl command, a Postman collection, and a custom adapter.
- [API reference](./api-reference) — every export, type, option, default, and diagnostic code.
- [Examples](./examples) — basic curl, batch commands, Postman collections, custom adapters, and path inference.
