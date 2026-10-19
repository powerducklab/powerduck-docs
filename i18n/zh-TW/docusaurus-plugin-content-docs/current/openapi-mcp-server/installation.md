---
sidebar_position: 2
title: "安裝"
description: "透過 npm、yarn、pnpm 或全域方式安裝 @powerduck/openapi-mcp-server，了解 openapi-mcp 命令列、./server 子路徑與執行階段相依套件。需要 Node.js 22.12.0 以上版本。"
---

# 安裝

## 環境需求

- **Node.js `>=22.12.0`**（在 `engines` 中宣告）。

## 安裝

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

套件註冊了 `openapi-mcp` 執行檔。

```bash
# global install
npm install -g @powerduck/openapi-mcp-server

# or run without installing
npx --package @powerduck/openapi-mcp-server openapi-mcp --help
```

CLI 僅提供 `serve` 命令（請參閱[快速入門](/docs/zh-TW/openapi-mcp-server/quickstart/)）。

## ESM / CommonJS

同時提供兩種模組組建與型別宣告，無須額外安裝 `@types/*`：

```javascript
// ESM
import { buildMcpServer, startStdioServer } from "@powerduck/openapi-mcp-server";

// CommonJS
const { buildMcpServer, startStdioServer } = require("@powerduck/openapi-mcp-server");
```

## 子路徑匯出

| 匯入路徑 | 內容 |
| --- | --- |
| `@powerduck/openapi-mcp-server` | 核心程式庫：載入規格、產生工具/提示詞/資源、執行請求、建立 MCP 伺服器，以及 stdio 與 HTTP 傳輸。 |
| `@powerduck/openapi-mcp-server/server` | 管理用 HTTP 伺服器與驗證中介軟體（`startAdminServer`、`createAuthMiddleware`）。 |

## 執行階段相依套件

下列相依套件會自動安裝：

- `@modelcontextprotocol/sdk` — MCP 協定實作。
- `@powerduck/openapi-parser` — OpenAPI 驗證、參照解析與升級。
- `express` 與 `cors` — 管理用 HTTP 伺服器與 CORS。
- `axios` — 執行工具時存取上游服務的 HTTP 用戶端。
- `commander` — 命令列框架。
- `js-yaml` — YAML 解析。
- `multer` — 處理規格上傳。
- `terser` — 縮減內嵌 Web 介面資源的檔案大小。

## 確認安裝

```bash
npx --package @powerduck/openapi-mcp-server openapi-mcp --help
```

## 後續步驟

- [快速入門](/docs/zh-TW/openapi-mcp-server/quickstart/)
- [設定](/docs/zh-TW/openapi-mcp-server/configuration/)
