---
sidebar_position: 6
title: "Ví dụ"
description: "Ví dụ về @powerduck/openapi-mcp-server: máy chủ web qua CLI, stdio, khóa API, SpecProvider tùy chỉnh và tạo công cụ."
keywords: ["openapi-mcp", "stdio", "SpecProvider", "generateTools"]
---

# Ví dụ

## 1. CLI: truyền tải qua web kèm giao diện quản trị

```bash
openapi-mcp serve \
  --transport web \
  --port 3000 \
  --host 127.0.0.1 \
  --api-key your-admin-key \
  --spec ./openapi.yaml \
  --base-url https://api.example.com
```

Bảng điều khiển quản trị được cung cấp tại `/`, endpoint MCP Streamable HTTP tại `/mcp` và endpoint SSE cũ tại `/sse`.

## 2. Khởi chạy máy chủ stdio bằng mã

```typescript
import { loadOpenApiSpec, startStdioServer } from "@powerduck/openapi-mcp-server";

const spec = await loadOpenApiSpec("./openapi.yaml");

const handle = await startStdioServer(
  spec,
  {
    baseUrlOverride: "https://api.example.com",
    security: { bearerToken: process.env.UPSTREAM_TOKEN },
    requestTimeoutMs: 10000,
  },
  { handleSignals: true },
);

console.error("stdio MCP server ready");
await handle.closed;
```

## 3. Máy chủ quản trị xác thực bằng khóa API

```typescript
import { startAdminServer } from "@powerduck/openapi-mcp-server/server";

const handle = await startAdminServer({
  port: 3000,
  host: "127.0.0.1",
  apiKey: process.env.ADMIN_API_KEY,
  specPath: "./openapi.yaml",
  allowedOrigins: ["https://your-console.example.com"],
  redactSensitiveHeaders: true,
  maxLogEntries: 500,
});

console.log("admin listening on", handle.port);
// ...
await handle.close();
```

## 4. SpecProvider và hàm cung cấp ngữ cảnh tùy chỉnh

Tự tạo máy chủ MCP và gắn vào ứng dụng Express của bạn:

```typescript
import express from "express";
import {
  attachMcpRoutes,
  loadOpenApiSpec,
} from "@powerduck/openapi-mcp-server";

let spec = await loadOpenApiSpec("./openapi.yaml");

// A provider that can be swapped at runtime without restarting sessions.
const specProvider = () => spec;
const contextProvider = () => ({
  baseUrlOverride: "https://api.example.com",
  security: { bearerToken: process.env.UPSTREAM_TOKEN },
});

const app = express();
app.use(express.json());

const routes = attachMcpRoutes(app, {
  specProvider,
  contextProvider,
  maxSessions: 64,
  sessionIdleMs: 600000,
});
console.log(routes.listSessions());

app.listen(8080, () => console.log("mcp on :8080/mcp"));
```

> `attachMcpRoutes` được xuất từ gốc gói. Các tùy chọn kiểm soát giới hạn phiên, nguồn CORS và việc dọn dẹp phiên không hoạt động. Đối tượng trả về cung cấp `listSessions`, `closeSession`, `closeAll` và `dispose`. Gọi `dispose()` khi tắt để dừng tác vụ dọn dẹp nền và đóng các phiên. Dùng [`startAdminServer`](../api-reference/#admin-server-and-auth-server-subpath) nếu bạn cũng cần bảng điều khiển quản trị.

## 5. Tạo công cụ, prompt và tài nguyên từ đặc tả

```typescript
import {
  loadOpenApiSpec,
  generateTools,
  generateToolsDetailed,
  buildBindingIndex,
  generatePrompts,
  generateResources,
  executeToolCall,
} from "@powerduck/openapi-mcp-server";

const spec = await loadOpenApiSpec("./openapi.yaml");

const tools = generateTools(spec);
console.log(tools.map((t) => t.name));

const detailed = generateToolsDetailed(spec);
console.log("issues:", detailed.issues);

const bindings = buildBindingIndex(spec); // toolName -> ToolBinding

console.log(generatePrompts(spec).map((p) => p.name));
console.log(generateResources(spec).map((r) => r.uri));

// Execute one generated tool directly.
const result = await executeToolCall(
  spec,
  "get_user",
  { id: "42" },
  { baseUrlOverride: "https://api.example.com" },
);
console.log(result.status, result.data);
```

## 6. Dùng middleware xác thực trong ứng dụng Express riêng

```typescript
import express from "express";
import { createAuthMiddleware } from "@powerduck/openapi-mcp-server";

const app = express();
app.use("/admin", createAuthMiddleware(process.env.ADMIN_API_KEY));
app.get("/admin/status", (req, res) => res.json({ ok: true }));
```

Nếu bỏ qua khóa, cơ chế bảo vệ truy cập sẽ bị tắt. Chuỗi rỗng sẽ gây lỗi thay vì âm thầm cho phép truy cập.

## Xem thêm

- [Bắt đầu nhanh](../quickstart/)
- [Tham chiếu API](../api-reference/)
