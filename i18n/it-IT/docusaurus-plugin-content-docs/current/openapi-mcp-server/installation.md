---
sidebar_position: 2
title: "Installazione"
description: "Installa @powerduck/openapi-mcp-server con npm, yarn o pnpm, oppure globalmente. Include la CLI openapi-mcp e il sottopercorso ./server; richiede Node.js 22.12.0 o successivo."
---

# Installazione

## Requisiti

- **Node.js `>=22.12.0`** (dichiarato in `engines`).

## Installazione

```bash npm2yarn2pnpm
npm install @powerduck/openapi-mcp-server
```

Yarn:

```bash
yarn add @powerduck/openapi-mcp-server
```

pnpm:

```bash
pnpm add @powerduck/openapi-mcp-server
```

## CLI

Il pacchetto registra l’eseguibile `openapi-mcp`.

```bash
# global install
npm install -g @powerduck/openapi-mcp-server

# or run without installing
npx --package @powerduck/openapi-mcp-server openapi-mcp --help
```

La CLI ha un solo comando, `serve` (vedi [Guida rapida](/docs/it-IT/openapi-mcp-server/quickstart/)).

## ESM / CommonJS

Entrambi i formati di build includono le dichiarazioni dei tipi. Non servono pacchetti `@types/*` aggiuntivi:

```javascript
// ESM
import { buildMcpServer, startStdioServer } from "@powerduck/openapi-mcp-server";

// CommonJS
const { buildMcpServer, startStdioServer } = require("@powerduck/openapi-mcp-server");
```

## Esportazione del sottopercorso

| Importazione | Contenuto |
| --- | --- |
| `@powerduck/openapi-mcp-server` | Libreria principale: caricamento delle specifiche, generazione di strumenti, prompt e risorse, esecuzione delle richieste, costruzione del server MCP e trasporti stdio e HTTP. |
| `@powerduck/openapi-mcp-server/server` | Server HTTP di amministrazione e middleware di autenticazione (`startAdminServer`, `createAuthMiddleware`). |

## Dipendenze di runtime

Queste dipendenze vengono installate automaticamente con il pacchetto:

- `@modelcontextprotocol/sdk` — implementazione del protocollo MCP.
- `@powerduck/openapi-parser` — validazione, risoluzione dei riferimenti e aggiornamento di OpenAPI.
- `express` e `cors` — server HTTP di amministrazione e CORS.
- `axios` — client HTTP verso il server di destinazione per l’esecuzione degli strumenti.
- `commander` — framework della CLI.
- `js-yaml` — analisi del formato YAML.
- `multer` — gestione del caricamento delle specifiche.
- `terser` — minificazione delle risorse dell’interfaccia web integrata.

## Verifica

```bash
npx --package @powerduck/openapi-mcp-server openapi-mcp --help
```

## Passaggi successivi

- [Guida rapida](/docs/it-IT/openapi-mcp-server/quickstart/)
- [Configurazione](/docs/it-IT/openapi-mcp-server/configuration/)
