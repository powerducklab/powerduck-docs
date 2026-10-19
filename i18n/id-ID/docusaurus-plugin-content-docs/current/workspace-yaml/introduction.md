---
sidebar_position: 1
title: "Pengantar"
description: "Inisialisasi berkas workspace.yaml dan YAML OpenAPI 3.2 secara andal. Aman digunakan di browser: fungsi murni menghasilkan string konten YAML tanpa mengakses sistem berkas. Pada Node.js / Electron, menambahkan penulisan atomik, penguncian berkas, dan normalisasi jalur ke lapisan inti."
keywords: ["workspace-yaml", "powerduck", "YAML", "OpenAPI"]
---

# @powerduck/workspace-yaml

Inisialisasi berkas workspace.yaml dan YAML OpenAPI 3.2 secara andal.

Arsitektur dua lapisan:
- **Lapisan inti**: Aman digunakan di browser: fungsi murni menghasilkan string konten YAML tanpa mengakses sistem berkas.
- **Lapisan berkas**: Pada Node.js / Electron, menambahkan penulisan atomik, penguncian berkas, dan normalisasi jalur ke lapisan inti.

- **Nama paket:** `@powerduck/workspace-yaml`
- **Versi:** <img src="https://img.shields.io/npm/v/@powerduck/workspace-yaml"/>
- **Lisensi:** MIT

Pustaka ini **hanya menginisialisasi berkas**, untuk pembuatan berkas baru atau pembuatan manual. Pustaka ini **tidak** mengimplementasikan ulang pembacaan, penerapan patch, atau pembaruan berkas YAML. Untuk operasi tersebut, gunakan [`@powerduck/conf-patch`](https://www.npmjs.com/package/@powerduck/conf-patch).

## Langkah berikutnya

- [Instalasi](/docs/id-ID/workspace-yaml/installation/)
- [Panduan cepat](/docs/id-ID/workspace-yaml/quickstart/)
- [Referensi API](/docs/id-ID/workspace-yaml/api-reference/)
- [Contoh](/docs/id-ID/workspace-yaml/examples/)
