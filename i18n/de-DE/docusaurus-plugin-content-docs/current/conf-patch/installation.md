---
sidebar_position: 2
title: "Installation"
description: "Installiere @powerduck/conf-patch und wähle zwischen dem Dateieinstieg für Node.js und dem browsergeeigneten Unterpfad ./core."
---

# Installation

Installiere `@powerduck/conf-patch` mit deinem bevorzugten Paketmanager.

## Voraussetzungen

- **Node.js:** `>= 22.12.0`
- **TypeScript:** optional; vollständige Typdeklarationen sind enthalten, zusätzliche `@types/...`-Pakete sind nicht nötig.

## Installation

```bash npm2yarn2pnpm
npm install @powerduck/conf-patch
```

```bash
yarn add @powerduck/conf-patch
```

```bash
pnpm add @powerduck/conf-patch
```

## Laufzeitabhängigkeiten

conf-patch enthält drei Laufzeitabhängigkeiten, die automatisch installiert werden:

| Paket | Version | Verwendung |
|---|---|---|
| `@powerduck/openapi-parser` | `^0.3.12` | OpenAPI-/Swagger-Validierung (`validateOpenAPISpec`, `validateOpenAPIFile`). |
| `jsonc-parser` | `^3.3.1` | Inkrementelle Textänderungen für JSON und JSONC. |
| `yaml` | `^2.9.0` | Parsen und Ändern des YAML-AST. |

Du musst diese Abhängigkeiten nicht direkt verwenden.

## Zwei Einstiegspunkte

Das Paket bietet **zwei Unterpfad-Exporte**. Wähle passend zu deiner Umgebung.

### Haupteinstieg — `@powerduck/conf-patch`

Enthält die **Dateischicht** (`readConfigFile`, `writeConfigFile`, `patchConfigFile`, `setConfigValue`, `deleteConfigValue`, `withFileLock`, `releaseAllLocalLocks`), den Kern und die OpenAPI-Validierung. Für Node.js und Electron; abhängig von `node:fs`, `node:path` und `node:crypto`.

### Kern-Unterpfad — `@powerduck/conf-patch/core`

Exportiert **nur den browsergeeigneten Kern**: `patchContent`, `setContentValue`, `deleteContentValue`, Assertion-Helfer und Kerntypen. Ohne Node.js-Abhängigkeiten lässt er sich für Browser, Edge Functions und Service Worker bündeln.

:::tip
Importiere für den Browser immer aus `@powerduck/conf-patch/core`. Dadurch bleiben die Dateischicht und ihre Abhängigkeit `node:fs` aus dem Bundle.
:::

## Modulsystem: CJS und ESM

Das Paket setzt **kein** `"type": "module"`; `.js`-Dateien gelten standardmäßig als CommonJS. Die `exports`-Zuordnung in `package.json` verweist für `import` und `require` ausdrücklich auf den passenden Build.

| Einstieg | CJS (`require`) | ESM (`import`) | Typen |
|---|---|---|---|
| Haupteinstieg | `dist/index.js` | `dist/index.mjs` | `dist/index.d.ts` |
| Kern-Unterpfad | `dist/core.js` | `dist/core.mjs` | `dist/core.d.ts` |

### CommonJS (Node.js oder Electron-Hauptprozess)

```javascript
// Full library (includes file IO)
const { setConfigValue, readConfigFile } = require("@powerduck/conf-patch");

// Core layer only (browser-safe, no fs dependency)
const { patchContent, setContentValue } = require("@powerduck/conf-patch/core");
```

### ES Modules (modernes Node.js, Browser und Bundler)

```typescript
// Full library
import { setConfigValue, readConfigFile } from "@powerduck/conf-patch";

// Core layer only (browser-safe)
import { patchContent, setContentValue } from "@powerduck/conf-patch/core";
```

## Installation prüfen

```bash
# Check the installed version
npm list @powerduck/conf-patch

# Verify the main entry loads
node -e "const lib = require('@powerduck/conf-patch'); console.log('exports:', Object.keys(lib).length);"

# Verify the core subpath loads
node -e "const core = require('@powerduck/conf-patch/core'); console.log('core exports:', Object.keys(core).length);"
```

## Nächste Schritte

- [Schnellstart](/docs/de-DE/conf-patch/quickstart/) — ändere einen String im Browser und eine Datei auf dem Datenträger.
- [API-Referenz](/docs/de-DE/conf-patch/api-reference/) — alle Exporte, Typen und Optionen.
