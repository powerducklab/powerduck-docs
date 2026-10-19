---
sidebar_position: 5
title: Protocolos
description: "Modele HTTP, SSE, WebSocket, GraphQL, gRPC e MCP / A2A num único documento OpenAPI pela extensão x-protocol e as suas formas exatas de configuração."
---

# Protocolos

Os sistemas reais não são só REST. Powerduck modela sete protocolos em entradas de caminho OpenAPI comuns pela extensão `x-protocol`. As operações de streaming e RPC vivem na mesma spec que REST, sem uma ferramenta à parte nem conversão forçada a formas REST.

Cada operação não HTTP continua a ser uma entrada de caminho comum com método HTTP e `responses."200".description`.

- `graphql`, `grpc`, `mcp`, `a2a` usam **post**.
- `sse`, `websocket` usam geralmente **get**.
- `http` é o valor por defeito e omite-se `x-protocol`.

## SSE

Server-Sent Events sobre HTTP usam `x-protocol: "sse"`. O tipo de média de streaming é `text/event-stream`, e a carga de um evento individual descreve-se com `itemSchema`, não `schema`.

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

WebSocket usa `x-protocol: "websocket"` com um bloco `x-websocket`. A URL deve começar por `ws://` ou `wss://`.

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

`subprotocols` e `headers` são opcionais.

## GraphQL

GraphQL usa post num caminho da forma `/graphql/query/fieldName` com `x-graphql`. O endpoint é uma URL HTTP(S) absoluta e a query é obrigatória.

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
      responses:
        "200":
          description: Operation response
```

`operationName`, `variablesSchema` e `variables` são opcionais.

## gRPC

gRPC usa post num caminho da forma `/grpc/pkg.Service/Method` com `x-grpc`. Se o servidor suporta reflexão, ponha `reflection: true`; senão, forneça `protoPaths` (e opcionalmente `includeDirs`).

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

`kind` é `unary`, `server_streaming`, `client_streaming` ou `bidi_streaming`.

## MCP

MCP usa por defeito Streamable HTTP, post num caminho da forma `/mcp/tools/tool-name`, com um bloco `x-mcp`.

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

`method` escolhe a operação MCP: `tools/call`, `tools/list`, `resources/read`, `resources/list`, `resources/templates/list`, `prompts/get`, `prompts/list`. `name`, `uri`, `argumentsSchema` e `arguments` usam-se segundo o método.

## Regras estruturais

- Nos contratos gerados pelo assistente, informe `schema` ou `$ref` para os tipos de mídia em `requestBody` ou `responses`. `text/event-stream` usa `itemSchema` do OAS 3.2 para cada evento. Essa é uma convenção de escrita do Powerduck, não uma exigência universal de todos os documentos OpenAPI.
- Cada parâmetro precisa de `schema` (ou `content`).
- Ao editar uma operação, o protocolo e configuração escolhidos **conservam-se**: as operações RPC ou de streaming não se tornam REST em silêncio.
- Use as formas exatas de extensão anteriores; não invente chaves como `externalUrl` nem use `ws` como nome de protocolo.

## Porquê importa

Quando sete protocolos se modelam num documento, projeto, depuração, simulação, documentação e MCP impulsionam-se desde a mesma fonte, independentemente do transporte. Peça ao assistente que adicione uma interface de streaming ou RPC e a sua configuração de protocolo conserva-se em vez de se aplanar a REST.

Veja também: [Desenhar com o assistente](./design.md)、[Modelo de dados](./data-model.md).

## A2A

O A2A 1.0 permite depurar e documentar JSON-RPC, REST e gRPC no desktop, além de gerar um servidor adaptador de mensagens sem estado. Tarefas persistentes e entrega push exigem uma implementação própria.

Use `x-protocol: a2a` e `x-a2a` para projetar, depurar e documentar mensagens e tarefas. A2A 1.0 oferece JSON-RPC, REST e gRPC no desktop; 0.3 usa JSON-RPC. Veja [Agentes A2A](./a2a.md) para extensões, verificação de assinaturas, geração de servidor e demonstração executável.
