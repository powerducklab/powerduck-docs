---
sidebar_position: 1
title: "Pustaka sumber terbuka"
description: "Paket npm @powerduck/* menjadi dasar klien desktop dan Cloud: penguraian, peningkatan versi, CLI multiprotokol, pembuatan kode, MCP, permintaan, konversi, serta editor dan penampil yang dapat disematkan."
---

# Pustaka sumber terbuka

Powerduck dibangun dari paket npm kecil yang dapat digabungkan. Klien desktop dan layanan cloud memakai pustaka yang sama, sehingga komponen yang sama dapat berjalan secara lokal, melalui jaringan, atau di dalam alat Anda sendiri.

Setiap paket diterbitkan secara mandiri dengan panduan instalasi, referensi API, dan contoh masing-masing. Halaman ini menjelaskan fungsi dan hubungan antar paket.

## Susunan lapisan

```text
Powerduck / Cloud
        ↓
Antarmuka yang dapat disematkan
        ↓
Alur kerja
        ↓
Dasar
```

Parser dan konverter membentuk dasar. Alur kerja dibangun di atasnya, lalu antarmuka yang dapat disematkan berada di lapisan teratas. Dasar bersama menjaga perilaku konsisten tanpa mengimplementasikan ulang penguraian pada setiap paket.

## Daftar paket

### Dasar

| Paket | Kegunaan |
|---|---|
| [`@powerduck/openapi-parser`](../openapi-parser/introduction.md) | Mengurai, memvalidasi, dan meningkatkan versi dokumen OpenAPI/Swagger |
| [`@powerduck/conf-patch`](../conf-patch/introduction.md) | Menerapkan perubahan konfigurasi terstruktur dan tervalidasi |
| [`@powerduck/x-to-openapi`](../x-to-openapi/introduction.md) | Mengonversi format lain, seperti cURL dan Postman, menjadi OpenAPI |

### Alur kerja

| Paket | Kegunaan |
|---|---|
| [`@powerduck/openapi-cli`](../openapi-cli/introduction.md) | Alur kerja multiprotokol melalui baris perintah, termasuk menjalankan skenario |
| [`@powerduck/openapi-codegen`](../openapi-codegen/introduction.md) | Membuat kode klien dan artefak lain dari spesifikasi |
| [`@powerduck/openapi-mcp-server`](../openapi-mcp-server/introduction.md) | Menyediakan spesifikasi OpenAPI sebagai server MCP |
| [`@powerduck/openapi-request`](../openapi-request/introduction.md) | Menjalankan permintaan yang dijelaskan dalam spesifikasi |

### Antarmuka yang dapat disematkan

| Paket | Kegunaan |
|---|---|
| [`@powerduck/oas-document`](../oas-document/introduction.md) | Merender OpenAPI sebagai dokumentasi yang mudah dibaca, termasuk entri React |
| [`@powerduck/md-editor`](../md-editor/introduction.md) | Editor Markdown yang dapat disematkan |
| [`@powerduck/schema-editor`](../schema-editor/introduction.md) | Editor JSON Schema yang dapat disematkan |
| [`@powerduck/tree`](../tree/introduction.md) | Komponen pohon untuk data terstruktur |
| [`@powerduck/workspace-yaml`](../workspace-yaml/introduction.md) | Integrasi YAML ruang kerja |

## Memilih paket yang tepat

- **Membaca, memvalidasi, atau meningkatkan versi berkas OpenAPI:** mulai dengan `openapi-parser`.
- **Mengubah cURL atau koleksi Postman menjadi OpenAPI:** gunakan `x-to-openapi`.
- **Menjalankan skenario atau alur multiprotokol melalui baris perintah atau CI:** gunakan `openapi-cli`.
- **Membuat kode klien:** gunakan `openapi-codegen`.
- **Menyediakan API sebagai alat untuk agen AI:** gunakan `openapi-mcp-server`.
- **Menyematkan dokumentasi yang dirender dalam aplikasi React:** gunakan `oas-document`, entri React, dan CSS-nya.
- **Menyematkan editor:** gunakan `md-editor` atau `schema-editor`.

## Berbagi kemampuan dengan agen

Paket server MCP juga memungkinkan agen AI eksternal menggunakan kemampuan Powerduck. Spesifikasi yang disediakan melalui `openapi-mcp-server` mengekspos operasinya sebagai alat MCP. Kontrak yang sama untuk dokumentasi dan pembuatan kode dapat dipanggil langsung oleh agen. Dengan demikian, klien desktop, Cloud, dan alat lain yang kompatibel dengan MCP memakai definisi acuan yang sama.

## Tentang contoh

Contoh kode ditulis berdasarkan API paket yang sebenarnya dan dimaksudkan untuk dijalankan sebagaimana ditampilkan. Setelah meningkatkan versi paket, lihat catatan rilis untuk parameter terbaru, bukan menyalin cuplikan versi lama.

Gunakan bilah samping untuk melihat instalasi, konfigurasi, dan referensi API lengkap setiap paket.
