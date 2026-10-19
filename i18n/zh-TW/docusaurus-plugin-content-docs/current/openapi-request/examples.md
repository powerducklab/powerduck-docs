---
sidebar_position: 6
title: "範例"
description: "這些整合範例使用公開 API"
---

# 範例

這些整合範例使用公開 API。請將已載入的 OpenAPI 3.2 文件作為 `spec`，並確保其中包含各範例使用的操作 ID 和路徑。範例 URL、權杖和本機檔案路徑需替換為你自己的值。網路範例需要可存取的服務，並非可獨立執行的 Mock 伺服器。

## 1. 使用 SendOptions 傳送 HTTP 請求

`prepare()` 和 `send()` 都接收包含 `spec`、`target` 和 `values` 的 `SendOptions` 物件。

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

### 透過方法與路徑指定目標

```typescript
const plan2 = client.prepare({
  spec,
  target: { method: "GET", path: "/users/{id}" },
});
```

### 使用 sendMany 批次執行

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

## 2. SSE 串流回應

當回應宣告 `text/event-stream` 時，用戶端會自動規劃為 `event-list` 顯示模式。

```typescript
const plan = client.prepare({
  spec,
  target: { operationId: "streamEvents" },
});

console.log(plan.stream.kind);   // "sse"
console.log(plan.display.mode);   // "event-list"
```

### 探測實際端點

```typescript
import { probeStreamingResponse } from "@powerduck/openapi-request";

const probe = await probeStreamingResponse("https://api.example.com/events");
console.log(probe.kind, probe.status); // "sse" | "ndjson" | "chunked" | "none"
// The probe performs a request; consume or cancel its response body.
await probe.response.body?.cancel();
```

### 解析 SSE 串流

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

## 3. WebSocket 工作階段

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

## 5. MCP 工具呼叫（HTTP 與 stdio）

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

## 6. gRPC 一元呼叫

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

同一個呼叫也支援伺服器端串流、用戶端串流及雙向串流，只需傳入 `options.messages` 和 `maxMessages`、`idleTimeoutMs`、`maxSessionMs` 等限制。若需要長時間維持串流，請使用 `createGrpcManualSession()`。

## 7. 回寫回應

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

`writeBackResponse()` 會傳回修改後的副本，不會儲存檔案。發佈前請檢查擷取的範例。與偵錯器的傳送流程不同，這個底層函式不會執行 `requirePassingTests` 檢查。

### 從回應推斷 Schema 並產生樣本

```typescript
import { inferSchema, sampleFromSchema } from "@powerduck/openapi-request";

// Use this for JSON responses; handle parse errors for non-JSON bodies.
const body = result.response.body;
const schema = inferSchema(typeof body === "string" ? JSON.parse(body) : body);

// Generate a realistic sample from the schema
const sample = sampleFromSchema(schema);
```

## 相關文件

- [快速入門](./quickstart.md)
- [API 參考](./api-reference.md)
- [設定](./configuration.md)
