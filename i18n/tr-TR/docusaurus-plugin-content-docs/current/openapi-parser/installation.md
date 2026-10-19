---
sidebar_position: 2
title: "Kurulum"
description: "@powerduck/openapi-parser paketini yükleyin ve ESM/CJS derlemelerini doğrulayın."
---

# Kurulum

```bash npm2yarn2pnpm
npm install @powerduck/openapi-parser
```

Node.js 22.12.0 veya üstünü gerektirir.

## Paket yapısı

```
@powerduck/openapi-parser
├── dist/index.js       # ESM build
├── dist/index.cjs      # CJS build (require())
└── dist/index.d.ts     # TypeScript declarations
```

## ESM (Node.js 22.12.0 ve üstü, modern paketleyiciler)

```typescript
import { upgradeOasTo32 } from "@powerduck/openapi-parser";
```

## CommonJS (Electron ana süreci)

```javascript
const { upgradeOasTo32 } = require("@powerduck/openapi-parser");
```

## Eş bağımlılık yok

Bu paketin eş bağımlılığı yoktur. `@scalar/openapi-parser` ve `@scalar/openapi-upgrader` paket içinde yer alır.
