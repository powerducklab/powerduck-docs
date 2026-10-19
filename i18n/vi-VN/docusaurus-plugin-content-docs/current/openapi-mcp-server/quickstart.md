---
sidebar_position: 3
title: "Bắt đầu nhanh"
description: "Bắt đầu với @powerduck/openapi-mcp-server: CLI có bảng điều khiển web, máy chủ stdio chạy bằng mã và máy chủ quản trị tích hợp."
---

# Bắt đầu nhanh

Có ba cách chạy: CLI có bảng điều khiển web, máy chủ stdio khởi chạy bằng mã hoặc máy chủ quản trị tích hợp.

## 1. CLI: chế độ web có giao diện quản trị

```bash
openapi-mcp serve \
  --transport web \
  --port 3000 \
  --host 127.0.0.1 \
  --api-key your-admin-key
```

Mở `http://127.0.0.1:3000` để tải lên hoặc dán tài liệu OpenAPI, xem các công cụ, prompt và tài nguyên đã tạo, đồng thời theo dõi nhật ký yêu cầu. Máy khách MCP kết nối tới `/mcp` (Streamable HTTP) hoặc `/sse` (cơ chế truyền tải cũ).

## 2. CLI: chế độ stdio

```bash
openapi-mcp serve \
  --transport stdio \
  --spec ./openapi.yaml \
  --base-url https://api.example.com
```

Ở chế độ stdio, `--spec` là bắt buộc. Tiến trình giao tiếp bằng MCP qua stdin/stdout.

## 3. Chạy bằng mã: máy chủ stdio

```typescript
import { loadOpenApiSpec, startStdioServer } from "@powerduck/openapi-mcp-server";

const spec = await loadOpenApiSpec("./openapi.yaml");

const handle = await startStdioServer(
  spec,
  { baseUrlOverride: "https://api.example.com" }, // ExecutionContext
  { handleSignals: true },
);

await handle.closed; // resolves when the peer closes stdin
```

## 4. Chạy bằng mã: máy chủ do bạn điều khiển

```typescript
import { buildMcpServer, attachSseRoutes } from "@powerduck/openapi-mcp-server";
import express from "express";

// specProvider returns the active document (or null); contextProvider returns
// the per-call ExecutionContext (base URL override, security, timeouts, logs).
const server = buildMcpServer(
  () => spec,
  () => ({ baseUrlOverride: "https://api.example.com" }),
  { name: "my-api", version: "1.0.0" },
);

const app = express();
app.use(express.json());
attachSseRoutes(
  app,
  () => spec,
  () => ({ baseUrlOverride: "https://api.example.com" }),
);
app.listen(3000);
```

> Để dùng giao diện đầy đủ hơn `attachMcpRoutes(app, options)`, với `maxSessions`, `allowedOrigins`, `sessionIdleMs`, `listSessions`, `closeSession` và các tùy chọn khác, hãy nhập từ `@powerduck/openapi-mcp-server`. Máy chủ quản trị cũng dùng hàm này.

## 5. Máy chủ quản trị có xác thực

```typescript
import { startAdminServer } from "@powerduck/openapi-mcp-server/server";

const handle = await startAdminServer({
  port: 3000,
  host: "127.0.0.1",
  apiKey: "your-admin-key",
  specPath: "./openapi.yaml",
});

console.log("admin on", handle.port);
await handle.close();
```

## Các bước tiếp theo

- [Cấu hình](/docs/vi-VN/openapi-mcp-server/configuration/) — Toàn bộ tùy chọn của `ServerConfig`.
- [Ví dụ](/docs/vi-VN/openapi-mcp-server/examples/) — Thêm ví dụ sử dụng bằng mã.
- [Tham chiếu API](/docs/vi-VN/openapi-mcp-server/api-reference/) — Tất cả thành phần được xuất.
