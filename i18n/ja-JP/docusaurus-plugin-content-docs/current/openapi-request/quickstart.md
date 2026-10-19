---
sidebar_position: 3
title: "クイックスタート"
description: "createClient、createDebugger、createManualSession を使い、リクエストの準備・送信、バッチ実行、長時間接続するセッションの管理を始めましょう。"
---

# クイックスタート

このガイドでは、UI 向けクライアント、スクリプト用デバッガー、長時間接続する手動セッションの 3 つの入口を順に紹介します。

## 前提条件

- Node.js 22.12.0 以降
- JavaScript オブジェクトとして読み込んだ OpenAPI 3.2 ドキュメント

## 1. UI 向けクライアント

`createClient(options?)` は `ProtoClient` を返します。省略可能な `options` 引数で、仕様への書き戻しとレスポンスの正規化を制御します。

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

### リクエストを準備する

`prepare(sendOptions)` は `spec` と `target` を含む `SendOptions` オブジェクトを受け取り、プロトコル、表示モード、ストリーム種別を記述した `PreparedRequest` を返します。

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

### リクエストを送信する

`send(sendOptions)` も `SendOptions` オブジェクトを受け取ります。実際の値は `values` で渡します。

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

### バッチを送信する

`sendMany(spec, targets, shared?)` は複数のリクエストを実行し、対象ごとの結果を返します。一部が失敗しても、成功した他のリクエストの結果は失われません。

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

## 2. スクリプト用デバッガー

`createDebugger(config?)` は、自動化、スクリプト、CI 向けの `ProtoKit` を返します。

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

## 3. 長時間接続する手動セッション

`createManualSession(options)` は、WebSocket、MCP、gRPC 用の双方向セッションを返します。

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

## 次のステップ

- [API リファレンス](/docs/ja-JP/openapi-request/api-reference/) — エクスポートされるすべての関数と型。
- [設定](/docs/ja-JP/openapi-request/configuration/) — `SendOptions` の全フィールド。
- [使用例](/docs/ja-JP/openapi-request/examples/) — プロトコル別の使用例。
