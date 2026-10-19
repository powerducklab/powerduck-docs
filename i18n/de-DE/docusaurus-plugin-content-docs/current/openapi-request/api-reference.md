---
sidebar_position: 5
title: "API-Referenz"
description: "Referenz der wichtigsten Integrations-APIs von @powerduck/openapi-request"
---

# API-Referenz

Referenz der wichtigsten Integrations-APIs von `@powerduck/openapi-request`. Die Tabellen fassen die Schnittstellen zusammen; die TypeScript-Deklarationen des Pakets enthalten sämtliche Überladungen und optionalen Parameter. Haupteinstiegspunkt und Protokoll-Unterpfade exportieren nicht dieselben Elemente.

## Kern-API

### `createClient(options?): ProtoClient`

Erstellt den auf Benutzeroberflächen ausgerichteten Client. Das Argument `options` ist optional.

**Parameter:**

| Name | Typ | Beschreibung |
| --- | --- | --- |
| `options` | `CreateClientOptions` | Optionale Konfiguration |
| `options.writeBack` | `WriteBackOptions` | Steuert das Zusammenführen von Antworten mit der Spezifikation |
| `options.response` | `ToResponseOptions` | Steuert die Normalisierung von Antwortobjekten |

**Rückgabe:** `ProtoClient` mit den folgenden Methoden:

| Methode | Signatur | Beschreibung |
| --- | --- | --- |
| `prepare` | `(sendOptions: SendOptions) => PreparedRequest` | Plant eine Anfrage und liefert Protokoll, Anzeigemodus und Stream-Typ |
| `send` | `(sendOptions: SendOptions) => Promise<SendResult>` | Führt eine Anfrage aus |
| `sendMany` | `(spec, targets, shared?) => Promise<SendManyResult>` | Stapelverarbeitung mit Ergebnissen je Ziel; Fehler verwerfen keine anderen Ergebnisse |
| `connect` | `(connectOptions: ManualSessionOptions) => AnyManualSession` | Erstellt eine ungeöffnete websocket/mcp/grpc-Sitzung; mit `open()` verbinden |
| `discover` | `(discoverOptions) => Promise<any>` | Ermittelt Funktionen von MCP und gRPC |
| `writeback` | `(spec, prepared, result, writeOptions?) => OpenApiDocument` | Führt die beobachtete Antwort mit dem Dokument zusammen |
| `dispose` | `() => void` | Derzeit ohne Wirkung; Aufrufer müssen ihre Sitzungen selbst schließen |
| `probeStreamingResponse` | `(input: RequestInfo \| URL, init?: RequestInit) => Promise<{ ok: boolean; status: number; contentType?: string; kind: "none" \| "sse" \| "ndjson" \| "chunked"; response: Response }>` | Führt eine fetch-Anfrage aus und klassifiziert die Antwort; den zurückgegebenen Antwortkörper lesen oder abbrechen |

**Beispiel:**

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

Erstellt den skriptfähigen Debugger für Automatisierung, Skripte und CI.

**Parameter:**

| Name | Typ | Beschreibung |
| --- | --- | --- |
| `config` | `DebuggerOptions` | Optionale Konfiguration |
| `config.adapters` | `ProtocolAdapter[]` | Benutzerdefinierte Adapterliste, die die Standardadapter ersetzt |
| `config.extraAdapters` | `ProtocolAdapter[]` | Zusätzliche Adapter zu den Standardadaptern |
| `config.writeBack` | `WriteBackOptions` | Optionen zum Zurückschreiben |
| `config.response` | `ToResponseOptions` | Optionen zur Antwortnormalisierung |
| `config.writeBackTruncated` | `boolean` | Schreibt das aus abgeschnittenen Streams abgeleitete Schema zurück (Standard: true) |

**Rückgabe:** `ProtoKit` mit `prepare`, `send`, `sendMany`, `toCollection` und weiteren Methoden.

**Beispiel:**

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

Erstellt eine langlebige Duplexsitzung für WebSocket, MCP oder gRPC. Die Factory führt keine Ein-/Ausgabe aus; die Verbindung wird erst mit `open()` hergestellt.

**Parameter:**

| Name | Typ | Beschreibung |
| --- | --- | --- |
| `options.kind` | `"websocket" \| "mcp" \| "grpc"` | Zu verwendendes Protokoll |
| `options.url` | `string` | WebSocket-Verbindungs-URL |
| `options.endpoint` | `string` | MCP-Endpunkt für Streamable HTTP |
| `options.transport` | `"streamable-http" \| "stdio"` | MCP-Transport; standardmäßig Streamable HTTP |
| `options.command`, `options.args` | `string`, `string[]` | Lokales Programm und Argumente für MCP über stdio |
| `options.address`, `options.service`, `options.method` | `string` | gRPC-Adresse, vollständig qualifizierter Dienstname und Methode |

Für gRPC ist außerdem eine Deskriptorquelle über `protoPaths` oder `reflection` erforderlich. Protokollspezifische Optionen stehen unter [Konfiguration](./configuration.md).

**Rückgabe:** Eine Sitzung mit `open()`, `send()`, `close()`, `onEvent()`, `waitForClose()`, `events` und `state`. `onEvent()` gibt ein Abonnement mit `unsubscribe()` zurück.

**Beispiel:**

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

Registry für `ProtocolAdapter`-Instanzen. Eine neue Registry ist leer; `createDebugger()` registriert die integrierten HTTP-, WebSocket-, gRPC-, MCP- und GraphQL-Adapter, sofern keine benutzerdefinierte Liste sie ersetzt. Mit `register()`, `unregister()`, `get()`, `list()`, `rank()` und `resolve()` verwalten Sie die Auswahl.

### `ProtoKitError`

Typisierter Fehler aus dem Debugger und den Kernfunktionen. Mit `instanceof ProtoKitError` unterscheiden Sie Bibliotheksfehler von unerwarteten Fehlern.

## Kerntypen

### `SendOptions`

Das zentrale Eingabeobjekt für `prepare()` und `send()`. Hier übergeben Sie Spezifikation, Ziel, Werte und sämtliche Einstellungen auf Anfrageebene.

| Feld | Typ | Erforderlich | Beschreibung |
| --- | --- | --- | --- |
| `spec` | `OpenApiDocument` | Ja | Das vollständige OpenAPI-3.2-Dokument |
| `target` | `OperationTarget` | Ja | Operationskennung, siehe unten |
| `values` | `RequestValues` | Nein | Konkrete Werte für path/query/header/cookie/body |
| `serverUrl` | `string` | Nein | Überschreibt `spec.servers[0].url` |
| `serverVariables` | `Record<string, string>` | Nein | Variablen der Server-URL-Vorlage |
| `variables` | `Record<string, string>` | Nein | Als `{{name}}` referenzierte Umgebungsvariablen |
| `globals` | `Record<string, string>` | Nein | Globale Variablen im Postman-Stil |
| `localVariables` | `Record<string, string>` | Nein | Lokale Variablen |
| `collectionVariables` | `Record<string, string>` | Nein | Variablen auf Collection-Ebene |
| `auth` | `AuthConfig` | Nein | Authentifizierungskonfiguration |
| `scripts` | `ScriptConfig` | Nein | Skripte vor der Anfrage und Testskripte |
| `runner` | `RuntimeRunOptions` | Nein | Vollständige Durchreichung der postman-runtime-Optionen mit höchster Priorität |
| `websocket` | `WebSocketOptions` | Nein | WebSocket-Optionen |
| `graphql` | `GraphQLOptions` | Nein | GraphQL-Optionen |
| `mcp` | `McpOptions` | Nein | MCP-Optionen |
| `grpc` | `any` | Nein | gRPC-Optionen |
| `timeout` | `number` | Nein | Zeitlimit pro Anfrage in ms, Kurzform für `runner.timeout.request` |

`SendOptions` akzeptiert außerdem diese Ausführungs- und Streaming-Einstellungen:

| Feld | Typ | Beschreibung |
| --- | --- | --- |
| `fetch` | `typeof fetch` | Isolierter fetch-Transport des Hosts, sofern unterstützt; HTTP/SSE verwenden weiterhin postman-runtime. |
| `writeBack` | `boolean` | Mit `false` bleibt `patchedSpec` undefiniert, während `responseFragment` weiterhin erzeugt wird. |
| `signal` | `AbortSignal` | Bricht Ausführung oder Sampling ab; ein Teilergebnis kann weiterhin zurückgegeben werden. |
| `maxEvents` | `number` | Maximale Anzahl gespeicherter Streamereignisse. |
| `maxStreamMs` | `number` | Maximale Streaming-Sampling-Dauer in Millisekunden. |
| `maxResponseSize` | `number` | Größenlimit der Antwort in Bytes. |
| `maxBufferChars` | `number` | SSE-Parser-Pufferlimit vor einer Ereignisgrenze; Standard: `4194304` Zeichen. |
| `maxEventChars` | `number` | Limit der gespeicherten Daten je SSE-Ereignis; Standard: `1048576` Zeichen. |
| `inheritEventId` | `boolean` | Übernimmt die letzte SSE-Ereignis-ID, wenn sie fehlt; Standard: `true`. Für strengere Schemaableitung auf `false` setzen. |
| `onEvent` | `(event: StreamEvent) => void` | Empfängt Streamereignisse. |
| `onConsole` | `(log: ConsoleLog) => void` | Empfängt Konsolenausgaben von Skripten. |
| `onAssertion` | `(assertion: AssertionResult) => void` | Empfängt Assertion-Ergebnisse. |
| `onResponseStart` | `(info: ResponseStartInfo) => void` | Liest frühe HTTP/SSE-Header und die `streaming`-Klassifizierung. |
| `onOpen` | `(info) => void` | Empfängt WebSocket-Verbindungsdetails: URL, Protokoll und Header. |

Protokolladapter können Limits unterschiedlich auslegen. Halten Sie UI-Callbacks schlank; die Ausführungsschicht fängt geworfene Fehler ab. HTTP-Requester-Einstellungen gehören in `runner.requester`; dessen `maxResponseSize` muss, sofern angegeben, positiv sein und darf nicht null sein.

### `OperationTarget`

Identifiziert eine Operation. Verwenden Sie vorzugsweise entweder `operationId` oder `method` + `path`. Wenn beides angegeben ist, hat `operationId` Vorrang.

| Feld | Typ | Beschreibung |
| --- | --- | --- |
| `operationId` | `string` | Alternativer Suchschlüssel mit Vorrang vor Pfad und Methode |
| `method` | `string` | HTTP-Methode ohne Beachtung der Groß-/Kleinschreibung. Benötigt `path`. |
| `path` | `string` | Pfadvorlage, beispielsweise `/users/{id}`. Benötigt `method`. |

### `RequestValues`

Konkrete Werte, die in die erzeugte Anfrage eingesetzt werden.

| Feld | Typ | Beschreibung |
| --- | --- | --- |
| `path` | `Record<string, unknown>` | Werte für Pfadparameter |
| `query` | `Record<string, unknown>` | Werte für Abfrageparameter |
| `header` | `Record<string, unknown>` | Headerwerte |
| `cookie` | `Record<string, unknown>` | Cookiewerte |
| `querystring` | `string` | Unveränderte, bereits kodierte Abfragezeichenfolge für die OpenAPI-3.2-Position `querystring` |
| `body` | `unknown` | Anfragebody |
| `contentType` | `string` | Erzwingt einen Medientyp, wenn die Operation mehrere deklariert |

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

| Feld | Typ | Beschreibung |
| --- | --- | --- |
| `type` | `AuthConfig["type"]` | Authentifizierungstyp |
| `token` | `string` | Bearer-Token für `type: "bearer"` |
| `username` | `string` | Basic-Benutzername für `type: "basic"` |
| `password` | `string` | Basic-Passwort für `type: "basic"` |
| `key` | `string` | API-Schlüsselname für `type: "apikey"` |
| `value` | `string` | API-Schlüsselwert für `type: "apikey"` |
| `in` | `"header" \| "query"` | API-Schlüsselposition für `type: "apikey"` |

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

Erweiterte Authentifizierungstypen sind `digest`, `oauth1`, `oauth2`, `jwt`, `hawk`, `aws4`, `ntlm`, `asap` und `edgegrid`. Übergeben Sie deren Postman-Hilfsfelder für HTTP/SSE/GraphQL über `parameters: Record<string, string | boolean | number>`. Das optionale `oauth2: OAuth2FlowConfig` aktiviert Tokenbeschaffung und -erneuerung für OAuth 2.0. Gehen Sie nicht davon aus, dass jeder Authentifizierungshelfer mit jedem Protokoll funktioniert.

### `PreparedRequest`

Wird von `createClient().prepare()` zurückgegeben. Der Debugger liefert ein anderes Planungsergebnis: `createDebugger().prepare()` gibt `PlanResult` mit `located`, `adapter` und `plan` zurück.

| Feld | Typ | Beschreibung |
| --- | --- | --- |
| `protocol` | `string` | Ermitteltes Protokoll (http, websocket, grpc, graphql, mcp) |
| `transport` | `string` | Ermittelter Transport |
| `target` | `OperationTarget` | Ursprüngliches Ziel |
| `operation` | `any` | Ermitteltes OpenAPI-Operationsobjekt |
| `display.mode` | `DisplayMode` | `"response" \| "event-list" \| "duplex-session"` |
| `stream.kind` | `StreamKind` | Stream-Klassifizierung (siehe unten) |
| `stream.expected` | `boolean` | Ob Streaming erwartet wird |
| `openapi.extensions` | `Record<string, unknown>` | Ermittelte OpenAPI-Erweiterungen |
| `warnings` | `string[]` | Warnungen während der Planung |

### `StreamKind`

Genaue Stream-Klassifizierung: `"none" | "sse" | "ndjson" | "chunked" | "websocket" | "graphql-stream" | "grpc-unary" | "grpc-server-stream" | "grpc-client-stream" | "grpc-bidi" | "mcp-http-stream" | "mcp-stdio"`

## OpenAPI-Hilfsfunktionen

| Export | Signatur | Beschreibung |
| --- | --- | --- |
| `locateOperation` | `(spec, target) => LocatedOperation` | Ermittelt eine Operation anhand von `OperationTarget` |
| `inferSchema` | `(value) => Schema` | Leitet ein JSON Schema aus einem einzelnen beobachteten Wert ab |
| `inferSchemaFromMany` | `(values) => Schema` | Leitet ein Schema für mehrere beobachtete Werte ab |
| `mergeSchema` | `(a, b) => Schema` | Führt zwei abgeleitete Schemas zusammen (Vereinigung oder Kombination) |
| `sampleFromSchema` | `(schema) => unknown` | Erzeugt einen realistischen Beispielwert für ein Schema |
| `toResponseObject` | `(result, options?) => { statusCode: string; response: any }` | Erstellt ein OpenAPI-Antwortobjekt aus einem beobachteten Ergebnis |
| `writeBackResponse` | `(spec, path, method, fragment, options?) => spec` | Führt eine beobachtete Antwort mit dem Dokument zusammen |

Exportierte Typen: `LocatedOperation`, `WriteBackOptions`, `ToResponseOptions`.

## HTTP / SSE

Die folgenden Namen stehen am Haupteinstiegspunkt bereit. Der Unterpfad `@powerduck/openapi-request/http` exportiert `HttpAdapter`, `SseParser`, `buildCollection`, `buildEnvironment`, `resolveServerUrl`, `buildRunOptions` und `runWithPostman`. Erkennungshilfen und `BUILTIN_CAPTURE_TEST` importieren Sie vom Haupteinstiegspunkt.

| Export | Beschreibung |
| --- | --- |
| `HttpAdapter` | Standard-Protokolladapter für HTTP/HTTPS |
| `SseParser` | Streaming-Parser, der einen SSE-Bytestrom in strukturierte Ereignisse umwandelt |
| `isStreamingOperation` | Klassifiziert eine Operation anhand deklarierter Inhaltstypen als Streaming |
| `isSseContentType` | Prüft, ob ein Inhaltstyp SSE kennzeichnet |
| `isStreamingContentType` | Prüft, ob ein Inhaltstyp Streaming kennzeichnet |
| `acceptHeaderFor` | Erzeugt den passenden Accept-Header für eine Operation |
| `probeStreamingResponse` | Führt eine fetch-Anfrage aus und klassifiziert die Antwort; den zurückgegebenen Antwortkörper lesen oder abbrechen |
| `BUILTIN_CAPTURE_TEST` | Integriertes Postman-Testskript zum Erfassen der letzten Antwort |

## WebSocket

Import über `@powerduck/openapi-request/ws`.

| Export | Beschreibung |
| --- | --- |
| `WebSocketAdapter` | Protokolladapter für WebSocket-Ziele |
| `createWsManualSession` | Erstellt eine manuelle WebSocket-Duplexsitzung, auch als `runWebSocketSession` und `wsManualSession` verfügbar |

## GraphQL

Import über `@powerduck/openapi-request/graphql`.

| Export | Beschreibung |
| --- | --- |
| `GraphQLAdapter` | Protokolladapter für GraphQL-Ziele |
| `resolveGraphQLConfig` | Ermittelt die GraphQL-Konfiguration einer Operation |
| `runGraphQL` | Führt eine GraphQL-Operation aus |
| `introspectSchema` | Liest das Schema eines GraphQL-Endpunkts per Introspektion |
| `INTROSPECTION_QUERY` | Standardabfrage zur GraphQL-Introspektion |
| `generateOperation` | Erzeugt ein Abfragedokument aus einem introspektierten GraphQL-Schema und einem Feld |
| `generateAllOperations` | Erzeugt Abfragedokumente für die Felder eines introspektierten GraphQL-Schemas |
| `writeGraphQLOperations` | Schreibt erzeugte GraphQL-Operationen in die Spezifikation zurück |
| `discoverAndWriteGraphQLSchema` | Ermittelt ein GraphQL-Schema und schreibt es in die Spezifikation |

## MCP (Model Context Protocol)

Die meisten folgenden Einträge sind unter `@powerduck/openapi-request/mcp` verfügbar. Importieren Sie `initializeMcpSession` vom Haupteinstiegspunkt; im Unterpfad heißt die Funktion `initializeSession`. Der Unterpfad stellt außerdem `runMcp`, `createMcpSessionCore` und `createMcpStdioConnection` bereit.

| Export | Beschreibung |
| --- | --- |
| `McpAdapter` | Protokolladapter für MCP-Ziele |
| `createMcpManualSession` | Erstellt eine manuelle MCP-Sitzung, auch als `mcpManualSession` verfügbar |
| `createMcpStdioSession` | Erstellt eine MCP-Sitzung über stdio |
| `runMcpManualSession` | Veraltet: Verwenden Sie `createMcpManualSession` |
| `resolveMcpConfig` | Ermittelt die MCP-Konfiguration einer Operation |
| `initializeMcpSession` | Initialisiert eine MCP-Sitzung (Alias von `initializeSession`) |
| `discoverMcpCapabilities` | Ermittelt Funktionen eines MCP-Servers |
| `MCP_PROTOCOL_VERSION` | Unterstützte MCP-Protokollversion |
| `generateMcpCall` | Erzeugt einen einzelnen MCP-Tool-Aufruf |
| `generateAllMcpCalls` | Erzeugt alle MCP-Tool-Aufrufe |
| `writeMcpOperations` | Schreibt MCP-Operationen in die Spezifikation zurück |
| `discoverAndWriteMcpCapabilities` | Ermittelt MCP-Funktionen und schreibt sie in die Spezifikation |
| `createHttpMcpTransport` | Erstellt einen HTTP-Transport für MCP |
| `createStdioMcpTransport` | Erstellt einen stdio-Transport für MCP |

## gRPC

Importieren Sie die Low-Level-Hilfsfunktionen für Erkennung, Aufrufe und Deskriptoren über `@powerduck/openapi-request/grpc`. `GrpcProtocolAdapter`, `createGrpcManualSession`, `grpcManualSession`, `grpcDiscover` und `discoverGrpc` werden vom Haupteinstiegspunkt importiert; im Unterpfad heißt die Erkennungsfunktion `discover`. Dort stehen auch `discoverFromCatalog`, `describeMethod` und `describeFromCatalog` bereit, um einen Katalog wiederzuverwenden, statt für jede Methode erneut Reflection auszuführen.

| Export | Beschreibung |
| --- | --- |
| `GrpcProtocolAdapter` | gRPC-Protokolladapter für OpenAPI |
| `GrpcAdapter` | Low-Level-gRPC-Adapter |
| `grpcDiscover` / `discoverGrpc` | Ermittelt gRPC-Dienste und -Methoden |
| `createGrpcManualSession` / `grpcManualSession` | Erstellt eine manuelle gRPC-Sitzung |
| `grpcCall` | Führt einen einzelnen gRPC-Aufruf aus |
| `resolveMethod` | Ermittelt einen gRPC-Methodendeskriptor |
| `buildMessageTemplate` | Erstellt eine Nachrichtenvorlage aus einem Deskriptor |
| `buildCatalog` | Erstellt einen Katalog von Diensten und Methoden |
| `LOADER_OPTIONS` | Standardoptionen des Proto-Loaders |
| `scanProtoFiles` | Sucht in Verzeichnissen nach Proto-Dateien |
| `deriveIncludeDirsDetailed` | Leitet Include-Verzeichnisse aus Proto-Dateipfaden ab |
| `fetchDescriptorSet` | Ruft einen Deskriptorsatz per gRPC Reflection ab |
| `fetchFullDescriptorSet` | Ruft einen vollständigen Deskriptorsatz einschließlich aller Abhängigkeiten ab |
| `listServices` | Listet Dienste eines Deskriptorsatzes auf |
| `listServicesDetailed` | Listet Dienste mit detaillierten Methodeninformationen auf |
| `serializeDescriptorSet` | Serialisiert einen Deskriptorsatz in Bytes |
| `decodeFileDescriptorProto` | Dekodiert ein einzelnes Dateideskriptor-Proto |
| `decodeFileDescriptorSet` | Dekodiert einen Dateideskriptorsatz |
| `buildCredentials` | Erstellt gRPC-Anmeldedaten (synchron) |
| `buildCredentialsAsync` | Erstellt gRPC-Anmeldedaten (asynchron) |
| `buildCredentialsChecked` | Erstellt und validiert Anmeldedaten (synchron) |
| `buildCredentialsCheckedAsync` | Erstellt und validiert Anmeldedaten (asynchron) |
| `loadGrpc` | Lädt das Paket `@grpc/grpc-js` dynamisch |
| `isGrpcAvailable` | Prüft, ob gRPC-Abhängigkeiten verfügbar sind |
| `requireCapability` | Fordert eine bestimmte gRPC-Funktion an und wirft bei Nichtverfügbarkeit einen Fehler |

Der Haupteinstiegspunkt exportiert die Typaliase `GrpcDiscoveryResult`, `GrpcDiscoveredMethod` und `GrpcDiscoveredService`. Im gRPC-Unterpfad heißen sie `DiscoveryResult`, `DiscoveredMethod` und `DiscoveredService`.

Fehlertypen: `ReflectionProtocolError`, `ReflectionUnavailableError`, `DescriptorDecodeError`, `GrpcDependencyBrokenError`, `GrpcDependencyMissingError`.

## Weitere Hilfsfunktionen

Der Haupteinstiegspunkt exportiert außerdem die OAuth-2.0-Hilfsfunktionen `resolveOAuth2Token`, `acquireOAuth2Token`, `isOAuth2TokenExpired`, `oauth2RefreshStatuses` und `authFromOAuth2Token`, die Kopierfunktion `toCloneable`, die Basisklasse `UnifiedSession` sowie die gRPC-Schreibfunktionen `writeGrpcOperations` und `discoverAndWriteGrpcOperations`.

## Unterpfad-Exporte

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
