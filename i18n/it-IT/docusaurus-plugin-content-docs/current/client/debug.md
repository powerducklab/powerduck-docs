---
sidebar_position: 3
title: "Area richieste e ambienti"
description: "L'area richieste trasforma un'operazione progettata in una chiamata reale. Invia la richiesta tramite il processo principale locale, mostra la risposta e usa ambienti e variabili per i valori che cambiano tra un'esecuzione e l'altra."
---

# Area richieste e ambienti

L'area richieste trasforma un'operazione progettata in una chiamata reale. Invia la richiesta tramite il processo principale locale, mostra la risposta e usa ambienti e variabili per i valori che cambiano tra un'esecuzione e l'altra.

## Inviare una richiesta

1. Apri un'operazione nell'area richieste. Metodo, percorso, parametri, header e corpo vengono ricavati dalla specifica.
2. Inserisci i valori necessari, come un parametro di percorso o un token.
3. Invia la richiesta. La scheda mostra codice di stato, header, corpo e tempi di esecuzione.
4. Tieni aperte più richieste in **schede** per confrontarle o consultarle nuovamente.

Poiché l'esecuzione avviene nel processo principale e non nella vista web, le restrizioni CORS del browser non bloccano le chiamate e i dettagli della richiesta non compaiono nel pannello di rete del browser.

## Ambienti e server OAS

Sono concetti collegati ma distinti: comprenderne la differenza evita una comune fonte di confusione.

| | Ambiente personalizzato | `servers` OAS |
|---|---|---|
| Posizione | Impostazione locale dell'applicazione | Nel documento OpenAPI |
| Modificabile dagli strumenti di richiesta | Sì | No: occorre una patch della specifica |
| Scopo | URL di base predefinito per nuove schede di richiesta ed esecuzioni di scenari | URL di base dichiarati dal contratto |
| Condiviso con il documento | No | Sì |

Quando l'assistente elenca gli URL di base (`env.listServers`), restituisce prima gli ambienti personalizzati modificabili, seguiti dai server di sola lettura dichiarati nel documento attivo.

- Per **aggiungere o selezionare un URL di base locale**, crea o attiva un ambiente personalizzato (`env.upsertServer`, `env.selectServer`). Il documento non viene modificato.
- Per **cambiare i server nel contratto**, proponi invece una patch della specifica.

In questo modo l'URL di debug personale resta separato dal contratto, pur consentendo di usare i server dichiarati nel documento per le richieste.

## Variabili

Le variabili sono gestite in quattro ambiti:

- **globals**: disponibili in tutte le collection;
- **collection**: limitate a una collection;
- **environment**: associate all'ambiente attivo; valgono per tutti i server, salvo indicazione di un server specifico;
- **local**: riservate alla sessione locale.

L'assistente può elencare le variabili (`env.listVariables`, con filtro facoltativo per ambito) e crearle o aggiornarle (`env.setVariable`, in base a nome e ambito). Una variabile può essere associata a un server specifico e dispone di uno stato di abilitazione. Impostare una variabile modifica l'applicazione, non il documento API.

Tra i valori comunemente memorizzati nelle variabili ci sono token di accesso, ID riutilizzati tra chiamate e flag di funzionalità.

## Se manca l'URL di base

Una richiesta richiede un URL completo. Se né i `servers` del documento né l'ambiente attivo forniscono un URL di base, l'app chiede di specificarlo prima dell'esecuzione, evitando di chiamare un host errato senza avvisare.

## Da una richiesta a un flusso

Quando una singola chiamata funziona, puoi concatenare più chiamate affinché un valore della risposta alimenti la richiesta successiva. Questo è un [test di scenario](./scenario-testing.md).

Vedi anche: [Progettare con l'assistente](./design.md), [Test di scenario](./scenario-testing.md), [Impostazioni](./settings.md).

## Agenti A2A

Progetta ed esegui il debug di messaggi degli agenti con versione, operazioni sui task e aggiornamenti SSE tramite `x-protocol: a2a`. Consulta [Agenti A2A](./a2a.md) per i campi dell'estensione e i binding JSON-RPC, REST e gRPC desktop.
