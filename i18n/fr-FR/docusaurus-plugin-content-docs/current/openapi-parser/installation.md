---
sidebar_position: 2
title: "Installation"
description: "Installez @powerduck/openapi-parser et vérifiez les versions ESM/CJS."
---

# Installation

```bash npm2yarn2pnpm
npm install @powerduck/openapi-parser
```

Nécessite Node.js 22.12.0 ou une version ultérieure.

## Structure du paquet

```
@powerduck/openapi-parser
├── dist/index.js       # ESM build
├── dist/index.cjs      # CJS build (require())
└── dist/index.d.ts     # TypeScript declarations
```

## ESM (Node.js 22.12.0 ou ultérieur, outils de bundling modernes)

```typescript
import { upgradeOasTo32 } from "@powerduck/openapi-parser";
```

## CommonJS (processus principal d’Electron)

```javascript
const { upgradeOasTo32 } = require("@powerduck/openapi-parser");
```

## Aucune dépendance homologue

Ce paquet n’a aucune dépendance homologue. `@scalar/openapi-parser` et `@scalar/openapi-upgrader` sont intégrés au paquet.
