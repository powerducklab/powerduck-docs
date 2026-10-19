---
sidebar_position: 7
title: "Penagihan dan lisensi"
description: "Powerduck menawarkan **dua produk berbeda dengan dua model pembayaran berbeda**. Membedakan keduanya adalah hal utama dalam memahami penagihan."
---

# Penagihan dan lisensi

Powerduck menawarkan **dua produk berbeda dengan dua model pembayaran berbeda**. Membedakan keduanya adalah hal utama dalam memahami penagihan.

| | Klien desktop | Powerduck Cloud |
|---|---|---|
| Yang dibeli | Aplikasi desktop | Layanan hosting |
| Model | Pembelian sekali | Paket gratis atau langganan berbayar |
| Masa berlaku | Permanen: lisensi tetap menjadi milik Anda | Akses gratis atau periode penagihan berbayar |
| Yang diterima | **Kunci lisensi**, ditampilkan sekali | Hak penggunaan paket, **tanpa kunci** |
| Dapat digunakan luring | Ya | Tidak: ini layanan hosting |

Pembelian Cloud tidak pernah menghasilkan kunci lisensi, dan pembelian aplikasi desktop bukan langganan.

## Lisensi desktop permanen

Klien desktop dibeli sekali dan dimiliki secara permanen, tanpa perpanjangan atau periode penagihan. Saat pembelian, kunci lisensi dibuat:

- Kunci dibuat dari byte acak yang aman secara kriptografis dalam format `PDC-XXXX-XXXX-…`, bukan dari ID berurutan atau stempel waktu;
- Kunci asli ditampilkan **sekali**;
- Database hanya menyimpan **hash SHA-256** kunci dan empat karakter terakhirnya, sehingga kunci asli tidak dapat dipulihkan dari database.

### Status lisensi

Lisensi memiliki empat kemungkinan status:

| Status | Arti |
|---|---|
| `ISSUED` | Sudah dibuat tetapi belum diaktifkan |
| `ACTIVE` | Sudah diaktifkan dan dapat digunakan |
| `SUSPENDED` | Tidak dapat digunakan sementara; dapat diaktifkan kembali |
| `REVOKED` | Dicabut secara permanen; tidak dapat diaktifkan kembali |

“Permanen” berarti tidak kedaluwarsa berdasarkan jadwal, bukan berarti lisensi tidak pernah dapat ditangguhkan atau dicabut.

### Aktivasi dan audit

Aktivasi memvalidasi format kunci, menghitung hash, mencari hash tersebut, memeriksa status, lalu mengaitkan lisensi dalam satu transaksi. Frekuensi permintaan ke endpoint aktivasi dibatasi untuk menghambat percobaan menebak kunci secara sistematis.

Setiap perubahan status kunci dicatat sebagai peristiwa lisensi: dibuat, diaktifkan, ditangguhkan, diaktifkan kembali, atau dicabut. Dengan demikian, seluruh siklus hidupnya dapat diaudit.

## Paket dan langganan Cloud

Cloud menawarkan **paket Free** dan langganan berbayar tanpa kunci lisensi. Harga tahunan di bawah adalah nilai setara bulanan yang ditagihkan per tahun:

| Paket | Bulanan | Ditagihkan tahunan |
|---|---|---|
| Free | $0 | $0 |
| Pro | US$19/bulan | US$15/bulan |
| Team | US$49/bulan | US$39/bulan |

Langganan berstatus `ACTIVE` yang masih dalam periode berjalan memberikan fitur paket tersebut. Masa tenggang perpanjangan tiga hari mengatasi kemungkinan jeda saat perpanjangan; setelah itu hak akses kembali ke paket Free. Lisensi desktop tidak pernah digunakan untuk menentukan fitur Cloud.

### Yang diatur oleh paket

Paket tidak diterapkan dengan menanam nama paket di berbagai bagian kode. Setiap paket memiliki **hak penggunaan** berupa fitur boolean dan kuota numerik, yang diperiksa melalui satu layanan hak penggunaan:

| Fitur | Free | Pro | Team |
|---|---|---|---|
| Hosting OAS | Ya | Ya | Ya |
| Sumber Git | Tidak | Ya | Ya |
| Dokumentasi | Ya | Ya | Ya |
| MCP | Ya | Ya | Ya |
| Domain kustom | Tidak | Ya | Ya |
| Jumlah maksimum dokumen | 3 | 100 | 1,000 |
| Jumlah maksimum versi | 20 | 200 | 1,000 |
| Ukuran maksimum berkas | 1 MiB | 10 MiB | 50 MiB |
| Jumlah maksimum operasi yang ditampilkan | 10 | 1,000 | 10,000 |
| Jumlah maksimum anggota | 1 | 1 | 10 |

## Penyedia pembayaran

Pembayaran diarahkan berdasarkan wilayah agar pelanggan melihat penyedia yang familier. Kedua penyedia **tidak pernah ditampilkan bersamaan**:

- **Antom**: Tiongkok daratan, Hong Kong, Makau, Taiwan, dan Asia Tenggara;
- **Paddle**: Amerika Serikat, Kanada, Eropa, Jepang, Korea, Australia, Selandia Baru, dan Britania Raya.

Negara diperkirakan dari zona waktu klien atau header `Accept-Language`; database GeoIP eksternal tidak diperlukan. Jika wilayah tidak dapat ditentukan, **Antom digunakan sebagai pilihan cadangan**. Penyedia juga dapat ditetapkan melalui konfigurasi agar operator dapat segera beralih ke saluran cadangan jika terjadi gangguan.

Pembayaran dikonfirmasi melalui webhook bertanda tangan dari penyedia, dengan endpoint terpisah untuk Paddle dan Antom, bukan dengan memercayai halaman kembali di browser.

## Produk mana yang sebaiknya dipilih?

- Ingin ruang kerja lokal lengkap, penggunaan luring, dan kepemilikan permanen? Beli **lisensi desktop** sekali.
- Ingin menerbitkan dokumentasi dan MCP secara daring serta berbagi tautan tetap? Mulailah dengan **Cloud Free**. Pilih **Pro** untuk kuota lebih besar, sumber Git, dan domain kustom, atau **Team** untuk beberapa anggota.
- Banyak tim menggunakan keduanya: merancang dan menguji secara lokal di klien, lalu menghosting API yang dipublikasikan di Cloud.

Terkait: [Pengantar Cloud](./introduction.md), [Klien desktop](../client/introduction.md).
