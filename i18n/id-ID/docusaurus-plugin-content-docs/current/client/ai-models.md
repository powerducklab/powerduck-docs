---
sidebar_position: 8
title: "AI dan Model"
description: "Powerduck memungkinkan Anda memilih dan mengonfigurasi model asisten. Pada desktop, permintaan melewati proses utama menuju endpoint pilihan Anda; perubahan dokumen tetap menggunakan kartu yang dapat ditinjau."
---

# AI dan Model

Powerduck memungkinkan Anda memilih dan mengonfigurasi model asisten. Pada desktop, permintaan melewati proses utama menuju endpoint pilihan Anda; perubahan dokumen tetap menggunakan kartu yang dapat ditinjau.

## Gunakan model Anda sendiri

Di pengaturan, hubungkan asisten ke endpoint Chat Completions yang **kompatibel dengan OpenAI**:

- Pilih preset penyedia bawaan atau tentukan penyedia **khusus**;
- Masukkan nama tampilan, URL dasar, kunci API, dan ID model;
- Anda dapat mengonfigurasi beberapa profil dan memilih di antaranya.

Aplikasi tidak mengasumsikan penyedia tertentu. Endpoint kompatibel OpenAI yang dihosting sendiri atau oleh pihak ketiga bekerja dengan cara yang sama, sehingga cocok untuk tim dengan kebijakan model sendiri.

## Kemampuan lanjutan dengan mekanisme cadangan

Setiap profil memiliki opsi **kemampuan lanjutan**, yang aktif secara bawaan:

- Saat aktif, aplikasi menggunakan **pemanggilan fungsi native** model dan mengirim katalog alat agar model dapat memilih serta memanggil alat yang tepat secara langsung;
- Jika endpoint menolak parameter alat native, misalnya model kecil tanpa dukungan alat, aplikasi mengingat endpoint tersebut lalu mencoba sekali lagi melalui **protokol cadangan berbasis konten**.

Mekanisme cadangan ini meningkatkan kompatibilitas, tetapi tidak menjamin keberhasilan: galat jaringan, autentikasi, dan model tetap dapat terjadi. Nonaktifkan kemampuan lanjutan jika suatu profil harus selalu memakai jalur dasar.

Pekerjaan berbasis alat juga dibatasi: agen memakai jumlah putaran alat yang terbatas, tiga secara bawaan, dan menghapus panggilan berulang dalam satu eksekusi.

## Mengapa permintaan melewati proses utama

Pada klien desktop, permintaan penyelesaian dikirim dari **proses utama Node**, bukan tampilan web. Ada dua manfaat nyata:

- **Tanpa hambatan CORS browser.** Pembatasan lintas asal pada halaman web tidak memblokir panggilan ke endpoint model;
- **Permintaan HTTP berjalan di luar renderer.** Panel jaringannya tidak menampilkan pertukaran HTTP proses utama. Hal ini tidak menjamin bahwa prompt atau kunci tidak ada di memori renderer, log, atau alat pengembang lainnya.

Gateway desktop memvalidasi struktur permintaan dan menerapkan batas sumber daya:

- Hanya URL HTTP(S) yang diterima; nama dan nilai header, ukuran isi, batas waktu, serta permintaan bersamaan diperiksa. Endpoint lokal dan privat diizinkan. Ini bukan daftar host yang diizinkan maupun jaminan privasi penyedia;
- Permintaan dapat dibatalkan (`ai:cancel`).

## Desktop dan web

Asisten yang sama bekerja di kedua runtime dengan jalur yang sesuai:

- **Desktop (Electron):** kemampuan diimpor dan dijalankan secara lokal, sementara permintaan penyelesaian diteruskan melalui proses utama;
- **Web:** alur yang sama berjalan melalui HTTP dengan memanggil API layanan, bukan modul lokal.

Itulah alasan aplikasi mempertahankan jalur web di samping Electron: penanganan tujuan dan kartu tetap konsisten, sementara transport disesuaikan dengan runtime.

## Cara mengenali tujuan pengguna

Tujuan tidak dikenali dengan daftar kata kunci untuk setiap fitur. Aplikasi memberikan **katalog alat** yang jelas kepada model: ID alat, parameter, serta situasi penggunaannya. Model memilih alat, aplikasi deterministik memvalidasi dan menjalankannya, dan tindakan tulis meminta konfirmasi.

Menambahkan kemampuan berarti menambahkan alat dengan deskripsi yang akurat ke katalog, bukan memperpanjang daftar kata kunci. Katalog yang sama dapat dibagikan kepada agen eksternal melalui server MCP agar kemampuan produk dan alat lain tetap selaras.

## Privasi data

- Prompt, konteks terpilih, deskripsi alat, dan kredensial dikirim ke endpoint model yang dikonfigurasi. Penyedia terhosting menerima data itu; gunakan endpoint lokal tepercaya jika kebijakan Anda mewajibkan inferensi lokal;
- Aplikasi deterministik, bukan model, memvalidasi dan menerapkan setiap perubahan;
- Anda menyetujui setiap tindakan tulis sebelum dijalankan.

Terkait: [Merancang bersama asisten](./design.md), [Pengaturan](./settings.md), [Kontrol akses cloud](../cloud/access-control.md).
