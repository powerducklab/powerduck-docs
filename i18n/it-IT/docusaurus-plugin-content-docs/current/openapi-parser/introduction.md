---
sidebar_position: 1
title: "Introduzione"
description: "Converti qualsiasi documento Swagger 2.0, OpenAPI 3.0, 3.1 o 3.2 in OpenAPI 3.2 con una sola chiamata."
keywords: ["openapi-parser", "powerduck", "Swagger", "OpenAPI 3.2"]
---

# @powerduck/openapi-parser

Converti qualsiasi documento Swagger 2.0, OpenAPI 3.0, 3.1 o 3.2 in OpenAPI 3.2 con una sola chiamata.

Un sottile livello di integrazione per queste due librerie: [`@scalar/openapi-parser`](https://github.com/scalar/openapi-parser), [`@scalar/openapi-upgrader`](https://github.com/scalar/openapi-parser/tree/main/packages/openapi-upgrader).
Non reimplementa l’analisi, la validazione o la conversione; le collega e assegna a ogni errore una struttura uniforme e prevedibile, con un codice leggibile automaticamente.

- **Nome del pacchetto:** `@powerduck/openapi-parser`
- **Versione:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-parser"/>
- **Licenza:** MIT
- **Node.js:** >= 22.12.0

## Funzionalità

- **Una funzione per tutte le versioni** — Swagger 2.0, OpenAPI 3.0.x, 3.1.x e 3.2.x vengono convertiti in un documento 3.2 validato.
- **Input come stringa JSON o YAML** — Passa un oggetto già analizzato o una stringa JSON/YAML non elaborata.
- **Codici di errore leggibili automaticamente** — Ogni errore genera un `OpenApiUpgradeError` con un valore dell’enumerazione `UpgradeErrorCode`.
- **Nessuna modifica dell’input** — L’input viene copiato in profondità tramite `structuredClone` prima di qualsiasi fase della conversione.
- **Protezione dai riferimenti circolari** — Rileva cicli nell’input prima che provochino un overflow dello stack.
- **Validazione dell’output** — Il documento 3.2 convertito viene validato rispetto allo schema per impostazione predefinita.
- **ESM e CJS** — Usa `import` in Node moderno e nei bundler, e `require()` nel processo principale di Electron.

## Passaggi successivi

- [Installazione](/docs/it-IT/openapi-parser/installation/) — installazione e requisiti
- [Guida rapida](/docs/it-IT/openapi-parser/quickstart/) — converti il tuo primo documento
- [Riferimento API](/docs/it-IT/openapi-parser/api-reference/) — tutte le esportazioni, i codici di errore e le opzioni
- [Esempi](/docs/it-IT/openapi-parser/examples/) — gestione degli errori, opzioni e uso con CommonJS
