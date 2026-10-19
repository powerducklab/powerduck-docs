---
sidebar_position: 6
title: "Beispiele"
description: "Beispiele für @powerduck/openapi-mcp-server: CLI-Webserver, stdio, API-Schlüssel, eigene SpecProvider und generierte Tools."
keywords: ["openapi-mcp", "stdio", "SpecProvider", "generateTools"]
---

# Beispiele

## 1. CLI – Webtransport mit Verwaltungsoberfläche

```bash
openapi-mcp serve \
  --transport web \
  --port 3000 \
  --host 127.0.0.1 \
  --api-key your-admin-key \
  --spec ./openapi.yaml \
  --base-url https://api.example.com
```

Die Verwaltungskonsole liegt unter `/`, der Streamable-HTTP-Endpunkt unter `/mcp` und der ältere SSE-Endpunkt unter `/sse`.

## 2. Programmatisch – stdio-Server

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

## 3. Verwaltungsserver mit API-Schlüssel-Authentifizierung

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

## 4. Eigener SpecProvider und Kontextanbieter

Erstellen Sie den MCP-Server selbst und binden Sie ihn in Ihre Express-App ein:

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

> `attachMcpRoutes` wird aus dem Paketstamm exportiert. Die Optionen steuern Sitzungslimits, CORS-Ursprünge und die Bereinigung inaktiver Sitzungen. Das zurückgegebene Handle bietet `listSessions`, `closeSession`, `closeAll` und `dispose`. Rufen Sie beim Herunterfahren `dispose()` auf, um den Hintergrundtimer zu stoppen und die Sitzungen zu schließen. Nutzen Sie [`startAdminServer`](../api-reference/#admin-server-and-auth-server-subpath), wenn Sie auch die Verwaltungskonsole benötigen.

## 5. Tools, Prompts und Ressourcen aus einer Spezifikation erzeugen

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

## 6. Authentifizierungs-Middleware in einer eigenen Express-App verwenden

```typescript
import express from "express";
import { createAuthMiddleware } from "@powerduck/openapi-mcp-server";

const app = express();
app.use("/admin", createAuthMiddleware(process.env.ADMIN_API_KEY));
app.get("/admin/status", (req, res) => res.json({ ok: true }));
```

Ohne Schlüssel ist die Zugriffskontrolle deaktiviert. Eine leere Zeichenfolge löst dagegen einen Fehler aus, statt unbemerkt ungeschützten Zugriff zuzulassen.

## Weitere Informationen

- [Schnellstart](../quickstart/)
- [API-Referenz](../api-reference/)
