---
sidebar_position: 5
title: "API Reference"
description: "API reference for @powerduck/openapi-request: clients, sessions, request types, response write-back, and protocol entry points."
keywords: ["api reference", "createClient", "createDebugger", "createManualSession", "SendOptions", "adapter", "openapi-request"]
---

# API Reference

Reference for the main integration APIs of `@powerduck/openapi-request`. The tables summarize contracts; the package TypeScript declarations are the complete source for overloads and optional parameters. Main-entry exports and protocol subpath exports are not identical.

## Core

### `createClient(options?): ProtoClient`

Builds the UI-first client. The `options` argument is optional.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `options` | `CreateClientOptions` | Optional configuration |
| `options.writeBack` | `WriteBackOptions` | Control how responses are merged back into the spec |
| `options.response` | `ToResponseOptions` | Control how response objects are normalized |

**Returns:** `ProtoClient` with the following methods:

| Method | Signature | Description |
| --- | --- | --- |
| `prepare` | `(sendOptions: SendOptions) => PreparedRequest` | Plan a request; returns protocol, display mode, and stream kind |
| `send` | `(sendOptions: SendOptions) => Promise<SendResult>` | Execute a request |
| `sendMany` | `(spec, targets, shared?) => Promise<SendManyResult>` | Batch execution; per-target results, failures never discard siblings |
| `connect` | `(connectOptions: ManualSessionOptions) => AnyManualSession` | Create an unopened session for websocket/mcp/grpc; call `open()` to connect |
| `discover` | `(discoverOptions) => Promise<any>` | Discover capabilities for MCP and gRPC |
| `writeback` | `(spec, prepared, result, writeOptions?) => OpenApiDocument` | Merge observed response back into the document |
| `dispose` | `() => void` | Currently a no-op; callers must close their sessions |
| `probeStreamingResponse` | `(input: RequestInfo \| URL, init?: RequestInit) => Promise<{ ok: boolean; status: number; contentType?: string; kind: "none" \| "sse" \| "ndjson" \| "chunked"; response: Response }>` | Perform a fetch request and classify its response; consume or cancel the returned response body |

**Example:**

```typescript
import { createClient } from "@powerduck/openapi-request";

const client = createClient({
  writeBack: { overwriteExamples: true },
});

const plan = client.prepare({
  spec,
  target: { operationId: "getUserById" },
});

const result = await client.send({
  spec,
  target: { operationId: "getUserById" },
  values: { path: { id: "42" } },
});
```

### `createDebugger(config?): ProtoKit`

Builds the scripted debugger for automation, scripts, and CI.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `config` | `DebuggerOptions` | Optional configuration |
| `config.adapters` | `ProtocolAdapter[]` | Custom adapter list (replaces defaults) |
| `config.extraAdapters` | `ProtocolAdapter[]` | Extra adapters added to the defaults |
| `config.writeBack` | `WriteBackOptions` | Write-back options |
| `config.response` | `ToResponseOptions` | Response normalization options |
| `config.writeBackTruncated` | `boolean` | Write back schema inferred from truncated streams (default: true) |

**Returns:** `ProtoKit` with `prepare`, `send`, `sendMany`, `toCollection`, and more.

**Example:**

```typescript
import { createDebugger } from "@powerduck/openapi-request";

const dbg = createDebugger({
  writeBackTruncated: true,
});

const result = await dbg.send({
  spec,
  target: { operationId: "getUserById" },
  values: { path: { id: "42" } },
  serverUrl: "https://api.example.com",
});
```

### `createManualSession(options): AnyManualSession`

Creates a long-lived duplex session for WebSocket, MCP, and gRPC. The factory performs no I/O; connect lazily with `open()`.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `options.kind` | `"websocket" \| "mcp" \| "grpc"` | Protocol to use |
| `options.url` | `string` | WebSocket connection URL |
| `options.endpoint` | `string` | MCP Streamable HTTP endpoint |
| `options.transport` | `"streamable-http" \| "stdio"` | MCP transport; default is Streamable HTTP |
| `options.command`, `options.args` | `string`, `string[]` | Local executable and arguments for MCP stdio |
| `options.address`, `options.service`, `options.method` | `string` | gRPC address, fully-qualified service and method |

For gRPC, also provide a descriptor source through `protoPaths` or `reflection`. Protocol-specific options are listed in [Configuration](./configuration.md).

**Returns:** A session with `open()`, `send()`, `close()`, `onEvent()`, `waitForClose()`, `events`, and `state`. `onEvent()` returns a subscription with `unsubscribe()`.

**Example:**

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "websocket",
  url: "wss://api.example.com/ws",
});

const subscription = session.onEvent((event) => {
  console.log(event.kind, event.data);
});
try {
  await session.open();
  await session.send({ type: "message", data: "hello" });
} finally {
  await session.close();
  subscription.unsubscribe();
}
```

### `AdapterRegistry`

A registry of `ProtocolAdapter` instances. A new registry starts empty; `createDebugger()` registers the built-in HTTP, WebSocket, gRPC, MCP, and GraphQL adapters unless a custom list replaces them. Use `register()`, `unregister()`, `get()`, `list()`, `rank()`, and `resolve()` to manage selection.

### `ProtoKitError`

The typed error thrown by the debugger and core paths. Use `instanceof ProtoKitError` to distinguish library errors from unexpected failures.

## Core Types

### `SendOptions`

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

### `PreparedRequest`

Returned by `createClient().prepare()`. The debugger has a different planning result: `createDebugger().prepare()` returns `PlanResult` with `located`, `adapter`, and `plan`.

| Field | Type | Description |
| --- | --- | --- |
| `protocol` | `string` | Resolved protocol (http, websocket, grpc, graphql, mcp) |
| `transport` | `string` | Resolved transport |
| `target` | `OperationTarget` | The original target |
| `operation` | `any` | The resolved OpenAPI operation object |
| `display.mode` | `DisplayMode` | `"response" \| "event-list" \| "duplex-session"` |
| `stream.kind` | `StreamKind` | Streaming classification (see below) |
| `stream.expected` | `boolean` | Whether streaming is expected |
| `openapi.extensions` | `Record<string, unknown>` | Resolved OpenAPI extensions |
| `warnings` | `string[]` | Warnings encountered during planning |

### `StreamKind`

Precise streaming taxonomy: `"none" | "sse" | "ndjson" | "chunked" | "websocket" | "graphql-stream" | "grpc-unary" | "grpc-server-stream" | "grpc-client-stream" | "grpc-bidi" | "mcp-http-stream" | "mcp-stdio"`

## OpenAPI Helpers

| Export | Signature | Description |
| --- | --- | --- |
| `locateOperation` | `(spec, target) => LocatedOperation` | Resolve an operation by `OperationTarget` |
| `inferSchema` | `(value) => Schema` | Infer a JSON Schema from a single observed value |
| `inferSchemaFromMany` | `(values) => Schema` | Infer a schema that covers several observed values |
| `mergeSchema` | `(a, b) => Schema` | Merge two inferred schemas (union/combination) |
| `sampleFromSchema` | `(schema) => unknown` | Produce a realistic example value for a schema |
| `toResponseObject` | `(result, options?) => { statusCode: string; response: any }` | Build an OpenAPI response object from an observed result |
| `writeBackResponse` | `(spec, path, method, fragment, options?) => spec` | Merge an observed response back into the document |

Type exports: `LocatedOperation`, `WriteBackOptions`, `ToResponseOptions`.

## HTTP / SSE

The following names are available from the main entry. The `@powerduck/openapi-request/http` subpath exports `HttpAdapter`, `SseParser`, `buildCollection`, `buildEnvironment`, `resolveServerUrl`, `buildRunOptions`, and `runWithPostman`; import detection helpers and `BUILTIN_CAPTURE_TEST` from the main entry.

| Export | Description |
| --- | --- |
| `HttpAdapter` | The default protocol adapter for HTTP/HTTPS |
| `SseParser` | Streaming parser that turns an SSE byte stream into structured events |
| `isStreamingOperation` | Classify an operation as streaming from declared content types |
| `isSseContentType` | Check if a content type indicates SSE |
| `isStreamingContentType` | Check if a content type indicates any streaming |
| `acceptHeaderFor` | Generate the appropriate Accept header for an operation |
| `probeStreamingResponse` | Perform a fetch request and classify its response; consume or cancel the returned response body |
| `BUILTIN_CAPTURE_TEST` | Built-in Postman test script for capturing the last response |

## WebSocket

Import from `@powerduck/openapi-request/ws`.

| Export | Description |
| --- | --- |
| `WebSocketAdapter` | Protocol adapter for WebSocket targets |
| `createWsManualSession` | Build a duplex WebSocket manual session (also aliased as `runWebSocketSession`, `wsManualSession`) |

## GraphQL

Import from `@powerduck/openapi-request/graphql`.

| Export | Description |
| --- | --- |
| `GraphQLAdapter` | Protocol adapter for GraphQL targets |
| `resolveGraphQLConfig` | Resolve GraphQL configuration from an operation |
| `runGraphQL` | Execute a GraphQL operation |
| `introspectSchema` | Introspect a GraphQL endpoint's schema |
| `INTROSPECTION_QUERY` | The standard GraphQL introspection query |
| `generateOperation` | Generate a query document from an introspected GraphQL schema and field |
| `generateAllOperations` | Generate query documents for the fields of an introspected GraphQL schema |
| `writeGraphQLOperations` | Write generated GraphQL operations back into the spec |
| `discoverAndWriteGraphQLSchema` | Discover and write a GraphQL schema into the spec |

## MCP (Model Context Protocol)

Most entries below are available from `@powerduck/openapi-request/mcp`. Import `initializeMcpSession` from the main entry; the subpath names it `initializeSession`. The subpath also exposes `runMcp`, `createMcpSessionCore`, and `createMcpStdioConnection`.

| Export | Description |
| --- | --- |
| `McpAdapter` | Protocol adapter for MCP targets |
| `createMcpManualSession` | Build an MCP manual session (also aliased as `mcpManualSession`) |
| `createMcpStdioSession` | Build an MCP session over stdio |
| `runMcpManualSession` | Deprecated: use `createMcpManualSession` |
| `resolveMcpConfig` | Resolve MCP configuration from an operation |
| `initializeMcpSession` | Initialize an MCP session (aliased from `initializeSession`) |
| `discoverMcpCapabilities` | Discover MCP server capabilities |
| `MCP_PROTOCOL_VERSION` | The supported MCP protocol version |
| `generateMcpCall` | Generate a single MCP tool call |
| `generateAllMcpCalls` | Generate all MCP tool calls |
| `writeMcpOperations` | Write MCP operations back into the spec |
| `discoverAndWriteMcpCapabilities` | Discover and write MCP capabilities into the spec |
| `createHttpMcpTransport` | Create an HTTP transport for MCP |
| `createStdioMcpTransport` | Create a stdio transport for MCP |

## gRPC

Import low-level discovery, invocation and descriptor helpers from `@powerduck/openapi-request/grpc`. Import `GrpcProtocolAdapter`, `createGrpcManualSession`, `grpcManualSession`, `grpcDiscover`, and `discoverGrpc` from the main entry; the subpath uses `discover` for discovery. The subpath also provides `discoverFromCatalog`, `describeMethod`, and `describeFromCatalog` so you can reuse a catalog instead of repeating reflection for each method.

| Export | Description |
| --- | --- |
| `GrpcProtocolAdapter` | Protocol adapter for gRPC targets (OpenAPI-facing) |
| `GrpcAdapter` | Low-level gRPC adapter |
| `grpcDiscover` / `discoverGrpc` | Discover gRPC services and methods |
| `createGrpcManualSession` / `grpcManualSession` | Build a gRPC manual session |
| `grpcCall` | Execute a single gRPC call |
| `resolveMethod` | Resolve a gRPC method descriptor |
| `buildMessageTemplate` | Build a message template from a descriptor |
| `buildCatalog` | Build a catalog of services and methods |
| `LOADER_OPTIONS` | Default proto loader options |
| `scanProtoFiles` | Scan directories for proto files |
| `deriveIncludeDirsDetailed` | Derive include directories from proto file paths |
| `fetchDescriptorSet` | Fetch a descriptor set via gRPC reflection |
| `fetchFullDescriptorSet` | Fetch a full descriptor set with all dependencies |
| `listServices` | List services from a descriptor set |
| `listServicesDetailed` | List services with detailed method information |
| `serializeDescriptorSet` | Serialize a descriptor set to bytes |
| `decodeFileDescriptorProto` | Decode a single file descriptor proto |
| `decodeFileDescriptorSet` | Decode a file descriptor set |
| `buildCredentials` | Build gRPC credentials (synchronous) |
| `buildCredentialsAsync` | Build gRPC credentials (asynchronous) |
| `buildCredentialsChecked` | Build credentials with validation (synchronous) |
| `buildCredentialsCheckedAsync` | Build credentials with validation (asynchronous) |
| `loadGrpc` | Dynamically load the `@grpc/grpc-js` package |
| `isGrpcAvailable` | Check if gRPC dependencies are available |
| `requireCapability` | Require a specific gRPC capability, throwing if unavailable |

The main entry exports the type aliases `GrpcDiscoveryResult`, `GrpcDiscoveredMethod`, and `GrpcDiscoveredService`. The gRPC subpath names them `DiscoveryResult`, `DiscoveredMethod`, and `DiscoveredService`.

Error types: `ReflectionProtocolError`, `ReflectionUnavailableError`, `DescriptorDecodeError`, `GrpcDependencyBrokenError`, `GrpcDependencyMissingError`.

## Additional utilities

The main entry also exports OAuth 2.0 helpers: `resolveOAuth2Token`, `acquireOAuth2Token`, `isOAuth2TokenExpired`, `oauth2RefreshStatuses`, and `authFromOAuth2Token`; the clone utility `toCloneable`; the `UnifiedSession` base class; and gRPC write-back helpers `writeGrpcOperations` and `discoverAndWriteGrpcOperations`.

## Subpath Exports

```typescript
// Main integration entry
import { createClient, createDebugger } from "@powerduck/openapi-request";

// Protocol-specific entries
import { HttpAdapter } from "@powerduck/openapi-request/http";
import { WebSocketAdapter } from "@powerduck/openapi-request/ws";
import { GrpcAdapter } from "@powerduck/openapi-request/grpc";
import { McpAdapter } from "@powerduck/openapi-request/mcp";
import { GraphQLAdapter } from "@powerduck/openapi-request/graphql";
```
