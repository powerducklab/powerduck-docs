---
sidebar_position: 5
title: "Protokoller"
description: "Gerçek sistemler yalnızca REST kullanmaz. Powerduck, x-protocol uzantısıyla normal OpenAPI yol öğeleri üzerinde yedi protokolü modeller. Böylece akış ve RPC işlemleri ayrı araçlarda tutulmak veya sessizce REST'e dönüştürülmek yerine HTTP ile aynı belirtimde yer alır."
---

# Protokoller

Gerçek sistemler yalnızca REST kullanmaz. Powerduck, `x-protocol` uzantısıyla normal OpenAPI yol öğeleri üzerinde yedi protokolü modeller. Böylece akış ve RPC işlemleri ayrı araçlarda tutulmak veya sessizce REST'e dönüştürülmek yerine HTTP ile aynı belirtimde yer alır.

HTTP dışındaki her işlem de bir HTTP yöntemi ve `responses."200".description` içeren normal bir yol öğesidir:

- `graphql`, `grpc`, `mcp` ve `a2a`, **post** kullanır;
- `sse` ve `websocket` genellikle **get** kullanır;
- `http` varsayılandır ve `x-protocol` içermez.

## SSE

HTTP üzerinden sunucudan gönderilen olaylar `x-protocol: "sse"` kullanır. Akışın medya türü `text/event-stream` olup tek bir olayın yükünü `schema` yerine `itemSchema` ile tanımlar:

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

WebSocket, `x-websocket` bloğuyla birlikte `x-protocol: "websocket"` kullanır. URL, `ws://` veya `wss://` ile başlamalıdır:

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

`subprotocols` ve `headers` isteğe bağlıdır.

## GraphQL

GraphQL, `/graphql/query/fieldName` gibi bir yolda post ve `x-graphql` kullanır. Uç nokta mutlak bir HTTP(S) URL'si olmalı, sorgu mutlaka belirtilmelidir:

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

`operationName`, `variablesSchema` ve `variables` isteğe bağlıdır.

## gRPC

gRPC, `/grpc/pkg.Service/Method` gibi bir yolda post ve `x-grpc` kullanır. Sunucu reflection destekliyorsa `reflection: true` ayarlayın; aksi durumda `protoPaths` ve gerekirse `includeDirs` sağlayın:

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

`kind`, `unary`, `server_streaming`, `client_streaming` veya `bidi_streaming` değerlerinden biridir.

## MCP

MCP varsayılan olarak Streamable HTTP kullanır; `/mcp/tools/tool-name` gibi bir yolda post ve `x-mcp` bloğu bulunur:

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

`method`, MCP işlemini seçer: `tools/call`, `tools/list`, `resources/read`, `resources/list`, `resources/templates/list`, `prompts/get` veya `prompts/list`. `name`, `uri`, `argumentsSchema` ve `arguments`, yöntemin gerektirdiği şekilde kullanılır.

## Yapı kuralları

- Asistanın oluşturduğu sözleşmelerde, `requestBody` veya `responses` altındaki medya türleri için `schema` ya da `$ref` sağlayın. `text/event-stream`, tek tek olaylar için OAS 3.2 `itemSchema` kullanır. Bu, Powerduck'ın yazım kuralıdır; her OpenAPI belgesi için genel bir zorunluluk değildir.
- Her parametre `schema` veya `content` içermelidir.
- Seçilen protokol ve yapılandırması, işlem **düzenlenirken korunur**. RPC ve akış işlemleri sessizce REST'e dönüştürülmez.
- Yukarıdaki uzantı yapılarını aynen kullanın; `externalUrl` gibi anahtarlar uydurmayın ve protokol adı olarak `ws` kullanmayın.

## Neden önemlidir?

Protokolleri tek belgede modellemek; tasarım, hata ayıklama ve belgeleri aynı kaynağa bağlı tutar. Çalıştırma, mock ve üretilen MCP desteği taşıma yöntemine göre değişir. A2A 1.0, JSON-RPC, REST ve masaüstü gRPC için hata ayıklama ve belgelendirme ile durumsuz mesaj bağdaştırıcısı sunucusu oluşturmayı destekler. Kalıcı görevler ve push teslimi kendi uygulamanızı gerektirir. Asistandan akış veya RPC uç noktası istediğinizde protokol yapılandırması korunur, yalnızca REST'e uygun bir yapıya indirgenmez.

İlgili sayfalar: [Asistanla tasarım](./design.md), [Veri modeli](./data-model.md).

## A2A

JSON-RPC, REST veya masaüstü gRPC üzerinden ajan mesajları ve görevleri için `x-protocol: a2a` ile `x-a2a` kullanın. A2A 1.0 üç bağlamayı da destekler; 0.3 JSON-RPC destekler. Sürümlerin iletim yapıları farklıdır. Yapılandırma, örnekler, keşif ve sınırlamalar için [A2A ajanları](./a2a.md) sayfasına bakın.
