---
title: "요청 저장과 프로토콜 예제"
description: "Powerduck은 테스트 중인 요청과 게시할 API 계약을 분리합니다."
---

# 요청 저장과 프로토콜 예제

Powerduck은 테스트 중인 요청과 게시할 API 계약을 분리합니다.

| 동작 | 결과 |
| --- | --- |
| URL 표시줄에서 저장 | 이 요청의 로컬 디버깅 설정을 저장합니다. OpenAPI 문서는 수정하지 않습니다. |
| 빠른 요청: 명세에 저장 | 선택한 문서와 폴더에 작업을 추가합니다. |
| 명세 요청: 명세 업데이트 | 계약을 업데이트하기 전에 대상 메서드, 경로와 정의 미리보기를 표시합니다. |
| 문서 저장 / Cmd+S 또는 Ctrl+S | 현재 OpenAPI 문서를 디스크에 씁니다. 빠른 요청 탭에서는 해당 빠른 요청을 저장합니다. |

로컬 요청에는 선택한 서버, URL, 메서드, 매개변수 값, 본문, 스크립트와 전송 설정이 포함됩니다. 명세 요청 초안은 편집 중 메모리에 유지되며, URL 표시줄의 저장을 누르면 앱 렌더러 저장소의 `powerduck.debug.v1:` 아래에 영구 저장됩니다. 항목은 문서 ID, 경로, 메서드로 구분됩니다. 브라우저나 데스크톱 앱 데이터를 지우면 이 로컬 상태도 사라지며, 내보낸 OAS 파일에는 포함되지 않습니다. 이 저장소는 **암호화된 비밀 보관함이 아닙니다**. 요청 URL, 헤더, 본문에 자격 증명을 직접 넣는 대신 환경 참조를 사용하세요. 인증 컨트롤은 별도의 자격 증명 영구 저장 경로를 사용합니다.

`x-powerduck-request`는 **공식 계약 확장이 아닙니다**. 명세에 추가하거나 명세를 업데이트할 때 생성되지 않습니다. 메서드, 매개변수, 요청 본문이나 응답을 설명하는 용도로 사용하면 안 됩니다. 문서를 여는 것만으로 다른 작업에 이미 있는 이 확장을 다시 쓰지는 않습니다.

## 정의를 명시적으로 업데이트하기

명세 업데이트는 대상 메서드와 경로를 미리 보여 주고 기존 응답과 스키마를 유지합니다. 매개변수 정의는 선택해야 포함되며 디버깅 매개변수 값은 복사하지 않습니다. JSON 본문도 명시적으로 선택해야 예제로 추가됩니다. 일반적인 자격 증명 필드 이름은 제외되지만 **게시 전에 자유 형식 텍스트와 예제를 검토하세요**. 스크립트와 인증 재정의는 계약 필드가 아닙니다.

메서드나 경로를 바꿔 기존 대상 작업을 덮어쓸 수는 없습니다. 로컬 작업 참조는 새 대상으로 갱신됩니다. `PURGE` 같은 사용자 지정 메서드는 `paths./cache.additionalOperations.PURGE`에 저장되며 OpenAPI 3.2가 필요합니다. 미리보기에 이 요구 사항을 표시하고 업데이트를 적용하면 문서 버전이 3.2.0으로 설정됩니다. 이 문서를 사용하는 도구의 버전 지원도 확인해야 합니다.

프로토콜 스키마는 문서 편집에서 계속 수정할 수 있습니다. 이는 정의를 명시적으로 변경하는 작업입니다. 디버깅 요청을 보내거나 저장한다고 스키마가 자동으로 다시 작성되지는 않습니다.

## 다운로드 가능한 공식 예제

이 파일은 유지 관리되는 **예제 정의**이며 Powerduck의 공개 API 서비스가 아닙니다. 모든 엔드포인트는 직접 준비해야 하는 로컬 서비스를 가리킵니다. 파일을 가져와도 서비스가 시작되거나 자동 연결되거나 자격 증명이 제공되지 않습니다.

- [모든 프로토콜](https://www.powerduck.com/docs/examples/protocols/all-protocols.yaml)
- [HTTP와 사용자 지정 PURGE](https://www.powerduck.com/docs/examples/protocols/http.yaml)
- [SSE](https://www.powerduck.com/docs/examples/protocols/sse.yaml)
- [WebSocket](https://www.powerduck.com/docs/examples/protocols/websocket.yaml)
- [GraphQL](https://www.powerduck.com/docs/examples/protocols/graphql.yaml)
- [gRPC](https://www.powerduck.com/docs/examples/protocols/grpc.yaml) 및 [echo.proto](https://www.powerduck.com/docs/examples/protocols/echo.proto)
- [MCP Streamable HTTP](https://www.powerduck.com/docs/examples/protocols/mcp.yaml)
- [A2A 1.0 JSON-RPC](https://www.powerduck.com/docs/examples/protocols/a2a.yaml)

gRPC에서는 YAML 파일과 같은 위치에 `echo.proto`를 다운로드하고, 필요하면 클라이언트에서 실제 로컬 경로를 선택하세요. 서버는 50051 포트에서 `powerduck.examples.Echo/Echo`를 구현해야 합니다. 다른 예제에도 대응하는 서버가 필요합니다. 실행 중인 백엔드를 검증하는 데모가 아닙니다.

## 계약 확장 참조

각 작업에는 일반 OAS 메서드, operationId, summary와 responses가 있습니다. 비 HTTP 바인딩은 OAS 작업을 문서상의 기준점으로 사용합니다. gRPC 예제의 `post`는 gRPC를 REST 엔드포인트로 바꿨다는 뜻이 아닙니다.

| 확장 | 의미와 예제에서 사용하는 필드 |
| --- | --- |
| `x-protocol` | `sse`, `websocket`, `graphql`, `grpc`, `mcp` 또는 `a2a`입니다. HTTP에서는 생략할 수 있습니다. |
| `x-session` | 장기간 유지되는 프로토콜 세션을 선언합니다. 예제에서는 WebSocket과 MCP에 사용합니다. |
| `x-websocket` | `url`, 선택 사항인 `subprotocols`, `headers`, `messages`입니다. 문서화된 각 메시지는 `id`, `name`, `type`, `body`, `requestSchema`, `responseSchema`를 가집니다. 헤더에는 자격 증명을 넣지 마세요. |
| `x-graphql` | `endpoint`, `query`, `operationName`, `variablesSchema`, 공개 가능한 `variables`, `responseSchema`입니다. |
| `x-grpc` | `address`, `service`, `method`, `kind`, `reflection`, `protoPaths`, `includeDirs`, 문서화된 `messages`입니다. `kind`는 unary/server_streaming/client_streaming/bidi_streaming을 지원합니다. 로컬 proto 경로는 배포 환경마다 다릅니다. |
| `x-mcp` | `transport`, `endpoint`, `method`와 메서드별 `name`, `argumentsSchema`, 공개 가능한 `arguments`, `responseSchema`입니다. 리소스 작업에는 `uri`를 사용하며 서로 관련 없는 메서드의 필드를 섞지 마세요. |
| `x-a2a` | 명시적인 `version`, `binding`, `endpoint`, `method`, `requestSchema`, `responseSchema`와 공개 가능한 `example`입니다. 0.3과 1.0의 페이로드는 다릅니다. [A2A](./a2a.md)를 참조하세요. |
| `x-response-stream` | 실제 서버와 전송 방식이 스트리밍을 지원할 때 사용하는 선택적 GraphQL 스트리밍 의도 표시입니다. 일반 GraphQL 요청에는 필요하지 않습니다. |

SSE는 표준 `responses.200.content.text/event-stream.itemSchema`로 각 이벤트 페이로드를 설명합니다. HTTP는 표준 매개변수, requestBody, responses와 보안 스키마를 사용합니다. 임의의 `x-sse` 설정 블록을 만들거나 디버깅 상태를 계약 확장으로 저장하지 마세요.

예제는 선택한 바인딩의 완전하고 사용 가능한 설정을 제공합니다. 상호 배타적인 모든 옵션을 나열한 것은 아닙니다. MCP stdio에는 별도로 설정한 로컬 실행 파일이 필요하며, 다운로드 예제에서는 의도적으로 자동 실행하지 않습니다.

## 패키지 연동

데스크톱 UI가 로컬 디버깅 상태의 영구 저장과 명시적인 명세 쓰기를 담당합니다. `@powerduck/openapi-parser`는 이미 `additionalOperations`로 사용자 지정 메서드를 읽고, `@powerduck/tree`와 `@powerduck/oas-document`는 이 계약 구조를 사용합니다. `@powerduck/openapi-request`는 명세와 별도로 런타임 인수를 받습니다. 요청 실행에는 `x-powerduck-request`가 필요하지 않습니다.

저장 역할을 분리해도 새로운 공개 npm 매개변수는 추가되지 않습니다. 계약 데이터에는 기존 프로토콜 확장을 사용하고 현재 디버깅 값은 요청 실행 API로 전달하세요. 내보내기 도구, 생성기나 MCP 도구가 비공개 요청 상태 구조에 의존하게 만들지 마세요.
