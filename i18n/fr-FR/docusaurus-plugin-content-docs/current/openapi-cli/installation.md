---
sidebar_position: 2
title: "Installation"
description: "Installez @powerduck/openapi-cli globalement, comme dépendance de développement ou avec npx. Nécessite Node.js 22.12.0 ou une version ultérieure."
---

# Installation

## Prérequis

- **Node.js** : `>= 22.12.0` (déclaré dans le champ `engines` du paquet).
- Un gestionnaire de paquets : npm, yarn ou pnpm.

Le paquet fournit des versions ESM (`dist/index.js`) et CommonJS (`dist/index.cjs`), accompagnées des déclarations TypeScript (`dist/index.d.ts`). Aucun paquet `@types` supplémentaire n’est nécessaire.

## Installation globale (recommandée pour la CLI)

L’installation globale ajoute l’exécutable `openapi-cli` à votre `PATH` :

```bash npm2yarn2pnpm
npm install -g @powerduck/openapi-cli
```

Vérifiez l’exécutable :

```bash
openapi-cli --help
```

## Installation dans le projet (recommandée pour la CI)

Fixez la version dans le projet pour que la CI utilise une version connue :

```bash npm2yarn2pnpm
npm install --save-dev @powerduck/openapi-cli
```

Lancez ensuite la commande avec le gestionnaire de paquets :

```bash
npx openapi-cli --spec openapi.json
# or
pnpm exec openapi-cli --spec openapi.json
```

## Exécution ponctuelle avec npx

Sans installation préalable :

```bash
npx @powerduck/openapi-cli --spec openapi.json
```

## Structure du paquet

| Entrée | Chemin |
|-------|------|
| Entrée ESM | `dist/index.js` |
| Entrée CommonJS | `dist/index.cjs` |
| Définitions de types | `dist/index.d.ts` |
| Entrée CLI (bin) | `dist/cli.js` |
| Nom de l’exécutable | `openapi-cli` |

Le paquet déclare `"type": "module"` et n’expose que les sous-chemins `.` et `./package.json`.

## Importation dans votre code

```typescript
// ESM
import { runTests, resolveConfig } from "@powerduck/openapi-cli";

// CommonJS
const { runTests, resolveConfig } = require("@powerduck/openapi-cli");
```

## Dépendances d’exécution

Le paquet publié dépend de :

- `@powerduck/openapi-parser` (`^0.3.12`) — déréférencement des `$ref` internes.
- `@powerduck/openapi-request` (`0.2.22`) — exécution des requêtes des protocoles.
- `commander` (`^12.1.0`) — analyse des arguments de la CLI.
- `https-proxy-agent` (`^5.0.1`) — prise en charge des proxys pour le transport HTTP.

## Étapes suivantes

- [Démarrage rapide](/docs/fr-FR/openapi-cli/quickstart/) — exécutez votre première suite de tests.
- [Commandes](/docs/fr-FR/openapi-cli/commands/) — référence complète des options.
