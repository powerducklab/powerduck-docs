---
sidebar_position: 5
title: Kontrol Akses
description: "Lindungi dokumentasi dengan kata sandi dan batas waktu akses, endpoint MCP dengan kunci akses, serta atur autentikasi MCP ke API hulu."
---

# Kontrol Akses

Powerduck memisahkan akses **pembaca ke dokumentasi** dari akses **klien ke endpoint MCP**, karena keduanya digunakan dengan cara berbeda. Autentikasi server MCP ke API hulu juga diatur secara terpisah.

## Urutan pemeriksaan akses

Beberapa kondisi menentukan apakah layanan publik dapat dibuka. Memahami semuanya membantu menjawab mengapa dokumen tidak dapat diakses.

1. **Status dokumen** — harus `ACTIVE`, bukan dijeda, diarsipkan, atau dihapus;
2. **Layanan aktif** — `documentationEnabled` untuk dokumentasi, `mcpEnabled` untuk MCP;
3. **Kredensial akses** — kata sandi dokumentasi atau kunci akses MCP, jika dikonfigurasi;
4. **Masa berlaku** — akses dokumentasi dapat diatur agar berakhir pada waktu tertentu.

Artefak publik dibuat otomatis setelah Anda menambahkan versi atau mengubah operasi yang diekspos. Biasanya tidak diperlukan langkah publikasi manual.

Setiap layanan berdiri sendiri: menonaktifkan MCP tidak memengaruhi dokumentasi, dan kata sandi dokumentasi tidak melindungi MCP.

## Kata sandi dokumentasi

Kata sandi melindungi dokumentasi yang dirender serta data spesifikasi yang disajikan:

- Kata sandi di-hash dengan **scrypt** dan salt acak tersendiri untuk setiap kata sandi; teks aslinya tidak disimpan;
- Jika kata sandi ditetapkan, pembaca harus memberikannya sebelum dokumen disajikan;
- Kata sandi hanya melindungi **dokumentasi**; endpoint MCP memakai kunci aksesnya sendiri dan tidak memeriksa kata sandi ini.

Anda juga dapat menetapkan **waktu kedaluwarsa akses**. Setelah waktu itu, akses ditolak meskipun kata sandinya benar. Hapus kata sandi atau waktu kedaluwarsa untuk menghilangkan pembatasan terkait.

## Kunci akses endpoint MCP

Endpoint MCP dilindungi dengan **kunci akses** tersendiri:

- Buat atau rotasi kunci: kunci lengkap hanya diberikan **sekali**; setelah itu hanya empat karakter terakhir yang ditampilkan;
- Jika kunci dikonfigurasi, setiap permintaan MCP harus menyertakannya sebagai token `Bearer`;
- Kunci dibandingkan dalam **waktu konstan**. Kunci yang tidak ada atau salah menghasilkan `401`.

Hapus kunci untuk membuka endpoint MCP tanpa kunci, dengan syarat dokumen aktif dan MCP diaktifkan.

## Autentikasi MCP ke API hulu

Terpisah dari perlindungan endpoint, Anda dapat mengatur cara server MCP melakukan autentikasi ke **API hulu** dalam spesifikasi. Jenis autentikasi yang didukung:

| `authType` | Konfigurasi |
|---|---|
| `NONE` | Tanpa autentikasi ke API hulu |
| `BEARER` | Token bearer |
| `BASIC` | Nama pengguna dan kata sandi autentikasi dasar |
| `APIKEY` | Nama dan nilai kunci API di header atau query |

Rahasia seperti token bearer, kata sandi, dan nilai kunci API dapat ditulis tetapi tidak dibaca kembali. Konfigurasi hanya menunjukkan apakah nilainya sudah diatur.

Pengaturan MCP lainnya:

- **Penggantian URL dasar** — gunakan URL dasar API hulu lain, bukan yang tercantum dalam spesifikasi;
- **Batas waktu permintaan** — waktu tunggu server MCP saat memanggil API hulu.

## Pengaturan yang disarankan

- **Dokumentasi publik:** aktifkan tanpa kata sandi untuk API terbuka, atau tetapkan kata sandi dan masa berlaku untuk berbagi secara terbatas;
- **MCP untuk agen sendiri:** aktifkan MCP dan buat kunci akses agar hanya klien Anda yang dapat memanggilnya;
- **Autentikasi hulu:** atur autentikasi server MCP sesuai persyaratan API sebenarnya, terpisah dari aturan siapa yang boleh mengakses endpoint MCP.

Terkait: [Operasi yang diekspos](/docs/id-ID/cloud/exposure/), [Dokumen dan versi](/docs/id-ID/cloud/documents-versions/), [Domain kustom](/docs/id-ID/cloud/custom-domains/).
