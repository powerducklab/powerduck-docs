---
sidebar_position: 3
title: "Hızlı başlangıç"
description: "createClient, createDebugger ve createManualSession ile istek hazırlama ve gönderme, toplu çalıştırma ve uzun süreli oturum yönetimine başlayın."
---

# Hızlı başlangıç

Bu kılavuz üç giriş noktasını sırayla ele alır: kullanıcı arayüzleri için istemci, betikler için hata ayıklayıcı ve uzun süreli elle yönetilen oturumlar.

## Ön koşullar

- Node.js 22.12.0 veya üzeri
- JavaScript nesnesi olarak yüklenmiş bir OpenAPI 3.2 belgesi

## 1. Kullanıcı arayüzleri için istemci

`createClient(options?)` bir `ProtoClient` döndürür. İsteğe bağlı `options` bağımsız değişkeni, sonuçların belirtime geri yazılmasını ve yanıtların normalleştirilmesini denetler.

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

### İstek hazırlama

`prepare(sendOptions)`, `spec` ve `target` içeren bir `SendOptions` nesnesi alır; protokolü, görüntüleme modunu ve akış türünü tanımlayan bir `PreparedRequest` döndürür.

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

### İstek gönderme

`send(sendOptions)` da bir `SendOptions` nesnesi alır. Somut değerleri `values` üzerinden iletin.

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

### Toplu gönderim

`sendMany(spec, targets, shared?)` birden fazla istek çalıştırır ve her hedef için sonuç döndürür. Bir isteğin başarısız olması, diğer başarılı isteklerin sonuçlarının silinmesine yol açmaz.

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

## 2. Betikler için hata ayıklayıcı

`createDebugger(config?)` otomasyon, betikler ve CI için bir `ProtoKit` döndürür.

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

## 3. Uzun süreli elle yönetilen oturumlar

`createManualSession(options)` WebSocket, MCP ve gRPC için çift yönlü bir oturum döndürür.

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

## Sonraki adımlar

- [API başvurusu](/docs/tr-TR/openapi-request/api-reference/) — Dışa aktarılan tüm işlevler ve türler.
- [Yapılandırma](/docs/tr-TR/openapi-request/configuration/) — `SendOptions` içindeki tüm alanlar.
- [Örnekler](/docs/tr-TR/openapi-request/examples/) — Her protokole özel kullanım örnekleri.
