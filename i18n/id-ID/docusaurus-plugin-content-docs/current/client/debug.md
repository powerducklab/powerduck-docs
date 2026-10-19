---
sidebar_position: 3
title: "Ruang Kerja Permintaan dan Lingkungan"
description: "Ruang kerja Permintaan mengubah operasi yang dirancang menjadi panggilan nyata. Permintaan dikirim melalui proses utama lokal, respons ditampilkan, dan lingkungan serta variabel menyediakan nilai yang berubah antar-eksekusi."
---

# Ruang Kerja Permintaan dan Lingkungan

Ruang kerja Permintaan mengubah operasi yang dirancang menjadi panggilan nyata. Permintaan dikirim melalui proses utama lokal, respons ditampilkan, dan lingkungan serta variabel menyediakan nilai yang berubah antar-eksekusi.

## Mengirim permintaan

1. Buka operasi di ruang kerja Permintaan. Metode, jalur, parameter, header, dan isi diambil dari spesifikasi.
2. Isi nilai yang memerlukan masukan konkret, seperti parameter jalur atau token.
3. Kirim permintaan. Kode status, header, isi, dan waktu eksekusi ditampilkan pada tab tersebut.
4. Biarkan beberapa permintaan terbuka dalam **tab** agar mudah dibandingkan atau diperiksa kembali.

Karena eksekusi berlangsung di proses utama, bukan tampilan web, pembatasan CORS browser tidak memblokir panggilan, dan detail permintaan tidak muncul di panel jaringan browser.

## Lingkungan dan server OAS

Keduanya berkaitan, tetapi berbeda. Memahami perbedaannya membantu menghindari kebingungan yang umum terjadi.

| | Lingkungan khusus | OAS `servers` |
|---|---|---|
| Lokasi penyimpanan | Pengaturan lokal aplikasi | Di dalam dokumen OpenAPI |
| Dapat diubah melalui alat permintaan | Ya | Tidak; ubah melalui patch spesifikasi |
| Tujuan | URL dasar bawaan untuk tab permintaan baru dan eksekusi skenario | URL dasar yang dinyatakan dalam kontrak |
| Dibagikan bersama dokumen | Tidak | Ya |

Saat asisten mencantumkan URL dasar (`env.listServers`), lingkungan khusus yang dapat diubah ditampilkan terlebih dahulu, diikuti server hanya-baca yang dinyatakan dalam dokumen aktif.

- Untuk **menambahkan atau memilih URL dasar lokal**, buat atau aktifkan lingkungan khusus (`env.upsertServer`, `env.selectServer`). Tindakan ini tidak mengubah dokumen.
- Untuk **mengubah server dalam kontrak**, ajukan patch spesifikasi.

Dengan begitu, URL dasar debugging pribadi tetap terpisah dari kontrak, sementara server yang dinyatakan dalam dokumen tetap dapat digunakan untuk permintaan.

## Variabel

Variabel dikelola dalam empat cakupan:

- **globals** — tersedia untuk semua koleksi;
- **collection** — terbatas pada satu koleksi;
- **environment** — terkait dengan lingkungan aktif; berlaku untuk semua server kecuali server tertentu ditetapkan;
- **local** — khusus sesi lokal.

Asisten dapat mencantumkan variabel (`env.listVariables`, dengan filter cakupan opsional) serta membuat atau memperbaruinya (`env.setVariable`, berdasarkan nama dan cakupan). Variabel dapat dihubungkan ke server tertentu dan memiliki status aktif. Mengatur variabel adalah tindakan aplikasi, bukan perubahan dokumen API.

Nilai yang umum disimpan dalam variabel mencakup token akses, ID yang digunakan kembali antar-panggilan, dan penanda fitur.

## Jika URL dasar belum tersedia

Permintaan memerlukan URL lengkap. Jika `servers` dokumen maupun lingkungan aktif tidak menyediakan URL dasar, aplikasi meminta Anda mengisinya sebelum menjalankan permintaan, alih-alih menebak dan diam-diam memanggil host yang salah.

## Dari satu permintaan menjadi alur

Setelah satu panggilan berhasil, Anda dapat merangkai beberapa panggilan agar nilai dari suatu respons menjadi masukan permintaan berikutnya. Inilah [pengujian skenario](./scenario-testing.md).

Terkait: [Merancang bersama asisten](./design.md), [Pengujian skenario](./scenario-testing.md), [Pengaturan](./settings.md).

## Agen A2A

Rancang dan debug pesan agen berversi, operasi tugas, serta pembaruan SSE dengan `x-protocol: a2a`. Lihat [Agen A2A](./a2a.md) untuk kolom ekstensi dan binding JSON-RPC, REST, serta gRPC desktop.
