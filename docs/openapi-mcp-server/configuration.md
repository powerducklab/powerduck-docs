---
sidebar_position: 4
title: "Configuration"
description: "Complete configuration for @powerduck/openapi-mcp-server: ServerConfig, SecurityContext, ExecutionContext, TransportMode, and the literal unions for sources, statuses, protocols, log levels and body encodings."
keywords: ["configuration", "ServerConfig", "SecurityContext", "ExecutionContext", "TransportMode", "openapi-mcp-server"]
---

# Configuration

The central configuration object is `ServerConfig`, accepted by `startAdminServer()`. Related context types flow into tool execution.

## `ServerConfig`

Only `port` is required.

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `port` | `number` | — (required) | TCP port to bind, integer 0–65535. |
| `host` | `string` | `"127.0.0.1"` | Interface to bind; loopback by default to avoid accidental exposure. |
| `apiKey` | `string` | undefined | Shared secret required by the admin API and HTTP transport when set. |
| `specPath` | `string` | undefined | Specification loaded once at startup. |
| `baseUrlOverride` | `string` | undefined | Overrides the upstream base URL derived from `servers[0].url`. |
| `upstreamHeaders` | `Record<string, string>` | undefined | Headers merged into every upstream request. |
| `requestTimeoutMs` | `number` | undefined | Per-request upstream timeout in milliseconds. |
| `persistState` | `boolean` | `true` | Persist the loaded specification across restarts. |
| `stateFilePath` | `string` | undefined | Location of the persisted state file. |
| `allowedOrigins` | `string[]` | undefined | Allowed CORS origins; empty/omitted disables cross-origin access. |
| `allowedHosts` | `string[]` | undefined | Allowed `Host` header values. |
| `maxLogEntries` | `number` | 200 | Maximum in-memory log entries retained. |
| `redactSensitiveHeaders` | `boolean` | `true` | Redact sensitive header values before logging. |
| `redactHeaderNames` | `string[]` | undefined | Extra header names to redact beyond the built-in list. |
| `security` | `SecurityContext` | undefined | Credentials forwarded to the upstream API for every tool call. |

## `SecurityContext`

| Field | Type | Sent as |
| --- | --- | --- |
| `bearerToken` | `string` | `Authorization: Bearer <token>` |
| `basicAuth` | `{ username, password }` | `Authorization: Basic <base64>` |
| `apiKeys` | `Record<string, string>` | Exact header-name to value pairs. |

Credentials are injected by the executor and are never exposed as model-facing tool arguments.

## `ExecutionContext`

Per-call context passed to `executeToolCall` and returned by a `ContextProvider`:

| Field | Type | Description |
| --- | --- | --- |
| `baseUrlOverride` | `string` | Overrides the spec's server URL for this call. |
| `upstreamHeaders` | `Record<string, string>` | Extra upstream headers. |
| `requestTimeoutMs` | `number` | Per-call timeout (clamped to a 1s minimum). |
| `security` | `SecurityContext` | Per-call credentials. |
| `correlationId` | `string` | Correlates log entries for one invocation. |
| `protocol` | `ProtocolHint` | Transport that initiated the call. |
| `onLog` | `(entry) => void` | Receives request/response log entries; must never throw. |
| `signal` | `AbortSignal` | Cancels an in-flight upstream request. |

## Literal unions and guards

| Union | Values | Guard function |
| --- | --- | --- |
| `TransportMode` | `"stdio" \| "web"` | — |
| `SpecSource` | `"startup-file" \| "upload" \| "paste" \| "runtime"` | `isSpecSource()` |
| `ServiceStatus` | `"running" \| "stopped" \| "error"` | `isServiceStatus()` |
| `ProtocolHint` | `"streamable-http" \| "sse" \| "stdio"` | `isProtocolHint()` |
| `LogDirection` | `"request" \| "response" \| "internal"` | — |
| `LogLevel` | `"debug" \| "info" \| "warn" \| "error"` | — |
| `ParameterLocation` | `"path" \| "query" \| "header" \| "cookie"` | `isParameterLocation()` |
| `BodyEncoding` | `"json" \| "form-urlencoded" \| "multipart" \| "text" \| "binary"` | `isBodyEncoding()` |

## `BuildMcpServerOptions`

Passed as the third argument to `buildMcpServer()`:

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `protocol` | `ProtocolHint` | undefined | Advertised protocol hint. |
| `name` | `string` | `"openapi-mcp"` | Advertised server name. |
| `version` | `string` | `"1.1.0"` | Advertised server version. |
| `pageSize` | `number` | 100 | Max entries per list response (capped at 500). |
| `instructions` | `string` | built-in | Human usage hint exposed via MCP `instructions`. |

## Transport layer options (via `startAdminServer`)

The internal `attachMcpRoutes` function powers the admin server's HTTP transport.
These options are configured through [`ServerConfig`](#serverconfig) fields when
using `startAdminServer()`. The public `attachSseRoutes()` function accepts only
positional `(app, specProvider, contextProvider, routeGuard?)` arguments.

| ServerConfig field | Type | Default | Description |
| --- | --- | --- | --- |
| `maxSessions` (internal) | `number` | 64 | Concurrent session cap. |
| `sessionIdleMs` (internal) | `number` | 600000 | Idle reaper timeout; 0 disables. |
| `allowedOrigins` | `string[]` | undefined | Allowed CORS origins; enables DNS-rebinding protection. |
| `allowedHosts` | `string[]` | undefined | Allowed `Host` header values. |
| `enableLegacySse` (internal) | `boolean` | `true` | Mount the deprecated HTTP+SSE transport. |

> These are implementation details of the admin server. For most use cases,
> `startAdminServer(config)` with the documented `ServerConfig` fields is
> sufficient. `attachMcpRoutes` itself is not exported from the package root.

## See also

- [API Reference](./api-reference)
- [Examples](./examples)
