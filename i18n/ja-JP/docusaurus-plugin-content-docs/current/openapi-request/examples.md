---
sidebar_position: 6
title: "使用例"
description: "これらの連携例では公開 API を使用します"
---

# 使用例

これらの連携例では公開 API を使用します。読み込み済みの OpenAPI 3.2 ドキュメントを `spec` として用意し、各例で使用する操作 ID とパスを含めてください。例の URL、トークン、ローカルファイルのパスは実際の値に置き換えます。ネットワークを使う例には接続可能なサービスが必要であり、単独で動作するモックサーバーではありません。

## 1. SendOptions による HTTP リクエスト

`prepare()` と `send()` は、どちらも `spec`、`target`、`values` を含む `SendOptions` オブジェクトを受け取ります。

```typescript
import { createClient, createDebugger } from "@powerduck/openapi-request";

// Create client and debugger (options are optional)
const client = createClient();
const dbg = createDebugger();

// Plan a request by operationId
const plan = client.prepare({
  spec,
  target: { operationId: "getUserById" },
});

console.log(plan.protocol);      // "http"
console.log(plan.display.mode);  // "response"
console.log(plan.stream.kind);   // "none"

// Send the request with concrete values
const result = await dbg.send({
  spec,
  target: { operationId: "getUserById" },
  values: {
    path: { id: "42" },
    query: { include: "profile" },
  },
  serverUrl: "https://api.example.com",
  auth: { type: "bearer", token: "your-token" },
  timeout: 15000,
});

console.log(result.response.status);   // e.g. 200
console.log(result.response.body);     // body value returned by the adapter
console.log(result.response.headers);  // response headers
console.log(result.response.timings.durationMs); // request duration in ms
```

### メソッドとパスで対象を指定する

```typescript
const plan2 = client.prepare({
  spec,
  target: { method: "GET", path: "/users/{id}" },
});
```

### sendMany による一括実行

```typescript
const batch = await dbg.sendMany(
  spec,
  [
    { target: { operationId: "listUsers" } },
    { target: { operationId: "getUserById" }, values: { path: { id: "1" } } },
    { target: { operationId: "getUserById" }, values: { path: { id: "2" } } },
  ],
  {
    serverUrl: "https://api.example.com",
    auth: { type: "bearer", token: "your-token" },
  },
);

batch.results.forEach((r, i) => {
  if ("error" in r) {
    console.log(`Request ${i} failed:`, r.error);
  } else {
    console.log(`Request ${i} status:`, r.response.status);
  }
});
```

## 2. SSE ストリーミング

レスポンスで `text/event-stream` が宣言されている場合、クライアントは表示モードを自動的に `event-list` として計画します。

```typescript
const plan = client.prepare({
  spec,
  target: { operationId: "streamEvents" },
});

console.log(plan.stream.kind);   // "sse"
console.log(plan.display.mode);   // "event-list"
```

### 実際のエンドポイントを調べる

```typescript
import { probeStreamingResponse } from "@powerduck/openapi-request";

const probe = await probeStreamingResponse("https://api.example.com/events");
console.log(probe.kind, probe.status); // "sse" | "ndjson" | "chunked" | "none"
// The probe performs a request; consume or cancel its response body.
await probe.response.body?.cancel();
```

### SSE ストリームを解析する

```typescript
import { SseParser } from "@powerduck/openapi-request/http";

const response = await fetch("https://api.example.com/events");
if (!response.ok || !response.body) throw new Error("SSE response unavailable");
const parser = new SseParser();
const reader = response.body.getReader();
try {
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    for (const event of parser.push(value)) console.log(event.event, event.data);
  }
  for (const event of parser.flush()) console.log(event.event, event.data);
} finally {
  await reader.cancel();
  reader.releaseLock();
}
```

## 3. WebSocket セッション

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "websocket",
  url: "wss://api.example.com/ws",
});

// Subscribe before opening so connection events are included.
const subscription = session.onEvent((event) => {
  console.log("Event:", event.kind, event.data);
});
try {
  await session.open();
  await session.send({ type: "subscribe", channel: "updates" });
  // Keep the session open for as long as your application needs it.
} finally {
  await session.close();
  subscription.unsubscribe();
}
```

## 4. GraphQL 操作

```typescript
import {
  discoverAndWriteGraphQLSchema,
  runGraphQL,
} from "@powerduck/openapi-request/graphql";

const endpoint = "https://api.example.com/graphql";
const headers = { Authorization: `Bearer ${token}` };

// Returns a new spec; introspection must be enabled by the server.
const discovered = await discoverAndWriteGraphQLSchema(spec, endpoint, { headers });
console.log(discovered.spec, discovered.warnings);

// Execute an explicit query with a matching server schema.
const result = await runGraphQL({
  endpoint,
  headers,
  query: "query GetUser($id: ID!) { user(id: $id) { id name } }",
  operationName: "GetUser",
  variables: { id: "42" },
  useGet: false,
}, {
  spec,
  target: { operationId: "getUserById" },
  timeout: 15000,
});
console.log(result.response.body);
```

## 5. MCP ツールの呼び出し（HTTP と stdio）

```typescript
import { createManualSession } from "@powerduck/openapi-request";

// Streamable HTTP
const httpSession = createManualSession({
  kind: "mcp",
  endpoint: "https://mcp.example.com/mcp",
  headers: { Authorization: `Bearer ${token}` },
});

// stdio child process
const stdioSession = createManualSession({
  kind: "mcp",
  transport: "stdio",
  command: "node",
  args: ["./mcp-server.js"],
});

// Only the HTTP session is opened here. Opening stdioSession starts its process.
try {
  await httpSession.open();
  const outcome = await httpSession.send({
    method: "tools/call",
    params: { name: "get_user", arguments: { id: "42" } },
  });
  console.log(outcome);
} finally {
  await httpSession.close();
}
```

## 6. gRPC の単項呼び出し

```typescript
import { grpcCall } from "@powerduck/openapi-request/grpc";

const result = await grpcCall({
  address: "grpc.example.com:50051",
  service: "helloworld.Greeter",
  method: "SayHello",
  protoPaths: ["./protos/helloworld.proto"],
  metadata: { "x-tenant": "acme" },
  deadlineMs: 5000,
}, {
  messages: [{ name: "World" }],
});

console.log(result.messages); // decoded response(s)
console.log(result.status);   // { code, codeName, details }
```

同じ関数でサーバーストリーミング、クライアントストリーミング、双方向ストリーミングも実行できます。`options.messages` と、`maxMessages`、`idleTimeoutMs`、`maxSessionMs` などの制限を指定してください。長時間維持するストリームには `createGrpcManualSession()` を使用します。

## 7. レスポンスの書き戻し

```typescript
import { writeBackResponse, toResponseObject, locateOperation } from "@powerduck/openapi-request";

// Locate the operation
const located = locateOperation(spec, { operationId: "getUserById" });

// Build a response object from the result
const fragment = toResponseObject(result, {
  // Optional: response normalization options
});

// Write back into the spec
const updated = writeBackResponse(
  spec,
  located.path,
  located.method,
  fragment,
  {
    // Optional: WriteBackOptions
    overwriteExamples: true,
  },
);
```

`writeBackResponse()` は変更後のコピーを返します。ファイルは保存しません。取得した例は公開前に確認してください。デバッガーの送信パイプラインとは異なり、この低水準関数は `requirePassingTests` を適用しません。

### レスポンスからスキーマを推論し、サンプルを生成する

```typescript
import { inferSchema, sampleFromSchema } from "@powerduck/openapi-request";

// Use this for JSON responses; handle parse errors for non-JSON bodies.
const body = result.response.body;
const schema = inferSchema(typeof body === "string" ? JSON.parse(body) : body);

// Generate a realistic sample from the schema
const sample = sampleFromSchema(schema);
```

## 関連項目

- [クイックスタート](./quickstart.md)
- [API リファレンス](./api-reference.md)
- [設定](./configuration.md)
