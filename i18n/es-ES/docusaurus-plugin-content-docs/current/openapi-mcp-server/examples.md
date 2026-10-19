---
sidebar_position: 6
title: "Ejemplos"
description: "Ejemplos de @powerduck/openapi-mcp-server: servidor web por CLI, stdio, claves API, SpecProvider personalizado y generación de herramientas."
keywords: ["openapi-mcp", "stdio", "SpecProvider", "generateTools"]
---

# Ejemplos

## 1. CLI: transporte web con interfaz de administración

```bash
openapi-mcp serve \
  --transport web \
  --port 3000 \
  --host 127.0.0.1 \
  --api-key your-admin-key \
  --spec ./openapi.yaml \
  --base-url https://api.example.com
```

La consola de administración se sirve en `/`, el endpoint MCP de Streamable HTTP en `/mcp` y el endpoint SSE heredado en `/sse`.

## 2. Uso programático: servidor stdio

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

## 3. Servidor de administración con autenticación mediante clave API

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

## 4. SpecProvider y proveedor de contexto personalizados

Cree el servidor MCP y móntelo en su propia aplicación Express:

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

> `attachMcpRoutes` se exporta desde la raíz del paquete. Sus opciones controlan los límites de sesiones, los orígenes CORS y la limpieza de sesiones inactivas. El objeto devuelto expone `listSessions`, `closeSession`, `closeAll` y `dispose`. Llame a `dispose()` al apagar el servidor para detener la limpieza en segundo plano y cerrar las sesiones. Use [`startAdminServer`](../api-reference/#admin-server-and-auth-server-subpath) si también necesita la consola de administración.

## 5. Generar herramientas, prompts y recursos a partir de una especificación

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

## 6. Usar el middleware de autenticación en su aplicación Express

```typescript
import express from "express";
import { createAuthMiddleware } from "@powerduck/openapi-mcp-server";

const app = express();
app.use("/admin", createAuthMiddleware(process.env.ADMIN_API_KEY));
app.get("/admin/status", (req, res) => res.json({ ok: true }));
```

Si se omite la clave, se desactiva el control de acceso. Una cadena vacía produce un error en lugar de permitir el acceso sin advertencia.

## Véase también

- [Inicio rápido](../quickstart/)
- [Referencia de la API](../api-reference/)
