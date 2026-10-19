---
sidebar_position: 1
title: "Pengantar"
description: "Komponen dokumentasi OpenAPI untuk React yang siap produksi. Berikan dokumen OAS untuk mendapatkan antarmuka dokumentasi API bergaya Stripe dengan navigasi header, tema terang dan gelap, pohon navigasi, pelacakan gulir, penjelajahan skema, dan contoh kode dalam berbagai bahasa."
keywords: ["oas-document", "powerduck", "React", "OpenAPI"]
---

# @powerduck/oas-document

Komponen dokumentasi OpenAPI untuk React yang siap produksi. Berikan dokumen OAS untuk mendapatkan antarmuka dokumentasi API bergaya Stripe dengan navigasi header, tema terang dan gelap, pohon navigasi, pelacakan gulir, penjelajahan skema, dan contoh kode dalam berbagai bahasa.

- **Nama paket:** `@powerduck/oas-document`
- **Versi:** <img src="https://img.shields.io/npm/v/@powerduck/oas-document"/>
- **Lisensi:** MIT

Pustaka yang digunakan: `@powerduck/openapi-parser` (validasi dan konversi otomatis), `@powerduck/tree` (navigasi), `@powerduck/md-editor` (rendering Markdown), `@powerduck/openapi-codegen` (pembuatan kode permintaan).

## Fitur

- **Dokumentasi API siap pakai** — Menerima objek yang sudah diurai, string JSON, atau string YAML
- **Tata letak bergaya Stripe** — Header yang dapat dikonfigurasi, pohon sidebar, dan tampilan operasi dua kolom
- **Tema terang dan gelap** — Beralih melalui header, pilihan disimpan di localStorage
- **Konversi otomatis ke OAS 3.2** — Memvalidasi dan mengonversi melalui `@powerduck/openapi-parser`
- **Navigasi yang mengikuti gulir** — Listener gulir pasif dengan pencarian biner
- **rendering Markdown** — Deskripsi ditampilkan melalui `@powerduck/md-editor`
- **Contoh kode dalam berbagai bahasa** — Dihasilkan melalui `@powerduck/openapi-codegen`
- **Penjelajahan skema** — Tabel properti bertingkat yang dapat diperluas dan diciutkan
- **Tata letak responsif** — Sidebar berubah menjadi panel overlay di perangkat seluler

## Langkah berikutnya

- [Instalasi](/docs/id-ID/oas-document/installation/)
- [Panduan cepat](/docs/id-ID/oas-document/quickstart/)
- [Referensi API](/docs/id-ID/oas-document/api-reference/)
- [Contoh](/docs/id-ID/oas-document/examples/)
