---
sidebar_position: 1
title: "簡介"
description: "@powerduck/openapi-cli 是命令列工具，可依據 OpenAPI 3.2 文件對實際伺服器進行批次測試。指定規範檔案或 URL 後，它會執行文件中的操作、對每個回應執行斷言，並產生三種格式的報告。"
---

# 簡介

`@powerduck/openapi-cli` 是命令列工具，可依據 OpenAPI 3.2 文件對實際伺服器進行批次測試。指定規範檔案或 URL 後，它會執行文件中的操作、對每個回應執行斷言，並產生三種格式的報告。

它使用 [`@powerduck/openapi-request`](https://www.npmjs.com/package/@powerduck/openapi-request) 執行請求，並使用 [`@powerduck/openapi-parser`](https://www.npmjs.com/package/@powerduck/openapi-parser) 解析 `$ref` 參照。

## 為什麼使用 openapi-cli

- **適合 CI** — 預設情況下，測試失敗或執行錯誤會傳回非零結束代碼，可直接整合至 GitHub Actions、GitLab CI 或其他管線。
- **內建多通訊協定支援** — 同一份規範可描述 HTTP、SSE、WebSocket、GraphQL、gRPC 與 MCP 操作，並由同一個執行器處理。
- **兩種斷言方式** — 簡單檢查使用宣告式 `x-tests` 陣列，複雜檢查使用 Postman 風格的 `pm.test()` / `pm.expect()` 指令碼。
- **三種報告格式** — 機器可讀的 JSON、便於閱讀的彩色命令列輸出，以及獨立的互動式 HTML 報告。
- **本機或遠端規範** — 透過檔案路徑或 `http(s)://` URL 載入文件，支援跟隨重新導向與逾時限制。
- **彈性篩選** — 依方法、路徑、標籤或 operationId 選擇要執行的操作，並限制並行數量。

## 支援的通訊協定

執行器依據 OpenAPI 擴充欄位或回應內容類型，辨識各操作的通訊協定：

| 通訊協定 | 識別碼 | 選擇方式 |
|----------|-----------|--------------------|
| HTTP | `http` | 標準操作的預設通訊協定 |
| 伺服器傳送事件 | `sse` | 回應內容類型為 `text/event-stream`，或設定 `x-response-stream: true` |
| WebSocket | `websocket` | `x-protocol: "websocket"` |
| GraphQL | `graphql` | `x-protocol: "graphql"` |
| gRPC | `grpc` | `x-protocol: "grpc"` |
| MCP | `mcp` | `x-protocol: "mcp"` |

也可以在操作或路徑項目上設定 `x-protocol` 擴充欄位，明確指定通訊協定。

## 報告

執行結束後，工具會輸出以下內容，檔案預設儲存至 `./openapi-cli-report`：

- `report.json` — 完整的 `TestReport` 物件，以格式化 JSON 儲存。
- `report.html` — 獨立且無外部相依性的 HTML 報告，包含摘要列、進度列、篩選按鈕與可展開的測試列。
- 標準輸出 — 彩色命令列摘要，包含進度列與各項測試的斷言結果。

## 在程式中使用

相同流程也能以函式庫呼叫。先解析設定、執行測試，再選擇需要的報告產生器：

```ts
import { resolveConfig, runTests, printCliReport, generateJsonReport } from "@powerduck/openapi-cli";

const config = resolveConfig({ spec: "./openapi.json" });
const report = await runTests(config);
printCliReport(report);
generateJsonReport(report, "./reports");
```

## 延伸閱讀

- [安裝](./installation.md) — 全域安裝或作為開發相依套件安裝。
- [快速開始](./quickstart.md) — 執行第一組測試。
- [設定](./configuration.md) — 完整的 `CliConfig` 參考。
- [命令](./commands.md) — 所有命令列選項與結束代碼。
- [API 參考](./api-reference.md) — 所有匯出的函式與型別。
- [範例](./examples.md) — 可直接執行的使用範例。
