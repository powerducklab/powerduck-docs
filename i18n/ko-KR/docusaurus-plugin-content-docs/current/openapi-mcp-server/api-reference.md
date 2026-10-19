---
sidebar_position: 5
title: "API 레퍼런스"
description: "@powerduck/openapi-mcp-server 전체 API: 명세 로드, 도구·프롬프트·리소스 생성, 요청 구성과 실행, MCP 서버와 전송, 관리 서버, 인증, 서비스 레지스트리 및 CLI."
---

# API 레퍼런스

`@powerduck/openapi-mcp-server`의 모든 공개 내보내기를 기능별로 설명합니다.

## 명세 로드

| 내보내기 | 시그니처 | 설명 |
| --- | --- | --- |
| `loadOpenApiSpec(filePath)` | `(string) => Promise<Oas32Document>` | JSON 또는 YAML 파일을 읽고 검증과 참조 해제를 수행하며 작업 ID의 고유성을 확인합니다. YAML은 `.ya?ml` 확장자로 감지합니다. |
| `parseSpecContent(rawText, isYaml)` | `(string, boolean) => Promise<Oas32Document>` | 문자열에서 문서를 파싱합니다. 입력이 비어 있거나 유효하지 않으면 예외를 던집니다. |

## 도구 생성

| 내보내기 | 시그니처 | 설명 |
| --- | --- | --- |
| `generateTools(spec)` | `(spec) => Tool[]` | 각 작업의 MCP `Tool` 정의를 생성합니다. |
| `generateToolsDetailed(spec)` | `(spec) => GenerateToolsResult` | `{ tools, bindings, issues }`를 반환합니다. |
| `buildBindingIndex(spec)` | `(spec) => Map<string, ToolBinding>` | 생성된 도구 이름을 해당 `ToolBinding`에 매핑합니다. `getBindingIndex`의 별칭입니다. |

타입 내보내기: `ToolBinding`, `GeneratedToolWithBinding`(패키지에서 사용하는 `GeneratedTool`의 별칭).

## 프롬프트와 리소스

| 내보내기 | 시그니처 | 설명 |
| --- | --- | --- |
| `generatePrompts(spec)` | `(spec) => GeneratedPrompt[]` | 생성된 모든 프롬프트를 나열합니다. |
| `resolvePrompt(spec, name, args?)` | `(spec, string, Record?) => GetPromptResult \| null` | 이름으로 프롬프트를 찾습니다. 알 수 없는 이름이면 `null`입니다. |
| `generateResources(spec)` | `(spec) => GeneratedResource[]` | 카탈로그 리소스를 나열합니다. |
| `readResource(spec, uri)` | `(spec, string) => ResourceContentItem \| null` | URI로 리소스 하나를 읽습니다. |

## 요청 구성과 실행

| 내보내기 | 시그니처 | 설명 |
| --- | --- | --- |
| `buildRequest(baseUrl, templatePath, pathItem, operation, args, binding?)` | `=> BuiltRequest` | 인수를 `{ url, query, headers, body, dropped }`로 직렬화합니다. 위치 인수를 사용합니다. |
| `executeToolCall(spec, toolName, args, context?)` | `(spec, string, Record?, ExecutionContext?) => Promise<ToolCallResult>` | 생성된 도구를 업스트림 API에 실행합니다. 2xx가 아닌 응답은 데이터로 반환하고 전송 실패는 예외를 던집니다. |

`ToolCallResult` 필드: `status`, `statusText`, `headers`, `data`, `truncated`, `url`, `method`, `durationMs`, `correlationId`.

## 명세 유틸리티

| 내보내기 | 설명 |
| --- | --- |
| `iterateOperations(spec, issues?)` | 해석된 모든 작업을 반환하는 제너레이터입니다. OpenAPI 3.2의 `additionalOperations`를 포함합니다. |
| `collectOperationParameters(pathItem, operation, issues?, context?)` | `(name, in)`을 키로 경로 항목과 작업의 매개변수를 병합합니다. |
| `normalizeParameter(candidate)` | 원시 매개변수를 정규화합니다. 사용할 수 없으면 `null`입니다. |
| `synthesizeOperationId(method, pathTemplate)` | 작업에 `operationId`가 없으면 결정적 대체 ID를 생성합니다. |
| `ensureUniqueName(candidate, taken)` | 숫자 접미사를 붙여 이름을 고유하게 유지합니다. |
| `extractPathTemplateVariables(pathTemplate)` | `{name}` 변수를 추출하고 처음 나타난 항목을 남겨 중복을 제거합니다. |
| `effectiveStyle(parameter)` | 명세에 정의된 `style` 기본값을 적용합니다. |
| `effectiveExplode(parameter)` | 명세에 정의된 `explode` 기본값을 적용합니다. |
| `findOperationById(spec, operationId)` | 최초 구성 후 O(1)로 조회합니다. 알 수 없는 ID이면 `null`입니다. |
| `findDuplicateOperationIds(spec)` | 작성자가 선언한 중복 ID를 보고합니다. |
| `assertUniqueOperationIds(spec)` | 작업 ID가 중복되면 예외를 던집니다. |
| `isPlainObject(value)` | 타입을 일반 객체로 좁힙니다. |
| `truncateGeneratedName(name, limit=64)` | 고유성을 유지하면서 이름을 줄입니다. |

타입 내보내기: `OperationEntry`, `DuplicateOperationId`.

## MCP 서버와 전송

| 내보내기 | 설명 |
| --- | --- |
| `buildMcpServer(specProvider, contextProvider?, options?)` | 도구·프롬프트·리소스 핸들러를 연결한 SDK `Server`를 구성합니다. 위치 인수를 사용합니다. |
| `startStdioServer(spec, context?, options?)` | stdio로 문서 하나를 제공하고 `{ closed, close() }`를 반환합니다. |
| `attachMcpRoutes(app, options)` | Streamable HTTP(`/mcp`) 및 선택적인 기존 SSE(`/sse`) 라우트를 마운트합니다. `AttachMcpRoutesOptions`를 받고 `McpRouteHandle`을 반환합니다. |
| `attachSseRoutes(app, specProvider, contextProvider, routeGuard?)` | 위치 인수를 사용하는 사용 중단된 래퍼입니다. `{ activeSessionCount, closeAll }`을 반환합니다. |
| `createStreamableSessionHost(options)` | 사용자 정의 전송 통합을 위한 독립적인 Streamable HTTP 세션 호스트를 만듭니다. |

타입: `SpecProvider = () => Document | null`, `ContextProvider = () => ExecutionContext`, `AttachMcpRoutesOptions`, `McpRouteHandle`, `StreamableSessionHost`, `StreamableSessionHostOptions`, `McpSessionEvent`, `McpSessionInfo`, `SessionCloseReason`, `SessionKind`.

`attachMcpRoutes`는 패키지 루트에서 내보냅니다. 옵션에서 `maxSessions`, `allowedOrigins`, `sessionIdleMs`와 DNS 리바인딩 방어를 설정합니다. 핸들은 `activeSessionCount`, `pendingSessionCount`, `listSessions`, `closeSession`, `closeAll`, `dispose`를 제공합니다. 종료 시 `dispose()`를 사용해 주기적 정리를 중지하고 세션을 닫으세요.

## 관리 서버와 인증 (`./server` 하위 경로) {#admin-server-and-auth-server-subpath}

`startAdminServer`는 `@powerduck/openapi-mcp-server/server` 또는 패키지 루트에서 가져옵니다. `createAuthMiddleware`는 루트에서 가져오세요. `./server` 하위 경로에서는 내보내지 않습니다.

| 내보내기 | 시그니처 | 설명 |
| --- | --- | --- |
| `startAdminServer(config)` | `Promise<AdminServerHandle>` | 웹 관리 UI와 MCP 라우트가 있는 Express 앱을 시작합니다. `{ app, server, port, close() }`를 반환합니다. |
| `createAuthMiddleware(apiKey?)` | `RequestHandler` | Bearer 또는 `x-api-key` 접근 보호입니다. 키를 생략하면 비활성화됩니다. 위치 인수를 사용합니다. |

## 런타임과 유틸리티

| 내보내기 | 설명 |
| --- | --- |
| `ServiceRegistry` | `ManagedServiceRecord` 관리 클래스: `upsert`, `list`, `get`, `remove`, `clear`, `start`, `stop`, `fail`. |
| `isAbortError(error)` | `AbortError` 또는 axios `CanceledError`이면 참입니다. |
| `newId()` | UUID를 생성하며 대체 방식으로 타임스탬프를 사용합니다. |

## CLI

실행 파일은 **`openapi-mcp`**입니다. 단일 명령 `serve`를 제공합니다.

```
openapi-mcp serve [options]
```

| 옵션 | 기본값 | 설명 |
| --- | --- | --- |
| `--port <n>` | `3000` | 웹 전송의 HTTP 포트. |
| `--host <host>` | `127.0.0.1` | HTTP 호스트. |
| `--transport <mode>` | `web` | `stdio` 또는 `web`. |
| `--spec <path>` | — | OpenAPI 파일 경로. stdio 모드에서는 필수입니다. |
| `--base-url <url>` | — | 업스트림 기본 URL을 재정의합니다. |
| `--api-key <key>` | — | 관리 API 키. |
| `--upstream-header "Name: value"` | — | 업스트림 헤더. 여러 번 지정할 수 있습니다. |
| `--timeout <ms>` | `30000` | 업스트림 제한 시간. |
| `--no-persist` | — | 상태 영속화를 비활성화합니다. |

## 타입 (`types`에서 다시 내보냄)

`ServerConfig`, `SecurityContext`, `AppState`, `PersistedState`, `ExecutionContext`, `TransportMode`, `SpecSource`, `ServiceStatus`, `ProtocolHint`, `LogDirection`, `LogLevel`, `ParameterLocation`, `BodyEncoding`, `ServiceEndpointInfo`, `ManagedServiceRecord`, `SpecIssue`, `AdminStatus`, `GeneratedPrompt`, `GeneratedResource`, `GeneratedTool`, `ResourceContentItem`, `PromptMessageShape`, `RequestLogEntry`, `LogQueryOptions`, `LogQueryResult`. `ResolvedPrompt`는 사용 중단되었습니다. 타입 가드: `isSpecSource`, `isServiceStatus`, `isProtocolHint`, `isParameterLocation`, `isBodyEncoding`, `isPlainRecord`.

## 오류와 동작

- 알 수 없는 도구·프롬프트·리소스 ID는 일반 결과 안에 실패를 담는 대신 MCP `InvalidParams` 오류를 발생시킵니다.
- 활성 세션에서 명세가 없으면 `InternalError`가 발생합니다.
- 업스트림 4xx/5xx 응답은 예외 없이 `isError: true` 콘텐츠로 모델에 반환됩니다. 전송 계층 실패(DNS, TLS, 시간 초과, 중단)만 예외를 던집니다.

## 관련 문서

- [설정](../configuration/)
- [예제](../examples/)
