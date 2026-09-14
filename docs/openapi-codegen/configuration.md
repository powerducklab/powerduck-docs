---
sidebar_position: 4
title: Configuration
description: "Generation options for @powerduck/openapi-codegen: GenerateOptions, RequestIR, the Generator interface, and the Plugin interface."
---

# Configuration

There is no separate config file. Generation is controlled by the
`GenerateOptions` object passed to [`generate()`](./api-reference).

## GenerateOptions

```ts
interface GenerateOptions {
  language: string;
  client: string;
  request?: RequestIR;
  document?: unknown;
  path?: string;
  method?: string;
  serverUrl?: string;
  securityValues?: Record<string, string>;
  softRefMode?: boolean;
}
```

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `language` | `string` | **yes** | Target language identifier (case-sensitive), e.g. `"javascript"` |
| `client` | `string` | **yes** | Target HTTP client identifier, e.g. `"fetch"` |
| `request` | `RequestIR` | one of* | A pre-normalized request; skips `normalize` |
| `document` | `unknown` | one of* | A parsed OpenAPI document object |
| `path` | `string` | with `document` | Exact OpenAPI path template, e.g. `"/pets/{id}"` |
| `method` | `string` | with `document` | HTTP method, e.g. `"get"` / `"post"` |
| `serverUrl` | `string` | no | Override the server URL from the document |
| `securityValues` | `Record<string, string>` | no | Credentials keyed by security scheme name |
| `softRefMode` | `boolean` | no | Do not throw on broken/circular `$ref`s; return partial values |

\* Either `request` alone, or `document` + `path` + `method`, must be provided.
When `request` is supplied, `document`, `path`, `method`, `serverUrl`,
`securityValues`, and `softRefMode` are ignored.

### Input validation errors

`generate()` throws when required input is missing:

- `TypeError: generate() requires an options object` — no options object.
- `Error: Unsupported generator: <language>/<client>` — unknown combination.
- `TypeError: generate() requires either a 'request' or a 'document' option`
- `TypeError: generate() requires a 'path' option when using 'document'`
- `TypeError: generate() requires a 'method' option when using 'document'`

`normalize()` itself throws `Error` for unsupported methods, missing `paths`,
unknown paths, and missing operations; `TypeError` for non-object documents.

## RequestIR

The normalized, emitter-agnostic representation of one request. You can build
this directly and pass it as `options.request` to bypass `normalize`.

```ts
interface RequestIR {
  method: string;
  baseUrl: string;
  path: string;
  parameters: Parameter[];
  headers: Parameter[];
  body?: Body;
  security: Security[];
}
```

### Parameter

```ts
interface Parameter {
  name: string;
  in: ParameterLocation;
  value: unknown;
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
}

type ParameterLocation = "path" | "query" | "querystring" | "header" | "cookie";
```

### Body

```ts
interface Body {
  mediaType: string;
  value: unknown;
  encoding?: Record<string, unknown>;
}
```

### Security

```ts
interface Security {
  name: string;
  type: string;       // e.g. "apiKey" | "http"
  scheme?: string;    // e.g. "bearer" | "basic"
  in?: string;        // e.g. "header" | "query" | "cookie"
  paramName?: string;
  value: string;
}
```

### FileValue

Multipart file placeholders use this marker shape:

```ts
interface FileValue {
  __file: true;
  path?: string;
  name?: string;
  contentType?: string;
  data?: string | ArrayBuffer | Uint8Array | Blob;
}
```

## Generator

A generator is any object matching this interface. Built-in generators are
wrapped with `createGenerator(language, client, emit)`, but you can register
your own:

```ts
interface Generator {
  language: string;
  client: string;
  generate(request: RequestIR): string;
}
```

`generate` receives a `RequestIR` and returns the generated source code string.

## Plugin

A plugin registers one or more generators through the `use()` API:

```ts
interface Plugin {
  name: string;
  register(api: { register(generator: Generator): void }): void;
}
```

Example:

```typescript
import { use } from "@powerduck/openapi-codegen";

use({
  name: "my-plugin",
  register({ register }) {
    register({
      language: "mylang",
      client: "my-client",
      generate(request) {
        return `// ${request.method} ${request.path}`;
      },
    });
  },
});
```

## GenerateResult

This type is declared for future generator output that may include multiple
files. The current `generate()` function still returns a `string`:

```ts
interface GenerateResult {
  code: string;
  files?: Record<string, string>;
  metadata?: Record<string, unknown>;
}
```

## Normalize output shape

Calling `normalize()` directly (see [API reference](./api-reference#normalizeoptions))
returns an object slightly broader than `RequestIR`:

```ts
{
  preWarnings: string[];   // lightweight structural warnings
  method: string;          // uppercase
  baseUrl: string;
  path: string;
  parameters: NormalizedParameter[];
  headers: NormalizedParameter[];   // parameters filtered to in === "header"
  body?: { mediaType, value, encoding? };
  security: NormalizedSecurity[];
}
```

## Server URL resolution order

`baseUrl` is resolved as the first non-blank of:

1. `options.serverUrl`
2. the operation's `servers`
3. the path item's `servers`
4. the root `servers`
5. fallback `"https://example.com"`

Server `{variable}` placeholders are filled from `server.variables` using
their `default` (then `example`) value, URI-encoded.
