---
title: "保存请求与协议示例"
description: "Powerduck 将本地调试请求与对外发布的接口契约分开管理。"
---

# 保存请求与协议示例

Powerduck 将本地调试请求与对外发布的接口契约分开管理。

| 操作 | 结果 |
| --- | --- |
| URL 栏保存 | 保存当前请求的本地调试配置，不修改 OpenAPI 文档。 |
| 快捷请求：保存到规范 | 将操作添加到选定文档和文件夹。 |
| 规范请求：更新到规范 | 更新契约前显示目标方法、路径和定义预览。 |
| 文档保存 / Cmd+S 或 Ctrl+S | 将当前 OpenAPI 文档写入磁盘。在快捷请求标签页中，该快捷键保存当前快捷请求。 |

本地请求包含所选服务器、URL、方法、参数值、请求体、脚本及传输设置。编辑期间，规范请求草稿保留在内存中；点击 URL 栏保存后，将以 `powerduck.debug.v1:` 为前缀持久化到应用的渲染进程存储中。条目按文档 ID、路径和方法隔离。清除浏览器或桌面应用数据会清除这些本地状态；导出 OAS 文件不会包含它们。此存储**不是加密密钥库**：请求 URL、请求头和请求体中的凭据应使用环境引用，而非直接写入明文。鉴权控件通过独立的凭据持久化路径保存。

`x-powerduck-request` **不是官方契约扩展**。“保存到规范”和“更新到规范”不会输出它，也不应使用它描述方法、参数、请求体或响应。仅打开文档不会改写其他操作中已经存在的该扩展。

## 显式更新定义

“更新到规范”会预览目标方法和路径，并保留现有响应及模式。参数定义仅在主动选择后更新，调试参数值不会复制。JSON 请求体也只有在明确勾选后才会作为示例加入。常见凭据字段会被排除，但**发布前仍须检查任意文本和示例**。脚本和鉴权覆盖值不属于契约字段。

修改方法或路径不能覆盖已存在的目标操作。本地操作引用会随之调整。`PURGE` 等自定义方法存放于 `paths./cache.additionalOperations.PURGE`，需要 OpenAPI 3.2。预览会说明这一要求，应用更新时将文档版本设为 3.2.0。还应确认下游工具支持该版本。

仍可通过“编辑文档”修改协议模式。这属于显式的定义编辑；发送或保存调试请求不会悄悄重写协议模式。

## 官方可下载示例

这些是持续维护的**示例定义**，不是 Powerduck 的公共 API 服务。所有端点都指向需要您自行提供的本地服务。导入文件不会启动服务、自动连接或授予凭据。

- [全部协议](https://www.powerduck.com/docs/examples/protocols/all-protocols.yaml)
- [HTTP 与自定义 PURGE](https://www.powerduck.com/docs/examples/protocols/http.yaml)
- [SSE](https://www.powerduck.com/docs/examples/protocols/sse.yaml)
- [WebSocket](https://www.powerduck.com/docs/examples/protocols/websocket.yaml)
- [GraphQL](https://www.powerduck.com/docs/examples/protocols/graphql.yaml)
- [gRPC](https://www.powerduck.com/docs/examples/protocols/grpc.yaml) 与 [echo.proto](https://www.powerduck.com/docs/examples/protocols/echo.proto)
- [MCP Streamable HTTP](https://www.powerduck.com/docs/examples/protocols/mcp.yaml)
- [A2A 1.0 JSON-RPC](https://www.powerduck.com/docs/examples/protocols/a2a.yaml)

使用 gRPC 时，将 `echo.proto` 下载到 YAML 文件旁，必要时在客户端中选择其实际本地路径。服务器须在 50051 端口实现 `powerduck.examples.Echo/Echo`。其他示例同样需要匹配的服务器；这些文件并非实时后端验证的演示。

## 契约扩展参考

每个操作都有常规 OAS 方法、operationId、summary 和 responses。非 HTTP 绑定使用 OAS 操作作为文档定位点；gRPC 示例中的 `post` 并不表示将 gRPC 转成了 REST 端点。

| 扩展 | 含义及示例使用的字段 |
| --- | --- |
| `x-protocol` | `sse`、`websocket`、`graphql`、`grpc`、`mcp` 或 `a2a`。HTTP 可省略。 |
| `x-session` | 声明长连接协议会话；示例在 WebSocket 和 MCP 中使用。 |
| `x-websocket` | `url`、可选的 `subprotocols`、`headers` 及 `messages`。每条已记录的消息包含 `id`、`name`、`type`、`body`、`requestSchema`、`responseSchema`。请求头中不要保存凭据。 |
| `x-graphql` | `endpoint`、`query`、`operationName`、`variablesSchema`、可公开的 `variables`、`responseSchema`。 |
| `x-grpc` | `address`、`service`、`method`、`kind`、`reflection`、`protoPaths`、`includeDirs` 及文档中的 `messages`。`kind` 支持 unary/server_streaming/client_streaming/bidi_streaming。本地 proto 路径取决于具体部署。 |
| `x-mcp` | `transport`、`endpoint`、`method`，以及对应方法的 `name`、`argumentsSchema`、可公开的 `arguments`、`responseSchema`。资源操作使用 `uri`；不要混合无关方法的字段。 |
| `x-a2a` | 显式的 `version`、`binding`、`endpoint`、`method`、`requestSchema`、`responseSchema` 和可公开的 `example`。0.3 与 1.0 的载荷不同，参见 [A2A](./a2a.md)。 |
| `x-response-stream` | 可选的 GraphQL 流式意图声明，仅在实际服务器和传输支持流式时使用。普通 GraphQL 请求不需要。 |

SSE 使用标准的 `responses.200.content.text/event-stream.itemSchema` 描述每个事件的载荷。HTTP 使用标准参数、requestBody、responses 和安全方案。不要自行添加 `x-sse` 配置块，也不要将调试状态存为契约扩展。

示例提供所选绑定的完整可用配置，而不是罗列所有互斥选项。MCP stdio 需要单独配置本地可执行程序；这些可下载示例有意不自动启动它。

## 包集成

桌面 UI 负责本地调试状态持久化和显式的规范写入。`@powerduck/openapi-parser` 已通过 `additionalOperations` 读取自定义方法；`@powerduck/tree` 和 `@powerduck/oas-document` 使用这一契约结构。`@powerduck/openapi-request` 独立于规范接收运行时参数。执行请求不需要 `x-powerduck-request`。

此次保存职责分离没有引入新的公共 npm 参数。契约数据继续使用现有协议扩展，当前调试值则传给请求执行 API。不要让导出器、生成器或 MCP 工具依赖私有的请求状态封装。
