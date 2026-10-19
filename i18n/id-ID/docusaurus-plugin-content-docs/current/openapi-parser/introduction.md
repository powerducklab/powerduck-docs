---
sidebar_position: 1
title: "Pengantar"
description: "Konversi dokumen Swagger 2.0, OpenAPI 3.0, 3.1, atau 3.2 apa pun ke OpenAPI 3.2 dengan satu pemanggilan."
keywords: ["openapi-parser", "powerduck", "Swagger", "OpenAPI 3.2"]
---

# @powerduck/openapi-parser

Konversi dokumen Swagger 2.0, OpenAPI 3.0, 3.1, atau 3.2 apa pun ke OpenAPI 3.2 dengan satu pemanggilan.

Pembungkus ringan untuk dua pustaka berikut: [`@scalar/openapi-parser`](https://github.com/scalar/openapi-parser), [`@scalar/openapi-upgrader`](https://github.com/scalar/openapi-parser/tree/main/packages/openapi-upgrader).
Tidak mengimplementasikan ulang penguraian, validasi, atau konversi, melainkan menghubungkannya dan memberikan struktur kesalahan yang seragam serta dapat diprediksi, lengkap dengan kode yang dapat dibaca mesin.

- **Nama paket:** `@powerduck/openapi-parser`
- **Versi:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-parser"/>
- **Lisensi:** MIT
- **Node.js:** >= 22.12.0

## Fitur

- **Satu fungsi untuk semua versi** — Swagger 2.0, OpenAPI 3.0.x, 3.1.x, dan 3.2.x dikonversi menjadi dokumen 3.2 yang tervalidasi.
- **Input string JSON dan YAML** — Berikan objek yang sudah diurai atau string JSON/YAML mentah.
- **Kode kesalahan yang dapat dibaca mesin** — Setiap kegagalan menghasilkan `OpenApiUpgradeError` dengan nilai enum `UpgradeErrorCode`.
- **Tanpa mengubah input** — Input disalin secara mendalam melalui `structuredClone` sebelum tahap konversi apa pun dijalankan.
- **Perlindungan referensi melingkar** — Mendeteksi siklus dalam input sebelum menyebabkan stack overflow.
- **Validasi output** — Dokumen 3.2 hasil konversi divalidasi terhadap skema secara default.
- **ESM dan CJS** — Gunakan `import` di Node modern dan bundler, serta `require()` di proses utama Electron.

## Langkah berikutnya

- [Instalasi](/docs/id-ID/openapi-parser/installation/) — instalasi dan persyaratan
- [Panduan cepat](/docs/id-ID/openapi-parser/quickstart/) — konversi dokumen pertama Anda
- [Referensi API](/docs/id-ID/openapi-parser/api-reference/) — semua ekspor, kode kesalahan, dan opsi
- [Contoh](/docs/id-ID/openapi-parser/examples/) — penanganan kesalahan, opsi, dan penggunaan CommonJS
