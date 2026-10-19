---
sidebar_position: 1
title: "@powerduck/x-to-openapi"
description: "@powerduck/x-to-openapi 是可擴充的 TypeScript 轉換框架，能將 curl 命令與 Postman 集合（v2.0 / v2.1.0）轉換為 OpenAPI 3.2 文件，適用於 CI 流程、API 文件產生，以及從 HTTP 請求還原介面定義。"
---

# @powerduck/x-to-openapi

**@powerduck/x-to-openapi** 是可擴充的 TypeScript 轉換框架，能將 **curl 命令**與 **Postman 集合（v2.0 / v2.1.0）**轉換為 **OpenAPI 3.2** 文件，適用於 CI 流程、API 文件產生，以及從 HTTP 請求還原介面定義。

它使用 [`@powerduck/openapi-parser`](https://www.npmjs.com/package/@powerduck/openapi-parser) 驗證文件。

- **版本：** <img src="https://img.shields.io/npm/v/@powerduck/x-to-openapi"/>
- **授權條款：** MIT
- **Node.js 需求：** `>= 22.12.0`
- **輸出：** 僅 OpenAPI **3.2.0**
- **原始碼：** [github.com/powerducklab/x-to-openapi](https://github.com/powerducklab/x-to-openapi)

---

## 運作流程

```text
curl 命令 → CurlAdapter
Postman 集合 → PostmanAdapter
             ↓
     NormalizedRequest[]
             ↓
     buildOpenApi32() → OpenAPI 3.2 文件
             ↓
     validateOpenApi32() → 診斷資訊
```

1. **轉接器**將來源資料（curl 文字或 Postman 集合）解析成 [`NormalizedRequest`](./api-reference.md#normalizedrequest) 物件清單。
2. **建構器**依方法與路徑合併請求，推斷結構描述、路徑參數及安全性設定，產生 OpenAPI 3.2 文件。
3. **驗證器**透過 `@powerduck/openapi-parser`，依 OpenAPI 結構描述檢查輸出並回報診斷資訊。

---

## 功能

- **兩個內建轉接器：** [`CurlAdapter`](./api-reference.md#curladapter) 支援單一、批次命令及瀏覽器「全部複製為 cURL」的輸出；[`PostmanAdapter`](./api-reference.md#postmanadapter) 支援 v2.0/v2.1.0、巢狀資料夾與驗證設定繼承。
- **免設定輔助函式：** [`curlToOpenApi`](./api-reference.md#curltoopenapi) 與 [`postmanToOpenApi`](./api-reference.md) 可在一次呼叫中註冊轉接器並完成轉換。
- **OpenAPI 3.2 輸出：** 產生的文件宣告 `openapi: "3.2.0"`，預設啟用驗證。請檢查回傳的診斷資訊，或啟用嚴格模式，在遇到錯誤時拒絕轉換。
- **多請求合併：** 合併方法與路徑相同的操作，並依結構合併查詢參數、標頭、Cookie 參數與請求主體結構描述。
- **路徑參數推斷：** 數字 ID、UUID、ULID 及較長的十六進位片段，在至少 N 個樣本中出現差異時，會轉為範本（如 `/users/{userId}`）。
- **安全性設定推斷：** 偵測 Bearer、Basic 與 API 金鑰（標頭、查詢或 Cookie），產生對應的 `securitySchemes`。
- **多種主體格式：** JSON、XML、form-urlencoded、multipart/form-data（文字與檔案）、GraphQL、文字、二進位。
- **保留 Postman 測試指令碼：** 將 `pm.test()` / `pm.expect()` 寫入各操作的 `x-postman-scripts`。
- **診斷資訊：** 每個問題包含嚴重程度與代碼，並在可用時附上來源細節；[`strict`](./api-reference.md#convertoptions) 模式遇到錯誤時擲回例外。
- **可擴充：** 實作 [`SourceAdapter`](./api-reference.md) 即可加入 HAR、HTTPie 或 Insomnia 等來源。

---

## 外掛架構

框架以精簡的轉接器介面為核心：

```typescript
interface SourceAdapter<I = unknown> {
  readonly id: string;                       // e.g. "curl", "postman", "har"
  canHandle?(input: unknown): boolean;       // used by "auto" detection
  parse(input: I, context: AdapterContext): Promise<NormalizedRequest[]>;
}
```

透過 [`AdapterRegistry`](./api-reference.md#adapterregistry)，將轉接器註冊到 [`XToOpenApi`](./api-reference.md#xtoopenapi) 執行個體：

```typescript
const converter = new XToOpenApi()
  .register(new CurlAdapter())
  .register(new PostmanAdapter());

// Explicit source id:
await converter.convert("curl", curlText);

// Auto-detect via canHandle():
await converter.convert("auto", someInput);
```

免設定輔助函式已整合兩個內建轉接器，多數使用者不必直接操作登錄表。

---

## 選擇輔助函式或類別

| 使用情境 | API |
|---|---|
| 轉換單一或一批 curl 命令 | [`curlToOpenApi`](./api-reference.md#curltoopenapi) |
| 轉換一個 Postman 集合物件或字串 | [`postmanToOpenApi`](./api-reference.md) |
| 自訂選項、多個轉接器、`"auto"` 偵測或自訂轉接器 | [`new XToOpenApi()`](./api-reference.md#xtoopenapi) |

---

## 延伸閱讀

- [安裝](./installation.md) — 加入套件並認識免設定輔助函式。
- [快速入門](./quickstart.md) — 轉換實際 curl 命令、Postman 集合，並使用自訂轉接器。
- [API 參考](./api-reference.md) — 所有匯出、型別、選項、預設值與診斷代碼。
- [範例](./examples.md) — 基本 curl、批次命令、Postman 集合、自訂轉接器與路徑推斷。
