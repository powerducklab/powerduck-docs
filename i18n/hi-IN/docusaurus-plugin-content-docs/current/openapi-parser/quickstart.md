---
sidebar_position: 3
title: "त्वरित शुरुआत"
description: "एक ही कॉल से Swagger 2.0 या OpenAPI 3.x दस्तावेज़ को OpenAPI 3.2 में बदलें।"
---

# त्वरित शुरुआत

## YAML स्ट्रिंग से

```typescript
import { upgradeOasTo32 } from "@powerduck/openapi-parser";
import { readFile } from "node:fs/promises";

const yaml = await readFile("./swagger.yaml", "utf8");
const document = await upgradeOasTo32(yaml);

console.log(document.openapi); // "3.2.0"
```

## JSON स्ट्रिंग से

```typescript
const doc = await upgradeOasTo32('{"openapi":"3.1.0","info":{"title":"API","version":"1.0.0"},"paths":{}}');
```

## पहले से पार्स किए गए ऑब्जेक्ट से

```typescript
const doc = await upgradeOasTo32({
  openapi: "3.0.3",
  info: { title: "API", version: "1.0.0" },
  paths: {},
});
```

## विकल्पों के साथ

```typescript
const document = await upgradeOasTo32(input, {
  validateResult: true,   // validate the upgraded 3.2 document (default: true)
  checkVersion: true,      // assert output declares 3.2.x (default: true)
  maxDepth: 64,            // circular-reference scan depth (default: 64, 0 = disabled)
});
```
