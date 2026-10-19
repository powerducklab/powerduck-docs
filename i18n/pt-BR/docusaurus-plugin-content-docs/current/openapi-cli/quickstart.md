---
sidebar_position: 3
title: "Início rápido"
description: "Execute seu primeiro lote de testes com @powerduck/openapi-cli pela CLI e pelo Node.js."
---

# Início rápido

Este guia mostra como testar seu primeiro documento OpenAPI.

## Pré-requisitos

- Node.js `>= 22.12.0`.
- Um documento OpenAPI 3.2 em **JSON**. YAML não é aceito: converta-o para JSON antes. O documento deve conter um objeto `paths` no nível superior.

## 1. Executar pela CLI

A execução mais simples carrega uma especificação local e testa todas as operações contra a primeira URL de servidor declarada:

```bash
openapi-cli --spec openapi.json
```

Substitua o servidor de destino e grave os relatórios em outro diretório:

```bash
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --output ./reports
```

Teste uma especificação remota apenas com operações `GET`, usando 10 workers simultâneos:

```bash
openapi-cli --spec https://docs.example.com/openapi.json \
  --method get \
  --concurrency 10
```

Para configurações complexas, use um arquivo JSON:

```bash
openapi-cli --config openapi-cli.config.json
```

Consulte todas as opções em [Comandos](/docs/pt-BR/openapi-cli/commands/).

## 2. Criar uma especificação mínima

Documento OpenAPI mínimo com asserções declarativas:

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

Quando uma operação **não** define asserções, o executor adiciona uma verificação implícita de sucesso do protocolo. Para HTTP, exige um status `2xx`, evitando que respostas 4xx/5xx sejam consideradas aprovadas silenciosamente.

## 3. Executar pelo Node.js (API programática)

A biblioteca expõe o mesmo fluxo por funções: `resolveConfig` → `runTests` → geradores de relatórios.

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

`resolveConfig` aceita a mesma estrutura de opções da CLI. `runTests` retorna um `TestReport` com `summary`, `results`, `config`, `generatedAt` e `version`. [Configuração](/docs/pt-BR/openapi-cli/configuration/).

## 4. Códigos de saída para CI

| Código | Significado |
|---|---|
| `0` | Todos os testes passaram, ou `--no-fail-on-error` foi definido. |
| `1` | Um ou mais testes falharam ou geraram erros. |
| `2` | Erro de configuração, falha ao carregar a especificação ou erro fatal de execução. |

## Próximos passos

- [Configuração](/docs/pt-BR/openapi-cli/configuration/) — todos os campos de `CliConfig` e seus valores padrão.
- [Comandos](/docs/pt-BR/openapi-cli/commands/) — todas as opções da CLI.
- [Exemplos](/docs/pt-BR/openapi-cli/examples/) — autenticação, filtros, relatórios e asserções.
- [Referência da API](/docs/pt-BR/openapi-cli/api-reference/) — todas as funções e tipos exportados.
