---
sidebar_position: 2
title: "Installazione"
description: "Installa @powerduck/conf-patch e scegli tra la voce per file in Node.js e il sottopercorso ./core compatibile con il browser."
---

# Installazione

Installa `@powerduck/conf-patch` con il gestore di pacchetti che preferisci.

## Requisiti

- **Node.js:** `>= 22.12.0`
- **TypeScript:** facoltativo; il pacchetto include tutte le dichiarazioni dei tipi, senza richiedere `@types/...`.

## Installazione

```bash npm2yarn2pnpm
npm install @powerduck/conf-patch
```

```bash
yarn add @powerduck/conf-patch
```

```bash
pnpm add @powerduck/conf-patch
```

## Dipendenze di runtime

conf-patch include tre dipendenze di runtime, installate automaticamente:

| Pacchetto | Versione | Uso |
|---|---|---|
| `@powerduck/openapi-parser` | `^0.3.12` | Validazione OpenAPI/Swagger (`validateOpenAPISpec`, `validateOpenAPIFile`). |
| `jsonc-parser` | `^3.3.1` | Modifiche incrementali al testo JSON e JSONC. |
| `yaml` | `^2.9.0` | Analisi e modifica dell’AST YAML. |

Non devi usare direttamente queste dipendenze.

## Due punti di ingresso

Il pacchetto espone **due esportazioni di sottopercorsi**. Scegli quella adatta all’ambiente.

### Voce principale — `@powerduck/conf-patch`

Include il **livello file** (`readConfigFile`, `writeConfigFile`, `patchConfigFile`, `setConfigValue`, `deleteConfigValue`, `withFileLock`, `releaseAllLocalLocks`), il nucleo e la validazione OpenAPI. Usala in Node.js ed Electron. Dipende da `node:fs`, `node:path` e `node:crypto`.

### Sottopercorso del nucleo — `@powerduck/conf-patch/core`

Esporta **solo il nucleo compatibile con il browser**: `patchContent`, `setContentValue`, `deleteContentValue`, helper di asserzione e tipi del nucleo. Non dipende da Node.js e può essere incluso nei bundle per browser, Edge Functions e service worker.

:::tip
Per il browser, importa sempre da `@powerduck/conf-patch/core`. In questo modo il livello file e la dipendenza `node:fs` restano fuori dal bundle.
:::

## Sistema di moduli: CJS ed ESM

Il pacchetto **non** imposta `"type": "module"`, quindi i file `.js` sono trattati come CommonJS. La mappa `exports` in `package.json` indirizza esplicitamente `import` e `require` alla build corretta.

| Voce | CJS (`require`) | ESM (`import`) | Tipi |
|---|---|---|---|
| Voce principale | `dist/index.js` | `dist/index.mjs` | `dist/index.d.ts` |
| Sottopercorso del nucleo | `dist/core.js` | `dist/core.mjs` | `dist/core.d.ts` |

### CommonJS (Node.js o processo principale di Electron)

```javascript
// Full library (includes file IO)
const { setConfigValue, readConfigFile } = require("@powerduck/conf-patch");

// Core layer only (browser-safe, no fs dependency)
const { patchContent, setContentValue } = require("@powerduck/conf-patch/core");
```

### ES Modules (Node.js moderno, browser e bundler)

```typescript
// Full library
import { setConfigValue, readConfigFile } from "@powerduck/conf-patch";

// Core layer only (browser-safe)
import { patchContent, setContentValue } from "@powerduck/conf-patch/core";
```

## Verificare l’installazione

```bash
# Check the installed version
npm list @powerduck/conf-patch

# Verify the main entry loads
node -e "const lib = require('@powerduck/conf-patch'); console.log('exports:', Object.keys(lib).length);"

# Verify the core subpath loads
node -e "const core = require('@powerduck/conf-patch/core'); console.log('core exports:', Object.keys(core).length);"
```

## Passaggi successivi

- [Guida rapida](/docs/it-IT/conf-patch/quickstart/) — modifica una stringa nel browser e un file sul disco.
- [Riferimento API](/docs/it-IT/conf-patch/api-reference/) — tutte le esportazioni, i tipi e le opzioni.
