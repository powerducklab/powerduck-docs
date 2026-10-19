---
sidebar_position: 4
title: "الإعدادات"
description: "خيارات التوليد في @powerduck/openapi-codegen: GenerateOptions وRequestIR وواجهتا Generator وPlugin."
---

# الإعدادات

لا يوجد ملف إعدادات منفصل. يتحكم في التوليد كائن `GenerateOptions` المُمرّر إلى [`generate()`](/docs/ar-SA/openapi-codegen/api-reference/).

## GenerateOptions

```ts
interface GenerateOptions {
  language: string;
  client: string;
  request?: RequestIR;
  document?: unknown;
  path?: string;
  method?: string;
  serverUrl?: string;
  securityValues?: Record<string, string>;
  softRefMode?: boolean;
}
```

| الخيار | النوع | مطلوب | الوصف |
|---|---|---|---|
| `language` | `string` | نعم | معرّف اللغة المستهدفة دون تمييز حالة الأحرف، مثل `"javascript"` |
| `client` | `string` | نعم | معرّف عميل HTTP المستهدف، مثل `"fetch"` |
| `request` | `RequestIR` | أحد البديلين* | طلب موحّد البنية مسبقًا؛ يتجاوز `normalize` |
| `document` | `unknown` | أحد البديلين* | كائن مستند OpenAPI محلّل مسبقًا |
| `path` | `string` | مع `document` | قالب مسار OpenAPI المطابق تمامًا، مثل `"/pets/{id}"` |
| `method` | `string` | مع `document` | طريقة HTTP، مثل `"get"` / `"post"` |
| `serverUrl` | `string` | لا | استبدال عنوان الخادم المحدد في المستند |
| `securityValues` | `Record<string, string>` | لا | بيانات اعتماد مفهرسة باسم مخطط الأمان |
| `softRefMode` | `boolean` | لا | عدم إطلاق خطأ عند وجود `$ref` معطوبة أو دائرية؛ وإعادة قيم جزئية |

\* يجب توفير `request` وحده، أو `document` + `path` + `method` معًا. عند توفير `request`، تُتجاهل `document` و`path` و`method` و`serverUrl` و`securityValues` و`softRefMode`.

### أخطاء التحقق من المدخلات

تطلق `generate()` خطأ عند غياب مدخل مطلوب:

- `TypeError: generate() requires an options object` — لم يُقدَّم كائن خيارات.
- `Error: Unsupported generator: <language>/<client>` — تركيبة غير معروفة.
- `TypeError: generate() requires either a 'request' or a 'document' option`
- `TypeError: generate() requires a 'path' option when using 'document'`
- `TypeError: generate() requires a 'method' option when using 'document'`

تطلق `normalize()` نفسها `Error` للطرق غير المدعومة أو غياب `paths` أو المسارات غير المعروفة أو العمليات المفقودة؛ وتطلق `TypeError` إذا لم يكن المستند كائنًا.

## RequestIR

تمثيل موحّد لطلب واحد، مستقل عن مولّد الشيفرة. يمكنك إنشاؤه مباشرة وتمريره عبر `options.request` لتجاوز `normalize`.

```ts
interface RequestIR {
  method: string;
  baseUrl: string;
  path: string;
  parameters: Parameter[];
  headers: Parameter[];
  body?: Body;
  security: Security[];
}
```

### Parameter

```ts
interface Parameter {
  name: string;
  in: ParameterLocation;
  value: unknown;
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
}

type ParameterLocation = "path" | "query" | "querystring" | "header" | "cookie";
```

### Body

```ts
interface Body {
  mediaType: string;
  value: unknown;
  encoding?: Record<string, unknown>;
}
```

### Security

```ts
interface Security {
  name: string;
  type: string;       // e.g. "apiKey" | "http"
  scheme?: string;    // e.g. "bearer" | "basic"
  in?: string;        // e.g. "header" | "query" | "cookie"
  paramName?: string;
  value: string;
}
```

### FileValue

تستخدم العناصر النائبة لملفات multipart بنية العلامة التالية:

```ts
interface FileValue {
  __file: true;
  path?: string;
  name?: string;
  contentType?: string;
  data?: string | ArrayBuffer | Uint8Array | Blob;
}
```

## Generator

المولّد هو أي كائن يطابق هذه الواجهة. تُنشأ المولّدات المدمجة باستخدام `createGenerator(language, client, emit)`، ويمكنك تسجيل مولّداتك أيضًا:

```ts
interface Generator {
  language: string;
  client: string;
  generate(request: RequestIR): string;
}
```

تستقبل `generate` كائن `RequestIR` وتعيد الشيفرة المصدرية المُولّدة كنص.

## Plugin

تسجّل الإضافة مولّدًا واحدًا أو أكثر عبر `use()`:

```ts
interface Plugin {
  name: string;
  register(api: { register(generator: Generator): void }): void;
}
```

مثال:

```typescript
import { use } from "@powerduck/openapi-codegen";

use({
  name: "my-plugin",
  register({ register }) {
    register({
      language: "mylang",
      client: "my-client",
      generate(request) {
        return `// ${request.method} ${request.path}`;
      },
    });
  },
});
```

## GenerateResult

هذا النوع مخصّص لمخرجات مستقبلية قد تشمل عدة ملفات. حاليًا ما تزال `generate()` تعيد `string`:

```ts
interface GenerateResult {
  code: string;
  files?: Record<string, string>;
  metadata?: Record<string, unknown>;
}
```

## بنية مخرجات normalize

يُعيد الاستدعاء المباشر لـ `normalize()` (راجع [مرجع API](/docs/ar-SA/openapi-codegen/api-reference/#normalizeoptions)) كائنًا أوسع قليلًا من `RequestIR`:

```ts
{
  preWarnings: string[];   // lightweight structural warnings
  method: string;          // uppercase
  baseUrl: string;
  path: string;
  parameters: NormalizedParameter[];
  headers: NormalizedParameter[];   // parameters filtered to in === "header"
  body?: { mediaType, value, encoding? };
  security: NormalizedSecurity[];
}
```

## ترتيب تحديد عنوان الخادم

تأخذ `baseUrl` أول قيمة غير فارغة من:

1. `options.serverUrl`
2. `servers` الخاصة بالعملية
3. `servers` الخاصة بعنصر المسار
4. `servers` في الجذر
5. القيمة البديلة `"https://example.com"`

تُملأ مواضع `{variable}` في عنوان الخادم من `server.variables` باستخدام `default` ثم `example` عند غيابها، مع ترميز URI.
