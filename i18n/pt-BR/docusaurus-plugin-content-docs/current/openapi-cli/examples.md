---
sidebar_position: 5
title: "Exemplos"
description: "Exemplos práticos de @powerduck/openapi-cli com as opções CLI e a API disponíveis."
---

# Exemplos

Exemplos práticos de `@powerduck/openapi-cli` com as opções CLI e a API disponíveis.

## 1. Teste CLI básico

Indique um documento OpenAPI local para executar todas as operações:

```bash
openapi-cli --spec openapi.json
```

Substitua o servidor e grave os relatórios em um diretório personalizado:

```bash
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --output ./reports
```

Teste uma especificação hospedada em uma URL remota:

```bash
openapi-cli --spec https://docs.example.com/openapi.json --timeout 60000
```

## 2. Execução no código com autenticação

Use a API da biblioteca com um token Bearer, cabeçalhos personalizados e concorrência:

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

## 3. Execução de testes filtrados

Execute apenas algumas operações por método, tag, expressão regular de caminho ou operationId:

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

Configuração no código combinando esses filtros: categorias diferentes usam AND; tags dentro da mesma categoria usam OR.

```typescript
const config = resolveConfig({
  spec: "./openapi.json",
  method: "get,post",
  tag: "public,v2",
  path: "^/api/v2",
  operationId: "getUser,createUser",
});
```

## 4. Geração de relatórios JSON e HTML

Escolha os formatos com `--format`. Por padrão, os três são gerados:

```bash
# CLI to stdout only, no files
openapi-cli --spec openapi.json --format cli

# JSON + HTML files, no colored stdout report
openapi-cli --spec openapi.json --format json,html --output ./reports
```

Equivalente no código:

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

`generateJsonReport` grava `report.json`; `generateHtmlReport` grava `report.html`. Ambos criam o diretório de saída se necessário e retornam o caminho do arquivo.

## 5. Asserções declarativas na especificação

Adicione um array `x-tests` a uma operação. Cada entrada precisa de um `name` e de um tipo `assert`:

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

Tipos de asserção:

| `assert` | Campos obrigatórios | Finalidade |
|----------|-----------------|---------|
| `status` | `value` | O status HTTP é igual a `value` |
| `header` | `key`; `contains` opcional | O cabeçalho existe; opcionalmente verifica se contém uma substring |
| `bodyContains` | `contains` | O corpo da resposta contém a substring |
| `bodyEquals` | `body` | O corpo da resposta é exatamente igual a `body` |
| `jsonPath` | `path`; `equals` / `exists` opcionais | Resolver um JSONPath e comparar o valor ou verificar sua existência |
| `responseTime` | `max` | A duração deve ser `<= max` ms |

## 6. Scripts Postman

Inclua um script de teste no estilo Postman por meio de `x-postman-scripts`:

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

Asserções declarativas `x-tests` e `x-postman-scripts` podem coexistir na mesma operação.

## 7. Integração CI com GitHub Actions

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

Por padrão, testes com falha retornam o código de saída `1`, e erros de configuração ou erros fatais de execução retornam `2`, fazendo o job de CI falhar. Use `--no-fail-on-error` para impedir que uma execução de testes concluída faça o pipeline falhar; essa opção não suprime erros de configuração nem erros fatais.
