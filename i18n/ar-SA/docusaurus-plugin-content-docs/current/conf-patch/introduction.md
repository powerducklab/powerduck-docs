---
sidebar_position: 1
title: "@powerduck/conf-patch"
description: "@powerduck/conf-patch مكتبة لتحرير الإعدادات تعتمد بنية من طبقتين. تطبّق دلالات RFC 6902 JSON Patch على سلاسل JSON وJSONC وYAML مع الحفاظ على التعليقات والتنسيق، وتوفّر كتابة ذرّية وأقفال ملفات بين العمليات في Node.js وElectron."
---

# @powerduck/conf-patch

**@powerduck/conf-patch** مكتبة لتحرير الإعدادات تعتمد **بنية من طبقتين**. تطبّق دلالات [RFC 6902 JSON Patch](https://datatracker.ietf.org/doc/html/rfc6902) على سلاسل JSON وJSONC وYAML مع الحفاظ على التعليقات والتنسيق، وتوفّر كتابة ذرّية وأقفال ملفات بين العمليات في Node.js وElectron.

- **الإصدار:** <img src="https://img.shields.io/npm/v/@powerduck/conf-patch"/>
- **الترخيص:** MIT
- **متطلبات Node.js:** `>= 22.12.0`
- **الشيفرة المصدرية:** [github.com/powerducklab/conf-patch](https://github.com/powerducklab/conf-patch)

---

## لماذا conf-patch؟

غالبًا ما يتطلب تحرير ملفات الإعدادات برمجيًا الاختيار بين إعادة تسلسل المستند كاملًا، مما قد يغيّر التعليقات والتنسيق، وبين معالجة نصية يدوية عرضة للأخطاء. توفّر conf-patch ما يلي:

- **تعديلات تدريجية تحافظ على التعليقات** في JSON/JSONC باستخدام `jsonc-parser`، وتعديل شجرة AST في YAML باستخدام `yaml`. لا يُعاد تسلسل JSON/JSONC كاملًا؛ أما YAML فيُعاد تسلسل شجرته المعدّلة.
- **كتابة ذرّية** عبر ملف مؤقت ثم إعادة تسميته، لتجنّب ترك الملف المستهدف مكتوبًا جزئيًا.
- **أقفال بين العمليات** مع رموز ملكية، وفترات انتظار متزايدة أُسّيًا بين المحاولات، واستعادة الأقفال القديمة.
- **واجهة تعمل في بيئات متعددة:** تعمل الطبقة الأساسية أيضًا في المتصفحات ودوال Edge والتطبيقات التي تستخدم تخزين IndexedDB.

---

## بنية من طبقتين

```
┌──────────────────────────────────────────────────────────────┐
│                     Application code                          │
├──────────────────────────────────────────────────────────────┤
│  File layer (Node.js / Electron only)                         │
│  ┌───────────────┐ ┌────────────────┐ ┌──────────────────┐  │
│  │ readConfigFile │ │ writeConfigFile│ │ patchConfigFile   │  │
│  │ setConfigValue │ │ deleteConfig…  │ │ withFileLock     │  │
│  └──────┬────────┘ └───────┬────────┘ └────────┬─────────┘  │
│         │                  │                   │            │
│  ┌──────▼──────────────────▼───────────────────▼───────────┐ │
│  │           Core layer (browser-safe, zero Node deps)      │ │
│  │  patchContent   setContentValue   deleteContentValue     │ │
│  └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### الطبقة الأساسية — `@powerduck/conf-patch/core` (متوافقة مع المتصفح)

دوال نقية تتعامل مع **السلاسل النصية**، دون الاعتماد على `node:fs` أو `node:path` أو واجهات خاصة بـ Node.js. يمكن تضمين هذا المسار الفرعي في شيفرة المتصفح أو دوال Edge أو عامل الخدمة.

| الدالة | الغرض |
|---|---|
| [`patchContent`](../api-reference/#patchcontent) | تطبيق عمليات RFC 6902 على سلسلة إعدادات |
| [`setContentValue`](../api-reference/#setcontentvalue) | تعيين قيمة متداخلة أو إنشاؤها باستخدام `add` |
| [`deleteContentValue`](../api-reference/#deletecontentvalue) | حذف مفتاح أو عنصر مصفوفة باستخدام `remove` |

### طبقة الملفات — `@powerduck/conf-patch` (Node.js / Electron)

دوال غير متزامنة لقراءة الملفات الفعلية وكتابتها، تضيف الكتابة الذرّية والأقفال إلى الطبقة الأساسية.

| الدالة | الغرض |
|---|---|
| [`readConfigFile`](../api-reference/#readconfigfile) | قراءة نص UTF-8 من مسار ملف أو عنوان `file://` |
| [`writeConfigFile`](../api-reference/#writeconfigfile) | كتابة المحتوى ذرّيًا مع قفل اختياري |
| [`patchConfigFile`](../api-reference/#patchconfigfile) | تنفيذ معاملة قراءة وتعديل وكتابة ضمن قفل الملف |
| [`setConfigValue`](../api-reference/#setconfigvalue) | تعيين قيمة متداخلة في ملف |
| [`deleteConfigValue`](../api-reference/#deleteconfigvalue) | حذف قيمة متداخلة من ملف |
| [`withFileLock`](../api-reference/#withfilelock) | تنفيذ مهمة تحت قفل حصري |
| [`releaseAllLocalLocks`](../api-reference/#releasealllocallocks) | تحرير جميع الأقفال التي تملكها العملية الحالية |

---

## التنسيقات المدعومة

| التنسيق | الامتداد | السلوك |
|---|---|---|
| **JSON** | `.json` | JSON قياسي مع تعديلات تدريجية باستخدام `jsonc-parser`. |
| **JSONC** | `.jsonc` | JSON مع تعليقات وفواصل ختامية. تُحفَظ التعليقات. |
| **YAML** | `.yaml`, `.yml` | YAML 1.2. يحافظ تعديل AST على التعليقات والمراسي والمسافات البادئة. |

تربط [`detectFormat`](../api-reference/#detectformat) امتداد الملف بنوع [`ConfigFormat`](../api-reference/#configformat). تؤدي الامتدادات الأخرى إلى خطأ ما لم تحدد `format` صراحةً.

---

## عمليات RFC 6902

تطبّق conf-patch جزءًا محددًا من RFC 6902. العمليات المدعومة هي فقط:

| `op` | السلوك |
|---|---|
| `"add"` | الإدراج عند فهرس مصفوفة، أو إضافة خاصية كائن أو استبدالها |
| `"replace"` | استبدال قيمة موجودة؛ يجب أن يكون المسار موجودًا |
| `"remove"` | حذف مفتاح أو عنصر مصفوفة موجود؛ يجب أن يكون المسار موجودًا |

:::caution
العمليات `"move"` و`"copy"` و`"test"` **غير مدعومة**. يقصر النوع [`JsonPatchOp`](../api-reference/#jsonpatchop) قيمة `op` على `"add" | "replace" | "remove"`.
:::

ملاحظات على السلوك:

- تؤدي `add` عند فهرس مصفوفة إلى **إدراج** عنصر وفق RFC 6902. استخدم `replace` لاستبدال عنصر موجود.
- تتطلب `add` وجود المسار الأب مسبقًا. أنشئ الآباء قبل الأبناء.
- تتطلب `replace` و`remove` وجود المسار المستهدف.
- عند استخدام `strict: true`، وهو الافتراضي، تؤدي العملية الفاشلة إلى استثناء. وعند استخدام `strict: false`، تُتخطى العملية ويُسجّل تحذير.

---

## الحفاظ على التعليقات والتنسيق

- **JSON/JSONC:** تُحسب التعديلات كنطاقات نصية استنادًا إلى شجرة البنية، فتُحفَظ التعليقات المحيطة والفواصل الختامية والمسافات البادئة.
- **YAML:** تُعدّل شجرة AST الخاصة بـ `yaml` مباشرةً ثم يُعاد تسلسلها، مع الحفاظ على التعليقات والمراسي والأسماء المستعارة والمسافات البادئة.

---

## التحقق من OpenAPI

تتحقق conf-patch من مستندات OpenAPI/Swagger عبر واجهة تضيف ضوابط حماية إلى `@powerduck/openapi-parser`:

- تتحقق [`validateOpenAPISpec`](../api-reference/#validateopenapispec) من محتوى JSON أو YAML الخام.
- تتحقق [`validateOpenAPIFile`](../api-reference/#validateopenapifile) من المستند عبر مسار الملف.
- تشمل معالجة المدخلات حدود الحجم وتقييد المسارات (`allowedRootDirectory`) وفحص تعقيد البنية والمهل الزمنية والإلغاء باستخدام `AbortSignal`.
- تؤدي حالات الفشل إلى [`OpenApiValidationError`](../api-reference/#openapivalidationerror) يتضمن `code` قابلًا للمعالجة برمجيًا.

---

## الخطوات التالية

- [التثبيت](../installation/) — أضف conf-patch وتعرّف إلى نقطتي الدخول.
- [البدء السريع](../quickstart/) — عدّل سلسلة في المتصفح وملفًا على القرص.
- [مرجع API](../api-reference/) — جميع الصادرات والأنواع والخيارات.
- [أمثلة](../examples/) — أمثلة قابلة للتشغيل لـ JSON وYAML وJSONC والتحقق من OpenAPI والأقفال.
