---
sidebar_position: 3
title: "Schnellstart"
description: "Erste Schritte mit @powerduck/conf-patch: JSON-/YAML-Zeichenfolgen im browserfähigen Kern ändern und Dateien unter Node.js oder Electron bearbeiten."
---

# Schnellstart

Diese Anleitung führt durch beide Schichten: zuerst den **Kern** für reine Zeichenfolgen in beliebigen Umgebungen, danach die **Dateischicht** für echte Dateien unter Node.js oder Electron.

Voraussetzung: Installieren Sie zunächst das Paket. [Installation](/docs/de-DE/conf-patch/installation/)

## 1. Kern — eine Zeichenfolge im Browser ändern

Importieren Sie aus `@powerduck/conf-patch/core`. Das Dateisystem wird nicht angesprochen. Sie erhalten den neuen Inhalt als Zeichenfolge und können ihn beliebig speichern, etwa in localStorage, IndexedDB oder einer Zeichenfolgenkonstante.

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

### Dasselbe mit YAML

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
`setContentValue` verwendet `add`: Eine Objekteigenschaft wird **hinzugefügt oder ersetzt**. `deleteContentValue` verwendet `remove`. Alle Operationen finden Sie unter [`patchContent`](/docs/de-DE/conf-patch/api-reference/#patchcontent).
:::

## 2. Dateischicht — eine Datei auf dem Datenträger ändern

Importieren Sie aus dem Haupteinstiegspunkt. Diese Funktionen sind `async`, lesen und schreiben echte Dateien und verwenden atomare Schreibvorgänge mit Sperren.

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

Das Format wird anhand der Dateiendung erkannt (`.json`, `.jsonc`, `.yaml`, `.yml`). Ist die Endung nicht eindeutig, geben Sie `format` ausdrücklich an.

## 3. Fehlerbehandlung

Beide Schichten lösen bei ungültigen Eingaben Fehler aus. Im standardmäßig aktiven Modus `strict` löst auch eine fehlgeschlagene Patch-Operation einen Fehler aus.

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

Mit `strict: false` werden fehlgeschlagene Operationen übersprungen, statt einen Fehler auszulösen:

```typescript
patchContent(
  '{"name": "app"}',
  [{ op: "remove", path: ["missing"] }],
  "json",
  { strict: false }, // logs a warning, returns the original content
);
```

## 4. Electron-IPC-Beispiel

Üblicherweise läuft die Dateischicht im Electron-Hauptprozess und wird über IPC bereitgestellt:

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

## Nächste Schritte

- [API-Referenz](/docs/de-DE/conf-patch/api-reference/) — Alle Funktionen, Typen und Optionen.
- [Beispiele](/docs/de-DE/conf-patch/examples/) — JSON-Patches, YAML, JSONC mit Kommentaren, OpenAPI-Validierung und Dateisperren.
