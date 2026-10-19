---
sidebar_position: 2
title: "इंस्टॉलेशन"
description: "npm, yarn या pnpm से @powerduck/openapi-codegen इंस्टॉल करें और Node.js या ब्राउज़र में इस्तेमाल करें। Node.js 22.12.0 या नया संस्करण चाहिए।"
---

# इंस्टॉलेशन

## ज़रूरी चीज़ें

- Node.js में इस्तेमाल के लिए **Node.js** `>= 22.12.0` चाहिए (पैकेज के `engines` फ़ील्ड में घोषित)।
- OpenAPI दस्तावेज़ **पार्स किए गए** JavaScript ऑब्जेक्ट के रूप में होना चाहिए, कच्ची JSON/YAML स्ट्रिंग के रूप में नहीं।
- ब्राउज़र में इस्तेमाल के लिए Fetch API वाला आधुनिक ब्राउज़र चाहिए।

पैकेज में ESM (`dist/index.js`) और CommonJS (`dist/index.cjs`) बिल्ड के साथ TypeScript घोषणाएँ शामिल हैं। इसकी **कोई रनटाइम डिपेंडेंसी नहीं है**।

## npm

```bash npm2yarn2pnpm
npm install @powerduck/openapi-codegen
```

## pnpm

```bash npm2yarn2pnpm
pnpm add @powerduck/openapi-codegen
```

## Yarn

```bash npm2yarn2pnpm
yarn add @powerduck/openapi-codegen
```

## Node.js में इस्तेमाल

```typescript
import { generate } from "@powerduck/openapi-codegen";
```

CommonJS:

```javascript
const { generate } = require("@powerduck/openapi-codegen");
```

बिल्ट-इन जनरेटर **मॉड्यूल इम्पोर्ट करते ही अपने आप रजिस्टर** हो जाते हैं, इसलिए `generate` बिना अतिरिक्त सेटअप के काम करता है।

## ब्राउज़र में इस्तेमाल

लाइब्रेरी पूरी तरह ब्राउज़र-संगत है और Node.js के बिल्ट-इन मॉड्यूल नहीं इस्तेमाल करती। इसे ESM CDN से लोड करके सीधे कॉल करें:

```html
<script type="module">
  import { generate, list } from "https://esm.sh/@powerduck/openapi-codegen";

  const document = {
    openapi: "3.1.0",
    info: { title: "Example API", version: "1.0.0" },
    servers: [{ url: "https://api.example.com" }],
    paths: {
      "/hello": { get: { responses: { "200": { description: "OK" } } } },
    },
  };

  const code = generate({
    document,
    path: "/hello",
    method: "get",
    language: "javascript",
    client: "fetch",
  });

  console.log(code);
</script>
```

Vite, esbuild और webpack भी बिना अतिरिक्त सेटअप के काम करते हैं। ESM बिल्ड ट्री शेकिंग का समर्थन करता है।

## दस्तावेज़ दें

पार्स किया गया ऑब्जेक्ट पास करें। JSON के लिए:

```typescript
import { readFile } from "node:fs/promises";

const document = JSON.parse(await readFile("./openapi.json", "utf8"));
```

YAML के लिए पहले अलग YAML पैकेज से सामग्री पार्स करें:

```typescript
import YAML from "yaml";
const document = YAML.parse(await readFile("./openapi.yaml", "utf8"));
```

## पैकेज की संरचना

| एंट्री | पाथ |
|-------|------|
| ESM एंट्री | `dist/index.js` |
| CommonJS एंट्री | `dist/index.cjs` |
| टाइप परिभाषाएँ | `dist/index.d.ts` |

कोई CLI एक्ज़ीक्यूटेबल नहीं है; यह लाइब्रेरी केवल कोड से इस्तेमाल होती है।

## अगले चरण

- [त्वरित शुरुआत](/docs/hi-IN/openapi-codegen/quickstart/) — अपना पहला कोड स्निपेट बनाएँ।
- [कॉन्फ़िगरेशन](/docs/hi-IN/openapi-codegen/configuration/) — जनरेशन के सभी विकल्प देखें।
