---
sidebar_position: 2
title: "Installation"
description: "Installieren Sie @powerduck/openapi-parser und prüfen Sie die ESM/CJS-Builds."
---

# Installation

```bash npm2yarn2pnpm
npm install @powerduck/openapi-parser
```

Erfordert Node.js 22.12.0 oder neuer.

## Paketstruktur

```
@powerduck/openapi-parser
├── dist/index.js       # ESM build
├── dist/index.cjs      # CJS build (require())
└── dist/index.d.ts     # TypeScript declarations
```

## ESM (Node.js 22.12.0 oder neuer, moderne Bundler)

```typescript
import { upgradeOasTo32 } from "@powerduck/openapi-parser";
```

## CommonJS (Electron-Hauptprozess)

```javascript
const { upgradeOasTo32 } = require("@powerduck/openapi-parser");
```

## Keine Peer-Abhängigkeiten

Dieses Paket hat keine Peer-Abhängigkeiten. `@scalar/openapi-parser` und `@scalar/openapi-upgrader` sind intern eingebunden.
