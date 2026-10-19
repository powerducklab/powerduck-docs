---
sidebar_position: 3
title: "クイックスタート"
description: "@powerduck/openapi-mcp-server の使い方：Web コンソール付き CLI、プログラムから起動する stdio サーバー、組み込み管理サーバー。"
---

# クイックスタート

実行方法は 3 つあります。Web コンソール付き CLI、プログラムから起動する stdio サーバー、組み込み管理サーバーです。

## 1. CLI：管理画面付き Web モード

```bash
openapi-mcp serve \
  --transport web \
  --port 3000 \
  --host 127.0.0.1 \
  --api-key your-admin-key
```

`http://127.0.0.1:3000` を開くと、OpenAPI ドキュメントのアップロードや貼り付け、生成されたツール・プロンプト・リソースの確認、リクエストログの閲覧ができます。MCP クライアントは `/mcp`（Streamable HTTP）または `/sse`（従来方式）に接続します。

## 2. CLI：stdio モード

```bash
openapi-mcp serve \
  --transport stdio \
  --spec ./openapi.yaml \
  --base-url https://api.example.com
```

stdio モードでは `--spec` が必須です。プロセスは stdin/stdout を使って MCP で通信します。

## 3. プログラムから使う：stdio サーバー

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

## 4. プログラムから使う：サーバーを自分で制御する

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

> `maxSessions`、`allowedOrigins`、`sessionIdleMs`、`listSessions`、`closeSession` などを備えた、より高機能な `attachMcpRoutes(app, options)` ハンドルは、`@powerduck/openapi-mcp-server` からインポートしてください。管理サーバーも同じ関数を使っています。

## 5. 認証付き管理サーバー

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

## 次のステップ

- [設定](/docs/ja-JP/openapi-mcp-server/configuration/) — `ServerConfig` の全オプション。
- [使用例](/docs/ja-JP/openapi-mcp-server/examples/) — プログラムから利用するためのその他の例。
- [API リファレンス](/docs/ja-JP/openapi-mcp-server/api-reference/) — すべてのエクスポート。
