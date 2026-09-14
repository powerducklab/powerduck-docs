---
sidebar_position: 6
title: "Examples"
description: "Examples for @powerduck/openapi-mcp-server: CLI web serve, programmatic stdio server, admin server with API-key auth, a custom SpecProvider, and generating tools from a spec."
keywords: ["examples", "openapi-mcp", "stdio", "admin server", "auth", "generateTools"]
---

# Examples

## 1. CLI — web transport with the admin UI

```bash
openapi-mcp serve \
  --transport web \
  --port 3000 \
  --host 127.0.0.1 \
  --api-key your-admin-key \
  --spec ./openapi.yaml \
  --base-url https://api.example.com
```

The admin console is served at `/`, the Streamable HTTP MCP endpoint at `/mcp`, and the legacy SSE endpoint at `/sse`.

## 2. Programmatic — stdio server

```typescript
import { loadOpenApiSpec, startStdioServer } from "@powerduck/openapi-mcp-server";

const spec = await loadOpenApiSpec("./openapi.yaml");

const handle = await startStdioServer(
  spec,
  {
    baseUrlOverride: "https://api.example.com",
    security: { bearerToken: process.env.UPSTREAM_TOKEN },
    requestTimeoutMs: 10000,
  },
  { handleSignals: true },
);

console.error("stdio MCP server ready");
await handle.closed;
```

## 3. Admin server with API-key auth

```typescript
import { startAdminServer } from "@powerduck/openapi-mcp-server/server";

const handle = await startAdminServer({
  port: 3000,
  host: "127.0.0.1",
  apiKey: process.env.ADMIN_API_KEY,
  specPath: "./openapi.yaml",
  allowedOrigins: ["https://your-console.example.com"],
  redactSensitiveHeaders: true,
  maxLogEntries: 500,
});

console.log("admin listening on", handle.port);
// ...
await handle.close();
```

## 4. Custom SpecProvider and context provider

Build the MCP server by hand and mount it on your own Express app:

```typescript
import express from "express";
import {
  buildMcpServer,
  attachSseRoutes,
  loadOpenApiSpec,
} from "@powerduck/openapi-mcp-server";

let spec = await loadOpenApiSpec("./openapi.yaml");

// A provider that can be swapped at runtime without restarting sessions.
const specProvider = () => spec;
const contextProvider = () => ({
  baseUrlOverride: "https://api.example.com",
  security: { bearerToken: process.env.UPSTREAM_TOKEN },
});

const app = express();
app.use(express.json());

attachSseRoutes(app, specProvider, contextProvider);

app.listen(8080, () => console.log("mcp on :8080/mcp"));
```

> For session limits, CORS origins, idle reaping, and the fuller route handle
> (`listSessions`, `closeSession`, `closeAll`), use [`startAdminServer`](./api-reference#admin-server-and-auth-server-subpath)
> which wraps `attachMcpRoutes` with all of those options. `attachMcpRoutes`
> itself is an internal implementation detail and is not exported from the
> package root.

## 5. Generate tools, prompts and resources from a spec

```typescript
import {
  loadOpenApiSpec,
  generateTools,
  generateToolsDetailed,
  buildBindingIndex,
  generatePrompts,
  generateResources,
  executeToolCall,
} from "@powerduck/openapi-mcp-server";

const spec = await loadOpenApiSpec("./openapi.yaml");

const tools = generateTools(spec);
console.log(tools.map((t) => t.name));

const detailed = generateToolsDetailed(spec);
console.log("issues:", detailed.issues);

const bindings = buildBindingIndex(spec); // toolName -> ToolBinding

console.log(generatePrompts(spec).map((p) => p.name));
console.log(generateResources(spec).map((r) => r.uri));

// Execute one generated tool directly.
const result = await executeToolCall(
  spec,
  "get_user",
  { id: "42" },
  { baseUrlOverride: "https://api.example.com" },
);
console.log(result.status, result.data);
```

## 6. Use auth middleware in your own Express app

```typescript
import express from "express";
import { createAuthMiddleware } from "@powerduck/openapi-mcp-server/server";

const app = express();
app.use("/admin", createAuthMiddleware(process.env.ADMIN_API_KEY));
app.get("/admin/status", (req, res) => res.json({ ok: true }));
```

Omitting the key disables the guard; an empty string throws rather than silently running open.

## See also

- [Quickstart](./quickstart)
- [API Reference](./api-reference)
