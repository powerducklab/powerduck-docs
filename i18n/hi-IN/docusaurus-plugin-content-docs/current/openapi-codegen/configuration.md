---
sidebar_position: 4
title: "कॉन्फ़िगरेशन"
description: "@powerduck/openapi-codegen के जनरेशन विकल्प: GenerateOptions, RequestIR और Generator तथा Plugin इंटरफ़ेस।"
---

# कॉन्फ़िगरेशन

अलग कॉन्फ़िगरेशन फ़ाइल नहीं होती। [`generate()`](/docs/hi-IN/openapi-codegen/api-reference/) को दिया गया `GenerateOptions` ऑब्जेक्ट जनरेशन नियंत्रित करता है।

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

| विकल्प | टाइप | ज़रूरी | विवरण |
|---|---|---|---|
| `language` | `string` | हाँ | लक्ष्य भाषा का पहचानकर्ता, बड़े और छोटे अक्षरों में भेद नहीं करता, जैसे `"javascript"` |
| `client` | `string` | हाँ | लक्ष्य HTTP क्लाइंट का पहचानकर्ता, जैसे `"fetch"` |
| `request` | `RequestIR` | एक विकल्प* | पहले से मानकीकृत अनुरोध; `normalize` छोड़ देता है |
| `document` | `unknown` | एक विकल्प* | पार्स किया गया OpenAPI दस्तावेज़ ऑब्जेक्ट |
| `path` | `string` | `document` के साथ | बिल्कुल मेल खाने वाला OpenAPI पाथ टेम्पलेट, जैसे `"/pets/{id}"` |
| `method` | `string` | `document` के साथ | HTTP मेथड, जैसे `"get"` / `"post"` |
| `serverUrl` | `string` | नहीं | दस्तावेज़ का सर्वर URL बदलता है |
| `securityValues` | `Record<string, string>` | नहीं | सुरक्षा स्कीम के नाम से कुंजीबद्ध क्रेडेंशियल |
| `softRefMode` | `boolean` | नहीं | टूटे या चक्रीय `$ref` पर त्रुटि नहीं देता; आंशिक मान लौटाता है |

\* अकेला `request` या `document` + `path` + `method` देना ज़रूरी है। `request` देने पर `document`, `path`, `method`, `serverUrl`, `securityValues` और `softRefMode` अनदेखे किए जाते हैं।

### इनपुट सत्यापन की त्रुटियाँ

ज़रूरी इनपुट न होने पर `generate()` त्रुटि देता है:

- `TypeError: generate() requires an options object` — विकल्पों का ऑब्जेक्ट नहीं दिया गया।
- `Error: Unsupported generator: <language>/<client>` — अज्ञात संयोजन।
- `TypeError: generate() requires either a 'request' or a 'document' option`
- `TypeError: generate() requires a 'path' option when using 'document'`
- `TypeError: generate() requires a 'method' option when using 'document'`

असमर्थित मेथड, गायब `paths`, अज्ञात पाथ और गायब ऑपरेशन पर `normalize()` स्वयं `Error` देता है; दस्तावेज़ ऑब्जेक्ट न हो तो `TypeError` देता है।

## RequestIR

एक अनुरोध का मानकीकृत रूप, जो कोड जनरेटर से स्वतंत्र है। इसे सीधे बनाकर `options.request` के रूप में दें और `normalize` छोड़ दें।

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

Multipart फ़ाइल प्लेसहोल्डर का मार्कर इस रूप में होता है:

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

इस इंटरफ़ेस से मेल खाने वाला कोई भी ऑब्जेक्ट जनरेटर हो सकता है। बिल्ट-इन जनरेटर `createGenerator(language, client, emit)` से बनाए जाते हैं, लेकिन आप अपने भी रजिस्टर कर सकते हैं:

```ts
interface Generator {
  language: string;
  client: string;
  generate(request: RequestIR): string;
}
```

`generate` को `RequestIR` मिलता है और वह बनाया गया सोर्स कोड स्ट्रिंग के रूप में लौटाता है।

## Plugin

प्लगइन `use()` के ज़रिए एक या अधिक जनरेटर रजिस्टर करता है:

```ts
interface Plugin {
  name: string;
  register(api: { register(generator: Generator): void }): void;
}
```

उदाहरण:

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

यह टाइप भविष्य के ऐसे परिणामों के लिए घोषित है जिनमें कई फ़ाइलें हो सकती हैं। फ़िलहाल `generate()` अब भी `string` लौटाता है:

```ts
interface GenerateResult {
  code: string;
  files?: Record<string, string>;
  metadata?: Record<string, unknown>;
}
```

## normalize के आउटपुट का रूप

सीधे `normalize()` कॉल करने पर ([API संदर्भ](/docs/hi-IN/openapi-codegen/api-reference/#normalizeoptions) देखें) `RequestIR` से थोड़ा अधिक विस्तृत ऑब्जेक्ट मिलता है:

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

## सर्वर URL तय करने का क्रम

`baseUrl` नीचे दिए क्रम में पहला गैर-खाली मान लेता है:

1. `options.serverUrl`
2. ऑपरेशन के `servers`
3. पाथ आइटम के `servers`
4. रूट के `servers`
5. फ़ॉलबैक `"https://example.com"`

सर्वर के `{variable}` प्लेसहोल्डर `server.variables` से भरे जाते हैं: पहले `default`, फिर `example` लिया जाता है और URI-एन्कोड किया जाता है।
