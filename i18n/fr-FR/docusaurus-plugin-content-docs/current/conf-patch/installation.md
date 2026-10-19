---
sidebar_position: 2
title: "Installation"
description: "Installez @powerduck/conf-patch et choisissez entre l’entrée fichiers pour Node.js et le sous-chemin ./core compatible avec les navigateurs."
---

# Installation

Installez `@powerduck/conf-patch` avec le gestionnaire de paquets de votre choix.

## Prérequis

- **Node.js:** `>= 22.12.0`
- **TypeScript :** facultatif ; le paquet inclut toutes les déclarations de types, sans `@types/...` supplémentaire.

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

## Dépendances d’exécution

conf-patch fournit trois dépendances d’exécution, installées automatiquement :

| Paquet | Version | Utilisation |
|---|---|---|
| `@powerduck/openapi-parser` | `^0.3.12` | Validation OpenAPI/Swagger (`validateOpenAPISpec`, `validateOpenAPIFile`). |
| `jsonc-parser` | `^3.3.1` | Modifications incrémentales du texte JSON et JSONC. |
| `yaml` | `^2.9.0` | Analyse et modification de l’AST YAML. |

Vous n’avez pas besoin de les utiliser directement.

## Deux points d’entrée

Le paquet expose **deux exports de sous-chemins**. Choisissez celui adapté à votre environnement.

### Entrée principale — `@powerduck/conf-patch`

Inclut la **couche fichiers** (`readConfigFile`, `writeConfigFile`, `patchConfigFile`, `setConfigValue`, `deleteConfigValue`, `withFileLock`, `releaseAllLocalLocks`), le noyau et la validation OpenAPI. Utilisez-la dans Node.js et Electron. Elle dépend de `node:fs`, `node:path` et `node:crypto`.

### Sous-chemin du noyau — `@powerduck/conf-patch/core`

Exporte **uniquement le noyau compatible navigateur** : `patchContent`, `setContentValue`, `deleteContentValue`, les utilitaires d’assertion et les types du noyau. Sans dépendance Node.js, il peut être intégré aux navigateurs, Edge Functions et service workers.

:::tip
Pour le navigateur, importez toujours depuis `@powerduck/conf-patch/core`. Cela exclut du bundle la couche fichiers et sa dépendance à `node:fs`.
:::

## Système de modules : CJS et ESM

Le paquet **ne définit pas** `"type": "module"` : les fichiers `.js` sont donc traités comme CommonJS par défaut. La table `exports` de `package.json` associe explicitement `import` et `require` à la bonne version.

| Entrée | CJS (`require`) | ESM (`import`) | Types |
|---|---|---|---|
| Entrée principale | `dist/index.js` | `dist/index.mjs` | `dist/index.d.ts` |
| Sous-chemin du noyau | `dist/core.js` | `dist/core.mjs` | `dist/core.d.ts` |

### CommonJS (Node.js ou processus principal Electron)

```javascript
// Full library (includes file IO)
const { setConfigValue, readConfigFile } = require("@powerduck/conf-patch");

// Core layer only (browser-safe, no fs dependency)
const { patchContent, setContentValue } = require("@powerduck/conf-patch/core");
```

### ES Modules (Node.js moderne, navigateurs et outils de bundling)

```typescript
// Full library
import { setConfigValue, readConfigFile } from "@powerduck/conf-patch";

// Core layer only (browser-safe)
import { patchContent, setContentValue } from "@powerduck/conf-patch/core";
```

## Vérifier l’installation

```bash
# Check the installed version
npm list @powerduck/conf-patch

# Verify the main entry loads
node -e "const lib = require('@powerduck/conf-patch'); console.log('exports:', Object.keys(lib).length);"

# Verify the core subpath loads
node -e "const core = require('@powerduck/conf-patch/core'); console.log('core exports:', Object.keys(core).length);"
```

## Pour aller plus loin

- [Démarrage rapide](/docs/fr-FR/conf-patch/quickstart/) — modifiez une chaîne dans le navigateur et un fichier sur disque.
- [Référence de l’API](/docs/fr-FR/conf-patch/api-reference/) — tous les exports, types et options.
