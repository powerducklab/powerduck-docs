---
sidebar_position: 3
title: "البدء السريع"
description: "أنشئ أول مثال طلب قابل للتنفيذ باستخدام @powerduck/openapi-codegen واستعرض المولدات المتاحة."
---

# البدء السريع

يوضح هذا الدليل كيفية إنشاء مثال طلب قابل للتنفيذ والعثور على المولدات المتاحة.

## 1. التثبيت

```bash npm2yarn2pnpm
npm install @powerduck/openapi-codegen
```

## 2. الإنشاء من مستند

مرّر مستند OpenAPI **بعد تحليله** مع `path` و`method` و`language` و`client` المطلوبة. تعيد `generate()` الشيفرة المصدرية كسلسلة نصية.

```typescript
import { generate } from "@powerduck/openapi-codegen";
import document from "./openapi.json" with { type: "json" };

const code = generate({
  document,
  path: "/pets/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
});

console.log(code);
```

المثال المكافئ باستخدام CommonJS:

```javascript
const { generate } = require("@powerduck/openapi-codegen");
const fs = require("node:fs");

const document = JSON.parse(fs.readFileSync("./openapi.json", "utf8"));

const code = generate({
  document,
  path: "/pets",
  method: "post",
  language: "python",
  client: "requests",
});

console.log(code);
```

## 3. عرض المولدات المتاحة

تعيد `list()` واصفات جميع المولدات المسجلة:

```typescript
import { list } from "@powerduck/openapi-codegen";

for (const { language, client } of list()) {
  console.log(`${language}/${client}`);
}
```

صيغة كل واصف هي `{ language: string; client: string }`. المعرّفات حساسة لحالة الأحرف؛ استخدم القيم كما ترد تمامًا في قائمة المولدات ضمن مرجع API. [مرجع API](/docs/ar-SA/openapi-codegen/api-reference/#built-in-generators-21-languages-41-clients).

يمكنك أيضًا اختيار مولد برمجيًا:

```typescript
import { generate, list } from "@powerduck/openapi-codegen";

const picked = list().find(
  (g) => g.language === "javascript" && g.client === "fetch",
);

if (!picked) throw new Error("Generator not available");

const code = generate({
  document,
  path: "/pets",
  method: "get",
  language: picked.language,
  client: picked.client,
});
```

## 4. توفير بيانات الاعتماد

استخدم `securityValues` لتوفير قيم مخططات الأمان المسماة. يجب أن تطابق المفاتيح أسماء المخططات في المستند:

```typescript
const code = generate({
  document,
  path: "/pets/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
  securityValues: {
    bearerAuth: "YOUR_ACCESS_TOKEN",
    apiKey: "YOUR_API_KEY",
  },
});
```

## 5. تجاوز عنوان URL للخادم

```typescript
const code = generate({
  document,
  path: "/pets",
  method: "get",
  language: "shell",
  client: "curl",
  serverUrl: "https://staging.example.com/v1",
});
```

## معالجة الأخطاء

ترمي `generate()` استثناءً عند نقص المدخلات أو عدم دعم المولد. التقط الاستثناءات عند معالجة مستندات غير موثوقة:

```typescript
try {
  const code = generate({
    document,
    path: "/pets/{id}",
    method: "get",
    language: "javascript",
    client: "fetch",
  });
  console.log(code);
} catch (error) {
  console.error("Generation failed:", error instanceof Error ? error.message : error);
}
```

## الخطوات التالية

- [الإعدادات](/docs/ar-SA/openapi-codegen/configuration/) — `GenerateOptions`, `RequestIR`, `Generator`, `Plugin`.
- [أمثلة](/docs/ar-SA/openapi-codegen/examples/) — JavaScript fetch وPython requests وcURL ومولد مخصص وإضافة واستخدام `RequestIR` مباشرةً.
- [مرجع API](/docs/ar-SA/openapi-codegen/api-reference/) — جميع العناصر المصدّرة.
