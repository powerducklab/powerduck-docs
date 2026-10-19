---
sidebar_position: 3
title: "Guida rapida"
description: "Primi passi con @powerduck/openapi-mcp-server: CLI con console web, server stdio avviato da codice e server di amministrazione integrato."
---

# Guida rapida

Sono disponibili tre modalità di esecuzione: la CLI con console web, un server stdio avviato da codice o il server di amministrazione integrato.

## 1. CLI: modalità web con interfaccia di amministrazione

```bash
openapi-mcp serve \
  --transport web \
  --port 3000 \
  --host 127.0.0.1 \
  --api-key your-admin-key
```

Apri `http://127.0.0.1:3000` per caricare o incollare un documento OpenAPI, esaminare strumenti, prompt e risorse generati e consultare i log delle richieste. I client MCP si collegano a `/mcp` (Streamable HTTP) oppure a `/sse` (legacy).

## 2. CLI: modalità stdio

```bash
openapi-mcp serve \
  --transport stdio \
  --spec ./openapi.yaml \
  --base-url https://api.example.com
```

In modalità stdio, `--spec` è obbligatorio. Il processo comunica tramite MCP su stdin/stdout.

## 3. Da codice: server stdio

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

## 4. Da codice: un server sotto il tuo controllo

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

> Per usare il gestore più completo `attachMcpRoutes(app, options)`, con `maxSessions`, `allowedOrigins`, `sessionIdleMs`, `listSessions`, `closeSession` e altre opzioni, importalo da `@powerduck/openapi-mcp-server`. È la stessa funzione usata dal server di amministrazione.

## 5. Server di amministrazione con autenticazione

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

## Passaggi successivi

- [Configurazione](/docs/it-IT/openapi-mcp-server/configuration/) — Tutte le opzioni di `ServerConfig`.
- [Esempi](/docs/it-IT/openapi-mcp-server/examples/) — Altri esempi di utilizzo da codice.
- [Riferimento API](/docs/it-IT/openapi-mcp-server/api-reference/) — Tutte le esportazioni.
