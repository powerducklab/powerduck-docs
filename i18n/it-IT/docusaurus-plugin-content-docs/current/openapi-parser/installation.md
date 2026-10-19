---
sidebar_position: 2
title: "Installazione"
description: "Installa @powerduck/openapi-parser e verifica le build ESM/CJS."
---

# Installazione

```bash npm2yarn2pnpm
npm install @powerduck/openapi-parser
```

Richiede Node.js 22.12.0 o versioni successive.

## Struttura del pacchetto

```
@powerduck/openapi-parser
├── dist/index.js       # ESM build
├── dist/index.cjs      # CJS build (require())
└── dist/index.d.ts     # TypeScript declarations
```

## ESM (Node.js 22.12.0 o successivo, bundler moderni)

```typescript
import { upgradeOasTo32 } from "@powerduck/openapi-parser";
```

## CommonJS (processo principale di Electron)

```javascript
const { upgradeOasTo32 } = require("@powerduck/openapi-parser");
```

## Nessuna dipendenza peer

Questo pacchetto non ha dipendenze peer. `@scalar/openapi-parser` e `@scalar/openapi-upgrader` sono inclusi internamente.
