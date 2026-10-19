---
sidebar_position: 4
title: "配置"
description: "@powerduck/openapi-mcp-server 完整配置：ServerConfig、SecurityContext、ExecutionContext、TransportMode，以及来源、状态、协议、日志级别和请求体编码的字面量联合类型。"
---

# 配置

核心配置对象是 `ServerConfig`，由 `startAdminServer()` 接收。相关上下文类型用于工具执行过程。

## `ServerConfig`

只有 `port` 是必填项。

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `port` | `number` | —（必填） | 监听的 TCP 端口，取值为 0–65535 的整数。 |
| `host` | `string` | `"127.0.0.1"` | 监听的网络接口；默认使用回环地址，避免意外对外暴露。 |
| `apiKey` | `string` | undefined | 设置后，管理 API 和 HTTP 传输均要求使用此共享密钥。 |
| `specPath` | `string` | undefined | 启动时加载一次的规范。 |
| `baseUrlOverride` | `string` | undefined | 覆盖从 `servers[0].url` 获取的上游基础 URL。 |
| `upstreamHeaders` | `Record<string, string>` | undefined | 合并到每个上游请求中的请求头。 |
| `requestTimeoutMs` | `number` | undefined | 每个上游请求的超时时间，单位为毫秒。 |
| `persistState` | `boolean` | `true` | 持久化已加载的规范，使其在重启后保留。 |
| `stateFilePath` | `string` | undefined | 持久化状态文件的位置。 |
| `allowedOrigins` | `string[]` | undefined | 允许的 CORS 来源；为空或省略时禁用跨域访问。 |
| `allowedHosts` | `string[]` | undefined | 允许的 `Host` 请求头值。 |
| `maxLogEntries` | `number` | 200 | 内存中保留的日志条目数量上限。 |
| `redactSensitiveHeaders` | `boolean` | `true` | 记录日志前，对敏感请求头的值进行脱敏。 |
| `redactHeaderNames` | `string[]` | undefined | 除内置列表外，还需脱敏的请求头名称。 |
| `security` | `SecurityContext` | undefined | 每次工具调用时转发给上游 API 的凭据。 |

## `SecurityContext`

| 字段 | 类型 | 发送形式 |
| --- | --- | --- |
| `bearerToken` | `string` | `Authorization: Bearer <token>` |
| `basicAuth` | `{ username, password }` | `Authorization: Basic <base64>` |
| `apiKeys` | `Record<string, string>` | 精确的请求头名称与值的键值对。 |

凭据由执行器注入，绝不会作为面向模型的工具参数暴露。

## `ExecutionContext`

传入 `executeToolCall`、由 `ContextProvider` 返回的单次调用上下文：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `baseUrlOverride` | `string` | 覆盖本次调用使用的规范服务器 URL。 |
| `upstreamHeaders` | `Record<string, string>` | 额外的上游请求头。 |
| `requestTimeoutMs` | `number` | 单次调用超时，最小为 1 秒。 |
| `security` | `SecurityContext` | 本次调用的凭据。 |
| `correlationId` | `string` | 关联同一次调用的日志条目。 |
| `protocol` | `ProtocolHint` | 发起调用的传输方式。 |
| `onLog` | `(entry) => void` | 接收请求和响应日志条目；不得抛出异常。 |
| `signal` | `AbortSignal` | 取消正在进行的上游请求。 |

## 字面量联合类型与类型守卫

| 联合类型 | 取值 | 守卫函数 |
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

作为第三个参数传给 `buildMcpServer()`：

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `protocol` | `ProtocolHint` | undefined | 对外声明的协议提示。 |
| `name` | `string` | `"openapi-mcp"` | 对外声明的服务器名称。 |
| `version` | `string` | `"1.1.0"` | 对外声明的服务器版本。 |
| `pageSize` | `number` | 100 | 每次列表响应的条目上限，最多 500 条。 |
| `instructions` | `string` | 内置 | 通过 MCP `instructions` 提供的使用说明。 |

## 传输层选项（`AttachMcpRoutesOptions`）

从 `@powerduck/openapi-mcp-server` 导入 `attachMcpRoutes`，将选项对象作为第二个参数传入。旧版包装函数 `attachSseRoutes()` 只接受位置参数 `(app, specProvider, contextProvider, routeGuard?)`。

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `specProvider` | `SpecProvider` | —（必填） | 为新会话提供文档。 |
| `contextProvider` | `ContextProvider` | —（必填） | 为每次调用提供上游上下文。 |
| `routeGuard` | `RequestHandler` | undefined | 应用于所有 MCP 路由的中间件。 |
| `maxSessions` | `number` | 64 | 并发会话数量上限。 |
| `sessionIdleMs` | `number` | 600000 | 空闲超时时间，单位为毫秒；设为 0 可禁用。 |
| `allowedOrigins` | `string[]` | undefined | 允许的来源；列表非空时启用 DNS 重绑定防护。 |
| `allowedHosts` | `string[]` | undefined | 允许的 `Host` 请求头值。 |
| `enableLegacySse` | `boolean` | `true` | 挂载已弃用的 HTTP+SSE 传输。 |
| `onEvent` | `(event: McpSessionEvent) => void` | undefined | 接收生命周期事件；不得抛出异常。 |

> 这些是 `attachMcpRoutes` 的选项，并非 `ServerConfig` 的额外字段。管理服务器会转发来源和主机设置，但使用传输层默认的会话上限和空闲超时。如需自定义这些限制，请直接调用公开的传输函数。

## 另请参阅

- [API 参考](../api-reference/)
- [示例](../examples/)
