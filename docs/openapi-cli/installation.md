---
sidebar_position: 2
title: Installation
description: "Install @powerduck/openapi-cli globally, as a dev dependency, or with npx. Requires Node.js >= 18.17."
---

# Installation

## Requirements

- **Node.js**: `>= 18.17` (declared in the package `engines` field).
- A package manager: npm, yarn, or pnpm.

The package ships dual ESM (`dist/index.js`) and CommonJS (`dist/index.cjs`)
builds with bundled TypeScript declarations (`dist/index.d.ts`). No extra
`@types` packages are needed.

## Global install (recommended for the CLI)

Installing globally puts the `openapi-cli` binary on your `PATH`:

```bash npm2yarn2pnpm
npm install -g @powerduck/openapi-cli
```

Verify the binary:

```bash
openapi-cli --help
```

## Project-local install (recommended for CI)

Pin the version inside a project so CI uses a known release:

```bash npm2yarn2pnpm
npm install --save-dev @powerduck/openapi-cli
```

Then invoke the binary through your package manager runner:

```bash
npx openapi-cli --spec openapi.json
# or
pnpm exec openapi-cli --spec openapi.json
```

## One-off run with npx

No installation required:

```bash
npx @powerduck/openapi-cli --spec openapi.json
```

## Package layout

| Entry | Path |
|-------|------|
| ESM entry | `dist/index.js` |
| CommonJS entry | `dist/index.cjs` |
| Type definitions | `dist/index.d.ts` |
| CLI entry (bin) | `dist/cli.js` |
| Binary name | `openapi-cli` |

The package declares `"type": "module"` and exposes only the `.` and
`./package.json` subpaths.

## Programmatic import

```typescript
// ESM
import { runTests, resolveConfig } from "@powerduck/openapi-cli";

// CommonJS
const { runTests, resolveConfig } = require("@powerduck/openapi-cli");
```

## Runtime dependencies

The published package depends on:

- `@powerduck/openapi-parser` (`^0.3.3`) — internal `$ref` dereferencing.
- `@powerduck/openapi-request` (`^0.2.2`) — protocol request execution.
- `commander` (`^15.0.0`) — CLI argument parsing.

## Next steps

- [Quick Start](./quickstart) — run your first test suite.
- [Commands](./commands) — the full flag reference.
