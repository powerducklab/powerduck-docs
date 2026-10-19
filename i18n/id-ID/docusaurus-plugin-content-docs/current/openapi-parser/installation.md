---
sidebar_position: 2
title: "Instalasi"
description: "Instal @powerduck/openapi-parser dan verifikasi build ESM/CJS."
---

# Instalasi

```bash npm2yarn2pnpm
npm install @powerduck/openapi-parser
```

Memerlukan Node.js 22.12.0 atau yang lebih baru.

## Struktur paket

```
@powerduck/openapi-parser
├── dist/index.js       # ESM build
├── dist/index.cjs      # CJS build (require())
└── dist/index.d.ts     # TypeScript declarations
```

## ESM (Node.js 22.12.0 atau lebih baru, bundler modern)

```typescript
import { upgradeOasTo32 } from "@powerduck/openapi-parser";
```

## CommonJS (proses utama Electron)

```javascript
const { upgradeOasTo32 } = require("@powerduck/openapi-parser");
```

## Tanpa dependensi peer

Paket ini tidak memiliki dependensi peer. `@scalar/openapi-parser` dan `@scalar/openapi-upgrader` disertakan secara internal.
