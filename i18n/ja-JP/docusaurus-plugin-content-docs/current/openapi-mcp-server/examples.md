---
sidebar_position: 6
title: "使用例"
description: "@powerduck/openapi-mcp-server の使用例：CLI の Web サーバー、stdio、API キー、独自の SpecProvider、ツール生成。"
keywords: ["openapi-mcp", "stdio", "SpecProvider", "generateTools"]
---

# 使用例

## 1. CLI：管理画面付きの Web トランスポート

```bash
openapi-mcp serve \
  --transport web \
  --port 3000 \
  --host 127.0.0.1 \
  --api-key your-admin-key \
  --spec ./openapi.yaml \
  --base-url https://api.example.com
```

管理画面は `/`、Streamable HTTP の MCP エンドポイントは `/mcp`、従来の SSE エンドポイントは `/sse` で提供されます。

## 2. プログラムから起動する stdio サーバー

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

## 3. API キー認証付きの管理サーバー

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

## 4. 独自の SpecProvider とコンテキストプロバイダー

MCP サーバーを構築し、自分の Express アプリにマウントします。

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

> `attachMcpRoutes` はパッケージのルートからエクスポートされます。オプションでセッション数の上限、CORS のオリジン、アイドルセッションのクリーンアップを設定できます。返されたハンドルには `listSessions`、`closeSession`、`closeAll`、`dispose` があります。終了時は `dispose()` を呼び出し、バックグラウンドのクリーンアップ処理を停止してセッションを閉じてください。管理画面も必要な場合は [`startAdminServer`](../api-reference/#admin-server-and-auth-server-subpath) を使います。

## 5. 仕様からツール、プロンプト、リソースを生成する

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

## 6. 自分の Express アプリで認証ミドルウェアを使う

```typescript
import express from "express";
import { createAuthMiddleware } from "@powerduck/openapi-mcp-server";

const app = express();
app.use("/admin", createAuthMiddleware(process.env.ADMIN_API_KEY));
app.get("/admin/status", (req, res) => res.json({ ok: true }));
```

キーを省略するとアクセス保護が無効になります。空文字列を渡した場合は、無言でアクセスを許可するのではなく、エラーが発生します。

## 関連項目

- [クイックスタート](../quickstart/)
- [API リファレンス](../api-reference/)
