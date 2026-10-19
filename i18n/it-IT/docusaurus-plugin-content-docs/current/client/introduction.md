---
sidebar_position: 1
title: "Client desktop"
description: "Il client desktop porta il flusso di lavoro basato sull'AI sul tuo computer. Apri un file openapi.yaml da un repository, descrivi ciò che vuoi ottenere e controlli il risultato: senza passare continuamente tra editor di specifiche, client HTTP, strumenti mock, generatori di documentazione e test runner, né creare un account cloud per iniziare."
---

# Client desktop

Il client desktop porta il flusso di lavoro basato sull'AI sul tuo computer. Apri un file `openapi.yaml` da un repository, descrivi ciò che vuoi ottenere e controlli il risultato: senza passare continuamente tra editor di specifiche, client HTTP, strumenti mock, generatori di documentazione e test runner, né creare un account cloud per iniziare.

Il controllo resta a te: l'assistente propone, tu approvi.

## Una giornata nell'area di lavoro

Il client è progettato intorno a queste attività.

- **Aprire una specifica e orientarsi.** L'assistente legge il documento corrente e suggerisce subito cosa fare: colmare lacune, completare la documentazione o verificare flussi.
- **Creare un'API.** Descrivi la risorsa e l'assistente propone gli endpoint. Continua a perfezionare la stessa operazione, aggiungendo parametri o modificando risposte e codici di stato, senza spostarti su parti estranee del documento.
- **Preparare dati di test.** Genera righe di esempio realistiche dagli schemi, così richieste e scenari possono usare valori concreti.
- **Eseguire una richiesta o un intero scenario.** Analizza una chiamata oppure concatena più endpoint in un flusso completo e ottieni un report condivisibile di successi ed errori.
- **Procedere anche senza backend.** Avvia un mock locale che risponde in base al contratto mentre il servizio reale è ancora in sviluppo.
- **Fornire l'API agli agenti di programmazione.** Trasforma la specifica in un server MCP affinché gli strumenti AI possano trovare e chiamare le operazioni con gli argomenti corretti.
- **Esaminare il database dietro l'API.** Ricava tabelle, relazioni e SQL dalla specifica, confrontali con un database reale e individua le modifiche necessarie.
- **Cambiare impostazioni senza uscire dalla chat.** Chiedi di cambiare tema o lingua, impostare un proxy o gestire le variabili d'ambiente.

## Le viste e il loro scopo

Un solo documento alimenta tutte le viste, accessibili tramite un selettore compatto.

| Vista | Utilizzo |
|---|---|
| [**Specifica**](./design.md) | La vista principale: chat AI, documento e anteprima in tempo reale |
| [**Area richieste**](./debug.md) | Inviare ed esaminare richieste HTTP reali con schede e ambienti |
| [**Test di scenario**](./scenario-testing.md) | Concatenare endpoint in flussi, eseguirli e ottenere report |
| [**Documentazione**](./protocols.md) | Leggere la specifica come documentazione API renderizzata |
| [**MCP**](./protocols.md) | Esaminare e usare il server MCP ricavato dalla specifica |
| [**Server mock**](./mock-server.md) | Eseguire un mock locale dell'API durante lo sviluppo |
| [**Modello dati**](./data-model.md) | Ricavare tabelle e relazioni, confrontarle con un database e generare SQL |
| [**Impostazioni**](./settings.md) | Tema, lingua, proxy, certificati e preferenze dell'area di lavoro |

## Come collabori con l'assistente

Descrivi l'obiettivo in linguaggio naturale; l'assistente sceglie la funzione adatta, un motore deterministico la convalida e tu approvi tramite una scheda. Il modello non modifica mai il documento autonomamente.

- Le modifiche alla specifica arrivano come **schede di patch** con operazioni granulari; modificare un'operazione esistente interviene solo sul campo richiesto;
- Le azioni di sola lettura, come elencare operazioni, ottenere uno schema o eseguire una query, restituiscono i fatti su cui l'assistente basa la risposta;
- Le azioni di scrittura chiedono conferma prima di essere eseguite.

Il modello è **configurabile da te**: collega l'app a un fornitore compatibile con OpenAI e selezionalo nelle impostazioni. Vedi [AI e modelli](./ai-models.md).

## Perché lavorare prima di tutto in locale

- **I tuoi file reali.** L'app apre, modifica e salva i file effettivi sul disco, tenendo traccia delle modifiche locali.
- **Nessun ostacolo CORS.** Le richieste passano dal processo locale, non dalla vista web, quindi le restrizioni tra origini non bloccano le chiamate.
- **Scegli tu l'endpoint del modello.** Il desktop invia le richieste tramite il processo principale, ma prompt, contesto pertinente e credenziali raggiungono comunque il fornitore configurato. Privilegiare il lavoro locale non significa che le richieste AI remote non trasmettano dati.
- **Funziona offline.** Progettazione, mock e documentazione non richiedono rete; serve per richieste reali, sincronizzazione Git o modelli ospitati.
- **Esecuzione locale.** Mock, test di scenario, accesso ai database e terminale vengono eseguiti sul tuo computer.

## Licenza desktop

Il client desktop viene venduto con una **licenza perpetua a pagamento unico**: lo acquisti una volta e puoi lavorare offline senza account. La chiave viene generata all'acquisto e mostrata una sola volta. La licenza è separata da Powerduck Cloud, il servizio di hosting in abbonamento mensile. Vedi [Fatturazione cloud](../cloud/billing.md).

## Da dove iniziare

- [Progettare con l'assistente](./design.md)
- [Area richieste e ambienti](./debug.md)
- [Test di scenario e report](./scenario-testing.md)
- [Protocolli](./protocols.md)
- [Modello dati e diagramma ER](./data-model.md)
- [Server mock](./mock-server.md)
- [AI e modelli](./ai-models.md)
- [Impostazioni](./settings.md)
