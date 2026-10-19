---
sidebar_position: 2
title: "Installazione"
description: "Installa @powerduck/x-to-openapi con npm, yarn o pnpm. ESM con compatibilità CommonJS e funzioni curlToOpenApi e postmanToOpenApi senza configurazione."
---

# Installazione

Installa `@powerduck/x-to-openapi` con il gestore di pacchetti che preferisci.

## Requisiti

- **Node.js:** `>= 22.12.0`
- **TypeScript:** facoltativo; tutte le definizioni dei tipi sono incluse.

## Installazione

```bash npm2yarn2pnpm
npm install @powerduck/x-to-openapi
```

```bash
yarn add @powerduck/x-to-openapi
```

```bash
pnpm add @powerduck/x-to-openapi
```

## Dipendenze di runtime

| Pacchetto | Versione | Utilizzo |
|---|---|---|
| `@powerduck/openapi-parser` | `^0.3.12` | Tipi canonici OpenAPI e validazione dell’output |
| `curlconverter` | `^4.12.0` | Analisi dei comandi curl in richieste strutturate |

Entrambe le dipendenze vengono installate automaticamente.

---

## Sistema di moduli: ESM con compatibilità CJS

Il pacchetto dichiara `"type": "module"` e fornisce entrambe le build da un unico punto di ingresso:

| Build | Condizione | File |
|---|---|---|
| ESM | `import` | `./dist/index.js` |
| CommonJS | `require` | `./dist/index.cjs` |
| Tipi | — | `./dist/index.d.ts` |

```typescript
// ESM (Node.js, bundlers)
import { curlToOpenApi, postmanToOpenApi } from "@powerduck/x-to-openapi";
```

```javascript
// CommonJS (require)
const { curlToOpenApi, postmanToOpenApi } = require("@powerduck/x-to-openapi");
```

Il pacchetto dichiara `"sideEffects": false`, quindi il tree shaking elimina gli adattatori inutilizzati.

---

## Funzioni senza configurazione

Alla maggior parte degli utenti bastano due funzioni. Creano un’istanza di [`XToOpenApi`](/docs/it-IT/x-to-openapi/api-reference/#xtoopenapi), registrano l’adattatore corrispondente e chiamano `convert`:

```typescript
import {
  curlToOpenApi,    // string | string[]  → OpenAPI 3.2
  postmanToOpenApi, // collection object | JSON string → OpenAPI 3.2
} from "@powerduck/x-to-openapi";
```

Usa la classe [`XToOpenApi`](/docs/it-IT/x-to-openapi/api-reference/#xtoopenapi) completa per opzioni personalizzate, più adattatori, rilevamento `"auto"` o un adattatore personalizzato.

---

## Verifica

```bash
# Check the installed version
npm list @powerduck/x-to-openapi

# Verify the package loads and the helpers exist
node -e "const x = require('@powerduck/x-to-openapi'); console.log(typeof x.curlToOpenApi, typeof x.postmanToOpenApi, typeof x.XToOpenApi);"
```

---

## Passaggi successivi

- [Guida rapida](/docs/it-IT/x-to-openapi/quickstart/) — converti un comando curl e una raccolta Postman, e registra un adattatore personalizzato.
- [Riferimento API](/docs/it-IT/x-to-openapi/api-reference/) — tutte le esportazioni e le opzioni.
