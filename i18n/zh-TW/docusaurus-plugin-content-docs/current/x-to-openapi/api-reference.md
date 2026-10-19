---
sidebar_position: 4
title: "API 參考"
description: "@powerduck/x-to-openapi 公開入口的參考文件"
---

# API 參考

`@powerduck/x-to-openapi` 公開入口的參考文件。下列簽章概述 API；完整的唯讀標註與匯入型別以套件內 TypeScript 宣告為準。

---

## 零設定輔助函式

### `curlToOpenApi`

一步完成轉換：註冊 [`CurlAdapter`](#curladapter)，再呼叫其 [`convert`](#convertsource-input-options)。

```typescript
function curlToOpenApi(
  input: string | readonly string[],
  options?: ConvertOptions,
): Promise<ConvertResult>;
```

| 參數 | 型別 | 說明 |
|---|---|---|
| `input` | `string \| readonly string[]` | curl 命令、命令陣列，或瀏覽器「全部複製為 cURL」的輸出；多命令文字會自動拆分。 |
| `options` | `ConvertOptions` | 選用的轉換設定。 |

**傳回：** [`ConvertResult`](#convertresult)。

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  "curl -X POST https://api.example.com/users -H 'Content-Type: application/json' --data '{\"name\":\"Ada\"}'",
);
```

---

### `postmanToOpenApi`

一步完成轉換：註冊 [`PostmanAdapter`](#postmanadapter) 後執行轉換。支援已解析的集合物件或 JSON 字串，測試指令碼會保留為 `x-postman-scripts`。

```typescript
function postmanToOpenApi(
  input: unknown,
  options?: ConvertOptions,
): Promise<ConvertResult>;
```

| 參數 | 型別 | 說明 |
|---|---|---|
| `input` | `unknown` | Postman Collection v2.0/v2.1.0 物件，或其 JSON 字串。 |
| `options` | `ConvertOptions` | 選用的轉換設定。 |

**傳回：** [`ConvertResult`](#convertresult)。

---

## 核心架構

### `XToOpenApi`

轉換器類別。持有 [`AdapterRegistry`](#adapterregistry)，並執行「解析 → 建構 → 驗證」流程。

```typescript
class XToOpenApi {
  register<I>(adapter: SourceAdapter<I>): this;
  adapters(): string[];
  convert(
    source: string,
    input: unknown,
    options?: ConvertOptions,
  ): Promise<ConvertResult>;
}
```

#### `register(adapter)`

註冊介接器並傳回 `this`，支援鏈式呼叫。要求介接器 `id` 符合 `/^[a-z][a-z0-9-]*$/`、實作 `parse()`，並拒絕重複 ID。

#### `adapters()`

以 `string[]` 傳回已註冊的介接器 ID。

#### `convert(source, input, options?)`

統一入口。

| 參數 | 型別 | 說明 |
|---|---|---|
| `source` | `string` | 介接器 ID（`"curl"`、`"postman"` 等），或使用 `"auto"` 透過 `canHandle()` 自動選擇。 |
| `input` | `unknown` | 來源資料，具體結構取決於介接器。 |
| `options` | `ConvertOptions` | 選用的轉換設定。 |

**行為：**

1. 與 [`DEFAULT_OPTIONS`](#default_options) 合併並驗證選項。
2. 字串或陣列中字串元素的總長度超過 **10 × 1024 × 1024 個 JavaScript 字串碼元**時，拋出 `ConversionError`。這不是 UTF-8 位元組限制，也不會測量已解析物件。
3. 選擇介接器，使用明確指定的 ID 或 `"auto"` 偵測。
4. 將輸入解析為 `NormalizedRequest[]`，解析失敗轉為診斷資訊。
5. 透過 [`buildOpenApi32`](#buildopenapi32) 建構 OpenAPI 3.2 文件。
6. 當 `validate` 為 `true` 時，透過 [`validateOpenApi32`](#validateopenapi32) 驗證並彙整診斷。
7. 傳回 [`ConvertResult`](#convertresult)。

```typescript
import { XToOpenApi, CurlAdapter } from "@powerduck/x-to-openapi";

const converter = new XToOpenApi().register(new CurlAdapter());
const result = await converter.convert("curl", curlText, { title: "My API" });
```

---

### `DEFAULT_OPTIONS`

所有 [`ConvertOptions`](#convertoptions) 都合併到這組預設值上，以 `ResolvedConvertOptions` 型別匯出。

```typescript
const DEFAULT_OPTIONS: ResolvedConvertOptions = {
  openapiVersion: "3.2.0",
  title: "Generated API",
  version: "1.0.0",
  description: "",
  inferPathParameters: true,
  pathParameterMinSamples: 2,
  inferSecurity: true,
  includeCommonHeaders: false,
  includeCookies: false,
  includeExamples: false,
  useServerBasePath: false,
  validate: true,
  strict: false,
};
```

---

### `AdapterRegistry`

依 ID 保存已註冊的介接器。

```typescript
class AdapterRegistry {
  register<I>(adapter: SourceAdapter<I>): this;
  has(id: string): boolean;
  get(id: string): SourceAdapter<unknown>;
  detect(input: unknown): SourceAdapter<unknown> | undefined;
  ids(): string[];
}
```

| 方法 | 說明 |
|---|---|
| `register(adapter)` | 驗證 ID（`/^[a-z][a-z0-9-]*$/`）、檢查 `parse()` 並拒絕重複項目，傳回 `this`。 |
| `has(id)` | 檢查是否已註冊。 |
| `get(id)` | 傳回介接器；不存在時拋出例外，並列出已註冊 ID。 |
| `detect(input)` | 傳回第一個由 `canHandle()` 接受輸入的介接器；偵測函式拋出的例外會被攔截並略過。 |
| `ids()` | 列出已註冊 ID。 |

---

### `ConversionError`

在 `strict` 模式下出現錯誤層級診斷、字串輸入過大或自動選擇介接器失敗時拋出。有診斷資訊時會一併附上，但清單也可能為空。無效選項和註冊錯誤則可能拋出 `TypeError` 或 `Error`。

```typescript
class ConversionError extends Error {
  readonly diagnostics: readonly Diagnostic[];
  constructor(
    message: string,
    diagnostics: readonly Diagnostic[],
    options?: { cause?: unknown },
  );
}
```

---

### `DiagnosticBag`

[`XToOpenApi.convert`](#convertsource-input-options) 使用的內部收集器。對診斷去重；`strict` 為 `true` 時，錯誤層級項目會觸發 `ConversionError`。

```typescript
class DiagnosticBag {
  constructor(strict?: boolean); // default false
  report(diagnostic: Diagnostic): void;
  get items(): Diagnostic[];
  hasErrors(): boolean;
}
```

---

## 介接器

### `CurlAdapter`

將單一、批次或瀏覽器匯出的 curl 命令轉換為 `NormalizedRequest[]`。封裝 `curlconverter` 並將其輸出正規化。

```typescript
class CurlAdapter implements SourceAdapter<string | readonly string[]> {
  readonly id = "curl";
  canHandle(input: unknown): boolean;
  parse(
    input: string | readonly string[],
    context: AdapterContext,
  ): Promise<NormalizedRequest[]>;
}
```

- `canHandle` 接受以 `curl` 或 `curl.exe` 開頭的字串，也可檢查陣列首項；前面允許出現 shell 提示字元（`$`、`#`、`>`）。
- `parse` 透過 [`splitCurlCommands`](#splitcurlcommands) 拆分多命令輸入，略過非 HTTP(S) URL，移除 HTTP/2 偽標頭，解析主體與 Cookie，並推斷驗證方式。

> `resolveBackend`、`availableExports` 和 `resetBackend` 是內部整合輔助函式，不屬於受支援的套件匯出。請匯入公開介接器，而非內部檔案。

---

### `splitCurlCommands`

將瀏覽器「全部複製為 cURL」的輸出拆分為單一命令。支援單雙引號、反斜線與插入符號（`^`）接續行、CRLF、shell 提示字元（`$`、`#`、`>`、`PS C:\>`）及 `curl.exe`。

```typescript
function splitCurlCommands(input: string): string[];
```

```typescript
import { splitCurlCommands } from "@powerduck/x-to-openapi";

const commands = splitCurlCommands(`
  $ curl https://api.example.com/users
  > curl https://api.example.com/users/123
`);
// ["curl https://api.example.com/users", "curl https://api.example.com/users/123"]
```

---

### `PostmanAdapter`

將 Postman Collection v2.0/v2.1.0 轉換為 `NormalizedRequest[]`。遍歷巢狀資料夾，依請求項目 > 資料夾 > 集合的優先順序繼承驗證，對應主體模式並保留測試指令碼。

```typescript
class PostmanAdapter implements SourceAdapter<PostmanCollection | string> {
  readonly id = "postman";
  canHandle(input: unknown): boolean;
  parse(
    input: PostmanCollection | string,
    context: AdapterContext,
  ): Promise<NormalizedRequest[]>;
}
```

- `canHandle` 接受含有 `info` 物件及 `item` 陣列的物件，或解析後符合該條件的 JSON 字串。支援 v2.1.0 與 v2.0 Schema URL，也接受省略 Schema URL 但結構有效的集合。
- 測試及請求前事件以 `x-postman-scripts` 形式寫入操作。

---

### `PostmanTypes`

包含介接器所用 Postman 集合型別的命名空間：

```typescript
import { PostmanTypes } from "@powerduck/x-to-openapi";

type Collection = PostmanTypes.PostmanCollection;
type Item = PostmanTypes.PostmanItem;
type Request = PostmanTypes.PostmanRequest;
type Body = PostmanTypes.PostmanBody;
type Auth = PostmanTypes.PostmanAuth;
type Script = PostmanTypes.PostmanScript;

// Runtime type guards are functions; the other members are TypeScript types.
const isFolder = PostmanTypes.isFolder;
const isRequestItem = PostmanTypes.isRequestItem;
```

主要成員：`PostmanCollection`、`PostmanInfo`、`PostmanVersion`、`PostmanItem`、`PostmanFolder`、`PostmanRequestItem`、`PostmanRequest`、`PostmanHeader`、`PostmanUrl`、`PostmanQueryParam`、`PostmanBodyMode`、`PostmanBody`、`PostmanUrlEncodedParam`、`PostmanFormDataParam`、`PostmanFileParam`、`PostmanGraphQLBody`、`PostmanAuthType`、`PostmanAuth`、`PostmanAuthParam`、`PostmanEvent`、`PostmanScript`、`PostmanVariable`、`PostmanDescription`、`isFolder`、`isRequestItem`。

---

## OpenAPI 建構模組

### `buildOpenApi32`

底層建構器。將已正規化的請求陣列組裝為 OpenAPI 3.2 文件，通常透過 [`XToOpenApi.convert`](#convertsource-input-options) 間接呼叫。

```typescript
function buildOpenApi32(
  requests: readonly NormalizedRequest[],
  options: ResolvedConvertOptions,
  report: (diagnostic: Diagnostic) => void,
): OpenApiDocument;
```

依路徑與方法分組操作，收集查詢、標頭、Cookie、路徑參數，合併主體 Schema，產生 `securitySchemes`，將非標準方法放入 `additionalOperations`，並指派 `operationId`/`tags`。

---

### `buildPathTemplates`

將路徑結構相同的請求分組；只有至少有 `minSamples` 個樣本、對應區段的值有所變化且每個值都像識別碼時，才將其範本化。

```typescript
function buildPathTemplates(
  requests: readonly NormalizedRequest[],
  minSamples: number,
  enabled: boolean,
): Map<number, PathTemplate>;
```

傳回以 `sourceIndex` 為索引鍵的映射，每個 `PathTemplate` 包含：

```typescript
interface PathTemplate {
  readonly path: string;                    // e.g. "/users/{userId}"
  readonly parameters: ReadonlyMap<number, string>; // segment index → name
}
```

當 `enabled` 為 `false` 時，每個請求會取得與原始路徑相同的靜態範本。

---

### `looksLikeIdentifier`

統一判斷哪些路徑區段可範本化。

```typescript
function looksLikeIdentifier(segment: string): boolean;
```

路徑區段為純數字、UUID、ULID 或至少 8 位的十六進位字串時傳回 `true`。

---

### `scalar`

從單一字串樣本推斷 JSON Schema，採用保守策略。

```typescript
function scalar(value: string, includeExample?: boolean): Schema; // default false
```

可推斷 `boolean`、`integer`（限制安全整數長度）、`number`，以及帶有 `format`（`uuid`、`date`、`date-time`）的 `string`；否則為一般 `string`。

---

### `jsonSchema`

從任意 JSON 值（物件、陣列、純量）推斷 JSON Schema。

```typescript
function jsonSchema(value: unknown, includeExample?: boolean): Schema; // default false
```

物件產生 `{ type: "object", properties, required }`；陣列產生 `{ type: "array", items }`，空陣列的元素 Schema 為 `{}`；純量採用類似 `scalar` 的型別推斷。

---

### `mergeSchemas`

依結構合併多個樣本 Schema。物件屬性取聯集，任一樣本中缺少的屬性變為選用；陣列遞迴合併；`integer` 擴展為 `number`；格式僅在所有樣本一致時保留。

```typescript
function mergeSchemas(schemas: readonly Schema[]): Schema;
```

---

### `Schema`

用於推斷主體與參數的結構化 JSON Schema 子集。

```typescript
interface Schema {
  type?: string | string[];
  format?: string;
  properties?: Record<string, Schema>;
  required?: string[];
  items?: Schema;
  example?: unknown;
  contentMediaType?: string;
  description?: string;
  nullable?: boolean;
  [key: string]: unknown; // OpenAPI extensions and unmodeled fields
}
```

---

## 統一型別與驗證

### `validateOpenApi32`

透過 `@powerduck/openapi-parser` 依 OpenAPI 3.2 Schema 驗證文件。

```typescript
function validateOpenApi32(
  document: OpenApiDocument,
): Promise<ValidationOutcome>;

interface ValidationOutcome {
  valid: boolean;
  diagnostics: Diagnostic[];
}
```

驗證錯誤對應為 `OAS_VALIDATION_ERROR` 診斷；驗證器故障對應為 `OAS_VALIDATOR_FAILED`。

### `validateOpenApiDocument`

[`validateOpenApi32`](#validateopenapi32) 的統一別名，下游 `@powerduck/*` 函式庫應匯入此穩定名稱。

```typescript
import { validateOpenApiDocument } from "@powerduck/x-to-openapi";

const { valid, diagnostics } = await validateOpenApiDocument(doc);
```

### `OpenApiDocument`

統一的 OpenAPI 3.2 文件型別，是 `@powerduck/openapi-parser` 中 `Oas32Document` 的別名。所有 `@powerduck/*` 函式庫應使用此型別，而非直接引用第三方型別套件。

### `OpenApi32Document`

`OpenApiDocument` 的版本專用別名。

---

## 型別

### `ConvertOptions`

全部轉換選項，未設定的欄位回退至 [`DEFAULT_OPTIONS`](#default_options)。

```typescript
interface ConvertOptions {
  openapiVersion?: "3.2.0";
  title?: string;
  version?: string;
  description?: string;
  inferPathParameters?: boolean;
  pathParameterMinSamples?: number;
  inferSecurity?: boolean;
  includeCommonHeaders?: boolean;
  includeCookies?: boolean;
  includeExamples?: boolean;
  useServerBasePath?: boolean;
  validate?: boolean;
  strict?: boolean;
}
```

| 選項 | 型別 | 預設值 | 說明 |
|---|---|---|---|
| `openapiVersion` | `"3.2.0"` | `"3.2.0"` | 僅支援 `"3.2.0"`，其他值會拋出例外。 |
| `title` | `string` | `"Generated API"` | `info.title`，不可為空。 |
| `version` | `string` | `"1.0.0"` | `info.version`，不可為空。 |
| `description` | `string` | `""` | `info.description`，為空時省略。 |
| `inferPathParameters` | `boolean` | `true` | 將取值變動且像識別碼的路徑區段範本化。 |
| `pathParameterMinSamples` | `number` | `2` | 範本化前組內所需的最少請求數，必須為正整數。 |
| `inferSecurity` | `boolean` | `true` | 產生 `securitySchemes` 和操作層級的 `security`。 |
| `includeCommonHeaders` | `boolean` | `false` | 包含瀏覽器產生的雜訊標頭；傳輸標頭一律排除。 |
| `includeCookies` | `boolean` | `false` | 將 Cookie 輸出為參數。 |
| `includeExamples` | `boolean` | `false` | 依觀察值填入 Schema 與參數範例。 |
| `useServerBasePath` | `boolean` | `false` | 所有請求同源時，將共同路徑前綴收斂至 `servers[0].url`。 |
| `validate` | `boolean` | `true` | 驗證輸出文件。驗證錯誤會轉為診斷，嚴格模式可將其轉為例外。 |
| `strict` | `boolean` | `false` | 任一錯誤層級診斷都拋出 `ConversionError`。 |

`ResolvedConvertOptions` 等於 `Required<ConvertOptions> & { openapiVersion: "3.2.0" }`。

---

### `ConvertResult`

每次轉換的傳回值。

```typescript
interface ConvertResult {
  /** The generated OpenAPI 3.2 document. */
  document: OpenApiDocument;
  /** Normalized requests (urlString is populated for JSON serialization). */
  requests: NormalizedRequest[];
  /** All diagnostics produced during conversion. */
  diagnostics: Diagnostic[];
  /** True when no error-severity diagnostic was produced. */
  ok: boolean;
  /** True when the document passed validation (or validation was skipped). */
  documentValid: boolean;
}
```

---

### `NormalizedRequest`

各介接器產生、與介接器實作無關的中間表示。

```typescript
interface NormalizedRequest {
  source: string;            // adapter id, e.g. "curl"
  sourceIndex: number;       // index within the source
  method: string;            // lowercase token, e.g. "get", "post", "purge"
  url: URL;
  urlString?: string;        // string form, set for JSON-safe serialization
  headers: readonly Header[];
  query: readonly ParameterValue[];
  cookies: readonly ParameterValue[];
  body?: RequestBody;
  auth?: RequestAuth;
  /** x-* extensions merged onto the operation (first-wins per key). */
  extensions?: Readonly<Record<string, unknown>>;
}
```

---

### `Diagnostic` / `DiagnosticCode` / `Severity`

```typescript
type Severity = "info" | "warning" | "error";

interface Diagnostic {
  code: DiagnosticCode;
  message: string;
  severity: Severity;
  source?: string;   // adapter id
  index?: number;    // source command index
  path?: string;      // affected OpenAPI path
  cause?: unknown;    // underlying error
}
```

`DiagnosticCode` 是框架可回報的所有代碼組成的字串聯集型別：

`ADAPTER_PARSE_FAILED`, `CURL_PARSE_FAILED`, `CURL_EMPTY_INPUT`, `CURL_CAPABILITY_MISSING`, `CURL_BACKEND_JSON_FALLBACK`, `CURL_UNSUPPORTED_SCHEME`, `POSTMAN_INVALID_COLLECTION`, `POSTMAN_EMPTY_COLLECTION`, `POSTMAN_UNSUPPORTED_BODY_MODE`, `POSTMAN_VARIABLE_UNRESOLVED`, `BODY_JSON_INVALID`, `PATH_MERGE_CONFLICT`, `OPERATION_ID_COLLISION`, `PSEUDO_HEADER_DROPPED`, `MULTIPLE_SERVERS`, `NO_REQUESTS`, `OAS_VALIDATION_ERROR`, `OAS_VALIDATOR_FAILED`, `DISCOVERY_COMPONENT_NOT_FOUND`, `DISCOVERY_COMPONENT_NAME_COLLISION`, `DISCOVERY_PATH_PARAM_MISMATCH`, `DISCOVERY_MEDIA_WITHOUT_SCHEMA`, `DISCOVERY_RESPONSE_MISSING`, `DISCOVERY_SECURITY_SCHEME_MISSING`, `DISCOVERY_GAP`, `DISCOVERY_PATH_CONFLICT`.

---

### 其他核心型別

```typescript
type JsonObject = Record<string, unknown>;

interface Header { readonly name: string; readonly value: string; }
interface ParameterValue { readonly name: string; readonly value: string; }
interface FormField {
  readonly name: string;
  readonly value?: string;
  readonly fileName?: string;
  readonly contentType?: string;
}

type BodyKind = "json" | "xml" | "form-urlencoded" | "multipart" | "text" | "binary";

interface RequestBody {
  readonly kind: BodyKind;
  readonly mediaType: string;
  readonly raw?: string;
  readonly fields?: readonly FormField[];
}

type RequestAuth =
  | { readonly type: "basic" }
  | { readonly type: "bearer" }
  | { readonly type: "apiKey"; readonly in: "header" | "query" | "cookie"; readonly name: string };

interface AdapterContext {
  readonly report: (diagnostic: Diagnostic) => void;
  readonly strict: boolean;
}

interface SourceAdapter<I = unknown> {
  readonly id: string;
  canHandle?(input: unknown): boolean;
  parse(input: I, context: AdapterContext): Promise<NormalizedRequest[]>;
}
```

---

## Discovery IR 轉換

### `discoveryToOpenApi`

將傳入的 `DiscoveredProject` 轉換為 OpenAPI 3.2，本身不掃描原始檔。未解析的路由會產生警告，絕不會默默加入 `paths`；傳回的專案仍保留原始碼位置與信心程度。

```typescript
function discoveryToOpenApi(
  project: DiscoveredProject,
  options?: DiscoveryOptions,
): Promise<DiscoveryResult>;

interface DiscoveryOptions {
  openapiVersion?: "3.2.0";
  allowGaps?: boolean; // default true
  validate?: boolean; // default true
}

interface DiscoveryResult {
  readonly document: OpenApiDocument;
  readonly project: DiscoveredProject;
  readonly diagnostics: Diagnostic[];
  readonly ok: boolean;
  readonly documentValid: boolean;
}
```

`allowGaps: false` 將操作或 Schema 缺口診斷提升為錯誤，但不是嚴格模式的例外開關。請一律檢查 `ok`、`documentValid` 和 `diagnostics`。未解析路由的警告會另外回報。停用驗證時，即使未進行 Schema 驗證，`documentValid` 也為 true。

### `buildDiscoveryOpenApi32`

針對相同 IR 的底層同步建構器，透過傳入的回呼回報診斷，不執行文件驗證。需要驗證與完整結果物件時，優先使用非同步包裝函式。

```typescript
function buildDiscoveryOpenApi32(
  project: DiscoveredProject,
  allowGaps: boolean,
  report: (diagnostic: Diagnostic) => void,
): OpenApiDocument;
```

主入口匯出的探索型別包括：`Confidence`、`GapCode`、`SourceLocation`、`JsonSchema`、`DiscoveredParameter`、`DiscoveredMediaType`、`DiscoveredRequestBody`、`DiscoveredResponse`、`DiscoveredOperation`、`DiscoveredComponent`、`DiscoveredSecurityScheme`、`DiscoveredServer`、`DiscoveredUnresolved`、`DiscoveredProject`、`DiscoveryOptions`、`DiscoveryResult`。

```typescript
import { discoveryToOpenApi } from "@powerduck/x-to-openapi";

const discovered = await discoveryToOpenApi({
  title: "Health API",
  operations: [{
    method: "get",
    path: "/health",
    responses: [{ statusCode: "204", description: "Healthy", confidence: "high" }],
    confidence: "high",
    origin: { file: "src/routes.ts", line: 1 },
  }],
});
console.log(discovered.ok, discovered.documentValid, discovered.diagnostics);
```

---

## 匯出摘要

| 符號 | 種類 |
|---|---|
| `curlToOpenApi` | 函式 |
| `postmanToOpenApi` | 函式 |
| `XToOpenApi` | 類別 |
| `DEFAULT_OPTIONS` | 常數 |
| `AdapterRegistry` | 類別 |
| `ConversionError` | 類別 |
| `DiagnosticBag` | 類別 |
| `CurlAdapter` | 類別 |
| `splitCurlCommands` | 函式 |
| `PostmanAdapter` | 類別 |
| `PostmanTypes` | 命名空間 |
| `buildOpenApi32` | 函式 |
| `buildPathTemplates` | 函式 |
| `looksLikeIdentifier` | 函式 |
| `scalar` | 函式 |
| `jsonSchema` | 函式 |
| `mergeSchemas` | 函式 |
| `Schema` | 型別 |
| `discoveryToOpenApi` | 函式 |
| `buildDiscoveryOpenApi32` | 函式 |
| `validateOpenApi32` | 函式 |
| `validateOpenApiDocument` | 函式（別名） |
| `OpenApiDocument` | 型別 |
| `OpenApi32Document` | 型別 |
| `DiscoveredProject`, `DiscoveryOptions`, `DiscoveryResult` | 型別 |
| `ConvertOptions`, `ConvertResult`, `NormalizedRequest`, `SourceAdapter`, `AdapterContext`, `Diagnostic`, `DiagnosticCode`, `Severity`, `Header`, `ParameterValue`, `FormField`, `BodyKind`, `RequestBody`, `RequestAuth`, `JsonObject`, `ResolvedConvertOptions` | 型別 |
