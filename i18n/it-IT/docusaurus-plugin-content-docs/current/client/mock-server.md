---
sidebar_position: 7
title: "Server mock locale"
description: "Esegui un mock locale dell’API OpenAPI scegliendo porta, percorso di base, latenza e risposte personalizzate, e controlla le richieste ricevute."
---

# Server mock locale

Il server mock offre una versione funzionante dell’API direttamente dalla specifica. Lo sviluppo di frontend e client può quindi procedere prima che il backend esista, senza predisporre infrastrutture esterne. Il server viene eseguito nel processo principale dell’app desktop.

## Avviare un mock

Puoi avviare un mock dalla schermata Server mock o direttamente dalla chat con l’AI. Se lo avvii dalla chat, l’app conferma l’indirizzo su cui è in ascolto.

Sono disponibili le seguenti opzioni:

| Opzione | Intervallo / formato | Scopo |
|---|---|---|
| `port` | Intero `1`–`65535` | Porta locale su cui mettersi in ascolto |
| `basePath` | Prefisso del percorso URL | Pubblica il mock sotto un percorso di base |
| `latencyMs` | `0`–`10000` | Aggiunge latenza artificiale per simulare un ritardo di rete |
| `overrides` | Fino a 100 risposte personalizzate | Restituisce risposte specifiche per le operazioni selezionate |

Porte o valori di latenza non validi vengono rifiutati con un messaggio chiaro, anziché avviare un server non funzionante.

## Più mock contemporaneamente

Puoi eseguire più mock contemporaneamente, ad esempio uno per ogni documento aperto. L’app elenca i mock in esecuzione (`mock:list`) e può arrestarne uno singolarmente (`mock:stop`). Ogni mock è associato all’ID e al nome di un documento, così da poterlo distinguere dagli altri.

## Esaminare le richieste ricevute

Un mock registra le richieste che riceve. Puoi consultarle (`mock:requests`) impostando facoltativamente un limite e cancellare le registrazioni. È utile per verificare che un client abbia chiamato l’operazione corretta con i parametri previsti, anche senza un backend reale.

## Personalizzare le risposte

Quando l’esempio predefinito o la risposta ricavata dallo schema non bastano, puoi impostare una risposta specifica per un’operazione. Il numero di risposte personalizzate è limitato a 100 per mantenere la configurazione gestibile.

## Quando usarlo

- Proseguire lo sviluppo del frontend mentre il backend del contratto è ancora in costruzione;
- Riprodurre lentezza o casi limite regolando latenza e risposte;
- Mostrare un flusso API senza un ambiente distribuito;
- Verificare che i client generati chiamino le operazioni come previsto.

Il mock legge la stessa specifica degli altri strumenti e rimane quindi allineato al contratto quando il progetto cambia.

Vedi anche: [Test di scenario](/docs/it-IT/client/scenario-testing/), [Progettare con l’assistente](/docs/it-IT/client/design/).
