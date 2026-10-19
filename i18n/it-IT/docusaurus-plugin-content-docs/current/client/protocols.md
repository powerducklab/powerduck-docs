---
sidebar_position: 5
title: "Protocolli"
description: "I sistemi reali non usano soltanto REST. Powerduck rappresenta sette protocolli nei normali elementi di percorso OpenAPI tramite l'estensione x-protocol. Streaming e RPC convivono così nella stessa specifica di HTTP, senza strumenti separati né conversioni implicite in REST."
---

# Protocolli

I sistemi reali non usano soltanto REST. Powerduck rappresenta sette protocolli nei normali elementi di percorso OpenAPI tramite l'estensione `x-protocol`. Streaming e RPC convivono così nella stessa specifica di HTTP, senza strumenti separati né conversioni implicite in REST.

Ogni operazione non HTTP resta un normale elemento di percorso con un metodo HTTP e una `responses."200".description`:

- `graphql`, `grpc`, `mcp` e `a2a` usano **post**;
- `sse` e `websocket` usano in genere **get**;
- `http` è il valore predefinito e non richiede `x-protocol`.

## SSE

Gli eventi inviati dal server tramite HTTP usano `x-protocol: "sse"`. Il tipo di contenuto dello stream è `text/event-stream` e descrive il payload di un singolo evento con `itemSchema`, non con `schema`:

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

WebSocket usa `x-protocol: "websocket"` con un blocco `x-websocket`. L'URL deve iniziare con `ws://` o `wss://`:

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

`subprotocols` e `headers` sono facoltativi.

## GraphQL

GraphQL usa post su un percorso come `/graphql/query/fieldName`, con `x-graphql`. L'endpoint deve essere un URL HTTP(S) assoluto e la query è obbligatoria:

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

`operationName`, `variablesSchema` e `variables` sono facoltativi.

## gRPC

gRPC usa post su un percorso come `/grpc/pkg.Service/Method`, con `x-grpc`. Se il server supporta la reflection, imposta `reflection: true`; altrimenti specifica `protoPaths` ed eventualmente `includeDirs`:

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

`kind` può essere `unary`, `server_streaming`, `client_streaming` o `bidi_streaming`.

## MCP

MCP usa Streamable HTTP per impostazione predefinita, con post su un percorso come `/mcp/tools/tool-name` e un blocco `x-mcp`:

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

`method` seleziona l'operazione MCP: `tools/call`, `tools/list`, `resources/read`, `resources/list`, `resources/templates/list`, `prompts/get` o `prompts/list`. `name`, `uri`, `argumentsSchema` e `arguments` vengono usati secondo le esigenze del metodo.

## Regole strutturali

- Nei contratti generati dall'assistente, specifica `schema` o `$ref` per i tipi di contenuto in `requestBody` o `responses`; `text/event-stream` usa `itemSchema` di OAS 3.2 per i singoli eventi. È una convenzione di redazione di Powerduck, non un requisito universale di ogni documento OpenAPI.
- Ogni parametro deve avere uno `schema` oppure `content`.
- Il protocollo scelto e la sua configurazione vengono **conservati durante la modifica** dell'operazione. Le operazioni RPC e streaming non vengono mai convertite implicitamente in REST.
- Usa esattamente le strutture delle estensioni mostrate sopra: non inventare chiavi come `externalUrl` e non usare `ws` come nome del protocollo.

## Perché è importante

Modellare questi protocolli in un unico documento mantiene progettazione, debug e documentazione collegati alla stessa fonte. Il supporto per esecuzione, mock e MCP generato dipende dal trasporto. A2A 1.0 supporta debug e documentazione di JSON-RPC, REST e gRPC desktop, oltre alla generazione di un server adattatore di messaggi senza stato. Le attività persistenti e l'invio push richiedono un'implementazione propria. Quando chiedi all'assistente un endpoint streaming o RPC, la configurazione del protocollo viene mantenuta anziché ridotta a una struttura soltanto REST.

Vedi anche: [Progettare con l'assistente](./design.md), [Modello dati](./data-model.md).

## A2A

Usa `x-protocol: a2a` con `x-a2a` per messaggi e attività degli agenti tramite JSON-RPC, REST o gRPC desktop. A2A 1.0 supporta tutti e tre i binding; la versione 0.3 supporta JSON-RPC. Le strutture trasmesse differiscono tra le versioni. Consulta [Agenti A2A](./a2a.md) per configurazione, esempi, individuazione degli agenti e limiti.
