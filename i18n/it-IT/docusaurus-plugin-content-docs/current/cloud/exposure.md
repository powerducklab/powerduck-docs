---
sidebar_position: 4
title: Operazioni esposte
description: "Scegli quali operazioni rendere pubbliche senza modificare il documento originale. Raggruppale per tag, cercale e attivale singolarmente o in gruppo."
---

# Operazioni esposte

Non tutte le operazioni di una specifica devono essere pubbliche. Endpoint amministrativi, strumenti interni e operazioni ancora in bozza devono spesso restare nel documento, ma non comparire nella documentazione pubblicata o in MCP. La configurazione delle operazioni esposte rende esplicita questa scelta **senza modificare il documento originale**.

## Come funziona

La configurazione viene salvata separatamente dalla specifica. Ogni voce identifica un’operazione e ne registra lo stato di attivazione:

- se presente, viene preferito l’`operationId`;
- vengono salvati anche `method` e `path`, per la validazione e per le specifiche prive di identificatori delle operazioni.

Il documento originale rimane invariato. Documentazione e MCP vengono generati combinando la specifica con l’elenco delle operazioni abilitate. Disattivare un’operazione la rimuove dalle interfacce pubblicate, senza eliminarla dal file.

## L’interfaccia di selezione

L’interfaccia è pensata anche per specifiche di grandi dimensioni:

- **Ricerca** — filtra per metodo, percorso, riepilogo o tag;
- **Raggruppamento per tag** — usa il tag principale; le operazioni senza tag finiscono in un gruppo dedicato;
- **Attivazione singola** — abilita o disabilita un’operazione;
- **Azioni per gruppo** — abilita o disabilita tutte le operazioni di un tag;
- **Selezione di tutti i risultati filtrati** — la casella globale agisce sulle operazioni che corrispondono alla ricerca corrente.

Ogni operazione occupa una sola riga, così il suo stato rimane chiaro anche quando ha più tag.

## Un punto di partenza pratico

Un approccio semplice consiste nell’abilitare tutto e poi disabilitare ciò che non deve essere pubblico:

- endpoint interni e amministrativi, ad esempio gestione utenti o controlli di stato interni;
- operazioni ancora in fase di progettazione;
- endpoint destinati esclusivamente al debug locale.

Poiché la selezione è indipendente dal documento, puoi aggiornarla mentre l’API evolve senza modificare la specifica.

## Rapporto con la pubblicazione

La selezione decide **quali operazioni** mostrare. Altri controlli determinano **se il documento è raggiungibile**:

- il documento deve essere `ACTIVE`;
- documentazione e MCP hanno ciascuno un’impostazione di attivazione;
- l’accesso può richiedere una password di visualizzazione per la documentazione o una chiave di accesso per MCP.

Consulta [Controllo degli accessi](/docs/it-IT/cloud/access-control/) per conoscere tutti i controlli.

## Limiti dei piani

Ogni piano limita il numero di operazioni esposte:

- **Free** — fino a 10;
- **Pro** — fino a 1.000;
- **Team** — fino a 10.000.

Vedi anche: [Controllo degli accessi](/docs/it-IT/cloud/access-control/), [Documenti e versioni](/docs/it-IT/cloud/documents-versions/).
