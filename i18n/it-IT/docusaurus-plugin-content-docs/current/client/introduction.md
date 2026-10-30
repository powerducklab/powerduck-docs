---
sidebar_position: 1
title: "Client desktop"
description: "Il client desktop porta il flusso di lavoro basato sull'AI sul tuo computer. Apri un file openapi.yaml da un repository, descrivi ciò che vuoi ottenere e controlli il risultato: senza passare continuamente tra editor di specifiche, client HTTP, strumenti mock, generatori di documentazione e test runner, né creare un account cloud per iniziare."
---

# Client desktop

Powerduck, incluso il desktop, richiede l’accesso con Google OAuth o GitHub. I file restano sul disco. L’analisi IA invia il contesto selezionato ai fornitori gestiti da Powerduck. URL di modelli e chiavi API personalizzate non sono più supportati.

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

Powerduck, incluso il desktop, richiede l’accesso con Google OAuth o GitHub. I file restano sul disco. L’analisi IA invia il contesto selezionato ai fornitori gestiti da Powerduck. URL di modelli e chiavi API personalizzate non sono più supportati.

## Perché lavorare prima di tutto in locale

Powerduck, incluso il desktop, richiede l’accesso con Google OAuth o GitHub. I file restano sul disco. L’analisi IA invia il contesto selezionato ai fornitori gestiti da Powerduck. URL di modelli e chiavi API personalizzate non sono più supportati.

## Powerduck · Free / Pro / Max

Free: 300.000 credits al giorno, ripristinati alle 00:00 UTC. Pro: 39 $/mese e 18.000.000 credits ogni 7 giorni. Max: 99 $/mese e 60.000.000 credits ogni 7 giorni. Il ciclo parte dall’inizio originale dell’abbonamento, separato dalla fatturazione mensile. Nessun riporto. Desktop e AI Chat condividono il piano personale; licenze perpetue e chiavi di attivazione non sono più vendute.

## Da dove iniziare

- [Progettare con l'assistente](./design.md)
- [Area richieste e ambienti](./debug.md)
- [Test di scenario e report](./scenario-testing.md)
- [Protocolli](./protocols.md)
- [Modello dati e diagramma ER](./data-model.md)
- [Server mock](./mock-server.md)
- [AI e modelli](./ai-models.md)
- [Impostazioni](./settings.md)
