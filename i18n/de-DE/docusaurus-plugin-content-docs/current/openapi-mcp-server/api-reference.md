---
sidebar_position: 5
title: "API-Referenz"
description: "Vollständige API-Referenz für @powerduck/openapi-mcp-server: Spezifikationen laden, Tools, Prompts und Ressourcen erzeugen, Anfragen erstellen und ausführen, MCP-Server, Transporte, Verwaltung, Authentifizierung, Dienstregistrierung und CLI."
---

# API-Referenz

Alle öffentlichen Exporte von `@powerduck/openapi-mcp-server`, nach Funktionsbereich geordnet.

## Spezifikationen laden

| Export | Signatur | Beschreibung |
| --- | --- | --- |
| `loadOpenApiSpec(filePath)` | `(string) => Promise<Oas32Document>` | Liest eine JSON- oder YAML-Datei, validiert sie, löst Referenzen auf und prüft eindeutige Operations-IDs. YAML wird an der Erweiterung `.ya?ml` erkannt. |
| `parseSpecContent(rawText, isYaml)` | `(string, boolean) => Promise<Oas32Document>` | Parst ein Dokument aus einer Zeichenfolge. Leere oder ungültige Eingaben lösen einen Fehler aus. |

## Tools erzeugen

| Export | Signatur | Beschreibung |
| --- | --- | --- |
| `generateTools(spec)` | `(spec) => Tool[]` | Erzeugt MCP-`Tool`-Definitionen für jede Operation. |
| `generateToolsDetailed(spec)` | `(spec) => GenerateToolsResult` | Gibt `{ tools, bindings, issues }` zurück. |
| `buildBindingIndex(spec)` | `(spec) => Map<string, ToolBinding>` | Ordnet generierte Tool-Namen ihrem `ToolBinding` zu; Alias für `getBindingIndex`. |

Typexporte: `ToolBinding`, `GeneratedToolWithBinding` (Paketalias für `GeneratedTool`).

## Prompts und Ressourcen

| Export | Signatur | Beschreibung |
| --- | --- | --- |
| `generatePrompts(spec)` | `(spec) => GeneratedPrompt[]` | Listet alle generierten Prompts auf. |
| `resolvePrompt(spec, name, args?)` | `(spec, string, Record?) => GetPromptResult \| null` | Löst einen Prompt anhand seines Namens auf; bei unbekanntem Namen `null`. |
| `generateResources(spec)` | `(spec) => GeneratedResource[]` | Listet Katalogressourcen auf. |
| `readResource(spec, uri)` | `(spec, string) => ResourceContentItem \| null` | Liest eine Ressource anhand ihrer URI. |

## Anfragen erstellen und ausführen

| Export | Signatur | Beschreibung |
| --- | --- | --- |
| `buildRequest(baseUrl, templatePath, pathItem, operation, args, binding?)` | `=> BuiltRequest` | Serialisiert Argumente zu `{ url, query, headers, body, dropped }`. Positionsargumente. |
| `executeToolCall(spec, toolName, args, context?)` | `(spec, string, Record?, ExecutionContext?) => Promise<ToolCallResult>` | Führt ein generiertes Tool gegen die Ziel-API aus. Nicht-2xx-Antworten werden als Daten zurückgegeben; Transportfehler lösen Ausnahmen aus. |

Felder von `ToolCallResult`: `status`, `statusText`, `headers`, `data`, `truncated`, `url`, `method`, `durationMs`, `correlationId`.

## Hilfsfunktionen für Spezifikationen

| Export | Beschreibung |
| --- | --- |
| `iterateOperations(spec, issues?)` | Generator für alle aufgelösten Operationen, einschließlich OpenAPI-3.2-`additionalOperations`. |
| `collectOperationParameters(pathItem, operation, issues?, context?)` | Führt Pfad- und Operationsparameter anhand von `(name, in)` zusammen. |
| `normalizeParameter(candidate)` | Normalisiert einen rohen Parameter; bei unbrauchbarem Wert `null`. |
| `synthesizeOperationId(method, pathTemplate)` | Deterministische Ersatz-ID, wenn einer Operation `operationId` fehlt. |
| `ensureUniqueName(candidate, taken)` | Hängt ein Zahlensuffix an, um den Namen eindeutig zu halten. |
| `extractPathTemplateVariables(pathTemplate)` | Extrahiert `{name}`-Variablen; Duplikate werden unter Beibehaltung des ersten Vorkommens entfernt. |
| `effectiveStyle(parameter)` | Wendet den Spezifikationsstandard für `style` an. |
| `effectiveExplode(parameter)` | Wendet den Spezifikationsstandard für `explode` an. |
| `findOperationById(spec, operationId)` | Nach dem ersten Aufbau O(1)-Suche; bei unbekannter ID `null`. |
| `findDuplicateOperationIds(spec)` | Meldet doppelte, vom Autor vergebene IDs. |
| `assertUniqueOperationIds(spec)` | Löst bei doppelten Operations-IDs einen Fehler aus. |
| `isPlainObject(value)` | Grenzt den Typ auf ein einfaches Objekt ein. |
| `truncateGeneratedName(name, limit=64)` | Kürzt einen Namen unter Erhaltung seiner Eindeutigkeit. |

Typexporte: `OperationEntry`, `DuplicateOperationId`.

## MCP-Server und Transporte

| Export | Beschreibung |
| --- | --- |
| `buildMcpServer(specProvider, contextProvider?, options?)` | Erstellt einen SDK-`Server` mit Handlern für Tools, Prompts und Ressourcen. Positionsargumente. |
| `startStdioServer(spec, context?, options?)` | Stellt ein Dokument über stdio bereit; gibt `{ closed, close() }` zurück. |
| `attachMcpRoutes(app, options)` | Bindet Streamable-HTTP-Routen (`/mcp`) und optional ältere SSE-Routen (`/sse`) ein. Akzeptiert `AttachMcpRoutesOptions` und gibt `McpRouteHandle` zurück. |
| `attachSseRoutes(app, specProvider, contextProvider, routeGuard?)` | Veralteter Wrapper mit Positionsargumenten. Gibt `{ activeSessionCount, closeAll }` zurück. |
| `createStreamableSessionHost(options)` | Erstellt einen eigenständigen Streamable-HTTP-Sitzungshost für eigene Transportintegrationen. |

Typen: `SpecProvider = () => Document | null`, `ContextProvider = () => ExecutionContext`, `AttachMcpRoutesOptions`, `McpRouteHandle`, `StreamableSessionHost`, `StreamableSessionHostOptions`, `McpSessionEvent`, `McpSessionInfo`, `SessionCloseReason`, `SessionKind`.

`attachMcpRoutes` wird aus dem Paketstamm exportiert. Seine Optionen konfigurieren `maxSessions`, `allowedOrigins`, `sessionIdleMs` und den Schutz vor DNS-Rebinding. Das Handle bietet `activeSessionCount`, `pendingSessionCount`, `listSessions`, `closeSession`, `closeAll` und `dispose`. Verwenden Sie beim Herunterfahren `dispose()`, um sowohl den Bereinigungstimer zu stoppen als auch Sitzungen zu schließen.

## Verwaltungsserver und Authentifizierung (Unterpfad `./server`) {#admin-server-and-auth-server-subpath}

Importieren Sie `startAdminServer` aus `@powerduck/openapi-mcp-server/server` oder dem Paketstamm. Importieren Sie `createAuthMiddleware` aus dem Paketstamm; der Unterpfad `./server` exportiert diese Funktion nicht.

| Export | Signatur | Beschreibung |
| --- | --- | --- |
| `startAdminServer(config)` | `Promise<AdminServerHandle>` | Startet die Express-Verwaltungsanwendung mit Weboberfläche und MCP-Routen. Gibt `{ app, server, port, close() }` zurück. |
| `createAuthMiddleware(apiKey?)` | `RequestHandler` | Zugriffsschutz über Bearer oder `x-api-key`. Ohne Schlüssel deaktiviert. Positionsargument. |

## Laufzeit und Hilfsfunktionen

| Export | Beschreibung |
| --- | --- |
| `ServiceRegistry` | Klasse für `ManagedServiceRecord`-Einträge: `upsert`, `list`, `get`, `remove`, `clear`, `start`, `stop`, `fail`. |
| `isAbortError(error)` | Wahr bei `AbortError` oder axios-`CanceledError`. |
| `newId()` | UUID mit zeitstempelbasiertem Ersatzwert. |

## CLI

Programm **`openapi-mcp`** mit dem einzigen Befehl `serve`:

```
openapi-mcp serve [options]
```

| Option | Standardwert | Beschreibung |
| --- | --- | --- |
| `--port <n>` | `3000` | HTTP-Port für den Webtransport. |
| `--host <host>` | `127.0.0.1` | HTTP-Host. |
| `--transport <mode>` | `web` | `stdio` oder `web`. |
| `--spec <path>` | — | OpenAPI-Dateipfad; im stdio-Modus erforderlich. |
| `--base-url <url>` | — | Überschreibt die Basis-URL des Zielservers. |
| `--api-key <key>` | — | API-Schlüssel für die Verwaltung. |
| `--upstream-header "Name: value"` | — | Wiederholbar angebbarer Header für den Zielserver. |
| `--timeout <ms>` | `30000` | Zeitlimit für Zielserveranfragen. |
| `--no-persist` | — | Deaktiviert die Zustandsspeicherung. |

## Typen (aus `types` erneut exportiert)

`ServerConfig`, `SecurityContext`, `AppState`, `PersistedState`, `ExecutionContext`, `TransportMode`, `SpecSource`, `ServiceStatus`, `ProtocolHint`, `LogDirection`, `LogLevel`, `ParameterLocation`, `BodyEncoding`, `ServiceEndpointInfo`, `ManagedServiceRecord`, `SpecIssue`, `AdminStatus`, `GeneratedPrompt`, `GeneratedResource`, `GeneratedTool`, `ResourceContentItem`, `PromptMessageShape`, `RequestLogEntry`, `LogQueryOptions`, `LogQueryResult`; `ResolvedPrompt` ist veraltet. Prüffunktionen: `isSpecSource`, `isServiceStatus`, `isProtocolHint`, `isParameterLocation`, `isBodyEncoding`, `isPlainRecord`.

## Fehler und Verhalten

- Unbekannte Tool-, Prompt- oder Ressourcen-IDs erzeugen MCP-Fehler vom Typ `InvalidParams` statt Fehlerdaten im normalen Ergebnis.
- Fehlt bei aktiver Sitzung eine Spezifikation, entsteht ein `InternalError`.
- Antworten mit Status 4xx/5xx werden dem Modell als Inhalt mit `isError: true` zurückgegeben, ohne eine Ausnahme auszulösen. Nur Transportfehler (DNS, TLS, Zeitüberschreitung, Abbruch) lösen Ausnahmen aus.

## Weitere Informationen

- [Konfiguration](../configuration/)
- [Beispiele](../examples/)
