---
sidebar_position: 1
title: "Introduzione"
description: "Componente ad albero estensibile per la navigazione API, l’esplorazione degli schemi e la documentazione. Basato su un nucleo generico con adattatori per OpenAPI, JSON Schema e origini dati personalizzate."
keywords: ["tree", "powerduck", "React", "OpenAPI", "JSON Schema"]
---

# @powerduck/tree

Componente ad albero estensibile per la navigazione API, l’esplorazione degli schemi e la documentazione. Basato su un nucleo generico con adattatori per OpenAPI, JSON Schema e origini dati personalizzate.

- **Nome del pacchetto:** `@powerduck/tree`
- **Versione:** <img src="https://img.shields.io/npm/v/@powerduck/tree"/>
- **Licenza:** MIT

## Funzionalità

- **Nucleo generico** — `TreeNode<TMetadata>` funziona con qualsiasi origine dati
- **Adattatore OpenAPI** — Navigazione per tag con tag annidati OAS 3.2, `x-tagGroups`, `x-order`, `x-displayName` e `x-internal`
- **Adattatore JSON Schema** — Espansione approfondita di proprietà annidate, array e combinatori con metadati `jsonPath`
- **Adattatore per la documentazione** — Albero di documentazione in stile Stripe con badge del numero di operazioni
- **Componente React** — Ricerca, espansione e compressione, navigazione da tastiera, badge dei metodi e props di rendering personalizzato
- **Trascinamento** — Riordinamento sotto lo stesso genitore e spostamento in cartelle di altri livelli
- **Menu contestuale** — Azioni per nodo con clic destro o pulsante delle altre opzioni
- **Localizzazione imperativa** — `locateNode(predicate)` trova un nodo, espande i suoi antenati, lo seleziona e lo porta nell’area visibile
- **Integrazione JSON Patch** — Il callback `onPatch` emette operazioni RFC 6902
- **Temi tramite variabili CSS** — Compatibile con `tokens.css` di Powerduck e modalità chiara e scura

## Passaggi successivi

- [Installazione](/docs/it-IT/tree/installation/)
- [Guida rapida](/docs/it-IT/tree/quickstart/)
- [Riferimento API](/docs/it-IT/tree/api-reference/)
- [Esempi](/docs/it-IT/tree/examples/)
