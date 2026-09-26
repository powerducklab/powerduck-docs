---
sidebar_position: 5
title: "API Reference"
description: "Complete API reference for @powerduck/openapi-mcp-server v1.3.0: spec loading, tool/prompt/resource generation, request building and execution, MCP server and transports, admin server, auth, service registry, and the openapi-mcp CLI."
keywords: ["api reference", "generateTools", "buildMcpServer", "startStdioServer", "startAdminServer", "openapi-mcp"]
---

# API Reference

Every public export of `@powerduck/openapi-mcp-server` v1.3.0, grouped by area.

## Spec loading

| Export | Signature | Description |
| --- | --- | --- |
| `loadOpenApiSpec(filePath)` | `(string) => Promise<Oas32Document>` | Read a JSON or YAML file, validate, dereference and assert unique operation IDs. YAML detected by `.ya?ml` extension. |
| `parseSpecContent(rawText, isYaml)` | `(string, boolean) => Promise<Oas32Document>` | Parse a document from a string. Throws on empty/invalid input. |

## Tool generation

| Export | Signature | Description |
| --- | --- | --- |
| `generateTools(spec)` | `(spec) => Tool[]` | Generate MCP `Tool` definitions for every operation. |
| `generateToolsDetailed(spec)` | `(spec) => GenerateToolsResult` | Return `{ tools, bindings, issues }`. |
| `buildBindingIndex(spec)` | `(spec) => Map<string, ToolBinding>` | Map generated tool names to their `ToolBinding` (alias of `getBindingIndex`). |

Type exports: `ToolBinding`, `GeneratedToolWithBinding` (the package's alias for `GeneratedTool`).

## Prompts and resources

| Export | Signature | Description |
| --- | --- | --- |
| `generatePrompts(spec)` | `(spec) => GeneratedPrompt[]` | List all generated prompts. |
| `resolvePrompt(spec, name, args?)` | `(spec, string, Record?) => GetPromptResult \| null` | Resolve a prompt by name; `null` when unknown. |
| `generateResources(spec)` | `(spec) => GeneratedResource[]` | List catalog resources. |
| `readResource(spec, uri)` | `(spec, string) => ResourceContentItem \| null` | Read one resource by URI. |

## Request building and execution

| Export | Signature | Description |
| --- | --- | --- |
| `buildRequest(baseUrl, templatePath, pathItem, operation, args, binding?)` | `=> BuiltRequest` | Serialize arguments into `{ url, query, headers, body, dropped }`. Positional arguments. |
| `executeToolCall(spec, toolName, args, context?)` | `(spec, string, Record?, ExecutionContext?) => Promise<ToolCallResult>` | Execute a generated tool against the upstream API. Non-2xx is returned as data; transport failures throw. |

`ToolCallResult` fields: `status`, `statusText`, `headers`, `data`, `truncated`, `url`, `method`, `durationMs`, `correlationId`.

## Spec utilities

| Export | Description |
| --- | --- |
| `iterateOperations(spec, issues?)` | Generator yielding every resolved operation (includes OpenAPI 3.2 `additionalOperations`). |
| `collectOperationParameters(pathItem, operation, issues?, context?)` | Merge path-item and operation parameters keyed by `(name, in)`. |
| `normalizeParameter(candidate)` | Normalize a raw parameter; `null` when unusable. |
| `synthesizeOperationId(method, pathTemplate)` | Deterministic fallback id when an operation omits `operationId`. |
| `ensureUniqueName(candidate, taken)` | Append a numeric suffix to keep a name unique. |
| `extractPathTemplateVariables(pathTemplate)` | Extract `{name}` variables, de-duplicated by first appearance. |
| `effectiveStyle(parameter)` | Apply spec-default `style`. |
| `effectiveExplode(parameter)` | Apply spec-default `explode`. |
| `findOperationById(spec, operationId)` | O(1) lookup after first build; `null` when unknown. |
| `findDuplicateOperationIds(spec)` | Report author-declared duplicate ids. |
| `assertUniqueOperationIds(spec)` | Throw on duplicate operation ids. |
| `isPlainObject(value)` | Narrow to a plain object. |
| `truncateGeneratedName(name, limit=64)` | Shorten a name while preserving uniqueness. |

Type exports: `OperationEntry`, `DuplicateOperationId`.

## MCP server and transports

| Export | Signature | Description |
| --- | --- | --- |
| `buildMcpServer(specProvider, contextProvider?, options?)` | Builds an SDK `Server` wiring tools/prompts/resources handlers. Positional. |
| `startStdioServer(spec, context?, options?)` | Serve one document over stdio; returns `{ closed, close() }`. |
| `attachSseRoutes(app, specProvider, contextProvider?, routeGuard?)` | Mount Streamable HTTP (`/mcp`) and legacy SSE (`/sse`) routes on an Express app. Returns `{ activeSessionCount, closeAll }`. |

Types: `SpecProvider = () => Document | null`, `ContextProvider = () => ExecutionContext`.

> For session limits (`maxSessions`), CORS origins (`allowedOrigins`), idle
> reaping (`sessionIdleMs`), DNS-rebinding protection, and the fuller route
> handle (`listSessions`, `closeSession`, `closeAll`, `dispose`), use
> [`startAdminServer`](#admin-server-and-auth-server-subpath) which wraps the
> internal `attachMcpRoutes` with all of those options. `attachMcpRoutes`
> itself is an internal implementation detail and is not exported from the
> package root.

## Admin server and auth (`./server` subpath)

Import from `@powerduck/openapi-mcp-server/server`.

| Export | Signature | Description |
| --- | --- | --- |
| `startAdminServer(config: ServerConfig)` | `Promise<AdminServerHandle>` | Start the Express admin app with Web UI + MCP routes. Returns `{ app, server, port, close() }`. |
| `createAuthMiddleware(apiKey?)` | `RequestHandler` | Bearer / `x-api-key` guard. Omit the key to disable. Positional. |

## Runtime and utilities

| Export | Description |
| --- | --- |
| `ServiceRegistry` | Class of `ManagedServiceRecord`s: `upsert`, `list`, `get`, `remove`, `clear`, `start`, `stop`, `fail`. |
| `isAbortError(error)` | True for `AbortError` / axios `CanceledError`. |
| `newId()` | UUID, with a timestamped fallback. |

## CLI

Binary **`openapi-mcp`**. Single command `serve`:

```
openapi-mcp serve [options]
```

| Option | Default | Description |
| --- | --- | --- |
| `--port <n>` | `3000` | HTTP port (web transport). |
| `--host <host>` | `127.0.0.1` | HTTP host. |
| `--transport <mode>` | `web` | `stdio` or `web`. |
| `--spec <path>` | — | OpenAPI file path (required in stdio mode). |
| `--base-url <url>` | — | Override upstream base URL. |
| `--api-key <key>` | — | Admin API key. |
| `--upstream-header "Name: value"` | — | Repeatable upstream header. |
| `--timeout <ms>` | `30000` | Upstream timeout. |
| `--no-persist` | — | Disable state persistence. |

## Types (re-exported from `types`)

`ServerConfig`, `SecurityContext`, `AppState`, `PersistedState`, `ExecutionContext`, `TransportMode`, `SpecSource`, `ServiceStatus`, `ProtocolHint`, `LogDirection`, `LogLevel`, `ParameterLocation`, `BodyEncoding`, `ServiceEndpointInfo`, `ManagedServiceRecord`, `SpecIssue`, `AdminStatus`, `GeneratedPrompt`, `GeneratedResource`, `GeneratedTool`, `ResourceContentItem`, `PromptMessageShape`, `ResolvedPrompt` (deprecated), `RequestLogEntry`, `LogQueryOptions`, `LogQueryResult`, and the guards (`isSpecSource`, `isServiceStatus`, `isProtocolHint`, `isParameterLocation`, `isBodyEncoding`, `isPlainRecord`).

## Errors and behaviour

- Unknown tool/prompt/resource ids are MCP `InvalidParams` errors, not in-band failures.
- A missing spec while a session is active surfaces as an `InternalError`.
- Upstream 4xx/5xx are returned to the model as `isError: true` content (not thrown); only transport-level failures (DNS, TLS, timeout, abort) throw.

## See also

- [Configuration](./configuration.md)
- [Examples](./examples.md)
