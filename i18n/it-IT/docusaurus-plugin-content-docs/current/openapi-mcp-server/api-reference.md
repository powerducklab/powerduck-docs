---
sidebar_position: 5
title: "Riferimento API"
description: "Riferimento completo di @powerduck/openapi-mcp-server: caricamento delle specifiche, generazione di strumenti, prompt e risorse, creazione ed esecuzione delle richieste, server MCP, trasporti, amministrazione, autenticazione, registro dei servizi e CLI."
---

# Riferimento API

Tutte le esportazioni pubbliche di `@powerduck/openapi-mcp-server`, suddivise per area.

## Caricamento delle specifiche

| Esportazione | Firma | Descrizione |
| --- | --- | --- |
| `loadOpenApiSpec(filePath)` | `(string) => Promise<Oas32Document>` | Legge un file JSON o YAML, lo convalida, risolve i riferimenti e verifica l’unicità degli ID delle operazioni. YAML viene rilevato tramite l’estensione `.ya?ml`. |
| `parseSpecContent(rawText, isYaml)` | `(string, boolean) => Promise<Oas32Document>` | Analizza un documento da una stringa. Genera un’eccezione se l’input è vuoto o non valido. |

## Generazione degli strumenti

| Esportazione | Firma | Descrizione |
| --- | --- | --- |
| `generateTools(spec)` | `(spec) => Tool[]` | Genera definizioni MCP `Tool` per ogni operazione. |
| `generateToolsDetailed(spec)` | `(spec) => GenerateToolsResult` | Restituisce `{ tools, bindings, issues }`. |
| `buildBindingIndex(spec)` | `(spec) => Map<string, ToolBinding>` | Associa i nomi degli strumenti generati al relativo `ToolBinding`; alias di `getBindingIndex`. |

Tipi esportati: `ToolBinding`, `GeneratedToolWithBinding` (alias di `GeneratedTool` nel pacchetto).

## Prompt e risorse

| Esportazione | Firma | Descrizione |
| --- | --- | --- |
| `generatePrompts(spec)` | `(spec) => GeneratedPrompt[]` | Elenca tutti i prompt generati. |
| `resolvePrompt(spec, name, args?)` | `(spec, string, Record?) => GetPromptResult \| null` | Risolve un prompt per nome; restituisce `null` se sconosciuto. |
| `generateResources(spec)` | `(spec) => GeneratedResource[]` | Elenca le risorse del catalogo. |
| `readResource(spec, uri)` | `(spec, string) => ResourceContentItem \| null` | Legge una risorsa tramite URI. |

## Creazione ed esecuzione delle richieste

| Esportazione | Firma | Descrizione |
| --- | --- | --- |
| `buildRequest(baseUrl, templatePath, pathItem, operation, args, binding?)` | `=> BuiltRequest` | Serializza gli argomenti in `{ url, query, headers, body, dropped }`. Argomenti posizionali. |
| `executeToolCall(spec, toolName, args, context?)` | `(spec, string, Record?, ExecutionContext?) => Promise<ToolCallResult>` | Esegue uno strumento generato sull’API a monte. Le risposte non-2xx vengono restituite come dati; gli errori di trasporto generano eccezioni. |

Campi di `ToolCallResult`: `status`, `statusText`, `headers`, `data`, `truncated`, `url`, `method`, `durationMs`, `correlationId`.

## Utilità per le specifiche

| Esportazione | Descrizione |
| --- | --- |
| `iterateOperations(spec, issues?)` | Generatore che restituisce tutte le operazioni risolte, incluse le `additionalOperations` di OpenAPI 3.2. |
| `collectOperationParameters(pathItem, operation, issues?, context?)` | Unisce i parametri del percorso e dell’operazione usando la chiave `(name, in)`. |
| `normalizeParameter(candidate)` | Normalizza un parametro grezzo; restituisce `null` se inutilizzabile. |
| `synthesizeOperationId(method, pathTemplate)` | ID alternativo deterministico quando un’operazione omette `operationId`. |
| `ensureUniqueName(candidate, taken)` | Aggiunge un suffisso numerico per mantenere il nome univoco. |
| `extractPathTemplateVariables(pathTemplate)` | Estrae le variabili `{name}`, eliminando i duplicati e conservando la prima occorrenza. |
| `effectiveStyle(parameter)` | Applica il valore predefinito di `style` previsto dalla specifica. |
| `effectiveExplode(parameter)` | Applica il valore predefinito di `explode` previsto dalla specifica. |
| `findOperationById(spec, operationId)` | Ricerca O(1) dopo la prima costruzione; restituisce `null` se sconosciuto. |
| `findDuplicateOperationIds(spec)` | Segnala gli ID duplicati dichiarati dall’autore. |
| `assertUniqueOperationIds(spec)` | Genera un’eccezione in caso di ID di operazione duplicati. |
| `isPlainObject(value)` | Restringe il tipo a un oggetto semplice. |
| `truncateGeneratedName(name, limit=64)` | Accorcia un nome mantenendone l’unicità. |

Tipi esportati: `OperationEntry`, `DuplicateOperationId`.

## Server MCP e trasporti

| Esportazione | Descrizione |
| --- | --- |
| `buildMcpServer(specProvider, contextProvider?, options?)` | Crea un `Server` dell’SDK collegando i gestori di strumenti, prompt e risorse. Argomenti posizionali. |
| `startStdioServer(spec, context?, options?)` | Fornisce un documento via stdio; restituisce `{ closed, close() }`. |
| `attachMcpRoutes(app, options)` | Monta le rotte Streamable HTTP (`/mcp`) e, facoltativamente, SSE legacy (`/sse`). Accetta `AttachMcpRoutesOptions` e restituisce `McpRouteHandle`. |
| `attachSseRoutes(app, specProvider, contextProvider, routeGuard?)` | Wrapper deprecato con argomenti posizionali. Restituisce `{ activeSessionCount, closeAll }`. |
| `createStreamableSessionHost(options)` | Crea un host autonomo per sessioni Streamable HTTP per integrazioni di trasporto personalizzate. |

Tipi: `SpecProvider = () => Document | null`, `ContextProvider = () => ExecutionContext`, `AttachMcpRoutesOptions`, `McpRouteHandle`, `StreamableSessionHost`, `StreamableSessionHostOptions`, `McpSessionEvent`, `McpSessionInfo`, `SessionCloseReason`, `SessionKind`.

`attachMcpRoutes` è esportato dalla radice del pacchetto. Le opzioni configurano `maxSessions`, `allowedOrigins`, `sessionIdleMs` e la protezione dal DNS rebinding. L’handle espone `activeSessionCount`, `pendingSessionCount`, `listSessions`, `closeSession`, `closeAll` e `dispose`. All’arresto usa `dispose()` per fermare la pulizia periodica e chiudere le sessioni.

## Server di amministrazione e autenticazione (sottopercorso `./server`) {#admin-server-and-auth-server-subpath}

Importa `startAdminServer` da `@powerduck/openapi-mcp-server/server` o dalla radice del pacchetto. Importa `createAuthMiddleware` dalla radice: il sottopercorso `./server` non lo esporta.

| Esportazione | Firma | Descrizione |
| --- | --- | --- |
| `startAdminServer(config)` | `Promise<AdminServerHandle>` | Avvia l’app Express di amministrazione con interfaccia web e rotte MCP. Restituisce `{ app, server, port, close() }`. |
| `createAuthMiddleware(apiKey?)` | `RequestHandler` | Controllo di accesso tramite Bearer o `x-api-key`. Ometti la chiave per disabilitarlo. Argomento posizionale. |

## Runtime e utilità

| Esportazione | Descrizione |
| --- | --- |
| `ServiceRegistry` | Classe di `ManagedServiceRecord`: `upsert`, `list`, `get`, `remove`, `clear`, `start`, `stop`, `fail`. |
| `isAbortError(error)` | Vero per `AbortError` o `CanceledError` di axios. |
| `newId()` | UUID, con alternativa basata su un timestamp. |

## CLI

Eseguibile **`openapi-mcp`**. Un solo comando, `serve`:

```
openapi-mcp serve [options]
```

| Opzione | Valore predefinito | Descrizione |
| --- | --- | --- |
| `--port <n>` | `3000` | Porta HTTP del trasporto web. |
| `--host <host>` | `127.0.0.1` | Host HTTP. |
| `--transport <mode>` | `web` | `stdio` o `web`. |
| `--spec <path>` | — | Percorso del file OpenAPI, obbligatorio in modalità stdio. |
| `--base-url <url>` | — | Sovrascrive l’URL di base del servizio a monte. |
| `--api-key <key>` | — | Chiave API di amministrazione. |
| `--upstream-header "Name: value"` | — | Header per il servizio a monte, ripetibile. |
| `--timeout <ms>` | `30000` | Timeout per il servizio a monte. |
| `--no-persist` | — | Disabilita la persistenza dello stato. |

## Tipi (riesportati da `types`)

`ServerConfig`, `SecurityContext`, `AppState`, `PersistedState`, `ExecutionContext`, `TransportMode`, `SpecSource`, `ServiceStatus`, `ProtocolHint`, `LogDirection`, `LogLevel`, `ParameterLocation`, `BodyEncoding`, `ServiceEndpointInfo`, `ManagedServiceRecord`, `SpecIssue`, `AdminStatus`, `GeneratedPrompt`, `GeneratedResource`, `GeneratedTool`, `ResourceContentItem`, `PromptMessageShape`, `RequestLogEntry`, `LogQueryOptions`, `LogQueryResult`; `ResolvedPrompt` è deprecato. Funzioni di controllo: `isSpecSource`, `isServiceStatus`, `isProtocolHint`, `isParameterLocation`, `isBodyEncoding`, `isPlainRecord`.

## Errori e comportamento

- Gli ID sconosciuti di strumenti, prompt o risorse producono errori MCP `InvalidParams`, non errori incorporati nel risultato normale.
- Una specifica mancante durante una sessione attiva produce un `InternalError`.
- Le risposte 4xx/5xx del servizio a monte vengono restituite al modello come contenuto con `isError: true`, senza eccezioni. Solo gli errori di trasporto (DNS, TLS, timeout, annullamento) generano eccezioni.

## Vedi anche

- [Configurazione](../configuration/)
- [Esempi](../examples/)
