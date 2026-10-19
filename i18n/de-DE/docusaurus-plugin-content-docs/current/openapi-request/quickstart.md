---
sidebar_position: 3
title: "Schnellstart"
description: "Erste Schritte mit createClient, createDebugger und createManualSession: Anfragen vorbereiten und senden, Stapel ausführen und dauerhafte Sitzungen verwalten."
---

# Schnellstart

Diese Anleitung stellt die drei Einstiegspunkte der Reihe nach vor: den Client für Benutzeroberflächen, den Debugger für Skripte und dauerhafte manuelle Sitzungen.

## Voraussetzungen

- Node.js ab Version 22.12.0
- Ein als JavaScript-Objekt geladenes OpenAPI-3.2-Dokument

## 1. Client für Benutzeroberflächen

`createClient(options?)` gibt einen `ProtoClient` zurück. Das optionale Argument `options` steuert das Zurückschreiben und die Normalisierung von Antworten.

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

### Anfrage vorbereiten

`prepare(sendOptions)` nimmt ein `SendOptions`-Objekt mit `spec` und `target` entgegen und liefert einen `PreparedRequest`, der Protokoll, Anzeigemodus und Streamtyp beschreibt.

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

### Anfrage senden

`send(sendOptions)` erwartet ebenfalls ein `SendOptions`-Objekt. Konkrete Werte übergeben Sie über `values`.

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

### Mehrere Anfragen senden

`sendMany(spec, targets, shared?)` führt mehrere Anfragen aus und liefert für jedes Ziel ein Ergebnis. Fehler verwerfen keine erfolgreich abgeschlossenen Anfragen desselben Stapels.

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

## 2. Debugger für Skripte

`createDebugger(config?)` gibt ein `ProtoKit` für Automatisierung, Skripte und CI zurück.

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

## 3. Dauerhafte manuelle Sitzungen

`createManualSession(options)` gibt eine Duplex-Sitzung für WebSocket, MCP oder gRPC zurück.

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

## Nächste Schritte

- [API-Referenz](/docs/de-DE/openapi-request/api-reference/) — Alle exportierten Funktionen und Typen.
- [Konfiguration](/docs/de-DE/openapi-request/configuration/) — Alle Felder von `SendOptions`.
- [Beispiele](/docs/de-DE/openapi-request/examples/) — Anwendungsbeispiele für die einzelnen Protokolle.
