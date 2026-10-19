---
sidebar_position: 4
title: "設定"
description: "@powerduck/openapi-mcp-server 完整設定：ServerConfig、SecurityContext、ExecutionContext、TransportMode，以及來源、狀態、協定、記錄層級與主體編碼的字面值聯集型別。"
---

# 設定

核心設定物件為 `ServerConfig`，由 `startAdminServer()` 接收。相關內容型別會用於工具執行過程。

## `ServerConfig`

只有 `port` 是必填欄位。

| 欄位 | 型別 | 預設值 | 說明 |
| --- | --- | --- | --- |
| `port` | `number` | —（必填） | 監聽的 TCP 連接埠，為 0–65535 的整數。 |
| `host` | `string` | `"127.0.0.1"` | 監聽的網路介面；預設使用回送位址，避免意外對外開放。 |
| `apiKey` | `string` | undefined | 設定後，管理 API 與 HTTP 傳輸皆要求使用此共用密鑰。 |
| `specPath` | `string` | undefined | 啟動時載入一次的規格。 |
| `baseUrlOverride` | `string` | undefined | 覆寫從 `servers[0].url` 取得的上游基礎 URL。 |
| `upstreamHeaders` | `Record<string, string>` | undefined | 合併到每個上游請求的標頭。 |
| `requestTimeoutMs` | `number` | undefined | 每個上游請求的逾時時間，單位為毫秒。 |
| `persistState` | `boolean` | `true` | 持久化已載入的規格，使其在重新啟動後保留。 |
| `stateFilePath` | `string` | undefined | 持久化狀態檔案的位置。 |
| `allowedOrigins` | `string[]` | undefined | 允許的 CORS 來源；空白或省略時停用跨來源存取。 |
| `allowedHosts` | `string[]` | undefined | 允許的 `Host` 標頭值。 |
| `maxLogEntries` | `number` | 200 | 記憶體中保留的記錄項目數量上限。 |
| `redactSensitiveHeaders` | `boolean` | `true` | 寫入記錄前遮蔽敏感標頭值。 |
| `redactHeaderNames` | `string[]` | undefined | 除內建清單外，另需遮蔽的標頭名稱。 |
| `security` | `SecurityContext` | undefined | 每次工具呼叫時轉送給上游 API 的認證資訊。 |

## `SecurityContext`

| 欄位 | 型別 | 傳送形式 |
| --- | --- | --- |
| `bearerToken` | `string` | `Authorization: Bearer <token>` |
| `basicAuth` | `{ username, password }` | `Authorization: Basic <base64>` |
| `apiKeys` | `Record<string, string>` | 精確的標頭名稱與值配對。 |

認證資訊由執行器注入，絕不會作為模型可見的工具引數公開。

## `ExecutionContext`

傳入 `executeToolCall`、由 `ContextProvider` 傳回的單次呼叫內容：

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `baseUrlOverride` | `string` | 覆寫本次呼叫使用的規格伺服器 URL。 |
| `upstreamHeaders` | `Record<string, string>` | 額外的上游標頭。 |
| `requestTimeoutMs` | `number` | 單次呼叫逾時，最短為 1 秒。 |
| `security` | `SecurityContext` | 本次呼叫的認證資訊。 |
| `correlationId` | `string` | 關聯同一次呼叫的記錄項目。 |
| `protocol` | `ProtocolHint` | 發起呼叫的傳輸方式。 |
| `onLog` | `(entry) => void` | 接收請求與回應記錄；不得擲回例外狀況。 |
| `signal` | `AbortSignal` | 取消進行中的上游請求。 |

## 字面值聯集與型別守衛

| 聯集 | 值 | 守衛函式 |
| --- | --- | --- |
| `TransportMode` | `"stdio" \| "web"` | — |
| `SpecSource` | `"startup-file" \| "upload" \| "paste" \| "runtime"` | `isSpecSource()` |
| `ServiceStatus` | `"running" \| "stopped" \| "error"` | `isServiceStatus()` |
| `ProtocolHint` | `"streamable-http" \| "sse" \| "stdio"` | `isProtocolHint()` |
| `LogDirection` | `"request" \| "response" \| "internal"` | — |
| `LogLevel` | `"debug" \| "info" \| "warn" \| "error"` | — |
| `ParameterLocation` | `"path" \| "query" \| "header" \| "cookie"` | `isParameterLocation()` |
| `BodyEncoding` | `"json" \| "form-urlencoded" \| "multipart" \| "text" \| "binary"` | `isBodyEncoding()` |

## `BuildMcpServerOptions`

作為第三個引數傳入 `buildMcpServer()`：

| 欄位 | 型別 | 預設值 | 說明 |
| --- | --- | --- | --- |
| `protocol` | `ProtocolHint` | undefined | 對外宣告的協定提示。 |
| `name` | `string` | `"openapi-mcp"` | 對外宣告的伺服器名稱。 |
| `version` | `string` | `"1.1.0"` | 對外宣告的伺服器版本。 |
| `pageSize` | `number` | 100 | 每次清單回應的項目上限，最多 500 項。 |
| `instructions` | `string` | 內建 | 透過 MCP `instructions` 提供的使用說明。 |

## 傳輸層選項（`AttachMcpRoutesOptions`）

從 `@powerduck/openapi-mcp-server` 匯入 `attachMcpRoutes`，將選項物件作為第二個引數傳入。舊版包裝函式 `attachSseRoutes()` 僅接受位置引數 `(app, specProvider, contextProvider, routeGuard?)`。

| 欄位 | 型別 | 預設值 | 說明 |
| --- | --- | --- | --- |
| `specProvider` | `SpecProvider` | —（必填） | 為新的工作階段提供文件。 |
| `contextProvider` | `ContextProvider` | —（必填） | 為每次呼叫提供上游內容。 |
| `routeGuard` | `RequestHandler` | undefined | 套用至每個 MCP 路由的中介軟體。 |
| `maxSessions` | `number` | 64 | 同時進行的工作階段數量上限。 |
| `sessionIdleMs` | `number` | 600000 | 閒置逾時時間，單位為毫秒；0 表示停用。 |
| `allowedOrigins` | `string[]` | undefined | 允許的來源；非空清單會啟用 DNS 重新繫結防護。 |
| `allowedHosts` | `string[]` | undefined | 允許的 `Host` 標頭值。 |
| `enableLegacySse` | `boolean` | `true` | 掛載已棄用的 HTTP+SSE 傳輸。 |
| `onEvent` | `(event: McpSessionEvent) => void` | undefined | 接收生命週期事件；不得擲回例外狀況。 |

> 這些是 `attachMcpRoutes` 的選項，不是 `ServerConfig` 的額外欄位。管理伺服器會轉送來源與主機設定，但使用傳輸層預設的工作階段上限與閒置逾時。若需自訂這些限制，請直接呼叫公開的傳輸函式。

## 另請參閱

- [API 參考](../api-reference/)
- [範例](../examples/)
