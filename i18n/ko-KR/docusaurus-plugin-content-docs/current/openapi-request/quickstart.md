---
sidebar_position: 3
title: "빠른 시작"
description: "createClient, createDebugger, createManualSession으로 요청 준비와 전송, 일괄 실행, 장기 세션 관리를 시작하세요."
---

# 빠른 시작

이 가이드에서는 UI용 클라이언트, 스크립트용 디버거, 장기 수동 세션이라는 세 진입점을 차례로 설명합니다.

## 사전 요구 사항

- Node.js 22.12.0 이상
- JavaScript 객체로 불러온 OpenAPI 3.2 문서

## 1. UI용 클라이언트

`createClient(options?)`는 `ProtoClient`를 반환합니다. 선택적 인수인 `options`는 명세에 결과를 다시 기록하는 방식과 응답 정규화를 제어합니다.

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

### 요청 준비

`prepare(sendOptions)`는 `spec`과 `target`을 포함하는 `SendOptions` 객체를 받아 프로토콜, 표시 모드, 스트림 종류를 설명하는 `PreparedRequest`를 반환합니다.

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

### 요청 전송

`send(sendOptions)`도 `SendOptions` 객체를 받습니다. 실제 값은 `values`로 전달하세요.

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

### 일괄 전송

`sendMany(spec, targets, shared?)`는 여러 요청을 실행하고 대상별 결과를 반환합니다. 일부 요청이 실패해도 성공한 다른 요청의 결과는 사라지지 않습니다.

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

## 2. 스크립트용 디버거

`createDebugger(config?)`는 자동화, 스크립트, CI용 `ProtoKit`을 반환합니다.

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

## 3. 장기 수동 세션

`createManualSession(options)`는 WebSocket, MCP, gRPC용 양방향 세션을 반환합니다.

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

## 다음 단계

- [API 참조](/docs/ko-KR/openapi-request/api-reference/) — 내보낸 모든 함수와 타입.
- [설정](/docs/ko-KR/openapi-request/configuration/) — `SendOptions`의 모든 필드.
- [예제](/docs/ko-KR/openapi-request/examples/) — 프로토콜별 사용 예제.
