---
sidebar_position: 6
title: "الإعدادات"
description: "تُحل الإعدادات وفق الأولوية: وسائط CLI > ملف الإعدادات > القيم الافتراضية. والنتيجة هي كائن CliConfig الذي تعيده resolveConfig."
---

# الإعدادات

تُحل الإعدادات وفق الأولوية: **وسائط CLI > ملف الإعدادات > القيم الافتراضية**. والنتيجة هي كائن `CliConfig` الذي تعيده [`resolveConfig`](./api-reference.md#resolveconfig).

## CliConfig

نوع الإعدادات الأساسي. جميع الحقول اختيارية باستثناء `specPath`.

| الحقل | النوع | القيمة الافتراضية | الوصف |
|-------|------|---------|-------------|
| `specPath` | `string` | **مطلوب** | مسار أو عنوان `http(s)://` لمواصفات OpenAPI 3.2 بصيغة JSON |
| `serverUrl` | `string` | *(من المواصفات)* | تجاوز عنوان URL الأساسي للخادم في المواصفات |
| `outputDir` | `string` | `"./openapi-cli-report"` | مجلد كتابة ملفات التقارير |
| `formats` | `ReportFormat[]` | `["json","cli","html"]` | صيغ التقارير المطلوب توليدها |
| `filter` | `FilterConfig` | `undefined` | تصفية العمليات المراد اختبارها |
| `concurrency` | `number` | `5` | الحد الأقصى للطلبات المتزامنة؛ عدد صحيح من 1 إلى 100 |
| `timeout` | `number` | `30000` | مهلة كل طلب بالمللي ثانية، عدد صحيح من 1 إلى 600000؛ تنطبق أيضًا عند جلب مواصفات بعيدة |
| `proxy` | `string` | `undefined` | عنوان وكيل HTTP(S)، مثل `http://proxy:8080` |
| `tls` | `TlsConfig` | `undefined` | إعدادات TLS والشهادات |
| `headers` | `Record<string, string>` | `undefined` | ترويسات إضافية تُرسل مع كل طلب |
| `auth` | `AuthConfig` | `undefined` | إعدادات المصادقة |
| `variables` | `Record<string, string>` | `undefined` | متغيرات Postman بصيغة `{{name}}` المطلوب إدراجها |
| `failOnError` | `boolean` | `true` | خاص بـ CLI: إرجاع رمز غير صفري بعد فشل اختبار؛ على مستخدمي المكتبة فحص التقرير |
| `envFile` | `string` | `undefined` | مسار ملف `.env` يحتوي على زوج `KEY=VALUE` في كل سطر |
| `grpcReflection` | `boolean` | تلقائي | gRPC: الأولوية للإعداد الصريح ثم امتداد العملية؛ وإلا يُفعّل عند عدم توفير مسارات proto |
| `grpcProtoPaths` | `string[]` | `undefined` | gRPC: مسارات ملفات `.proto` أو مجلداتها |
| `mcpTransport` | `"streamable-http" \| "stdio"` | `"streamable-http"` | MCP: وسيلة نقل عمليات MCP |
| `mcpCommand` | `string` | `undefined` | MCP stdio: الأمر المطلوب تشغيله |
| `mcpArgs` | `string[]` | `undefined` | MCP stdio: وسائط الأمر |
| `mcpCwd` | `string` | `undefined` | MCP stdio: مجلد العمل |

`ReportFormat` هو النوع الاتحادي `"json" | "cli" | "html"`.

## خيارات التنفيذ المتقدمة

الحقول التالية جزء من `CliConfig` أيضًا. يمكن توفير `requester` و`maxEvents` و`maxStreamMs` و`maxResponseSize` في ملف JSON. بعد حل الإعدادات، مرّر `signal` و`httpRuntime` و`resolveTransport` مباشرة إلى `runTests()` من الشيفرة؛ فهي كائنات وقت تشغيل وليست إعدادات JSON.

```typescript
interface AdvancedRuntimeOptions {
  requester?: {
    followRedirects?: boolean;
    maxRedirects?: number;
    disableCookies?: boolean;
    protocolVersion?: "http1" | "http2" | "auto";
  };
  maxEvents?: number;
  maxStreamMs?: number;
  maxResponseSize?: number;
  signal?: AbortSignal;
  httpRuntime?: { certificates?: unknown; fileResolver?: unknown };
  resolveTransport?: (target: { protocol: string; url?: string }) => Promise<
    Pick<CliConfig, "proxy" | "tls" | "httpRuntime">
  >;
}
```

يتحكم `requester` في إعادة توجيه HTTP وملفات تعريف الارتباط واختيار البروتوكول. في HTTP/SSE، القيمة الافتراضية لـ `maxEvents` هي 50، ويستخدم `maxStreamMs` قيمة `timeout` إن لم يُضبط؛ ويُمرّر `maxResponseSize` إلى بيئة تنفيذ الطلبات. يستخدم gRPC قيمة `maxStreamMs` مهلةً للتدفق، ثم `timeout`، ثم 30000 مللي ثانية. يلغي `signal` التشغيل؛ ويوفر `httpRuntime` معالجة شهادات HTTP والملفات؛ ويحل `resolveTransport` إعدادات النقل لكل هدف.

## DEFAULT_CONFIG

كائن القيم الافتراضية المدمج الذي تصدّره المكتبة:

```ts
export const DEFAULT_CONFIG: Required<
  Pick<
    CliConfig,
    "outputDir" | "formats" | "concurrency" | "timeout" | "failOnError" | "grpcReflection" | "mcpTransport"
  >
> = {
  outputDir: "./openapi-cli-report",
  formats: ["json", "cli", "html"],
  concurrency: 5,
  timeout: 30000,
  failOnError: true,
  grpcReflection: true,
  mcpTransport: "streamable-http",
};
```

## FilterConfig

| الحقل | النوع | الوصف |
|-------|------|-------------|
| `methods` | `string[]` | اختبار طرق HTTP هذه فقط، مثل `["get","post"]`؛ استخدم أحرفًا صغيرة في الملفات، بينما يُطبّع إدخال CLI تلقائيًا |
| `paths` | `string[]` | اختبار المسارات المطابقة لأي تعبير نمطي؛ وإذا كان التعبير غير صالح تُستخدم مطابقة سلسلة فرعية |
| `tags` | `string[]` | اختبار العمليات التي تحمل أيًا من هذه الوسوم فقط |
| `operationIds` | `string[]` | اختبار قيم `operationId` المطابقة تمامًا فقط |

إذا لم يتضمن المرشح أي مفاتيح، يُحل إلى `undefined` وتُشغّل جميع العمليات.

## TlsConfig

| الحقل | النوع | الوصف |
|-------|------|-------------|
| `caCert` | `string` | مسار حزمة شهادات CA بصيغة PEM |
| `clientCert` | `string` | مسار شهادة العميل PEM لاستخدام mTLS |
| `clientKey` | `string` | مسار المفتاح الخاص للعميل PEM لاستخدام mTLS |
| `strictSSL` | `boolean` | تجاوز التحقق من شهادة TLS عندما تكون القيمة `false`؛ غير آمن |
| `pfx` | `string` | مسار حزمة شهادات PFX؛ يتطلب gRPC صيغة PEM بدلًا منها |
| `passphrase` | `string` | عبارة مرور مواد الشهادة المشفرة |

> ملاحظة: يقابل خيار CLI المسمى `--insecure` الإعداد `tls.strictSSL = false`، أي إنه **يعطّل** التحقق.

## AuthConfig

| الحقل | النوع | الوصف |
|-------|------|-------------|
| `type` | `AuthConfig["type"]` | آلية المصادقة؛ الأسماء المدعومة موضحة أدناه |
| `parameters` | `Record<string, string \| number \| boolean>` | معاملات خاصة بالآلية تُمرّر إلى بيئة تنفيذ الطلبات |
| `token` | `string` | رمز Bearer عند `type: "bearer"` |
| `username` | `string` | اسم المستخدم عند `type: "basic"` |
| `password` | `string` | كلمة المرور عند `type: "basic"` |
| `key` | `string` | اسم مفتاح API عند `type: "apikey"` |
| `value` | `string` | قيمة مفتاح API عند `type: "apikey"` |
| `in` | `"header" \| "query"` | موضع إدراج مفتاح API |

قيم `type` المدعومة هي `bearer` و`basic` و`apikey` و`none` و`digest` و`oauth1` و`oauth2` و`jwt` و`hawk` و`aws4` و`ntlm` و`asap` و`edgegrid`. يعتمد التوفر والمعاملات المطلوبة على البروتوكول وبيئة تنفيذ الطلبات؛ فتحديد الاسم وحده لا يضبط المصادقة.

حاليًا، لا ينتج خيار CLI المسمى `--bearer` إلا `{ type: "bearer", token }`. ويمكن توفير إعدادات `basic` / `apikey` الأكثر تفصيلًا من ملف الإعدادات.

## ملف إعدادات JSON

الملف هو JSON عادي يتوافق مع `Partial<CliConfig>`. مرّره باستخدام `--config <path>` / `-c`. تكون الأولوية دائمًا لوسائط CLI على قيم الملف.

```json
{
  "specPath": "./openapi.json",
  "serverUrl": "https://api.staging.example.com",
  "outputDir": "./reports",
  "formats": ["json", "html"],
  "concurrency": 10,
  "timeout": 15000,
  "failOnError": true,
  "proxy": "http://proxy.corp:8080",
  "tls": {
    "strictSSL": true,
    "caCert": "./ca-bundle.pem",
    "clientCert": "./client.crt",
    "clientKey": "./client.key"
  },
  "headers": {
    "X-API-Key": "${API_KEY}",
    "X-Environment": "staging"
  },
  "auth": {
    "type": "bearer",
    "token": "${BEARER_TOKEN}"
  },
  "variables": {
    "host": "api.staging.example.com"
  },
  "filter": {
    "methods": ["get", "post"],
    "tags": ["v2", "public"],
    "paths": ["^/api/v2"],
    "operationIds": ["getUser", "createUser"]
  },
  "grpcReflection": true,
  "grpcProtoPaths": ["./proto"],
  "mcpTransport": "streamable-http",
  "mcpCommand": "npx",
  "mcpArgs": ["-y", "@modelcontextprotocol/server-everything"],
  "mcpCwd": "./mcp-servers"
}
```

إذا لم يوجد الملف، يُطرح `Config file not found: <path>`؛ وإذا كان JSON غير صالح، يُطرح `Invalid config file (must be JSON)`.

## توسيع متغيرات البيئة

بعد تحميل ملف `.env` عبر `--env` / `envFile`، تُوسّع مراجع `${VAR_NAME}` في الحقول النصية التالية:

- `serverUrl`
- `proxy`
- قيم `headers`
- `auth.token`
- قيم `variables`

مثال:

```bash
openapi-cli --spec openapi.json \
  --server 'https://${API_HOST}/v1' \
  --header 'Authorization: Bearer ${BEARER_TOKEN}'
```

سلوك `.env`: **لا** تُستبدل قيم `process.env` الموجودة؛ وتُزال علامات الاقتباس المفردة أو المزدوجة المحيطة بالقيم؛ وتُتجاهل الأسطر الفارغة وتعليقات `#`؛ ويُتجاوز الملف المفقود دون إشعار.

## إنشاء الإعدادات برمجيًا

```typescript
import { resolveConfig, DEFAULT_CONFIG } from "@powerduck/openapi-cli";

const config = resolveConfig({
  spec: "./openapi.json",
  server: "https://api.staging.example.com",
  concurrency: 10,
  method: "get",
});
```

تطرح `resolveConfig` الخطأ `"No OpenAPI spec path provided..."` عند عدم توفير مواصفات، والخطأ `Invalid proxy URL: <url>` عندما لا تكون قيمة `proxy` عنوان URL صالحًا.
