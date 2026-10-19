---
sidebar_position: 4
title: "API 参考"
description: "@powerduck/x-to-openapi 公开入口的参考文档"
---

# API 参考

`@powerduck/x-to-openapi` 公开入口的参考文档。下列签名概述 API；完整的只读标注与导入类型以包内 TypeScript 声明为准。

---

## 零配置辅助函数

### `curlToOpenApi`

一步完成转换：注册 [`CurlAdapter`](#curladapter)，再调用其 [`convert`](#convertsource-input-options)。

```typescript
function curlToOpenApi(
  input: string | readonly string[],
  options?: ConvertOptions,
): Promise<ConvertResult>;
```

| 参数 | 类型 | 说明 |
|---|---|---|
| `input` | `string \| readonly string[]` | curl 命令、命令数组，或浏览器“全部复制为 cURL”的输出；多命令文本会自动拆分。 |
| `options` | `ConvertOptions` | 可选的转换设置。 |

**返回：** [`ConvertResult`](#convertresult)。

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  "curl -X POST https://api.example.com/users -H 'Content-Type: application/json' --data '{\"name\":\"Ada\"}'",
);
```

---

### `postmanToOpenApi`

一步完成转换：注册 [`PostmanAdapter`](#postmanadapter) 后执行转换。支持已解析的集合对象或 JSON 字符串，测试脚本会保留为 `x-postman-scripts`。

```typescript
function postmanToOpenApi(
  input: unknown,
  options?: ConvertOptions,
): Promise<ConvertResult>;
```

| 参数 | 类型 | 说明 |
|---|---|---|
| `input` | `unknown` | Postman Collection v2.0/v2.1.0 对象，或其 JSON 字符串。 |
| `options` | `ConvertOptions` | 可选的转换设置。 |

**返回：** [`ConvertResult`](#convertresult)。

---

## 核心框架

### `XToOpenApi`

转换器类。持有 [`AdapterRegistry`](#adapterregistry)，并执行“解析 → 构建 → 校验”流程。

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

注册适配器并返回 `this`，支持链式调用。要求适配器 `id` 符合 `/^[a-z][a-z0-9-]*$/`、实现 `parse()`，并拒绝重复 ID。

#### `adapters()`

以 `string[]` 返回已注册的适配器 ID。

#### `convert(source, input, options?)`

统一入口。

| 参数 | 类型 | 说明 |
|---|---|---|
| `source` | `string` | 适配器 ID（`"curl"`、`"postman"` 等），或使用 `"auto"` 通过 `canHandle()` 自动选择。 |
| `input` | `unknown` | 源数据，具体结构取决于适配器。 |
| `options` | `ConvertOptions` | 可选的转换设置。 |

**行为：**

1. 与 [`DEFAULT_OPTIONS`](#default_options) 合并并校验选项。
2. 字符串或数组中字符串元素的总长度超过 **10 × 1024 × 1024 个 JavaScript 字符串代码单元**时，抛出 `ConversionError`。这不是 UTF-8 字节限制，也不会测量已解析对象。
3. 选择适配器，使用显式 ID 或 `"auto"` 检测。
4. 将输入解析为 `NormalizedRequest[]`，解析失败转为诊断信息。
5. 通过 [`buildOpenApi32`](#buildopenapi32) 构建 OpenAPI 3.2 文档。
6. 当 `validate` 为 `true` 时，通过 [`validateOpenApi32`](#validateopenapi32) 校验并汇总诊断。
7. 返回 [`ConvertResult`](#convertresult)。

```typescript
import { XToOpenApi, CurlAdapter } from "@powerduck/x-to-openapi";

const converter = new XToOpenApi().register(new CurlAdapter());
const result = await converter.convert("curl", curlText, { title: "My API" });
```

---

### `DEFAULT_OPTIONS`

所有 [`ConvertOptions`](#convertoptions) 均合并到这组默认值上，以 `ResolvedConvertOptions` 类型导出。

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

按 ID 保存已注册的适配器。

```typescript
class AdapterRegistry {
  register<I>(adapter: SourceAdapter<I>): this;
  has(id: string): boolean;
  get(id: string): SourceAdapter<unknown>;
  detect(input: unknown): SourceAdapter<unknown> | undefined;
  ids(): string[];
}
```

| 方法 | 说明 |
|---|---|
| `register(adapter)` | 校验 ID（`/^[a-z][a-z0-9-]*$/`）、检查 `parse()` 并拒绝重复项，返回 `this`。 |
| `has(id)` | 检查是否已注册。 |
| `get(id)` | 返回适配器；不存在时抛出异常，并列出已注册 ID。 |
| `detect(input)` | 返回第一个由 `canHandle()` 接受输入的适配器；检测函数抛出的异常会被捕获并跳过。 |
| `ids()` | 列出已注册 ID。 |

---

### `ConversionError`

在 `strict` 模式下出现错误级别诊断、字符串输入过大或自动选择适配器失败时抛出。存在诊断信息时会附带诊断，但列表也可能为空。无效选项和注册错误则可能抛出 `TypeError` 或 `Error`。

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

[`XToOpenApi.convert`](#convertsource-input-options) 使用的内部收集器。对诊断去重；`strict` 为 `true` 时，错误级别条目会触发 `ConversionError`。

```typescript
class DiagnosticBag {
  constructor(strict?: boolean); // default false
  report(diagnostic: Diagnostic): void;
  get items(): Diagnostic[];
  hasErrors(): boolean;
}
```

---

## 适配器

### `CurlAdapter`

将单条、批量或浏览器导出的 curl 命令转换为 `NormalizedRequest[]`。封装 `curlconverter` 并标准化其输出。

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

- `canHandle` 接受以 `curl` 或 `curl.exe` 开头的字符串，也可检查数组首项；前面允许出现 shell 提示符（`$`、`#`、`>`）。
- `parse` 通过 [`splitCurlCommands`](#splitcurlcommands) 拆分多命令输入，跳过非 HTTP(S) URL，移除 HTTP/2 伪头部，解析正文与 Cookie，并推断认证方式。

> `resolveBackend`、`availableExports` 和 `resetBackend` 是内部集成辅助函数，不属于受支持的包导出。请导入公开适配器，而非内部文件。

---

### `splitCurlCommands`

将浏览器“全部复制为 cURL”的输出拆分为单条命令。支持单双引号、反斜杠与脱字符（`^`）续行、CRLF、shell 提示符（`$`、`#`、`>`、`PS C:\>`）及 `curl.exe`。

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

将 Postman Collection v2.0/v2.1.0 转换为 `NormalizedRequest[]`。遍历嵌套文件夹，按请求项 > 文件夹 > 集合的优先级继承认证，映射正文模式并保留测试脚本。

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

- `canHandle` 接受含有 `info` 对象及 `item` 数组的对象，或解析后满足该条件的 JSON 字符串。支持 v2.1.0 与 v2.0 Schema URL，也接受省略 Schema URL 但结构有效的集合。
- 测试及请求前事件以 `x-postman-scripts` 形式写入操作。

---

### `PostmanTypes`

包含适配器所用 Postman 集合类型的命名空间：

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

主要成员：`PostmanCollection`、`PostmanInfo`、`PostmanVersion`、`PostmanItem`、`PostmanFolder`、`PostmanRequestItem`、`PostmanRequest`、`PostmanHeader`、`PostmanUrl`、`PostmanQueryParam`、`PostmanBodyMode`、`PostmanBody`、`PostmanUrlEncodedParam`、`PostmanFormDataParam`、`PostmanFileParam`、`PostmanGraphQLBody`、`PostmanAuthType`、`PostmanAuth`、`PostmanAuthParam`、`PostmanEvent`、`PostmanScript`、`PostmanVariable`、`PostmanDescription`、`isFolder`、`isRequestItem`。

---

## OpenAPI 构建模块

### `buildOpenApi32`

底层构建器。将已标准化的请求数组组装为 OpenAPI 3.2 文档，通常通过 [`XToOpenApi.convert`](#convertsource-input-options) 间接调用。

```typescript
function buildOpenApi32(
  requests: readonly NormalizedRequest[],
  options: ResolvedConvertOptions,
  report: (diagnostic: Diagnostic) => void,
): OpenApiDocument;
```

按路径与方法分组操作，收集查询、请求头、Cookie、路径参数，合并正文 Schema，生成 `securitySchemes`，将非标准方法放入 `additionalOperations`，并分配 `operationId`/`tags`。

---

### `buildPathTemplates`

将路径结构相同的请求分组；仅当至少有 `minSamples` 个样本、对应段的值发生变化且每个值都像标识符时，才将其模板化。

```typescript
function buildPathTemplates(
  requests: readonly NormalizedRequest[],
  minSamples: number,
  enabled: boolean,
): Map<number, PathTemplate>;
```

返回以 `sourceIndex` 为键的映射，每个 `PathTemplate` 包含：

```typescript
interface PathTemplate {
  readonly path: string;                    // e.g. "/users/{userId}"
  readonly parameters: ReadonlyMap<number, string>; // segment index → name
}
```

当 `enabled` 为 `false` 时，每个请求获得与原始路径相同的静态模板。

---

### `looksLikeIdentifier`

统一判断哪些路径段可以模板化。

```typescript
function looksLikeIdentifier(segment: string): boolean;
```

路径段为纯数字、UUID、ULID 或至少 8 位的十六进制字符串时返回 `true`。

---

### `scalar`

从单个字符串样本推断 JSON Schema，采用保守策略。

```typescript
function scalar(value: string, includeExample?: boolean): Schema; // default false
```

可推断 `boolean`、`integer`（限制安全整数长度）、`number`，以及带有 `format`（`uuid`、`date`、`date-time`）的 `string`；否则为普通 `string`。

---

### `jsonSchema`

从任意 JSON 值（对象、数组、标量）推断 JSON Schema。

```typescript
function jsonSchema(value: unknown, includeExample?: boolean): Schema; // default false
```

对象生成 `{ type: "object", properties, required }`；数组生成 `{ type: "array", items }`，空数组的元素 Schema 为 `{}`；标量采用类似 `scalar` 的类型推断。

---

### `mergeSchemas`

按结构合并多个样本 Schema。对象属性取并集，任一样本中缺失的属性变为可选；数组递归合并；`integer` 扩展为 `number`；格式仅在所有样本一致时保留。

```typescript
function mergeSchemas(schemas: readonly Schema[]): Schema;
```

---

### `Schema`

用于推断正文与参数的结构化 JSON Schema 子集。

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

## 统一类型与校验

### `validateOpenApi32`

通过 `@powerduck/openapi-parser` 按 OpenAPI 3.2 Schema 校验文档。

```typescript
function validateOpenApi32(
  document: OpenApiDocument,
): Promise<ValidationOutcome>;

interface ValidationOutcome {
  valid: boolean;
  diagnostics: Diagnostic[];
}
```

校验错误映射为 `OAS_VALIDATION_ERROR` 诊断；校验器故障映射为 `OAS_VALIDATOR_FAILED`。

### `validateOpenApiDocument`

[`validateOpenApi32`](#validateopenapi32) 的统一别名，下游 `@powerduck/*` 库应导入这个稳定名称。

```typescript
import { validateOpenApiDocument } from "@powerduck/x-to-openapi";

const { valid, diagnostics } = await validateOpenApiDocument(doc);
```

### `OpenApiDocument`

统一的 OpenAPI 3.2 文档类型，是 `@powerduck/openapi-parser` 中 `Oas32Document` 的别名。所有 `@powerduck/*` 库应使用此类型，而非直接引用第三方类型包。

### `OpenApi32Document`

`OpenApiDocument` 的版本专用别名。

---

## 类型

### `ConvertOptions`

全部转换选项，未设置的字段回退到 [`DEFAULT_OPTIONS`](#default_options)。

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

| 选项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `openapiVersion` | `"3.2.0"` | `"3.2.0"` | 仅支持 `"3.2.0"`，其他值会抛出异常。 |
| `title` | `string` | `"Generated API"` | `info.title`，必须非空。 |
| `version` | `string` | `"1.0.0"` | `info.version`，必须非空。 |
| `description` | `string` | `""` | `info.description`，为空时省略。 |
| `inferPathParameters` | `boolean` | `true` | 将取值变化且像标识符的路径段模板化。 |
| `pathParameterMinSamples` | `number` | `2` | 模板化前组内所需的最少请求数，必须为正整数。 |
| `inferSecurity` | `boolean` | `true` | 生成 `securitySchemes` 和操作级 `security`。 |
| `includeCommonHeaders` | `boolean` | `false` | 包含浏览器产生的干扰请求头；传输头部始终排除。 |
| `includeCookies` | `boolean` | `false` | 将 Cookie 输出为参数。 |
| `includeExamples` | `boolean` | `false` | 根据观察值填充 Schema 与参数示例。 |
| `useServerBasePath` | `boolean` | `false` | 所有请求同源时，将公共路径前缀收敛到 `servers[0].url`。 |
| `validate` | `boolean` | `true` | 校验输出文档。校验错误会转为诊断，严格模式可将其转为异常。 |
| `strict` | `boolean` | `false` | 任一错误级别诊断都抛出 `ConversionError`。 |

`ResolvedConvertOptions` 等于 `Required<ConvertOptions> & { openapiVersion: "3.2.0" }`。

---

### `ConvertResult`

每次转换的返回值。

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

各适配器生成的、与适配器实现无关的中间表示。

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

`DiagnosticCode` 是框架可报告的全部代码组成的字符串联合类型：

`ADAPTER_PARSE_FAILED`, `CURL_PARSE_FAILED`, `CURL_EMPTY_INPUT`, `CURL_CAPABILITY_MISSING`, `CURL_BACKEND_JSON_FALLBACK`, `CURL_UNSUPPORTED_SCHEME`, `POSTMAN_INVALID_COLLECTION`, `POSTMAN_EMPTY_COLLECTION`, `POSTMAN_UNSUPPORTED_BODY_MODE`, `POSTMAN_VARIABLE_UNRESOLVED`, `BODY_JSON_INVALID`, `PATH_MERGE_CONFLICT`, `OPERATION_ID_COLLISION`, `PSEUDO_HEADER_DROPPED`, `MULTIPLE_SERVERS`, `NO_REQUESTS`, `OAS_VALIDATION_ERROR`, `OAS_VALIDATOR_FAILED`, `DISCOVERY_COMPONENT_NOT_FOUND`, `DISCOVERY_COMPONENT_NAME_COLLISION`, `DISCOVERY_PATH_PARAM_MISMATCH`, `DISCOVERY_MEDIA_WITHOUT_SCHEMA`, `DISCOVERY_RESPONSE_MISSING`, `DISCOVERY_SECURITY_SCHEME_MISSING`, `DISCOVERY_GAP`, `DISCOVERY_PATH_CONFLICT`.

---

### 其他核心类型

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

## Discovery IR 转换

### `discoveryToOpenApi`

将传入的 `DiscoveredProject` 转换为 OpenAPI 3.2，本身不扫描源文件。未解析的路由会产生警告，绝不会被静默加入 `paths`；返回的项目中仍保留源码位置与置信度。

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

`allowGaps: false` 将操作或 Schema 缺口诊断升级为错误，但不是严格模式的异常开关。始终检查 `ok`、`documentValid` 和 `diagnostics`。未解析路由的警告单独报告。禁用校验时，即使没有进行 Schema 校验，`documentValid` 也为 true。

### `buildDiscoveryOpenApi32`

针对相同 IR 的底层同步构建器，通过传入的回调报告诊断，不执行文档校验。需要校验和完整结果对象时，优先使用异步封装。

```typescript
function buildDiscoveryOpenApi32(
  project: DiscoveredProject,
  allowGaps: boolean,
  report: (diagnostic: Diagnostic) => void,
): OpenApiDocument;
```

主入口导出的发现类型包括：`Confidence`、`GapCode`、`SourceLocation`、`JsonSchema`、`DiscoveredParameter`、`DiscoveredMediaType`、`DiscoveredRequestBody`、`DiscoveredResponse`、`DiscoveredOperation`、`DiscoveredComponent`、`DiscoveredSecurityScheme`、`DiscoveredServer`、`DiscoveredUnresolved`、`DiscoveredProject`、`DiscoveryOptions`、`DiscoveryResult`。

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

## 导出汇总

| 符号 | 类别 |
|---|---|
| `curlToOpenApi` | 函数 |
| `postmanToOpenApi` | 函数 |
| `XToOpenApi` | 类 |
| `DEFAULT_OPTIONS` | 常量 |
| `AdapterRegistry` | 类 |
| `ConversionError` | 类 |
| `DiagnosticBag` | 类 |
| `CurlAdapter` | 类 |
| `splitCurlCommands` | 函数 |
| `PostmanAdapter` | 类 |
| `PostmanTypes` | 命名空间 |
| `buildOpenApi32` | 函数 |
| `buildPathTemplates` | 函数 |
| `looksLikeIdentifier` | 函数 |
| `scalar` | 函数 |
| `jsonSchema` | 函数 |
| `mergeSchemas` | 函数 |
| `Schema` | 类型 |
| `discoveryToOpenApi` | 函数 |
| `buildDiscoveryOpenApi32` | 函数 |
| `validateOpenApi32` | 函数 |
| `validateOpenApiDocument` | 函数（别名） |
| `OpenApiDocument` | 类型 |
| `OpenApi32Document` | 类型 |
| `DiscoveredProject`, `DiscoveryOptions`, `DiscoveryResult` | 类型 |
| `ConvertOptions`, `ConvertResult`, `NormalizedRequest`, `SourceAdapter`, `AdapterContext`, `Diagnostic`, `DiagnosticCode`, `Severity`, `Header`, `ParameterValue`, `FormField`, `BodyKind`, `RequestBody`, `RequestAuth`, `JsonObject`, `ResolvedConvertOptions` | 类型 |
