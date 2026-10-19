---
sidebar_position: 2
title: "इंस्टॉलेशन"
description: "@powerduck/openapi-cli को ग्लोबल रूप से या डेवलपमेंट डिपेंडेंसी के तौर पर इंस्टॉल करें, या npx से चलाएँ। Node.js 22.12.0 या उसके बाद का संस्करण चाहिए।"
---

# इंस्टॉलेशन

## ज़रूरी चीज़ें

- **Node.js**: `>= 22.12.0` (पैकेज के `engines` फ़ील्ड में घोषित)।
- पैकेज मैनेजर: npm, yarn या pnpm।

पैकेज में ESM (`dist/index.js`) और CommonJS (`dist/index.cjs`) बिल्ड के साथ TypeScript घोषणाएँ (`dist/index.d.ts`) शामिल हैं। अलग से `@types` पैकेज की ज़रूरत नहीं है।

## ग्लोबल इंस्टॉलेशन (CLI के लिए अनुशंसित)

ग्लोबल इंस्टॉलेशन से `openapi-cli` एक्ज़ीक्यूटेबल आपके `PATH` में उपलब्ध हो जाता है:

```bash npm2yarn2pnpm
npm install -g @powerduck/openapi-cli
```

एक्ज़ीक्यूटेबल जाँचें:

```bash
openapi-cli --help
```

## प्रोजेक्ट में इंस्टॉलेशन (CI के लिए अनुशंसित)

प्रोजेक्ट में संस्करण तय रखें, ताकि CI किसी ज्ञात रिलीज़ का इस्तेमाल करे:

```bash npm2yarn2pnpm
npm install --save-dev @powerduck/openapi-cli
```

फिर पैकेज मैनेजर के ज़रिए कमांड चलाएँ:

```bash
npx openapi-cli --spec openapi.json
# or
pnpm exec openapi-cli --spec openapi.json
```

## npx से एक बार चलाएँ

पहले इंस्टॉल करने की ज़रूरत नहीं:

```bash
npx @powerduck/openapi-cli --spec openapi.json
```

## पैकेज की संरचना

| एंट्री | पाथ |
|-------|------|
| ESM एंट्री | `dist/index.js` |
| CommonJS एंट्री | `dist/index.cjs` |
| टाइप परिभाषाएँ | `dist/index.d.ts` |
| CLI एंट्री (bin) | `dist/cli.js` |
| एक्ज़ीक्यूटेबल का नाम | `openapi-cli` |

पैकेज `"type": "module"` घोषित करता है और केवल `.` तथा `./package.json` सबपाथ उपलब्ध कराता है।

## कोड में इम्पोर्ट करें

```typescript
// ESM
import { runTests, resolveConfig } from "@powerduck/openapi-cli";

// CommonJS
const { runTests, resolveConfig } = require("@powerduck/openapi-cli");
```

## रनटाइम डिपेंडेंसी

प्रकाशित पैकेज इन लाइब्रेरी पर निर्भर है:

- `@powerduck/openapi-parser` (`^0.3.12`) — आंतरिक `$ref` संदर्भों का समाधान।
- `@powerduck/openapi-request` (`0.2.22`) — प्रोटोकॉल अनुरोधों का निष्पादन।
- `commander` (`^12.1.0`) — CLI आर्ग्युमेंट की पार्सिंग।
- `https-proxy-agent` (`^5.0.1`) — HTTP ट्रांसपोर्ट के लिए प्रॉक्सी समर्थन।

## अगले चरण

- [त्वरित शुरुआत](/docs/hi-IN/openapi-cli/quickstart/) — अपना पहला टेस्ट सूट चलाएँ।
- [कमांड](/docs/hi-IN/openapi-cli/commands/) — सभी विकल्पों का संदर्भ देखें।
