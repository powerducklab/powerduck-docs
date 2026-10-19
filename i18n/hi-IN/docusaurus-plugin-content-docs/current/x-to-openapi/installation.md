---
sidebar_position: 2
title: "इंस्टॉलेशन"
description: "npm, yarn या pnpm से @powerduck/x-to-openapi इंस्टॉल करें। ESM और CommonJS समर्थित हैं; curlToOpenApi और postmanToOpenApi बिना सेटअप के काम करते हैं।"
---

# इंस्टॉलेशन

अपने पसंदीदा पैकेज मैनेजर से `@powerduck/x-to-openapi` इंस्टॉल करें।

## ज़रूरी चीज़ें

- **Node.js:** `>= 22.12.0`
- **TypeScript:** वैकल्पिक; पैकेज में पूरी टाइप परिभाषाएँ शामिल हैं।

## इंस्टॉलेशन

```bash npm2yarn2pnpm
npm install @powerduck/x-to-openapi
```

```bash
yarn add @powerduck/x-to-openapi
```

```bash
pnpm add @powerduck/x-to-openapi
```

## रनटाइम डिपेंडेंसी

| पैकेज | संस्करण | उपयोग |
|---|---|---|
| `@powerduck/openapi-parser` | `^0.3.12` | मानक OpenAPI टाइप और आउटपुट सत्यापन |
| `curlconverter` | `^4.12.0` | curl कमांड को संरचित अनुरोधों में पार्स करना |

दोनों डिपेंडेंसी अपने आप इंस्टॉल होती हैं।

---

## मॉड्यूल सिस्टम: ESM प्राथमिक, CJS समर्थन सहित

पैकेज `"type": "module"` घोषित करता है और एक ही एंट्री पॉइंट से दोनों बिल्ड देता है:

| बिल्ड | शर्त | फ़ाइल |
|---|---|---|
| ESM | `import` | `./dist/index.js` |
| CommonJS | `require` | `./dist/index.cjs` |
| टाइप | — | `./dist/index.d.ts` |

```typescript
// ESM (Node.js, bundlers)
import { curlToOpenApi, postmanToOpenApi } from "@powerduck/x-to-openapi";
```

```javascript
// CommonJS (require)
const { curlToOpenApi, postmanToOpenApi } = require("@powerduck/x-to-openapi");
```

पैकेज `"sideEffects": false` घोषित करता है, इसलिए ट्री शेकिंग अनुपयोगी अडैप्टर हटा सकती है।

---

## बिना सेटअप के सहायक फ़ंक्शन

अधिकांश उपयोगकर्ताओं को केवल दो फ़ंक्शन चाहिए। ये [`XToOpenApi`](/docs/hi-IN/x-to-openapi/api-reference/#xtoopenapi) का इंस्टेंस बनाते हैं, संबंधित अडैप्टर रजिस्टर करते हैं और `convert` कॉल करते हैं:

```typescript
import {
  curlToOpenApi,    // string | string[]  → OpenAPI 3.2
  postmanToOpenApi, // collection object | JSON string → OpenAPI 3.2
} from "@powerduck/x-to-openapi";
```

कस्टम विकल्प, कई अडैप्टर, `"auto"` पहचान या कस्टम अडैप्टर चाहिए तो पूरी [`XToOpenApi`](/docs/hi-IN/x-to-openapi/api-reference/#xtoopenapi) क्लास इस्तेमाल करें।

---

## जाँचें

```bash
# Check the installed version
npm list @powerduck/x-to-openapi

# Verify the package loads and the helpers exist
node -e "const x = require('@powerduck/x-to-openapi'); console.log(typeof x.curlToOpenApi, typeof x.postmanToOpenApi, typeof x.XToOpenApi);"
```

---

## अगले चरण

- [त्वरित शुरुआत](/docs/hi-IN/x-to-openapi/quickstart/) — curl कमांड और Postman कलेक्शन बदलें, और कस्टम अडैप्टर रजिस्टर करें।
- [API संदर्भ](/docs/hi-IN/x-to-openapi/api-reference/) — सभी एक्सपोर्ट और विकल्प देखें।
