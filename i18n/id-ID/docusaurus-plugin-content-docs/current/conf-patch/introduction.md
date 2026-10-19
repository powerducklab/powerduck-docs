---
sidebar_position: 1
title: "@powerduck/conf-patch"
description: "@powerduck/conf-patch menyunting konfigurasi dengan arsitektur dua lapis yang jelas. Pustaka ini menerapkan semantik RFC 6902 JSON Patch pada string JSON, JSONC, dan YAML sambil mempertahankan komentar serta format, dan menyediakan penulisan atomik serta penguncian antarproses untuk Node.js dan Electron."
---

# @powerduck/conf-patch

**@powerduck/conf-patch** menyunting konfigurasi dengan **arsitektur dua lapis** yang jelas. Pustaka ini menerapkan semantik [RFC 6902 JSON Patch](https://datatracker.ietf.org/doc/html/rfc6902) pada string JSON, JSONC, dan YAML sambil mempertahankan komentar serta format, dan menyediakan penulisan atomik serta penguncian antarproses untuk Node.js dan Electron.

- **Versi:** <img src="https://img.shields.io/npm/v/@powerduck/conf-patch"/>
- **Lisensi:** MIT
- **Persyaratan Node.js:** `>= 22.12.0`
- **Kode sumber:** [github.com/powerducklab/conf-patch](https://github.com/powerducklab/conf-patch)

---

## Mengapa conf-patch?

Menyunting berkas konfigurasi melalui kode sering memaksa Anda memilih antara menserialisasi ulang seluruh dokumen, yang dapat mengubah komentar dan format, atau memanipulasi teks secara manual yang rentan kesalahan. conf-patch menyediakan:

- **Penyuntingan inkremental yang mempertahankan komentar** untuk JSON/JSONC melalui `jsonc-parser`, serta perubahan AST untuk YAML melalui `yaml`. JSON/JSONC tidak diserialisasi ulang secara menyeluruh; YAML menserialisasi ulang AST yang telah diubah.
- **Penulisan atomik** melalui berkas sementara lalu penggantian nama, agar berkas tujuan tidak berisi tulisan yang belum lengkap.
- **Penguncian antarproses** dengan token kepemilikan, jeda percobaan ulang eksponensial, dan pemulihan kunci kedaluwarsa.
- **API lintas lingkungan:** lapisan inti juga berjalan di browser, fungsi Edge, dan aplikasi yang menggunakan penyimpanan IndexedDB.

---

## Arsitektur dua lapis

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

### Lapisan inti — `@powerduck/conf-patch/core` (kompatibel dengan browser)

Fungsi murni yang mengolah **string**, tanpa `node:fs`, `node:path`, atau API khusus Node.js. Subjalur ini dapat disertakan dalam kode browser, fungsi Edge, atau service worker.

| Fungsi | Kegunaan |
|---|---|
| [`patchContent`](../api-reference/#patchcontent) | Menerapkan operasi RFC 6902 pada string konfigurasi |
| [`setContentValue`](../api-reference/#setcontentvalue) | Mengatur atau membuat nilai bertingkat (menggunakan `add`) |
| [`deleteContentValue`](../api-reference/#deletecontentvalue) | Menghapus kunci atau elemen array (menggunakan `remove`) |

### Lapisan berkas — `@powerduck/conf-patch` (Node.js / Electron)

Fungsi asinkron untuk membaca dan menulis berkas yang menambahkan penulisan atomik serta penguncian pada lapisan inti.

| Fungsi | Kegunaan |
|---|---|
| [`readConfigFile`](../api-reference/#readconfigfile) | Membaca teks UTF-8 dari jalur berkas atau URL `file://` |
| [`writeConfigFile`](../api-reference/#writeconfigfile) | Menulis konten secara atomik, dengan penguncian opsional |
| [`patchConfigFile`](../api-reference/#patchconfigfile) | Menjalankan transaksi baca-ubah-tulis di dalam kunci berkas |
| [`setConfigValue`](../api-reference/#setconfigvalue) | Mengatur nilai bertingkat dalam berkas |
| [`deleteConfigValue`](../api-reference/#deleteconfigvalue) | Menghapus nilai bertingkat dari berkas |
| [`withFileLock`](../api-reference/#withfilelock) | Menjalankan tugas dengan kunci eksklusif |
| [`releaseAllLocalLocks`](../api-reference/#releasealllocallocks) | Melepaskan semua kunci milik proses saat ini |

---

## Format yang didukung

| Format | Ekstensi | Perilaku |
|---|---|---|
| **JSON** | `.json` | JSON standar. Penyuntingan inkremental melalui `jsonc-parser`. |
| **JSONC** | `.jsonc` | JSON dengan komentar dan koma di akhir. Komentar dipertahankan. |
| **YAML** | `.yaml`, `.yml` | YAML 1.2. Perubahan AST mempertahankan komentar, jangkar, dan indentasi. |

[`detectFormat`](../api-reference/#detectformat) memetakan ekstensi berkas ke [`ConfigFormat`](../api-reference/#configformat). Ekstensi lain menimbulkan galat kecuali Anda menentukan `format` secara eksplisit.

---

## Operasi RFC 6902

conf-patch menerapkan sebagian RFC 6902. Hanya operasi berikut yang didukung:

| `op` | Perilaku |
|---|---|
| `"add"` | Menyisipkan pada indeks array atau menambahkan/mengganti properti objek |
| `"replace"` | Mengganti nilai yang ada; jalur harus tersedia |
| `"remove"` | Menghapus kunci atau elemen yang ada; jalur harus tersedia |

:::caution
`"move"`, `"copy"`, dan `"test"` **tidak didukung**. Tipe [`JsonPatchOp`](../api-reference/#jsonpatchop) membatasi `op` pada `"add" | "replace" | "remove"`.
:::

Catatan perilaku:

- `add` pada indeks array **menyisipkan** elemen (RFC 6902). Untuk mengganti elemen yang ada, gunakan `replace`.
- `add` mengharuskan jalur induk sudah ada. Buat induk sebelum anak.
- `replace` dan `remove` mengharuskan jalur tujuan sudah ada.
- Dengan `strict: true` (bawaan), operasi yang gagal melempar pengecualian. Dengan `strict: false`, operasi dilewati dan peringatan dicatat.

---

## Mempertahankan komentar dan format

- **JSON/JSONC:** perubahan dihitung sebagai rentang teks berdasarkan pohon sintaks, sehingga komentar di sekitarnya, koma di akhir, dan indentasi tetap utuh.
- **YAML:** AST `yaml` diubah langsung lalu diserialisasi ulang dengan mempertahankan komentar, jangkar, alias, dan indentasi.

---

## Validasi OpenAPI

conf-patch memvalidasi dokumen OpenAPI/Swagger melalui antarmuka dengan perlindungan tambahan untuk `@powerduck/openapi-parser`:

- [`validateOpenAPISpec`](../api-reference/#validateopenapispec) memvalidasi konten JSON atau YAML mentah.
- [`validateOpenAPIFile`](../api-reference/#validateopenapifile) memvalidasi dokumen dari jalur berkas.
- Penanganan masukan menerapkan batas ukuran, pembatasan jalur (`allowedRootDirectory`), pemeriksaan kompleksitas struktur, tenggat, dan pembatalan melalui `AbortSignal`.
- Kegagalan melempar [`OpenApiValidationError`](../api-reference/#openapivalidationerror) dengan `code` yang dapat diproses oleh program.

---

## Langkah berikutnya

- [Instalasi](../installation/) — tambahkan conf-patch dan pelajari dua titik masuknya.
- [Mulai cepat](../quickstart/) — ubah string di browser dan berkas di disk.
- [Referensi API](../api-reference/) — semua ekspor, tipe, dan opsi.
- [Contoh](../examples/) — contoh yang dapat dijalankan untuk JSON, YAML, JSONC, validasi OpenAPI, dan penguncian.
