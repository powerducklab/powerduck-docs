---
sidebar_position: 3
title: "快速入門"
description: "使用 createClient、createDebugger 與 createManualSession 準備及傳送請求、批次執行工作，並管理持續連線工作階段。"
---

# 快速入門

本指南依序介紹三個入口：適用於 UI 的用戶端、指令碼偵錯器，以及持續連線的手動工作階段。

## 必要條件

- Node.js 22.12.0 或更新版本
- 已載入為 JavaScript 物件的 OpenAPI 3.2 文件

## 1. 適用於 UI 的用戶端

`createClient(options?)` 傳回 `ProtoClient`。選用的 `options` 參數控制結果回寫與回應正規化。

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

### 準備請求

`prepare(sendOptions)` 接收包含 `spec` 與 `target` 的 `SendOptions` 物件，並傳回描述通訊協定、顯示模式及串流類型的 `PreparedRequest`。

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

### 傳送請求

`send(sendOptions)` 同樣接收 `SendOptions` 物件。透過 `values` 傳入具體參數值。

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

### 批次傳送

`sendMany(spec, targets, shared?)` 執行多個請求並依目標傳回結果。部分請求失敗不會捨棄其他成功請求的結果。

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

## 2. 指令碼偵錯器

`createDebugger(config?)` 傳回適用於自動化、指令碼與 CI 的 `ProtoKit`。

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

## 3. 持續連線的手動工作階段

`createManualSession(options)` 傳回適用於 WebSocket、MCP 與 gRPC 的雙向工作階段。

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

## 後續步驟

- [API 參考](/docs/zh-TW/openapi-request/api-reference/) — 所有匯出的函式與型別。
- [設定](/docs/zh-TW/openapi-request/configuration/) — `SendOptions` 的所有欄位。
- [範例](/docs/zh-TW/openapi-request/examples/) — 各通訊協定的使用範例。
