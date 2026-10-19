---
sidebar_position: 6
title: "Agenti A2A"
description: "Usa A2A quando un agente delega lavoro a un altro. MCP espone strumenti e risorse; A2A descrive messaggi tra agenti, attività, aggiornamenti di stato e artefatti. Puoi conservarli nella stessa specifica locale senza considerarli lo stesso protocollo."
---

# Agenti A2A

Usa A2A quando un agente delega lavoro a un altro. MCP espone strumenti e risorse; A2A descrive messaggi tra agenti, attività, aggiornamenti di stato e artefatti. Puoi conservarli nella stessa specifica locale senza considerarli lo stesso protocollo.

## Creare e verificare una richiesta

1. In Debug, seleziona **Nuova richiesta → A2A**. Il valore predefinito è A2A **1.0**, con JSON-RPC su HTTP.
2. Inserisci l'endpoint JSON-RPC dell'agente nella barra URL. Per gli agenti meno recenti seleziona esplicitamente la versione **0.3**: Powerduck non converte implicitamente le versioni.
3. Nella scheda Protocollo, scegli un metodo e fai clic su **Genera corpo della richiesta**. Controlla l'anteprima, quindi scegli **Sostituisci corpo della richiesta** per applicarla. Annulla o cambia metodo per conservare la bozza esistente.
4. Modifica `params` nella scheda Corpo. Usa Autenticazione e Header per le credenziali; all'invio viene aggiunto l'header `A2A-Version` selezionato.
5. Invia la richiesta e controlla l'intero messaggio JSON-RPC: anche HTTP 200 può contenere `error`. Le risposte 1.0 riuscite includono un `task` o un `message` dentro `result`; la versione 0.3 usa strutture proprie.
6. Usa **Salva nella specifica** per aggiungere una richiesta rapida. Per un'operazione esistente, **Salva** conserva le impostazioni locali di debug; **Aggiorna specifica** modifica esplicitamente la definizione. Versione, endpoint, metodo e schemi documentati appartengono a `x-a2a`; le bozze locali delle richieste non vengono esportate nell'OAS. Usa **Modifica documentazione** per modificare il contratto del protocollo.

Gli ID dei messaggi e delle richieste JSON-RPC sono distinti. Ogni nuovo esempio genera nuovi ID. Per continuare una conversazione, conserva nel messaggio successivo gli identificatori di contesto e attività restituiti, come richiesto dalla versione del protocollo scelta.

## Agent Card

Usa **Recupera Agent Card pubblica** con un URL esplicito, di solito `/.well-known/agent-card.json`. Prima di configurare l'endpoint, esamina interfacce dichiarate, versione, competenze, autenticazione e funzionalità. Il recupero della scheda non cambia automaticamente l'URL della richiesta e non inoltra credenziali a un'altra origine.

L'individuazione pubblica non invia le credenziali della richiesta e rifiuta i reindirizzamenti. Il client desktop usa l'esecutore HTTP nativo; nel browser è necessario CORS. Le risposte sono limitate a 1 MiB. Per A2A 1.0, espandi **Verifica firma JWS** e incolla un JWKS pubblico attendibile. La verifica è locale, supporta firme asimmetriche e non segue mai URL di chiavi forniti dalla scheda. I valori vuoti obbligatori vengono conservati secondo il proto A2A fissato dal progetto. I campi personalizzati esterni allo schema standard della scheda non vengono autenticati. Le schede prive di firma o non verificate sono indicate chiaramente; salvare un'istantanea non memorizza una decisione di attendibilità. Per i metadati protetti usa la chiamata RPC della scheda estesa con l'autenticazione della richiesta. **Salva scheda nella specifica** conserva soltanto un'istantanea: rimuovi i metadati privati prima di condividere o ospitare la specifica.

## Attività e streaming

Nella versione 1.0 usa `SendStreamingMessage` o `SubscribeToTask`; nella 0.3 usa `message/stream` o `tasks/resubscribe`. Le risposte utilizzano il visualizzatore di eventi SSE esistente, con limiti alle risposte e controlli di annullamento. Gli aggiornamenti originali di stato e artefatti restano consultabili.

**Interrompi** disconnette la richiesta locale, senza annullare il lavoro remoto. Per richiedere l'annullamento remoto, invia `CancelTask` nella 1.0 o `tasks/cancel` nella 0.3 con l'ID dell'attività restituito. Un'attività in stato terminale non può essere semplicemente riavviata.

Sono disponibili recupero delle attività, elenco delle attività nella 1.0, schede estese e metodi di configurazione delle notifiche push. A2A 1.0 li espone attraverso tutti e tre i binding; la 0.3 usa JSON-RPC. Le operazioni facoltative dipendono dalle funzionalità dichiarate dall'agente. Powerduck non ospita un ricevitore di notifiche push.

## Estensione OpenAPI

`x-a2a` è un'estensione OpenAPI di Powerduck, non una Agent Card A2A standard né una parola chiave standard OpenAPI. Le operazioni JSON-RPC usano `post`. Il percorso OpenAPI identifica l'operazione documentata; `endpoint` è l'URL JSON-RPC remoto effettivo.

```yaml
openapi: 3.2.0
info:
  title: Research agent
  version: 1.0.0
paths:
  /agents/research/send:
    post:
      summary: Ask the research agent
      x-protocol: a2a
      x-a2a:
        version: '1.0'
        binding: JSONRPC
        endpoint: https://agent.example.com/rpc
        agentCardUrl: https://agent.example.com/.well-known/agent-card.json
        method: SendMessage
        requestSchema:
          type: object
          description: Application-specific message parameters
        responseSchema:
          type: object
          description: JSON-RPC response envelope
        example:
          jsonrpc: '2.0'
          id: request-1
          method: SendMessage
          params:
            message:
              messageId: message-1
              role: ROLE_USER
              parts:
                - text: Summarize the release notes
      responses:
        '200':
          description: A2A response; inspect result or error
          content:
            application/json:
              schema:
                type: object
```

Per le risposte streaming usa `text/event-stream` con `itemSchema` di OAS 3.2 per descrivere un evento JSON-RPC. L'editor di progettazione supporta schemi indipendenti per richieste e risposte. La documentazione pubblicata e Copia per LLM conservano la configurazione A2A e i contratti documentati.

| Campo | Significato |
| --- | --- |
| `version` | Versione del formato di trasmissione supportata: `1.0` o `0.3` |
| `binding` | `JSONRPC`; A2A 1.0 supporta anche `HTTP+JSON` e `GRPC` |
| `endpoint` | Endpoint JSON-RPC, URL di base REST o autorità gRPC HTTP(S) |
| `method` | Metodo specifico della versione: REST e gRPC usano questa selezione; JSON-RPC usa il metodo nel corpo |
| `agentCardUrl` | URL di individuazione pubblica |
| `agentCard` | Istantanea facoltativa dei metadati salvata |
| `requestSchema`, `responseSchema` | Contratti documentati espliciti, non dedotti da una singola risposta acquisita |
| `example` | Messaggio completo JSON-RPC oppure oggetto di richiesta diretto REST/gRPC |

## REST e gRPC

Scegli un **Binding di trasporto** indipendentemente da versione e metodo. A2A 1.0 supporta JSON-RPC, REST e gRPC nativo. A2A 0.3 mantiene il supporto JSON-RPC; le combinazioni non supportate vengono rifiutate, non convertite implicitamente.

Per REST, la barra URL contiene l'URL di base, per esempio `https://agent.example/rest`. Il metodo determina il verbo HTTP e il suffisso. In Corpo modifica direttamente l'oggetto della richiesta, senza i campi esterni `jsonrpc`, `id` e `params`. Gli identificatori delle attività vengono codificati come segmenti del percorso; filtri e paginazione diventano parametri di query. Debug e generazione del codice per la documentazione condividono questa mappatura.

Il gRPC nativo richiede l'applicazione desktop. Usa `https://host:port` per TLS con i certificati attendibili del sistema oppure `http://localhost:port` per test locali non cifrati, senza componente di percorso. Gli header diventano metadati gRPC. Le chiamate usano il descrittore ufficiale `lf.a2a.v1.A2AService`, con conversione ProtoJSON per dati annidati, enumerazioni e campi binari. Interrompi annulla la chiamata locale, non l'attività remota. Per questo binding, script HTTP, proxy e impostazioni TLS personalizzate vengono rifiutati invece di essere ignorati.

Cambiare versione o binding conserva la bozza. Usa **Genera corpo della richiesta**, controlla il modello e conferma **Sostituisci corpo della richiesta** per applicare la struttura corretta. Un messaggio con struttura incompatibile viene rifiutato prima dell'invio. Puoi applicare esplicitamente le interfacce individuate; A2A non eredita più automaticamente un server del documento non pertinente.

## Generare un server

Espandi **Genera server → Scarica progetto server**. L'archivio contiene un progetto Node 22+ che espone JSON-RPC, REST e gRPC tramite un unico gestore HTTP della logica applicativa, oltre a una Agent Card pubblica. Esegui `npm install`, configura `A2A_TOKEN` con almeno 32 caratteri casuali e `HANDLER_URL`, quindi esegui `npm start`.

Il gestore riceve `{message, contextId}` e restituisce un Message con `parts` non vuoto. Il download non contiene segreti né credenziali della richiesta corrente. Il servizio generato prevede payload limitati, una scadenza di 60 secondi per il gestore, un limite di concorrenza, pulizia all'arresto e firma JWS facoltativa tramite `SIGNING_JWK_FILE`.

Si tratta di un **adattatore di messaggi senza stato**, non di un modello autonomo né di un motore di attività persistenti. Attività persistenti, annullamento e invio push richiedono un esecutore personalizzato e un archivio durevole. La scheda non dichiara supporto push. Prima della distribuzione pubblica, configura URL pubblici, TLS e limiti di frequenza sul reverse proxy HTTP; se servi più utenti, sostituisci l'identità basata su token condiviso. Questi requisiti sono riportati nel README generato.

## Interoperabilità delle firme

La verifica segue le regole di presenza dei campi A2A 1.0 e il JSON canonico RFC 8785, inclusi stringhe e array vuoti obbligatori e booleani facoltativi esplicitamente presenti. Le firme di un sistema che elimina questi campi obbligatori vengono rifiutate: firma nuovamente con un canonicalizzatore conforme. Una firma valida attesta i campi standard rispetto alla chiave pubblica fornita, non che una chiave non attendibile appartenga all'organizzazione dichiarata.

Riferimenti: [Specifica A2A 1.0](https://a2a-protocol.org/v1.0.0/specification/) e [Specifica A2A 0.3](https://a2a-protocol.org/v0.3.0/specification/).

## Esempio locale eseguibile

Il repository Powerduck React include `examples/a2a-demo`. Con Node.js 22+, esegui `npm ci` e `npm start` in quella cartella. Importa il relativo `openapi.json` per verificare JSON-RPC, REST e gRPC desktop sullo stesso calcolatore locale. Il README contiene il token bearer della demo, l'individuazione della Agent Card, il JWKS locale attendibile e le istruzioni per lo streaming. `npm test` verifica i trasporti reali e il rifiuto delle firme alterate senza servizi esterni.

Nel pannello del protocollo, **Genera corpo della richiesta** mostra l'anteprima del modello del metodo selezionato. **Sostituisci corpo della richiesta** lo applica esplicitamente; annullare o cambiare metodo conserva la bozza esistente.

```bash
cd powerduck-react/examples/a2a-demo
npm ci
npm start
# In another terminal, in the same directory:
npm test
```

Endpoint locali: JSON-RPC `http://127.0.0.1:9999/rpc`, REST `http://127.0.0.1:9999/rest`, gRPC `http://127.0.0.1:9998`. La scheda pubblica è su `http://127.0.0.1:9999/.well-known/agent-card.json`. Usa il token bearer dimostrativo `powerduck-local-demo-token-0123456789`. L'invio di `[12,30]` restituisce `Sum: 42` e il dato strutturato `total: 42`. La chiave pubblica attendibile è in `.runtime/trusted-jwks.json` e cambia a ogni riavvio. La demo ascolta soltanto in locale, non richiede una chiave IA, non include un motore di attività persistenti né invio push e non deve essere distribuita pubblicamente con il token dimostrativo. Le origini browser predefinite sono `http://localhost:3000` e `http://127.0.0.1:3000`; usa `CORS_ORIGINS` per altre origini. Anche il server generato supporta questo elenco esplicito di origini consentite.
