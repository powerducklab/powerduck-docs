---
sidebar_position: 6
title: "Exemples"
description: "Exemples de @powerduck/openapi-mcp-server : serveur web en CLI, stdio, clés API, SpecProvider personnalisé et génération d’outils."
keywords: ["openapi-mcp", "stdio", "SpecProvider", "generateTools"]
---

# Exemples

## 1. CLI — transport web avec interface d’administration

```bash
openapi-mcp serve \
  --transport web \
  --port 3000 \
  --host 127.0.0.1 \
  --api-key your-admin-key \
  --spec ./openapi.yaml \
  --base-url https://api.example.com
```

La console d’administration est accessible sur `/`, le point de terminaison MCP Streamable HTTP sur `/mcp` et l’ancien point de terminaison SSE sur `/sse`.

## 2. Utilisation programmatique — serveur stdio

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

## 3. Serveur d’administration avec authentification par clé API

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

## 4. SpecProvider et fournisseur de contexte personnalisés

Créez le serveur MCP et montez-le dans votre propre application Express :

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

> `attachMcpRoutes` est exporté à la racine du paquet. Ses options contrôlent les limites de sessions, les origines CORS et le nettoyage des sessions inactives. Le handle renvoyé expose `listSessions`, `closeSession`, `closeAll` et `dispose`. Appelez `dispose()` à l’arrêt pour arrêter le nettoyage en arrière-plan et fermer les sessions. Utilisez [`startAdminServer`](../api-reference/#admin-server-and-auth-server-subpath) si vous avez aussi besoin de la console d’administration.

## 5. Générer des outils, des prompts et des ressources à partir d’une spécification

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

## 6. Utiliser le middleware d’authentification dans votre application Express

```typescript
import express from "express";
import { createAuthMiddleware } from "@powerduck/openapi-mcp-server";

const app = express();
app.use("/admin", createAuthMiddleware(process.env.ADMIN_API_KEY));
app.get("/admin/status", (req, res) => res.json({ ok: true }));
```

Sans clé, le contrôle d’accès est désactivé. Une chaîne vide déclenche une erreur au lieu d’autoriser silencieusement les accès.

## Voir aussi

- [Démarrage rapide](../quickstart/)
- [Référence de l’API](../api-reference/)
