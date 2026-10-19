---
sidebar_position: 5
title: "API 参考"
description: "@powerduck/openapi-mcp-server 完整 API 参考：规范加载、工具/提示词/资源生成、请求构建与执行、MCP 服务与传输、管理服务、认证、服务注册表及 CLI。"
---

# API 参考

按功能划分的 `@powerduck/openapi-mcp-server` 全部公开导出接口。

## 规范加载

| 导出接口 | 签名 | 说明 |
| --- | --- | --- |
| `loadOpenApiSpec(filePath)` | `(string) => Promise<Oas32Document>` | 读取 JSON 或 YAML 文件，校验、解析引用并断言操作 ID 唯一。通过 `.ya?ml` 扩展名识别 YAML。 |
| `parseSpecContent(rawText, isYaml)` | `(string, boolean) => Promise<Oas32Document>` | 从字符串解析文档。输入为空或无效时抛出异常。 |

## 工具生成

| 导出接口 | 签名 | 说明 |
| --- | --- | --- |
| `generateTools(spec)` | `(spec) => Tool[]` | 为每个操作生成 MCP `Tool` 定义。 |
| `generateToolsDetailed(spec)` | `(spec) => GenerateToolsResult` | 返回 `{ tools, bindings, issues }`。 |
| `buildBindingIndex(spec)` | `(spec) => Map<string, ToolBinding>` | 将生成的工具名称映射到其 `ToolBinding`，是 `getBindingIndex` 的别名。 |

类型导出：`ToolBinding`、`GeneratedToolWithBinding`（包内 `GeneratedTool` 的别名）。

## 提示词与资源

| 导出接口 | 签名 | 说明 |
| --- | --- | --- |
| `generatePrompts(spec)` | `(spec) => GeneratedPrompt[]` | 列出全部生成的提示词。 |
| `resolvePrompt(spec, name, args?)` | `(spec, string, Record?) => GetPromptResult \| null` | 按名称解析提示词；未知名称返回 `null`。 |
| `generateResources(spec)` | `(spec) => GeneratedResource[]` | 列出目录资源。 |
| `readResource(spec, uri)` | `(spec, string) => ResourceContentItem \| null` | 按 URI 读取一个资源。 |

## 请求构建与执行

| 导出接口 | 签名 | 说明 |
| --- | --- | --- |
| `buildRequest(baseUrl, templatePath, pathItem, operation, args, binding?)` | `=> BuiltRequest` | 将参数序列化为 `{ url, query, headers, body, dropped }`，使用位置参数。 |
| `executeToolCall(spec, toolName, args, context?)` | `(spec, string, Record?, ExecutionContext?) => Promise<ToolCallResult>` | 针对上游 API 执行生成的工具。非 2xx 响应作为数据返回；传输失败会抛出异常。 |

`ToolCallResult` 字段：`status`, `statusText`, `headers`, `data`, `truncated`, `url`, `method`, `durationMs`, `correlationId`。

## 规范工具函数

| 导出接口 | 说明 |
| --- | --- |
| `iterateOperations(spec, issues?)` | 依次产出所有已解析操作的生成器，包含 OpenAPI 3.2 的 `additionalOperations`。 |
| `collectOperationParameters(pathItem, operation, issues?, context?)` | 按 `(name, in)` 合并路径项与操作参数。 |
| `normalizeParameter(candidate)` | 规范化原始参数；不可用时返回 `null`。 |
| `synthesizeOperationId(method, pathTemplate)` | 操作未提供 `operationId` 时，生成确定性的备用 ID。 |
| `ensureUniqueName(candidate, taken)` | 追加数字后缀，确保名称唯一。 |
| `extractPathTemplateVariables(pathTemplate)` | 提取 `{name}` 变量，去重并保留首次出现的顺序。 |
| `effectiveStyle(parameter)` | 应用规范默认的 `style`。 |
| `effectiveExplode(parameter)` | 应用规范默认的 `explode`。 |
| `findOperationById(spec, operationId)` | 首次构建后按 O(1) 复杂度查找；未知 ID 返回 `null`。 |
| `findDuplicateOperationIds(spec)` | 报告作者声明的重复 ID。 |
| `assertUniqueOperationIds(spec)` | 操作 ID 重复时抛出异常。 |
| `isPlainObject(value)` | 将类型收窄为普通对象。 |
| `truncateGeneratedName(name, limit=64)` | 缩短名称并保留唯一性。 |

类型导出：`OperationEntry`、`DuplicateOperationId`。

## MCP 服务与传输

| 导出接口 | 说明 |
| --- | --- |
| `buildMcpServer(specProvider, contextProvider?, options?)` | 创建 SDK `Server` 并连接工具、提示词和资源处理器，使用位置参数。 |
| `startStdioServer(spec, context?, options?)` | 通过 stdio 提供一份文档，返回 `{ closed, close() }`。 |
| `attachMcpRoutes(app, options)` | 挂载 Streamable HTTP（`/mcp`）及可选的旧版 SSE（`/sse`）路由。接收 `AttachMcpRoutesOptions`，返回 `McpRouteHandle`。 |
| `attachSseRoutes(app, specProvider, contextProvider, routeGuard?)` | 已弃用的位置参数包装函数，返回 `{ activeSessionCount, closeAll }`。 |
| `createStreamableSessionHost(options)` | 创建独立的 Streamable HTTP 会话宿主，用于自定义传输集成。 |

类型：`SpecProvider = () => Document | null`, `ContextProvider = () => ExecutionContext`, `AttachMcpRoutesOptions`, `McpRouteHandle`, `StreamableSessionHost`, `StreamableSessionHostOptions`, `McpSessionEvent`, `McpSessionInfo`, `SessionCloseReason`, `SessionKind`。

`attachMcpRoutes` 从包根入口导出。在其选项中配置 `maxSessions`、`allowedOrigins`、`sessionIdleMs` 和 DNS 重绑定防护。句柄提供 `activeSessionCount`、`pendingSessionCount`、`listSessions`、`closeSession`、`closeAll` 和 `dispose`。关闭时调用 `dispose()`，停止后台清理并关闭会话。

## 管理服务与认证（`./server` 子路径） {#admin-server-and-auth-server-subpath}

从 `@powerduck/openapi-mcp-server/server` 或包根入口导入 `startAdminServer`。`createAuthMiddleware` 应从包根入口导入，`./server` 子路径不导出它。

| 导出接口 | 签名 | 说明 |
| --- | --- | --- |
| `startAdminServer(config)` | `Promise<AdminServerHandle>` | 启动带 Web 管理界面和 MCP 路由的 Express 应用，返回 `{ app, server, port, close() }`。 |
| `createAuthMiddleware(apiKey?)` | `RequestHandler` | Bearer 或 `x-api-key` 访问保护。省略密钥可禁用，使用位置参数。 |

## 运行时与工具函数

| 导出接口 | 说明 |
| --- | --- |
| `ServiceRegistry` | 管理 `ManagedServiceRecord` 的类：`upsert`、`list`、`get`、`remove`、`clear`、`start`、`stop`、`fail`。 |
| `isAbortError(error)` | 对于 `AbortError` 或 axios 的 `CanceledError` 返回真。 |
| `newId()` | 生成 UUID，备用方案使用时间戳。 |

## CLI

可执行命令为 **`openapi-mcp`**，仅有一个子命令 `serve`：

```
openapi-mcp serve [options]
```

| 选项 | 默认值 | 说明 |
| --- | --- | --- |
| `--port <n>` | `3000` | HTTP 端口，用于 Web 传输。 |
| `--host <host>` | `127.0.0.1` | HTTP 主机。 |
| `--transport <mode>` | `web` | `stdio` 或 `web`。 |
| `--spec <path>` | — | OpenAPI 文件路径，stdio 模式下必填。 |
| `--base-url <url>` | — | 覆盖上游基础 URL。 |
| `--api-key <key>` | — | 管理 API 密钥。 |
| `--upstream-header "Name: value"` | — | 上游请求头，可重复指定。 |
| `--timeout <ms>` | `30000` | 上游超时。 |
| `--no-persist` | — | 禁用状态持久化。 |

## 类型（从 `types` 重新导出）

`ServerConfig`, `SecurityContext`, `AppState`, `PersistedState`, `ExecutionContext`, `TransportMode`, `SpecSource`, `ServiceStatus`, `ProtocolHint`, `LogDirection`, `LogLevel`, `ParameterLocation`, `BodyEncoding`, `ServiceEndpointInfo`, `ManagedServiceRecord`, `SpecIssue`, `AdminStatus`, `GeneratedPrompt`, `GeneratedResource`, `GeneratedTool`, `ResourceContentItem`, `PromptMessageShape`, `RequestLogEntry`, `LogQueryOptions`, `LogQueryResult`；`ResolvedPrompt` 已弃用。类型守卫：`isSpecSource`, `isServiceStatus`, `isProtocolHint`, `isParameterLocation`, `isBodyEncoding`, `isPlainRecord`。

## 错误与行为

- 未知的工具、提示词或资源 ID 会产生 MCP `InvalidParams` 错误，而非在正常结果中返回失败内容。
- 会话处于活动状态但规范缺失时，产生 `InternalError`。
- 上游 4xx/5xx 响应作为带有 `isError: true` 的内容返回给模型，不抛出异常；只有传输层失败（DNS、TLS、超时、取消）才会抛出异常。

## 另请参阅

- [配置](../configuration/)
- [示例](../examples/)
