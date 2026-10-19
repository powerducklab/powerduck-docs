---
sidebar_position: 2
title: "इंस्टॉल करें"
description: "@powerduck/conf-patch इंस्टॉल करें और Node.js के फ़ाइल प्रवेश या ब्राउज़र-सुरक्षित ./core उप-पाथ में से चुनें।"
---

# इंस्टॉल करें

अपने पसंदीदा पैकेज मैनेजर से `@powerduck/conf-patch` इंस्टॉल करें।

## ज़रूरी चीज़ें

- **Node.js:** `>= 22.12.0`
- **TypeScript:** वैकल्पिक है; पैकेज में सभी टाइप घोषणाएँ मिलती हैं, इसलिए `@types/...` नहीं चाहिए।

## इंस्टॉल करें

```bash npm2yarn2pnpm
npm install @powerduck/conf-patch
```

```bash
yarn add @powerduck/conf-patch
```

```bash
pnpm add @powerduck/conf-patch
```

## रनटाइम डिपेंडेंसी

conf-patch की तीन रनटाइम निर्भरताएँ अपने-आप इंस्टॉल होती हैं:

| पैकेज | संस्करण | उपयोग |
|---|---|---|
| `@powerduck/openapi-parser` | `^0.3.12` | OpenAPI/Swagger सत्यापन (`validateOpenAPISpec`, `validateOpenAPIFile`)। |
| `jsonc-parser` | `^3.3.1` | JSON और JSONC में क्रमिक टेक्स्ट संपादन। |
| `yaml` | `^2.9.0` | YAML AST को पार्स और संशोधित करना। |

इन निर्भरताओं को सीधे इस्तेमाल करने की ज़रूरत नहीं है।

## दो प्रवेश बिंदु

पैकेज **दो उप-पाथ एक्सपोर्ट** देता है। अपने परिवेश के अनुसार चुनें।

### मुख्य प्रवेश — `@powerduck/conf-patch`

इसमें **फ़ाइल स्तर** (`readConfigFile`, `writeConfigFile`, `patchConfigFile`, `setConfigValue`, `deleteConfigValue`, `withFileLock`, `releaseAllLocalLocks`), मुख्य स्तर और OpenAPI सत्यापन शामिल हैं। Node.js और Electron में इस्तेमाल करें। यह `node:fs`, `node:path` और `node:crypto` पर निर्भर है।

### मुख्य स्तर का उप-पाथ — `@powerduck/conf-patch/core`

**केवल ब्राउज़र-सुरक्षित मुख्य स्तर** एक्सपोर्ट करता है: `patchContent`, `setContentValue`, `deleteContentValue`, असर्शन हेल्पर और मुख्य टाइप। Node.js निर्भरता नहीं है; ब्राउज़र, Edge Functions और service worker के लिए बंडल किया जा सकता है।

:::tip
ब्राउज़र के लिए हमेशा `@powerduck/conf-patch/core` से इम्पोर्ट करें। इससे फ़ाइल स्तर और उसकी `node:fs` निर्भरता बंडल से बाहर रहते हैं।
:::

## मॉड्यूल प्रणाली: CJS और ESM

पैकेज `"type": "module"` **सेट नहीं करता**, इसलिए `.js` फ़ाइलें डिफ़ॉल्ट रूप से CommonJS मानी जाती हैं। `package.json` का `exports` मैप `import` और `require` को सही बिल्ड से जोड़ता है।

| प्रवेश | CJS (`require`) | ESM (`import`) | टाइप |
|---|---|---|---|
| मुख्य प्रवेश | `dist/index.js` | `dist/index.mjs` | `dist/index.d.ts` |
| मुख्य स्तर का उप-पाथ | `dist/core.js` | `dist/core.mjs` | `dist/core.d.ts` |

### CommonJS (Node.js / Electron मुख्य प्रक्रिया)

```javascript
// Full library (includes file IO)
const { setConfigValue, readConfigFile } = require("@powerduck/conf-patch");

// Core layer only (browser-safe, no fs dependency)
const { patchContent, setContentValue } = require("@powerduck/conf-patch/core");
```

### ES Modules (आधुनिक Node.js / ब्राउज़र / बंडलर)

```typescript
// Full library
import { setConfigValue, readConfigFile } from "@powerduck/conf-patch";

// Core layer only (browser-safe)
import { patchContent, setContentValue } from "@powerduck/conf-patch/core";
```

## इंस्टॉलेशन जाँचें

```bash
# Check the installed version
npm list @powerduck/conf-patch

# Verify the main entry loads
node -e "const lib = require('@powerduck/conf-patch'); console.log('exports:', Object.keys(lib).length);"

# Verify the core subpath loads
node -e "const core = require('@powerduck/conf-patch/core'); console.log('core exports:', Object.keys(core).length);"
```

## अगले कदम

- [तुरंत शुरुआत](/docs/hi-IN/conf-patch/quickstart/) — ब्राउज़र में स्ट्रिंग और डिस्क पर फ़ाइल बदलें।
- [API संदर्भ](/docs/hi-IN/conf-patch/api-reference/) — सभी एक्सपोर्ट, टाइप और विकल्प।
