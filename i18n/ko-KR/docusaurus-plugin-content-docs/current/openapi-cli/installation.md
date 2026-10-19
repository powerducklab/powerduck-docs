---
sidebar_position: 2
title: "설치"
description: "@powerduck/openapi-cli를 전역 또는 개발 의존성으로 설치하거나 npx로 실행하세요. Node.js 22.12.0 이상이 필요합니다."
---

# 설치

## 요구 사항

- **Node.js**: `>= 22.12.0` (패키지의 `engines` 필드에 명시).
- 패키지 관리자: npm, yarn 또는 pnpm.

패키지는 ESM(`dist/index.js`)과 CommonJS(`dist/index.cjs`) 빌드 및 TypeScript 선언(`dist/index.d.ts`)을 제공합니다. 별도의 `@types` 패키지는 필요하지 않습니다.

## 전역 설치 (CLI 사용에 권장)

전역으로 설치하면 `PATH`에서 `openapi-cli` 실행 파일을 찾을 수 있습니다:

```bash npm2yarn2pnpm
npm install -g @powerduck/openapi-cli
```

실행 파일을 확인하세요:

```bash
openapi-cli --help
```

## 프로젝트 내부 설치 (CI에 권장)

프로젝트에서 버전을 고정해 CI가 알려진 릴리스를 사용하도록 하세요:

```bash npm2yarn2pnpm
npm install --save-dev @powerduck/openapi-cli
```

그런 다음 패키지 관리자로 명령을 실행하세요:

```bash
npx openapi-cli --spec openapi.json
# or
pnpm exec openapi-cli --spec openapi.json
```

## npx로 일회성 실행

미리 설치하지 않고 실행할 수 있습니다:

```bash
npx @powerduck/openapi-cli --spec openapi.json
```

## 패키지 구조

| 진입점 | 경로 |
|-------|------|
| ESM 진입점 | `dist/index.js` |
| CommonJS 진입점 | `dist/index.cjs` |
| 타입 정의 | `dist/index.d.ts` |
| CLI 진입점 (bin) | `dist/cli.js` |
| 실행 파일 이름 | `openapi-cli` |

패키지는 `"type": "module"`을 선언하며 `.`과 `./package.json` 하위 경로만 노출합니다.

## 코드에서 가져오기

```typescript
// ESM
import { runTests, resolveConfig } from "@powerduck/openapi-cli";

// CommonJS
const { runTests, resolveConfig } = require("@powerduck/openapi-cli");
```

## 런타임 의존성

배포된 패키지는 다음 라이브러리에 의존합니다:

- `@powerduck/openapi-parser` (`^0.3.12`) — 내부 `$ref` 참조 해석.
- `@powerduck/openapi-request` (`0.2.22`) — 프로토콜 요청 실행.
- `commander` (`^12.1.0`) — CLI 인수 분석.
- `https-proxy-agent` (`^5.0.1`) — HTTP 전송의 프록시 지원.

## 다음 단계

- [빠른 시작](/docs/ko-KR/openapi-cli/quickstart/) — 첫 테스트 스위트를 실행하세요.
- [명령어](/docs/ko-KR/openapi-cli/commands/) — 전체 옵션 레퍼런스를 확인하세요.
