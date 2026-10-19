---
sidebar_position: 4
title: "Konfiguration"
description: "Die Konfiguration hat drei Ebenen: Factory-Optionen für Client oder Debugger, das an prepare() und send() übergebene SendOptions-Objekt sowie protokollspezifische Optionen."
---

# Konfiguration

Die Konfiguration hat drei Ebenen: Factory-Optionen für Client oder Debugger, das an `prepare()` und `send()` übergebene `SendOptions`-Objekt sowie protokollspezifische Optionen.

## Factory-Optionen

### `CreateClientOptions`

Wird an `createClient(options?)` übergeben. Alle Felder sind optional.

| Feld | Typ | Beschreibung |
| --- | --- | --- |
| `writeBack` | `WriteBackOptions` | Steuert das Zusammenführen von Antworten mit der Spezifikation |
| `response` | `ToResponseOptions` | Steuert die Normalisierung von Antwortobjekten |

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

Wird an `createDebugger(config?)` übergeben. Alle Felder sind optional.

| Feld | Typ | Beschreibung |
| --- | --- | --- |
| `adapters` | `ProtocolAdapter[]` | Eigene Adapterliste, die alle Standardadapter ersetzt |
| `extraAdapters` | `ProtocolAdapter[]` | Zusätzliche Adapter für die Standardregistrierung |
| `writeBack` | `WriteBackOptions` | Optionen zum Zurückschreiben |
| `response` | `ToResponseOptions` | Optionen zur Antwortnormalisierung |
| `writeBackTruncated` | `boolean` | Schreibt Schemas aus abgeschnittenen Streams zurück; Standard: `true` |

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

### Zurückschreiben und erfasste Beispiele

`WriteBackOptions` unterstützt `strategy` (`"merge"` oder `"replace"`, Standard `"merge"`), `keepExistingDescription` (Standard `true`), `allowedStatusCodes` (leer bedeutet alle), `protectComponentRefs` (Standard `true`), `overwriteExamples` (Standard `true`) und `requirePassingTests`. Die Sendepipeline prüft die Testergebnisse; ein direkter Aufruf von `writeBackResponse` tut dies nicht.

`ToResponseOptions` unterstützt `includeExamples` (Standard `true`), `maxExampleChars` (Standard `4000`) und `maxEventPreviewChars` (Standard `200`). Deaktivieren Sie die Beispielerfassung oder prüfen Sie die Beispiele vor der Veröffentlichung: Reale Antworten können Zugangsdaten oder personenbezogene Daten enthalten.

Die Sendepipeline liefert normalerweise eine geänderte Kopie in `patchedSpec`; sie verändert weder das Eingabedokument noch speichert sie eine Datei. Überspringen Sie diesen Schritt mit `writeBack: false` pro Aufruf. Das `writeBack`-Objekt der Factory konfiguriert die Zusammenführung; der boolesche Wert pro Aufruf aktiviert oder deaktiviert sie.

## `SendOptions`

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

### `ScriptConfig`

| Feld | Typ | Beschreibung |
| --- | --- | --- |
| `collectionPreRequest` | `ScriptSource \| ScriptSource[]` | Pre-Request-Skripte auf Collection-Ebene |
| `collectionTest` | `ScriptSource \| ScriptSource[]` | Testskripte auf Collection-Ebene |
| `preRequest` | `ScriptSource \| ScriptSource[]` | Pre-Request-Skripte auf Anfrageebene |
| `test` | `ScriptSource \| ScriptSource[]` | Testskripte auf Anfrageebene |
| `fromSpecExtensions` | `boolean` | Liest `x-postman-scripts` aus der Spezifikation; Standard: `true` |
| `captureLastResponse` | `boolean` | Ergänzt den integrierten Helfer, der die letzte Antwort für spätere Anfragen bereitstellt |

`ScriptSource`:
```typescript
interface ScriptSource {
  exec: string | string[];  // Script body, either a single string or array of lines
  id?: string;               // Optional identifier surfaced in script results
}
```

Setzen Sie `scripts.fromSpecExtensions: false`, wenn Sie in einer importierten Spezifikation eingebettete Skripte nicht ausführen möchten. Der aktuelle Standard ist `true`; verlassen Sie sich nicht auf eine zukünftige Änderung.

## Protokollspezifische Optionen

### HTTP / SSE

HTTP ist der Standardadapter. Deklariertes `text/event-stream` signalisiert SSE; bei der Ausführung wird die tatsächliche Antwort auch beim Eintreffen der Header klassifiziert. `probeStreamingResponse()` ist eine separate, ausdrücklich aufzurufende Prüfung und keine automatische Voraussetzung für jeden Aufruf.

Einfache HTTP-Anfragen benötigen keine weiteren Einstellungen. Für erweiterte postman-runtime-Konfiguration verwenden Sie `SendOptions.runner`.

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

Die manuelle MCP-Sitzung verwendet standardmäßig Streamable HTTP und `endpoint`. Für stdio übergeben Sie `kind: "mcp"`, `transport: "stdio"` und einen lokalen `command` mit optionalen `args`; das Öffnen der Sitzung startet den konfigurierten Prozess.

### gRPC

gRPC benötigt eine Adresse, eine Deskriptorquelle (`.proto`-Dateien oder Serverreflexion) sowie einen vollständig qualifizierten Dienst und eine Methode:

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

Factories für manuelle Sitzungen liefern eine noch nicht geöffnete Sitzung. Rufen Sie vor dem Senden `open()` und beim Aufräumen `close()` auf. Das gRPC-Beispiel benötigt einen passenden lokalen Server und eine proto-Datei; manuelle Sitzungsoptionen sind nicht dasselbe Objekt wie `SendOptions.grpc`.

## Vollständiges Beispiel

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

## Nächste Schritte

- Alle exportierten Typen finden Sie in der [API-Referenz](./api-reference.md)
- Protokollspezifische Anleitungen finden Sie unter [Beispiele](./examples.md)
