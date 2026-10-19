---
sidebar_position: 2
title: "설치"
description: "@powerduck/openapi-parser를 설치하고 ESM/CJS 빌드를 확인합니다."
---

# 설치

```bash npm2yarn2pnpm
npm install @powerduck/openapi-parser
```

Node.js 22.12.0 이상이 필요합니다.

## 패키지 구조

```
@powerduck/openapi-parser
├── dist/index.js       # ESM build
├── dist/index.cjs      # CJS build (require())
└── dist/index.d.ts     # TypeScript declarations
```

## ESM(Node.js 22.12.0 이상, 최신 번들러)

```typescript
import { upgradeOasTo32 } from "@powerduck/openapi-parser";
```

## CommonJS(Electron 메인 프로세스)

```javascript
const { upgradeOasTo32 } = require("@powerduck/openapi-parser");
```

## 피어 의존성 없음

이 패키지에는 피어 의존성이 없습니다. `@scalar/openapi-parser`와 `@scalar/openapi-upgrader`는 내부에 번들로 포함되어 있습니다.
