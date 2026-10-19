---
sidebar_position: 1
title: "Introduzione"
description: "@powerduck/openapi-cli è uno strumento da riga di comando che esegue test in batch su un documento OpenAPI 3.2 usando un server reale. Indica un file di specifica o un URL: lo strumento esegue le operazioni del documento, verifica ogni risposta tramite asserzioni e produce tre formati di report."
---

# Introduzione

`@powerduck/openapi-cli` è uno strumento da riga di comando che esegue test in batch su un documento OpenAPI 3.2 usando un server reale. Indica un file di specifica o un URL: lo strumento esegue le operazioni del documento, verifica ogni risposta tramite asserzioni e produce tre formati di report.

Si basa su [`@powerduck/openapi-request`](https://www.npmjs.com/package/@powerduck/openapi-request) per eseguire le richieste e su [`@powerduck/openapi-parser`](https://www.npmjs.com/package/@powerduck/openapi-parser) per risolvere i riferimenti `$ref`.

## Perché usare openapi-cli

- **Pronto per la CI** — per impostazione predefinita, un codice di uscita diverso da zero segnala test non superati o errori di esecuzione. Si integra direttamente in GitHub Actions, GitLab CI o altre pipeline.
- **Più protocolli già integrati** — un’unica specifica può descrivere operazioni HTTP, SSE, WebSocket, GraphQL, gRPC e MCP, tutte gestite dallo stesso esecutore.
- **Due stili di asserzione** — array dichiarativi `x-tests` per controlli semplici e script in stile Postman con `pm.test()` / `pm.expect()` per casi complessi.
- **Tre formati di report** — JSON leggibile dalle macchine, output CLI colorato e leggibile e report HTML interattivo autonomo.
- **Specifiche locali o remote** — caricamento da percorso di file o URL `http(s)://`, con gestione dei reindirizzamenti e timeout.
- **Filtri flessibili** — selezione delle operazioni per metodo, percorso, tag o operationId, con concorrenza limitata.

## Protocolli supportati

L’esecutore rileva il protocollo di ogni operazione dalle estensioni OpenAPI o dai tipi di contenuto delle risposte:

| Protocollo | Identificatore | Selezione |
|----------|-----------|--------------------|
| HTTP | `http` | Predefinito per le operazioni standard |
| Eventi inviati dal server | `sse` | Tipo di contenuto della risposta `text/event-stream` oppure `x-response-stream: true` |
| WebSocket | `websocket` | `x-protocol: "websocket"` |
| GraphQL | `graphql` | `x-protocol: "graphql"` |
| gRPC | `grpc` | `x-protocol: "grpc"` |
| MCP | `mcp` | `x-protocol: "mcp"` |

È anche possibile imporre il protocollo tramite l’estensione `x-protocol` sull’operazione o sull’elemento di percorso.

## Report

Al termine dell’esecuzione, lo strumento produce quanto segue; i file vengono salvati per impostazione predefinita in `./openapi-cli-report`:

- `report.json` — l’intero oggetto `TestReport` in JSON formattato.
- `report.html` — report HTML autonomo e privo di dipendenze, con riepilogo, barra di avanzamento, pulsanti di filtro e righe dei test espandibili.
- Output standard — riepilogo CLI colorato con barra di avanzamento e asserzioni per ogni test.

## Uso dal codice

Lo stesso flusso è disponibile come libreria. Risolvi la configurazione, esegui i test e scegli i generatori di report desiderati:

```ts
import { resolveConfig, runTests, printCliReport, generateJsonReport } from "@powerduck/openapi-cli";

const config = resolveConfig({ spec: "./openapi.json" });
const report = await runTests(config);
printCliReport(report);
generateJsonReport(report, "./reports");
```

## Passi successivi

- [Installazione](./installation.md) — installazione globale o come dipendenza di sviluppo.
- [Guida rapida](./quickstart.md) — esegui la prima suite di test.
- [Configurazione](./configuration.md) — riferimento completo di `CliConfig`.
- [Comandi](./commands.md) — tutte le opzioni CLI e i codici di uscita.
- [Riferimento API](./api-reference.md) — tutte le funzioni e i tipi esportati.
- [Esempi](./examples.md) — esempi pronti per l’esecuzione.
