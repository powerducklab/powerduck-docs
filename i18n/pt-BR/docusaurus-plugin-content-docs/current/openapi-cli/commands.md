---
sidebar_position: 5
title: "Comandos CLI"
description: "O pacote fornece um único executável, openapi-cli. Ele recebe diretamente uma lista de opções; não há subcomandos run / validate / init:"
---

# Comandos CLI

O pacote fornece um único executável, `openapi-cli`. Ele recebe diretamente uma lista de opções; **não há** subcomandos `run` / `validate` / `init`:

```
openapi-cli [options]
```

## Sintaxe

```bash
openapi-cli --spec openapi.json [options]
openapi-cli -c config.json
```

Uma especificação é **obrigatória**: informe `--spec` (ou `-s`), ou defina `specPath` em um arquivo JSON carregado com `--config`. As demais opções são opcionais.

## Opções principais

| Opção | Forma curta | Padrão | Descrição |
|--------|-------|---------|-------------|
| `--spec <path-or-url>` | `-s` | — | Caminho ou URL `http(s)://` de uma especificação JSON OpenAPI 3.2 |
| `--server <url>` | `-S` | *(da especificação)* | Substituir a URL do servidor definida na especificação |
| `--output <dir>` | `-o` | `./openapi-cli-report` | Diretório de saída dos relatórios |
| `--format <formats>` | `-f` | `json,cli,html` | Formatos de relatório separados por vírgulas: `json`, `cli`, `html` |
| `--config <path>` | `-c` | — | Caminho do arquivo de configuração JSON; argumentos CLI têm prioridade |

## Opções de execução

| Opção | Forma curta | Padrão | Descrição |
|--------|-------|---------|-------------|
| `--concurrency <n>` | `-n` | `5` | Máximo de requisições simultâneas; inteiro de 1 a 100 |
| `--timeout <ms>` | `-t` | `30000` | Tempo limite por requisição em ms, inteiro de 1 a 600000; também usado para buscar uma especificação remota |
| `--no-fail-on-error` | — | desativado | Retornar `0` após uma execução concluída mesmo se os testes falharem; erros de configuração e erros fatais continuam causando falha |

## Opções de filtragem

| Opção | Padrão | Descrição |
|--------|---------|-------------|
| `--method <methods>` | — | Métodos HTTP a incluir, separados por vírgulas, como `get,post` |
| `--path <patterns>` | — | Expressões regulares separadas por vírgulas, comparadas a cada caminho |
| `--tag <tags>` | — | Tags OpenAPI a incluir, separadas por vírgulas |
| `--operation-id <ids>` | — | Valores de `operationId` a incluir, separados por vírgulas |

## Opções de rede e TLS

| Opção | Forma curta | Padrão | Descrição |
|--------|-------|---------|-------------|
| `--proxy <url>` | `-p` | — | URL do proxy HTTP(S), como `http://proxy.corp:8080` |
| `--ca <path>` | — | — | Conjunto de certificados CA em formato PEM |
| `--cert <path>` | — | — | Certificado do cliente em PEM para mTLS |
| `--key <path>` | — | — | Chave privada do cliente em PEM para mTLS |
| `--insecure` | `-k` | desativado | Ignorar a verificação de certificados TLS |

## Autenticação, cabeçalhos e variáveis

| Opção | Forma curta | Descrição |
|--------|-------|-------------|
| `--header <headers...>` | `-H` | Cabeçalhos extras como `Key: Value`; pode ser repetido |
| `--bearer <token>` | — | Token Bearer enviado no cabeçalho `Authorization` |
| `--variable <vars...>` | `-v` | Variáveis Postman como `KEY=VALUE`; pode ser repetido |
| `--env <path>` | — | Caminho do arquivo `.env`; não sobrescreve variáveis de ambiente existentes |

## Opções gRPC

| Opção | Padrão | Descrição |
|--------|---------|-------------|
| `--grpc-no-reflection` | desativado | Desativar a reflexão do servidor gRPC e usar arquivos proto |
| `--grpc-proto <paths...>` | — | Caminhos de arquivos `.proto` ou diretórios que os contenham |

## Opções MCP

| Opção | Padrão | Descrição |
|--------|---------|-------------|
| `--mcp-transport <transport>` | `streamable-http` | Transporte MCP: `streamable-http` ou `stdio` |
| `--mcp-command <command>` | — | Comando MCP stdio, como `npx` |
| `--mcp-args <args>` | — | Argumentos MCP stdio separados por espaços ou vírgulas |
| `--mcp-cwd <dir>` | — | Diretório de trabalho do subprocesso MCP stdio |

## Opções informativas

| Opção | Forma curta | Descrição |
|--------|-------|-------------|
| `--help` | `-h` | Mostrar a ajuda |
| `--version` | `-V` | Mostrar a versão |

## Códigos de saída

| Código | Significado |
|------|---------|
| `0` | Todos os testes passaram ou `--no-fail-on-error` foi ativado |
| `1` | Um ou mais testes falharam ou apresentaram erros, ou a análise dos argumentos CLI falhou |
| `2` | Erro de configuração, falha ao carregar a especificação ou erro fatal de execução |

A CLI exibe `Error:` em vermelho e termina com `2` quando `resolveConfig` lança uma exceção, por exemplo se não houver nem `--spec` nem um `specPath` configurado. Exibe `Fatal error:` e termina com `2` quando `runTests` lança uma exceção. Após uma execução concluída, retorna `1` somente quando `report.summary.failed > 0 || report.summary.errors > 0` e `failOnError !== false`.

## Variáveis de ambiente

Não há variáveis específicas `OPENAPI_CLI_*`. A configuração vem das opções, do arquivo de configuração e dos seguintes mecanismos:

- **Arquivo `.env`** — passe `--env .env` para carregar pares `KEY=VALUE` em `process.env`. Variáveis existentes não são sobrescritas.
- **Expansão de `${VAR}`** — após o carregamento, `${VAR_NAME}` é substituído em `serverUrl`, `proxy`, nos valores de `headers`, em `auth.token` e nos valores de `variables`.

```bash
openapi-cli --spec openapi.json \
  --env .env \
  --server 'https://${API_HOST}/v1' \
  --bearer '${BEARER_TOKEN}'
```

## Exemplos de execução

```bash
# Test a local spec against its first server URL
openapi-cli --spec openapi.json

# Override the server and write JSON + HTML reports
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --format json,html --output ./reports

# Only GET requests, 10 workers, with a bearer token
openapi-cli --spec openapi.json --method get --concurrency 10 --bearer "$TOKEN"

# Use a config file
openapi-cli --config openapi-cli.config.json
```
