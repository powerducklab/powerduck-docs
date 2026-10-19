---
sidebar_position: 1
title: "Introduzione"
description: "Componente di documentazione OpenAPI per React pronto per la produzione. Passa un documento OAS per ottenere un’interfaccia completa in stile Stripe, con navigazione nell’intestazione, temi chiaro e scuro, albero di navigazione, monitoraggio dello scorrimento, esplorazione degli schemi ed esempi di codice in più linguaggi."
keywords: ["oas-document", "powerduck", "React", "OpenAPI"]
---

# @powerduck/oas-document

Componente di documentazione OpenAPI per React pronto per la produzione. Passa un documento OAS per ottenere un’interfaccia completa in stile Stripe, con navigazione nell’intestazione, temi chiaro e scuro, albero di navigazione, monitoraggio dello scorrimento, esplorazione degli schemi ed esempi di codice in più linguaggi.

- **Nome del pacchetto:** `@powerduck/oas-document`
- **Versione:** <img src="https://img.shields.io/npm/v/@powerduck/oas-document"/>
- **Licenza:** MIT

Librerie utilizzate: `@powerduck/openapi-parser` (validazione e conversione automatica), `@powerduck/tree` (navigazione), `@powerduck/md-editor` (rendering Markdown), `@powerduck/openapi-codegen` (generazione del codice delle richieste).

## Funzionalità

- **Documentazione API pronta da integrare** — Accetta un oggetto analizzato, una stringa JSON o una stringa YAML
- **Layout in stile Stripe** — Intestazione configurabile, albero laterale e vista delle operazioni su due colonne
- **Temi chiaro e scuro** — Selezionabili nell’intestazione, con scelta salvata in localStorage
- **Conversione automatica a OAS 3.2** — Valida e converte tramite `@powerduck/openapi-parser`
- **Navigazione sincronizzata con lo scorrimento** — Listener di scorrimento passivo con ricerca binaria
- **rendering Markdown** — Descrizioni visualizzate tramite `@powerduck/md-editor`
- **Esempi di codice in più linguaggi** — Generati tramite `@powerduck/openapi-codegen`
- **Esplorazione degli schemi** — Tabelle di proprietà annidate espandibili e comprimibili
- **Layout adattivo** — Sui dispositivi mobili la barra laterale diventa un pannello sovrapposto

## Passaggi successivi

- [Installazione](/docs/it-IT/oas-document/installation/)
- [Guida rapida](/docs/it-IT/oas-document/quickstart/)
- [Riferimento API](/docs/it-IT/oas-document/api-reference/)
- [Esempi](/docs/it-IT/oas-document/examples/)
