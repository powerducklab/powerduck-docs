---
sidebar_position: 6
title: "示例"
description: "@powerduck/openapi-mcp-server 示例：CLI Web 服务、stdio、API 密钥、自定义 SpecProvider 和工具生成。"
keywords: ["openapi-mcp", "stdio", "SpecProvider", "generateTools"]
---

# 示例

## 1. CLI：带管理界面的 Web 传输

```bash
openapi-mcp serve \
  --transport web \
  --port 3000 \
  --host 127.0.0.1 \
  --api-key your-admin-key \
  --spec ./openapi.yaml \
  --base-url https://api.example.com
```

管理控制台位于 `/`，Streamable HTTP MCP 端点位于 `/mcp`，旧版 SSE 端点位于 `/sse`。

## 2. 编程调用：stdio 服务

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

## 3. 使用 API 密钥认证的管理服务

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

## 4. 自定义 SpecProvider 和上下文提供函数

手动创建 MCP 服务，并挂载到自己的 Express 应用中：

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

> `attachMcpRoutes` 从包的根入口导出。其选项用于控制会话数量上限、CORS 来源和空闲会话清理；返回的句柄提供 `listSessions`、`closeSession`、`closeAll` 和 `dispose`。关闭服务时应调用 `dispose()`，停止后台清理定时器并关闭会话。如果还需要管理控制台，请使用 [`startAdminServer`](../api-reference/#admin-server-and-auth-server-subpath)。

## 5. 从规范生成工具、提示词和资源

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

## 6. 在自己的 Express 应用中使用认证中间件

```typescript
import express from "express";
import { createAuthMiddleware } from "@powerduck/openapi-mcp-server";

const app = express();
app.use("/admin", createAuthMiddleware(process.env.ADMIN_API_KEY));
app.get("/admin/status", (req, res) => res.json({ ok: true }));
```

省略密钥会禁用访问保护；传入空字符串则会抛出错误，而不会悄悄开放访问。

## 另请参阅

- [快速开始](../quickstart/)
- [API 参考](../api-reference/)
