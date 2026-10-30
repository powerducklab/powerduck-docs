---
sidebar_position: 2
title: "Instalasi"
description: "Powerduck · Google OAuth / GitHub · Free / Pro / Max"
---

# Instalasi

Powerduck, termasuk aplikasi desktop, mewajibkan login Google OAuth atau GitHub. Berkas tetap di disk. Analisis AI mengirim konteks terpilih ke penyedia yang dikelola Powerduck. Alamat model dan kunci API khusus tidak lagi didukung.

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

Powerduck, termasuk aplikasi desktop, mewajibkan login Google OAuth atau GitHub. Berkas tetap di disk. Analisis AI mengirim konteks terpilih ke penyedia yang dikelola Powerduck. Alamat model dan kunci API khusus tidak lagi didukung.

## Persyaratan sistem

- macOS 11 atau lebih baru, Windows 10 atau lebih baru, atau distribusi desktop Linux umum yang kompatibel dengan Electron 37;
- Ruang disk yang cukup untuk aplikasi; spesifikasi yang Anda buka tetap berada di lokasi aslinya;
- Powerduck, termasuk aplikasi desktop, mewajibkan login Google OAuth atau GitHub. Berkas tetap di disk. Analisis AI mengirim konteks terpilih ke penyedia yang dikelola Powerduck. Alamat model dan kunci API khusus tidak lagi didukung.

## Powerduck · Free / Pro / Max

Free: 300.000 credits per hari, direset pukul 00:00 UTC. Pro: $39/bulan dan 18.000.000 credits setiap 7 hari. Max: $99/bulan dan 60.000.000 credits setiap 7 hari. Siklus dimulai dari awal langganan pertama, terpisah dari tagihan bulanan. Sisa credits tidak diakumulasi. Desktop dan AI Chat memakai paket akun pribadi yang sama; lisensi permanen dan kunci aktivasi tidak lagi dijual.

Berikutnya: ikuti [Panduan mulai cepat](./quickstart.md).
