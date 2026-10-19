---
sidebar_position: 4
title: "Tài liệu tham chiếu API"
description: "Tài liệu tham chiếu cho điểm vào công khai của @powerduck/x-to-openapi"
---

# Tài liệu tham chiếu API

Tài liệu tham chiếu cho điểm vào công khai của `@powerduck/x-to-openapi`. Các chữ ký dưới đây tóm tắt API; xem khai báo TypeScript của gói để biết đầy đủ các chú thích readonly và kiểu được nhập.

---

## Hàm hỗ trợ không cần cấu hình

### `curlToOpenApi`

Chuyển đổi trong một lần gọi: đăng ký [`CurlAdapter`](#curladapter) rồi gọi [`convert`](#convertsource-input-options).

```typescript
function curlToOpenApi(
  input: string | readonly string[],
  options?: ConvertOptions,
): Promise<ConvertResult>;
```

| Tham số | Kiểu | Mô tả |
|---|---|---|
| `input` | `string \| readonly string[]` | Một lệnh curl, một mảng lệnh hoặc đầu ra “Copy all as cURL” của trình duyệt; văn bản chứa nhiều lệnh được tự động tách. |
| `options` | `ConvertOptions` | Các thiết lập chuyển đổi tùy chọn. |

**Trả về:** [`ConvertResult`](#convertresult).

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  "curl -X POST https://api.example.com/users -H 'Content-Type: application/json' --data '{\"name\":\"Ada\"}'",
);
```

---

### `postmanToOpenApi`

Chuyển đổi trong một lần gọi: đăng ký [`PostmanAdapter`](#postmanadapter) rồi chuyển đổi đối tượng bộ sưu tập đã phân tích hoặc chuỗi JSON. Kịch bản kiểm thử được giữ lại dưới dạng `x-postman-scripts`.

```typescript
function postmanToOpenApi(
  input: unknown,
  options?: ConvertOptions,
): Promise<ConvertResult>;
```

| Tham số | Kiểu | Mô tả |
|---|---|---|
| `input` | `unknown` | Đối tượng Postman Collection v2.0/v2.1.0 hoặc chuỗi JSON biểu diễn đối tượng đó. |
| `options` | `ConvertOptions` | Các thiết lập chuyển đổi tùy chọn. |

**Trả về:** [`ConvertResult`](#convertresult).

---

## Cấu trúc cốt lõi

### `XToOpenApi`

Lớp bộ chuyển đổi. Chứa [`AdapterRegistry`](#adapterregistry) và thực hiện quy trình phân tích → tạo tài liệu → xác thực.

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

Đăng ký bộ điều hợp. Trả về `this` để nối chuỗi lời gọi. Kiểm tra `id` của bộ điều hợp bằng `/^[a-z][a-z0-9-]*$/`, yêu cầu phương thức `parse()` và từ chối ID trùng lặp.

#### `adapters()`

Trả về các ID bộ điều hợp đã đăng ký dưới dạng `string[]`.

#### `convert(source, input, options?)`

Điểm vào duy nhất.

| Tham số | Kiểu | Mô tả |
|---|---|---|
| `source` | `string` | ID bộ điều hợp (`"curl"`, `"postman"`, …) hoặc `"auto"` để chọn qua `canHandle()`. |
| `input` | `unknown` | Dữ liệu nguồn; cấu trúc phụ thuộc vào bộ điều hợp. |
| `options` | `ConvertOptions` | Các thiết lập chuyển đổi tùy chọn. |

**Hành vi:**

1. Bổ sung các tùy chọn từ [`DEFAULT_OPTIONS`](#default_options) rồi kiểm tra tính hợp lệ.
2. Từ chối bằng `ConversionError` nếu chuỗi hoặc tổng các phần tử chuỗi trong mảng vượt quá **10 × 1024 × 1024 đơn vị mã JavaScript**. Đây không phải giới hạn byte UTF-8; đối tượng đã phân tích không được đo kích thước.
3. Chọn bộ điều hợp theo ID chỉ định hoặc cơ chế phát hiện `"auto"`.
4. Phân tích đầu vào thành `NormalizedRequest[]`; lỗi phân tích trở thành thông tin chẩn đoán.
5. Tạo tài liệu OpenAPI 3.2 qua [`buildOpenApi32`](#buildopenapi32).
6. Nếu `validate` là `true`, xác thực qua [`validateOpenApi32`](#validateopenapi32) và gộp thông tin chẩn đoán vào kết quả.
7. Trả về [`ConvertResult`](#convertresult).

```typescript
import { XToOpenApi, CurlAdapter } from "@powerduck/x-to-openapi";

const converter = new XToOpenApi().register(new CurlAdapter());
const result = await converter.convert("curl", curlText, { title: "My API" });
```

---

### `DEFAULT_OPTIONS`

Các giá trị mặc định được hợp nhất với mọi [`ConvertOptions`](#convertoptions). Được xuất dưới dạng `ResolvedConvertOptions`.

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

Lưu các bộ điều hợp đã đăng ký theo ID.

```typescript
class AdapterRegistry {
  register<I>(adapter: SourceAdapter<I>): this;
  has(id: string): boolean;
  get(id: string): SourceAdapter<unknown>;
  detect(input: unknown): SourceAdapter<unknown> | undefined;
  ids(): string[];
}
```

| Phương thức | Mô tả |
|---|---|
| `register(adapter)` | Kiểm tra ID (`/^[a-z][a-z0-9-]*$/`), kiểm tra `parse()` và từ chối bản trùng lặp. Trả về `this`. |
| `has(id)` | Kiểm tra xem bộ điều hợp đã được đăng ký chưa. |
| `get(id)` | Trả về bộ điều hợp hoặc ném lỗi liệt kê các ID đã đăng ký. |
| `detect(input)` | Trả về bộ điều hợp đầu tiên có `canHandle()` chấp nhận đầu vào. Ngoại lệ trong hàm kiểm tra được bắt lại và bộ điều hợp đó bị bỏ qua. |
| `ids()` | Liệt kê các ID đã đăng ký. |

---

### `ConversionError`

Được ném khi có chẩn đoán mức lỗi trong chế độ `strict`, chuỗi đầu vào quá dài hoặc chọn bộ điều hợp tự động thất bại. Chứa thông tin chẩn đoán nếu có; danh sách có thể trống. Tùy chọn không hợp lệ và lỗi đăng ký có thể ném `TypeError` hoặc `Error`.

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

Bộ thu thập nội bộ được [`XToOpenApi.convert`](#convertsource-input-options) sử dụng. Loại bỏ chẩn đoán trùng lặp và ném `ConversionError` cho các mục mức lỗi khi `strict` là `true`.

```typescript
class DiagnosticBag {
  constructor(strict?: boolean); // default false
  report(diagnostic: Diagnostic): void;
  get items(): Diagnostic[];
  hasErrors(): boolean;
}
```

---

## Bộ điều hợp

### `CurlAdapter`

Chuyển đổi lệnh curl đơn lẻ, một loạt lệnh hoặc dữ liệu xuất từ trình duyệt thành `NormalizedRequest[]`. Bao bọc `curlconverter` và chuẩn hóa đầu ra.

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

- `canHandle` chấp nhận chuỗi hoặc phần tử đầu tiên của mảng bắt đầu bằng dấu nhắc shell tùy chọn (`$`, `#`, `>`), tiếp theo là `curl` hoặc `curl.exe`.
- `parse` tách đầu vào có nhiều lệnh qua [`splitCurlCommands`](#splitcurlcommands), bỏ qua URL không dùng HTTP(S), loại bỏ giả tiêu đề HTTP/2, phân tích nội dung và cookie, đồng thời suy luận xác thực.

> `resolveBackend`, `availableExports` và `resetBackend` là hàm hỗ trợ tích hợp nội bộ, không phải thành phần xuất công khai được hỗ trợ. Hãy nhập bộ điều hợp công khai thay vì các tệp nội bộ.

---

### `splitCurlCommands`

Tách đầu ra “Copy all as cURL” của trình duyệt thành từng lệnh. Xử lý dấu nháy đơn/kép, nối dòng bằng dấu gạch chéo ngược và dấu mũ (`^`), CRLF, dấu nhắc shell (`$`, `#`, `>`, `PS C:\>`) và `curl.exe`.

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

Chuyển Postman Collections v2.0/v2.1.0 thành `NormalizedRequest[]`. Duyệt thư mục lồng nhau, giải quyết xác thực theo thứ tự ưu tiên mục > thư mục > bộ sưu tập, ánh xạ chế độ nội dung và giữ lại kịch bản kiểm thử.

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

- `canHandle` chấp nhận đối tượng hoặc chuỗi JSON đã phân tích có đối tượng `info` và mảng `item`. Chấp nhận URL lược đồ v2.1.0, v2.0 và bộ sưu tập có cấu trúc hợp lệ nhưng không có URL lược đồ.
- Sự kiện kiểm thử và trước yêu cầu được đưa vào thao tác dưới dạng `x-postman-scripts`.

---

### `PostmanTypes`

Không gian tên chứa tất cả các kiểu bộ sưu tập Postman mà bộ điều hợp sử dụng:

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

Các thành viên chính: `PostmanCollection`, `PostmanInfo`, `PostmanVersion`, `PostmanItem`, `PostmanFolder`, `PostmanRequestItem`, `PostmanRequest`, `PostmanHeader`, `PostmanUrl`, `PostmanQueryParam`, `PostmanBodyMode`, `PostmanBody`, `PostmanUrlEncodedParam`, `PostmanFormDataParam`, `PostmanFileParam`, `PostmanGraphQLBody`, `PostmanAuthType`, `PostmanAuth`, `PostmanAuthParam`, `PostmanEvent`, `PostmanScript`, `PostmanVariable`, `PostmanDescription`, `isFolder`, `isRequestItem`.

---

## Thành phần tạo OpenAPI

### `buildOpenApi32`

Bộ dựng cấp thấp. Tạo tài liệu OpenAPI 3.2 từ mảng yêu cầu đã chuẩn hóa. Thông thường, bạn gọi gián tiếp qua [`XToOpenApi.convert`](#convertsource-input-options).

```typescript
function buildOpenApi32(
  requests: readonly NormalizedRequest[],
  options: ResolvedConvertOptions,
  report: (diagnostic: Diagnostic) => void,
): OpenApiDocument;
```

Nhóm thao tác theo đường dẫn và phương thức, thu thập tham số truy vấn/tiêu đề/cookie/đường dẫn, hợp nhất lược đồ nội dung, tạo `securitySchemes`, đưa phương thức không chuẩn vào `additionalOperations` và gán `operationId`/`tags`.

---

### `buildPathTemplates`

Nhóm các yêu cầu cùng cấu trúc và tham số hóa những đoạn thay đổi giữa ít nhất `minSamples` mẫu, đồng thời có dạng định danh trong mọi mẫu.

```typescript
function buildPathTemplates(
  requests: readonly NormalizedRequest[],
  minSamples: number,
  enabled: boolean,
): Map<number, PathTemplate>;
```

Trả về ánh xạ có khóa là `sourceIndex`. Mỗi `PathTemplate` gồm:

```typescript
interface PathTemplate {
  readonly path: string;                    // e.g. "/users/{userId}"
  readonly parameters: ReadonlyMap<number, string>; // segment index → name
}
```

Khi `enabled` là `false`, mỗi yêu cầu nhận một mẫu tĩnh giống đường dẫn gốc.

---

### `looksLikeIdentifier`

Quy tắc thống nhất để xác định đoạn nào có thể được tham số hóa.

```typescript
function looksLikeIdentifier(segment: string): boolean;
```

Trả về `true` nếu đoạn chỉ gồm chữ số, là UUID, ULID hoặc chuỗi thập lục phân có ít nhất 8 ký tự.

---

### `scalar`

Suy luận JSON Schema từ một mẫu chuỗi duy nhất theo hướng thận trọng.

```typescript
function scalar(value: string, includeExample?: boolean): Schema; // default false
```

Suy luận `boolean`, `integer` với giới hạn độ dài để đảm bảo số nguyên an toàn, `number` hoặc `string` có `format` (`uuid`, `date`, `date-time`); nếu không phù hợp thì dùng `string` thông thường.

---

### `jsonSchema`

Suy luận JSON Schema từ bất kỳ giá trị JSON nào: đối tượng, mảng hoặc giá trị vô hướng.

```typescript
function jsonSchema(value: unknown, includeExample?: boolean): Schema; // default false
```

Đối tượng trở thành `{ type: "object", properties, required }`; mảng trở thành `{ type: "array", items }`, với `{}` cho mảng rỗng; giá trị vô hướng tuân theo quy tắc kiểu tương tự `scalar`.

---

### `mergeSchemas`

Hợp nhất cấu trúc của nhiều lược đồ mẫu. Gộp các thuộc tính đối tượng; thuộc tính vắng mặt trong bất kỳ mẫu nào trở thành tùy chọn. Xử lý mảng đệ quy; mở rộng `integer` thành `number`; chỉ giữ định dạng khi giống nhau trong mọi mẫu.

```typescript
function mergeSchemas(schemas: readonly Schema[]): Schema;
```

---

### `Schema`

Tập con cấu trúc của JSON Schema dùng cho nội dung và tham số được suy luận.

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

## Kiểu chuẩn và xác thực

### `validateOpenApi32`

Xác thực tài liệu OpenAPI theo lược đồ OpenAPI 3.2 qua `@powerduck/openapi-parser`.

```typescript
function validateOpenApi32(
  document: OpenApiDocument,
): Promise<ValidationOutcome>;

interface ValidationOutcome {
  valid: boolean;
  diagnostics: Diagnostic[];
}
```

Lỗi xác thực được ánh xạ thành chẩn đoán có mã `OAS_VALIDATION_ERROR`; lỗi của bộ xác thực dùng `OAS_VALIDATOR_FAILED`.

### `validateOpenApiDocument`

Bí danh chuẩn của [`validateOpenApi32`](#validateopenapi32). Các thư viện `@powerduck/*` phụ thuộc nên nhập tên ổn định này.

```typescript
import { validateOpenApiDocument } from "@powerduck/x-to-openapi";

const { valid, diagnostics } = await validateOpenApiDocument(doc);
```

### `OpenApiDocument`

Kiểu tài liệu OpenAPI 3.2 chuẩn, là bí danh của `Oas32Document` từ `@powerduck/openapi-parser`. Mọi thư viện `@powerduck/*` nên dùng kiểu này thay vì truy cập trực tiếp các gói kiểu bên thứ ba.

### `OpenApi32Document`

Bí danh của `OpenApiDocument` dành riêng cho phiên bản này.

---

## Kiểu

### `ConvertOptions`

Tất cả thiết lập chuyển đổi. Trường chưa được đặt dùng giá trị từ [`DEFAULT_OPTIONS`](#default_options).

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

| Tùy chọn | Kiểu | Mặc định | Mô tả |
|---|---|---|---|
| `openapiVersion` | `"3.2.0"` | `"3.2.0"` | Chỉ hỗ trợ `"3.2.0"`; giá trị khác sẽ ném lỗi. |
| `title` | `string` | `"Generated API"` | `info.title`. Không được để trống. |
| `version` | `string` | `"1.0.0"` | `info.version`. Không được để trống. |
| `description` | `string` | `""` | `info.description`. Bỏ qua khi trống. |
| `inferPathParameters` | `boolean` | `true` | Tham số hóa các đoạn thay đổi có dạng định danh. |
| `pathParameterMinSamples` | `number` | `2` | Số yêu cầu tối thiểu trong một nhóm trước khi tham số hóa. Phải là số nguyên dương. |
| `inferSecurity` | `boolean` | `true` | Tạo `securitySchemes` và `security` cho từng thao tác. |
| `includeCommonHeaders` | `boolean` | `false` | Bao gồm các tiêu đề phụ do trình duyệt tạo. Tiêu đề truyền tải luôn bị loại trừ. |
| `includeCookies` | `boolean` | `false` | Xuất cookie thành tham số. |
| `includeExamples` | `boolean` | `false` | Điền ví dụ của lược đồ và tham số từ các giá trị quan sát được. |
| `useServerBasePath` | `boolean` | `false` | Gộp tiền tố đường dẫn chung vào `servers[0].url` khi mọi yêu cầu có cùng origin. |
| `validate` | `boolean` | `true` | Xác thực tài liệu đầu ra. Lỗi xác thực trở thành chẩn đoán; chế độ nghiêm ngặt có thể chuyển chúng thành ngoại lệ. |
| `strict` | `boolean` | `false` | Ném `ConversionError` khi có bất kỳ chẩn đoán mức lỗi nào. |

`ResolvedConvertOptions` là `Required<ConvertOptions> & { openapiVersion: "3.2.0" }`.

---

### `ConvertResult`

Giá trị trả về của mỗi lần chuyển đổi.

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

Biểu diễn trung gian không phụ thuộc bộ điều hợp, do mọi bộ điều hợp tạo ra.

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

`DiagnosticCode` là kiểu hợp chuỗi gồm mọi mã mà khung xử lý có thể báo cáo:

`ADAPTER_PARSE_FAILED`, `CURL_PARSE_FAILED`, `CURL_EMPTY_INPUT`, `CURL_CAPABILITY_MISSING`, `CURL_BACKEND_JSON_FALLBACK`, `CURL_UNSUPPORTED_SCHEME`, `POSTMAN_INVALID_COLLECTION`, `POSTMAN_EMPTY_COLLECTION`, `POSTMAN_UNSUPPORTED_BODY_MODE`, `POSTMAN_VARIABLE_UNRESOLVED`, `BODY_JSON_INVALID`, `PATH_MERGE_CONFLICT`, `OPERATION_ID_COLLISION`, `PSEUDO_HEADER_DROPPED`, `MULTIPLE_SERVERS`, `NO_REQUESTS`, `OAS_VALIDATION_ERROR`, `OAS_VALIDATOR_FAILED`, `DISCOVERY_COMPONENT_NOT_FOUND`, `DISCOVERY_COMPONENT_NAME_COLLISION`, `DISCOVERY_PATH_PARAM_MISMATCH`, `DISCOVERY_MEDIA_WITHOUT_SCHEMA`, `DISCOVERY_RESPONSE_MISSING`, `DISCOVERY_SECURITY_SCHEME_MISSING`, `DISCOVERY_GAP`, `DISCOVERY_PATH_CONFLICT`.

---

### Các kiểu cốt lõi khác

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

## Chuyển đổi biểu diễn trung gian khám phá

### `discoveryToOpenApi`

Chuyển `DiscoveredProject` được cung cấp thành OpenAPI 3.2. Không tự quét tệp nguồn. Tuyến chưa phân giải tạo cảnh báo và không bao giờ được âm thầm thêm vào `paths`; vị trí nguồn và độ tin cậy vẫn có trong dự án trả về.

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

`allowGaps: false` nâng chẩn đoán thiếu sót của thao tác/lược đồ thành lỗi; đây không phải công tắc bật ngoại lệ chế độ nghiêm ngặt. Luôn kiểm tra `ok`, `documentValid` và `diagnostics`. Cảnh báo tuyến chưa phân giải được báo cáo riêng. Khi tắt xác thực, `documentValid` là đúng dù không chạy kiểm tra lược đồ.

### `buildDiscoveryOpenApi32`

Bộ dựng đồng bộ cấp thấp cho cùng biểu diễn trung gian. Báo cáo chẩn đoán qua callback được cung cấp và không xác thực tài liệu. Nên dùng hàm bao bất đồng bộ khi cần xác thực và đối tượng kết quả đầy đủ.

```typescript
function buildDiscoveryOpenApi32(
  project: DiscoveredProject,
  allowGaps: boolean,
  report: (diagnostic: Diagnostic) => void,
): OpenApiDocument;
```

Các kiểu khám phá được xuất từ điểm vào chính: `Confidence`, `GapCode`, `SourceLocation`, `JsonSchema`, `DiscoveredParameter`, `DiscoveredMediaType`, `DiscoveredRequestBody`, `DiscoveredResponse`, `DiscoveredOperation`, `DiscoveredComponent`, `DiscoveredSecurityScheme`, `DiscoveredServer`, `DiscoveredUnresolved`, `DiscoveredProject`, `DiscoveryOptions`, `DiscoveryResult`.

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

## Tóm tắt các thành phần xuất

| Ký hiệu | Loại |
|---|---|
| `curlToOpenApi` | hàm |
| `postmanToOpenApi` | hàm |
| `XToOpenApi` | lớp |
| `DEFAULT_OPTIONS` | hằng số |
| `AdapterRegistry` | lớp |
| `ConversionError` | lớp |
| `DiagnosticBag` | lớp |
| `CurlAdapter` | lớp |
| `splitCurlCommands` | hàm |
| `PostmanAdapter` | lớp |
| `PostmanTypes` | không gian tên |
| `buildOpenApi32` | hàm |
| `buildPathTemplates` | hàm |
| `looksLikeIdentifier` | hàm |
| `scalar` | hàm |
| `jsonSchema` | hàm |
| `mergeSchemas` | hàm |
| `Schema` | kiểu |
| `discoveryToOpenApi` | hàm |
| `buildDiscoveryOpenApi32` | hàm |
| `validateOpenApi32` | hàm |
| `validateOpenApiDocument` | hàm (bí danh) |
| `OpenApiDocument` | kiểu |
| `OpenApi32Document` | kiểu |
| `DiscoveredProject`, `DiscoveryOptions`, `DiscoveryResult` | các kiểu |
| `ConvertOptions`, `ConvertResult`, `NormalizedRequest`, `SourceAdapter`, `AdapterContext`, `Diagnostic`, `DiagnosticCode`, `Severity`, `Header`, `ParameterValue`, `FormField`, `BodyKind`, `RequestBody`, `RequestAuth`, `JsonObject`, `ResolvedConvertOptions` | các kiểu |
