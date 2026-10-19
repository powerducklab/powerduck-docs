---
sidebar_position: 1
title: "@powerduck/openapi-request 簡介"
description: "@powerduck/openapi-request 是適用於 OpenAPI 3.2 的集合偵錯器與請求執行函式庫。它根據 OpenAPI 文件規劃並傳送請求、辨識串流回應、依實際回應產生更新後的文件，並透過一組精簡介面支援六種通訊協定。"
---

# @powerduck/openapi-request 簡介

`@powerduck/openapi-request` 是適用於 OpenAPI 3.2 的集合偵錯器與請求執行函式庫。它根據 OpenAPI 文件規劃並傳送請求、辨識串流回應、依實際回應產生更新後的文件，並透過一組精簡介面支援六種通訊協定。

- **套件名稱：** `@powerduck/openapi-request`
- **版本：** <img src="https://img.shields.io/npm/v/@powerduck/openapi-request"/>
- **授權條款：** MIT
- **模組格式：** 同時提供 ESM 與 CommonJS 建置版本，並附帶型別宣告。

## 用途

此函式庫以同一份文件為依據，滿足三類需求：

- **適合圖形介面的用戶端** — `createClient()` 傳回的物件提供 `prepare()`、`send()`、`connect()`、`discover()` 與 `writeback()`，分別對應圖形化請求編輯器的操作步驟。
- **可透過指令碼操作的偵錯器** — `createDebugger()` 傳回 `ProtoKit`，提供 `send()`、`sendMany()` 與 `toCollection()`，適用於自動化、指令碼與 CI。
- **手動管理的長連線工作階段** — `createManualSession()` 傳回雙向工作階段物件，包含開啟、傳送、關閉操作與事件串流。WebSocket、MCP 與 gRPC 使用相同的物件結構，因此可共用一套介面。

## 通訊協定配接器

核心不依賴特定傳輸方式；通訊協定行為由註冊至 `AdapterRegistry` 的配接器提供。

- **HTTP / SSE** — 預設支援。根據宣告的內容類型或實際回應標頭，自動辨識一般 JSON 請求與伺服器傳送事件串流。
- **WebSocket** — 使用統一的事件結構處理雙向文字與二進位工作階段。
- **gRPC** — 透過 `.proto` 檔案或伺服器反射，執行一元、伺服器串流、用戶端串流及雙向串流呼叫。
- **MCP** — 透過 Streamable HTTP 或 stdio 呼叫 Model Context Protocol 工具。
- **GraphQL** — 支援內省、操作產生與執行。

## 主要功能

- **OpenAPI 3.2 集合模型** — 透過 `operationId` 或 `method`+`path` 找出操作，並根據參數、請求本文及範例規劃請求。
- **串流回應辨識** — `isStreamingOperation()`、`isSseContentType()` 與 `isStreamingContentType()` 根據宣告的內容類型判斷回應類型；`probeStreamingResponse()` 檢查實際回應標頭。
- **回應回寫** — `inferSchema()`、`mergeSchema()`、`toResponseObject()` 與 `writeBackResponse()` 推導回應結構描述，並傳回更新後的文件。預設情況下，回寫成功時 `send()` 會透過 `patchedSpec` 傳回該文件；設定 `writeBack: false` 可停用回寫。傳入的文件不會被修改，也不會自動儲存檔案。儲存結果前，請檢查 `writeBackSkippedReason` 與 `writeBackWarnings`。
- **結構描述輔助工具** — `sampleFromSchema()` 根據結構描述產生範例資料。
- **大型相依套件延遲載入** — gRPC（`@grpc/grpc-js`、`@grpc/proto-loader`）與 MCP（`@modelcontextprotocol/sdk`）在首次使用時才載入，因此僅使用 HTTP 時不會產生這些載入成本。

## 安裝

```bash npm2yarn2pnpm
npm install @powerduck/openapi-request
```

## 快速開始

```typescript
import { createClient } from "@powerduck/openapi-request";

const spec = {
  openapi: "3.2.0",
  info: { title: "Users", version: "1.0.0" },
  paths: {
    "/users/{id}": {
      get: {
        operationId: "getUserById",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "User" } },
      },
    },
  },
};

const client = createClient();

const plan = client.prepare({
  spec,
  target: { operationId: "getUserById" },
});

const result = await client.send({
  spec,
  target: { operationId: "getUserById" },
  values: { path: { id: "42" } },
  serverUrl: "https://api.example.com",
});
```

## 延伸閱讀

- [安裝](./installation.md) — 套件結構、子路徑匯出及通訊協定功能的對等相依套件。
- [快速開始](./quickstart.md) — 第一個請求、偵錯器執行及手動工作階段。
- [設定](./configuration.md) — `CreateClientOptions`、`DebuggerOptions` 及各通訊協定的設定。
- [API 參考](./api-reference.md) — 依功能分類的所有匯出。
- [範例](./examples.md) — 可執行的 HTTP、SSE、WebSocket、GraphQL、MCP 與 gRPC 範例。

## 授權條款

MIT.
