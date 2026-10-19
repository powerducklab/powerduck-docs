---
sidebar_position: 4
title: "設定"
description: "設定分為三層：用戶端或除錯器工廠選項、傳給 prepare() 與 send() 的 SendOptions 物件，以及各協定專用選項。"
---

# 設定

設定分為三層：用戶端或除錯器工廠選項、傳給 `prepare()` 與 `send()` 的 `SendOptions` 物件，以及各協定專用選項。

## 工廠選項

### `CreateClientOptions`

傳給 `createClient(options?)`，所有欄位皆為選用。

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `writeBack` | `WriteBackOptions` | 控制回應如何合併回規格 |
| `response` | `ToResponseOptions` | 控制回應物件的正規化方式 |

```typescript
import { createClient } from "@powerduck/openapi-request";

const client = createClient({
  writeBack: {
    overwriteExamples: true,
    // ... other WriteBackOptions
  },
  response: {
    includeExamples: false,
    // ... other ToResponseOptions
  },
});
```

### `DebuggerOptions`

傳給 `createDebugger(config?)`，所有欄位皆為選用。

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `adapters` | `ProtocolAdapter[]` | 自訂配接器清單，取代所有預設配接器 |
| `extraAdapters` | `ProtocolAdapter[]` | 加入預設登錄表的額外配接器 |
| `writeBack` | `WriteBackOptions` | 回寫選項 |
| `response` | `ToResponseOptions` | 回應正規化選項 |
| `writeBackTruncated` | `boolean` | 回寫從截斷串流推斷的結構描述，預設為 `true` |

```typescript
import { createDebugger, HttpAdapter, WebSocketAdapter } from "@powerduck/openapi-request";

// Use only HTTP and WebSocket adapters
const debugger1 = createDebugger({
  adapters: [new HttpAdapter(), new WebSocketAdapter()],
});

// Add a custom adapter to the defaults
const debugger2 = createDebugger({
  extraAdapters: [new MyCustomAdapter()],
  writeBackTruncated: true,
});
```

### 回寫與擷取範例

`WriteBackOptions` 支援 `strategy`（`"merge"` 或 `"replace"`，預設 `"merge"`）、`keepExistingDescription`（預設 `true`）、`allowedStatusCodes`（空值表示全部）、`protectComponentRefs`（預設 `true`）、`overwriteExamples`（預設 `true`）及 `requirePassingTests`。傳送流程會檢查測試結果；直接呼叫 `writeBackResponse` 不會執行此檢查。

`ToResponseOptions` 支援 `includeExamples`（預設 `true`）、`maxExampleChars`（預設 `4000`）與 `maxEventPreviewChars`（預設 `200`）。請停用範例擷取，或在發布前檢查擷取的範例：實際回應可能含有憑證或個人資料。

傳送流程通常在 `patchedSpec` 中回傳修改後的副本，不會修改輸入文件或儲存檔案。單次呼叫設定 `writeBack: false` 可略過此步驟。工廠的 `writeBack` 物件設定合併方式；單次呼叫的布林值控制是否回寫。

## `SendOptions`

`prepare()` 與 `send()` 的主要輸入物件，用於傳入規格、目標、具體值與所有請求層級設定。

| 欄位 | 型別 | 必填 | 說明 |
| --- | --- | --- | --- |
| `spec` | `OpenApiDocument` | 是 | 完整的 OpenAPI 3.2 文件 |
| `target` | `OperationTarget` | 是 | 操作識別資訊，詳見下文 |
| `values` | `RequestValues` | 否 | path/query/header/cookie/body 的具體值 |
| `serverUrl` | `string` | 否 | 覆寫 `spec.servers[0].url` |
| `serverVariables` | `Record<string, string>` | 否 | 伺服器 URL 範本變數 |
| `variables` | `Record<string, string>` | 否 | 以 `{{name}}` 參照的環境變數 |
| `globals` | `Record<string, string>` | 否 | Postman 風格的全域變數 |
| `localVariables` | `Record<string, string>` | 否 | 區域變數 |
| `collectionVariables` | `Record<string, string>` | 否 | 集合層級變數 |
| `auth` | `AuthConfig` | 否 | 驗證設定 |
| `scripts` | `ScriptConfig` | 否 | 請求前與測試指令碼 |
| `runner` | `RuntimeRunOptions` | 否 | 完整傳遞 postman-runtime 選項，優先順序最高 |
| `websocket` | `WebSocketOptions` | 否 | WebSocket 專用選項 |
| `graphql` | `GraphQLOptions` | 否 | GraphQL 專用選項 |
| `mcp` | `McpOptions` | 否 | MCP 專用選項 |
| `grpc` | `any` | 否 | gRPC 專用選項 |
| `timeout` | `number` | 否 | 每次請求的逾時時間，單位毫秒，是 `runner.timeout.request` 的簡便寫法 |

`SendOptions` 也接受以下執行與串流控制選項：

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `fetch` | `typeof fetch` | 在支援的情境下使用宿主提供的隔離 fetch 傳輸；HTTP/SSE 仍使用 postman-runtime。 |
| `writeBack` | `boolean` | 設為 `false` 時不產生 `patchedSpec`，但仍會產生 `responseFragment`。 |
| `signal` | `AbortSignal` | 取消執行或取樣，仍可能回傳部分結果。 |
| `maxEvents` | `number` | 最多保留的串流事件數量。 |
| `maxStreamMs` | `number` | 串流取樣的最長時間，單位毫秒。 |
| `maxResponseSize` | `number` | 回應位元組數上限。 |
| `maxBufferChars` | `number` | SSE 解析器在事件邊界前的緩衝上限，預設 `4194304` 個字元。 |
| `maxEventChars` | `number` | 每個 SSE 事件保留的資料上限，預設 `1048576` 個字元。 |
| `inheritEventId` | `boolean` | 缺少 ID 時繼承上一個 SSE 事件 ID，預設 `true`。如需更嚴格的結構描述推斷，請設為 `false`。 |
| `onEvent` | `(event: StreamEvent) => void` | 接收串流事件。 |
| `onConsole` | `(log: ConsoleLog) => void` | 接收指令碼主控台輸出。 |
| `onAssertion` | `(assertion: AssertionResult) => void` | 接收斷言結果。 |
| `onResponseStart` | `(info: ResponseStartInfo) => void` | 取得早期 HTTP/SSE 標頭與 `streaming` 分類。 |
| `onOpen` | `(info) => void` | 接收 WebSocket 連線詳情：URL、協定與標頭。 |

各協定配接器對限制的解讀可能不同。UI 回呼應保持輕量；執行層會捕捉回呼擲出的例外。HTTP 請求器設定使用 `runner.requester`；若指定其中的 `maxResponseSize`，必須為正數，不能為零。

### `OperationTarget`

識別單一操作。建議擇一使用 `operationId` 或 `method` + `path`；若兩者都提供，以 `operationId` 優先。

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `operationId` | `string` | 另一種查找鍵，優先於路徑與方法 |
| `method` | `string` | HTTP 方法，不區分大小寫；須同時提供 `path`。 |
| `path` | `string` | 範本路徑，例如 `/users/{id}`；須同時提供 `method`。 |

```typescript
// By operationId (recommended)
const result1 = await client.send({
  spec,
  target: { operationId: "getUserById" },
});

// By method + path
const result2 = await client.send({
  spec,
  target: { method: "GET", path: "/users/{id}" },
});
```

### `RequestValues`

注入產生之請求的具體值。

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `path` | `Record<string, unknown>` | 路徑參數值 |
| `query` | `Record<string, unknown>` | 查詢參數值 |
| `header` | `Record<string, unknown>` | 標頭值 |
| `cookie` | `Record<string, unknown>` | Cookie 值 |
| `querystring` | `string` | 原始且已編碼的查詢字串，適用於 OpenAPI 3.2 的 `querystring` 位置 |
| `body` | `unknown` | 請求本文 |
| `contentType` | `string` | 操作宣告多個媒體型別時，強制指定請求媒體型別 |

```typescript
const result = await client.send({
  spec,
  target: { operationId: "updateUser" },
  values: {
    path: { id: "42" },
    query: { version: "2" },
    header: { "X-Request-Id": "abc-123" },
    body: { name: "Alice", email: "alice@example.com" },
    contentType: "application/json",
  },
});
```

### `AuthConfig`

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `type` | `AuthConfig["type"]` | 驗證類型 |
| `token` | `string` | Bearer 權杖，適用於 `type: "bearer"` |
| `username` | `string` | Basic 驗證使用者名稱，適用於 `type: "basic"` |
| `password` | `string` | Basic 驗證密碼，適用於 `type: "basic"` |
| `key` | `string` | API 金鑰名稱，適用於 `type: "apikey"` |
| `value` | `string` | API 金鑰值，適用於 `type: "apikey"` |
| `in` | `"header" \| "query"` | API 金鑰位置，適用於 `type: "apikey"` |

```typescript
// Bearer token
const result1 = await client.send({
  spec,
  target: { operationId: "getUser" },
  auth: { type: "bearer", token: "your-jwt-token" },
});

// Basic auth
const result2 = await client.send({
  spec,
  target: { operationId: "getUser" },
  auth: { type: "basic", username: "admin", password: "secret" },
});

// API key in header
const result3 = await client.send({
  spec,
  target: { operationId: "getUser" },
  auth: { type: "apikey", key: "X-API-Key", value: "key-123", in: "header" },
});
```

進階驗證類型包括 `digest`、`oauth1`、`oauth2`、`jwt`、`hawk`、`aws4`、`ntlm`、`asap` 與 `edgegrid`。透過 `parameters: Record<string, string | boolean | number>` 傳遞其在 HTTP/SSE/GraphQL 中使用的 Postman 輔助欄位。選用的 `oauth2: OAuth2FlowConfig` 為 OAuth 2.0 啟用權杖取得與更新；請勿假設每種驗證輔助方式都適用於所有協定。

### `ScriptConfig`

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `collectionPreRequest` | `ScriptSource \| ScriptSource[]` | 集合層級請求前指令碼 |
| `collectionTest` | `ScriptSource \| ScriptSource[]` | 集合層級測試指令碼 |
| `preRequest` | `ScriptSource \| ScriptSource[]` | 請求層級請求前指令碼 |
| `test` | `ScriptSource \| ScriptSource[]` | 請求層級測試指令碼 |
| `fromSpecExtensions` | `boolean` | 讀取規格中的 `x-postman-scripts`，預設 `true` |
| `captureLastResponse` | `boolean` | 附加內建輔助指令碼，讓後續請求可存取最近一次回應 |

`ScriptSource`:
```typescript
interface ScriptSource {
  exec: string | string[];  // Script body, either a single string or array of lines
  id?: string;               // Optional identifier surfaced in script results
}
```

若不打算執行匯入規格內嵌的指令碼，請設定 `scripts.fromSpecExtensions: false`。目前預設為 `true`，不要依賴未來可能調整的預設值。

## 協定專用選項

### HTTP / SSE

HTTP 是預設配接器。宣告 `text/event-stream` 表示 SSE 意圖；執行時也會在收到標頭後分類實際回應。`probeStreamingResponse()` 是須明確呼叫的獨立探測，並非每次呼叫都自動執行的前置步驟。

基本 HTTP 請求不需額外設定。進階 postman-runtime 設定使用 `SendOptions.runner`。

### WebSocket

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "websocket",
  url: "wss://api.example.com/ws",
  // Manual-session options are distinct from SendOptions.websocket.
});
```

### MCP

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "mcp",
  endpoint: "https://api.example.com/mcp",
});
```

預設 MCP 手動工作階段使用 Streamable HTTP 與 `endpoint`。使用 stdio 時，傳入 `kind: "mcp"`、`transport: "stdio"`、本機 `command` 與選用 `args`；啟動工作階段會啟動設定的程序。

### gRPC

gRPC 需要位址、描述元來源（`.proto` 檔案或伺服器反射），以及完整限定的服務與方法名稱：

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "grpc",
  address: "localhost:50051",
  service: "powerduck.examples.Echo",
  method: "Echo",
  protoPaths: ["./echo.proto"],
});
```

手動工作階段工廠回傳尚未開啟的工作階段。傳送前呼叫 `open()`，清理時呼叫 `close()`。gRPC 範例需要對應的本機伺服器與 proto 檔案；手動工作階段選項與 `SendOptions.grpc` 並非同一個物件。

## 完整範例

```typescript
import { createClient } from "@powerduck/openapi-request";

const client = createClient({
  writeBack: { overwriteExamples: true },
});

const result = await client.send({
  spec: openApiDocument,
  target: { operationId: "updateUser" },
  values: {
    path: { id: "42" },
    query: { verbose: "true" },
    header: { "X-Request-Id": "req-abc" },
    body: { name: "Alice", email: "alice@example.com" },
  },
  serverUrl: "https://api.staging.example.com",
  auth: { type: "bearer", token: "staging-token" },
  timeout: 10000,
  variables: {
    environment: "staging",
  },
});

console.log(result.response.status);
console.log(result.response.body);
console.log(result.response.headers);
```

## 後續步驟

- 查看 [API 參考](./api-reference.md)，瞭解所有匯出型別
- 瀏覽[範例](./examples.md)，瞭解各協定用法
