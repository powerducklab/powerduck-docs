---
sidebar_position: 5
title: "API 参考"
description: "@powerduck/openapi-request 主要集成 API 的参考文档"
---

# API 参考

`@powerduck/openapi-request` 主要集成 API 的参考文档。表格概述接口约定；完整的重载与可选参数以包内 TypeScript 声明为准。主入口和协议子路径导出的内容并不完全相同。

## 核心 API

### `createClient(options?): ProtoClient`

创建面向 UI 的客户端。`options` 参数可省略。

**参数：**

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `options` | `CreateClientOptions` | 可选配置 |
| `options.writeBack` | `WriteBackOptions` | 控制响应如何合并回规范 |
| `options.response` | `ToResponseOptions` | 控制响应对象的规范化方式 |

**返回：** 包含以下方法的 `ProtoClient`：

| 方法 | 签名 | 说明 |
| --- | --- | --- |
| `prepare` | `(sendOptions: SendOptions) => PreparedRequest` | 规划请求，返回协议、展示模式和流类型 |
| `send` | `(sendOptions: SendOptions) => Promise<SendResult>` | 执行请求 |
| `sendMany` | `(spec, targets, shared?) => Promise<SendManyResult>` | 批量执行，分别返回各目标的结果；单个失败不会丢弃其他结果 |
| `connect` | `(connectOptions: ManualSessionOptions) => AnyManualSession` | 创建尚未打开的 websocket/mcp/grpc 会话；调用 `open()` 建立连接 |
| `discover` | `(discoverOptions) => Promise<any>` | 发现 MCP 和 gRPC 的能力 |
| `writeback` | `(spec, prepared, result, writeOptions?) => OpenApiDocument` | 将观察到的响应合并回文档 |
| `dispose` | `() => void` | 目前不执行操作；调用方必须自行关闭会话 |
| `probeStreamingResponse` | `(input: RequestInfo \| URL, init?: RequestInit) => Promise<{ ok: boolean; status: number; contentType?: string; kind: "none" \| "sse" \| "ndjson" \| "chunked"; response: Response }>` | 执行 fetch 请求并分类响应；需要读取或取消返回的响应体 |

**示例：**

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

创建用于自动化、脚本和 CI 的脚本化调试器。

**参数：**

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `config` | `DebuggerOptions` | 可选配置 |
| `config.adapters` | `ProtocolAdapter[]` | 自定义适配器列表，替换默认适配器 |
| `config.extraAdapters` | `ProtocolAdapter[]` | 添加到默认列表的额外适配器 |
| `config.writeBack` | `WriteBackOptions` | 回写选项 |
| `config.response` | `ToResponseOptions` | 响应规范化选项 |
| `config.writeBackTruncated` | `boolean` | 回写从截断流推断出的 Schema（默认：true） |

**返回：** 包含 `prepare`、`send`、`sendMany`、`toCollection` 等方法的 `ProtoKit`。

**示例：**

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

创建 WebSocket、MCP 或 gRPC 的长期双工会话。工厂本身不执行 I/O；调用 `open()` 后才建立连接。

**参数：**

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `options.kind` | `"websocket" \| "mcp" \| "grpc"` | 要使用的协议 |
| `options.url` | `string` | WebSocket 连接 URL |
| `options.endpoint` | `string` | MCP Streamable HTTP 端点 |
| `options.transport` | `"streamable-http" \| "stdio"` | MCP 传输方式，默认使用 Streamable HTTP |
| `options.command`, `options.args` | `string`, `string[]` | MCP stdio 的本地可执行程序和参数 |
| `options.address`, `options.service`, `options.method` | `string` | gRPC 地址、完整限定的服务名和方法 |

gRPC 还需要通过 `protoPaths` 或 `reflection` 提供描述符来源。各协议的选项见[配置](./configuration.md)。

**返回：** 带有 `open()`、`send()`、`close()`、`onEvent()`、`waitForClose()`、`events` 和 `state` 的会话。`onEvent()` 返回带有 `unsubscribe()` 的订阅对象。

**示例：**

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

用于管理 `ProtocolAdapter` 实例的注册表。新建注册表为空；除非传入自定义列表替换，否则 `createDebugger()` 会注册内置 HTTP、WebSocket、gRPC、MCP 和 GraphQL 适配器。可通过 `register()`、`unregister()`、`get()`、`list()`、`rank()` 和 `resolve()` 管理选择过程。

### `ProtoKitError`

调试器及核心执行路径抛出的类型化错误。使用 `instanceof ProtoKitError` 区分库错误与其他意外故障。

## 核心类型

### `SendOptions`

`prepare()` 和 `send()` 的主要输入对象，用于传入规范、目标、取值及全部请求级配置。

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `spec` | `OpenApiDocument` | 是 | 完整的 OpenAPI 3.2 文档 |
| `target` | `OperationTarget` | 是 | 操作标识，见下文 |
| `values` | `RequestValues` | 否 | path/query/header/cookie/body 的具体取值 |
| `serverUrl` | `string` | 否 | 覆盖 `spec.servers[0].url` |
| `serverVariables` | `Record<string, string>` | 否 | 服务器 URL 模板变量 |
| `variables` | `Record<string, string>` | 否 | 以 `{{name}}` 引用的环境变量 |
| `globals` | `Record<string, string>` | 否 | Postman 风格的全局变量 |
| `localVariables` | `Record<string, string>` | 否 | 局部变量 |
| `collectionVariables` | `Record<string, string>` | 否 | 集合级变量 |
| `auth` | `AuthConfig` | 否 | 鉴权配置 |
| `scripts` | `ScriptConfig` | 否 | 请求前脚本与测试脚本 |
| `runner` | `RuntimeRunOptions` | 否 | 完整透传 postman-runtime 选项，优先级最高 |
| `websocket` | `WebSocketOptions` | 否 | WebSocket 专用选项 |
| `graphql` | `GraphQLOptions` | 否 | GraphQL 专用选项 |
| `mcp` | `McpOptions` | 否 | MCP 专用选项 |
| `grpc` | `any` | 否 | gRPC 专用选项 |
| `timeout` | `number` | 否 | 单次请求超时，单位毫秒，是 `runner.timeout.request` 的便捷写法 |

`SendOptions` 还接受以下执行与流式控制选项：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `fetch` | `typeof fetch` | 在支持的场景下使用宿主提供的隔离 fetch 传输；HTTP/SSE 仍使用 postman-runtime。 |
| `writeBack` | `boolean` | 设为 `false` 时不生成 `patchedSpec`，但仍生成 `responseFragment`。 |
| `signal` | `AbortSignal` | 取消执行或采样，仍可能返回部分结果。 |
| `maxEvents` | `number` | 最多保留的流事件数量。 |
| `maxStreamMs` | `number` | 流式采样的最长持续时间，单位毫秒。 |
| `maxResponseSize` | `number` | 响应字节数上限。 |
| `maxBufferChars` | `number` | SSE 解析器在事件边界前的缓冲上限，默认 `4194304` 个字符。 |
| `maxEventChars` | `number` | 每个 SSE 事件保留的数据上限，默认 `1048576` 个字符。 |
| `inheritEventId` | `boolean` | 缺少 ID 时继承上一条 SSE 事件 ID，默认 `true`。如需更严格的模式推断，设为 `false`。 |
| `onEvent` | `(event: StreamEvent) => void` | 接收流事件。 |
| `onConsole` | `(log: ConsoleLog) => void` | 接收脚本控制台输出。 |
| `onAssertion` | `(assertion: AssertionResult) => void` | 接收断言结果。 |
| `onResponseStart` | `(info: ResponseStartInfo) => void` | 获取早期 HTTP/SSE 响应头和 `streaming` 分类。 |
| `onOpen` | `(info) => void` | 接收 WebSocket 连接详情：URL、协议和响应头。 |

各协议适配器对限制的解释可能不同。UI 回调应保持轻量；执行层会捕获回调抛出的异常。HTTP 请求器设置使用 `runner.requester`；若指定其中的 `maxResponseSize`，必须为正数，不能为零。

### `OperationTarget`

定位单个操作。建议使用 `operationId` 或 `method` + `path` 中的一种；同时提供时，`operationId` 优先。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `operationId` | `string` | 另一种查找键，优先于路径和方法 |
| `method` | `string` | HTTP 方法，不区分大小写；必须同时提供 `path`。 |
| `path` | `string` | 模板路径，例如 `/users/{id}`；必须同时提供 `method`。 |

### `RequestValues`

注入生成请求中的具体值。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `path` | `Record<string, unknown>` | 路径参数值 |
| `query` | `Record<string, unknown>` | 查询参数值 |
| `header` | `Record<string, unknown>` | 请求头值 |
| `cookie` | `Record<string, unknown>` | Cookie 值 |
| `querystring` | `string` | 原始且已编码的查询字符串，适用于 OpenAPI 3.2 的 `querystring` 位置 |
| `body` | `unknown` | 请求体 |
| `contentType` | `string` | 操作声明多个媒体类型时，强制指定请求媒体类型 |

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

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `type` | `AuthConfig["type"]` | 鉴权类型 |
| `token` | `string` | Bearer 令牌，用于 `type: "bearer"` |
| `username` | `string` | Basic 鉴权用户名，用于 `type: "basic"` |
| `password` | `string` | Basic 鉴权密码，用于 `type: "basic"` |
| `key` | `string` | API 密钥名称，用于 `type: "apikey"` |
| `value` | `string` | API 密钥值，用于 `type: "apikey"` |
| `in` | `"header" \| "query"` | API 密钥位置，用于 `type: "apikey"` |

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

高级鉴权类型包括 `digest`、`oauth1`、`oauth2`、`jwt`、`hawk`、`aws4`、`ntlm`、`asap` 和 `edgegrid`。通过 `parameters: Record<string, string | boolean | number>` 传递这些类型在 HTTP/SSE/GraphQL 中使用的 Postman 辅助字段。可选的 `oauth2: OAuth2FlowConfig` 为 OAuth 2.0 类型启用令牌获取和刷新；不要假定每种鉴权辅助方式都适用于所有协议。

### `PreparedRequest`

由 `createClient().prepare()` 返回。调试器的规划结果不同：`createDebugger().prepare()` 返回包含 `located`、`adapter` 和 `plan` 的 `PlanResult`。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `protocol` | `string` | 解析出的协议（http、websocket、grpc、graphql、mcp） |
| `transport` | `string` | 解析出的传输方式 |
| `target` | `OperationTarget` | 原始目标 |
| `operation` | `any` | 解析出的 OpenAPI 操作对象 |
| `display.mode` | `DisplayMode` | `"response" \| "event-list" \| "duplex-session"` |
| `stream.kind` | `StreamKind` | 流分类（见下文） |
| `stream.expected` | `boolean` | 是否预期为流式响应 |
| `openapi.extensions` | `Record<string, unknown>` | 解析出的 OpenAPI 扩展 |
| `warnings` | `string[]` | 规划过程中出现的警告 |

### `StreamKind`

完整的流类型分类：`"none" | "sse" | "ndjson" | "chunked" | "websocket" | "graphql-stream" | "grpc-unary" | "grpc-server-stream" | "grpc-client-stream" | "grpc-bidi" | "mcp-http-stream" | "mcp-stdio"`

## OpenAPI 辅助函数

| 导出项 | 签名 | 说明 |
| --- | --- | --- |
| `locateOperation` | `(spec, target) => LocatedOperation` | 通过 `OperationTarget` 解析操作 |
| `inferSchema` | `(value) => Schema` | 从单个观察值推断 JSON Schema |
| `inferSchemaFromMany` | `(values) => Schema` | 推断覆盖多个观察值的 Schema |
| `mergeSchema` | `(a, b) => Schema` | 合并两个推断出的 Schema（联合或组合） |
| `sampleFromSchema` | `(schema) => unknown` | 为 Schema 生成贴近实际的示例值 |
| `toResponseObject` | `(result, options?) => { statusCode: string; response: any }` | 从观察结果生成 OpenAPI 响应对象 |
| `writeBackResponse` | `(spec, path, method, fragment, options?) => spec` | 将观察到的响应合并回文档 |

导出的类型：`LocatedOperation`、`WriteBackOptions`、`ToResponseOptions`。

## HTTP / SSE

以下名称可从主入口导入。`@powerduck/openapi-request/http` 子路径导出 `HttpAdapter`、`SseParser`、`buildCollection`、`buildEnvironment`、`resolveServerUrl`、`buildRunOptions` 和 `runWithPostman`；检测辅助函数和 `BUILTIN_CAPTURE_TEST` 请从主入口导入。

| 导出项 | 说明 |
| --- | --- |
| `HttpAdapter` | HTTP/HTTPS 的默认协议适配器 |
| `SseParser` | 将 SSE 字节流转换为结构化事件的流式解析器 |
| `isStreamingOperation` | 根据声明的内容类型判断操作是否流式传输 |
| `isSseContentType` | 判断内容类型是否表示 SSE |
| `isStreamingContentType` | 判断内容类型是否表示流式传输 |
| `acceptHeaderFor` | 为操作生成合适的 Accept 请求头 |
| `probeStreamingResponse` | 执行 fetch 请求并分类响应；需要读取或取消返回的响应体 |
| `BUILTIN_CAPTURE_TEST` | 用于捕获最后一次响应的内置 Postman 测试脚本 |

## WebSocket

从 `@powerduck/openapi-request/ws` 导入。

| 导出项 | 说明 |
| --- | --- |
| `WebSocketAdapter` | WebSocket 目标的协议适配器 |
| `createWsManualSession` | 创建双工 WebSocket 手动会话，别名为 `runWebSocketSession`、`wsManualSession` |

## GraphQL

从 `@powerduck/openapi-request/graphql` 导入。

| 导出项 | 说明 |
| --- | --- |
| `GraphQLAdapter` | GraphQL 目标的协议适配器 |
| `resolveGraphQLConfig` | 从操作解析 GraphQL 配置 |
| `runGraphQL` | 执行 GraphQL 操作 |
| `introspectSchema` | 内省 GraphQL 端点的 Schema |
| `INTROSPECTION_QUERY` | 标准 GraphQL 内省查询 |
| `generateOperation` | 从内省得到的 GraphQL Schema 及字段生成查询文档 |
| `generateAllOperations` | 为内省得到的 GraphQL Schema 各字段生成查询文档 |
| `writeGraphQLOperations` | 将生成的 GraphQL 操作回写到规范 |
| `discoverAndWriteGraphQLSchema` | 发现 GraphQL Schema 并写入规范 |

## MCP（模型上下文协议）

下列大多数条目可从 `@powerduck/openapi-request/mcp` 导入。`initializeMcpSession` 从主入口导入，其在子路径中的名称是 `initializeSession`。子路径还导出 `runMcp`、`createMcpSessionCore` 和 `createMcpStdioConnection`。

| 导出项 | 说明 |
| --- | --- |
| `McpAdapter` | MCP 目标的协议适配器 |
| `createMcpManualSession` | 创建 MCP 手动会话，别名为 `mcpManualSession` |
| `createMcpStdioSession` | 创建基于 stdio 的 MCP 会话 |
| `runMcpManualSession` | 已弃用，请使用 `createMcpManualSession` |
| `resolveMcpConfig` | 从操作解析 MCP 配置 |
| `initializeMcpSession` | 初始化 MCP 会话，原名为 `initializeSession` |
| `discoverMcpCapabilities` | 发现 MCP 服务器能力 |
| `MCP_PROTOCOL_VERSION` | 支持的 MCP 协议版本 |
| `generateMcpCall` | 生成单个 MCP 工具调用 |
| `generateAllMcpCalls` | 生成全部 MCP 工具调用 |
| `writeMcpOperations` | 将 MCP 操作回写到规范 |
| `discoverAndWriteMcpCapabilities` | 发现 MCP 能力并写入规范 |
| `createHttpMcpTransport` | 创建 MCP 的 HTTP 传输 |
| `createStdioMcpTransport` | 创建 MCP 的 stdio 传输 |

## gRPC

从 `@powerduck/openapi-request/grpc` 导入底层发现、调用和描述符辅助函数。`GrpcProtocolAdapter`、`createGrpcManualSession`、`grpcManualSession`、`grpcDiscover` 和 `discoverGrpc` 从主入口导入；子路径中的发现函数名为 `discover`。子路径还提供 `discoverFromCatalog`、`describeMethod` 和 `describeFromCatalog`，可复用服务目录，避免为每个方法重复反射。

| 导出项 | 说明 |
| --- | --- |
| `GrpcProtocolAdapter` | 面向 OpenAPI 的 gRPC 协议适配器 |
| `GrpcAdapter` | 底层 gRPC 适配器 |
| `grpcDiscover` / `discoverGrpc` | 发现 gRPC 服务与方法 |
| `createGrpcManualSession` / `grpcManualSession` | 创建 gRPC 手动会话 |
| `grpcCall` | 执行一次 gRPC 调用 |
| `resolveMethod` | 解析 gRPC 方法描述符 |
| `buildMessageTemplate` | 从描述符创建消息模板 |
| `buildCatalog` | 创建服务与方法目录 |
| `LOADER_OPTIONS` | 默认 proto 加载器选项 |
| `scanProtoFiles` | 扫描目录中的 proto 文件 |
| `deriveIncludeDirsDetailed` | 从 proto 文件路径推导包含目录 |
| `fetchDescriptorSet` | 通过 gRPC 反射获取描述符集 |
| `fetchFullDescriptorSet` | 获取包含所有依赖的完整描述符集 |
| `listServices` | 列出描述符集中的服务 |
| `listServicesDetailed` | 列出服务及详细方法信息 |
| `serializeDescriptorSet` | 将描述符集序列化为字节 |
| `decodeFileDescriptorProto` | 解码单个文件描述符 proto |
| `decodeFileDescriptorSet` | 解码文件描述符集 |
| `buildCredentials` | 构建 gRPC 凭据（同步） |
| `buildCredentialsAsync` | 构建 gRPC 凭据（异步） |
| `buildCredentialsChecked` | 校验并构建凭据（同步） |
| `buildCredentialsCheckedAsync` | 校验并构建凭据（异步） |
| `loadGrpc` | 动态加载 `@grpc/grpc-js` 包 |
| `isGrpcAvailable` | 检查 gRPC 依赖是否可用 |
| `requireCapability` | 要求指定 gRPC 能力，不可用时抛出错误 |

主入口导出类型别名 `GrpcDiscoveryResult`、`GrpcDiscoveredMethod` 和 `GrpcDiscoveredService`。gRPC 子路径中的对应名称为 `DiscoveryResult`、`DiscoveredMethod` 和 `DiscoveredService`。

错误类型：`ReflectionProtocolError`、`ReflectionUnavailableError`、`DescriptorDecodeError`、`GrpcDependencyBrokenError`、`GrpcDependencyMissingError`。

## 其他工具

主入口还导出 OAuth 2.0 辅助函数 `resolveOAuth2Token`、`acquireOAuth2Token`、`isOAuth2TokenExpired`、`oauth2RefreshStatuses` 和 `authFromOAuth2Token`；克隆工具 `toCloneable`；基类 `UnifiedSession`；以及 gRPC 回写辅助函数 `writeGrpcOperations` 和 `discoverAndWriteGrpcOperations`。

## 子路径导出

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
