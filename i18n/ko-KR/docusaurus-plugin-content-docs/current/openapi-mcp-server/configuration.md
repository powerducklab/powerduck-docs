---
sidebar_position: 4
title: "설정"
description: "@powerduck/openapi-mcp-server 전체 설정: ServerConfig, SecurityContext, ExecutionContext, TransportMode 및 출처, 상태, 프로토콜, 로그 수준, 본문 인코딩의 리터럴 유니온."
---

# 설정

핵심 설정 객체는 `startAdminServer()`가 받는 `ServerConfig`입니다. 관련 컨텍스트 타입은 도구 실행에 사용됩니다.

## `ServerConfig`

`port`만 필수입니다.

| 필드 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `port` | `number` | — (필수) | 수신할 TCP 포트. 0~65535 범위의 정수. |
| `host` | `string` | `"127.0.0.1"` | 수신 인터페이스. 실수로 외부에 노출되지 않도록 기본값은 루프백입니다. |
| `apiKey` | `string` | undefined | 설정하면 관리 API와 HTTP 전송에서 요구하는 공유 비밀 키. |
| `specPath` | `string` | undefined | 시작할 때 한 번 로드하는 명세. |
| `baseUrlOverride` | `string` | undefined | `servers[0].url`에서 가져온 업스트림 기본 URL을 재정의합니다. |
| `upstreamHeaders` | `Record<string, string>` | undefined | 모든 업스트림 요청에 병합하는 헤더. |
| `requestTimeoutMs` | `number` | undefined | 업스트림 요청별 제한 시간(밀리초). |
| `persistState` | `boolean` | `true` | 로드한 명세를 재시작 후에도 유지합니다. |
| `stateFilePath` | `string` | undefined | 영구 상태 파일의 위치. |
| `allowedOrigins` | `string[]` | undefined | 허용할 CORS 출처. 비어 있거나 생략하면 교차 출처 접근이 비활성화됩니다. |
| `allowedHosts` | `string[]` | undefined | 허용할 `Host` 헤더 값. |
| `maxLogEntries` | `number` | 200 | 메모리에 보관할 최대 로그 항목 수. |
| `redactSensitiveHeaders` | `boolean` | `true` | 로깅 전에 민감한 헤더 값을 마스킹합니다. |
| `redactHeaderNames` | `string[]` | undefined | 기본 목록 외에 추가로 마스킹할 헤더 이름. |
| `security` | `SecurityContext` | undefined | 도구를 호출할 때마다 업스트림 API로 전달하는 자격 증명. |

## `SecurityContext`

| 필드 | 타입 | 전송 형식 |
| --- | --- | --- |
| `bearerToken` | `string` | `Authorization: Bearer <token>` |
| `basicAuth` | `{ username, password }` | `Authorization: Basic <base64>` |
| `apiKeys` | `Record<string, string>` | 정확한 헤더 이름과 값의 쌍. |

자격 증명은 실행기가 삽입하며 모델에 제공되는 도구 인수로 노출되지 않습니다.

## `ExecutionContext`

`executeToolCall`에 전달하고 `ContextProvider`가 반환하는 호출별 컨텍스트:

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `baseUrlOverride` | `string` | 이번 호출에 사용할 명세의 서버 URL을 재정의합니다. |
| `upstreamHeaders` | `Record<string, string>` | 추가 업스트림 헤더. |
| `requestTimeoutMs` | `number` | 호출별 제한 시간. 최소 1초로 제한됩니다. |
| `security` | `SecurityContext` | 호출별 자격 증명. |
| `correlationId` | `string` | 같은 호출의 로그 항목을 연결합니다. |
| `protocol` | `ProtocolHint` | 호출을 시작한 전송 방식. |
| `onLog` | `(entry) => void` | 요청·응답 로그 항목을 받습니다. 예외를 던지면 안 됩니다. |
| `signal` | `AbortSignal` | 진행 중인 업스트림 요청을 취소합니다. |

## 리터럴 유니온과 타입 가드

| 유니온 | 값 | 가드 함수 |
| --- | --- | --- |
| `TransportMode` | `"stdio" \| "web"` | — |
| `SpecSource` | `"startup-file" \| "upload" \| "paste" \| "runtime"` | `isSpecSource()` |
| `ServiceStatus` | `"running" \| "stopped" \| "error"` | `isServiceStatus()` |
| `ProtocolHint` | `"streamable-http" \| "sse" \| "stdio"` | `isProtocolHint()` |
| `LogDirection` | `"request" \| "response" \| "internal"` | — |
| `LogLevel` | `"debug" \| "info" \| "warn" \| "error"` | — |
| `ParameterLocation` | `"path" \| "query" \| "header" \| "cookie"` | `isParameterLocation()` |
| `BodyEncoding` | `"json" \| "form-urlencoded" \| "multipart" \| "text" \| "binary"` | `isBodyEncoding()` |

## `BuildMcpServerOptions`

`buildMcpServer()`의 세 번째 인수로 전달합니다.

| 필드 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `protocol` | `ProtocolHint` | undefined | 공개하는 프로토콜 힌트. |
| `name` | `string` | `"openapi-mcp"` | 공개하는 서버 이름. |
| `version` | `string` | `"1.1.0"` | 공개하는 서버 버전. |
| `pageSize` | `number` | 100 | 목록 응답별 최대 항목 수. 상한은 500입니다. |
| `instructions` | `string` | 내장 | MCP `instructions`를 통해 제공하는 사용 안내. |

## 전송 계층 옵션 (`AttachMcpRoutesOptions`)

`@powerduck/openapi-mcp-server`에서 `attachMcpRoutes`를 가져오고 두 번째 인수로 옵션 객체를 전달합니다. 기존 래퍼 `attachSseRoutes()`는 위치 인수 `(app, specProvider, contextProvider, routeGuard?)`만 받습니다.

| 필드 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `specProvider` | `SpecProvider` | — (필수) | 새 세션에 문서를 제공합니다. |
| `contextProvider` | `ContextProvider` | — (필수) | 호출마다 업스트림 컨텍스트를 제공합니다. |
| `routeGuard` | `RequestHandler` | undefined | 모든 MCP 라우트에 적용하는 미들웨어. |
| `maxSessions` | `number` | 64 | 최대 동시 세션 수. |
| `sessionIdleMs` | `number` | 600000 | 유휴 제한 시간(밀리초). 0이면 비활성화됩니다. |
| `allowedOrigins` | `string[]` | undefined | 허용할 출처. 비어 있지 않은 목록은 DNS 리바인딩 방어를 활성화합니다. |
| `allowedHosts` | `string[]` | undefined | 허용할 `Host` 헤더 값. |
| `enableLegacySse` | `boolean` | `true` | 사용 중단된 HTTP+SSE 전송을 마운트합니다. |
| `onEvent` | `(event: McpSessionEvent) => void` | undefined | 수명 주기 이벤트를 받습니다. 예외를 던지면 안 됩니다. |

> 이 항목들은 `attachMcpRoutes`의 옵션이며 `ServerConfig`의 추가 필드가 아닙니다. 관리 서버는 출처와 호스트 설정을 전달하지만 세션 수 제한과 유휴 제한 시간은 전송 계층의 기본값을 사용합니다. 이 제한을 변경하려면 공개 전송 함수를 직접 사용하세요.

## 관련 문서

- [API 레퍼런스](../api-reference/)
- [예제](../examples/)
