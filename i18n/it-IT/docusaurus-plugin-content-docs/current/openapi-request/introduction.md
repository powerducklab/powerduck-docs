---
sidebar_position: 1
title: "Introduzione a @powerduck/openapi-request"
description: "@powerduck/openapi-request è un debugger di raccolte e un motore di esecuzione delle richieste per OpenAPI 3.2. Prepara e invia richieste a partire da un documento OpenAPI, identifica le risposte in streaming e può generare un documento aggiornato dalle risposte osservate. Un’interfaccia compatta consente di usare sei protocolli di comunicazione."
---

# Introduzione a @powerduck/openapi-request

`@powerduck/openapi-request` è un debugger di raccolte e un motore di esecuzione delle richieste per OpenAPI 3.2. Prepara e invia richieste a partire da un documento OpenAPI, identifica le risposte in streaming e può generare un documento aggiornato dalle risposte osservate. Un’interfaccia compatta consente di usare sei protocolli di comunicazione.

- **Nome del pacchetto:** `@powerduck/openapi-request`
- **Versione:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-request"/>
- **Licenza:** MIT
- **Formato dei moduli:** distribuzioni ESM e CommonJS con dichiarazioni dei tipi incluse.

## A cosa serve

La libreria risponde a tre esigenze usando lo stesso documento come riferimento:

- **Client pensato per le interfacce grafiche** — `createClient()` restituisce un oggetto con `prepare()`, `send()`, `connect()`, `discover()` e `writeback()`, corrispondenti alle fasi di un editor grafico di richieste.
- **Debugger gestibile tramite script** — `createDebugger()` restituisce un `ProtoKit` con `send()`, `sendMany()` e `toCollection()` per automazione, script e CI.
- **Sessioni persistenti a gestione manuale** — `createManualSession()` restituisce un oggetto di sessione bidirezionale con apertura, invio, chiusura e flusso di eventi. La struttura è identica per WebSocket, MCP e gRPC, quindi la stessa interfaccia può gestirli tutti e tre.

## Adattatori di protocollo

Il nucleo è indipendente dal trasporto; il comportamento specifico viene fornito dagli adattatori di protocollo registrati in un `AdapterRegistry`.

- **HTTP / SSE** — supportati per impostazione predefinita. Le normali richieste JSON e i flussi Server-Sent Events vengono riconosciuti automaticamente dai tipi di contenuto dichiarati o dalle intestazioni delle risposte effettive.
- **WebSocket** — sessioni bidirezionali di testo o dati binari con una struttura di evento comune.
- **gRPC** — chiamate unarie, streaming del server, streaming del client e streaming bidirezionale tramite file `.proto` o reflection del server.
- **MCP** — chiamate agli strumenti Model Context Protocol tramite Streamable HTTP o stdio.
- **GraphQL** — introspezione, generazione ed esecuzione di operazioni.

## Funzionalità principali

- **Modello di raccolte OpenAPI 3.2** — individua le operazioni tramite `operationId` o `method`+`path` e prepara le richieste a partire da parametri, corpi delle richieste ed esempi.
- **Rilevamento dello streaming** — `isStreamingOperation()`, `isSseContentType()` e `isStreamingContentType()` classificano le risposte dai tipi di contenuto dichiarati; `probeStreamingResponse()` esamina le intestazioni delle risposte effettive.
- **Integrazione delle risposte nel documento** — `inferSchema()`, `mergeSchema()`, `toResponseObject()` e `writeBackResponse()` ricavano gli schemi delle risposte e restituiscono un documento aggiornato. Per impostazione predefinita, `send()` lo restituisce in `patchedSpec` se l’integrazione riesce; `writeBack: false` disattiva questo comportamento. Il documento in ingresso non viene modificato e nessun file viene salvato automaticamente. Controlla `writeBackSkippedReason` e `writeBackWarnings` prima di salvare il risultato.
- **Utilità per gli schemi** — `sampleFromSchema()` genera dati di esempio a partire da uno schema.
- **Caricamento differito delle dipendenze pesanti** — gRPC (`@grpc/grpc-js`, `@grpc/proto-loader`) e MCP (`@modelcontextprotocol/sdk`) vengono caricati al primo utilizzo. Chi usa soltanto HTTP evita il relativo costo di caricamento.

## Installazione

```bash npm2yarn2pnpm
npm install @powerduck/openapi-request
```

## Guida rapida

```typescript
import { createClient } from "@powerduck/openapi-request";

const spec = {
  openapi: "3.2.0",
  info: { title: "Users", version: "1.0.0" },
  paths: {
    "/users/{id}": {
      get: {
        operationId: "getUserById",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "User" } },
      },
    },
  },
};

const client = createClient();

const plan = client.prepare({
  spec,
  target: { operationId: "getUserById" },
});

const result = await client.send({
  spec,
  target: { operationId: "getUserById" },
  values: { path: { id: "42" } },
  serverUrl: "https://api.example.com",
});
```

## Passi successivi

- [Installazione](./installation.md) — struttura del pacchetto, esportazioni dei sottopercorsi e dipendenze peer per le funzionalità dei protocolli.
- [Guida rapida](./quickstart.md) — prima richiesta, esecuzione del debugger e sessione manuale.
- [Configurazione](./configuration.md) — `CreateClientOptions`, `DebuggerOptions` e configurazione per protocollo.
- [Riferimento API](./api-reference.md) — tutte le esportazioni suddivise per funzionalità.
- [Esempi](./examples.md) — esempi eseguibili per HTTP, SSE, WebSocket, GraphQL, MCP e gRPC.

## Licenza

MIT.
