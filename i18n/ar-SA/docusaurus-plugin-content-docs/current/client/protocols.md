---
sidebar_position: 5
title: البروتوكولات
description: "نمذج HTTP وSSE وWebSocket وGraphQL وgRPC وMCP في مستند OpenAPI واحد عبر امتداد x-protocol وأشكال الضبط الدقيقة."
---

# البروتوكولات

الأنظمة الفعلية ليست REST فقط. ينمذج Powerduck ستة بروتوكولات في مدخلات مسار OpenAPI عادية عبر امتداد `x-protocol`. تعيش عمليات البث وRPC في المواصفة نفسها كـREST، بلا أداة منفصلة ولا تحويل قسري إلى أشكال REST.

تبقى كل عملية غير HTTP مدخل مسار عادياً بطريقة HTTP و`responses."200".description`.

- `graphql` و`grpc` و`mcp` تستخدم **post**.
- `sse` و`websocket` تستخدم عادة **get**.
- `http` هي القيمة الافتراضية ويُحذَف `x-protocol`.

## SSE

أحداث الخادم المُرسَلة عبر HTTP تستخدم `x-protocol: "sse"`. نوع وسائط البث هو `text/event-stream`، وتصف حمولة الحدث الفردي بـ`itemSchema` لا `schema`.

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

يستخدم WebSocket `x-protocol: "websocket"` مع كتلة `x-websocket`. يجب أن يبدأ الرابط بـ`ws://` أو `wss://`.

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

`subprotocols` و`headers` اختياريان.

## GraphQL

يستخدم GraphQL post على مسار بصيغة `/graphql/query/fieldName` مع `x-graphql`. نقطة النهاية رابط HTTP(S) مطلق والاستعلام إلزامي.

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

`operationName` و`variablesSchema` و`variables` اختيارية.

## gRPC

يستخدم gRPC post على مسار بصيغة `/grpc/pkg.Service/Method` مع `x-grpc`. إذا كان الخادم يدعم الانعكاس، ضع `reflection: true`؛ وإلا زوّد `protoPaths` (واختيارياً `includeDirs`).

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

`kind` هي `unary` أو `server_streaming` أو `client_streaming` أو `bidi_streaming`.

## MCP

يستخدم MCP افتراضياً Streamable HTTP، post على مسار بصيغة `/mcp/tools/tool-name`، مع كتلة `x-mcp`.

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

يختار `method` عملية MCP: `tools/call` و`tools/list` و`resources/read` و`resources/list` و`resources/templates/list` و`prompts/get` و`prompts/list`. يُستخدَم `name` و`uri` و`argumentsSchema` و`arguments` حسب العملية.

## قواعد بنيوية

- كل نوع وسائط في `requestBody` أو `responses` يحتاج `schema` أو `$ref`، باستثناء `text/event-stream` مع `itemSchema`.
- كل معامل يحتاج `schema` (أو `content`).
- عند تعديل عملية، يُحفَظ البروتوكول والضبط المختاران: لا تتحول عمليات RPC أو البث إلى REST صامتاً.
- استخدم أشكال الامتداد الدقيقة أعلاه؛ لا تخترع مفاتيح مثل `externalUrl` ولا تستخدم `ws` كاسم بروتوكول.

## لماذا يهم

عند نمذجة ستة بروتوكولات في مستند واحد، يُدفَع التصميم والتصحيح والمحاكاة والتوثيق وMCP من المصدر نفسه بغض النظر عن النقل. اطلب من المساعد إضافة واجهة بث أو RPC فيُحفَظ ضبط بروتوكولها بدل تسويته إلى REST.

انظر أيضاً: [التصميم مع المساعد](./design)、[نموذج البيانات](./data-model).
