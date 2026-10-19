---
sidebar_position: 3
title: "Быстрый старт"
description: "Преобразуйте документ Swagger 2.0 или OpenAPI 3.x в OpenAPI 3.2 одним вызовом."
---

# Быстрый старт

## Из строки YAML

```typescript
import { upgradeOasTo32 } from "@powerduck/openapi-parser";
import { readFile } from "node:fs/promises";

const yaml = await readFile("./swagger.yaml", "utf8");
const document = await upgradeOasTo32(yaml);

console.log(document.openapi); // "3.2.0"
```

## Из строки JSON

```typescript
const doc = await upgradeOasTo32('{"openapi":"3.1.0","info":{"title":"API","version":"1.0.0"},"paths":{}}');
```

## Из уже разобранного объекта

```typescript
const doc = await upgradeOasTo32({
  openapi: "3.0.3",
  info: { title: "API", version: "1.0.0" },
  paths: {},
});
```

## С параметрами

```typescript
const document = await upgradeOasTo32(input, {
  validateResult: true,   // validate the upgraded 3.2 document (default: true)
  checkVersion: true,      // assert output declares 3.2.x (default: true)
  maxDepth: 64,            // circular-reference scan depth (default: 64, 0 = disabled)
});
```
