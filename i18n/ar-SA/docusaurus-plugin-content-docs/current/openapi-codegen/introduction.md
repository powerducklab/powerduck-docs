---
sidebar_position: 1
title: "مقدمة"
description: "ولّد أمثلة HTTP قابلة للتنفيذ من OpenAPI باستخدام @powerduck/openapi-codegen: 21 لغة و41 عميلًا، متوافق مع المتصفح وبدون تبعيات وقت تشغيل."
---

# مقدمة

`@powerduck/openapi-codegen` مكتبة TypeScript تحوّل عملية OpenAPI إلى **مثال طلب HTTP قابل للتنفيذ** باللغة وعميل HTTP اللذين تختارهما. صُممت لمواقع توثيق API وبوابات المطورين ومستكشفات API وأدوات CLI وتوليد الشيفرة أثناء البناء.

تدعم **21 لغة** و**41 تركيبة لغة/عميل**، وهي **متوافقة مع المتصفح** و**لا تحتاج إلى تبعيات وقت تشغيل**.

## لماذا openapi-codegen؟

- **بلا تبعيات وقت تشغيل** — تعمل في المتصفح وNode.js وElectron وبيئات الحافة دون وحدات Node المدمجة.
- **تنسيقا وحدات** — نسخ ESM أصلية وCommonJS (`require()`).
- **OpenAPI 3.0 / 3.1 / 3.2** — تعالج كائن مستند محلّلًا. تدعم JSON وYAML بعد تحليلهما قبل استدعاء `generate()`.
- **41 مولّدًا مدمجًا** تغطي 21 لغة وتُسجّل تلقائيًا عند الاستيراد.
- **تسلسل كامل للمعاملات** — معاملات المسار والاستعلام والترويسة وملفات الارتباط وفق قواعد OpenAPI: `style` / `explode` / `allowReserved`.
- **مخططات الأمان** — مفتاح API في header/query/cookie، وHTTP bearer، وHTTP basic.
- **أنواع الجسم** — JSON ونص عادي ونموذج مرمّز بعنوان URL و`multipart/form-data`.
- **حل `$ref`** — مراجع JSON Pointer داخل المستند مع التخزين المؤقت والتسلسل وكشف الدورات.
- **أمثلة تلقائية** — تستنتج القيم من JSON Schema: `example` و`enum` و`default` والأنواع والتنسيقات والقيود.
- **نظام إضافات** — سجّل مولّدات مخصصة عبر `register()` أو `use()`.

## آلية العمل

```
OpenAPI document  ──normalize──▶  RequestIR  ──generator.generate()──▶  source code string
```

1. تحل `normalize` مراجع `$ref`، وتدمج معاملات المسار والعملية، وتختار نوع وسائط جسم الطلب، وتولّد قيم الأمثلة، وتحل مخططات الأمان، ثم تنتج `RequestIR` موحّد البنية.
2. يتلقى `Generator` المحدد كائن `RequestIR` ويعيد الشيفرة المصدرية القابلة للتنفيذ كنص.

عادةً يكفي استدعاء `generate({...})` لتنفيذ الخطوتين.

## مثال أساسي

```typescript
import { generate } from "@powerduck/openapi-codegen";

const code = generate({
  document,                 // parsed OpenAPI object
  path: "/users/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
});

console.log(code);          // a runnable fetch() snippet
```

## الخطوات التالية

- [التثبيت](/docs/ar-SA/openapi-codegen/installation/) — npm / yarn / pnpm والاستخدام في المتصفح.
- [البدء السريع](/docs/ar-SA/openapi-codegen/quickstart/) — توليد أول مقطع وعرض قائمة المولّدات.
- [الإعدادات](/docs/ar-SA/openapi-codegen/configuration/) — `GenerateOptions` و`RequestIR` و`Generator` و`Plugin`.
- [مرجع API](/docs/ar-SA/openapi-codegen/api-reference/) — جميع العناصر المصدَّرة وقائمة اللغات والعملاء الكاملة.
- [أمثلة](/docs/ar-SA/openapi-codegen/examples/) — fetch وPython requests وcURL والمولّدات المخصصة والإضافات واستخدام `RequestIR` مباشرة.
