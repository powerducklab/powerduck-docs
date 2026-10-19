---
sidebar_position: 4
title: "Pengujian Skenario dan Laporan"
description: "Satu permintaan menguji satu panggilan. **Pengujian skenario** menguji alur kerja: urutan permintaan yang menggunakan nilai dari satu respons untuk permintaan berikutnya, dengan asersi pada setiap langkah. Skenario mendokumentasikan alur menyeluruh yang sebelumnya mungkin hanya ada dalam pikiran pengembang."
---

# Pengujian Skenario dan Laporan

Satu permintaan menguji satu panggilan. **Pengujian skenario** menguji alur kerja: urutan permintaan yang menggunakan nilai dari satu respons untuk permintaan berikutnya, dengan asersi pada setiap langkah. Skenario mendokumentasikan alur menyeluruh yang sebelumnya mungkin hanya ada dalam pikiran pengembang.

## Isi skenario

- **Langkah berurutan**, masing-masing merujuk ke operasi dalam spesifikasi;
- **Penerusan data** antar-langkah, misalnya mengambil `id` sumber daya yang dibuat lalu memakainya dalam permintaan berikutnya;
- **Asersi** untuk kode status, header, atau kolom respons;
- Nilai yang harus disediakan pengguna sebelum menjalankan skenario.

Urutan dan asersi merupakan bagian utama: keduanya tidak pernah dihapus diam-diam saat eksekusi.

## Menjalankan skenario

Skenario berjalan di proses utama melalui mesin `runScenario` dari `@powerduck/openapi-cli`:

- `scenario:run` memulai eksekusi dengan skenario, spesifikasi, dan konfigurasi permintaan;
- Kemajuan dikirim melalui `scenario:event` saat langkah berjalan;
- `scenario:cancel` menghentikan pekerjaan yang sedang berjalan.

Anda dapat memantau setiap langkah, melihat titik kegagalan alur, dan membatalkan eksekusi yang lama.

## Cara asisten menyusun skenario

Asisten tidak mengarang definisi pengujian di dalam spesifikasi. Skenario merupakan alur aplikasi yang terpisah dan **tidak pernah disimpan dalam dokumen OpenAPI**; tidak ada kunci `x-scenarios` atau langkah tertanam.

Jika Anda meminta perancangan sekaligus pengujian endpoint, pekerjaan dilakukan berurutan:

1. Asisten terlebih dahulu mengusulkan **hanya patch endpoint**;
2. Setelah Anda menerapkannya, asisten menampilkan **kartu tindakan** untuk menjalankan alur:
   - `test.single` untuk satu endpoint;
   - `scenario.plan` agar aplikasi menemukan alur menyeluruh;
   - `scenario.run` untuk menyiapkan dan menjalankan alur berurutan.

Kartu `scenario.run` mencantumkan dua hingga delapan operasi sesuai urutan eksekusi dan menyatakan tujuannya, termasuk kolom respons, header, atau status yang menjadi masukan permintaan selanjutnya. Setiap referensi disalin persis dari spesifikasi aktif.

## Laporan

Setelah eksekusi, Anda dapat mengekspor **laporan HTML mandiri**. Ini adalah dokumen ringkasan, bukan keluaran CLI mentah: alur, hasil per langkah, asersi, dan hasil akhir disajikan dalam tata letak yang mudah dibaca.

Pilih bahasa saat mengekspor. Tersedia sepuluh bahasa bawaan:

1. English (bahasa Inggris)
2. 简体中文 (bahasa Tionghoa Sederhana)
3. 繁體中文 (bahasa Tionghoa Tradisional)
4. 日本語 (bahasa Jepang)
5. 한국어 (bahasa Korea)
6. Français (bahasa Prancis)
7. Deutsch (bahasa Jerman)
8. Español (bahasa Spanyol)
9. Português — Brasil (bahasa Portugis Brasil)
10. العربية (bahasa Arab)

Opsi **lainnya/khusus** menerima bahasa lain, tetapi label bawaan laporan menggunakan bahasa Inggris jika terjemahan belum tersedia. Memasukkan nama bahasa tidak menerjemahkan laporan secara otomatis.

Periksa laporan hasil ekspor sebelum membagikannya:

- **Kolom kredensial yang dikenali disamarkan** secara otomatis. Payload arbitrer, URL, dan kolom khusus masih dapat memuat data sensitif; periksa dan hapus sebelum berbagi;
- **Payload besar dilipat** agar mudah dibaca. Melipat bagian tidak menghapus datanya dari HTML yang diekspor.

HTML tersebut mandiri sehingga dapat dilampirkan ke tiket atau diarsipkan bersama rilis.

## Kapan menggunakan skenario

- Memverifikasi alur bisnis bertahap, seperti membuat, membaca, memperbarui, dan menghapus;
- Memastikan autentikasi dan penerusan token bekerja antar-panggilan;
- Menyediakan bukti perilaku API untuk rilis atau serah terima;
- Memeriksa regresi alur setelah kontrak berubah.

Terkait: [Ruang kerja Permintaan](./debug.md), [Merancang bersama asisten](./design.md), [Server mock](./mock-server.md).
