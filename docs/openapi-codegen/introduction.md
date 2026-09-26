---
sidebar_position: 1
title: Introduction
description: "Generate runnable HTTP request examples from OpenAPI documents with @powerduck/openapi-codegen: 21 languages, 41 clients, browser-compatible, zero runtime dependencies."
---

# Introduction

`@powerduck/openapi-codegen` is a TypeScript library that turns an
OpenAPI operation into **runnable HTTP request example code** in your choice of
language and HTTP client. It is designed for API documentation sites, developer
portals, API explorers, CLI tools, and build-time code generation.

It supports **21 languages** and **41 language/client combinations**, is
**browser-compatible**, and has **zero runtime dependencies**.

## Why openapi-codegen

- **Zero runtime dependencies** — works in the browser, Node.js, Electron, and
  edge runtimes with no Node built-ins required.
- **Dual module support** — native ESM and CommonJS (`require()`) builds.
- **OpenAPI 3.0 / 3.1 / 3.2** — parses a parsed document object; JSON and YAML
  input are both supported by parsing them before calling `generate()`.
- **41 built-in generators** across 21 languages, registered automatically on
  import.
- **Full parameter serialization** — path, query, header, and cookie parameters
  with the OpenAPI `style` / `explode` / `allowReserved` rules.
- **Security schemes** — API key (header/query/cookie), HTTP bearer, and HTTP
  basic.
- **Body types** — JSON, plain text, URL-encoded form, and `multipart/form-data`.
- **`$ref` resolution** — in-document JSON Pointer references with caching,
  chaining, and circular-reference detection.
- **Automatic examples** — infers example values from JSON Schema
  (`example`, `enum`, `default`, types, formats, constraints).
- **Plugin system** — register custom generators via `register()` or `use()`.

## How it works

```
OpenAPI document  ──normalize──▶  RequestIR  ──generator.generate()──▶  source code string
```

1. `normalize` resolves `$ref`s, merges path- and operation-level parameters,
   picks a request body media type, generates example values, resolves security
   schemes, and produces a normalized `RequestIR`.
2. The selected `Generator` receives the `RequestIR` and returns a string of
   runnable source code.

You usually call the single entry point `generate({...})`, which performs both
steps for you.

## Quick mental model

```typescript
import { generate } from "@powerduck/openapi-codegen";

const code = generate({
  document,                 // parsed OpenAPI object
  path: "/users/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
});

console.log(code);          // a runnable fetch() snippet
```

## Next steps

- [Installation](./installation.md) — npm / yarn / pnpm and browser use.
- [Quick Start](./quickstart.md) — generate your first snippet and list generators.
- [Configuration](./configuration.md) — `GenerateOptions`, `RequestIR`, `Generator`, `Plugin`.
- [API Reference](./api-reference.md) — every export and the full language/client list.
- [Examples](./examples.md) — fetch, Python requests, cURL, custom generators, plugins, direct `RequestIR`.
