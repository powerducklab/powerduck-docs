---
sidebar_position: 4
title: "Konfiguration"
description: "Vollständige Konfiguration von @powerduck/openapi-mcp-server: ServerConfig, SecurityContext, ExecutionContext, TransportMode sowie Literal-Union-Typen für Quellen, Status, Protokolle, Logstufen und Body-Kodierungen."
---

# Konfiguration

Das zentrale Konfigurationsobjekt ist `ServerConfig`; es wird an `startAdminServer()` übergeben. Die zugehörigen Kontexttypen werden bei der Tool-Ausführung verwendet.

## `ServerConfig`

Nur `port` ist erforderlich.

| Feld | Typ | Standardwert | Beschreibung |
| --- | --- | --- | --- |
| `port` | `number` | — (erforderlich) | TCP-Port zum Binden, Ganzzahl von 0 bis 65535. |
| `host` | `string` | `"127.0.0.1"` | Netzwerkschnittstelle; standardmäßig Loopback, um unbeabsichtigte externe Erreichbarkeit zu vermeiden. |
| `apiKey` | `string` | undefined | Gemeinsames Geheimnis, das bei Konfiguration für Verwaltungs-API und HTTP-Transport erforderlich ist. |
| `specPath` | `string` | undefined | Beim Start einmalig geladene Spezifikation. |
| `baseUrlOverride` | `string` | undefined | Überschreibt die aus `servers[0].url` abgeleitete Basis-URL des Zielservers. |
| `upstreamHeaders` | `Record<string, string>` | undefined | Header, die jeder Anfrage an den Zielserver hinzugefügt werden. |
| `requestTimeoutMs` | `number` | undefined | Zeitlimit je Anfrage an den Zielserver in Millisekunden. |
| `persistState` | `boolean` | `true` | Geladene Spezifikation über Neustarts hinweg speichern. |
| `stateFilePath` | `string` | undefined | Pfad der Datei mit dem gespeicherten Zustand. |
| `allowedOrigins` | `string[]` | undefined | Erlaubte CORS-Ursprünge; leer oder nicht angegeben deaktiviert ursprungsübergreifenden Zugriff. |
| `allowedHosts` | `string[]` | undefined | Erlaubte Werte des `Host`-Headers. |
| `maxLogEntries` | `number` | 200 | Maximale Anzahl der im Arbeitsspeicher aufbewahrten Logeinträge. |
| `redactSensitiveHeaders` | `boolean` | `true` | Vertrauliche Headerwerte vor der Protokollierung maskieren. |
| `redactHeaderNames` | `string[]` | undefined | Zusätzlich zur integrierten Liste zu maskierende Headernamen. |
| `security` | `SecurityContext` | undefined | Bei jedem Tool-Aufruf an die Ziel-API weitergeleitete Zugangsdaten. |

## `SecurityContext`

| Feld | Typ | Gesendet als |
| --- | --- | --- |
| `bearerToken` | `string` | `Authorization: Bearer <token>` |
| `basicAuth` | `{ username, password }` | `Authorization: Basic <base64>` |
| `apiKeys` | `Record<string, string>` | Exakte Zuordnung von Headernamen zu Werten. |

Zugangsdaten werden vom Executor eingefügt und niemals als Tool-Argumente an das Modell weitergegeben.

## `ExecutionContext`

Aufrufkontext, der an `executeToolCall` übergeben und von einem `ContextProvider` zurückgegeben wird:

| Feld | Typ | Beschreibung |
| --- | --- | --- |
| `baseUrlOverride` | `string` | Überschreibt die Server-URL der Spezifikation für diesen Aufruf. |
| `upstreamHeaders` | `Record<string, string>` | Zusätzliche Header für den Zielserver. |
| `requestTimeoutMs` | `number` | Zeitlimit je Aufruf, mindestens 1 Sekunde. |
| `security` | `SecurityContext` | Zugangsdaten für den einzelnen Aufruf. |
| `correlationId` | `string` | Ordnet Logeinträge einem Aufruf zu. |
| `protocol` | `ProtocolHint` | Transport, der den Aufruf ausgelöst hat. |
| `onLog` | `(entry) => void` | Empfängt Anfrage- und Antwortprotokolle; darf keine Ausnahme auslösen. |
| `signal` | `AbortSignal` | Bricht eine laufende Anfrage an den Zielserver ab. |

## Literal-Union-Typen und Prüffunktionen

| Union-Typ | Werte | Prüffunktion |
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

Wird als drittes Argument an `buildMcpServer()` übergeben:

| Feld | Typ | Standardwert | Beschreibung |
| --- | --- | --- | --- |
| `protocol` | `ProtocolHint` | undefined | Bekanntgegebener Protokollhinweis. |
| `name` | `string` | `"openapi-mcp"` | Bekanntgegebener Servername. |
| `version` | `string` | `"1.1.0"` | Bekanntgegebene Serverversion. |
| `pageSize` | `number` | 100 | Maximale Einträge je Listenantwort, höchstens 500. |
| `instructions` | `string` | integriert | Über MCP `instructions` bereitgestellter Nutzungshinweis. |

## Optionen der Transportschicht (`AttachMcpRoutesOptions`)

Importieren Sie `attachMcpRoutes` aus `@powerduck/openapi-mcp-server` und übergeben Sie das Optionsobjekt als zweites Argument. Der ältere Wrapper `attachSseRoutes()` akzeptiert nur die Positionsargumente `(app, specProvider, contextProvider, routeGuard?)`.

| Feld | Typ | Standardwert | Beschreibung |
| --- | --- | --- | --- |
| `specProvider` | `SpecProvider` | — (erforderlich) | Liefert das Dokument für neue Sitzungen. |
| `contextProvider` | `ContextProvider` | — (erforderlich) | Liefert den Kontext für Zielserveranfragen je Aufruf. |
| `routeGuard` | `RequestHandler` | undefined | Middleware für sämtliche MCP-Routen. |
| `maxSessions` | `number` | 64 | Maximale Anzahl gleichzeitiger Sitzungen. |
| `sessionIdleMs` | `number` | 600000 | Leerlaufzeitlimit in Millisekunden; 0 deaktiviert es. |
| `allowedOrigins` | `string[]` | undefined | Erlaubte Ursprünge; eine nicht leere Liste aktiviert den Schutz vor DNS-Rebinding. |
| `allowedHosts` | `string[]` | undefined | Erlaubte Werte des `Host`-Headers. |
| `enableLegacySse` | `boolean` | `true` | Veralteten HTTP+SSE-Transport einbinden. |
| `onEvent` | `(event: McpSessionEvent) => void` | undefined | Empfängt Lebenszyklusereignisse; darf keine Ausnahme auslösen. |

> Dies sind Optionen für `attachMcpRoutes`, keine zusätzlichen Felder von `ServerConfig`. Der Verwaltungsserver reicht seine Ursprungs- und Host-Einstellungen weiter, verwendet aber die Standardsitzungslimits und das Standardleerlaufzeitlimit des Transports. Zum Anpassen dieser Grenzen verwenden Sie die öffentliche Transportfunktion direkt.

## Weitere Informationen

- [API-Referenz](../api-reference/)
- [Beispiele](../examples/)
