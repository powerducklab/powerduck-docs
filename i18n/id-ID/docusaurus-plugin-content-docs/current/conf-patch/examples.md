---
sidebar_position: 5
title: "Contoh"
description: "Contoh praktis yang dapat dijalankan menggunakan API publik. Pilih lapisan sesuai kebutuhan: @powerduck/conf-patch/core yang aman untuk browser bagi string, atau @powerduck/conf-patch bagi berkas."
---

# Contoh

Contoh praktis yang dapat dijalankan menggunakan API publik. Pilih lapisan sesuai kebutuhan: `@powerduck/conf-patch/core` yang aman untuk browser bagi string, atau `@powerduck/conf-patch` bagi berkas.

---

## 1. Operasi JSON Patch (lapisan inti)

Terapkan beberapa operasi RFC 6902 pada string JSON. `add` menyisipkan elemen array atau menambah/mengganti properti objek; `replace` dan `remove` mengharuskan target sudah ada.

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

Hasil:

```json
{
  "name": "my-app",
  "version": "1.1.0",
  "tags": ["web", "api"],
  "description": "Demos patchContent"
}
```

Tetapkan `strict: false` untuk melewati operasi yang gagal alih-alih melempar exception:

```typescript
patchContent(
  source,
  [{ op: "remove", path: ["does", "not", "exist"] }],
  "json",
  { strict: false }, // logs a warning, returns source unchanged
);
```

---

## 2. Menetapkan nilai YAML bertingkat (lapisan berkas)

Tetapkan `database.port` dalam berkas YAML. Jalur induk (`database`) harus sudah ada; penulisan bersifat atomik dan dilindungi kunci.

```typescript
import { setConfigValue, readConfigFile } from "@powerduck/conf-patch";

await setConfigValue("config.yaml", ["database", "port"], 5432);
await setConfigValue("config.yaml", ["database", "host"], "localhost");

console.log(await readConfigFile("config.yaml"));
```

Untuk membuat objek bertingkat yang belum ada, buat induknya terlebih dahulu:

```typescript
// "features" does not exist yet — create it, then add the child.
await setConfigValue("config.yaml", ["features"], {});
await setConfigValue("config.yaml", ["features", "darkMode"], true);
```

### Operasi array dalam YAML

Gunakan segmen angka untuk indeks urutan. `add` **menyisipkan**, `replace` mengganti di posisi yang sama, dan `remove` menghapus:

```typescript
import { patchConfigFile } from "@powerduck/conf-patch";

await patchConfigFile("config.yaml", [
  { op: "add", path: ["plugins", 1], value: { name: "metrics", enable: true } },
  { op: "replace", path: ["plugins", 0, "enable"], value: false },
  { op: "remove", path: ["plugins", 0] },
]);
```

---

## 3. JSONC dengan komentar tetap utuh

Pengeditan JSONC berbasis rentang teks, sehingga komentar dan koma terakhir di sekitar baris yang diubah tetap terjaga.

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

Hasil dengan komentar yang dipertahankan:

```text
{
  // Application name
  "name": "my-app",
  "version": "1.2.0",
}
```

---

## 4. Memvalidasi dokumen OpenAPI

Validasi isi spesifikasi mentah, lalu validasi berkas. Mode berkas memerlukan `allowedRootDirectory` untuk membatasi jalur yang diizinkan.

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
const fileDoc = await validateOpenAPIFile("./configs/openapi.yaml", {
  allowedRootDirectory: "./configs",
  // Optional hardening:
  // timeoutMs: 10000,
  // maxInputBytes: 2 * 1024 * 1024,
});
```

Pembatalan melalui `AbortSignal`:

```typescript
const controller = new AbortController();
setTimeout(() => controller.abort(), 5000);

await validateOpenAPISpec(specContent, { signal: controller.signal }).catch(
  (error) => {
    // Throws OpenApiValidationError with code "OPERATION_ABORTED" on abort.
    console.error(error.code);
  },
);
```

---

## 5. Akses bersamaan yang aman dengan penguncian berkas

Jika beberapa proses, atau beberapa operasi bersamaan dalam satu proses, mengakses berkas yang sama, `patchConfigFile` sudah menserialisasi akses. Gunakan `withFileLock` secara langsung untuk mengelompokkan beberapa operasi berkas dalam satu bagian kritis.

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

Catatan:

- `withFileLock` mengantrekan operasi pada **berkas yang sama** dalam satu proses dan menggunakan berkas `.confedit.lock` eksklusif antarproses.
- Pelepasan kunci memeriksa token kepemilikan sebelum menghapusnya, sehingga pelepasan lama tidak menghapus kunci baru yang menggantikan kunci kedaluwarsa.
- Saat penghentian, misalnya Electron `will-quit`, lepaskan kunci yang masih aktif:

```typescript
import { app } from "electron";
import { releaseAllLocalLocks } from "@powerduck/conf-patch";

let locksReleased = false;
app.on("will-quit", (event) => {
  if (locksReleased) return;
  event.preventDefault();
  void releaseAllLocalLocks()
    .catch((error) => console.error("Lock cleanup failed", error))
    .finally(() => {
      locksReleased = true;
      app.quit();
    });
});
```

---

## 6. Contoh lengkap: mengedit spesifikasi OpenAPI di disk

Pola demonstrasi dari pustaka: baca spesifikasi, tetapkan nilai, tambahkan respons, lalu validasi.

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

## Langkah berikutnya

- [Referensi API](../api-reference/) — tanda tangan lengkap dan nilai bawaan setiap opsi.
- [Panduan cepat](../quickstart/) — proses pertama dari awal hingga akhir.
