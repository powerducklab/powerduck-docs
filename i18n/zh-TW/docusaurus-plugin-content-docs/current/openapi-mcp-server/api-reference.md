---
sidebar_position: 5
title: "API 參考"
description: "@powerduck/openapi-mcp-server 完整 API 參考：規格載入、工具／提示詞／資源產生、請求建立與執行、MCP 服務與傳輸、管理服務、驗證、服務登錄與 CLI。"
---

# API 參考

依功能分類的 `@powerduck/openapi-mcp-server` 所有公開匯出介面。

## 規格載入

| 匯出介面 | 簽章 | 說明 |
| --- | --- | --- |
| `loadOpenApiSpec(filePath)` | `(string) => Promise<Oas32Document>` | 讀取 JSON 或 YAML 檔案、驗證、解析參照並確認操作 ID 唯一。以 `.ya?ml` 副檔名辨識 YAML。 |
| `parseSpecContent(rawText, isYaml)` | `(string, boolean) => Promise<Oas32Document>` | 從字串剖析文件。輸入空白或無效時擲回例外狀況。 |

## 工具產生

| 匯出介面 | 簽章 | 說明 |
| --- | --- | --- |
| `generateTools(spec)` | `(spec) => Tool[]` | 為每個操作產生 MCP `Tool` 定義。 |
| `generateToolsDetailed(spec)` | `(spec) => GenerateToolsResult` | 傳回 `{ tools, bindings, issues }`。 |
| `buildBindingIndex(spec)` | `(spec) => Map<string, ToolBinding>` | 將產生的工具名稱對應到其 `ToolBinding`，為 `getBindingIndex` 的別名。 |

型別匯出：`ToolBinding`、`GeneratedToolWithBinding`（套件中 `GeneratedTool` 的別名）。

## 提示詞與資源

| 匯出介面 | 簽章 | 說明 |
| --- | --- | --- |
| `generatePrompts(spec)` | `(spec) => GeneratedPrompt[]` | 列出所有產生的提示詞。 |
| `resolvePrompt(spec, name, args?)` | `(spec, string, Record?) => GetPromptResult \| null` | 依名稱解析提示詞；未知名稱傳回 `null`。 |
| `generateResources(spec)` | `(spec) => GeneratedResource[]` | 列出目錄資源。 |
| `readResource(spec, uri)` | `(spec, string) => ResourceContentItem \| null` | 依 URI 讀取單一資源。 |

## 請求建立與執行

| 匯出介面 | 簽章 | 說明 |
| --- | --- | --- |
| `buildRequest(baseUrl, templatePath, pathItem, operation, args, binding?)` | `=> BuiltRequest` | 將引數序列化為 `{ url, query, headers, body, dropped }`，使用位置引數。 |
| `executeToolCall(spec, toolName, args, context?)` | `(spec, string, Record?, ExecutionContext?) => Promise<ToolCallResult>` | 對上游 API 執行產生的工具。非 2xx 回應會作為資料傳回；傳輸失敗則擲回例外狀況。 |

`ToolCallResult` 欄位：`status`, `statusText`, `headers`, `data`, `truncated`, `url`, `method`, `durationMs`, `correlationId`。

## 規格工具函式

| 匯出介面 | 說明 |
| --- | --- |
| `iterateOperations(spec, issues?)` | 依序產出所有已解析操作的產生器，包含 OpenAPI 3.2 的 `additionalOperations`。 |
| `collectOperationParameters(pathItem, operation, issues?, context?)` | 依 `(name, in)` 合併路徑項目與操作參數。 |
| `normalizeParameter(candidate)` | 正規化原始參數；無法使用時傳回 `null`。 |
| `synthesizeOperationId(method, pathTemplate)` | 操作省略 `operationId` 時，產生確定性的替代 ID。 |
| `ensureUniqueName(candidate, taken)` | 附加數字後綴以保持名稱唯一。 |
| `extractPathTemplateVariables(pathTemplate)` | 擷取 `{name}` 變數，去除重複並保留首次出現的順序。 |
| `effectiveStyle(parameter)` | 套用規格預設的 `style`。 |
| `effectiveExplode(parameter)` | 套用規格預設的 `explode`。 |
| `findOperationById(spec, operationId)` | 首次建立後以 O(1) 複雜度查詢；未知 ID 傳回 `null`。 |
| `findDuplicateOperationIds(spec)` | 回報作者宣告的重複 ID。 |
| `assertUniqueOperationIds(spec)` | 操作 ID 重複時擲回例外狀況。 |
| `isPlainObject(value)` | 將型別縮窄為一般物件。 |
| `truncateGeneratedName(name, limit=64)` | 縮短名稱並保持唯一性。 |

型別匯出：`OperationEntry`、`DuplicateOperationId`。

## MCP 服務與傳輸

| 匯出介面 | 說明 |
| --- | --- |
| `buildMcpServer(specProvider, contextProvider?, options?)` | 建立 SDK `Server`，連接工具、提示詞與資源處理函式，使用位置引數。 |
| `startStdioServer(spec, context?, options?)` | 透過 stdio 提供一份文件，傳回 `{ closed, close() }`。 |
| `attachMcpRoutes(app, options)` | 掛載 Streamable HTTP（`/mcp`）與可選的舊版 SSE（`/sse`）路由。接受 `AttachMcpRoutesOptions`，傳回 `McpRouteHandle`。 |
| `attachSseRoutes(app, specProvider, contextProvider, routeGuard?)` | 已棄用的位置引數包裝函式，傳回 `{ activeSessionCount, closeAll }`。 |
| `createStreamableSessionHost(options)` | 建立獨立的 Streamable HTTP 工作階段主機，用於自訂傳輸整合。 |

型別：`SpecProvider = () => Document | null`, `ContextProvider = () => ExecutionContext`, `AttachMcpRoutesOptions`, `McpRouteHandle`, `StreamableSessionHost`, `StreamableSessionHostOptions`, `McpSessionEvent`, `McpSessionInfo`, `SessionCloseReason`, `SessionKind`。

`attachMcpRoutes` 從套件根入口匯出。在其選項中設定 `maxSessions`、`allowedOrigins`、`sessionIdleMs` 與 DNS 重新繫結防護。控制代碼提供 `activeSessionCount`、`pendingSessionCount`、`listSessions`、`closeSession`、`closeAll` 與 `dispose`。關閉時呼叫 `dispose()`，停止背景清理並關閉工作階段。

## 管理服務與驗證（`./server` 子路徑） {#admin-server-and-auth-server-subpath}

從 `@powerduck/openapi-mcp-server/server` 或套件根入口匯入 `startAdminServer`。請從套件根入口匯入 `createAuthMiddleware`；`./server` 子路徑不會匯出它。

| 匯出介面 | 簽章 | 說明 |
| --- | --- | --- |
| `startAdminServer(config)` | `Promise<AdminServerHandle>` | 啟動附 Web 管理介面與 MCP 路由的 Express 應用程式，傳回 `{ app, server, port, close() }`。 |
| `createAuthMiddleware(apiKey?)` | `RequestHandler` | Bearer 或 `x-api-key` 存取保護。省略金鑰即可停用，使用位置引數。 |

## 執行階段與工具函式

| 匯出介面 | 說明 |
| --- | --- |
| `ServiceRegistry` | 管理 `ManagedServiceRecord` 的類別：`upsert`、`list`、`get`、`remove`、`clear`、`start`、`stop`、`fail`。 |
| `isAbortError(error)` | 遇到 `AbortError` 或 axios 的 `CanceledError` 時為真。 |
| `newId()` | 產生 UUID，備援方式使用時間戳記。 |

## CLI

執行命令為 **`openapi-mcp`**，僅提供一個子命令 `serve`：

```
openapi-mcp serve [options]
```

| 選項 | 預設值 | 說明 |
| --- | --- | --- |
| `--port <n>` | `3000` | HTTP 連接埠，用於 Web 傳輸。 |
| `--host <host>` | `127.0.0.1` | HTTP 主機。 |
| `--transport <mode>` | `web` | `stdio` 或 `web`。 |
| `--spec <path>` | — | OpenAPI 檔案路徑，stdio 模式下為必填。 |
| `--base-url <url>` | — | 覆寫上游基礎 URL。 |
| `--api-key <key>` | — | 管理 API 金鑰。 |
| `--upstream-header "Name: value"` | — | 上游標頭，可重複指定。 |
| `--timeout <ms>` | `30000` | 上游逾時。 |
| `--no-persist` | — | 停用狀態持久化。 |

## 型別（從 `types` 重新匯出）

`ServerConfig`, `SecurityContext`, `AppState`, `PersistedState`, `ExecutionContext`, `TransportMode`, `SpecSource`, `ServiceStatus`, `ProtocolHint`, `LogDirection`, `LogLevel`, `ParameterLocation`, `BodyEncoding`, `ServiceEndpointInfo`, `ManagedServiceRecord`, `SpecIssue`, `AdminStatus`, `GeneratedPrompt`, `GeneratedResource`, `GeneratedTool`, `ResourceContentItem`, `PromptMessageShape`, `RequestLogEntry`, `LogQueryOptions`, `LogQueryResult`；`ResolvedPrompt` 已棄用。型別守衛：`isSpecSource`, `isServiceStatus`, `isProtocolHint`, `isParameterLocation`, `isBodyEncoding`, `isPlainRecord`。

## 錯誤與行為

- 未知的工具、提示詞或資源 ID 會產生 MCP `InvalidParams` 錯誤，而非將失敗內容放在一般結果中。
- 工作階段仍在運作但缺少規格時，產生 `InternalError`。
- 上游 4xx/5xx 回應會以含 `isError: true` 的內容傳回模型，不擲回例外狀況；只有傳輸層失敗（DNS、TLS、逾時、中止）才會擲回例外狀況。

## 另請參閱

- [設定](../configuration/)
- [範例](../examples/)
