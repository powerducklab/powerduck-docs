---
sidebar_position: 6
title: "Modello dati e diagramma ER"
description: "L'area Modello dati collega il contratto API al database. Può ricavare un modello relazionale completo dagli schemi OpenAPI, confrontarlo con un database esistente e aiutarti a mantenerli allineati quando cambia uno dei due, con un diagramma ER per una visione d'insieme."
---

# Modello dati e diagramma ER

L'area Modello dati collega il contratto API al database. Può ricavare un modello relazionale completo dagli schemi OpenAPI, confrontarlo con un database esistente e aiutarti a mantenerli allineati quando cambia uno dei due, con un diagramma ER per una visione d'insieme.

Sono supportati entrambi i punti di partenza:

- **Non esistono ancora tabelle.** Ricava tabelle, colonne, chiavi esterne e tabelle di relazione direttamente dalle API correnti, insieme al codice SQL per crearle.
- **Esiste già un database.** Leggi le tabelle effettive e i vincoli di chiave esterna applicati, confrontali con il modello implicato dalle API e individua corrispondenze e differenze.

## Confronto su quattro livelli

Il confronto (`datamodel.reconcile`) restituisce i dati di riferimento in quattro livelli:

| Livello | Contenuto |
|---|---|
| **Osservato** | Tabelle del database senza corrispondenza nel modello e chiavi esterne presenti solo nel database o applicate come vincoli |
| **Modellato** | Stato di ogni tabella (`missing`, `drift`, `matched`, `extra`), coppie di colonne del modello e del database, differenze per campo, operazioni API interessate e relazioni modellate |
| **Proposto** | Piano di migrazione ordinato e additivo, con dipendenze `blockedBy` e SQL per ogni passaggio |
| **Inferito** | Tabelle di collegamento molti-a-molti derivate automaticamente, questioni aperte e controlli di salvaguardia |

Il modello basa ogni tabella, colonna, relazione e istruzione su questo risultato, senza inventare DDL.

### Stato delle tabelle

- **Mancante (nuova)**: prevista dalle API ma assente dal database;
- **Divergente**: presente in entrambi, ma con colonne o vincoli diversi;
- **Corrispondente**: presente e coerente;
- **Aggiuntiva**: esiste nel database ma non è prevista dalle API correnti.

## Tabelle di relazione e indici derivati

Non devi modellare manualmente le tabelle di collegamento. Se gli schemi implicano una relazione molti-a-molti, per esempio tra le risorse `user` e `product`, il livello **inferito** ricava la tabella di relazione e gli indici pertinenti, senza fermarsi alle due tabelle di base. Gli indici secondari sono inclusi nell'SQL generato.

Se la logica applicativa non può essere dedotta in modo univoco, il risultato presenta una questione aperta invece di fare supposizioni; i controlli segnalano ciò che richiede una revisione umana.

## Diagramma ER

La vista ER rappresenta il modello come un grafo, rendendo immediatamente visibili relazioni e chiavi esterne senza doverle ricostruire da un elenco di tabelle:

- Le tabelle sono nodi, disposti automaticamente per ridurre gli incroci tra collegamenti;
- Le relazioni di chiave esterna sono rappresentate da collegamenti;
- Lo stato dei nodi riflette l'esito del confronto: nuova, divergente, corrispondente o aggiuntiva;
- Un pannello laterale elenca i passaggi concreti di migrazione, `create_table`, `alter_table` e gli elementi da rivedere, con l'SQL della tabella selezionata.

Ottieni così una visione generale dello schema e un percorso preciso e ordinato per allineare il database.

## Analisi dell'impatto in entrambe le direzioni

Poiché il modello conosce sia le operazioni API sia le tabelle, gli effetti dei cambiamenti sono visibili:

- **Quando cambia un'API**, il confronto individua le tabelle interessate, sia quelle esistenti che divergono sia quelle da aggiungere, con il relativo SQL;
- **Quando cambia il database**, vengono evidenziate le operazioni che accedono alle tabelle interessate.

Dopo aver modificato uno dei due, puoi **aggiornare e ripetere il confronto** finché modello e database corrispondono.

## Script di distribuzione

Per un database nuovo, `datamodel.deploymentScript` produce un unico script SQL idempotente, che procede solo in avanti:

- `CREATE TABLE IF NOT EXISTS` nell'ordine delle dipendenze delle chiavi esterne;
- Indici secondari;
- Righe di esempio deterministiche facoltative, da 0 a 50, con valore predefinito 0; le tabelle di relazione non vengono mai popolate.

Per un database esistente usa invece il confronto, che produce istruzioni `ALTER` additive in un piano di migrazione ordinato.

## Connessioni ai database

Le connessioni vengono salvate come profili con ID, nome, dialetto, host, porta, utente e database; le password non vengono mai restituite. I dialetti supportati sono **MySQL**, **SQL Server** e **Oracle**.

- `database.runSelect` esegue una `SELECT` di sola lettura su un profilo salvato, restituendo un insieme limitato e troncato di righe; scritture e DDL sono bloccati;
- `database.prefillConnection` apre la finestra per una nuova connessione con i dettagli forniti già compilati, così inserisci personalmente la password anziché passarla in un prompt.

## SQL generato, mai eseguito automaticamente

In quest'area l'SQL viene **prodotto per la revisione**, non eseguito sul database. Decidi tu quando e come applicarlo; l'accesso in sola lettura protegge i dati esistenti. Puoi quindi esplorare e perfezionare il modello prima di intervenire sul database.

Vedi anche: [Protocolli](./protocols.md), [Area di lavoro delle richieste](./debug.md), [Impostazioni](./settings.md).
