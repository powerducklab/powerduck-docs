---
sidebar_position: 1
title: "Giới thiệu"
description: "Chuyển OpenAPI thành dịch vụ MCP: công cụ, prompt, tài nguyên, bảng quản trị web, stdio, HTTP và CLI openapi-mcp."
keywords: ["openapi-mcp-server", "MCP", "OpenAPI", "stdio", "HTTP"]
---

# @powerduck/openapi-mcp-server — Giới thiệu

`@powerduck/openapi-mcp-server` chuyển tài liệu OpenAPI thành dịch vụ MCP (Model Context Protocol) đang hoạt động. Gói tạo **công cụ** từ thao tác, **prompt** từ siêu dữ liệu và thao tác API, cùng **tài nguyên** từ danh mục API, rồi cung cấp chúng qua giao thức MCP với giao diện quản trị web tích hợp.

- **Tên gói:** `@powerduck/openapi-mcp-server`
- **Phiên bản:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-mcp-server"/>
- **Giấy phép:** MIT
- **Yêu cầu Node:** `>=22.12.0`
- **Lệnh CLI:** `openapi-mcp`
- **Định dạng mô-đun:** Bản dựng ESM và CommonJS kèm khai báo kiểu.

Gói dùng `@powerduck/openapi-parser` để kiểm tra và phân giải tham chiếu, cùng `@modelcontextprotocol/sdk` để triển khai giao thức.

## Nội dung được tạo

- **Tools** — Một công cụ MCP cho mỗi thao tác OpenAPI, hỗ trợ đầy đủ việc tuần tự hóa tham số (kiểu path/query/header/cookie và quy tắc explode), mã hóa phần thân yêu cầu (JSON, form-urlencoded, multipart, văn bản, nhị phân) và chú thích công cụ MCP (`readOnlyHint`, `destructiveHint`, `idempotentHint`).
- **Prompts** — Prompt toàn cục (`spec_overview`, `integration_guardrails`) và prompt theo thao tác (`explain_*`, `plan_*`, `sample_*`).
- **Resources** — Tài nguyên danh mục cố định như `openapi://spec/summary`, `openapi://catalog/tools`, `openapi://spec/document`.

## Phương thức truyền tải

- **stdio** — `startStdioServer()` cung cấp một tài liệu cho ứng dụng MCP cục bộ, chẳng hạn Claude Desktop hoặc tích hợp trình soạn thảo.
- **HTTP** — `attachMcpRoutes(app, options)` gắn Streamable HTTP tại `/mcp` và tùy chọn SSE cũ tại `/sse` trong ứng dụng Express. Các tùy chọn kiểm soát giới hạn phiên, thời gian chờ khi không hoạt động, CORS và bảo vệ chống DNS rebinding. `startAdminServer()` bổ sung giao diện quản trị và sử dụng giới hạn phiên mặc định. `attachSseRoutes()` vẫn được giữ lại dưới dạng hàm bọc đã lỗi thời dùng đối số vị trí.

## Máy chủ quản trị

`startAdminServer()` khởi chạy ứng dụng Express cung cấp:

- bảng quản trị web để tải lên hoặc dán đặc tả, kiểm tra công cụ, prompt, tài nguyên, xem dịch vụ đang chạy và nhật ký yêu cầu;
- các phương thức truyền tải HTTP của MCP;
- xác thực bằng khóa API, ghi nhật ký yêu cầu có che tiêu đề nhạy cảm và tùy chọn lưu trạng thái lâu dài.

## Cài đặt

```bash npm2yarn2pnpm
npm install @powerduck/openapi-mcp-server
```

## Bắt đầu nhanh

```bash
openapi-mcp serve --transport web --port 3000 --api-key your-admin-key
```

## Các bước tiếp theo

- [Cài đặt](../installation/) — npm/yarn/pnpm, cài đặt toàn cục, đường dẫn con `./server` và các gói phụ thuộc.
- [Bắt đầu nhanh](../quickstart/) — Sử dụng qua CLI và trong mã.
- [Cấu hình](../configuration/) — Mô tả đầy đủ `ServerConfig`.
- [Tham chiếu API](../api-reference/) — Mọi thành phần được xuất và lệnh CLI.
- [Ví dụ](../examples/) — Ví dụ thực tế.

## Giấy phép

MIT.
