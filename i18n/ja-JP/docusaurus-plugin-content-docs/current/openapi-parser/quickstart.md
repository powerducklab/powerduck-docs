---
sidebar_position: 3
title: "クイックスタート"
description: "1 回の呼び出しで Swagger 2.0 または OpenAPI 3.x のドキュメントを OpenAPI 3.2 に変換します。"
---

# クイックスタート

## YAML 文字列から読み込む

```typescript
import { upgradeOasTo32 } from "@powerduck/openapi-parser";
import { readFile } from "node:fs/promises";

const yaml = await readFile("./swagger.yaml", "utf8");
const document = await upgradeOasTo32(yaml);

console.log(document.openapi); // "3.2.0"
```

## JSON 文字列から読み込む

```typescript
const doc = await upgradeOasTo32('{"openapi":"3.1.0","info":{"title":"API","version":"1.0.0"},"paths":{}}');
```

## 解析済みのオブジェクトから読み込む

```typescript
const doc = await upgradeOasTo32({
  openapi: "3.0.3",
  info: { title: "API", version: "1.0.0" },
  paths: {},
});
```

## オプションを指定する

```typescript
const document = await upgradeOasTo32(input, {
  validateResult: true,   // validate the upgraded 3.2 document (default: true)
  checkVersion: true,      // assert output declares 3.2.x (default: true)
  maxDepth: 64,            // circular-reference scan depth (default: 64, 0 = disabled)
});
```
