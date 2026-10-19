---
sidebar_position: 4
title: "配置"
description: "配置分为三层：客户端或调试器工厂选项、传给 prepare() 和 send() 的 SendOptions 对象，以及各协议专用选项。"
---

# 配置

配置分为三层：客户端或调试器工厂选项、传给 `prepare()` 和 `send()` 的 `SendOptions` 对象，以及各协议专用选项。

## 工厂选项

### `CreateClientOptions`

传给 `createClient(options?)`，所有字段均可选。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `writeBack` | `WriteBackOptions` | 控制响应如何合并回规范 |
| `response` | `ToResponseOptions` | 控制响应对象的规范化方式 |

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

传给 `createDebugger(config?)`，所有字段均可选。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `adapters` | `ProtocolAdapter[]` | 自定义适配器列表，替换全部默认适配器 |
| `extraAdapters` | `ProtocolAdapter[]` | 追加到默认注册表的适配器 |
| `writeBack` | `WriteBackOptions` | 回写选项 |
| `response` | `ToResponseOptions` | 响应规范化选项 |
| `writeBackTruncated` | `boolean` | 回写从截断流推断出的模式，默认为 `true` |

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

### 回写与捕获示例

`WriteBackOptions` 支持 `strategy`（`"merge"` 或 `"replace"`，默认 `"merge"`）、`keepExistingDescription`（默认 `true`）、`allowedStatusCodes`（空表示全部）、`protectComponentRefs`（默认 `true`）、`overwriteExamples`（默认 `true`）和 `requirePassingTests`。发送流程会检查测试结果；直接调用 `writeBackResponse` 不会执行这项检查。

`ToResponseOptions` 支持 `includeExamples`（默认 `true`）、`maxExampleChars`（默认 `4000`）和 `maxEventPreviewChars`（默认 `200`）。请禁用示例捕获，或在发布前检查捕获的示例：实际响应可能包含凭据或个人数据。

发送流程通常在 `patchedSpec` 中返回修改后的副本，不修改输入文档，也不保存文件。为单次调用设置 `writeBack: false` 可跳过此步骤。工厂的 `writeBack` 对象配置合并方式；单次调用的布尔值决定是否执行回写。

## `SendOptions`

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

### `ScriptConfig`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `collectionPreRequest` | `ScriptSource \| ScriptSource[]` | 集合级请求前脚本 |
| `collectionTest` | `ScriptSource \| ScriptSource[]` | 集合级测试脚本 |
| `preRequest` | `ScriptSource \| ScriptSource[]` | 请求级请求前脚本 |
| `test` | `ScriptSource \| ScriptSource[]` | 请求级测试脚本 |
| `fromSpecExtensions` | `boolean` | 读取规范中的 `x-postman-scripts`，默认为 `true` |
| `captureLastResponse` | `boolean` | 追加内置辅助脚本，让后续请求可访问最近一次响应 |

`ScriptSource`:
```typescript
interface ScriptSource {
  exec: string | string[];  // Script body, either a single string or array of lines
  id?: string;               // Optional identifier surfaced in script results
}
```

如果不打算执行导入规范中嵌入的脚本，请设置 `scripts.fromSpecExtensions: false`。当前默认值为 `true`，不要依赖将来可能变更的默认值。

## 协议专用选项

### HTTP / SSE

HTTP 是默认适配器。声明 `text/event-stream` 表示 SSE 意图；执行时也会在收到响应头后对实际响应分类。`probeStreamingResponse()` 是需要显式调用的独立探测，并不是每次调用都会自动执行的前置步骤。

基础 HTTP 请求无需额外配置。高级 postman-runtime 配置使用 `SendOptions.runner`。

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

默认 MCP 手动会话使用 Streamable HTTP 和 `endpoint`。使用 stdio 时，传入 `kind: "mcp"`、`transport: "stdio"`、本地 `command` 及可选 `args`；启动会话会启动配置的进程。

### gRPC

gRPC 需要地址、描述符来源（`.proto` 文件或服务器反射），以及完整限定的服务名和方法名：

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

手动会话工厂返回尚未打开的会话。发送前调用 `open()`，清理时调用 `close()`。gRPC 示例需要匹配的本地服务器和 proto 文件；手动会话选项与 `SendOptions.grpc` 不是同一对象。

## 完整示例

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

## 后续步骤

- 查看 [API 参考](./api-reference.md)，了解全部导出类型
- 浏览[示例](./examples.md)，了解各协议用法
