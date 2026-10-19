---
sidebar_position: 4
title: "API 參考"
description: "@powerduck/conf-patch 完整參考，涵蓋各匯出符號的簽章與預設值。"
---

# API 參考

`@powerduck/conf-patch` 完整參考，涵蓋各匯出符號的簽章與預設值。

提供兩個進入點：

- **`@powerduck/conf-patch`** — 下列所有功能：核心層、檔案層、OpenAPI 驗證與工具函式。
- **`@powerduck/conf-patch/core`** — 僅包含相容於瀏覽器的子集：`patchContent`、`setContentValue`、`deleteContentValue`、`PatchContentOptions`、斷言輔助函式，以及 `ConfigFormat`、`JsonPatchOp`、`JsonPathSegment` 型別。

---

## 核心層（相容於瀏覽器）

### `patchContent`

對設定字串套用一組 RFC 6902 修補操作。此函式為純函式，不存取檔案系統。

```typescript
function patchContent(
  content: string,
  ops: JsonPatchOp[],
  format: ConfigFormat,
  options?: PatchContentOptions,
): string;
```

| 參數 | 型別 | 說明 |
|---|---|---|
| `content` | `string` | 原始設定內容，必須符合指定的 `format`。 |
| `ops` | `JsonPatchOp[]` | 依序執行的操作。空陣列會原樣傳回 `content`。 |
| `format` | `ConfigFormat` | `"json" \| "jsonc" \| "yaml"`。 |
| `options.strict` | `boolean` | 為 `true`（預設值）時，操作失敗會擲回例外；為 `false` 時，略過失敗操作並呼叫 `console.warn`。 |

**傳回：** 套用修補後的設定內容（`string`）。

**例外：** `content` 不是字串或 `ops` 無效時擲回 `TypeError`；`strict` 為 `true` 時，擲回說明失敗操作的錯誤。

```typescript
import { patchContent } from "@powerduck/conf-patch/core";

patchContent(
  '{"name": "app"}',
  [{ op: "add", path: ["version"], value: "1.0.0" }],
  "json",
);
// => '{\n  "name": "app",\n  "version": "1.0.0"\n}'
```

---

### `setContentValue`

設定或建立單一值。內部呼叫 `patchContent` 執行一次 `add` 操作。依 RFC 6902 語意，`add` 會取代現有物件屬性，或在陣列索引處插入元素。

```typescript
function setContentValue(
  content: string,
  path: readonly (string | number)[],
  value: unknown,
  format: ConfigFormat,
): string;
```

| 參數 | 型別 | 說明 |
|---|---|---|
| `content` | `string` | 原始設定內容。 |
| `path` | `readonly (string \| number)[]` | 分段路徑，例如 `["server", "port"]`，不得為空。 |
| `value` | `unknown` | 要寫入的值。 |
| `format` | `ConfigFormat` | 設定格式。 |

**傳回：** 更新後的內容（`string`）。

```typescript
setContentValue("server:\n  port: 3000\n", ["server", "port"], 8080, "yaml");
```

---

### `deleteContentValue`

刪除鍵或陣列元素。內部呼叫 `patchContent` 執行一次 `remove` 操作，目標路徑必須存在。

```typescript
function deleteContentValue(
  content: string,
  path: readonly (string | number)[],
  format: ConfigFormat,
): string;
```

```typescript
deleteContentValue(
  '{"name": "app", "legacy": true}',
  ["legacy"],
  "json",
);
```

---

### `PatchContentOptions`

```typescript
interface PatchContentOptions {
  /** When true, failed operations throw. When false, they are skipped with a warning. Default: true */
  strict?: boolean;
}
```

---

## 檔案層（僅 Node.js / Electron）

### `readConfigFile`

從本機檔案路徑或 `file://` URL 讀取 UTF-8 文字。

```typescript
function readConfigFile(filePath: string): Promise<string>;
```

| 參數 | 型別 | 說明 |
|---|---|---|
| `filePath` | `string` | 絕對路徑、相對路徑或 `file://` URL，不得為空。 |

**傳回：** 原始 UTF-8 內容（`Promise<string>`）。

**例外：** 無法讀取檔案時，擲回封裝底層檔案系統錯誤的例外。

---

### `writeConfigFile`

透過**原子寫入**（暫存檔加重新命名）寫入內容，預設使用獨佔**檔案鎖定**。加鎖前會建立父目錄。

```typescript
function writeConfigFile(
  filePath: string,
  content: string,
  options?: WriteConfigOptions,
): Promise<void>;
```

| 參數 | 型別 | 說明 |
|---|---|---|
| `filePath` | `string` | 設定檔路徑。 |
| `content` | `string` | 要寫入的內容，必須是字串。 |
| `options` | `WriteConfigOptions` | 請參閱下文。 |

**例外：** 輸入無效時擲回 `TypeError`；寫入失敗時封裝底層檔案系統錯誤。

#### `WriteConfigOptions`

| 選項 | 型別 | 預設值 | 說明 |
|---|---|---|---|
| `lock` | `boolean` | `true` | 寫入時啟用檔案鎖定。 |
| `lockTimeoutMs` | `number` | `withFileLock` 預設值（10 秒） | 等待取得鎖定的最長時間，單位為毫秒。 |
| `lockRetryDelayMs` | `number` | `withFileLock` 預設值（25 毫秒） | 指數退避前的初始重試延遲，單位為毫秒。 |
| `lockStaleThresholdMs` | `number` | `withFileLock` 預設值 | 允許復原鎖定前，鎖定必須存在的時間，單位為毫秒。 |
| `allowStaleRecovery` | `boolean` | `false` | 是否允許自動回收過期鎖定。 |

```typescript
import { writeConfigFile } from "@powerduck/conf-patch";

await writeConfigFile("config.json", '{"name": "app"}');
```

---

### `patchConfigFile`

檔案層的主要交易：在鎖定內讀取檔案、套用 `patchContent`，並且**僅在內容變更時**原子寫回。未提供 `options.format` 時，會依副檔名自動偵測格式。

```typescript
function patchConfigFile(
  filePath: string,
  ops: JsonPatchOp[],
  options?: PatchConfigOptions,
): Promise<void>;
```

| 參數 | 型別 | 說明 |
|---|---|---|
| `filePath` | `string` | 設定檔路徑，不得為空。 |
| `ops` | `JsonPatchOp[]` | 要執行的操作。空陣列直接傳回，不讀取或寫入檔案。 |
| `options` | `PatchConfigOptions` | 請參閱下文。 |

**例外：** `filePath` 為空、鎖定選項無效，或無法偵測格式且未提供 `format` 時擲回 `TypeError`；`strict` 為 `true` 時擲回操作錯誤。

#### `PatchConfigOptions`

| 選項 | 型別 | 預設值 | 說明 |
|---|---|---|---|
| `format` | `ConfigFormat` | 自動偵測 | 明確指定格式，優先於副檔名偵測結果。 |
| `strict` | `boolean` | `true` | 操作失敗時擲回例外。 |
| `lock` | `boolean` | `true` | 啟用檔案鎖定。 |
| `lockTimeoutMs` | `number` | 10 秒 | 非負值，等待鎖定的最長時間。 |
| `lockRetryDelayMs` | `number` | 25 毫秒 | 正數，初始重試延遲。 |
| `lockStaleThresholdMs` | `number` | 計算得出 | 正數，允許復原過期鎖定所需的鎖定存在時間。 |
| `allowStaleRecovery` | `boolean` | `false` | 自動回收過期鎖定。 |

```typescript
await patchConfigFile("config.json", [
  { op: "replace", path: ["server", "host"], value: "0.0.0.0" },
  { op: "add", path: ["server", "ssl"], value: true },
  { op: "remove", path: ["legacySection"] },
]);
```

---

### `setConfigValue`

新增或取代檔案中的巢狀值，將一次 `add` 操作交由 `patchConfigFile` 執行。

```typescript
function setConfigValue(
  filePath: string,
  path: readonly (string | number)[],
  value: unknown,
  options?: PatchConfigOptions,
): Promise<void>;
```

```typescript
await setConfigValue("config.yaml", ["database", "port"], 5432);
```

---

### `deleteConfigValue`

刪除檔案中現有的巢狀值，將一次 `remove` 操作交由 `patchConfigFile` 執行。

```typescript
function deleteConfigValue(
  filePath: string,
  path: readonly (string | number)[],
  options?: PatchConfigOptions,
): Promise<void>;
```

```typescript
await deleteConfigValue("config.json", ["features", "betaPreview"]);
```

---

### `withFileLock`

透過處理程序內的佇列**以及**獨佔鎖定檔（`<file>.confedit.lock`）執行非同步回呼。鎖定使用擁有權權杖；僅當 `allowStaleRecovery` 為 `true` 且鎖定存在時間超過 `staleThresholdMs` 時，才會復原過期鎖定。此處刻意不檢查 PID，因為 PID 可能重複使用。

```typescript
function withFileLock<T>(
  filePath: string,
  callback: () => Promise<T>,
  options?: FileLockOptions,
): Promise<T>;
```

| 參數 | 型別 | 說明 |
|---|---|---|
| `filePath` | `string` | 要鎖定的檔案。 |
| `callback` | `() => Promise<T>` | 持有鎖定時執行的工作。 |
| `options` | `FileLockOptions` | 請參閱下文。 |

**傳回：** `callback` 的傳回值（`Promise<T>`）。即使回呼擲回例外，仍會在 `finally` 區塊釋放鎖定。

#### `FileLockOptions`

| 選項 | 型別 | 預設值 | 說明 |
|---|---|---|---|
| `timeoutMs` | `number` | `10000` | 等待鎖定的最長時間，單位為毫秒，必須為非負值。 |
| `retryDelayMs` | `number` | `25` | 初始重試延遲，單位為毫秒，必須為正數。退避延遲以 1.5 倍遞增，上限為 1000 毫秒。 |
| `staleThresholdMs` | `number` | `max(timeoutMs * 2, 60000)` | 允許復原鎖定前，鎖定必須存在的時間，單位為毫秒，必須為正數。 |
| `allowStaleRecovery` | `boolean` | `false` | 自動回收過期鎖定。為避免搶占仍在執行的交易，Electron 單一主處理程序情境預設關閉此功能。 |

```typescript
import { withFileLock } from "@powerduck/conf-patch";

await withFileLock("state.json", async () => {
  // ... read, modify, write ...
}, { timeoutMs: 5000 });
```

---

### `releaseAllLocalLocks`

刪除目前處理程序擁有的所有鎖定檔。請在進行中的檔案交易結束後，於應用程式關閉時呼叫。Electron 若需要非同步清理，請先阻止第一次結束事件，待清理完成後再繼續結束，詳見範例。個別鎖定的清理失敗會被忽略。

```typescript
function releaseAllLocalLocks(): Promise<void>;
```

---

## OpenAPI 驗證

### `validateOpenAPISpec`

驗證原始 OpenAPI/Swagger 內容（JSON 或 YAML）。預設將輸入視為**內容**；僅在 `inputKind: "file"` 時將其解讀為檔案路徑。驗證委派給 `@powerduck/openapi-parser`，本函式補充安全的輸入處理。

```typescript
function validateOpenAPISpec(
  input: string,
  options?: ValidateOpenApiOptions,
): Promise<AnyOpenAPIDocument>;
```

| 參數 | 型別 | 說明 |
|---|---|---|
| `input` | `string` | 原始規格內容；`inputKind: "file"` 時為檔案路徑。 |
| `options` | `ValidateOpenApiOptions` | 請參閱下文。 |

**傳回：** 驗證成功的文件（`Promise<AnyOpenAPIDocument>`）。

**例外：** 輸入為空或不是字串時擲回 `TypeError`；選項無效或驗證過程失敗時擲回 [`OpenApiValidationError`](#openapivalidationerror)。

---

### `validateOpenAPIFile`

便利封裝：呼叫 `validateOpenAPISpec`，設定 `inputKind: "file"`，並將 `baseFilePath` 設為指定路徑。必須提供 `allowedRootDirectory`。

```typescript
function validateOpenAPIFile(
  filePath: string,
  options?: ValidateOpenApiOptions,
): Promise<AnyOpenAPIDocument>;
```

```typescript
import { validateOpenAPIFile } from "@powerduck/conf-patch";

const doc = await validateOpenAPIFile("./configs/openapi.yaml", {
  allowedRootDirectory: "./configs",
});
```

---

### `ValidateOpenApiOptions`

| 選項 | 型別 | 預設值 | 說明 |
|---|---|---|---|
| `inputKind` | `"content" \| "file"` | `"content"` | 如何解讀 `input`。 |
| `baseFilePath` | `string` | — | 參照解析內容的基準路徑。 |
| `allowedRootDirectory` | `string` | — | 檔案輸入的根目錄；`inputKind` 為 `"file"` 時**必填**。 |
| `timeoutMs` | `number` | `15000` | 操作逾時時間，單位為毫秒。 |
| `maxInputBytes` | `number` | `5242880`（5 MB） | 原始輸入的最大位元組數。 |
| `maxDocumentNodes` | `number` | `100000` | 解析後文件的最大節點數，用於防範阻斷服務攻擊。 |
| `maxDocumentDepth` | `number` | `100` | 最大巢狀深度，用於防範阻斷服務攻擊。 |
| `maxValidationErrors` | `number` | `50` | 錯誤訊息中包含的最大錯誤數量。 |
| `maxErrorMessageLength` | `number` | `1000` | 每則驗證錯誤的最大字元數。 |
| `signal` | `AbortSignal` | — | 選用的取消訊號。 |

---

### `OpenApiValidationError`

驗證失敗時擲回的結構化錯誤。將錯誤傳回用戶端前，應在應用程式邊界進行轉換處理；錯誤訊息與原因可能包含本機路徑或文件細節。

```typescript
class OpenApiValidationError extends Error {
  readonly code: string;
  readonly cause?: unknown;
  constructor(code: string, message: string, cause?: unknown);
}
```

| 屬性 | 型別 | 說明 |
|---|---|---|
| `code` | `string` | 可供程式辨識的錯誤代碼，請參閱下表。 |
| `message` | `string` | 便於閱讀的詳細說明。 |
| `cause` | `unknown` | 選用的底層錯誤。 |

#### 錯誤代碼

| 代碼 | 意義 |
|---|---|
| `INVALID_OPTION` | 提供了無效的選項值。 |
| `INPUT_TOO_LARGE` | 原始內容超過 `maxInputBytes`。 |
| `INPUT_FILE_TOO_LARGE` | 輸入檔案超過大小限制。 |
| `FILE_INPUT_FORBIDDEN` | 使用檔案輸入但未指定 `allowedRootDirectory`。 |
| `PATH_OUTSIDE_ROOT` | 檔案路徑解析至 `allowedRootDirectory` 之外。 |
| `PARSE_ERROR` | 無法解析 JSON/YAML 內容。 |
| `INVALID_DOCUMENT_SHAPE` | 文件不是 JSON 物件。 |
| `UNSUPPORTED_VERSION` | 文件未宣告支援的 OpenAPI/Swagger 版本，僅接受主版本 `2` 與 `3`。 |
| `DOCUMENT_TOO_DEEP` | 巢狀深度超過 `maxDocumentDepth`。 |
| `DOCUMENT_TOO_LARGE` | 節點數超過 `maxDocumentNodes`。 |
| `SPEC_VALIDATION_FAILED` | 規格未通過 OpenAPI 驗證。 |
| `OPERATION_TIMEOUT` | 操作超過 `timeoutMs`。 |
| `OPERATION_ABORTED` | 操作透過 `signal` 取消。 |
| `UNKNOWN_ERROR` | 非預期的錯誤。 |

---

## 工具函式

### `detectFormat`

根據檔案路徑或 `file://` URL 的副檔名偵測 [`ConfigFormat`](#configformat)。

```typescript
function detectFormat(filePath: string): ConfigFormat;
```

| 副檔名 | 結果 |
|---|---|
| `.json` | `"json"` |
| `.jsonc` | `"jsonc"` |
| `.yaml`, `.yml` | `"yaml"` |
| 其他副檔名 | 擲回錯誤 |

---

### `normalizeFilePath`

將本機路徑或 `file:` URL 轉為原生絕對路徑，保留有效空白與 Unicode 檔名。

```typescript
function normalizeFilePath(filePath: string): string;
```

`file:` URL 使用 `fileURLToPath` 解碼；絕對路徑原樣傳回；相對路徑以 `process.cwd()` 為基準解析。

---

## 斷言輔助函式

這些函式重新匯出供進階用法及內部模組使用，應用程式碼通常不必直接呼叫。

### `assertNonEmptyString`

```typescript
function assertNonEmptyString(value: unknown, label: string): asserts value is string;
```
若 `value` 不是非空字串，則擲回 `TypeError`。

### `assertPatchPath`

```typescript
function assertPatchPath(
  path: readonly (string | number)[],
  label?: string, // default "path"
): void;
```
若 `path` 不是非空陣列，或路徑區段不是非空字串或安全的非負整數，則擲回例外。

### `assertPatchOperations`

```typescript
function assertPatchOperations(ops: JsonPatchOp[]): void;
```
驗證每個操作：`op` 必須為 `"add" | "replace" | "remove"`；`path` 必須通過 `assertPatchPath`；`add`/`replace` 必須具有自己的 `value` 屬性。

### `assertConfigFormat`

```typescript
function assertConfigFormat(format: ConfigFormat): void;
```
若 `format` 不是 `"json"`、`"jsonc"` 或 `"yaml"`，則擲回例外。

### `getErrorMessage`

```typescript
function getErrorMessage(error: unknown): string;
```
對 `Error` 執行個體傳回 `error.message`，其他情況傳回 `String(error)`。

### `createError`

```typescript
function createError(message: string, cause: unknown): Error;
```
建立 `Error` 並附加 `cause` 屬性，使用 `Object.defineProperty`，並提供較舊執行環境的替代方式。

---

## 型別

### `ConfigFormat`

```typescript
type ConfigFormat = "json" | "jsonc" | "yaml";
```

### `JsonPathSegment`

```typescript
type JsonPathSegment = string | number;
```

### `JsonPatchOp`

```typescript
interface JsonPatchOp {
  op: "add" | "replace" | "remove";
  path: JsonPathSegment[];
  /** Required for "add" and "replace". */
  value?: unknown;
}
```

:::caution
僅支援 `"add"`、`"replace"` 與 `"remove"`，刻意不提供 `"move"`、`"copy"` 與 `"test"`。
:::

### `PatchConfigOptions`

```typescript
interface PatchConfigOptions {
  format?: ConfigFormat;
  strict?: boolean;
  lock?: boolean;
  lockTimeoutMs?: number;
  lockRetryDelayMs?: number;
  lockStaleThresholdMs?: number;
  /** Whether stale locks can be automatically reclaimed. Defaults to false. */
  allowStaleRecovery?: boolean;
}
```

### `FileLockOptions`

```typescript
interface FileLockOptions {
  /** Max time to wait for a lock. Defaults to 10 seconds. */
  timeoutMs?: number;
  /** Initial retry delay. Defaults to 25ms. */
  retryDelayMs?: number;
  /** Explicit lock age after which recovery is allowed. */
  staleThresholdMs?: number;
  /** Whether stale locks can be automatically reclaimed. Defaults to false. */
  allowStaleRecovery?: boolean;
}
```

### `WriteConfigOptions`

```typescript
interface WriteConfigOptions {
  lock?: boolean;
  lockTimeoutMs?: number;
  lockRetryDelayMs?: number;
  lockStaleThresholdMs?: number;
  allowStaleRecovery?: boolean;
}
```

### `PatchContentOptions`

```typescript
interface PatchContentOptions {
  strict?: boolean;
}
```

### `OpenApiInputKind`

```typescript
type OpenApiInputKind = "content" | "file";
```

### `AnyOpenAPIDocument`

驗證傳回的受支援 OpenAPI/Swagger 文件結構聯集型別：

```typescript
type AnyOpenAPIDocument =
  | OpenAPIV2.Document      // Swagger 2.0
  | OpenAPIV3.Document      // OpenAPI 3.0.x
  | OpenAPIV3_1.Document     // OpenAPI 3.1.x
  | OpenAPIV3_2Document;    // OpenAPI 3.2 (permissive structural type)
```

`OpenAPIV3_2Document` 是較寬鬆的結構型別：

```typescript
interface OpenAPIV3_2Document {
  openapi: string;
  info: Record<string, unknown>;
  paths?: Record<string, unknown>;
  [key: string]: unknown;
}
```

---

## 匯出摘要

| 符號 | 主要進入點 | 核心子路徑 | 種類 |
|---|:---:|:---:|---|
| `patchContent` | ✓ | ✓ | 函式 |
| `setContentValue` | ✓ | ✓ | 函式 |
| `deleteContentValue` | ✓ | ✓ | 函式 |
| `PatchContentOptions` | ✓ | ✓ | 型別 |
| `assertNonEmptyString` | ✓ | ✓ | 函式 |
| `assertPatchPath` | ✓ | ✓ | 函式 |
| `assertPatchOperations` | ✓ | ✓ | 函式 |
| `assertConfigFormat` | ✓ | ✓ | 函式 |
| `getErrorMessage` | ✓ | ✓ | 函式 |
| `createError` | ✓ | ✓ | 函式 |
| `ConfigFormat` | ✓ | ✓ | 型別 |
| `JsonPatchOp` | ✓ | ✓ | 型別 |
| `JsonPathSegment` | ✓ | ✓ | 型別 |
| `readConfigFile` | ✓ | — | 函式 |
| `writeConfigFile` | ✓ | — | 函式 |
| `WriteConfigOptions` | ✓ | — | 型別 |
| `patchConfigFile` | ✓ | — | 函式 |
| `setConfigValue` | ✓ | — | 函式 |
| `deleteConfigValue` | ✓ | — | 函式 |
| `withFileLock` | ✓ | — | 函式 |
| `releaseAllLocalLocks` | ✓ | — | 函式 |
| `PatchConfigOptions` | ✓ | — | 型別 |
| `FileLockOptions` | ✓ | — | 型別 |
| `detectFormat` | ✓ | — | 函式 |
| `normalizeFilePath` | ✓ | — | 函式 |
| `validateOpenAPISpec` | ✓ | — | 函式 |
| `validateOpenAPIFile` | ✓ | — | 函式 |
| `OpenApiValidationError` | ✓ | — | 類別 |
| `ValidateOpenApiOptions` | ✓ | — | 型別 |
| `OpenApiInputKind` | ✓ | — | 型別 |
| `AnyOpenAPIDocument` | ✓ | — | 型別 |