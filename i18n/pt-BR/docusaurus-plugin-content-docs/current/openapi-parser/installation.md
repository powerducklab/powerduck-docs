---
sidebar_position: 2
title: "Instalação"
description: "Instale @powerduck/openapi-parser e verifique as versões ESM/CJS."
---

# Instalação

```bash npm2yarn2pnpm
npm install @powerduck/openapi-parser
```

Requer Node.js 22.12.0 ou posterior.

## Estrutura do pacote

```
@powerduck/openapi-parser
├── dist/index.js       # ESM build
├── dist/index.cjs      # CJS build (require())
└── dist/index.d.ts     # TypeScript declarations
```

## ESM (Node.js 22.12.0 ou posterior, empacotadores modernos)

```typescript
import { upgradeOasTo32 } from "@powerduck/openapi-parser";
```

## CommonJS (processo principal do Electron)

```javascript
const { upgradeOasTo32 } = require("@powerduck/openapi-parser");
```

## Sem dependências pares

Este pacote não tem dependências pares. `@scalar/openapi-parser` e `@scalar/openapi-upgrader` são incluídos internamente.
