---
sidebar_position: 2
title: "설치"
description: "npm, yarn 또는 pnpm으로 @powerduck/openapi-codegen을 설치하고 Node.js나 브라우저에서 사용하세요. Node.js 22.12.0 이상이 필요합니다."
---

# 설치

## 요구 사항

- Node.js에서 사용하려면 **Node.js** `>= 22.12.0`이 필요합니다(패키지의 `engines` 필드에 명시).
- 원시 JSON/YAML 문자열이 아닌, JavaScript 객체로 **파싱한** OpenAPI 문서가 필요합니다.
- 브라우저에서 사용하려면 Fetch API를 지원하는 최신 브라우저가 필요합니다.

패키지는 ESM(`dist/index.js`)과 CommonJS(`dist/index.cjs`) 빌드 및 TypeScript 선언을 제공합니다. **런타임 의존성은 없습니다**.

## npm

```bash npm2yarn2pnpm
npm install @powerduck/openapi-codegen
```

## pnpm

```bash npm2yarn2pnpm
pnpm add @powerduck/openapi-codegen
```

## Yarn

```bash npm2yarn2pnpm
yarn add @powerduck/openapi-codegen
```

## Node.js에서 사용

```typescript
import { generate } from "@powerduck/openapi-codegen";
```

CommonJS:

```javascript
const { generate } = require("@powerduck/openapi-codegen");
```

내장 생성기는 **모듈을 가져올 때 자동 등록**되므로 별도 설정 없이 `generate`를 바로 사용할 수 있습니다.

## 브라우저에서 사용

라이브러리는 브라우저와 완전히 호환되며 Node.js 내장 모듈을 사용하지 않습니다. ESM CDN에서 불러와 직접 호출하세요:

```html
<script type="module">
  import { generate, list } from "https://esm.sh/@powerduck/openapi-codegen";

  const document = {
    openapi: "3.1.0",
    info: { title: "Example API", version: "1.0.0" },
    servers: [{ url: "https://api.example.com" }],
    paths: {
      "/hello": { get: { responses: { "200": { description: "OK" } } } },
    },
  };

  const code = generate({
    document,
    path: "/hello",
    method: "get",
    language: "javascript",
    client: "fetch",
  });

  console.log(code);
</script>
```

Vite, esbuild, webpack에서도 바로 사용할 수 있습니다. ESM 빌드는 트리 셰이킹을 지원합니다.

## 문서 전달

파싱한 객체를 전달하세요. JSON 예제:

```typescript
import { readFile } from "node:fs/promises";

const document = JSON.parse(await readFile("./openapi.json", "utf8"));
```

YAML은 별도의 YAML 패키지로 먼저 파싱하세요:

```typescript
import YAML from "yaml";
const document = YAML.parse(await readFile("./openapi.yaml", "utf8"));
```

## 패키지 구조

| 진입점 | 경로 |
|-------|------|
| ESM 진입점 | `dist/index.js` |
| CommonJS 진입점 | `dist/index.cjs` |
| 타입 정의 | `dist/index.d.ts` |

CLI 실행 파일은 제공하지 않습니다. 코드에서만 사용하는 라이브러리입니다.

## 다음 단계

- [빠른 시작](/docs/ko-KR/openapi-codegen/quickstart/) — 첫 코드 예제를 생성하세요.
- [설정](/docs/ko-KR/openapi-codegen/configuration/) — 모든 생성 옵션을 확인하세요.
