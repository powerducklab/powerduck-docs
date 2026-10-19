---
sidebar_position: 3
title: "Быстрый старт"
description: "Начало работы с @powerduck/openapi-mcp-server: CLI с веб-консолью, программный запуск stdio-сервера и встроенный сервер администрирования."
---

# Быстрый старт

Есть три способа запуска: CLI с веб-консолью, программно запускаемый stdio-сервер и встроенный сервер администрирования.

## 1. CLI: веб-режим с интерфейсом администрирования

```bash
openapi-mcp serve \
  --transport web \
  --port 3000 \
  --host 127.0.0.1 \
  --api-key your-admin-key
```

Откройте `http://127.0.0.1:3000`, чтобы загрузить или вставить документ OpenAPI, просмотреть созданные инструменты, промпты и ресурсы, а также журналы запросов. Клиенты MCP подключаются к `/mcp` (Streamable HTTP) или `/sse` (устаревший транспорт).

## 2. CLI: режим stdio

```bash
openapi-mcp serve \
  --transport stdio \
  --spec ./openapi.yaml \
  --base-url https://api.example.com
```

В режиме stdio параметр `--spec` обязателен. Процесс обменивается сообщениями MCP через stdin/stdout.

## 3. Программный запуск: stdio-сервер

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

## 4. Программный запуск: сервер под вашим управлением

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

> Для использования более полного интерфейса `attachMcpRoutes(app, options)` с `maxSessions`, `allowedOrigins`, `sessionIdleMs`, `listSessions`, `closeSession` и другими параметрами импортируйте функцию из `@powerduck/openapi-mcp-server`. Эту же функцию использует сервер администрирования.

## 5. Сервер администрирования с аутентификацией

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

## Следующие шаги

- [Настройка](/docs/ru-RU/openapi-mcp-server/configuration/) — Все параметры `ServerConfig`.
- [Примеры](/docs/ru-RU/openapi-mcp-server/examples/) — Дополнительные примеры программного использования.
- [Справочник API](/docs/ru-RU/openapi-mcp-server/api-reference/) — Все экспорты.
