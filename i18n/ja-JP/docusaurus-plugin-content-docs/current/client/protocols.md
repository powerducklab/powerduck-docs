---
sidebar_position: 5
title: プロトコル
description: "x-protocol 拡張とその正確な設定形を使い、1 つの OpenAPI 文書で HTTP、SSE、WebSocket、GraphQL、gRPC、MCP をモデル化します。"
---

# プロトコル

実システムは REST だけではありません。Powerduck は `x-protocol` 拡張を使い、通常の OpenAPI パス項目に 6 つのプロトコルをモデル化します。ストリーミングや RPC 操作を REST と同じ仕様に含め、別ツールで追跡したり REST に無理に変換したりしません。

各非 HTTP 操作は、HTTP メソッドと `responses."200".description` を持つ通常のパス項目のままです。

- `graphql`、`grpc`、`mcp` は **post** を使う。
- `sse`、`websocket` は通常 **get** を使う。
- `http` がデフォルトで、`x-protocol` は省略します。

## SSE

HTTP ベースの Server-Sent Events は `x-protocol: "sse"` を使います。ストリームメディアタイプは `text/event-stream` で、単一イベントのペイロードは `schema` ではなく `itemSchema` で記述します。

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

WebSocket は `x-protocol: "websocket"` を使い、`x-websocket` ブロックを添えます。URL は `ws://` または `wss://` で始まる必要があります。

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

`subprotocols` と `headers` は任意です。

## GraphQL

GraphQL は `/graphql/query/fieldName` 形のパスで post を使い、`x-graphql` を添えます。エンドポイントは絶対 HTTP(S) URL で、query は必須です。

```yaml
paths:
  /graphql/query/product:
    post:
      x-protocol: graphql
      x-graphql:
        endpoint: https://example.com/graphql
        query: query Product($id: ID!) { product(id: ID!) { id name } }
        operationName: Product
        variablesSchema:
          type: object
        variables: {}
```

`operationName`、`variablesSchema`、`variables` は任意です。

## gRPC

gRPC は `/grpc/pkg.Service/Method` 形のパスで post を使い、`x-grpc` を添えます。サーバーがリフレクション対応なら `reflection: true`、そうでなければ `protoPaths`（と任意の `includeDirs`）を提供します。

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

`kind` は `unary`、`server_streaming`、`client_streaming`、`bidi_streaming` のいずれかです。

## MCP

MCP はデフォルトで Streamable HTTP を使い、`/mcp/tools/tool-name` 形のパスで post、`x-mcp` ブロックを添えます。

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

`method` は MCP 操作を選びます。`tools/call`、`tools/list`、`resources/read`、`resources/list`、`resources/templates/list`、`prompts/get`、`prompts/list`。`name`、`uri`、`argumentsSchema`、`arguments` はメソッドに応じて使います。

## 構造ルール

- `requestBody` または `responses` 配下の各メディアタイプには `schema` か `$ref` が必要です。唯一の例外は `itemSchema` を使う `text/event-stream`。
- 各パラメータには `schema`（または `content`）が必要です。
- 操作を編集するとき、選択プロトコルとその設定は**保持**されます。RPC やストリーミング操作が REST に黙って変換されることはありません。
- 上記の正確な拡張形を使い、`externalUrl` のようなキーを捏造したり `ws` をプロトコル名に使ったりしないでください。

## なぜ重要か

1 つの文書で全 6 プロトコルをモデル化すると、トランスポートに関わらず設計、デバッグ、モック、ドキュメント、MCP が同じ情報源で駆動されます。アシスタントにストリーミングや RPC インターフェースの追加を依頼しても、プロトコル設定が完全に保たれ、REST 専用形に平坦化されません。

関連: [アシスタントで設計する](./design.md)、[データモデル](./data-model.md)。
