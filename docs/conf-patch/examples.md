---
sidebar_position: 5
title: "Examples"
description: "Runnable examples for @powerduck/conf-patch: JSON patching, YAML value setting, JSONC with comments preserved, OpenAPI validation, and safe concurrent file locking."
keywords: ["conf-patch examples", "JSONC comments", "OpenAPI validation", "file lock", "YAML patch"]
---

# Examples

Practical, runnable recipes built from the public API. Import paths use whichever layer you need — the browser-safe `@powerduck/conf-patch/core` for string work, or the main `@powerduck/conf-patch` for files.

---

## 1. JSON patch operations (core layer)

Apply several RFC 6902 operations to a JSON string. `add` inserts at arrays or adds/replaces object keys; `replace` and `remove` require the target to exist.

```typescript
import { patchContent } from "@powerduck/conf-patch/core";

const source = JSON.stringify(
  {
    name: "my-app",
    version: "1.0.0",
    tags: ["web"],
  },
  null,
  2,
);

const patched = patchContent(
  source,
  [
    { op: "add", path: ["description"], value: "Demos patchContent" },
    { op: "replace", path: ["version"], value: "1.1.0" },
    { op: "add", path: ["tags", 1], value: "api" }, // inserts, does not overwrite
  ],
  "json",
);

console.log(patched);
```

Result:

```json
{
  "name": "my-app",
  "version": "1.1.0",
  "tags": ["web", "api"],
  "description": "Demos patchContent"
}
```

Set `strict: false` to skip failing operations instead of throwing:

```typescript
patchContent(
  source,
  [{ op: "remove", path: ["does", "not", "exist"] }],
  "json",
  { strict: false }, // logs a warning, returns source unchanged
);
```

---

## 2. Set a nested YAML value (file layer)

Set `database.port` in a YAML file. The parent path (`database`) must already exist; the write is atomic and lock-guarded.

```typescript
import { setConfigValue, readConfigFile } from "@powerduck/conf-patch";

await setConfigValue("config.yaml", ["database", "port"], 5432);
await setConfigValue("config.yaml", ["database", "host"], "localhost");

console.log(await readConfigFile("config.yaml"));
```

To create a nested object that does not yet exist, create the parent first:

```typescript
// "features" does not exist yet — create it, then add the child.
await setConfigValue("config.yaml", ["features"], {});
await setConfigValue("config.yaml", ["features", "darkMode"], true);
```

### Array operations in YAML

Use numeric segments for sequence indexes. `add` **inserts**, `replace` replaces in place, `remove` deletes:

```typescript
await patchConfigFile("config.yaml", [
  { op: "add", path: ["plugins", 1], value: { name: "metrics", enable: true } },
  { op: "replace", path: ["plugins", 0, "enable"], value: false },
  { op: "remove", path: ["plugins", 0] },
]);
```

---

## 3. JSONC with comments (comments preserved)

JSONC edits are range-based, so comments and trailing commas around the touched lines are preserved.

```typescript
import { patchContent, deleteContentValue } from "@powerduck/conf-patch/core";

const jsonc = `{
  // Application name
  "name": "my-app",
  // Legacy feature flag
  "legacyFeature": true,
  "version": "1.0.0",
}`;

// Replace a value — the surrounding comments stay put.
const updated = patchContent(
  jsonc,
  [{ op: "replace", path: ["version"], value: "1.2.0" }],
  "jsonc",
);

// Delete a key — its own line is removed, other comments remain.
const cleaned = deleteContentValue(updated, ["legacyFeature"], "jsonc");

console.log(cleaned);
```

Result (note the preserved comments):

```text
{
  // Application name
  "name": "my-app",
  "version": "1.2.0",
}
```

---

## 4. Validate an OpenAPI document

Validate raw spec content, then validate from a file. File mode requires `allowedRootDirectory` for path sandboxing.

```typescript
import {
  validateOpenAPISpec,
  validateOpenAPIFile,
  OpenApiValidationError,
} from "@powerduck/conf-patch";

// (a) Validate raw content (JSON or YAML)
const specContent = `openapi: 3.0.0
info:
  title: Demo API
  version: 1.0.0
paths: {}`;

try {
  const doc = await validateOpenAPISpec(specContent);
  console.log("Valid. openapi =", doc.openapi);
} catch (error) {
  if (error instanceof OpenApiValidationError) {
    console.error(`Validation failed [${error.code}]:`, error.message);
  } else {
    throw error;
  }
}

// (b) Validate from a file (requires allowedRootDirectory)
const fileDoc = await validateOpenAPIFile("./openapi.yaml", {
  allowedRootDirectory: "./configs",
  // Optional hardening:
  // timeoutMs: 10000,
  // maxInputBytes: 2 * 1024 * 1024,
});
```

Cancellation via `AbortSignal`:

```typescript
const controller = new AbortController();
setTimeout(() => controller.abort(), 5000);

await validateOpenAPISpec(content, { signal: controller.signal }).catch(
  (error) => {
    // Throws OpenApiValidationError with code "OPERATION_ABORTED" on abort.
    console.error(error.code);
  },
);
```

---

## 5. Safe concurrent access with file locking

When multiple processes (or many in-flight operations in one process) touch the same file, `patchConfigFile` already serializes access. Use `withFileLock` directly when you need to group several file operations into one critical section.

```typescript
import { readConfigFile, writeConfigFile, withFileLock } from "@powerduck/conf-patch";

async function bumpCounter(file: string): Promise<number> {
  return withFileLock(
    file,
    async () => {
      // Read-inside-lock prevents a lost read between workers.
      const raw = await readConfigFile(file);
      const data = JSON.parse(raw);
      data.count = (data.count ?? 0) + 1;
      await writeConfigFile(file, JSON.stringify(data, null, 2), { lock: false });
      return data.count;
    },
    {
      timeoutMs: 5000, // give up after 5s
      retryDelayMs: 25, // initial delay; grows by 1.5x up to 1s
      allowStaleRecovery: false,
    },
  );
}
```

Notes:

- `withFileLock` queues operations to the **same file** within one process and uses an exclusive `.confedit.lock` file across processes.
- Releasing a lock verifies an ownership token before unlinking, so a new lock taken over a stale one is never deleted by an old release.
- On shutdown (e.g. Electron `will-quit`), release outstanding locks:

```typescript
import { releaseAllLocalLocks } from "@powerduck/conf-patch";

app.on("will-quit", async () => {
  await releaseAllLocalLocks();
});
```

---

## 6. Put it together: edit an OpenAPI spec on disk

The demo pattern from the library itself — read a spec, set values, add a response, then validate.

```typescript
import {
  readConfigFile,
  setConfigValue,
  patchConfigFile,
  validateOpenAPIFile,
} from "@powerduck/conf-patch";

const specPath = "./openapi.yaml";

// Read the raw text.
await readConfigFile(specPath);

// Set info.version and the first server URL.
await setConfigValue(specPath, ["info", "version"], "1.1.0");
await setConfigValue(specPath, ["servers", 0, "url"], "https://api.prod.example.com/v1");

// Add a 404 response to GET /pets.
await patchConfigFile(specPath, [
  {
    op: "add",
    path: ["paths", "/pets", "get", "responses", "404"],
    value: { description: "Resource not found" },
  },
]);

// Confirm the edited document still validates.
await validateOpenAPIFile(specPath, { allowedRootDirectory: "." });
```

---

## Next steps

- [API reference](./api-reference) — full signatures and every option default.
- [Quickstart](./quickstart) — your first end-to-end run.
