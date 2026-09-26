---
sidebar_position: 4
title: "Configuration"
description: "Configuration for @powerduck/openapi-request: CreateClientOptions, DebuggerOptions, SendOptions, RequestValues, AuthConfig, and per-protocol options for HTTP, WebSocket, gRPC, MCP and GraphQL."
keywords: ["configuration", "CreateClientOptions", "DebuggerOptions", "SendOptions", "RequestValues", "AuthConfig", "openapi-request"]
---

# Configuration

Configuration is split into three layers: client/debugger factory options, the `SendOptions` object passed to `prepare()` and `send()`, and per-protocol options.

## Factory Options

### `CreateClientOptions`

Passed to `createClient(options?)`. All fields are optional.

| Field | Type | Description |
| --- | --- | --- |
| `writeBack` | `WriteBackOptions` | Control how responses are merged back into the spec |
| `response` | `ToResponseOptions` | Control how response objects are normalized |

```typescript
import { createClient } from "@powerduck/openapi-request";

const client = createClient({
  writeBack: {
    mergeExamples: true,
    // ... other WriteBackOptions
  },
  response: {
    preserveOriginalBody: false,
    // ... other ToResponseOptions
  },
});
```

### `DebuggerOptions`

Passed to `createDebugger(config?)`. All fields are optional.

| Field | Type | Description |
| --- | --- | --- |
| `adapters` | `ProtocolAdapter[]` | Custom adapter list (replaces all defaults) |
| `extraAdapters` | `ProtocolAdapter[]` | Extra adapters added to the default registry |
| `writeBack` | `WriteBackOptions` | Write-back options |
| `response` | `ToResponseOptions` | Response normalization options |
| `writeBackTruncated` | `boolean` | Write back schema inferred from truncated streams (default: `true`) |

```typescript
import { createDebugger, HttpAdapter, WebSocketAdapter } from "@powerduck/openapi-request";

// Use only HTTP and WebSocket adapters
const debugger1 = createDebugger({
  adapters: [new HttpAdapter(), new WebSocketAdapter()],
});

// Add a custom adapter to the defaults
const debugger2 = createDebugger({
  extraAdapters: [new MyCustomAdapter()],
  writeBackTruncated: true,
});
```

## `SendOptions`

The primary input object for `prepare()` and `send()`. This is where you pass the spec, target, values, and all request-level configuration.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `spec` | `OpenApiDocument` | Yes | The complete OpenAPI 3.2 document |
| `target` | `OperationTarget` | Yes | Operation identifier (see below) |
| `values` | `RequestValues` | No | Concrete values for path/query/header/cookie/body |
| `serverUrl` | `string` | No | Overrides `spec.servers[0].url` |
| `serverVariables` | `Record<string, string>` | No | Server URL template variables |
| `variables` | `Record<string, string>` | No | Environment variables referenced as `{{name}}` |
| `globals` | `Record<string, string>` | No | Postman-style globals |
| `localVariables` | `Record<string, string>` | No | Local variables |
| `auth` | `AuthConfig` | No | Authentication configuration |
| `scripts` | `ScriptConfig` | No | Pre-request and test scripts |
| `runner` | `RuntimeRunOptions` | No | Full postman-runtime option passthrough (highest precedence) |
| `websocket` | `WebSocketOptions` | No | WebSocket-specific options |
| `graphql` | `GraphQLOptions` | No | GraphQL-specific options |
| `mcp` | `McpOptions` | No | MCP-specific options |
| `grpc` | `any` | No | gRPC-specific options |
| `timeout` | `number` | No | Per-request timeout in ms (convenience shortcut for `runner.timeout.request`) |

### `OperationTarget`

Identifies a single operation. Use `operationId` OR `method` + `path` (not both).

| Field | Type | Description |
| --- | --- | --- |
| `operationId` | `string` | Alternative lookup key; takes precedence over path + method |
| `method` | `string` | HTTP method, case-insensitive. Requires `path`. |
| `path` | `string` | Templated path, e.g. `/users/{id}`. Requires `method`. |

```typescript
// By operationId (recommended)
const result1 = await client.send({
  spec,
  target: { operationId: "getUserById" },
});

// By method + path
const result2 = await client.send({
  spec,
  target: { method: "GET", path: "/users/{id}" },
});
```

### `RequestValues`

Concrete values injected into the generated request.

| Field | Type | Description |
| --- | --- | --- |
| `path` | `Record<string, unknown>` | Path parameter values |
| `query` | `Record<string, unknown>` | Query parameter values |
| `header` | `Record<string, unknown>` | Header values |
| `cookie` | `Record<string, unknown>` | Cookie values |
| `querystring` | `string` | Raw, pre-encoded query string (OpenAPI 3.2 `querystring` location) |
| `body` | `unknown` | Request body |
| `contentType` | `string` | Force a specific request media type when the operation declares several |

```typescript
const result = await client.send({
  spec,
  target: { operationId: "updateUser" },
  values: {
    path: { id: "42" },
    query: { version: "2" },
    header: { "X-Request-Id": "abc-123" },
    body: { name: "Alice", email: "alice@example.com" },
    contentType: "application/json",
  },
});
```

### `AuthConfig`

| Field | Type | Description |
| --- | --- | --- |
| `type` | `"bearer" \| "basic" \| "apikey" \| "none"` | Auth type |
| `token` | `string` | Bearer token (for `type: "bearer"`) |
| `username` | `string` | Basic auth username (for `type: "basic"`) |
| `password` | `string` | Basic auth password (for `type: "basic"`) |
| `key` | `string` | API key name (for `type: "apikey"`) |
| `value` | `string` | API key value (for `type: "apikey"`) |
| `in` | `"header" \| "query"` | API key location (for `type: "apikey"`) |

```typescript
// Bearer token
const result1 = await client.send({
  spec,
  target: { operationId: "getUser" },
  auth: { type: "bearer", token: "your-jwt-token" },
});

// Basic auth
const result2 = await client.send({
  spec,
  target: { operationId: "getUser" },
  auth: { type: "basic", username: "admin", password: "secret" },
});

// API key in header
const result3 = await client.send({
  spec,
  target: { operationId: "getUser" },
  auth: { type: "apikey", key: "X-API-Key", value: "key-123", in: "header" },
});
```

### `ScriptConfig`

| Field | Type | Description |
| --- | --- | --- |
| `collectionPreRequest` | `ScriptSource \| ScriptSource[]` | Collection-level pre-request scripts |
| `collectionTest` | `ScriptSource \| ScriptSource[]` | Collection-level test scripts |
| `preRequest` | `ScriptSource \| ScriptSource[]` | Request-level pre-request scripts |
| `test` | `ScriptSource \| ScriptSource[]` | Request-level test scripts |
| `fromSpecExtensions` | `boolean` | Read `x-postman-scripts` from the spec (default: `true`) |
| `captureLastResponse` | `boolean` | Append built-in helper exposing last response to later requests |

`ScriptSource`:
```typescript
interface ScriptSource {
  exec: string | string[];  // Script body, either a single string or array of lines
  id?: string;               // Optional identifier surfaced in script results
}
```

## Protocol-Specific Options

### HTTP / SSE

HTTP is the default adapter. Streaming is detected automatically from declared `text/event-stream` content type (SSE) or by probing live response headers with `probeStreamingResponse()`.

No additional configuration is required for basic HTTP requests. Use `SendOptions.runner` for advanced postman-runtime configuration.

### WebSocket

```typescript
const session = createManualSession({
  protocol: "websocket",
  url: "wss://api.example.com/ws",
  // WebSocketOptions can be passed through SendOptions.websocket
});
```

### MCP

```typescript
const session = createManualSession({
  protocol: "mcp",
  transport: "http",  // or "stdio"
  url: "https://api.example.com/mcp",
});
```

### gRPC

gRPC requires an address plus a descriptor source (`.proto` files or server reflection), and a fully-qualified service and method:

```typescript
const session = createManualSession({
  protocol: "grpc",
  url: "grpc.example.com:50051",
  // gRPC options passed through SendOptions.grpc
});
```

## Complete Example

```typescript
import { createClient } from "@powerduck/openapi-request";

const client = createClient({
  writeBack: { mergeExamples: true },
});

const result = await client.send({
  spec: openApiDocument,
  target: { operationId: "updateUser" },
  values: {
    path: { id: "42" },
    query: { verbose: "true" },
    header: { "X-Request-Id": "req-abc" },
    body: { name: "Alice", email: "alice@example.com" },
  },
  serverUrl: "https://api.staging.example.com",
  auth: { type: "bearer", token: "staging-token" },
  timeout: 10000,
  variables: {
    environment: "staging",
  },
});

console.log(result.response.status);
console.log(result.response.body);
console.log(result.response.headers);
```

## Next Steps

- See [API Reference](./api-reference.md) for all exported types
- Browse [Examples](./examples.md) for protocol-specific recipes
