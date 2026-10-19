---
sidebar_position: 5
title: "Beispiele"
description: "Praxisbeispiele für @powerduck/openapi-cli mit den tatsächlich verfügbaren CLI-Optionen und der Programmierschnittstelle."
---

# Beispiele

Praxisbeispiele für `@powerduck/openapi-cli` mit den tatsächlich verfügbaren CLI-Optionen und der Programmierschnittstelle.

## 1. Einfacher CLI-Test

Geben Sie ein lokales OpenAPI-Dokument an, um sämtliche Operationen auszuführen:

```bash
openapi-cli --spec openapi.json
```

Überschreiben Sie den Server und speichern Sie Berichte in einem eigenen Verzeichnis:

```bash
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --output ./reports
```

Testen Sie eine Spezifikation unter einer entfernten URL:

```bash
openapi-cli --spec https://docs.example.com/openapi.json --timeout 60000
```

## 2. Ausführung im Code mit Authentifizierung

Verwenden Sie die Bibliotheks-API mit Bearer-Token, eigenen Headern und festgelegter Parallelität:

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

## 3. Gefilterter Testlauf

Führen Sie nur ausgewählte Operationen nach Methode, Tag, Pfad-Regulärausdruck oder operationId aus:

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

Konfiguration im Code, die diese Filter kombiniert: Zwischen Filterkategorien gilt UND, zwischen Tags derselben Kategorie ODER.

```typescript
const config = resolveConfig({
  spec: "./openapi.json",
  method: "get,post",
  tag: "public,v2",
  path: "^/api/v2",
  operationId: "getUser,createUser",
});
```

## 4. JSON- und HTML-Berichte erzeugen

Wählen Sie die Ausgabeformate mit `--format`. Standardmäßig werden alle drei erzeugt:

```bash
# CLI to stdout only, no files
openapi-cli --spec openapi.json --format cli

# JSON + HTML files, no colored stdout report
openapi-cli --spec openapi.json --format json,html --output ./reports
```

Entsprechender Programmcode:

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

`generateJsonReport` schreibt `report.json`; `generateHtmlReport` schreibt `report.html`. Beide legen das Ausgabeverzeichnis bei Bedarf an und geben den Dateipfad zurück.

## 5. Deklarative Assertions in der Spezifikation

Fügen Sie einer Operation ein `x-tests`-Array hinzu. Jeder Eintrag benötigt einen `name` und einen `assert`-Typ:

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

Assertion-Typen:

| `assert` | Pflichtfelder | Zweck |
|----------|-----------------|---------|
| `status` | `value` | HTTP-Status entspricht `value` |
| `header` | `key`; optional `contains` | Header ist vorhanden; optional wird eine enthaltene Teilzeichenfolge geprüft |
| `bodyContains` | `contains` | Antwortkörper enthält die Teilzeichenfolge |
| `bodyEquals` | `body` | Antwortkörper entspricht exakt `body` |
| `jsonPath` | `path`; optional `equals` / `exists` | JSONPath auflösen und Wert vergleichen oder Vorhandensein prüfen |
| `responseTime` | `max` | Dauer muss `<= max` ms betragen |

## 6. Postman-Skripte

Binden Sie ein Testskript im Postman-Stil über `x-postman-scripts` ein:

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

Deklarative `x-tests` und `x-postman-scripts` können an derselben Operation verwendet werden.

## 7. CI-Integration mit GitHub Actions

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

Standardmäßig liefern fehlgeschlagene Tests den Exit-Code `1`, Konfigurationsfehler und fatale Laufzeitfehler den Code `2`. Dadurch schlägt der CI-Job fehl. Mit `--no-fail-on-error` führt ein abgeschlossener Testlauf nicht zum Fehlschlag der Pipeline; Konfigurationsfehler und fatale Fehler werden dadurch nicht unterdrückt.
