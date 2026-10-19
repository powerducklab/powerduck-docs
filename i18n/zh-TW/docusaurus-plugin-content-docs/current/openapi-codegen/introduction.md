---
sidebar_position: 1
title: "簡介"
description: "使用 @powerduck/openapi-codegen 從 OpenAPI 產生可執行的 HTTP 請求範例：21 種語言、41 種用戶端組合，相容瀏覽器且無執行階段相依性。"
---

# 簡介

`@powerduck/openapi-codegen` 是 TypeScript 程式庫，可將 OpenAPI 操作轉換為指定語言與 HTTP 用戶端的 **可執行 HTTP 請求範例程式碼**。適用於 API 文件網站、開發者入口網站、API 瀏覽器、CLI 工具及建置時的程式碼產生。

支援 **21 種語言**與 **41 種語言/用戶端組合**，**相容瀏覽器**，且 **無執行階段相依性**。

## 為何選擇 openapi-codegen

- **無執行階段相依性** — 不需 Node 內建模組，即可在瀏覽器、Node.js、Electron 與邊緣執行環境使用。
- **雙模組支援** — 提供原生 ESM 與 CommonJS（`require()`）建置版本。
- **OpenAPI 3.0 / 3.1 / 3.2** — 處理已解析的文件物件。只需在呼叫 `generate()` 前解析，即可使用 JSON 或 YAML。
- **41 個內建產生器** — 涵蓋 21 種語言，匯入時自動註冊。
- **完整參數序列化** — 路徑、查詢、標頭與 Cookie 參數均遵循 OpenAPI 的 `style` / `explode` / `allowReserved` 規則。
- **安全方案** — 支援 API key（header/query/cookie）、HTTP bearer 與 HTTP basic。
- **主體類型** — JSON、純文字、URL 編碼表單與 `multipart/form-data`。
- **`$ref` 解析** — 支援文件內的 JSON Pointer 參照、快取、鏈式解析與循環參照偵測。
- **自動範例** — 從 JSON Schema 的 `example`、`enum`、`default`、型別、格式及限制推斷範例值。
- **外掛程式系統** — 透過 `register()` 或 `use()` 註冊自訂產生器。

## 運作方式

```
OpenAPI document  ──normalize──▶  RequestIR  ──generator.generate()──▶  source code string
```

1. `normalize` 解析 `$ref`、合併路徑與操作層級參數、選擇請求主體媒體類型、產生範例值、解析安全方案，並產出正規化的 `RequestIR`。
2. 選定的 `Generator` 接收 `RequestIR`，並傳回可執行的原始碼字串。

通常只需呼叫統一入口 `generate({...})`，即可完成這兩個步驟。

## 基本範例

```typescript
import { generate } from "@powerduck/openapi-codegen";

const code = generate({
  document,                 // parsed OpenAPI object
  path: "/users/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
});

console.log(code);          // a runnable fetch() snippet
```

## 後續步驟

- [安裝](/docs/zh-TW/openapi-codegen/installation/) — npm / yarn / pnpm 安裝與瀏覽器用法。
- [快速入門](/docs/zh-TW/openapi-codegen/quickstart/) — 產生第一段程式碼並列出產生器。
- [設定](/docs/zh-TW/openapi-codegen/configuration/) — `GenerateOptions`、`RequestIR`、`Generator`、`Plugin`。
- [API 參考](/docs/zh-TW/openapi-codegen/api-reference/) — 所有匯出項目與完整的語言/用戶端清單。
- [範例](/docs/zh-TW/openapi-codegen/examples/) — fetch、Python requests、cURL、自訂產生器、外掛程式與直接使用 `RequestIR`。
