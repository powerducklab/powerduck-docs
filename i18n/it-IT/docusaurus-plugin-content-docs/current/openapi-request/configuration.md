---
sidebar_position: 4
title: "Configurazione"
description: "La configurazione ha tre livelli: opzioni della factory del client o debugger, oggetto SendOptions passato a prepare() e send(), e opzioni specifiche dei protocolli."
---

# Configurazione

La configurazione ha tre livelli: opzioni della factory del client o debugger, oggetto `SendOptions` passato a `prepare()` e `send()`, e opzioni specifiche dei protocolli.

## Opzioni delle factory

### `CreateClientOptions`

Passate a `createClient(options?)`. Tutti i campi sono facoltativi.

| Campo | Tipo | Descrizione |
| --- | --- | --- |
| `writeBack` | `WriteBackOptions` | Controlla come le risposte vengono unite alla specifica |
| `response` | `ToResponseOptions` | Controlla la normalizzazione degli oggetti risposta |

```typescript
import { createClient } from "@powerduck/openapi-request";

const client = createClient({
  writeBack: {
    overwriteExamples: true,
    // ... other WriteBackOptions
  },
  response: {
    includeExamples: false,
    // ... other ToResponseOptions
  },
});
```

### `DebuggerOptions`

Passate a `createDebugger(config?)`. Tutti i campi sono facoltativi.

| Campo | Tipo | Descrizione |
| --- | --- | --- |
| `adapters` | `ProtocolAdapter[]` | Elenco di adattatori personalizzato che sostituisce quelli predefiniti |
| `extraAdapters` | `ProtocolAdapter[]` | Adattatori aggiuntivi per il registro predefinito |
| `writeBack` | `WriteBackOptions` | Opzioni di scrittura dei risultati |
| `response` | `ToResponseOptions` | Opzioni di normalizzazione delle risposte |
| `writeBackTruncated` | `boolean` | Scrive lo schema dedotto dai flussi troncati; valore predefinito: `true` |

```typescript
import { createDebugger, HttpAdapter, WebSocketAdapter } from "@powerduck/openapi-request";

// Use only HTTP and WebSocket adapters
const debugger1 = createDebugger({
  adapters: [new HttpAdapter(), new WebSocketAdapter()],
});

// Add a custom adapter to the defaults
const debugger2 = createDebugger({
  extraAdapters: [new MyCustomAdapter()],
  writeBackTruncated: true,
});
```

### Scrittura dei risultati ed esempi acquisiti

`WriteBackOptions` supporta `strategy` (`"merge"` o `"replace"`, predefinito `"merge"`), `keepExistingDescription` (predefinito `true`), `allowedStatusCodes` (vuoto significa tutti), `protectComponentRefs` (predefinito `true`), `overwriteExamples` (predefinito `true`) e `requirePassingTests`. La pipeline di invio verifica i test; una chiamata diretta a `writeBackResponse` non lo fa.

`ToResponseOptions` supporta `includeExamples` (predefinito `true`), `maxExampleChars` (predefinito `4000`) e `maxEventPreviewChars` (predefinito `200`). Disattiva l’acquisizione degli esempi o controllali prima di pubblicare: le risposte reali possono contenere credenziali o dati personali.

La pipeline di invio restituisce normalmente una copia modificata in `patchedSpec`; non modifica il documento in ingresso e non salva file. Imposta `writeBack: false` per la singola chiamata per saltare questo passaggio. L’oggetto `writeBack` della factory configura l’unione; il booleano per chiamata la attiva o disattiva.

## `SendOptions`

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

```typescript
// By operationId (recommended)
const result1 = await client.send({
  spec,
  target: { operationId: "getUserById" },
});

// By method + path
const result2 = await client.send({
  spec,
  target: { method: "GET", path: "/users/{id}" },
});
```

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

### `ScriptConfig`

| Campo | Tipo | Descrizione |
| --- | --- | --- |
| `collectionPreRequest` | `ScriptSource \| ScriptSource[]` | Script prima della richiesta a livello di raccolta |
| `collectionTest` | `ScriptSource \| ScriptSource[]` | Script di test a livello di raccolta |
| `preRequest` | `ScriptSource \| ScriptSource[]` | Script prima della singola richiesta |
| `test` | `ScriptSource \| ScriptSource[]` | Script di test della singola richiesta |
| `fromSpecExtensions` | `boolean` | Legge `x-postman-scripts` dalla specifica; predefinito: `true` |
| `captureLastResponse` | `boolean` | Aggiunge l’helper integrato che espone l’ultima risposta alle richieste successive |

`ScriptSource`:
```typescript
interface ScriptSource {
  exec: string | string[];  // Script body, either a single string or array of lines
  id?: string;               // Optional identifier surfaced in script results
}
```

Imposta `scripts.fromSpecExtensions: false` se non vuoi eseguire gli script incorporati in una specifica importata. Il valore predefinito attuale è `true`; non fare affidamento su una modifica futura.

## Opzioni per protocollo

### HTTP / SSE

HTTP è l’adattatore predefinito. La dichiarazione `text/event-stream` indica l’intento SSE; l’esecuzione classifica anche la risposta reale all’arrivo delle intestazioni. `probeStreamingResponse()` è un controllo separato ed esplicito, non un prerequisito automatico di ogni chiamata.

Le richieste HTTP di base non richiedono altre impostazioni. Usa `SendOptions.runner` per la configurazione avanzata di postman-runtime.

### WebSocket

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "websocket",
  url: "wss://api.example.com/ws",
  // Manual-session options are distinct from SendOptions.websocket.
});
```

### MCP

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "mcp",
  endpoint: "https://api.example.com/mcp",
});
```

La sessione manuale MCP predefinita usa Streamable HTTP ed `endpoint`. Per stdio, passa `kind: "mcp"`, `transport: "stdio"` e un `command` locale con `args` facoltativi; l’apertura della sessione avvia il processo configurato.

### gRPC

gRPC richiede un indirizzo, una fonte di descrittori (file `.proto` o riflessione del server), un servizio e un metodo completamente qualificati:

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "grpc",
  address: "localhost:50051",
  service: "powerduck.examples.Echo",
  method: "Echo",
  protoPaths: ["./echo.proto"],
});
```

Le factory di sessioni manuali restituiscono una sessione non ancora aperta. Chiama `open()` prima di inviare e `close()` durante la pulizia. L’esempio gRPC richiede un server locale e un file proto corrispondenti; le opzioni della sessione manuale non sono lo stesso oggetto di `SendOptions.grpc`.

## Esempio completo

```typescript
import { createClient } from "@powerduck/openapi-request";

const client = createClient({
  writeBack: { overwriteExamples: true },
});

const result = await client.send({
  spec: openApiDocument,
  target: { operationId: "updateUser" },
  values: {
    path: { id: "42" },
    query: { verbose: "true" },
    header: { "X-Request-Id": "req-abc" },
    body: { name: "Alice", email: "alice@example.com" },
  },
  serverUrl: "https://api.staging.example.com",
  auth: { type: "bearer", token: "staging-token" },
  timeout: 10000,
  variables: {
    environment: "staging",
  },
});

console.log(result.response.status);
console.log(result.response.body);
console.log(result.response.headers);
```

## Passi successivi

- Consulta il [Riferimento API](./api-reference.md) per tutti i tipi esportati
- Esplora gli [Esempi](./examples.md) specifici per protocollo
