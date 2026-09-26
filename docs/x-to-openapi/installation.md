---
sidebar_position: 2
title: "Installation"
description: "Install @powerduck/x-to-openapi with npm, yarn, or pnpm. ESM-first with a CommonJS fallback; zero-config helpers curlToOpenApi and postmanToOpenApi."
keywords: ["install x-to-openapi", "npm", "yarn", "pnpm", "ESM", "CJS", "curlconverter"]
---

# Installation

Install `@powerduck/x-to-openapi` from your favorite package manager.

## Requirements

- **Node.js:** `>= 18.0.0`
- **TypeScript:** optional — full type definitions ship with the package.

## Install

```bash npm2yarn2pnpm
npm install @powerduck/x-to-openapi
```

```bash
yarn add @powerduck/x-to-openapi
```

```bash
pnpm add @powerduck/x-to-openapi
```

## Dependencies

| Package | Version | Used for |
|---|---|---|
| `@powerduck/openapi-parser` | `^0.3.3` | Canonical OpenAPI types and output validation |
| `curlconverter` | `^4.12.0` | Parsing curl commands into structured requests |

Both are installed automatically.

---

## Module system: ESM-first with CJS fallback

The package is declared as `"type": "module"` and ships both builds from a single entry point:

| Build | Condition | File |
|---|---|---|
| ESM | `import` | `./dist/index.js` |
| CommonJS | `require` | `./dist/index.cjs` |
| Types | — | `./dist/index.d.ts` |

```typescript
// ESM (Node.js, bundlers)
import { curlToOpenApi, postmanToOpenApi } from "@powerduck/x-to-openapi";
```

```javascript
// CommonJS (require)
const { curlToOpenApi, postmanToOpenApi } = require("@powerduck/x-to-openapi");
```

The package has `"sideEffects": false`, so tree-shaking drops unused adapters.

---

## Zero-config helpers

Most users only need two functions. They construct an [`XToOpenApi`](./api-reference.md#xtoopenapi), register the matching adapter, and call `convert`:

```typescript
import {
  curlToOpenApi,    // string | string[]  → OpenAPI 3.2
  postmanToOpenApi, // collection object | JSON string → OpenAPI 3.2
} from "@powerduck/x-to-openapi";
```

Use the full [`XToOpenApi`](./api-reference.md#xtoopenapi) class when you want custom options, multiple adapters, `"auto"` detection, or a custom adapter.

---

## Verifying installation

```bash
# Check the installed version
npm list @powerduck/x-to-openapi

# Verify the package loads and the helpers exist
node -e "const x = require('@powerduck/x-to-openapi'); console.log(typeof x.curlToOpenApi, typeof x.postmanToOpenApi, typeof x.XToOpenApi);"
```

---

## Next steps

- [Quickstart](./quickstart.md) — convert a curl command, a Postman collection, and register a custom adapter.
- [API reference](./api-reference.md) — every export and option.
