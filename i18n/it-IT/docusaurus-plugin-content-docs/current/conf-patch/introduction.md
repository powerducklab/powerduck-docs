---
sidebar_position: 1
title: "@powerduck/conf-patch"
description: "@powerduck/conf-patch modifica le configurazioni con un’architettura a due livelli. Applica la semantica RFC 6902 JSON Patch alle stringhe JSON, JSONC e YAML, conserva commenti e formattazione e offre scritture atomiche e blocchi tra processi per Node.js ed Electron."
---

# @powerduck/conf-patch

**@powerduck/conf-patch** modifica le configurazioni con un’**architettura a due livelli**. Applica la semantica [RFC 6902 JSON Patch](https://datatracker.ietf.org/doc/html/rfc6902) alle stringhe JSON, JSONC e YAML, conserva commenti e formattazione e offre scritture atomiche e blocchi tra processi per Node.js ed Electron.

- **Versione:** <img src="https://img.shields.io/npm/v/@powerduck/conf-patch"/>
- **Licenza:** MIT
- **Requisito Node.js:** `>= 22.12.0`
- **Codice sorgente:** [github.com/powerducklab/conf-patch](https://github.com/powerducklab/conf-patch)

---

## Perché conf-patch?

Modificare file di configurazione via codice richiede spesso una scelta: serializzare l’intero documento, rischiando di alterare commenti e formattazione, oppure ricorrere a fragili manipolazioni del testo. conf-patch offre:

- **Modifiche incrementali che conservano i commenti** per JSON/JSONC con `jsonc-parser` e modifiche dell’AST per YAML con `yaml`. JSON/JSONC evita la serializzazione completa; YAML serializza nuovamente l’AST modificato.
- **Scritture atomiche** tramite un file temporaneo seguito da una rinomina, evitando file di destinazione scritti solo in parte.
- **Blocchi tra processi** con token di proprietà, attese esponenziali tra i tentativi e recupero dei blocchi obsoleti.
- **Un’API versatile:** il livello principale funziona anche nei browser, nelle funzioni Edge e nelle applicazioni con archiviazione IndexedDB.

---

## Architettura a due livelli

```
┌──────────────────────────────────────────────────────────────┐
│                     Application code                          │
├──────────────────────────────────────────────────────────────┤
│  File layer (Node.js / Electron only)                         │
│  ┌───────────────┐ ┌────────────────┐ ┌──────────────────┐  │
│  │ readConfigFile │ │ writeConfigFile│ │ patchConfigFile   │  │
│  │ setConfigValue │ │ deleteConfig…  │ │ withFileLock     │  │
│  └──────┬────────┘ └───────┬────────┘ └────────┬─────────┘  │
│         │                  │                   │            │
│  ┌──────▼──────────────────▼───────────────────▼───────────┐ │
│  │           Core layer (browser-safe, zero Node deps)      │ │
│  │  patchContent   setContentValue   deleteContentValue     │ │
│  └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### Livello principale — `@powerduck/conf-patch/core` (compatibile con il browser)

Funzioni pure che operano su **stringhe**, senza `node:fs`, `node:path` o API specifiche di Node.js. Questo sottopercorso può essere incluso nel codice per browser, funzioni Edge o service worker.

| Funzione | Scopo |
|---|---|
| [`patchContent`](../api-reference/#patchcontent) | Applicare operazioni RFC 6902 a una stringa di configurazione |
| [`setContentValue`](../api-reference/#setcontentvalue) | Impostare o creare un valore annidato (con `add`) |
| [`deleteContentValue`](../api-reference/#deletecontentvalue) | Rimuovere una chiave o un elemento di array (con `remove`) |

### Livello file — `@powerduck/conf-patch` (Node.js / Electron)

Funzioni asincrone che leggono e scrivono file, aggiungendo scritture atomiche e blocchi al livello principale.

| Funzione | Scopo |
|---|---|
| [`readConfigFile`](../api-reference/#readconfigfile) | Leggere testo UTF-8 da un percorso o da un URL `file://` |
| [`writeConfigFile`](../api-reference/#writeconfigfile) | Scrivere contenuti in modo atomico, con blocco facoltativo |
| [`patchConfigFile`](../api-reference/#patchconfigfile) | Eseguire una transazione di lettura, modifica e scrittura sotto blocco |
| [`setConfigValue`](../api-reference/#setconfigvalue) | Impostare un valore annidato in un file |
| [`deleteConfigValue`](../api-reference/#deleteconfigvalue) | Eliminare un valore annidato da un file |
| [`withFileLock`](../api-reference/#withfilelock) | Eseguire un’attività sotto blocco esclusivo |
| [`releaseAllLocalLocks`](../api-reference/#releasealllocallocks) | Rilasciare tutti i blocchi del processo corrente |

---

## Formati supportati

| Formato | Estensione | Comportamento |
|---|---|---|
| **JSON** | `.json` | JSON standard. Modifiche incrementali con `jsonc-parser`. |
| **JSONC** | `.jsonc` | JSON con commenti e virgole finali. I commenti vengono conservati. |
| **YAML** | `.yaml`, `.yml` | YAML 1.2. Le modifiche dell’AST conservano commenti, ancore e rientri. |

[`detectFormat`](../api-reference/#detectformat) associa le estensioni a un [`ConfigFormat`](../api-reference/#configformat). Le altre estensioni generano un errore, salvo specificare esplicitamente `format`.

---

## Operazioni RFC 6902

conf-patch implementa un sottoinsieme mirato di RFC 6902. Sono supportate soltanto queste operazioni:

| `op` | Comportamento |
|---|---|
| `"add"` | Inserire a un indice di array o aggiungere/sostituire una proprietà di oggetto |
| `"replace"` | Sostituire un valore esistente; il percorso deve esistere |
| `"remove"` | Rimuovere una chiave o un elemento esistente; il percorso deve esistere |

:::caution
`"move"`, `"copy"` e `"test"` **non sono supportati**. Il tipo [`JsonPatchOp`](../api-reference/#jsonpatchop) limita `op` a `"add" | "replace" | "remove"`.
:::

Note sul comportamento:

- `add` a un indice di array **inserisce** un elemento (RFC 6902). Per sostituire un elemento esistente, usare `replace`.
- `add` richiede che il percorso padre esista già. Creare i genitori prima dei figli.
- `replace` e `remove` richiedono che il percorso di destinazione esista.
- Con `strict: true` (predefinito), un’operazione non riuscita genera un’eccezione. Con `strict: false`, viene saltata e viene registrato un avviso.

---

## Conservazione di commenti e formattazione

- **JSON/JSONC:** le modifiche vengono calcolate come intervalli di testo a partire dall’albero sintattico, conservando commenti circostanti, virgole finali e rientri.
- **YAML:** l’AST di `yaml` viene modificato sul posto e serializzato nuovamente, conservando commenti, ancore, alias e rientri.

---

## Validazione OpenAPI

conf-patch valida documenti OpenAPI/Swagger tramite un’interfaccia protetta per `@powerduck/openapi-parser`:

- [`validateOpenAPISpec`](../api-reference/#validateopenapispec) valida contenuti grezzi JSON o YAML.
- [`validateOpenAPIFile`](../api-reference/#validateopenapifile) valida un documento dal suo percorso.
- La gestione degli input impone limiti di dimensione, restrizioni sui percorsi (`allowedRootDirectory`), controlli di complessità, scadenze e annullamento con `AbortSignal`.
- Gli errori generano [`OpenApiValidationError`](../api-reference/#openapivalidationerror) con un `code` interpretabile dal programma.

---

## Passi successivi

- [Installazione](../installation/) — aggiungere conf-patch e conoscere i due punti di ingresso.
- [Avvio rapido](../quickstart/) — modificare una stringa nel browser e un file su disco.
- [Riferimento API](../api-reference/) — tutte le esportazioni, i tipi e le opzioni.
- [Esempi](../examples/) — esempi eseguibili per JSON, YAML, JSONC, validazione OpenAPI e blocchi.
