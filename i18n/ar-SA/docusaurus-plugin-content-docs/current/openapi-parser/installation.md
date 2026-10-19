---
sidebar_position: 2
title: "التثبيت"
description: "ثبّت @powerduck/openapi-parser وتحقق من نسختَي ESM وCJS."
---

# التثبيت

```bash npm2yarn2pnpm
npm install @powerduck/openapi-parser
```

يتطلب Node.js 22.12.0 أو إصدارًا أحدث.

## بنية الحزمة

```
@powerduck/openapi-parser
├── dist/index.js       # ESM build
├── dist/index.cjs      # CJS build (require())
└── dist/index.d.ts     # TypeScript declarations
```

## ESM (Node.js 22.12.0 أو أحدث، وأدوات التجميع الحديثة)

```typescript
import { upgradeOasTo32 } from "@powerduck/openapi-parser";
```

## CommonJS (العملية الرئيسية في Electron)

```javascript
const { upgradeOasTo32 } = require("@powerduck/openapi-parser");
```

## بلا اعتماديات نظيرة

لا توجد اعتماديات نظيرة لهذه الحزمة. تُضمَّن `@scalar/openapi-parser` و`@scalar/openapi-upgrader` داخل الحزمة.
