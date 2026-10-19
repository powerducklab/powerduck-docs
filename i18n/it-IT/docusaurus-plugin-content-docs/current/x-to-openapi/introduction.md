---
sidebar_position: 1
title: "@powerduck/x-to-openapi"
description: "@powerduck/x-to-openapi è un framework TypeScript estensibile che converte comandi curl e raccolte Postman (v2.0 / v2.1.0) in documenti OpenAPI 3.2. È pensato per pipeline CI, generazione di documentazione API e ricostruzione delle interfacce a partire da richieste HTTP."
---

# @powerduck/x-to-openapi

**@powerduck/x-to-openapi** è un framework TypeScript estensibile che converte **comandi curl** e **raccolte Postman (v2.0 / v2.1.0)** in documenti **OpenAPI 3.2**. È pensato per pipeline CI, generazione di documentazione API e ricostruzione delle interfacce a partire da richieste HTTP.

Usa [`@powerduck/openapi-parser`](https://www.npmjs.com/package/@powerduck/openapi-parser) per validare i documenti.

- **Versione:** <img src="https://img.shields.io/npm/v/@powerduck/x-to-openapi"/>
- **Licenza:** MIT
- **Requisito Node.js:** `>= 22.12.0`
- **Output:** solo OpenAPI **3.2.0**
- **Codice sorgente:** [github.com/powerducklab/x-to-openapi](https://github.com/powerducklab/x-to-openapi)

---

## Come funziona

```text
comando curl → CurlAdapter
raccolta Postman → PostmanAdapter
             ↓
     NormalizedRequest[]
             ↓
     buildOpenApi32() → documento OpenAPI 3.2
             ↓
     validateOpenApi32() → diagnostiche
```

1. Un **adattatore** analizza la sorgente, come testo curl o una raccolta Postman, e produce un elenco di oggetti [`NormalizedRequest`](./api-reference.md#normalizedrequest).
2. Il **generatore** unisce le richieste per metodo e percorso, deduce schemi, parametri di percorso e sicurezza, e produce un documento OpenAPI 3.2.
3. Il **validatore** verifica l’output rispetto allo schema OpenAPI tramite `@powerduck/openapi-parser` e restituisce diagnostiche.

---

## Funzionalità

- **Due adattatori integrati:** [`CurlAdapter`](./api-reference.md#curladapter) gestisce comandi singoli, batch e l’output «Copy all as cURL» del browser; [`PostmanAdapter`](./api-reference.md#postmanadapter) supporta v2.0/v2.1.0, cartelle annidate e autenticazione ereditata.
- **Funzioni senza configurazione:** [`curlToOpenApi`](./api-reference.md#curltoopenapi) e [`postmanToOpenApi`](./api-reference.md) registrano l’adattatore e convertono in una chiamata.
- **Output OpenAPI 3.2:** ogni documento dichiara `openapi: "3.2.0"`. La validazione è attiva per impostazione predefinita. Controllare le diagnostiche o attivare la modalità rigorosa per rifiutare gli errori.
- **Unione di richieste:** le operazioni con metodo e percorso uguali vengono combinate; parametri di query, intestazioni, cookie e schemi del corpo vengono uniti strutturalmente.
- **Deduzione dei parametri di percorso:** ID numerici, UUID, ULID e lunghi segmenti esadecimali diventano modelli come `/users/{userId}` quando variano in almeno N campioni.
- **Deduzione della sicurezza:** rileva Bearer, Basic e chiavi API in intestazioni, query o cookie e genera i relativi `securitySchemes`.
- **Diversi tipi di corpo:** JSON, XML, form-urlencoded, multipart/form-data con testo e file, GraphQL, testo e dati binari.
- **Conservazione dei test Postman:** `pm.test()` / `pm.expect()` vengono inclusi come `x-postman-scripts` in ogni operazione.
- **Diagnostiche:** ogni problema include gravità, codice e dettagli della sorgente quando disponibili; la modalità [`strict`](./api-reference.md#convertoptions) genera eccezioni in caso di errore.
- **Estensibile:** implementare [`SourceAdapter`](./api-reference.md) per aggiungere sorgenti HAR, HTTPie o Insomnia.

---

## Architettura dei plugin

Il framework si basa su una piccola interfaccia per gli adattatori:

```typescript
interface SourceAdapter<I = unknown> {
  readonly id: string;                       // e.g. "curl", "postman", "har"
  canHandle?(input: unknown): boolean;       // used by "auto" detection
  parse(input: I, context: AdapterContext): Promise<NormalizedRequest[]>;
}
```

Gli adattatori vengono registrati su un’istanza [`XToOpenApi`](./api-reference.md#xtoopenapi) tramite [`AdapterRegistry`](./api-reference.md#adapterregistry):

```typescript
const converter = new XToOpenApi()
  .register(new CurlAdapter())
  .register(new PostmanAdapter());

// Explicit source id:
await converter.convert("curl", curlText);

// Auto-detect via canHandle():
await converter.convert("auto", someInput);
```

Le funzioni senza configurazione includono già entrambi gli adattatori: in genere non serve usare direttamente il registro.

---

## Funzioni di utilità o classe?

| Caso d’uso | API |
|---|---|
| Convertire un comando curl o un batch | [`curlToOpenApi`](./api-reference.md#curltoopenapi) |
| Convertire una raccolta Postman come oggetto o stringa | [`postmanToOpenApi`](./api-reference.md) |
| Opzioni personalizzate, più adattatori, rilevamento `"auto"` o adattatore personalizzato | [`new XToOpenApi()`](./api-reference.md#xtoopenapi) |

---

## Passi successivi

- [Installazione](./installation.md) — aggiungere il pacchetto e conoscere le funzioni senza configurazione.
- [Avvio rapido](./quickstart.md) — convertire comandi curl e raccolte Postman, poi usare un adattatore personalizzato.
- [Riferimento API](./api-reference.md) — tutte le esportazioni, i tipi, le opzioni, i valori predefiniti e i codici diagnostici.
- [Esempi](./examples.md) — curl, batch di comandi, raccolte Postman, adattatori personalizzati e deduzione dei percorsi.
