---
sidebar_position: 4
title: "API 참조"
description: "@powerduck/x-to-openapi의 공개 진입점 참조입니다"
---

# API 참조

`@powerduck/x-to-openapi`의 공개 진입점 참조입니다. 아래 시그니처는 API를 요약한 것입니다. 전체 readonly 한정자와 가져오는 타입은 패키지의 TypeScript 선언을 확인하세요.

---

## 설정 없이 사용하는 도우미 함수

### `curlToOpenApi`

한 번의 호출로 변환합니다. [`CurlAdapter`](#curladapter)를 등록하고 [`convert`](#convertsource-input-options)를 호출합니다.

```typescript
function curlToOpenApi(
  input: string | readonly string[],
  options?: ConvertOptions,
): Promise<ConvertResult>;
```

| 매개변수 | 타입 | 설명 |
|---|---|---|
| `input` | `string \| readonly string[]` | curl 명령, 명령 배열 또는 브라우저의 “Copy all as cURL” 출력입니다. 여러 명령이 포함된 텍스트는 자동으로 분리됩니다. |
| `options` | `ConvertOptions` | 선택적 변환 설정입니다. |

**반환값:** [`ConvertResult`](#convertresult).

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  "curl -X POST https://api.example.com/users -H 'Content-Type: application/json' --data '{\"name\":\"Ada\"}'",
);
```

---

### `postmanToOpenApi`

한 번의 호출로 변환합니다. [`PostmanAdapter`](#postmanadapter)를 등록하고 파싱된 컬렉션 객체 또는 JSON 문자열을 변환합니다. 테스트 스크립트는 `x-postman-scripts`로 보존됩니다.

```typescript
function postmanToOpenApi(
  input: unknown,
  options?: ConvertOptions,
): Promise<ConvertResult>;
```

| 매개변수 | 타입 | 설명 |
|---|---|---|
| `input` | `unknown` | Postman Collection v2.0/v2.1.0 객체 또는 해당 JSON 문자열입니다. |
| `options` | `ConvertOptions` | 선택적 변환 설정입니다. |

**반환값:** [`ConvertResult`](#convertresult).

---

## 핵심 구조

### `XToOpenApi`

변환기 클래스입니다. [`AdapterRegistry`](#adapterregistry)를 보유하고 파싱 → 생성 → 검증 과정을 실행합니다.

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

어댑터를 등록합니다. 호출을 연결할 수 있도록 `this`를 반환합니다. 어댑터 `id`를 `/^[a-z][a-z0-9-]*$/`로 검증하고 `parse()` 메서드가 있는지 확인하며 중복 ID를 거부합니다.

#### `adapters()`

등록된 어댑터 ID를 `string[]`로 반환합니다.

#### `convert(source, input, options?)`

단일 진입점입니다.

| 매개변수 | 타입 | 설명 |
|---|---|---|
| `source` | `string` | 어댑터 ID(`"curl"`, `"postman"` 등) 또는 `canHandle()`로 선택하기 위한 `"auto"`입니다. |
| `input` | `unknown` | 원본 데이터입니다. 구조는 어댑터에 따라 다릅니다. |
| `options` | `ConvertOptions` | 선택적 변환 설정입니다. |

**동작:**

1. [`DEFAULT_OPTIONS`](#default_options)로 옵션을 보완하고 검증합니다.
2. 문자열 또는 배열에 포함된 문자열 요소의 총길이가 **10 × 1024 × 1024 JavaScript 코드 단위**를 초과하면 `ConversionError`로 거부합니다. UTF-8 바이트 제한이 아니며 파싱된 객체의 크기는 측정하지 않습니다.
3. 명시적 ID 또는 `"auto"` 감지로 어댑터를 선택합니다.
4. 입력을 `NormalizedRequest[]`로 파싱합니다. 파싱 실패는 진단 정보가 됩니다.
5. [`buildOpenApi32`](#buildopenapi32)로 OpenAPI 3.2 문서를 생성합니다.
6. `validate`가 `true`이면 [`validateOpenApi32`](#validateopenapi32)로 검증하고 결과 진단을 통합합니다.
7. [`ConvertResult`](#convertresult)를 반환합니다.

```typescript
import { XToOpenApi, CurlAdapter } from "@powerduck/x-to-openapi";

const converter = new XToOpenApi().register(new CurlAdapter());
const result = await converter.convert("curl", curlText, { title: "My API" });
```

---

### `DEFAULT_OPTIONS`

모든 [`ConvertOptions`](#convertoptions)와 병합되는 기본값입니다. `ResolvedConvertOptions`로 내보냅니다.

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

등록된 어댑터를 ID별로 저장합니다.

```typescript
class AdapterRegistry {
  register<I>(adapter: SourceAdapter<I>): this;
  has(id: string): boolean;
  get(id: string): SourceAdapter<unknown>;
  detect(input: unknown): SourceAdapter<unknown> | undefined;
  ids(): string[];
}
```

| 메서드 | 설명 |
|---|---|
| `register(adapter)` | ID를 `/^[a-z][a-z0-9-]*$/`로 검증하고 `parse()`를 확인하며 중복을 거부합니다. `this`를 반환합니다. |
| `has(id)` | 어댑터가 등록되어 있는지 확인합니다. |
| `get(id)` | 어댑터를 반환하거나 등록된 ID 목록을 포함한 오류를 발생시킵니다. |
| `detect(input)` | `canHandle()`이 입력을 수락하는 첫 어댑터를 반환합니다. 판별 함수가 던진 예외는 처리하고 해당 어댑터를 건너뜁니다. |
| `ids()` | 등록된 ID를 나열합니다. |

---

### `ConversionError`

`strict` 모드에서 오류 수준의 진단이 발생하거나, 입력 문자열이 너무 길거나, 어댑터 자동 선택에 실패하면 발생합니다. 사용 가능한 진단을 포함하며 목록이 비어 있을 수도 있습니다. 잘못된 옵션이나 등록 오류는 대신 `TypeError` 또는 `Error`를 발생시킬 수 있습니다.

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

[`XToOpenApi.convert`](#convertsource-input-options)가 사용하는 내부 수집기입니다. 중복 진단을 제거하고 `strict`가 `true`일 때 오류 수준 항목에 대해 `ConversionError`를 발생시킵니다.

```typescript
class DiagnosticBag {
  constructor(strict?: boolean); // default false
  report(diagnostic: Diagnostic): void;
  get items(): Diagnostic[];
  hasErrors(): boolean;
}
```

---

## 어댑터

### `CurlAdapter`

단일 curl 명령, 명령 묶음 또는 브라우저 내보내기를 `NormalizedRequest[]`로 변환합니다. `curlconverter`를 감싸고 출력을 정규화합니다.

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

- `canHandle`은 선택적 셸 프롬프트(`$`, `#`, `>`) 뒤에 `curl` 또는 `curl.exe`로 시작하는 문자열이나 배열의 첫 요소를 수락합니다.
- `parse`는 [`splitCurlCommands`](#splitcurlcommands)로 여러 명령을 분리하고, HTTP(S)가 아닌 URL을 건너뛰며, HTTP/2 의사 헤더를 제거하고, 본문과 쿠키를 파싱하여 인증을 추론합니다.

> `resolveBackend`, `availableExports`, `resetBackend`는 내부 통합 도우미이며 지원되는 패키지 내보내기가 아닙니다. 내부 파일 대신 공개 어댑터를 가져오세요.

---

### `splitCurlCommands`

브라우저의 “Copy all as cURL” 출력을 개별 명령으로 나눕니다. 작은따옴표와 큰따옴표, 역슬래시 및 캐럿(`^`) 줄 연속, CRLF, 셸 프롬프트(`$`, `#`, `>`, `PS C:\>`), `curl.exe`를 처리합니다.

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

Postman Collections v2.0/v2.1.0을 `NormalizedRequest[]`로 변환합니다. 중첩 폴더를 순회하고 항목 > 폴더 > 컬렉션 순서로 인증을 상속하며 본문 모드를 매핑하고 테스트 스크립트를 보존합니다.

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

- `canHandle`은 `info` 객체와 `item` 배열이 있는 객체 또는 파싱된 JSON 문자열을 수락합니다. v2.1.0 및 v2.0 스키마 URL과 스키마 URL을 생략한 구조적으로 유효한 컬렉션을 모두 허용합니다.
- 테스트 및 사전 요청 이벤트는 작업의 `x-postman-scripts`로 출력됩니다.

---

### `PostmanTypes`

어댑터에서 사용하는 모든 Postman 컬렉션 타입을 포함하는 네임스페이스입니다.

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

주요 멤버: `PostmanCollection`, `PostmanInfo`, `PostmanVersion`, `PostmanItem`, `PostmanFolder`, `PostmanRequestItem`, `PostmanRequest`, `PostmanHeader`, `PostmanUrl`, `PostmanQueryParam`, `PostmanBodyMode`, `PostmanBody`, `PostmanUrlEncodedParam`, `PostmanFormDataParam`, `PostmanFileParam`, `PostmanGraphQLBody`, `PostmanAuthType`, `PostmanAuth`, `PostmanAuthParam`, `PostmanEvent`, `PostmanScript`, `PostmanVariable`, `PostmanDescription`, `isFolder`, `isRequestItem`.

---

## OpenAPI 생성 구성 요소

### `buildOpenApi32`

저수준 빌더입니다. 정규화된 요청 배열에서 OpenAPI 3.2 문서를 생성합니다. 일반적으로 [`XToOpenApi.convert`](#convertsource-input-options)를 통해 간접 호출합니다.

```typescript
function buildOpenApi32(
  requests: readonly NormalizedRequest[],
  options: ResolvedConvertOptions,
  report: (diagnostic: Diagnostic) => void,
): OpenApiDocument;
```

경로와 메서드로 작업을 묶고 쿼리·헤더·쿠키·경로 매개변수를 수집하며 본문 스키마를 병합합니다. `securitySchemes`를 생성하고 비표준 메서드를 `additionalOperations`에 넣으며 `operationId`/`tags`를 지정합니다.

---

### `buildPathTemplates`

같은 구조의 요청을 묶고, 최소 `minSamples`개의 표본에서 값이 달라지며 모든 표본에서 식별자로 보이는 세그먼트를 템플릿화합니다.

```typescript
function buildPathTemplates(
  requests: readonly NormalizedRequest[],
  minSamples: number,
  enabled: boolean,
): Map<number, PathTemplate>;
```

`sourceIndex`를 키로 사용하는 맵을 반환합니다. 각 `PathTemplate`에는 다음 항목이 있습니다.

```typescript
interface PathTemplate {
  readonly path: string;                    // e.g. "/users/{userId}"
  readonly parameters: ReadonlyMap<number, string>; // segment index → name
}
```

`enabled`가 `false`이면 각 요청에 원래 경로명과 동일한 정적 템플릿을 지정합니다.

---

### `looksLikeIdentifier`

어떤 세그먼트를 템플릿화할 수 있는지 판단하는 단일 기준입니다.

```typescript
function looksLikeIdentifier(segment: string): boolean;
```

세그먼트가 숫자로만 이루어져 있거나 UUID, ULID 또는 8자 이상의 16진수 문자열이면 `true`를 반환합니다.

---

### `scalar`

하나의 문자열 표본에서 JSON Schema를 보수적으로 추론합니다.

```typescript
function scalar(value: string, includeExample?: boolean): Schema; // default false
```

`boolean`, 안전한 정수를 위한 길이 제한이 있는 `integer`, `number`, 또는 `format`(`uuid`, `date`, `date-time`)이 있는 `string`을 추론합니다. 나머지는 일반 `string`입니다.

---

### `jsonSchema`

임의의 JSON 값(객체, 배열, 스칼라)에서 JSON Schema를 추론합니다.

```typescript
function jsonSchema(value: unknown, includeExample?: boolean): Schema; // default false
```

객체는 `{ type: "object", properties, required }`, 배열은 `{ type: "array", items }`가 됩니다. 빈 배열에는 `{}`를 사용하며 스칼라는 `scalar`와 유사한 타입 규칙을 따릅니다.

---

### `mergeSchemas`

여러 표본 스키마를 구조적으로 병합합니다. 객체 속성을 합치고 어느 한 표본에서라도 누락된 속성은 선택 사항으로 만듭니다. 배열은 재귀 처리하며 `integer`를 `number`로 확장합니다. 형식은 모든 표본에서 동일할 때만 유지합니다.

```typescript
function mergeSchemas(schemas: readonly Schema[]): Schema;
```

---

### `Schema`

추론한 본문과 매개변수에 사용하는 JSON Schema의 구조적 부분집합입니다.

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

## 표준 타입과 검증

### `validateOpenApi32`

`@powerduck/openapi-parser`를 통해 OpenAPI 문서를 OpenAPI 3.2 스키마로 검증합니다.

```typescript
function validateOpenApi32(
  document: OpenApiDocument,
): Promise<ValidationOutcome>;

interface ValidationOutcome {
  valid: boolean;
  diagnostics: Diagnostic[];
}
```

검증 오류는 `OAS_VALIDATION_ERROR` 코드의 진단으로, 검증기 자체의 실패는 `OAS_VALIDATOR_FAILED`로 변환됩니다.

### `validateOpenApiDocument`

[`validateOpenApi32`](#validateopenapi32)의 표준 별칭입니다. 이를 사용하는 `@powerduck/*` 라이브러리는 이 안정적인 이름을 가져와야 합니다.

```typescript
import { validateOpenApiDocument } from "@powerduck/x-to-openapi";

const { valid, diagnostics } = await validateOpenApiDocument(doc);
```

### `OpenApiDocument`

표준 OpenAPI 3.2 문서 타입으로, `@powerduck/openapi-parser`의 `Oas32Document`에 대한 별칭입니다. 모든 `@powerduck/*` 라이브러리는 외부 타입 패키지를 직접 참조하는 대신 이 타입을 사용해야 합니다.

### `OpenApi32Document`

`OpenApiDocument`의 버전별 별칭입니다.

---

## 타입

### `ConvertOptions`

모든 변환 설정입니다. 지정하지 않은 필드는 [`DEFAULT_OPTIONS`](#default_options)의 값을 사용합니다.

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

| 옵션 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `openapiVersion` | `"3.2.0"` | `"3.2.0"` | `"3.2.0"`만 지원하며 다른 값은 오류를 발생시킵니다. |
| `title` | `string` | `"Generated API"` | `info.title`. 비워 둘 수 없습니다. |
| `version` | `string` | `"1.0.0"` | `info.version`. 비워 둘 수 없습니다. |
| `description` | `string` | `""` | `info.description`. 비어 있으면 생략합니다. |
| `inferPathParameters` | `boolean` | `true` | 식별자처럼 보이는 가변 세그먼트를 템플릿화합니다. |
| `pathParameterMinSamples` | `number` | `2` | 템플릿화에 필요한 그룹 내 최소 요청 수입니다. 양의 정수여야 합니다. |
| `inferSecurity` | `boolean` | `true` | `securitySchemes`와 작업별 `security`를 생성합니다. |
| `includeCommonHeaders` | `boolean` | `false` | 브라우저가 부가적으로 생성하는 헤더를 포함합니다. 전송 헤더는 항상 제외합니다. |
| `includeCookies` | `boolean` | `false` | 쿠키를 매개변수로 출력합니다. |
| `includeExamples` | `boolean` | `false` | 관측된 값으로 스키마와 매개변수 예제를 채웁니다. |
| `useServerBasePath` | `boolean` | `false` | 모든 요청의 출처가 같으면 공통 경로 접두사를 `servers[0].url`에 통합합니다. |
| `validate` | `boolean` | `true` | 출력 문서를 검증합니다. 검증 오류는 진단 정보가 되며 엄격 모드에서는 예외가 될 수 있습니다. |
| `strict` | `boolean` | `false` | 오류 수준의 진단이 있으면 `ConversionError`를 발생시킵니다. |

`ResolvedConvertOptions`는 `Required<ConvertOptions> & { openapiVersion: "3.2.0" }`입니다.

---

### `ConvertResult`

각 변환의 반환값입니다.

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

모든 어댑터가 생성하는 어댑터 독립적인 중간 표현입니다.

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

`DiagnosticCode`는 프레임워크가 보고할 수 있는 모든 코드의 문자열 유니온 타입입니다.

`ADAPTER_PARSE_FAILED`, `CURL_PARSE_FAILED`, `CURL_EMPTY_INPUT`, `CURL_CAPABILITY_MISSING`, `CURL_BACKEND_JSON_FALLBACK`, `CURL_UNSUPPORTED_SCHEME`, `POSTMAN_INVALID_COLLECTION`, `POSTMAN_EMPTY_COLLECTION`, `POSTMAN_UNSUPPORTED_BODY_MODE`, `POSTMAN_VARIABLE_UNRESOLVED`, `BODY_JSON_INVALID`, `PATH_MERGE_CONFLICT`, `OPERATION_ID_COLLISION`, `PSEUDO_HEADER_DROPPED`, `MULTIPLE_SERVERS`, `NO_REQUESTS`, `OAS_VALIDATION_ERROR`, `OAS_VALIDATOR_FAILED`, `DISCOVERY_COMPONENT_NOT_FOUND`, `DISCOVERY_COMPONENT_NAME_COLLISION`, `DISCOVERY_PATH_PARAM_MISMATCH`, `DISCOVERY_MEDIA_WITHOUT_SCHEMA`, `DISCOVERY_RESPONSE_MISSING`, `DISCOVERY_SECURITY_SCHEME_MISSING`, `DISCOVERY_GAP`, `DISCOVERY_PATH_CONFLICT`.

---

### 기타 핵심 타입

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

## Discovery IR 변환

### `discoveryToOpenApi`

전달받은 `DiscoveredProject`를 OpenAPI 3.2로 변환합니다. 소스 파일을 직접 스캔하지는 않습니다. 해석되지 않은 경로는 경고를 생성하며 알림 없이 `paths`에 추가되지 않습니다. 소스 위치와 신뢰도는 반환된 프로젝트에서 계속 확인할 수 있습니다.

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

`allowGaps: false`는 작업 및 스키마의 누락 진단을 오류로 격상합니다. 엄격 모드 예외를 활성화하는 스위치는 아닙니다. 항상 `ok`, `documentValid`, `diagnostics`를 확인하세요. 해석되지 않은 경로 경고는 별도로 보고합니다. 검증을 끄면 스키마 검증 없이도 `documentValid`가 참입니다.

### `buildDiscoveryOpenApi32`

동일한 중간 표현을 위한 저수준 동기 빌더입니다. 전달된 콜백으로 진단을 보고하며 문서 검증은 수행하지 않습니다. 검증과 완전한 결과 객체가 필요하면 비동기 래퍼를 사용하세요.

```typescript
function buildDiscoveryOpenApi32(
  project: DiscoveredProject,
  allowGaps: boolean,
  report: (diagnostic: Diagnostic) => void,
): OpenApiDocument;
```

주 진입점에서 내보내는 Discovery 타입: `Confidence`, `GapCode`, `SourceLocation`, `JsonSchema`, `DiscoveredParameter`, `DiscoveredMediaType`, `DiscoveredRequestBody`, `DiscoveredResponse`, `DiscoveredOperation`, `DiscoveredComponent`, `DiscoveredSecurityScheme`, `DiscoveredServer`, `DiscoveredUnresolved`, `DiscoveredProject`, `DiscoveryOptions`, `DiscoveryResult`.

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

## 내보내기 요약

| 기호 | 종류 |
|---|---|
| `curlToOpenApi` | 함수 |
| `postmanToOpenApi` | 함수 |
| `XToOpenApi` | 클래스 |
| `DEFAULT_OPTIONS` | 상수 |
| `AdapterRegistry` | 클래스 |
| `ConversionError` | 클래스 |
| `DiagnosticBag` | 클래스 |
| `CurlAdapter` | 클래스 |
| `splitCurlCommands` | 함수 |
| `PostmanAdapter` | 클래스 |
| `PostmanTypes` | 네임스페이스 |
| `buildOpenApi32` | 함수 |
| `buildPathTemplates` | 함수 |
| `looksLikeIdentifier` | 함수 |
| `scalar` | 함수 |
| `jsonSchema` | 함수 |
| `mergeSchemas` | 함수 |
| `Schema` | 타입 |
| `discoveryToOpenApi` | 함수 |
| `buildDiscoveryOpenApi32` | 함수 |
| `validateOpenApi32` | 함수 |
| `validateOpenApiDocument` | 함수(별칭) |
| `OpenApiDocument` | 타입 |
| `OpenApi32Document` | 타입 |
| `DiscoveredProject`, `DiscoveryOptions`, `DiscoveryResult` | 타입 |
| `ConvertOptions`, `ConvertResult`, `NormalizedRequest`, `SourceAdapter`, `AdapterContext`, `Diagnostic`, `DiagnosticCode`, `Severity`, `Header`, `ParameterValue`, `FormField`, `BodyKind`, `RequestBody`, `RequestAuth`, `JsonObject`, `ResolvedConvertOptions` | 타입 |
