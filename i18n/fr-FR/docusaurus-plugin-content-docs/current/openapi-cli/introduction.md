---
sidebar_position: 1
title: "Introduction"
description: "@powerduck/openapi-cli est un outil en ligne de commande qui teste par lots un document OpenAPI 3.2 contre un serveur réel. Indiquez un fichier de spécification ou une URL : il exécute les opérations du document, vérifie chaque réponse à l’aide d’assertions et produit trois formats de rapport."
---

# Introduction

`@powerduck/openapi-cli` est un outil en ligne de commande qui teste par lots un document OpenAPI 3.2 contre un serveur réel. Indiquez un fichier de spécification ou une URL : il exécute les opérations du document, vérifie chaque réponse à l’aide d’assertions et produit trois formats de rapport.

Il s’appuie sur [`@powerduck/openapi-request`](https://www.npmjs.com/package/@powerduck/openapi-request) pour exécuter les requêtes et sur [`@powerduck/openapi-parser`](https://www.npmjs.com/package/@powerduck/openapi-parser) pour résoudre les références `$ref`.

## Pourquoi choisir openapi-cli

- **Prêt pour la CI** — par défaut, un code de sortie non nul signale un échec de test ou une erreur d’exécution. L’outil s’intègre donc directement à GitHub Actions, GitLab CI ou tout autre pipeline.
- **Plusieurs protocoles intégrés** — une même spécification peut décrire des opérations HTTP, SSE, WebSocket, GraphQL, gRPC et MCP, toutes gérées par le même exécuteur.
- **Deux styles d’assertions** — tableaux déclaratifs `x-tests` pour les vérifications simples, scripts de style Postman avec `pm.test()` / `pm.expect()` pour les cas complexes.
- **Trois formats de rapport** — JSON exploitable par des machines, sortie CLI colorée et lisible, et rapport HTML interactif autonome.
- **Spécifications locales ou distantes** — chargement depuis un chemin de fichier ou une URL `http(s)://`, avec suivi des redirections et délai d’expiration.
- **Filtrage souple** — sélection des opérations par méthode, chemin, étiquette ou operationId, avec concurrence limitée.

## Protocoles pris en charge

L’exécuteur détermine le protocole de chaque opération à partir des extensions OpenAPI ou des types de contenu des réponses :

| Protocole | Identifiant | Mode de sélection |
|----------|-----------|--------------------|
| HTTP | `http` | Valeur par défaut des opérations standard |
| Événements envoyés par le serveur | `sse` | Type de contenu de réponse `text/event-stream` ou `x-response-stream: true` |
| WebSocket | `websocket` | `x-protocol: "websocket"` |
| GraphQL | `graphql` | `x-protocol: "graphql"` |
| gRPC | `grpc` | `x-protocol: "grpc"` |
| MCP | `mcp` | `x-protocol: "mcp"` |

Le protocole peut également être imposé par l’extension `x-protocol` sur l’opération ou l’élément de chemin.

## Rapports

À la fin d’une exécution, l’outil produit les sorties suivantes, avec les fichiers dans `./openapi-cli-report` par défaut :

- `report.json` — l’objet `TestReport` complet au format JSON indenté.
- `report.html` — un rapport HTML autonome, sans dépendances, avec bandeau récapitulatif, barre de progression, boutons de filtre et lignes de test dépliables.
- Sortie standard — un résumé CLI coloré avec barre de progression et assertions de chaque test.

## Utilisation dans du code

Le même pipeline est disponible sous forme de bibliothèque. Résolvez la configuration, exécutez les tests, puis choisissez les générateurs de rapport souhaités :

```ts
import { resolveConfig, runTests, printCliReport, generateJsonReport } from "@powerduck/openapi-cli";

const config = resolveConfig({ spec: "./openapi.json" });
const report = await runTests(config);
printCliReport(report);
generateJsonReport(report, "./reports");
```

## Pour aller plus loin

- [Installation](./installation.md) — installation globale ou comme dépendance de développement.
- [Démarrage rapide](./quickstart.md) — exécuter votre première suite de tests.
- [Configuration](./configuration.md) — référence complète de `CliConfig`.
- [Commandes](./commands.md) — toutes les options CLI et tous les codes de sortie.
- [Référence API](./api-reference.md) — toutes les fonctions et tous les types exportés.
- [Exemples](./examples.md) — exemples prêts à l’emploi.
