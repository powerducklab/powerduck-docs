---
sidebar_position: 6
title: "Model data dan diagram ER"
description: "Area Model data menghubungkan kontrak API dengan database. Area ini dapat menurunkan model relasional lengkap dari skema OpenAPI, membandingkannya dengan database yang sudah ada, dan membantu menyelaraskan keduanya saat salah satunya berubah. Diagram ER memberikan gambaran menyeluruh."
---

# Model data dan diagram ER

Area Model data menghubungkan kontrak API dengan database. Area ini dapat menurunkan model relasional lengkap dari skema OpenAPI, membandingkannya dengan database yang sudah ada, dan membantu menyelaraskan keduanya saat salah satunya berubah. Diagram ER memberikan gambaran menyeluruh.

Kedua kondisi awal berikut didukung:

- **Belum ada tabel.** Turunkan semua tabel, kolom, kunci asing, dan tabel relasi langsung dari API saat ini, beserta SQL untuk membuatnya.
- **Database sudah ada.** Baca tabel aktual dan batasan kunci asing yang diterapkan, petakan terhadap model yang tersirat dari API, lalu lihat kesesuaian dan perbedaannya.

## Rekonsiliasi empat lapisan

Rekonsiliasi (`datamodel.reconcile`) menghasilkan fakta acuan dalam empat lapisan:

| Lapisan | Isi |
|---|---|
| **Teramati** | Tabel aktual tanpa pasangan dalam model, serta kunci asing yang hanya ada di database atau diterapkan sebagai batasan |
| **Dimodelkan** | Status per tabel (`missing`, `drift`, `matched`, `extra`), pasangan kolom model dan database, perbedaan tingkat kolom, operasi API yang terdampak, dan relasi yang dimodelkan |
| **Diusulkan** | Rencana migrasi tambahan yang berurutan, dengan dependensi `blockedBy` dan SQL untuk setiap langkah |
| **Disimpulkan** | Tabel penghubung banyak-ke-banyak yang diturunkan otomatis, pertanyaan terbuka, dan pemeriksaan pengaman |

Model mendasarkan setiap tabel, kolom, relasi, dan pernyataan pada hasil ini, bukan mengarang DDL.

### Status tabel

- **Belum ada (baru)**: tersirat dari API tetapi tidak ada di database;
- **Berbeda**: ada di keduanya, tetapi kolom atau batasannya berbeda;
- **Cocok**: ada dan sesuai;
- **Tambahan**: ada di database tetapi tidak tersirat dari API saat ini.

## Tabel relasi dan indeks diturunkan otomatis

Anda tidak perlu memodelkan tabel penghubung secara manual. Jika skema menyiratkan relasi banyak-ke-banyak, misalnya antara sumber daya `user` dan `product`, lapisan **disimpulkan** menurunkan tabel relasi beserta indeks yang sesuai, bukan berhenti pada dua tabel dasar. Indeks sekunder disertakan dalam SQL yang dihasilkan.

Jika logika bisnis tidak dapat disimpulkan secara pasti, hasilnya menampilkan pertanyaan terbuka alih-alih menebak. Pemeriksaan pengaman menandai bagian yang memerlukan peninjauan manusia.

## Diagram ER visual

Tampilan ER menggambarkan model sebagai graf agar relasi dan kunci asing langsung terlihat, tanpa perlu membacanya dari daftar tabel:

- Tabel menjadi simpul yang ditata otomatis untuk mengurangi garis yang berpotongan;
- Relasi kunci asing digambar sebagai koneksi;
- Status simpul mencerminkan hasil rekonsiliasi: baru, berbeda, cocok, atau tambahan;
- Panel samping menampilkan langkah migrasi konkret, yaitu `create_table`, `alter_table`, dan butir peninjauan, beserta SQL untuk tabel yang dipilih.

Anda mendapat gambaran besar skema sekaligus langkah terurut yang tepat untuk menyelaraskan database.

## Analisis dampak dua arah

Karena model mengetahui operasi API dan tabel, dampak perubahan dapat terlihat:

- **Saat API berubah**, rekonsiliasi mengidentifikasi tabel terdampak, baik tabel lama yang berbeda maupun tabel baru yang perlu ditambahkan, beserta SQL terkait;
- **Saat database berubah**, operasi yang menggunakan tabel terdampak ditandai.

Setelah mengubah salah satu sisi, Anda dapat **memperbarui dan membandingkan ulang** sampai model dan database sesuai.

## Skrip penerapan

Untuk database baru, `datamodel.deploymentScript` menghasilkan satu skrip SQL idempoten yang hanya menerapkan perubahan ke depan:

- `CREATE TABLE IF NOT EXISTS` sesuai urutan dependensi kunci asing;
- Indeks sekunder;
- Baris contoh deterministik opsional, sebanyak 0–50 dengan nilai bawaan 0; tabel relasi tidak pernah diisi.

Untuk database yang sudah ada, gunakan rekonsiliasi yang menghasilkan pernyataan `ALTER` tambahan dalam rencana migrasi berurutan.

## Koneksi database

Koneksi dikelola sebagai profil tersimpan yang memuat ID, nama, dialek, host, port, pengguna, dan database; kata sandi tidak pernah dikembalikan. Dialek yang didukung adalah **MySQL**, **SQL Server**, dan **Oracle**.

- `database.runSelect` menjalankan `SELECT` hanya-baca melalui profil tersimpan, dengan kumpulan baris yang dibatasi dan dipotong; penulisan dan DDL diblokir;
- `database.prefillConnection` membuka dialog koneksi baru dengan detail yang Anda berikan sudah terisi, sehingga Anda memasukkan kata sandi sendiri, bukan memberikannya dalam prompt.

## SQL dihasilkan, tidak pernah dijalankan otomatis

Di seluruh area ini, SQL **dihasilkan untuk ditinjau**, bukan dijalankan pada database Anda. Anda menentukan kapan dan bagaimana menerapkannya, sementara akses hanya-baca melindungi data yang ada. Anda dapat menjelajahi dan menyempurnakan model sebelum mengubah database.

Terkait: [Protokol](./protocols.md), [Ruang kerja permintaan](./debug.md), [Pengaturan](./settings.md).
