---
sidebar_position: 2
title: "Cài đặt"
description: "Cài @powerduck/openapi-mcp-server bằng npm, yarn, pnpm hoặc trên toàn hệ thống. Tìm hiểu CLI openapi-mcp, đường dẫn con ./server và phụ thuộc. Yêu cầu Node.js 22.12.0 trở lên."
---

# Cài đặt

## Yêu cầu

- **Node.js `>=22.12.0`** (được khai báo trong `engines`).

## Cài đặt

```bash npm2yarn2pnpm
npm install @powerduck/openapi-mcp-server
```

Yarn:

```bash
yarn add @powerduck/openapi-mcp-server
```

pnpm:

```bash
pnpm add @powerduck/openapi-mcp-server
```

## CLI

Gói đăng ký chương trình `openapi-mcp`.

```bash
# global install
npm install -g @powerduck/openapi-mcp-server

# or run without installing
npx --package @powerduck/openapi-mcp-server openapi-mcp --help
```

CLI có một lệnh duy nhất là `serve` (xem [Bắt đầu nhanh](/docs/vi-VN/openapi-mcp-server/quickstart/)).

## ESM / CommonJS

Cả hai định dạng bản dựng đều kèm khai báo kiểu. Không cần `@types/*` bổ sung:

```javascript
// ESM
import { buildMcpServer, startStdioServer } from "@powerduck/openapi-mcp-server";

// CommonJS
const { buildMcpServer, startStdioServer } = require("@powerduck/openapi-mcp-server");
```

## Xuất đường dẫn con

| Đường dẫn nhập | Nội dung |
| --- | --- |
| `@powerduck/openapi-mcp-server` | Thư viện lõi: tải đặc tả, tạo công cụ/prompt/tài nguyên, thực thi yêu cầu, xây dựng máy chủ MCP, truyền tải stdio và HTTP. |
| `@powerduck/openapi-mcp-server/server` | Máy chủ HTTP quản trị và middleware xác thực (`startAdminServer`, `createAuthMiddleware`). |

## Phụ thuộc lúc chạy

Các phụ thuộc sau được cài tự động cùng gói:

- `@modelcontextprotocol/sdk` — triển khai giao thức MCP.
- `@powerduck/openapi-parser` — xác thực, phân giải tham chiếu và nâng cấp OpenAPI.
- `express` và `cors` — máy chủ HTTP quản trị và CORS.
- `axios` — ứng dụng khách HTTP gửi yêu cầu đến dịch vụ đích khi thực thi công cụ.
- `commander` — khung CLI.
- `js-yaml` — phân tích YAML.
- `multer` — xử lý việc tải đặc tả lên.
- `terser` — thu gọn tài nguyên giao diện web nhúng.

## Kiểm tra

```bash
npx --package @powerduck/openapi-mcp-server openapi-mcp --help
```

## Bước tiếp theo

- [Bắt đầu nhanh](/docs/vi-VN/openapi-mcp-server/quickstart/)
- [Cấu hình](/docs/vi-VN/openapi-mcp-server/configuration/)
