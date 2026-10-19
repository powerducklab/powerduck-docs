---
sidebar_position: 3
title: "Permintaan lokal pertama, tanpa akun atau model AI"
description: "Permintaan lokal pertama, tanpa akun atau model AI"
---

# Permintaan lokal pertama, tanpa akun atau model AI

## Coba contoh lokal

Di ruang kerja kosong pada aplikasi desktop, pilih **Coba contoh**, lalu jalankan. Powerduck membuat contoh terpisah, memulai server Mock lokal, mengirim `GET /orders/summary` ke port yang ditentukan, dan menampilkan respons sebenarnya. Contoh baru dianggap selesai setelah menerima HTTP 200. Server Mock berhenti setelah permintaan selesai atau saat contoh ditutup. Anda dapat menjalankannya kembali kapan saja. Instal aplikasi terlebih dahulu; alur lokal ini tidak memerlukan internet, login, atau kunci model AI.

## Buka spesifikasi Anda

Gunakan **Buka** untuk mengimpor dokumen OpenAPI dalam format YAML atau JSON. Contoh tidak pernah menimpa berkas yang sudah ada. Penggunaan gratis membatasi jumlah spesifikasi. Jika batas tercapai, simpan lalu tutup atau hapus dokumen yang tidak diperlukan. Jangan membuang perubahan yang belum disimpan hanya untuk menjalankan contoh. Anda juga dapat membuat OpenAPI dengan memindai kode proyek yang sudah ada. Periksa bidang yang belum pasti sebelum mengandalkan hasilnya.

## Verifikasi backend sebenarnya

Permintaan Mock yang berhasil belum membuktikan bahwa backend sesuai dengan spesifikasi. Ikuti [contoh kesalahan kontrak](/docs/id-ID/client/contract-example/), lalu [hubungkan asisten pemrograman](/docs/id-ID/client/coding-agent/) jika diperlukan. Verifikasi manual tidak membutuhkan model AI.

## Model opsional dan masalah umum

- **Model belum dikonfigurasi:** permintaan lokal, Mock, dan pemeriksaan kontrak manual tetap berfungsi. Atur model di pengaturan hanya jika Anda ingin menggunakan AI.
- **Koneksi ke layanan model gagal:** periksa endpoint, kunci, dan proxy di pengaturan. Jangan memublikasikan kunci atau header permintaan dalam laporan bug.
- **API tujuan tidak dapat dijangkau:** pastikan server berjalan, lalu periksa URL, port, dan pengaturan permintaan di debugger.
- **HTTP 401/403:** periksa autentikasi dan izin API tujuan. Ini bukan permintaan untuk masuk ke Powerduck.
- **Pemeriksaan kontrak gagal:** lihat jalur bidang dan tipe yang diharapkan pada hasil asersi. Perbaiki backend atau spesifikasi yang salah, lalu periksa kembali.

Berkas lokal dibaca dan disimpan di komputer Anda. Model jarak jauh menerima konteks yang diperlukan; publikasi ke cloud mengunggah konten yang dipilih. Statistik penggunaan opsional dinonaktifkan secara default di pengaturan dan terpisah dari verifikasi lisensi.

[Unduh](https://www.powerduck.com/download.html) · [Lisensi desktop](https://www.powerduck.com/pricing?product=client)
