---
sidebar_position: 3
title: "快速入門"
description: "@powerduck/openapi-mcp-server 入門：附有 Web 主控台的 CLI、透過程式碼啟動的 stdio 服務，以及內嵌管理伺服器。"
---

# 快速入門

有三種執行方式：附有 Web 主控台的 CLI、透過程式碼啟動的 stdio 伺服器，或內嵌管理伺服器。

## 1. CLI：附有管理介面的 Web 模式

```bash
openapi-mcp serve \
  --transport web \
  --port 3000 \
  --host 127.0.0.1 \
  --api-key your-admin-key
```

開啟 `http://127.0.0.1:3000`，上傳或貼上 OpenAPI 文件，查看產生的工具、提示詞、資源及請求記錄。MCP 用戶端連線至 `/mcp`（Streamable HTTP）或 `/sse`（舊版傳輸）。

## 2. CLI：stdio 模式

```bash
openapi-mcp serve \
  --transport stdio \
  --spec ./openapi.yaml \
  --base-url https://api.example.com
```

stdio 模式必須提供 `--spec`。處理程序透過 stdin/stdout 使用 MCP 通訊。

## 3. 透過程式碼啟動 stdio 伺服器

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

## 4. 透過程式碼建立可自行控制的伺服器

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

> 若要使用功能更完整的 `attachMcpRoutes(app, options)` 控制介面，包括 `maxSessions`、`allowedOrigins`、`sessionIdleMs`、`listSessions`、`closeSession` 等，請從 `@powerduck/openapi-mcp-server` 匯入。管理伺服器也使用同一個函式。

## 5. 啟用驗證的管理伺服器

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

## 後續步驟

- [設定](/docs/zh-TW/openapi-mcp-server/configuration/) — 完整的 `ServerConfig` 設定。
- [範例](/docs/zh-TW/openapi-mcp-server/examples/) — 更多透過程式碼呼叫的範例。
- [API 參考](/docs/zh-TW/openapi-mcp-server/api-reference/) — 所有匯出項目。
