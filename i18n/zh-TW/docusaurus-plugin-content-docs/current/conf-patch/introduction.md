---
sidebar_position: 1
title: "@powerduck/conf-patch"
description: "@powerduck/conf-patch 是採用清楚雙層架構的設定編輯程式庫。它依循 RFC 6902 JSON Patch 語意修改 JSON、JSONC 和 YAML 字串，保留註解與格式，並為 Node.js 和 Electron 提供原子寫入與跨處理程序檔案鎖定。"
---

# @powerduck/conf-patch

**@powerduck/conf-patch** 是採用清楚**雙層架構**的設定編輯程式庫。它依循 [RFC 6902 JSON Patch](https://datatracker.ietf.org/doc/html/rfc6902) 語意修改 JSON、JSONC 和 YAML 字串，保留註解與格式，並為 Node.js 和 Electron 提供原子寫入與跨處理程序檔案鎖定。

- **版本：** <img src="https://img.shields.io/npm/v/@powerduck/conf-patch"/>
- **授權條款：** MIT
- **Node.js 需求：** `>= 22.12.0`
- **原始碼：** [github.com/powerducklab/conf-patch](https://github.com/powerducklab/conf-patch)

---

## 為什麼選擇 conf-patch？

透過程式修改設定檔，往往得在兩種方式之間取捨：重新序列化整份文件可能改變註解、空白與格式，自行操作文字又容易出錯。conf-patch 提供：

- **保留註解的增量修改：** JSON/JSONC 使用 `jsonc-parser`，YAML 使用 `yaml` 修改 AST。JSON/JSONC 不必整份重新序列化；YAML 則重新序列化修改後的 AST。
- **原子寫入：** 先寫入暫存檔再重新命名，避免目標檔案只寫入一部分。
- **跨處理程序檔案鎖定：** 支援擁有權權杖、指數退避重試及過期鎖定復原。
- **適用多種環境的 API：** 核心層也能在瀏覽器、邊緣函式與使用 IndexedDB 儲存的應用程式中執行。

---

## 雙層架構

```
┌──────────────────────────────────────────────────────────────┐
│                     Application code                          │
├──────────────────────────────────────────────────────────────┤
│  File layer (Node.js / Electron only)                         │
│  ┌───────────────┐ ┌────────────────┐ ┌──────────────────┐  │
│  │ readConfigFile │ │ writeConfigFile│ │ patchConfigFile   │  │
│  │ setConfigValue │ │ deleteConfig…  │ │ withFileLock     │  │
│  └──────┬────────┘ └───────┬────────┘ └────────┬─────────┘  │
│         │                  │                   │            │
│  ┌──────▼──────────────────▼───────────────────▼───────────┐ │
│  │           Core layer (browser-safe, zero Node deps)      │ │
│  │  patchContent   setContentValue   deleteContentValue     │ │
│  └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### 核心層 — `@powerduck/conf-patch/core`（相容於瀏覽器）

操作**字串**的純函式，不依賴 `node:fs`、`node:path` 或其他 Node.js 專用 API。此子路徑匯出可打包至瀏覽器、邊緣函式或 Service Worker 程式碼中。

| 函式 | 用途 |
|---|---|
| [`patchContent`](../api-reference/#patchcontent) | 對設定字串套用一組 RFC 6902 操作 |
| [`setContentValue`](../api-reference/#setcontentvalue) | 設定或建立巢狀值（使用 `add`） |
| [`deleteContentValue`](../api-reference/#deletecontentvalue) | 刪除鍵或陣列元素（使用 `remove`） |

### 檔案層 — `@powerduck/conf-patch`（Node.js / Electron）

讀寫實際檔案的非同步函式，在核心層之上加入原子寫入與鎖定機制。

| 函式 | 用途 |
|---|---|
| [`readConfigFile`](../api-reference/#readconfigfile) | 從檔案路徑或 `file://` URL 讀取 UTF-8 文字 |
| [`writeConfigFile`](../api-reference/#writeconfigfile) | 原子寫入內容，可選擇加鎖 |
| [`patchConfigFile`](../api-reference/#patchconfigfile) | 在檔案鎖定內執行讀取、修改、寫入交易 |
| [`setConfigValue`](../api-reference/#setconfigvalue) | 設定檔案中的巢狀值 |
| [`deleteConfigValue`](../api-reference/#deleteconfigvalue) | 刪除檔案中的巢狀值 |
| [`withFileLock`](../api-reference/#withfilelock) | 在獨佔鎖定保護下執行工作 |
| [`releaseAllLocalLocks`](../api-reference/#releasealllocallocks) | 釋放目前處理程序持有的所有鎖定 |

---

## 支援的格式

| 格式 | 副檔名 | 行為 |
|---|---|---|
| **JSON** | `.json` | 標準 JSON，透過 `jsonc-parser` 增量修改。 |
| **JSONC** | `.jsonc` | 支援註解與尾端逗號的 JSON，保留註解。 |
| **YAML** | `.yaml`, `.yml` | YAML 1.2，透過 AST 修改保留註解、錨點與縮排。 |

[`detectFormat`](../api-reference/#detectformat) 將副檔名對應至 [`ConfigFormat`](../api-reference/#configformat)。其他副檔名會觸發錯誤，除非明確傳入 `format`。

---

## RFC 6902 操作

conf-patch 實作 RFC 6902 的子集，僅支援以下操作：

| `op` | 行為 |
|---|---|
| `"add"` | 在陣列索引處插入，或新增、取代物件屬性 |
| `"replace"` | 取代現有值，路徑必須存在 |
| `"remove"` | 刪除現有鍵或陣列元素，路徑必須存在 |

:::caution
**不支援** `"move"`、`"copy"` 和 `"test"`。[`JsonPatchOp`](../api-reference/#jsonpatchop) 型別將 `op` 限定為 `"add" | "replace" | "remove"`。
:::

行為說明：

- 對陣列索引執行 `add` 會**插入**元素（RFC 6902）。若要取代現有元素，請使用 `replace`。
- `add` 要求父路徑已存在；請先建立父節點，再建立子節點。
- `replace` 和 `remove` 要求目標路徑已存在。
- 設定 `strict: true`（預設值）時，操作失敗會擲回例外；設定 `strict: false` 時，則會略過失敗操作並記錄警告。

---

## 保留註解與格式

- **JSON/JSONC：** 根據語法樹計算需要修改的文字範圍，保留周圍的註解、尾端逗號與縮排。
- **YAML：** 原地修改 `yaml` AST 後重新序列化，保留註解、錨點、別名與縮排。

---

## OpenAPI 驗證

conf-patch 以具備安全防護的介面封裝 `@powerduck/openapi-parser`，驗證 OpenAPI/Swagger 文件：

- [`validateOpenAPISpec`](../api-reference/#validateopenapispec) 驗證原始 JSON 或 YAML 內容。
- [`validateOpenAPIFile`](../api-reference/#validateopenapifile) 根據檔案路徑驗證文件。
- 輸入處理涵蓋大小限制、路徑沙箱（`allowedRootDirectory`）、結構複雜度檢查、逾時控制及 `AbortSignal` 取消。
- 失敗時擲回 [`OpenApiValidationError`](../api-reference/#openapivalidationerror)，內含可供程式辨識的 `code`。

---

## 延伸閱讀

- [安裝](../installation/) — 將 conf-patch 加入專案並認識兩個進入點。
- [快速入門](../quickstart/) — 修改瀏覽器中的字串與磁碟上的檔案。
- [API 參考](../api-reference/) — 查看所有匯出、型別與選項。
- [範例](../examples/) — JSON、YAML、JSONC、OpenAPI 驗證與檔案鎖定的可執行範例。
