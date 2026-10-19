---
sidebar_position: 3
title: "Быстрый старт"
description: "Начните работу с createClient, createDebugger и createManualSession: подготовка и отправка запросов, пакетное выполнение и управление длительными сеансами."
---

# Быстрый старт

В руководстве последовательно рассматриваются три точки входа: клиент для пользовательских интерфейсов, отладчик для скриптов и длительные сеансы с ручным управлением.

## Предварительные требования

- Node.js версии 22.12.0 или новее
- Документ OpenAPI 3.2, загруженный как объект JavaScript

## 1. Клиент для пользовательских интерфейсов

`createClient(options?)` возвращает `ProtoClient`. Необязательный аргумент `options` управляет записью результатов обратно в спецификацию и нормализацией ответов.

```typescript
import { createClient } from "@powerduck/openapi-request";

// Create a client (options are optional)
const client = createClient({
  writeBack: {
    // Optional: control how responses are merged back into the spec
    mergeExamples: true,
  },
  response: {
    // Optional: control how response objects are normalized
    preserveOriginalBody: false,
  },
});
```

### Подготовка запроса

`prepare(sendOptions)` принимает объект `SendOptions` с полями `spec` и `target` и возвращает `PreparedRequest`, описывающий протокол, режим отображения и вид потока.

```typescript
const spec = {
  openapi: "3.2.0",
  info: { title: "Example API", version: "1.0.0" },
  paths: {
    "/users/{id}": {
      get: {
        operationId: "getUserById",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: { "200": { description: "OK" } },
      },
    },
  },
};

// Target by operationId (recommended)
const plan = client.prepare({
  spec,
  target: { operationId: "getUserById" },
});

// Or target by method + path
const plan2 = client.prepare({
  spec,
  target: { method: "GET", path: "/users/{id}" },
});

console.log(plan.protocol);      // "http"
console.log(plan.display.mode);  // "response"
console.log(plan.stream.kind);   // "none"
```

### Отправка запроса

`send(sendOptions)` также принимает объект `SendOptions`. Конкретные значения передаются через `values`.

```typescript
const result = await client.send({
  spec,
  target: { operationId: "getUserById" },
  values: {
    path: { id: "42" },
    query: { include: "profile" },
    header: { "X-Request-Id": "abc-123" },
  },
  serverUrl: "https://api.example.com",
  auth: {
    type: "bearer",
    token: "your-token-here",
  },
  timeout: 15000,
});

console.log(result.response.status);   // e.g. 200
console.log(result.response.body);     // parsed response body
console.log(result.response.headers);  // response headers
console.log(result.response.timings.durationMs); // duration in ms
```

### Пакетная отправка

`sendMany(spec, targets, shared?)` выполняет несколько запросов и возвращает результаты для каждой цели. Ошибки отдельных запросов не приводят к потере результатов успешно выполненных запросов.

```typescript
const batchResult = await client.sendMany(
  spec,
  [
    { target: { operationId: "getUserById" }, values: { path: { id: "1" } } },
    { target: { operationId: "getUserById" }, values: { path: { id: "2" } } },
    { target: { operationId: "getUserById" }, values: { path: { id: "3" } } },
  ],
  {
    serverUrl: "https://api.example.com",
    auth: { type: "bearer", token: "your-token" },
  },
);

batchResult.results.forEach((r, i) => {
  if ("error" in r) {
    console.log(`Request ${i} failed:`, r.error);
  } else {
    console.log(`Request ${i} status:`, r.response.status);
  }
});
```

## 2. Отладчик для скриптов

`createDebugger(config?)` возвращает `ProtoKit` для автоматизации, скриптов и CI.

```typescript
import { createDebugger } from "@powerduck/openapi-request";

const requestDebugger = createDebugger({
  // Optional: custom adapter list
  // adapters: [new HttpAdapter(), new WebSocketAdapter()],
  // Optional: extra adapters added to the defaults
  // extraAdapters: [new MyCustomAdapter()],
  writeBackTruncated: true,
});

// Single request
const result = await requestDebugger.send({
  spec,
  target: { operationId: "getUserById" },
  values: { path: { id: "42" } },
  serverUrl: "https://api.example.com",
});

// Batch request
const batch = await requestDebugger.sendMany(
  spec,
  [
    { target: { operationId: "listUsers" } },
    { target: { operationId: "getUserById" }, values: { path: { id: "1" } } },
  ],
  { serverUrl: "https://api.example.com" },
);

// Export as Postman-compatible collection
const collection = requestDebugger.toCollection(spec, {
  name: "My API Collection",
});
```

## 3. Длительные сеансы с ручным управлением

`createManualSession(options)` возвращает дуплексный сеанс для WebSocket, MCP или gRPC.

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  protocol: "websocket",
  url: "wss://api.example.com/ws",
  // For MCP:
  // protocol: "mcp",
  // transport: "http", // or "stdio"
  // url: "https://api.example.com/mcp",
  // For gRPC:
  // protocol: "grpc",
  // url: "localhost:50051",
});

// Open the connection
await session.open();

// Send a message
await session.send({ type: "message", data: "hello" });

// Subscribe to events
const unsubscribe = session.subscribe((event) => {
  console.log("Event:", event.type, event.data);
});

// Close when done
await session.close();
unsubscribe();
```

## Следующие шаги

- [Справочник API](/docs/ru-RU/openapi-request/api-reference/) — Все экспортируемые функции и типы.
- [Настройка](/docs/ru-RU/openapi-request/configuration/) — Все поля `SendOptions`.
- [Примеры](/docs/ru-RU/openapi-request/examples/) — Примеры для отдельных протоколов.
