---
sidebar_position: 5
title: 프로토콜
description: "x-protocol 확장과 그 정확한 설정 형태를 사용해 단일 OpenAPI 문서에서 HTTP, SSE, WebSocket, GraphQL, gRPC, MCP를 모델링합니다."
---

# 프로토콜

실제 시스템은 REST만이 아닙니다. Powerduck은 `x-protocol` 확장을 사용해 일반 OpenAPI 경로 항목에 6개 프로토콜을 모델링합니다. 스트리밍과 RPC 작업을 REST와 같은 스펙에 담아 별도 도구로 추적하거나 REST로 강제 변환하지 않습니다.

각 비 HTTP 작업은 HTTP 메서드와 `responses."200".description`을 가진 일반 경로 항목 그대로입니다.

- `graphql`, `grpc`, `mcp`는 **post** 사용.
- `sse`, `websocket`은 보통 **get** 사용.
- `http`가 기본이고 `x-protocol`은 생략합니다.

## SSE

HTTP 기반 Server-Sent Events는 `x-protocol: "sse"`를 씁니다. 스트림 미디어 유형은 `text/event-stream`이고 단일 이벤트 페이로드는 `schema`가 아닌 `itemSchema`로 기술합니다.

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

WebSocket은 `x-protocol: "websocket"`을 쓰고 `x-websocket` 블록을 붙입니다. URL은 `ws://` 또는 `wss://`로 시작해야 합니다.

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

`subprotocols`와 `headers`는 선택입니다.

## GraphQL

GraphQL은 `/graphql/query/fieldName` 형태 경로에서 post를 쓰고 `x-graphql`을 붙입니다. 엔드포인트는 절대 HTTP(S) URL이고 query는 필수입니다.

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

`operationName`, `variablesSchema`, `variables`는 선택입니다.

## gRPC

gRPC는 `/grpc/pkg.Service/Method` 형태 경로에서 post를 쓰고 `x-grpc`을 붙입니다. 서버가 리플렉션 지원이면 `reflection: true`, 아니면 `protoPaths`(와 선택적 `includeDirs`)를 제공합니다.

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

`kind`는 `unary`, `server_streaming`, `client_streaming`, `bidi_streaming` 중 하나입니다.

## MCP

MCP는 기본으로 Streamable HTTP를 쓰고 `/mcp/tools/tool-name` 형태 경로에서 post, `x-mcp` 블록을 붙입니다.

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

`method`는 MCP 작업을 고릅니다.`tools/call`, `tools/list`, `resources/read`, `resources/list`, `resources/templates/list`, `prompts/get`, `prompts/list`. `name`, `uri`, `argumentsSchema`, `arguments`는 메서드에 따라 씁니다.

## 구조 규칙

- `requestBody` 또는 `responses` 아래 각 미디어 유형에는 `schema`나 `$ref`가 필요합니다. 유일 예외는 `itemSchema`를 쓰는 `text/event-stream`.
- 각 매개변수에는 `schema`(또는 `content`)가 필요합니다.
- 작업 편집 시 선택 프로토콜과 설정이 **보존**됩니다. RPC나 스트리밍 작업이 REST로 조용히 변환되지 않습니다.
- 위 정확한 확장 형태를 쓰고 `externalUrl` 같은 키를 날조하거나 `ws`를 프로토콜 이름으로 쓰지 마세요.

## 왜 중요한가

단일 문서에서 6개 프로토콜을 모델링하면 전송과 무관하게 설계, 디버깅, 모킹, 문서, MCP가 같은 정보원으로 구동됩니다. 어시스턴트에 스트리밍이나 RPC 인터페이스 추가를 요청해도 프로토콜 설정이 온전히 유지되고 REST 전용 형태로 평탄화되지 않습니다.

관련: [어시스턴트로 설계하기](/docs/client/design)、[데이터 모델](/docs/client/data-model).
