---
sidebar_position: 3
title: "البدء السريع"
description: "ابدأ باستخدام createClient وcreateDebugger وcreateManualSession لإعداد الطلبات وإرسالها وتنفيذ الدفعات وإدارة الجلسات المستمرة."
---

# البدء السريع

يشرح هذا الدليل نقاط الدخول الثلاث بالترتيب: العميل المصمم لواجهات المستخدم، ومصحّح الأخطاء للبرامج النصية، والجلسات اليدوية المستمرة.

## المتطلبات الأساسية

- Node.js بالإصدار 22.12.0 أو أحدث
- مستند OpenAPI 3.2 محمّل في صورة كائن JavaScript

## 1. عميل لواجهات المستخدم

تعيد `createClient(options?)` كائن `ProtoClient`. يتحكم الوسيط الاختياري `options` في كتابة النتائج إلى المواصفة وتوحيد بنية الاستجابات.

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

### إعداد طلب

تستقبل `prepare(sendOptions)` كائن `SendOptions` يحتوي على `spec` و`target`، وتعيد كائن `PreparedRequest` يصف البروتوكول ووضع العرض ونوع التدفق.

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

### إرسال طلب

تستقبل `send(sendOptions)` أيضًا كائن `SendOptions`. مرّر القيم الفعلية عبر `values`.

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

### إرسال دفعة

تنفّذ `sendMany(spec, targets, shared?)` عدة طلبات وتعيد نتيجة لكل هدف. لا يؤدي فشل أحد الطلبات إلى فقدان نتائج الطلبات الأخرى الناجحة.

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

## 2. مصحّح أخطاء للبرامج النصية

تعيد `createDebugger(config?)` كائن `ProtoKit` للأتمتة والبرامج النصية والتكامل المستمر.

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

## 3. جلسات يدوية مستمرة

تعيد `createManualSession(options)` جلسة ثنائية الاتجاه لـ WebSocket أو MCP أو gRPC.

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

## الخطوات التالية

- [مرجع API](/docs/ar-SA/openapi-request/api-reference/) — جميع الدوال والأنواع المصدَّرة.
- [الإعدادات](/docs/ar-SA/openapi-request/configuration/) — جميع حقول `SendOptions`.
- [أمثلة](/docs/ar-SA/openapi-request/examples/) — أمثلة مخصصة لكل بروتوكول.
