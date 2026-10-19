---
sidebar_position: 5
title: "Comandi CLI"
description: "Il pacchetto fornisce un solo eseguibile, openapi-cli. Accetta direttamente un elenco di opzioni; non esistono sottocomandi run / validate / init:"
---

# Comandi CLI

Il pacchetto fornisce un solo eseguibile, `openapi-cli`. Accetta direttamente un elenco di opzioni; **non esistono** sottocomandi `run` / `validate` / `init`:

```
openapi-cli [options]
```

## Sintassi

```bash
openapi-cli --spec openapi.json [options]
openapi-cli -c config.json
```

Una specifica è **obbligatoria**: passa `--spec` (o `-s`), oppure imposta `specPath` in un file JSON caricato con `--config`. Le altre opzioni sono facoltative.

## Opzioni principali

| Opzione | Forma breve | Predefinito | Descrizione |
|--------|-------|---------|-------------|
| `--spec <path-or-url>` | `-s` | — | Percorso o URL `http(s)://` di una specifica JSON OpenAPI 3.2 |
| `--server <url>` | `-S` | *(dalla specifica)* | Sostituire l’URL del server definito nella specifica |
| `--output <dir>` | `-o` | `./openapi-cli-report` | Directory di destinazione dei report |
| `--format <formats>` | `-f` | `json,cli,html` | Formati di report separati da virgole: `json`, `cli`, `html` |
| `--config <path>` | `-c` | — | Percorso del file di configurazione JSON; gli argomenti CLI hanno la precedenza |

## Opzioni di esecuzione

| Opzione | Forma breve | Predefinito | Descrizione |
|--------|-------|---------|-------------|
| `--concurrency <n>` | `-n` | `5` | Numero massimo di richieste simultanee; intero da 1 a 100 |
| `--timeout <ms>` | `-t` | `30000` | Timeout per richiesta in ms, intero da 1 a 600000; usato anche per recuperare una specifica remota |
| `--no-fail-on-error` | — | disattivato | Restituire `0` dopo un’esecuzione completata anche se alcuni test falliscono; gli errori di configurazione e quelli fatali causano comunque un errore |

## Opzioni di filtro

| Opzione | Predefinito | Descrizione |
|--------|---------|-------------|
| `--method <methods>` | — | Metodi HTTP da includere, separati da virgole, ad esempio `get,post` |
| `--path <patterns>` | — | Espressioni regolari separate da virgole da confrontare con ogni percorso |
| `--tag <tags>` | — | Tag OpenAPI da includere, separati da virgole |
| `--operation-id <ids>` | — | Valori `operationId` da includere, separati da virgole |

## Opzioni di rete e TLS

| Opzione | Forma breve | Predefinito | Descrizione |
|--------|-------|---------|-------------|
| `--proxy <url>` | `-p` | — | URL del proxy HTTP(S), ad esempio `http://proxy.corp:8080` |
| `--ca <path>` | — | — | Raccolta di certificati CA in formato PEM |
| `--cert <path>` | — | — | Certificato client PEM per mTLS |
| `--key <path>` | — | — | Chiave privata del client PEM per mTLS |
| `--insecure` | `-k` | disattivato | Saltare la verifica dei certificati TLS |

## Autenticazione, intestazioni e variabili

| Opzione | Forma breve | Descrizione |
|--------|-------|-------------|
| `--header <headers...>` | `-H` | Intestazioni aggiuntive come `Key: Value`; ripetibile |
| `--bearer <token>` | — | Token Bearer inviato nell’intestazione `Authorization` |
| `--variable <vars...>` | `-v` | Variabili Postman come `KEY=VALUE`; ripetibile |
| `--env <path>` | — | Percorso del file `.env`; non sovrascrive le variabili d’ambiente esistenti |

## Opzioni gRPC

| Opzione | Predefinito | Descrizione |
|--------|---------|-------------|
| `--grpc-no-reflection` | disattivato | Disattivare la reflection del server gRPC e usare file proto |
| `--grpc-proto <paths...>` | — | Percorsi dei file `.proto` o delle directory che li contengono |

## Opzioni MCP

| Opzione | Predefinito | Descrizione |
|--------|---------|-------------|
| `--mcp-transport <transport>` | `streamable-http` | Trasporto MCP: `streamable-http` o `stdio` |
| `--mcp-command <command>` | — | Comando MCP stdio, ad esempio `npx` |
| `--mcp-args <args>` | — | Argomenti MCP stdio separati da spazi o virgole |
| `--mcp-cwd <dir>` | — | Directory di lavoro del sottoprocesso MCP stdio |

## Opzioni informative

| Opzione | Forma breve | Descrizione |
|--------|-------|-------------|
| `--help` | `-h` | Mostrare la guida |
| `--version` | `-V` | Mostrare la versione |

## Codici di uscita

| Codice | Significato |
|------|---------|
| `0` | Tutti i test superati oppure `--no-fail-on-error` attivato |
| `1` | Uno o più test non superati o con errori, oppure analisi degli argomenti CLI non riuscita |
| `2` | Errore di configurazione, caricamento della specifica non riuscito o errore fatale di esecuzione |

La CLI stampa `Error:` in rosso e termina con `2` quando `resolveConfig` solleva un’eccezione, ad esempio se non viene fornito né `--spec` né un `specPath` configurato. Stampa `Fatal error:` e termina con `2` se `runTests` solleva un’eccezione. Dopo un’esecuzione completata, restituisce `1` soltanto se `report.summary.failed > 0 || report.summary.errors > 0` e `failOnError !== false`.

## Variabili d’ambiente

Non esistono variabili dedicate `OPENAPI_CLI_*`. La configurazione viene fornita tramite opzioni, file di configurazione e questi meccanismi:

- **File `.env`** — passa `--env .env` per caricare coppie `KEY=VALUE` in `process.env`. Le variabili esistenti non vengono sovrascritte.
- **Espansione di `${VAR}`** — dopo il caricamento, `${VAR_NAME}` viene sostituito in `serverUrl`, `proxy`, nei valori di `headers`, in `auth.token` e nei valori di `variables`.

```bash
openapi-cli --spec openapi.json \
  --env .env \
  --server 'https://${API_HOST}/v1' \
  --bearer '${BEARER_TOKEN}'
```

## Esempi di esecuzione

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
