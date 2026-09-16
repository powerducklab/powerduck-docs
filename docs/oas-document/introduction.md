---
sidebar_position: 1
title: "Introduction"
description: "Production-grade OpenAPI documentation component for React. Pass an OAS document and get a full Stripe-style API documentation UI with tree navigation, scroll-spy, schema exploration, and multi-language code examples."
keywords: ["oas-document", "powerduck", "React", "API docs", "OpenAPI", "introduction"]
---

# @powerduck/oas-document

Production-grade OpenAPI documentation component for React. Pass an OAS
document and get a full Stripe-style API documentation UI with header
navigation, light/dark themes, tree navigation, scroll-spy, schema
exploration, and multi-language code examples.

- **Package name:** `@powerduck/oas-document`
- **Version:** <img src="https://img.shields.io/npm/v/@powerduck/oas-document"/>
- **License:** MIT

Built on `@powerduck/openapi-parser` (validation + auto-upgrade),
`@powerduck/tree` (navigation), `@powerduck/md-editor` (Markdown rendering),
and `@powerduck/openapi-codegen` (request code generation).

## Features

- **Drop-in API documentation** — accepts a parsed object, JSON string, or YAML string
- **Stripe-style layout** — configurable header, sidebar tree, two-column operation view
- **Light / dark themes** — toggle in the header, persisted to localStorage
- **Auto-upgrade to OAS 3.2** — validates and upgrades via `@powerduck/openapi-parser`
- **Scroll-spy navigation** — passive scroll listener with binary search
- **Markdown rendering** — descriptions rendered via `@powerduck/md-editor`
- **Multi-language code examples** — generated via `@powerduck/openapi-codegen`
- **Schema exploration** — nested property tables with expand/collapse
- **Responsive** — sidebar collapses to overlay on mobile

## Next steps

- [Installation](./installation)
- [Quickstart](./quickstart)
- [API Reference](./api-reference)
- [Examples](./examples)
