---
sidebar_position: 4
title: "API-Referenz"
description: "Referenz zum öffentlichen Einstiegspunkt von @powerduck/x-to-openapi"
---

# API-Referenz

Referenz zum öffentlichen Einstiegspunkt von `@powerduck/x-to-openapi`. Die Signaturen fassen die API zusammen; vollständige readonly-Annotationen und importierte Typen finden Sie in den TypeScript-Deklarationen des Pakets.

---

## Hilfsfunktionen ohne Konfiguration

### `curlToOpenApi`

Konvertierung in einem Schritt: Registriert einen [`CurlAdapter`](#curladapter) und ruft dessen [`convert`](#convertsource-input-options) auf.

```typescript
function curlToOpenApi(
  input: string | readonly string[],
  options?: ConvertOptions,
): Promise<ConvertResult>;
```

| Parameter | Typ | Beschreibung |
|---|---|---|
| `input` | `string \| readonly string[]` | Ein curl-Befehl, ein Array von Befehlen oder die Browserausgabe „Copy all as cURL“; mehrere Befehle im Text werden automatisch getrennt. |
| `options` | `ConvertOptions` | Optionale Konvertierungseinstellungen. |

**Rückgabe:** [`ConvertResult`](#convertresult).

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  "curl -X POST https://api.example.com/users -H 'Content-Type: application/json' --data '{\"name\":\"Ada\"}'",
);
```

---

### `postmanToOpenApi`

Konvertierung in einem Schritt: Registriert einen [`PostmanAdapter`](#postmanadapter) und konvertiert ein eingelesenes Collection-Objekt oder eine JSON-Zeichenfolge. Testskripte bleiben als `x-postman-scripts` erhalten.

```typescript
function postmanToOpenApi(
  input: unknown,
  options?: ConvertOptions,
): Promise<ConvertResult>;
```

| Parameter | Typ | Beschreibung |
|---|---|---|
| `input` | `unknown` | Ein Objekt einer Postman Collection v2.0/v2.1.0 oder dessen JSON-Zeichenfolge. |
| `options` | `ConvertOptions` | Optionale Konvertierungseinstellungen. |

**Rückgabe:** [`ConvertResult`](#convertresult).

---

## Grundgerüst

### `XToOpenApi`

Die Konverterklasse. Verwaltet eine [`AdapterRegistry`](#adapterregistry) und führt die Schritte Einlesen → Erstellen → Validieren aus.

```typescript
class XToOpenApi {
  register<I>(adapter: SourceAdapter<I>): this;
  adapters(): string[];
  convert(
    source: string,
    input: unknown,
    options?: ConvertOptions,
  ): Promise<ConvertResult>;
}
```

#### `register(adapter)`

Registriert einen Adapter. Gibt für verkettete Aufrufe `this` zurück. Prüft die Adapter-`id` gegen `/^[a-z][a-z0-9-]*$/`, verlangt eine Methode `parse()` und lehnt doppelte IDs ab.

#### `adapters()`

Gibt die registrierten Adapter-IDs als `string[]` zurück.

#### `convert(source, input, options?)`

Der zentrale Einstiegspunkt.

| Parameter | Typ | Beschreibung |
|---|---|---|
| `source` | `string` | Eine Adapter-ID (`"curl"`, `"postman"`, …) oder `"auto"` zur Auswahl über `canHandle()`. |
| `input` | `unknown` | Die Quelldaten; ihre Struktur hängt vom Adapter ab. |
| `options` | `ConvertOptions` | Optionale Konvertierungseinstellungen. |

**Verhalten:**

1. Ergänzt Optionen anhand von [`DEFAULT_OPTIONS`](#default_options) und prüft sie.
2. Lehnt Zeichenfolgen oder die zusammengefassten Zeichenfolgenelemente eines Arrays mit mehr als **10 × 1024 × 1024 JavaScript-Codeeinheiten** durch einen `ConversionError` ab. Dies ist keine UTF-8-Bytegrenze; eingelesene Objekte werden nicht vermessen.
3. Wählt den Adapter anhand der expliziten ID oder per `"auto"`-Erkennung.
4. Liest die Eingabe als `NormalizedRequest[]` ein; Einlesefehler werden zu Diagnosemeldungen.
5. Erstellt das OpenAPI-3.2-Dokument über [`buildOpenApi32`](#buildopenapi32).
6. Wenn `validate` auf `true` steht, validiert es über [`validateOpenApi32`](#validateopenapi32) und übernimmt die Diagnosemeldungen.
7. Gibt ein [`ConvertResult`](#convertresult) zurück.

```typescript
import { XToOpenApi, CurlAdapter } from "@powerduck/x-to-openapi";

const converter = new XToOpenApi().register(new CurlAdapter());
const result = await converter.convert("curl", curlText, { title: "My API" });
```

---

### `DEFAULT_OPTIONS`

Die Standardwerte, mit denen alle [`ConvertOptions`](#convertoptions) zusammengeführt werden. Als `ResolvedConvertOptions` exportiert.

```typescript
const DEFAULT_OPTIONS: ResolvedConvertOptions = {
  openapiVersion: "3.2.0",
  title: "Generated API",
  version: "1.0.0",
  description: "",
  inferPathParameters: true,
  pathParameterMinSamples: 2,
  inferSecurity: true,
  includeCommonHeaders: false,
  includeCookies: false,
  includeExamples: false,
  useServerBasePath: false,
  validate: true,
  strict: false,
};
```

---

### `AdapterRegistry`

Verwaltet registrierte Adapter nach ID.

```typescript
class AdapterRegistry {
  register<I>(adapter: SourceAdapter<I>): this;
  has(id: string): boolean;
  get(id: string): SourceAdapter<unknown>;
  detect(input: unknown): SourceAdapter<unknown> | undefined;
  ids(): string[];
}
```

| Methode | Beschreibung |
|---|---|
| `register(adapter)` | Prüft die ID (`/^[a-z][a-z0-9-]*$/`), verlangt `parse()` und lehnt Duplikate ab. Gibt `this` zurück. |
| `has(id)` | Prüft, ob der Adapter registriert ist. |
| `get(id)` | Gibt den Adapter zurück oder wirft einen Fehler mit den registrierten IDs. |
| `detect(input)` | Gibt den ersten Adapter zurück, dessen `canHandle()` die Eingabe akzeptiert. Fehler in Prüffunktionen werden abgefangen; der betreffende Adapter wird übersprungen. |
| `ids()` | Listet die registrierten IDs auf. |

---

### `ConversionError`

Wird bei Diagnosemeldungen der Stufe Fehler im Modus `strict`, zu großen Zeichenfolgeneingaben oder fehlgeschlagener automatischer Adapterauswahl ausgelöst. Enthält verfügbare Diagnosen; die Liste kann leer sein. Ungültige Optionen und Registrierungsfehler können stattdessen `TypeError` oder `Error` auslösen.

```typescript
class ConversionError extends Error {
  readonly diagnostics: readonly Diagnostic[];
  constructor(
    message: string,
    diagnostics: readonly Diagnostic[],
    options?: { cause?: unknown },
  );
}
```

---

### `DiagnosticBag`

Interner Sammler für [`XToOpenApi.convert`](#convertsource-input-options). Entfernt doppelte Diagnosen und löst bei Fehlermeldungen einen `ConversionError` aus, wenn `strict` auf `true` steht.

```typescript
class DiagnosticBag {
  constructor(strict?: boolean); // default false
  report(diagnostic: Diagnostic): void;
  get items(): Diagnostic[];
  hasErrors(): boolean;
}
```

---

## Adapter

### `CurlAdapter`

Konvertiert curl-Befehle, Stapel oder Browserexporte in `NormalizedRequest[]`. Kapselt `curlconverter` und vereinheitlicht dessen Ausgabe.

```typescript
class CurlAdapter implements SourceAdapter<string | readonly string[]> {
  readonly id = "curl";
  canHandle(input: unknown): boolean;
  parse(
    input: string | readonly string[],
    context: AdapterContext,
  ): Promise<NormalizedRequest[]>;
}
```

- `canHandle` akzeptiert eine Zeichenfolge oder das erste Arrayelement, das mit einem optionalen Shell-Prompt (`$`, `#`, `>`) und anschließend `curl` oder `curl.exe` beginnt.
- `parse` trennt mehrere Befehle mit [`splitCurlCommands`](#splitcurlcommands), überspringt URLs ohne HTTP(S), entfernt HTTP/2-Pseudoheader, verarbeitet Anfragetext und Cookies und leitet die Authentifizierung ab.

> `resolveBackend`, `availableExports` und `resetBackend` sind interne Integrationshilfen, keine unterstützten Paketexporte. Importieren Sie den öffentlichen Adapter statt interner Dateien.

---

### `splitCurlCommands`

Teilt die Browserausgabe „Copy all as cURL“ in einzelne Befehle. Unterstützt einfache und doppelte Anführungszeichen, Fortsetzungen mit Backslash oder Zirkumflex (`^`), CRLF, Shell-Prompts (`$`, `#`, `>`, `PS C:\>`) und `curl.exe`.

```typescript
function splitCurlCommands(input: string): string[];
```

```typescript
import { splitCurlCommands } from "@powerduck/x-to-openapi";

const commands = splitCurlCommands(`
  $ curl https://api.example.com/users
  > curl https://api.example.com/users/123
`);
// ["curl https://api.example.com/users", "curl https://api.example.com/users/123"]
```

---

### `PostmanAdapter`

Konvertiert Postman Collections v2.0/v2.1.0 in `NormalizedRequest[]`. Durchläuft verschachtelte Ordner, löst die Authentifizierung mit der Priorität Element > Ordner > Collection auf, ordnet Anfragetextmodi zu und erhält Testskripte.

```typescript
class PostmanAdapter implements SourceAdapter<PostmanCollection | string> {
  readonly id = "postman";
  canHandle(input: unknown): boolean;
  parse(
    input: PostmanCollection | string,
    context: AdapterContext,
  ): Promise<NormalizedRequest[]>;
}
```

- `canHandle` akzeptiert ein Objekt oder eine eingelesene JSON-Zeichenfolge mit einem `info`-Objekt und einem `item`-Array. Akzeptiert werden die Schema-URLs von v2.1.0 und v2.0 sowie strukturell gültige Collections ohne Schema-URL.
- Test- und Prerequest-Ereignisse werden als `x-postman-scripts` an der Operation ausgegeben.

---

### `PostmanTypes`

Ein Namensraum mit allen vom Adapter verwendeten Postman-Collection-Typen:

```typescript
import { PostmanTypes } from "@powerduck/x-to-openapi";

type Collection = PostmanTypes.PostmanCollection;
type Item = PostmanTypes.PostmanItem;
type Request = PostmanTypes.PostmanRequest;
type Body = PostmanTypes.PostmanBody;
type Auth = PostmanTypes.PostmanAuth;
type Script = PostmanTypes.PostmanScript;

// Runtime type guards are functions; the other members are TypeScript types.
const isFolder = PostmanTypes.isFolder;
const isRequestItem = PostmanTypes.isRequestItem;
```

Wichtige Mitglieder: `PostmanCollection`, `PostmanInfo`, `PostmanVersion`, `PostmanItem`, `PostmanFolder`, `PostmanRequestItem`, `PostmanRequest`, `PostmanHeader`, `PostmanUrl`, `PostmanQueryParam`, `PostmanBodyMode`, `PostmanBody`, `PostmanUrlEncodedParam`, `PostmanFormDataParam`, `PostmanFileParam`, `PostmanGraphQLBody`, `PostmanAuthType`, `PostmanAuth`, `PostmanAuthParam`, `PostmanEvent`, `PostmanScript`, `PostmanVariable`, `PostmanDescription`, `isFolder`, `isRequestItem`.

---

## OpenAPI-Bausteine

### `buildOpenApi32`

Builder auf niedriger Ebene. Erstellt ein OpenAPI-3.2-Dokument aus bereits normalisierten Anfragen. Üblicherweise wird er indirekt über [`XToOpenApi.convert`](#convertsource-input-options) aufgerufen.

```typescript
function buildOpenApi32(
  requests: readonly NormalizedRequest[],
  options: ResolvedConvertOptions,
  report: (diagnostic: Diagnostic) => void,
): OpenApiDocument;
```

Gruppiert Operationen nach Pfad und Methode, sammelt Query-, Header-, Cookie- und Pfadparameter, führt Anfragetextschemas zusammen, erzeugt `securitySchemes`, legt nicht standardisierte Methoden unter `additionalOperations` ab und vergibt `operationId`/`tags`.

---

### `buildPathTemplates`

Gruppiert gleich strukturierte Anfragen und ersetzt Segmente durch Platzhalter, wenn sie in mindestens `minSamples` Beispielen variieren und in jedem Beispiel wie Bezeichner aussehen.

```typescript
function buildPathTemplates(
  requests: readonly NormalizedRequest[],
  minSamples: number,
  enabled: boolean,
): Map<number, PathTemplate>;
```

Gibt eine nach `sourceIndex` indizierte Map zurück. Jedes `PathTemplate` enthält:

```typescript
interface PathTemplate {
  readonly path: string;                    // e.g. "/users/{userId}"
  readonly parameters: ReadonlyMap<number, string>; // segment index → name
}
```

Wenn `enabled` auf `false` steht, erhält jede Anfrage eine statische Vorlage, die ihrem ursprünglichen Pfadnamen entspricht.

---

### `looksLikeIdentifier`

Die zentrale Regel dafür, welche Segmente durch Platzhalter ersetzt werden können.

```typescript
function looksLikeIdentifier(segment: string): boolean;
```

Gibt `true` zurück, wenn das Segment rein numerisch, eine UUID, eine ULID oder eine Hexadezimalzeichenfolge mit mindestens 8 Zeichen ist.

---

### `scalar`

Leitet aus einem einzelnen Zeichenfolgenbeispiel vorsichtig ein JSON-Schema ab.

```typescript
function scalar(value: string, includeExample?: boolean): Schema; // default false
```

Erkennt `boolean`, `integer` mit einer Längengrenze für sichere Ganzzahlen, `number` sowie `string` mit `format` (`uuid`, `date`, `date-time`); andernfalls einen einfachen `string`.

---

### `jsonSchema`

Leitet aus einem beliebigen JSON-Wert (Objekt, Array oder Skalar) ein JSON-Schema ab.

```typescript
function jsonSchema(value: unknown, includeExample?: boolean): Schema; // default false
```

Objekte werden zu `{ type: "object", properties, required }`, Arrays zu `{ type: "array", items }` mit `{}` für leere Arrays; Skalare folgen einer Typableitung wie bei `scalar`.

---

### `mergeSchemas`

Führt mehrere Beispielschemas strukturell zusammen. Objekteigenschaften werden vereinigt; eine in einem Beispiel fehlende Eigenschaft wird optional. Arrays werden rekursiv verarbeitet; `integer` wird zu `number` erweitert. Formate bleiben nur erhalten, wenn sie in allen Beispielen identisch sind.

```typescript
function mergeSchemas(schemas: readonly Schema[]): Schema;
```

---

### `Schema`

Die strukturelle JSON-Schema-Teilmenge für abgeleitete Anfragetexte und Parameter.

```typescript
interface Schema {
  type?: string | string[];
  format?: string;
  properties?: Record<string, Schema>;
  required?: string[];
  items?: Schema;
  example?: unknown;
  contentMediaType?: string;
  description?: string;
  nullable?: boolean;
  [key: string]: unknown; // OpenAPI extensions and unmodeled fields
}
```

---

## Kanonischer Typ und Validierung

### `validateOpenApi32`

Validiert ein OpenAPI-Dokument über `@powerduck/openapi-parser` gegen das OpenAPI-3.2-Schema.

```typescript
function validateOpenApi32(
  document: OpenApiDocument,
): Promise<ValidationOutcome>;

interface ValidationOutcome {
  valid: boolean;
  diagnostics: Diagnostic[];
}
```

Validierungsfehler werden Diagnosen mit dem Code `OAS_VALIDATION_ERROR`; Fehler des Validators erhalten `OAS_VALIDATOR_FAILED`.

### `validateOpenApiDocument`

Kanonischer Alias von [`validateOpenApi32`](#validateopenapi32). Nachgelagerte Bibliotheken unter `@powerduck/*` sollten diesen stabilen Namen importieren.

```typescript
import { validateOpenApiDocument } from "@powerduck/x-to-openapi";

const { valid, diagnostics } = await validateOpenApiDocument(doc);
```

### `OpenApiDocument`

Der kanonische OpenAPI-3.2-Dokumenttyp, ein Alias für `Oas32Document` aus `@powerduck/openapi-parser`. Alle Bibliotheken unter `@powerduck/*` sollten diesen Typ statt Typen aus Drittanbieterpaketen verwenden.

### `OpenApi32Document`

Versionsspezifischer Alias von `OpenApiDocument`.

---

## Typen

### `ConvertOptions`

Alle Konvertierungseinstellungen. Nicht gesetzte Felder übernehmen die Werte aus [`DEFAULT_OPTIONS`](#default_options).

```typescript
interface ConvertOptions {
  openapiVersion?: "3.2.0";
  title?: string;
  version?: string;
  description?: string;
  inferPathParameters?: boolean;
  pathParameterMinSamples?: number;
  inferSecurity?: boolean;
  includeCommonHeaders?: boolean;
  includeCookies?: boolean;
  includeExamples?: boolean;
  useServerBasePath?: boolean;
  validate?: boolean;
  strict?: boolean;
}
```

| Option | Typ | Standardwert | Beschreibung |
|---|---|---|---|
| `openapiVersion` | `"3.2.0"` | `"3.2.0"` | Nur `"3.2.0"` wird unterstützt; jeder andere Wert löst einen Fehler aus. |
| `title` | `string` | `"Generated API"` | `info.title`. Darf nicht leer sein. |
| `version` | `string` | `"1.0.0"` | `info.version`. Darf nicht leer sein. |
| `description` | `string` | `""` | `info.description`. Wird bei leerem Wert weggelassen. |
| `inferPathParameters` | `boolean` | `true` | Variable Segmente, die wie Bezeichner aussehen, durch Platzhalter ersetzen. |
| `pathParameterMinSamples` | `number` | `2` | Mindestanzahl von Anfragen pro Gruppe für die Vorlagenbildung. Muss eine positive Ganzzahl sein. |
| `inferSecurity` | `boolean` | `true` | `securitySchemes` und `security` pro Operation erzeugen. |
| `includeCommonHeaders` | `boolean` | `false` | Unwesentliche Browserheader einschließen. Transportheader werden immer ausgeschlossen. |
| `includeCookies` | `boolean` | `false` | Cookies als Parameter ausgeben. |
| `includeExamples` | `boolean` | `false` | Schema- und Parameterbeispiele aus beobachteten Werten übernehmen. |
| `useServerBasePath` | `boolean` | `false` | Das gemeinsame Pfadpräfix in `servers[0].url` zusammenfassen, wenn alle Anfragen denselben Ursprung haben. |
| `validate` | `boolean` | `true` | Das Ausgabedokument validieren. Validierungsfehler werden Diagnosemeldungen; im strikten Modus können daraus Ausnahmen werden. |
| `strict` | `boolean` | `false` | Bei jeder Diagnose der Stufe Fehler einen `ConversionError` auslösen. |

`ResolvedConvertOptions` entspricht `Required<ConvertOptions> & { openapiVersion: "3.2.0" }`.

---

### `ConvertResult`

Der Rückgabewert jeder Konvertierung.

```typescript
interface ConvertResult {
  /** The generated OpenAPI 3.2 document. */
  document: OpenApiDocument;
  /** Normalized requests (urlString is populated for JSON serialization). */
  requests: NormalizedRequest[];
  /** All diagnostics produced during conversion. */
  diagnostics: Diagnostic[];
  /** True when no error-severity diagnostic was produced. */
  ok: boolean;
  /** True when the document passed validation (or validation was skipped). */
  documentValid: boolean;
}
```

---

### `NormalizedRequest`

Die adapterunabhängige Zwischenform, die jeder Adapter erzeugt.

```typescript
interface NormalizedRequest {
  source: string;            // adapter id, e.g. "curl"
  sourceIndex: number;       // index within the source
  method: string;            // lowercase token, e.g. "get", "post", "purge"
  url: URL;
  urlString?: string;        // string form, set for JSON-safe serialization
  headers: readonly Header[];
  query: readonly ParameterValue[];
  cookies: readonly ParameterValue[];
  body?: RequestBody;
  auth?: RequestAuth;
  /** x-* extensions merged onto the operation (first-wins per key). */
  extensions?: Readonly<Record<string, unknown>>;
}
```

---

### `Diagnostic` / `DiagnosticCode` / `Severity`

```typescript
type Severity = "info" | "warning" | "error";

interface Diagnostic {
  code: DiagnosticCode;
  message: string;
  severity: Severity;
  source?: string;   // adapter id
  index?: number;    // source command index
  path?: string;      // affected OpenAPI path
  cause?: unknown;    // underlying error
}
```

`DiagnosticCode` ist ein Union-Typ aus Zeichenfolgen für alle Codes, die das Framework melden kann:

`ADAPTER_PARSE_FAILED`, `CURL_PARSE_FAILED`, `CURL_EMPTY_INPUT`, `CURL_CAPABILITY_MISSING`, `CURL_BACKEND_JSON_FALLBACK`, `CURL_UNSUPPORTED_SCHEME`, `POSTMAN_INVALID_COLLECTION`, `POSTMAN_EMPTY_COLLECTION`, `POSTMAN_UNSUPPORTED_BODY_MODE`, `POSTMAN_VARIABLE_UNRESOLVED`, `BODY_JSON_INVALID`, `PATH_MERGE_CONFLICT`, `OPERATION_ID_COLLISION`, `PSEUDO_HEADER_DROPPED`, `MULTIPLE_SERVERS`, `NO_REQUESTS`, `OAS_VALIDATION_ERROR`, `OAS_VALIDATOR_FAILED`, `DISCOVERY_COMPONENT_NOT_FOUND`, `DISCOVERY_COMPONENT_NAME_COLLISION`, `DISCOVERY_PATH_PARAM_MISMATCH`, `DISCOVERY_MEDIA_WITHOUT_SCHEMA`, `DISCOVERY_RESPONSE_MISSING`, `DISCOVERY_SECURITY_SCHEME_MISSING`, `DISCOVERY_GAP`, `DISCOVERY_PATH_CONFLICT`.

---

### Weitere Kerntypen

```typescript
type JsonObject = Record<string, unknown>;

interface Header { readonly name: string; readonly value: string; }
interface ParameterValue { readonly name: string; readonly value: string; }
interface FormField {
  readonly name: string;
  readonly value?: string;
  readonly fileName?: string;
  readonly contentType?: string;
}

type BodyKind = "json" | "xml" | "form-urlencoded" | "multipart" | "text" | "binary";

interface RequestBody {
  readonly kind: BodyKind;
  readonly mediaType: string;
  readonly raw?: string;
  readonly fields?: readonly FormField[];
}

type RequestAuth =
  | { readonly type: "basic" }
  | { readonly type: "bearer" }
  | { readonly type: "apiKey"; readonly in: "header" | "query" | "cookie"; readonly name: string };

interface AdapterContext {
  readonly report: (diagnostic: Diagnostic) => void;
  readonly strict: boolean;
}

interface SourceAdapter<I = unknown> {
  readonly id: string;
  canHandle?(input: unknown): boolean;
  parse(input: I, context: AdapterContext): Promise<NormalizedRequest[]>;
}
```

---

## Konvertierung der Discovery-Zwischenrepräsentation

### `discoveryToOpenApi`

Konvertiert ein übergebenes `DiscoveredProject` in OpenAPI 3.2. Scannt selbst keine Quelldateien. Nicht aufgelöste Routen erzeugen Warnungen und werden niemals stillschweigend zu `paths` hinzugefügt. Quellpositionen und Konfidenz bleiben im zurückgegebenen Projekt verfügbar.

```typescript
function discoveryToOpenApi(
  project: DiscoveredProject,
  options?: DiscoveryOptions,
): Promise<DiscoveryResult>;

interface DiscoveryOptions {
  openapiVersion?: "3.2.0";
  allowGaps?: boolean; // default true
  validate?: boolean; // default true
}

interface DiscoveryResult {
  readonly document: OpenApiDocument;
  readonly project: DiscoveredProject;
  readonly diagnostics: Diagnostic[];
  readonly ok: boolean;
  readonly documentValid: boolean;
}
```

`allowGaps: false` stuft Diagnosen zu Lücken in Operationen oder Schemas als Fehler ein; es aktiviert keine Ausnahmen wie im strikten Modus. Prüfen Sie stets `ok`, `documentValid` und `diagnostics`. Warnungen zu nicht aufgelösten Routen werden separat gemeldet. Bei deaktivierter Validierung ist `documentValid` auch ohne Schemaprüfung wahr.

### `buildDiscoveryOpenApi32`

Synchroner Builder auf niedriger Ebene für dieselbe Zwischenrepräsentation. Meldet Diagnosen über den übergebenen Callback und validiert das Dokument nicht. Verwenden Sie den asynchronen Wrapper, wenn Sie Validierung und ein vollständiges Ergebnisobjekt benötigen.

```typescript
function buildDiscoveryOpenApi32(
  project: DiscoveredProject,
  allowGaps: boolean,
  report: (diagnostic: Diagnostic) => void,
): OpenApiDocument;
```

Aus dem Haupteinstiegspunkt exportierte Discovery-Typen: `Confidence`, `GapCode`, `SourceLocation`, `JsonSchema`, `DiscoveredParameter`, `DiscoveredMediaType`, `DiscoveredRequestBody`, `DiscoveredResponse`, `DiscoveredOperation`, `DiscoveredComponent`, `DiscoveredSecurityScheme`, `DiscoveredServer`, `DiscoveredUnresolved`, `DiscoveredProject`, `DiscoveryOptions`, `DiscoveryResult`.

```typescript
import { discoveryToOpenApi } from "@powerduck/x-to-openapi";

const discovered = await discoveryToOpenApi({
  title: "Health API",
  operations: [{
    method: "get",
    path: "/health",
    responses: [{ statusCode: "204", description: "Healthy", confidence: "high" }],
    confidence: "high",
    origin: { file: "src/routes.ts", line: 1 },
  }],
});
console.log(discovered.ok, discovered.documentValid, discovered.diagnostics);
```

---

## Exportübersicht

| Symbol | Art |
|---|---|
| `curlToOpenApi` | Funktion |
| `postmanToOpenApi` | Funktion |
| `XToOpenApi` | Klasse |
| `DEFAULT_OPTIONS` | Konstante |
| `AdapterRegistry` | Klasse |
| `ConversionError` | Klasse |
| `DiagnosticBag` | Klasse |
| `CurlAdapter` | Klasse |
| `splitCurlCommands` | Funktion |
| `PostmanAdapter` | Klasse |
| `PostmanTypes` | Namensraum |
| `buildOpenApi32` | Funktion |
| `buildPathTemplates` | Funktion |
| `looksLikeIdentifier` | Funktion |
| `scalar` | Funktion |
| `jsonSchema` | Funktion |
| `mergeSchemas` | Funktion |
| `Schema` | Typ |
| `discoveryToOpenApi` | Funktion |
| `buildDiscoveryOpenApi32` | Funktion |
| `validateOpenApi32` | Funktion |
| `validateOpenApiDocument` | Funktion (Alias) |
| `OpenApiDocument` | Typ |
| `OpenApi32Document` | Typ |
| `DiscoveredProject`, `DiscoveryOptions`, `DiscoveryResult` | Typen |
| `ConvertOptions`, `ConvertResult`, `NormalizedRequest`, `SourceAdapter`, `AdapterContext`, `Diagnostic`, `DiagnosticCode`, `Severity`, `Header`, `ParameterValue`, `FormField`, `BodyKind`, `RequestBody`, `RequestAuth`, `JsonObject`, `ResolvedConvertOptions` | Typen |
