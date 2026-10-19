---
sidebar_position: 3
title: "快速入門"
description: "使用 @powerduck/openapi-cli，從 CLI 與 Node.js 執行第一組批次測試。"
---

# 快速入門

本指南帶你完成第一份 OpenAPI 文件的測試。

## 必要條件

- Node.js `>= 22.12.0`.
- 一份 OpenAPI 3.2 **JSON** 文件。不接受 YAML，請先轉換為 JSON。文件最上層必須包含 `paths` 物件。

## 1. 從 CLI 執行

最簡單的執行方式會載入本機規格，並針對文件宣告的第一個伺服器 URL 測試所有操作：

```bash
openapi-cli --spec openapi.json
```

覆寫目標伺服器，並將報告寫入自訂目錄：

```bash
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --output ./reports
```

測試遠端規格中的 `GET` 操作，使用 10 個並行工作單元：

```bash
openapi-cli --spec https://docs.example.com/openapi.json \
  --method get \
  --concurrency 10
```

較複雜的設定可以使用 JSON 設定檔：

```bash
openapi-cli --config openapi-cli.config.json
```

所有命令列參數請參閱 [命令參考](/docs/zh-TW/openapi-cli/commands/).

## 2. 撰寫最小測試規格

包含宣告式斷言的最小 OpenAPI 文件：

```json
{
  "openapi": "3.2.0",
  "info": { "title": "Demo API", "version": "1.0.0" },
  "servers": [{ "url": "https://httpbin.org" }],
  "paths": {
    "/get": {
      "get": {
        "operationId": "getGet",
        "responses": { "200": { "description": "ok" } },
        "x-tests": [
          { "name": "status is 200", "assert": "status", "value": 200 },
          { "name": "response under 5s", "assert": "responseTime", "max": 5000 }
        ]
      }
    }
  }
}
```

如果操作**沒有**定義斷言，執行器會加入隱含的通訊協定成功檢查。對 HTTP 而言會要求 `2xx` 狀態，避免將 4xx/5xx 回應默默標為通過。

## 3. 從 Node.js 執行（程式介面）

程式庫以函式提供相同流程，通常為 `resolveConfig` → `runTests` → 報告產生器。

```typescript
import {
  resolveConfig,
  runTests,
  printCliReport,
  generateJsonReport,
  generateHtmlReport,
} from "@powerduck/openapi-cli";

// 1. Build a CliConfig from CLI-style args.
const config = resolveConfig({
  spec: "./openapi.json",
  server: "https://api.staging.example.com",
  concurrency: 10,
});

// 2. Run all collected tests.
const report = await runTests(config);

// 3. Emit the reports you need.
printCliReport(report);
generateJsonReport(report, "./reports");
generateHtmlReport(report, "./reports");

// 4. Exit with the correct code for CI.
if (report.summary.failed > 0 || report.summary.errors > 0) {
  process.exit(1);
}
```

`resolveConfig` 接受與 CLI 相同結構的選項。`runTests` 傳回 `TestReport`，包含 `summary`、`results`、`config`、`generatedAt` 與 `version`。 [設定](/docs/zh-TW/openapi-cli/configuration/).

## 4. CI 結束代碼

| 代碼 | 意義 |
|---|---|
| `0` | 所有測試通過，或已設定 `--no-fail-on-error`。 |
| `1` | 一個或多個測試失敗或發生錯誤。 |
| `2` | 設定錯誤、規格載入失敗或嚴重執行階段錯誤。 |

## 後續步驟

- [設定](/docs/zh-TW/openapi-cli/configuration/) — `CliConfig` 的所有欄位與預設值。
- [命令參考](/docs/zh-TW/openapi-cli/commands/) — 全部 CLI 參數。
- [範例](/docs/zh-TW/openapi-cli/examples/) — 驗證、篩選、報告與斷言。
- [API 參考](/docs/zh-TW/openapi-cli/api-reference/) — 所有匯出的函式與型別。
