---
sidebar_position: 4
title: "설정"
description: "@powerduck/openapi-codegen 생성 옵션: GenerateOptions, RequestIR, Generator 및 Plugin 인터페이스."
---

# 설정

별도 설정 파일은 없습니다. [`generate()`](/docs/ko-KR/openapi-codegen/api-reference/)에 전달하는 `GenerateOptions` 객체로 생성을 제어합니다.

## GenerateOptions

```ts
interface GenerateOptions {
  language: string;
  client: string;
  request?: RequestIR;
  document?: unknown;
  path?: string;
  method?: string;
  serverUrl?: string;
  securityValues?: Record<string, string>;
  softRefMode?: boolean;
}
```

| 옵션 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `language` | `string` | 예 | 대소문자를 구분하지 않는 대상 언어 식별자. 예: `"javascript"` |
| `client` | `string` | 예 | 대상 HTTP 클라이언트 식별자. 예: `"fetch"` |
| `request` | `RequestIR` | 둘 중 하나* | 이미 정규화된 요청. `normalize`를 건너뜁니다 |
| `document` | `unknown` | 둘 중 하나* | 파싱된 OpenAPI 문서 객체 |
| `path` | `string` | `document` 사용 시 | 정확한 OpenAPI 경로 템플릿. 예: `"/pets/{id}"` |
| `method` | `string` | `document` 사용 시 | HTTP 메서드. 예: `"get"` / `"post"` |
| `serverUrl` | `string` | 아니요 | 문서의 서버 URL을 덮어씁니다 |
| `securityValues` | `Record<string, string>` | 아니요 | 보안 스키마 이름을 키로 사용하는 인증 정보 |
| `softRefMode` | `boolean` | 아니요 | 잘못되거나 순환하는 `$ref`에서 오류를 발생시키지 않고 부분 값을 반환합니다 |

\* `request`만 제공하거나 `document` + `path` + `method`를 함께 제공해야 합니다. `request`가 있으면 `document`, `path`, `method`, `serverUrl`, `securityValues`, `softRefMode`는 무시됩니다.

### 입력 검증 오류

필수 입력이 없으면 `generate()`가 오류를 발생시킵니다.

- `TypeError: generate() requires an options object` — 옵션 객체가 없습니다.
- `Error: Unsupported generator: <language>/<client>` — 알 수 없는 조합입니다.
- `TypeError: generate() requires either a 'request' or a 'document' option`
- `TypeError: generate() requires a 'path' option when using 'document'`
- `TypeError: generate() requires a 'method' option when using 'document'`

`normalize()` 자체도 지원하지 않는 메서드, 누락된 `paths`, 알 수 없는 경로, 누락된 연산에 `Error`를 발생시키며, 문서가 객체가 아니면 `TypeError`를 발생시킵니다.

## RequestIR

코드 생성기에 종속되지 않는 정규화된 요청 표현입니다. 직접 만들어 `options.request`로 전달하면 `normalize`를 우회할 수 있습니다.

```ts
interface RequestIR {
  method: string;
  baseUrl: string;
  path: string;
  parameters: Parameter[];
  headers: Parameter[];
  body?: Body;
  security: Security[];
}
```

### Parameter

```ts
interface Parameter {
  name: string;
  in: ParameterLocation;
  value: unknown;
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
}

type ParameterLocation = "path" | "query" | "querystring" | "header" | "cookie";
```

### Body

```ts
interface Body {
  mediaType: string;
  value: unknown;
  encoding?: Record<string, unknown>;
}
```

### Security

```ts
interface Security {
  name: string;
  type: string;       // e.g. "apiKey" | "http"
  scheme?: string;    // e.g. "bearer" | "basic"
  in?: string;        // e.g. "header" | "query" | "cookie"
  paramName?: string;
  value: string;
}
```

### FileValue

Multipart 파일 자리표시자는 다음 표식 구조를 사용합니다.

```ts
interface FileValue {
  __file: true;
  path?: string;
  name?: string;
  contentType?: string;
  data?: string | ArrayBuffer | Uint8Array | Blob;
}
```

## Generator

이 인터페이스에 맞는 객체가 생성기입니다. 기본 생성기는 `createGenerator(language, client, emit)`로 만들지만, 사용자 생성기도 등록할 수 있습니다.

```ts
interface Generator {
  language: string;
  client: string;
  generate(request: RequestIR): string;
}
```

`generate`는 `RequestIR`을 받아 생성된 소스 코드를 문자열로 반환합니다.

## Plugin

플러그인은 `use()`를 통해 하나 이상의 생성기를 등록합니다.

```ts
interface Plugin {
  name: string;
  register(api: { register(generator: Generator): void }): void;
}
```

예제:

```typescript
import { use } from "@powerduck/openapi-codegen";

use({
  name: "my-plugin",
  register({ register }) {
    register({
      language: "mylang",
      client: "my-client",
      generate(request) {
        return `// ${request.method} ${request.path}`;
      },
    });
  },
});
```

## GenerateResult

이 타입은 여러 파일을 포함할 수 있는 향후 생성 결과를 위해 선언되어 있습니다. 현재 `generate()`는 여전히 `string`을 반환합니다.

```ts
interface GenerateResult {
  code: string;
  files?: Record<string, string>;
  metadata?: Record<string, unknown>;
}
```

## normalize 출력 구조

`normalize()`를 직접 호출하면([API 참조](/docs/ko-KR/openapi-codegen/api-reference/#normalizeoptions) 참고) `RequestIR`보다 조금 더 넓은 객체가 반환됩니다.

```ts
{
  preWarnings: string[];   // lightweight structural warnings
  method: string;          // uppercase
  baseUrl: string;
  path: string;
  parameters: NormalizedParameter[];
  headers: NormalizedParameter[];   // parameters filtered to in === "header"
  body?: { mediaType, value, encoding? };
  security: NormalizedSecurity[];
}
```

## 서버 URL 결정 순서

다음 중 비어 있지 않은 첫 값을 `baseUrl`로 사용합니다.

1. `options.serverUrl`
2. 연산의 `servers`
3. 경로 항목의 `servers`
4. 루트의 `servers`
5. 대체 값 `"https://example.com"`

서버의 `{variable}` 자리표시자는 `server.variables`의 `default`, 없으면 `example` 값을 URI 인코딩하여 채웁니다.
