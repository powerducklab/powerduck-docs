---
sidebar_position: 2
title: "التثبيت"
description: "ثبّت @powerduck/openapi-cli على مستوى النظام أو كاعتمادية تطوير، أو شغّله باستخدام npx. يتطلب Node.js 22.12.0 أو أحدث."
---

# التثبيت

## المتطلبات

- **Node.js**: `>= 22.12.0` (محدد في حقل `engines` الخاص بالحزمة).
- مدير حزم: npm أو yarn أو pnpm.

تتضمن الحزمة بنيتي ESM (`dist/index.js`) وCommonJS (`dist/index.cjs`)، مع تعريفات TypeScript (`dist/index.d.ts`). لا تحتاج إلى حزم `@types` إضافية.

## التثبيت على مستوى النظام (موصى به لسطر الأوامر)

يتيح التثبيت على مستوى النظام الوصول إلى الملف التنفيذي `openapi-cli` عبر `PATH`:

```bash npm2yarn2pnpm
npm install -g @powerduck/openapi-cli
```

تحقق من الملف التنفيذي:

```bash
openapi-cli --help
```

## التثبيت داخل المشروع (موصى به للتكامل المستمر)

ثبّت الإصدار داخل المشروع ليستخدم التكامل المستمر إصدارًا معروفًا:

```bash npm2yarn2pnpm
npm install --save-dev @powerduck/openapi-cli
```

ثم شغّل الأمر عبر مدير الحزم:

```bash
npx openapi-cli --spec openapi.json
# or
pnpm exec openapi-cli --spec openapi.json
```

## تشغيل لمرة واحدة باستخدام npx

دون تثبيت مسبق:

```bash
npx @powerduck/openapi-cli --spec openapi.json
```

## بنية الحزمة

| نقطة الدخول | المسار |
|-------|------|
| نقطة دخول ESM | `dist/index.js` |
| نقطة دخول CommonJS | `dist/index.cjs` |
| تعريفات الأنواع | `dist/index.d.ts` |
| نقطة دخول CLI (bin) | `dist/cli.js` |
| اسم الملف التنفيذي | `openapi-cli` |

تعلن الحزمة `"type": "module"` وتتيح فقط المسارين الفرعيين `.` و`./package.json`.

## الاستيراد في الشيفرة

```typescript
// ESM
import { runTests, resolveConfig } from "@powerduck/openapi-cli";

// CommonJS
const { runTests, resolveConfig } = require("@powerduck/openapi-cli");
```

## اعتماديات وقت التشغيل

تعتمد الحزمة المنشورة على:

- `@powerduck/openapi-parser` (`^0.3.12`) — حل مراجع `$ref` الداخلية.
- `@powerduck/openapi-request` (`0.2.22`) — تنفيذ طلبات البروتوكولات.
- `commander` (`^12.1.0`) — تحليل وسيطات سطر الأوامر.
- `https-proxy-agent` (`^5.0.1`) — دعم الوكيل لنقل HTTP.

## الخطوات التالية

- [البدء السريع](/docs/ar-SA/openapi-cli/quickstart/) — شغّل مجموعة الاختبارات الأولى.
- [الأوامر](/docs/ar-SA/openapi-cli/commands/) — المرجع الكامل للخيارات.
