---
sidebar_position: 1
title: "簡介"
description: "將 OpenAPI 轉為 MCP 服務：產生工具、提示詞與資源，提供 Web 管理介面、stdio、HTTP 與 openapi-mcp CLI。"
keywords: ["openapi-mcp-server", "MCP", "OpenAPI", "stdio", "HTTP"]
---

# @powerduck/openapi-mcp-server — 簡介

`@powerduck/openapi-mcp-server` 將 OpenAPI 文件轉換為可執行的 MCP（Model Context Protocol）服務。它從操作產生**工具**，從 API 中繼資料與操作產生**提示詞**，從 API 目錄產生**資源**，透過 MCP 協定提供這些內容，並內建 Web 管理介面。

- **套件名稱:** `@powerduck/openapi-mcp-server`
- **版本:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-mcp-server"/>
- **授權條款:** MIT
- **Node 版本需求:** `>=22.12.0`
- **CLI 命令:** `openapi-mcp`
- **模組格式:** 同時提供 ESM 與 CommonJS 建置版本，並附有型別宣告。

使用 `@powerduck/openapi-parser` 進行驗證與參照解析，使用 `@modelcontextprotocol/sdk` 實作協定。

## 產生的內容

- **Tools** — 每個 OpenAPI 操作對應一個 MCP 工具，支援完整的參數序列化（path/query/header/cookie 樣式與 explode 規則）、請求主體編碼（JSON、form-urlencoded、multipart、文字及二進位資料）與 MCP 工具註解（`readOnlyHint`、`destructiveHint`、`idempotentHint`）。
- **Prompts** — 全域提示詞（`spec_overview`、`integration_guardrails`）以及各操作的提示詞（`explain_*`、`plan_*`、`sample_*`）。
- **Resources** — 固定的目錄資源，例如 `openapi://spec/summary`、`openapi://catalog/tools`、`openapi://spec/document`。

## 傳輸方式

- **stdio** — `startStdioServer()` 將一份文件提供給本機 MCP 用戶端，例如 Claude Desktop 或編輯器整合。
- **HTTP** — `attachMcpRoutes(app, options)` 在 Express 應用程式的 `/mcp` 掛載 Streamable HTTP，並可選擇在 `/sse` 掛載舊版 SSE。選項可控制工作階段上限、閒置逾時、CORS 與 DNS 重新繫結防護。`startAdminServer()` 增加管理介面，並使用傳輸層預設的工作階段上限。`attachSseRoutes()` 仍保留為已棄用的位置參數包裝函式。

## 管理服務

`startAdminServer()` 啟動 Express 應用程式，提供：

- Web 管理主控台：上傳或貼上規格、檢查工具、提示詞與資源，以及查看執行中的服務與請求記錄；
- MCP HTTP 傳輸；
- API 金鑰驗證、遮蔽敏感標頭的請求記錄，以及可選的狀態持久化。

## 安裝

```bash npm2yarn2pnpm
npm install @powerduck/openapi-mcp-server
```

## 快速入門

```bash
openapi-mcp serve --transport web --port 3000 --api-key your-admin-key
```

## 接下來

- [安裝](../installation/) — npm/yarn/pnpm、全域安裝、`./server` 子路徑與相依套件。
- [快速入門](../quickstart/) — CLI 與程式呼叫方式。
- [設定](../configuration/) — 完整的 `ServerConfig` 設定。
- [API 參考](../api-reference/) — 所有匯出介面與 CLI 命令。
- [範例](../examples/) — 常見用法。

## 授權條款

MIT.
