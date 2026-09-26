---
sidebar_position: 1
title: "Introduction"
description: "Upgrade any Swagger 2.0 / OpenAPI 3.0 / 3.1 / 3.2 document to a validated OpenAPI 3.2 document. Zero input mutation, machine-readable error codes, circular-reference guard, dual ESM/CJS."
keywords: ["openapi-parser", "powerduck", "Swagger", "OpenAPI 3.2", "upgrade", "validate", "introduction"]
---

# @powerduck/openapi-parser

Upgrade any OpenAPI document — Swagger 2.0, OpenAPI 3.0, 3.1, or 3.2 — to
OpenAPI 3.2, in one call.

A thin wrapper over [`@scalar/openapi-parser`](https://github.com/scalar/openapi-parser)
and [`@scalar/openapi-upgrader`](https://github.com/scalar/openapi-parser/tree/main/packages/openapi-upgrader).
It does not reimplement parsing, validation, or upgrading; it wires them
together and gives every failure a single, predictable shape with a
machine-readable error code.

- **Package name:** `@powerduck/openapi-parser`
- **Version:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-parser"/>
- **License:** MIT
- **Node.js:** >= 18

## Features

- **One function, every version** — Swagger 2.0, OpenAPI 3.0.x, 3.1.x, and 3.2.x all upgrade to a validated 3.2 document.
- **JSON and YAML string input** — Pass a pre-parsed object or a raw JSON/YAML string.
- **Machine-readable error codes** — Every failure surfaces an `OpenApiUpgradeError` with a `UpgradeErrorCode` enum value.
- **Zero input mutation** — The input is deep-copied (via `structuredClone`) before any upgrade stage runs.
- **Circular-reference guard** — Detects cyclic input before it can cause stack overflows.
- **Output validation** — The upgraded 3.2 document is schema-validated by default.
- **Dual ESM + CJS** — `import` in modern Node and bundlers, `require()` in Electron main.

## Next steps

- [Installation](./installation.md) — install and requirements
- [Quickstart](./quickstart.md) — upgrade your first document
- [API Reference](./api-reference.md) — every export, error code, and option
- [Examples](./examples.md) — error handling, options, and CommonJS usage
