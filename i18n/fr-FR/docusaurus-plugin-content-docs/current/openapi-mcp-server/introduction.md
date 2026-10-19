---
sidebar_position: 1
title: "Présentation"
description: "Convertissez OpenAPI en services MCP : outils, prompts et ressources, console web, stdio, HTTP et CLI openapi-mcp."
keywords: ["openapi-mcp-server", "MCP", "OpenAPI", "stdio", "HTTP"]
---

# @powerduck/openapi-mcp-server — Présentation

`@powerduck/openapi-mcp-server` transforme un document OpenAPI en service MCP (Model Context Protocol) opérationnel. Il génère des **outils** à partir des opérations, des **prompts** à partir des métadonnées et des opérations de l’API, et des **ressources** à partir du catalogue. Il les expose via MCP et intègre une interface web d’administration.

- **Nom du paquet:** `@powerduck/openapi-mcp-server`
- **Version:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-mcp-server"/>
- **Licence:** MIT
- **Version de Node:** `>=22.12.0`
- **Exécutable CLI:** `openapi-mcp`
- **Format des modules:** Distributions ESM et CommonJS avec déclarations de types incluses.

Il s’appuie sur `@powerduck/openapi-parser` pour la validation et le déréférencement, et sur `@modelcontextprotocol/sdk` pour le protocole.

## Éléments générés

- **Tools** — Un outil MCP par opération OpenAPI, avec sérialisation complète des paramètres (styles path/query/header/cookie et règles explode), encodage du corps (JSON, form-urlencoded, multipart, texte, binaire) et annotations MCP (`readOnlyHint`, `destructiveHint`, `idempotentHint`).
- **Prompts** — Des prompts globaux (`spec_overview`, `integration_guardrails`) et propres à chaque opération (`explain_*`, `plan_*`, `sample_*`).
- **Resources** — Des ressources de catalogue fixes, comme `openapi://spec/summary`, `openapi://catalog/tools` et `openapi://spec/document`.

## Transports

- **stdio** — `startStdioServer()` fournit un document à un client MCP local, comme Claude Desktop ou une intégration d’éditeur.
- **HTTP** — `attachMcpRoutes(app, options)` monte Streamable HTTP sur `/mcp` et, en option, l’ancien SSE sur `/sse` dans votre application Express. Ses options contrôlent les limites de sessions, les délais d’inactivité, CORS et la protection contre le DNS rebinding. `startAdminServer()` ajoute l’interface d’administration et utilise les limites de sessions par défaut. `attachSseRoutes()` reste disponible sous forme de wrapper obsolète à arguments positionnels.

## Serveur d’administration

`startAdminServer()` lance une application Express qui fournit :

- la console web : importer ou coller une spécification, examiner les outils, prompts et ressources, consulter les services actifs et les journaux des requêtes ;
- les transports HTTP de MCP ;
- l’authentification par clé API, la journalisation des requêtes avec masquage des en-têtes sensibles et la persistance facultative de l’état.

## Installation

```bash npm2yarn2pnpm
npm install @powerduck/openapi-mcp-server
```

## Démarrage rapide

```bash
openapi-mcp serve --transport web --port 3000 --api-key your-admin-key
```

## Étapes suivantes

- [Installation](../installation/) — npm/yarn/pnpm, installation globale, sous-chemin `./server` et dépendances.
- [Démarrage rapide](../quickstart/) — Utilisation en CLI et depuis le code.
- [Configuration](../configuration/) — Description complète de `ServerConfig`.
- [Référence de l’API](../api-reference/) — Tous les exports et toutes les commandes CLI.
- [Exemples](../examples/) — Cas pratiques.

## Licence

MIT.
