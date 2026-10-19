---
sidebar_position: 3
title: "Démarrage rapide"
description: "Lancez votre première série de tests avec @powerduck/openapi-cli depuis la CLI et depuis Node.js."
---

# Démarrage rapide

Ce guide vous accompagne dans les premiers tests d’un document OpenAPI.

## Prérequis

- Node.js `>= 22.12.0`.
- Un document OpenAPI 3.2 en **JSON**. YAML n’est pas accepté : convertissez-le d’abord en JSON. Le document doit contenir un objet `paths` à la racine.

## 1. Exécuter depuis la CLI

L’exécution la plus simple charge une spécification locale et teste toutes les opérations sur la première URL de serveur déclarée :

```bash
openapi-cli --spec openapi.json
```

Remplacez le serveur cible et écrivez les rapports dans un répertoire personnalisé :

```bash
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --output ./reports
```

Testez une spécification distante, uniquement avec les opérations `GET`, en utilisant 10 workers simultanés :

```bash
openapi-cli --spec https://docs.example.com/openapi.json \
  --method get \
  --concurrency 10
```

Pour les configurations complexes, utilisez un fichier de configuration JSON :

```bash
openapi-cli --config openapi-cli.config.json
```

Consultez toutes les options dans [Commandes](/docs/fr-FR/openapi-cli/commands/).

## 2. Créer une spécification minimale

Un document OpenAPI minimal avec des assertions déclaratives :

```json
{
  "openapi": "3.2.0",
  "info": { "title": "Demo API", "version": "1.0.0" },
  "servers": [{ "url": "https://httpbin.org" }],
  "paths": {
    "/get": {
      "get": {
        "operationId": "getGet",
        "responses": { "200": { "description": "ok" } },
        "x-tests": [
          { "name": "status is 200", "assert": "status", "value": 200 },
          { "name": "response under 5s", "assert": "responseTime", "max": 5000 }
        ]
      }
    }
  }
}
```

Si une opération ne définit **aucune** assertion, le moteur ajoute un contrôle implicite de réussite du protocole. Pour HTTP, il exige un statut `2xx`, afin que les réponses 4xx/5xx ne soient pas considérées comme réussies sans avertissement.

## 3. Exécuter depuis Node.js (API programmatique)

La bibliothèque expose le même traitement sous forme de fonctions : `resolveConfig` → `runTests` → générateurs de rapports.

```typescript
import {
  resolveConfig,
  runTests,
  printCliReport,
  generateJsonReport,
  generateHtmlReport,
} from "@powerduck/openapi-cli";

// 1. Build a CliConfig from CLI-style args.
const config = resolveConfig({
  spec: "./openapi.json",
  server: "https://api.staging.example.com",
  concurrency: 10,
});

// 2. Run all collected tests.
const report = await runTests(config);

// 3. Emit the reports you need.
printCliReport(report);
generateJsonReport(report, "./reports");
generateHtmlReport(report, "./reports");

// 4. Exit with the correct code for CI.
if (report.summary.failed > 0 || report.summary.errors > 0) {
  process.exit(1);
}
```

`resolveConfig` accepte la même structure d’options que la CLI. `runTests` renvoie un `TestReport` contenant `summary`, `results`, `config`, `generatedAt` et `version`. [Configuration](/docs/fr-FR/openapi-cli/configuration/).

## 4. Codes de sortie pour la CI

| Code | Signification |
|---|---|
| `0` | Tous les tests ont réussi, ou `--no-fail-on-error` est activé. |
| `1` | Au moins un test a échoué ou rencontré une erreur. |
| `2` | Erreur de configuration, de chargement de la spécification ou erreur fatale d’exécution. |

## Pour aller plus loin

- [Configuration](/docs/fr-FR/openapi-cli/configuration/) — tous les champs de `CliConfig` et leurs valeurs par défaut.
- [Commandes](/docs/fr-FR/openapi-cli/commands/) — toutes les options de la CLI.
- [Exemples](/docs/fr-FR/openapi-cli/examples/) — authentification, filtrage, rapports et assertions.
- [Référence de l’API](/docs/fr-FR/openapi-cli/api-reference/) — toutes les fonctions et tous les types exportés.
