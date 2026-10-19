---
sidebar_position: 2
title: "Installazione"
description: "Installa @powerduck/openapi-codegen con npm, yarn o pnpm e usalo in Node.js o nel browser. Richiede Node.js 22.12.0 o successivo."
---

# Installazione

## Requisiti

- **Node.js**: `>= 22.12.0` (dichiarato nel campo `engines` del pacchetto), per l’utilizzo in Node.js.
- Un documento OpenAPI **già analizzato**, come oggetto JavaScript, non una stringa JSON/YAML grezza.
- Un browser moderno con l’API Fetch per l’utilizzo nel browser.

Il pacchetto include build ESM (`dist/index.js`) e CommonJS (`dist/index.cjs`), con dichiarazioni TypeScript. Non ha **dipendenze di runtime**.

## npm

```bash npm2yarn2pnpm
npm install @powerduck/openapi-codegen
```

## pnpm

```bash npm2yarn2pnpm
pnpm add @powerduck/openapi-codegen
```

## Yarn

```bash npm2yarn2pnpm
yarn add @powerduck/openapi-codegen
```

## Utilizzo in Node.js

```typescript
import { generate } from "@powerduck/openapi-codegen";
```

CommonJS:

```javascript
const { generate } = require("@powerduck/openapi-codegen");
```

I generatori integrati vengono **registrati automaticamente all’importazione del modulo**: `generate` funziona subito, senza configurazione esplicita.

## Utilizzo nel browser

La libreria è pienamente compatibile con il browser e non usa moduli integrati di Node.js. Caricala da una CDN ESM e richiamala direttamente:

```html
<script type="module">
  import { generate, list } from "https://esm.sh/@powerduck/openapi-codegen";

  const document = {
    openapi: "3.1.0",
    info: { title: "Example API", version: "1.0.0" },
    servers: [{ url: "https://api.example.com" }],
    paths: {
      "/hello": { get: { responses: { "200": { description: "OK" } } } },
    },
  };

  const code = generate({
    document,
    path: "/hello",
    method: "get",
    language: "javascript",
    client: "fetch",
  });

  console.log(code);
</script>
```

Anche Vite, esbuild e webpack funzionano senza configurazioni aggiuntive; la build ESM supporta il tree shaking.

## Fornire il documento

Passa un oggetto già analizzato. Per JSON:

```typescript
import { readFile } from "node:fs/promises";

const document = JSON.parse(await readFile("./openapi.json", "utf8"));
```

Per YAML, analizza prima il contenuto con un pacchetto YAML separato:

```typescript
import YAML from "yaml";
const document = YAML.parse(await readFile("./openapi.yaml", "utf8"));
```

## Struttura del pacchetto

| Punto di ingresso | Percorso |
|-------|------|
| Ingresso ESM | `dist/index.js` |
| Ingresso CommonJS | `dist/index.cjs` |
| Definizioni dei tipi | `dist/index.d.ts` |

Non esiste un eseguibile CLI: la libreria si usa soltanto da codice.

## Passaggi successivi

- [Guida rapida](/docs/it-IT/openapi-codegen/quickstart/) — genera il tuo primo frammento di codice.
- [Configurazione](/docs/it-IT/openapi-codegen/configuration/) — tutte le opzioni di generazione.
