---
sidebar_position: 5
title: Protocols
description: "Model HTTP, SSE, WebSocket, GraphQL, gRPC, and MCP in one OpenAPI document using the x-protocol extension and its exact configuration shapes."
---

# Protocols

Real systems are not REST-only. Powerduck models six protocols on ordinary OpenAPI path items using the `x-protocol` extension, so streaming and RPC operations live in the same specification as HTTP instead of being tracked in separate tools — or silently converted into REST.

Every non-HTTP operation is still a normal path item with an HTTP method and a `responses."200".description`:

- `graphql`, `grpc`, and `mcp` use **post**;
- `sse` and `websocket` typically use **get**;
- `http` is the default and omits `x-protocol`.

## SSE

Server-sent events over HTTP use `x-protocol: "sse"`. The streaming media type is `text/event-stream` and describes one event payload with `itemSchema` (not `schema`):

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

WebSocket uses `x-protocol: "websocket"` with an `x-websocket` block. The URL must start with `ws://` or `wss://`:

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

`subprotocols` and `headers` are optional.

## GraphQL

GraphQL uses post on a path such as `/graphql/query/fieldName`, with `x-graphql`. The endpoint must be an absolute HTTP(S) URL and the query is required:

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

`operationName`, `variablesSchema`, and `variables` are optional.

## gRPC

gRPC uses post on a path such as `/grpc/pkg.Service/Method`, with `x-grpc`. When the server supports reflection, set `reflection: true`; otherwise provide `protoPaths` (and optional `includeDirs`):

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

`kind` is one of `unary`, `server_streaming`, `client_streaming`, or `bidi_streaming`.

## MCP

MCP uses Streamable HTTP by default, with post on a path such as `/mcp/tools/tool-name` and an `x-mcp` block:

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

The `method` selects the MCP operation: `tools/call`, `tools/list`, `resources/read`, `resources/list`, `resources/templates/list`, `prompts/get`, or `prompts/list`. `name`, `uri`, `argumentsSchema`, and `arguments` are used as appropriate for the method.

## Structural rules

- Every media type under `requestBody` or `responses` must contain either `schema` or `$ref`; the single exception is `text/event-stream`, which uses `itemSchema`.
- Every parameter must have a `schema` (or `content`).
- The selected protocol and its configuration are **preserved when editing** an operation. RPC and streaming operations are never silently converted into REST.
- Use the exact extension shapes above — do not invent keys such as `externalUrl`, and do not use `ws` as a protocol name.

## Why this matters

Modeling all six protocols in one document means the same source of truth drives design, debugging, mocks, documentation, and MCP regardless of transport. When you ask the assistant to add a streaming or RPC endpoint, it keeps the protocol configuration intact rather than flattening it into a REST-only shape.

Related: [Designing with the assistant](./design.md), [Data model](./data-model.md).
