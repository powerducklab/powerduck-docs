---
sidebar_position: 2
title: "Installazione"
description: "Installa @powerduck/openapi-cli globalmente, come dipendenza di sviluppo o con npx. Richiede Node.js 22.12.0 o versioni successive."
---

# Installazione

## Requisiti

- **Node.js**: `>= 22.12.0` (dichiarato nel campo `engines` del pacchetto).
- Un gestore di pacchetti: npm, yarn o pnpm.

Il pacchetto include build ESM (`dist/index.js`) e CommonJS (`dist/index.cjs`), con dichiarazioni TypeScript (`dist/index.d.ts`). Non servono pacchetti `@types` aggiuntivi.

## Installazione globale (consigliata per la CLI)

L’installazione globale aggiunge l’eseguibile `openapi-cli` al tuo `PATH`:

```bash npm2yarn2pnpm
npm install -g @powerduck/openapi-cli
```

Verifica l’eseguibile:

```bash
openapi-cli --help
```

## Installazione nel progetto (consigliata per la CI)

Fissa la versione nel progetto affinché la CI usi una versione nota:

```bash npm2yarn2pnpm
npm install --save-dev @powerduck/openapi-cli
```

Poi richiama l’eseguibile tramite il gestore di pacchetti:

```bash
npx openapi-cli --spec openapi.json
# or
pnpm exec openapi-cli --spec openapi.json
```

## Esecuzione occasionale con npx

Senza installazione preventiva:

```bash
npx @powerduck/openapi-cli --spec openapi.json
```

## Struttura del pacchetto

| Punto di ingresso | Percorso |
|-------|------|
| Ingresso ESM | `dist/index.js` |
| Ingresso CommonJS | `dist/index.cjs` |
| Definizioni dei tipi | `dist/index.d.ts` |
| Ingresso CLI (bin) | `dist/cli.js` |
| Nome dell’eseguibile | `openapi-cli` |

Il pacchetto dichiara `"type": "module"` ed espone soltanto i sottopercorsi `.` e `./package.json`.

## Importazione nel codice

```typescript
// ESM
import { runTests, resolveConfig } from "@powerduck/openapi-cli";

// CommonJS
const { runTests, resolveConfig } = require("@powerduck/openapi-cli");
```

## Dipendenze di runtime

Il pacchetto pubblicato dipende da:

- `@powerduck/openapi-parser` (`^0.3.12`) — risoluzione dei riferimenti `$ref` interni.
- `@powerduck/openapi-request` (`0.2.22`) — esecuzione delle richieste di protocollo.
- `commander` (`^12.1.0`) — analisi degli argomenti della CLI.
- `https-proxy-agent` (`^5.0.1`) — supporto proxy per il trasporto HTTP.

## Passaggi successivi

- [Guida rapida](/docs/it-IT/openapi-cli/quickstart/) — esegui la tua prima suite di test.
- [Comandi](/docs/it-IT/openapi-cli/commands/) — riferimento completo delle opzioni.
