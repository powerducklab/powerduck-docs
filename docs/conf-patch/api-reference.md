---
sidebar_position: 4
title: "API Reference"
description: "Complete API reference for @powerduck/conf-patch v0.3.4: every exported function, type, option, default, and error code across the core layer, file layer, OpenAPI validation, and utilities."
keywords: ["conf-patch API", "patchContent", "setConfigValue", "file locking", "OpenApiValidationError", "types"]
---

# API Reference

Complete reference for `@powerduck/conf-patch` **v0.3.4**. Every exported symbol is documented with its exact signature and defaults.

There are two entry points:

- **`@powerduck/conf-patch`** — everything below (core + file layer + OpenAPI validation + utilities).
- **`@powerduck/conf-patch/core`** — only the browser-safe subset: `patchContent`, `setContentValue`, `deleteContentValue`, `PatchContentOptions`, the assertion helpers, and the types `ConfigFormat`, `JsonPatchOp`, `JsonPathSegment`.

---

## Core layer (browser-safe)

### `patchContent`

Applies an array of RFC 6902 patch operations to a configuration string. Pure function — no filesystem access.

```typescript
function patchContent(
  content: string,
  ops: JsonPatchOp[],
  format: ConfigFormat,
  options?: PatchContentOptions,
): string;
```

| Parameter | Type | Description |
|---|---|---|
| `content` | `string` | The raw configuration content. Must be a valid `format`. |
| `ops` | `JsonPatchOp[]` | Operations to apply in order. An empty array returns `content` unchanged. |
| `format` | `ConfigFormat` | `"json" \| "jsonc" \| "yaml"`. |
| `options.strict` | `boolean` | When `true` (default), a failed operation throws. When `false`, it is skipped with a `console.warn`. |

**Returns:** the patched configuration content (`string`).

**Throws:** `TypeError` if `content` is not a string or `ops` is invalid; an error describing the failing operation when `strict` is `true`.

```typescript
import { patchContent } from "@powerduck/conf-patch/core";

patchContent(
  '{"name": "app"}',
  [{ op: "add", path: ["version"], value: "1.0.0" }],
  "json",
);
// => '{\n  "name": "app",\n  "version": "1.0.0"\n}'
```

---

### `setContentValue`

Sets or creates a single value. Internally calls `patchContent` with one `add` operation. `add` replaces an existing object property or inserts at an array index (RFC 6902).

```typescript
function setContentValue(
  content: string,
  path: readonly (string | number)[],
  value: unknown,
  format: ConfigFormat,
): string;
```

| Parameter | Type | Description |
|---|---|---|
| `content` | `string` | The raw configuration content. |
| `path` | `readonly (string \| number)[]` | Segment path, e.g. `["server", "port"]`. Must be non-empty. |
| `value` | `unknown` | The value to write. |
| `format` | `ConfigFormat` | The configuration format. |

**Returns:** the updated content (`string`).

```typescript
setContentValue("name: app\n", ["server", "port"], 8080, "yaml");
```

---

### `deleteContentValue`

Removes a key or array element. Internally calls `patchContent` with one `remove` operation. The path must exist.

```typescript
function deleteContentValue(
  content: string,
  path: readonly (string | number)[],
  format: ConfigFormat,
): string;
```

```typescript
deleteContentValue(
  '{"name": "app", "legacy": true}',
  ["legacy"],
  "json",
);
```

---

### `PatchContentOptions`

```typescript
interface PatchContentOptions {
  /** When true, failed operations throw. When false, they are skipped with a warning. Default: true */
  strict?: boolean;
}
```

---

## File layer (Node.js / Electron only)

### `readConfigFile`

Reads UTF-8 text from a local file path or `file://` URL.

```typescript
function readConfigFile(filePath: string): Promise<string>;
```

| Parameter | Type | Description |
|---|---|---|
| `filePath` | `string` | Absolute path, relative path, or `file://` URL. Must be non-empty. |

**Returns:** the raw UTF-8 content (`Promise<string>`).

**Throws:** an error wrapping the underlying filesystem failure if the file cannot be read.

---

### `writeConfigFile`

Writes content to a file using an **atomic write** (temp file + rename) and, by default, an exclusive **file lock**. Parent directories are created before locking.

```typescript
function writeConfigFile(
  filePath: string,
  content: string,
  options?: WriteConfigOptions,
): Promise<void>;
```

| Parameter | Type | Description |
|---|---|---|
| `filePath` | `string` | Path to the configuration file. |
| `content` | `string` | The content to write. Must be a string. |
| `options` | `WriteConfigOptions` | See below. |

**Throws:** `TypeError` on bad input; wraps filesystem failures on write.

#### `WriteConfigOptions`

| Option | Type | Default | Description |
|---|---|---|---|
| `lock` | `boolean` | `true` | Enable file locking during the write. |
| `lockTimeoutMs` | `number` | `withFileLock` default (10s) | Max time (ms) to wait to acquire the lock. |
| `lockRetryDelayMs` | `number` | `withFileLock` default (25ms) | Initial retry delay (ms) before exponential backoff. |
| `lockStaleThresholdMs` | `number` | `withFileLock` default | Lock age (ms) after which recovery is allowed. |
| `allowStaleRecovery` | `boolean` | `false` | Whether stale locks may be automatically reclaimed. |

```typescript
import { writeConfigFile } from "@powerduck/conf-patch";

await writeConfigFile("config.json", '{"name": "app"}');
```

---

### `patchConfigFile`

The primary file-layer transaction: read the file inside a lock, apply `patchContent`, and write back atomically **only if the content changed**. Format is auto-detected from the extension when `options.format` is omitted.

```typescript
function patchConfigFile(
  filePath: string,
  ops: JsonPatchOp[],
  options?: PatchConfigOptions,
): Promise<void>;
```

| Parameter | Type | Description |
|---|---|---|
| `filePath` | `string` | Path to the configuration file. Must be non-empty. |
| `ops` | `JsonPatchOp[]` | Operations to apply. An empty array returns without reading or writing. |
| `options` | `PatchConfigOptions` | See below. |

**Throws:** `TypeError` if `filePath` is empty, lock options are invalid, or the format cannot be detected (and no `format` is given); the operation error when `strict` is `true`.

#### `PatchConfigOptions`

| Option | Type | Default | Description |
|---|---|---|---|
| `format` | `ConfigFormat` | auto-detected | Explicit format. Overrides extension detection. |
| `strict` | `boolean` | `true` | Failed operations throw. |
| `lock` | `boolean` | `true` | Enable file locking. |
| `lockTimeoutMs` | `number` | 10s | Non-negative. Max wait for the lock. |
| `lockRetryDelayMs` | `number` | 25ms | Positive. Initial retry delay. |
| `lockStaleThresholdMs` | `number` | derived | Positive. Lock age for stale recovery. |
| `allowStaleRecovery` | `boolean` | `false` | Auto-reclaim stale locks. |

```typescript
await patchConfigFile("config.json", [
  { op: "replace", path: ["server", "host"], value: "0.0.0.0" },
  { op: "add", path: ["server", "ssl"], value: true },
  { op: "remove", path: ["legacySection"] },
]);
```

---

### `setConfigValue`

Adds or replaces a nested value in a file. Delegates to `patchConfigFile` with a single `add` operation.

```typescript
function setConfigValue(
  filePath: string,
  path: readonly (string | number)[],
  value: unknown,
  options?: PatchConfigOptions,
): Promise<void>;
```

```typescript
await setConfigValue("config.yaml", ["database", "port"], 5432);
```

---

### `deleteConfigValue`

Removes an existing nested value from a file. Delegates to `patchConfigFile` with a single `remove` operation.

```typescript
function deleteConfigValue(
  filePath: string,
  path: readonly (string | number)[],
  options?: PatchConfigOptions,
): Promise<void>;
```

```typescript
await deleteConfigValue("config.json", ["features", "betaPreview"]);
```

---

### `withFileLock`

Runs an async callback under a process-local queue **and** an exclusive lock file (`<file>.confedit.lock`). Locks use ownership tokens; a stale lock is recovered only when `allowStaleRecovery` is `true` and the lock exceeds `staleThresholdMs`. PID checks are intentionally avoided (PIDs can be reused).

```typescript
function withFileLock<T>(
  filePath: string,
  callback: () => Promise<T>,
  options?: FileLockOptions,
): Promise<T>;
```

| Parameter | Type | Description |
|---|---|---|
| `filePath` | `string` | The file to lock. |
| `callback` | `() => Promise<T>` | Work to run while holding the lock. |
| `options` | `FileLockOptions` | See below. |

**Returns:** whatever `callback` returns (`Promise<T>`). The lock is always released in a `finally` block, even if the callback throws.

#### `FileLockOptions`

| Option | Type | Default | Description |
|---|---|---|---|
| `timeoutMs` | `number` | `10000` | Max time (ms) to wait for the lock. Must be non-negative. |
| `retryDelayMs` | `number` | `25` | Initial retry delay (ms). Must be positive. Backoff grows by 1.5x, capped at 1000ms. |
| `staleThresholdMs` | `number` | `max(timeoutMs * 2, 60000)` | Lock age (ms) after which recovery is allowed. Must be positive. |
| `allowStaleRecovery` | `boolean` | `false` | Auto-reclaim stale locks. Disabled by default for Electron's single main process to avoid preempting live transactions. |

```typescript
import { withFileLock } from "@powerduck/conf-patch";

await withFileLock("state.json", async () => {
  // ... read, modify, write ...
}, { timeoutMs: 5000 });
```

---

### `releaseAllLocalLocks`

Unlinks every lock file owned by the current process. Designed for Electron's `app.whenReady` quit path (e.g. `app.on("will-quit", ...)`). Failures per lock are swallowed.

```typescript
function releaseAllLocalLocks(): Promise<void>;
```

---

## OpenAPI validation

### `validateOpenAPISpec`

Validates raw OpenAPI/Swagger content (JSON or YAML). Input is treated as **content** by default; file-path interpretation only happens when `inputKind: "file"`. Validation is delegated to `@powerduck/openapi-parser`; this function adds secure input handling.

```typescript
function validateOpenAPISpec(
  input: string,
  options?: ValidateOpenApiOptions,
): Promise<AnyOpenAPIDocument>;
```

| Parameter | Type | Description |
|---|---|---|
| `input` | `string` | Raw spec content, or a file path when `inputKind: "file"`. |
| `options` | `ValidateOpenApiOptions` | See below. |

**Returns:** the validated document on success (`Promise<AnyOpenAPIDocument>`).

**Throws:** [`OpenApiValidationError`](#openapivalidationerror) on any failure.

---

### `validateOpenAPIFile`

Convenience wrapper that calls `validateOpenAPISpec` with `inputKind: "file"` and `baseFilePath` set to the given path. Requires `allowedRootDirectory`.

```typescript
function validateOpenAPIFile(
  filePath: string,
  options?: ValidateOpenApiOptions,
): Promise<AnyOpenAPIDocument>;
```

```typescript
import { validateOpenAPIFile } from "@powerduck/conf-patch";

const doc = await validateOpenAPIFile("openapi.yaml", {
  allowedRootDirectory: "./configs",
});
```

---

### `ValidateOpenApiOptions`

| Option | Type | Default | Description |
|---|---|---|---|
| `inputKind` | `"content" \| "file"` | `"content"` | How to interpret `input`. |
| `baseFilePath` | `string` | — | Base path for reference-resolution context. |
| `allowedRootDirectory` | `string` | — | Root directory for file input. **Required** when `inputKind` is `"file"`. |
| `timeoutMs` | `number` | `15000` | Operation deadline (ms). |
| `maxInputBytes` | `number` | `5242880` (5 MB) | Max raw input size in bytes. |
| `maxDocumentNodes` | `number` | `100000` | Max nodes in the parsed document (DoS guard). |
| `maxDocumentDepth` | `number` | `100` | Max nesting depth (DoS guard). |
| `maxValidationErrors` | `number` | `50` | Max errors included in the error message. |
| `maxErrorMessageLength` | `number` | `1000` | Max characters per validation error. |
| `signal` | `AbortSignal` | — | Optional cancellation signal. |

---

### `OpenApiValidationError`

Structured error thrown on validation failure. Safe to expose across an application boundary.

```typescript
class OpenApiValidationError extends Error {
  readonly code: string;
  readonly cause?: unknown;
  constructor(code: string, message: string, cause?: unknown);
}
```

| Property | Type | Description |
|---|---|---|
| `code` | `string` | Machine-readable error code (see table below). |
| `message` | `string` | Human-readable detail. |
| `cause` | `unknown` | Optional underlying error. |

#### Error codes

| Code | Meaning |
|---|---|
| `INVALID_OPTION` | Invalid option value provided. |
| `INPUT_TOO_LARGE` | Raw content exceeds `maxInputBytes`. |
| `INPUT_FILE_TOO_LARGE` | Input file exceeds the size limit. |
| `FILE_INPUT_FORBIDDEN` | File input used without `allowedRootDirectory`. |
| `PATH_OUTSIDE_ROOT` | File path resolves outside `allowedRootDirectory`. |
| `PARSE_ERROR` | Failed to parse JSON/YAML content. |
| `INVALID_DOCUMENT_SHAPE` | Document is not a JSON object. |
| `UNSUPPORTED_VERSION` | Document does not declare a supported OpenAPI/Swagger version (only major `2` and `3` are accepted). |
| `DOCUMENT_TOO_DEEP` | Nesting depth exceeds `maxDocumentDepth`. |
| `DOCUMENT_TOO_LARGE` | Node count exceeds `maxDocumentNodes`. |
| `SPEC_VALIDATION_FAILED` | The spec failed OpenAPI validation. |
| `OPERATION_TIMEOUT` | Operation exceeded `timeoutMs`. |
| `OPERATION_ABORTED` | Operation was aborted via `signal`. |
| `UNKNOWN_ERROR` | Unexpected error. |

---

## Utilities

### `detectFormat`

Detects a [`ConfigFormat`](#configformat) from a file path or `file://` URL based on its extension.

```typescript
function detectFormat(filePath: string): ConfigFormat;
```

| Extension | Result |
|---|---|
| `.json` | `"json"` |
| `.jsonc` | `"jsonc"` |
| `.yaml`, `.yml` | `"yaml"` |
| anything else | throws an error |

---

### `normalizeFilePath`

Converts a local path or `file:` URL into an absolute native path. Preserves valid whitespace and Unicode file names.

```typescript
function normalizeFilePath(filePath: string): string;
```

A `file:` URL is decoded with `fileURLToPath`; an already-absolute path is returned as-is; a relative path is resolved against `process.cwd()`.

---

## Assertion helpers

These are re-exported for advanced use and by internal modules. They are rarely needed directly by application code.

### `assertNonEmptyString`

```typescript
function assertNonEmptyString(value: unknown, label: string): asserts value is string;
```
Throws `TypeError` unless `value` is a non-empty string.

### `assertPatchPath`

```typescript
function assertPatchPath(
  path: readonly (string | number)[],
  label?: string, // default "path"
): void;
```
Throws unless `path` is a non-empty array whose segments are non-empty strings or safe non-negative integers.

### `assertPatchOperations`

```typescript
function assertPatchOperations(ops: JsonPatchOp[]): void;
```
Validates each operation: `op` must be `"add" | "replace" | "remove"`, `path` must pass `assertPatchPath`, and `add`/`replace` must carry a `value` own-property.

### `assertConfigFormat`

```typescript
function assertConfigFormat(format: ConfigFormat): void;
```
Throws unless `format` is `"json"`, `"jsonc"`, or `"yaml"`.

### `getErrorMessage`

```typescript
function getErrorMessage(error: unknown): string;
```
Returns `error.message` for `Error` instances, otherwise `String(error)`.

### `createError`

```typescript
function createError(message: string, cause: unknown): Error;
```
Creates an `Error` and attaches a `cause` property (using `Object.defineProperty`, with a fallback for older runtimes).

---

## Types

### `ConfigFormat`

```typescript
type ConfigFormat = "json" | "jsonc" | "yaml";
```

### `JsonPathSegment`

```typescript
type JsonPathSegment = string | number;
```

### `JsonPatchOp`

```typescript
interface JsonPatchOp {
  op: "add" | "replace" | "remove";
  path: JsonPathSegment[];
  /** Required for "add" and "replace". */
  value?: unknown;
}
```

:::caution
Only `"add"`, `"replace"`, and `"remove"` are supported. `"move"`, `"copy"`, and `"test"` are intentionally excluded.
:::

### `PatchConfigOptions`

```typescript
interface PatchConfigOptions {
  format?: ConfigFormat;
  strict?: boolean;
  lock?: boolean;
  lockTimeoutMs?: number;
  lockRetryDelayMs?: number;
  lockStaleThresholdMs?: number;
  /** Whether stale locks can be automatically reclaimed. Defaults to false. */
  allowStaleRecovery?: boolean;
}
```

### `FileLockOptions`

```typescript
interface FileLockOptions {
  /** Max time to wait for a lock. Defaults to 10 seconds. */
  timeoutMs?: number;
  /** Initial retry delay. Defaults to 25ms. */
  retryDelayMs?: number;
  /** Explicit lock age after which recovery is allowed. */
  staleThresholdMs?: number;
  /** Whether stale locks can be automatically reclaimed. Defaults to false. */
  allowStaleRecovery?: boolean;
}
```

### `WriteConfigOptions`

```typescript
interface WriteConfigOptions {
  lock?: boolean;
  lockTimeoutMs?: number;
  lockRetryDelayMs?: number;
  lockStaleThresholdMs?: number;
  allowStaleRecovery?: boolean;
}
```

### `PatchContentOptions`

```typescript
interface PatchContentOptions {
  strict?: boolean;
}
```

### `OpenApiInputKind`

```typescript
type OpenApiInputKind = "content" | "file";
```

### `AnyOpenAPIDocument`

A union of supported OpenAPI/Swagger document shapes returned by validation:

```typescript
type AnyOpenAPIDocument =
  | OpenAPIV2.Document      // Swagger 2.0
  | OpenAPIV3.Document      // OpenAPI 3.0.x
  | OpenAPIV3_1.Document     // OpenAPI 3.1.x
  | OpenAPIV3_2Document;    // OpenAPI 3.2 (permissive structural type)
```

`OpenAPIV3_2Document` is a permissible structural type:

```typescript
interface OpenAPIV3_2Document {
  openapi: string;
  info: Record<string, unknown>;
  paths?: Record<string, unknown>;
  [key: string]: unknown;
}
```

---

## Export summary

| Symbol | Main entry | Core subpath | Kind |
|---|:---:|:---:|---|
| `patchContent` | ✓ | ✓ | function |
| `setContentValue` | ✓ | ✓ | function |
| `deleteContentValue` | ✓ | ✓ | function |
| `PatchContentOptions` | ✓ | ✓ | type |
| `assertNonEmptyString` | ✓ | ✓ | function |
| `assertPatchPath` | ✓ | ✓ | function |
| `assertPatchOperations` | ✓ | ✓ | function |
| `assertConfigFormat` | ✓ | ✓ | function |
| `getErrorMessage` | ✓ | ✓ | function |
| `createError` | ✓ | ✓ | function |
| `ConfigFormat` | ✓ | ✓ | type |
| `JsonPatchOp` | ✓ | ✓ | type |
| `JsonPathSegment` | ✓ | ✓ | type |
| `readConfigFile` | ✓ | — | function |
| `writeConfigFile` | ✓ | — | function |
| `WriteConfigOptions` | ✓ | — | type |
| `patchConfigFile` | ✓ | — | function |
| `setConfigValue` | ✓ | — | function |
| `deleteConfigValue` | ✓ | — | function |
| `withFileLock` | ✓ | — | function |
| `releaseAllLocalLocks` | ✓ | — | function |
| `PatchConfigOptions` | ✓ | — | type |
| `FileLockOptions` | ✓ | — | type |
| `detectFormat` | ✓ | — | function |
| `normalizeFilePath` | ✓ | — | function |
| `validateOpenAPISpec` | ✓ | — | function |
| `validateOpenAPIFile` | ✓ | — | function |
| `OpenApiValidationError` | ✓ | — | class |
| `ValidateOpenApiOptions` | ✓ | — | type |
| `OpenApiInputKind` | ✓ | — | type |
| `AnyOpenAPIDocument` | ✓ | — | type |
