---
title: "Salvare richieste ed esempi di protocolli"
description: "Powerduck separa la richiesta che stai provando dal contratto che pubblichi."
---

# Salvare richieste ed esempi di protocolli

Powerduck separa la richiesta che stai provando dal contratto che pubblichi.

| Azione | Risultato |
| --- | --- |
| Salva nella barra dell’URL | Salva la configurazione locale di debug della richiesta senza modificare il documento OpenAPI. |
| Richiesta rapida: salva nella specifica | Aggiunge un’operazione al documento e alla cartella selezionati. |
| Richiesta della specifica: aggiorna specifica | Mostra metodo, percorso di destinazione e anteprima della definizione prima di aggiornare il contratto. |
| Salva documento / Cmd+S o Ctrl+S | Scrive su disco il documento OpenAPI corrente. In una scheda di richiesta rapida, la scorciatoia salva quella richiesta rapida. |

La richiesta locale contiene server selezionato, URL, metodo, valori dei parametri, corpo, script e impostazioni di trasporto. Le bozze delle richieste della specifica restano in memoria durante la modifica; Salva nella barra dell’URL le conserva nello storage del processo di rendering sotto `powerduck.debug.v1:`. Le voci sono separate per ID del documento, percorso e metodo. Cancellare i dati del browser o dell’applicazione elimina questo stato locale; il file OAS esportato non lo include. Questo storage **non è una cassaforte cifrata per segreti**: usa riferimenti d’ambiente invece di credenziali in chiaro negli URL, nelle intestazioni o nei corpi. I controlli di autenticazione usano un percorso separato per la persistenza delle credenziali.

`x-powerduck-request` **non è un’estensione ufficiale del contratto**. Le azioni di aggiunta o aggiornamento della specifica non la producono. Non va usata per descrivere metodi, parametri, corpi delle richieste o risposte. Aprire un documento non riscrive le copie presenti in altre operazioni.

## Aggiornare una definizione in modo esplicito

Aggiorna specifica mostra in anteprima il metodo e il percorso di destinazione e mantiene risposte e schemi esistenti. Le definizioni dei parametri sono facoltative; i valori di debug non vengono copiati. Un corpo JSON viene incluso come esempio solo se selezionato esplicitamente. I nomi comuni dei campi di credenziali vengono esclusi, ma **controlla testi liberi ed esempi prima della pubblicazione**. Gli script e le sostituzioni di autenticazione non sono campi del contratto.

Non puoi sovrascrivere un’operazione di destinazione esistente cambiando metodo o percorso. I riferimenti locali alle operazioni vengono aggiornati. Un metodo personalizzato come `PURGE` è memorizzato in `paths./cache.additionalOperations.PURGE` e richiede OpenAPI 3.2. L’anteprima segnala il requisito e l’applicazione della modifica imposta la versione del documento a 3.2.0. Verifica anche il supporto degli strumenti che lo utilizzeranno.

Gli schemi di protocollo restano modificabili tramite Modifica documentazione. Questa azione cambia esplicitamente la definizione; inviare o salvare una richiesta di debug non riscrive gli schemi in modo silenzioso.

## Esempi ufficiali da scaricare

Si tratta di **definizioni di esempio** mantenute, non di servizi API pubblici di Powerduck. Tutti gli endpoint puntano a servizi locali che devi fornire. Importare un file non avvia i servizi, non crea connessioni automatiche e non fornisce credenziali.

- [Tutti i protocolli](https://www.powerduck.com/docs/examples/protocols/all-protocols.yaml)
- [HTTP e PURGE personalizzato](https://www.powerduck.com/docs/examples/protocols/http.yaml)
- [SSE](https://www.powerduck.com/docs/examples/protocols/sse.yaml)
- [WebSocket](https://www.powerduck.com/docs/examples/protocols/websocket.yaml)
- [GraphQL](https://www.powerduck.com/docs/examples/protocols/graphql.yaml)
- [gRPC](https://www.powerduck.com/docs/examples/protocols/grpc.yaml) ed [echo.proto](https://www.powerduck.com/docs/examples/protocols/echo.proto)
- [MCP Streamable HTTP](https://www.powerduck.com/docs/examples/protocols/mcp.yaml)
- [A2A 1.0 JSON-RPC](https://www.powerduck.com/docs/examples/protocols/a2a.yaml)

Per gRPC, scarica `echo.proto` accanto al file YAML e seleziona il percorso locale effettivo nel client, se necessario. Il server deve implementare `powerduck.examples.Echo/Echo` sulla porta 50051. Anche gli altri esempi richiedono un server corrispondente; non dimostrano una validazione su un backend in esecuzione.

## Riferimento delle estensioni del contratto

Ogni operazione ha un normale metodo OAS, operationId, summary e responses. I binding non HTTP usano un’operazione OAS come riferimento documentale; `post` nell’esempio gRPC non significa che gRPC sia stato convertito in un endpoint REST.

| Estensione | Significato e campi usati negli esempi |
| --- | --- |
| `x-protocol` | `sse`, `websocket`, `graphql`, `grpc`, `mcp` o `a2a`. Per HTTP può essere omessa. |
| `x-session` | Dichiara una sessione di protocollo di lunga durata; gli esempi la usano per WebSocket e MCP. |
| `x-websocket` | `url`, `subprotocols` facoltativo, `headers` e `messages`. Ogni messaggio documentato contiene `id`, `name`, `type`, `body`, `requestSchema`, `responseSchema`. Non inserire credenziali nelle intestazioni. |
| `x-graphql` | `endpoint`, `query`, `operationName`, `variablesSchema`, `variables` pubbliche, `responseSchema`. |
| `x-grpc` | `address`, `service`, `method`, `kind`, `reflection`, `protoPaths`, `includeDirs` e `messages` documentati. `kind` supporta unary/server_streaming/client_streaming/bidi_streaming. I percorsi proto locali dipendono dall’installazione. |
| `x-mcp` | `transport`, `endpoint`, `method` e i campi specifici del metodo `name`, `argumentsSchema`, `arguments` pubblici, `responseSchema`. Le operazioni sulle risorse usano `uri`; non combinare campi di metodi non correlati. |
| `x-a2a` | `version`, `binding`, `endpoint`, `method`, `requestSchema`, `responseSchema` espliciti ed `example` pubblico. I payload di 0.3 e 1.0 sono diversi; vedi [A2A](./a2a.md). |
| `x-response-stream` | Indicazione facoltativa di streaming GraphQL, da usare quando server e trasporto effettivi supportano lo streaming. Non serve per le normali richieste GraphQL. |

SSE usa il campo standard `responses.200.content.text/event-stream.itemSchema` per descrivere il payload di ogni evento. HTTP usa parametri, requestBody, responses e schemi di sicurezza standard. Non inventare un blocco `x-sse` e non memorizzare lo stato di debug come estensione del contratto.

Gli esempi includono configurazioni complete e utilizzabili per il binding scelto, non tutte le opzioni reciprocamente esclusive. MCP stdio richiede un eseguibile locale configurato separatamente; questi esempi scaricabili non lo avviano automaticamente, per scelta.

## Integrazione dei pacchetti

L’interfaccia desktop gestisce la persistenza locale del debug e la scrittura esplicita della specifica. `@powerduck/openapi-parser` legge già i metodi personalizzati tramite `additionalOperations`; `@powerduck/tree` e `@powerduck/oas-document` utilizzano questa struttura. `@powerduck/openapi-request` riceve gli argomenti di esecuzione separatamente dalla specifica. Eseguire richieste non richiede `x-powerduck-request`.

La separazione del salvataggio non introduce nuovi parametri npm pubblici. Usa le estensioni di protocollo esistenti per i dati del contratto e passa i valori di debug correnti all’API di esecuzione. Non fare dipendere esportatori, generatori o strumenti MCP dalla struttura privata dello stato delle richieste.
