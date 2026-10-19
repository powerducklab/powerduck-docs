---
sidebar_position: 4
title: "API संदर्भ"
description: "@powerduck/x-to-openapi के सार्वजनिक प्रवेश बिंदु का संदर्भ। नीचे दिए गए हस्ताक्षर API का सार बताते हैं; सभी readonly विशेषकों और आयातित प्रकारों के लिए पैकेज की TypeScript घोषणाएँ देखें।"
---

# API संदर्भ

`@powerduck/x-to-openapi` के सार्वजनिक प्रवेश बिंदु का संदर्भ। नीचे दिए गए हस्ताक्षर API का सार बताते हैं; सभी readonly विशेषकों और आयातित प्रकारों के लिए पैकेज की TypeScript घोषणाएँ देखें।

---

## बिना कॉन्फ़िगरेशन वाले सहायक फ़ंक्शन

### `curlToOpenApi`

एक कॉल में रूपांतरण: [`CurlAdapter`](#curladapter) पंजीकृत करता है और [`convert`](#convertsource-input-options) को कॉल करता है।

```typescript
function curlToOpenApi(
  input: string | readonly string[],
  options?: ConvertOptions,
): Promise<ConvertResult>;
```

| पैरामीटर | प्रकार | विवरण |
|---|---|---|
| `input` | `string \| readonly string[]` | एक curl कमांड, कमांड का ऐरे या ब्राउज़र के “Copy all as cURL” का आउटपुट; कई कमांड वाला टेक्स्ट अपने-आप विभाजित होता है। |
| `options` | `ConvertOptions` | वैकल्पिक रूपांतरण सेटिंग। |

**वापसी मान:** [`ConvertResult`](#convertresult)।

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  "curl -X POST https://api.example.com/users -H 'Content-Type: application/json' --data '{\"name\":\"Ada\"}'",
);
```

---

### `postmanToOpenApi`

एक कॉल में रूपांतरण: [`PostmanAdapter`](#postmanadapter) पंजीकृत करता है और पार्स किए गए कलेक्शन ऑब्जेक्ट या JSON स्ट्रिंग को रूपांतरित करता है। टेस्ट स्क्रिप्ट `x-postman-scripts` के रूप में सुरक्षित रहती हैं।

```typescript
function postmanToOpenApi(
  input: unknown,
  options?: ConvertOptions,
): Promise<ConvertResult>;
```

| पैरामीटर | प्रकार | विवरण |
|---|---|---|
| `input` | `unknown` | Postman Collection v2.0/v2.1.0 का ऑब्जेक्ट या उसकी JSON स्ट्रिंग। |
| `options` | `ConvertOptions` | वैकल्पिक रूपांतरण सेटिंग। |

**वापसी मान:** [`ConvertResult`](#convertresult)।

---

## मुख्य ढाँचा

### `XToOpenApi`

कन्वर्टर क्लास। इसमें [`AdapterRegistry`](#adapterregistry) होता है और यह पार्सिंग → निर्माण → सत्यापन की प्रक्रिया चलाती है।

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

एडाप्टर पंजीकृत करता है। कॉल को शृंखलाबद्ध करने के लिए `this` लौटाता है। एडाप्टर के `id` को `/^[a-z][a-z0-9-]*$/` से जाँचता है, `parse()` मेथड अनिवार्य करता है और दोहराए गए ID अस्वीकार करता है।

#### `adapters()`

पंजीकृत एडाप्टर के ID को `string[]` के रूप में लौटाता है।

#### `convert(source, input, options?)`

एकमात्र प्रवेश बिंदु।

| पैरामीटर | प्रकार | विवरण |
|---|---|---|
| `source` | `string` | एडाप्टर ID (`"curl"`, `"postman"` आदि) या `canHandle()` से चयन के लिए `"auto"`। |
| `input` | `unknown` | स्रोत डेटा; इसकी संरचना एडाप्टर पर निर्भर करती है। |
| `options` | `ConvertOptions` | वैकल्पिक रूपांतरण सेटिंग। |

**व्यवहार:**

1. [`DEFAULT_OPTIONS`](#default_options) से विकल्प पूरे करता है और उनका सत्यापन करता है।
2. **10 × 1024 × 1024 JavaScript कोड इकाइयों** से लंबी स्ट्रिंग या ऐरे के स्ट्रिंग तत्वों की संयुक्त लंबाई को `ConversionError` के साथ अस्वीकार करता है। यह UTF-8 बाइट सीमा नहीं है; पार्स किए गए ऑब्जेक्ट का आकार नहीं मापा जाता।
3. स्पष्ट ID या `"auto"` पहचान से एडाप्टर चुनता है।
4. इनपुट को `NormalizedRequest[]` में पार्स करता है; पार्सिंग की विफलताएँ निदान संदेश बनती हैं।
5. [`buildOpenApi32`](#buildopenapi32) से OpenAPI 3.2 दस्तावेज़ बनाता है।
6. यदि `validate` का मान `true` है, तो [`validateOpenApi32`](#validateopenapi32) से सत्यापन करता है और परिणाम के निदान संदेश जोड़ता है।
7. [`ConvertResult`](#convertresult) लौटाता है।

```typescript
import { XToOpenApi, CurlAdapter } from "@powerduck/x-to-openapi";

const converter = new XToOpenApi().register(new CurlAdapter());
const result = await converter.convert("curl", curlText, { title: "My API" });
```

---

### `DEFAULT_OPTIONS`

वे डिफ़ॉल्ट मान जिनके साथ हर [`ConvertOptions`](#convertoptions) को मिलाया जाता है। इन्हें `ResolvedConvertOptions` के रूप में निर्यात किया जाता है।

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

पंजीकृत एडाप्टर को ID के अनुसार रखता है।

```typescript
class AdapterRegistry {
  register<I>(adapter: SourceAdapter<I>): this;
  has(id: string): boolean;
  get(id: string): SourceAdapter<unknown>;
  detect(input: unknown): SourceAdapter<unknown> | undefined;
  ids(): string[];
}
```

| मेथड | विवरण |
|---|---|
| `register(adapter)` | ID (`/^[a-z][a-z0-9-]*$/`) का सत्यापन करता है, `parse()` की जाँच करता है और दोहराव अस्वीकार करता है। `this` लौटाता है। |
| `has(id)` | जाँचता है कि एडाप्टर पंजीकृत है या नहीं। |
| `get(id)` | एडाप्टर लौटाता है या पंजीकृत ID की सूची वाला त्रुटि संदेश फेंकता है। |
| `detect(input)` | पहला ऐसा एडाप्टर लौटाता है जिसका `canHandle()` इनपुट स्वीकार करे। जाँच फ़ंक्शन के अपवाद पकड़े जाते हैं और संबंधित एडाप्टर छोड़ दिया जाता है। |
| `ids()` | पंजीकृत ID की सूची देता है। |

---

### `ConversionError`

`strict` मोड में त्रुटि-स्तर के निदान, बहुत लंबी इनपुट स्ट्रिंग या एडाप्टर के स्वचालित चयन की विफलता पर फेंका जाता है। उपलब्ध निदान साथ रखता है; सूची खाली हो सकती है। अमान्य विकल्प और पंजीकरण की त्रुटियाँ इसके बजाय `TypeError` या `Error` फेंक सकती हैं।

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

[`XToOpenApi.convert`](#convertsource-input-options) द्वारा इस्तेमाल किया जाने वाला आंतरिक संग्रहक। दोहराए गए निदान हटाता है और `strict` का मान `true` होने पर त्रुटि-स्तर की प्रविष्टियों के लिए `ConversionError` फेंकता है।

```typescript
class DiagnosticBag {
  constructor(strict?: boolean); // default false
  report(diagnostic: Diagnostic): void;
  get items(): Diagnostic[];
  hasErrors(): boolean;
}
```

---

## एडाप्टर

### `CurlAdapter`

एकल curl कमांड, कमांड समूह या ब्राउज़र से निर्यात को `NormalizedRequest[]` में बदलता है। `curlconverter` को आवृत करता है और उसके आउटपुट को मानकीकृत करता है।

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

- `canHandle` ऐसी स्ट्रिंग या ऐरे का पहला तत्व स्वीकार करता है जो वैकल्पिक शेल प्रॉम्प्ट (`$`, `#`, `>`) के बाद `curl` या `curl.exe` से शुरू हो।
- `parse`, [`splitCurlCommands`](#splitcurlcommands) से कई कमांड वाला इनपुट विभाजित करता है, HTTP(S) के अलावा अन्य URL छोड़ता है, HTTP/2 छद्म-हेडर हटाता है, बॉडी और कुकी पार्स करता है तथा प्रमाणीकरण का अनुमान लगाता है।

> `resolveBackend`, `availableExports` और `resetBackend` आंतरिक एकीकरण सहायक हैं, समर्थित पैकेज निर्यात नहीं। आंतरिक फ़ाइलों के बजाय सार्वजनिक एडाप्टर आयात करें।

---

### `splitCurlCommands`

ब्राउज़र के “Copy all as cURL” आउटपुट को अलग-अलग कमांड में विभाजित करता है। सिंगल/डबल कोट, बैकस्लैश और कैरेट (`^`) से पंक्ति जारी रखना, CRLF, शेल प्रॉम्प्ट (`$`, `#`, `>`, `PS C:\>`) और `curl.exe` संभालता है।

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

Postman Collections v2.0/v2.1.0 को `NormalizedRequest[]` में बदलता है। नेस्टेड फ़ोल्डर में जाता है, आइटम > फ़ोल्डर > कलेक्शन की प्राथमिकता से प्रमाणीकरण हल करता है, बॉडी मोड मैप करता है और टेस्ट स्क्रिप्ट सुरक्षित रखता है।

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

- `canHandle` ऐसा ऑब्जेक्ट या पार्स की गई JSON स्ट्रिंग स्वीकार करता है जिसमें `info` ऑब्जेक्ट और `item` ऐरे हो। v2.1.0 तथा v2.0 स्कीमा URL और बिना स्कीमा URL वाले संरचनात्मक रूप से मान्य कलेक्शन स्वीकार किए जाते हैं।
- टेस्ट और अनुरोध-पूर्व इवेंट ऑपरेशन में `x-postman-scripts` के रूप में दिए जाते हैं।

---

### `PostmanTypes`

एडाप्टर द्वारा इस्तेमाल किए जाने वाले सभी Postman कलेक्शन प्रकारों का नेमस्पेस:

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

मुख्य सदस्य: `PostmanCollection`, `PostmanInfo`, `PostmanVersion`, `PostmanItem`, `PostmanFolder`, `PostmanRequestItem`, `PostmanRequest`, `PostmanHeader`, `PostmanUrl`, `PostmanQueryParam`, `PostmanBodyMode`, `PostmanBody`, `PostmanUrlEncodedParam`, `PostmanFormDataParam`, `PostmanFileParam`, `PostmanGraphQLBody`, `PostmanAuthType`, `PostmanAuth`, `PostmanAuthParam`, `PostmanEvent`, `PostmanScript`, `PostmanVariable`, `PostmanDescription`, `isFolder`, `isRequestItem`।

---

## OpenAPI निर्माण के घटक

### `buildOpenApi32`

निम्न-स्तरीय बिल्डर। पहले से मानकीकृत अनुरोधों के ऐरे से OpenAPI 3.2 दस्तावेज़ बनाता है। सामान्यतः इसे [`XToOpenApi.convert`](#convertsource-input-options) के माध्यम से अप्रत्यक्ष रूप से कॉल किया जाता है।

```typescript
function buildOpenApi32(
  requests: readonly NormalizedRequest[],
  options: ResolvedConvertOptions,
  report: (diagnostic: Diagnostic) => void,
): OpenApiDocument;
```

पथ और मेथड के अनुसार ऑपरेशन समूहित करता है, क्वेरी/हेडर/कुकी/पथ पैरामीटर इकट्ठे करता है, बॉडी स्कीमा मिलाता है, `securitySchemes` बनाता है, गैर-मानक मेथड को `additionalOperations` में रखता है और `operationId`/`tags` निर्धारित करता है।

---

### `buildPathTemplates`

समान संरचना वाले अनुरोधों को समूहित करता है और उन खंडों को टेम्पलेट में बदलता है जो कम-से-कम `minSamples` नमूनों में बदलते हैं और हर नमूने में पहचानकर्ता जैसे दिखते हैं।

```typescript
function buildPathTemplates(
  requests: readonly NormalizedRequest[],
  minSamples: number,
  enabled: boolean,
): Map<number, PathTemplate>;
```

`sourceIndex` कुंजी वाला मैप लौटाता है। हर `PathTemplate` में ये शामिल हैं:

```typescript
interface PathTemplate {
  readonly path: string;                    // e.g. "/users/{userId}"
  readonly parameters: ReadonlyMap<number, string>; // segment index → name
}
```

जब `enabled` का मान `false` हो, तो हर अनुरोध को उसके मूल पथनाम के बराबर स्थिर टेम्पलेट मिलता है।

---

### `looksLikeIdentifier`

किस खंड को टेम्पलेट में बदला जा सकता है, यह तय करने का केंद्रीय नियम।

```typescript
function looksLikeIdentifier(segment: string): boolean;
```

यदि खंड केवल संख्यात्मक हो, UUID हो, ULID हो या कम-से-कम 8 अक्षरों की हेक्साडेसिमल स्ट्रिंग हो, तो `true` लौटाता है।

---

### `scalar`

एक स्ट्रिंग नमूने से सावधानीपूर्ण तरीके से JSON Schema का अनुमान लगाता है।

```typescript
function scalar(value: string, includeExample?: boolean): Schema; // default false
```

`boolean`, सुरक्षित पूर्णांक के लिए लंबाई सीमा वाला `integer`, `number` या `format` (`uuid`, `date`, `date-time`) वाला `string` अनुमानित करता है; अन्यथा साधारण `string` देता है।

---

### `jsonSchema`

किसी भी JSON मान—ऑब्जेक्ट, ऐरे या स्केलर—से JSON Schema का अनुमान लगाता है।

```typescript
function jsonSchema(value: unknown, includeExample?: boolean): Schema; // default false
```

ऑब्जेक्ट `{ type: "object", properties, required }` बनते हैं; ऐरे `{ type: "array", items }` बनते हैं और खाली ऐरे को `{}` मिलता है; स्केलर `scalar` जैसे टाइपिंग नियम अपनाते हैं।

---

### `mergeSchemas`

कई नमूना स्कीमा को संरचनात्मक रूप से मिलाता है। ऑब्जेक्ट की प्रॉपर्टी एकत्र होती हैं; किसी भी नमूने से गायब प्रॉपर्टी वैकल्पिक बन जाती है। ऐरे पर पुनरावर्ती प्रक्रिया होती है; `integer` को `number` तक विस्तृत किया जाता है। फ़ॉर्मैट केवल तभी सुरक्षित रहते हैं जब सभी नमूनों में समान हों।

```typescript
function mergeSchemas(schemas: readonly Schema[]): Schema;
```

---

### `Schema`

अनुमानित बॉडी और पैरामीटर के लिए इस्तेमाल किया जाने वाला JSON Schema का संरचनात्मक उपसमुच्चय।

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

## मानक प्रकार और सत्यापन

### `validateOpenApi32`

`@powerduck/openapi-parser` के माध्यम से OpenAPI दस्तावेज़ को OpenAPI 3.2 स्कीमा के अनुसार सत्यापित करता है।

```typescript
function validateOpenApi32(
  document: OpenApiDocument,
): Promise<ValidationOutcome>;

interface ValidationOutcome {
  valid: boolean;
  diagnostics: Diagnostic[];
}
```

सत्यापन त्रुटियाँ `OAS_VALIDATION_ERROR` कोड वाले निदान में बदलती हैं; सत्यापनकर्ता की विफलताएँ `OAS_VALIDATOR_FAILED` में बदलती हैं।

### `validateOpenApiDocument`

[`validateOpenApi32`](#validateopenapi32) का मानक उपनाम। निर्भर `@powerduck/*` लाइब्रेरी को यह स्थिर नाम आयात करना चाहिए।

```typescript
import { validateOpenApiDocument } from "@powerduck/x-to-openapi";

const { valid, diagnostics } = await validateOpenApiDocument(doc);
```

### `OpenApiDocument`

मानक OpenAPI 3.2 दस्तावेज़ प्रकार, जो `@powerduck/openapi-parser` के `Oas32Document` का उपनाम है। सभी `@powerduck/*` लाइब्रेरी को तीसरे पक्ष के टाइप पैकेज में सीधे जाने के बजाय इसका इस्तेमाल करना चाहिए।

### `OpenApi32Document`

`OpenApiDocument` का संस्करण-विशिष्ट उपनाम।

---

## प्रकार

### `ConvertOptions`

सभी रूपांतरण सेटिंग। जो फ़ील्ड सेट नहीं हैं, वे [`DEFAULT_OPTIONS`](#default_options) के मान अपनाते हैं।

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

| विकल्प | प्रकार | डिफ़ॉल्ट | विवरण |
|---|---|---|---|
| `openapiVersion` | `"3.2.0"` | `"3.2.0"` | केवल `"3.2.0"` समर्थित है; कोई अन्य मान त्रुटि फेंकता है। |
| `title` | `string` | `"Generated API"` | `info.title`। खाली नहीं हो सकता। |
| `version` | `string` | `"1.0.0"` | `info.version`। खाली नहीं हो सकता। |
| `description` | `string` | `""` | `info.description`। खाली होने पर छोड़ दिया जाता है। |
| `inferPathParameters` | `boolean` | `true` | पहचानकर्ता जैसे दिखने वाले बदलते खंडों को टेम्पलेट में बदलता है। |
| `pathParameterMinSamples` | `number` | `2` | टेम्पलेट बनाने से पहले समूह में अनुरोधों की न्यूनतम संख्या। धनात्मक पूर्णांक होना चाहिए। |
| `inferSecurity` | `boolean` | `true` | `securitySchemes` और हर ऑपरेशन के लिए `security` बनाता है। |
| `includeCommonHeaders` | `boolean` | `false` | ब्राउज़र के अतिरिक्त हेडर शामिल करता है। ट्रांसपोर्ट हेडर हमेशा बाहर रखे जाते हैं। |
| `includeCookies` | `boolean` | `false` | कुकी को पैरामीटर के रूप में देता है। |
| `includeExamples` | `boolean` | `false` | देखे गए मानों से स्कीमा और पैरामीटर के उदाहरण भरता है। |
| `useServerBasePath` | `boolean` | `false` | यदि सभी अनुरोधों का ओरिजिन समान हो, तो साझा पथ उपसर्ग को `servers[0].url` में समेटता है। |
| `validate` | `boolean` | `true` | आउटपुट दस्तावेज़ सत्यापित करता है। सत्यापन त्रुटियाँ निदान बनती हैं; सख्त मोड उन्हें अपवाद बना सकता है। |
| `strict` | `boolean` | `false` | किसी भी त्रुटि-स्तर के निदान पर `ConversionError` फेंकता है। |

`ResolvedConvertOptions` का प्रकार `Required<ConvertOptions> & { openapiVersion: "3.2.0" }` है।

---

### `ConvertResult`

हर रूपांतरण का वापसी मान।

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

हर एडाप्टर द्वारा बनाया जाने वाला एडाप्टर-स्वतंत्र मध्यवर्ती निरूपण।

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

`DiagnosticCode` उन सभी कोड का स्ट्रिंग यूनियन है जिन्हें फ़्रेमवर्क रिपोर्ट कर सकता है:

`ADAPTER_PARSE_FAILED`, `CURL_PARSE_FAILED`, `CURL_EMPTY_INPUT`, `CURL_CAPABILITY_MISSING`, `CURL_BACKEND_JSON_FALLBACK`, `CURL_UNSUPPORTED_SCHEME`, `POSTMAN_INVALID_COLLECTION`, `POSTMAN_EMPTY_COLLECTION`, `POSTMAN_UNSUPPORTED_BODY_MODE`, `POSTMAN_VARIABLE_UNRESOLVED`, `BODY_JSON_INVALID`, `PATH_MERGE_CONFLICT`, `OPERATION_ID_COLLISION`, `PSEUDO_HEADER_DROPPED`, `MULTIPLE_SERVERS`, `NO_REQUESTS`, `OAS_VALIDATION_ERROR`, `OAS_VALIDATOR_FAILED`, `DISCOVERY_COMPONENT_NOT_FOUND`, `DISCOVERY_COMPONENT_NAME_COLLISION`, `DISCOVERY_PATH_PARAM_MISMATCH`, `DISCOVERY_MEDIA_WITHOUT_SCHEMA`, `DISCOVERY_RESPONSE_MISSING`, `DISCOVERY_SECURITY_SCHEME_MISSING`, `DISCOVERY_GAP`, `DISCOVERY_PATH_CONFLICT`.

---

### अन्य मुख्य प्रकार

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

## डिस्कवरी के मध्यवर्ती निरूपण का रूपांतरण

### `discoveryToOpenApi`

दिए गए `DiscoveredProject` को OpenAPI 3.2 में बदलता है। स्वयं स्रोत फ़ाइलें स्कैन नहीं करता। अनसुलझे रूट चेतावनियाँ देते हैं और बिना बताए `paths` में कभी नहीं जोड़े जाते; स्रोत स्थान और विश्वास स्तर लौटाए गए प्रोजेक्ट में उपलब्ध रहते हैं।

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

`allowGaps: false` ऑपरेशन/स्कीमा की कमियों के निदान को त्रुटि के स्तर पर ले जाता है; यह सख्त मोड के अपवाद चालू करने वाला स्विच नहीं है। हमेशा `ok`, `documentValid` और `diagnostics` जाँचें। अनसुलझे रूट की चेतावनियाँ अलग रिपोर्ट होती हैं। सत्यापन बंद होने पर स्कीमा सत्यापन चलाए बिना ही `documentValid` सत्य होता है।

### `buildDiscoveryOpenApi32`

इसी मध्यवर्ती निरूपण का निम्न-स्तरीय सिंक्रोनस बिल्डर। दिए गए कॉलबैक से निदान रिपोर्ट करता है और दस्तावेज़ सत्यापन नहीं चलाता। सत्यापन और पूर्ण परिणाम ऑब्जेक्ट चाहिए तो एसिंक्रोनस रैपर इस्तेमाल करें।

```typescript
function buildDiscoveryOpenApi32(
  project: DiscoveredProject,
  allowGaps: boolean,
  report: (diagnostic: Diagnostic) => void,
): OpenApiDocument;
```

मुख्य प्रवेश बिंदु से निर्यात किए गए डिस्कवरी प्रकार: `Confidence`, `GapCode`, `SourceLocation`, `JsonSchema`, `DiscoveredParameter`, `DiscoveredMediaType`, `DiscoveredRequestBody`, `DiscoveredResponse`, `DiscoveredOperation`, `DiscoveredComponent`, `DiscoveredSecurityScheme`, `DiscoveredServer`, `DiscoveredUnresolved`, `DiscoveredProject`, `DiscoveryOptions`, `DiscoveryResult`।

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

## निर्यात का सारांश

| प्रतीक | श्रेणी |
|---|---|
| `curlToOpenApi` | फ़ंक्शन |
| `postmanToOpenApi` | फ़ंक्शन |
| `XToOpenApi` | क्लास |
| `DEFAULT_OPTIONS` | स्थिरांक |
| `AdapterRegistry` | क्लास |
| `ConversionError` | क्लास |
| `DiagnosticBag` | क्लास |
| `CurlAdapter` | क्लास |
| `splitCurlCommands` | फ़ंक्शन |
| `PostmanAdapter` | क्लास |
| `PostmanTypes` | नेमस्पेस |
| `buildOpenApi32` | फ़ंक्शन |
| `buildPathTemplates` | फ़ंक्शन |
| `looksLikeIdentifier` | फ़ंक्शन |
| `scalar` | फ़ंक्शन |
| `jsonSchema` | फ़ंक्शन |
| `mergeSchemas` | फ़ंक्शन |
| `Schema` | प्रकार |
| `discoveryToOpenApi` | फ़ंक्शन |
| `buildDiscoveryOpenApi32` | फ़ंक्शन |
| `validateOpenApi32` | फ़ंक्शन |
| `validateOpenApiDocument` | फ़ंक्शन (उपनाम) |
| `OpenApiDocument` | प्रकार |
| `OpenApi32Document` | प्रकार |
| `DiscoveredProject`, `DiscoveryOptions`, `DiscoveryResult` | प्रकार |
| `ConvertOptions`, `ConvertResult`, `NormalizedRequest`, `SourceAdapter`, `AdapterContext`, `Diagnostic`, `DiagnosticCode`, `Severity`, `Header`, `ParameterValue`, `FormField`, `BodyKind`, `RequestBody`, `RequestAuth`, `JsonObject`, `ResolvedConvertOptions` | प्रकार |
