---
sidebar_position: 5
title: "Ví dụ"
description: "Xử lý lỗi, sử dụng CommonJS và các ví dụ chuyển đổi thực tế."
---

# Ví dụ

## Xử lý lỗi

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

## Tắt kiểm tra tính hợp lệ (nâng cao)

```typescript
// Skip output schema validation for faster processing.
// Only do this if you trust the input and don't need the guarantee.
const doc = await upgradeOasTo32(input, {
  validateResult: false,
  checkVersion: false,
});
```

## Tắt kiểm tra tham chiếu vòng

```typescript
// Only safe for inputs you know are acyclic.
const doc = await upgradeOasTo32(input, { maxDepth: 0 });
```
