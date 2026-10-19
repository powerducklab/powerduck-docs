---
sidebar_position: 4
title: "Referencia de la API"
description: "Referencia del punto de entrada público de @powerduck/x-to-openapi"
---

# Referencia de la API

Referencia del punto de entrada público de `@powerduck/x-to-openapi`. Las firmas siguientes resumen la API; consulte las declaraciones TypeScript del paquete para ver todas las anotaciones readonly y los tipos importados.

---

## Funciones auxiliares sin configuración

### `curlToOpenApi`

Conversión en una sola llamada: registra un [`CurlAdapter`](#curladapter) y llama a [`convert`](#convertsource-input-options).

```typescript
function curlToOpenApi(
  input: string | readonly string[],
  options?: ConvertOptions,
): Promise<ConvertResult>;
```

| Parámetro | Tipo | Descripción |
|---|---|---|
| `input` | `string \| readonly string[]` | Un comando curl, un array de comandos o la salida «Copy all as cURL» del navegador; el texto con varios comandos se divide automáticamente. |
| `options` | `ConvertOptions` | Opciones de conversión opcionales. |

**Devuelve:** [`ConvertResult`](#convertresult).

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  "curl -X POST https://api.example.com/users -H 'Content-Type: application/json' --data '{\"name\":\"Ada\"}'",
);
```

---

### `postmanToOpenApi`

Conversión en una sola llamada: registra un [`PostmanAdapter`](#postmanadapter) y convierte un objeto de colección ya analizado o una cadena JSON. Los scripts de prueba se conservan como `x-postman-scripts`.

```typescript
function postmanToOpenApi(
  input: unknown,
  options?: ConvertOptions,
): Promise<ConvertResult>;
```

| Parámetro | Tipo | Descripción |
|---|---|---|
| `input` | `unknown` | Un objeto de Postman Collection v2.0/v2.1.0 o su representación como cadena JSON. |
| `options` | `ConvertOptions` | Opciones de conversión opcionales. |

**Devuelve:** [`ConvertResult`](#convertresult).

---

## Componentes principales

### `XToOpenApi`

La clase del conversor. Contiene un [`AdapterRegistry`](#adapterregistry) y ejecuta el proceso de análisis → construcción → validación.

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

Registra un adaptador. Devuelve `this` para encadenar llamadas. Valida el `id` del adaptador con `/^[a-z][a-z0-9-]*$/`, exige un método `parse()` y rechaza los identificadores duplicados.

#### `adapters()`

Devuelve los identificadores de los adaptadores registrados como `string[]`.

#### `convert(source, input, options?)`

El único punto de entrada.

| Parámetro | Tipo | Descripción |
|---|---|---|
| `source` | `string` | Un identificador de adaptador (`"curl"`, `"postman"`, …) o `"auto"` para seleccionarlo mediante `canHandle()`. |
| `input` | `unknown` | Los datos de origen; su estructura depende del adaptador. |
| `options` | `ConvertOptions` | Opciones de conversión opcionales. |

**Comportamiento:**

1. Completa las opciones con [`DEFAULT_OPTIONS`](#default_options) y las valida.
2. Rechaza con un `ConversionError` las cadenas, o la suma de los elementos de cadena de un array, que superen **10 × 1024 × 1024 unidades de código de JavaScript**. No es un límite de bytes UTF-8; no se mide el tamaño de los objetos ya analizados.
3. Selecciona el adaptador por identificador explícito o mediante detección `"auto"`.
4. Analiza la entrada y genera `NormalizedRequest[]`; los fallos de análisis se convierten en diagnósticos.
5. Construye el documento OpenAPI 3.2 con [`buildOpenApi32`](#buildopenapi32).
6. Si `validate` es `true`, valida con [`validateOpenApi32`](#validateopenapi32) e incorpora sus diagnósticos.
7. Devuelve un [`ConvertResult`](#convertresult).

```typescript
import { XToOpenApi, CurlAdapter } from "@powerduck/x-to-openapi";

const converter = new XToOpenApi().register(new CurlAdapter());
const result = await converter.convert("curl", curlText, { title: "My API" });
```

---

### `DEFAULT_OPTIONS`

Los valores predeterminados con los que se combinan todas las [`ConvertOptions`](#convertoptions). Se exportan como `ResolvedConvertOptions`.

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

Almacena los adaptadores registrados por identificador.

```typescript
class AdapterRegistry {
  register<I>(adapter: SourceAdapter<I>): this;
  has(id: string): boolean;
  get(id: string): SourceAdapter<unknown>;
  detect(input: unknown): SourceAdapter<unknown> | undefined;
  ids(): string[];
}
```

| Método | Descripción |
|---|---|
| `register(adapter)` | Valida el identificador (`/^[a-z][a-z0-9-]*$/`), comprueba que exista `parse()` y rechaza duplicados. Devuelve `this`. |
| `has(id)` | Comprueba si el adaptador está registrado. |
| `get(id)` | Devuelve el adaptador o lanza un error que enumera los identificadores registrados. |
| `detect(input)` | Devuelve el primer adaptador cuyo `canHandle()` acepte la entrada. Si un predicado lanza una excepción, se captura y se omite ese adaptador. |
| `ids()` | Enumera los identificadores registrados. |

---

### `ConversionError`

Se lanza ante diagnósticos de nivel error en modo `strict`, cadenas de entrada demasiado largas o fallos de selección automática del adaptador. Incluye los diagnósticos disponibles; la lista puede estar vacía. Las opciones no válidas y los errores de registro pueden lanzar `TypeError` o `Error`.

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

Recopilador interno utilizado por [`XToOpenApi.convert`](#convertsource-input-options). Elimina diagnósticos duplicados y lanza `ConversionError` ante entradas de nivel error cuando `strict` es `true`.

```typescript
class DiagnosticBag {
  constructor(strict?: boolean); // default false
  report(diagnostic: Diagnostic): void;
  get items(): Diagnostic[];
  hasErrors(): boolean;
}
```

---

## Adaptadores

### `CurlAdapter`

Convierte comandos curl individuales, lotes o exportaciones del navegador en `NormalizedRequest[]`. Encapsula `curlconverter` y normaliza su salida.

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

- `canHandle` acepta una cadena, o el primer elemento de un array, que empiece con un indicador de shell opcional (`$`, `#`, `>`) seguido de `curl` o `curl.exe`.
- `parse` divide entradas con varios comandos mediante [`splitCurlCommands`](#splitcurlcommands), omite las URL que no sean HTTP(S), elimina pseudocabeceras HTTP/2, analiza cuerpos y cookies e infiere la autenticación.

> `resolveBackend`, `availableExports` y `resetBackend` son funciones internas de integración, no exportaciones públicas compatibles. Importe el adaptador público en lugar de archivos internos.

---

### `splitCurlCommands`

Divide la salida «Copy all as cURL» del navegador en comandos individuales. Admite comillas simples y dobles, continuaciones con barra inversa o acento circunflejo (`^`), CRLF, indicadores de shell (`$`, `#`, `>`, `PS C:\>`) y `curl.exe`.

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

Convierte Postman Collections v2.0/v2.1.0 en `NormalizedRequest[]`. Recorre carpetas anidadas, resuelve la autenticación con prioridad elemento > carpeta > colección, asigna los modos de cuerpo y conserva los scripts de prueba.

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

- `canHandle` acepta un objeto o una cadena JSON analizada con un objeto `info` y un array `item`. Admite las URL de esquema v2.1.0 y v2.0, así como colecciones con estructura válida sin URL de esquema.
- Los eventos de prueba y previos a la solicitud se añaden a la operación como `x-postman-scripts`.

---

### `PostmanTypes`

Un espacio de nombres que contiene todos los tipos de colección Postman utilizados por el adaptador:

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

Miembros principales: `PostmanCollection`, `PostmanInfo`, `PostmanVersion`, `PostmanItem`, `PostmanFolder`, `PostmanRequestItem`, `PostmanRequest`, `PostmanHeader`, `PostmanUrl`, `PostmanQueryParam`, `PostmanBodyMode`, `PostmanBody`, `PostmanUrlEncodedParam`, `PostmanFormDataParam`, `PostmanFileParam`, `PostmanGraphQLBody`, `PostmanAuthType`, `PostmanAuth`, `PostmanAuthParam`, `PostmanEvent`, `PostmanScript`, `PostmanVariable`, `PostmanDescription`, `isFolder`, `isRequestItem`.

---

## Componentes de construcción de OpenAPI

### `buildOpenApi32`

Constructor de bajo nivel. Genera un documento OpenAPI 3.2 a partir de un array de solicitudes ya normalizadas. Normalmente se invoca de forma indirecta mediante [`XToOpenApi.convert`](#convertsource-input-options).

```typescript
function buildOpenApi32(
  requests: readonly NormalizedRequest[],
  options: ResolvedConvertOptions,
  report: (diagnostic: Diagnostic) => void,
): OpenApiDocument;
```

Agrupa operaciones por ruta y método, recopila parámetros de consulta, cabecera, cookie y ruta, combina esquemas del cuerpo, genera `securitySchemes`, dirige los métodos no estándar a `additionalOperations` y asigna `operationId`/`tags`.

---

### `buildPathTemplates`

Agrupa solicitudes con la misma estructura y sustituye por parámetros los segmentos que varían entre al menos `minSamples` muestras y parecen identificadores en todas ellas.

```typescript
function buildPathTemplates(
  requests: readonly NormalizedRequest[],
  minSamples: number,
  enabled: boolean,
): Map<number, PathTemplate>;
```

Devuelve un mapa indexado por `sourceIndex`. Cada `PathTemplate` contiene:

```typescript
interface PathTemplate {
  readonly path: string;                    // e.g. "/users/{userId}"
  readonly parameters: ReadonlyMap<number, string>; // segment index → name
}
```

Cuando `enabled` es `false`, cada solicitud recibe una plantilla estática idéntica a su ruta original.

---

### `looksLikeIdentifier`

La regla central que determina qué segmentos se pueden parametrizar.

```typescript
function looksLikeIdentifier(segment: string): boolean;
```

Devuelve `true` si el segmento es exclusivamente numérico, un UUID, un ULID o una cadena hexadecimal de al menos 8 caracteres.

---

### `scalar`

Infiere un JSON Schema a partir de una única muestra de cadena, con un criterio deliberadamente conservador.

```typescript
function scalar(value: string, includeExample?: boolean): Schema; // default false
```

Infiere `boolean`, `integer` con un límite de longitud para enteros seguros, `number` o `string` con `format` (`uuid`, `date`, `date-time`); en los demás casos, un `string` simple.

---

### `jsonSchema`

Infiere un JSON Schema a partir de cualquier valor JSON: objeto, array o escalar.

```typescript
function jsonSchema(value: unknown, includeExample?: boolean): Schema; // default false
```

Los objetos se convierten en `{ type: "object", properties, required }`; los arrays, en `{ type: "array", items }` con `{}` para arrays vacíos; los escalares siguen reglas similares a `scalar`.

---

### `mergeSchemas`

Combina estructuralmente varios esquemas de muestra. Une las propiedades de los objetos; una propiedad ausente en alguna muestra pasa a ser opcional. Procesa arrays de forma recursiva; amplía `integer` a `number` y conserva los formatos solo si coinciden en todas las muestras.

```typescript
function mergeSchemas(schemas: readonly Schema[]): Schema;
```

---

### `Schema`

El subconjunto estructural de JSON Schema utilizado para cuerpos y parámetros inferidos.

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

## Tipo canónico y validación

### `validateOpenApi32`

Valida un documento OpenAPI frente al esquema OpenAPI 3.2 mediante `@powerduck/openapi-parser`.

```typescript
function validateOpenApi32(
  document: OpenApiDocument,
): Promise<ValidationOutcome>;

interface ValidationOutcome {
  valid: boolean;
  diagnostics: Diagnostic[];
}
```

Los errores de validación se convierten en diagnósticos con el código `OAS_VALIDATION_ERROR`; los fallos del validador usan `OAS_VALIDATOR_FAILED`.

### `validateOpenApiDocument`

Alias canónico de [`validateOpenApi32`](#validateopenapi32). Las bibliotecas dependientes de `@powerduck/*` deben importar este nombre estable.

```typescript
import { validateOpenApiDocument } from "@powerduck/x-to-openapi";

const { valid, diagnostics } = await validateOpenApiDocument(doc);
```

### `OpenApiDocument`

El tipo canónico de documento OpenAPI 3.2, alias de `Oas32Document` de `@powerduck/openapi-parser`. Todas las bibliotecas `@powerduck/*` deben usarlo en lugar de recurrir a paquetes de tipos de terceros.

### `OpenApi32Document`

Alias de `OpenApiDocument` específico de esta versión.

---

## Tipos

### `ConvertOptions`

Todas las opciones de conversión. Los campos no definidos usan los valores de [`DEFAULT_OPTIONS`](#default_options).

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

| Opción | Tipo | Valor predeterminado | Descripción |
|---|---|---|---|
| `openapiVersion` | `"3.2.0"` | `"3.2.0"` | Solo se admite `"3.2.0"`; cualquier otro valor lanza un error. |
| `title` | `string` | `"Generated API"` | `info.title`. No puede estar vacío. |
| `version` | `string` | `"1.0.0"` | `info.version`. No puede estar vacío. |
| `description` | `string` | `""` | `info.description`. Se omite si está vacío. |
| `inferPathParameters` | `boolean` | `true` | Parametriza los segmentos variables que parecen identificadores. |
| `pathParameterMinSamples` | `number` | `2` | Número mínimo de solicitudes por grupo para generar plantillas. Debe ser un entero positivo. |
| `inferSecurity` | `boolean` | `true` | Genera `securitySchemes` y `security` por operación. |
| `includeCommonHeaders` | `boolean` | `false` | Incluye cabeceras accesorias del navegador. Las cabeceras de transporte siempre se excluyen. |
| `includeCookies` | `boolean` | `false` | Genera parámetros a partir de cookies. |
| `includeExamples` | `boolean` | `false` | Rellena ejemplos de esquemas y parámetros con valores observados. |
| `useServerBasePath` | `boolean` | `false` | Incorpora el prefijo de ruta común en `servers[0].url` cuando todas las solicitudes comparten el mismo origen. |
| `validate` | `boolean` | `true` | Valida el documento de salida. Los errores se convierten en diagnósticos; el modo estricto puede convertirlos en excepciones. |
| `strict` | `boolean` | `false` | Lanza `ConversionError` ante cualquier diagnóstico de nivel error. |

`ResolvedConvertOptions` equivale a `Required<ConvertOptions> & { openapiVersion: "3.2.0" }`.

---

### `ConvertResult`

El valor devuelto por cada conversión.

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

La representación intermedia independiente del adaptador que todos los adaptadores generan.

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

`DiagnosticCode` es una unión de cadenas con todos los códigos que puede emitir el framework:

`ADAPTER_PARSE_FAILED`, `CURL_PARSE_FAILED`, `CURL_EMPTY_INPUT`, `CURL_CAPABILITY_MISSING`, `CURL_BACKEND_JSON_FALLBACK`, `CURL_UNSUPPORTED_SCHEME`, `POSTMAN_INVALID_COLLECTION`, `POSTMAN_EMPTY_COLLECTION`, `POSTMAN_UNSUPPORTED_BODY_MODE`, `POSTMAN_VARIABLE_UNRESOLVED`, `BODY_JSON_INVALID`, `PATH_MERGE_CONFLICT`, `OPERATION_ID_COLLISION`, `PSEUDO_HEADER_DROPPED`, `MULTIPLE_SERVERS`, `NO_REQUESTS`, `OAS_VALIDATION_ERROR`, `OAS_VALIDATOR_FAILED`, `DISCOVERY_COMPONENT_NOT_FOUND`, `DISCOVERY_COMPONENT_NAME_COLLISION`, `DISCOVERY_PATH_PARAM_MISMATCH`, `DISCOVERY_MEDIA_WITHOUT_SCHEMA`, `DISCOVERY_RESPONSE_MISSING`, `DISCOVERY_SECURITY_SCHEME_MISSING`, `DISCOVERY_GAP`, `DISCOVERY_PATH_CONFLICT`.

---

### Otros tipos principales

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

## Conversión de la representación intermedia de descubrimiento

### `discoveryToOpenApi`

Convierte un `DiscoveredProject` proporcionado en OpenAPI 3.2. No examina archivos fuente por sí mismo. Las rutas sin resolver generan advertencias y nunca se añaden silenciosamente a `paths`; las ubicaciones de origen y el nivel de confianza siguen disponibles en el proyecto devuelto.

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

`allowGaps: false` eleva a errores los diagnósticos de carencias en operaciones y esquemas; no activa excepciones de modo estricto. Compruebe siempre `ok`, `documentValid` y `diagnostics`. Las advertencias de rutas sin resolver se notifican por separado. Si se desactiva la validación, `documentValid` es verdadero sin ejecutar la validación del esquema.

### `buildDiscoveryOpenApi32`

Constructor síncrono de bajo nivel para la misma representación intermedia. Informa de diagnósticos mediante el callback recibido y no valida el documento. Use el contenedor asíncrono cuando necesite validación y un objeto de resultado completo.

```typescript
function buildDiscoveryOpenApi32(
  project: DiscoveredProject,
  allowGaps: boolean,
  report: (diagnostic: Diagnostic) => void,
): OpenApiDocument;
```

Tipos de descubrimiento exportados desde el punto de entrada principal: `Confidence`, `GapCode`, `SourceLocation`, `JsonSchema`, `DiscoveredParameter`, `DiscoveredMediaType`, `DiscoveredRequestBody`, `DiscoveredResponse`, `DiscoveredOperation`, `DiscoveredComponent`, `DiscoveredSecurityScheme`, `DiscoveredServer`, `DiscoveredUnresolved`, `DiscoveredProject`, `DiscoveryOptions`, `DiscoveryResult`.

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

## Resumen de exportaciones

| Símbolo | Categoría |
|---|---|
| `curlToOpenApi` | función |
| `postmanToOpenApi` | función |
| `XToOpenApi` | clase |
| `DEFAULT_OPTIONS` | constante |
| `AdapterRegistry` | clase |
| `ConversionError` | clase |
| `DiagnosticBag` | clase |
| `CurlAdapter` | clase |
| `splitCurlCommands` | función |
| `PostmanAdapter` | clase |
| `PostmanTypes` | espacio de nombres |
| `buildOpenApi32` | función |
| `buildPathTemplates` | función |
| `looksLikeIdentifier` | función |
| `scalar` | función |
| `jsonSchema` | función |
| `mergeSchemas` | función |
| `Schema` | tipo |
| `discoveryToOpenApi` | función |
| `buildDiscoveryOpenApi32` | función |
| `validateOpenApi32` | función |
| `validateOpenApiDocument` | función (alias) |
| `OpenApiDocument` | tipo |
| `OpenApi32Document` | tipo |
| `DiscoveredProject`, `DiscoveryOptions`, `DiscoveryResult` | tipos |
| `ConvertOptions`, `ConvertResult`, `NormalizedRequest`, `SourceAdapter`, `AdapterContext`, `Diagnostic`, `DiagnosticCode`, `Severity`, `Header`, `ParameterValue`, `FormField`, `BodyKind`, `RequestBody`, `RequestAuth`, `JsonObject`, `ResolvedConvertOptions` | tipos |
