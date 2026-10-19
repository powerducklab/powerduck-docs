---
title: "Membuat OpenAPI dari basis kode yang sudah ada"
description: "Membuat OpenAPI dari basis kode yang sudah ada"
---

# Membuat OpenAPI dari basis kode yang sudah ada

Di aplikasi desktop, pilih **Pindai kode ke OpenAPI** (Beta), pilih folder sumber lokal, lalu **Mulai pemindaian**. Mulailah dari layanan kecil. Tinjau rute, parameter, dan respons yang ditemukan sebelum menggunakan spesifikasi hasil pemindaian.

Pemindaian statis dapat membiarkan skema respons tidak diketahui jika handler bergantung pada kode dinamis atau dependensi yang tidak tersedia. “Konfirmasi manual” mencatat peninjauan Anda, bukan merekonstruksi tipe yang hilang. Edit kontrak API berdasarkan bukti, atau minta AI meninjau handler yang dipilih jika diperlukan. Tindakan AI ini mengirim sumber yang dipilih beserta konteksnya ke penyedia model yang dikonfigurasi.

Simpan hasilnya sebagai berkas baru. Jangan mengganti kontrak yang sudah ada tanpa meninjau perubahan. Lalu jalankan [contoh kontrak](/docs/id-ID/client/contract-example/) terhadap backend yang sedang berjalan, atau hubungkan [agen pemrograman](/docs/id-ID/client/coding-agent/). Pemindaian yang berhasil tidak membuktikan kesesuaian implementasi.

Alur ini hanya tersedia di desktop; dukungan bahasa dan framework berbeda-beda menurut pemindai. Pemindaian statis tidak memerlukan kunci model. Perlakukan temuan yang belum terselesaikan sebagai hal yang belum diketahui, bukan fakta hasil inferensi.

[Unduh aplikasi desktop](https://www.powerduck.com/download.html) · [Panduan cepat](https://www.powerduck.com/docs/id-ID/overview/quickstart/)
