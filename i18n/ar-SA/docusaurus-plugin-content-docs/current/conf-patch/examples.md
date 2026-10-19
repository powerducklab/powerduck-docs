---
sidebar_position: 5
title: "أمثلة"
description: "أمثلة عملية قابلة للتشغيل باستخدام API العامة. اختر الطبقة المناسبة: @powerduck/conf-patch/core الآمنة للمتصفح لمعالجة السلاسل، أو @powerduck/conf-patch لمعالجة الملفات."
---

# أمثلة

أمثلة عملية قابلة للتشغيل باستخدام API العامة. اختر الطبقة المناسبة: `@powerduck/conf-patch/core` الآمنة للمتصفح لمعالجة السلاسل، أو `@powerduck/conf-patch` لمعالجة الملفات.

---

## 1. عمليات JSON Patch (الطبقة الأساسية)

طبّق عدة عمليات RFC 6902 على سلسلة JSON. تُدرج `add` عناصر في المصفوفات أو تضيف/تستبدل خصائص الكائنات؛ وتتطلب `replace` و`remove` وجود الهدف.

```typescript
import { patchContent } from "@powerduck/conf-patch/core";

const source = JSON.stringify(
  {
    name: "my-app",
    version: "1.0.0",
    tags: ["web"],
  },
  null,
  2,
);

const patched = patchContent(
  source,
  [
    { op: "add", path: ["description"], value: "Demos patchContent" },
    { op: "replace", path: ["version"], value: "1.1.0" },
    { op: "add", path: ["tags", 1], value: "api" }, // inserts, does not overwrite
  ],
  "json",
);

console.log(patched);
```

النتيجة:

```json
{
  "name": "my-app",
  "version": "1.1.0",
  "tags": ["web", "api"],
  "description": "Demos patchContent"
}
```

اضبط `strict: false` لتخطي العمليات الفاشلة بدلًا من رمي استثناء:

```typescript
patchContent(
  source,
  [{ op: "remove", path: ["does", "not", "exist"] }],
  "json",
  { strict: false }, // logs a warning, returns source unchanged
);
```

---

## 2. ضبط قيمة YAML متداخلة (طبقة الملفات)

اضبط `database.port` في ملف YAML. يجب أن يكون المسار الأب (`database`) موجودًا؛ الكتابة ذرّية ومحمية بقفل.

```typescript
import { setConfigValue, readConfigFile } from "@powerduck/conf-patch";

await setConfigValue("config.yaml", ["database", "port"], 5432);
await setConfigValue("config.yaml", ["database", "host"], "localhost");

console.log(await readConfigFile("config.yaml"));
```

لإنشاء كائن متداخل غير موجود، أنشئ الكائن الأب أولًا:

```typescript
// "features" does not exist yet — create it, then add the child.
await setConfigValue("config.yaml", ["features"], {});
await setConfigValue("config.yaml", ["features", "darkMode"], true);
```

### عمليات المصفوفات في YAML

استخدم مقاطع رقمية لفهارس التسلسل. تقوم `add` **بالإدراج**، و`replace` بالاستبدال في الموضع نفسه، و`remove` بالحذف:

```typescript
import { patchConfigFile } from "@powerduck/conf-patch";

await patchConfigFile("config.yaml", [
  { op: "add", path: ["plugins", 1], value: { name: "metrics", enable: true } },
  { op: "replace", path: ["plugins", 0, "enable"], value: false },
  { op: "remove", path: ["plugins", 0] },
]);
```

---

## 3. JSONC مع الحفاظ على التعليقات

تعتمد تعديلات JSONC على نطاقات النص، لذلك تُحفظ التعليقات والفواصل النهائية حول الأسطر المعدّلة.

```typescript
import { patchContent, deleteContentValue } from "@powerduck/conf-patch/core";

const jsonc = `{
  // Application name
  "name": "my-app",
  // Legacy feature flag
  "legacyFeature": true,
  "version": "1.0.0",
}`;

// Replace a value — the surrounding comments stay put.
const updated = patchContent(
  jsonc,
  [{ op: "replace", path: ["version"], value: "1.2.0" }],
  "jsonc",
);

// Delete a key — its own line is removed, other comments remain.
const cleaned = deleteContentValue(updated, ["legacyFeature"], "jsonc");

console.log(cleaned);
```

النتيجة مع التعليقات المحفوظة:

```text
{
  // Application name
  "name": "my-app",
  "version": "1.2.0",
}
```

---

## 4. التحقق من مستند OpenAPI

تحقق من محتوى المواصفة الخام، ثم من ملف. يتطلب وضع الملفات `allowedRootDirectory` لتقييد المسارات المسموح بها.

```typescript
import {
  validateOpenAPISpec,
  validateOpenAPIFile,
  OpenApiValidationError,
} from "@powerduck/conf-patch";

// (a) Validate raw content (JSON or YAML)
const specContent = `openapi: 3.0.0
info:
  title: Demo API
  version: 1.0.0
paths: {}`;

try {
  const doc = await validateOpenAPISpec(specContent);
  console.log("Valid. openapi =", doc.openapi);
} catch (error) {
  if (error instanceof OpenApiValidationError) {
    console.error(`Validation failed [${error.code}]:`, error.message);
  } else {
    throw error;
  }
}

// (b) Validate from a file (requires allowedRootDirectory)
const fileDoc = await validateOpenAPIFile("./configs/openapi.yaml", {
  allowedRootDirectory: "./configs",
  // Optional hardening:
  // timeoutMs: 10000,
  // maxInputBytes: 2 * 1024 * 1024,
});
```

الإلغاء باستخدام `AbortSignal`:

```typescript
const controller = new AbortController();
setTimeout(() => controller.abort(), 5000);

await validateOpenAPISpec(specContent, { signal: controller.signal }).catch(
  (error) => {
    // Throws OpenApiValidationError with code "OPERATION_ABORTED" on abort.
    console.error(error.code);
  },
);
```

---

## 5. وصول متزامن آمن بقفل الملفات

عندما تصل عدة عمليات، أو عدة مهام متزامنة في عملية واحدة، إلى الملف نفسه، فإن `patchConfigFile` ينظّم الوصول تسلسليًا. استخدم `withFileLock` مباشرةً لجمع عدة عمليات على الملفات ضمن قسم حرج واحد.

```typescript
import { readConfigFile, writeConfigFile, withFileLock } from "@powerduck/conf-patch";

async function bumpCounter(file: string): Promise<number> {
  return withFileLock(
    file,
    async () => {
      // Read-inside-lock prevents a lost read between workers.
      const raw = await readConfigFile(file);
      const data = JSON.parse(raw);
      data.count = (data.count ?? 0) + 1;
      await writeConfigFile(file, JSON.stringify(data, null, 2), { lock: false });
      return data.count;
    },
    {
      timeoutMs: 5000, // give up after 5s
      retryDelayMs: 25, // initial delay; grows by 1.5x up to 1s
      allowStaleRecovery: false,
    },
  );
}
```

ملاحظات:

- يضع `withFileLock` العمليات على **الملف نفسه** في طابور داخل العملية، ويستخدم ملف `.confedit.lock` حصريًا بين العمليات.
- يتحقق تحرير القفل من رمز الملكية قبل الحذف، فلا يحذف تحرير قديم قفلًا جديدًا حل محل قفل متقادم.
- عند الإيقاف، مثل حدث Electron `will-quit`، حرّر الأقفال المتبقية:

```typescript
import { app } from "electron";
import { releaseAllLocalLocks } from "@powerduck/conf-patch";

let locksReleased = false;
app.on("will-quit", (event) => {
  if (locksReleased) return;
  event.preventDefault();
  void releaseAllLocalLocks()
    .catch((error) => console.error("Lock cleanup failed", error))
    .finally(() => {
      locksReleased = true;
      app.quit();
    });
});
```

---

## 6. مثال متكامل: تعديل مواصفة OpenAPI على القرص

نمط المثال من المكتبة نفسها: اقرأ المواصفة، واضبط القيم، وأضف استجابة، ثم تحقق منها.

```typescript
import {
  readConfigFile,
  setConfigValue,
  patchConfigFile,
  validateOpenAPIFile,
} from "@powerduck/conf-patch";

const specPath = "./openapi.yaml";

// Read the raw text.
await readConfigFile(specPath);

// Set info.version and the first server URL.
await setConfigValue(specPath, ["info", "version"], "1.1.0");
await setConfigValue(specPath, ["servers", 0, "url"], "https://api.prod.example.com/v1");

// Add a 404 response to GET /pets.
await patchConfigFile(specPath, [
  {
    op: "add",
    path: ["paths", "/pets", "get", "responses", "404"],
    value: { description: "Resource not found" },
  },
]);

// Confirm the edited document still validates.
await validateOpenAPIFile(specPath, { allowedRootDirectory: "." });
```

---

## الخطوات التالية

- [مرجع API](../api-reference/) — التوقيعات الكاملة والقيم الافتراضية لكل خيار.
- [البدء السريع](../quickstart/) — أول تنفيذ من البداية إلى النهاية.
