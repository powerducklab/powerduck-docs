---
sidebar_position: 5
title: "API 참조"
description: "@powerduck/openapi-request의 주요 통합 API 참조입니다"
---

# API 참조

`@powerduck/openapi-request`의 주요 통합 API 참조입니다. 표는 인터페이스 계약을 요약하며, 모든 오버로드와 선택적 매개변수는 패키지의 TypeScript 선언을 기준으로 합니다. 기본 진입점과 프로토콜별 하위 경로에서 내보내는 항목은 완전히 같지 않습니다.

## 핵심 API

### `createClient(options?): ProtoClient`

UI 중심 클라이언트를 생성합니다. `options` 인수는 선택 사항입니다.

**매개변수:**

| 이름 | 타입 | 설명 |
| --- | --- | --- |
| `options` | `CreateClientOptions` | 선택적 구성 |
| `options.writeBack` | `WriteBackOptions` | 응답을 명세에 병합하는 방식을 제어합니다 |
| `options.response` | `ToResponseOptions` | 응답 객체의 정규화 방식을 제어합니다 |

**반환값:** 다음 메서드를 제공하는 `ProtoClient`:

| 메서드 | 시그니처 | 설명 |
| --- | --- | --- |
| `prepare` | `(sendOptions: SendOptions) => PreparedRequest` | 요청을 계획하고 프로토콜, 표시 모드, 스트림 종류를 반환합니다 |
| `send` | `(sendOptions: SendOptions) => Promise<SendResult>` | 요청을 실행합니다 |
| `sendMany` | `(spec, targets, shared?) => Promise<SendManyResult>` | 대상별 결과를 반환하며 일괄 실행합니다. 한 요청이 실패해도 다른 결과를 버리지 않습니다 |
| `connect` | `(connectOptions: ManualSessionOptions) => AnyManualSession` | 아직 열리지 않은 websocket/mcp/grpc 세션을 생성합니다. 연결하려면 `open()`을 호출하세요 |
| `discover` | `(discoverOptions) => Promise<any>` | MCP와 gRPC 기능을 탐색합니다 |
| `writeback` | `(spec, prepared, result, writeOptions?) => OpenApiDocument` | 관찰된 응답을 문서에 병합합니다 |
| `dispose` | `() => void` | 현재는 아무 작업도 하지 않습니다. 호출자가 세션을 직접 닫아야 합니다 |
| `probeStreamingResponse` | `(input: RequestInfo \| URL, init?: RequestInit) => Promise<{ ok: boolean; status: number; contentType?: string; kind: "none" \| "sse" \| "ndjson" \| "chunked"; response: Response }>` | fetch 요청을 실행하고 응답을 분류합니다. 반환된 응답 본문은 읽거나 취소해야 합니다 |

**예제:**

```typescript
import { createClient } from "@powerduck/openapi-request";

const client = createClient({
  writeBack: { overwriteExamples: true },
});

const plan = client.prepare({
  spec,
  target: { operationId: "getUserById" },
});

const result = await client.send({
  spec,
  target: { operationId: "getUserById" },
  values: { path: { id: "42" } },
});
```

### `createDebugger(config?): ProtoKit`

자동화, 스크립트, CI를 위한 스크립트형 디버거를 생성합니다.

**매개변수:**

| 이름 | 타입 | 설명 |
| --- | --- | --- |
| `config` | `DebuggerOptions` | 선택적 구성 |
| `config.adapters` | `ProtocolAdapter[]` | 기본 어댑터를 대체하는 사용자 정의 어댑터 목록 |
| `config.extraAdapters` | `ProtocolAdapter[]` | 기본 목록에 추가할 어댑터 |
| `config.writeBack` | `WriteBackOptions` | 명세 반영 옵션 |
| `config.response` | `ToResponseOptions` | 응답 정규화 옵션 |
| `config.writeBackTruncated` | `boolean` | 잘린 스트림에서 추론한 스키마를 반영합니다(기본값: true) |

**반환값:** `prepare`, `send`, `sendMany`, `toCollection` 등을 제공하는 `ProtoKit`.

**예제:**

```typescript
import { createDebugger } from "@powerduck/openapi-request";

const dbg = createDebugger({
  writeBackTruncated: true,
});

const result = await dbg.send({
  spec,
  target: { operationId: "getUserById" },
  values: { path: { id: "42" } },
  serverUrl: "https://api.example.com",
});
```

### `createManualSession(options): AnyManualSession`

WebSocket, MCP, gRPC용으로 오래 유지되는 양방향 세션을 생성합니다. 팩터리는 I/O를 수행하지 않으며 `open()`을 호출할 때 연결합니다.

**매개변수:**

| 이름 | 타입 | 설명 |
| --- | --- | --- |
| `options.kind` | `"websocket" \| "mcp" \| "grpc"` | 사용할 프로토콜 |
| `options.url` | `string` | WebSocket 연결 URL |
| `options.endpoint` | `string` | MCP Streamable HTTP 엔드포인트 |
| `options.transport` | `"streamable-http" \| "stdio"` | MCP 전송 방식. 기본값은 Streamable HTTP입니다 |
| `options.command`, `options.args` | `string`, `string[]` | MCP stdio용 로컬 실행 파일과 인수 |
| `options.address`, `options.service`, `options.method` | `string` | gRPC 주소, 전체 서비스 이름, 메서드 |

gRPC에는 `protoPaths` 또는 `reflection`으로 설명자 소스도 제공해야 합니다. 프로토콜별 옵션은 [구성](./configuration.md)을 참고하세요.

**반환값:** `open()`, `send()`, `close()`, `onEvent()`, `waitForClose()`, `events`, `state`를 제공하는 세션. `onEvent()`는 `unsubscribe()`를 가진 구독 객체를 반환합니다.

**예제:**

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "websocket",
  url: "wss://api.example.com/ws",
});

const subscription = session.onEvent((event) => {
  console.log(event.kind, event.data);
});
try {
  await session.open();
  await session.send({ type: "message", data: "hello" });
} finally {
  await session.close();
  subscription.unsubscribe();
}
```

### `AdapterRegistry`

`ProtocolAdapter` 인스턴스 레지스트리입니다. 새 레지스트리는 비어 있지만, `createDebugger()`는 사용자 정의 목록으로 대체하지 않는 한 내장 HTTP, WebSocket, gRPC, MCP, GraphQL 어댑터를 등록합니다. `register()`, `unregister()`, `get()`, `list()`, `rank()`, `resolve()`로 선택 과정을 관리합니다.

### `ProtoKitError`

디버거와 핵심 실행 경로에서 발생시키는 타입이 지정된 오류입니다. `instanceof ProtoKitError`로 라이브러리 오류와 예상치 못한 다른 실패를 구분하세요.

## 핵심 타입

### `SendOptions`

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

### `PreparedRequest`

`createClient().prepare()`가 반환합니다. 디버거의 계획 결과는 다릅니다. `createDebugger().prepare()`는 `located`, `adapter`, `plan`을 포함하는 `PlanResult`를 반환합니다.

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `protocol` | `string` | 결정된 프로토콜(http, websocket, grpc, graphql, mcp) |
| `transport` | `string` | 결정된 전송 방식 |
| `target` | `OperationTarget` | 원래 대상 |
| `operation` | `any` | 해석된 OpenAPI 작업 객체 |
| `display.mode` | `DisplayMode` | `"response" \| "event-list" \| "duplex-session"` |
| `stream.kind` | `StreamKind` | 스트리밍 분류(아래 참조) |
| `stream.expected` | `boolean` | 스트리밍이 예상되는지 여부 |
| `openapi.extensions` | `Record<string, unknown>` | 해석된 OpenAPI 확장 |
| `warnings` | `string[]` | 계획 중 발생한 경고 |

### `StreamKind`

세부 스트리밍 분류: `"none" | "sse" | "ndjson" | "chunked" | "websocket" | "graphql-stream" | "grpc-unary" | "grpc-server-stream" | "grpc-client-stream" | "grpc-bidi" | "mcp-http-stream" | "mcp-stdio"`

## OpenAPI 도우미

| 내보내기 항목 | 시그니처 | 설명 |
| --- | --- | --- |
| `locateOperation` | `(spec, target) => LocatedOperation` | `OperationTarget`으로 작업을 찾습니다 |
| `inferSchema` | `(value) => Schema` | 단일 관찰값에서 JSON Schema를 추론합니다 |
| `inferSchemaFromMany` | `(values) => Schema` | 여러 관찰값을 포괄하는 스키마를 추론합니다 |
| `mergeSchema` | `(a, b) => Schema` | 추론된 두 스키마를 병합합니다(합집합 또는 조합) |
| `sampleFromSchema` | `(schema) => unknown` | 스키마에 맞는 실제적인 예제 값을 생성합니다 |
| `toResponseObject` | `(result, options?) => { statusCode: string; response: any }` | 관찰 결과로 OpenAPI 응답 객체를 만듭니다 |
| `writeBackResponse` | `(spec, path, method, fragment, options?) => spec` | 관찰된 응답을 문서에 병합합니다 |

내보내는 타입: `LocatedOperation`, `WriteBackOptions`, `ToResponseOptions`.

## HTTP / SSE

다음 이름은 기본 진입점에서 사용할 수 있습니다. `@powerduck/openapi-request/http` 하위 경로는 `HttpAdapter`, `SseParser`, `buildCollection`, `buildEnvironment`, `resolveServerUrl`, `buildRunOptions`, `runWithPostman`을 내보냅니다. 탐지 도우미와 `BUILTIN_CAPTURE_TEST`는 기본 진입점에서 가져오세요.

| 내보내기 항목 | 설명 |
| --- | --- |
| `HttpAdapter` | HTTP/HTTPS용 기본 프로토콜 어댑터 |
| `SseParser` | SSE 바이트 스트림을 구조화된 이벤트로 바꾸는 스트리밍 파서 |
| `isStreamingOperation` | 선언된 콘텐츠 타입에 따라 작업의 스트리밍 여부를 분류합니다 |
| `isSseContentType` | 콘텐츠 타입이 SSE를 나타내는지 확인합니다 |
| `isStreamingContentType` | 콘텐츠 타입이 스트리밍을 나타내는지 확인합니다 |
| `acceptHeaderFor` | 작업에 적합한 Accept 헤더를 생성합니다 |
| `probeStreamingResponse` | fetch 요청을 실행하고 응답을 분류합니다. 반환된 응답 본문은 읽거나 취소해야 합니다 |
| `BUILTIN_CAPTURE_TEST` | 마지막 응답을 캡처하는 내장 Postman 테스트 스크립트 |

## WebSocket

`@powerduck/openapi-request/ws`에서 가져옵니다.

| 내보내기 항목 | 설명 |
| --- | --- |
| `WebSocketAdapter` | WebSocket 대상용 프로토콜 어댑터 |
| `createWsManualSession` | 양방향 WebSocket 수동 세션을 생성합니다. `runWebSocketSession`, `wsManualSession`이라는 별칭도 있습니다 |

## GraphQL

`@powerduck/openapi-request/graphql`에서 가져옵니다.

| 내보내기 항목 | 설명 |
| --- | --- |
| `GraphQLAdapter` | GraphQL 대상용 프로토콜 어댑터 |
| `resolveGraphQLConfig` | 작업에서 GraphQL 구성을 해석합니다 |
| `runGraphQL` | GraphQL 작업을 실행합니다 |
| `introspectSchema` | GraphQL 엔드포인트의 스키마를 인트로스펙션으로 조회합니다 |
| `INTROSPECTION_QUERY` | 표준 GraphQL 인트로스펙션 쿼리 |
| `generateOperation` | 조회한 GraphQL 스키마와 필드에서 쿼리 문서를 생성합니다 |
| `generateAllOperations` | 조회한 GraphQL 스키마의 각 필드에 대한 쿼리 문서를 생성합니다 |
| `writeGraphQLOperations` | 생성한 GraphQL 작업을 명세에 반영합니다 |
| `discoverAndWriteGraphQLSchema` | GraphQL 스키마를 탐색해 명세에 기록합니다 |

## MCP(Model Context Protocol)

아래 항목 대부분은 `@powerduck/openapi-request/mcp`에서 사용할 수 있습니다. `initializeMcpSession`은 기본 진입점에서 가져오세요. 하위 경로에서는 이름이 `initializeSession`입니다. 하위 경로는 `runMcp`, `createMcpSessionCore`, `createMcpStdioConnection`도 제공합니다.

| 내보내기 항목 | 설명 |
| --- | --- |
| `McpAdapter` | MCP 대상용 프로토콜 어댑터 |
| `createMcpManualSession` | MCP 수동 세션을 생성합니다. 별칭은 `mcpManualSession`입니다 |
| `createMcpStdioSession` | stdio로 MCP 세션을 생성합니다 |
| `runMcpManualSession` | 사용 중단 예정. `createMcpManualSession`을 사용하세요 |
| `resolveMcpConfig` | 작업에서 MCP 구성을 해석합니다 |
| `initializeMcpSession` | MCP 세션을 초기화합니다(`initializeSession`의 별칭) |
| `discoverMcpCapabilities` | MCP 서버 기능을 탐색합니다 |
| `MCP_PROTOCOL_VERSION` | 지원하는 MCP 프로토콜 버전 |
| `generateMcpCall` | 단일 MCP 도구 호출을 생성합니다 |
| `generateAllMcpCalls` | 모든 MCP 도구 호출을 생성합니다 |
| `writeMcpOperations` | MCP 작업을 명세에 반영합니다 |
| `discoverAndWriteMcpCapabilities` | MCP 기능을 탐색해 명세에 기록합니다 |
| `createHttpMcpTransport` | MCP용 HTTP 전송을 생성합니다 |
| `createStdioMcpTransport` | MCP용 stdio 전송을 생성합니다 |

## gRPC

저수준 탐색, 호출, 설명자 도우미는 `@powerduck/openapi-request/grpc`에서 가져옵니다. `GrpcProtocolAdapter`, `createGrpcManualSession`, `grpcManualSession`, `grpcDiscover`, `discoverGrpc`는 기본 진입점에서 가져오세요. 하위 경로의 탐색 함수 이름은 `discover`입니다. 하위 경로에는 `discoverFromCatalog`, `describeMethod`, `describeFromCatalog`도 있어, 메서드마다 리플렉션을 반복하지 않고 카탈로그를 재사용할 수 있습니다.

| 내보내기 항목 | 설명 |
| --- | --- |
| `GrpcProtocolAdapter` | OpenAPI용 gRPC 프로토콜 어댑터 |
| `GrpcAdapter` | 저수준 gRPC 어댑터 |
| `grpcDiscover` / `discoverGrpc` | gRPC 서비스와 메서드를 탐색합니다 |
| `createGrpcManualSession` / `grpcManualSession` | gRPC 수동 세션을 생성합니다 |
| `grpcCall` | 단일 gRPC 호출을 실행합니다 |
| `resolveMethod` | gRPC 메서드 설명자를 찾습니다 |
| `buildMessageTemplate` | 설명자에서 메시지 템플릿을 만듭니다 |
| `buildCatalog` | 서비스와 메서드 카탈로그를 만듭니다 |
| `LOADER_OPTIONS` | 기본 proto 로더 옵션 |
| `scanProtoFiles` | 디렉터리에서 proto 파일을 찾습니다 |
| `deriveIncludeDirsDetailed` | proto 파일 경로에서 포함 디렉터리를 도출합니다 |
| `fetchDescriptorSet` | gRPC 리플렉션으로 설명자 집합을 가져옵니다 |
| `fetchFullDescriptorSet` | 모든 종속성을 포함한 전체 설명자 집합을 가져옵니다 |
| `listServices` | 설명자 집합의 서비스 목록을 반환합니다 |
| `listServicesDetailed` | 서비스와 자세한 메서드 정보를 나열합니다 |
| `serializeDescriptorSet` | 설명자 집합을 바이트로 직렬화합니다 |
| `decodeFileDescriptorProto` | 단일 파일 설명자 proto를 디코딩합니다 |
| `decodeFileDescriptorSet` | 파일 설명자 집합을 디코딩합니다 |
| `buildCredentials` | gRPC 자격 증명을 생성합니다(동기) |
| `buildCredentialsAsync` | gRPC 자격 증명을 생성합니다(비동기) |
| `buildCredentialsChecked` | 검증을 포함하여 자격 증명을 생성합니다(동기) |
| `buildCredentialsCheckedAsync` | 검증을 포함하여 자격 증명을 생성합니다(비동기) |
| `loadGrpc` | `@grpc/grpc-js` 패키지를 동적으로 로드합니다 |
| `isGrpcAvailable` | gRPC 종속성을 사용할 수 있는지 확인합니다 |
| `requireCapability` | 특정 gRPC 기능을 요구하며 사용할 수 없으면 오류를 발생시킵니다 |

기본 진입점은 타입 별칭 `GrpcDiscoveryResult`, `GrpcDiscoveredMethod`, `GrpcDiscoveredService`를 내보냅니다. gRPC 하위 경로에서는 각각 `DiscoveryResult`, `DiscoveredMethod`, `DiscoveredService`라는 이름을 사용합니다.

오류 타입: `ReflectionProtocolError`, `ReflectionUnavailableError`, `DescriptorDecodeError`, `GrpcDependencyBrokenError`, `GrpcDependencyMissingError`.

## 추가 유틸리티

기본 진입점은 OAuth 2.0 도우미 `resolveOAuth2Token`, `acquireOAuth2Token`, `isOAuth2TokenExpired`, `oauth2RefreshStatuses`, `authFromOAuth2Token`, 복제 유틸리티 `toCloneable`, 기본 클래스 `UnifiedSession`, gRPC 반영 도우미 `writeGrpcOperations`, `discoverAndWriteGrpcOperations`도 내보냅니다.

## 하위 경로 내보내기

```typescript
// Main integration entry
import { createClient, createDebugger } from "@powerduck/openapi-request";

// Protocol-specific entries
import { HttpAdapter } from "@powerduck/openapi-request/http";
import { WebSocketAdapter } from "@powerduck/openapi-request/ws";
import { GrpcAdapter } from "@powerduck/openapi-request/grpc";
import { McpAdapter } from "@powerduck/openapi-request/mcp";
import { GraphQLAdapter } from "@powerduck/openapi-request/graphql";
```
