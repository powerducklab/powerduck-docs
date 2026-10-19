---
sidebar_position: 2
title: "Instalación"
description: "Instala @powerduck/openapi-parser y comprueba las versiones ESM/CJS."
---

# Instalación

```bash npm2yarn2pnpm
npm install @powerduck/openapi-parser
```

Requiere Node.js 22.12.0 o posterior.

## Estructura del paquete

```
@powerduck/openapi-parser
├── dist/index.js       # ESM build
├── dist/index.cjs      # CJS build (require())
└── dist/index.d.ts     # TypeScript declarations
```

## ESM (Node.js 22.12.0 o posterior, empaquetadores modernos)

```typescript
import { upgradeOasTo32 } from "@powerduck/openapi-parser";
```

## CommonJS (proceso principal de Electron)

```javascript
const { upgradeOasTo32 } = require("@powerduck/openapi-parser");
```

## Sin dependencias de pares

Este paquete no tiene dependencias de pares. `@scalar/openapi-parser` y `@scalar/openapi-upgrader` están incluidos internamente.
