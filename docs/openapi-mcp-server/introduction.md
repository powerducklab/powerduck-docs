---
sidebar_position: 1
title: "Introduction"
description: "Production-oriented OpenAPI to MCP server from @powerduck/openapi-mcp-server: automatic Tools, Prompts and Resources generation, a built-in Web admin console, stdio and web transports, and the openapi-mcp CLI."
keywords: ["openapi-mcp-server", "mcp", "model context protocol", "openapi", "tools", "prompts", "resources", "admin ui", "introduction"]
---

# @powerduck/openapi-mcp-server Introduction

`@powerduck/openapi-mcp-server` converts an OpenAPI document into a running MCP (Model Context Protocol) service. It generates **Tools** from operations, **Prompts** from the API's metadata and operations, and **Resources** from the API catalog, then serves them over the MCP protocol with a built-in admin Web UI.

- **Package name:** `@powerduck/openapi-mcp-server`
- **Version:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-mcp-server"/>
- **License:** MIT
- **Node engine:** `>=22.12.0`
- **CLI binary:** `openapi-mcp`
- **Module format:** dual ESM and CommonJS builds with bundled type declarations.

It is built on `@powerduck/openapi-parser` for validation and dereferencing and on `@modelcontextprotocol/sdk` for the protocol.

## What it generates

- **Tools** — one MCP tool per OpenAPI operation, with full parameter serialization (path/query/header/cookie styles and explode rules), request-body encoding (JSON, form-urlencoded, multipart, text, binary), and MCP tool annotations (`readOnlyHint`, `destructiveHint`, `idempotentHint`).
- **Prompts** — global prompts (`spec_overview`, `integration_guardrails`) plus per-operation prompts (`explain_*`, `plan_*`, `sample_*`).
- **Resources** — fixed catalog resources such as `openapi://spec/summary`, `openapi://catalog/tools`, `openapi://spec/document`.

## Transports

- **stdio** — `startStdioServer()` serves one document to a local MCP client (Claude Desktop, editor integrations).
- **web (HTTP)** — `attachMcpRoutes(app, options)` mounts Streamable HTTP at `/mcp` and optional legacy SSE at `/sse` on your Express app. Its options control session limits, idle timeouts, CORS and DNS-rebinding protection. `startAdminServer()` adds the admin UI and uses the transport with its default session limits. `attachSseRoutes()` remains a deprecated positional wrapper.

## Admin runtime

`startAdminServer()` starts an Express app that serves:

- the Web admin console (upload/paste a spec, inspect tools/prompts/resources, view running services and request logs),
- the MCP HTTP transports,
- API-key authentication, request logging with sensitive-header redaction, and optional state persistence.

## Installation

```bash npm2yarn2pnpm
npm install @powerduck/openapi-mcp-server
```

## Quick start

```bash
openapi-mcp serve --transport web --port 3000 --api-key your-admin-key
```

## Next steps

- [Installation](../installation/) — npm/yarn/pnpm, global install, the `./server` subpath and dependencies.
- [Quickstart](../quickstart/) — CLI and programmatic usage.
- [Configuration](../configuration/) — the complete `ServerConfig`.
- [API Reference](../api-reference/) — every export and CLI command.
- [Examples](../examples/) — recipes.

## License

MIT.
