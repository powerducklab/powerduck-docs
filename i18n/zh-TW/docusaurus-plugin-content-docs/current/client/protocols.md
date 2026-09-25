---
sidebar_position: 5
title: 協定
description: "使用 x-protocol 擴充及其確切配置形態，在一份 OpenAPI 文件中為 HTTP、SSE、WebSocket、GraphQL、gRPC 和 MCP 建模。"
---

# 協定

真實系統並非只支援 REST。Powerduck 使用 `x-protocol` 擴充在普通 OpenAPI 路徑項上為六種協定建模，讓串流和 RPC 操作與 HTTP 存在於同一份規範中，而不是在單獨工具裡追蹤——或被悄悄轉換成 REST。

每個非 HTTP 操作仍是一個帶 HTTP 方法和 `responses."200".description` 的普通路徑項：

- `graphql`、`grpc` 和 `mcp` 使用 **post**；
- `sse` 和 `websocket` 通常使用 **get**；
- `http` 是預設值，省略 `x-protocol`。

## SSE

基於 HTTP 的伺服器發送事件使用 `x-protocol: "sse"`。串流媒體類型為 `text/event-stream`，用 `itemSchema`（而非 `schema`）描述單個事件載荷：

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

WebSocket 使用 `x-protocol: "websocket"`，帶一個 `x-websocket` 區塊。URL 必須以 `ws://` 或 `wss://` 開頭：

```yaml
paths:
  /ws:
    get:
      x-protocol: websocket
      x-websocket:
        url: wss://example.com/ws
        subprotocols: []
        headers: {}
```

`subprotocols` 和 `headers` 是可選的。

## GraphQL

GraphQL 在形如 `/graphql/query/fieldName` 的路徑上使用 post，帶 `x-graphql`。端點必須是絕對 HTTP(S) URL，且 query 為必填：

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
```

`operationName`、`variablesSchema` 和 `variables` 是可選的。

## gRPC

gRPC 在形如 `/grpc/pkg.Service/Method` 的路徑上使用 post，帶 `x-grpc`。當伺服器支援反射時設定 `reflection: true`；否則提供 `protoPaths`（以及可選的 `includeDirs`）：

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
```

`kind` 為 `unary`、`server_streaming`、`client_streaming` 或 `bidi_streaming` 之一。

## MCP

MCP 預設使用 Streamable HTTP，在形如 `/mcp/tools/tool-name` 的路徑上使用 post，帶一個 `x-mcp` 區塊：

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
```

`method` 選擇 MCP 操作：`tools/call`、`tools/list`、`resources/read`、`resources/list`、`resources/templates/list`、`prompts/get` 或 `prompts/list`。`name`、`uri`、`argumentsSchema` 和 `arguments` 根據方法適當使用。

## 結構規則

- `requestBody` 或 `responses` 下的每個媒體類型必須包含 `schema` 或 `$ref`；唯一例外是使用 `itemSchema` 的 `text/event-stream`。
- 每個參數必須有 `schema`（或 `content`）。
- 編輯操作時，所選協定及其配置會被**保留**。RPC 和串流操作從不會被悄悄轉換成 REST。
- 使用上面的確切擴充形態——不要捏造諸如 `externalUrl` 的鍵，也不要把 `ws` 用作協定名。

## 為什麼這很重要

在一份文件中為全部六種協定建模，意味著無論傳輸方式如何，設計、除錯、Mock、文件和 MCP 都由同一個事實來源驅動。當你讓助手新增串流或 RPC 介面時，它會保持協定配置完整，而不是把它拍平成僅支援 REST 的形態。

相關：[用助手進行設計](/docs/client/design)、[資料模型](/docs/client/data-model)。
