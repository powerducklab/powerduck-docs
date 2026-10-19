---
sidebar_position: 2
title: "Installation"
description: "Installez @powerduck/x-to-openapi avec npm, yarn ou pnpm. ESM avec compatibilité CommonJS et fonctions curlToOpenApi et postmanToOpenApi sans configuration."
---

# Installation

Installez `@powerduck/x-to-openapi` avec votre gestionnaire de paquets préféré.

## Prérequis

- **Node.js:** `>= 22.12.0`
- **TypeScript :** facultatif ; toutes les définitions de types sont incluses.

## Installation

```bash npm2yarn2pnpm
npm install @powerduck/x-to-openapi
```

```bash
yarn add @powerduck/x-to-openapi
```

```bash
pnpm add @powerduck/x-to-openapi
```

## Dépendances d’exécution

| Paquet | Version | Usage |
|---|---|---|
| `@powerduck/openapi-parser` | `^0.3.12` | Types canoniques OpenAPI et validation de la sortie |
| `curlconverter` | `^4.12.0` | Analyse des commandes curl en requêtes structurées |

Les deux dépendances sont installées automatiquement.

---

## Système de modules : ESM avec compatibilité CJS

Le paquet déclare `"type": "module"` et fournit les deux builds depuis un point d’entrée unique :

| Build | Condition | Fichier |
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

Le paquet déclare `"sideEffects": false`, ce qui permet au tree shaking de supprimer les adaptateurs inutilisés.

---

## Fonctions sans configuration

La plupart des utilisateurs n’ont besoin que de deux fonctions. Elles créent une instance de [`XToOpenApi`](/docs/fr-FR/x-to-openapi/api-reference/#xtoopenapi), enregistrent l’adaptateur correspondant et appellent `convert` :

```typescript
import {
  curlToOpenApi,    // string | string[]  → OpenAPI 3.2
  postmanToOpenApi, // collection object | JSON string → OpenAPI 3.2
} from "@powerduck/x-to-openapi";
```

Utilisez la classe [`XToOpenApi`](/docs/fr-FR/x-to-openapi/api-reference/#xtoopenapi) complète pour des options personnalisées, plusieurs adaptateurs, la détection `"auto"` ou un adaptateur personnalisé.

---

## Vérification

```bash
# Check the installed version
npm list @powerduck/x-to-openapi

# Verify the package loads and the helpers exist
node -e "const x = require('@powerduck/x-to-openapi'); console.log(typeof x.curlToOpenApi, typeof x.postmanToOpenApi, typeof x.XToOpenApi);"
```

---

## Étapes suivantes

- [Démarrage rapide](/docs/fr-FR/x-to-openapi/quickstart/) — convertissez une commande curl et une collection Postman, puis enregistrez un adaptateur personnalisé.
- [Référence de l’API](/docs/fr-FR/x-to-openapi/api-reference/) — tous les exports et toutes les options.
