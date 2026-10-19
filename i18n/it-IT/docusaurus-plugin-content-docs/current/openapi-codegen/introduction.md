---
sidebar_position: 1
title: "Introduzione"
description: "Genera esempi HTTP eseguibili da OpenAPI con @powerduck/openapi-codegen: 21 linguaggi, 41 client, compatibile con il browser e senza dipendenze di runtime."
---

# Introduzione

`@powerduck/openapi-codegen` è una libreria TypeScript che trasforma un'operazione OpenAPI in **codice di esempio HTTP eseguibile** nel linguaggio e con il client HTTP scelti. È pensata per siti di documentazione API, portali per sviluppatori, esploratori di API, strumenti CLI e generazione di codice durante la build.

Supporta **21 linguaggi** e **41 combinazioni linguaggio/client**, è **compatibile con il browser** e non ha **dipendenze di runtime**.

## Perché openapi-codegen

- **Nessuna dipendenza di runtime** — funziona in browser, Node.js, Electron e ambienti edge senza moduli integrati di Node.
- **Due formati di moduli** — build ESM nativa e CommonJS (`require()`).
- **OpenAPI 3.0 / 3.1 / 3.2** — elabora oggetti documento già analizzati. JSON e YAML sono supportati se analizzati prima di chiamare `generate()`.
- **41 generatori integrati** per 21 linguaggi, registrati automaticamente all'importazione.
- **Serializzazione completa dei parametri** — percorso, query, header e cookie secondo le regole OpenAPI `style` / `explode` / `allowReserved`.
- **Schemi di sicurezza** — chiave API in header, query o cookie, HTTP bearer e HTTP basic.
- **Tipi di corpo** — JSON, testo semplice, moduli con codifica URL e `multipart/form-data`.
- **Risoluzione di `$ref`** — riferimenti JSON Pointer interni al documento, con cache, concatenamento e rilevamento dei cicli.
- **Esempi automatici** — deduce valori da JSON Schema (`example`, `enum`, `default`, tipi, formati e vincoli).
- **Plugin** — registra generatori personalizzati tramite `register()` o `use()`.

## Come funziona

```
OpenAPI document  ──normalize──▶  RequestIR  ──generator.generate()──▶  source code string
```

1. `normalize` risolve i `$ref`, unisce i parametri di percorso e operazione, sceglie il tipo di contenuto del corpo, genera valori di esempio, risolve gli schemi di sicurezza e produce un `RequestIR` normalizzato.
2. Il `Generator` selezionato riceve il `RequestIR` e restituisce una stringa di codice sorgente eseguibile.

In genere basta chiamare `generate({...})`, che esegue entrambi i passaggi.

## Esempio di base

```typescript
import { generate } from "@powerduck/openapi-codegen";

const code = generate({
  document,                 // parsed OpenAPI object
  path: "/users/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
});

console.log(code);          // a runnable fetch() snippet
```

## Passaggi successivi

- [Installazione](/docs/it-IT/openapi-codegen/installation/) — npm / yarn / pnpm e uso nel browser.
- [Guida rapida](/docs/it-IT/openapi-codegen/quickstart/) — Genera il primo frammento ed elenca i generatori.
- [Configurazione](/docs/it-IT/openapi-codegen/configuration/) — `GenerateOptions`, `RequestIR`, `Generator`, `Plugin`.
- [Riferimento API](/docs/it-IT/openapi-codegen/api-reference/) — Tutti gli export e l'elenco completo di linguaggi e client.
- [Esempi](/docs/it-IT/openapi-codegen/examples/) — fetch, Python requests, cURL, generatori personalizzati, plugin e `RequestIR` diretto.
