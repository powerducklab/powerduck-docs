---
sidebar_position: 5
title: "Riferimento API"
description: "Riferimento alle principali API di integrazione di @powerduck/openapi-request"
---

# Riferimento API

Riferimento alle principali API di integrazione di `@powerduck/openapi-request`. Le tabelle riassumono i contratti; le dichiarazioni TypeScript del pacchetto contengono tutti gli overload e i parametri facoltativi. Il punto di ingresso principale e i sottopercorsi dei protocolli non esportano esattamente gli stessi elementi.

## API principali

### `createClient(options?): ProtoClient`

Crea il client orientato alle interfacce utente. L’argomento `options` è facoltativo.

**Parametri:**

| Nome | Tipo | Descrizione |
| --- | --- | --- |
| `options` | `CreateClientOptions` | Configurazione facoltativa |
| `options.writeBack` | `WriteBackOptions` | Controlla come le risposte vengono unite alla specifica |
| `options.response` | `ToResponseOptions` | Controlla la normalizzazione degli oggetti risposta |

**Restituisce:** un `ProtoClient` con i seguenti metodi:

| Metodo | Firma | Descrizione |
| --- | --- | --- |
| `prepare` | `(sendOptions: SendOptions) => PreparedRequest` | Pianifica una richiesta e restituisce protocollo, modalità di visualizzazione e tipo di flusso |
| `send` | `(sendOptions: SendOptions) => Promise<SendResult>` | Esegue una richiesta |
| `sendMany` | `(spec, targets, shared?) => Promise<SendManyResult>` | Esegue un batch con risultati per destinazione; un errore non elimina gli altri risultati |
| `connect` | `(connectOptions: ManualSessionOptions) => AnyManualSession` | Crea una sessione websocket/mcp/grpc non ancora aperta; chiama `open()` per connetterla |
| `discover` | `(discoverOptions) => Promise<any>` | Rileva le funzionalità di MCP e gRPC |
| `writeback` | `(spec, prepared, result, writeOptions?) => OpenApiDocument` | Unisce la risposta osservata al documento |
| `dispose` | `() => void` | Attualmente non esegue alcuna operazione; il chiamante deve chiudere le proprie sessioni |
| `probeStreamingResponse` | `(input: RequestInfo \| URL, init?: RequestInit) => Promise<{ ok: boolean; status: number; contentType?: string; kind: "none" \| "sse" \| "ndjson" \| "chunked"; response: Response }>` | Esegue una richiesta fetch e ne classifica la risposta; consuma o annulla il corpo restituito |

**Esempio:**

```typescript
import { createClient } from "@powerduck/openapi-request";

const client = createClient({
  writeBack: { overwriteExamples: true },
});

const plan = client.prepare({
  spec,
  target: { operationId: "getUserById" },
});

const result = await client.send({
  spec,
  target: { operationId: "getUserById" },
  values: { path: { id: "42" } },
});
```

### `createDebugger(config?): ProtoKit`

Crea il debugger programmabile per automazione, script e CI.

**Parametri:**

| Nome | Tipo | Descrizione |
| --- | --- | --- |
| `config` | `DebuggerOptions` | Configurazione facoltativa |
| `config.adapters` | `ProtocolAdapter[]` | Elenco di adattatori personalizzati che sostituisce quelli predefiniti |
| `config.extraAdapters` | `ProtocolAdapter[]` | Adattatori aggiuntivi a quelli predefiniti |
| `config.writeBack` | `WriteBackOptions` | Opzioni di scrittura dei risultati |
| `config.response` | `ToResponseOptions` | Opzioni di normalizzazione delle risposte |
| `config.writeBackTruncated` | `boolean` | Scrive lo schema dedotto da flussi troncati (valore predefinito: true) |

**Restituisce:** un `ProtoKit` con `prepare`, `send`, `sendMany`, `toCollection` e altri metodi.

**Esempio:**

```typescript
import { createDebugger } from "@powerduck/openapi-request";

const dbg = createDebugger({
  writeBackTruncated: true,
});

const result = await dbg.send({
  spec,
  target: { operationId: "getUserById" },
  values: { path: { id: "42" } },
  serverUrl: "https://api.example.com",
});
```

### `createManualSession(options): AnyManualSession`

Crea una sessione duplex di lunga durata per WebSocket, MCP o gRPC. La funzione di creazione non esegue I/O; la connessione viene aperta con `open()`.

**Parametri:**

| Nome | Tipo | Descrizione |
| --- | --- | --- |
| `options.kind` | `"websocket" \| "mcp" \| "grpc"` | Protocollo da usare |
| `options.url` | `string` | URL di connessione WebSocket |
| `options.endpoint` | `string` | Endpoint MCP Streamable HTTP |
| `options.transport` | `"streamable-http" \| "stdio"` | Trasporto MCP; il valore predefinito è Streamable HTTP |
| `options.command`, `options.args` | `string`, `string[]` | Eseguibile locale e argomenti per MCP stdio |
| `options.address`, `options.service`, `options.method` | `string` | Indirizzo gRPC, nome completo del servizio e metodo |

Per gRPC, fornisci anche una fonte di descrittori tramite `protoPaths` o `reflection`. Le opzioni per protocollo sono elencate in [Configurazione](./configuration.md).

**Restituisce:** una sessione con `open()`, `send()`, `close()`, `onEvent()`, `waitForClose()`, `events` e `state`. `onEvent()` restituisce una sottoscrizione dotata di `unsubscribe()`.

**Esempio:**

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "websocket",
  url: "wss://api.example.com/ws",
});

const subscription = session.onEvent((event) => {
  console.log(event.kind, event.data);
});
try {
  await session.open();
  await session.send({ type: "message", data: "hello" });
} finally {
  await session.close();
  subscription.unsubscribe();
}
```

### `AdapterRegistry`

Registro di istanze di `ProtocolAdapter`. Un nuovo registro è vuoto; `createDebugger()` registra gli adattatori integrati HTTP, WebSocket, gRPC, MCP e GraphQL, salvo che un elenco personalizzato li sostituisca. Usa `register()`, `unregister()`, `get()`, `list()`, `rank()` e `resolve()` per gestire la selezione.

### `ProtoKitError`

Errore tipizzato generato dal debugger e dai percorsi di esecuzione principali. Usa `instanceof ProtoKitError` per distinguere gli errori della libreria dai guasti imprevisti.

## Tipi principali

### `SendOptions`

Oggetto di ingresso principale per `prepare()` e `send()`. Contiene specifica, destinazione, valori e tutte le impostazioni a livello di richiesta.

| Campo | Tipo | Obbligatorio | Descrizione |
| --- | --- | --- | --- |
| `spec` | `OpenApiDocument` | Sì | Documento OpenAPI 3.2 completo |
| `target` | `OperationTarget` | Sì | Identificatore dell’operazione, descritto sotto |
| `values` | `RequestValues` | No | Valori concreti per path/query/header/cookie/body |
| `serverUrl` | `string` | No | Sostituisce `spec.servers[0].url` |
| `serverVariables` | `Record<string, string>` | No | Variabili del modello di URL del server |
| `variables` | `Record<string, string>` | No | Variabili d’ambiente referenziate come `{{name}}` |
| `globals` | `Record<string, string>` | No | Variabili globali in stile Postman |
| `localVariables` | `Record<string, string>` | No | Variabili locali |
| `collectionVariables` | `Record<string, string>` | No | Variabili di raccolta |
| `auth` | `AuthConfig` | No | Configurazione dell’autenticazione |
| `scripts` | `ScriptConfig` | No | Script prima della richiesta e di test |
| `runner` | `RuntimeRunOptions` | No | Inoltro completo delle opzioni postman-runtime, con priorità massima |
| `websocket` | `WebSocketOptions` | No | Opzioni WebSocket |
| `graphql` | `GraphQLOptions` | No | Opzioni GraphQL |
| `mcp` | `McpOptions` | No | Opzioni MCP |
| `grpc` | `any` | No | Opzioni gRPC |
| `timeout` | `number` | No | Timeout per richiesta in ms, scorciatoia per `runner.timeout.request` |

`SendOptions` accetta anche questi controlli di esecuzione e streaming:

| Campo | Tipo | Descrizione |
| --- | --- | --- |
| `fetch` | `typeof fetch` | Trasporto fetch isolato fornito dall’host dove supportato; HTTP/SSE continuano a usare postman-runtime. |
| `writeBack` | `boolean` | Con `false`, `patchedSpec` resta indefinito mentre `responseFragment` viene comunque prodotto. |
| `signal` | `AbortSignal` | Annulla l’esecuzione o il campionamento; può comunque restituire un risultato parziale. |
| `maxEvents` | `number` | Numero massimo di eventi del flusso conservati. |
| `maxStreamMs` | `number` | Durata massima del campionamento del flusso in millisecondi. |
| `maxResponseSize` | `number` | Limite della risposta in byte. |
| `maxBufferChars` | `number` | Limite del buffer SSE prima di un confine di evento; predefinito: `4194304` caratteri. |
| `maxEventChars` | `number` | Limite dei dati conservati per evento SSE; predefinito: `1048576` caratteri. |
| `inheritEventId` | `boolean` | Eredita l’ultimo ID di evento SSE quando manca; predefinito: `true`. Usa `false` per un’inferenza dello schema più rigorosa. |
| `onEvent` | `(event: StreamEvent) => void` | Riceve gli eventi del flusso. |
| `onConsole` | `(log: ConsoleLog) => void` | Riceve l’output della console degli script. |
| `onAssertion` | `(assertion: AssertionResult) => void` | Riceve i risultati delle asserzioni. |
| `onResponseStart` | `(info: ResponseStartInfo) => void` | Esamina le prime intestazioni HTTP/SSE e la classificazione `streaming`. |
| `onOpen` | `(info) => void` | Riceve i dettagli della connessione WebSocket: URL, protocollo e intestazioni. |

Gli adattatori possono interpretare i limiti in modo diverso. Mantieni leggeri i callback dell’interfaccia; il livello di esecuzione intercetta le eccezioni. Per le impostazioni del requester HTTP usa `runner.requester`; il suo `maxResponseSize`, se presente, deve essere positivo, non zero.

### `OperationTarget`

Identifica un’operazione. Preferisci `operationId` oppure `method` + `path`. Se sono presenti entrambi, prevale `operationId`.

| Campo | Tipo | Descrizione |
| --- | --- | --- |
| `operationId` | `string` | Chiave di ricerca alternativa, prioritaria rispetto a percorso e metodo |
| `method` | `string` | Metodo HTTP senza distinzione tra maiuscole e minuscole. Richiede `path`. |
| `path` | `string` | Percorso parametrico, ad esempio `/users/{id}`. Richiede `method`. |

### `RequestValues`

Valori concreti inseriti nella richiesta generata.

| Campo | Tipo | Descrizione |
| --- | --- | --- |
| `path` | `Record<string, unknown>` | Valori dei parametri di percorso |
| `query` | `Record<string, unknown>` | Valori dei parametri di query |
| `header` | `Record<string, unknown>` | Valori delle intestazioni |
| `cookie` | `Record<string, unknown>` | Valori dei cookie |
| `querystring` | `string` | Stringa di query grezza già codificata, per la posizione `querystring` di OpenAPI 3.2 |
| `body` | `unknown` | Corpo della richiesta |
| `contentType` | `string` | Impone un tipo di media quando l’operazione ne dichiara diversi |

```typescript
const result = await client.send({
  spec,
  target: { operationId: "updateUser" },
  values: {
    path: { id: "42" },
    query: { version: "2" },
    header: { "X-Request-Id": "abc-123" },
    body: { name: "Alice", email: "alice@example.com" },
    contentType: "application/json",
  },
});
```

### `AuthConfig`

| Campo | Tipo | Descrizione |
| --- | --- | --- |
| `type` | `AuthConfig["type"]` | Tipo di autenticazione |
| `token` | `string` | Token Bearer per `type: "bearer"` |
| `username` | `string` | Nome utente Basic per `type: "basic"` |
| `password` | `string` | Password Basic per `type: "basic"` |
| `key` | `string` | Nome della chiave API per `type: "apikey"` |
| `value` | `string` | Valore della chiave API per `type: "apikey"` |
| `in` | `"header" \| "query"` | Posizione della chiave API per `type: "apikey"` |

```typescript
// Bearer token
const result1 = await client.send({
  spec,
  target: { operationId: "getUser" },
  auth: { type: "bearer", token: "your-jwt-token" },
});

// Basic auth
const result2 = await client.send({
  spec,
  target: { operationId: "getUser" },
  auth: { type: "basic", username: "admin", password: "secret" },
});

// API key in header
const result3 = await client.send({
  spec,
  target: { operationId: "getUser" },
  auth: { type: "apikey", key: "X-API-Key", value: "key-123", in: "header" },
});
```

I tipi avanzati sono `digest`, `oauth1`, `oauth2`, `jwt`, `hawk`, `aws4`, `ntlm`, `asap` ed `edgegrid`. Passa i rispettivi campi ausiliari Postman per HTTP/SSE/GraphQL tramite `parameters: Record<string, string | boolean | number>`. L’opzione `oauth2: OAuth2FlowConfig` attiva acquisizione e rinnovo dei token OAuth 2.0; non presumere che ogni meccanismo funzioni con tutti i protocolli.

### `PreparedRequest`

Restituito da `createClient().prepare()`. Il debugger produce un risultato di pianificazione diverso: `createDebugger().prepare()` restituisce un `PlanResult` con `located`, `adapter` e `plan`.

| Campo | Tipo | Descrizione |
| --- | --- | --- |
| `protocol` | `string` | Protocollo risolto (http, websocket, grpc, graphql, mcp) |
| `transport` | `string` | Trasporto risolto |
| `target` | `OperationTarget` | Destinazione originale |
| `operation` | `any` | Oggetto dell’operazione OpenAPI risolto |
| `display.mode` | `DisplayMode` | `"response" \| "event-list" \| "duplex-session"` |
| `stream.kind` | `StreamKind` | Classificazione del flusso (vedi sotto) |
| `stream.expected` | `boolean` | Indica se è previsto lo streaming |
| `openapi.extensions` | `Record<string, unknown>` | Estensioni OpenAPI risolte |
| `warnings` | `string[]` | Avvisi emersi durante la pianificazione |

### `StreamKind`

Classificazione precisa dei flussi: `"none" | "sse" | "ndjson" | "chunked" | "websocket" | "graphql-stream" | "grpc-unary" | "grpc-server-stream" | "grpc-client-stream" | "grpc-bidi" | "mcp-http-stream" | "mcp-stdio"`

## Funzioni di supporto OpenAPI

| Esportazione | Firma | Descrizione |
| --- | --- | --- |
| `locateOperation` | `(spec, target) => LocatedOperation` | Risolve un’operazione tramite `OperationTarget` |
| `inferSchema` | `(value) => Schema` | Deduce un JSON Schema da un singolo valore osservato |
| `inferSchemaFromMany` | `(values) => Schema` | Deduce uno schema che comprende più valori osservati |
| `mergeSchema` | `(a, b) => Schema` | Unisce due schemi dedotti (unione o combinazione) |
| `sampleFromSchema` | `(schema) => unknown` | Produce un valore di esempio realistico per uno schema |
| `toResponseObject` | `(result, options?) => { statusCode: string; response: any }` | Crea un oggetto di risposta OpenAPI da un risultato osservato |
| `writeBackResponse` | `(spec, path, method, fragment, options?) => spec` | Unisce una risposta osservata al documento |

Tipi esportati: `LocatedOperation`, `WriteBackOptions`, `ToResponseOptions`.

## HTTP / SSE

I nomi seguenti sono disponibili dal punto di ingresso principale. Il sottopercorso `@powerduck/openapi-request/http` esporta `HttpAdapter`, `SseParser`, `buildCollection`, `buildEnvironment`, `resolveServerUrl`, `buildRunOptions` e `runWithPostman`; importa le funzioni di rilevamento e `BUILTIN_CAPTURE_TEST` dal punto di ingresso principale.

| Esportazione | Descrizione |
| --- | --- |
| `HttpAdapter` | Adattatore di protocollo predefinito per HTTP/HTTPS |
| `SseParser` | Parser di streaming che trasforma un flusso di byte SSE in eventi strutturati |
| `isStreamingOperation` | Classifica un’operazione come streaming in base ai tipi di contenuto dichiarati |
| `isSseContentType` | Verifica se un tipo di contenuto indica SSE |
| `isStreamingContentType` | Verifica se un tipo di contenuto indica uno streaming |
| `acceptHeaderFor` | Genera l’header Accept appropriato per un’operazione |
| `probeStreamingResponse` | Esegue una richiesta fetch e ne classifica la risposta; consuma o annulla il corpo restituito |
| `BUILTIN_CAPTURE_TEST` | Script di test Postman integrato per acquisire l’ultima risposta |

## WebSocket

Importa da `@powerduck/openapi-request/ws`.

| Esportazione | Descrizione |
| --- | --- |
| `WebSocketAdapter` | Adattatore di protocollo per destinazioni WebSocket |
| `createWsManualSession` | Crea una sessione WebSocket manuale duplex, disponibile anche come `runWebSocketSession` e `wsManualSession` |

## GraphQL

Importa da `@powerduck/openapi-request/graphql`.

| Esportazione | Descrizione |
| --- | --- |
| `GraphQLAdapter` | Adattatore di protocollo per destinazioni GraphQL |
| `resolveGraphQLConfig` | Risolve la configurazione GraphQL di un’operazione |
| `runGraphQL` | Esegue un’operazione GraphQL |
| `introspectSchema` | Ottiene per introspezione lo schema di un endpoint GraphQL |
| `INTROSPECTION_QUERY` | Query standard di introspezione GraphQL |
| `generateOperation` | Genera un documento di query da uno schema GraphQL ottenuto per introspezione e da un campo |
| `generateAllOperations` | Genera documenti di query per i campi di uno schema GraphQL ottenuto per introspezione |
| `writeGraphQLOperations` | Scrive le operazioni GraphQL generate nella specifica |
| `discoverAndWriteGraphQLSchema` | Rileva uno schema GraphQL e lo scrive nella specifica |

## MCP (Model Context Protocol)

La maggior parte delle voci seguenti è disponibile da `@powerduck/openapi-request/mcp`. Importa `initializeMcpSession` dal punto di ingresso principale; nel sottopercorso si chiama `initializeSession`. Il sottopercorso espone anche `runMcp`, `createMcpSessionCore` e `createMcpStdioConnection`.

| Esportazione | Descrizione |
| --- | --- |
| `McpAdapter` | Adattatore di protocollo per destinazioni MCP |
| `createMcpManualSession` | Crea una sessione MCP manuale, disponibile anche come `mcpManualSession` |
| `createMcpStdioSession` | Crea una sessione MCP su stdio |
| `runMcpManualSession` | Deprecato: usa `createMcpManualSession` |
| `resolveMcpConfig` | Risolve la configurazione MCP di un’operazione |
| `initializeMcpSession` | Inizializza una sessione MCP (alias di `initializeSession`) |
| `discoverMcpCapabilities` | Rileva le funzionalità del server MCP |
| `MCP_PROTOCOL_VERSION` | Versione supportata del protocollo MCP |
| `generateMcpCall` | Genera una chiamata a uno strumento MCP |
| `generateAllMcpCalls` | Genera tutte le chiamate agli strumenti MCP |
| `writeMcpOperations` | Scrive le operazioni MCP nella specifica |
| `discoverAndWriteMcpCapabilities` | Rileva le funzionalità MCP e le scrive nella specifica |
| `createHttpMcpTransport` | Crea un trasporto HTTP per MCP |
| `createStdioMcpTransport` | Crea un trasporto stdio per MCP |

## gRPC

Importa le funzioni di basso livello per rilevamento, chiamate e descrittori da `@powerduck/openapi-request/grpc`. Importa `GrpcProtocolAdapter`, `createGrpcManualSession`, `grpcManualSession`, `grpcDiscover` e `discoverGrpc` dal punto di ingresso principale; il sottopercorso usa `discover` per il rilevamento. Offre anche `discoverFromCatalog`, `describeMethod` e `describeFromCatalog`, così puoi riutilizzare un catalogo senza ripetere la reflection per ogni metodo.

| Esportazione | Descrizione |
| --- | --- |
| `GrpcProtocolAdapter` | Adattatore di protocollo gRPC rivolto a OpenAPI |
| `GrpcAdapter` | Adattatore gRPC di basso livello |
| `grpcDiscover` / `discoverGrpc` | Rileva servizi e metodi gRPC |
| `createGrpcManualSession` / `grpcManualSession` | Crea una sessione gRPC manuale |
| `grpcCall` | Esegue una singola chiamata gRPC |
| `resolveMethod` | Risolve un descrittore di metodo gRPC |
| `buildMessageTemplate` | Crea un modello di messaggio da un descrittore |
| `buildCatalog` | Crea un catalogo di servizi e metodi |
| `LOADER_OPTIONS` | Opzioni predefinite del caricatore proto |
| `scanProtoFiles` | Cerca file proto nelle directory |
| `deriveIncludeDirsDetailed` | Ricava le directory di inclusione dai percorsi dei file proto |
| `fetchDescriptorSet` | Recupera un insieme di descrittori tramite reflection gRPC |
| `fetchFullDescriptorSet` | Recupera un insieme completo di descrittori con tutte le dipendenze |
| `listServices` | Elenca i servizi di un insieme di descrittori |
| `listServicesDetailed` | Elenca i servizi con informazioni dettagliate sui metodi |
| `serializeDescriptorSet` | Serializza un insieme di descrittori in byte |
| `decodeFileDescriptorProto` | Decodifica un singolo proto di descrittore di file |
| `decodeFileDescriptorSet` | Decodifica un insieme di descrittori di file |
| `buildCredentials` | Crea credenziali gRPC in modo sincrono |
| `buildCredentialsAsync` | Crea credenziali gRPC in modo asincrono |
| `buildCredentialsChecked` | Crea e convalida credenziali in modo sincrono |
| `buildCredentialsCheckedAsync` | Crea e convalida credenziali in modo asincrono |
| `loadGrpc` | Carica dinamicamente il pacchetto `@grpc/grpc-js` |
| `isGrpcAvailable` | Verifica la disponibilità delle dipendenze gRPC |
| `requireCapability` | Richiede una specifica funzionalità gRPC e genera un errore se non è disponibile |

Il punto di ingresso principale esporta gli alias di tipo `GrpcDiscoveryResult`, `GrpcDiscoveredMethod` e `GrpcDiscoveredService`. Nel sottopercorso gRPC si chiamano `DiscoveryResult`, `DiscoveredMethod` e `DiscoveredService`.

Tipi di errore: `ReflectionProtocolError`, `ReflectionUnavailableError`, `DescriptorDecodeError`, `GrpcDependencyBrokenError`, `GrpcDependencyMissingError`.

## Altre utilità

Il punto di ingresso principale esporta anche le funzioni OAuth 2.0 `resolveOAuth2Token`, `acquireOAuth2Token`, `isOAuth2TokenExpired`, `oauth2RefreshStatuses` e `authFromOAuth2Token`, l’utilità di copia `toCloneable`, la classe base `UnifiedSession` e le funzioni di scrittura gRPC `writeGrpcOperations` e `discoverAndWriteGrpcOperations`.

## Esportazioni dei sottopercorsi

```typescript
// Main integration entry
import { createClient, createDebugger } from "@powerduck/openapi-request";

// Protocol-specific entries
import { HttpAdapter } from "@powerduck/openapi-request/http";
import { WebSocketAdapter } from "@powerduck/openapi-request/ws";
import { GrpcAdapter } from "@powerduck/openapi-request/grpc";
import { McpAdapter } from "@powerduck/openapi-request/mcp";
import { GraphQLAdapter } from "@powerduck/openapi-request/graphql";
```
