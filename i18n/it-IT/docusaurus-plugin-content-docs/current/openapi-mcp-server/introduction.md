---
sidebar_position: 1
title: "Introduzione"
description: "Converti OpenAPI in servizi MCP: strumenti, prompt e risorse, console web, stdio, HTTP e CLI openapi-mcp."
keywords: ["openapi-mcp-server", "MCP", "OpenAPI", "stdio", "HTTP"]
---

# @powerduck/openapi-mcp-server — Introduzione

`@powerduck/openapi-mcp-server` converte un documento OpenAPI in un servizio MCP (Model Context Protocol) in esecuzione. Genera **strumenti** dalle operazioni, **prompt** dai metadati e dalle operazioni dell’API e **risorse** dal catalogo. Li espone tramite MCP e include un’interfaccia web di amministrazione.

- **Nome del pacchetto:** `@powerduck/openapi-mcp-server`
- **Versione:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-mcp-server"/>
- **Licenza:** MIT
- **Versione di Node:** `>=22.12.0`
- **Eseguibile CLI:** `openapi-mcp`
- **Formato dei moduli:** Build ESM e CommonJS con dichiarazioni dei tipi incluse.

Si basa su `@powerduck/openapi-parser` per la convalida e la risoluzione dei riferimenti e su `@modelcontextprotocol/sdk` per il protocollo.

## Contenuti generati

- **Tools** — Uno strumento MCP per ogni operazione OpenAPI, con serializzazione completa dei parametri (stili path/query/header/cookie e regole explode), codifica del corpo (JSON, form-urlencoded, multipart, testo e dati binari) e annotazioni MCP (`readOnlyHint`, `destructiveHint`, `idempotentHint`).
- **Prompts** — Prompt globali (`spec_overview`, `integration_guardrails`) e specifici per operazione (`explain_*`, `plan_*`, `sample_*`).
- **Resources** — Risorse di catalogo fisse, come `openapi://spec/summary`, `openapi://catalog/tools` e `openapi://spec/document`.

## Trasporti

- **stdio** — `startStdioServer()` fornisce un documento a un client MCP locale, come Claude Desktop o un’integrazione per editor.
- **HTTP** — `attachMcpRoutes(app, options)` monta Streamable HTTP su `/mcp` e, facoltativamente, SSE legacy su `/sse` nella tua app Express. Le opzioni controllano limiti delle sessioni, timeout di inattività, CORS e protezione dal DNS rebinding. `startAdminServer()` aggiunge l’interfaccia di amministrazione e usa i limiti delle sessioni predefiniti. `attachSseRoutes()` resta disponibile come wrapper deprecato con argomenti posizionali.

## Server di amministrazione

`startAdminServer()` avvia un’app Express che fornisce:

- la console web per caricare o incollare specifiche, esaminare strumenti, prompt e risorse e visualizzare servizi attivi e log delle richieste;
- i trasporti HTTP di MCP;
- autenticazione tramite chiave API, log delle richieste con oscuramento degli header sensibili e persistenza facoltativa dello stato.

## Installazione

```bash npm2yarn2pnpm
npm install @powerduck/openapi-mcp-server
```

## Guida rapida

```bash
openapi-mcp serve --transport web --port 3000 --api-key your-admin-key
```

## Passaggi successivi

- [Installazione](../installation/) — npm/yarn/pnpm, installazione globale, sottopercorso `./server` e dipendenze.
- [Guida rapida](../quickstart/) — Uso da CLI e dal codice.
- [Configurazione](../configuration/) — Descrizione completa di `ServerConfig`.
- [Riferimento API](../api-reference/) — Tutte le esportazioni e i comandi CLI.
- [Esempi](../examples/) — Esempi pratici.

## Licenza

MIT.
