---
sidebar_position: 3
title: "Guida rapida"
description: "Primi passi con @powerduck/conf-patch: modifica stringhe JSON/YAML nel nucleo compatibile con il browser, poi file in Node.js o Electron."
---

# Guida rapida

Questa guida presenta i due livelli: prima il **nucleo**, che lavora su stringhe in qualsiasi ambiente, poi il **livello file**, per file reali in Node.js o Electron.

Prerequisito: installa prima il pacchetto. [Installazione](/docs/it-IT/conf-patch/installation/)

## 1. Nucleo — modificare una stringa nel browser

Importa da `@powerduck/conf-patch/core`. Il file system non viene utilizzato: ricevi il nuovo contenuto come stringa e puoi salvarlo dove preferisci, ad esempio in localStorage, IndexedDB o una costante.

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

### Lo stesso principio con YAML

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
`setContentValue` usa `add`, che **aggiunge o sostituisce** una proprietà dell'oggetto. `deleteContentValue` usa `remove`. Consulta [`patchContent`](/docs/it-IT/conf-patch/api-reference/#patchcontent) per tutte le operazioni.
:::

## 2. Livello file — modificare un file su disco

Importa dall'entry point principale. Queste funzioni sono `async`, leggono e scrivono file reali e usano scritture atomiche con blocco.

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

Il formato viene rilevato dall'estensione (`.json`, `.jsonc`, `.yaml`, `.yml`). Specifica esplicitamente `format` se l'estensione è ambigua.

## 3. Gestione degli errori

Entrambi i livelli generano errori per input non validi. In modalità `strict`, attiva per impostazione predefinita, anche un'operazione di patch non riuscita genera un errore.

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

Imposta `strict: false` per saltare le operazioni non riuscite invece di generare un errore:

```typescript
patchContent(
  '{"name": "app"}',
  [{ op: "remove", path: ["missing"] }],
  "json",
  { strict: false }, // logs a warning, returns the original content
);
```

## 4. Esempio IPC con Electron

Un approccio comune consiste nell'eseguire il livello file nel processo principale di Electron e renderlo disponibile tramite IPC:

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

## Passaggi successivi

- [Riferimento API](/docs/it-IT/conf-patch/api-reference/) — Tutte le funzioni, i tipi e le opzioni.
- [Esempi](/docs/it-IT/conf-patch/examples/) — Patch JSON, YAML, JSONC con commenti, validazione OpenAPI e blocco dei file.
