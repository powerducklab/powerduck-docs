---
sidebar_position: 2
title: "التثبيت"
description: "ثبّت @powerduck/x-to-openapi باستخدام npm أو yarn أو pnpm. يدعم ESM وCommonJS ويوفر curlToOpenApi وpostmanToOpenApi دون إعداد."
---

# التثبيت

ثبّت `@powerduck/x-to-openapi` باستخدام مدير الحزم الذي تفضله.

## المتطلبات

- **Node.js:** `>= 22.12.0`
- **TypeScript:** اختياري؛ تتضمن الحزمة تعريفات الأنواع كاملة.

## التثبيت

```bash npm2yarn2pnpm
npm install @powerduck/x-to-openapi
```

```bash
yarn add @powerduck/x-to-openapi
```

```bash
pnpm add @powerduck/x-to-openapi
```

## اعتماديات وقت التشغيل

| الحزمة | الإصدار | الاستخدام |
|---|---|---|
| `@powerduck/openapi-parser` | `^0.3.12` | أنواع OpenAPI القياسية والتحقق من المخرجات |
| `curlconverter` | `^4.12.0` | تحليل أوامر curl إلى طلبات منظّمة |

تُثبّت الاعتماديتان تلقائيًا.

---

## نظام الوحدات: ESM مع دعم CJS

تعلن الحزمة `"type": "module"` وتوفر البنيتين من نقطة دخول واحدة:

| البنية | الشرط | الملف |
|---|---|---|
| ESM | `import` | `./dist/index.js` |
| CommonJS | `require` | `./dist/index.cjs` |
| الأنواع | — | `./dist/index.d.ts` |

```typescript
// ESM (Node.js, bundlers)
import { curlToOpenApi, postmanToOpenApi } from "@powerduck/x-to-openapi";
```

```javascript
// CommonJS (require)
const { curlToOpenApi, postmanToOpenApi } = require("@powerduck/x-to-openapi");
```

تعلن الحزمة `"sideEffects": false`، مما يسمح بحذف المحولات غير المستخدمة عبر tree shaking.

---

## دوال مساعدة دون إعداد

يحتاج معظم المستخدمين إلى دالتين فقط. تنشئان مثيلاً من [`XToOpenApi`](/docs/ar-SA/x-to-openapi/api-reference/#xtoopenapi)، وتسجلان المحول المناسب، ثم تستدعيان `convert`:

```typescript
import {
  curlToOpenApi,    // string | string[]  → OpenAPI 3.2
  postmanToOpenApi, // collection object | JSON string → OpenAPI 3.2
} from "@powerduck/x-to-openapi";
```

استخدم الفئة [`XToOpenApi`](/docs/ar-SA/x-to-openapi/api-reference/#xtoopenapi) كاملةً عندما تحتاج إلى خيارات مخصصة أو عدة محولات أو كشف `"auto"` أو محول مخصص.

---

## التحقق

```bash
# Check the installed version
npm list @powerduck/x-to-openapi

# Verify the package loads and the helpers exist
node -e "const x = require('@powerduck/x-to-openapi'); console.log(typeof x.curlToOpenApi, typeof x.postmanToOpenApi, typeof x.XToOpenApi);"
```

---

## الخطوات التالية

- [البدء السريع](/docs/ar-SA/x-to-openapi/quickstart/) — حوّل أمر curl ومجموعة Postman، وسجّل محولاً مخصصًا.
- [مرجع API](/docs/ar-SA/x-to-openapi/api-reference/) — جميع الصادرات والخيارات.
