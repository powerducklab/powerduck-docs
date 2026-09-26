---
sidebar_position: 5
title: Protocoles
description: "Modélisez HTTP, SSE, WebSocket, GraphQL, gRPC et MCP dans un seul document OpenAPI via l'extension x-protocol et ses formes de configuration exactes."
---

# Protocoles

Les systèmes réels ne sont pas uniquement REST. Powerduck modélise six protocoles dans des entrées de chemin OpenAPI ordinaires via l'extension `x-protocol`. Les opérations de streaming et RPC vivent dans la même spécification que REST, sans outil séparé ni conversion forcée en REST.

Chaque opération non HTTP reste une entrée de chemin ordinaire avec méthode HTTP et `responses."200".description`.

- `graphql`, `grpc`, `mcp` utilisent **post**.
- `sse`, `websocket` utilisent généralement **get**.
- `http` est la valeur par défaut et `x-protocol` est omis.

## SSE

Les Server-Sent Events sur HTTP utilisent `x-protocol: "sse"`. Le type de média de flux est `text/event-stream`, et le payload d'un événement unique se décrit avec `itemSchema`, pas `schema`.

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

WebSocket utilise `x-protocol: "websocket"` avec un bloc `x-websocket`. L'URL doit commencer par `ws://` ou `wss://`.

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

`subprotocols` et `headers` sont optionnels.

## GraphQL

GraphQL utilise post sur un chemin de la forme `/graphql/query/fieldName` avec `x-graphql`. L'endpoint est une URL HTTP(S) absolue et la query est obligatoire.

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

`operationName`, `variablesSchema` et `variables` sont optionnels.

## gRPC

gRPC utilise post sur un chemin de la forme `/grpc/pkg.Service/Method` avec `x-grpc`. Si le serveur supporte la réflexion, mettez `reflection: true` ; sinon fournissez `protoPaths` (et `includeDirs` optionnel).

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

`kind` vaut `unary`, `server_streaming`, `client_streaming` ou `bidi_streaming`.

## MCP

MCP utilise par défaut le Streamable HTTP, post sur un chemin de la forme `/mcp/tools/tool-name`, avec un bloc `x-mcp`.

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

`method` choisit l'opération MCP : `tools/call`, `tools/list`, `resources/read`, `resources/list`, `resources/templates/list`, `prompts/get`, `prompts/list`. `name`, `uri`, `argumentsSchema` et `arguments` s'emploient selon la méthode.

## Règles structurelles

- Chaque type de média sous `requestBody` ou `responses` nécessite `schema` ou `$ref`, à la seule exception de `text/event-stream` qui utilise `itemSchema`.
- Chaque paramètre nécessite `schema` (ou `content`).
- Quand vous éditez une opération, le protocole et la configuration choisis sont **préservés** : les opérations RPC ou streaming ne se convertissent pas silencieusement en REST.
- Utilisez les formes d'extension exactes ci-dessus ; n'inventez pas de clés comme `externalUrl` et n'utilisez pas `ws` comme nom de protocole.

## Pourquoi ça compte

En modélisant six protocoles dans un seul document, la conception, le débogage, la simulation, la documentation et MCP sont pilotés par la même source, quel que soit le transport. Demandez à l'assistant d'ajouter une interface de streaming ou RPC, et sa configuration de protocole reste intacte au lieu d'être aplatie en REST.

Voir aussi : [Concevoir avec l'assistant](./design.md)、[Modèle de données](./data-model.md).
