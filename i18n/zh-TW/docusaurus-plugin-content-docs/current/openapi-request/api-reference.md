---
sidebar_position: 5
title: "API 參考"
description: "@powerduck/openapi-request 主要整合 API 的參考文件"
---

# API 參考

`@powerduck/openapi-request` 主要整合 API 的參考文件。表格概述介面約定；完整的多載與選用參數以套件內 TypeScript 宣告為準。主入口和協定子路徑匯出的內容並不完全相同。

## 核心 API

### `createClient(options?): ProtoClient`

建立以 UI 為導向的用戶端。`options` 參數可省略。

**參數：**

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `options` | `CreateClientOptions` | 選用設定 |
| `options.writeBack` | `WriteBackOptions` | 控制回應如何合併回規格 |
| `options.response` | `ToResponseOptions` | 控制回應物件的正規化方式 |

**傳回：** 包含以下方法的 `ProtoClient`：

| 方法 | 簽章 | 說明 |
| --- | --- | --- |
| `prepare` | `(sendOptions: SendOptions) => PreparedRequest` | 規劃請求，傳回協定、顯示模式和串流類型 |
| `send` | `(sendOptions: SendOptions) => Promise<SendResult>` | 執行請求 |
| `sendMany` | `(spec, targets, shared?) => Promise<SendManyResult>` | 批次執行，分別傳回各目標的結果；單一失敗不會捨棄其他結果 |
| `connect` | `(connectOptions: ManualSessionOptions) => AnyManualSession` | 建立尚未開啟的 websocket/mcp/grpc 工作階段；呼叫 `open()` 建立連線 |
| `discover` | `(discoverOptions) => Promise<any>` | 探索 MCP 和 gRPC 的能力 |
| `writeback` | `(spec, prepared, result, writeOptions?) => OpenApiDocument` | 將觀察到的回應合併回文件 |
| `dispose` | `() => void` | 目前不執行任何操作；呼叫端必須自行關閉工作階段 |
| `probeStreamingResponse` | `(input: RequestInfo \| URL, init?: RequestInit) => Promise<{ ok: boolean; status: number; contentType?: string; kind: "none" \| "sse" \| "ndjson" \| "chunked"; response: Response }>` | 執行 fetch 請求並分類回應；需讀取或取消傳回的回應主體 |

**範例：**

```typescript
import { createClient } from "@powerduck/openapi-request";

const client = createClient({
  writeBack: { overwriteExamples: true },
});

const plan = client.prepare({
  spec,
  target: { operationId: "getUserById" },
});

const result = await client.send({
  spec,
  target: { operationId: "getUserById" },
  values: { path: { id: "42" } },
});
```

### `createDebugger(config?): ProtoKit`

建立用於自動化、指令碼和 CI 的指令碼式偵錯器。

**參數：**

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `config` | `DebuggerOptions` | 選用設定 |
| `config.adapters` | `ProtocolAdapter[]` | 自訂介接器清單，取代預設介接器 |
| `config.extraAdapters` | `ProtocolAdapter[]` | 加入預設清單的額外介接器 |
| `config.writeBack` | `WriteBackOptions` | 回寫選項 |
| `config.response` | `ToResponseOptions` | 回應正規化選項 |
| `config.writeBackTruncated` | `boolean` | 回寫從截斷串流推斷出的 Schema（預設：true） |

**傳回：** 包含 `prepare`、`send`、`sendMany`、`toCollection` 等方法的 `ProtoKit`。

**範例：**

```typescript
import { createDebugger } from "@powerduck/openapi-request";

const dbg = createDebugger({
  writeBackTruncated: true,
});

const result = await dbg.send({
  spec,
  target: { operationId: "getUserById" },
  values: { path: { id: "42" } },
  serverUrl: "https://api.example.com",
});
```

### `createManualSession(options): AnyManualSession`

建立 WebSocket、MCP 或 gRPC 的長期雙工工作階段。建立函式本身不執行 I/O；呼叫 `open()` 後才建立連線。

**參數：**

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `options.kind` | `"websocket" \| "mcp" \| "grpc"` | 要使用的協定 |
| `options.url` | `string` | WebSocket 連線 URL |
| `options.endpoint` | `string` | MCP Streamable HTTP 端點 |
| `options.transport` | `"streamable-http" \| "stdio"` | MCP 傳輸方式，預設使用 Streamable HTTP |
| `options.command`, `options.args` | `string`, `string[]` | MCP stdio 的本機可執行檔與參數 |
| `options.address`, `options.service`, `options.method` | `string` | gRPC 位址、完整限定的服務名稱與方法 |

gRPC 還需透過 `protoPaths` 或 `reflection` 提供描述元來源。各協定的選項見[設定](./configuration.md)。

**傳回：** 具有 `open()`、`send()`、`close()`、`onEvent()`、`waitForClose()`、`events` 和 `state` 的工作階段。`onEvent()` 會傳回具有 `unsubscribe()` 的訂閱物件。

**範例：**

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "websocket",
  url: "wss://api.example.com/ws",
});

const subscription = session.onEvent((event) => {
  console.log(event.kind, event.data);
});
try {
  await session.open();
  await session.send({ type: "message", data: "hello" });
} finally {
  await session.close();
  subscription.unsubscribe();
}
```

### `AdapterRegistry`

用於管理 `ProtocolAdapter` 執行個體的登錄表。新建登錄表為空；除非傳入自訂清單取代，否則 `createDebugger()` 會註冊內建 HTTP、WebSocket、gRPC、MCP 和 GraphQL 介接器。可透過 `register()`、`unregister()`、`get()`、`list()`、`rank()` 和 `resolve()` 管理選擇流程。

### `ProtoKitError`

偵錯器及核心執行路徑拋出的具型別錯誤。使用 `instanceof ProtoKitError` 區分函式庫錯誤與其他非預期故障。

## 核心型別

### `SendOptions`

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

### `PreparedRequest`

由 `createClient().prepare()` 傳回。偵錯器的規劃結果不同：`createDebugger().prepare()` 會傳回包含 `located`、`adapter` 和 `plan` 的 `PlanResult`。

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `protocol` | `string` | 解析出的協定（http、websocket、grpc、graphql、mcp） |
| `transport` | `string` | 解析出的傳輸方式 |
| `target` | `OperationTarget` | 原始目標 |
| `operation` | `any` | 解析出的 OpenAPI 操作物件 |
| `display.mode` | `DisplayMode` | `"response" \| "event-list" \| "duplex-session"` |
| `stream.kind` | `StreamKind` | 串流分類（見下文） |
| `stream.expected` | `boolean` | 是否預期為串流回應 |
| `openapi.extensions` | `Record<string, unknown>` | 解析出的 OpenAPI 擴充 |
| `warnings` | `string[]` | 規劃過程中出現的警告 |

### `StreamKind`

完整的串流類型分類：`"none" | "sse" | "ndjson" | "chunked" | "websocket" | "graphql-stream" | "grpc-unary" | "grpc-server-stream" | "grpc-client-stream" | "grpc-bidi" | "mcp-http-stream" | "mcp-stdio"`

## OpenAPI 輔助函式

| 匯出項目 | 簽章 | 說明 |
| --- | --- | --- |
| `locateOperation` | `(spec, target) => LocatedOperation` | 透過 `OperationTarget` 解析操作 |
| `inferSchema` | `(value) => Schema` | 從單一觀察值推斷 JSON Schema |
| `inferSchemaFromMany` | `(values) => Schema` | 推斷涵蓋多個觀察值的 Schema |
| `mergeSchema` | `(a, b) => Schema` | 合併兩個推斷出的 Schema（聯集或組合） |
| `sampleFromSchema` | `(schema) => unknown` | 為 Schema 產生貼近實際的範例值 |
| `toResponseObject` | `(result, options?) => { statusCode: string; response: any }` | 從觀察結果建立 OpenAPI 回應物件 |
| `writeBackResponse` | `(spec, path, method, fragment, options?) => spec` | 將觀察到的回應合併回文件 |

匯出的型別：`LocatedOperation`、`WriteBackOptions`、`ToResponseOptions`。

## HTTP / SSE

以下名稱可從主入口匯入。`@powerduck/openapi-request/http` 子路徑匯出 `HttpAdapter`、`SseParser`、`buildCollection`、`buildEnvironment`、`resolveServerUrl`、`buildRunOptions` 和 `runWithPostman`；偵測輔助函式和 `BUILTIN_CAPTURE_TEST` 請從主入口匯入。

| 匯出項目 | 說明 |
| --- | --- |
| `HttpAdapter` | HTTP/HTTPS 的預設協定介接器 |
| `SseParser` | 將 SSE 位元組串流轉換為結構化事件的串流解析器 |
| `isStreamingOperation` | 依宣告的內容類型判斷操作是否採用串流 |
| `isSseContentType` | 判斷內容類型是否表示 SSE |
| `isStreamingContentType` | 判斷內容類型是否表示串流 |
| `acceptHeaderFor` | 為操作產生適當的 Accept 請求標頭 |
| `probeStreamingResponse` | 執行 fetch 請求並分類回應；需讀取或取消傳回的回應主體 |
| `BUILTIN_CAPTURE_TEST` | 用於擷取最後一次回應的內建 Postman 測試指令碼 |

## WebSocket

從 `@powerduck/openapi-request/ws` 匯入。

| 匯出項目 | 說明 |
| --- | --- |
| `WebSocketAdapter` | WebSocket 目標的協定介接器 |
| `createWsManualSession` | 建立雙工 WebSocket 手動工作階段，別名為 `runWebSocketSession`、`wsManualSession` |

## GraphQL

從 `@powerduck/openapi-request/graphql` 匯入。

| 匯出項目 | 說明 |
| --- | --- |
| `GraphQLAdapter` | GraphQL 目標的協定介接器 |
| `resolveGraphQLConfig` | 從操作解析 GraphQL 設定 |
| `runGraphQL` | 執行 GraphQL 操作 |
| `introspectSchema` | 內省 GraphQL 端點的 Schema |
| `INTROSPECTION_QUERY` | 標準 GraphQL 內省查詢 |
| `generateOperation` | 從內省得到的 GraphQL Schema 與欄位產生查詢文件 |
| `generateAllOperations` | 為內省得到的 GraphQL Schema 各欄位產生查詢文件 |
| `writeGraphQLOperations` | 將產生的 GraphQL 操作回寫到規範 |
| `discoverAndWriteGraphQLSchema` | 探索 GraphQL Schema 並寫入規範 |

## MCP（模型上下文協定）

下列大多數項目可從 `@powerduck/openapi-request/mcp` 匯入。`initializeMcpSession` 從主入口匯入，其在子路徑中的名稱是 `initializeSession`。子路徑還匯出 `runMcp`、`createMcpSessionCore` 和 `createMcpStdioConnection`。

| 匯出項目 | 說明 |
| --- | --- |
| `McpAdapter` | MCP 目標的協定介接器 |
| `createMcpManualSession` | 建立 MCP 手動工作階段，別名為 `mcpManualSession` |
| `createMcpStdioSession` | 建立透過 stdio 的 MCP 工作階段 |
| `runMcpManualSession` | 已棄用，請使用 `createMcpManualSession` |
| `resolveMcpConfig` | 從操作解析 MCP 設定 |
| `initializeMcpSession` | 初始化 MCP 工作階段，原名為 `initializeSession` |
| `discoverMcpCapabilities` | 探索 MCP 伺服器能力 |
| `MCP_PROTOCOL_VERSION` | 支援的 MCP 協定版本 |
| `generateMcpCall` | 產生單一 MCP 工具呼叫 |
| `generateAllMcpCalls` | 產生所有 MCP 工具呼叫 |
| `writeMcpOperations` | 將 MCP 操作回寫到規範 |
| `discoverAndWriteMcpCapabilities` | 探索 MCP 能力並寫入規範 |
| `createHttpMcpTransport` | 建立 MCP 的 HTTP 傳輸 |
| `createStdioMcpTransport` | 建立 MCP 的 stdio 傳輸 |

## gRPC

從 `@powerduck/openapi-request/grpc` 匯入底層探索、呼叫和描述元輔助函式。`GrpcProtocolAdapter`、`createGrpcManualSession`、`grpcManualSession`、`grpcDiscover` 和 `discoverGrpc` 從主入口匯入；子路徑中的探索函式名為 `discover`。子路徑還提供 `discoverFromCatalog`、`describeMethod` 和 `describeFromCatalog`，可重複使用服務目錄，避免為每個方法重複反射。

| 匯出項目 | 說明 |
| --- | --- |
| `GrpcProtocolAdapter` | 面向 OpenAPI 的 gRPC 協定介接器 |
| `GrpcAdapter` | 底層 gRPC 介接器 |
| `grpcDiscover` / `discoverGrpc` | 探索 gRPC 服務與方法 |
| `createGrpcManualSession` / `grpcManualSession` | 建立 gRPC 手動工作階段 |
| `grpcCall` | 執行一次 gRPC 呼叫 |
| `resolveMethod` | 解析 gRPC 方法描述元 |
| `buildMessageTemplate` | 從描述元建立訊息範本 |
| `buildCatalog` | 建立服務與方法目錄 |
| `LOADER_OPTIONS` | 預設 proto 載入器選項 |
| `scanProtoFiles` | 掃描目錄中的 proto 檔案 |
| `deriveIncludeDirsDetailed` | 從 proto 檔案路徑推導包含目錄 |
| `fetchDescriptorSet` | 透過 gRPC 反射取得描述元集 |
| `fetchFullDescriptorSet` | 取得包含所有相依項目的完整描述元集 |
| `listServices` | 列出描述元集中的服務 |
| `listServicesDetailed` | 列出服務及詳細方法資訊 |
| `serializeDescriptorSet` | 將描述元集序列化為位元組 |
| `decodeFileDescriptorProto` | 解碼單一檔案描述元 proto |
| `decodeFileDescriptorSet` | 解碼檔案描述元集 |
| `buildCredentials` | 建立 gRPC 認證資料（同步） |
| `buildCredentialsAsync` | 建立 gRPC 認證資料（非同步） |
| `buildCredentialsChecked` | 驗證並建立認證資料（同步） |
| `buildCredentialsCheckedAsync` | 驗證並建立認證資料（非同步） |
| `loadGrpc` | 動態載入 `@grpc/grpc-js` 套件 |
| `isGrpcAvailable` | 檢查 gRPC 相依套件是否可用 |
| `requireCapability` | 要求指定 gRPC 能力，無法使用時拋出錯誤 |

主入口匯出型別別名 `GrpcDiscoveryResult`、`GrpcDiscoveredMethod` 和 `GrpcDiscoveredService`。gRPC 子路徑中的對應名稱為 `DiscoveryResult`、`DiscoveredMethod` 和 `DiscoveredService`。

錯誤型別：`ReflectionProtocolError`、`ReflectionUnavailableError`、`DescriptorDecodeError`、`GrpcDependencyBrokenError`、`GrpcDependencyMissingError`。

## 其他工具

主入口還匯出 OAuth 2.0 輔助函式 `resolveOAuth2Token`、`acquireOAuth2Token`、`isOAuth2TokenExpired`、`oauth2RefreshStatuses` 和 `authFromOAuth2Token`；複製工具 `toCloneable`；基底類別 `UnifiedSession`；以及 gRPC 回寫輔助函式 `writeGrpcOperations` 和 `discoverAndWriteGrpcOperations`。

## 子路徑匯出

```typescript
// Main integration entry
import { createClient, createDebugger } from "@powerduck/openapi-request";

// Protocol-specific entries
import { HttpAdapter } from "@powerduck/openapi-request/http";
import { WebSocketAdapter } from "@powerduck/openapi-request/ws";
import { GrpcAdapter } from "@powerduck/openapi-request/grpc";
import { McpAdapter } from "@powerduck/openapi-request/mcp";
import { GraphQLAdapter } from "@powerduck/openapi-request/graphql";
```
