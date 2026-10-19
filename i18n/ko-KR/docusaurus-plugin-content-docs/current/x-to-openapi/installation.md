---
sidebar_position: 2
title: "설치"
description: "npm, yarn 또는 pnpm으로 @powerduck/x-to-openapi를 설치하세요. ESM과 CommonJS를 지원하며 설정 없이 curlToOpenApi와 postmanToOpenApi를 사용할 수 있습니다."
---

# 설치

원하는 패키지 관리자로 `@powerduck/x-to-openapi`를 설치하세요.

## 요구 사항

- **Node.js:** `>= 22.12.0`
- **TypeScript:** 선택 사항이며, 패키지에 전체 타입 정의가 포함됩니다.

## 설치

```bash npm2yarn2pnpm
npm install @powerduck/x-to-openapi
```

```bash
yarn add @powerduck/x-to-openapi
```

```bash
pnpm add @powerduck/x-to-openapi
```

## 런타임 의존성

| 패키지 | 버전 | 용도 |
|---|---|---|
| `@powerduck/openapi-parser` | `^0.3.12` | 표준 OpenAPI 타입 및 출력 검증 |
| `curlconverter` | `^4.12.0` | curl 명령을 구조화된 요청으로 파싱 |

두 의존성은 자동으로 설치됩니다.

---

## 모듈 시스템: ESM 기본, CJS 호환

패키지는 `"type": "module"`을 선언하며 하나의 진입점에서 두 빌드를 제공합니다:

| 빌드 | 조건 | 파일 |
|---|---|---|
| ESM | `import` | `./dist/index.js` |
| CommonJS | `require` | `./dist/index.cjs` |
| 타입 | — | `./dist/index.d.ts` |

```typescript
// ESM (Node.js, bundlers)
import { curlToOpenApi, postmanToOpenApi } from "@powerduck/x-to-openapi";
```

```javascript
// CommonJS (require)
const { curlToOpenApi, postmanToOpenApi } = require("@powerduck/x-to-openapi");
```

패키지가 `"sideEffects": false`를 선언하므로 트리 셰이킹으로 사용하지 않는 어댑터를 제거할 수 있습니다.

---

## 설정이 필요 없는 도우미 함수

대부분 두 함수만 있으면 됩니다. 이 함수들은 [`XToOpenApi`](/docs/ko-KR/x-to-openapi/api-reference/#xtoopenapi) 인스턴스를 만들고 해당 어댑터를 등록한 뒤 `convert`를 호출합니다:

```typescript
import {
  curlToOpenApi,    // string | string[]  → OpenAPI 3.2
  postmanToOpenApi, // collection object | JSON string → OpenAPI 3.2
} from "@powerduck/x-to-openapi";
```

사용자 지정 옵션, 여러 어댑터, `"auto"` 감지 또는 사용자 지정 어댑터가 필요하면 전체 [`XToOpenApi`](/docs/ko-KR/x-to-openapi/api-reference/#xtoopenapi) 클래스를 사용하세요.

---

## 설치 확인

```bash
# Check the installed version
npm list @powerduck/x-to-openapi

# Verify the package loads and the helpers exist
node -e "const x = require('@powerduck/x-to-openapi'); console.log(typeof x.curlToOpenApi, typeof x.postmanToOpenApi, typeof x.XToOpenApi);"
```

---

## 다음 단계

- [빠른 시작](/docs/ko-KR/x-to-openapi/quickstart/) — curl 명령과 Postman 컬렉션을 변환하고 사용자 지정 어댑터를 등록하세요.
- [API 레퍼런스](/docs/ko-KR/x-to-openapi/api-reference/) — 모든 내보내기 항목과 옵션을 확인하세요.
