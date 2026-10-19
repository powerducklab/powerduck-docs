---
sidebar_position: 6
title: "設定"
description: "設定的優先順序為 命令列參數 > 設定檔 > 預設值。解析結果是 resolveConfig 傳回的 CliConfig 物件。"
---

# 設定

設定的優先順序為 **命令列參數 > 設定檔 > 預設值**。解析結果是 [`resolveConfig`](./api-reference.md#resolveconfig) 傳回的 `CliConfig` 物件。

## CliConfig

核心設定型別。除了 `specPath`，所有欄位皆為選填。

| 欄位 | 型別 | 預設值 | 說明 |
|-------|------|---------|-------------|
| `specPath` | `string` | **必填** | OpenAPI 3.2 JSON 規範的檔案路徑或 `http(s)://` URL |
| `serverUrl` | `string` | *（來自規範）* | 覆寫規範中的伺服器基底 URL |
| `outputDir` | `string` | `"./openapi-cli-report"` | 報告檔案的輸出目錄 |
| `formats` | `ReportFormat[]` | `["json","cli","html"]` | 要產生的報告格式 |
| `filter` | `FilterConfig` | `undefined` | 篩選要測試的操作 |
| `concurrency` | `number` | `5` | 最大並行請求數，須為 1 至 100 的整數 |
| `timeout` | `number` | `30000` | 單次請求逾時，單位為毫秒，須為 1 至 600000 的整數；取得遠端規範時也適用 |
| `proxy` | `string` | `undefined` | HTTP(S) 代理伺服器 URL，例如 `http://proxy:8080` |
| `tls` | `TlsConfig` | `undefined` | TLS 與憑證設定 |
| `headers` | `Record<string, string>` | `undefined` | 每次請求都傳送的額外標頭 |
| `auth` | `AuthConfig` | `undefined` | 驗證設定 |
| `variables` | `Record<string, string>` | `undefined` | 要注入的 Postman `{{name}}` 變數 |
| `failOnError` | `boolean` | `true` | 僅用於 CLI：測試失敗後傳回非零結束代碼；呼叫函式庫時應檢查報告 |
| `envFile` | `string` | `undefined` | `.env` 檔案路徑，每行一組 `KEY=VALUE` |
| `grpcReflection` | `boolean` | 自動 | gRPC：明確設定優先，其次使用操作擴充欄位；否則在未提供 proto 路徑時啟用反射 |
| `grpcProtoPaths` | `string[]` | `undefined` | gRPC：`.proto` 檔案或目錄路徑 |
| `mcpTransport` | `"streamable-http" \| "stdio"` | `"streamable-http"` | MCP：操作使用的傳輸方式 |
| `mcpCommand` | `string` | `undefined` | MCP stdio：要啟動的命令 |
| `mcpArgs` | `string[]` | `undefined` | MCP stdio：命令引數 |
| `mcpCwd` | `string` | `undefined` | MCP stdio：工作目錄 |

`ReportFormat` 是聯集型別 `"json" | "cli" | "html"`。

## 進階執行階段選項

以下欄位也屬於 `CliConfig`。`requester`、`maxEvents`、`maxStreamMs` 與 `maxResponseSize` 可在 JSON 設定檔中提供。`signal`、`httpRuntime` 與 `resolveTransport` 是執行階段物件，並非 JSON 設定；請在解析設定後，透過程式直接傳給 `runTests()`。

```typescript
interface AdvancedRuntimeOptions {
  requester?: {
    followRedirects?: boolean;
    maxRedirects?: number;
    disableCookies?: boolean;
    protocolVersion?: "http1" | "http2" | "auto";
  };
  maxEvents?: number;
  maxStreamMs?: number;
  maxResponseSize?: number;
  signal?: AbortSignal;
  httpRuntime?: { certificates?: unknown; fileResolver?: unknown };
  resolveTransport?: (target: { protocol: string; url?: string }) => Promise<
    Pick<CliConfig, "proxy" | "tls" | "httpRuntime">
  >;
}
```

`requester` 控制 HTTP 重新導向、Cookie 與通訊協定選擇。執行 HTTP/SSE 時，`maxEvents` 預設為 50，`maxStreamMs` 未設定時使用 `timeout`，`maxResponseSize` 則傳給請求執行函式庫。gRPC 使用 `maxStreamMs` 作為串流截止時間，未設定時依序採用 `timeout` 與 30000 毫秒。`signal` 用於取消執行；`httpRuntime` 提供 HTTP 憑證與檔案處理；`resolveTransport` 為每個目標解析傳輸設定。

## DEFAULT_CONFIG

函式庫匯出的內建預設設定物件：

```ts
export const DEFAULT_CONFIG: Required<
  Pick<
    CliConfig,
    "outputDir" | "formats" | "concurrency" | "timeout" | "failOnError" | "grpcReflection" | "mcpTransport"
  >
> = {
  outputDir: "./openapi-cli-report",
  formats: ["json", "cli", "html"],
  concurrency: 5,
  timeout: 30000,
  failOnError: true,
  grpcReflection: true,
  mcpTransport: "streamable-http",
};
```

## FilterConfig

| 欄位 | 型別 | 說明 |
|-------|------|-------------|
| `methods` | `string[]` | 只測試這些 HTTP 方法，例如 `["get","post"]`；設定檔中使用小寫，CLI 輸入會自動正規化 |
| `paths` | `string[]` | 只測試符合任一規則運算式的路徑；運算式無效時改用子字串比對 |
| `tags` | `string[]` | 只測試帶有任一指定標籤的操作 |
| `operationIds` | `string[]` | 只測試與這些 `operationId` 值完全相符的操作 |

沒有任何欄位的篩選設定會解析為 `undefined`，也就是執行全部操作。

## TlsConfig

| 欄位 | 型別 | 說明 |
|-------|------|-------------|
| `caCert` | `string` | CA 憑證組合路徑（PEM） |
| `clientCert` | `string` | 用於 mTLS 的用戶端憑證路徑（PEM） |
| `clientKey` | `string` | 用於 mTLS 的用戶端私密金鑰路徑（PEM） |
| `strictSSL` | `boolean` | 為 `false` 時略過 TLS 憑證驗證，不安全 |
| `pfx` | `string` | PFX 憑證組合路徑；gRPC 必須改用 PEM |
| `passphrase` | `string` | 加密憑證資料的通關密語 |

> 注意：CLI 選項 `--insecure` 對應 `tls.strictSSL = false`，也就是**停用**驗證。

## AuthConfig

| 欄位 | 型別 | 說明 |
|-------|------|-------------|
| `type` | `AuthConfig["type"]` | 驗證方式，支援的名稱見下文 |
| `parameters` | `Record<string, string \| number \| boolean>` | 傳給請求執行函式庫的驗證方式專屬參數 |
| `token` | `string` | Bearer 權杖，用於 `type: "bearer"` |
| `username` | `string` | 使用者名稱，用於 `type: "basic"` |
| `password` | `string` | 密碼，用於 `type: "basic"` |
| `key` | `string` | API 金鑰名稱，用於 `type: "apikey"` |
| `value` | `string` | API 金鑰值，用於 `type: "apikey"` |
| `in` | `"header" \| "query"` | API 金鑰的放置位置 |

支援的 `type` 值包括 `bearer`、`basic`、`apikey`、`none`、`digest`、`oauth1`、`oauth2`、`jwt`、`hawk`、`aws4`、`ntlm`、`asap` 與 `edgegrid`。實際可用性與必要參數取決於通訊協定及請求執行函式庫；只填寫名稱並不代表已完成驗證設定。

目前 CLI 的 `--bearer` 選項只產生 `{ type: "bearer", token }`。較完整的 `basic` / `apikey` 設定可透過設定檔提供。

## JSON 設定檔

設定檔是符合 `Partial<CliConfig>` 的一般 JSON。透過 `--config <path>` / `-c` 指定，命令列參數一律優先於檔案中的值。

```json
{
  "specPath": "./openapi.json",
  "serverUrl": "https://api.staging.example.com",
  "outputDir": "./reports",
  "formats": ["json", "html"],
  "concurrency": 10,
  "timeout": 15000,
  "failOnError": true,
  "proxy": "http://proxy.corp:8080",
  "tls": {
    "strictSSL": true,
    "caCert": "./ca-bundle.pem",
    "clientCert": "./client.crt",
    "clientKey": "./client.key"
  },
  "headers": {
    "X-API-Key": "${API_KEY}",
    "X-Environment": "staging"
  },
  "auth": {
    "type": "bearer",
    "token": "${BEARER_TOKEN}"
  },
  "variables": {
    "host": "api.staging.example.com"
  },
  "filter": {
    "methods": ["get", "post"],
    "tags": ["v2", "public"],
    "paths": ["^/api/v2"],
    "operationIds": ["getUser", "createUser"]
  },
  "grpcReflection": true,
  "grpcProtoPaths": ["./proto"],
  "mcpTransport": "streamable-http",
  "mcpCommand": "npx",
  "mcpArgs": ["-y", "@modelcontextprotocol/server-everything"],
  "mcpCwd": "./mcp-servers"
}
```

設定檔不存在時擲回 `Config file not found: <path>`；JSON 無效時擲回 `Invalid config file (must be JSON)`。

## 環境變數展開

透過 `--env` / `envFile` 載入 `.env` 後，會在以下字串欄位展開 `${VAR_NAME}` 參照：

- `serverUrl`
- `proxy`
- `headers` 的值
- `auth.token`
- `variables` 的值

範例：

```bash
openapi-cli --spec openapi.json \
  --server 'https://${API_HOST}/v1' \
  --header 'Authorization: Bearer ${BEARER_TOKEN}'
```

`.env` 的處理方式：**不覆寫**既有 `process.env` 項目；去除值兩側的單引號或雙引號；忽略空白行與 `#` 註解行；檔案不存在時直接略過。

## 在程式中建立設定

```typescript
import { resolveConfig, DEFAULT_CONFIG } from "@powerduck/openapi-cli";

const config = resolveConfig({
  spec: "./openapi.json",
  server: "https://api.staging.example.com",
  concurrency: 10,
  method: "get",
});
```

未提供規範時，`resolveConfig` 擲回 `"No OpenAPI spec path provided..."`；`proxy` 不是有效 URL 時，擲回 `Invalid proxy URL: <url>`。
