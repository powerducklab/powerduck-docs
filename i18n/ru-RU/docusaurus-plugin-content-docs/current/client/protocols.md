---
sidebar_position: 5
title: "Протоколы"
description: "Реальные системы не ограничиваются REST. Powerduck описывает семь протоколов в обычных элементах путей OpenAPI через расширение x-protocol. Потоковые операции и RPC находятся в одной спецификации с HTTP, а не в отдельных инструментах, и не преобразуются незаметно в REST."
---

# Протоколы

Реальные системы не ограничиваются REST. Powerduck описывает семь протоколов в обычных элементах путей OpenAPI через расширение `x-protocol`. Потоковые операции и RPC находятся в одной спецификации с HTTP, а не в отдельных инструментах, и не преобразуются незаметно в REST.

Каждая операция не-HTTP остаётся обычным элементом пути с HTTP-методом и `responses."200".description`:

- `graphql`, `grpc`, `mcp` и `a2a` используют **post**;
- `sse` и `websocket` обычно используют **get**;
- `http` используется по умолчанию без `x-protocol`.

## SSE

События, отправляемые сервером по HTTP, используют `x-protocol: "sse"`. Тип содержимого потока — `text/event-stream`; данные одного события описываются через `itemSchema`, а не `schema`:

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

WebSocket использует `x-protocol: "websocket"` с блоком `x-websocket`. URL должен начинаться с `ws://` или `wss://`:

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

`subprotocols` и `headers` необязательны.

## GraphQL

GraphQL использует post по пути вроде `/graphql/query/fieldName` с расширением `x-graphql`. Эндпоинт должен быть абсолютным URL HTTP(S); запрос обязателен:

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

`operationName`, `variablesSchema` и `variables` необязательны.

## gRPC

gRPC использует post по пути вроде `/grpc/pkg.Service/Method` с расширением `x-grpc`. Если сервер поддерживает reflection, задайте `reflection: true`; иначе укажите `protoPaths` и при необходимости `includeDirs`:

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

`kind` принимает одно из значений: `unary`, `server_streaming`, `client_streaming` или `bidi_streaming`.

## MCP

По умолчанию MCP использует Streamable HTTP с post по пути вроде `/mcp/tools/tool-name` и блоком `x-mcp`:

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

`method` выбирает операцию MCP: `tools/call`, `tools/list`, `resources/read`, `resources/list`, `resources/templates/list`, `prompts/get` или `prompts/list`. Поля `name`, `uri`, `argumentsSchema` и `arguments` используются в зависимости от метода.

## Правила структуры

- Для контрактов, создаваемых помощником, указывайте `schema` или `$ref` для типов содержимого в `requestBody` или `responses`; `text/event-stream` использует `itemSchema` из OAS 3.2 для отдельных событий. Это соглашение Powerduck, а не универсальное требование ко всем документам OpenAPI.
- Каждый параметр должен содержать `schema` либо `content`.
- Выбранный протокол и его конфигурация **сохраняются при редактировании** операции. RPC и потоковые операции никогда не преобразуются незаметно в REST.
- Используйте точные структуры расширений из примеров: не придумывайте ключи вроде `externalUrl` и не используйте `ws` как имя протокола.

## Почему это важно

Единый документ сохраняет общий источник данных для проектирования, отладки и документации. Поддержка выполнения, моков и генерации MCP зависит от транспорта. A2A 1.0 поддерживает отладку и документирование JSON-RPC, REST и настольного gRPC, а также генерацию сервера-адаптера сообщений без состояния. Долговременные задачи и push-доставку нужно реализовать самостоятельно. Когда вы просите помощника добавить потоковый или RPC-эндпоинт, он сохраняет конфигурацию протокола, а не сводит её к REST.

См. также: [Проектирование с помощником](./design.md), [Модель данных](./data-model.md).

## A2A

Используйте `x-protocol: a2a` с `x-a2a` для сообщений и задач агентов через JSON-RPC, REST или настольный gRPC. A2A 1.0 поддерживает все три привязки; версия 0.3 — JSON-RPC. Структуры передаваемых данных различаются между версиями. Настройка, примеры, обнаружение и ограничения описаны в разделе [Агенты A2A](./a2a.md).
