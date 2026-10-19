---
sidebar_position: 6
title: "範例"
description: "@powerduck/openapi-mcp-server 範例：CLI Web 服務、stdio、API 金鑰、自訂 SpecProvider 與工具產生。"
keywords: ["openapi-mcp", "stdio", "SpecProvider", "generateTools"]
---

# 範例

## 1. CLI：附管理介面的 Web 傳輸

```bash
openapi-mcp serve \
  --transport web \
  --port 3000 \
  --host 127.0.0.1 \
  --api-key your-admin-key \
  --spec ./openapi.yaml \
  --base-url https://api.example.com
```

管理主控台位於 `/`，Streamable HTTP MCP 端點位於 `/mcp`，舊版 SSE 端點位於 `/sse`。

## 2. 透過程式呼叫：stdio 服務

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

## 3. 使用 API 金鑰驗證的管理服務

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

## 4. 自訂 SpecProvider 與內容提供函式

自行建立 MCP 服務，並掛載到自己的 Express 應用程式：

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

> `attachMcpRoutes` 從套件根入口匯出。其選項可控制工作階段數量上限、CORS 來源與閒置工作階段清理；傳回的控制代碼提供 `listSessions`、`closeSession`、`closeAll` 與 `dispose`。關閉服務時請呼叫 `dispose()`，停止背景清理計時器並關閉工作階段。若也需要管理主控台，請使用 [`startAdminServer`](../api-reference/#admin-server-and-auth-server-subpath)。

## 5. 從規格產生工具、提示詞與資源

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

## 6. 在自己的 Express 應用程式中使用驗證中介軟體

```typescript
import express from "express";
import { createAuthMiddleware } from "@powerduck/openapi-mcp-server";

const app = express();
app.use("/admin", createAuthMiddleware(process.env.ADMIN_API_KEY));
app.get("/admin/status", (req, res) => res.json({ ok: true }));
```

省略金鑰會停用存取保護；傳入空字串則會擲回錯誤，不會在沒有提示的情況下開放存取。

## 另請參閱

- [快速入門](../quickstart/)
- [API 參考](../api-reference/)
