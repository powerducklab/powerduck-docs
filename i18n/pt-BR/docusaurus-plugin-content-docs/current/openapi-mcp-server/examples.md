---
sidebar_position: 6
title: "Exemplos"
description: "Exemplos de @powerduck/openapi-mcp-server: servidor web pela CLI, stdio, chaves de API, SpecProvider personalizado e geração de ferramentas."
keywords: ["openapi-mcp", "stdio", "SpecProvider", "generateTools"]
---

# Exemplos

## 1. CLI: transporte web com interface de administração

```bash
openapi-mcp serve \
  --transport web \
  --port 3000 \
  --host 127.0.0.1 \
  --api-key your-admin-key \
  --spec ./openapi.yaml \
  --base-url https://api.example.com
```

O console de administração fica em `/`, o endpoint MCP Streamable HTTP em `/mcp` e o endpoint SSE legado em `/sse`.

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

## 3. Servidor de administração com autenticação por chave de API

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

## 4. SpecProvider e provedor de contexto personalizados

Crie o servidor MCP e monte-o no seu próprio aplicativo Express:

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

> `attachMcpRoutes` é exportado pela raiz do pacote. Suas opções controlam os limites de sessões, as origens CORS e a limpeza de sessões inativas. O identificador retornado expõe `listSessions`, `closeSession`, `closeAll` e `dispose`. Chame `dispose()` ao encerrar para interromper a limpeza em segundo plano e fechar as sessões. Use [`startAdminServer`](../api-reference/#admin-server-and-auth-server-subpath) se também precisar do console de administração.

## 5. Gerar ferramentas, prompts e recursos a partir de uma especificação

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

## 6. Usar o middleware de autenticação no seu aplicativo Express

```typescript
import express from "express";
import { createAuthMiddleware } from "@powerduck/openapi-mcp-server";

const app = express();
app.use("/admin", createAuthMiddleware(process.env.ADMIN_API_KEY));
app.get("/admin/status", (req, res) => res.json({ ok: true }));
```

Omitir a chave desativa o controle de acesso. Uma string vazia gera um erro, em vez de permitir acesso sem aviso.

## Veja também

- [Início rápido](../quickstart/)
- [Referência da API](../api-reference/)
