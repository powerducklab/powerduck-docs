---
sidebar_position: 5
title: "أوامر CLI"
description: "توفر الحزمة أمرًا تنفيذيًا واحدًا هو openapi-cli. ويقبل قائمة خيارات مباشرة؛ لا توجد أوامر فرعية من نوع run / validate / init:"
---

# أوامر CLI

توفر الحزمة أمرًا تنفيذيًا واحدًا هو `openapi-cli`. ويقبل قائمة خيارات مباشرة؛ **لا توجد** أوامر فرعية من نوع `run` / `validate` / `init`:

```
openapi-cli [options]
```

## الصيغة

```bash
openapi-cli --spec openapi.json [options]
openapi-cli -c config.json
```

تحديد المواصفات **إلزامي**: مرّر `--spec` أو `-s`، أو اضبط `specPath` في ملف إعدادات JSON يُحمّل باستخدام `--config`. بقية الخيارات اختيارية.

## الخيارات الأساسية

| الخيار | الصيغة المختصرة | القيمة الافتراضية | الوصف |
|--------|-------|---------|-------------|
| `--spec <path-or-url>` | `-s` | — | مسار أو عنوان `http(s)://` لمواصفات OpenAPI 3.2 بصيغة JSON |
| `--server <url>` | `-S` | *(من المواصفات)* | تجاوز عنوان URL للخادم المحدد في المواصفات |
| `--output <dir>` | `-o` | `./openapi-cli-report` | مجلد إخراج التقارير |
| `--format <formats>` | `-f` | `json,cli,html` | صيغ التقارير مفصولة بفواصل: `json` و`cli` و`html` |
| `--config <path>` | `-c` | — | مسار ملف إعدادات JSON؛ الأولوية لوسائط CLI |

## خيارات التنفيذ

| الخيار | الصيغة المختصرة | القيمة الافتراضية | الوصف |
|--------|-------|---------|-------------|
| `--concurrency <n>` | `-n` | `5` | الحد الأقصى للطلبات المتزامنة؛ عدد صحيح من 1 إلى 100 |
| `--timeout <ms>` | `-t` | `30000` | مهلة كل طلب بالمللي ثانية، عدد صحيح من 1 إلى 600000؛ تُستخدم أيضًا عند جلب مواصفات بعيدة |
| `--no-fail-on-error` | — | معطّل | إرجاع `0` بعد اكتمال التشغيل حتى لو فشلت اختبارات؛ تظل أخطاء الإعدادات والأخطاء الفادحة سببًا للفشل |

## خيارات التصفية

| الخيار | القيمة الافتراضية | الوصف |
|--------|---------|-------------|
| `--method <methods>` | — | طرق HTTP المطلوب تضمينها، مفصولة بفواصل، مثل `get,post` |
| `--path <patterns>` | — | أنماط تعبيرات نمطية مفصولة بفواصل لمطابقتها مع كل مسار |
| `--tag <tags>` | — | وسوم OpenAPI المطلوب تضمينها، مفصولة بفواصل |
| `--operation-id <ids>` | — | قيم `operationId` المطلوب تضمينها، مفصولة بفواصل |

## خيارات الشبكة وTLS

| الخيار | الصيغة المختصرة | القيمة الافتراضية | الوصف |
|--------|-------|---------|-------------|
| `--proxy <url>` | `-p` | — | عنوان وكيل HTTP(S)، مثل `http://proxy.corp:8080` |
| `--ca <path>` | — | — | حزمة شهادات CA بصيغة PEM |
| `--cert <path>` | — | — | شهادة العميل بصيغة PEM لاستخدام mTLS |
| `--key <path>` | — | — | المفتاح الخاص للعميل بصيغة PEM لاستخدام mTLS |
| `--insecure` | `-k` | معطّل | تجاوز التحقق من شهادة TLS |

## المصادقة والترويسات والمتغيرات

| الخيار | الصيغة المختصرة | الوصف |
|--------|-------|-------------|
| `--header <headers...>` | `-H` | ترويسات إضافية بصيغة `Key: Value`؛ يمكن تكرار الخيار |
| `--bearer <token>` | — | رمز Bearer يُرسل في ترويسة `Authorization` |
| `--variable <vars...>` | `-v` | متغيرات Postman بصيغة `KEY=VALUE`؛ يمكن تكرار الخيار |
| `--env <path>` | — | مسار ملف `.env`؛ لا يستبدل متغيرات البيئة الموجودة |

## خيارات gRPC

| الخيار | القيمة الافتراضية | الوصف |
|--------|---------|-------------|
| `--grpc-no-reflection` | معطّل | تعطيل الاستكشاف الانعكاسي لخادم gRPC واستخدام ملفات proto بدلًا منه |
| `--grpc-proto <paths...>` | — | مسارات ملفات `.proto` أو المجلدات التي تحتوي عليها |

## خيارات MCP

| الخيار | القيمة الافتراضية | الوصف |
|--------|---------|-------------|
| `--mcp-transport <transport>` | `streamable-http` | وسيلة نقل MCP: `streamable-http` أو `stdio` |
| `--mcp-command <command>` | — | أمر MCP stdio، مثل `npx` |
| `--mcp-args <args>` | — | وسائط MCP stdio مفصولة بمسافات أو فواصل |
| `--mcp-cwd <dir>` | — | مجلد عمل العملية الفرعية MCP stdio |

## خيارات المعلومات

| الخيار | الصيغة المختصرة | الوصف |
|--------|-------|-------------|
| `--help` | `-h` | عرض المساعدة |
| `--version` | `-V` | عرض الإصدار |

## رموز الخروج

| الرمز | المعنى |
|------|---------|
| `0` | نجحت جميع الاختبارات أو فُعّل `--no-fail-on-error` |
| `1` | فشل اختبار واحد أو أكثر أو حدث خطأ فيه، أو تعذر تحليل وسائط CLI |
| `2` | خطأ في الإعدادات أو فشل تحميل المواصفات أو خطأ فادح أثناء التنفيذ |

تطبع CLI عبارة `Error:` باللون الأحمر وتخرج بالرمز `2` عندما تطرح `resolveConfig` استثناءً، مثل عدم توفير `--spec` وعدم ضبط `specPath`. وتطبع `Fatal error:` وتخرج بالرمز `2` عندما تطرح `runTests` استثناءً. بعد اكتمال التشغيل، لا ترجع `1` إلا إذا تحقق `report.summary.failed > 0 || report.summary.errors > 0` مع `failOnError !== false`.

## متغيرات البيئة

لا توجد متغيرات مخصصة باسم `OPENAPI_CLI_*`. تُقدّم الإعدادات عبر الخيارات وملف الإعدادات والآليات التالية:

- **ملف `.env`** — مرّر `--env .env` لتحميل أزواج `KEY=VALUE` إلى `process.env`. لا تُستبدل المتغيرات الموجودة.
- **توسيع `${VAR}`** — بعد التحميل، يُستبدل `${VAR_NAME}` داخل `serverUrl` و`proxy` وقيم `headers` و`auth.token` وقيم `variables`.

```bash
openapi-cli --spec openapi.json \
  --env .env \
  --server 'https://${API_HOST}/v1' \
  --bearer '${BEARER_TOKEN}'
```

## أمثلة التشغيل

```bash
# Test a local spec against its first server URL
openapi-cli --spec openapi.json

# Override the server and write JSON + HTML reports
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --format json,html --output ./reports

# Only GET requests, 10 workers, with a bearer token
openapi-cli --spec openapi.json --method get --concurrency 10 --bearer "$TOKEN"

# Use a config file
openapi-cli --config openapi-cli.config.json
```
