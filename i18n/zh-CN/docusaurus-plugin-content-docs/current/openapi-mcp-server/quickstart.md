---
sidebar_position: 3
title: "快速开始"
description: "@powerduck/openapi-mcp-server 入门：带 Web 控制台的 CLI、通过代码启动的 stdio 服务，以及内嵌管理服务器。"
---

# 快速开始

有三种运行方式：带 Web 控制台的 CLI、通过代码启动的 stdio 服务器，或内嵌管理服务器。

## 1. CLI：带管理界面的 Web 模式

```bash
openapi-mcp serve \
  --transport web \
  --port 3000 \
  --host 127.0.0.1 \
  --api-key your-admin-key
```

打开 `http://127.0.0.1:3000`，上传或粘贴 OpenAPI 文档，查看生成的工具、提示词和资源，以及请求日志。MCP 客户端连接 `/mcp`（Streamable HTTP）或 `/sse`（旧版传输）。

## 2. CLI：stdio 模式

```bash
openapi-mcp serve \
  --transport stdio \
  --spec ./openapi.yaml \
  --base-url https://api.example.com
```

stdio 模式必须提供 `--spec`。进程通过 stdin/stdout 使用 MCP 通信。

## 3. 通过代码启动 stdio 服务器

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

## 4. 通过代码构建可自行控制的服务器

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

> 如需使用功能更完整的 `attachMcpRoutes(app, options)` 句柄，包括 `maxSessions`、`allowedOrigins`、`sessionIdleMs`、`listSessions`、`closeSession` 等，请从 `@powerduck/openapi-mcp-server` 导入。管理服务器也使用同一个函数。

## 5. 带身份验证的管理服务器

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

## 下一步

- [配置](/docs/zh-CN/openapi-mcp-server/configuration/) — 完整的 `ServerConfig` 配置。
- [示例](/docs/zh-CN/openapi-mcp-server/examples/) — 更多通过代码调用的示例。
- [API 参考](/docs/zh-CN/openapi-mcp-server/api-reference/) — 全部导出项。
