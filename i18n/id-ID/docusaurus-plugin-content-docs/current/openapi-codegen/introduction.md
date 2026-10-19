---
sidebar_position: 1
title: "Pengantar"
description: "Buat contoh HTTP yang dapat dijalankan dari OpenAPI dengan @powerduck/openapi-codegen: 21 bahasa, 41 klien, kompatibel dengan browser, tanpa dependensi runtime."
---

# Pengantar

`@powerduck/openapi-codegen` adalah pustaka TypeScript yang mengubah operasi OpenAPI menjadi **contoh kode permintaan HTTP yang dapat dijalankan** dengan bahasa dan klien HTTP pilihan Anda. Dirancang untuk situs dokumentasi API, portal pengembang, penjelajah API, alat CLI, dan pembuatan kode saat build.

Pustaka ini mendukung **21 bahasa** dan **41 kombinasi bahasa/klien**, **kompatibel dengan browser**, serta **tidak memiliki dependensi runtime**.

## Mengapa openapi-codegen

- **Tanpa dependensi runtime** — berjalan di browser, Node.js, Electron, dan runtime edge tanpa memerlukan modul bawaan Node.
- **Dua format modul** — build ESM native dan CommonJS (`require()`).
- **OpenAPI 3.0 / 3.1 / 3.2** — memproses objek dokumen yang sudah diparsing. JSON dan YAML dapat digunakan setelah diparsing sebelum memanggil `generate()`.
- **41 generator bawaan** untuk 21 bahasa, otomatis terdaftar saat diimpor.
- **Serialisasi parameter lengkap** — parameter path, query, header, dan cookie mengikuti aturan OpenAPI `style` / `explode` / `allowReserved`.
- **Skema keamanan** — kunci API di header/query/cookie, HTTP bearer, dan HTTP basic.
- **Jenis body** — JSON, teks biasa, formulir berkode URL, dan `multipart/form-data`.
- **Resolusi `$ref`** — referensi JSON Pointer dalam dokumen dengan cache, rantai referensi, dan deteksi siklus.
- **Contoh otomatis** — menyimpulkan nilai dari JSON Schema (`example`, `enum`, `default`, tipe, format, batasan).
- **Sistem plugin** — daftarkan generator kustom melalui `register()` atau `use()`.

## Cara kerja

```
OpenAPI document  ──normalize──▶  RequestIR  ──generator.generate()──▶  source code string
```

1. `normalize` menyelesaikan `$ref`, menggabungkan parameter tingkat jalur dan operasi, memilih jenis media body, menghasilkan nilai contoh, menyelesaikan skema keamanan, dan membuat `RequestIR` yang dinormalisasi.
2. `Generator` yang dipilih menerima `RequestIR` dan mengembalikan string kode sumber yang dapat dijalankan.

Biasanya cukup memanggil `generate({...})` untuk menjalankan kedua langkah tersebut.

## Contoh dasar

```typescript
import { generate } from "@powerduck/openapi-codegen";

const code = generate({
  document,                 // parsed OpenAPI object
  path: "/users/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
});

console.log(code);          // a runnable fetch() snippet
```

## Langkah berikutnya

- [Instalasi](/docs/id-ID/openapi-codegen/installation/) — npm / yarn / pnpm dan penggunaan di browser.
- [Mulai cepat](/docs/id-ID/openapi-codegen/quickstart/) — Buat cuplikan pertama dan tampilkan daftar generator.
- [Konfigurasi](/docs/id-ID/openapi-codegen/configuration/) — `GenerateOptions`, `RequestIR`, `Generator`, `Plugin`.
- [Referensi API](/docs/id-ID/openapi-codegen/api-reference/) — Semua ekspor dan daftar lengkap bahasa/klien.
- [Contoh](/docs/id-ID/openapi-codegen/examples/) — fetch, Python requests, cURL, generator kustom, plugin, dan `RequestIR` langsung.
