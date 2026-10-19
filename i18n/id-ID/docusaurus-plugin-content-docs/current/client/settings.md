---
sidebar_position: 9
title: "Pengaturan"
description: "Pengaturan klien desktop mencakup tampilan aplikasi dan cara mengirim permintaan. Preferensi aplikasi terpisah dari perubahan dokumen API, sehingga mengganti tema atau mengatur proxy tidak mengubah kontrak."
---

# Pengaturan

Pengaturan klien desktop mencakup tampilan aplikasi dan cara mengirim permintaan. Preferensi aplikasi terpisah dari perubahan dokumen API, sehingga mengganti tema atau mengatur proxy tidak mengubah kontrak.

## Tampilan

- **Tema** — beralih antara terang dan gelap (`theme.get`, `theme.set`). Pilihan diterapkan ke seluruh aplikasi dan disimpan.
- **Bahasa antarmuka** — pilih satu dari enam belas bahasa atau ikuti bahasa sistem secara otomatis:

| | | |
|---|---|---|
| English (US) | 简体中文 | 繁體中文 |
| 日本語 | 한국어 | Français |
| Deutsch | Español | Português (Brasil) |
| العربية | Italiano | Русский |
| हिन्दी | Bahasa Indonesia | Tiếng Việt |
| Türkçe | | |

Bahasa Arab ditampilkan dari kanan ke kiri. Pilihan `auto` mengikuti bahasa sistem.

## Perilaku permintaan

Pengaturan ini mengontrol permintaan keluar dari ruang kerja Permintaan dan skenario:

- **Batas waktu permintaan** (`requestTimeoutMs`) — dalam milidetik; `0` berarti tanpa batas;
- **SSL ketat** (`strictSSL`) — memverifikasi sertifikat TLS; nonaktifkan untuk bekerja dengan sertifikat yang ditandatangani sendiri atau tidak tepercaya;
- **Ikuti pengalihan** (`followRedirects`) dan **pengalihan maksimum** (`maxRedirects`);
- **Versi HTTP** (`protocolVersion`) — `http1`, `http2`, atau `auto`;
- **Nonaktifkan cookie** (`disableCookies`) — mematikan penanganan cookie pada permintaan.

## Proxy

Konfigurasikan proxy keluar dengan memilih mode (`off`, `system`, atau `custom`):

- `off` — tanpa proxy;
- `system` — mengikuti proxy sistem operasi;
- `custom` — memakai URL proxy, dengan nama pengguna, kata sandi, dan daftar pengecualian opsional.

Daftar pengecualian menerima host dan pola, seperti `localhost,127.0.0.1` serta host dengan wildcard. Kata sandi proxy dapat ditulis tetapi tidak dikembalikan saat dibaca; nilai kosong menghapusnya.

## TLS dan sertifikat klien

Untuk lingkungan dengan otoritas kepercayaan khusus atau TLS dua arah:

- **CA khusus** — aktifkan sertifikat CA dan masukkan jalurnya agar permintaan memercayai akar internal atau yang ditandatangani sendiri;
- **Sertifikat klien (mTLS)** — atur sertifikat per host, berupa pasangan sertifikat/kunci atau berkas PFX, dengan frasa sandi opsional. Host dan port membatasi penggunaannya.

Sertifikat dapat ditambahkan, dihapus berdasarkan ID, atau dibersihkan seluruhnya. Frasa sandi hanya dapat ditulis dan tidak pernah dikembalikan.

## Terminal terintegrasi

Aplikasi memiliki panel terminal di bagian bawah:

- `terminal.open` menampilkan panel; kirim `{"cwd":"document"}` untuk membukanya di folder dokumen aktif, yang diselesaikan aplikasi menjadi jalur absolut sebenarnya;
- `terminal.run` mengetik dan menjalankan satu perintah shell eksplisit setelah kartu konfirmasi.

Perintah hanya dijalankan ketika Anda memintanya secara eksplisit; membuka panel tidak mengeksekusi apa pun.

## Tindakan berkas dan sistem

- `shell.revealFile` — menampilkan dokumen aktif atau jalur tertentu di pengelola berkas sistem;
- `shell.openPath` — membuka dokumen dengan aplikasi bawaannya;
- `shell.openExternal` — membuka halaman pihak ketiga di browser sistem.

Halaman resmi Powerduck memakai alat tautan khusus (`app.officialLink`) yang menampilkan kartu dalam percakapan, tanpa keluar dari aplikasi.

## Contoh kode klien

Untuk operasi apa pun, asisten dapat membuat kode klien siap dijalankan (`clientcode.generate`) dan menampilkannya dalam kartu dengan pemilih bahasa dan pustaka klien. Bahasa yang didukung mencakup C, C#, Go, Java, JavaScript, Node, Kotlin, PHP, Python, Ruby, Rust, shell, Swift, dan lainnya. Kode ditampilkan dalam kartu, bukan ditempel ke percakapan.

## Mengubah pengaturan melalui asisten

Permintaan tingkat aplikasi, seperti mengganti tema atau bahasa, mengatur proxy, mengabaikan galat sertifikat, atau mengganti versi HTTP, ditangani oleh alat pengaturan dan bukan sebagai pertanyaan desain API. Perubahan pengaturan meminta konfirmasi sebelum diterapkan.

Terkait: [AI dan model](./ai-models.md), [Ruang kerja Permintaan](./debug.md).
