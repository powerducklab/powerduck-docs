---
sidebar_position: 5
title: "API Reference"
description: "Complete API reference for @powerduck/openapi-request v0.2.4: createClient, createDebugger, createManualSession, OpenAPI helpers, and HTTP, WebSocket, GraphQL, MCP and gRPC adapters with all type exports."
keywords: ["api reference", "createClient", "createDebugger", "createManualSession", "SendOptions", "adapter", "openapi-request"]
---

# API Reference

Every public export of `@powerduck/openapi-request` v0.2.4, grouped by surface area. All signatures are verified against the source.

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
| `connect` | `(connectOptions: ManualSessionOptions) => AnyManualSession` | Open a long-lived session for websocket/mcp/grpc |
| `discover` | `(discoverOptions) => Promise<any>` | Discover capabilities for MCP and gRPC |
| `writeback` | `(spec, prepared, result, writeOptions?) => OpenApiDocument` | Merge observed response back into the document |
| `dispose` | `() => void` | Release resources (sessions are owned by callers) |
| `probeStreamingResponse` | `(response) => StreamKind` | Inspect a live fetch Response to determine streaming kind |

**Example:**

```typescript
import { createClient } from "@powerduck/openapi-request";

const client = createClient({
  writeBack: { mergeExamples: true },
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

const debugger = createDebugger({
  writeBackTruncated: true,
});

const result = await debugger.send({
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
| `options.protocol` | `"websocket" \| "mcp" \| "grpc"` | Protocol to use |
| `options.url` | `string` | Connection URL |
| `options.transport` | `"http" \| "stdio"` | For MCP: transport type (default: "http") |

**Returns:** A session object with `open()`, `send()`, `close()`, `subscribe()`, and `state`.

**Example:**

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  protocol: "websocket",
  url: "wss://api.example.com/ws",
});

await session.open();
const unsubscribe = session.subscribe((event) => {
  console.log(event.type, event.data);
});
await session.send({ type: "message", data: "hello" });
await session.close();
unsubscribe();
```

### `AdapterRegistry`

A registry of `ProtocolAdapter` instances. The default registry wires in the built-in HTTP, WebSocket, gRPC, MCP, and GraphQL adapters.

### `ProtoKitError`

The typed error thrown by the debugger and core paths. Use `instanceof ProtoKitError` to distinguish library errors from unexpected failures.

## Core Types

### `SendOptions`

The primary input object for `prepare()` and `send()`.

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
| `timeout` | `number` | No | Per-request timeout in ms (convenience shortcut) |

### `OperationTarget`

Identifies a single operation. Use `operationId` OR `method` + `path`.

| Field | Type | Description |
| --- | --- | --- |
| `operationId` | `string` | Alternative lookup key; takes precedence over path + method |
| `method` | `string` | HTTP method, case-insensitive. Requires `path`. |
| `path` | `string` | Templated path, e.g. `/users/{id}`. Requires `method`. |

### `RequestValues`

User-supplied values injected into the generated request.

| Field | Type | Description |
| --- | --- | --- |
| `path` | `Record<string, unknown>` | Path parameter values |
| `query` | `Record<string, unknown>` | Query parameter values |
| `header` | `Record<string, unknown>` | Header values |
| `cookie` | `Record<string, unknown>` | Cookie values |
| `querystring` | `string` | Raw, pre-encoded query string (OpenAPI 3.2) |
| `body` | `unknown` | Request body |
| `contentType` | `string` | Force a specific request media type |

### `AuthConfig`

| Field | Type | Description |
| --- | --- | --- |
| `type` | `"bearer" \| "basic" \| "apikey" \| "none"` | Auth type |
| `token` | `string` | Bearer token |
| `username` | `string` | Basic auth username |
| `password` | `string` | Basic auth password |
| `key` | `string` | API key name |
| `value` | `string` | API key value |
| `in` | `"header" \| "query"` | API key location |

### `PreparedRequest`

Returned by `prepare()`.

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
| `toResponseObject` | `(result, options?) => ResponseObject` | Build an OpenAPI response object from an observed result |
| `writeBackResponse` | `(spec, path, method, fragment, options?) => spec` | Merge an observed response back into the document |

Type exports: `LocatedOperation`, `WriteBackOptions`, `ToResponseOptions`.

## HTTP / SSE

Import from the main entry or `@powerduck/openapi-request/http`.

| Export | Description |
| --- | --- |
| `HttpAdapter` | The default protocol adapter for HTTP/HTTPS |
| `SseParser` | Streaming parser that turns an SSE byte stream into structured events |
| `isStreamingOperation` | Classify an operation as streaming from declared content types |
| `isSseContentType` | Check if a content type indicates SSE |
| `isStreamingContentType` | Check if a content type indicates any streaming |
| `acceptHeaderFor` | Generate the appropriate Accept header for an operation |
| `probeStreamingResponse` | Inspect a live fetch Response to determine streaming kind |
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
| `generateOperation` | Generate a single GraphQL operation from OpenAPI |
| `generateAllOperations` | Generate all GraphQL operations from an OpenAPI document |
| `writeGraphQLOperations` | Write generated GraphQL operations back into the spec |
| `discoverAndWriteGraphQLSchema` | Discover and write a GraphQL schema into the spec |

## MCP (Model Context Protocol)

Import from `@powerduck/openapi-request/mcp`.

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

Import from `@powerduck/openapi-request/grpc`.

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

Type exports: `GrpcDiscoveryResult`, `GrpcDiscoveredMethod`, `GrpcDiscoveredService`.

Error types: `ReflectionProtocolError`, `ReflectionUnavailableError`, `DescriptorDecodeError`, `GrpcDependencyBrokenError`, `GrpcDependencyMissingError`.

## Subpath Exports

```typescript
// Main entry (everything)
import { createClient, createDebugger } from "@powerduck/openapi-request";

// Protocol-specific entries
import { HttpAdapter } from "@powerduck/openapi-request/http";
import { WebSocketAdapter } from "@powerduck/openapi-request/ws";
import { GrpcAdapter } from "@powerduck/openapi-request/grpc";
import { McpAdapter } from "@powerduck/openapi-request/mcp";
import { GraphQLAdapter } from "@powerduck/openapi-request/graphql";
```
