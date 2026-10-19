---
sidebar_position: 4
title: "مرجع API"
description: "مرجع نقطة الدخول العامة للحزمة @powerduck/x-to-openapi"
---

# مرجع API

مرجع نقطة الدخول العامة للحزمة `@powerduck/x-to-openapi`. تلخّص التوقيعات التالية واجهة API؛ راجع تصريحات TypeScript في الحزمة للاطلاع على جميع محددات readonly والأنواع المستوردة.

---

## دوال مساعدة لا تتطلب إعدادًا

### `curlToOpenApi`

تحويل باستدعاء واحد: تسجّل [`CurlAdapter`](#curladapter) ثم تستدعي [`convert`](#convertsource-input-options).

```typescript
function curlToOpenApi(
  input: string | readonly string[],
  options?: ConvertOptions,
): Promise<ConvertResult>;
```

| المعامل | النوع | الوصف |
|---|---|---|
| `input` | `string \| readonly string[]` | أمر curl أو مصفوفة أوامر أو ناتج «Copy all as cURL» من المتصفح؛ يُقسَّم النص الذي يحتوي على أوامر متعددة تلقائيًا. |
| `options` | `ConvertOptions` | إعدادات تحويل اختيارية. |

**القيمة المُعادة:** [`ConvertResult`](#convertresult).

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  "curl -X POST https://api.example.com/users -H 'Content-Type: application/json' --data '{\"name\":\"Ada\"}'",
);
```

---

### `postmanToOpenApi`

تحويل باستدعاء واحد: تسجّل [`PostmanAdapter`](#postmanadapter) وتحوّل كائن مجموعة جرى تحليله أو سلسلة JSON. تُحفَظ نصوص الاختبار البرمجية بصيغة `x-postman-scripts`.

```typescript
function postmanToOpenApi(
  input: unknown,
  options?: ConvertOptions,
): Promise<ConvertResult>;
```

| المعامل | النوع | الوصف |
|---|---|---|
| `input` | `unknown` | كائن Postman Collection بالإصدار v2.0/v2.1.0 أو سلسلة JSON تمثّله. |
| `options` | `ConvertOptions` | إعدادات تحويل اختيارية. |

**القيمة المُعادة:** [`ConvertResult`](#convertresult).

---

## البنية الأساسية

### `XToOpenApi`

صنف المحوّل. يحتفظ بـ [`AdapterRegistry`](#adapterregistry) وينفّذ مراحل التحليل ← البناء ← التحقق.

```typescript
class XToOpenApi {
  register<I>(adapter: SourceAdapter<I>): this;
  adapters(): string[];
  convert(
    source: string,
    input: unknown,
    options?: ConvertOptions,
  ): Promise<ConvertResult>;
}
```

#### `register(adapter)`

تسجّل محوّلًا. تُعيد `this` لربط الاستدعاءات. تتحقق من `id` المحوّل باستخدام `/^[a-z][a-z0-9-]*$/`، وتشترط وجود الدالة `parse()`، وترفض المعرّفات المكررة.

#### `adapters()`

تُعيد معرّفات المحوّلات المسجّلة بصيغة `string[]`.

#### `convert(source, input, options?)`

نقطة الدخول الوحيدة.

| المعامل | النوع | الوصف |
|---|---|---|
| `source` | `string` | معرّف محوّل (`"curl"` أو `"postman"` أو غيرهما)، أو `"auto"` للاختيار عبر `canHandle()`. |
| `input` | `unknown` | بيانات المصدر؛ تعتمد بنيتها على المحوّل. |
| `options` | `ConvertOptions` | إعدادات تحويل اختيارية. |

**السلوك:**

1. تستكمل الخيارات من [`DEFAULT_OPTIONS`](#default_options) وتتحقق منها.
2. ترفض السلاسل، أو مجموع عناصر السلاسل في مصفوفة، إذا تجاوزت **10 × 1024 × 1024 وحدة ترميز في JavaScript**، وتطرح `ConversionError`. هذا ليس حدًا لعدد بايتات UTF-8؛ ولا يُقاس حجم الكائنات التي جرى تحليلها.
3. تختار المحوّل بمعرّف صريح أو بالكشف `"auto"`.
4. تحلّل الإدخال إلى `NormalizedRequest[]`؛ وتحوّل حالات فشل التحليل إلى تشخيصات.
5. تبني مستند OpenAPI 3.2 عبر [`buildOpenApi32`](#buildopenapi32).
6. إذا كانت `validate` تساوي `true`، تتحقق عبر [`validateOpenApi32`](#validateopenapi32) وتدمج تشخيصات النتيجة.
7. تُعيد [`ConvertResult`](#convertresult).

```typescript
import { XToOpenApi, CurlAdapter } from "@powerduck/x-to-openapi";

const converter = new XToOpenApi().register(new CurlAdapter());
const result = await converter.convert("curl", curlText, { title: "My API" });
```

---

### `DEFAULT_OPTIONS`

القيم الافتراضية التي تُدمَج معها جميع [`ConvertOptions`](#convertoptions). تُصدَّر بصيغة `ResolvedConvertOptions`.

```typescript
const DEFAULT_OPTIONS: ResolvedConvertOptions = {
  openapiVersion: "3.2.0",
  title: "Generated API",
  version: "1.0.0",
  description: "",
  inferPathParameters: true,
  pathParameterMinSamples: 2,
  inferSecurity: true,
  includeCommonHeaders: false,
  includeCookies: false,
  includeExamples: false,
  useServerBasePath: false,
  validate: true,
  strict: false,
};
```

---

### `AdapterRegistry`

تحتفظ بالمحوّلات المسجّلة حسب المعرّف.

```typescript
class AdapterRegistry {
  register<I>(adapter: SourceAdapter<I>): this;
  has(id: string): boolean;
  get(id: string): SourceAdapter<unknown>;
  detect(input: unknown): SourceAdapter<unknown> | undefined;
  ids(): string[];
}
```

| الدالة | الوصف |
|---|---|
| `register(adapter)` | تتحقق من المعرّف (`/^[a-z][a-z0-9-]*$/`) ومن وجود `parse()`، وترفض التكرار. تُعيد `this`. |
| `has(id)` | تتحقق مما إذا كان المحوّل مسجّلًا. |
| `get(id)` | تُعيد المحوّل أو تطرح خطأ يسرد المعرّفات المسجّلة. |
| `detect(input)` | تُعيد أول محوّل تقبل دالته `canHandle()` الإدخال. تُلتقط الاستثناءات في دوال الاختبار ويُتجاوز المحوّل المعني. |
| `ids()` | تسرد المعرّفات المسجّلة. |

---

### `ConversionError`

يُطرَح عند وجود تشخيصات بمستوى خطأ في وضع `strict`، أو سلاسل إدخال أطول من الحد، أو فشل الاختيار التلقائي للمحوّل. يحمل التشخيصات المتاحة، وقد تكون القائمة فارغة. قد تطرح الخيارات غير الصالحة وأخطاء التسجيل `TypeError` أو `Error` بدلًا منه.

```typescript
class ConversionError extends Error {
  readonly diagnostics: readonly Diagnostic[];
  constructor(
    message: string,
    diagnostics: readonly Diagnostic[],
    options?: { cause?: unknown },
  );
}
```

---

### `DiagnosticBag`

مجمّع داخلي تستخدمه [`XToOpenApi.convert`](#convertsource-input-options). يزيل التشخيصات المكررة ويطرح `ConversionError` للتشخيصات بمستوى خطأ عندما تكون `strict` مساوية لـ `true`.

```typescript
class DiagnosticBag {
  constructor(strict?: boolean); // default false
  report(diagnostic: Diagnostic): void;
  get items(): Diagnostic[];
  hasErrors(): boolean;
}
```

---

## المحوّلات

### `CurlAdapter`

يحوّل أوامر curl الفردية أو المجمّعة أو تصدير المتصفح إلى `NormalizedRequest[]`. يغلّف `curlconverter` ويوحّد صيغة خرجه.

```typescript
class CurlAdapter implements SourceAdapter<string | readonly string[]> {
  readonly id = "curl";
  canHandle(input: unknown): boolean;
  parse(
    input: string | readonly string[],
    context: AdapterContext,
  ): Promise<NormalizedRequest[]>;
}
```

- تقبل `canHandle` سلسلة، أو العنصر الأول في مصفوفة، تبدأ بموجّه صدفة اختياري (`$` أو `#` أو `>`) يتبعه `curl` أو `curl.exe`.
- تقسّم `parse` الإدخال متعدد الأوامر عبر [`splitCurlCommands`](#splitcurlcommands)، وتتجاوز عناوين URL غير المستندة إلى HTTP(S)، وتحذف ترويسات HTTP/2 الزائفة، وتحلّل الأجسام وملفات تعريف الارتباط، وتستنتج المصادقة.

> `resolveBackend` و`availableExports` و`resetBackend` دوال تكامل داخلية، وليست صادرات مدعومة من الحزمة. استورد المحوّل العام بدلًا من الملفات الداخلية.

---

### `splitCurlCommands`

تقسّم ناتج «Copy all as cURL» من المتصفح إلى أوامر منفردة. تدعم علامتي الاقتباس المفردة والمزدوجة، ومتابعة الأسطر بالشرطة المائلة العكسية وعلامة الإقحام (`^`)، وCRLF، وموجّهات الصدفة (`$` و`#` و`>` و`PS C:\>`)، و`curl.exe`.

```typescript
function splitCurlCommands(input: string): string[];
```

```typescript
import { splitCurlCommands } from "@powerduck/x-to-openapi";

const commands = splitCurlCommands(`
  $ curl https://api.example.com/users
  > curl https://api.example.com/users/123
`);
// ["curl https://api.example.com/users", "curl https://api.example.com/users/123"]
```

---

### `PostmanAdapter`

يحوّل Postman Collections بالإصدارين v2.0/v2.1.0 إلى `NormalizedRequest[]`. يجتاز المجلدات المتداخلة، ويحلّ وراثة المصادقة بأولوية العنصر ثم المجلد ثم المجموعة، ويطابق أنماط الجسم، ويحفظ نصوص الاختبار البرمجية.

```typescript
class PostmanAdapter implements SourceAdapter<PostmanCollection | string> {
  readonly id = "postman";
  canHandle(input: unknown): boolean;
  parse(
    input: PostmanCollection | string,
    context: AdapterContext,
  ): Promise<NormalizedRequest[]>;
}
```

- تقبل `canHandle` كائنًا أو سلسلة JSON جرى تحليلها، تحتوي على كائن `info` ومصفوفة `item`. تُقبَل عناوين مخططي v2.1.0 وv2.0، وكذلك المجموعات ذات البنية الصحيحة التي لا تتضمن عنوان مخطط.
- تُضاف أحداث الاختبار وما قبل الطلب إلى العملية بصيغة `x-postman-scripts`.

---

### `PostmanTypes`

نطاق أسماء يضم جميع أنواع مجموعات Postman التي يستخدمها المحوّل:

```typescript
import { PostmanTypes } from "@powerduck/x-to-openapi";

type Collection = PostmanTypes.PostmanCollection;
type Item = PostmanTypes.PostmanItem;
type Request = PostmanTypes.PostmanRequest;
type Body = PostmanTypes.PostmanBody;
type Auth = PostmanTypes.PostmanAuth;
type Script = PostmanTypes.PostmanScript;

// Runtime type guards are functions; the other members are TypeScript types.
const isFolder = PostmanTypes.isFolder;
const isRequestItem = PostmanTypes.isRequestItem;
```

أهم الأعضاء: `PostmanCollection`, `PostmanInfo`, `PostmanVersion`, `PostmanItem`, `PostmanFolder`, `PostmanRequestItem`, `PostmanRequest`, `PostmanHeader`, `PostmanUrl`, `PostmanQueryParam`, `PostmanBodyMode`, `PostmanBody`, `PostmanUrlEncodedParam`, `PostmanFormDataParam`, `PostmanFileParam`, `PostmanGraphQLBody`, `PostmanAuthType`, `PostmanAuth`, `PostmanAuthParam`, `PostmanEvent`, `PostmanScript`, `PostmanVariable`, `PostmanDescription`, `isFolder`, `isRequestItem`.

---

## مكوّنات بناء OpenAPI

### `buildOpenApi32`

بانٍ منخفض المستوى. ينشئ مستند OpenAPI 3.2 من مصفوفة طلبات موحّدة الصيغة مسبقًا. يُستدعى عادةً بصورة غير مباشرة عبر [`XToOpenApi.convert`](#convertsource-input-options).

```typescript
function buildOpenApi32(
  requests: readonly NormalizedRequest[],
  options: ResolvedConvertOptions,
  report: (diagnostic: Diagnostic) => void,
): OpenApiDocument;
```

يجمع العمليات بحسب المسار والطريقة، ويجمع معاملات الاستعلام والترويسات وملفات تعريف الارتباط والمسار، ويدمج مخططات الأجسام، ويولّد `securitySchemes`، ويضع الطرق غير القياسية في `additionalOperations`، ويعيّن `operationId`/`tags`.

---

### `buildPathTemplates`

يجمع الطلبات المتشابهة في البنية، ويحوّل المقاطع إلى معاملات إذا اختلفت بين `minSamples` عينة على الأقل وبدت كمعرّفات في كل عينة.

```typescript
function buildPathTemplates(
  requests: readonly NormalizedRequest[],
  minSamples: number,
  enabled: boolean,
): Map<number, PathTemplate>;
```

يُعيد خريطة مفاتيحها `sourceIndex`. يحتوي كل `PathTemplate` على:

```typescript
interface PathTemplate {
  readonly path: string;                    // e.g. "/users/{userId}"
  readonly parameters: ReadonlyMap<number, string>; // segment index → name
}
```

عندما تكون `enabled` مساوية لـ `false`، يحصل كل طلب على قالب ثابت يطابق اسم مساره الأصلي.

---

### `looksLikeIdentifier`

القاعدة المركزية لتحديد المقاطع التي يمكن تحويلها إلى معاملات.

```typescript
function looksLikeIdentifier(segment: string): boolean;
```

تُعيد `true` إذا كان المقطع أرقامًا فقط، أو UUID، أو ULID، أو سلسلة سداسية عشرية بطول 8 محارف على الأقل.

---

### `scalar`

تستنتج JSON Schema من عينة سلسلة واحدة باتباع نهج متحفّظ عمدًا.

```typescript
function scalar(value: string, includeExample?: boolean): Schema; // default false
```

تستنتج `boolean` أو `integer` مع حد للطول يضمن سلامة الأعداد الصحيحة أو `number` أو `string` مع `format` (`uuid` أو `date` أو `date-time`)؛ وإلا تستخدم `string` عاديًا.

---

### `jsonSchema`

تستنتج JSON Schema من أي قيمة JSON: كائن أو مصفوفة أو قيمة مفردة.

```typescript
function jsonSchema(value: unknown, includeExample?: boolean): Schema; // default false
```

تصبح الكائنات `{ type: "object", properties, required }`، والمصفوفات `{ type: "array", items }` مع `{}` للمصفوفات الفارغة؛ وتتبع القيم المفردة قواعد نوع مشابهة لـ `scalar`.

---

### `mergeSchemas`

تدمج مخططات عينات متعددة بنيويًا. تُوحَّد خصائص الكائنات؛ وتصبح الخاصية اختيارية إذا غابت عن أي عينة. تُعالَج المصفوفات تكراريًا؛ ويُوسَّع `integer` إلى `number`؛ ولا تُحفَظ التنسيقات إلا إذا تطابقت في جميع العينات.

```typescript
function mergeSchemas(schemas: readonly Schema[]): Schema;
```

---

### `Schema`

المجموعة الجزئية البنيوية من JSON Schema المستخدمة للأجسام والمعاملات المستنتجة.

```typescript
interface Schema {
  type?: string | string[];
  format?: string;
  properties?: Record<string, Schema>;
  required?: string[];
  items?: Schema;
  example?: unknown;
  contentMediaType?: string;
  description?: string;
  nullable?: boolean;
  [key: string]: unknown; // OpenAPI extensions and unmodeled fields
}
```

---

## النوع المعتمد والتحقق

### `validateOpenApi32`

تتحقق من مستند OpenAPI مقابل مخطط OpenAPI 3.2 عبر `@powerduck/openapi-parser`.

```typescript
function validateOpenApi32(
  document: OpenApiDocument,
): Promise<ValidationOutcome>;

interface ValidationOutcome {
  valid: boolean;
  diagnostics: Diagnostic[];
}
```

تُحوَّل أخطاء التحقق إلى تشخيصات بالرمز `OAS_VALIDATION_ERROR`؛ أما إخفاقات أداة التحقق فتستخدم `OAS_VALIDATOR_FAILED`.

### `validateOpenApiDocument`

اسم بديل معتمد لـ [`validateOpenApi32`](#validateopenapi32). ينبغي لمكتبات `@powerduck/*` التابعة استيراد هذا الاسم المستقر.

```typescript
import { validateOpenApiDocument } from "@powerduck/x-to-openapi";

const { valid, diagnostics } = await validateOpenApiDocument(doc);
```

### `OpenApiDocument`

نوع مستند OpenAPI 3.2 المعتمد، وهو اسم بديل لـ `Oas32Document` من `@powerduck/openapi-parser`. ينبغي لجميع مكتبات `@powerduck/*` استخدامه بدلًا من الوصول مباشرة إلى حزم أنواع خارجية.

### `OpenApi32Document`

اسم بديل لـ `OpenApiDocument` خاص بالإصدار.

---

## الأنواع

### `ConvertOptions`

جميع إعدادات التحويل. تستخدم الحقول غير المحددة القيم من [`DEFAULT_OPTIONS`](#default_options).

```typescript
interface ConvertOptions {
  openapiVersion?: "3.2.0";
  title?: string;
  version?: string;
  description?: string;
  inferPathParameters?: boolean;
  pathParameterMinSamples?: number;
  inferSecurity?: boolean;
  includeCommonHeaders?: boolean;
  includeCookies?: boolean;
  includeExamples?: boolean;
  useServerBasePath?: boolean;
  validate?: boolean;
  strict?: boolean;
}
```

| الخيار | النوع | القيمة الافتراضية | الوصف |
|---|---|---|---|
| `openapiVersion` | `"3.2.0"` | `"3.2.0"` | لا يُدعَم سوى `"3.2.0"`؛ وأي قيمة أخرى تطرح خطأ. |
| `title` | `string` | `"Generated API"` | `info.title`. يجب ألا يكون فارغًا. |
| `version` | `string` | `"1.0.0"` | `info.version`. يجب ألا يكون فارغًا. |
| `description` | `string` | `""` | `info.description`. يُحذَف إذا كان فارغًا. |
| `inferPathParameters` | `boolean` | `true` | تحويل المقاطع المتغيرة التي تبدو كمعرّفات إلى معاملات. |
| `pathParameterMinSamples` | `number` | `2` | الحد الأدنى لعدد الطلبات في المجموعة قبل إنشاء القوالب. يجب أن يكون عددًا صحيحًا موجبًا. |
| `inferSecurity` | `boolean` | `true` | توليد `securitySchemes` و`security` لكل عملية. |
| `includeCommonHeaders` | `boolean` | `false` | تضمين الترويسات الإضافية التي ينشئها المتصفح. تُستبعَد ترويسات النقل دائمًا. |
| `includeCookies` | `boolean` | `false` | إخراج ملفات تعريف الارتباط كمعاملات. |
| `includeExamples` | `boolean` | `false` | ملء أمثلة المخططات والمعاملات بالقيم المرصودة. |
| `useServerBasePath` | `boolean` | `false` | دمج بادئة المسار المشتركة في `servers[0].url` عندما تشترك جميع الطلبات في أصل واحد. |
| `validate` | `boolean` | `true` | التحقق من مستند الخرج. تصبح أخطاء التحقق تشخيصات؛ وقد يحوّلها الوضع الصارم إلى استثناءات. |
| `strict` | `boolean` | `false` | طرح `ConversionError` عند أي تشخيص بمستوى خطأ. |

`ResolvedConvertOptions` هو `Required<ConvertOptions> & { openapiVersion: "3.2.0" }`.

---

### `ConvertResult`

القيمة المُعادة من كل عملية تحويل.

```typescript
interface ConvertResult {
  /** The generated OpenAPI 3.2 document. */
  document: OpenApiDocument;
  /** Normalized requests (urlString is populated for JSON serialization). */
  requests: NormalizedRequest[];
  /** All diagnostics produced during conversion. */
  diagnostics: Diagnostic[];
  /** True when no error-severity diagnostic was produced. */
  ok: boolean;
  /** True when the document passed validation (or validation was skipped). */
  documentValid: boolean;
}
```

---

### `NormalizedRequest`

التمثيل الوسيط المستقل عن المحوّل الذي ينتجه كل محوّل.

```typescript
interface NormalizedRequest {
  source: string;            // adapter id, e.g. "curl"
  sourceIndex: number;       // index within the source
  method: string;            // lowercase token, e.g. "get", "post", "purge"
  url: URL;
  urlString?: string;        // string form, set for JSON-safe serialization
  headers: readonly Header[];
  query: readonly ParameterValue[];
  cookies: readonly ParameterValue[];
  body?: RequestBody;
  auth?: RequestAuth;
  /** x-* extensions merged onto the operation (first-wins per key). */
  extensions?: Readonly<Record<string, unknown>>;
}
```

---

### `Diagnostic` / `DiagnosticCode` / `Severity`

```typescript
type Severity = "info" | "warning" | "error";

interface Diagnostic {
  code: DiagnosticCode;
  message: string;
  severity: Severity;
  source?: string;   // adapter id
  index?: number;    // source command index
  path?: string;      // affected OpenAPI path
  cause?: unknown;    // underlying error
}
```

`DiagnosticCode` هو نوع اتحاد سلاسل يشمل كل الرموز التي يمكن للإطار الإبلاغ عنها:

`ADAPTER_PARSE_FAILED`, `CURL_PARSE_FAILED`, `CURL_EMPTY_INPUT`, `CURL_CAPABILITY_MISSING`, `CURL_BACKEND_JSON_FALLBACK`, `CURL_UNSUPPORTED_SCHEME`, `POSTMAN_INVALID_COLLECTION`, `POSTMAN_EMPTY_COLLECTION`, `POSTMAN_UNSUPPORTED_BODY_MODE`, `POSTMAN_VARIABLE_UNRESOLVED`, `BODY_JSON_INVALID`, `PATH_MERGE_CONFLICT`, `OPERATION_ID_COLLISION`, `PSEUDO_HEADER_DROPPED`, `MULTIPLE_SERVERS`, `NO_REQUESTS`, `OAS_VALIDATION_ERROR`, `OAS_VALIDATOR_FAILED`, `DISCOVERY_COMPONENT_NOT_FOUND`, `DISCOVERY_COMPONENT_NAME_COLLISION`, `DISCOVERY_PATH_PARAM_MISMATCH`, `DISCOVERY_MEDIA_WITHOUT_SCHEMA`, `DISCOVERY_RESPONSE_MISSING`, `DISCOVERY_SECURITY_SCHEME_MISSING`, `DISCOVERY_GAP`, `DISCOVERY_PATH_CONFLICT`.

---

### أنواع أساسية أخرى

```typescript
type JsonObject = Record<string, unknown>;

interface Header { readonly name: string; readonly value: string; }
interface ParameterValue { readonly name: string; readonly value: string; }
interface FormField {
  readonly name: string;
  readonly value?: string;
  readonly fileName?: string;
  readonly contentType?: string;
}

type BodyKind = "json" | "xml" | "form-urlencoded" | "multipart" | "text" | "binary";

interface RequestBody {
  readonly kind: BodyKind;
  readonly mediaType: string;
  readonly raw?: string;
  readonly fields?: readonly FormField[];
}

type RequestAuth =
  | { readonly type: "basic" }
  | { readonly type: "bearer" }
  | { readonly type: "apiKey"; readonly in: "header" | "query" | "cookie"; readonly name: string };

interface AdapterContext {
  readonly report: (diagnostic: Diagnostic) => void;
  readonly strict: boolean;
}

interface SourceAdapter<I = unknown> {
  readonly id: string;
  canHandle?(input: unknown): boolean;
  parse(input: I, context: AdapterContext): Promise<NormalizedRequest[]>;
}
```

---

## تحويل التمثيل الوسيط للاكتشاف

### `discoveryToOpenApi`

يحوّل `DiscoveredProject` المقدَّم إلى OpenAPI 3.2. لا يفحص ملفات المصدر بنفسه. تولّد المسارات غير المحسومة تحذيرات ولا تُضاف مطلقًا إلى `paths` دون تنبيه؛ وتظل مواقع المصدر ودرجة الثقة متاحة في المشروع المُعاد.

```typescript
function discoveryToOpenApi(
  project: DiscoveredProject,
  options?: DiscoveryOptions,
): Promise<DiscoveryResult>;

interface DiscoveryOptions {
  openapiVersion?: "3.2.0";
  allowGaps?: boolean; // default true
  validate?: boolean; // default true
}

interface DiscoveryResult {
  readonly document: OpenApiDocument;
  readonly project: DiscoveredProject;
  readonly diagnostics: Diagnostic[];
  readonly ok: boolean;
  readonly documentValid: boolean;
}
```

يرفع `allowGaps: false` تشخيصات النقص في العمليات والمخططات إلى أخطاء؛ لكنه لا يفعّل استثناءات الوضع الصارم. تحقّق دائمًا من `ok` و`documentValid` و`diagnostics`. تُبلَّغ تحذيرات المسارات غير المحسومة بصورة منفصلة. عند تعطيل التحقق، تكون `documentValid` صحيحة دون إجراء فحص للمخطط.

### `buildDiscoveryOpenApi32`

بانٍ متزامن منخفض المستوى للتمثيل الوسيط نفسه. يبلّغ التشخيصات عبر دالة رد النداء المقدَّمة ولا يجري تحققًا من المستند. استخدم الغلاف غير المتزامن عند الحاجة إلى التحقق وكائن نتيجة كامل.

```typescript
function buildDiscoveryOpenApi32(
  project: DiscoveredProject,
  allowGaps: boolean,
  report: (diagnostic: Diagnostic) => void,
): OpenApiDocument;
```

أنواع الاكتشاف المصدَّرة من نقطة الدخول الرئيسية: `Confidence`, `GapCode`, `SourceLocation`, `JsonSchema`, `DiscoveredParameter`, `DiscoveredMediaType`, `DiscoveredRequestBody`, `DiscoveredResponse`, `DiscoveredOperation`, `DiscoveredComponent`, `DiscoveredSecurityScheme`, `DiscoveredServer`, `DiscoveredUnresolved`, `DiscoveredProject`, `DiscoveryOptions`, `DiscoveryResult`.

```typescript
import { discoveryToOpenApi } from "@powerduck/x-to-openapi";

const discovered = await discoveryToOpenApi({
  title: "Health API",
  operations: [{
    method: "get",
    path: "/health",
    responses: [{ statusCode: "204", description: "Healthy", confidence: "high" }],
    confidence: "high",
    origin: { file: "src/routes.ts", line: 1 },
  }],
});
console.log(discovered.ok, discovered.documentValid, discovered.diagnostics);
```

---

## ملخص الصادرات

| الرمز | الفئة |
|---|---|
| `curlToOpenApi` | دالة |
| `postmanToOpenApi` | دالة |
| `XToOpenApi` | صنف |
| `DEFAULT_OPTIONS` | ثابت |
| `AdapterRegistry` | صنف |
| `ConversionError` | صنف |
| `DiagnosticBag` | صنف |
| `CurlAdapter` | صنف |
| `splitCurlCommands` | دالة |
| `PostmanAdapter` | صنف |
| `PostmanTypes` | نطاق أسماء |
| `buildOpenApi32` | دالة |
| `buildPathTemplates` | دالة |
| `looksLikeIdentifier` | دالة |
| `scalar` | دالة |
| `jsonSchema` | دالة |
| `mergeSchemas` | دالة |
| `Schema` | نوع |
| `discoveryToOpenApi` | دالة |
| `buildDiscoveryOpenApi32` | دالة |
| `validateOpenApi32` | دالة |
| `validateOpenApiDocument` | دالة (اسم بديل) |
| `OpenApiDocument` | نوع |
| `OpenApi32Document` | نوع |
| `DiscoveredProject`, `DiscoveryOptions`, `DiscoveryResult` | أنواع |
| `ConvertOptions`, `ConvertResult`, `NormalizedRequest`, `SourceAdapter`, `AdapterContext`, `Diagnostic`, `DiagnosticCode`, `Severity`, `Header`, `ParameterValue`, `FormField`, `BodyKind`, `RequestBody`, `RequestAuth`, `JsonObject`, `ResolvedConvertOptions` | أنواع |
