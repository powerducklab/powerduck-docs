---
sidebar_position: 3
title: "Quickstart"
description: "First steps with @powerduck/openapi-mcp-server: the openapi-mcp serve CLI, programmatic buildMcpServer + startStdioServer, and startAdminServer with the Web console."
keywords: ["quickstart", "openapi-mcp", "serve", "buildMcpServer", "startStdioServer", "startAdminServer"]
---

# Quickstart

Three ways to run: the CLI (web console), a programmatic stdio server, or the embedded admin server.

## 1. CLI — web mode with admin UI

```bash
openapi-mcp serve \
  --transport web \
  --port 3000 \
  --host 127.0.0.1 \
  --api-key your-admin-key
```

Open `http://127.0.0.1:3000` to upload or paste an OpenAPI document, inspect the generated tools/prompts/resources, and watch request logs. MCP clients connect to `/mcp` (Streamable HTTP) or `/sse` (legacy).

## 2. CLI — stdio mode

```bash
openapi-mcp serve \
  --transport stdio \
  --spec ./openapi.yaml \
  --base-url https://api.example.com
```

`--spec` is required in stdio mode. The process speaks MCP over stdin/stdout.

## 3. Programmatic — stdio server

```typescript
import { loadOpenApiSpec, startStdioServer } from "@powerduck/openapi-mcp-server";

const spec = await loadOpenApiSpec("./openapi.yaml");

const handle = await startStdioServer(
  spec,
  { baseUrlOverride: "https://api.example.com" }, // ExecutionContext
  { handleSignals: true },
);

await handle.closed; // resolves when the peer closes stdin
```

## 4. Programmatic — build a server you control

```typescript
import { buildMcpServer, attachSseRoutes } from "@powerduck/openapi-mcp-server";
import express from "express";

// specProvider returns the active document (or null); contextProvider returns
// the per-call ExecutionContext (base URL override, security, timeouts, logs).
const server = buildMcpServer(
  () => spec,
  () => ({ baseUrlOverride: "https://api.example.com" }),
  { name: "my-api", version: "1.0.0" },
);

const app = express();
app.use(express.json());
attachSseRoutes(
  app,
  () => spec,
  () => ({ baseUrlOverride: "https://api.example.com" }),
);
app.listen(3000);
```

> For the fuller `attachMcpRoutes(app, options)` handle (with `maxSessions`,
> `allowedOrigins`, `sessionIdleMs`, `listSessions`, `closeSession`, etc.),
> import from the transport module directly. It is the same function that powers
> the admin server.

## 5. Admin server with auth

```typescript
import { startAdminServer } from "@powerduck/openapi-mcp-server/server";

const handle = await startAdminServer({
  port: 3000,
  host: "127.0.0.1",
  apiKey: "your-admin-key",
  specPath: "./openapi.yaml",
});

console.log("admin on", handle.port);
await handle.close();
```

## What's next

- [Configuration](./configuration) — the full `ServerConfig`.
- [Examples](./examples) — more programmatic recipes.
- [API Reference](./api-reference) — every export.
