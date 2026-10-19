---
sidebar_position: 5
title: "أمثلة"
description: "أمثلة عملية على @powerduck/openapi-cli تستند إلى خيارات CLI وواجهة البرمجة المتاحة فعليًا."
---

# أمثلة

أمثلة عملية على `@powerduck/openapi-cli` تستند إلى خيارات CLI وواجهة البرمجة المتاحة فعليًا.

## 1. اختبار CLI أساسي

حدّد مستند OpenAPI محليًا لتشغيل جميع عملياته:

```bash
openapi-cli --spec openapi.json
```

غيّر الخادم واحفظ التقارير في مجلد مخصص:

```bash
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --output ./reports
```

اختبر مواصفات مستضافة على عنوان URL بعيد:

```bash
openapi-cli --spec https://docs.example.com/openapi.json --timeout 60000
```

## 2. التشغيل من الشيفرة مع المصادقة

استخدم واجهة المكتبة مع رمز Bearer وترويسات مخصصة وإعداد التزامن:

```typescript
import {
  resolveConfig,
  runTests,
  printCliReport,
  generateJsonReport,
  generateHtmlReport,
} from "@powerduck/openapi-cli";

const config = resolveConfig({
  spec: "./openapi.json",
  server: "https://api.staging.example.com",
  concurrency: 10,
  timeout: 15000,
  bearer: process.env.BEARER_TOKEN,
  header: ["X-Environment: staging", "X-Team: platform"],
});

const report = await runTests(config);

printCliReport(report);
generateJsonReport(report, "./reports");
generateHtmlReport(report, "./reports");

console.log(
  `Passed ${report.summary.passed}/${report.summary.total} (${report.summary.passRate}%)`,
);
```

## 3. تشغيل اختبارات مع التصفية

شغّل مجموعة محددة من العمليات حسب الطريقة أو الوسم أو التعبير النمطي للمسار أو operationId:

```bash
# Only GET and POST requests
openapi-cli --spec openapi.json --method get,post

# Only operations tagged "public" or "v2"
openapi-cli --spec openapi.json --tag public,v2

# Only paths under /api/v2
openapi-cli --spec openapi.json --path "^/api/v2"

# Only specific operations
openapi-cli --spec openapi.json --operation-id getUser,createUser
```

إعداد برمجي يجمع هذه المرشحات: تُجمع فئات التصفية المختلفة بعلاقة AND، وتُطابق الوسوم داخل الفئة الواحدة بعلاقة OR.

```typescript
const config = resolveConfig({
  spec: "./openapi.json",
  method: "get,post",
  tag: "public,v2",
  path: "^/api/v2",
  operationId: "getUser,createUser",
});
```

## 4. توليد تقارير JSON وHTML

اختر صيغ الإخراج باستخدام `--format`. افتراضيًا، تُنتج الصيغ الثلاث:

```bash
# CLI to stdout only, no files
openapi-cli --spec openapi.json --format cli

# JSON + HTML files, no colored stdout report
openapi-cli --spec openapi.json --format json,html --output ./reports
```

المكافئ في الشيفرة:

```typescript
import { resolveConfig, runTests, generateJsonReport, generateHtmlReport } from "@powerduck/openapi-cli";

const config = resolveConfig({
  spec: "./openapi.json",
  format: "json,html",
  output: "./reports",
});

const report = await runTests(config);

const jsonPath = generateJsonReport(report, config.outputDir);
const htmlPath = generateHtmlReport(report, config.outputDir);

console.log("Wrote", jsonPath, "and", htmlPath);
```

تكتب `generateJsonReport` ملف `report.json`، وتكتب `generateHtmlReport` ملف `report.html`. تنشئ الدالتان مجلد الإخراج إذا لم يكن موجودًا وتعيدان مسار الملف.

## 5. تأكيدات تصريحية في المواصفات

أضف مصفوفة `x-tests` إلى عملية. يحتاج كل عنصر إلى `name` ونوع `assert`:

```json
{
  "paths": {
    "/users/{id}": {
      "get": {
        "operationId": "getUser",
        "x-tests": [
          { "name": "status is 200", "assert": "status", "value": 200 },
          { "name": "content-type is JSON", "assert": "header", "key": "content-type", "contains": "application/json" },
          { "name": "user id exists", "assert": "jsonPath", "path": "$.id", "exists": true },
          { "name": "user is active", "assert": "jsonPath", "path": "$.status", "equals": "active" },
          { "name": "response under 2s", "assert": "responseTime", "max": 2000 },
          { "name": "body contains email", "assert": "bodyContains", "contains": "@" }
        ],
        "responses": { "200": { "description": "ok" } }
      }
    }
  }
}
```

أنواع التأكيدات:

| `assert` | الحقول المطلوبة | الغرض |
|----------|-----------------|---------|
| `status` | `value` | حالة HTTP تساوي `value` |
| `header` | `key`؛ و`contains` اختياري | الترويسة موجودة؛ ويمكن التحقق اختياريًا من احتوائها على سلسلة فرعية |
| `bodyContains` | `contains` | جسم الاستجابة يحتوي على السلسلة الفرعية |
| `bodyEquals` | `body` | جسم الاستجابة يساوي `body` تمامًا |
| `jsonPath` | `path`؛ و`equals` / `exists` اختياريان | حل JSONPath ثم مقارنة القيمة أو التحقق من وجودها |
| `responseTime` | `max` | يجب أن تكون المدة `<= max` بالمللي ثانية |

## 6. برامج Postman النصية

أدرج برنامج اختبار نصيًا بأسلوب Postman باستخدام `x-postman-scripts`:

```json
{
  "paths": {
    "/users": {
      "get": {
        "operationId": "listUsers",
        "x-postman-scripts": {
          "test": "pm.test('status is 200', () => pm.response.to.have.status(200)); pm.test('users is an array', () => pm.expect(pm.response.json().users).to.be.an('array'));"
        },
        "responses": { "200": { "description": "ok" } }
      }
    }
  }
}
```

يمكن استخدام التأكيدات التصريحية `x-tests` و`x-postman-scripts` معًا على العملية نفسها.

## 7. التكامل المستمر عبر GitHub Actions

```yaml
name: API Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - name: Run API tests
        run: npx @powerduck/openapi-cli --spec openapi.json --server "$API_URL" --bearer "$BEARER_TOKEN" --output ./reports
        env:
          API_URL: ${{ secrets.API_URL }}
          BEARER_TOKEN: ${{ secrets.BEARER_TOKEN }}
      - name: Upload reports
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: openapi-cli-reports
          path: ./reports
```

افتراضيًا، ترجع الاختبارات الفاشلة رمز الخروج `1`، وترجع أخطاء الإعدادات أو أخطاء التنفيذ الفادحة `2`، فتفشل مهمة CI. استخدم `--no-fail-on-error` كي لا يؤدي تشغيل اختبارات مكتمل إلى فشل مسار العمل؛ لكنه لا يخفي أخطاء الإعدادات أو الأخطاء الفادحة.
