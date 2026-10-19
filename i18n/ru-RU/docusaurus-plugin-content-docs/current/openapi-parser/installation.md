---
sidebar_position: 2
title: "Установка"
description: "Установите @powerduck/openapi-parser и проверьте сборки ESM/CJS."
---

# Установка

```bash npm2yarn2pnpm
npm install @powerduck/openapi-parser
```

Требуется Node.js 22.12.0 или новее.

## Структура пакета

```
@powerduck/openapi-parser
├── dist/index.js       # ESM build
├── dist/index.cjs      # CJS build (require())
└── dist/index.d.ts     # TypeScript declarations
```

## ESM (Node.js 22.12.0 и новее, современные сборщики)

```typescript
import { upgradeOasTo32 } from "@powerduck/openapi-parser";
```

## CommonJS (главный процесс Electron)

```javascript
const { upgradeOasTo32 } = require("@powerduck/openapi-parser");
```

## Нет одноранговых зависимостей

У этого пакета нет одноранговых зависимостей. `@scalar/openapi-parser` и `@scalar/openapi-upgrader` включены во внутреннюю сборку.
