---
sidebar_position: 2
title: "설치"
description: "npm, yarn, pnpm 또는 전역 설치로 @powerduck/openapi-mcp-server를 사용하세요. openapi-mcp CLI, ./server 하위 경로와 런타임 의존성을 설명합니다. Node.js 22.12.0 이상이 필요합니다."
---

# 설치

## 요구 사항

- **Node.js `>=22.12.0`** (`engines`에 명시).

## 설치

```bash npm2yarn2pnpm
npm install @powerduck/openapi-mcp-server
```

Yarn:

```bash
yarn add @powerduck/openapi-mcp-server
```

pnpm:

```bash
pnpm add @powerduck/openapi-mcp-server
```

## CLI

패키지는 `openapi-mcp` 실행 파일을 등록합니다.

```bash
# global install
npm install -g @powerduck/openapi-mcp-server

# or run without installing
npx --package @powerduck/openapi-mcp-server openapi-mcp --help
```

CLI는 `serve` 명령 하나를 제공합니다([빠른 시작](/docs/ko-KR/openapi-mcp-server/quickstart/) 참조).

## ESM / CommonJS

두 빌드 형식에 타입 선언이 포함됩니다. 별도의 `@types/*`는 필요하지 않습니다:

```javascript
// ESM
import { buildMcpServer, startStdioServer } from "@powerduck/openapi-mcp-server";

// CommonJS
const { buildMcpServer, startStdioServer } = require("@powerduck/openapi-mcp-server");
```

## 하위 경로 내보내기

| 가져오기 경로 | 내용 |
| --- | --- |
| `@powerduck/openapi-mcp-server` | 핵심 라이브러리: 명세 로딩, 도구·프롬프트·리소스 생성, 요청 실행, MCP 서버 구성, stdio 및 HTTP 전송. |
| `@powerduck/openapi-mcp-server/server` | 관리용 HTTP 서버 및 인증 미들웨어(`startAdminServer`, `createAuthMiddleware`). |

## 런타임 의존성

다음 의존성은 패키지와 함께 자동으로 설치됩니다:

- `@modelcontextprotocol/sdk` — MCP 프로토콜 구현.
- `@powerduck/openapi-parser` — OpenAPI 검증, 참조 해석 및 업그레이드.
- `express` 및 `cors` — 관리용 HTTP 서버와 CORS.
- `axios` — 도구 실행 시 상위 서비스에 요청하는 HTTP 클라이언트.
- `commander` — CLI 프레임워크.
- `js-yaml` — YAML 분석.
- `multer` — 명세 업로드 처리.
- `terser` — 내장 Web UI 자산 최소화.

## 설치 확인

```bash
npx --package @powerduck/openapi-mcp-server openapi-mcp --help
```

## 다음 단계

- [빠른 시작](/docs/ko-KR/openapi-mcp-server/quickstart/)
- [설정](/docs/ko-KR/openapi-mcp-server/configuration/)
