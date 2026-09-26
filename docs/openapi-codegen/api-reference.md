---
sidebar_position: 4
title: API Reference
description: "Every export of @powerduck/openapi-codegen: generate, registry, plugin, core functions, types, and the 41 built-in generators."
---

# API Reference

Complete API documentation for `@powerduck/openapi-codegen` v0.5.3.

## Top-level functions

| Export | Signature | Description |
|--------|-----------|-------------|
| `generate` | `(options: GenerateOptions) => string` | Generate runnable source code for one operation |
| `register` | `(generator: Generator) => void` | Register a custom generator |
| `get` | `(language: string, client: string) => Generator \| undefined` | Look up a generator |
| `list` | `() => Array<{ language: string; client: string }>` | List all registered generators |
| `use` | `(plugin: Plugin) => void` | Apply a plugin that registers generators |
| `registerBuiltins` | `() => void` | Register all built-in generators (auto-called on import) |
| `normalize` | `(options) => NormalizedRequest` | Turn a document + path + method into a normalized request |
| `builtinGenerators` | `Generator[]` | The raw array of all built-in generator definitions |

Built-ins are registered automatically when the module loads, so calling
`registerBuiltins()` manually is optional.

## generate(options)

```ts
generate(options: GenerateOptions): string
```

Returns generated source code as a string. Looks up the generator with
`get(options.language, options.client)`; if `options.request` is absent, calls
`normalize({ document, path, method, serverUrl, securityValues, softRefMode })`;
then calls `generator.generate(request)`.

Throws:

- `TypeError` when `options` is not an object, or required inputs are missing.
- `Error: Unsupported generator: <language>/<client>` for an unknown combo.
- Errors from `normalize()` (unknown path/method, invalid document, broken/circular `$ref` unless `softRefMode`).

See [Configuration](./configuration.md#generateoptions) for the full option table.

## register(generator)

```ts
register({
  language: "mylang",
  client: "my-client",
  generate(request) {
    return `// ${request.method} ${request.path}`;
  },
});
```

Registers into the internal case-insensitive store, keyed by
`language\0client`.

## get(language, client)

```ts
const generator = get("javascript", "fetch");
```

Returns the `Generator` or `undefined` if not found.

## list()

```ts
const combos = list();
// [{ language: "c", client: "libcurl" }, ...]
```

## use(plugin)

```ts
use({
  name: "my-plugin",
  register({ register }) {
    register(customGenerator);
  },
});
```

Equivalent to calling `plugin.register({ register })`.

## registerBuiltins()

```ts
registerBuiltins();
```

Idempotent (guarded by an internal flag). Registers every entry in
`builtinGenerators`.

## normalize(options)

```ts
import { normalize } from "@powerduck/openapi-codegen";

const request = normalize({
  document,
  path: "/pets/{id}",
  method: "get",
  serverUrl: "https://example.com",
  securityValues: { bearerAuth: "token" },
  softRefMode: false,
});
```

Resolves `$ref`s, merges path/operation parameters, picks a request body media
type, generates example values, resolves security, and computes `baseUrl`.
Throws for unknown paths/methods and unsupported methods.

## Built-in generators (21 languages, 41 clients)

The exact `language` / `client` identifiers, as registered in
`src/emitters/index.ts`. Identifiers are case-sensitive.

| Language | `language` | `client` values |
|----------|-----------|-----------------|
| C | `c` | `libcurl` |
| C# | `csharp` | `httpclient`, `restsharp` |
| Clojure | `clojure` | `clj-http` |
| Dart | `dart` | `http` |
| F# | `fsharp` | `httpclient` |
| Go | `go` | `new-request` |
| HTTP request file | `http` | `http1` |
| Java | `java` | `asynchttp`, `java-net-http`, `okhttp`, `unirest` |
| JavaScript | `javascript` | `axios`, `fetch`, `jquery`, `ofetch`, `xhr` |
| Kotlin | `kotlin` | `okhttp` |
| Node.js | `node` | `axios`, `fetch`, `ofetch`, `undici` |
| Objective-C | `objc` | `nsurlsession` |
| OCaml | `ocaml` | `cohttp` |
| PHP | `php` | `curl`, `guzzle`, `laravel-http` |
| PowerShell | `powershell` | `invoke-restmethod`, `invoke-webrequest` |
| Python | `python` | `aiohttp`, `http-client`, `httpx-async`, `httpx-sync`, `requests` |
| R | `r` | `httr2` |
| Ruby | `ruby` | `net-http` |
| Rust | `rust` | `reqwest` |
| Shell | `shell` | `curl`, `httpie`, `wget` |
| Swift | `swift` | `nsurlsession` |

Count: 21 languages, 41 combinations.

> Generator availability does not mean every client can represent every
> operation. For example, `shell/wget` cannot safely build arbitrary
> `multipart/form-data` requests; use `shell/curl` or `shell/httpie` instead.

## Core types

Re-exported from `./types`:

```ts
type ParameterLocation = "path" | "query" | "querystring" | "header" | "cookie";

interface FileValue { __file: true; path?; name?; contentType?; data?; }
interface Parameter { name; in: ParameterLocation; value: unknown; style?; explode?; allowReserved?; }
interface Body { mediaType: string; value: unknown; encoding?: Record<string, unknown>; }
interface Security { name; type; scheme?; in?; paramName?; value: string; }
interface RequestIR { method; baseUrl; path; parameters: Parameter[]; headers: Parameter[]; body?; security: Security[]; }
interface GenerateResult { code: string; files?: Record<string, string>; metadata?: Record<string, unknown>; }
interface Generator { language: string; client: string; generate(request: RequestIR): string; }
interface Plugin { name: string; register(api: { register(g: Generator): void }): void; }
interface GenerateOptions { language; client; request?; document?; path?; method?; serverUrl?; securityValues?; softRefMode?; }
```

## Core functions

All are re-exported from the package root.

### refs

| Export | Description |
|--------|-------------|
| `RefResolver` | Class for in-document `#/...` JSON Pointer resolution. Constructor `(root, softMode = false)`. Methods: `deref(value)`, `resolveRef(ref)`, `clearCache()`. Public field `softMode`. Throws on external/broken/circular refs unless `softMode` is true. |

### example

| Export | Description |
|--------|-------------|
| `example(schema, resolver, seen?, depth=0, ctx=default)` | Generate an example value from a JSON Schema. Respects `example`, `enum`, `const`, `default`, `oneOf`/`anyOf`/`allOf`, types, formats, and constraints. |
| `ExampleGenContext` | Type `{ isRequestBody: boolean; isResponse: boolean }` controlling `readOnly`/`writeOnly` filtering. |
| `defaultExampleContext` | The default `{ isRequestBody: false, isResponse: false }`. |

### serialize

| Export | Description |
|--------|-------------|
| `Pair` | Type `[string, string]`. |
| `parameter(parameter)` | Serialize one parameter into `Pair[]` following OpenAPI `style`/`explode` rules (form, spaceDelimited, pipeDelimited, label, matrix, simple, deepObject). |
| `query(pairs)` | Join pairs into a query string. |
| `cookie(pairs)` | Join pairs into a `Cookie` header value. |
| `headerValue(value)` | Sanitize a header value (strip CR/LF/NUL). |

### generator

| Export | Description |
|--------|-------------|
| `createGenerator(language, client, emit)` | Wrap an `emit(request) => string` function into a `Generator`. |
| `GeneratorEmitter` | Type `(request: RequestIR) => string`. |

### registry

| Export | Description |
|--------|-------------|
| `registerGenerator(generator)` | Insert into the case-insensitive store. |
| `getGenerator(language, client)` | Read from the store. |
| `listGenerators()` | Return `[{ language, client }, ...]`. |

### plugin

| Export | Description |
|--------|-------------|
| `PluginApi` | Type `{ register(generator: Generator): void }`. |
| `applyPlugin(plugin, api)` | Call `plugin.register(api)`. |

### request

| Export | Description |
|--------|-------------|
| `CompiledRequest` | Type `{ url; headers: Array<[string,string]>; body?; queryPairs; cookiePairs }`. |
| `compile(request)` | Substitute path params, build query/header/cookie pairs, apply security, and join the URL. |
| `form(value)` | Serialize an object into a `application/x-www-form-urlencoded` string. |

### helpers

Commonly used utilities:

| Export | Description |
|--------|-------------|
| `isRecord(value)` | Type guard for plain objects. |
| `isFileValue(value)` | Type guard for a `FileValue` marker. |
| `firstDefined(...values)` | First non-`undefined` value. |
| `nonBlankString(value, fallback?)` | Trimmed non-empty string or `undefined`/fallback. |
| `normalizeMethod(method)` | Uppercase method, falling back to `GET`. |
| `supportsRequestBody(method)` | `false` for `GET`/`HEAD`. |
| `requiresRequestBody(method)` | `true` for `POST`/`PUT`/`PATCH`. |
| `mediaTypeOf(request, fallback)` | Effective media type from body or Content-Type header. |
| `hasJsonBody(request)` | JSON or `+json` media type. |
| `hasFormBody(request)` | `application/x-www-form-urlencoded`. |
| `hasMultipartBody(request)` | `multipart/form-data`. |
| `bodyText(request)` | Raw body text or pretty-printed JSON. |
| `toHeaderObject(headers)` | Convert pairs into a `Record<string,string>`. |
| `toKeyValueBody(value)` | Flatten a multipart body into ordered field descriptors. |
| `collectByLocation(request, location)` | Filter parameters by OpenAPI location. |
| `operationName(request)` | Derive a snake_case function/variable name from method + path. |
| `sanitizeIdentifier(value)` | Turn arbitrary text into a valid identifier. |
| `indent(text, prefix="  ")` | Indent every non-empty line. |
| `stringifyLiteral(value)` | Pretty JSON with safe fallback. |
| `kotlinValue(value)` / `formFieldValue(value)` | Serialize a value for a literal/form field. |
| `fileComment(path, fieldName)` | Build a TODO comment for a placeholder multipart path. |
| `mergeAllOfSchemas(schemas, resolver)` | Shallowly merge `allOf` schemas. |
| `lightweightOpenAPIPreCheck(doc)` | Return structural warnings about a document. |
| `browserHeaders(headers, multipart)` | Drop browser-forbidden headers. |
| `isBrowserForbiddenHeader(name)` | Whether a header is controlled by browser networking APIs. |
| `escapeJs`, `escapePy`, `escapeSh`, `escapePhp`, `escapeRuby`, `escapePowerShell`, `escapeCSharp`, `escapeJava`, `escapeGo`, `escapeRust`, `escapeObjC`, `escapeSwift`, `escapeR`, `escapeOCaml`, `escapeFSharp`, `escapeClojure` | Language-specific string literal escapers. |
| `assertIsRecord`, `assertIsString`, `assertIsNumber` | Runtime assertion guards. |
| `DEFAULT_FILE_PATH`, `DEFAULT_FILE_NAME`, `DEFAULT_BINARY_MEDIA_TYPE` | Constants for placeholder file uploads. |
