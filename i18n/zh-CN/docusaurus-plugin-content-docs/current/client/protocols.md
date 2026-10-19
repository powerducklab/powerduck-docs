---
sidebar_position: 5
title: 协议
description: "使用 x-protocol 扩展及其确切配置形态，在一份 OpenAPI 文档中为 HTTP、SSE、WebSocket、GraphQL、gRPC 和 MCP / A2A 建模。"
---

# 协议

真实系统并非只支持 REST。Powerduck 使用 `x-protocol` 扩展在普通 OpenAPI 路径项上为七种协议建模，让流式和 RPC 操作与 HTTP 存在于同一份规范中，而不是在单独工具里跟踪——或被悄悄转换成 REST。

每个非 HTTP 操作仍是一个带 HTTP 方法和 `responses."200".description` 的普通路径项：

- `graphql`、`grpc` 和 `mcp`, `a2a` 使用 **post**；
- `sse` 和 `websocket` 通常使用 **get**；
- `http` 是默认值，省略 `x-protocol`。

## SSE

基于 HTTP 的服务器发送事件使用 `x-protocol: "sse"`。流式媒体类型为 `text/event-stream`，用 `itemSchema`（而非 `schema`）描述单个事件载荷：

```yaml
paths:
  /events:
    get:
      x-protocol: sse
      responses:
        "200":
          description: Event stream
          content:
            text/event-stream:
              itemSchema:
                type: object
                properties:
                  type:
                    type: string
                  data:
                    type: string
```

## WebSocket

WebSocket 使用 `x-protocol: "websocket"`，带一个 `x-websocket` 块。URL 必须以 `ws://` 或 `wss://` 开头：

```yaml
paths:
  /ws:
    get:
      x-protocol: websocket
      x-websocket:
        url: wss://example.com/ws
        subprotocols: []
        headers: {}
      responses:
        "200":
          description: Operation response
```

`subprotocols` 和 `headers` 是可选的。

## GraphQL

GraphQL 在形如 `/graphql/query/fieldName` 的路径上使用 post，带 `x-graphql`。端点必须是绝对 HTTP(S) URL，且 query 为必填：

```yaml
paths:
  /graphql/query/product:
    post:
      x-protocol: graphql
      x-graphql:
        endpoint: https://example.com/graphql
        query: query Product($id: ID!) { product(id: $id) { id name } }
        operationName: Product
        variablesSchema:
          type: object
        variables: {}
      responses:
        "200":
          description: Operation response
```

`operationName`、`variablesSchema` 和 `variables` 是可选的。

## gRPC

gRPC 在形如 `/grpc/pkg.Service/Method` 的路径上使用 post，带 `x-grpc`。当服务器支持反射时设置 `reflection: true`；否则提供 `protoPaths`（以及可选的 `includeDirs`）：

```yaml
paths:
  /grpc/products.ProductService/GetProduct:
    post:
      x-protocol: grpc
      x-grpc:
        address: host:port
        service: products.ProductService
        method: GetProduct
        kind: unary
        reflection: true
      responses:
        "200":
          description: Operation response
```

`kind` 为 `unary`、`server_streaming`、`client_streaming` 或 `bidi_streaming` 之一。

## MCP

MCP 默认使用 Streamable HTTP，在形如 `/mcp/tools/tool-name` 的路径上使用 post，带一个 `x-mcp` 块：

```yaml
paths:
  /mcp/tools/create-product:
    post:
      x-protocol: mcp
      x-mcp:
        endpoint: http://127.0.0.1:3000/mcp
        transport: streamable-http
        method: tools/call
        name: create-product
        argumentsSchema:
          type: object
        arguments: {}
      responses:
        "200":
          description: Operation response
```

`method` 选择 MCP 操作：`tools/call`、`tools/list`、`resources/read`、`resources/list`、`resources/templates/list`、`prompts/get` 或 `prompts/list`。`name`、`uri`、`argumentsSchema` 和 `arguments` 根据方法适当使用。

## 结构规则

- 对于助手生成的契约，应在 `requestBody` 或 `responses` 的媒体类型中提供 `schema` 或 `$ref`；`text/event-stream` 使用 OAS 3.2 的 `itemSchema` 描述单个事件。这是 Powerduck 的编写约定，不是所有 OpenAPI 文档都必须遵守的通用要求。
- 每个参数必须有 `schema`（或 `content`）。
- 编辑操作时，所选协议及其配置会被**保留**。RPC 和流式操作从不会被悄悄转换成 REST。
- 使用上面的确切扩展形态——不要捏造诸如 `externalUrl` 的键，也不要把 `ws` 用作协议名。

## 为什么这很重要

在一份文档中为全部七种协议建模，意味着无论传输方式如何，设计、调试、Mock、文档和 MCP 都由同一个事实来源驱动。当你让助手添加流式或 RPC 接口时，它会保持协议配置完整，而不是把它拍平成仅支持 REST 的形态。

相关：[用助手进行设计](./design.md)、[数据模型](./data-model.md)。

## A2A

A2A 1.0 支持 JSON-RPC、REST 和桌面端 gRPC 调试、文档，以及无状态消息适配服务端生成。持久任务与推送交付需要自行实现。

使用 `x-protocol: a2a` 与 `x-a2a` 设计、调试和记录智能体消息与任务。A2A 1.0 支持 JSON-RPC、REST 和桌面端 gRPC；0.3 支持 JSON-RPC。参阅 [A2A 智能体](./a2a.md)，了解协议字段、Agent Card 验签、服务端生成与可运行 demo。
