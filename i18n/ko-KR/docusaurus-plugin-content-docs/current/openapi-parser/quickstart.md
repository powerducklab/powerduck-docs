---
sidebar_position: 3
title: "빠른 시작"
description: "한 번의 호출로 Swagger 2.0 또는 OpenAPI 3.x 문서를 OpenAPI 3.2로 업그레이드합니다."
---

# 빠른 시작

## YAML 문자열에서 불러오기

```typescript
import { upgradeOasTo32 } from "@powerduck/openapi-parser";
import { readFile } from "node:fs/promises";

const yaml = await readFile("./swagger.yaml", "utf8");
const document = await upgradeOasTo32(yaml);

console.log(document.openapi); // "3.2.0"
```

## JSON 문자열에서 불러오기

```typescript
const doc = await upgradeOasTo32('{"openapi":"3.1.0","info":{"title":"API","version":"1.0.0"},"paths":{}}');
```

## 파싱된 객체에서 불러오기

```typescript
const doc = await upgradeOasTo32({
  openapi: "3.0.3",
  info: { title: "API", version: "1.0.0" },
  paths: {},
});
```

## 옵션 설정

```typescript
const document = await upgradeOasTo32(input, {
  validateResult: true,   // validate the upgraded 3.2 document (default: true)
  checkVersion: true,      // assert output declares 3.2.x (default: true)
  maxDepth: 64,            // circular-reference scan depth (default: 64, 0 = disabled)
});
```
