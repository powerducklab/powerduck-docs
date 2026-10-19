---
sidebar_position: 2
title: "इंस्टॉलेशन"
description: "@powerduck/openapi-mcp-server को npm, yarn, pnpm या ग्लोबल इंस्टॉलेशन से इस्तेमाल करें। openapi-mcp CLI, ./server सबपाथ और डिपेंडेंसी की जानकारी। Node.js 22.12.0 या नया संस्करण चाहिए।"
---

# इंस्टॉलेशन

## ज़रूरी चीज़ें

- **Node.js `>=22.12.0`** (`engines` में घोषित)।

## इंस्टॉलेशन

```bash npm2yarn2pnpm
npm install @powerduck/openapi-mcp-server
```

Yarn:

```bash
yarn add @powerduck/openapi-mcp-server
```

pnpm:

```bash
pnpm add @powerduck/openapi-mcp-server
```

## CLI

पैकेज `openapi-mcp` एक्ज़ीक्यूटेबल रजिस्टर करता है।

```bash
# global install
npm install -g @powerduck/openapi-mcp-server

# or run without installing
npx --package @powerduck/openapi-mcp-server openapi-mcp --help
```

CLI में केवल `serve` कमांड है ([त्वरित शुरुआत](/docs/hi-IN/openapi-mcp-server/quickstart/) देखें)।

## ESM / CommonJS

दोनों बिल्ड फ़ॉर्मैट में टाइप घोषणाएँ शामिल हैं। अतिरिक्त `@types/*` की ज़रूरत नहीं है:

```javascript
// ESM
import { buildMcpServer, startStdioServer } from "@powerduck/openapi-mcp-server";

// CommonJS
const { buildMcpServer, startStdioServer } = require("@powerduck/openapi-mcp-server");
```

## सबपाथ एक्सपोर्ट

| इम्पोर्ट | सामग्री |
| --- | --- |
| `@powerduck/openapi-mcp-server` | मुख्य लाइब्रेरी: स्पेसिफ़िकेशन लोड करना, टूल/प्रॉम्प्ट/रिसोर्स बनाना, अनुरोध चलाना, MCP सर्वर बनाना और stdio तथा HTTP ट्रांसपोर्ट। |
| `@powerduck/openapi-mcp-server/server` | एडमिन HTTP सर्वर और प्रमाणीकरण मिडलवेयर (`startAdminServer`, `createAuthMiddleware`)। |

## रनटाइम डिपेंडेंसी

ये डिपेंडेंसी पैकेज के साथ अपने आप इंस्टॉल होती हैं:

- `@modelcontextprotocol/sdk` — MCP प्रोटोकॉल का कार्यान्वयन।
- `@powerduck/openapi-parser` — OpenAPI सत्यापन, संदर्भ समाधान और अपग्रेड।
- `express` और `cors` — एडमिन HTTP सर्वर और CORS।
- `axios` — टूल चलाते समय अपस्ट्रीम सेवा को अनुरोध भेजने वाला HTTP क्लाइंट।
- `commander` — CLI फ़्रेमवर्क।
- `js-yaml` — YAML पार्सिंग।
- `multer` — स्पेसिफ़िकेशन अपलोड का प्रबंधन।
- `terser` — एम्बेडेड वेब इंटरफ़ेस की फ़ाइलों को छोटा करना।

## जाँचें

```bash
npx --package @powerduck/openapi-mcp-server openapi-mcp --help
```

## अगले चरण

- [त्वरित शुरुआत](/docs/hi-IN/openapi-mcp-server/quickstart/)
- [कॉन्फ़िगरेशन](/docs/hi-IN/openapi-mcp-server/configuration/)
