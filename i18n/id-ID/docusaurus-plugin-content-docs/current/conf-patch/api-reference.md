---
sidebar_position: 4
title: "Referensi API"
description: "Referensi lengkap @powerduck/conf-patch, mencakup tanda tangan fungsi dan nilai bawaan setiap simbol yang diekspor."
---

# Referensi API

Referensi lengkap `@powerduck/conf-patch`, mencakup tanda tangan fungsi dan nilai bawaan setiap simbol yang diekspor.

Ada dua titik masuk:

- **`@powerduck/conf-patch`** — semua fitur di bawah: lapisan inti, berkas, validasi OpenAPI, dan utilitas.
- **`@powerduck/conf-patch/core`** — hanya bagian yang kompatibel dengan browser: `patchContent`, `setContentValue`, `deleteContentValue`, `PatchContentOptions`, fungsi asersi, serta tipe `ConfigFormat`, `JsonPatchOp`, `JsonPathSegment`.

---

## Lapisan inti (kompatibel dengan browser)

### `patchContent`

Menerapkan array operasi patch RFC 6902 pada string konfigurasi. Fungsi murni tanpa akses sistem berkas.

```typescript
function patchContent(
  content: string,
  ops: JsonPatchOp[],
  format: ConfigFormat,
  options?: PatchContentOptions,
): string;
```

| Parameter | Tipe | Deskripsi |
|---|---|---|
| `content` | `string` | Konten konfigurasi mentah yang harus valid menurut `format` yang ditentukan. |
| `ops` | `JsonPatchOp[]` | Operasi yang diterapkan berurutan. Array kosong mengembalikan `content` tanpa perubahan. |
| `format` | `ConfigFormat` | `"json" \| "jsonc" \| "yaml"`. |
| `options.strict` | `boolean` | Dengan `true` (bawaan), operasi yang gagal melempar pengecualian. Dengan `false`, operasi dilewati dan dilaporkan melalui `console.warn`. |

**Mengembalikan:** konten konfigurasi yang telah diubah (`string`).

**Pengecualian:** `TypeError` jika `content` bukan string atau `ops` tidak valid; galat yang menjelaskan operasi gagal saat `strict` bernilai `true`.

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

Mengatur atau membuat satu nilai. Secara internal memanggil `patchContent` dengan satu operasi `add`. Sesuai RFC 6902, `add` mengganti properti objek yang ada atau menyisipkan pada indeks array.

```typescript
function setContentValue(
  content: string,
  path: readonly (string | number)[],
  value: unknown,
  format: ConfigFormat,
): string;
```

| Parameter | Tipe | Deskripsi |
|---|---|---|
| `content` | `string` | Konten konfigurasi mentah. |
| `path` | `readonly (string \| number)[]` | Jalur per segmen, misalnya `["server", "port"]`. Tidak boleh kosong. |
| `value` | `unknown` | Nilai yang akan ditulis. |
| `format` | `ConfigFormat` | Format konfigurasi. |

**Mengembalikan:** konten yang diperbarui (`string`).

```typescript
setContentValue("server:\n  port: 3000\n", ["server", "port"], 8080, "yaml");
```

---

### `deleteContentValue`

Menghapus kunci atau elemen array. Secara internal memanggil `patchContent` dengan satu operasi `remove`. Jalur harus ada.

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

## Lapisan berkas (khusus Node.js / Electron)

### `readConfigFile`

Membaca teks UTF-8 dari jalur lokal atau URL `file://`.

```typescript
function readConfigFile(filePath: string): Promise<string>;
```

| Parameter | Tipe | Deskripsi |
|---|---|---|
| `filePath` | `string` | Jalur absolut, relatif, atau URL `file://`. Tidak boleh kosong. |

**Mengembalikan:** konten UTF-8 mentah (`Promise<string>`).

**Pengecualian:** jika berkas tidak dapat dibaca, galat yang membungkus kegagalan sistem berkas yang mendasarinya.

---

### `writeConfigFile`

Menulis konten secara **atomik** melalui berkas sementara dan penggantian nama, dengan **kunci berkas** eksklusif secara bawaan. Direktori induk dibuat sebelum penguncian.

```typescript
function writeConfigFile(
  filePath: string,
  content: string,
  options?: WriteConfigOptions,
): Promise<void>;
```

| Parameter | Tipe | Deskripsi |
|---|---|---|
| `filePath` | `string` | Jalur berkas konfigurasi. |
| `content` | `string` | Konten yang ditulis. Harus berupa string. |
| `options` | `WriteConfigOptions` | Lihat di bawah. |

**Pengecualian:** `TypeError` untuk masukan tidak valid; kegagalan penulisan sistem berkas dibungkus dalam galat.

#### `WriteConfigOptions`

| Opsi | Tipe | Bawaan | Deskripsi |
|---|---|---|---|
| `lock` | `boolean` | `true` | Mengaktifkan penguncian selama penulisan. |
| `lockTimeoutMs` | `number` | Bawaan `withFileLock` (10 detik) | Waktu tunggu maksimum untuk memperoleh kunci, dalam milidetik. |
| `lockRetryDelayMs` | `number` | Bawaan `withFileLock` (25 milidetik) | Jeda awal percobaan ulang, dalam milidetik, sebelum kenaikan eksponensial. |
| `lockStaleThresholdMs` | `number` | Bawaan `withFileLock` | Usia kunci dalam milidetik yang mengizinkan pemulihan. |
| `allowStaleRecovery` | `boolean` | `false` | Mengizinkan pengambilan kembali kunci kedaluwarsa secara otomatis. |

```typescript
import { writeConfigFile } from "@powerduck/conf-patch";

await writeConfigFile("config.json", '{"name": "app"}');
```

---

### `patchConfigFile`

Transaksi utama lapisan berkas: membaca di dalam kunci, menerapkan `patchContent`, lalu menulis kembali secara atomik **hanya jika konten berubah**. Tanpa `options.format`, format dideteksi dari ekstensi.

```typescript
function patchConfigFile(
  filePath: string,
  ops: JsonPatchOp[],
  options?: PatchConfigOptions,
): Promise<void>;
```

| Parameter | Tipe | Deskripsi |
|---|---|---|
| `filePath` | `string` | Jalur berkas konfigurasi. Tidak boleh kosong. |
| `ops` | `JsonPatchOp[]` | Operasi yang diterapkan. Array kosong langsung kembali tanpa membaca atau menulis. |
| `options` | `PatchConfigOptions` | Lihat di bawah. |

**Pengecualian:** `TypeError` jika `filePath` kosong, opsi kunci tidak valid, atau format tidak dapat dideteksi dan `format` tidak diberikan; galat operasi saat `strict` bernilai `true`.

#### `PatchConfigOptions`

| Opsi | Tipe | Bawaan | Deskripsi |
|---|---|---|---|
| `format` | `ConfigFormat` | deteksi otomatis | Format eksplisit, mengesampingkan deteksi ekstensi. |
| `strict` | `boolean` | `true` | Operasi yang gagal melempar pengecualian. |
| `lock` | `boolean` | `true` | Mengaktifkan penguncian berkas. |
| `lockTimeoutMs` | `number` | 10 detik | Tidak negatif. Waktu tunggu maksimum untuk kunci. |
| `lockRetryDelayMs` | `number` | 25 milidetik | Positif. Jeda awal percobaan ulang. |
| `lockStaleThresholdMs` | `number` | dihitung | Positif. Usia kunci yang diperlukan untuk pemulihan. |
| `allowStaleRecovery` | `boolean` | `false` | Mengambil kembali kunci kedaluwarsa secara otomatis. |

```typescript
await patchConfigFile("config.json", [
  { op: "replace", path: ["server", "host"], value: "0.0.0.0" },
  { op: "add", path: ["server", "ssl"], value: true },
  { op: "remove", path: ["legacySection"] },
]);
```

---

### `setConfigValue`

Menambahkan atau mengganti nilai bertingkat dalam berkas. Mendelegasikan satu operasi `add` ke `patchConfigFile`.

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

Menghapus nilai bertingkat yang ada dari berkas. Mendelegasikan satu operasi `remove` ke `patchConfigFile`.

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

Menjalankan callback asinkron melalui antrean lokal proses **dan** berkas kunci eksklusif (`<file>.confedit.lock`). Kunci menggunakan token kepemilikan. Kunci kedaluwarsa hanya dipulihkan jika `allowStaleRecovery` bernilai `true` dan usianya melampaui `staleThresholdMs`. PID sengaja tidak diperiksa karena dapat digunakan kembali.

```typescript
function withFileLock<T>(
  filePath: string,
  callback: () => Promise<T>,
  options?: FileLockOptions,
): Promise<T>;
```

| Parameter | Tipe | Deskripsi |
|---|---|---|
| `filePath` | `string` | Berkas yang dikunci. |
| `callback` | `() => Promise<T>` | Pekerjaan yang dijalankan selama kunci dipegang. |
| `options` | `FileLockOptions` | Lihat di bawah. |

**Mengembalikan:** hasil `callback` (`Promise<T>`). Kunci selalu dilepas dalam blok `finally`, meskipun callback melempar pengecualian.

#### `FileLockOptions`

| Opsi | Tipe | Bawaan | Deskripsi |
|---|---|---|---|
| `timeoutMs` | `number` | `10000` | Waktu tunggu maksimum kunci dalam milidetik. Harus tidak negatif. |
| `retryDelayMs` | `number` | `25` | Jeda awal dalam milidetik. Harus positif. Jeda naik 1,5 kali hingga maksimum 1000 milidetik. |
| `staleThresholdMs` | `number` | `max(timeoutMs * 2, 60000)` | Usia kunci yang mengizinkan pemulihan, dalam milidetik. Harus positif. |
| `allowStaleRecovery` | `boolean` | `false` | Pemulihan otomatis kunci kedaluwarsa. Nonaktif secara bawaan untuk proses utama tunggal Electron agar transaksi aktif tidak terputus. |

```typescript
import { withFileLock } from "@powerduck/conf-patch";

await withFileLock("state.json", async () => {
  // ... read, modify, write ...
}, { timeoutMs: 5000 });
```

---

### `releaseAllLocalLocks`

Menghapus semua berkas kunci milik proses saat ini. Gunakan saat aplikasi ditutup, setelah transaksi berkas aktif selesai. Untuk pembersihan asinkron di Electron, cegah peristiwa keluar pertama lalu lanjutkan keluar setelah pembersihan selesai, seperti pada contoh. Kegagalan tiap kunci diabaikan.

```typescript
function releaseAllLocalLocks(): Promise<void>;
```

---

## Validasi OpenAPI

### `validateOpenAPISpec`

Memvalidasi konten OpenAPI/Swagger mentah dalam JSON atau YAML. Masukan dianggap sebagai **konten** secara bawaan; hanya ditafsirkan sebagai jalur dengan `inputKind: "file"`. Validasi didelegasikan ke `@powerduck/openapi-parser`; fungsi ini menambahkan perlindungan pada penanganan masukan.

```typescript
function validateOpenAPISpec(
  input: string,
  options?: ValidateOpenApiOptions,
): Promise<AnyOpenAPIDocument>;
```

| Parameter | Tipe | Deskripsi |
|---|---|---|
| `input` | `string` | Konten spesifikasi mentah, atau jalur berkas dengan `inputKind: "file"`. |
| `options` | `ValidateOpenApiOptions` | Lihat di bawah. |

**Mengembalikan:** dokumen yang tervalidasi saat berhasil (`Promise<AnyOpenAPIDocument>`).

**Pengecualian:** `TypeError` untuk masukan kosong atau bukan string; [`OpenApiValidationError`](#openapivalidationerror) untuk opsi tidak valid atau kegagalan validasi.

---

### `validateOpenAPIFile`

Fungsi praktis yang memanggil `validateOpenAPISpec` dengan `inputKind: "file"` dan `baseFilePath` berisi jalur yang diberikan. Memerlukan `allowedRootDirectory`.

```typescript
function validateOpenAPIFile(
  filePath: string,
  options?: ValidateOpenApiOptions,
): Promise<AnyOpenAPIDocument>;
```

```typescript
import { validateOpenAPIFile } from "@powerduck/conf-patch";

const doc = await validateOpenAPIFile("./configs/openapi.yaml", {
  allowedRootDirectory: "./configs",
});
```

---

### `ValidateOpenApiOptions`

| Opsi | Tipe | Bawaan | Deskripsi |
|---|---|---|---|
| `inputKind` | `"content" \| "file"` | `"content"` | Cara menafsirkan `input`. |
| `baseFilePath` | `string` | — | Jalur dasar untuk konteks resolusi referensi. |
| `allowedRootDirectory` | `string` | — | Direktori akar masukan berkas. **Wajib** jika `inputKind` adalah `"file"`. |
| `timeoutMs` | `number` | `15000` | Batas waktu operasi, dalam milidetik. |
| `maxInputBytes` | `number` | `5242880` (5 MB) | Ukuran maksimum masukan mentah, dalam byte. |
| `maxDocumentNodes` | `number` | `100000` | Jumlah maksimum simpul dokumen yang diurai, untuk perlindungan DoS. |
| `maxDocumentDepth` | `number` | `100` | Kedalaman maksimum struktur bertingkat, untuk perlindungan DoS. |
| `maxValidationErrors` | `number` | `50` | Jumlah maksimum galat dalam pesan. |
| `maxErrorMessageLength` | `number` | `1000` | Jumlah maksimum karakter per galat validasi. |
| `signal` | `AbortSignal` | — | Sinyal pembatalan opsional. |

---

### `OpenApiValidationError`

Galat terstruktur saat validasi gagal. Petakan galat pada batas aplikasi sebelum mengembalikannya ke klien; pesan dan penyebab dapat memuat jalur lokal atau detail dokumen.

```typescript
class OpenApiValidationError extends Error {
  readonly code: string;
  readonly cause?: unknown;
  constructor(code: string, message: string, cause?: unknown);
}
```

| Properti | Tipe | Deskripsi |
|---|---|---|
| `code` | `string` | Kode galat yang dapat diproses program; lihat tabel berikut. |
| `message` | `string` | Detail yang dapat dibaca pengguna. |
| `cause` | `unknown` | Galat dasar opsional. |

#### Kode galat

| Kode | Arti |
|---|---|
| `INVALID_OPTION` | Nilai opsi yang diberikan tidak valid. |
| `INPUT_TOO_LARGE` | Konten mentah melebihi `maxInputBytes`. |
| `INPUT_FILE_TOO_LARGE` | Berkas masukan melebihi batas ukuran. |
| `FILE_INPUT_FORBIDDEN` | Masukan berkas digunakan tanpa `allowedRootDirectory`. |
| `PATH_OUTSIDE_ROOT` | Jalur berkas yang diselesaikan berada di luar `allowedRootDirectory`. |
| `PARSE_ERROR` | Gagal mengurai konten JSON/YAML. |
| `INVALID_DOCUMENT_SHAPE` | Dokumen bukan objek JSON. |
| `UNSUPPORTED_VERSION` | Dokumen tidak menyatakan versi OpenAPI/Swagger yang didukung; hanya versi utama `2` dan `3` yang diterima. |
| `DOCUMENT_TOO_DEEP` | Kedalaman melebihi `maxDocumentDepth`. |
| `DOCUMENT_TOO_LARGE` | Jumlah simpul melebihi `maxDocumentNodes`. |
| `SPEC_VALIDATION_FAILED` | Spesifikasi gagal dalam validasi OpenAPI. |
| `OPERATION_TIMEOUT` | Operasi melampaui `timeoutMs`. |
| `OPERATION_ABORTED` | Operasi dibatalkan melalui `signal`. |
| `UNKNOWN_ERROR` | Galat tak terduga. |

---

## Utilitas

### `detectFormat`

Mendeteksi [`ConfigFormat`](#configformat) dari ekstensi jalur berkas atau URL `file://`.

```typescript
function detectFormat(filePath: string): ConfigFormat;
```

| Ekstensi | Hasil |
|---|---|
| `.json` | `"json"` |
| `.jsonc` | `"jsonc"` |
| `.yaml`, `.yml` | `"yaml"` |
| ekstensi lainnya | melempar galat |

---

### `normalizeFilePath`

Mengubah jalur lokal atau URL `file:` menjadi jalur native absolut. Mempertahankan spasi yang valid dan nama berkas Unicode.

```typescript
function normalizeFilePath(filePath: string): string;
```

URL `file:` didekodekan dengan `fileURLToPath`; jalur absolut dikembalikan apa adanya; jalur relatif diselesaikan terhadap `process.cwd()`.

---

## Fungsi asersi

Diekspor ulang untuk penggunaan lanjutan dan modul internal. Kode aplikasi jarang perlu memanggilnya langsung.

### `assertNonEmptyString`

```typescript
function assertNonEmptyString(value: unknown, label: string): asserts value is string;
```
Melempar `TypeError` jika `value` bukan string yang tidak kosong.

### `assertPatchPath`

```typescript
function assertPatchPath(
  path: readonly (string | number)[],
  label?: string, // default "path"
): void;
```
Melempar pengecualian jika `path` bukan array tidak kosong yang segmennya berupa string tidak kosong atau bilangan bulat aman yang tidak negatif.

### `assertPatchOperations`

```typescript
function assertPatchOperations(ops: JsonPatchOp[]): void;
```
Memvalidasi setiap operasi: `op` harus `"add" | "replace" | "remove"`, `path` harus lolos `assertPatchPath`, dan `add`/`replace` harus memiliki properti sendiri `value`.

### `assertConfigFormat`

```typescript
function assertConfigFormat(format: ConfigFormat): void;
```
Melempar pengecualian jika `format` bukan `"json"`, `"jsonc"`, atau `"yaml"`.

### `getErrorMessage`

```typescript
function getErrorMessage(error: unknown): string;
```
Mengembalikan `error.message` untuk instans `Error`, selain itu `String(error)`.

### `createError`

```typescript
function createError(message: string, cause: unknown): Error;
```
Membuat `Error` dan menambahkan properti `cause` melalui `Object.defineProperty`, dengan cara alternatif untuk runtime lama.

---

## Tipe

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
Hanya `"add"`, `"replace"`, dan `"remove"` yang didukung. `"move"`, `"copy"`, dan `"test"` sengaja tidak disertakan.
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

Union bentuk dokumen OpenAPI/Swagger yang didukung dan dikembalikan oleh validasi:

```typescript
type AnyOpenAPIDocument =
  | OpenAPIV2.Document      // Swagger 2.0
  | OpenAPIV3.Document      // OpenAPI 3.0.x
  | OpenAPIV3_1.Document     // OpenAPI 3.1.x
  | OpenAPIV3_2Document;    // OpenAPI 3.2 (permissive structural type)
```

`OpenAPIV3_2Document` adalah tipe struktural yang longgar:

```typescript
interface OpenAPIV3_2Document {
  openapi: string;
  info: Record<string, unknown>;
  paths?: Record<string, unknown>;
  [key: string]: unknown;
}
```

---

## Ringkasan ekspor

| Simbol | Titik masuk utama | Subjalur inti | Jenis |
|---|:---:|:---:|---|
| `patchContent` | ✓ | ✓ | fungsi |
| `setContentValue` | ✓ | ✓ | fungsi |
| `deleteContentValue` | ✓ | ✓ | fungsi |
| `PatchContentOptions` | ✓ | ✓ | tipe |
| `assertNonEmptyString` | ✓ | ✓ | fungsi |
| `assertPatchPath` | ✓ | ✓ | fungsi |
| `assertPatchOperations` | ✓ | ✓ | fungsi |
| `assertConfigFormat` | ✓ | ✓ | fungsi |
| `getErrorMessage` | ✓ | ✓ | fungsi |
| `createError` | ✓ | ✓ | fungsi |
| `ConfigFormat` | ✓ | ✓ | tipe |
| `JsonPatchOp` | ✓ | ✓ | tipe |
| `JsonPathSegment` | ✓ | ✓ | tipe |
| `readConfigFile` | ✓ | — | fungsi |
| `writeConfigFile` | ✓ | — | fungsi |
| `WriteConfigOptions` | ✓ | — | tipe |
| `patchConfigFile` | ✓ | — | fungsi |
| `setConfigValue` | ✓ | — | fungsi |
| `deleteConfigValue` | ✓ | — | fungsi |
| `withFileLock` | ✓ | — | fungsi |
| `releaseAllLocalLocks` | ✓ | — | fungsi |
| `PatchConfigOptions` | ✓ | — | tipe |
| `FileLockOptions` | ✓ | — | tipe |
| `detectFormat` | ✓ | — | fungsi |
| `normalizeFilePath` | ✓ | — | fungsi |
| `validateOpenAPISpec` | ✓ | — | fungsi |
| `validateOpenAPIFile` | ✓ | — | fungsi |
| `OpenApiValidationError` | ✓ | — | kelas |
| `ValidateOpenApiOptions` | ✓ | — | tipe |
| `OpenApiInputKind` | ✓ | — | tipe |
| `AnyOpenAPIDocument` | ✓ | — | tipe |