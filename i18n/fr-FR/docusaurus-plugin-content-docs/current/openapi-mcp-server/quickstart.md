---
sidebar_position: 3
title: "Démarrage rapide"
description: "Premiers pas avec @powerduck/openapi-mcp-server : CLI avec console web, serveur stdio programmatique et serveur d’administration intégré."
---

# Démarrage rapide

Trois modes d’exécution sont possibles : la CLI avec console web, un serveur stdio lancé par programmation ou le serveur d’administration intégré.

## 1. CLI : mode web avec interface d’administration

```bash
openapi-mcp serve \
  --transport web \
  --port 3000 \
  --host 127.0.0.1 \
  --api-key your-admin-key
```

Ouvrez `http://127.0.0.1:3000` pour importer ou coller un document OpenAPI, examiner les outils, prompts et ressources générés, et consulter les journaux de requêtes. Les clients MCP se connectent à `/mcp` (Streamable HTTP) ou `/sse` (ancien transport).

## 2. CLI : mode stdio

```bash
openapi-mcp serve \
  --transport stdio \
  --spec ./openapi.yaml \
  --base-url https://api.example.com
```

En mode stdio, `--spec` est obligatoire. Le processus communique en MCP via stdin/stdout.

## 3. Par programmation : serveur stdio

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

## 4. Par programmation : un serveur que vous contrôlez

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

> Pour utiliser le gestionnaire plus complet `attachMcpRoutes(app, options)`, avec `maxSessions`, `allowedOrigins`, `sessionIdleMs`, `listSessions`, `closeSession`, etc., importez-le depuis `@powerduck/openapi-mcp-server`. Le serveur d’administration utilise cette même fonction.

## 5. Serveur d’administration avec authentification

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

## Pour aller plus loin

- [Configuration](/docs/fr-FR/openapi-mcp-server/configuration/) — Toutes les options de `ServerConfig`.
- [Exemples](/docs/fr-FR/openapi-mcp-server/examples/) — D’autres exemples d’utilisation par programmation.
- [Référence de l’API](/docs/fr-FR/openapi-mcp-server/api-reference/) — Toutes les exportations.
