---
sidebar_position: 4
title: "API संदर्भ"
description: "@powerduck/openapi-codegen का पूरा API दस्तावेज़।"
---

# API संदर्भ

`@powerduck/openapi-codegen` का पूरा API दस्तावेज़।

## शीर्ष-स्तरीय फ़ंक्शन

| एक्सपोर्ट | सिग्नेचर | विवरण |
|--------|-----------|-------------|
| `generate` | `(options: GenerateOptions) => string` | एक ऑपरेशन के लिए चलने योग्य सोर्स कोड बनाता है |
| `register` | `(generator: Generator) => void` | कस्टम जनरेटर रजिस्टर करता है |
| `get` | `(language: string, client: string) => Generator \| undefined` | जनरेटर खोजता है |
| `list` | `() => Array<{ language: string; client: string }>` | सभी रजिस्टर किए गए जनरेटर की सूची देता है |
| `use` | `(plugin: Plugin) => void` | जनरेटर रजिस्टर करने वाला प्लगइन लागू करता है |
| `registerBuiltins` | `() => void` | सभी बिल्ट-इन जनरेटर रजिस्टर करता है; इम्पोर्ट के समय अपने-आप कॉल होता है |
| `normalize` | `(options) => NormalizedRequest` | दस्तावेज़, पाथ और मेथड को मानकीकृत अनुरोध में बदलता है |
| `builtinGenerators` | `Generator[]` | सभी बिल्ट-इन जनरेटर की परिभाषाओं का मूल ऐरे |

मॉड्यूल लोड होने पर बिल्ट-इन जनरेटर अपने-आप रजिस्टर होते हैं, इसलिए `registerBuiltins()` को मैनुअल कॉल करना वैकल्पिक है।

## generate(options)

```ts
generate(options: GenerateOptions): string
```

बनाया गया सोर्स कोड स्ट्रिंग के रूप में लौटाता है। `get(options.language, options.client)` से जनरेटर खोजता है; `options.request` न हो तो `normalize({ document, path, method, serverUrl, securityValues, softRefMode })` कॉल करता है; फिर `generator.generate(request)` कॉल करता है।

संभावित त्रुटियाँ:

- `options` ऑब्जेक्ट न हो या ज़रूरी इनपुट गायब हों तो `TypeError`।
- अज्ञात संयोजन के लिए `Error: Unsupported generator: <language>/<client>`।
- `normalize()` की त्रुटियाँ: अज्ञात पाथ/मेथड, अमान्य दस्तावेज़ या टूटे/चक्रीय `$ref`, जब तक `softRefMode` सक्षम न हो।

विकल्पों की पूरी तालिका के लिए [कॉन्फ़िगरेशन](/docs/hi-IN/openapi-codegen/configuration/#generateoptions) देखें।

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

`language\0client` कुंजी से अंदरूनी स्टोर में रजिस्टर करता है। यह बड़े और छोटे अक्षरों में भेद नहीं करता।

## get(language, client)

```ts
const generator = get("javascript", "fetch");
```

`Generator` लौटाता है; न मिलने पर `undefined`।

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

यह `plugin.register({ register })` कॉल करने के बराबर है।

## registerBuiltins()

```ts
registerBuiltins();
```

बार-बार चलाने पर नतीजा नहीं बदलता; अंदरूनी फ़्लैग इसे सुरक्षित रखता है। `builtinGenerators` की हर एंट्री रजिस्टर करता है।

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

`$ref` सुलझाता है, पाथ/ऑपरेशन पैरामीटर मिलाता है, बॉडी का मीडिया टाइप चुनता है, उदाहरण मान बनाता है, सुरक्षा लागू करता है और `baseUrl` की गणना करता है। अज्ञात पाथ/मेथड और असमर्थित मेथड पर त्रुटि देता है।

## बिल्ट-इन जनरेटर (21 भाषाएँ, 41 क्लाइंट) {#built-in-generators-21-languages-41-clients}

`src/emitters/index.ts` में रजिस्टर किए गए सटीक `language` / `client` पहचानकर्ता। खोज में बड़े और छोटे अक्षरों का भेद नहीं होता; तालिका में मानक नाम दिए गए हैं।

| भाषा | `language` | `client` के मान |
|----------|-----------|-----------------|
| C | `c` | `libcurl` |
| C# | `csharp` | `httpclient`, `restsharp` |
| Clojure | `clojure` | `clj-http` |
| Dart | `dart` | `http` |
| F# | `fsharp` | `httpclient` |
| Go | `go` | `new-request` |
| HTTP अनुरोध फ़ाइल | `http` | `http1` |
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

कुल: 21 भाषाएँ, 41 संयोजन।

> जनरेटर उपलब्ध होने का अर्थ यह नहीं कि हर क्लाइंट हर ऑपरेशन दर्शा सकता है। उदाहरण के लिए, `shell/wget` मनमाने `multipart/form-data` अनुरोध सुरक्षित रूप से नहीं बना सकता; उसकी जगह `shell/curl` या `shell/httpie` इस्तेमाल करें।

## मुख्य टाइप

`./types` से दोबारा एक्सपोर्ट किए गए:

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

## कोर फ़ंक्शन

सभी पैकेज के रूट से दोबारा एक्सपोर्ट किए जाते हैं।

### refs

| एक्सपोर्ट | विवरण |
|--------|-------------|
| `RefResolver` | दस्तावेज़ के अंदर `#/...` JSON Pointer सुलझाने की क्लास। कन्स्ट्रक्टर: `(root, softMode = false)`। मेथड: `deref(value)`, `resolveRef(ref)`, `clearCache()`। सार्वजनिक फ़ील्ड: `softMode`। `softMode` सत्य न हो तो बाहरी/टूटे/चक्रीय रेफ़रेंस पर त्रुटि देती है। |

### example

| एक्सपोर्ट | विवरण |
|--------|-------------|
| `example(schema, resolver, seen?, depth=0, ctx=default)` | JSON Schema से उदाहरण मान बनाता है। `example`, `enum`, `const`, `default`, `oneOf`/`anyOf`/`allOf`, टाइप, फ़ॉर्मैट और सीमाओं का पालन करता है। |
| `ExampleGenContext` | `readOnly`/`writeOnly` फ़िल्टरिंग नियंत्रित करने वाला टाइप `{ isRequestBody: boolean; isResponse: boolean }`। |
| `defaultExampleContext` | डिफ़ॉल्ट `{ isRequestBody: false, isResponse: false }`। |

### serialize

| एक्सपोर्ट | विवरण |
|--------|-------------|
| `Pair` | टाइप `[string, string]`। |
| `parameter(parameter)` | OpenAPI के `style`/`explode` नियमों से एक पैरामीटर को `Pair[]` में सीरियलाइज़ करता है: form, spaceDelimited, pipeDelimited, label, matrix, simple, deepObject। |
| `query(pairs)` | जोड़े मिलाकर क्वेरी स्ट्रिंग बनाता है। |
| `cookie(pairs)` | जोड़े मिलाकर `Cookie` हेडर का मान बनाता है। |
| `headerValue(value)` | हेडर के मान से CR/LF/NUL हटाता है। |

### generator

| एक्सपोर्ट | विवरण |
|--------|-------------|
| `createGenerator(language, client, emit)` | `emit(request) => string` फ़ंक्शन को `Generator` में लपेटता है। |
| `GeneratorEmitter` | टाइप `(request: RequestIR) => string`। |

### registry

| एक्सपोर्ट | विवरण |
|--------|-------------|
| `registerGenerator(generator)` | बड़े और छोटे अक्षरों में भेद न करने वाले स्टोर में जोड़ता है। |
| `getGenerator(language, client)` | स्टोर से पढ़ता है। |
| `listGenerators()` | `[{ language, client }, ...]` लौटाता है। |

### plugin

| एक्सपोर्ट | विवरण |
|--------|-------------|
| `PluginApi` | टाइप `{ register(generator: Generator): void }`। |
| `applyPlugin(plugin, api)` | `plugin.register(api)` कॉल करता है। |

### request

| एक्सपोर्ट | विवरण |
|--------|-------------|
| `CompiledRequest` | टाइप `{ url; headers: Array<[string,string]>; body?; queryPairs; cookiePairs }`। |
| `compile(request)` | पाथ पैरामीटर भरता है, query/header/cookie जोड़े बनाता है, सुरक्षा लागू करता है और URL जोड़ता है। |
| `form(value)` | ऑब्जेक्ट को `application/x-www-form-urlencoded` स्ट्रिंग में सीरियलाइज़ करता है। |

### helpers

आम उपयोगिताएँ:

| एक्सपोर्ट | विवरण |
|--------|-------------|
| `isRecord(value)` | साधारण ऑब्जेक्ट के लिए टाइप गार्ड। |
| `isFileValue(value)` | `FileValue` मार्कर के लिए टाइप गार्ड। |
| `firstDefined(...values)` | पहला मान जो `undefined` नहीं है। |
| `nonBlankString(value, fallback?)` | दोनों सिरों के खाली स्थान हटाने के बाद गैर-खाली स्ट्रिंग, या `undefined`/फ़ॉलबैक। |
| `normalizeMethod(method)` | बड़े अक्षरों में मेथड; फ़ॉलबैक `GET`। |
| `supportsRequestBody(method)` | `GET`/`HEAD` के लिए `false`। |
| `requiresRequestBody(method)` | `POST`/`PUT`/`PATCH` के लिए `true`। |
| `mediaTypeOf(request, fallback)` | बॉडी या Content-Type हेडर से प्रभावी मीडिया टाइप। |
| `hasJsonBody(request)` | JSON या `+json` मीडिया टाइप। |
| `hasFormBody(request)` | `application/x-www-form-urlencoded`. |
| `hasMultipartBody(request)` | `multipart/form-data`. |
| `bodyText(request)` | बॉडी का मूल टेक्स्ट या फ़ॉर्मैट किया गया JSON। |
| `toHeaderObject(headers)` | जोड़ों को `Record<string,string>` में बदलता है। |
| `toKeyValueBody(value)` | Multipart बॉडी को क्रमबद्ध फ़ील्ड विवरणों में फैलाता है। |
| `collectByLocation(request, location)` | OpenAPI स्थान के अनुसार पैरामीटर फ़िल्टर करता है। |
| `operationName(request)` | मेथड और पाथ से snake_case फ़ंक्शन/वेरिएबल नाम बनाता है। |
| `sanitizeIdentifier(value)` | किसी भी टेक्स्ट को मान्य पहचानकर्ता में बदलता है। |
| `indent(text, prefix="  ")` | हर गैर-खाली पंक्ति में इंडेंट जोड़ता है। |
| `stringifyLiteral(value)` | सुरक्षित फ़ॉलबैक के साथ फ़ॉर्मैट किया गया JSON। |
| `kotlinValue(value)` / `formFieldValue(value)` | लिटरल या फ़ॉर्म फ़ील्ड के लिए मान सीरियलाइज़ करता है। |
| `fileComment(path, fieldName)` | Multipart प्लेसहोल्डर पाथ के लिए TODO टिप्पणी बनाता है। |
| `mergeAllOfSchemas(schemas, resolver)` | `allOf` स्कीमा को केवल ऊपरी स्तर पर मिलाता है। |
| `lightweightOpenAPIPreCheck(doc)` | दस्तावेज़ की संरचनात्मक चेतावनियाँ लौटाता है। |
| `browserHeaders(headers, multipart)` | ब्राउज़र में निषिद्ध हेडर हटाता है। |
| `isBrowserForbiddenHeader(name)` | बताता है कि क्या हेडर ब्राउज़र की नेटवर्क API से नियंत्रित होता है। |
| `escapeJs`, `escapePy`, `escapeSh`, `escapePhp`, `escapeRuby`, `escapePowerShell`, `escapeCSharp`, `escapeJava`, `escapeGo`, `escapeRust`, `escapeObjC`, `escapeSwift`, `escapeR`, `escapeOCaml`, `escapeFSharp`, `escapeClojure` | हर भाषा के लिए स्ट्रिंग लिटरल एस्केप करने वाले फ़ंक्शन। |
| `assertIsRecord`, `assertIsString`, `assertIsNumber` | रनटाइम असर्शन गार्ड। |
| `DEFAULT_FILE_PATH`, `DEFAULT_FILE_NAME`, `DEFAULT_BINARY_MEDIA_TYPE` | फ़ाइल अपलोड के प्लेसहोल्डर के लिए कॉन्स्टेंट। |
