---
title: "Generare OpenAPI da un progetto esistente"
description: "Generare OpenAPI da un progetto esistente"
---

# Generare OpenAPI da un progetto esistente

Nell’app desktop, scegli **Analizza il codice per generare OpenAPI** (Beta), seleziona una cartella sorgente locale e premi **Avvia analisi**. Inizia da un servizio piccolo. Controlla route, parametri e risposte rilevati prima di adottare la specifica generata.

Un’analisi statica può lasciare sconosciuti gli schemi delle risposte se i gestori dipendono da codice dinamico o da dipendenze non disponibili. “Conferma manualmente” registra la tua revisione, ma non ricostruisce i tipi mancanti. Modifica il contratto API sulla base di elementi verificabili oppure chiedi all’IA di esaminare il gestore selezionato. Questa azione invia il codice scelto e il suo contesto al fornitore del modello configurato.

Salva il risultato in un nuovo file. Non sostituire un contratto esistente senza esaminare le modifiche. Poi esegui l’[esempio di contratto](/docs/it-IT/client/contract-example/) contro un backend in esecuzione, oppure collega un [agente di programmazione](/docs/it-IT/client/coding-agent/). Un’analisi riuscita non dimostra che l’implementazione rispetti il contratto.

Questo flusso è disponibile solo nell’app desktop; i linguaggi e i framework supportati variano in base all’analizzatore. L’analisi statica non richiede una chiave del modello. Considera i risultati non risolti come sconosciuti, non come fatti dedotti.

[Scarica l’app desktop](https://www.powerduck.com/it-IT/download/) · [Guida rapida](https://www.powerduck.com/docs/it-IT/overview/quickstart/)
