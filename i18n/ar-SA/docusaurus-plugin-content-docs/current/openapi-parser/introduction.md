---
sidebar_position: 1
title: "مقدمة"
description: "حوّل أي مستند Swagger 2.0 أو OpenAPI 3.0 أو 3.1 أو 3.2 إلى OpenAPI 3.2 باستدعاء واحد."
keywords: ["openapi-parser", "powerduck", "Swagger", "OpenAPI 3.2"]
---

# @powerduck/openapi-parser

حوّل أي مستند Swagger 2.0 أو OpenAPI 3.0 أو 3.1 أو 3.2 إلى OpenAPI 3.2 باستدعاء واحد.

غلاف خفيف حول المكتبتين التاليتين: [`@scalar/openapi-parser`](https://github.com/scalar/openapi-parser), [`@scalar/openapi-upgrader`](https://github.com/scalar/openapi-parser/tree/main/packages/openapi-upgrader).
لا يعيد تنفيذ التحليل أو التحقق أو التحويل، بل يربطها معًا ويعطي كل إخفاق بنية موحدة ومتوقعة مع رمز خطأ قابل للقراءة آليًا.

- **اسم الحزمة:** `@powerduck/openapi-parser`
- **الإصدار:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-parser"/>
- **الترخيص:** MIT
- **Node.js:** >= 22.12.0

## الميزات

- **دالة واحدة لجميع الإصدارات** — تُحوَّل مستندات Swagger 2.0 وOpenAPI 3.0.x و3.1.x و3.2.x إلى مستند 3.2 تم التحقق منه.
- **إدخال سلاسل JSON وYAML** — مرّر كائنًا سبق تحليله أو سلسلة JSON/YAML خامًا.
- **رموز أخطاء قابلة للقراءة آليًا** — يظهر كل إخفاق على هيئة `OpenApiUpgradeError` يتضمن قيمة من تعداد `UpgradeErrorCode`.
- **دون تعديل الإدخال** — تُنسخ المدخلات نسخًا عميقًا عبر `structuredClone` قبل بدء أي مرحلة تحويل.
- **حماية من المراجع الدائرية** — يكتشف الدورات في الإدخال قبل أن تسبب تجاوز سعة المكدس.
- **التحقق من المخرجات** — يُتحقق افتراضيًا من مطابقة مستند 3.2 الناتج للمخطط.
- **دعم ESM وCJS** — استخدم `import` في Node الحديث وأدوات التجميع، و`require()` في عملية Electron الرئيسية.

## الخطوات التالية

- [التثبيت](/docs/ar-SA/openapi-parser/installation/) — التثبيت والمتطلبات
- [البدء السريع](/docs/ar-SA/openapi-parser/quickstart/) — تحويل مستندك الأول
- [مرجع API](/docs/ar-SA/openapi-parser/api-reference/) — جميع الصادرات ورموز الأخطاء والخيارات
- [أمثلة](/docs/ar-SA/openapi-parser/examples/) — معالجة الأخطاء والخيارات والاستخدام مع CommonJS
