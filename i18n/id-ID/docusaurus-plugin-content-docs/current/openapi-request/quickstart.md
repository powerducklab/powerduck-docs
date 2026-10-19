---
sidebar_position: 3
title: "Mulai cepat"
description: "Mulai gunakan createClient, createDebugger, dan createManualSession untuk menyiapkan serta mengirim permintaan, menjalankan batch, dan mengelola sesi persisten."
---

# Mulai cepat

Panduan ini membahas tiga titik masuk secara berurutan: klien untuk antarmuka pengguna, debugger untuk skrip, dan sesi manual persisten.

## Prasyarat

- Node.js 22.12.0 atau lebih baru
- Dokumen OpenAPI 3.2 yang dimuat sebagai objek JavaScript

## 1. Klien untuk antarmuka pengguna

`createClient(options?)` mengembalikan `ProtoClient`. Argumen opsional `options` mengatur penulisan hasil kembali ke spesifikasi dan normalisasi respons.

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

### Menyiapkan permintaan

`prepare(sendOptions)` menerima objek `SendOptions` berisi `spec` dan `target`, lalu mengembalikan `PreparedRequest` yang menjelaskan protokol, mode tampilan, dan jenis aliran.

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

### Mengirim permintaan

`send(sendOptions)` juga menerima objek `SendOptions`. Berikan nilai konkret melalui `values`.

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

### Mengirim batch

`sendMany(spec, targets, shared?)` menjalankan beberapa permintaan dan mengembalikan hasil untuk setiap target. Kegagalan suatu permintaan tidak menghapus hasil permintaan lain yang berhasil.

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

## 2. Debugger untuk skrip

`createDebugger(config?)` mengembalikan `ProtoKit` untuk otomatisasi, skrip, dan CI.

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

## 3. Sesi manual persisten

`createManualSession(options)` mengembalikan sesi dupleks untuk WebSocket, MCP, dan gRPC.

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

## Langkah berikutnya

- [Referensi API](/docs/id-ID/openapi-request/api-reference/) — Semua fungsi dan tipe yang diekspor.
- [Konfigurasi](/docs/id-ID/openapi-request/configuration/) — Semua bidang `SendOptions`.
- [Contoh](/docs/id-ID/openapi-request/examples/) — Contoh penggunaan untuk setiap protokol.
