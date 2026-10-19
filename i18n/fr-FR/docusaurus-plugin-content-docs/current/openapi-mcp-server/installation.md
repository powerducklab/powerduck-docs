---
sidebar_position: 2
title: "Installation"
description: "Installez @powerduck/openapi-mcp-server avec npm, yarn ou pnpm, ou globalement. Inclut la CLI openapi-mcp et le sous-chemin ./server ; nécessite Node.js 22.12.0 ou ultérieur."
---

# Installation

## Prérequis

- **Node.js `>=22.12.0`** (déclaré dans `engines`).

## Installation

```bash npm2yarn2pnpm
npm install @powerduck/openapi-mcp-server
```

Yarn:

```bash
yarn add @powerduck/openapi-mcp-server
```

pnpm:

```bash
pnpm add @powerduck/openapi-mcp-server
```

## CLI

Le paquet enregistre l’exécutable `openapi-mcp`.

```bash
# global install
npm install -g @powerduck/openapi-mcp-server

# or run without installing
npx --package @powerduck/openapi-mcp-server openapi-mcp --help
```

La CLI comporte une seule commande, `serve` (voir [Démarrage rapide](/docs/fr-FR/openapi-mcp-server/quickstart/)).

## ESM / CommonJS

Les deux formats sont fournis avec les déclarations de types. Aucun paquet `@types/*` supplémentaire n’est nécessaire :

```javascript
// ESM
import { buildMcpServer, startStdioServer } from "@powerduck/openapi-mcp-server";

// CommonJS
const { buildMcpServer, startStdioServer } = require("@powerduck/openapi-mcp-server");
```

## Export de sous-chemin

| Import | Contenu |
| --- | --- |
| `@powerduck/openapi-mcp-server` | Bibliothèque principale : chargement des spécifications, génération des outils, prompts et ressources, exécution des requêtes, construction du serveur MCP et transports stdio et HTTP. |
| `@powerduck/openapi-mcp-server/server` | Serveur HTTP d’administration et middleware d’authentification (`startAdminServer`, `createAuthMiddleware`). |

## Dépendances d’exécution

Ces dépendances sont installées automatiquement avec le paquet :

- `@modelcontextprotocol/sdk` — implémentation du protocole MCP.
- `@powerduck/openapi-parser` — validation, déréférencement et mise à niveau d’OpenAPI.
- `express` et `cors` — serveur HTTP d’administration et CORS.
- `axios` — client HTTP vers le serveur cible pour exécuter les outils.
- `commander` — framework de la CLI.
- `js-yaml` — analyse du YAML.
- `multer` — gestion du téléversement des spécifications.
- `terser` — minification des ressources de l’interface web intégrée.

## Vérification

```bash
npx --package @powerduck/openapi-mcp-server openapi-mcp --help
```

## Étapes suivantes

- [Démarrage rapide](/docs/fr-FR/openapi-mcp-server/quickstart/)
- [Configuration](/docs/fr-FR/openapi-mcp-server/configuration/)
