---
sidebar_position: 5
title: "Esempi"
description: "Esempi pratici di @powerduck/openapi-cli basati sulle opzioni CLI e sull’API effettivamente disponibili."
---

# Esempi

Esempi pratici di `@powerduck/openapi-cli` basati sulle opzioni CLI e sull’API effettivamente disponibili.

## 1. Test CLI di base

Indica un documento OpenAPI locale per eseguire tutte le operazioni:

```bash
openapi-cli --spec openapi.json
```

Sostituisci il server e salva i report in una directory personalizzata:

```bash
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --output ./reports
```

Verifica una specifica ospitata a un URL remoto:

```bash
openapi-cli --spec https://docs.example.com/openapi.json --timeout 60000
```

## 2. Esecuzione dal codice con autenticazione

Usa l’API della libreria con un token Bearer, intestazioni personalizzate e concorrenza:

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

## 3. Esecuzione filtrata dei test

Esegui solo alcune operazioni per metodo, tag, espressione regolare del percorso o operationId:

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

Configurazione nel codice che combina questi filtri: le diverse categorie sono combinate con AND, i tag della stessa categoria con OR.

```typescript
const config = resolveConfig({
  spec: "./openapi.json",
  method: "get,post",
  tag: "public,v2",
  path: "^/api/v2",
  operationId: "getUser,createUser",
});
```

## 4. Generazione di report JSON e HTML

Scegli i formati con `--format`. Per impostazione predefinita vengono prodotti tutti e tre:

```bash
# CLI to stdout only, no files
openapi-cli --spec openapi.json --format cli

# JSON + HTML files, no colored stdout report
openapi-cli --spec openapi.json --format json,html --output ./reports
```

Equivalente nel codice:

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

`generateJsonReport` scrive `report.json`; `generateHtmlReport` scrive `report.html`. Entrambi creano la directory di destinazione se manca e restituiscono il percorso del file.

## 5. Asserzioni dichiarative nella specifica

Aggiungi un array `x-tests` a un’operazione. Ogni voce richiede un `name` e un tipo `assert`:

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

Tipi di asserzione:

| `assert` | Campi obbligatori | Scopo |
|----------|-----------------|---------|
| `status` | `value` | Lo stato HTTP è uguale a `value` |
| `header` | `key`; `contains` facoltativo | L’intestazione esiste; facoltativamente verifica la presenza di una sottostringa |
| `bodyContains` | `contains` | Il corpo della risposta contiene la sottostringa |
| `bodyEquals` | `body` | Il corpo della risposta è esattamente uguale a `body` |
| `jsonPath` | `path`; `equals` / `exists` facoltativi | Risolvere un JSONPath e confrontare il valore o verificarne l’esistenza |
| `responseTime` | `max` | La durata deve essere `<= max` ms |

## 6. Script Postman

Incorpora uno script di test in stile Postman tramite `x-postman-scripts`:

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

Le asserzioni dichiarative `x-tests` e `x-postman-scripts` possono coesistere sulla stessa operazione.

## 7. Integrazione CI con GitHub Actions

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

Per impostazione predefinita, i test non superati restituiscono il codice di uscita `1`, mentre gli errori di configurazione o gli errori fatali di esecuzione restituiscono `2`, causando il fallimento del job CI. Usa `--no-fail-on-error` per evitare che un’esecuzione di test completata faccia fallire la pipeline; l’opzione non sopprime gli errori di configurazione o quelli fatali.
