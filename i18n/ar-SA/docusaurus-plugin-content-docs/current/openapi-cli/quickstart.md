---
sidebar_position: 3
title: "البدء السريع"
description: "شغّل أول مجموعة اختبارات باستخدام @powerduck/openapi-cli من CLI ومن Node.js."
---

# البدء السريع

يرشدك هذا الدليل إلى اختبار أول مستند OpenAPI.

## المتطلبات المسبقة

- Node.js `>= 22.12.0`.
- مستند OpenAPI 3.2 بصيغة **JSON**. لا يُقبل YAML؛ حوّله إلى JSON أولاً. يجب أن يحتوي المستند على كائن `paths` في المستوى الأعلى.

## 1. التشغيل من CLI

أبسط تشغيل يحمّل مواصفة محلية ويختبر جميع العمليات على أول عنوان خادم معلن في المستند:

```bash
openapi-cli --spec openapi.json
```

تجاوز الخادم المستهدف واكتب التقارير في مجلد تختاره:

```bash
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --output ./reports
```

اختبر مواصفة بعيدة بعمليات `GET` فقط، مع 10 وحدات تنفيذ متزامنة:

```bash
openapi-cli --spec https://docs.example.com/openapi.json \
  --method get \
  --concurrency 10
```

استخدم ملف إعداد JSON للتكوينات المعقدة:

```bash
openapi-cli --config openapi-cli.config.json
```

تجد جميع الخيارات في [الأوامر](/docs/ar-SA/openapi-cli/commands/).

## 2. إنشاء مواصفة اختبار بسيطة

مستند OpenAPI مصغّر مع تأكيدات اختبار تصريحية:

```json
{
  "openapi": "3.2.0",
  "info": { "title": "Demo API", "version": "1.0.0" },
  "servers": [{ "url": "https://httpbin.org" }],
  "paths": {
    "/get": {
      "get": {
        "operationId": "getGet",
        "responses": { "200": { "description": "ok" } },
        "x-tests": [
          { "name": "status is 200", "assert": "status", "value": 200 },
          { "name": "response under 5s", "assert": "responseTime", "max": 5000 }
        ]
      }
    }
  }
}
```

إذا **لم** تعرّف العملية تأكيدات اختبار، يضيف المشغّل فحصًا ضمنيًا لنجاح البروتوكول. في HTTP يشترط حالة `2xx`، حتى لا تُعتبر استجابات 4xx/5xx ناجحة بصمت.

## 3. التشغيل من Node.js عبر API البرمجي

تتيح المكتبة المسار نفسه عبر دوال: `resolveConfig` → `runTests` → مولدات التقارير.

```typescript
import {
  resolveConfig,
  runTests,
  printCliReport,
  generateJsonReport,
  generateHtmlReport,
} from "@powerduck/openapi-cli";

// 1. Build a CliConfig from CLI-style args.
const config = resolveConfig({
  spec: "./openapi.json",
  server: "https://api.staging.example.com",
  concurrency: 10,
});

// 2. Run all collected tests.
const report = await runTests(config);

// 3. Emit the reports you need.
printCliReport(report);
generateJsonReport(report, "./reports");
generateHtmlReport(report, "./reports");

// 4. Exit with the correct code for CI.
if (report.summary.failed > 0 || report.summary.errors > 0) {
  process.exit(1);
}
```

تقبل `resolveConfig` بنية الخيارات نفسها المستخدمة في CLI. وتعيد `runTests` كائن `TestReport` يتضمن `summary` و`results` و`config` و`generatedAt` و`version`. [الإعدادات](/docs/ar-SA/openapi-cli/configuration/).

## 4. رموز الخروج للتكامل المستمر

| الرمز | المعنى |
|---|---|
| `0` | نجحت جميع الاختبارات أو فُعّل `--no-fail-on-error`. |
| `1` | فشل اختبار واحد أو أكثر، أو حدث خطأ أثناء تنفيذه. |
| `2` | خطأ إعداد، أو تعذر تحميل المواصفة، أو خطأ تشغيل فادح. |

## الخطوات التالية

- [الإعدادات](/docs/ar-SA/openapi-cli/configuration/) — جميع حقول `CliConfig` وقيمها الافتراضية.
- [الأوامر](/docs/ar-SA/openapi-cli/commands/) — جميع خيارات CLI.
- [أمثلة](/docs/ar-SA/openapi-cli/examples/) — المصادقة والتصفية والتقارير وتأكيدات الاختبار.
- [مرجع API](/docs/ar-SA/openapi-cli/api-reference/) — جميع الدوال والأنواع المصدّرة.
