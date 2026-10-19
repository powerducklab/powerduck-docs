---
sidebar_position: 2
title: "التثبيت"
description: "ثبّت @powerduck/conf-patch واختر نقطة دخول الملفات لـ Node.js أو المسار ./core الآمن للمتصفح."
---

# التثبيت

ثبّت `@powerduck/conf-patch` بمدير الحزم الذي تفضله.

## المتطلبات

- **Node.js:** `>= 22.12.0`
- **TypeScript:** اختياري؛ تتضمن الحزمة تعريفات الأنواع كاملة دون الحاجة إلى `@types/...`.

## التثبيت

```bash npm2yarn2pnpm
npm install @powerduck/conf-patch
```

```bash
yarn add @powerduck/conf-patch
```

```bash
pnpm add @powerduck/conf-patch
```

## اعتماديات وقت التشغيل

تتضمن conf-patch ثلاث اعتماديات تشغيل تُثبّت تلقائيًا:

| الحزمة | الإصدار | الاستخدام |
|---|---|---|
| `@powerduck/openapi-parser` | `^0.3.12` | التحقق من OpenAPI/Swagger (`validateOpenAPISpec` و`validateOpenAPIFile`). |
| `jsonc-parser` | `^3.3.1` | تعديلات نصية تزايدية على JSON وJSONC. |
| `yaml` | `^2.9.0` | تحليل شجرة AST الخاصة بـ YAML وتعديلها. |

لا تحتاج إلى التعامل مباشرةً مع هذه الاعتماديات.

## نقطتا دخول

تتيح الحزمة **تصديرَين لمسارين فرعيين**. اختر المناسب لبيئتك.

### نقطة الدخول الرئيسية — `@powerduck/conf-patch`

تتضمن **طبقة الملفات** (`readConfigFile` و`writeConfigFile` و`patchConfigFile` و`setConfigValue` و`deleteConfigValue` و`withFileLock` و`releaseAllLocalLocks`)، إضافةً إلى النواة والتحقق من OpenAPI. استخدمها في Node.js وElectron؛ فهي تعتمد على `node:fs` و`node:path` و`node:crypto`.

### المسار الفرعي للنواة — `@powerduck/conf-patch/core`

يصدّر **النواة الآمنة للمتصفح فقط**: `patchContent` و`setContentValue` و`deleteContentValue` وأدوات التأكيد وأنواع النواة. لا يعتمد على Node.js ويمكن تجميعه للمتصفحات وEdge Functions وservice workers.

:::tip
في المتصفح، استورد دائمًا من `@powerduck/conf-patch/core` لإبقاء طبقة الملفات واعتماديتها `node:fs` خارج الحزمة المجمعة.
:::

## نظام الوحدات: CJS وESM

**لا** تضبط الحزمة `"type": "module"`، لذلك تُعامل ملفات `.js` كـ CommonJS افتراضيًا. توجّه خريطة `exports` في `package.json` شرطي `import` و`require` صراحةً إلى البناء الصحيح.

| نقطة الدخول | CJS (`require`) | ESM (`import`) | الأنواع |
|---|---|---|---|
| نقطة الدخول الرئيسية | `dist/index.js` | `dist/index.mjs` | `dist/index.d.ts` |
| المسار الفرعي للنواة | `dist/core.js` | `dist/core.mjs` | `dist/core.d.ts` |

### CommonJS في Node.js أو العملية الرئيسية لـ Electron

```javascript
// Full library (includes file IO)
const { setConfigValue, readConfigFile } = require("@powerduck/conf-patch");

// Core layer only (browser-safe, no fs dependency)
const { patchContent, setContentValue } = require("@powerduck/conf-patch/core");
```

### ES Modules في Node.js الحديث والمتصفحات وأدوات التجميع

```typescript
// Full library
import { setConfigValue, readConfigFile } from "@powerduck/conf-patch";

// Core layer only (browser-safe)
import { patchContent, setContentValue } from "@powerduck/conf-patch/core";
```

## التحقق من التثبيت

```bash
# Check the installed version
npm list @powerduck/conf-patch

# Verify the main entry loads
node -e "const lib = require('@powerduck/conf-patch'); console.log('exports:', Object.keys(lib).length);"

# Verify the core subpath loads
node -e "const core = require('@powerduck/conf-patch/core'); console.log('core exports:', Object.keys(core).length);"
```

## الخطوات التالية

- [البدء السريع](/docs/ar-SA/conf-patch/quickstart/) — عدّل سلسلة في المتصفح وملفًا على القرص.
- [مرجع API](/docs/ar-SA/conf-patch/api-reference/) — جميع العناصر المصدّرة والأنواع والخيارات.
