---
sidebar_position: 1
title: "Giới thiệu @powerduck/openapi-request"
description: "@powerduck/openapi-request là trình gỡ lỗi bộ sưu tập và thư viện thực thi yêu cầu cho OpenAPI 3.2. Thư viện xây dựng và gửi yêu cầu từ tài liệu OpenAPI, nhận diện phản hồi dạng luồng, đồng thời có thể tạo tài liệu đã cập nhật từ phản hồi thực tế. Một giao diện gọn nhẹ hỗ trợ sáu giao thức truyền thông."
---

# Giới thiệu @powerduck/openapi-request

`@powerduck/openapi-request` là trình gỡ lỗi bộ sưu tập và thư viện thực thi yêu cầu cho OpenAPI 3.2. Thư viện xây dựng và gửi yêu cầu từ tài liệu OpenAPI, nhận diện phản hồi dạng luồng, đồng thời có thể tạo tài liệu đã cập nhật từ phản hồi thực tế. Một giao diện gọn nhẹ hỗ trợ sáu giao thức truyền thông.

- **Tên gói:** `@powerduck/openapi-request`
- **Phiên bản:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-request"/>
- **Giấy phép:** MIT
- **Định dạng mô-đun:** có cả bản dựng ESM và CommonJS, kèm khai báo kiểu.

## Mục đích sử dụng

Thư viện đáp ứng ba nhu cầu với cùng một tài liệu làm cơ sở:

- **Máy khách dành cho giao diện đồ họa** — `createClient()` trả về đối tượng có các phương thức `prepare()`, `send()`, `connect()`, `discover()` và `writeback()`, tương ứng với từng bước trong trình soạn yêu cầu đồ họa.
- **Trình gỡ lỗi điều khiển bằng tập lệnh** — `createDebugger()` trả về `ProtoKit` với `send()`, `sendMany()` và `toCollection()` để dùng trong tự động hóa, tập lệnh và CI.
- **Phiên kết nối dài hạn được quản lý thủ công** — `createManualSession()` trả về đối tượng phiên hai chiều với thao tác mở, gửi, đóng và luồng sự kiện. WebSocket, MCP và gRPC dùng cùng cấu trúc đối tượng nên một giao diện có thể xử lý cả ba.

## Bộ điều hợp giao thức

Phần lõi không phụ thuộc vào cơ chế truyền tải; hành vi của từng giao thức do các bộ điều hợp đã đăng ký trong `AdapterRegistry` cung cấp.

- **HTTP / SSE** — được hỗ trợ mặc định. Tự động nhận diện yêu cầu JSON thông thường và luồng Server-Sent Events dựa trên kiểu nội dung đã khai báo hoặc tiêu đề phản hồi thực tế.
- **WebSocket** — phiên hai chiều dạng văn bản hoặc nhị phân với cấu trúc sự kiện thống nhất.
- **gRPC** — lời gọi đơn, luồng từ máy chủ, luồng từ máy khách và luồng hai chiều dựa trên tệp `.proto` hoặc phản chiếu máy chủ.
- **MCP** — gọi công cụ Model Context Protocol qua Streamable HTTP hoặc stdio.
- **GraphQL** — truy vấn cấu trúc, tạo và thực thi thao tác.

## Tính năng chính

- **Mô hình bộ sưu tập OpenAPI 3.2** — tìm thao tác bằng `operationId` hoặc `method`+`path`, rồi xây dựng yêu cầu từ tham số, nội dung yêu cầu và ví dụ.
- **Nhận diện luồng** — `isStreamingOperation()`, `isSseContentType()` và `isStreamingContentType()` phân loại phản hồi theo kiểu nội dung đã khai báo; `probeStreamingResponse()` kiểm tra tiêu đề phản hồi thực tế.
- **Ghi phản hồi trở lại tài liệu** — `inferSchema()`, `mergeSchema()`, `toResponseObject()` và `writeBackResponse()` suy ra lược đồ phản hồi và trả về tài liệu đã cập nhật. Theo mặc định, `send()` trả tài liệu này trong `patchedSpec` khi việc ghi lại thành công; đặt `writeBack: false` để tắt. Tài liệu đầu vào không bị sửa đổi và không có tệp nào được lưu tự động. Hãy kiểm tra `writeBackSkippedReason` và `writeBackWarnings` trước khi lưu kết quả lâu dài.
- **Tiện ích lược đồ** — `sampleFromSchema()` tạo dữ liệu mẫu từ lược đồ.
- **Tải chậm các phụ thuộc lớn** — gRPC (`@grpc/grpc-js`, `@grpc/proto-loader`) và MCP (`@modelcontextprotocol/sdk`) chỉ được tải ở lần sử dụng đầu tiên. Nếu chỉ dùng HTTP, ứng dụng không phải chịu chi phí tải các phụ thuộc này.

## Cài đặt

```bash npm2yarn2pnpm
npm install @powerduck/openapi-request
```

## Bắt đầu nhanh

```typescript
import { createClient } from "@powerduck/openapi-request";

const spec = {
  openapi: "3.2.0",
  info: { title: "Users", version: "1.0.0" },
  paths: {
    "/users/{id}": {
      get: {
        operationId: "getUserById",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "User" } },
      },
    },
  },
};

const client = createClient();

const plan = client.prepare({
  spec,
  target: { operationId: "getUserById" },
});

const result = await client.send({
  spec,
  target: { operationId: "getUserById" },
  values: { path: { id: "42" } },
  serverUrl: "https://api.example.com",
});
```

## Bước tiếp theo

- [Cài đặt](./installation.md) — cấu trúc gói, các mục xuất qua đường dẫn con và phụ thuộc ngang hàng cho tính năng giao thức.
- [Bắt đầu nhanh](./quickstart.md) — yêu cầu đầu tiên, chạy trình gỡ lỗi và phiên thủ công.
- [Cấu hình](./configuration.md) — `CreateClientOptions`, `DebuggerOptions` và cấu hình theo giao thức.
- [Tham chiếu API](./api-reference.md) — tất cả mục xuất được nhóm theo chức năng.
- [Ví dụ](./examples.md) — ví dụ có thể chạy cho HTTP, SSE, WebSocket, GraphQL, MCP và gRPC.

## Giấy phép

MIT.
