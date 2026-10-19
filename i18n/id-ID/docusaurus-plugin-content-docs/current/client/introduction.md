---
sidebar_position: 1
title: "Klien Desktop"
description: "Klien desktop menghadirkan alur kerja berbasis AI di komputer Anda sendiri. Buka openapi.yaml dari repositori, jelaskan hasil yang diinginkan, lalu tinjau hasilnya—tanpa berpindah antara editor spesifikasi, klien HTTP, alat mock, pembuat dokumentasi, dan pelaksana pengujian, serta tanpa akun cloud untuk memulai."
---

# Klien Desktop

Klien desktop menghadirkan alur kerja berbasis AI di komputer Anda sendiri. Buka `openapi.yaml` dari repositori, jelaskan hasil yang diinginkan, lalu tinjau hasilnya—tanpa berpindah antara editor spesifikasi, klien HTTP, alat mock, pembuat dokumentasi, dan pelaksana pengujian, serta tanpa akun cloud untuk memulai.

Kendali tetap di tangan Anda: asisten mengusulkan, Anda menyetujui.

## Sehari di ruang kerja

Klien dirancang untuk kegiatan berikut.

- **Membuka dan memahami spesifikasi.** Asisten membaca dokumen aktif dan segera menyarankan langkah berikutnya: mengisi kekurangan, melengkapi dokumentasi, atau menguji alur.
- **Membuat API.** Jelaskan sumber daya, lalu asisten mengusulkan endpoint. Terus sempurnakan operasi yang sama—tambah parameter, perjelas respons, atau ubah kode status—tanpa berpindah ke bagian dokumen yang tidak terkait.
- **Menyiapkan data uji.** Hasilkan baris contoh realistis dari skema agar permintaan dan skenario memiliki nilai konkret.
- **Menjalankan permintaan atau skenario lengkap.** Debug satu panggilan atau rangkai beberapa endpoint menjadi alur menyeluruh, lalu dapatkan laporan keberhasilan dan kegagalan yang dapat dibagikan.
- **Tetap bekerja sebelum backend tersedia.** Jalankan mock lokal yang merespons berdasarkan kontrak sementara layanan sebenarnya masih dikembangkan.
- **Memberikan API kepada agen pemrograman.** Ubah spesifikasi menjadi server MCP agar alat AI dapat menemukan dan memanggil operasi yang tepat dengan argumen yang sesuai.
- **Melihat basis data di balik API.** Turunkan tabel, relasi, dan SQL dari spesifikasi, bandingkan dengan basis data nyata, lalu identifikasi perubahan yang diperlukan.
- **Mengubah pengaturan tanpa meninggalkan percakapan.** Minta penggantian tema atau bahasa, pengaturan proxy, atau pengelolaan variabel lingkungan.

## Tampilan dan kegunaannya

Satu dokumen mendukung semua tampilan; pengalih ringkas memudahkan perpindahan.

| Tampilan | Kegunaan |
|---|---|
| [**Spesifikasi**](./design.md) | Tampilan utama: percakapan AI, dokumen, dan pratinjau langsung |
| [**Ruang kerja Permintaan**](./debug.md) | Mengirim dan memeriksa permintaan HTTP nyata dengan tab dan lingkungan |
| [**Pengujian skenario**](./scenario-testing.md) | Merangkai endpoint menjadi alur, menjalankannya, dan memperoleh laporan |
| [**Dokumentasi**](./protocols.md) | Membaca spesifikasi sebagai dokumentasi API yang telah dirender |
| [**MCP**](./protocols.md) | Memeriksa dan menggunakan server MCP yang dihasilkan dari spesifikasi |
| [**Server mock**](./mock-server.md) | Menjalankan mock API lokal selama pengembangan |
| [**Model data**](./data-model.md) | Menurunkan tabel dan relasi, membandingkan dengan basis data, serta menghasilkan SQL |
| [**Pengaturan**](./settings.md) | Tema, bahasa, proxy, sertifikat, dan preferensi ruang kerja |

## Cara asisten bekerja bersama Anda

Anda menjelaskan tujuan dengan bahasa alami; asisten memilih kemampuan yang tepat, mesin deterministik memvalidasinya, lalu Anda menyetujuinya melalui kartu. Model tidak pernah mengedit dokumen sendiri.

- Perubahan spesifikasi hadir sebagai **kartu patch** dengan operasi terperinci; pengeditan operasi yang ada hanya mengubah kolom yang diminta;
- Tindakan hanya-baca, seperti mencantumkan operasi, mengambil skema, atau menjalankan kueri, mengembalikan fakta yang menjadi dasar jawaban asisten;
- Tindakan tulis meminta konfirmasi sebelum dijalankan.

Model **Anda konfigurasi sendiri**: arahkan aplikasi ke penyedia yang kompatibel dengan OpenAI lalu pilih di pengaturan. Lihat [AI dan model](./ai-models.md).

## Manfaat mengutamakan kerja lokal

- **Berkas asli Anda.** Aplikasi membuka, mengedit, dan menyimpan berkas asli di disk serta melacak perubahan lokal.
- **Tanpa hambatan CORS.** Permintaan melewati proses lokal, bukan tampilan web, sehingga pembatasan lintas asal tidak memblokir panggilan.
- **Anda memilih endpoint model.** Desktop mengirim permintaan model melalui proses utama, tetapi prompt, konteks terkait, dan kredensial tetap dikirim ke penyedia yang dikonfigurasi. Mengutamakan kerja lokal bukan berarti permintaan AI jarak jauh tidak mengirim data.
- **Dapat digunakan secara luring.** Desain, mock, dan dokumentasi tidak memerlukan jaringan; jaringan diperlukan untuk permintaan langsung, sinkronisasi Git, atau model terhosting.
- **Eksekusi lokal.** Mock, pelaksana skenario, akses basis data, dan terminal berjalan di komputer Anda.

## Lisensi desktop

Klien desktop dijual dengan **lisensi permanen sekali bayar**: cukup satu pembelian untuk bekerja secara luring tanpa akun. Kunci lisensi dibuat saat pembelian dan hanya ditampilkan sekali. Lisensi ini terpisah dari Powerduck Cloud, layanan hosting berlangganan bulanan. Lihat [Penagihan cloud](../cloud/billing.md).

## Mulai di sini

- [Merancang bersama asisten](./design.md)
- [Ruang kerja Permintaan dan lingkungan](./debug.md)
- [Pengujian skenario dan laporan](./scenario-testing.md)
- [Protokol](./protocols.md)
- [Model data dan diagram ER](./data-model.md)
- [Server mock](./mock-server.md)
- [AI dan model](./ai-models.md)
- [Pengaturan](./settings.md)
