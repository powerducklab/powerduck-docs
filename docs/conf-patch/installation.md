---
sidebar_position: 2
title: "Installation"
description: "Install @powerduck/conf-patch with npm, yarn, or pnpm, and learn the two entry points: the main package (file layer) and the browser-safe ./core subpath."
keywords: ["install conf-patch", "npm", "yarn", "pnpm", "core subpath", "CommonJS", "ESM"]
---

# Installation

Install `@powerduck/conf-patch` from your favorite package manager.

## Requirements

- **Node.js:** `>= 18.0.0`
- **TypeScript:** optional, but full type definitions ship with the package (no `@types/...` needed).

## Install

```bash npm2yarn2pnpm
npm install @powerduck/conf-patch
```

```bash
yarn add @powerduck/conf-patch
```

```bash
pnpm add @powerduck/conf-patch
```

## Dependencies

conf-patch ships three runtime dependencies that are installed automatically:

| Package | Version | Used for |
|---|---|---|
| `@powerduck/openapi-parser` | `^0.3.3` | OpenAPI/Swagger spec validation (`validateOpenAPISpec`, `validateOpenAPIFile`) |
| `jsonc-parser` | `^3.3.1` | Incremental text edits for JSON and JSONC |
| `yaml` | `^2.9.0` | AST parsing and mutation for YAML |

You never need to interact with these directly.

---

## Two entry points

The package exposes **two subpath exports**. Choose the one that matches your environment.

### Main entry — `@powerduck/conf-patch`

Includes the **file layer** (`readConfigFile`, `writeConfigFile`, `patchConfigFile`, `setConfigValue`, `deleteConfigValue`, `withFileLock`, `releaseAllLocalLocks`) plus the core layer and OpenAPI validation. Use this in Node.js and Electron. It depends on `node:fs`, `node:path`, and `node:crypto`.

### Core subpath — `@powerduck/conf-patch/core`

Exports **only the browser-safe core layer** (`patchContent`, `setContentValue`, `deleteContentValue`, the assertion helpers, and the core types). It has zero Node.js dependencies and can be bundled into browsers, Edge Functions, and service workers.

:::tip
When targeting the browser, always import from `@powerduck/conf-patch/core`. This keeps the file layer (and its `node:fs` dependency) out of your bundle. The core entry is around ~9KB gzipped.
:::

---

## Module system: CJS and ESM

The package does **not** set `"type": "module"`, so `.js` files are treated as CommonJS by default. The `exports` map in `package.json` explicitly resolves both `import` and `require` conditions to the correct build.

| Entry | CJS (`require`) | ESM (`import`) | Types |
|---|---|---|---|
| Main | `dist/index.js` | `dist/index.mjs` | `dist/index.d.ts` |
| Core | `dist/core.js` | `dist/core.mjs` | `dist/core.d.ts` |

### CommonJS (Node.js / Electron main process)

```javascript
// Full library (includes file IO)
const { setConfigValue, readConfigFile } = require("@powerduck/conf-patch");

// Core layer only (browser-safe, no fs dependency)
const { patchContent, setContentValue } = require("@powerduck/conf-patch/core");
```

### ES Modules (modern Node.js / browsers / bundlers)

```typescript
// Full library
import { setConfigValue, readConfigFile } from "@powerduck/conf-patch";

// Core layer only (browser-safe)
import { patchContent, setContentValue } from "@powerduck/conf-patch/core";
```

---

## Verifying installation

```bash
# Check the installed version
npm list @powerduck/conf-patch

# Verify the main entry loads
node -e "const lib = require('@powerduck/conf-patch'); console.log('exports:', Object.keys(lib).length);"

# Verify the core subpath loads
node -e "const core = require('@powerduck/conf-patch/core'); console.log('core exports:', Object.keys(core).length);"
```

---

## Next steps

- [Quickstart](./quickstart) — patch a string in the browser and a file on disk.
- [API reference](./api-reference) — every export, type, and option.
