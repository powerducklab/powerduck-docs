---
sidebar_position: 4
title: "API Reference"
description: "Complete API reference for @powerduck/x-to-openapi v0.2.2: XToOpenApi, AdapterRegistry, CurlAdapter, PostmanAdapter, curlToOpenApi, postmanToOpenApi, schema utilities, validation, and every type and diagnostic code."
keywords: ["x-to-openapi API", "XToOpenApi", "curlToOpenApi", "postmanToOpenApi", "ConvertOptions", "ConvertResult", "Diagnostic"]
---

# API Reference

Complete reference for `@powerduck/x-to-openapi` **v0.2.2**. Every public export from the package entry point is documented with its exact signature and defaults.

---

## Zero-config helpers

### `curlToOpenApi`

One-shot conversion: registers a [`CurlAdapter`](#curladapter) and calls [`convert`](#convertsource-input-options) on it.

```typescript
function curlToOpenApi(
  input: string | readonly string[],
  options?: ConvertOptions,
): Promise<ConvertResult>;
```

| Parameter | Type | Description |
|---|---|---|
| `input` | `string \| readonly string[]` | A curl command, an array of commands, or browser "Copy all as cURL" output (multi-command text is split automatically). |
| `options` | `ConvertOptions` | Optional conversion settings. |

**Returns:** [`ConvertResult`](#convertresult).

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  "curl -X POST https://api.example.com/users -H 'Content-Type: application/json' --data '{\"name\":\"Ada\"}'",
);
```

---

### `postmanToOpenApi`

One-shot conversion: registers a [`PostmanAdapter`](#postmanadapter) and converts. Accepts a parsed collection object or a JSON string. Test scripts are preserved as `x-postman-scripts`.

```typescript
function postmanToOpenApi(
  input: unknown,
  options?: ConvertOptions,
): Promise<ConvertResult>;
```

| Parameter | Type | Description |
|---|---|---|
| `input` | `unknown` | A Postman Collection v2.0/v2.1.0 object, or a JSON string of one. |
| `options` | `ConvertOptions` | Optional conversion settings. |

**Returns:** [`ConvertResult`](#convertresult).

---

## Core framework

### `XToOpenApi`

The converter class. Holds an [`AdapterRegistry`](#adapterregistry) and runs the parse → build → validate pipeline.

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

Registers an adapter. Returns `this` for chaining. Validates the adapter `id` against `/^[a-z][a-z0-9-]*$/`, requires a `parse()` method, and rejects duplicate ids.

#### `adapters()`

Returns the registered adapter ids as `string[]`.

#### `convert(source, input, options?)`

The single entry point.

| Parameter | Type | Description |
|---|---|---|
| `source` | `string` | An adapter id (`"curl"`, `"postman"`, …) or `"auto"` to select via `canHandle()`. |
| `input` | `unknown` | The source data (shape depends on the adapter). |
| `options` | `ConvertOptions` | Optional conversion settings. |

**Behavior:**

1. Resolves options against [`DEFAULT_OPTIONS`](#default_options) and validates them.
2. Rejects inputs larger than **10 MB** with a `ConversionError`.
3. Selects the adapter (explicit id, or `"auto"` detection).
4. Parses the input into `NormalizedRequest[]` (parse failures become diagnostics).
5. Builds the OpenAPI 3.2 document via [`buildOpenApi32`](#buildopenapi32).
6. If `validate` is `true`, validates via [`validateOpenApi32`](#validateopenapi32) and folds result diagnostics in.
7. Returns a [`ConvertResult`](#convertresult).

```typescript
import { XToOpenApi, CurlAdapter } from "@powerduck/x-to-openapi";

const converter = new XToOpenApi().register(new CurlAdapter());
const result = await converter.convert("curl", curlText, { title: "My API" });
```

---

### `DEFAULT_OPTIONS`

The resolved default every [`ConvertOptions`](#convertoptions) is merged onto. Exported as a `ResolvedConvertOptions`.

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

Holds registered adapters by id.

```typescript
class AdapterRegistry {
  register<I>(adapter: SourceAdapter<I>): this;
  has(id: string): boolean;
  get(id: string): SourceAdapter<unknown>;
  detect(input: unknown): SourceAdapter<unknown> | undefined;
  ids(): string[];
}
```

| Method | Description |
|---|---|
| `register(adapter)` | Validates the id (`/^[a-z][a-z0-9-]*$/`), checks for `parse()`, and rejects duplicates. Returns `this`. |
| `has(id)` | Membership test. |
| `get(id)` | Returns the adapter, or throws listing the registered ids. |
| `detect(input)` | Returns the first adapter whose `canHandle()` accepts the input. Throwing predicates are caught and skipped. |
| `ids()` | Lists registered ids. |

---

### `ConversionError`

Thrown in `strict` mode (or on oversized input). Carries the diagnostics that caused the failure.

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

Internal collector used by [`XToOpenApi.convert`](#convertsource-input-options). Dedupes diagnostics and throws a `ConversionError` on error-severity entries when `strict` is `true`.

```typescript
class DiagnosticBag {
  constructor(strict?: boolean); // default false
  report(diagnostic: Diagnostic): void;
  get items(): Diagnostic[];
  hasErrors(): boolean;
}
```

---

## Adapters

### `CurlAdapter`

Converts curl commands (single, batch, or browser export) into `NormalizedRequest[]`. Wraps `curlconverter` and normalizes its output.

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

- `canHandle` accepts a string (or first array element) that begins with an optional shell prompt (`$`, `#`, `>`) followed by `curl` or `curl.exe`.
- `parse` splits multi-command input via [`splitCurlCommands`](#splitcurlcommands), skips non-HTTP(S) URLs, drops HTTP/2 pseudo-headers, parses bodies and cookies, and infers auth.

> The adapter module also exposes `resolveBackend`, `availableExports`, and `resetBackend` for its internal curlconverter integration; these are **not** re-exported from the package entry point.

---

### `splitCurlCommands`

Splits browser "Copy all as cURL" output into individual commands. Handles single/double quotes, backslash and caret (`^`) continuations, CRLF, shell prompts (`$`, `#`, `>`, `PS C:\>`), and `curl.exe`.

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

Converts Postman Collections v2.0/v2.1.0 into `NormalizedRequest[]`. Walks nested folders, resolves auth with item > folder > collection inheritance, maps body modes, and preserves test scripts.

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

- `canHandle` accepts an object (or parsed JSON string) with an `info` object and an `item` array. The v2.1.0 and v2.0 schema URLs are both accepted, as are shape-valid collections that omit the schema URL.
- Test/prerequest events are emitted on the operation as `x-postman-scripts`.

---

### `PostmanTypes`

A namespace holding every Postman collection type used by the adapter:

```typescript
import { PostmanTypes } from "@powerduck/x-to-openapi";

PostmanTypes.PostmanCollection;
PostmanTypes.PostmanItem;
PostmanTypes.PostmanFolder;
PostmanTypes.PostmanRequestItem;
PostmanTypes.PostmanRequest;
PostmanTypes.PostmanBody;
PostmanTypes.PostmanBodyMode;
PostmanTypes.PostmanAuth;
PostmanTypes.PostmanEvent;
PostmanTypes.PostmanScript;
// ... plus isFolder and isRequestItem type guards
```

Key members: `PostmanCollection`, `PostmanInfo`, `PostmanVersion`, `PostmanItem`, `PostmanFolder`, `PostmanRequestItem`, `PostmanRequest`, `PostmanHeader`, `PostmanUrl`, `PostmanQueryParam`, `PostmanBodyMode`, `PostmanBody`, `PostmanUrlEncodedParam`, `PostmanFormDataParam`, `PostmanFileParam`, `PostmanGraphQLBody`, `PostmanAuthType`, `PostmanAuth`, `PostmanAuthParam`, `PostmanEvent`, `PostmanScript`, `PostmanVariable`, `PostmanDescription`, `isFolder`, `isRequestItem`.

---

## OpenAPI building blocks

### `buildOpenApi32`

Low-level builder. Assembles an OpenAPI 3.2 document from an array of already-normalized requests. You normally call it indirectly through [`XToOpenApi.convert`](#convertsource-input-options).

```typescript
function buildOpenApi32(
  requests: readonly NormalizedRequest[],
  options: ResolvedConvertOptions,
  report: (diagnostic: Diagnostic) => void,
): OpenApiDocument;
```

It groups operations by path + method, collects query/header/cookie/path parameters, merges body schemas, emits `securitySchemes`, routes non-standard methods to `additionalOperations`, and assigns `operationId`/`tags`.

---

### `buildPathTemplates`

Groups same-shaped requests and templates segments that vary across at least `minSamples` samples and look like identifiers in every sample.

```typescript
function buildPathTemplates(
  requests: readonly NormalizedRequest[],
  minSamples: number,
  enabled: boolean,
): Map<number, PathTemplate>;
```

Returns a map keyed by `sourceIndex`. Each `PathTemplate` has:

```typescript
interface PathTemplate {
  readonly path: string;                    // e.g. "/users/{userId}"
  readonly parameters: ReadonlyMap<number, string>; // segment index → name
}
```

When `enabled` is `false`, every request gets a static template equal to its raw pathname.

---

### `looksLikeIdentifier`

Single source of truth for what counts as a templatable segment.

```typescript
function looksLikeIdentifier(segment: string): boolean;
```

Returns `true` when the segment is pure numeric, a UUID, a ULID, or a hex string of at least 8 characters.

---

### `scalar`

Infers a JSON Schema from a single string sample. Conservative by design.

```typescript
function scalar(value: string, includeExample?: boolean): Schema; // default false
```

Infers `boolean`, `integer` (safe-integer length cap), `number`, `string` with `format` (`uuid`, `date`, `date-time`), otherwise plain `string`.

---

### `jsonSchema`

Infers a JSON Schema from any JSON value (object, array, scalar).

```typescript
function jsonSchema(value: unknown, includeExample?: boolean): Schema; // default false
```

Objects become `{ type: "object", properties, required }`; arrays become `{ type: "array", items }` (empty arrays get `{}`); scalars follow `scalar`-like typing.

---

### `mergeSchemas`

Structurally merges multiple sample schemas. Object properties are unioned; a property missing from any sample becomes optional. Arrays recurse; `integer` widens to `number`; formats are kept only when identical across all samples.

```typescript
function mergeSchemas(schemas: readonly Schema[]): Schema;
```

---

### `Schema`

The structural JSON Schema subset used for inferred bodies and parameters.

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

## Canonical type & validation

### `validateOpenApi32`

Validates an OpenAPI document against the OpenAPI 3.2 schema via `@powerduck/openapi-parser`.

```typescript
function validateOpenApi32(
  document: OpenApiDocument,
): Promise<ValidationOutcome>;

interface ValidationOutcome {
  valid: boolean;
  diagnostics: Diagnostic[];
}
```

Validation errors are mapped to diagnostics with code `OAS_VALIDATION_ERROR`; validator failures map to `OAS_VALIDATOR_FAILED`.

### `validateOpenApiDocument`

Canonical alias of [`validateOpenApi32`](#validateopenapi32). Downstream `@powerduck/*` libraries should import this stable name.

```typescript
import { validateOpenApiDocument } from "@powerduck/x-to-openapi";

const { valid, diagnostics } = await validateOpenApiDocument(doc);
```

### `OpenApiDocument`

The canonical OpenAPI 3.2 document type (aliases `Oas32Document` from `@powerduck/openapi-parser`). All `@powerduck/*` libraries should use this rather than reaching into third-party type packages.

### `OpenApi32Document`

Version-specific alias of `OpenApiDocument`.

---

## Types

### `ConvertOptions`

All conversion settings. Unset fields fall back to [`DEFAULT_OPTIONS`](#default_options).

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

| Option | Type | Default | Description |
|---|---|---|---|
| `openapiVersion` | `"3.2.0"` | `"3.2.0"` | Only `"3.2.0"` is supported; anything else throws. |
| `title` | `string` | `"Generated API"` | `info.title`. Must be non-empty. |
| `version` | `string` | `"1.0.0"` | `info.version`. Must be non-empty. |
| `description` | `string` | `""` | `info.description`. Omitted when empty. |
| `inferPathParameters` | `boolean` | `true` | Templatize varying identifier-like segments. |
| `pathParameterMinSamples` | `number` | `2` | Minimum requests in a group before templating. Must be a positive integer. |
| `inferSecurity` | `boolean` | `true` | Emit `securitySchemes` and per-operation `security`. |
| `includeCommonHeaders` | `boolean` | `false` | Include browser-noise headers. Transport headers are always excluded. |
| `includeCookies` | `boolean` | `false` | Emit cookies as parameters. |
| `includeExamples` | `boolean` | `false` | Populate schema/parameter examples from observed values. |
| `useServerBasePath` | `boolean` | `false` | Collapse the common path prefix into `servers[0].url` when all requests share one origin. |
| `validate` | `boolean` | `true` | Validate the output document. Failures are diagnostics, not throws. |
| `strict` | `boolean` | `false` | Throw `ConversionError` on any error-severity diagnostic. |

`ResolvedConvertOptions` is `Required<ConvertOptions> & { openapiVersion: "3.2.0" }`.

---

### `ConvertResult`

The return value of every conversion.

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

The adapter-agnostic intermediate every adapter produces.

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

`DiagnosticCode` is a string union of every code the framework can report:

`ADAPTER_PARSE_FAILED`, `CURL_PARSE_FAILED`, `CURL_EMPTY_INPUT`, `CURL_CAPABILITY_MISSING`, `CURL_BACKEND_JSON_FALLBACK`, `CURL_UNSUPPORTED_SCHEME`, `POSTMAN_INVALID_COLLECTION`, `POSTMAN_EMPTY_COLLECTION`, `POSTMAN_UNSUPPORTED_BODY_MODE`, `POSTMAN_VARIABLE_UNRESOLVED`, `BODY_JSON_INVALID`, `PATH_MERGE_CONFLICT`, `OPERATION_ID_COLLISION`, `PSEUDO_HEADER_DROPPED`, `MULTIPLE_SERVERS`, `NO_REQUESTS`, `OAS_VALIDATION_ERROR`, `OAS_VALIDATOR_FAILED`.

---

### Other core types

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

## Export summary

| Symbol | Kind |
|---|---|
| `curlToOpenApi` | function |
| `postmanToOpenApi` | function |
| `XToOpenApi` | class |
| `DEFAULT_OPTIONS` | const |
| `AdapterRegistry` | class |
| `ConversionError` | class |
| `DiagnosticBag` | class |
| `CurlAdapter` | class |
| `splitCurlCommands` | function |
| `PostmanAdapter` | class |
| `PostmanTypes` | namespace |
| `buildOpenApi32` | function |
| `buildPathTemplates` | function |
| `looksLikeIdentifier` | function |
| `scalar` | function |
| `jsonSchema` | function |
| `mergeSchemas` | function |
| `Schema` | type |
| `validateOpenApi32` | function |
| `validateOpenApiDocument` | function (alias) |
| `OpenApiDocument` | type |
| `OpenApi32Document` | type |
| `ConvertOptions`, `ConvertResult`, `NormalizedRequest`, `SourceAdapter`, `AdapterContext`, `Diagnostic`, `DiagnosticCode`, `Severity`, `Header`, `ParameterValue`, `FormField`, `BodyKind`, `RequestBody`, `RequestAuth`, `JsonObject`, `ResolvedConvertOptions` | types |
