---
sidebar_position: 3
title: "Mulai cepat"
description: "Mulai dengan @powerduck/conf-patch: ubah string JSON/YAML melalui inti yang kompatibel dengan browser, lalu edit file di Node.js atau Electron."
---

# Mulai cepat

Panduan ini membahas dua lapisan: **inti** yang hanya mengolah string dan bekerja di mana saja, lalu **lapisan file** untuk file nyata di Node.js atau Electron.

Prasyarat: instal paket terlebih dahulu. [Instalasi](/docs/id-ID/conf-patch/installation/)

## 1. Inti — mengubah string di browser

Impor dari `@powerduck/conf-patch/core`. Sistem file tidak diakses; konten baru dikembalikan sebagai string yang dapat disimpan di localStorage, IndexedDB, konstanta string, atau tempat lain.

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

### Pendekatan yang sama untuk YAML

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
`setContentValue` memakai `add`, yang **menambahkan atau mengganti** properti objek. `deleteContentValue` memakai `remove`. Lihat [`patchContent`](/docs/id-ID/conf-patch/api-reference/#patchcontent) untuk seluruh operasi.
:::

## 2. Lapisan file — mengubah file di disk

Impor dari entri utama. Fungsi-fungsi ini bersifat `async`, membaca dan menulis file nyata, serta memakai penulisan atomik dengan penguncian.

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

Format dideteksi otomatis dari ekstensi (`.json`, `.jsonc`, `.yaml`, `.yml`). Berikan `format` secara eksplisit jika ekstensi ambigu.

## 3. Penanganan kesalahan

Kedua lapisan melempar kesalahan untuk input tidak valid. Dalam mode `strict`, yang aktif secara bawaan, operasi patch yang gagal juga melempar kesalahan.

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

Tetapkan `strict: false` untuk melewati operasi yang gagal alih-alih melempar kesalahan:

```typescript
patchContent(
  '{"name": "app"}',
  [{ op: "remove", path: ["missing"] }],
  "json",
  { strict: false }, // logs a warning, returns the original content
);
```

## 4. Contoh Electron IPC

Pola yang umum adalah menjalankan lapisan file dalam proses utama Electron dan menyediakannya melalui IPC:

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

## Langkah berikutnya

- [Referensi API](/docs/id-ID/conf-patch/api-reference/) — Semua fungsi, tipe, dan opsi.
- [Contoh](/docs/id-ID/conf-patch/examples/) — Patch JSON, YAML, JSONC dengan komentar, validasi OpenAPI, dan penguncian file.
