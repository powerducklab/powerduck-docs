---
sidebar_position: 7
title: "Server mock lokal"
description: "Jalankan mock lokal API OpenAPI dengan port, jalur dasar, latensi, dan penggantian respons pilihan Anda, lalu periksa permintaan yang diterima."
---

# Server mock lokal

Server mock menyediakan pengganti API yang berfungsi langsung dari spesifikasi, sehingga pengembangan frontend dan klien dapat berjalan sebelum backend tersedia, tanpa menyiapkan infrastruktur eksternal. Server ini berjalan di proses utama aplikasi desktop.

## Memulai mock

Anda dapat memulai mock dari halaman Server mock atau langsung dari percakapan AI. Jika dimulai dari percakapan, aplikasi mengonfirmasi alamat layanan tersebut.

Opsi berikut tersedia:

| Opsi | Rentang / bentuk | Kegunaan |
|---|---|---|
| `port` | Bilangan bulat `1`–`65535` | Port lokal untuk menerima koneksi |
| `basePath` | Awalan jalur URL | Menyediakan mock di bawah jalur dasar |
| `latencyMs` | `0`–`10000` | Menambahkan latensi buatan untuk menyimulasikan penundaan jaringan |
| `overrides` | Maksimal 100 penggantian respons | Mengembalikan respons tertentu untuk operasi yang dipilih |

Port atau latensi yang tidak valid ditolak dengan pesan yang jelas, bukan digunakan untuk memulai server yang tidak berfungsi.

## Beberapa mock

Anda dapat menjalankan beberapa mock sekaligus, misalnya satu untuk setiap dokumen yang terbuka. Aplikasi menampilkan mock yang berjalan (`mock:list`) dan dapat menghentikan satu mock tertentu (`mock:stop`). Setiap mock terhubung dengan ID dan nama dokumen agar mudah dibedakan.

## Memeriksa permintaan yang diterima

Mock mencatat permintaan yang diterimanya. Anda dapat menanyakannya (`mock:requests`) dengan batas jumlah opsional dan menghapus catatan tersebut. Ini berguna untuk memastikan bahwa klien memanggil operasi yang tepat dengan parameter yang diharapkan, meskipun belum ada backend nyata.

## Penggantian respons

Jika contoh bawaan atau respons dari skema belum mencukupi, penggantian respons memungkinkan operasi tertentu mengembalikan respons pilihan Anda. Jumlahnya dibatasi maksimal 100 agar konfigurasi tetap terkendali.

## Kapan digunakan

- Melanjutkan pengembangan frontend berdasarkan kontrak yang backend-nya masih dibuat;
- Mereproduksi perilaku lambat atau kasus khusus dengan mengatur latensi dan respons;
- Mendemonstrasikan alur API tanpa lingkungan yang sudah diterapkan;
- Memastikan klien yang dihasilkan memanggil operasi sesuai rancangan.

Mock membaca spesifikasi yang sama dengan alat lainnya, sehingga tetap selaras dengan kontrak saat rancangan berubah.

Terkait: [Pengujian skenario](/docs/id-ID/client/scenario-testing/), [Merancang bersama asisten](/docs/id-ID/client/design/).
