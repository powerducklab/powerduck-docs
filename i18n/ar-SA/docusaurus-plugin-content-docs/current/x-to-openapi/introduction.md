---
sidebar_position: 1
title: "@powerduck/x-to-openapi"
description: "@powerduck/x-to-openapi إطار TypeScript قابل للتوسعة يحوّل أوامر curl ومجموعات Postman ‏(v2.0 / v2.1.0) إلى مستندات OpenAPI 3.2. يناسب مسارات التكامل المستمر وتوليد وثائق API وإعادة بناء الواجهات من طلبات HTTP."
---

# @powerduck/x-to-openapi

**@powerduck/x-to-openapi** إطار TypeScript قابل للتوسعة يحوّل **أوامر curl** و**مجموعات Postman ‏(v2.0 / v2.1.0)** إلى مستندات **OpenAPI 3.2**. يناسب مسارات التكامل المستمر وتوليد وثائق API وإعادة بناء الواجهات من طلبات HTTP.

يستخدم [`@powerduck/openapi-parser`](https://www.npmjs.com/package/@powerduck/openapi-parser) للتحقق من المستندات.

- **الإصدار:** <img src="https://img.shields.io/npm/v/@powerduck/x-to-openapi"/>
- **الترخيص:** MIT
- **متطلبات Node.js:** `>= 22.12.0`
- **الإخراج:** OpenAPI **3.2.0** فقط
- **الشيفرة المصدرية:** [github.com/powerducklab/x-to-openapi](https://github.com/powerducklab/x-to-openapi)

---

## آلية العمل

```text
أمر curl → CurlAdapter
مجموعة Postman → PostmanAdapter
             ↓
     NormalizedRequest[]
             ↓
     buildOpenApi32() → مستند OpenAPI 3.2
             ↓
     validateOpenApi32() → التشخيص
```

1. يحلّل **المحوّل** المصدر، مثل نص curl أو مجموعة Postman، إلى قائمة من كائنات [`NormalizedRequest`](./api-reference.md#normalizedrequest).
2. يدمج **المنشئ** الطلبات بحسب الطريقة والمسار، ويستنتج المخططات ومعلمات المسار وتعريفات الأمان، ثم ينتج مستند OpenAPI 3.2.
3. يفحص **المدقّق** الإخراج وفق مخطط OpenAPI عبر `@powerduck/openapi-parser` ويعيد معلومات التشخيص.

---

## الميزات

- **محوّلان مدمجان:** يدعم [`CurlAdapter`](./api-reference.md#curladapter) الأوامر الفردية والدفعات وإخراج المتصفح “Copy all as cURL”، ويدعم [`PostmanAdapter`](./api-reference.md#postmanadapter) الإصدارين v2.0/v2.1.0 والمجلدات المتداخلة ووراثة المصادقة.
- **دوال مساعدة دون إعداد:** تسجّل [`curlToOpenApi`](./api-reference.md#curltoopenapi) و[`postmanToOpenApi`](./api-reference.md) المحوّل وتنفّذ التحويل في استدعاء واحد.
- **إخراج OpenAPI 3.2:** يعلن كل مستند `openapi: "3.2.0"`. التحقق مفعّل افتراضيًا؛ راجع التشخيصات أو فعّل الوضع الصارم لرفض الأخطاء.
- **دمج طلبات متعددة:** تُدمج العمليات ذات الطريقة والمسار نفسيهما، وتُدمج معلمات الاستعلام والترويسات وملفات الارتباط ومخططات المحتوى بنيويًا.
- **استنتاج معلمات المسار:** تتحول المعرّفات الرقمية وUUID وULID والمقاطع السداسية الطويلة إلى قوالب مثل `/users/{userId}` عندما تختلف عبر N عينات على الأقل.
- **استنتاج الأمان:** اكتشاف Bearer وBasic ومفاتيح API في الترويسات أو الاستعلام أو ملفات الارتباط، مع إنشاء `securitySchemes` المناسبة.
- **أنواع محتوى متعددة:** JSON وXML وform-urlencoded وmultipart/form-data للنصوص والملفات وGraphQL والنص والبيانات الثنائية.
- **الحفاظ على اختبارات Postman:** تُدرج `pm.test()` / `pm.expect()` في `x-postman-scripts` لكل عملية.
- **التشخيص:** تتضمن كل مشكلة درجة خطورة ورمزًا وتفاصيل المصدر عند توافرها؛ يؤدي الوضع [`strict`](./api-reference.md#convertoptions) إلى استثناء عند حدوث أخطاء.
- **قابل للتوسعة:** نفّذ [`SourceAdapter`](./api-reference.md) لإضافة مصادر HAR أو HTTPie أو Insomnia.

---

## بنية الإضافات

يعتمد الإطار على واجهة محوّل صغيرة:

```typescript
interface SourceAdapter<I = unknown> {
  readonly id: string;                       // e.g. "curl", "postman", "har"
  canHandle?(input: unknown): boolean;       // used by "auto" detection
  parse(input: I, context: AdapterContext): Promise<NormalizedRequest[]>;
}
```

تُسجّل المحوّلات في مثيل [`XToOpenApi`](./api-reference.md#xtoopenapi) عبر [`AdapterRegistry`](./api-reference.md#adapterregistry):

```typescript
const converter = new XToOpenApi()
  .register(new CurlAdapter())
  .register(new PostmanAdapter());

// Explicit source id:
await converter.convert("curl", curlText);

// Auto-detect via canHandle():
await converter.convert("auto", someInput);
```

تتضمن الدوال المساعدة المحوّلين المدمجين مسبقًا، لذلك لا يحتاج معظم المستخدمين إلى التعامل مع السجل مباشرةً.

---

## اختيار الدوال المساعدة أو الصنف

| حالة الاستخدام | API |
|---|---|
| تحويل أمر curl واحد أو دفعة أوامر | [`curlToOpenApi`](./api-reference.md#curltoopenapi) |
| تحويل مجموعة Postman على هيئة كائن أو سلسلة | [`postmanToOpenApi`](./api-reference.md) |
| خيارات مخصصة أو محوّلات متعددة أو اكتشاف `"auto"` أو محوّل مخصص | [`new XToOpenApi()`](./api-reference.md#xtoopenapi) |

---

## الخطوات التالية

- [التثبيت](./installation.md) — أضف الحزمة وتعرّف إلى الدوال المساعدة التي لا تحتاج إلى إعداد.
- [البدء السريع](./quickstart.md) — حوّل أوامر curl ومجموعات Postman واستخدم محوّلًا مخصصًا.
- [مرجع API](./api-reference.md) — جميع الصادرات والأنواع والخيارات والقيم الافتراضية ورموز التشخيص.
- [أمثلة](./examples.md) — curl ودفعات الأوامر ومجموعات Postman والمحوّلات المخصصة واستنتاج المسارات.
