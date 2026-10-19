---
sidebar_position: 4
title: "API 參考"
description: "@powerduck/openapi-codegen 的完整 API 文件。"
---

# API 參考

`@powerduck/openapi-codegen` 的完整 API 文件。

## 頂層函式

| 匯出項目 | 簽章 | 說明 |
|--------|-----------|-------------|
| `generate` | `(options: GenerateOptions) => string` | 為單一操作產生可執行的原始碼 |
| `register` | `(generator: Generator) => void` | 註冊自訂產生器 |
| `get` | `(language: string, client: string) => Generator \| undefined` | 尋找產生器 |
| `list` | `() => Array<{ language: string; client: string }>` | 列出所有已註冊產生器 |
| `use` | `(plugin: Plugin) => void` | 套用註冊產生器的外掛程式 |
| `registerBuiltins` | `() => void` | 註冊所有內建產生器，匯入時自動呼叫 |
| `normalize` | `(options) => NormalizedRequest` | 將文件、路徑與方法轉換為正規化請求 |
| `builtinGenerators` | `Generator[]` | 所有內建產生器定義的原始陣列 |

模組載入時會自動註冊內建產生器，因此手動呼叫 `registerBuiltins()` 並非必要。

## generate(options)

```ts
generate(options: GenerateOptions): string
```

以字串傳回產生的原始碼。先透過 `get(options.language, options.client)` 尋找產生器；若未提供 `options.request`，則呼叫 `normalize({ document, path, method, serverUrl, securityValues, softRefMode })`；最後呼叫 `generator.generate(request)`。

可能擲回的錯誤：

- `options` 不是物件或缺少必要輸入時，擲回 `TypeError`。
- 未知的語言/用戶端組合會擲回 `Error: Unsupported generator: <language>/<client>`。
- 來自 `normalize()` 的錯誤：未知路徑或方法、無效文件，以及失效或循環的 `$ref`；啟用 `softRefMode` 時會寬容處理參照錯誤。

完整選項表請參閱 [設定](/docs/zh-TW/openapi-codegen/configuration/#generateoptions)。

## register(generator)

```ts
register({
  language: "mylang",
  client: "my-client",
  generate(request) {
    return `// ${request.method} ${request.path}`;
  },
});
```

以 `language\0client` 為索引鍵，註冊至不區分大小寫的內部儲存區。

## get(language, client)

```ts
const generator = get("javascript", "fetch");
```

傳回 `Generator`；找不到則傳回 `undefined`。

## list()

```ts
const combos = list();
// [{ language: "c", client: "libcurl" }, ...]
```

## use(plugin)

```ts
use({
  name: "my-plugin",
  register({ register }) {
    register(customGenerator);
  },
});
```

等同於呼叫 `plugin.register({ register })`。

## registerBuiltins()

```ts
registerBuiltins();
```

具冪等性，由內部旗標保護。註冊 `builtinGenerators` 的所有項目。

## normalize(options)

```ts
import { normalize } from "@powerduck/openapi-codegen";

const request = normalize({
  document,
  path: "/pets/{id}",
  method: "get",
  serverUrl: "https://example.com",
  securityValues: { bearerAuth: "token" },
  softRefMode: false,
});
```

解析 `$ref`、合併路徑與操作參數、選擇請求主體媒體類型、產生範例值、解析安全方案，並計算 `baseUrl`。未知路徑或方法，以及不支援的方法會導致錯誤。

## 內建產生器（21 種語言、41 種用戶端） {#built-in-generators-21-languages-41-clients}

以下為 `src/emitters/index.ts` 中註冊的精確 `language` / `client` 識別碼。查詢不區分大小寫，表格列出標準寫法。

| 語言 | `language` | `client` 值 |
|----------|-----------|-----------------|
| C | `c` | `libcurl` |
| C# | `csharp` | `httpclient`, `restsharp` |
| Clojure | `clojure` | `clj-http` |
| Dart | `dart` | `http` |
| F# | `fsharp` | `httpclient` |
| Go | `go` | `new-request` |
| HTTP 請求檔案 | `http` | `http1` |
| Java | `java` | `asynchttp`, `java-net-http`, `okhttp`, `unirest` |
| JavaScript | `javascript` | `axios`, `fetch`, `jquery`, `ofetch`, `xhr` |
| Kotlin | `kotlin` | `okhttp` |
| Node.js | `node` | `axios`, `fetch`, `ofetch`, `undici` |
| Objective-C | `objc` | `nsurlsession` |
| OCaml | `ocaml` | `cohttp` |
| PHP | `php` | `curl`, `guzzle`, `laravel-http` |
| PowerShell | `powershell` | `invoke-restmethod`, `invoke-webrequest` |
| Python | `python` | `aiohttp`, `http-client`, `httpx-async`, `httpx-sync`, `requests` |
| R | `r` | `httr2` |
| Ruby | `ruby` | `net-http` |
| Rust | `rust` | `reqwest` |
| Shell | `shell` | `curl`, `httpie`, `wget` |
| Swift | `swift` | `nsurlsession` |

共 21 種語言、41 種組合。

> 提供某個產生器，不代表該用戶端能表達所有操作。例如 `shell/wget` 無法安全地建立任意 `multipart/form-data` 請求；此時請使用 `shell/curl` 或 `shell/httpie`。

## 核心型別

從 `./types` 重新匯出：

```ts
type ParameterLocation = "path" | "query" | "querystring" | "header" | "cookie";

interface FileValue { __file: true; path?; name?; contentType?; data?; }
interface Parameter { name; in: ParameterLocation; value: unknown; style?; explode?; allowReserved?; }
interface Body { mediaType: string; value: unknown; encoding?: Record<string, unknown>; }
interface Security { name; type; scheme?; in?; paramName?; value: string; }
interface RequestIR { method; baseUrl; path; parameters: Parameter[]; headers: Parameter[]; body?; security: Security[]; }
interface GenerateResult { code: string; files?: Record<string, string>; metadata?: Record<string, unknown>; }
interface Generator { language: string; client: string; generate(request: RequestIR): string; }
interface Plugin { name: string; register(api: { register(g: Generator): void }): void; }
interface GenerateOptions { language; client; request?; document?; path?; method?; serverUrl?; securityValues?; softRefMode?; }
```

## 核心函式

以下皆從套件的根入口重新匯出。

### refs

| 匯出項目 | 說明 |
|--------|-------------|
| `RefResolver` | 解析文件內 `#/...` JSON Pointer 的類別。建構函式為 `(root, softMode = false)`；方法包括 `deref(value)`、`resolveRef(ref)`、`clearCache()`；公開欄位為 `softMode`。預設會針對外部、失效或循環參照擲回錯誤，除非 `softMode` 為真。 |

### example

| 匯出項目 | 說明 |
|--------|-------------|
| `example(schema, resolver, seen?, depth=0, ctx=default)` | 從 JSON Schema 產生範例值，遵循 `example`、`enum`、`const`、`default`、`oneOf`/`anyOf`/`allOf`、型別、格式與限制。 |
| `ExampleGenContext` | 型別為 `{ isRequestBody: boolean; isResponse: boolean }`，控制 `readOnly`/`writeOnly` 篩選。 |
| `defaultExampleContext` | 預設值為 `{ isRequestBody: false, isResponse: false }`。 |

### serialize

| 匯出項目 | 說明 |
|--------|-------------|
| `Pair` | 型別為 `[string, string]`。 |
| `parameter(parameter)` | 依 OpenAPI `style`/`explode` 規則將單一參數序列化為 `Pair[]`，支援 form、spaceDelimited、pipeDelimited、label、matrix、simple、deepObject。 |
| `query(pairs)` | 將索引鍵/值配對串接成查詢字串。 |
| `cookie(pairs)` | 將配對串接成 `Cookie` 標頭值。 |
| `headerValue(value)` | 清理標頭值，移除 CR/LF/NUL。 |

### generator

| 匯出項目 | 說明 |
|--------|-------------|
| `createGenerator(language, client, emit)` | 將 `emit(request) => string` 函式包裝成 `Generator`。 |
| `GeneratorEmitter` | 型別為 `(request: RequestIR) => string`。 |

### registry

| 匯出項目 | 說明 |
|--------|-------------|
| `registerGenerator(generator)` | 寫入不區分大小寫的儲存區。 |
| `getGenerator(language, client)` | 從儲存區讀取。 |
| `listGenerators()` | 傳回 `[{ language, client }, ...]`。 |

### plugin

| 匯出項目 | 說明 |
|--------|-------------|
| `PluginApi` | 型別為 `{ register(generator: Generator): void }`。 |
| `applyPlugin(plugin, api)` | 呼叫 `plugin.register(api)`。 |

### request

| 匯出項目 | 說明 |
|--------|-------------|
| `CompiledRequest` | 型別為 `{ url; headers: Array<[string,string]>; body?; queryPairs; cookiePairs }`。 |
| `compile(request)` | 替換路徑參數、建立查詢/標頭/Cookie 配對、套用安全方案並串接 URL。 |
| `form(value)` | 將物件序列化為 `application/x-www-form-urlencoded` 字串。 |

### helpers

常用工具：

| 匯出項目 | 說明 |
|--------|-------------|
| `isRecord(value)` | 一般物件的型別守衛。 |
| `isFileValue(value)` | `FileValue` 標記的型別守衛。 |
| `firstDefined(...values)` | 第一個非 `undefined` 的值。 |
| `nonBlankString(value, fallback?)` | 移除兩端空白後的非空字串，或 `undefined`/備援值。 |
| `normalizeMethod(method)` | 將方法轉為大寫，預設為 `GET`。 |
| `supportsRequestBody(method)` | 對 `GET`/`HEAD` 傳回 `false`。 |
| `requiresRequestBody(method)` | 對 `POST`/`PUT`/`PATCH` 傳回 `true`。 |
| `mediaTypeOf(request, fallback)` | 從主體或 Content-Type 標頭取得有效媒體類型。 |
| `hasJsonBody(request)` | 判斷媒體類型是否為 JSON 或 `+json`。 |
| `hasFormBody(request)` | `application/x-www-form-urlencoded`. |
| `hasMultipartBody(request)` | `multipart/form-data`. |
| `bodyText(request)` | 原始主體文字或格式化 JSON。 |
| `toHeaderObject(headers)` | 將配對轉換為 `Record<string,string>`。 |
| `toKeyValueBody(value)` | 將 multipart 主體展開為有序欄位描述。 |
| `collectByLocation(request, location)` | 依 OpenAPI 參數位置篩選。 |
| `operationName(request)` | 依方法與路徑產生 snake_case 函式名或變數名。 |
| `sanitizeIdentifier(value)` | 將任意文字轉換為有效識別碼。 |
| `indent(text, prefix="  ")` | 縮排每個非空白行。 |
| `stringifyLiteral(value)` | 格式化 JSON，並提供安全備援。 |
| `kotlinValue(value)` / `formFieldValue(value)` | 將值序列化為常值或表單欄位。 |
| `fileComment(path, fieldName)` | 為 multipart 檔案預留路徑建立 TODO 註解。 |
| `mergeAllOfSchemas(schemas, resolver)` | 淺層合併 `allOf` 結構描述。 |
| `lightweightOpenAPIPreCheck(doc)` | 傳回文件的結構性警告。 |
| `browserHeaders(headers, multipart)` | 移除瀏覽器禁止設定的標頭。 |
| `isBrowserForbiddenHeader(name)` | 判斷標頭是否由瀏覽器網路 API 控制。 |
| `escapeJs`, `escapePy`, `escapeSh`, `escapePhp`, `escapeRuby`, `escapePowerShell`, `escapeCSharp`, `escapeJava`, `escapeGo`, `escapeRust`, `escapeObjC`, `escapeSwift`, `escapeR`, `escapeOCaml`, `escapeFSharp`, `escapeClojure` | 各語言專用的字串常值逸出函式。 |
| `assertIsRecord`, `assertIsString`, `assertIsNumber` | 執行階段斷言守衛。 |
| `DEFAULT_FILE_PATH`, `DEFAULT_FILE_NAME`, `DEFAULT_BINARY_MEDIA_TYPE` | 檔案上傳預留值使用的常數。 |
