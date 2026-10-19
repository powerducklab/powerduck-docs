---
sidebar_position: 2
title: Mulai cepat dengan Cloud
description: "Masuk, tambahkan spesifikasi dari unggahan, Git, atau URL, pilih operasi yang tersedia, lalu buka tautan dokumentasi dan MCP."
---

# Mulai cepat dengan Cloud

Panduan ini membawa spesifikasi dari komputer Anda menjadi halaman dokumentasi yang dapat dibagikan dan endpoint MCP.

## 1. Masuk

Pada halaman masuk, lanjutkan dengan **Google** atau **GitHub**. Setelah autentikasi OAuth, Powerduck membuat sesinya sendiri dan membuka konsol. Organisasi pribadi dibuat secara otomatis.

## 2. Tambahkan spesifikasi

Dari dasbor, tambahkan spesifikasi melalui salah satu sumber yang didukung:

- **Unggah file** — unggah file OpenAPI secara langsung;
- **Repositori Git** — tentukan repositori, lalu pilih cabang dan jalur file;
- **URL** — impor spesifikasi dari URL.

Dokumen OpenAPI 3.0/3.1 dan Swagger yang sudah ada akan ditingkatkan. Masukan cURL atau Postman dapat dikonversi untuk ditinjau sebelum disimpan.

### Cara kerja unggahan langsung

File besar diunggah langsung ke penyimpanan objek, bukan diteruskan melalui server API:

1. Dokumen dibuat;
2. aplikasi meminta **URL unggahan** dengan menyertakan jenis konten dan ukurannya;
3. file diunggah langsung ke penyimpanan melalui URL yang telah ditandatangani;
4. unggahan **diselesaikan**, lalu versi dan SHA-256-nya dicatat.

Dengan begitu, muatan besar tidak perlu melewati server API.

## 3. Pilih operasi yang akan tersedia

Setelah spesifikasi ditambahkan, pilih operasi yang akan tersedia untuk umum. Setiap operasi dapat diaktifkan atau dinonaktifkan secara terpisah tanpa mengubah dokumen sumber. Mulailah dari semua operasi, lalu keluarkan endpoint internal atau administratif yang tidak ingin Anda publikasikan.

## 4. Buka tautan

Ruang kerja dokumen menampilkan alamat publik setelah dokumen aktif:

- **Dokumentasi** — dokumentasi API yang dirender di penampil publik;
- **MCP** — endpoint MCP terkelola dengan Streamable HTTP;
- spesifikasi mentah juga tersedia pada URL yang stabil.

Secara bawaan, dokumentasi aktif dan hanya dilindungi jika Anda menambahkan kata sandi. Ketersediaan MCP dan kunci aksesnya dikonfigurasi secara terpisah.

## 5. Lindungi akses bila diperlukan

- Tambahkan **kata sandi untuk melihat dokumentasi**, dengan waktu kedaluwarsa opsional;
- buat **kunci akses MCP** untuk endpoint MCP;
- jeda dokumen untuk menonaktifkan keduanya sementara.

## 6. Lanjutkan dengan versi baru

Saat API berubah, unggah konten baru sebagai versi baru, bukan menimpa versi lama. Tautan berbagi dapat mengarah ke dokumen terkini atau dikunci ke versi tertentu, sehingga isi tautan versi tertentu tidak berubah bagi pembaca.

## Langkah berikutnya

- [Dokumen dan versi](/docs/id-ID/cloud/documents-versions/)
- [Operasi yang tersedia](/docs/id-ID/cloud/exposure/)
- [Kontrol akses](/docs/id-ID/cloud/access-control/)
- [Domain kustom](/docs/id-ID/cloud/custom-domains/)
