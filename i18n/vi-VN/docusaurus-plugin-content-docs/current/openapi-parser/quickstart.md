---
sidebar_position: 3
title: "Bắt đầu nhanh"
description: "Chuyển đổi tài liệu Swagger 2.0 hoặc OpenAPI 3.x sang OpenAPI 3.2 chỉ bằng một lần gọi."
---

# Bắt đầu nhanh

## Từ chuỗi YAML

```typescript
import { upgradeOasTo32 } from "@powerduck/openapi-parser";
import { readFile } from "node:fs/promises";

const yaml = await readFile("./swagger.yaml", "utf8");
const document = await upgradeOasTo32(yaml);

console.log(document.openapi); // "3.2.0"
```

## Từ chuỗi JSON

```typescript
const doc = await upgradeOasTo32('{"openapi":"3.1.0","info":{"title":"API","version":"1.0.0"},"paths":{}}');
```

## Từ đối tượng đã được phân tích cú pháp

```typescript
const doc = await upgradeOasTo32({
  openapi: "3.0.3",
  info: { title: "API", version: "1.0.0" },
  paths: {},
});
```

## Sử dụng các tùy chọn

```typescript
const document = await upgradeOasTo32(input, {
  validateResult: true,   // validate the upgraded 3.2 document (default: true)
  checkVersion: true,      // assert output declares 3.2.x (default: true)
  maxDepth: 64,            // circular-reference scan depth (default: 64, 0 = disabled)
});
```
