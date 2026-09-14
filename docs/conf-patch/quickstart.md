---
sidebar_position: 3
title: "Quickstart"
description: "Get up and running with @powerduck/conf-patch in minutes: patch a JSON/YAML string in the browser-safe core layer, then set a value in a file from Node.js or Electron."
keywords: ["conf-patch quickstart", "patchContent", "setConfigValue", "browser", "electron"]
---

# Quickstart

This quickstart walks through the two layers. Start with the **core layer** (pure strings, works anywhere), then move to the **file layer** (real files, Node.js/Electron).

Prerequisite: [install the package](./installation) first.

---

## 1. Core layer — patch a string in the browser

Import from `@powerduck/conf-patch/core`. No filesystem is touched; you get the new content back as a string and store it wherever you like (localStorage, IndexedDB, a string constant).

```typescript
import {
  patchContent,
  setContentValue,
  deleteContentValue,
} from "@powerduck/conf-patch/core";

// --- JSON: apply multiple RFC 6902 operations ---
const json = JSON.stringify({ name: "my-app", version: "1.0.0" }, null, 2);

const updatedJson = patchContent(
  json,
  [
    { op: "add", path: ["description"], value: "My awesome application" },
    { op: "replace", path: ["version"], value: "1.1.0" },
  ],
  "json",
);

console.log(updatedJson);
// {
//   "name": "my-app",
//   "version": "1.1.0",
//   "description": "My awesome application"
// }

// Store it however you like — no fs required.
localStorage.setItem("config", updatedJson);
```

### Same idea with YAML

```typescript
import { setContentValue, deleteContentValue } from "@powerduck/conf-patch/core";

// Set a nested value in YAML (the "server" parent already exists).
const yaml = "name: my-app\nserver:\n  host: localhost\n";

const updatedYaml = setContentValue(yaml, ["server", "port"], 8080, "yaml");
console.log(updatedYaml);
// name: my-app
// server:
//   host: localhost
//   port: 8080

// Delete a value.
const cleaned = deleteContentValue(updatedYaml, ["server", "host"], "yaml");
```

:::note
`setContentValue` uses the `add` operation, which **adds or replaces** an existing object property. `deleteContentValue` uses `remove`. See [`patchContent`](./api-reference#patchcontent) for the full operation set.
:::

---

## 2. File layer — patch a file on disk

Import from the main entry. These functions are `async`, read/write real files, and use atomic writes with locking.

```typescript
import { setConfigValue, readConfigFile, patchConfigFile } from "@powerduck/conf-patch";

// Set a nested value in a YAML file (atomic, lock-guarded).
await setConfigValue("config.yaml", ["database", "port"], 5432);

// Read the file back.
const content = await readConfigFile("config.yaml");
console.log(content);

// Apply several operations to a JSON file in one locked transaction.
await patchConfigFile("config.json", [
  { op: "replace", path: ["server", "host"], value: "0.0.0.0" },
  { op: "add", path: ["server", "ssl"], value: true },
  { op: "remove", path: ["legacySection"] },
]);
```

The format is auto-detected from the file extension (`.json`, `.jsonc`, `.yaml`, `.yml`). Pass `format` explicitly when the extension is ambiguous.

---

## 3. Error handling

Both layers throw on invalid input. In `strict` mode (the default) a failed patch operation also throws.

```typescript
import { patchContent } from "@powerduck/conf-patch/core";

try {
  // "remove" requires the path to exist.
  patchContent('{"name": "app"}', [{ op: "remove", path: ["missing"] }], "json");
} catch (error) {
  // Error: [confedit] Cannot remove a value that does not exist at path: ["missing"]
  console.error(error instanceof Error ? error.message : error);
}
```

Set `strict: false` to skip failing operations instead of throwing:

```typescript
patchContent(
  '{"name": "app"}',
  [{ op: "remove", path: ["missing"] }],
  "json",
  { strict: false }, // logs a warning, returns the original content
);
```

---

## 4. Electron IPC example

A common pattern is to run the file layer in the Electron main process and expose it over IPC:

```javascript
// Electron main process (CommonJS)
const { setConfigValue, readConfigFile } = require("@powerduck/conf-patch");

ipcMain.handle("config:set", async (_event, { filePath, path, value }) => {
  try {
    await setConfigValue(filePath, path, value);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle("config:read", async (_event, { filePath }) => {
  try {
    const data = await readConfigFile(filePath);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
```

---

## Next steps

- [API reference](./api-reference) — every function, type, and option.
- [Examples](./examples) — JSON patching, YAML, JSONC with comments, OpenAPI validation, and file locking.
