---
sidebar_position: 3
title: "Início rápido"
description: "Primeiros passos com @powerduck/openapi-mcp-server: CLI com console web, servidor stdio por código e servidor de administração integrado."
---

# Início rápido

Há três formas de execução: a CLI com console web, um servidor stdio iniciado por código ou o servidor de administração integrado.

## 1. CLI: modo web com interface de administração

```bash
openapi-mcp serve \
  --transport web \
  --port 3000 \
  --host 127.0.0.1 \
  --api-key your-admin-key
```

Abra `http://127.0.0.1:3000` para enviar ou colar um documento OpenAPI, examinar as ferramentas, prompts e recursos gerados e acompanhar os logs de requisições. Os clientes MCP se conectam a `/mcp` (Streamable HTTP) ou `/sse` (legado).

## 2. CLI: modo stdio

```bash
openapi-mcp serve \
  --transport stdio \
  --spec ./openapi.yaml \
  --base-url https://api.example.com
```

No modo stdio, `--spec` é obrigatório. O processo usa MCP por stdin/stdout.

## 3. Uso por código: servidor stdio

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

## 4. Uso por código: um servidor sob seu controle

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

> Para usar o manipulador mais completo `attachMcpRoutes(app, options)`, com `maxSessions`, `allowedOrigins`, `sessionIdleMs`, `listSessions`, `closeSession` etc., importe de `@powerduck/openapi-mcp-server`. É a mesma função utilizada pelo servidor de administração.

## 5. Servidor de administração com autenticação

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

## Próximos passos

- [Configuração](/docs/pt-BR/openapi-mcp-server/configuration/) — Todas as opções de `ServerConfig`.
- [Exemplos](/docs/pt-BR/openapi-mcp-server/examples/) — Mais exemplos de uso por código.
- [Referência da API](/docs/pt-BR/openapi-mcp-server/api-reference/) — Todas as exportações.
