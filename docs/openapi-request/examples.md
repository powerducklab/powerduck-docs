---
sidebar_position: 6
title: "Examples"
description: "Runnable examples for @powerduck/openapi-request: HTTP with SendOptions, SSE streaming, WebSocket sessions, GraphQL operations, MCP tool calls, gRPC unary calls, and response write-back."
keywords: ["examples", "sse", "websocket", "graphql", "mcp", "grpc", "writeback", "openapi-request"]
---

# Examples

Practical recipes built from the public surface. All assume `spec` is a loaded OpenAPI 3.2 document.

## 1. HTTP request with SendOptions

Both `prepare()` and `send()` take a `SendOptions` object with `spec`, `target`, and `values`.

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
console.log(result.response.body);     // parsed response body
console.log(result.response.headers);  // response headers
console.log(result.response.timings.durationMs); // request duration in ms
```

### Target by method + path

```typescript
const plan2 = client.prepare({
  spec,
  target: { method: "GET", path: "/users/{id}" },
});
```

### Batch execution with sendMany

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

## 2. SSE streaming

When a response declares `text/event-stream`, the client plans an `event-list` display mode automatically.

```typescript
const plan = client.prepare({
  spec,
  target: { operationId: "streamEvents" },
});

console.log(plan.stream.kind);   // "sse"
console.log(plan.display.mode);   // "event-list"
```

### Classify a live response

```typescript
import { probeStreamingResponse } from "@powerduck/openapi-request";

const response = await fetch(url);
const kind = probeStreamingResponse(response);
// Returns a StreamKind: "sse" | "ndjson" | "chunked" | "none" | ...
```

### Parse an SSE stream

```typescript
import { SseParser } from "@powerduck/openapi-request/http";

const parser = new SseParser();
for await (const event of parser.stream(bodyStream)) {
  console.log(event.event, event.data);
}
```

## 3. WebSocket session

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  protocol: "websocket",
  url: "wss://api.example.com/ws",
});

// Open the connection
await session.open();

// Subscribe to events
const unsubscribe = session.subscribe((event) => {
  console.log("Event:", event.type, event.data);
});

// Send a message
await session.send({ type: "subscribe", channel: "updates" });

// ... later
await session.close();
unsubscribe();
```

## 4. GraphQL operation

```typescript
import {
  discoverAndWriteGraphQLSchema,
  runGraphQL,
} from "@powerduck/openapi-request/graphql";

const config = {
  endpoint: "https://api.example.com/graphql",
  headers: { Authorization: `Bearer ${token}` },
};

// Introspect, generate operations, and write them into OpenAPI.
await discoverAndWriteGraphQLSchema(config);

// Execute a query.
const data = await runGraphQL(config, "GetUser", { id: "42" });
console.log(data);
```

## 5. MCP tool call (HTTP and stdio)

```typescript
import { createManualSession } from "@powerduck/openapi-request";

// Streamable HTTP
const httpSession = createManualSession({
  protocol: "mcp",
  transport: "http",
  url: "https://mcp.example.com/mcp",
  headers: { Authorization: `Bearer ${token}` },
});

// stdio child process
const stdioSession = createManualSession({
  protocol: "mcp",
  transport: "stdio",
  command: "node",
  args: ["./mcp-server.js"],
});

await httpSession.open();
await httpSession.send({ tool: "get_user", arguments: { id: "42" } });
await httpSession.close();
```

## 6. gRPC unary call

```typescript
import { grpcCall } from "@powerduck/openapi-request/grpc";

const result = await grpcCall({
  address: "grpc.example.com:50051",
  service: "helloworld.Greeter",
  method: "SayHello",
  protoPaths: ["./protos/helloworld.proto"],
  metadata: { "x-tenant": "acme" },
  deadlineMs: 5000,
});

console.log(result.messages); // decoded response(s)
console.log(result.status);   // { code, codeName, details }
```

The same call drives server-streaming, client-streaming and bidi by passing `options.messages` and limits such as `maxMessages`, `idleTimeoutMs` and `maxSessionMs`. For a long-lived stream, use `createGrpcManualSession()` instead.

## 7. Response write-back

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
    mergeExamples: true,
  },
);
```

### Infer schema and sample from response

```typescript
import { inferSchema, sampleFromSchema } from "@powerduck/openapi-request";

// Infer a JSON Schema from the response body
const schema = inferSchema(result.response.body);

// Generate a realistic sample from the schema
const sample = sampleFromSchema(schema);
```

## See also

- [Quickstart](./quickstart.md)
- [API Reference](./api-reference.md)
- [Configuration](./configuration.md)
