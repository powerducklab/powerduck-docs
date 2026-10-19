---
sidebar_position: 4
title: "Configurazione"
description: "Configurazione completa di @powerduck/openapi-mcp-server: ServerConfig, SecurityContext, ExecutionContext, TransportMode e unioni di letterali per origini, stati, protocolli, livelli di log e codifiche del corpo."
---

# Configurazione

L’oggetto centrale di configurazione è `ServerConfig`, accettato da `startAdminServer()`. I tipi di contesto associati vengono usati nell’esecuzione degli strumenti.

## `ServerConfig`

Solo `port` è obbligatorio.

| Campo | Tipo | Valore predefinito | Descrizione |
| --- | --- | --- | --- |
| `port` | `number` | — (obbligatorio) | Porta TCP di ascolto, intero da 0 a 65535. |
| `host` | `string` | `"127.0.0.1"` | Interfaccia di ascolto; loopback per impostazione predefinita, per evitare esposizioni involontarie. |
| `apiKey` | `string` | undefined | Segreto condiviso richiesto dall’API di amministrazione e dal trasporto HTTP quando è impostato. |
| `specPath` | `string` | undefined | Specifica caricata una sola volta all’avvio. |
| `baseUrlOverride` | `string` | undefined | Sovrascrive l’URL di base del servizio a monte derivato da `servers[0].url`. |
| `upstreamHeaders` | `Record<string, string>` | undefined | Header aggiunti a ogni richiesta al servizio a monte. |
| `requestTimeoutMs` | `number` | undefined | Timeout per richiesta al servizio a monte, in millisecondi. |
| `persistState` | `boolean` | `true` | Conserva la specifica caricata tra i riavvii. |
| `stateFilePath` | `string` | undefined | Percorso del file di stato persistente. |
| `allowedOrigins` | `string[]` | undefined | Origini CORS consentite; un elenco vuoto o omesso disabilita l’accesso tra origini diverse. |
| `allowedHosts` | `string[]` | undefined | Valori consentiti dell’header `Host`. |
| `maxLogEntries` | `number` | 200 | Numero massimo di voci di log conservate in memoria. |
| `redactSensitiveHeaders` | `boolean` | `true` | Oscura i valori degli header sensibili prima di registrarli. |
| `redactHeaderNames` | `string[]` | undefined | Nomi di header aggiuntivi da oscurare oltre all’elenco integrato. |
| `security` | `SecurityContext` | undefined | Credenziali inoltrate all’API a monte per ogni chiamata a uno strumento. |

## `SecurityContext`

| Campo | Tipo | Inviato come |
| --- | --- | --- |
| `bearerToken` | `string` | `Authorization: Bearer <token>` |
| `basicAuth` | `{ username, password }` | `Authorization: Basic <base64>` |
| `apiKeys` | `Record<string, string>` | Coppie esatte di nome dell’header e valore. |

Le credenziali vengono inserite dall’esecutore e non sono mai esposte al modello come argomenti degli strumenti.

## `ExecutionContext`

Contesto per chiamata passato a `executeToolCall` e restituito da un `ContextProvider`:

| Campo | Tipo | Descrizione |
| --- | --- | --- |
| `baseUrlOverride` | `string` | Sovrascrive l’URL del server della specifica per questa chiamata. |
| `upstreamHeaders` | `Record<string, string>` | Header aggiuntivi per il servizio a monte. |
| `requestTimeoutMs` | `number` | Timeout per chiamata, con un minimo di 1 secondo. |
| `security` | `SecurityContext` | Credenziali per la singola chiamata. |
| `correlationId` | `string` | Collega le voci di log di una stessa invocazione. |
| `protocol` | `ProtocolHint` | Trasporto che ha avviato la chiamata. |
| `onLog` | `(entry) => void` | Riceve le voci di log di richieste e risposte; non deve mai generare eccezioni. |
| `signal` | `AbortSignal` | Annulla una richiesta in corso al servizio a monte. |

## Unioni di letterali e funzioni di controllo

| Unione | Valori | Funzione di controllo |
| --- | --- | --- |
| `TransportMode` | `"stdio" \| "web"` | — |
| `SpecSource` | `"startup-file" \| "upload" \| "paste" \| "runtime"` | `isSpecSource()` |
| `ServiceStatus` | `"running" \| "stopped" \| "error"` | `isServiceStatus()` |
| `ProtocolHint` | `"streamable-http" \| "sse" \| "stdio"` | `isProtocolHint()` |
| `LogDirection` | `"request" \| "response" \| "internal"` | — |
| `LogLevel` | `"debug" \| "info" \| "warn" \| "error"` | — |
| `ParameterLocation` | `"path" \| "query" \| "header" \| "cookie"` | `isParameterLocation()` |
| `BodyEncoding` | `"json" \| "form-urlencoded" \| "multipart" \| "text" \| "binary"` | `isBodyEncoding()` |

## `BuildMcpServerOptions`

Passato come terzo argomento a `buildMcpServer()`:

| Campo | Tipo | Valore predefinito | Descrizione |
| --- | --- | --- | --- |
| `protocol` | `ProtocolHint` | undefined | Indicazione del protocollo annunciata. |
| `name` | `string` | `"openapi-mcp"` | Nome del server annunciato. |
| `version` | `string` | `"1.1.0"` | Versione del server annunciata. |
| `pageSize` | `number` | 100 | Numero massimo di voci per risposta di elenco, fino a 500. |
| `instructions` | `string` | integrato | Indicazione d’uso esposta tramite MCP `instructions`. |

## Opzioni del livello di trasporto (`AttachMcpRoutesOptions`)

Importa `attachMcpRoutes` da `@powerduck/openapi-mcp-server` e passa un oggetto di opzioni come secondo argomento. Il wrapper legacy `attachSseRoutes()` accetta solo gli argomenti posizionali `(app, specProvider, contextProvider, routeGuard?)`.

| Campo | Tipo | Valore predefinito | Descrizione |
| --- | --- | --- | --- |
| `specProvider` | `SpecProvider` | — (obbligatorio) | Fornisce il documento per le nuove sessioni. |
| `contextProvider` | `ContextProvider` | — (obbligatorio) | Fornisce il contesto del servizio a monte per ogni chiamata. |
| `routeGuard` | `RequestHandler` | undefined | Middleware applicato a ogni rotta MCP. |
| `maxSessions` | `number` | 64 | Limite delle sessioni simultanee. |
| `sessionIdleMs` | `number` | 600000 | Timeout di inattività in millisecondi; 0 lo disabilita. |
| `allowedOrigins` | `string[]` | undefined | Origini consentite; un elenco non vuoto abilita la protezione dal DNS rebinding. |
| `allowedHosts` | `string[]` | undefined | Valori consentiti dell’header `Host`. |
| `enableLegacySse` | `boolean` | `true` | Monta il trasporto HTTP+SSE deprecato. |
| `onEvent` | `(event: McpSessionEvent) => void` | undefined | Riceve gli eventi del ciclo di vita; non deve mai generare eccezioni. |

> Queste sono opzioni di `attachMcpRoutes`, non campi aggiuntivi di `ServerConfig`. Il server di amministrazione inoltra le impostazioni di origini e host, ma usa il limite delle sessioni e il timeout di inattività predefiniti del trasporto. Per modificarli, usa direttamente la funzione pubblica di trasporto.

## Vedi anche

- [Riferimento API](../api-reference/)
- [Esempi](../examples/)
