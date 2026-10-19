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

Semuanya dimulai dari `openapi.yaml` biasa di repositori Anda: format terbuka, dapat dikelola dengan kontrol versi, serta dapat dibaca manusia maupun AI. Bukan basis data berpemilik atau akun cloud.

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
- Berkas lokal tetap berada di disk. AI jarak jauh mengirimkan konteks yang relevan ke layanan model yang Anda konfigurasi, menggunakan kredensial layanan tersebut. Publikasi ke Cloud mengunggah konten yang dipilih. Statistik penggunaan opsional dinonaktifkan secara default dan dikelola secara terpisah; pekerjaan lokal tidak memerlukan akun.

## Mengutamakan penggunaan lokal

Powerduck berjalan di komputer Anda, membuka dan menyimpan berkas nyata, bekerja secara offline, serta menjaga agar kunci API dan prompt tidak berada di browser. Cloud adalah perluasan opsional untuk berbagi dan memublikasikan, bukan syarat untuk memulai.

## Tiga cara menggunakan Powerduck

| Produk | Penjelasan | Cocok untuk |
|---|---|---|
| [**Klien Desktop**](/docs/id-ID/client/introduction/) | Aplikasi Electron yang mengutamakan penggunaan lokal, dengan asisten AI dan ruang kerja API lengkap | Pengembang yang ingin bekerja di komputernya sendiri, termasuk secara offline, serta menyimpan kunci dan prompt secara lokal |
| [**Powerduck Cloud**](/docs/id-ID/cloud/introduction/) | Layanan hosting OAS, dokumentasi online, dan MCP terkelola | Berbagi API, menerbitkan tautan stabil, dan menyediakan MCP tanpa menjalankan server sendiri |
| [**Pustaka sumber terbuka**](/docs/id-ID/opensource/) | Paket npm `@powerduck/*` yang dapat digunakan bersama | Membuat alat sendiri, pipeline CI, atau komponen yang disematkan |

Ketiganya menggunakan mesin yang sama. Klien desktop dan cloud sama-sama dibangun dari pustaka sumber terbuka, sehingga perilaku suatu kemampuan tetap sama saat dijalankan secara lokal, dipanggil melalui jaringan, atau diimpor langsung sebagai paket.

### Klien Desktop

[Klien desktop](/docs/id-ID/client/introduction/) berjalan sepenuhnya di komputer Anda. Aplikasi ini membuka dan mengedit berkas di disk, mengirimkan permintaan melalui proses lokal, menjalankan mock lokal, serta menjaga agar prompt AI dan kunci API tidak muncul di konsol browser. Anda bebas mengonfigurasi model, dan setiap usulan perubahan ditampilkan dalam kartu untuk ditinjau sebelum diterapkan.

### Powerduck Cloud

[Powerduck Cloud](/docs/id-ID/cloud/introduction/) membawa alur kerja yang sama ke internet. Tambahkan berkas, repositori Git, atau URL; pilih operasi yang ingin disediakan; lalu dapatkan tautan stabil untuk dokumentasi dan endpoint MCP terkelola. Akses dapat dilindungi dengan kata sandi untuk melihat dokumentasi atau kunci akses MCP. Paket berbayar menambahkan sinkronisasi Git, domain kustom, dan batas penggunaan yang lebih tinggi.

### Pustaka sumber terbuka

[Pustaka](/docs/id-ID/opensource/) adalah mesin di balik produk: parser dan alat peningkatan versi OpenAPI, CLI multiprotokol, generator kode, server MCP, pelaksana permintaan, konverter cURL dan Postman, serta editor yang dapat disematkan. Setiap pustaka diterbitkan secara terpisah di npm dengan panduan instalasi dan referensi API sendiri. Di sinilah Anda menemukan rincian teknis tingkat rendah.

## Dampaknya bagi pekerjaan Anda

- **Anda menentukan hasil, bukan urutan klik.** Jelaskan tujuan, lalu asisten menyelesaikannya melalui langkah-langkah yang dapat Anda tinjau.
- **API Anda siap digunakan agen.** Kontrak yang menghasilkan dokumentasi juga menghasilkan alat MCP, sehingga agen AI dapat memanggil API dengan benar sejak awal.
- **Semuanya tetap selaras.** Desain, debugging, pengujian, mock, dan dokumentasi membaca satu berkas.
- **Semua protokol di satu tempat.** HTTP, SSE, WebSocket, GraphQL, gRPC, dan MCP berada dalam satu spesifikasi, bukan enam alat terpisah.
- **Tanpa ketergantungan pada satu penyedia.** Pilih model Anda sendiri, simpan kunci secara lokal di desktop, dan tetap kuasai berkas YAML di repositori Anda.

## Langkah berikutnya

- Baru mulai? Baca [Instalasi](/docs/id-ID/overview/installation/) dan [Panduan cepat](/docs/id-ID/overview/quickstart/).
- Ingin ruang kerja lokal yang lengkap? Baca [panduan Klien Desktop](/docs/id-ID/client/introduction/).
- Ingin memublikasikan API secara online? Baca [panduan Cloud](/docs/id-ID/cloud/introduction/).
- Sedang membangun integrasi sendiri? Jelajahi [pustaka sumber terbuka](/docs/id-ID/opensource/).
