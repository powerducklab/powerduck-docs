---
sidebar_position: 2
title: "Installation"
description: "Install @powerduck/openapi-parser and verify the ESM/CJS build."
---

# Installation

```bash npm2yarn2pnpm
npm install @powerduck/openapi-parser
```

Requires Node.js 18 or later.

## Package layout

```
@powerduck/openapi-parser
├── dist/index.js       # ESM build
├── dist/index.cjs      # CJS build (require())
└── dist/index.d.ts     # TypeScript declarations
```

## ESM (Node.js 18+, modern bundlers)

```typescript
import { upgradeOasTo32 } from "@powerduck/openapi-parser";
```

## CommonJS (Electron main, legacy Node)

```javascript
const { upgradeOasTo32 } = require("@powerduck/openapi-parser");
```

## No peer dependencies

This package has zero peer dependencies. `@scalar/openapi-parser` and
`@scalar/openapi-upgrader` are bundled internally.
