---
sidebar_position: 5
title: Protocoles
description: "Modele HTTP, SSE, WebSocket, GraphQL, gRPC y MCP en un único documento OpenAPI mediante la extensión x-protocol y sus formas exactas de configuración."
---

# Protocoles

Los sistemas reales no son solo REST. Powerduck modela seis protocolos en entradas de ruta OpenAPI ordinarias mediante la extensión `x-protocol`. Las operaciones de streaming y RPC viven en la misma spec que REST, sin una herramienta aparte ni conversión forzada a formas REST.

Cada operación no HTTP sigue siendo una entrada de ruta ordinaria con método HTTP y `responses."200".description`.

- `graphql`, `grpc`, `mcp` usan **post**.
- `sse`, `websocket` suelen usar **get**.
- `http` es el valor por defecto y se omite `x-protocol`.

## SSE

Server-Sent Events sobre HTTP usan `x-protocol: "sse"`. El tipo de medio de streaming es `text/event-stream`, y la carga de un evento individual se describe con `itemSchema`, no `schema`.

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

WebSocket usa `x-protocol: "websocket"` con un bloque `x-websocket`. La URL debe empezar por `ws://` o `wss://`.

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

`subprotocols` y `headers` son opcionales.

## GraphQL

GraphQL usa post en una ruta de la forma `/graphql/query/fieldName` con `x-graphql`. El endpoint es una URL HTTP(S) absoluta y la query es obligatoria.

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

`operationName`, `variablesSchema` y `variables` son opcionales.

## gRPC

gRPC usa post en una ruta de la forma `/grpc/pkg.Service/Method` con `x-grpc`. Si el servidor soporta reflexión, ponga `reflection: true`; si no, aporte `protoPaths` (y opcionalmente `includeDirs`).

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

`kind` es `unary`, `server_streaming`, `client_streaming` o `bidi_streaming`.

## MCP

MCP usa por defecto Streamable HTTP, post en una ruta de la forma `/mcp/tools/tool-name`, con un bloque `x-mcp`.

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

`method` elige la operación MCP: `tools/call`, `tools/list`, `resources/read`, `resources/list`, `resources/templates/list`, `prompts/get`, `prompts/list`. `name`, `uri`, `argumentsSchema` y `arguments` se usan según el método.

## Reglas estructurales

- Cada tipo de medio en `requestBody` o `responses` necesita `schema` o `$ref`, con la única excepción de `text/event-stream` con `itemSchema`.
- Cada parámetro necesita `schema` (o `content`).
- Al editar una operación, el protocolo y configuración elegidos se **conservan**: las operaciones RPC o de streaming no se vuelven REST en silencio.
- Use las formas exactas de extensión anteriores; no invente claves como `externalUrl` ni use `ws` como nombre de protocolo.

## Por qué importa

Cuando seis protocolos se modelan en un documento, diseño, depuración, simulación, documentación y MCP se impulsan desde la misma fuente, independientemente del transporte. Pida al asistente que añada una interfaz de streaming o RPC y su configuración de protocolo se conserva en vez de aplanarse a REST.

Vea también: [Diseñar con el asistente](/docs/client/design)、[Modelo de datos](/docs/client/data-model).
