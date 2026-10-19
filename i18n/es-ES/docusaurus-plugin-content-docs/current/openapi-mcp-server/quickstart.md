---
sidebar_position: 3
title: "Inicio rápido"
description: "Primeros pasos con @powerduck/openapi-mcp-server: CLI con consola web, servidor stdio programático y servidor de administración integrado."
---

# Inicio rápido

Hay tres formas de ejecución: la CLI con consola web, un servidor stdio programático o el servidor de administración integrado.

## 1. CLI: modo web con interfaz de administración

```bash
openapi-mcp serve \
  --transport web \
  --port 3000 \
  --host 127.0.0.1 \
  --api-key your-admin-key
```

Abre `http://127.0.0.1:3000` para subir o pegar un documento OpenAPI, revisar las herramientas, prompts y recursos generados, y consultar los registros de solicitudes. Los clientes MCP se conectan a `/mcp` (Streamable HTTP) o `/sse` (heredado).

## 2. CLI: modo stdio

```bash
openapi-mcp serve \
  --transport stdio \
  --spec ./openapi.yaml \
  --base-url https://api.example.com
```

En modo stdio, `--spec` es obligatorio. El proceso usa MCP a través de stdin/stdout.

## 3. Uso programático: servidor stdio

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

## 4. Uso programático: un servidor bajo tu control

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

> Para usar el manejador más completo `attachMcpRoutes(app, options)`, con `maxSessions`, `allowedOrigins`, `sessionIdleMs`, `listSessions`, `closeSession`, etc., importa desde `@powerduck/openapi-mcp-server`. Es la misma función que utiliza el servidor de administración.

## 5. Servidor de administración con autenticación

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

## Siguientes pasos

- [Configuración](/docs/es-ES/openapi-mcp-server/configuration/) — El conjunto completo de opciones de `ServerConfig`.
- [Ejemplos](/docs/es-ES/openapi-mcp-server/examples/) — Más ejemplos de uso programático.
- [Referencia de API](/docs/es-ES/openapi-mcp-server/api-reference/) — Todas las exportaciones.
