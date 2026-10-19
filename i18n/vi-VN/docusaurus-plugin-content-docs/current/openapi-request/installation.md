---
sidebar_position: 2
title: "Cài đặt"
description: "Cài @powerduck/openapi-request, tìm hiểu đường dẫn con theo giao thức và thêm các gói tùy chọn cho gRPC, MCP."
---

# Cài đặt

`@powerduck/openapi-request` cung cấp bản dựng ESM và CommonJS kèm khai báo TypeScript. Yêu cầu Node.js `>= 22.12.0`.

## Cài đặt

```bash npm2yarn2pnpm
npm install @powerduck/openapi-request
```

Yarn:

```bash
yarn add @powerduck/openapi-request
```

pnpm:

```bash
pnpm add @powerduck/openapi-request
```

## ESM / CommonJS

```javascript
// ESM
import { createClient } from "@powerduck/openapi-request";

// CommonJS
const { createClient } = require("@powerduck/openapi-request");
```

Không cần thêm gói `@types/*`.

## Cấu trúc gói và các đường dẫn xuất con

Điểm vào mặc định xuất API lõi. Mỗi giao thức cũng có đường dẫn con riêng:

| Đường dẫn nhập | Nội dung |
|---|---|
| `@powerduck/openapi-request` | Lõi: `createClient`, `createDebugger`, `createManualSession`, `AdapterRegistry`, `ProtoKitError`, tiện ích OpenAPI và các kiểu. |
| `@powerduck/openapi-request/http` | `HttpAdapter`, `SseParser`, phát hiện luồng và bộ tạo bộ sưu tập, môi trường HTTP (`buildCollection`, `buildEnvironment`, `resolveServerUrl`). |
| `@powerduck/openapi-request/ws` | `WebSocketAdapter`, `createWsManualSession` cùng tiện ích cấu hình và phiên WebSocket. |
| `@powerduck/openapi-request/grpc` | `GrpcProtocolAdapter`, `GrpcAdapter`, `grpcCall`, `createGrpcManualSession` cùng các mô-đun khám phá, phản chiếu, bộ mô tả, danh mục, thông tin xác thực, tải và mẫu. |
| `@powerduck/openapi-request/mcp` | `McpAdapter`, `createMcpManualSession`, `createMcpStdioSession` cùng các mô-đun truyền tải, cấu hình, khám phá và tạo MCP. |
| `@powerduck/openapi-request/graphql` | `GraphQLAdapter`, `resolveGraphQLConfig`, `runGraphQL`, nội quan, tạo thao tác và ghi ngược thay đổi. |

Nhập đường dẫn con sẽ lấy kiểu và tiện ích của giao thức đó mà không xuất lại các bộ điều hợp không liên quan.

## Gói chức năng tùy chọn

gRPC và MCP có các phụ thuộc lớn, **chỉ được tải khi dùng lần đầu**. Bản cài chỉ dùng HTTP hoạt động mà không cần chúng. Chỉ cài khi cần giao thức tương ứng:

- **gRPC** yêu cầu `@grpc/grpc-js` và `@grpc/proto-loader`. Phản chiếu máy chủ còn yêu cầu `@grpc/proto-loader >= 0.7` để có `loadFileDescriptorSetFromBuffer`.
- **MCP** yêu cầu `@modelcontextprotocol/sdk`.

```bash npm2yarn2pnpm
# only when using the gRPC adapter
npm install @grpc/grpc-js @grpc/proto-loader

# only when using the MCP adapter
npm install @modelcontextprotocol/sdk
```

Nếu thiếu gói, bộ tải gRPC ném `GrpcDependencyMissingError` kèm lệnh cài chính xác. Nếu gói đã cài nhưng bị lỗi, kết quả là `GrpcDependencyBrokenError`.

## Kiểm tra

```typescript
import { createClient } from "@powerduck/openapi-request";
import { SseParser } from "@powerduck/openapi-request/http";
```

Cả hai đường dẫn nhập đều hoạt động sau khi cài gói.

## Các bước tiếp theo

- [Bắt đầu nhanh](/docs/vi-VN/openapi-request/quickstart/)
- [Cấu hình](/docs/vi-VN/openapi-request/configuration/)
