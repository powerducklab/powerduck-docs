---
sidebar_position: 1
title: "Pengantar"
description: "Komponen pohon yang dapat diperluas untuk navigasi API, penjelajahan skema, dan dokumentasi. Dibangun di atas inti generik dengan adaptor untuk OpenAPI, JSON Schema, dan sumber data khusus."
keywords: ["tree", "powerduck", "React", "OpenAPI", "JSON Schema"]
---

# @powerduck/tree

Komponen pohon yang dapat diperluas untuk navigasi API, penjelajahan skema, dan dokumentasi. Dibangun di atas inti generik dengan adaptor untuk OpenAPI, JSON Schema, dan sumber data khusus.

- **Nama paket:** `@powerduck/tree`
- **Versi:** <img src="https://img.shields.io/npm/v/@powerduck/tree"/>
- **Lisensi:** MIT

## Fitur

- **Inti generik** — `TreeNode<TMetadata>` bekerja dengan sumber data apa pun
- **Adaptor OpenAPI** — Navigasi berbasis tag dengan tag bertingkat OAS 3.2, `x-tagGroups`, `x-order`, `x-displayName`, dan `x-internal`
- **Adaptor JSON Schema** — Perluasan mendalam properti bertingkat, array, dan kombinator dengan metadata `jsonPath`
- **Adaptor dokumentasi** — Pohon dokumentasi bergaya Stripe dengan lencana jumlah operasi
- **Komponen React** — Pencarian, perluasan dan penciutan, navigasi keyboard, lencana metode, dan render props khusus
- **Seret dan lepas** — Mengubah urutan di bawah induk yang sama dan memindahkan ke folder pada tingkat lain
- **Menu konteks** — Tindakan per simpul melalui klik kanan atau tombol lainnya
- **Pencarian lokasi imperatif** — `locateNode(predicate)` mencari simpul, membuka leluhurnya, memilihnya, dan menggulirnya ke area tampilan
- **Integrasi JSON Patch** — Callback `onPatch` mengirim operasi RFC 6902
- **Tema variabel CSS** — Kompatibel dengan `tokens.css` Powerduck serta mode terang dan gelap

## Langkah berikutnya

- [Instalasi](/docs/id-ID/tree/installation/)
- [Panduan cepat](/docs/id-ID/tree/quickstart/)
- [Referensi API](/docs/id-ID/tree/api-reference/)
- [Contoh](/docs/id-ID/tree/examples/)
