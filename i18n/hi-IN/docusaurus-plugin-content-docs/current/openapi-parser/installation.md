---
sidebar_position: 2
title: "इंस्टॉल करना"
description: "@powerduck/openapi-parser इंस्टॉल करें और ESM/CJS बिल्ड की जाँच करें।"
---

# इंस्टॉल करना

```bash npm2yarn2pnpm
npm install @powerduck/openapi-parser
```

Node.js 22.12.0 या इसके बाद का संस्करण आवश्यक है।

## पैकेज की संरचना

```
@powerduck/openapi-parser
├── dist/index.js       # ESM build
├── dist/index.cjs      # CJS build (require())
└── dist/index.d.ts     # TypeScript declarations
```

## ESM (Node.js 22.12.0 या बाद का संस्करण, आधुनिक बंडलर)

```typescript
import { upgradeOasTo32 } from "@powerduck/openapi-parser";
```

## CommonJS (Electron की मुख्य प्रक्रिया)

```javascript
const { upgradeOasTo32 } = require("@powerduck/openapi-parser");
```

## कोई पीयर डिपेंडेंसी नहीं

इस पैकेज की कोई पीयर डिपेंडेंसी नहीं है। `@scalar/openapi-parser` और `@scalar/openapi-upgrader` इसके भीतर बंडल किए गए हैं।
