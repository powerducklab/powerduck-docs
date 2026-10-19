---
sidebar_position: 3
title: "البدء السريع"
description: "ابدأ مع @powerduck/conf-patch: عدّل نصوص JSON وYAML في النواة المتوافقة مع المتصفح، ثم عدّل الملفات باستخدام Node.js أو Electron."
---

# البدء السريع

يشرح هذا الدليل الطبقتين بالترتيب: **النواة** التي تعالج النصوص وتعمل في أي بيئة، ثم **طبقة الملفات** التي تتعامل مع ملفات فعلية في Node.js أو Electron.

المتطلب السابق: ثبّت الحزمة أولًا. [التثبيت](/docs/ar-SA/conf-patch/installation/)

## 1. النواة — تعديل نص في المتصفح

استورد من `@powerduck/conf-patch/core`. لا يجري الوصول إلى نظام الملفات؛ بل يُعاد المحتوى الجديد كنص يمكنك حفظه في localStorage أو IndexedDB أو ثابت نصي أو أي موضع آخر.

```typescript
import {
  patchContent,
  setContentValue,
  deleteContentValue,
} from "@powerduck/conf-patch/core";

// --- JSON: apply multiple RFC 6902 operations ---
const json = JSON.stringify({ name: "my-app", version: "1.0.0" }, null, 2);

const updatedJson = patchContent(
  json,
  [
    { op: "add", path: ["description"], value: "My awesome application" },
    { op: "replace", path: ["version"], value: "1.1.0" },
  ],
  "json",
);

console.log(updatedJson);
// {
//   "name": "my-app",
//   "version": "1.1.0",
//   "description": "My awesome application"
// }

// Store it however you like — no fs required.
localStorage.setItem("config", updatedJson);
```

### الفكرة نفسها مع YAML

```typescript
import { setContentValue, deleteContentValue } from "@powerduck/conf-patch/core";

// Set a nested value in YAML (the "server" parent already exists).
const yaml = "name: my-app\nserver:\n  host: localhost\n";

const updatedYaml = setContentValue(yaml, ["server", "port"], 8080, "yaml");
console.log(updatedYaml);
// name: my-app
// server:
//   host: localhost
//   port: 8080

// Delete a value.
const cleaned = deleteContentValue(updatedYaml, ["server", "host"], "yaml");
```

:::note
تستخدم `setContentValue` العملية `add` التي **تضيف خاصية الكائن أو تستبدلها**. وتستخدم `deleteContentValue` العملية `remove`. راجع [`patchContent`](/docs/ar-SA/conf-patch/api-reference/#patchcontent) لجميع العمليات.
:::

## 2. طبقة الملفات — تعديل ملف على القرص

استورد من نقطة الدخول الرئيسية. هذه الدوال `async`، وتقرأ ملفات فعلية وتكتبها باستخدام عمليات كتابة ذرية مع قفل.

```typescript
import { setConfigValue, readConfigFile, patchConfigFile } from "@powerduck/conf-patch";

// Set a nested value in a YAML file (atomic, lock-guarded).
await setConfigValue("config.yaml", ["database", "port"], 5432);

// Read the file back.
const content = await readConfigFile("config.yaml");
console.log(content);

// Apply several operations to a JSON file in one locked transaction.
await patchConfigFile("config.json", [
  { op: "replace", path: ["server", "host"], value: "0.0.0.0" },
  { op: "add", path: ["server", "ssl"], value: true },
  { op: "remove", path: ["legacySection"] },
]);
```

يُكتشف التنسيق تلقائيًا من الامتداد (`.json` أو `.jsonc` أو `.yaml` أو `.yml`). مرّر `format` صراحةً إذا كان الامتداد غير واضح.

## 3. معالجة الأخطاء

تطلق الطبقتان أخطاء عند وجود مدخلات غير صالحة. وفي الوضع الافتراضي `strict`، يؤدي فشل عملية تعديل إلى إطلاق خطأ أيضًا.

```typescript
import { patchContent } from "@powerduck/conf-patch/core";

try {
  // "remove" requires the path to exist.
  patchContent('{"name": "app"}', [{ op: "remove", path: ["missing"] }], "json");
} catch (error) {
  // Error: [confedit] Cannot remove a value that does not exist at path: ["missing"]
  console.error(error instanceof Error ? error.message : error);
}
```

اضبط `strict: false` لتجاوز العمليات الفاشلة بدلًا من إطلاق خطأ:

```typescript
patchContent(
  '{"name": "app"}',
  [{ op: "remove", path: ["missing"] }],
  "json",
  { strict: false }, // logs a warning, returns the original content
);
```

## 4. مثال Electron IPC

من الأنماط الشائعة تشغيل طبقة الملفات في العملية الرئيسية لـ Electron وإتاحتها عبر IPC:

```javascript
// Electron main process (CommonJS)
const { setConfigValue, readConfigFile } = require("@powerduck/conf-patch");

ipcMain.handle("config:set", async (_event, { filePath, path, value }) => {
  try {
    await setConfigValue(filePath, path, value);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle("config:read", async (_event, { filePath }) => {
  try {
    const data = await readConfigFile(filePath);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
```

## الخطوات التالية

- [مرجع API](/docs/ar-SA/conf-patch/api-reference/) — جميع الدوال والأنواع والخيارات.
- [أمثلة](/docs/ar-SA/conf-patch/examples/) — تعديلات JSON وYAML وJSONC مع التعليقات، والتحقق من OpenAPI، وقفل الملفات.
