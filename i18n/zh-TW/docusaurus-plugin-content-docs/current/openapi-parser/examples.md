---
sidebar_position: 5
title: "範例"
description: "錯誤處理、CommonJS 用法與實際升級情境。"
---

# 範例

## 錯誤處理

```typescript
import {
  upgradeOasTo32,
  isOpenApiUpgradeError,
  UpgradeErrorCode,
} from "@powerduck/openapi-parser";

try {
  await upgradeOasTo32(input);
} catch (error) {
  if (isOpenApiUpgradeError(error)) {
    switch (error.code) {
      case UpgradeErrorCode.InvalidInput:
        console.error("Bad input:", error.message);
        break;
      case UpgradeErrorCode.CircularReference:
        console.error("Cyclic document detected");
        break;
      default:
        console.error(`Upgrade failed (${error.code}):`, error.message);
    }
  } else {
    throw error;
  }
}
```

## Electron / CommonJS

```javascript
const { upgradeOasTo32 } = require("@powerduck/openapi-parser");

upgradeOasTo32(specContent).then((doc) => {
  console.log(doc.openapi); // "3.2.0"
});
```

## 停用驗證（進階）

```typescript
// Skip output schema validation for faster processing.
// Only do this if you trust the input and don't need the guarantee.
const doc = await upgradeOasTo32(input, {
  validateResult: false,
  checkVersion: false,
});
```

## 停用循環參照檢查

```typescript
// Only safe for inputs you know are acyclic.
const doc = await upgradeOasTo32(input, { maxDepth: 0 });
```
