---
sidebar_position: 3
title: "Démarrage rapide"
description: "Premiers pas avec @powerduck/conf-patch : modifier une chaîne JSON/YAML dans le noyau compatible navigateur, puis un fichier sous Node.js ou Electron."
---

# Démarrage rapide

Ce guide parcourt les deux couches : d’abord le **noyau**, qui traite des chaînes dans tout environnement, puis la **couche fichiers**, qui manipule de vrais fichiers sous Node.js ou Electron.

Prérequis : installez d’abord le paquet. [Installation](/docs/fr-FR/conf-patch/installation/)

## 1. Noyau — modifier une chaîne dans le navigateur

Importez depuis `@powerduck/conf-patch/core`. Le système de fichiers n’est pas sollicité : le nouveau contenu est renvoyé sous forme de chaîne, à stocker où vous voulez, par exemple dans localStorage, IndexedDB ou une constante.

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

### Même principe avec YAML

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
`setContentValue` utilise `add`, qui **ajoute ou remplace** une propriété d’objet. `deleteContentValue` utilise `remove`. Consultez [`patchContent`](/docs/fr-FR/conf-patch/api-reference/#patchcontent) pour toutes les opérations.
:::

## 2. Couche fichiers — modifier un fichier sur disque

Importez depuis le point d’entrée principal. Ces fonctions sont `async`, lisent et écrivent de vrais fichiers et effectuent des écritures atomiques avec verrouillage.

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

Le format est détecté à partir de l’extension (`.json`, `.jsonc`, `.yaml`, `.yml`). Passez explicitement `format` si l’extension est ambiguë.

## 3. Gestion des erreurs

Les deux couches lèvent une erreur pour une entrée invalide. En mode `strict`, activé par défaut, une opération de patch qui échoue lève également une erreur.

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

Définissez `strict: false` pour ignorer les opérations qui échouent au lieu de lever une erreur :

```typescript
patchContent(
  '{"name": "app"}',
  [{ op: "remove", path: ["missing"] }],
  "json",
  { strict: false }, // logs a warning, returns the original content
);
```

## 4. Exemple IPC avec Electron

Une approche courante consiste à exécuter la couche fichiers dans le processus principal d’Electron et à l’exposer via IPC :

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

## Pour aller plus loin

- [Référence de l’API](/docs/fr-FR/conf-patch/api-reference/) — Toutes les fonctions, tous les types et toutes les options.
- [Exemples](/docs/fr-FR/conf-patch/examples/) — Patches JSON, YAML, JSONC avec commentaires, validation OpenAPI et verrouillage de fichiers.
