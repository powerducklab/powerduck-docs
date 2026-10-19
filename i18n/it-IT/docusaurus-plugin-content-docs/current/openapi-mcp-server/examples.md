---
sidebar_position: 6
title: "Esempi"
description: "Esempi di @powerduck/openapi-mcp-server: server web da CLI, stdio, chiavi API, SpecProvider personalizzato e generazione di strumenti."
keywords: ["openapi-mcp", "stdio", "SpecProvider", "generateTools"]
---

# Esempi

## 1. CLI: trasporto web con interfaccia di amministrazione

```bash
openapi-mcp serve \
  --transport web \
  --port 3000 \
  --host 127.0.0.1 \
  --api-key your-admin-key \
  --spec ./openapi.yaml \
  --base-url https://api.example.com
```

La console di amministrazione è disponibile su `/`, l’endpoint MCP Streamable HTTP su `/mcp` e l’endpoint SSE legacy su `/sse`.

## 2. Uso programmatico: server stdio

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

## 3. Server di amministrazione con autenticazione tramite chiave API

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

## 4. SpecProvider e provider di contesto personalizzati

Crea il server MCP e montalo nella tua applicazione Express:

```typescript
import express from "express";
import {
  attachMcpRoutes,
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

const routes = attachMcpRoutes(app, {
  specProvider,
  contextProvider,
  maxSessions: 64,
  sessionIdleMs: 600000,
});
console.log(routes.listSessions());

app.listen(8080, () => console.log("mcp on :8080/mcp"));
```

> `attachMcpRoutes` viene esportato dalla radice del pacchetto. Le opzioni controllano i limiti delle sessioni, le origini CORS e la pulizia delle sessioni inattive. L’handle restituito espone `listSessions`, `closeSession`, `closeAll` e `dispose`. Chiama `dispose()` all’arresto per fermare la pulizia in background e chiudere le sessioni. Usa [`startAdminServer`](../api-reference/#admin-server-and-auth-server-subpath) se ti serve anche la console di amministrazione.

## 5. Generare strumenti, prompt e risorse da una specifica

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

## 6. Usare il middleware di autenticazione nella propria applicazione Express

```typescript
import express from "express";
import { createAuthMiddleware } from "@powerduck/openapi-mcp-server";

const app = express();
app.use("/admin", createAuthMiddleware(process.env.ADMIN_API_KEY));
app.get("/admin/status", (req, res) => res.json({ ok: true }));
```

Omettendo la chiave, il controllo degli accessi viene disattivato. Una stringa vuota genera invece un errore, evitando di consentire l’accesso senza segnalarlo.

## Vedi anche

- [Guida rapida](../quickstart/)
- [Riferimento API](../api-reference/)
