---
sidebar_position: 5
title: "範例"
description: "以下是 @powerduck/openapi-cli 的實用範例，使用實際支援的命令列選項與程式介面。"
---

# 範例

以下是 `@powerduck/openapi-cli` 的實用範例，使用實際支援的命令列選項與程式介面。

## 1. 基本 CLI 測試

指定本機 OpenAPI 文件，執行其中的所有操作：

```bash
openapi-cli --spec openapi.json
```

覆寫伺服器位址，並將報告儲存至自訂目錄：

```bash
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --output ./reports
```

測試遠端 URL 上的規範：

```bash
openapi-cli --spec https://docs.example.com/openapi.json --timeout 60000
```

## 2. 在程式中執行並設定驗證

使用函式庫 API，設定 Bearer 權杖、自訂標頭與並行數量：

```typescript
import {
  resolveConfig,
  runTests,
  printCliReport,
  generateJsonReport,
  generateHtmlReport,
} from "@powerduck/openapi-cli";

const config = resolveConfig({
  spec: "./openapi.json",
  server: "https://api.staging.example.com",
  concurrency: 10,
  timeout: 15000,
  bearer: process.env.BEARER_TOKEN,
  header: ["X-Environment: staging", "X-Team: platform"],
});

const report = await runTests(config);

printCliReport(report);
generateJsonReport(report, "./reports");
generateHtmlReport(report, "./reports");

console.log(
  `Passed ${report.summary.passed}/${report.summary.total} (${report.summary.passRate}%)`,
);
```

## 3. 篩選測試範圍

依方法、標籤、路徑規則運算式或 operationId，只執行部分操作：

```bash
# Only GET and POST requests
openapi-cli --spec openapi.json --method get,post

# Only operations tagged "public" or "v2"
openapi-cli --spec openapi.json --tag public,v2

# Only paths under /api/v2
openapi-cli --spec openapi.json --path "^/api/v2"

# Only specific operations
openapi-cli --spec openapi.json --operation-id getUser,createUser
```

在程式中組合這些篩選條件：不同類別之間採 AND 關係，同一類別中的標籤採 OR 關係。

```typescript
const config = resolveConfig({
  spec: "./openapi.json",
  method: "get,post",
  tag: "public,v2",
  path: "^/api/v2",
  operationId: "getUser,createUser",
});
```

## 4. 產生 JSON 與 HTML 報告

使用 `--format` 選擇輸出格式，預設輸出全部三種格式：

```bash
# CLI to stdout only, no files
openapi-cli --spec openapi.json --format cli

# JSON + HTML files, no colored stdout report
openapi-cli --spec openapi.json --format json,html --output ./reports
```

對應的程式寫法：

```typescript
import { resolveConfig, runTests, generateJsonReport, generateHtmlReport } from "@powerduck/openapi-cli";

const config = resolveConfig({
  spec: "./openapi.json",
  format: "json,html",
  output: "./reports",
});

const report = await runTests(config);

const jsonPath = generateJsonReport(report, config.outputDir);
const htmlPath = generateHtmlReport(report, config.outputDir);

console.log("Wrote", jsonPath, "and", htmlPath);
```

`generateJsonReport` 寫入 `report.json`；`generateHtmlReport` 寫入 `report.html`。兩者都會在輸出目錄不存在時建立目錄，並傳回檔案路徑。

## 5. 在規範中宣告斷言

在任意操作加入 `x-tests` 陣列。每個項目都需要 `name` 與 `assert` 類型：

```json
{
  "paths": {
    "/users/{id}": {
      "get": {
        "operationId": "getUser",
        "x-tests": [
          { "name": "status is 200", "assert": "status", "value": 200 },
          { "name": "content-type is JSON", "assert": "header", "key": "content-type", "contains": "application/json" },
          { "name": "user id exists", "assert": "jsonPath", "path": "$.id", "exists": true },
          { "name": "user is active", "assert": "jsonPath", "path": "$.status", "equals": "active" },
          { "name": "response under 2s", "assert": "responseTime", "max": 2000 },
          { "name": "body contains email", "assert": "bodyContains", "contains": "@" }
        ],
        "responses": { "200": { "description": "ok" } }
      }
    }
  }
}
```

斷言類型：

| `assert` | 必填欄位 | 用途 |
|----------|-----------------|---------|
| `status` | `value` | HTTP 狀態碼等於 `value` |
| `header` | `key`；`contains` 為選填 | 標頭存在，並可進一步檢查是否包含指定子字串 |
| `bodyContains` | `contains` | 回應本文包含指定子字串 |
| `bodyEquals` | `body` | 回應本文與 `body` 完全相等 |
| `jsonPath` | `path`；`equals` / `exists` 為選填 | 解析 JSONPath，並比較值或檢查是否存在 |
| `responseTime` | `max` | 耗時必須符合 `<= max`，單位為毫秒 |

## 6. Postman 指令碼

透過 `x-postman-scripts` 嵌入 Postman 風格的測試指令碼：

```json
{
  "paths": {
    "/users": {
      "get": {
        "operationId": "listUsers",
        "x-postman-scripts": {
          "test": "pm.test('status is 200', () => pm.response.to.have.status(200)); pm.test('users is an array', () => pm.expect(pm.response.json().users).to.be.an('array'));"
        },
        "responses": { "200": { "description": "ok" } }
      }
    }
  }
}
```

宣告式 `x-tests` 與 `x-postman-scripts` 可以同時用於同一操作。

## 7. CI 整合（GitHub Actions）

```yaml
name: API Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - name: Run API tests
        run: npx @powerduck/openapi-cli --spec openapi.json --server "$API_URL" --bearer "$BEARER_TOKEN" --output ./reports
        env:
          API_URL: ${{ secrets.API_URL }}
          BEARER_TOKEN: ${{ secrets.BEARER_TOKEN }}
      - name: Upload reports
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: openapi-cli-reports
          path: ./reports
```

預設情況下，測試失敗傳回結束代碼 `1`，設定錯誤或致命執行階段錯誤傳回 `2`，使 CI 工作失敗。使用 `--no-fail-on-error` 可避免已完成的測試執行導致管線失敗，但不會忽略設定錯誤或致命錯誤。
