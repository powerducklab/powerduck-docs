---
sidebar_position: 3
title: "Schnellstart"
description: "Erste Schritte mit @powerduck/openapi-mcp-server: CLI mit Webkonsole, programmatischer stdio-Server und eingebetteter Verwaltungsserver."
---

# Schnellstart

Es gibt drei Betriebsarten: die CLI mit Webkonsole, einen programmatisch gestarteten stdio-Server oder den eingebetteten Verwaltungsserver.

## 1. CLI: Webmodus mit Verwaltungsoberfläche

```bash
openapi-mcp serve \
  --transport web \
  --port 3000 \
  --host 127.0.0.1 \
  --api-key your-admin-key
```

Öffne `http://127.0.0.1:3000`, um ein OpenAPI-Dokument hochzuladen oder einzufügen, erzeugte Tools, Prompts und Ressourcen zu prüfen und Anfrageprotokolle einzusehen. MCP-Clients verbinden sich mit `/mcp` (Streamable HTTP) oder `/sse` (älterer Transport).

## 2. CLI: stdio-Modus

```bash
openapi-mcp serve \
  --transport stdio \
  --spec ./openapi.yaml \
  --base-url https://api.example.com
```

Im stdio-Modus ist `--spec` erforderlich. Der Prozess kommuniziert über stdin/stdout mit MCP.

## 3. Programmatisch: stdio-Server

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

## 4. Programmatisch: ein selbst gesteuerter Server

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

> Importiere den umfangreicheren Handler `attachMcpRoutes(app, options)` mit `maxSessions`, `allowedOrigins`, `sessionIdleMs`, `listSessions`, `closeSession` usw. aus `@powerduck/openapi-mcp-server`. Dieselbe Funktion wird auch vom Verwaltungsserver verwendet.

## 5. Verwaltungsserver mit Authentifizierung

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

## Nächste Schritte

- [Konfiguration](/docs/de-DE/openapi-mcp-server/configuration/) — Alle Optionen von `ServerConfig`.
- [Beispiele](/docs/de-DE/openapi-mcp-server/examples/) — Weitere Beispiele zur programmatischen Verwendung.
- [API-Referenz](/docs/de-DE/openapi-mcp-server/api-reference/) — Alle Exporte.
