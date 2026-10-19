---
sidebar_position: 3
title: "Démarrage rapide"
description: "Convertissez un document Swagger 2.0 ou OpenAPI 3.x en OpenAPI 3.2 en un seul appel."
---

# Démarrage rapide

## À partir d’une chaîne YAML

```typescript
import { upgradeOasTo32 } from "@powerduck/openapi-parser";
import { readFile } from "node:fs/promises";

const yaml = await readFile("./swagger.yaml", "utf8");
const document = await upgradeOasTo32(yaml);

console.log(document.openapi); // "3.2.0"
```

## À partir d’une chaîne JSON

```typescript
const doc = await upgradeOasTo32('{"openapi":"3.1.0","info":{"title":"API","version":"1.0.0"},"paths":{}}');
```

## À partir d’un objet déjà analysé

```typescript
const doc = await upgradeOasTo32({
  openapi: "3.0.3",
  info: { title: "API", version: "1.0.0" },
  paths: {},
});
```

## Avec des options

```typescript
const document = await upgradeOasTo32(input, {
  validateResult: true,   // validate the upgraded 3.2 document (default: true)
  checkVersion: true,      // assert output declares 3.2.x (default: true)
  maxDepth: 64,            // circular-reference scan depth (default: 64, 0 = disabled)
});
```
