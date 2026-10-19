---
sidebar_position: 2
title: "التثبيت"
description: "ثبّت @powerduck/openapi-codegen باستخدام npm أو yarn أو pnpm واستخدمه في Node.js أو المتصفح. يتطلب Node.js 22.12.0 أو أحدث."
---

# التثبيت

## المتطلبات

- لاستخدام Node.js، يلزم **Node.js** بالإصدار `>= 22.12.0` (محدد في حقل `engines` الخاص بالحزمة).
- مستند OpenAPI **محلّل مسبقًا** على هيئة كائن JavaScript، وليس سلسلة JSON/YAML خام.
- للاستخدام في المتصفح، يلزم متصفح حديث يدعم Fetch API.

تتضمن الحزمة بنيتي ESM (`dist/index.js`) وCommonJS (`dist/index.cjs`) مع تعريفات TypeScript. ليس لها **أي اعتماديات وقت تشغيل**.

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

## الاستخدام في Node.js

```typescript
import { generate } from "@powerduck/openapi-codegen";
```

CommonJS:

```javascript
const { generate } = require("@powerduck/openapi-codegen");
```

تُسجّل المولدات المضمّنة **تلقائيًا عند استيراد الوحدة**، لذا يعمل `generate` مباشرةً دون إعداد إضافي.

## الاستخدام في المتصفح

المكتبة متوافقة تمامًا مع المتصفح ولا تستخدم وحدات Node.js المضمّنة. حمّلها من شبكة CDN تدعم ESM واستدعها مباشرةً:

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

تعمل أيضًا مع Vite وesbuild وwebpack دون إعداد إضافي، وتدعم بنية ESM حذف الشيفرة غير المستخدمة عبر tree shaking.

## تمرير المستند

مرّر كائنًا محلّلًا مسبقًا. في حالة JSON:

```typescript
import { readFile } from "node:fs/promises";

const document = JSON.parse(await readFile("./openapi.json", "utf8"));
```

في حالة YAML، حلّل المحتوى أولاً باستخدام حزمة YAML مستقلة:

```typescript
import YAML from "yaml";
const document = YAML.parse(await readFile("./openapi.yaml", "utf8"));
```

## بنية الحزمة

| نقطة الدخول | المسار |
|-------|------|
| نقطة دخول ESM | `dist/index.js` |
| نقطة دخول CommonJS | `dist/index.cjs` |
| تعريفات الأنواع | `dist/index.d.ts` |

لا يوجد ملف تنفيذي لسطر الأوامر؛ تُستخدم هذه المكتبة من الشيفرة فقط.

## الخطوات التالية

- [البدء السريع](/docs/ar-SA/openapi-codegen/quickstart/) — أنشئ أول مقتطف برمجي.
- [الإعدادات](/docs/ar-SA/openapi-codegen/configuration/) — جميع خيارات التوليد.
