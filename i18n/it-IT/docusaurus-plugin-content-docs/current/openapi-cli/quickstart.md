---
sidebar_position: 3
title: "Guida rapida"
description: "Esegui il primo gruppo di test con @powerduck/openapi-cli dalla CLI e da Node.js."
---

# Guida rapida

Questa guida ti accompagna nel primo test di un documento OpenAPI.

## Prerequisiti

- Node.js `>= 22.12.0`.
- Un documento OpenAPI 3.2 in **JSON**. YAML non è accettato: convertilo prima in JSON. Il documento deve contenere un oggetto `paths` al livello principale.

## 1. Eseguire dalla CLI

L’esecuzione più semplice carica una specifica locale e testa tutte le operazioni sul primo URL del server dichiarato:

```bash
openapi-cli --spec openapi.json
```

Sostituisci il server di destinazione e scrivi i report in una cartella personalizzata:

```bash
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --output ./reports
```

Testa una specifica remota solo con operazioni `GET`, usando 10 worker simultanei:

```bash
openapi-cli --spec https://docs.example.com/openapi.json \
  --method get \
  --concurrency 10
```

Per impostazioni complesse, usa un file di configurazione JSON:

```bash
openapi-cli --config openapi-cli.config.json
```

Consulta tutte le opzioni in [Comandi](/docs/it-IT/openapi-cli/commands/).

## 2. Creare una specifica minima

Documento OpenAPI minimo con asserzioni dichiarative:

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

Se un’operazione **non** definisce asserzioni, il runner aggiunge un controllo implicito di successo del protocollo. Per HTTP, richiede uno stato `2xx`, evitando che risposte 4xx/5xx vengano considerate riuscite senza segnalarlo.

## 3. Eseguire da Node.js (API programmatica)

La libreria espone lo stesso flusso tramite funzioni: `resolveConfig` → `runTests` → generatori di report.

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

`resolveConfig` accetta la stessa struttura di opzioni della CLI. `runTests` restituisce un `TestReport` contenente `summary`, `results`, `config`, `generatedAt` e `version`. [Configurazione](/docs/it-IT/openapi-cli/configuration/).

## 4. Codici di uscita per CI

| Codice | Significato |
|---|---|
| `0` | Tutti i test superati, oppure è impostato `--no-fail-on-error`. |
| `1` | Uno o più test non superati o terminati con errore. |
| `2` | Errore di configurazione, caricamento della specifica non riuscito o errore fatale di esecuzione. |

## Passaggi successivi

- [Configurazione](/docs/it-IT/openapi-cli/configuration/) — tutti i campi di `CliConfig` e i valori predefiniti.
- [Comandi](/docs/it-IT/openapi-cli/commands/) — tutte le opzioni della CLI.
- [Esempi](/docs/it-IT/openapi-cli/examples/) — autenticazione, filtri, report e asserzioni.
- [Riferimento API](/docs/it-IT/openapi-cli/api-reference/) — tutte le funzioni e i tipi esportati.
