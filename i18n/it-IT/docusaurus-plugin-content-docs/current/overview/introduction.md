---
sidebar_position: 1
title: Introduzione
description: "Powerduck è una piattaforma API con IA integrata che privilegia il lavoro locale e si basa su un unico file YAML OpenAPI. Progetta, esegui il debug, testa, simula, documenta ed esponi strumenti MCP dallo stesso file, sul desktop, nel cloud o tramite librerie open source."
---

# Introduzione

Il modo in cui si sviluppano le API sta cambiando. Per vent'anni, l'**operatore** è stato una persona che usava un'interfaccia grafica e il **destinatario** di un contratto API è stato una persona che leggeva la documentazione. Ora entrambi i ruoli si stanno trasformando:

- L'operatore è sempre più spesso un **assistente IA** che traduce un'intenzione in azioni;
- Il destinatario è sempre più spesso un **agente IA** che richiama l'API come strumento tramite MCP.

Gli strumenti della fase precedente — client API, visualizzatori di specifiche e raccolte di richieste — erano pensati per una persona alla tastiera. Powerduck è progettato per questo nuovo contesto. Non è soltanto un client API migliore o un visualizzatore più curato: è una **piattaforma con IA integrata che parte da un unico file OpenAPI**.

## Il punto di partenza: un file OpenAPI locale

Tutto comincia da un semplice `openapi.yaml` nel tuo repository: un file aperto, sotto controllo di versione, leggibile sia dalle persone sia dall'IA. Non un database proprietario né un account cloud.

```text
                one local openapi.yaml
                         |
      you + AI -> design debug test mock docs data-model
                         |
                      MCP tools
                         |
               any AI coding agent
```

Quel file è il contratto. Ogni flusso di lavoro lo legge e può metterlo a disposizione di qualsiasi agente di programmazione tramite MCP. Tu, l'assistente integrato e gli agenti esterni condividete così un'unica fonte di verità. Quando progettazione, debug, test, mock e documentazione leggono lo stesso file, mantenere gli strumenti sincronizzati smette di essere un'attività a sé. È una conseguenza dell'architettura, non un lavoro aggiuntivo.

Powerduck usa OpenAPI 3.2 e legge i documenti 3.0 e 3.1 esistenti, oltre a Swagger 2.0, aggiornandoli direttamente. Le API non HTTP — SSE, WebSocket, GraphQL, gRPC e MCP — sono modellate come normali elementi dei percorsi tramite l'estensione `x-protocol`, senza essere forzate in una struttura esclusivamente REST.

## Lavorare con l'IA

- Apri un file YAML e l'assistente suggerisce subito cosa puoi farci;
- Descrivi un risultato in linguaggio naturale, per esempio «crea gli endpoint degli ordini», «prepara i dati di test» o «esegui il flusso di acquisto e produci un report»: l'assistente sceglie lo strumento adatto e propone la modifica;
- Ogni modifica viene presentata in una **scheda da esaminare** e viene applicata solo dopo la tua approvazione;
- Quando perfezioni un'API, l'assistente resta su quell'API e modifica soltanto ciò che hai chiesto, senza intervenire altrove nel documento;
- I file locali restano sul disco. L'IA remota invia il contesto pertinente al servizio di modelli che hai configurato, usando le relative credenziali. La pubblicazione su Cloud carica il contenuto selezionato. Le statistiche di utilizzo facoltative sono disattivate per impostazione predefinita e si gestiscono separatamente; per il lavoro locale non serve un account.

## Priorità al lavoro locale

Powerduck viene eseguito sul tuo computer, apre e salva file reali, funziona offline e mantiene chiavi API e prompt fuori dal browser. Il cloud è un'estensione facoltativa per condividere e pubblicare, non un requisito per iniziare.

## Tre modi per usare Powerduck

| Prodotto | Che cos'è | Ideale per |
|---|---|---|
| [**Client desktop**](/docs/it-IT/client/introduction/) | Un'applicazione Electron che privilegia il lavoro locale, con assistente IA e spazio di lavoro API completo | Sviluppatori che vogliono lavorare sul proprio computer, anche offline, mantenendo chiavi e prompt in locale |
| [**Powerduck Cloud**](/docs/it-IT/cloud/introduction/) | Un servizio per ospitare specifiche OAS, documentazione online e MCP gestito | Condividere API, pubblicare link stabili e fornire MCP senza gestire un server |
| [**Librerie open source**](/docs/it-IT/opensource/) | Pacchetti npm `@powerduck/*` combinabili tra loro | Creare strumenti personalizzati, pipeline CI o componenti da integrare |

I tre prodotti condividono gli stessi motori. Il client desktop e il cloud sono costruiti con le librerie open source: una funzionalità si comporta quindi allo stesso modo quando la esegui in locale, la richiami in rete o importi direttamente un pacchetto.

### Client desktop

Il [client desktop](/docs/it-IT/client/introduction/) viene eseguito interamente sul tuo computer. Apre e modifica file sul disco, invia richieste tramite un processo locale, esegue un mock locale e mantiene prompt IA e chiavi API fuori dalla console del browser. Puoi configurare liberamente il modello; ogni modifica proposta appare in una scheda da esaminare prima di essere applicata.

### Powerduck Cloud

[Powerduck Cloud](/docs/it-IT/cloud/introduction/) porta lo stesso flusso di lavoro online. Aggiungi un file, un repository Git o un URL, scegli le operazioni da esporre e ottieni link stabili alla documentazione e a un endpoint MCP gestito. Puoi proteggere l'accesso con una password di visualizzazione o una chiave di accesso MCP. I piani a pagamento aggiungono sincronizzazione Git, domini personalizzati e limiti più elevati.

### Librerie open source

Le [librerie](/docs/it-IT/opensource/) sono i motori alla base del prodotto: parser e strumento di aggiornamento OpenAPI, CLI multiprotocollo, generatore di codice, server MCP, esecutore di richieste, convertitori per cURL e Postman ed editor integrabili. Ogni libreria è pubblicata separatamente su npm, con la propria guida all'installazione e il riferimento API. Qui trovi i dettagli tecnici di basso livello.

## Cosa cambia nel tuo lavoro

- **Indichi il risultato, non la sequenza di clic.** Descrivi l'obiettivo e l'assistente lo realizza attraverso passaggi che puoi esaminare.
- **Le tue API sono pronte per gli agenti.** Lo stesso contratto genera sia documentazione sia strumenti MCP, così gli agenti IA possono chiamare correttamente la tua API fin dall'inizio.
- **Tutto resta allineato.** Progettazione, debug, test, mock e documentazione leggono un unico file.
- **Tutti i protocolli nello stesso posto.** HTTP, SSE, WebSocket, GraphQL, gRPC e MCP convivono in una specifica, anziché richiedere sei strumenti.
- **Nessun vincolo a un fornitore.** Scegli il tuo modello, conserva le chiavi in locale sul desktop e mantieni il controllo del file YAML nel repository.

## Come proseguire

- Sei all'inizio? Parti da [Installazione](/docs/it-IT/overview/installation/) e [Guida rapida](/docs/it-IT/overview/quickstart/).
- Vuoi lo spazio di lavoro locale completo? Leggi la [guida al client desktop](/docs/it-IT/client/introduction/).
- Vuoi pubblicare un'API online? Leggi la [guida al Cloud](/docs/it-IT/cloud/introduction/).
- Stai creando un'integrazione? Esplora le [librerie open source](/docs/it-IT/opensource/).
