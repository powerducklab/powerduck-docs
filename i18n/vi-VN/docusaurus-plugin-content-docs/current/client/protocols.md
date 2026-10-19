---
sidebar_position: 5
title: "Giao thức"
description: "Hệ thống thực tế không chỉ dùng REST. Powerduck mô hình hóa bảy giao thức trên các đối tượng đường dẫn OpenAPI thông thường bằng phần mở rộng x-protocol. Nhờ đó, thao tác truyền luồng và RPC nằm trong cùng đặc tả với HTTP, thay vì được quản lý bằng công cụ riêng hoặc âm thầm chuyển thành REST."
---

# Giao thức

Hệ thống thực tế không chỉ dùng REST. Powerduck mô hình hóa bảy giao thức trên các đối tượng đường dẫn OpenAPI thông thường bằng phần mở rộng `x-protocol`. Nhờ đó, thao tác truyền luồng và RPC nằm trong cùng đặc tả với HTTP, thay vì được quản lý bằng công cụ riêng hoặc âm thầm chuyển thành REST.

Mỗi thao tác không phải HTTP vẫn là một đối tượng đường dẫn thông thường, có phương thức HTTP và `responses."200".description`:

- `graphql`, `grpc`, `mcp` và `a2a` dùng **post**;
- `sse` và `websocket` thường dùng **get**;
- `http` là mặc định và không cần `x-protocol`.

## SSE

Sự kiện do máy chủ gửi qua HTTP dùng `x-protocol: "sse"`. Loại nội dung truyền luồng là `text/event-stream`, mô tả dữ liệu của một sự kiện bằng `itemSchema`, không phải `schema`:

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

WebSocket dùng `x-protocol: "websocket"` cùng khối `x-websocket`. URL phải bắt đầu bằng `ws://` hoặc `wss://`:

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

`subprotocols` và `headers` là tùy chọn.

## GraphQL

GraphQL dùng post trên đường dẫn như `/graphql/query/fieldName`, với `x-graphql`. Điểm cuối phải là URL HTTP(S) tuyệt đối và truy vấn là bắt buộc:

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

`operationName`, `variablesSchema` và `variables` là tùy chọn.

## gRPC

gRPC dùng post trên đường dẫn như `/grpc/pkg.Service/Method`, với `x-grpc`. Nếu máy chủ hỗ trợ reflection, đặt `reflection: true`; nếu không, cung cấp `protoPaths` và có thể thêm `includeDirs`:

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

`kind` nhận một trong các giá trị `unary`, `server_streaming`, `client_streaming` hoặc `bidi_streaming`.

## MCP

MCP mặc định dùng Streamable HTTP, với post trên đường dẫn như `/mcp/tools/tool-name` và khối `x-mcp`:

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

`method` chọn thao tác MCP: `tools/call`, `tools/list`, `resources/read`, `resources/list`, `resources/templates/list`, `prompts/get` hoặc `prompts/list`. Các trường `name`, `uri`, `argumentsSchema` và `arguments` được dùng tùy theo phương thức.

## Quy tắc cấu trúc

- Với hợp đồng do trợ lý tạo, hãy cung cấp `schema` hoặc `$ref` cho loại nội dung trong `requestBody` hoặc `responses`; `text/event-stream` dùng `itemSchema` của OAS 3.2 cho từng sự kiện. Đây là quy ước soạn thảo của Powerduck, không phải yêu cầu chung cho mọi tài liệu OpenAPI.
- Mỗi tham số phải có `schema` hoặc `content`.
- Giao thức được chọn và cấu hình của nó **được giữ nguyên khi chỉnh sửa** thao tác. Thao tác RPC và truyền luồng không bao giờ bị âm thầm chuyển thành REST.
- Dùng đúng cấu trúc phần mở rộng ở trên; không tự đặt khóa như `externalUrl`, và không dùng `ws` làm tên giao thức.

## Vì sao điều này quan trọng

Mô hình hóa các giao thức trong một tài liệu giúp thiết kế, gỡ lỗi và tài liệu cùng dựa trên một nguồn dữ liệu. Khả năng thực thi, mô phỏng và tạo MCP phụ thuộc vào cơ chế truyền tải. A2A 1.0 hỗ trợ gỡ lỗi và tài liệu cho JSON-RPC, REST, gRPC trên ứng dụng máy tính, cùng khả năng tạo máy chủ chuyển tiếp thông điệp không lưu trạng thái. Tác vụ bền vững và gửi thông báo đẩy cần triển khai riêng. Khi bạn yêu cầu thêm điểm cuối truyền luồng hoặc RPC, trợ lý giữ nguyên cấu hình giao thức thay vì ép về cấu trúc chỉ có REST.

Liên quan: [Thiết kế cùng trợ lý](./design.md), [Mô hình dữ liệu](./data-model.md).

## A2A

Dùng `x-protocol: a2a` với `x-a2a` cho thông điệp và tác vụ của tác tử qua JSON-RPC, REST hoặc gRPC trên ứng dụng máy tính. A2A 1.0 hỗ trợ cả ba cơ chế kết nối; phiên bản 0.3 hỗ trợ JSON-RPC. Cấu trúc dữ liệu truyền đi khác nhau giữa các phiên bản. Xem [Tác tử A2A](./a2a.md) để biết cấu hình, ví dụ, cách khám phá tác tử và giới hạn.
