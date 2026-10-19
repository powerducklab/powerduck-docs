---
sidebar_position: 2
title: "설치"
description: "@powerduck/conf-patch를 설치하고 Node.js용 파일 진입점과 브라우저용 ./core 하위 경로를 선택합니다."
---

# 설치

원하는 패키지 관리자로 `@powerduck/conf-patch`를 설치하세요.

## 요구 사항

- **Node.js:** `>= 22.12.0`
- **TypeScript:** 선택 사항입니다. 패키지에 전체 타입 선언이 포함되어 있어 `@types/...`는 필요하지 않습니다.

## 설치

```bash npm2yarn2pnpm
npm install @powerduck/conf-patch
```

```bash
yarn add @powerduck/conf-patch
```

```bash
pnpm add @powerduck/conf-patch
```

## 런타임 의존성

conf-patch에는 자동으로 설치되는 런타임 의존성 세 개가 있습니다.

| 패키지 | 버전 | 용도 |
|---|---|---|
| `@powerduck/openapi-parser` | `^0.3.12` | OpenAPI/Swagger 검증(`validateOpenAPISpec`, `validateOpenAPIFile`). |
| `jsonc-parser` | `^3.3.1` | JSON 및 JSONC의 증분 텍스트 편집. |
| `yaml` | `^2.9.0` | YAML AST 파싱 및 수정. |

이 의존성을 직접 사용할 필요는 없습니다.

## 두 가지 진입점

패키지는 **두 개의 하위 경로 내보내기**를 제공합니다. 실행 환경에 맞게 선택하세요.

### 기본 진입점 — `@powerduck/conf-patch`

**파일 계층**(`readConfigFile`, `writeConfigFile`, `patchConfigFile`, `setConfigValue`, `deleteConfigValue`, `withFileLock`, `releaseAllLocalLocks`), 핵심 계층, OpenAPI 검증을 포함합니다. Node.js와 Electron에서 사용하며 `node:fs`, `node:path`, `node:crypto`에 의존합니다.

### 핵심 하위 경로 — `@powerduck/conf-patch/core`

**브라우저에서 안전하게 사용할 수 있는 핵심 계층만** 내보냅니다. `patchContent`, `setContentValue`, `deleteContentValue`, 검증 헬퍼와 핵심 타입이 포함됩니다. Node.js 의존성이 없으며 브라우저, Edge Functions, 서비스 워커에 번들링할 수 있습니다.

:::tip
브라우저용 코드는 항상 `@powerduck/conf-patch/core`에서 가져오세요. 파일 계층과 `node:fs` 의존성이 번들에 포함되지 않습니다.
:::

## 모듈 시스템: CJS와 ESM

패키지는 `"type": "module"`을 **설정하지 않으므로** `.js` 파일이 기본적으로 CommonJS로 처리됩니다. `package.json`의 `exports` 맵이 `import`와 `require` 조건을 올바른 빌드에 연결합니다.

| 진입점 | CJS (`require`) | ESM (`import`) | 타입 |
|---|---|---|---|
| 기본 진입점 | `dist/index.js` | `dist/index.mjs` | `dist/index.d.ts` |
| 핵심 하위 경로 | `dist/core.js` | `dist/core.mjs` | `dist/core.d.ts` |

### CommonJS(Node.js / Electron 메인 프로세스)

```javascript
// Full library (includes file IO)
const { setConfigValue, readConfigFile } = require("@powerduck/conf-patch");

// Core layer only (browser-safe, no fs dependency)
const { patchContent, setContentValue } = require("@powerduck/conf-patch/core");
```

### ES Modules(최신 Node.js / 브라우저 / 번들러)

```typescript
// Full library
import { setConfigValue, readConfigFile } from "@powerduck/conf-patch";

// Core layer only (browser-safe)
import { patchContent, setContentValue } from "@powerduck/conf-patch/core";
```

## 설치 확인

```bash
# Check the installed version
npm list @powerduck/conf-patch

# Verify the main entry loads
node -e "const lib = require('@powerduck/conf-patch'); console.log('exports:', Object.keys(lib).length);"

# Verify the core subpath loads
node -e "const core = require('@powerduck/conf-patch/core'); console.log('core exports:', Object.keys(core).length);"
```

## 다음 단계

- [빠른 시작](/docs/ko-KR/conf-patch/quickstart/) — 브라우저의 문자열과 디스크의 파일을 수정합니다.
- [API 참조](/docs/ko-KR/conf-patch/api-reference/) — 모든 내보내기 항목, 타입, 옵션.
