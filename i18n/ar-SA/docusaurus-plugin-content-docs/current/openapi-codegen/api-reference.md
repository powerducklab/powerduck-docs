---
sidebar_position: 4
title: "مرجع API"
description: "توثيق API الكامل لـ @powerduck/openapi-codegen."
---

# مرجع API

توثيق API الكامل لـ `@powerduck/openapi-codegen`.

## الدوال الرئيسية

| العنصر المصدَّر | التوقيع | الوصف |
|--------|-----------|-------------|
| `generate` | `(options: GenerateOptions) => string` | توليد شيفرة مصدرية قابلة للتنفيذ لعملية واحدة |
| `register` | `(generator: Generator) => void` | تسجيل مولّد مخصص |
| `get` | `(language: string, client: string) => Generator \| undefined` | البحث عن مولّد |
| `list` | `() => Array<{ language: string; client: string }>` | عرض جميع المولّدات المسجّلة |
| `use` | `(plugin: Plugin) => void` | تطبيق إضافة تسجّل مولّدات |
| `registerBuiltins` | `() => void` | تسجيل كل المولّدات المدمجة، ويُستدعى تلقائيًا عند الاستيراد |
| `normalize` | `(options) => NormalizedRequest` | تحويل المستند والمسار والطريقة إلى طلب موحّد البنية |
| `builtinGenerators` | `Generator[]` | المصفوفة الأصلية لكل تعريفات المولّدات المدمجة |

تُسجَّل المولّدات المدمجة تلقائيًا عند تحميل الوحدة، لذا فإن استدعاء `registerBuiltins()` يدويًا اختياري.

## generate(options)

```ts
generate(options: GenerateOptions): string
```

تعيد الشيفرة المصدرية المُولّدة كنص. تبحث عن المولّد باستخدام `get(options.language, options.client)`؛ وإذا غابت `options.request`، تستدعي `normalize({ document, path, method, serverUrl, securityValues, softRefMode })`؛ ثم تستدعي `generator.generate(request)`.

الأخطاء المحتملة:

- `TypeError` إذا لم تكن `options` كائنًا أو غابت مدخلات مطلوبة.
- `Error: Unsupported generator: <language>/<client>` عند وجود تركيبة غير معروفة.
- أخطاء `normalize()` عند مسار أو طريقة غير معروفة، أو مستند غير صالح، أو `$ref` معطوبة أو دائرية ما لم يُفعَّل `softRefMode`.

راجع [الإعدادات](/docs/ar-SA/openapi-codegen/configuration/#generateoptions) لجدول الخيارات الكامل.

## register(generator)

```ts
register({
  language: "mylang",
  client: "my-client",
  generate(request) {
    return `// ${request.method} ${request.path}`;
  },
});
```

تسجّل في المخزن الداخلي غير الحساس لحالة الأحرف، باستخدام المفتاح `language\0client`.

## get(language, client)

```ts
const generator = get("javascript", "fetch");
```

تعيد `Generator`، أو `undefined` إذا لم تجده.

## list()

```ts
const combos = list();
// [{ language: "c", client: "libcurl" }, ...]
```

## use(plugin)

```ts
use({
  name: "my-plugin",
  register({ register }) {
    register(customGenerator);
  },
});
```

تكافئ استدعاء `plugin.register({ register })`.

## registerBuiltins()

```ts
registerBuiltins();
```

لا يغيّر تكرارها النتيجة، بفضل علامة داخلية. تسجّل كل عنصر في `builtinGenerators`.

## normalize(options)

```ts
import { normalize } from "@powerduck/openapi-codegen";

const request = normalize({
  document,
  path: "/pets/{id}",
  method: "get",
  serverUrl: "https://example.com",
  securityValues: { bearerAuth: "token" },
  softRefMode: false,
});
```

تحل مراجع `$ref`، وتدمج معاملات المسار والعملية، وتختار نوع وسائط الجسم، وتولّد قيم الأمثلة، وتعالج الأمان، وتحسب `baseUrl`. تطلق خطأ للمسارات والطرق غير المعروفة وللطرق غير المدعومة.

## المولّدات المدمجة (21 لغة و41 عميلًا) {#built-in-generators-21-languages-41-clients}

معرّفات `language` و`client` الدقيقة كما سُجّلت في `src/emitters/index.ts`. البحث لا يميّز حالة الأحرف؛ ويعرض الجدول الصيغ المعتمدة للمعرّفات.

| اللغة | `language` | قيم `client` |
|----------|-----------|-----------------|
| C | `c` | `libcurl` |
| C# | `csharp` | `httpclient`, `restsharp` |
| Clojure | `clojure` | `clj-http` |
| Dart | `dart` | `http` |
| F# | `fsharp` | `httpclient` |
| Go | `go` | `new-request` |
| ملف طلب HTTP | `http` | `http1` |
| Java | `java` | `asynchttp`, `java-net-http`, `okhttp`, `unirest` |
| JavaScript | `javascript` | `axios`, `fetch`, `jquery`, `ofetch`, `xhr` |
| Kotlin | `kotlin` | `okhttp` |
| Node.js | `node` | `axios`, `fetch`, `ofetch`, `undici` |
| Objective-C | `objc` | `nsurlsession` |
| OCaml | `ocaml` | `cohttp` |
| PHP | `php` | `curl`, `guzzle`, `laravel-http` |
| PowerShell | `powershell` | `invoke-restmethod`, `invoke-webrequest` |
| Python | `python` | `aiohttp`, `http-client`, `httpx-async`, `httpx-sync`, `requests` |
| R | `r` | `httr2` |
| Ruby | `ruby` | `net-http` |
| Rust | `rust` | `reqwest` |
| Shell | `shell` | `curl`, `httpie`, `wget` |
| Swift | `swift` | `nsurlsession` |

الإجمالي: 21 لغة و41 تركيبة.

> وجود مولّد لا يعني أن كل عميل يستطيع تمثيل كل عملية. مثلًا، لا يستطيع `shell/wget` بناء طلبات `multipart/form-data` عشوائية بأمان؛ استخدم `shell/curl` أو `shell/httpie` بدلًا منه.

## الأنواع الأساسية

يُعاد تصديرها من `./types`:

```ts
type ParameterLocation = "path" | "query" | "querystring" | "header" | "cookie";

interface FileValue { __file: true; path?; name?; contentType?; data?; }
interface Parameter { name; in: ParameterLocation; value: unknown; style?; explode?; allowReserved?; }
interface Body { mediaType: string; value: unknown; encoding?: Record<string, unknown>; }
interface Security { name; type; scheme?; in?; paramName?; value: string; }
interface RequestIR { method; baseUrl; path; parameters: Parameter[]; headers: Parameter[]; body?; security: Security[]; }
interface GenerateResult { code: string; files?: Record<string, string>; metadata?: Record<string, unknown>; }
interface Generator { language: string; client: string; generate(request: RequestIR): string; }
interface Plugin { name: string; register(api: { register(g: Generator): void }): void; }
interface GenerateOptions { language; client; request?; document?; path?; method?; serverUrl?; securityValues?; softRefMode?; }
```

## دوال النواة

يُعاد تصديرها جميعًا من جذر الحزمة.

### refs

| العنصر المصدَّر | الوصف |
|--------|-------------|
| `RefResolver` | فئة لحل JSON Pointer داخل المستند بصيغة `#/...`. المُنشئ: `(root, softMode = false)`. الدوال: `deref(value)` و`resolveRef(ref)` و`clearCache()`. الحقل العام: `softMode`. تطلق خطأ للمراجع الخارجية أو المعطوبة أو الدائرية، إلا إذا كانت `softMode` صحيحة. |

### example

| العنصر المصدَّر | الوصف |
|--------|-------------|
| `example(schema, resolver, seen?, depth=0, ctx=default)` | تولّد قيمة مثال من JSON Schema. تراعي `example` و`enum` و`const` و`default` و`oneOf`/`anyOf`/`allOf` والأنواع والتنسيقات والقيود. |
| `ExampleGenContext` | النوع `{ isRequestBody: boolean; isResponse: boolean }` للتحكم في تصفية `readOnly`/`writeOnly`. |
| `defaultExampleContext` | القيمة الافتراضية `{ isRequestBody: false, isResponse: false }`. |

### serialize

| العنصر المصدَّر | الوصف |
|--------|-------------|
| `Pair` | النوع `[string, string]`. |
| `parameter(parameter)` | تسلسل معاملًا واحدًا إلى `Pair[]` وفق قواعد OpenAPI `style`/`explode`: form وspaceDelimited وpipeDelimited وlabel وmatrix وsimple وdeepObject. |
| `query(pairs)` | تضم الأزواج في سلسلة استعلام. |
| `cookie(pairs)` | تضم الأزواج في قيمة ترويسة `Cookie`. |
| `headerValue(value)` | تنظّف قيمة الترويسة بإزالة CR/LF/NUL. |

### generator

| العنصر المصدَّر | الوصف |
|--------|-------------|
| `createGenerator(language, client, emit)` | تغلّف الدالة `emit(request) => string` في `Generator`. |
| `GeneratorEmitter` | النوع `(request: RequestIR) => string`. |

### registry

| العنصر المصدَّر | الوصف |
|--------|-------------|
| `registerGenerator(generator)` | تضيف إلى مخزن لا يميّز حالة الأحرف. |
| `getGenerator(language, client)` | تقرأ من المخزن. |
| `listGenerators()` | تعيد `[{ language, client }, ...]`. |

### plugin

| العنصر المصدَّر | الوصف |
|--------|-------------|
| `PluginApi` | النوع `{ register(generator: Generator): void }`. |
| `applyPlugin(plugin, api)` | تستدعي `plugin.register(api)`. |

### request

| العنصر المصدَّر | الوصف |
|--------|-------------|
| `CompiledRequest` | النوع `{ url; headers: Array<[string,string]>; body?; queryPairs; cookiePairs }`. |
| `compile(request)` | تستبدل معاملات المسار، وتبني أزواج query/header/cookie، وتطبّق الأمان، وتجمع عنوان URL. |
| `form(value)` | تسلسل كائنًا إلى سلسلة `application/x-www-form-urlencoded`. |

### helpers

أدوات مساعدة شائعة:

| العنصر المصدَّر | الوصف |
|--------|-------------|
| `isRecord(value)` | حارس نوع للكائنات العادية. |
| `isFileValue(value)` | حارس نوع لعلامة `FileValue`. |
| `firstDefined(...values)` | أول قيمة ليست `undefined`. |
| `nonBlankString(value, fallback?)` | نص غير فارغ بعد إزالة المسافات الطرفية، أو `undefined`/قيمة بديلة. |
| `normalizeMethod(method)` | الطريقة بأحرف كبيرة، مع `GET` كقيمة بديلة. |
| `supportsRequestBody(method)` | `false` مع `GET`/`HEAD`. |
| `requiresRequestBody(method)` | `true` مع `POST`/`PUT`/`PATCH`. |
| `mediaTypeOf(request, fallback)` | نوع الوسائط الفعلي من الجسم أو ترويسة Content-Type. |
| `hasJsonBody(request)` | نوع وسائط JSON أو `+json`. |
| `hasFormBody(request)` | `application/x-www-form-urlencoded`. |
| `hasMultipartBody(request)` | `multipart/form-data`. |
| `bodyText(request)` | نص الجسم الخام أو JSON منسّق. |
| `toHeaderObject(headers)` | تحوّل الأزواج إلى `Record<string,string>`. |
| `toKeyValueBody(value)` | تسطّح جسم multipart إلى أوصاف حقول مرتبة. |
| `collectByLocation(request, location)` | تصفّي المعاملات حسب موضع OpenAPI. |
| `operationName(request)` | تشتق اسم دالة أو متغير بصيغة snake_case من الطريقة والمسار. |
| `sanitizeIdentifier(value)` | تحوّل أي نص إلى معرّف صالح. |
| `indent(text, prefix="  ")` | تضيف مسافة بادئة لكل سطر غير فارغ. |
| `stringifyLiteral(value)` | JSON منسّق مع بديل آمن. |
| `kotlinValue(value)` / `formFieldValue(value)` | تسلسل قيمة لاستخدامها كقيمة حرفية أو حقل نموذج. |
| `fileComment(path, fieldName)` | تنشئ تعليق TODO لمسار multipart مؤقت. |
| `mergeAllOfSchemas(schemas, resolver)` | تدمج مخططات `allOf` دمجًا سطحيًا. |
| `lightweightOpenAPIPreCheck(doc)` | تعيد التحذيرات البنيوية للمستند. |
| `browserHeaders(headers, multipart)` | تحذف الترويسات التي يحظرها المتصفح. |
| `isBrowserForbiddenHeader(name)` | تحدد ما إذا كانت واجهات شبكة المتصفح تتحكم في الترويسة. |
| `escapeJs`, `escapePy`, `escapeSh`, `escapePhp`, `escapeRuby`, `escapePowerShell`, `escapeCSharp`, `escapeJava`, `escapeGo`, `escapeRust`, `escapeObjC`, `escapeSwift`, `escapeR`, `escapeOCaml`, `escapeFSharp`, `escapeClojure` | دوال تهريب القيم النصية الحرفية الخاصة بكل لغة. |
| `assertIsRecord`, `assertIsString`, `assertIsNumber` | حراس تأكيد وقت التشغيل. |
| `DEFAULT_FILE_PATH`, `DEFAULT_FILE_NAME`, `DEFAULT_BINARY_MEDIA_TYPE` | ثوابت العناصر النائبة لرفع الملفات. |
