---
sidebar_position: 1
title: "Introdução"
description: "@powerduck/openapi-cli é uma ferramenta de linha de comando que testa em lote um documento OpenAPI 3.2 contra um servidor real. Informe um arquivo de especificação ou uma URL: a ferramenta executa as operações do documento, verifica cada resposta com asserções e gera três formatos de relatório."
---

# Introdução

`@powerduck/openapi-cli` é uma ferramenta de linha de comando que testa em lote um documento OpenAPI 3.2 contra um servidor real. Informe um arquivo de especificação ou uma URL: a ferramenta executa as operações do documento, verifica cada resposta com asserções e gera três formatos de relatório.

Ela usa [`@powerduck/openapi-request`](https://www.npmjs.com/package/@powerduck/openapi-request) para executar requisições e [`@powerduck/openapi-parser`](https://www.npmjs.com/package/@powerduck/openapi-parser) para resolver referências `$ref`.

## Por que usar openapi-cli

- **Pronto para CI** — por padrão, um código de saída diferente de zero indica falha nos testes ou erro de execução. A ferramenta se integra diretamente ao GitHub Actions, GitLab CI ou qualquer outro pipeline.
- **Vários protocolos integrados** — uma única especificação pode descrever operações HTTP, SSE, WebSocket, GraphQL, gRPC e MCP; o mesmo executor lida com todas.
- **Dois estilos de asserção** — arrays declarativos `x-tests` para verificações simples e scripts no estilo Postman com `pm.test()` / `pm.expect()` para casos complexos.
- **Três formatos de relatório** — JSON legível por máquinas, saída CLI colorida e fácil de ler e relatório HTML interativo independente.
- **Especificações locais ou remotas** — carregamento por caminho de arquivo ou URL `http(s)://`, com redirecionamentos e limite de tempo.
- **Filtragem flexível** — seleção de operações por método, caminho, tag ou operationId, com concorrência limitada.

## Protocolos compatíveis

O executor detecta o protocolo de cada operação pelas extensões do OpenAPI ou pelos tipos de conteúdo das respostas:

| Protocolo | Identificador | Como é selecionado |
|----------|-----------|--------------------|
| HTTP | `http` | Padrão para operações convencionais |
| Eventos enviados pelo servidor | `sse` | Tipo de conteúdo da resposta `text/event-stream` ou `x-response-stream: true` |
| WebSocket | `websocket` | `x-protocol: "websocket"` |
| GraphQL | `graphql` | `x-protocol: "graphql"` |
| gRPC | `grpc` | `x-protocol: "grpc"` |
| MCP | `mcp` | `x-protocol: "mcp"` |

Também é possível definir explicitamente o protocolo com a extensão `x-protocol` na operação ou no item de caminho.

## Relatórios

Após a execução, a ferramenta gera as saídas abaixo; por padrão, os arquivos ficam em `./openapi-cli-report`:

- `report.json` — o objeto `TestReport` completo em JSON formatado.
- `report.html` — relatório HTML independente e sem dependências, com resumo, barra de progresso, botões de filtro e linhas de teste expansíveis.
- Saída padrão — resumo CLI colorido com barra de progresso e asserções de cada teste.

## Uso no código

O mesmo fluxo está disponível como biblioteca. Resolva a configuração, execute os testes e escolha os geradores de relatório desejados:

```ts
import { resolveConfig, runTests, printCliReport, generateJsonReport } from "@powerduck/openapi-cli";

const config = resolveConfig({ spec: "./openapi.json" });
const report = await runTests(config);
printCliReport(report);
generateJsonReport(report, "./reports");
```

## Próximos passos

- [Instalação](./installation.md) — instalação global ou como dependência de desenvolvimento.
- [Início rápido](./quickstart.md) — execute sua primeira suíte de testes.
- [Configuração](./configuration.md) — referência completa de `CliConfig`.
- [Comandos](./commands.md) — todas as opções CLI e os códigos de saída.
- [Referência da API](./api-reference.md) — todas as funções e os tipos exportados.
- [Exemplos](./examples.md) — exemplos prontos para executar.
