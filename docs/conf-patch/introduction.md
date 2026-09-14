---
sidebar_position: 1
title: "Introduction"
description: "Overview of @powerduck/conf-patch v0.3.4 — a two-layer RFC 6902 JSON Patch configuration editor for JSON, JSONC, and YAML with comment preservation, atomic writes, file locking, and OpenAPI validation."
keywords: ["conf-patch", "configuration editor", "RFC 6902", "JSON Patch", "JSONC", "YAML", "OpenAPI validation"]
---

# @powerduck/conf-patch

**@powerduck/conf-patch** is a production-grade configuration editor built around a clean **two-layer architecture**. It patches JSON, JSONC, and YAML strings using [RFC 6902 JSON Patch](https://datatracker.ietf.org/doc/html/rfc6902) semantics while preserving comments and formatting, and adds filesystem safety (atomic writes + cross-process locking) for Node.js and Electron.

- **Version:** `0.3.2`
- **License:** MIT
- **Node.js requirement:** `>= 18.0.0`
- **Source:** [github.com/powerducklab/conf-patch](https://github.com/powerducklab/conf-patch)

---

## Why conf-patch?

Editing configuration files programmatically usually forces a trade-off: either you re-serialize the whole document (which destroys comments, whitespace, and formatting), or you hand-roll fragile text manipulation. conf-patch solves both problems:

- **Incremental, comment-preserving edits** for JSON/JSONC via `jsonc-parser` and AST-based mutation for YAML via `yaml`. No full re-serialization.
- **Atomic writes** (temp file + rename) so a crash never leaves a half-written file.
- **Cross-process file locking** with ownership tokens, exponential backoff, and stale-lock recovery.
- **One API that works everywhere** — the core layer runs in browsers, Edge Functions, and IndexedDB storage.

---

## Two-layer architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     Application code                          │
├──────────────────────────────────────────────────────────────┤
│  File layer (Node.js / Electron only)                         │
│  ┌───────────────┐ ┌────────────────┐ ┌──────────────────┐  │
│  │ readConfigFile │ │ writeConfigFile│ │ patchConfigFile   │  │
│  │ setConfigValue │ │ deleteConfig…  │ │ withFileLock     │  │
│  └──────┬────────┘ └───────┬────────┘ └────────┬─────────┘  │
│         │                  │                   │            │
│  ┌──────▼──────────────────▼───────────────────▼───────────┐ │
│  │           Core layer (browser-safe, zero Node deps)      │ │
│  │  patchContent   setContentValue   deleteContentValue     │ │
│  └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### Core layer — `@powerduck/conf-patch/core` (browser-safe)

Pure functions that operate on **strings**. No `node:fs`, no `node:path`, no Node.js-specific APIs. This subpath export is safe to bundle into browser, Edge Function, or service-worker code.

| Function | Purpose |
|---|---|
| [`patchContent`](./api-reference#patchcontent) | Apply an array of RFC 6902 operations to a config string |
| [`setContentValue`](./api-reference#setcontentvalue) | Set or create a nested value (uses `add`) |
| [`deleteContentValue`](./api-reference#deletecontentvalue) | Remove a key or array element (uses `remove`) |

### File layer — `@powerduck/conf-patch` (Node.js / Electron)

Async functions that read and write real files, wrapping the core layer with atomic writes and locking.

| Function | Purpose |
|---|---|
| [`readConfigFile`](./api-reference#readconfigfile) | Read UTF-8 text from a file path or `file://` URL |
| [`writeConfigFile`](./api-reference#writeconfigfile) | Write content atomically, optionally under a lock |
| [`patchConfigFile`](./api-reference#patchconfigfile) | Read-patch-write transaction inside a file lock |
| [`setConfigValue`](./api-reference#setconfigvalue) | Set a nested value in a file |
| [`deleteConfigValue`](./api-reference#deleteconfigvalue) | Delete a nested value from a file |
| [`withFileLock`](./api-reference#withfilelock) | Run arbitrary work under an exclusive lock |
| [`releaseAllLocalLocks`](./api-reference#releasealllocallocks) | Release all locks owned by the current process |

---

## Supported formats

| Format | Extension | Behavior |
|---|---|---|
| **JSON** | `.json` | Standard JSON. Incremental edits via `jsonc-parser`. |
| **JSONC** | `.jsonc` | JSON with comments and trailing commas. Comments are preserved. |
| **YAML** | `.yaml`, `.yml` | YAML 1.2. AST mutation preserves comments, anchors, and indentation. |

[`detectFormat`](./api-reference#detectformat) maps file extensions to a [`ConfigFormat`](./api-reference#configformat). Any other extension throws unless you pass `format` explicitly.

---

## RFC 6902 operations

conf-patch implements a focused subset of RFC 6902. The supported operations are exactly:

| `op` | Behavior |
|---|---|
| `"add"` | Inserts at an array index, or adds/replaces an object property |
| `"replace"` | Replaces an existing value (path must exist) |
| `"remove"` | Removes an existing key or array element (path must exist) |

:::caution
`"move"`, `"copy"`, and `"test"` are **not** supported. The [`JsonPatchOp`](./api-reference#jsonpatchop) type restricts `op` to `"add" | "replace" | "remove"`.
:::

Behavior notes:

- `add` at an array index **inserts** (RFC 6902). To replace an existing element, use `replace`.
- `add` requires the parent path to already exist. Create parents before children.
- `replace` and `remove` require the target path to exist.
- With `strict: true` (the default), a failed operation throws. With `strict: false`, it is skipped and a warning is logged.

---

## Comment and formatting preservation

- **JSON/JSONC:** edits are computed as text ranges against the parsed syntax tree, so surrounding comments, trailing commas, and indentation are left untouched.
- **YAML:** the `yaml` AST is mutated in place and re-serialized, preserving comments, anchors, aliases, and indentation.

---

## OpenAPI validation

conf-patch can validate OpenAPI/Swagger documents as a secure wrapper around `@powerduck/openapi-parser`:

- [`validateOpenAPISpec`](./api-reference#validateopenapispec) validates raw content (JSON or YAML).
- [`validateOpenAPIFile`](./api-reference#validateopenapifile) validates from a file path.
- Input handling enforces size limits, path sandboxing (`allowedRootDirectory`), structural complexity guards, deadlines, and `AbortSignal` cancellation.
- Failures throw [`OpenApiValidationError`](./api-reference#openapivalidationerror) with a machine-readable `code`.

---

## Next steps

- [Installation](./installation) — add conf-patch to your project and learn the two entry points.
- [Quickstart](./quickstart) — patch a string in the browser and a file on disk.
- [API reference](./api-reference) — every export, type, and option.
- [Examples](./examples) — runnable recipes for JSON, YAML, JSONC, OpenAPI validation, and locking.
