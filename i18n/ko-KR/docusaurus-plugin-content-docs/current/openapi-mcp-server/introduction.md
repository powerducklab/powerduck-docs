---
sidebar_position: 1
title: "소개"
description: "OpenAPI를 MCP 서비스로 변환합니다. 도구, 프롬프트, 리소스, 웹 관리 UI, stdio, HTTP 및 openapi-mcp CLI를 제공합니다."
keywords: ["openapi-mcp-server", "MCP", "OpenAPI", "stdio", "HTTP"]
---

# @powerduck/openapi-mcp-server — 소개

`@powerduck/openapi-mcp-server`는 OpenAPI 문서를 실행 가능한 MCP(Model Context Protocol) 서비스로 변환합니다. 작업에서 **도구**, API 메타데이터와 작업에서 **프롬프트**, API 카탈로그에서 **리소스**를 생성하여 MCP 프로토콜로 제공합니다. 웹 관리 UI도 내장되어 있습니다.

- **패키지 이름:** `@powerduck/openapi-mcp-server`
- **버전:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-mcp-server"/>
- **라이선스:** MIT
- **Node 요구 사항:** `>=22.12.0`
- **CLI 실행 파일:** `openapi-mcp`
- **모듈 형식:** 타입 선언이 포함된 ESM 및 CommonJS 빌드를 제공합니다.

검증과 참조 해제에는 `@powerduck/openapi-parser`를, 프로토콜 구현에는 `@modelcontextprotocol/sdk`를 사용합니다.

## 생성되는 항목

- **Tools** — OpenAPI 작업마다 MCP 도구 하나를 생성합니다. 전체 매개변수 직렬화(path/query/header/cookie 스타일 및 explode 규칙), 요청 본문 인코딩(JSON, form-urlencoded, multipart, 텍스트, 바이너리), MCP 도구 주석(`readOnlyHint`, `destructiveHint`, `idempotentHint`)을 지원합니다.
- **Prompts** — 전역 프롬프트(`spec_overview`, `integration_guardrails`)와 작업별 프롬프트(`explain_*`, `plan_*`, `sample_*`)를 생성합니다.
- **Resources** — `openapi://spec/summary`, `openapi://catalog/tools`, `openapi://spec/document`와 같은 고정 카탈로그 리소스를 제공합니다.

## 전송 방식

- **stdio** — `startStdioServer()`는 Claude Desktop이나 편집기 통합 같은 로컬 MCP 클라이언트에 문서 하나를 제공합니다.
- **HTTP** — `attachMcpRoutes(app, options)`는 Express 앱의 `/mcp`에 Streamable HTTP를 마운트하고, 선택적으로 `/sse`에 기존 SSE를 추가합니다. 옵션으로 세션 수 제한, 유휴 시간 제한, CORS, DNS 리바인딩 방어를 설정합니다. `startAdminServer()`는 관리 UI를 추가하고 기본 세션 제한을 사용합니다. `attachSseRoutes()`는 위치 인수를 받는 사용 중단된 래퍼로 남아 있습니다.

## 관리 서버

`startAdminServer()`는 다음 기능을 제공하는 Express 앱을 시작합니다.

- 명세 업로드·붙여넣기, 도구·프롬프트·리소스 확인, 실행 중인 서비스와 요청 로그 조회를 위한 웹 관리 콘솔
- MCP HTTP 전송
- API 키 인증, 민감한 헤더를 마스킹하는 요청 로깅, 선택적 상태 영속화

## 설치

```bash npm2yarn2pnpm
npm install @powerduck/openapi-mcp-server
```

## 빠른 시작

```bash
openapi-mcp serve --transport web --port 3000 --api-key your-admin-key
```

## 다음 단계

- [설치](../installation/) — npm/yarn/pnpm, 전역 설치, `./server` 하위 경로 및 의존성.
- [빠른 시작](../quickstart/) — CLI 및 코드에서 사용하는 방법.
- [설정](../configuration/) — 전체 `ServerConfig` 설정.
- [API 레퍼런스](../api-reference/) — 모든 내보내기와 CLI 명령.
- [예제](../examples/) — 실용적인 사용 예제.

## 라이선스

MIT.
