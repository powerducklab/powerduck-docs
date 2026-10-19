---
sidebar_position: 4
title: "API 참조"
description: "@powerduck/openapi-codegen의 전체 API 문서입니다."
---

# API 참조

`@powerduck/openapi-codegen`의 전체 API 문서입니다.

## 최상위 함수

| 내보내기 | 시그니처 | 설명 |
|--------|-----------|-------------|
| `generate` | `(options: GenerateOptions) => string` | 한 연산의 실행 가능한 소스 코드를 생성 |
| `register` | `(generator: Generator) => void` | 사용자 정의 생성기를 등록 |
| `get` | `(language: string, client: string) => Generator \| undefined` | 생성기를 조회 |
| `list` | `() => Array<{ language: string; client: string }>` | 등록된 모든 생성기를 나열 |
| `use` | `(plugin: Plugin) => void` | 생성기를 등록하는 플러그인을 적용 |
| `registerBuiltins` | `() => void` | 모든 기본 생성기를 등록하며 가져올 때 자동 호출 |
| `normalize` | `(options) => NormalizedRequest` | 문서, 경로, 메서드를 정규화된 요청으로 변환 |
| `builtinGenerators` | `Generator[]` | 모든 기본 생성기 정의의 원본 배열 |

기본 생성기는 모듈을 불러올 때 자동 등록되므로 `registerBuiltins()`를 직접 호출할 필요는 없습니다.

## generate(options)

```ts
generate(options: GenerateOptions): string
```

생성된 소스 코드를 문자열로 반환합니다. `get(options.language, options.client)`로 생성기를 찾고, `options.request`가 없으면 `normalize({ document, path, method, serverUrl, securityValues, softRefMode })`를 호출한 뒤 `generator.generate(request)`를 호출합니다.

발생 가능한 오류:

- `options`가 객체가 아니거나 필수 입력이 없으면 `TypeError`.
- 알 수 없는 조합에는 `Error: Unsupported generator: <language>/<client>`.
- `normalize()` 오류: 알 수 없는 경로/메서드, 잘못된 문서, 잘못되거나 순환하는 `$ref`. 단, 참조 오류는 `softRefMode`가 켜져 있으면 허용됩니다.

전체 옵션 표는 [설정](/docs/ko-KR/openapi-codegen/configuration/#generateoptions)을 참고하세요.

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

`language\0client`를 키로 사용해 대소문자를 구분하지 않는 내부 저장소에 등록합니다.

## get(language, client)

```ts
const generator = get("javascript", "fetch");
```

`Generator`를 반환하며, 없으면 `undefined`를 반환합니다.

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

`plugin.register({ register })` 호출과 같습니다.

## registerBuiltins()

```ts
registerBuiltins();
```

내부 플래그로 보호되는 멱등 연산입니다. `builtinGenerators`의 모든 항목을 등록합니다.

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

`$ref`를 해석하고 경로/연산 매개변수를 병합하며, 본문 미디어 타입 선택, 예제 값 생성, 보안 처리 후 `baseUrl`을 계산합니다. 알 수 없는 경로/메서드와 지원하지 않는 메서드에서 오류가 발생합니다.

## 기본 생성기(21개 언어, 41개 클라이언트) {#built-in-generators-21-languages-41-clients}

`src/emitters/index.ts`에 등록된 정확한 `language` / `client` 식별자입니다. 조회는 대소문자를 구분하지 않으며 표에는 표준 표기를 기재했습니다.

| 언어 | `language` | `client` 값 |
|----------|-----------|-----------------|
| C | `c` | `libcurl` |
| C# | `csharp` | `httpclient`, `restsharp` |
| Clojure | `clojure` | `clj-http` |
| Dart | `dart` | `http` |
| F# | `fsharp` | `httpclient` |
| Go | `go` | `new-request` |
| HTTP 요청 파일 | `http` | `http1` |
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

합계: 21개 언어, 41개 조합.

> 생성기가 있다고 모든 클라이언트가 모든 연산을 표현할 수 있는 것은 아닙니다. 예를 들어 `shell/wget`은 임의의 `multipart/form-data` 요청을 안전하게 만들 수 없으므로 `shell/curl`이나 `shell/httpie`를 사용하세요.

## 핵심 타입

`./types`에서 다시 내보냅니다.

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

## 핵심 함수

모두 패키지 루트에서 다시 내보냅니다.

### refs

| 내보내기 | 설명 |
|--------|-------------|
| `RefResolver` | 문서 내부 `#/...` JSON Pointer 해석 클래스입니다. 생성자: `(root, softMode = false)`. 메서드: `deref(value)`, `resolveRef(ref)`, `clearCache()`. 공개 필드: `softMode`. `softMode`가 참이 아니면 외부/잘못된/순환 참조에서 오류를 발생시킵니다. |

### example

| 내보내기 | 설명 |
|--------|-------------|
| `example(schema, resolver, seen?, depth=0, ctx=default)` | JSON Schema에서 예제 값을 생성합니다. `example`, `enum`, `const`, `default`, `oneOf`/`anyOf`/`allOf`, 타입, 형식, 제약 조건을 따릅니다. |
| `ExampleGenContext` | `readOnly`/`writeOnly` 필터링을 제어하는 `{ isRequestBody: boolean; isResponse: boolean }` 타입. |
| `defaultExampleContext` | 기본값 `{ isRequestBody: false, isResponse: false }`. |

### serialize

| 내보내기 | 설명 |
|--------|-------------|
| `Pair` | `[string, string]` 타입. |
| `parameter(parameter)` | OpenAPI `style`/`explode` 규칙에 따라 매개변수 하나를 `Pair[]`로 직렬화합니다. form, spaceDelimited, pipeDelimited, label, matrix, simple, deepObject를 지원합니다. |
| `query(pairs)` | 쌍을 쿼리 문자열로 연결합니다. |
| `cookie(pairs)` | 쌍을 `Cookie` 헤더 값으로 연결합니다. |
| `headerValue(value)` | 헤더 값에서 CR/LF/NUL을 제거합니다. |

### generator

| 내보내기 | 설명 |
|--------|-------------|
| `createGenerator(language, client, emit)` | `emit(request) => string` 함수를 `Generator`로 감쌉니다. |
| `GeneratorEmitter` | `(request: RequestIR) => string` 타입. |

### registry

| 내보내기 | 설명 |
|--------|-------------|
| `registerGenerator(generator)` | 대소문자를 구분하지 않는 저장소에 삽입합니다. |
| `getGenerator(language, client)` | 저장소에서 읽습니다. |
| `listGenerators()` | `[{ language, client }, ...]`를 반환합니다. |

### plugin

| 내보내기 | 설명 |
|--------|-------------|
| `PluginApi` | `{ register(generator: Generator): void }` 타입. |
| `applyPlugin(plugin, api)` | `plugin.register(api)`를 호출합니다. |

### request

| 내보내기 | 설명 |
|--------|-------------|
| `CompiledRequest` | `{ url; headers: Array<[string,string]>; body?; queryPairs; cookiePairs }` 타입. |
| `compile(request)` | 경로 매개변수를 대입하고 query/header/cookie 쌍을 만들며 보안을 적용한 뒤 URL을 조합합니다. |
| `form(value)` | 객체를 `application/x-www-form-urlencoded` 문자열로 직렬화합니다. |

### helpers

자주 쓰는 유틸리티:

| 내보내기 | 설명 |
|--------|-------------|
| `isRecord(value)` | 일반 객체 타입 가드. |
| `isFileValue(value)` | `FileValue` 표식 타입 가드. |
| `firstDefined(...values)` | `undefined`가 아닌 첫 값. |
| `nonBlankString(value, fallback?)` | 양 끝 공백을 제거한 비어 있지 않은 문자열 또는 `undefined`/대체 값. |
| `normalizeMethod(method)` | 메서드를 대문자로 변환하며 기본값은 `GET`. |
| `supportsRequestBody(method)` | `GET`/`HEAD`이면 `false`. |
| `requiresRequestBody(method)` | `POST`/`PUT`/`PATCH`이면 `true`. |
| `mediaTypeOf(request, fallback)` | 본문 또는 Content-Type 헤더에서 유효한 미디어 타입을 구합니다. |
| `hasJsonBody(request)` | JSON 또는 `+json` 미디어 타입 여부. |
| `hasFormBody(request)` | `application/x-www-form-urlencoded`. |
| `hasMultipartBody(request)` | `multipart/form-data`. |
| `bodyText(request)` | 원본 본문 텍스트 또는 보기 좋게 정리한 JSON. |
| `toHeaderObject(headers)` | 쌍을 `Record<string,string>`으로 변환합니다. |
| `toKeyValueBody(value)` | Multipart 본문을 순서가 있는 필드 설명자로 펼칩니다. |
| `collectByLocation(request, location)` | OpenAPI 위치에 따라 매개변수를 필터링합니다. |
| `operationName(request)` | 메서드와 경로에서 snake_case 함수명/변수명을 도출합니다. |
| `sanitizeIdentifier(value)` | 임의 텍스트를 유효한 식별자로 변환합니다. |
| `indent(text, prefix="  ")` | 비어 있지 않은 모든 줄을 들여씁니다. |
| `stringifyLiteral(value)` | 안전한 대체 처리가 있는 정리된 JSON. |
| `kotlinValue(value)` / `formFieldValue(value)` | 리터럴/폼 필드용으로 값을 직렬화합니다. |
| `fileComment(path, fieldName)` | Multipart 자리표시자 경로에 대한 TODO 주석을 만듭니다. |
| `mergeAllOfSchemas(schemas, resolver)` | `allOf` 스키마를 얕게 병합합니다. |
| `lightweightOpenAPIPreCheck(doc)` | 문서의 구조적 경고를 반환합니다. |
| `browserHeaders(headers, multipart)` | 브라우저가 금지하는 헤더를 제거합니다. |
| `isBrowserForbiddenHeader(name)` | 브라우저 네트워크 API가 관리하는 헤더인지 확인합니다. |
| `escapeJs`, `escapePy`, `escapeSh`, `escapePhp`, `escapeRuby`, `escapePowerShell`, `escapeCSharp`, `escapeJava`, `escapeGo`, `escapeRust`, `escapeObjC`, `escapeSwift`, `escapeR`, `escapeOCaml`, `escapeFSharp`, `escapeClojure` | 언어별 문자열 리터럴 이스케이프 함수. |
| `assertIsRecord`, `assertIsString`, `assertIsNumber` | 런타임 어설션 가드. |
| `DEFAULT_FILE_PATH`, `DEFAULT_FILE_NAME`, `DEFAULT_BINARY_MEDIA_TYPE` | 파일 업로드 자리표시자용 상수. |
