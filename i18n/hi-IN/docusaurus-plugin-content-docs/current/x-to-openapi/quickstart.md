---
sidebar_position: 3
title: "तुरंत शुरुआत"
description: "@powerduck/x-to-openapi से शुरुआत करें: curl कमांड और Postman कलेक्शन बदलें, फिर XToOpenApi से कस्टम अडैप्टर रजिस्टर करें।"
---

# तुरंत शुरुआत

यह गाइड तीन सबसे आम तरीके बताती है: `curlToOpenApi` हेल्पर, `postmanToOpenApi` हेल्पर और कस्टम संयोजन के लिए `XToOpenApi` क्लास।

ज़रूरी शर्त: पैकेज इंस्टॉल करें। [इंस्टॉल करें](/docs/hi-IN/x-to-openapi/installation/)

:::note
सभी कन्वर्ज़न फ़ंक्शन **असिंक्रोनस** हैं और [`ConvertResult`](/docs/hi-IN/x-to-openapi/api-reference/#convertresult) लौटाते हैं। हमेशा `await` इस्तेमाल करें।
:::

## 1. curl कमांड बदलें

एक curl कमांड [`curlToOpenApi`](/docs/hi-IN/x-to-openapi/api-reference/#curltoopenapi) को दें। नतीजे का `document` फ़ील्ड बनाया गया OpenAPI 3.2 ऑब्जेक्ट है।

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  `curl -X POST https://api.example.com/users \
    -H 'Content-Type: application/json' \
    --data '{"name":"Ada","age":36}'`,
);

console.log(JSON.stringify(result.document, null, 2));
```

बनाए गए दस्तावेज़ का संक्षिप्त रूप यह है:

```json
{
  "openapi": "3.2.0",
  "info": { "title": "Generated API", "version": "1.0.0" },
  "servers": [{ "url": "https://api.example.com" }],
  "paths": {
    "/users": {
      "post": {
        "operationId": "postUsers",
        "tags": ["users"],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "name": { "type": "string" },
                  "age": { "type": "integer" }
                },
                "required": ["name", "age"]
              }
            }
          }
        },
        "responses": { "default": { "description": "Successful response" } }
      }
    }
  }
}
```

जाँचें कि कन्वर्ज़न सफल हुआ या नहीं और डायग्नोस्टिक संदेश देखें:

```typescript
if (!result.ok) {
  for (const d of result.diagnostics) {
    console.error(`[${d.severity}] ${d.code}: ${d.message}`);
  }
}
console.log("Document valid:", result.documentValid);
```

## 2. Postman कलेक्शन बदलें

पार्स किया गया कलेक्शन ऑब्जेक्ट या JSON स्ट्रिंग [`postmanToOpenApi`](/docs/hi-IN/x-to-openapi/api-reference/) को दें। टेस्ट स्क्रिप्ट `x-postman-scripts` के रूप में सुरक्षित रहती हैं।

```typescript
import { postmanToOpenApi } from "@powerduck/x-to-openapi";

const collection = {
  info: {
    name: "User API",
    schema: "https://schema.postman.com/json/collection/v2.1.0/collection.json",
  },
  item: [
    {
      name: "Get user",
      request: {
        method: "GET",
        url: "https://api.example.com/users/123",
        header: [{ key: "Authorization", value: "Bearer token" }],
      },
      event: [
        {
          listen: "test",
          script: {
            type: "text/javascript",
            exec: ["pm.test('status is 200', () => pm.response.to.have.status(200));"],
          },
        },
      ],
    },
  ],
  auth: { type: "bearer", bearer: [{ key: "token", value: "{{token}}" }] },
};

const result = await postmanToOpenApi(collection, {
  title: collection.info.name,
  inferPathParameters: true,
});

// The Postman test script survives on the operation:
console.log(result.document.paths["/users/123"]?.get?.["x-postman-scripts"]);
```

JSON स्ट्रिंग भी इस्तेमाल की जा सकती है:

```typescript
const fromText = await postmanToOpenApi('{"info":{"name":"API"},"item":[]}');
```

## 3. कस्टम विकल्पों के साथ `XToOpenApi` क्लास इस्तेमाल करें

रजिस्टर किए गए अडैप्टर और [`ConvertOptions`](/docs/hi-IN/x-to-openapi/api-reference/#convertoptions) पर स्पष्ट नियंत्रण चाहिए तो क्लास इस्तेमाल करें।

```typescript
import { XToOpenApi, CurlAdapter } from "@powerduck/x-to-openapi";

const converter = new XToOpenApi().register(new CurlAdapter());

const result = await converter.convert(
  "curl",
  "curl https://api.example.com/users/123",
  {
    title: "My API",
    version: "1.0.0",
    description: "Generated from curl commands",
    inferPathParameters: true,
    pathParameterMinSamples: 2,
    inferSecurity: true,
    includeCommonHeaders: false,
    includeCookies: false,
    includeExamples: false,
    useServerBasePath: false,
    validate: true,
    strict: false,
  },
);

console.log(result.document);
```

### कई अडैप्टर रजिस्टर करें और `"auto"` इस्तेमाल करें

```typescript
import { XToOpenApi, CurlAdapter, PostmanAdapter } from "@powerduck/x-to-openapi";

const converter = new XToOpenApi()
  .register(new CurlAdapter())
  .register(new PostmanAdapter());

// "auto" picks the first adapter whose canHandle(input) returns true.
const result = await converter.convert("auto", postmanCollectionOrCurlText);
```

## 4. डायग्नोस्टिक और सख़्त मोड

डिफ़ॉल्ट रूप से कन्वर्ज़न समस्याओं को [`Diagnostic`](/docs/hi-IN/x-to-openapi/api-reference/) एंट्री के रूप में इकट्ठा करता है और फिर भी नतीजा लौटाता है। पहली त्रुटि-स्तर वाली सूचना पर [`ConversionError`](/docs/hi-IN/x-to-openapi/api-reference/#conversionerror) देने के लिए `strict: true` सेट करें।

```typescript
import { curlToOpenApi, ConversionError } from "@powerduck/x-to-openapi";

try {
  await curlToOpenApi("curl https://api.example.com/users", { strict: true });
} catch (error) {
  if (error instanceof ConversionError) {
    console.error("Failed:", error.message);
    for (const d of error.diagnostics) console.error(`  [${d.code}] ${d.message}`);
  }
}
```

## अगले कदम

- [उदाहरण](/docs/hi-IN/x-to-openapi/examples/) — बैच में curl, पाथ पैरामीटर का अनुमान, Postman ऑथेंटिकेशन और कस्टम अडैप्टर।
- [API संदर्भ](/docs/hi-IN/x-to-openapi/api-reference/) — सभी एक्सपोर्ट, विकल्प और डायग्नोस्टिक कोड।
