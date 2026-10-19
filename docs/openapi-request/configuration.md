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
    overwriteExamples: true,
    // ... other WriteBackOptions
  },
  response: {
    includeExamples: false,
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

### Write-back and captured examples

`WriteBackOptions` supports `strategy` (`"merge"` or `"replace"`, default `"merge"`), `keepExistingDescription` (default `true`), `allowedStatusCodes` (empty means all), `protectComponentRefs` (default `true`), `overwriteExamples` (default `true`), and `requirePassingTests`. The send pipeline applies the test gate; calling `writeBackResponse` directly does not.

`ToResponseOptions` supports `includeExamples` (default `true`), `maxExampleChars` (default `4000`), and `maxEventPreviewChars` (default `200`). Disable captured examples or review them before publishing: live responses can contain credentials or personal data.

The send pipeline normally returns a modified copy in `patchedSpec`; it does not mutate the input document or save a file. Set per-call `writeBack: false` to skip that step. The factory's `writeBack` object configures merging; the per-call boolean enables or disables it.

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
| `collectionVariables` | `Record<string, string>` | No | Collection-level variables |
| `auth` | `AuthConfig` | No | Authentication configuration |
| `scripts` | `ScriptConfig` | No | Pre-request and test scripts |
| `runner` | `RuntimeRunOptions` | No | Full postman-runtime option passthrough (highest precedence) |
| `websocket` | `WebSocketOptions` | No | WebSocket-specific options |
| `graphql` | `GraphQLOptions` | No | GraphQL-specific options |
| `mcp` | `McpOptions` | No | MCP-specific options |
| `grpc` | `any` | No | gRPC-specific options |
| `timeout` | `number` | No | Per-request timeout in ms (convenience shortcut for `runner.timeout.request`) |

`SendOptions` also accepts these execution and streaming controls:

| Field | Type | Description |
| --- | --- | --- |
| `fetch` | `typeof fetch` | Host-supplied isolated fetch transport where supported; HTTP/SSE still use postman-runtime. |
| `writeBack` | `boolean` | Set to `false` to leave `patchedSpec` undefined while still producing `responseFragment`. |
| `signal` | `AbortSignal` | Cancel execution or sampling; a partial result can still be returned. |
| `maxEvents` | `number` | Maximum retained streaming events. |
| `maxStreamMs` | `number` | Maximum streaming sampling duration in milliseconds. |
| `maxResponseSize` | `number` | Response byte limit. |
| `maxBufferChars` | `number` | SSE parser buffer limit before an event boundary; default `4194304` characters. |
| `maxEventChars` | `number` | Retained data limit per SSE event; default `1048576` characters. |
| `inheritEventId` | `boolean` | Inherit the last SSE event ID when absent; default `true`. Set to `false` for stricter schema inference. |
| `onEvent` | `(event: StreamEvent) => void` | Receive streaming events. |
| `onConsole` | `(log: ConsoleLog) => void` | Receive script console output. |
| `onAssertion` | `(assertion: AssertionResult) => void` | Receive assertion results. |
| `onResponseStart` | `(info: ResponseStartInfo) => void` | Inspect early HTTP/SSE headers and `streaming` classification. |
| `onOpen` | `(info) => void` | Receive WebSocket connection details: URL, protocol and headers. |

Protocol adapters may interpret limits differently. Keep UI callbacks lightweight; throwing callbacks are caught by the execution layer. For HTTP requester settings, use `runner.requester`; its `maxResponseSize` must be positive if provided, not zero.

### `OperationTarget`

Identifies a single operation. Prefer either `operationId` or `method` + `path`. If both are provided, `operationId` takes precedence.

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
| `type` | `AuthConfig["type"]` | Auth type |
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

Advanced auth types are `digest`, `oauth1`, `oauth2`, `jwt`, `hawk`, `aws4`, `ntlm`, `asap`, and `edgegrid`. Pass their HTTP/SSE/GraphQL Postman helper fields through `parameters: Record<string, string | boolean | number>`. The optional `oauth2: OAuth2FlowConfig` enables token acquisition and refresh for the OAuth 2.0 type; do not assume every auth helper applies to every protocol.

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

Set `scripts.fromSpecExtensions: false` when you do not intend to execute scripts embedded in an imported specification. The current default is `true`; do not rely on a future default change.

## Protocol-Specific Options

### HTTP / SSE

HTTP is the default adapter. Declared `text/event-stream` content indicates SSE intent; execution also classifies the live response when headers arrive. `probeStreamingResponse()` is a separate explicit probe, not an automatic prerequisite for every call.

No additional configuration is required for basic HTTP requests. Use `SendOptions.runner` for advanced postman-runtime configuration.

### WebSocket

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "websocket",
  url: "wss://api.example.com/ws",
  // Manual-session options are distinct from SendOptions.websocket.
});
```

### MCP

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "mcp",
  endpoint: "https://api.example.com/mcp",
});
```

The default MCP manual session uses Streamable HTTP and `endpoint`. For stdio, pass `kind: "mcp"`, `transport: "stdio"`, and a local `command` with optional `args`; starting that session launches the configured process.

### gRPC

gRPC requires an address plus a descriptor source (`.proto` files or server reflection), and a fully-qualified service and method:

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "grpc",
  address: "localhost:50051",
  service: "powerduck.examples.Echo",
  method: "Echo",
  protoPaths: ["./echo.proto"],
});
```

Manual session factories return an unopened session. Call `open()` before sending, and `close()` during cleanup. The gRPC example requires a matching local server and proto file; manual-session options are not the same object as `SendOptions.grpc`.

## Complete Example

```typescript
import { createClient } from "@powerduck/openapi-request";

const client = createClient({
  writeBack: { overwriteExamples: true },
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
