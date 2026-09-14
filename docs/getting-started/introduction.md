---
sidebar_position: 1
title: Introduction
description: "Powerduck is a suite of high-performance OpenAPI tooling and embeddable components for developers."
---

# Introduction

Powerduck provides a suite of production-grade libraries for working with OpenAPI documents, building API tooling, and embedding rich components into your applications.

## What is Powerduck?

Powerduck is a collection of open-source libraries designed to make API development faster, more reliable, and more enjoyable. Whether you're building API documentation, testing tools, code generators, or MCP servers, Powerduck has a library for you.

## Libraries Overview

| Library | Description | Latest Version |
|---------|-------------|----------------|
| [@powerduck/md-editor](/md-editor/introduction) | Embeddable Markdown editor with math, mindmaps, and code highlighting | 0.11.2 |
| [@powerduck/conf-patch](/conf-patch/introduction) | Two-layer configuration editor with OpenAPI validation and atomic writes | 0.3.4 |
| [@powerduck/openapi-cli](/openapi-cli/introduction) | CI-ready CLI for batch-testing OpenAPI across 6 protocols | 0.2.3 |
| [@powerduck/openapi-codegen](/openapi-codegen/introduction) | Generate runnable HTTP code from OpenAPI (21 languages) | 0.5.3 |
| [@powerduck/openapi-mcp-server](/openapi-mcp-server/introduction) | Turn OpenAPI specs into production MCP servers with Web UI | 1.3.0 |
| [@powerduck/openapi-request](/openapi-request/introduction) | OpenAPI 3.2 collection debugger with HTTP/SSE/WebSocket | 0.2.4 |
| [@powerduck/x-to-openapi](/x-to-openapi/introduction) | Convert cURL commands and Postman collections to OpenAPI 3.2 | 0.2.2 |

## Key Features

- **Production-grade**: All libraries are battle-tested with comprehensive test suites (100%+ coverage).
- **TypeScript-first**: Full TypeScript support with accurate type definitions.
- **Browser-compatible**: Core libraries work in both Node.js and browser environments.
- **Zero dependencies**: Minimal external dependencies for fast installation and small bundle sizes.
- **MIT licensed**: Free to use in personal and commercial projects.

## Quick Start

```bash
# Install any Powerduck library
npm install @powerduck/openapi-codegen
```

```typescript
import { generate, list } from "@powerduck/openapi-codegen";

// List all supported language/client combinations
console.log(list());

// Generate code from an OpenAPI document
const code = generate({
  document: openApiDoc,
  path: "/users/{id}",
  method: "get",
  language: "python",
  client: "requests",
});

console.log(code);
```

## Community

- **GitHub**: [https://github.com/powerducklab](https://github.com/powerducklab)
- **Website**: [https://www.powerduck.com](https://www.powerduck.com)
- **Contact**: [contact@neatico.com](mailto:contact@neatico.com)

## License

All Powerduck libraries are released under the [MIT License](https://opensource.org/licenses/MIT).
