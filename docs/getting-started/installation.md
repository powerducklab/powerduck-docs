---
sidebar_position: 2
title: "Installation"
description: "Install Powerduck libraries via npm, yarn, or pnpm. Learn about peer dependencies, subpath exports, CLI binaries, and environment requirements."
keywords: ["installation", "npm", "yarn", "pnpm", "Powerduck", "setup", "peer dependencies"]
---

# Installation

All Powerduck libraries are published to the npm registry under the `@powerduck` scope. Install them with your preferred package manager.

## Package Managers

### npm

```bash
npm install @powerduck/md-editor
npm install @powerduck/conf-patch
npm install @powerduck/openapi-cli
npm install @powerduck/openapi-codegen
npm install @powerduck/openapi-mcp-server
npm install @powerduck/openapi-request
npm install @powerduck/x-to-openapi
```

### yarn

```bash
yarn add @powerduck/md-editor
yarn add @powerduck/conf-patch
yarn add @powerduck/openapi-cli
yarn add @powerduck/openapi-codegen
yarn add @powerduck/openapi-mcp-server
yarn add @powerduck/openapi-request
yarn add @powerduck/x-to-openapi
```

### pnpm

```bash
pnpm add @powerduck/md-editor
pnpm add @powerduck/conf-patch
pnpm add @powerduck/openapi-cli
pnpm add @powerduck/openapi-codegen
pnpm add @powerduck/openapi-mcp-server
pnpm add @powerduck/openapi-request
pnpm add @powerduck/x-to-openapi
```

## Environment Requirements

| Library | Node.js | Browser | Notes |
|---------|---------|---------|-------|
| @powerduck/md-editor | — | Yes | Browser-only. Requires a DOM environment. |
| @powerduck/conf-patch | >= 18 | Core only | File layer requires Node.js/Electron. Core subpath works in browsers. |
| @powerduck/openapi-cli | >= 18.17 | No | CLI tool. Install globally for command-line use. |
| @powerduck/openapi-codegen | >= 18 | Yes | Fully browser-compatible. Zero runtime dependencies. |
| @powerduck/openapi-mcp-server | >= 20.11 | No | Server runtime. Requires Node.js for stdio and HTTP transports. |
| @powerduck/openapi-request | >= 18 | Partial | Core and HTTP adapter work in browsers. gRPC requires Node.js. |
| @powerduck/x-to-openapi | >= 18 | Yes | Fully browser-compatible. |

## Global CLI Installation

For the command-line tools, install globally:

```bash
# OpenAPI CLI - batch test OpenAPI documents
npm install -g @powerduck/openapi-cli

# OpenAPI MCP Server - serve OpenAPI specs as MCP tools
npm install -g @powerduck/openapi-mcp-server
```

After global installation, the following binaries are available on your `PATH`:

- `openapi-cli` — from `@powerduck/openapi-cli`
- `openapi-mcp` — from `@powerduck/openapi-mcp-server`

## Subpath Exports

Several libraries offer subpath exports for tree-shaking and environment-specific imports.

### @powerduck/md-editor

```typescript
// Main entry (vanilla JS class + standalone render API)
import { MarkdownEditor, renderMarkdown } from "@powerduck/md-editor";

// React component (separate subpath; does not force react on non-React consumers)
import { MarkdownEditorReact } from "@powerduck/md-editor/react";

// Editor stylesheet (required for visual rendering)
import "@powerduck/md-editor/dist/style.css";

// CSS design tokens (optional, for theming)
import "@powerduck/md-editor/styles/tokens.css";
```

### @powerduck/conf-patch

```typescript
// Full library (core + file layer with atomic writes and locking)
import { setConfigValue, patchConfigFile } from "@powerduck/conf-patch";

// Browser-safe core only (pure string patching, no filesystem access)
import { patchContent, setContentValue, deleteContentValue } from "@powerduck/conf-patch/core";
```

### @powerduck/openapi-request

```typescript
// Main entry (all protocols + core APIs)
import { createClient, createDebugger, createManualSession } from "@powerduck/openapi-request";

// Protocol-specific subpaths
import { HttpAdapter } from "@powerduck/openapi-request/http";
import { WebSocketAdapter } from "@powerduck/openapi-request/ws";
import { GrpcAdapter } from "@powerduck/openapi-request/grpc";
import { McpAdapter } from "@powerduck/openapi-request/mcp";
import { GraphQLAdapter } from "@powerduck/openapi-request/graphql";
```

### @powerduck/openapi-mcp-server

```typescript
// Main entry (library API: tool generation, MCP server building, spec loading)
import { buildMcpServer, generateTools, loadOpenApiSpec } from "@powerduck/openapi-mcp-server";

// Admin web server (separate subpath)
import { startAdminServer } from "@powerduck/openapi-mcp-server/server";
```

## Peer Dependencies

Some libraries require peer dependencies for specific features. Install them only when you use the corresponding functionality.

| Library | Peer Dependency | Required For |
|---------|----------------|--------------|
| @powerduck/md-editor | react, react-dom | The `@powerduck/md-editor/react` subpath only. |
| @powerduck/openapi-request | @grpc/grpc-js, @grpc/proto-loader | gRPC protocol adapter and reflection. |
| @powerduck/openapi-request | @modelcontextprotocol/sdk | MCP protocol adapter. |

## ESM and CommonJS

All libraries ship both ESM (`import`) and CommonJS (`require`) builds. The correct format is selected automatically based on your project's module system.

```typescript
// ESM
import { generate } from "@powerduck/openapi-codegen";

// CommonJS
const { generate } = require("@powerduck/openapi-codegen");
```

## TypeScript

All libraries include TypeScript type definitions in their npm packages. No `@types/*` packages are needed. For subpath exports to resolve correctly, set `"moduleResolution": "bundler"` (or `"node16"`/`"nodenext"`) in your `tsconfig.json`.

## Verifying Installation

```bash
# Check the installed version
npm list @powerduck/openapi-codegen

# Verify the API is accessible (Node.js ESM)
node --input-type=module -e "
import { list } from '@powerduck/openapi-codegen';
console.log('Available generators:', list().length);
"
```

## Next Steps

- [Quick Start](./quickstart) — Jump into runnable code examples.
- Read the [MD Editor](../md-editor/introduction) or [OpenAPI Codegen](../openapi-codegen/introduction) guide.
