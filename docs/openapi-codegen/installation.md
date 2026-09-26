---
sidebar_position: 2
title: Installation
description: "Install @powerduck/openapi-codegen with npm, yarn, or pnpm, and use it in Node.js or the browser. Requires Node.js >= 18."
---

# Installation

## Requirements

- **Node.js**: `>= 18.0.0` (declared in the package `engines` field) for Node.js
  usage.
- A **parsed** OpenAPI document as a JavaScript object (not a raw JSON/YAML
  string).
- A modern browser with the Fetch API for browser usage.

The package ships dual ESM (`dist/index.js`) and CommonJS (`dist/index.cjs`)
builds with bundled TypeScript declarations. It has **zero runtime
dependencies**.

## npm

```bash npm2yarn2pnpm
npm install @powerduck/openapi-codegen
```

## pnpm

```bash npm2yarn2pnpm
pnpm add @powerduck/openapi-codegen
```

## Yarn

```bash npm2yarn2pnpm
yarn add @powerduck/openapi-codegen
```

## Node.js usage

```typescript
import { generate } from "@powerduck/openapi-codegen";
```

CommonJS:

```javascript
const { generate } = require("@powerduck/openapi-codegen");
```

The built-in generators are **auto-registered on module import**, so `generate`
works immediately with no explicit setup.

## Browser usage

The library is fully browser-compatible with no Node.js built-ins. Load it
from an ESM CDN and call it directly:

```html
<script type="module">
  import { generate, list } from "https://esm.sh/@powerduck/openapi-codegen";

  const code = generate({
    document,
    path: "/hello",
    method: "get",
    language: "javascript",
    client: "fetch",
  });

  console.log(code);
</script>
```

Bundlers such as Vite, esbuild, and webpack also work out of the box; the ESM
build is tree-shakeable.

## Feeding the document

Pass a parsed object. For JSON:

```typescript
import { readFile } from "node:fs/promises";

const document = JSON.parse(await readFile("./openapi.json", "utf8"));
```

For YAML, parse it first with a separate YAML package:

```typescript
import YAML from "yaml";
const document = YAML.parse(await readFile("./openapi.yaml", "utf8"));
```

## Package layout

| Entry | Path |
|-------|------|
| ESM entry | `dist/index.js` |
| CommonJS entry | `dist/index.cjs` |
| Type definitions | `dist/index.d.ts` |

There is no CLI binary; this is a programmatic-only library.

## Next steps

- [Quick Start](./quickstart.md) — generate your first snippet.
- [Configuration](./configuration.md) — all generation options.
