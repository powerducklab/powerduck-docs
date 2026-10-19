---
sidebar_position: 5
title: "使用例"
description: "エラー処理、CommonJS での使用方法、実際の変換シナリオを紹介します。"
---

# 使用例

## エラー処理

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

## 検証を無効にする（上級者向け）

```typescript
// Skip output schema validation for faster processing.
// Only do this if you trust the input and don't need the guarantee.
const doc = await upgradeOasTo32(input, {
  validateResult: false,
  checkVersion: false,
});
```

## 循環参照チェックを無効にする

```typescript
// Only safe for inputs you know are acyclic.
const doc = await upgradeOasTo32(input, { maxDepth: 0 });
```
