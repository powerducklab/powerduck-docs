---
sidebar_position: 3
title: "Bắt đầu nhanh"
description: "Bắt đầu với createClient, createDebugger và createManualSession để chuẩn bị, gửi yêu cầu, chạy theo lô và quản lý phiên kết nối lâu dài."
---

# Bắt đầu nhanh

Hướng dẫn này lần lượt trình bày ba điểm truy cập: máy khách dành cho giao diện người dùng, trình gỡ lỗi cho tập lệnh và phiên thủ công duy trì lâu dài.

## Điều kiện tiên quyết

- Node.js 22.12.0 trở lên
- Tài liệu OpenAPI 3.2 đã được nạp dưới dạng đối tượng JavaScript

## 1. Máy khách dành cho giao diện người dùng

`createClient(options?)` trả về một `ProtoClient`. Đối số tùy chọn `options` kiểm soát việc ghi kết quả ngược vào đặc tả và chuẩn hóa phản hồi.

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

### Chuẩn bị yêu cầu

`prepare(sendOptions)` nhận đối tượng `SendOptions` chứa `spec` và `target`, rồi trả về `PreparedRequest` mô tả giao thức, chế độ hiển thị và loại luồng.

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

### Gửi yêu cầu

`send(sendOptions)` cũng nhận đối tượng `SendOptions`. Truyền các giá trị cụ thể qua `values`.

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

### Gửi theo lô

`sendMany(spec, targets, shared?)` thực thi nhiều yêu cầu và trả về kết quả cho từng đích. Yêu cầu thất bại không làm mất kết quả của các yêu cầu khác đã thành công.

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

## 2. Trình gỡ lỗi cho tập lệnh

`createDebugger(config?)` trả về một `ProtoKit` dùng cho tự động hóa, tập lệnh và CI.

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

## 3. Phiên thủ công duy trì lâu dài

`createManualSession(options)` trả về phiên hai chiều dành cho WebSocket, MCP và gRPC.

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

## Các bước tiếp theo

- [Tham chiếu API](/docs/vi-VN/openapi-request/api-reference/) — Tất cả hàm và kiểu được xuất.
- [Cấu hình](/docs/vi-VN/openapi-request/configuration/) — Tất cả trường của `SendOptions`.
- [Ví dụ](/docs/vi-VN/openapi-request/examples/) — Ví dụ sử dụng riêng cho từng giao thức.
