---
sidebar_position: 4
title: "구성"
description: "구성은 클라이언트/디버거 팩터리 옵션, prepare()와 send()에 전달하는 SendOptions 객체, 프로토콜별 옵션의 세 계층으로 나뉩니다."
---

# 구성

구성은 클라이언트/디버거 팩터리 옵션, `prepare()`와 `send()`에 전달하는 `SendOptions` 객체, 프로토콜별 옵션의 세 계층으로 나뉩니다.

## 팩터리 옵션

### `CreateClientOptions`

`createClient(options?)`에 전달합니다. 모든 필드는 선택 사항입니다.

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `writeBack` | `WriteBackOptions` | 응답을 명세에 병합하는 방식을 제어합니다 |
| `response` | `ToResponseOptions` | 응답 객체의 정규화 방식을 제어합니다 |

```typescript
import { createClient } from "@powerduck/openapi-request";

const client = createClient({
  writeBack: {
    overwriteExamples: true,
    // ... other WriteBackOptions
  },
  response: {
    includeExamples: false,
    // ... other ToResponseOptions
  },
});
```

### `DebuggerOptions`

`createDebugger(config?)`에 전달합니다. 모든 필드는 선택 사항입니다.

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `adapters` | `ProtocolAdapter[]` | 사용자 정의 어댑터 목록(기본 어댑터 전체를 대체) |
| `extraAdapters` | `ProtocolAdapter[]` | 기본 레지스트리에 추가할 어댑터 |
| `writeBack` | `WriteBackOptions` | 명세 반영 옵션 |
| `response` | `ToResponseOptions` | 응답 정규화 옵션 |
| `writeBackTruncated` | `boolean` | 잘린 스트림에서 추론한 스키마를 반영합니다(기본값: `true`) |

```typescript
import { createDebugger, HttpAdapter, WebSocketAdapter } from "@powerduck/openapi-request";

// Use only HTTP and WebSocket adapters
const debugger1 = createDebugger({
  adapters: [new HttpAdapter(), new WebSocketAdapter()],
});

// Add a custom adapter to the defaults
const debugger2 = createDebugger({
  extraAdapters: [new MyCustomAdapter()],
  writeBackTruncated: true,
});
```

### 명세 반영과 캡처된 예제

`WriteBackOptions`는 `strategy`(`"merge"` 또는 `"replace"`, 기본값 `"merge"`), `keepExistingDescription`(기본값 `true`), `allowedStatusCodes`(비어 있으면 모든 코드), `protectComponentRefs`(기본값 `true`), `overwriteExamples`(기본값 `true`), `requirePassingTests`를 지원합니다. 전송 파이프라인은 테스트 통과 조건을 적용하지만, `writeBackResponse`를 직접 호출하면 이 조건을 적용하지 않습니다.

`ToResponseOptions`는 `includeExamples`(기본값 `true`), `maxExampleChars`(기본값 `4000`), `maxEventPreviewChars`(기본값 `200`)를 지원합니다. 실제 응답에는 자격 증명이나 개인 정보가 포함될 수 있으므로 예제 캡처를 비활성화하거나 게시 전에 검토하세요.

전송 파이프라인은 보통 수정된 복사본을 `patchedSpec`으로 반환합니다. 입력 문서를 변경하거나 파일을 저장하지는 않습니다. 이 단계를 건너뛰려면 호출별로 `writeBack: false`를 설정하세요. 팩터리의 `writeBack` 객체는 병합 방식을 구성하고, 호출별 불리언 값은 반영 여부를 제어합니다.

## `SendOptions`

`prepare()`와 `send()`의 기본 입력 객체입니다. 명세, 대상, 값과 요청 단위의 모든 구성을 전달합니다.

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `spec` | `OpenApiDocument` | 예 | 완전한 OpenAPI 3.2 문서 |
| `target` | `OperationTarget` | 예 | 작업 식별자(아래 참조) |
| `values` | `RequestValues` | 아니요 | 경로/쿼리/헤더/쿠키/본문에 사용할 실제 값 |
| `serverUrl` | `string` | 아니요 | `spec.servers[0].url`을 재정의합니다 |
| `serverVariables` | `Record<string, string>` | 아니요 | 서버 URL 템플릿 변수 |
| `variables` | `Record<string, string>` | 아니요 | `{{name}}`으로 참조하는 환경 변수 |
| `globals` | `Record<string, string>` | 아니요 | Postman 방식의 전역 변수 |
| `localVariables` | `Record<string, string>` | 아니요 | 로컬 변수 |
| `collectionVariables` | `Record<string, string>` | 아니요 | 컬렉션 단위 변수 |
| `auth` | `AuthConfig` | 아니요 | 인증 구성 |
| `scripts` | `ScriptConfig` | 아니요 | 요청 전 스크립트와 테스트 스크립트 |
| `runner` | `RuntimeRunOptions` | 아니요 | postman-runtime 옵션 전체를 직접 전달합니다(최우선 적용) |
| `websocket` | `WebSocketOptions` | 아니요 | WebSocket 전용 옵션 |
| `graphql` | `GraphQLOptions` | 아니요 | GraphQL 전용 옵션 |
| `mcp` | `McpOptions` | 아니요 | MCP 전용 옵션 |
| `grpc` | `any` | 아니요 | gRPC 전용 옵션 |
| `timeout` | `number` | 아니요 | 요청별 제한 시간(밀리초, `runner.timeout.request`의 편의 옵션) |

`SendOptions`는 다음 실행 및 스트리밍 제어 옵션도 받습니다.

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `fetch` | `typeof fetch` | 지원되는 경우 호스트가 제공하는 격리된 fetch 전송을 사용합니다. HTTP/SSE는 계속 postman-runtime을 사용합니다. |
| `writeBack` | `boolean` | `false`로 설정하면 `responseFragment`는 생성하지만 `patchedSpec`은 undefined로 유지합니다. |
| `signal` | `AbortSignal` | 실행 또는 샘플링을 취소합니다. 부분 결과가 반환될 수도 있습니다. |
| `maxEvents` | `number` | 유지할 스트리밍 이벤트의 최대 개수. |
| `maxStreamMs` | `number` | 스트리밍 샘플링의 최대 시간(밀리초). |
| `maxResponseSize` | `number` | 응답 크기 제한(바이트). |
| `maxBufferChars` | `number` | 이벤트 경계에 도달하기 전 SSE 파서의 버퍼 제한. 기본값은 `4194304`자입니다. |
| `maxEventChars` | `number` | SSE 이벤트별로 유지할 데이터의 크기 제한. 기본값은 `1048576`자입니다. |
| `inheritEventId` | `boolean` | SSE 이벤트 ID가 없으면 마지막 ID를 이어받습니다. 기본값은 `true`입니다. 더 엄격하게 스키마를 추론하려면 `false`로 설정하세요. |
| `onEvent` | `(event: StreamEvent) => void` | 스트리밍 이벤트를 수신합니다. |
| `onConsole` | `(log: ConsoleLog) => void` | 스크립트 콘솔 출력을 수신합니다. |
| `onAssertion` | `(assertion: AssertionResult) => void` | 어설션 결과를 수신합니다. |
| `onResponseStart` | `(info: ResponseStartInfo) => void` | 초기 HTTP/SSE 헤더와 `streaming` 분류를 확인합니다. |
| `onOpen` | `(info) => void` | WebSocket 연결의 URL, 프로토콜, 헤더를 수신합니다. |

프로토콜 어댑터마다 제한값을 해석하는 방식이 다를 수 있습니다. UI 콜백은 가볍게 유지하세요. 콜백에서 발생한 예외는 실행 계층에서 처리합니다. HTTP 요청 설정에는 `runner.requester`를 사용하며, `maxResponseSize`를 지정한다면 0이 아닌 양수여야 합니다.

### `OperationTarget`

하나의 작업을 식별합니다. `operationId` 또는 `method` + `path` 중 한 방식을 사용하세요. 둘 다 지정하면 `operationId`가 우선합니다.

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `operationId` | `string` | 대체 조회 키. 경로와 메서드보다 우선합니다 |
| `method` | `string` | 대소문자를 구분하지 않는 HTTP 메서드. `path`가 필요합니다. |
| `path` | `string` | `/users/{id}` 같은 템플릿 경로. `method`가 필요합니다. |

```typescript
// By operationId (recommended)
const result1 = await client.send({
  spec,
  target: { operationId: "getUserById" },
});

// By method + path
const result2 = await client.send({
  spec,
  target: { method: "GET", path: "/users/{id}" },
});
```

### `RequestValues`

생성된 요청에 주입할 실제 값입니다.

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `path` | `Record<string, unknown>` | 경로 매개변수 값 |
| `query` | `Record<string, unknown>` | 쿼리 매개변수 값 |
| `header` | `Record<string, unknown>` | 헤더 값 |
| `cookie` | `Record<string, unknown>` | 쿠키 값 |
| `querystring` | `string` | 미리 인코딩한 원시 쿼리 문자열(OpenAPI 3.2의 `querystring` 위치) |
| `body` | `unknown` | 요청 본문 |
| `contentType` | `string` | 작업이 여러 요청 미디어 타입을 선언한 경우 특정 타입을 강제 지정합니다 |

```typescript
const result = await client.send({
  spec,
  target: { operationId: "updateUser" },
  values: {
    path: { id: "42" },
    query: { version: "2" },
    header: { "X-Request-Id": "abc-123" },
    body: { name: "Alice", email: "alice@example.com" },
    contentType: "application/json",
  },
});
```

### `AuthConfig`

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `type` | `AuthConfig["type"]` | 인증 유형 |
| `token` | `string` | Bearer 토큰(`type: "bearer"`용) |
| `username` | `string` | Basic 인증 사용자 이름(`type: "basic"`용) |
| `password` | `string` | Basic 인증 비밀번호(`type: "basic"`용) |
| `key` | `string` | API 키 이름(`type: "apikey"`용) |
| `value` | `string` | API 키 값(`type: "apikey"`용) |
| `in` | `"header" \| "query"` | API 키 위치(`type: "apikey"`용) |

```typescript
// Bearer token
const result1 = await client.send({
  spec,
  target: { operationId: "getUser" },
  auth: { type: "bearer", token: "your-jwt-token" },
});

// Basic auth
const result2 = await client.send({
  spec,
  target: { operationId: "getUser" },
  auth: { type: "basic", username: "admin", password: "secret" },
});

// API key in header
const result3 = await client.send({
  spec,
  target: { operationId: "getUser" },
  auth: { type: "apikey", key: "X-API-Key", value: "key-123", in: "header" },
});
```

고급 인증 유형에는 `digest`, `oauth1`, `oauth2`, `jwt`, `hawk`, `aws4`, `ntlm`, `asap`, `edgegrid`가 있습니다. HTTP/SSE/GraphQL용 Postman 인증 도우미 필드는 `parameters: Record<string, string | boolean | number>`로 전달합니다. 선택 사항인 `oauth2: OAuth2FlowConfig`는 OAuth 2.0 유형에서 토큰 획득과 갱신을 활성화합니다. 모든 인증 도우미가 모든 프로토콜에 적용된다고 가정하지 마세요.

### `ScriptConfig`

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `collectionPreRequest` | `ScriptSource \| ScriptSource[]` | 컬렉션 단위 요청 전 스크립트 |
| `collectionTest` | `ScriptSource \| ScriptSource[]` | 컬렉션 단위 테스트 스크립트 |
| `preRequest` | `ScriptSource \| ScriptSource[]` | 요청 단위 요청 전 스크립트 |
| `test` | `ScriptSource \| ScriptSource[]` | 요청 단위 테스트 스크립트 |
| `fromSpecExtensions` | `boolean` | 명세에서 `x-postman-scripts`를 읽습니다(기본값: `true`) |
| `captureLastResponse` | `boolean` | 마지막 응답을 후속 요청에서 사용할 수 있게 하는 내장 도우미를 추가합니다 |

`ScriptSource`:
```typescript
interface ScriptSource {
  exec: string | string[];  // Script body, either a single string or array of lines
  id?: string;               // Optional identifier surfaced in script results
}
```

가져온 명세에 포함된 스크립트를 실행할 의도가 없다면 `scripts.fromSpecExtensions: false`를 설정하세요. 현재 기본값은 `true`입니다. 향후 기본값이 바뀔 것이라고 기대하지 마세요.

## 프로토콜별 옵션

### HTTP / SSE

HTTP가 기본 어댑터입니다. 선언된 `text/event-stream` 콘텐츠는 SSE 사용 의도를 나타내며, 실행 중 헤더를 받으면 실제 응답도 분류합니다. `probeStreamingResponse()`는 별도로 명시적으로 실행하는 탐지 함수이며, 모든 호출에 자동으로 선행하는 단계가 아닙니다.

기본 HTTP 요청에는 추가 구성이 필요하지 않습니다. 고급 postman-runtime 구성에는 `SendOptions.runner`를 사용하세요.

### WebSocket

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "websocket",
  url: "wss://api.example.com/ws",
  // Manual-session options are distinct from SendOptions.websocket.
});
```

### MCP

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "mcp",
  endpoint: "https://api.example.com/mcp",
});
```

기본 MCP 수동 세션은 Streamable HTTP와 `endpoint`를 사용합니다. stdio를 사용하려면 `kind: "mcp"`, `transport: "stdio"`, 로컬 `command`와 선택적 `args`를 전달하세요. 세션을 시작하면 지정된 프로세스가 실행됩니다.

### gRPC

gRPC에는 주소, 설명자 소스(`.proto` 파일 또는 서버 리플렉션), 정규화된 전체 서비스 이름과 메서드가 필요합니다.

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "grpc",
  address: "localhost:50051",
  service: "powerduck.examples.Echo",
  method: "Echo",
  protoPaths: ["./echo.proto"],
});
```

수동 세션 팩터리는 아직 열리지 않은 세션을 반환합니다. 전송 전에 `open()`을 호출하고 정리할 때 `close()`를 호출하세요. gRPC 예제에는 일치하는 로컬 서버와 proto 파일이 필요합니다. 수동 세션 옵션은 `SendOptions.grpc`와 다른 객체입니다.

## 전체 예제

```typescript
import { createClient } from "@powerduck/openapi-request";

const client = createClient({
  writeBack: { overwriteExamples: true },
});

const result = await client.send({
  spec: openApiDocument,
  target: { operationId: "updateUser" },
  values: {
    path: { id: "42" },
    query: { verbose: "true" },
    header: { "X-Request-Id": "req-abc" },
    body: { name: "Alice", email: "alice@example.com" },
  },
  serverUrl: "https://api.staging.example.com",
  auth: { type: "bearer", token: "staging-token" },
  timeout: 10000,
  variables: {
    environment: "staging",
  },
});

console.log(result.response.status);
console.log(result.response.body);
console.log(result.response.headers);
```

## 다음 단계

- 내보낸 모든 타입은 [API 참조](./api-reference.md)를 확인하세요
- 프로토콜별 사용 방법은 [예제](./examples.md)를 살펴보세요
