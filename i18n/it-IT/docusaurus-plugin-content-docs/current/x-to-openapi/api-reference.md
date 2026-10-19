---
sidebar_position: 4
title: "Riferimento API"
description: "Riferimento del punto di ingresso pubblico di @powerduck/x-to-openapi"
---

# Riferimento API

Riferimento del punto di ingresso pubblico di `@powerduck/x-to-openapi`. Le firme seguenti riassumono l'API; per tutte le annotazioni readonly e i tipi importati, consultare le dichiarazioni TypeScript del pacchetto.

---

## Funzioni ausiliarie senza configurazione

### `curlToOpenApi`

Conversione in una sola chiamata: registra un [`CurlAdapter`](#curladapter) e richiama [`convert`](#convertsource-input-options).

```typescript
function curlToOpenApi(
  input: string | readonly string[],
  options?: ConvertOptions,
): Promise<ConvertResult>;
```

| Parametro | Tipo | Descrizione |
|---|---|---|
| `input` | `string \| readonly string[]` | Un comando curl, un array di comandi o l'output «Copy all as cURL» del browser; il testo con più comandi viene suddiviso automaticamente. |
| `options` | `ConvertOptions` | Impostazioni di conversione facoltative. |

**Restituisce:** [`ConvertResult`](#convertresult).

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  "curl -X POST https://api.example.com/users -H 'Content-Type: application/json' --data '{\"name\":\"Ada\"}'",
);
```

---

### `postmanToOpenApi`

Conversione in una sola chiamata: registra un [`PostmanAdapter`](#postmanadapter) e converte un oggetto collection già analizzato o una stringa JSON. Gli script di test vengono conservati come `x-postman-scripts`.

```typescript
function postmanToOpenApi(
  input: unknown,
  options?: ConvertOptions,
): Promise<ConvertResult>;
```

| Parametro | Tipo | Descrizione |
|---|---|---|
| `input` | `unknown` | Un oggetto Postman Collection v2.0/v2.1.0 o la relativa stringa JSON. |
| `options` | `ConvertOptions` | Impostazioni di conversione facoltative. |

**Restituisce:** [`ConvertResult`](#convertresult).

---

## Struttura di base

### `XToOpenApi`

La classe del convertitore. Contiene un [`AdapterRegistry`](#adapterregistry) ed esegue la sequenza analisi → costruzione → validazione.

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

Registra un adattatore. Restituisce `this` per concatenare le chiamate. Convalida l'`id` dell'adattatore con `/^[a-z][a-z0-9-]*$/`, richiede un metodo `parse()` e rifiuta gli ID duplicati.

#### `adapters()`

Restituisce gli ID degli adattatori registrati come `string[]`.

#### `convert(source, input, options?)`

L'unico punto di ingresso.

| Parametro | Tipo | Descrizione |
|---|---|---|
| `source` | `string` | Un ID di adattatore (`"curl"`, `"postman"`, …) oppure `"auto"` per la selezione tramite `canHandle()`. |
| `input` | `unknown` | I dati di origine; la struttura dipende dall'adattatore. |
| `options` | `ConvertOptions` | Impostazioni di conversione facoltative. |

**Comportamento:**

1. Completa le opzioni con [`DEFAULT_OPTIONS`](#default_options) e le convalida.
2. Rifiuta con `ConversionError` le stringhe, o la somma degli elementi stringa di un array, che superano **10 × 1024 × 1024 unità di codice JavaScript**. Non è un limite di byte UTF-8; gli oggetti già analizzati non vengono misurati.
3. Seleziona l'adattatore tramite ID esplicito o rilevamento `"auto"`.
4. Analizza l'input generando `NormalizedRequest[]`; gli errori di analisi diventano diagnostiche.
5. Costruisce il documento OpenAPI 3.2 tramite [`buildOpenApi32`](#buildopenapi32).
6. Se `validate` è `true`, convalida tramite [`validateOpenApi32`](#validateopenapi32) e incorpora le diagnostiche risultanti.
7. Restituisce un [`ConvertResult`](#convertresult).

```typescript
import { XToOpenApi, CurlAdapter } from "@powerduck/x-to-openapi";

const converter = new XToOpenApi().register(new CurlAdapter());
const result = await converter.convert("curl", curlText, { title: "My API" });
```

---

### `DEFAULT_OPTIONS`

I valori predefiniti con cui vengono unite tutte le [`ConvertOptions`](#convertoptions). Esportati come `ResolvedConvertOptions`.

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

Conserva gli adattatori registrati per ID.

```typescript
class AdapterRegistry {
  register<I>(adapter: SourceAdapter<I>): this;
  has(id: string): boolean;
  get(id: string): SourceAdapter<unknown>;
  detect(input: unknown): SourceAdapter<unknown> | undefined;
  ids(): string[];
}
```

| Metodo | Descrizione |
|---|---|
| `register(adapter)` | Convalida l'ID (`/^[a-z][a-z0-9-]*$/`), verifica la presenza di `parse()` e rifiuta i duplicati. Restituisce `this`. |
| `has(id)` | Verifica se l'adattatore è registrato. |
| `get(id)` | Restituisce l'adattatore oppure genera un errore che elenca gli ID registrati. |
| `detect(input)` | Restituisce il primo adattatore il cui `canHandle()` accetta l'input. Le eccezioni nei predicati vengono intercettate e l'adattatore corrispondente viene ignorato. |
| `ids()` | Elenca gli ID registrati. |

---

### `ConversionError`

Generato per diagnostiche di livello errore in modalità `strict`, stringhe di input troppo lunghe o selezione automatica dell'adattatore non riuscita. Contiene le diagnostiche disponibili; l'elenco può essere vuoto. Opzioni non valide ed errori di registrazione possono invece generare `TypeError` o `Error`.

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

Raccoglitore interno usato da [`XToOpenApi.convert`](#convertsource-input-options). Rimuove le diagnostiche duplicate e genera `ConversionError` per voci di livello errore quando `strict` è `true`.

```typescript
class DiagnosticBag {
  constructor(strict?: boolean); // default false
  report(diagnostic: Diagnostic): void;
  get items(): Diagnostic[];
  hasErrors(): boolean;
}
```

---

## Adattatori

### `CurlAdapter`

Converte comandi curl singoli, gruppi o esportazioni del browser in `NormalizedRequest[]`. Incapsula `curlconverter` e ne normalizza l'output.

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

- `canHandle` accetta una stringa, o il primo elemento di un array, che inizi con un prompt di shell facoltativo (`$`, `#`, `>`) seguito da `curl` o `curl.exe`.
- `parse` suddivide input con più comandi tramite [`splitCurlCommands`](#splitcurlcommands), ignora gli URL non HTTP(S), elimina gli pseudo-header HTTP/2, analizza corpi e cookie e deduce l'autenticazione.

> `resolveBackend`, `availableExports` e `resetBackend` sono funzioni interne di integrazione, non esportazioni pubbliche supportate. Importare l'adattatore pubblico anziché i file interni.

---

### `splitCurlCommands`

Suddivide l'output «Copy all as cURL» del browser in singoli comandi. Gestisce virgolette singole e doppie, continuazioni con barra inversa o accento circonflesso (`^`), CRLF, prompt di shell (`$`, `#`, `>`, `PS C:\>`) e `curl.exe`.

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

Converte Postman Collections v2.0/v2.1.0 in `NormalizedRequest[]`. Percorre cartelle annidate, risolve l'autenticazione con priorità elemento > cartella > collection, mappa i formati del corpo e conserva gli script di test.

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

- `canHandle` accetta un oggetto o una stringa JSON analizzata con un oggetto `info` e un array `item`. Accetta gli URL degli schemi v2.1.0 e v2.0 e le collection strutturalmente valide prive di URL dello schema.
- Gli eventi di test e pre-richiesta vengono inseriti nell'operazione come `x-postman-scripts`.

---

### `PostmanTypes`

Un namespace che contiene tutti i tipi di collection Postman usati dall'adattatore:

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

Membri principali: `PostmanCollection`, `PostmanInfo`, `PostmanVersion`, `PostmanItem`, `PostmanFolder`, `PostmanRequestItem`, `PostmanRequest`, `PostmanHeader`, `PostmanUrl`, `PostmanQueryParam`, `PostmanBodyMode`, `PostmanBody`, `PostmanUrlEncodedParam`, `PostmanFormDataParam`, `PostmanFileParam`, `PostmanGraphQLBody`, `PostmanAuthType`, `PostmanAuth`, `PostmanAuthParam`, `PostmanEvent`, `PostmanScript`, `PostmanVariable`, `PostmanDescription`, `isFolder`, `isRequestItem`.

---

## Componenti per la costruzione di OpenAPI

### `buildOpenApi32`

Costruttore di basso livello. Crea un documento OpenAPI 3.2 da un array di richieste già normalizzate. In genere viene richiamato indirettamente tramite [`XToOpenApi.convert`](#convertsource-input-options).

```typescript
function buildOpenApi32(
  requests: readonly NormalizedRequest[],
  options: ResolvedConvertOptions,
  report: (diagnostic: Diagnostic) => void,
): OpenApiDocument;
```

Raggruppa le operazioni per percorso e metodo, raccoglie parametri di query, header, cookie e percorso, unisce gli schemi dei corpi, genera `securitySchemes`, inserisce i metodi non standard in `additionalOperations` e assegna `operationId`/`tags`.

---

### `buildPathTemplates`

Raggruppa richieste con la stessa struttura e parametrizza i segmenti che variano tra almeno `minSamples` campioni e sembrano identificatori in ciascun campione.

```typescript
function buildPathTemplates(
  requests: readonly NormalizedRequest[],
  minSamples: number,
  enabled: boolean,
): Map<number, PathTemplate>;
```

Restituisce una mappa indicizzata per `sourceIndex`. Ogni `PathTemplate` contiene:

```typescript
interface PathTemplate {
  readonly path: string;                    // e.g. "/users/{userId}"
  readonly parameters: ReadonlyMap<number, string>; // segment index → name
}
```

Quando `enabled` è `false`, ogni richiesta riceve un modello statico identico al percorso originale.

---

### `looksLikeIdentifier`

La regola centrale che determina quali segmenti possono essere parametrizzati.

```typescript
function looksLikeIdentifier(segment: string): boolean;
```

Restituisce `true` se il segmento è puramente numerico, un UUID, un ULID o una stringa esadecimale di almeno 8 caratteri.

---

### `scalar`

Deduce uno schema JSON da un singolo campione di stringa, adottando un criterio volutamente prudente.

```typescript
function scalar(value: string, includeExample?: boolean): Schema; // default false
```

Deduce `boolean`, `integer` con un limite di lunghezza per gli interi sicuri, `number` oppure `string` con `format` (`uuid`, `date`, `date-time`); altrimenti una semplice `string`.

---

### `jsonSchema`

Deduce uno schema JSON da qualsiasi valore JSON: oggetto, array o scalare.

```typescript
function jsonSchema(value: unknown, includeExample?: boolean): Schema; // default false
```

Gli oggetti diventano `{ type: "object", properties, required }`; gli array diventano `{ type: "array", items }`, con `{}` per quelli vuoti; gli scalari seguono regole simili a `scalar`.

---

### `mergeSchemas`

Unisce strutturalmente più schemi campione. Riunisce le proprietà degli oggetti; una proprietà assente in un qualsiasi campione diventa facoltativa. Elabora gli array in modo ricorsivo; amplia `integer` a `number` e conserva i formati solo se identici in tutti i campioni.

```typescript
function mergeSchemas(schemas: readonly Schema[]): Schema;
```

---

### `Schema`

Il sottoinsieme strutturale di JSON Schema usato per corpi e parametri dedotti.

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

## Tipo canonico e validazione

### `validateOpenApi32`

Convalida un documento OpenAPI rispetto allo schema OpenAPI 3.2 tramite `@powerduck/openapi-parser`.

```typescript
function validateOpenApi32(
  document: OpenApiDocument,
): Promise<ValidationOutcome>;

interface ValidationOutcome {
  valid: boolean;
  diagnostics: Diagnostic[];
}
```

Gli errori di validazione diventano diagnostiche con codice `OAS_VALIDATION_ERROR`; i problemi del validatore usano `OAS_VALIDATOR_FAILED`.

### `validateOpenApiDocument`

Alias canonico di [`validateOpenApi32`](#validateopenapi32). Le librerie dipendenti `@powerduck/*` dovrebbero importare questo nome stabile.

```typescript
import { validateOpenApiDocument } from "@powerduck/x-to-openapi";

const { valid, diagnostics } = await validateOpenApiDocument(doc);
```

### `OpenApiDocument`

Il tipo canonico di documento OpenAPI 3.2, alias di `Oas32Document` di `@powerduck/openapi-parser`. Tutte le librerie `@powerduck/*` dovrebbero usarlo anziché accedere a pacchetti di tipi di terze parti.

### `OpenApi32Document`

Alias di `OpenApiDocument` specifico della versione.

---

## Tipi

### `ConvertOptions`

Tutte le impostazioni di conversione. I campi non impostati usano i valori di [`DEFAULT_OPTIONS`](#default_options).

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

| Opzione | Tipo | Valore predefinito | Descrizione |
|---|---|---|---|
| `openapiVersion` | `"3.2.0"` | `"3.2.0"` | È supportato solo `"3.2.0"`; qualsiasi altro valore genera un errore. |
| `title` | `string` | `"Generated API"` | `info.title`. Non può essere vuoto. |
| `version` | `string` | `"1.0.0"` | `info.version`. Non può essere vuoto. |
| `description` | `string` | `""` | `info.description`. Omesso se vuoto. |
| `inferPathParameters` | `boolean` | `true` | Parametrizza i segmenti variabili che sembrano identificatori. |
| `pathParameterMinSamples` | `number` | `2` | Numero minimo di richieste per gruppo prima della parametrizzazione. Deve essere un intero positivo. |
| `inferSecurity` | `boolean` | `true` | Genera `securitySchemes` e `security` per ogni operazione. |
| `includeCommonHeaders` | `boolean` | `false` | Include gli header accessori del browser. Gli header di trasporto sono sempre esclusi. |
| `includeCookies` | `boolean` | `false` | Genera parametri dai cookie. |
| `includeExamples` | `boolean` | `false` | Compila gli esempi di schemi e parametri con i valori osservati. |
| `useServerBasePath` | `boolean` | `false` | Incorpora il prefisso di percorso comune in `servers[0].url` quando tutte le richieste condividono la stessa origine. |
| `validate` | `boolean` | `true` | Convalida il documento di output. Gli errori di validazione diventano diagnostiche; la modalità rigorosa può trasformarli in eccezioni. |
| `strict` | `boolean` | `false` | Genera `ConversionError` per qualsiasi diagnostica di livello errore. |

`ResolvedConvertOptions` equivale a `Required<ConvertOptions> & { openapiVersion: "3.2.0" }`.

---

### `ConvertResult`

Il valore restituito da ogni conversione.

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

La rappresentazione intermedia indipendente dall'adattatore prodotta da tutti gli adattatori.

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

`DiagnosticCode` è un'unione di stringhe che comprende tutti i codici segnalabili dal framework:

`ADAPTER_PARSE_FAILED`, `CURL_PARSE_FAILED`, `CURL_EMPTY_INPUT`, `CURL_CAPABILITY_MISSING`, `CURL_BACKEND_JSON_FALLBACK`, `CURL_UNSUPPORTED_SCHEME`, `POSTMAN_INVALID_COLLECTION`, `POSTMAN_EMPTY_COLLECTION`, `POSTMAN_UNSUPPORTED_BODY_MODE`, `POSTMAN_VARIABLE_UNRESOLVED`, `BODY_JSON_INVALID`, `PATH_MERGE_CONFLICT`, `OPERATION_ID_COLLISION`, `PSEUDO_HEADER_DROPPED`, `MULTIPLE_SERVERS`, `NO_REQUESTS`, `OAS_VALIDATION_ERROR`, `OAS_VALIDATOR_FAILED`, `DISCOVERY_COMPONENT_NOT_FOUND`, `DISCOVERY_COMPONENT_NAME_COLLISION`, `DISCOVERY_PATH_PARAM_MISMATCH`, `DISCOVERY_MEDIA_WITHOUT_SCHEMA`, `DISCOVERY_RESPONSE_MISSING`, `DISCOVERY_SECURITY_SCHEME_MISSING`, `DISCOVERY_GAP`, `DISCOVERY_PATH_CONFLICT`.

---

### Altri tipi di base

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

## Conversione della rappresentazione intermedia di discovery

### `discoveryToOpenApi`

Converte un `DiscoveredProject` fornito in OpenAPI 3.2. Non esamina autonomamente i file sorgente. Le route non risolte generano avvisi e non vengono mai aggiunte silenziosamente a `paths`; le posizioni nel sorgente e il livello di confidenza restano disponibili nel progetto restituito.

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

`allowGaps: false` eleva a errori le diagnostiche sulle lacune di operazioni e schemi; non attiva le eccezioni della modalità rigorosa. Controllare sempre `ok`, `documentValid` e `diagnostics`. Gli avvisi sulle route non risolte vengono segnalati separatamente. Con la validazione disattivata, `documentValid` è vero senza eseguire la validazione dello schema.

### `buildDiscoveryOpenApi32`

Costruttore sincrono di basso livello per la stessa rappresentazione intermedia. Segnala le diagnostiche tramite il callback fornito e non convalida il documento. Preferire il wrapper asincrono quando servono la validazione e un oggetto risultato completo.

```typescript
function buildDiscoveryOpenApi32(
  project: DiscoveredProject,
  allowGaps: boolean,
  report: (diagnostic: Diagnostic) => void,
): OpenApiDocument;
```

Tipi di discovery esportati dal punto di ingresso principale: `Confidence`, `GapCode`, `SourceLocation`, `JsonSchema`, `DiscoveredParameter`, `DiscoveredMediaType`, `DiscoveredRequestBody`, `DiscoveredResponse`, `DiscoveredOperation`, `DiscoveredComponent`, `DiscoveredSecurityScheme`, `DiscoveredServer`, `DiscoveredUnresolved`, `DiscoveredProject`, `DiscoveryOptions`, `DiscoveryResult`.

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

## Riepilogo delle esportazioni

| Simbolo | Categoria |
|---|---|
| `curlToOpenApi` | funzione |
| `postmanToOpenApi` | funzione |
| `XToOpenApi` | classe |
| `DEFAULT_OPTIONS` | costante |
| `AdapterRegistry` | classe |
| `ConversionError` | classe |
| `DiagnosticBag` | classe |
| `CurlAdapter` | classe |
| `splitCurlCommands` | funzione |
| `PostmanAdapter` | classe |
| `PostmanTypes` | namespace |
| `buildOpenApi32` | funzione |
| `buildPathTemplates` | funzione |
| `looksLikeIdentifier` | funzione |
| `scalar` | funzione |
| `jsonSchema` | funzione |
| `mergeSchemas` | funzione |
| `Schema` | tipo |
| `discoveryToOpenApi` | funzione |
| `buildDiscoveryOpenApi32` | funzione |
| `validateOpenApi32` | funzione |
| `validateOpenApiDocument` | funzione (alias) |
| `OpenApiDocument` | tipo |
| `OpenApi32Document` | tipo |
| `DiscoveredProject`, `DiscoveryOptions`, `DiscoveryResult` | tipi |
| `ConvertOptions`, `ConvertResult`, `NormalizedRequest`, `SourceAdapter`, `AdapterContext`, `Diagnostic`, `DiagnosticCode`, `Severity`, `Header`, `ParameterValue`, `FormField`, `BodyKind`, `RequestBody`, `RequestAuth`, `JsonObject`, `ResolvedConvertOptions` | tipi |
