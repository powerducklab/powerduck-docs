---
sidebar_position: 1
title: Pengantar
description: "Powerduck adalah platform API dengan AI terintegrasi yang mengutamakan penggunaan lokal dan berpusat pada satu berkas YAML OpenAPI. Rancang, debug, uji, buat mock, dokumentasikan, dan sediakan alat MCP dari berkas yang sama melalui desktop, cloud, atau pustaka sumber terbuka."
---

# Pengantar

Cara membangun API sedang berubah. Selama dua dekade, **operatornya** adalah orang yang mengklik antarmuka grafis, sedangkan **pengguna kontrak API** adalah orang yang membaca dokumentasi. Kini kedua peran itu berubah:

- Operator semakin sering berupa **asisten AI** yang mengubah maksud menjadi tindakan;
- Pengguna kontrak semakin sering berupa **agen AI** yang memanggil API sebagai alat melalui MCP.

Alat-alat pada era sebelumnya — klien API, penampil spesifikasi, dan koleksi permintaan — dirancang untuk manusia yang bekerja di depan keyboard. Powerduck dirancang untuk kebutuhan saat ini. Powerduck bukan sekadar klien API yang lebih baik atau penampil spesifikasi yang lebih menarik, melainkan **platform dengan AI terintegrasi yang berawal dari satu berkas OpenAPI**.

## Intinya: satu berkas OpenAPI lokal

Powerduck, termasuk aplikasi desktop, mewajibkan login Google OAuth atau GitHub. Berkas tetap di disk. Analisis AI mengirim konteks terpilih ke penyedia yang dikelola Powerduck. Alamat model dan kunci API khusus tidak lagi didukung.

```text
                one local openapi.yaml
                         |
      you + AI -> design debug test mock docs data-model
                         |
                      MCP tools
                         |
               any AI coding agent
```

Berkas itulah kontraknya. Setiap alur kerja membacanya, dan berkas yang sama dapat diberikan kepada agen pemrograman AI apa pun melalui MCP. Dengan begitu, Anda, asisten bawaan, dan setiap agen eksternal berbagi satu sumber acuan. Saat desain, debugging, pengujian, mock, dan dokumentasi membaca berkas yang sama, menjaga sinkronisasi antaralat tidak lagi menjadi pekerjaan tersendiri. Ini adalah hasil dari desainnya, bukan tugas tambahan.

Powerduck menggunakan OpenAPI 3.2 dan membaca dokumen 3.0 serta 3.1 yang sudah ada, termasuk Swagger 2.0, dengan meningkatkannya langsung. API non-HTTP — SSE, WebSocket, GraphQL, gRPC, dan MCP — dimodelkan sebagai item path biasa melalui ekstensi `x-protocol`, tanpa dipaksakan ke struktur yang hanya cocok untuk REST.

## Bekerja dengan AI

- Buka berkas YAML, lalu asisten segera menyarankan hal yang dapat Anda lakukan;
- Nyatakan hasil yang diinginkan dengan bahasa sehari-hari, misalnya “buat endpoint pesanan”, “siapkan data pengujian”, atau “jalankan alur checkout dan berikan laporannya”. Asisten memilih alat yang tepat dan mengusulkan perubahan;
- Setiap perubahan ditampilkan sebagai **kartu yang dapat ditinjau**; tidak ada perubahan yang diterapkan sebelum Anda menyetujuinya;
- Saat Anda menyempurnakan satu API, asisten tetap berfokus pada API tersebut dan hanya mengubah bagian yang diminta, bukan bagian lain dalam dokumen;
- Powerduck, termasuk aplikasi desktop, mewajibkan login Google OAuth atau GitHub. Berkas tetap di disk. Analisis AI mengirim konteks terpilih ke penyedia yang dikelola Powerduck. Alamat model dan kunci API khusus tidak lagi didukung.

## Mengutamakan penggunaan lokal

Powerduck, termasuk aplikasi desktop, mewajibkan login Google OAuth atau GitHub. Berkas tetap di disk. Analisis AI mengirim konteks terpilih ke penyedia yang dikelola Powerduck. Alamat model dan kunci API khusus tidak lagi didukung.

## Tiga cara menggunakan Powerduck

| Produk | Penjelasan | Cocok untuk |
|---|---|---|
| [Desktop](../client/introduction.md) | Google OAuth / GitHub | AI Chat · Code Quality · OpenAPI |
| [**Powerduck Cloud**](/docs/id-ID/cloud/introduction/) | Layanan hosting OAS, dokumentasi online, dan MCP terkelola | Berbagi API, menerbitkan tautan stabil, dan menyediakan MCP tanpa menjalankan server sendiri |
| [**Pustaka sumber terbuka**](/docs/id-ID/opensource/) | Paket npm `@powerduck/*` yang dapat digunakan bersama | Membuat alat sendiri, pipeline CI, atau komponen yang disematkan |

Ketiganya menggunakan mesin yang sama. Klien desktop dan cloud sama-sama dibangun dari pustaka sumber terbuka, sehingga perilaku suatu kemampuan tetap sama saat dijalankan secara lokal, dipanggil melalui jaringan, atau diimpor langsung sebagai paket.

### Klien Desktop

Powerduck, termasuk aplikasi desktop, mewajibkan login Google OAuth atau GitHub. Berkas tetap di disk. Analisis AI mengirim konteks terpilih ke penyedia yang dikelola Powerduck. Alamat model dan kunci API khusus tidak lagi didukung.

### Powerduck Cloud

[Powerduck Cloud](/docs/id-ID/cloud/introduction/) membawa alur kerja yang sama ke internet. Tambahkan berkas, repositori Git, atau URL; pilih operasi yang ingin disediakan; lalu dapatkan tautan stabil untuk dokumentasi dan endpoint MCP terkelola. Akses dapat dilindungi dengan kata sandi untuk melihat dokumentasi atau kunci akses MCP. Paket berbayar menambahkan sinkronisasi Git, domain kustom, dan batas penggunaan yang lebih tinggi.

### Pustaka sumber terbuka

[Pustaka](/docs/id-ID/opensource/) adalah mesin di balik produk: parser dan alat peningkatan versi OpenAPI, CLI multiprotokol, generator kode, server MCP, pelaksana permintaan, konverter cURL dan Postman, serta editor yang dapat disematkan. Setiap pustaka diterbitkan secara terpisah di npm dengan panduan instalasi dan referensi API sendiri. Di sinilah Anda menemukan rincian teknis tingkat rendah.

## Dampaknya bagi pekerjaan Anda

- **Anda menentukan hasil, bukan urutan klik.** Jelaskan tujuan, lalu asisten menyelesaikannya melalui langkah-langkah yang dapat Anda tinjau.
- **API Anda siap digunakan agen.** Kontrak yang menghasilkan dokumentasi juga menghasilkan alat MCP, sehingga agen AI dapat memanggil API dengan benar sejak awal.
- **Semuanya tetap selaras.** Desain, debugging, pengujian, mock, dan dokumentasi membaca satu berkas.
- **Semua protokol di satu tempat.** HTTP, SSE, WebSocket, GraphQL, gRPC, dan MCP berada dalam satu spesifikasi, bukan enam alat terpisah.
- Powerduck, termasuk aplikasi desktop, mewajibkan login Google OAuth atau GitHub. Berkas tetap di disk. Analisis AI mengirim konteks terpilih ke penyedia yang dikelola Powerduck. Alamat model dan kunci API khusus tidak lagi didukung.

## Langkah berikutnya

- Baru mulai? Baca [Instalasi](/docs/id-ID/overview/installation/) dan [Panduan cepat](/docs/id-ID/overview/quickstart/).
- Ingin ruang kerja lokal yang lengkap? Baca [panduan Klien Desktop](/docs/id-ID/client/introduction/).
- Ingin memublikasikan API secara online? Baca [panduan Cloud](/docs/id-ID/cloud/introduction/).
- Sedang membangun integrasi sendiri? Jelajahi [pustaka sumber terbuka](/docs/id-ID/opensource/).
