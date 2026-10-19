---
sidebar_position: 1
title: "@powerduck/x-to-openapi"
description: "@powerduck/x-to-openapi adalah framework TypeScript yang dapat diperluas untuk mengubah perintah curl dan koleksi Postman (v2.0 / v2.1.0) menjadi dokumen OpenAPI 3.2. Cocok untuk pipeline CI, pembuatan dokumentasi API, dan rekonstruksi antarmuka dari permintaan HTTP."
---

# @powerduck/x-to-openapi

**@powerduck/x-to-openapi** adalah framework TypeScript yang dapat diperluas untuk mengubah **perintah curl** dan **koleksi Postman (v2.0 / v2.1.0)** menjadi dokumen **OpenAPI 3.2**. Cocok untuk pipeline CI, pembuatan dokumentasi API, dan rekonstruksi antarmuka dari permintaan HTTP.

Validasi dokumen menggunakan [`@powerduck/openapi-parser`](https://www.npmjs.com/package/@powerduck/openapi-parser).

- **Versi:** <img src="https://img.shields.io/npm/v/@powerduck/x-to-openapi"/>
- **Lisensi:** MIT
- **Persyaratan Node.js:** `>= 22.12.0`
- **Keluaran:** hanya OpenAPI **3.2.0**
- **Kode sumber:** [github.com/powerducklab/x-to-openapi](https://github.com/powerducklab/x-to-openapi)

---

## Cara kerja

```text
perintah curl → CurlAdapter
koleksi Postman → PostmanAdapter
             ↓
     NormalizedRequest[]
             ↓
     buildOpenApi32() → dokumen OpenAPI 3.2
             ↓
     validateOpenApi32() → diagnostik
```

1. **Adaptor** mengurai sumber, seperti teks curl atau koleksi Postman, menjadi daftar objek [`NormalizedRequest`](./api-reference.md#normalizedrequest).
2. **Pembangun** menggabungkan permintaan berdasarkan metode dan jalur, menyimpulkan skema, parameter jalur, serta definisi keamanan, lalu menghasilkan dokumen OpenAPI 3.2.
3. **Validator** memeriksa keluaran terhadap skema OpenAPI melalui `@powerduck/openapi-parser` dan mengembalikan diagnostik.

---

## Fitur

- **Dua adaptor bawaan:** [`CurlAdapter`](./api-reference.md#curladapter) mendukung perintah tunggal, kumpulan perintah, dan keluaran browser “Copy all as cURL”; [`PostmanAdapter`](./api-reference.md#postmanadapter) mendukung v2.0/v2.1.0, folder bertingkat, dan pewarisan autentikasi.
- **Fungsi bantu tanpa konfigurasi:** [`curlToOpenApi`](./api-reference.md#curltoopenapi) dan [`postmanToOpenApi`](./api-reference.md) mendaftarkan adaptor dan mengonversi dalam satu panggilan.
- **Keluaran OpenAPI 3.2:** setiap dokumen mendeklarasikan `openapi: "3.2.0"`. Validasi aktif secara bawaan. Periksa diagnostik atau aktifkan mode ketat untuk menolak galat.
- **Penggabungan permintaan:** operasi dengan metode dan jalur yang sama digabungkan; parameter kueri, header, cookie, serta skema isi digabungkan secara struktural.
- **Inferensi parameter jalur:** ID numerik, UUID, ULID, dan segmen heksadesimal panjang diubah menjadi templat seperti `/users/{userId}` saat bervariasi dalam setidaknya N sampel.
- **Inferensi keamanan:** mendeteksi Bearer, Basic, dan kunci API pada header, kueri, atau cookie, lalu menghasilkan `securitySchemes` yang sesuai.
- **Beragam jenis isi:** JSON, XML, form-urlencoded, multipart/form-data dengan teks dan berkas, GraphQL, teks, dan biner.
- **Mempertahankan skrip pengujian Postman:** `pm.test()` / `pm.expect()` dikeluarkan sebagai `x-postman-scripts` pada setiap operasi.
- **Diagnostik:** setiap masalah menyertakan tingkat keparahan, kode, dan detail sumber jika tersedia; mode [`strict`](./api-reference.md#convertoptions) melempar pengecualian saat terjadi galat.
- **Dapat diperluas:** implementasikan [`SourceAdapter`](./api-reference.md) untuk menambahkan sumber HAR, HTTPie, atau Insomnia.

---

## Arsitektur plugin

Framework ini dibangun di atas antarmuka adaptor yang ringkas:

```typescript
interface SourceAdapter<I = unknown> {
  readonly id: string;                       // e.g. "curl", "postman", "har"
  canHandle?(input: unknown): boolean;       // used by "auto" detection
  parse(input: I, context: AdapterContext): Promise<NormalizedRequest[]>;
}
```

Adaptor didaftarkan pada instans [`XToOpenApi`](./api-reference.md#xtoopenapi) melalui [`AdapterRegistry`](./api-reference.md#adapterregistry):

```typescript
const converter = new XToOpenApi()
  .register(new CurlAdapter())
  .register(new PostmanAdapter());

// Explicit source id:
await converter.convert("curl", curlText);

// Auto-detect via canHandle():
await converter.convert("auto", someInput);
```

Fungsi bantu tanpa konfigurasi sudah menyertakan kedua adaptor bawaan, sehingga biasanya registri tidak perlu digunakan secara langsung.

---

## Memilih fungsi bantu atau kelas

| Kebutuhan | API |
|---|---|
| Mengonversi satu atau beberapa perintah curl | [`curlToOpenApi`](./api-reference.md#curltoopenapi) |
| Mengonversi koleksi Postman berupa objek atau string | [`postmanToOpenApi`](./api-reference.md) |
| Opsi khusus, beberapa adaptor, deteksi `"auto"`, atau adaptor khusus | [`new XToOpenApi()`](./api-reference.md#xtoopenapi) |

---

## Langkah berikutnya

- [Instalasi](./installation.md) — tambahkan paket dan pelajari fungsi bantu tanpa konfigurasi.
- [Mulai cepat](./quickstart.md) — konversi perintah curl, koleksi Postman, dan gunakan adaptor khusus.
- [Referensi API](./api-reference.md) — semua ekspor, tipe, opsi, nilai bawaan, dan kode diagnostik.
- [Contoh](./examples.md) — curl, kumpulan perintah, koleksi Postman, adaptor khusus, dan inferensi jalur.
