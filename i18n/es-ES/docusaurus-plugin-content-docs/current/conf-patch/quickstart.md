---
sidebar_position: 3
title: "Inicio rápido"
description: "Primeros pasos con @powerduck/conf-patch: modifica una cadena JSON/YAML con el núcleo compatible con navegadores y después un archivo en Node.js o Electron."
---

# Inicio rápido

Esta guía recorre las dos capas: primero el **núcleo**, que trabaja con cadenas en cualquier entorno, y después la **capa de archivos**, para archivos reales en Node.js o Electron.

Requisito previo: instala primero el paquete. [Instalación](/docs/es-ES/conf-patch/installation/)

## 1. Núcleo: modificar una cadena en el navegador

Importa desde `@powerduck/conf-patch/core`. No se accede al sistema de archivos: recibes el nuevo contenido como cadena y puedes guardarlo donde quieras, como localStorage, IndexedDB o una constante.

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

### La misma idea con YAML

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
`setContentValue` utiliza `add`, que **añade o reemplaza** una propiedad de objeto. `deleteContentValue` utiliza `remove`. Consulta [`patchContent`](/docs/es-ES/conf-patch/api-reference/#patchcontent) para ver todas las operaciones.
:::

## 2. Capa de archivos: modificar un archivo en disco

Importa desde la entrada principal. Estas funciones son `async`, leen y escriben archivos reales y usan escrituras atómicas con bloqueo.

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

El formato se detecta a partir de la extensión (`.json`, `.jsonc`, `.yaml`, `.yml`). Indica `format` explícitamente si la extensión es ambigua.

## 3. Gestión de errores

Ambas capas lanzan errores ante entradas no válidas. En el modo `strict`, activo por defecto, una operación de parche fallida también lanza un error.

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

Usa `strict: false` para omitir las operaciones fallidas en lugar de lanzar un error:

```typescript
patchContent(
  '{"name": "app"}',
  [{ op: "remove", path: ["missing"] }],
  "json",
  { strict: false }, // logs a warning, returns the original content
);
```

## 4. Ejemplo de IPC en Electron

Un patrón habitual consiste en ejecutar la capa de archivos en el proceso principal de Electron y exponerla mediante IPC:

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

## Siguientes pasos

- [Referencia de API](/docs/es-ES/conf-patch/api-reference/) — Todas las funciones, los tipos y las opciones.
- [Ejemplos](/docs/es-ES/conf-patch/examples/) — Parches JSON, YAML, JSONC con comentarios, validación OpenAPI y bloqueo de archivos.
