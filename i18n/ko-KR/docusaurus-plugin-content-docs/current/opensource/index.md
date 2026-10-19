---
sidebar_position: 1
title: "오픈 소스 라이브러리"
description: "@powerduck/* npm 패키지는 데스크톱과 Cloud의 기반입니다. 파싱·업그레이드, 다중 프로토콜 CLI, 코드 생성, MCP, 요청 실행, 변환, 임베드 가능한 편집기와 뷰어를 제공합니다."
---

# 오픈 소스 라이브러리

Powerduck은 작고 조합 가능한 npm 패키지로 구성됩니다. 데스크톱 클라이언트와 클라우드 서비스가 같은 라이브러리를 사용하므로 동일한 기능을 로컬, 네트워크 또는 자체 도구에서 실행할 수 있습니다.

각 패키지는 독립적으로 배포되며 자체 설치 안내, API 레퍼런스, 예제를 제공합니다. 이 페이지에서는 각 패키지의 역할과 구성 관계를 설명합니다.

## 계층 구조

```text
Powerduck / Cloud
        ↓
임베드 가능한 UI
        ↓
워크플로
        ↓
기반
```

파서와 변환기가 기반을 이루고 그 위에 워크플로, 최상위에 임베드 가능한 UI가 놓입니다. 각 패키지에서 파싱을 다시 구현하지 않고 공통 기반을 사용하므로 동작이 일관됩니다.

## 패키지 목록

### 기반

| 패키지 | 용도 |
|---|---|
| [`@powerduck/openapi-parser`](../openapi-parser/introduction.md) | OpenAPI/Swagger 문서 파싱, 검증, 업그레이드 |
| [`@powerduck/conf-patch`](../conf-patch/introduction.md) | 구조화되고 검증된 설정 패치 적용 |
| [`@powerduck/x-to-openapi`](../x-to-openapi/introduction.md) | cURL, Postman 등의 형식을 OpenAPI로 변환 |

### 워크플로

| 패키지 | 용도 |
|---|---|
| [`@powerduck/openapi-cli`](../openapi-cli/introduction.md) | 시나리오 실행을 포함한 다중 프로토콜 명령줄 워크플로 |
| [`@powerduck/openapi-codegen`](../openapi-codegen/introduction.md) | 명세에서 클라이언트 코드와 기타 산출물 생성 |
| [`@powerduck/openapi-mcp-server`](../openapi-mcp-server/introduction.md) | OpenAPI 명세를 MCP 서버로 제공 |
| [`@powerduck/openapi-request`](../openapi-request/introduction.md) | 명세에 정의된 요청 실행 |

### 임베드 가능한 UI

| 패키지 | 용도 |
|---|---|
| [`@powerduck/oas-document`](../oas-document/introduction.md) | OpenAPI를 읽기 쉬운 문서로 렌더링하며 React 진입점 제공 |
| [`@powerduck/md-editor`](../md-editor/introduction.md) | 임베드 가능한 Markdown 편집기 |
| [`@powerduck/schema-editor`](../schema-editor/introduction.md) | 임베드 가능한 JSON Schema 편집기 |
| [`@powerduck/tree`](../tree/introduction.md) | 구조화된 데이터용 트리 컴포넌트 |
| [`@powerduck/workspace-yaml`](../workspace-yaml/introduction.md) | 워크스페이스 YAML 통합 |

## 적합한 패키지 선택

- **OpenAPI 파일 읽기, 검증, 업그레이드:** `openapi-parser`로 시작하세요.
- **cURL 또는 Postman 컬렉션을 OpenAPI로 변환:** `x-to-openapi`를 사용하세요.
- **명령줄이나 CI에서 시나리오 또는 다중 프로토콜 워크플로 실행:** `openapi-cli`를 사용하세요.
- **클라이언트 코드 생성:** `openapi-codegen`을 사용하세요.
- **API를 AI 에이전트의 도구로 공개:** `openapi-mcp-server`를 사용하세요.
- **렌더링된 문서를 React 앱에 삽입:** `oas-document`의 React 진입점과 CSS를 사용하세요.
- **편집기 삽입:** `md-editor` 또는 `schema-editor`를 사용하세요.

## 에이전트와 기능 공유

MCP 서버 패키지는 외부 AI 에이전트가 Powerduck의 기능을 사용할 수 있게 합니다. `openapi-mcp-server`로 제공한 명세는 작업을 MCP 도구로 공개하므로 문서와 코드 생성에 쓰이는 동일한 계약을 에이전트가 직접 호출할 수 있습니다. 데스크톱 클라이언트, Cloud, 다른 MCP 호환 도구가 하나의 기준 정의를 공유합니다.

## 예제 안내

각 페이지의 코드 예제는 패키지의 실제 API에 맞춰 작성되었으며 그대로 실행하도록 구성됩니다. 패키지를 업그레이드했다면 이전 버전의 코드를 복사하기보다 릴리스 노트에서 현재 매개변수를 확인하세요.

사이드바에서 각 패키지의 설치, 설정, 전체 API 레퍼런스를 확인할 수 있습니다.
