---
sidebar_position: 5
title: "Exemples"
description: "Exemples pratiques pour @powerduck/openapi-cli, fondés sur les options CLI et l’API réellement disponibles."
---

# Exemples

Exemples pratiques pour `@powerduck/openapi-cli`, fondés sur les options CLI et l’API réellement disponibles.

## 1. Test CLI de base

Indiquez un document OpenAPI local pour exécuter toutes ses opérations :

```bash
openapi-cli --spec openapi.json
```

Remplacez le serveur et écrivez les rapports dans un répertoire personnalisé :

```bash
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --output ./reports
```

Testez une spécification hébergée à une URL distante :

```bash
openapi-cli --spec https://docs.example.com/openapi.json --timeout 60000
```

## 2. Exécution depuis le code avec authentification

Utilisez l’API de la bibliothèque avec un jeton Bearer, des en-têtes personnalisés et un niveau de concurrence :

```typescript
import {
  resolveConfig,
  runTests,
  printCliReport,
  generateJsonReport,
  generateHtmlReport,
} from "@powerduck/openapi-cli";

const config = resolveConfig({
  spec: "./openapi.json",
  server: "https://api.staging.example.com",
  concurrency: 10,
  timeout: 15000,
  bearer: process.env.BEARER_TOKEN,
  header: ["X-Environment: staging", "X-Team: platform"],
});

const report = await runTests(config);

printCliReport(report);
generateJsonReport(report, "./reports");
generateHtmlReport(report, "./reports");

console.log(
  `Passed ${report.summary.passed}/${report.summary.total} (${report.summary.passRate}%)`,
);
```

## 3. Exécution filtrée

Exécutez seulement certaines opérations selon la méthode, les étiquettes, une expression régulière de chemin ou l’operationId :

```bash
# Only GET and POST requests
openapi-cli --spec openapi.json --method get,post

# Only operations tagged "public" or "v2"
openapi-cli --spec openapi.json --tag public,v2

# Only paths under /api/v2
openapi-cli --spec openapi.json --path "^/api/v2"

# Only specific operations
openapi-cli --spec openapi.json --operation-id getUser,createUser
```

Configuration combinant ces filtres dans le code : les catégories de filtres sont combinées par ET, les étiquettes d’une même catégorie par OU.

```typescript
const config = resolveConfig({
  spec: "./openapi.json",
  method: "get,post",
  tag: "public,v2",
  path: "^/api/v2",
  operationId: "getUser,createUser",
});
```

## 4. Génération de rapports JSON et HTML

Choisissez les formats avec `--format`. Par défaut, les trois sont produits :

```bash
# CLI to stdout only, no files
openapi-cli --spec openapi.json --format cli

# JSON + HTML files, no colored stdout report
openapi-cli --spec openapi.json --format json,html --output ./reports
```

Équivalent dans le code :

```typescript
import { resolveConfig, runTests, generateJsonReport, generateHtmlReport } from "@powerduck/openapi-cli";

const config = resolveConfig({
  spec: "./openapi.json",
  format: "json,html",
  output: "./reports",
});

const report = await runTests(config);

const jsonPath = generateJsonReport(report, config.outputDir);
const htmlPath = generateHtmlReport(report, config.outputDir);

console.log("Wrote", jsonPath, "and", htmlPath);
```

`generateJsonReport` écrit `report.json` ; `generateHtmlReport` écrit `report.html`. Les deux créent le répertoire de sortie s’il manque et renvoient le chemin du fichier.

## 5. Assertions déclaratives dans la spécification

Ajoutez un tableau `x-tests` à une opération. Chaque entrée nécessite un `name` et un type `assert` :

```json
{
  "paths": {
    "/users/{id}": {
      "get": {
        "operationId": "getUser",
        "x-tests": [
          { "name": "status is 200", "assert": "status", "value": 200 },
          { "name": "content-type is JSON", "assert": "header", "key": "content-type", "contains": "application/json" },
          { "name": "user id exists", "assert": "jsonPath", "path": "$.id", "exists": true },
          { "name": "user is active", "assert": "jsonPath", "path": "$.status", "equals": "active" },
          { "name": "response under 2s", "assert": "responseTime", "max": 2000 },
          { "name": "body contains email", "assert": "bodyContains", "contains": "@" }
        ],
        "responses": { "200": { "description": "ok" } }
      }
    }
  }
}
```

Types d’assertions :

| `assert` | Champs obligatoires | Rôle |
|----------|-----------------|---------|
| `status` | `value` | Le statut HTTP est égal à `value` |
| `header` | `key` ; `contains` facultatif | L’en-tête existe ; vérifie éventuellement la présence d’une sous-chaîne |
| `bodyContains` | `contains` | Le corps de la réponse contient la sous-chaîne |
| `bodyEquals` | `body` | Le corps de la réponse est strictement égal à `body` |
| `jsonPath` | `path` ; `equals` / `exists` facultatifs | Résoudre un JSONPath, puis comparer la valeur ou vérifier son existence |
| `responseTime` | `max` | La durée doit être `<= max` ms |

## 6. Scripts Postman

Intégrez un script de test de style Postman via `x-postman-scripts` :

```json
{
  "paths": {
    "/users": {
      "get": {
        "operationId": "listUsers",
        "x-postman-scripts": {
          "test": "pm.test('status is 200', () => pm.response.to.have.status(200)); pm.test('users is an array', () => pm.expect(pm.response.json().users).to.be.an('array'));"
        },
        "responses": { "200": { "description": "ok" } }
      }
    }
  }
}
```

Les assertions déclaratives `x-tests` et `x-postman-scripts` peuvent coexister sur une même opération.

## 7. Intégration CI avec GitHub Actions

```yaml
name: API Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - name: Run API tests
        run: npx @powerduck/openapi-cli --spec openapi.json --server "$API_URL" --bearer "$BEARER_TOKEN" --output ./reports
        env:
          API_URL: ${{ secrets.API_URL }}
          BEARER_TOKEN: ${{ secrets.BEARER_TOKEN }}
      - name: Upload reports
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: openapi-cli-reports
          path: ./reports
```

Par défaut, les tests échoués renvoient le code de sortie `1`, et les erreurs de configuration ou d’exécution fatales renvoient `2`, ce qui fait échouer le job CI. Utilisez `--no-fail-on-error` pour qu’une exécution de tests terminée ne fasse pas échouer le pipeline ; cette option ne masque pas les erreurs de configuration ou les erreurs fatales.
