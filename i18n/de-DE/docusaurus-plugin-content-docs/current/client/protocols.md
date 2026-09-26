---
sidebar_position: 5
title: Protokolle
description: "Modellieren Sie HTTP, SSE, WebSocket, GraphQL, gRPC und MCP in einem einzigen OpenAPI-Dokument über die x-protocol-Erweiterung und ihre genauen Konfigurationsformen."
---

# Protokolle

Echte Systeme bestehen nicht nur aus REST. Powerduck modelliert sechs Protokolle in gewöhnlichen OpenAPI-Pfadeinträgen über die `x-protocol`-Erweiterung. Streaming- und RPC-Operationen leben in derselben Spec wie REST, ohne separates Werkzeug oder erzwungene Umwandlung in REST.

Jede Nicht-HTTP-Operation bleibt ein gewöhnlicher Pfadeintrag mit HTTP-Methode und `responses."200".description`.

- `graphql`, `grpc`, `mcp` nutzen **post**.
- `sse`, `websocket` nutzen meist **get**.
- `http` ist die Standardeinstellung, und `x-protocol` wird weggelassen.

## SSE

Server-Sent Events über HTTP nutzen `x-protocol: "sse"`. Der Streaming-Medientyp ist `text/event-stream`, und die Nutzlast eines Einzel-Ereignisses beschreiben Sie mit `itemSchema`, nicht `schema`.

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

WebSocket nutzt `x-protocol: "websocket"` mit einem `x-websocket`-Block. Die URL muss mit `ws://` oder `wss://` beginnen.

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

`subprotocols` und `headers` sind optional.

## GraphQL

GraphQL nutzt post auf einem Pfad der Form `/graphql/query/fieldName` mit `x-graphql`. Der Endpunkt ist eine absolute HTTP(S)-URL, und die query ist verpflichtend.

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

`operationName`, `variablesSchema` und `variables` sind optional.

## gRPC

gRPC nutzt post auf einem Pfad der Form `/grpc/pkg.Service/Method` mit `x-grpc`. Wenn der Server Reflexion unterstützt, setzen Sie `reflection: true`; sonst liefern Sie `protoPaths` (und optional `includeDirs`).

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

`kind` ist `unary`, `server_streaming`, `client_streaming` oder `bidi_streaming`.

## MCP

MCP nutzt standardmäßig Streamable HTTP, post auf einem Pfad der Form `/mcp/tools/tool-name`, mit einem `x-mcp`-Block.

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

`method` wählt die MCP-Operation: `tools/call`, `tools/list`, `resources/read`, `resources/list`, `resources/templates/list`, `prompts/get`, `prompts/list`. `name`, `uri`, `argumentsSchema` und `arguments` kommen je nach Methode zum Einsatz.

## Strukturregeln

- Jeder Medientyp unter `requestBody` oder `responses` braucht `schema` oder `$ref`, einzige Ausnahme `text/event-stream` mit `itemSchema`.
- Jeder Parameter braucht `schema` (oder `content`).
- Beim Bearbeiten einer Operation bleiben gewähltes Protokoll und Konfiguration **erhalten**: RPC- oder Streaming-Operationen werden nicht still zu REST.
- Nutzen Sie die genauen Erweiterungsformen oben; erfinden Sie keine Schlüssel wie `externalUrl` und nutzen `ws` nicht als Protokollnamen.

## Warum es zählt

Wenn sechs Protokolle in einem Dokument modelliert sind, werden Entwurf, Debugging, Mocking, Doku und MCP unabhängig vom Transport von derselben Quelle gesteuert. Bitten Sie den Assistenten, eine Streaming- oder RPC-Schnittstelle hinzuzufügen, und ihre Protokollkonfiguration bleibt statt zu REST abgeflacht erhalten.

Siehe auch: [Mit dem Assistenten entwerfen](./design.md)、[Datenmodell](./data-model.md).
