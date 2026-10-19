---
sidebar_position: 2
title: "Instalasi"
description: "Klien desktop Powerduck mengutamakan pekerjaan lokal. Aplikasi ini dipasang seperti program desktop biasa, membuka berkas asli di disk, dan tidak memerlukan akun untuk mulai digunakan."
---

# Instalasi

Klien desktop Powerduck mengutamakan pekerjaan lokal. Aplikasi ini dipasang seperti program desktop biasa, membuka berkas asli di disk, dan tidak memerlukan akun untuk mulai digunakan.

## Unduh

Unduh pemasang untuk platform Anda dari [situs Powerduck](https://www.powerduck.com/#download). Build berikut dibuat dengan `electron-builder`:

| Platform | Pemasang | Arsitektur |
|---|---|---|
| macOS | `.dmg` dan `.zip` untuk pembaruan otomatis | Apple Silicon (`arm64`) dan Intel (`x64`) |
| Windows | Pemasang NSIS (`.exe`) | `x64` |
| Linux | AppImage (`.AppImage`) | `x64` |

## macOS

1. Buka `.dmg` lalu seret Powerduck ke **Applications**.
2. Saat pertama dijalankan, macOS mungkin meminta konfirmasi untuk membuka aplikasi yang diunduh dari luar App Store. Pastikan aplikasi berasal dari halaman unduhan resmi sebelum membukanya; jangan nonaktifkan pemeriksaan keamanan sistem.
3. Tersedia dua build: `arm64` untuk Apple Silicon (seri M) dan `x64` untuk Mac Intel. Unduh build yang sesuai dengan komputer Anda.

## Windows

1. Jalankan pemasang NSIS (`.exe`) dan ikuti langkah pemasangannya.
2. Jika SmartScreen menampilkan penerbit yang tidak dikenal, periksa dahulu bahwa pemasang berasal dari halaman unduhan resmi. Lanjutkan hanya setelah sumbernya dipastikan; jangan abaikan peringatan untuk unduhan yang tidak tepercaya.

## Linux

1. Unduh `.AppImage`.
2. Beri izin eksekusi, lalu jalankan:

```bash
chmod +x Powerduck-*.AppImage
./Powerduck-*.AppImage
```

AppImage berjalan tanpa instalasi untuk seluruh sistem. Pada beberapa distribusi, Anda mungkin perlu memasang FUSE untuk memasangnya sebagai sistem berkas.

## Komponen yang berjalan di komputer Anda

Klien desktop adalah aplikasi Electron dengan dua bagian:

- **Proses utama** (Node.js) yang menangani akses berkas, permintaan HTTP keluar, server mock lokal, koneksi basis data, dan terminal terintegrasi;
- **Renderer** (ruang kerja React) yang menampilkan spesifikasi, percakapan AI, dan semua alat.

Transport AI desktop mengirim permintaan penyelesaian melalui proses utama sehingga pembatasan CORS antara browser dan penyedia tidak berlaku. Prompt, konteks terkait, dan kredensial tetap dikirim ke endpoint model yang Anda konfigurasi; penggunaan model terhosting bukan operasi luring. Pemisahan proses ini tidak menjamin bahwa rahasia tidak akan pernah muncul di log atau alat pengembang. Lihat [AI dan model](../client/ai-models.md).

## Persyaratan sistem

- macOS 11 atau lebih baru, Windows 10 atau lebih baru, atau distribusi desktop Linux umum yang kompatibel dengan Electron 37;
- Ruang disk yang cukup untuk aplikasi; spesifikasi yang Anda buka tetap berada di lokasi aslinya;
- Akses jaringan saat mengirim permintaan, menyinkronkan sumber Git, atau memanggil model AI terhosting; selain itu aplikasi dapat digunakan secara luring.

## Lisensi

Anda dapat mengevaluasi klien desktop tanpa batas waktu. Aplikasi dijual dengan lisensi **permanen** sekali bayar: cukup beli sekali, tanpa langganan. Kunci lisensi diterbitkan saat pembelian dan hanya ditampilkan sekali. Hosting cloud merupakan layanan berlangganan yang terpisah. Lihat [Penagihan cloud](../cloud/billing.md) untuk perbedaannya.

Berikutnya: ikuti [Panduan mulai cepat](./quickstart.md).
