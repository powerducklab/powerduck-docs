---
sidebar_position: 5
title: "CLI 命令"
description: "此套件只提供一個可執行命令 openapi-cli，直接接受選項清單，沒有 run / validate / init 子命令："
---

# CLI 命令

此套件只提供一個可執行命令 `openapi-cli`，直接接受選項清單，**沒有** `run` / `validate` / `init` 子命令：

```
openapi-cli [options]
```

## 命令格式

```bash
openapi-cli --spec openapi.json [options]
openapi-cli -c config.json
```

**必須**指定規範：傳入 `--spec`（或 `-s`），或在透過 `--config` 載入的 JSON 設定檔中設定 `specPath`。其他選項均可省略。

## 基本選項

| 選項 | 短選項 | 預設值 | 說明 |
|--------|-------|---------|-------------|
| `--spec <path-or-url>` | `-s` | — | OpenAPI 3.2 JSON 規範的檔案路徑或 `http(s)://` URL |
| `--server <url>` | `-S` | *（來自規範）* | 覆寫規範中的伺服器 URL |
| `--output <dir>` | `-o` | `./openapi-cli-report` | 報告輸出目錄 |
| `--format <formats>` | `-f` | `json,cli,html` | 以逗號分隔的報告格式：`json`、`cli`、`html` |
| `--config <path>` | `-c` | — | JSON 設定檔路徑，命令列參數優先 |

## 執行選項

| 選項 | 短選項 | 預設值 | 說明 |
|--------|-------|---------|-------------|
| `--concurrency <n>` | `-n` | `5` | 最大並行請求數，須為 1 至 100 的整數 |
| `--timeout <ms>` | `-t` | `30000` | 單次請求的逾時時間，單位為毫秒，須為 1 至 600000 的整數；取得遠端規範時也使用此值 |
| `--no-fail-on-error` | — | 關閉 | 執行完成後，即使測試失敗也傳回 `0`；設定錯誤與致命錯誤仍回報失敗 |

## 篩選選項

| 選項 | 預設值 | 說明 |
|--------|---------|-------------|
| `--method <methods>` | — | 要包含的 HTTP 方法，以逗號分隔，例如 `get,post` |
| `--path <patterns>` | — | 用於比對各路徑的規則運算式，以逗號分隔 |
| `--tag <tags>` | — | 要包含的 OpenAPI 標籤，以逗號分隔 |
| `--operation-id <ids>` | — | 要包含的 `operationId` 值，以逗號分隔 |

## 網路與 TLS 選項

| 選項 | 短選項 | 預設值 | 說明 |
|--------|-------|---------|-------------|
| `--proxy <url>` | `-p` | — | HTTP(S) 代理伺服器 URL，例如 `http://proxy.corp:8080` |
| `--ca <path>` | — | — | CA 憑證組合（PEM） |
| `--cert <path>` | — | — | 用於 mTLS 的用戶端憑證（PEM） |
| `--key <path>` | — | — | 用於 mTLS 的用戶端私密金鑰（PEM） |
| `--insecure` | `-k` | 關閉 | 略過 TLS 憑證驗證 |

## 驗證、標頭與變數

| 選項 | 短選項 | 說明 |
|--------|-------|-------------|
| `--header <headers...>` | `-H` | 額外標頭，格式為 `Key: Value`；可重複指定 |
| `--bearer <token>` | — | 在 `Authorization` 標頭中傳送的 Bearer 權杖 |
| `--variable <vars...>` | `-v` | Postman 變數，格式為 `KEY=VALUE`；可重複指定 |
| `--env <path>` | — | `.env` 檔案路徑，不覆寫既有環境變數 |

## gRPC 選項

| 選項 | 預設值 | 說明 |
|--------|---------|-------------|
| `--grpc-no-reflection` | 關閉 | 停用 gRPC 伺服器反射，改用 proto 檔案 |
| `--grpc-proto <paths...>` | — | `.proto` 檔案或包含這些檔案的目錄路徑 |

## MCP 選項

| 選項 | 預設值 | 說明 |
|--------|---------|-------------|
| `--mcp-transport <transport>` | `streamable-http` | MCP 傳輸方式：`streamable-http` 或 `stdio` |
| `--mcp-command <command>` | — | MCP stdio 命令，例如 `npx` |
| `--mcp-args <args>` | — | MCP stdio 引數，以空格或逗號分隔 |
| `--mcp-cwd <dir>` | — | MCP stdio 子程序的工作目錄 |

## 資訊選項

| 選項 | 短選項 | 說明 |
|--------|-------|-------------|
| `--help` | `-h` | 顯示說明 |
| `--version` | `-V` | 顯示版本 |

## 結束代碼

| 代碼 | 含義 |
|------|---------|
| `0` | 所有測試通過，或已設定 `--no-fail-on-error` |
| `1` | 一或多項測試失敗或發生錯誤，或命令列參數解析失敗 |
| `2` | 設定錯誤、規範載入失敗或致命執行階段錯誤 |

當 `resolveConfig` 擲回例外狀況時，例如未提供 `--spec` 且未設定 `specPath`，CLI 會以紅色輸出 `Error:` 並以 `2` 結束。當 `runTests` 擲回例外狀況時，會輸出 `Fatal error:` 並以 `2` 結束。執行正常完成後，只有在 `report.summary.failed > 0 || report.summary.errors > 0` 且 `failOnError !== false` 時，才以 `1` 結束。

## 環境變數

沒有專用的 `OPENAPI_CLI_*` 變數。除了命令列選項與設定檔，還可以透過以下方式提供設定：

- **`.env` 檔案** — 傳入 `--env .env`，將 `KEY=VALUE` 鍵值組載入 `process.env`，既有變數不會被覆寫。
- **`${VAR}` 展開** — 載入後，會取代 `serverUrl`、`proxy`、`headers` 的值、`auth.token` 與 `variables` 的值中的 `${VAR_NAME}`。

```bash
openapi-cli --spec openapi.json \
  --env .env \
  --server 'https://${API_HOST}/v1' \
  --bearer '${BEARER_TOKEN}'
```

## 執行範例

```bash
# Test a local spec against its first server URL
openapi-cli --spec openapi.json

# Override the server and write JSON + HTML reports
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --format json,html --output ./reports

# Only GET requests, 10 workers, with a bearer token
openapi-cli --spec openapi.json --method get --concurrency 10 --bearer "$TOKEN"

# Use a config file
openapi-cli --config openapi-cli.config.json
```
