---
sidebar_position: 2
title: "Installation"
description: "Installing @powerduck/openapi-mcp-server v1.3.0 via npm/yarn/pnpm or globally, the openapi-mcp CLI, the ./server subpath, Node >=20.11, and its runtime dependencies."
keywords: ["installation", "openapi-mcp", "cli", "global install", "subpath", "modelcontextprotocol"]
---

# Installation

## Requirements

- **Node.js `>=20.11`** (declared in `engines`).

## Install

```bash npm2yarn2pnpm
npm install @powerduck/openapi-mcp-server
```

Yarn:

```bash
yarn add @powerduck/openapi-mcp-server
```

pnpm:

```bash
pnpm add @powerduck/openapi-mcp-server
```

## CLI

The package registers the `openapi-mcp` binary.

```bash
# global install
npm install -g @powerduck/openapi-mcp-server

# or run without installing
npx openapi-mcp --help
```

The CLI has a single `serve` command (see [Quickstart](./quickstart.md)).

## ESM / CommonJS

Dual builds with bundled type declarations. No extra `@types/*` are required:

```javascript
// ESM
import { buildMcpServer, startStdioServer } from "@powerduck/openapi-mcp-server";

// CommonJS
const { buildMcpServer, startStdioServer } = require("@powerduck/openapi-mcp-server");
```

## Subpath export

| Import | Contents |
| --- | --- |
| `@powerduck/openapi-mcp-server` | Core library: spec loading, tool/prompt/resource generation, request execution, MCP server builder, stdio and HTTP transports. |
| `@powerduck/openapi-mcp-server/server` | The admin HTTP server and auth middleware (`startAdminServer`, `createAuthMiddleware`). |

## Dependencies

These are installed automatically with the package:

- `@modelcontextprotocol/sdk` — MCP protocol implementation.
- `@powerduck/openapi-parser` — OpenAPI validation, dereferencing and upgrade.
- `express` and `cors` — admin HTTP server and CORS.
- `axios` — upstream HTTP client for tool execution.
- `commander` — CLI framework.
- `js-yaml` — YAML parsing.
- `multer` — spec upload handling.
- `terser` — minification of embedded Web UI assets.

## Verify

```bash
npx openapi-mcp --help
```

## Next steps

- [Quickstart](./quickstart.md)
- [Configuration](./configuration.md)
