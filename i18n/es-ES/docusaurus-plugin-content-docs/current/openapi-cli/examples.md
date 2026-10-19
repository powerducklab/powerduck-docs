---
sidebar_position: 5
title: "Ejemplos"
description: "Ejemplos prácticos de @powerduck/openapi-cli basados en las opciones CLI y la API disponibles."
---

# Ejemplos

Ejemplos prácticos de `@powerduck/openapi-cli` basados en las opciones CLI y la API disponibles.

## 1. Prueba CLI básica

Indica un documento OpenAPI local para ejecutar todas sus operaciones:

```bash
openapi-cli --spec openapi.json
```

Sustituye el servidor y guarda los informes en un directorio personalizado:

```bash
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --output ./reports
```

Prueba una especificación alojada en una URL remota:

```bash
openapi-cli --spec https://docs.example.com/openapi.json --timeout 60000
```

## 2. Ejecución desde código con autenticación

Usa la API de la biblioteca con un token Bearer, cabeceras personalizadas y concurrencia:

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

## 3. Ejecución de pruebas filtradas

Ejecuta solo algunas operaciones según el método, la etiqueta, una expresión regular de ruta o el operationId:

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

Configuración desde código que combina estos filtros: las categorías se combinan con AND y las etiquetas dentro de una misma categoría con OR.

```typescript
const config = resolveConfig({
  spec: "./openapi.json",
  method: "get,post",
  tag: "public,v2",
  path: "^/api/v2",
  operationId: "getUser,createUser",
});
```

## 4. Generación de informes JSON y HTML

Elige los formatos con `--format`. Por defecto se generan los tres:

```bash
# CLI to stdout only, no files
openapi-cli --spec openapi.json --format cli

# JSON + HTML files, no colored stdout report
openapi-cli --spec openapi.json --format json,html --output ./reports
```

Equivalente desde código:

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

`generateJsonReport` escribe `report.json`; `generateHtmlReport` escribe `report.html`. Ambos crean el directorio de salida si no existe y devuelven la ruta del archivo.

## 5. Aserciones declarativas en la especificación

Añade un array `x-tests` a una operación. Cada entrada necesita un `name` y un tipo `assert`:

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

Tipos de aserción:

| `assert` | Campos obligatorios | Finalidad |
|----------|-----------------|---------|
| `status` | `value` | El estado HTTP es igual a `value` |
| `header` | `key`; `contains` opcional | La cabecera existe; opcionalmente comprueba que contenga una subcadena |
| `bodyContains` | `contains` | El cuerpo de la respuesta contiene la subcadena |
| `bodyEquals` | `body` | El cuerpo de la respuesta es exactamente igual a `body` |
| `jsonPath` | `path`; `equals` / `exists` opcionales | Resolver un JSONPath y comparar el valor o comprobar su existencia |
| `responseTime` | `max` | La duración debe ser `<= max` ms |

## 6. Scripts Postman

Inserta un script de prueba de estilo Postman mediante `x-postman-scripts`:

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

Las aserciones declarativas `x-tests` y `x-postman-scripts` pueden coexistir en la misma operación.

## 7. Integración CI con GitHub Actions

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

Por defecto, las pruebas fallidas devuelven el código de salida `1` y los errores de configuración o de ejecución fatales devuelven `2`, lo que hace fallar el trabajo de CI. Usa `--no-fail-on-error` para que una ejecución de pruebas completada no haga fallar la canalización; esta opción no suprime los errores de configuración ni los errores fatales.
