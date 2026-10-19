---
sidebar_position: 5
title: "उदाहरण"
description: "सार्वजनिक API पर आधारित व्यावहारिक, चलाए जा सकने वाले उदाहरण। रूपांतरण फ़ंक्शन एसिंक्रोनस हैं; await इस्तेमाल करें। ये इनपुट को स्थानीय रूप से पार्स करते हैं और रिकॉर्ड किए गए HTTP अनुरोध नहीं भेजते।"
---

# उदाहरण

सार्वजनिक API पर आधारित व्यावहारिक, चलाए जा सकने वाले उदाहरण। रूपांतरण फ़ंक्शन एसिंक्रोनस हैं; `await` इस्तेमाल करें। ये इनपुट को स्थानीय रूप से पार्स करते हैं और रिकॉर्ड किए गए HTTP अनुरोध नहीं भेजते।

---

## 1. साधारण curl कमांड

एक curl कमांड बदलें और बने हुए दस्तावेज़ को देखें।

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  `curl -X POST https://api.example.com/users \
    -H 'Content-Type: application/json' \
    --data '{"name":"Ada","age":36,"tags":["admin","user"]}'`,
);

console.log(result.document.openapi);            // "3.2.0"
console.log(result.ok, result.documentValid);    // true true

const post = result.document.paths["/users"].post;
const body = post?.requestBody;
if (!body || !("content" in body)) throw new Error("Expected an inline request body");
const media = body.content["application/json"];
console.log(media && "schema" in media ? media.schema : undefined);
// {
//   type: "object",
//   properties: {
//     name: { type: "string" },
//     age: { type: "integer" },
//     tags: { type: "array", items: { type: "string" } }
//   },
//   required: ["name", "age", "tags"]
// }
```

सफल होने पर भी डायग्नोस्टिक जानकारी लौटती है:

```typescript
for (const d of result.diagnostics) {
  console.log(`[${d.severity}] ${d.code}: ${d.message}`);
}
```

---

## 2. कई curl कमांड का बैच

कमांड की ऐरे या कई कमांड वाली स्ट्रिंग दें। समान मेथड और पाथ वाले अनुरोध मर्ज होते हैं; स्कीमा संरचना के आधार पर जोड़े जाते हैं।

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  [
    "curl https://api.example.com/users",
    "curl https://api.example.com/users/123",
    "curl https://api.example.com/users/456",
    `curl -X POST https://api.example.com/users \
       -H 'Content-Type: application/json' \
       --data '{"name":"Ada"}'`,
  ],
  {
    title: "User API",
    version: "2.0.0",
    useServerBasePath: false,
    inferPathParameters: true,
  },
);

// The two detail requests are grouped; /users remains a separate path.
console.log(Object.keys(result.document.paths)); // ["/users", "/users/{userId}"]
```

### ब्राउज़र के “सभी को cURL के रूप में कॉपी करें” का आउटपुट

पूरा ब्लॉक एक साथ पेस्ट करें; [`splitCurlCommands`](./api-reference.md#splitcurlcommands) उद्धरण चिह्न, अगली पंक्ति में जारी कमांड, प्रॉम्प्ट और `curl.exe` सँभालता है।

```typescript
const block = `
$ curl 'https://api.example.com/users/1?active=true'
> curl 'https://api.example.com/users/2' -X POST \
  -H 'Content-Type: application/json' --data '{"name":"Ada"}'`;

const result = await curlToOpenApi(block, { title: "Pasted traffic" });
```

---

## 3. Postman कलेक्शन

कलेक्शन ऑब्जेक्ट बदलें। नेस्ट किए गए फ़ोल्डर, विरासत में मिला प्रमाणीकरण और टेस्ट स्क्रिप्ट भी शामिल होते हैं।

```typescript
import { postmanToOpenApi } from "@powerduck/x-to-openapi";

const collection = {
  info: {
    name: "User API",
    schema: "https://schema.postman.com/json/collection/v2.1.0/collection.json",
  },
  auth: { type: "bearer", bearer: [{ key: "token", value: "{{token}}" }] },
  item: [
    {
      name: "Users",
      item: [
        {
          name: "Create user",
          request: {
            method: "POST",
            url: "https://api.example.com/users",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: '{"name":"Ada","role":"admin"}',
              options: { raw: { language: "json" } },
            },
          },
          event: [
            {
              listen: "test",
              script: {
                type: "text/javascript",
                exec: ["pm.test('status is 201', () => pm.response.to.have.status(201));"],
              },
            },
          ],
        },
      ],
    },
  ],
};

const result = await postmanToOpenApi(collection, {
  title: collection.info.name,
  inferPathParameters: true,
});

// Collection-level bearer auth becomes a securityScheme + operation security.
console.log(result.document.components?.securitySchemes);
// { bearerAuth: { type: "http", scheme: "bearer" } }

// The Postman test script is preserved:
console.log(result.document.paths["/users"].post["x-postman-scripts"]);
// { test: "pm.test('status is 201', () => ...)" }
```

JSON स्ट्रिंग भी इस्तेमाल कर सकते हैं:

```typescript
const fromText = await postmanToOpenApi(JSON.stringify(collection));
```

---

## 4. पाथ पैरामीटर का अनुमान

`inferPathParameters` चालू होने पर, जो डिफ़ॉल्ट है, अनुरोध मेथड, ओरिजिन और पाथ की बनावट के आधार पर समूहित होते हैं। कोई खंड तभी पैरामीटर बनता है जब समूह में कम से कम `pathParameterMinSamples` अनुरोध हों, मान बदलते हों और **हर** मान पहचानकर्ता जैसा हो: संख्या, UUID, ULID या कम से कम 8 वर्णों की हेक्साडेसिमल स्ट्रिंग।

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  [
    "curl https://api.example.com/users/123",
    "curl https://api.example.com/users/456",
    "curl https://api.example.com/users/123/posts/abc12345",
    "curl https://api.example.com/users/456/posts/def45678",
  ],
  { pathParameterMinSamples: 2 },
);

console.log(Object.keys(result.document.paths));
// [ "/users/{userId}", "/users/{userId}/posts/{postId}" ]
```

पैरामीटर के नाम सबसे नज़दीकी पिछले स्थिर खंड से बनते हैं, जिसे एकवचन और camelCase में बदला जाता है:

| पाथ पैटर्न | पैरामीटर के नाम |
|---|---|
| `/users/{}` | `userId` |
| `/users/{}/posts/{}` | `userId`, `postId` |
| `/categories/{}/items/{}` | `categoryId`, `itemId` |
| `/{}` | `param1` |

एक पाथ में दोहराए गए नामों में संख्या का प्रत्यय जुड़ता है (`userId`, `userId2`)।

पाथ के मूल खंड रखने के लिए अनुमान बंद करें:

```typescript
await curlToOpenApi(commands, { inferPathParameters: false });
```

---

## 5. कस्टम अडैप्टर

HAR, HTTPie या Insomnia जैसे स्रोत जोड़ने के लिए [`SourceAdapter`](./api-reference.md) लागू करें और फिर उसे `XToOpenApi` में रजिस्टर करें।

```typescript
import {
  XToOpenApi,
  CurlAdapter,
  type SourceAdapter,
  type NormalizedRequest,
  type AdapterContext,
} from "@powerduck/x-to-openapi";

// A trivial adapter that emits a single GET request.
class PingAdapter implements SourceAdapter<{ url: string }> {
  readonly id = "ping";

  canHandle(input: unknown): boolean {
    return (
      typeof input === "object" &&
      input !== null &&
      "url" in (input as Record<string, unknown>)
    );
  }

  async parse(
    input: { url: string },
    context: AdapterContext,
  ): Promise<NormalizedRequest[]> {
    let url: URL;
    try {
      url = new URL(input.url);
    } catch (cause) {
      context.report({
        code: "ADAPTER_PARSE_FAILED",
        severity: "error",
        source: this.id,
        message: `Invalid URL: ${input.url}`,
        cause,
      });
      return [];
    }

    return [
      {
        source: this.id,
        sourceIndex: 0,
        method: "get",
        url,
        urlString: url.toString(),
        headers: [],
        query: [],
        cookies: [],
      },
    ];
  }
}

const converter = new XToOpenApi()
  .register(new PingAdapter())
  .register(new CurlAdapter());

// Explicit adapter id:
const a = await converter.convert("ping", { url: "https://api.example.com/health" });

// Auto-detect:
const b = await converter.convert("auto", { url: "https://api.example.com/health" });

console.log(a.document.paths["/health"]?.get?.operationId);
```

---

## 6. एरर हैंडलिंग और सख्त मोड

समस्याएँ `result.diagnostics` में इकट्ठी होती हैं। `strict: true` होने पर एरर स्तर के डायग्नोस्टिक [`ConversionError`](./api-reference.md#conversionerror) फेंकते हैं; केवल चेतावनी ऐसा नहीं करती। अमान्य विकल्प और अनजान अडैप्टर ID भी अपवाद फेंक सकते हैं।

```typescript
import { curlToOpenApi, ConversionError } from "@powerduck/x-to-openapi";

// Soft mode: inspect diagnostics yourself.
const soft = await curlToOpenApi("curl https://api.example.com/health");
if (!soft.ok) {
  for (const d of soft.diagnostics) {
    console.error(`[${d.severity}] ${d.code}: ${d.message}`);
  }
}

// Strict mode: throw on the first error-severity diagnostic.
try {
  await curlToOpenApi("not a curl command at all", { strict: true });
} catch (error) {
  if (error instanceof ConversionError) {
    console.error("Conversion failed:", error.message);
    for (const d of error.diagnostics) console.error(`  ${d.code}`);
  }
}
```

वर्तमान आकार जाँच किसी स्ट्रिंग या ऐरे के स्ट्रिंग तत्वों की कुल लंबाई 10 × 1024 × 1024 JavaScript स्ट्रिंग कोड यूनिट से अधिक होने पर `ConversionError` फेंकती है, चाहे `strict` कुछ भी हो। यह UTF-8 बाइट सीमा नहीं है और पहले से पार्स किए गए ऑब्जेक्ट नहीं मापती; अविश्वसनीय इनपुट लेने से पहले अपनी बाइट सीमा लागू करें।

---

## अगले चरण

- [API संदर्भ](./api-reference.md): विकल्पों के डिफ़ॉल्ट और डायग्नोस्टिक कोड।
- [त्वरित शुरुआत](./quickstart.md): आपका पहला पूरा रूपांतरण।
