---
sidebar_position: 1
title: "Powerduck Cloud"
description: "Powerduck Cloud mengubah berkas OpenAPI menjadi sesuatu yang dapat **dibagikan**. Tambahkan spesifikasi, pilih operasi yang ingin ditampilkan, lalu bagikan tautan tetap ke dokumentasi dan server MCP terkelola, tanpa perlu menghosting atau menjalankan layanan tersebut sendiri."
---

# Powerduck Cloud

Powerduck Cloud mengubah berkas OpenAPI menjadi sesuatu yang dapat **dibagikan**. Tambahkan spesifikasi, pilih operasi yang ingin ditampilkan, lalu bagikan tautan tetap ke dokumentasi dan server MCP terkelola, tanpa perlu menghosting atau menjalankan layanan tersebut sendiri.

Alur kerjanya sama dengan klien desktop: berpusat pada kontrak API dan dibantu AI, tetapi tersedia secara daring untuk tim dan pengguna API. Paket Free mencakup hosting dokumentasi dan MCP sesuai batasnya; paket berbayar menambah kapasitas, sumber Git, dan domain kustom. API aplikasi Anda tetap berjalan di backend Anda sendiri.

## Alur penggunaan

1. **Tambahkan spesifikasi** dengan mengunggah berkas, memilih repositori Git, atau menempelkan URL. Anda bahkan dapat memulai dari situs web dan masuk ke akun saat sudah siap, tanpa mengunggah berkas dua kali.
2. **Pilih operasi yang ingin ditampilkan.** Aktifkan atau nonaktifkan setiap operasi secara terpisah; berkas asli tidak pernah diubah.
3. **Langsung buka tautan dokumentasi.** Dokumentasi API sudah diaktifkan secara bawaan. Endpoint MCP terkelola dapat diaktifkan dengan satu sakelar dan tetap nonaktif sampai Anda memilih untuk menyediakan alat bagi agen.
4. **Atur akses.** Tambahkan kata sandi dan masa berlaku untuk melihat dokumentasi, serta kunci akses MCP terpisah bagi agen.
5. **Publikasikan dan bagikan.** Publikasikan artefak siap pakai untuk versi saat ini agar tautannya dapat diakses; pengaturan lanjutan tetap mudah dijangkau.
6. **Jaga agar tetap mutakhir.** Setiap perubahan membuat versi baru yang dapat dibandingkan atau dipulihkan; sumber Git dapat disinkronkan saat diperbarui.
7. **Kelola siklus hidup.** Jeda, lanjutkan, atau arsipkan dokumen; lihat status, versi, dan sumbernya dengan cepat.

## Fitur yang tersedia

- **Tautan dokumentasi tetap** yang masih dapat diakses saat Anda menerbitkan versi baru;
- **Endpoint MCP terkelola** agar agen AI milik pengguna lain dapat menemukan dan memanggil operasi yang Anda pilih;
- **Pengaturan per operasi** agar endpoint internal atau yang belum selesai tidak tersedia melalui antarmuka publik;
- **Kontrol akses** dengan kata sandi untuk melihat dokumentasi, masa berlaku, dan kunci akses MCP;
- **Riwayat versi** dengan perbandingan dan pemulihan, tanpa menimpa versi asli;
- **Sinkronisasi Git** untuk membuat versi hosting baru dari pembaruan repositori;
- **Domain kustom**, termasuk konfigurasi subjalur, untuk pengalaman yang sesuai dengan merek Anda.

### Satu dokumen, banyak versi

Setiap penyuntingan membuat versi baru alih-alih menimpa versi asli. Anda dapat membandingkan versi, kembali ke versi sebelumnya, serta menerbitkan ulang dokumentasi dan MCP dari keadaan yang diketahui. Dokumentasi dan MCP selalu terikat pada dokumen dan versi tertentu, bukan versi “terbaru” yang tidak jelas.

### Mengapa tautan mungkin tidak terbuka

Tautan dokumentasi atau MCP dapat diakses jika tiga syarat terpenuhi. Ruang kerja dokumen menampilkan ketiganya dan menyoroti syarat pertama yang belum terpenuhi:

1. Dokumen **aktif**: menjedanya akan menonaktifkan dokumentasi dan MCP sekaligus;
2. Layanan yang dibagikan **diaktifkan**: dokumentasi dan MCP memiliki sakelar masing-masing; secara bawaan dokumentasi aktif dan MCP nonaktif;
3. Artefak terkini sudah **dipublikasikan**: artefak dibuat otomatis setelah Anda menambah versi atau mengubah operasi yang ditampilkan, sehingga biasanya tidak perlu tindakan tambahan; publikasi manual tersedia jika diperlukan.

Pemeriksaan akses berupa kata sandi, masa berlaku, atau kunci akses MCP berlaku di samping ketiga syarat tersebut.

## Masuk dan kepemilikan

Masuk dengan **Google** atau **GitHub**. Setelah proses OAuth selesai, Powerduck membuat sesinya sendiri menggunakan cookie aman dan HttpOnly; token penyedia tidak digunakan sebagai identitas jangka panjang Anda. Semua sumber daya dimiliki oleh **organisasi**. Organisasi pribadi dibuat otomatis, dan nantinya tim dapat berbagi organisasi tanpa merancang ulang sistem.

## Konsol

- **Dasbor**: tambahkan spesifikasi dan lihat dokumen terbaru, dengan tautan cepat serta tindakan mulai dan berhenti;
- **Proyek**: atur dokumen;
- **Ruang kerja dokumen**: status, dokumentasi, MCP, operasi yang ditampilkan, versi, sumber, dan domain dalam bagian berlabel yang jelas;
- **Penagihan**: status langganan dan pesanan ditampilkan secara terpisah;
- **Hub**: publikasikan dan telusuri dokumentasi serta server MCP publik;
- **Pengaturan** dan **Aktivitas**: profil, preferensi, dan log audit.

Pembaca publik menggunakan penampil dokumentasi khusus dan tidak memerlukan akun Powerduck. Jika kata sandi untuk melihat dokumen diatur, mereka harus memasukkannya; kata sandi dokumen dan proses masuk ke akun merupakan persyaratan yang berbeda.

## Cloud dan klien desktop

| | Klien desktop | Cloud |
|---|---|---|
| Tempat berjalan | Di komputer Anda | Di layanan hosting |
| Model pembayaran | Lisensi permanen dengan pembayaran sekali | Paket gratis dan langganan berbayar |
| Yang diperoleh | Kunci lisensi, ditampilkan sekali | Hak penggunaan paket, tanpa kunci lisensi |
| Paling sesuai untuk | Ruang kerja lengkap secara lokal dan luring | Berbagi dan menerbitkan secara daring |

Keduanya saling melengkapi. Cloud menyediakan paket Free; langganan Cloud berbayar dan lisensi desktop dibeli secara terpisah. Lihat [Penagihan](./billing.md).

## Mulai di sini

- [Panduan mulai cepat Cloud](./quickstart.md)
- [Dokumen dan versi](./documents-versions.md)
- [Operasi yang ditampilkan](./exposure.md)
- [Kontrol akses](./access-control.md)
- [Domain kustom](./custom-domains.md)
- [Penagihan](./billing.md)
