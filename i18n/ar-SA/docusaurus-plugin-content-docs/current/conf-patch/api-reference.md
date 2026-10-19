---
sidebar_position: 4
title: "مرجع API"
description: "مرجع كامل لـ @powerduck/conf-patch يتضمن تواقيع جميع العناصر المصدّرة وقيمها الافتراضية."
---

# مرجع API

مرجع كامل لـ `@powerduck/conf-patch` يتضمن تواقيع جميع العناصر المصدّرة وقيمها الافتراضية.

تتوفر نقطتا دخول:

- **`@powerduck/conf-patch`** — جميع الوظائف أدناه: الطبقة الأساسية والملفات والتحقق من OpenAPI والأدوات المساعدة.
- **`@powerduck/conf-patch/core`** — الجزء المتوافق مع المتصفح فقط: `patchContent` و`setContentValue` و`deleteContentValue` و`PatchContentOptions` ودوال التحقق والأنواع `ConfigFormat` و`JsonPatchOp` و`JsonPathSegment`.

---

## الطبقة الأساسية (متوافقة مع المتصفح)

### `patchContent`

تطبّق مصفوفة عمليات تصحيح RFC 6902 على سلسلة إعدادات. دالة نقية لا تصل إلى نظام الملفات.

```typescript
function patchContent(
  content: string,
  ops: JsonPatchOp[],
  format: ConfigFormat,
  options?: PatchContentOptions,
): string;
```

| المعلمة | النوع | الوصف |
|---|---|---|
| `content` | `string` | محتوى الإعدادات الخام، ويجب أن يكون صالحًا وفق `format` المحدد. |
| `ops` | `JsonPatchOp[]` | العمليات المطلوب تطبيقها بالترتيب. تعيد المصفوفة الفارغة `content` دون تغيير. |
| `format` | `ConfigFormat` | `"json" \| "jsonc" \| "yaml"`. |
| `options.strict` | `boolean` | عند `true`، وهي القيمة الافتراضية، تؤدي العملية الفاشلة إلى استثناء. عند `false` تُتخطى العملية ويُسجّل تحذير عبر `console.warn`. |

**تُعيد:** محتوى الإعدادات بعد التعديل (`string`).

**الاستثناءات:** `TypeError` إذا لم يكن `content` سلسلة أو كانت `ops` غير صالحة؛ وخطأ يصف العملية الفاشلة عندما تكون `strict` مساوية لـ `true`.

```typescript
import { patchContent } from "@powerduck/conf-patch/core";

patchContent(
  '{"name": "app"}',
  [{ op: "add", path: ["version"], value: "1.0.0" }],
  "json",
);
// => '{\n  "name": "app",\n  "version": "1.0.0"\n}'
```

---

### `setContentValue`

تعيّن قيمة واحدة أو تنشئها. تستدعي داخليًا `patchContent` بعملية `add` واحدة. وفق RFC 6902، تستبدل `add` خاصية كائن موجودة أو تُدرج عنصرًا عند فهرس مصفوفة.

```typescript
function setContentValue(
  content: string,
  path: readonly (string | number)[],
  value: unknown,
  format: ConfigFormat,
): string;
```

| المعلمة | النوع | الوصف |
|---|---|---|
| `content` | `string` | محتوى الإعدادات الخام. |
| `path` | `readonly (string \| number)[]` | مسار مقسّم إلى مقاطع، مثل `["server", "port"]`. لا يجوز أن يكون فارغًا. |
| `value` | `unknown` | القيمة المراد كتابتها. |
| `format` | `ConfigFormat` | تنسيق الإعدادات. |

**تُعيد:** المحتوى المحدّث (`string`).

```typescript
setContentValue("server:\n  port: 3000\n", ["server", "port"], 8080, "yaml");
```

---

### `deleteContentValue`

تحذف مفتاحًا أو عنصر مصفوفة. تستدعي داخليًا `patchContent` بعملية `remove` واحدة. يجب أن يكون المسار موجودًا.

```typescript
function deleteContentValue(
  content: string,
  path: readonly (string | number)[],
  format: ConfigFormat,
): string;
```

```typescript
deleteContentValue(
  '{"name": "app", "legacy": true}',
  ["legacy"],
  "json",
);
```

---

### `PatchContentOptions`

```typescript
interface PatchContentOptions {
  /** When true, failed operations throw. When false, they are skipped with a warning. Default: true */
  strict?: boolean;
}
```

---

## طبقة الملفات (Node.js / Electron فقط)

### `readConfigFile`

تقرأ نص UTF-8 من مسار محلي أو عنوان `file://`.

```typescript
function readConfigFile(filePath: string): Promise<string>;
```

| المعلمة | النوع | الوصف |
|---|---|---|
| `filePath` | `string` | مسار مطلق أو نسبي أو عنوان `file://`. لا يجوز أن يكون فارغًا. |

**تُعيد:** محتوى UTF-8 الخام (`Promise<string>`).

**الاستثناءات:** عند تعذر القراءة، خطأ يتضمن إخفاق نظام الملفات الأساسي.

---

### `writeConfigFile`

تكتب المحتوى **ذرّيًا** باستخدام ملف مؤقت ثم إعادة تسميته، مع **قفل ملف** حصري افتراضيًا. تُنشأ المجلدات الأب قبل الحصول على القفل.

```typescript
function writeConfigFile(
  filePath: string,
  content: string,
  options?: WriteConfigOptions,
): Promise<void>;
```

| المعلمة | النوع | الوصف |
|---|---|---|
| `filePath` | `string` | مسار ملف الإعدادات. |
| `content` | `string` | المحتوى المراد كتابته، ويجب أن يكون سلسلة. |
| `options` | `WriteConfigOptions` | انظر أدناه. |

**الاستثناءات:** `TypeError` للمدخلات غير الصالحة؛ وتُغلّف أخطاء نظام الملفات عند الكتابة.

#### `WriteConfigOptions`

| الخيار | النوع | القيمة الافتراضية | الوصف |
|---|---|---|---|
| `lock` | `boolean` | `true` | تفعيل قفل الملف أثناء الكتابة. |
| `lockTimeoutMs` | `number` | القيمة الافتراضية لـ `withFileLock` ‏(10 ثوانٍ) | أقصى انتظار للحصول على القفل، بالملّي ثانية. |
| `lockRetryDelayMs` | `number` | القيمة الافتراضية لـ `withFileLock` ‏(25 ملّي ثانية) | التأخير الأولي بين المحاولات، بالملّي ثانية، قبل الزيادة الأُسّية. |
| `lockStaleThresholdMs` | `number` | القيمة الافتراضية لـ `withFileLock` | عمر القفل بالملّي ثانية الذي يسمح بعده باستعادته. |
| `allowStaleRecovery` | `boolean` | `false` | السماح باسترداد الأقفال القديمة تلقائيًا. |

```typescript
import { writeConfigFile } from "@powerduck/conf-patch";

await writeConfigFile("config.json", '{"name": "app"}');
```

---

### `patchConfigFile`

المعاملة الأساسية لطبقة الملفات: تقرأ داخل القفل، وتطبّق `patchContent`، وتكتب ذرّيًا **فقط إذا تغيّر المحتوى**. إذا لم تُحدّد `options.format`، يُكتشف التنسيق من الامتداد.

```typescript
function patchConfigFile(
  filePath: string,
  ops: JsonPatchOp[],
  options?: PatchConfigOptions,
): Promise<void>;
```

| المعلمة | النوع | الوصف |
|---|---|---|
| `filePath` | `string` | مسار ملف الإعدادات. لا يجوز أن يكون فارغًا. |
| `ops` | `JsonPatchOp[]` | العمليات المراد تطبيقها. تعود المصفوفة الفارغة دون قراءة أو كتابة. |
| `options` | `PatchConfigOptions` | انظر أدناه. |

**الاستثناءات:** `TypeError` إذا كانت `filePath` فارغة أو خيارات القفل غير صالحة أو تعذر اكتشاف التنسيق دون تحديد `format`؛ وخطأ العملية عندما تكون `strict` مساوية لـ `true`.

#### `PatchConfigOptions`

| الخيار | النوع | القيمة الافتراضية | الوصف |
|---|---|---|---|
| `format` | `ConfigFormat` | اكتشاف تلقائي | تنسيق محدد صراحةً، له الأولوية على الاكتشاف من الامتداد. |
| `strict` | `boolean` | `true` | تؤدي العمليات الفاشلة إلى استثناءات. |
| `lock` | `boolean` | `true` | تفعيل قفل الملفات. |
| `lockTimeoutMs` | `number` | 10 ثوانٍ | قيمة غير سالبة. أقصى انتظار للقفل. |
| `lockRetryDelayMs` | `number` | 25 ملّي ثانية | قيمة موجبة. التأخير الأولي لإعادة المحاولة. |
| `lockStaleThresholdMs` | `number` | محسوبة | قيمة موجبة. عمر القفل المطلوب لاستعادة القفل القديم. |
| `allowStaleRecovery` | `boolean` | `false` | استرداد الأقفال القديمة تلقائيًا. |

```typescript
await patchConfigFile("config.json", [
  { op: "replace", path: ["server", "host"], value: "0.0.0.0" },
  { op: "add", path: ["server", "ssl"], value: true },
  { op: "remove", path: ["legacySection"] },
]);
```

---

### `setConfigValue`

تضيف قيمة متداخلة في ملف أو تستبدلها. تفوّض عملية `add` واحدة إلى `patchConfigFile`.

```typescript
function setConfigValue(
  filePath: string,
  path: readonly (string | number)[],
  value: unknown,
  options?: PatchConfigOptions,
): Promise<void>;
```

```typescript
await setConfigValue("config.yaml", ["database", "port"], 5432);
```

---

### `deleteConfigValue`

تحذف قيمة متداخلة موجودة من ملف. تفوّض عملية `remove` واحدة إلى `patchConfigFile`.

```typescript
function deleteConfigValue(
  filePath: string,
  path: readonly (string | number)[],
  options?: PatchConfigOptions,
): Promise<void>;
```

```typescript
await deleteConfigValue("config.json", ["features", "betaPreview"]);
```

---

### `withFileLock`

تنفّذ دالة استدعاء راجع غير متزامنة عبر طابور داخل العملية **وقفل ملف حصري** (`<file>.confedit.lock`). تستخدم الأقفال رموز ملكية. لا يُستعاد القفل القديم إلا إذا كانت `allowStaleRecovery` مساوية لـ `true` وتجاوز عمره `staleThresholdMs`. لا تُفحص معرّفات PID عمدًا لأنها قد تُستخدم مجددًا.

```typescript
function withFileLock<T>(
  filePath: string,
  callback: () => Promise<T>,
  options?: FileLockOptions,
): Promise<T>;
```

| المعلمة | النوع | الوصف |
|---|---|---|
| `filePath` | `string` | الملف المراد قفله. |
| `callback` | `() => Promise<T>` | العمل المطلوب تنفيذه أثناء الاحتفاظ بالقفل. |
| `options` | `FileLockOptions` | انظر أدناه. |

**تُعيد:** نتيجة `callback` ‏(`Promise<T>`). يُحرَّر القفل دائمًا في كتلة `finally`، حتى إذا أدت الدالة إلى استثناء.

#### `FileLockOptions`

| الخيار | النوع | القيمة الافتراضية | الوصف |
|---|---|---|---|
| `timeoutMs` | `number` | `10000` | أقصى انتظار للقفل بالملّي ثانية. يجب أن يكون غير سالب. |
| `retryDelayMs` | `number` | `25` | التأخير الأولي بالملّي ثانية. يجب أن يكون موجبًا. يزداد بمقدار 1.5 مرة حتى حد أقصى قدره 1000 ملّي ثانية. |
| `staleThresholdMs` | `number` | `max(timeoutMs * 2, 60000)` | عمر القفل الذي يسمح بالاستعادة، بالملّي ثانية. يجب أن يكون موجبًا. |
| `allowStaleRecovery` | `boolean` | `false` | استرداد الأقفال القديمة تلقائيًا. معطّل افتراضيًا للعملية الرئيسية الواحدة في Electron لتجنب مقاطعة المعاملات النشطة. |

```typescript
import { withFileLock } from "@powerduck/conf-patch";

await withFileLock("state.json", async () => {
  // ... read, modify, write ...
}, { timeoutMs: 5000 });
```

---

### `releaseAllLocalLocks`

تحذف جميع ملفات القفل التي تملكها العملية الحالية. استخدمها عند إغلاق التطبيق بعد اكتمال معاملات الملفات النشطة. للتنظيف غير المتزامن في Electron، امنع حدث الخروج الأول ثم استأنف الخروج بعد التنظيف، كما في الأمثلة. تُتجاهل إخفاقات الأقفال الفردية.

```typescript
function releaseAllLocalLocks(): Promise<void>;
```

---

## التحقق من OpenAPI

### `validateOpenAPISpec`

تتحقق من محتوى OpenAPI/Swagger الخام بصيغة JSON أو YAML. يُعامل الإدخال بوصفه **محتوى** افتراضيًا، ولا يُفسَّر كمسار إلا عند `inputKind: "file"`. يُفوّض التحقق إلى `@powerduck/openapi-parser`، وتضيف هذه الدالة ضوابط أمان لمعالجة الإدخال.

```typescript
function validateOpenAPISpec(
  input: string,
  options?: ValidateOpenApiOptions,
): Promise<AnyOpenAPIDocument>;
```

| المعلمة | النوع | الوصف |
|---|---|---|
| `input` | `string` | محتوى المواصفة الخام، أو مسار ملف عند `inputKind: "file"`. |
| `options` | `ValidateOpenApiOptions` | انظر أدناه. |

**تُعيد:** المستند الذي اجتاز التحقق عند النجاح (`Promise<AnyOpenAPIDocument>`).

**الاستثناءات:** `TypeError` للإدخال الفارغ أو غير النصي؛ و[`OpenApiValidationError`](#openapivalidationerror) للخيارات غير الصالحة أو فشل التحقق.

---

### `validateOpenAPIFile`

دالة مساعدة تستدعي `validateOpenAPISpec` مع `inputKind: "file"` وتضبط `baseFilePath` على المسار المعطى. تتطلب `allowedRootDirectory`.

```typescript
function validateOpenAPIFile(
  filePath: string,
  options?: ValidateOpenApiOptions,
): Promise<AnyOpenAPIDocument>;
```

```typescript
import { validateOpenAPIFile } from "@powerduck/conf-patch";

const doc = await validateOpenAPIFile("./configs/openapi.yaml", {
  allowedRootDirectory: "./configs",
});
```

---

### `ValidateOpenApiOptions`

| الخيار | النوع | القيمة الافتراضية | الوصف |
|---|---|---|---|
| `inputKind` | `"content" \| "file"` | `"content"` | كيفية تفسير `input`. |
| `baseFilePath` | `string` | — | المسار الأساسي لسياق حل المراجع. |
| `allowedRootDirectory` | `string` | — | المجلد الجذر لملفات الإدخال. **مطلوب** عندما تكون `inputKind` مساوية لـ `"file"`. |
| `timeoutMs` | `number` | `15000` | المهلة القصوى للعملية، بالملّي ثانية. |
| `maxInputBytes` | `number` | `5242880` ‏(5 ميغابايت) | أقصى حجم للإدخال الخام، بالبايت. |
| `maxDocumentNodes` | `number` | `100000` | أقصى عدد لعُقد المستند المحلّل، للحماية من حجب الخدمة. |
| `maxDocumentDepth` | `number` | `100` | أقصى عمق للتداخل، للحماية من حجب الخدمة. |
| `maxValidationErrors` | `number` | `50` | أقصى عدد للأخطاء المضمّنة في الرسالة. |
| `maxErrorMessageLength` | `number` | `1000` | أقصى عدد للأحرف لكل خطأ تحقق. |
| `signal` | `AbortSignal` | — | إشارة إلغاء اختيارية. |

---

### `OpenApiValidationError`

خطأ منظم عند فشل التحقق. حوّل الأخطاء عند حدود التطبيق قبل إعادتها إلى العميل؛ فقد تحتوي الرسائل والأسباب على مسارات محلية أو تفاصيل المستند.

```typescript
class OpenApiValidationError extends Error {
  readonly code: string;
  readonly cause?: unknown;
  constructor(code: string, message: string, cause?: unknown);
}
```

| الخاصية | النوع | الوصف |
|---|---|---|
| `code` | `string` | رمز خطأ قابل للمعالجة برمجيًا؛ انظر الجدول أدناه. |
| `message` | `string` | تفاصيل مقروءة للمستخدم. |
| `cause` | `unknown` | خطأ أساسي اختياري. |

#### رموز الأخطاء

| الرمز | المعنى |
|---|---|
| `INVALID_OPTION` | قُدّمت قيمة خيار غير صالحة. |
| `INPUT_TOO_LARGE` | يتجاوز المحتوى الخام `maxInputBytes`. |
| `INPUT_FILE_TOO_LARGE` | يتجاوز ملف الإدخال حد الحجم. |
| `FILE_INPUT_FORBIDDEN` | استُخدم إدخال ملف دون `allowedRootDirectory`. |
| `PATH_OUTSIDE_ROOT` | يقع مسار الملف بعد حله خارج `allowedRootDirectory`. |
| `PARSE_ERROR` | تعذر تحليل محتوى JSON/YAML. |
| `INVALID_DOCUMENT_SHAPE` | المستند ليس كائن JSON. |
| `UNSUPPORTED_VERSION` | لا يعلن المستند إصدار OpenAPI/Swagger مدعومًا؛ تُقبل الإصدارات الرئيسية `2` و`3` فقط. |
| `DOCUMENT_TOO_DEEP` | يتجاوز عمق التداخل `maxDocumentDepth`. |
| `DOCUMENT_TOO_LARGE` | يتجاوز عدد العُقد `maxDocumentNodes`. |
| `SPEC_VALIDATION_FAILED` | لم تجتز المواصفة التحقق من OpenAPI. |
| `OPERATION_TIMEOUT` | تجاوزت العملية `timeoutMs`. |
| `OPERATION_ABORTED` | أُلغيت العملية عبر `signal`. |
| `UNKNOWN_ERROR` | خطأ غير متوقع. |

---

## الأدوات المساعدة

### `detectFormat`

تكتشف [`ConfigFormat`](#configformat) من امتداد مسار الملف أو عنوان `file://`.

```typescript
function detectFormat(filePath: string): ConfigFormat;
```

| الامتداد | النتيجة |
|---|---|
| `.json` | `"json"` |
| `.jsonc` | `"jsonc"` |
| `.yaml`, `.yml` | `"yaml"` |
| أي امتداد آخر | ينتج خطأ |

---

### `normalizeFilePath`

تحوّل مسارًا محليًا أو عنوان `file:` إلى مسار مطلق بصيغة النظام، وتحافظ على المسافات الصالحة وأسماء الملفات بترميز Unicode.

```typescript
function normalizeFilePath(filePath: string): string;
```

يُفك عنوان `file:` باستخدام `fileURLToPath`؛ ويُعاد المسار المطلق كما هو؛ ويُحل المسار النسبي بالاستناد إلى `process.cwd()`.

---

## دوال التحقق من الشروط

تُعاد تصدير هذه الدوال للاستخدام المتقدم والوحدات الداخلية. نادرًا ما تحتاج شيفرة التطبيق إلى استدعائها مباشرةً.

### `assertNonEmptyString`

```typescript
function assertNonEmptyString(value: unknown, label: string): asserts value is string;
```
تؤدي إلى `TypeError` ما لم تكن `value` سلسلة غير فارغة.

### `assertPatchPath`

```typescript
function assertPatchPath(
  path: readonly (string | number)[],
  label?: string, // default "path"
): void;
```
تؤدي إلى استثناء ما لم تكن `path` مصفوفة غير فارغة تتكون مقاطعها من سلاسل غير فارغة أو أعداد صحيحة آمنة غير سالبة.

### `assertPatchOperations`

```typescript
function assertPatchOperations(ops: JsonPatchOp[]): void;
```
تتحقق من كل عملية: يجب أن تكون `op` إحدى `"add" | "replace" | "remove"`، وأن تجتاز `path` فحص `assertPatchPath`، وأن تملك `add`/`replace` خاصية ذاتية باسم `value`.

### `assertConfigFormat`

```typescript
function assertConfigFormat(format: ConfigFormat): void;
```
تؤدي إلى استثناء ما لم تكن `format` إحدى `"json"` أو `"jsonc"` أو `"yaml"`.

### `getErrorMessage`

```typescript
function getErrorMessage(error: unknown): string;
```
تُعيد `error.message` لمثيلات `Error`، وإلا فتُعيد `String(error)`.

### `createError`

```typescript
function createError(message: string, cause: unknown): Error;
```
تنشئ `Error` وتضيف خاصية `cause` باستخدام `Object.defineProperty`، مع بديل لبيئات التشغيل القديمة.

---

## الأنواع

### `ConfigFormat`

```typescript
type ConfigFormat = "json" | "jsonc" | "yaml";
```

### `JsonPathSegment`

```typescript
type JsonPathSegment = string | number;
```

### `JsonPatchOp`

```typescript
interface JsonPatchOp {
  op: "add" | "replace" | "remove";
  path: JsonPathSegment[];
  /** Required for "add" and "replace". */
  value?: unknown;
}
```

:::caution
تُدعم `"add"` و`"replace"` و`"remove"` فقط. استُبعدت `"move"` و`"copy"` و`"test"` عمدًا.
:::

### `PatchConfigOptions`

```typescript
interface PatchConfigOptions {
  format?: ConfigFormat;
  strict?: boolean;
  lock?: boolean;
  lockTimeoutMs?: number;
  lockRetryDelayMs?: number;
  lockStaleThresholdMs?: number;
  /** Whether stale locks can be automatically reclaimed. Defaults to false. */
  allowStaleRecovery?: boolean;
}
```

### `FileLockOptions`

```typescript
interface FileLockOptions {
  /** Max time to wait for a lock. Defaults to 10 seconds. */
  timeoutMs?: number;
  /** Initial retry delay. Defaults to 25ms. */
  retryDelayMs?: number;
  /** Explicit lock age after which recovery is allowed. */
  staleThresholdMs?: number;
  /** Whether stale locks can be automatically reclaimed. Defaults to false. */
  allowStaleRecovery?: boolean;
}
```

### `WriteConfigOptions`

```typescript
interface WriteConfigOptions {
  lock?: boolean;
  lockTimeoutMs?: number;
  lockRetryDelayMs?: number;
  lockStaleThresholdMs?: number;
  allowStaleRecovery?: boolean;
}
```

### `PatchContentOptions`

```typescript
interface PatchContentOptions {
  strict?: boolean;
}
```

### `OpenApiInputKind`

```typescript
type OpenApiInputKind = "content" | "file";
```

### `AnyOpenAPIDocument`

اتحاد بُنى مستندات OpenAPI/Swagger المدعومة التي يعيدها التحقق:

```typescript
type AnyOpenAPIDocument =
  | OpenAPIV2.Document      // Swagger 2.0
  | OpenAPIV3.Document      // OpenAPI 3.0.x
  | OpenAPIV3_1.Document     // OpenAPI 3.1.x
  | OpenAPIV3_2Document;    // OpenAPI 3.2 (permissive structural type)
```

`OpenAPIV3_2Document` نوع بنيوي مرن:

```typescript
interface OpenAPIV3_2Document {
  openapi: string;
  info: Record<string, unknown>;
  paths?: Record<string, unknown>;
  [key: string]: unknown;
}
```

---

## ملخص الصادرات

| الرمز | المدخل الرئيسي | المسار الفرعي الأساسي | الفئة |
|---|:---:|:---:|---|
| `patchContent` | ✓ | ✓ | دالة |
| `setContentValue` | ✓ | ✓ | دالة |
| `deleteContentValue` | ✓ | ✓ | دالة |
| `PatchContentOptions` | ✓ | ✓ | نوع |
| `assertNonEmptyString` | ✓ | ✓ | دالة |
| `assertPatchPath` | ✓ | ✓ | دالة |
| `assertPatchOperations` | ✓ | ✓ | دالة |
| `assertConfigFormat` | ✓ | ✓ | دالة |
| `getErrorMessage` | ✓ | ✓ | دالة |
| `createError` | ✓ | ✓ | دالة |
| `ConfigFormat` | ✓ | ✓ | نوع |
| `JsonPatchOp` | ✓ | ✓ | نوع |
| `JsonPathSegment` | ✓ | ✓ | نوع |
| `readConfigFile` | ✓ | — | دالة |
| `writeConfigFile` | ✓ | — | دالة |
| `WriteConfigOptions` | ✓ | — | نوع |
| `patchConfigFile` | ✓ | — | دالة |
| `setConfigValue` | ✓ | — | دالة |
| `deleteConfigValue` | ✓ | — | دالة |
| `withFileLock` | ✓ | — | دالة |
| `releaseAllLocalLocks` | ✓ | — | دالة |
| `PatchConfigOptions` | ✓ | — | نوع |
| `FileLockOptions` | ✓ | — | نوع |
| `detectFormat` | ✓ | — | دالة |
| `normalizeFilePath` | ✓ | — | دالة |
| `validateOpenAPISpec` | ✓ | — | دالة |
| `validateOpenAPIFile` | ✓ | — | دالة |
| `OpenApiValidationError` | ✓ | — | صنف |
| `ValidateOpenApiOptions` | ✓ | — | نوع |
| `OpenApiInputKind` | ✓ | — | نوع |
| `AnyOpenAPIDocument` | ✓ | — | نوع |