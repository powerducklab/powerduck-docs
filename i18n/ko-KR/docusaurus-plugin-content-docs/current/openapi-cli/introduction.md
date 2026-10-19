---
sidebar_position: 1
title: "소개"
description: "@powerduck/openapi-cli는 OpenAPI 3.2 문서를 기반으로 실제 서버에 대해 일괄 테스트를 수행하는 명령줄 도구입니다. 명세 파일이나 URL을 지정하면 문서의 작업을 실행하고, 각 응답에 대해 어설션을 수행하며, 세 가지 형식의 보고서를 생성합니다."
---

# 소개

`@powerduck/openapi-cli`는 OpenAPI 3.2 문서를 기반으로 실제 서버에 대해 일괄 테스트를 수행하는 명령줄 도구입니다. 명세 파일이나 URL을 지정하면 문서의 작업을 실행하고, 각 응답에 대해 어설션을 수행하며, 세 가지 형식의 보고서를 생성합니다.

요청 실행에는 [`@powerduck/openapi-request`](https://www.npmjs.com/package/@powerduck/openapi-request)를 사용하고, `$ref` 참조 해제에는 [`@powerduck/openapi-parser`](https://www.npmjs.com/package/@powerduck/openapi-parser)를 사용합니다.

## openapi-cli를 사용하는 이유

- **CI 지원** — 기본적으로 테스트 실패나 실행 오류가 발생하면 0이 아닌 종료 코드를 반환하므로 GitHub Actions, GitLab CI 또는 다른 파이프라인에 바로 통합할 수 있습니다.
- **여러 프로토콜 기본 지원** — 하나의 명세에 HTTP, SSE, WebSocket, GraphQL, gRPC, MCP 작업을 기술하고 같은 실행기로 모두 처리할 수 있습니다.
- **두 가지 어설션 방식** — 간단한 검사는 선언형 `x-tests` 배열로, 복잡한 검사는 Postman 스타일의 `pm.test()` / `pm.expect()` 스크립트로 작성합니다.
- **세 가지 보고서 형식** — 기계가 처리하기 쉬운 JSON, 사람이 읽기 쉬운 컬러 CLI 출력, 독립형 대화형 HTML 보고서를 제공합니다.
- **로컬 및 원격 명세** — 파일 경로나 `http(s)://` URL에서 문서를 로드하며 리디렉션과 시간 제한을 지원합니다.
- **유연한 필터링** — 메서드, 경로, 태그 또는 operationId로 실행할 작업을 선택하고 동시 실행 수를 제한합니다.

## 지원 프로토콜

실행기는 OpenAPI 확장 필드 또는 응답 콘텐츠 유형으로 각 작업의 프로토콜을 감지합니다.

| 프로토콜 | 식별자 | 선택 기준 |
|----------|-----------|--------------------|
| HTTP | `http` | 표준 작업의 기본값 |
| 서버 전송 이벤트 | `sse` | 응답 콘텐츠 유형이 `text/event-stream`이거나 `x-response-stream: true` 설정 |
| WebSocket | `websocket` | `x-protocol: "websocket"` |
| GraphQL | `graphql` | `x-protocol: "graphql"` |
| gRPC | `grpc` | `x-protocol: "grpc"` |
| MCP | `mcp` | `x-protocol: "mcp"` |

작업 또는 경로 항목에 `x-protocol` 확장을 설정해 프로토콜을 명시적으로 지정할 수도 있습니다.

## 보고서

실행이 끝나면 다음 결과를 출력합니다. 파일의 기본 저장 위치는 `./openapi-cli-report`입니다.

- `report.json` — 전체 `TestReport` 객체를 보기 좋게 정렬한 JSON으로 저장합니다.
- `report.html` — 요약 표시줄, 진행률 표시줄, 필터 버튼, 펼칠 수 있는 테스트 행을 갖춘 외부 의존성 없는 독립형 HTML 보고서입니다.
- 표준 출력 — 진행률 표시줄과 각 테스트의 어설션을 포함하는 컬러 CLI 요약입니다.

## 코드에서 사용

같은 흐름을 라이브러리로 사용할 수 있습니다. 설정을 해석하고 테스트를 실행한 다음 필요한 보고서 생성기를 선택하세요.

```ts
import { resolveConfig, runTests, printCliReport, generateJsonReport } from "@powerduck/openapi-cli";

const config = resolveConfig({ spec: "./openapi.json" });
const report = await runTests(config);
printCliReport(report);
generateJsonReport(report, "./reports");
```

## 다음 단계

- [설치](./installation.md) — 전역 또는 개발 의존성으로 설치합니다.
- [빠른 시작](./quickstart.md) — 첫 테스트 모음을 실행합니다.
- [설정](./configuration.md) — 전체 `CliConfig` 참조입니다.
- [명령](./commands.md) — 모든 CLI 옵션과 종료 코드를 확인합니다.
- [API 참조](./api-reference.md) — 내보내는 모든 함수와 타입을 확인합니다.
- [예제](./examples.md) — 바로 실행할 수 있는 예제입니다.
