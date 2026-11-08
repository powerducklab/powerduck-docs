---
sidebar_position: 10
title: "Tinjauan kode"
description: "Powerduck membantu memahami perubahan buatan AI beserta konteksnya dan menentukan masalah yang perlu ditangani. Ruang API dan tinjauan kode dapat dibuka terpisah dari Beranda desktop."
---

# Tinjauan kode

Peninjauan kode memerlukan [aplikasi desktop](https://www.powerduck.com/download.html). Halaman browser menyediakan tautan unduhan; pemilihan proyek lokal, perbandingan Git, dan peninjauan tidak berjalan di browser.

Pemilihan folder membuka struktur proyek. Baca file lengkap dalam mode sumber saja, perbandingan lengkap, atau perubahan saja. Sorotan baris dan karakter, navigasi perubahan, serta pencarian membantu menemukan edit.

## Perbandingan dan riwayat putaran

Putaran aktif membandingkan titik awal tersimpan dengan disk. Pembukaan pertama membuat titik awal tanpa menganggap semua isi baru. Seluruh perubahan belum di-commit dibandingkan dengan Git HEAD. Mulai putaran baru secara sengaja dan lihat sebelumnya di riwayat lokal, bukan cadangan Git. Simpan edit ke disk dahulu.

## Struktur dan kode terkait

Git dan parser menemukan blok, definisi, pemanggil, serta impor yang dapat diurai. Arahkan kursor ke simbol yang didukung untuk definisinya; buka kode terkait di dekat perubahan. Struktur menandai banyak referensi, nama sementara, isi identik, dan referensi masuk yang tidak ditemukan. Pemuatan dinamis dan pemakai eksternal bisa terlewat; tanpa referensi bukan berarti aman dihapus.

## Tinjauan AI di kode

Tinjauan AI dimulai atas permintaan, memakai batch perbedaan dan konteks terbatas, bukan semua file lengkap. Hasil cache yang cocok dapat dipakai ulang. Prioritas, bukti, dan saran muncul di kode. Konfirmasi masalah, tandai positif palsu, atau pilih untuk Agent. AI tidak membuktikan kebenaran atau pelaksanaan pengujian.

## Paket tugas Agent

Pilih dugaan lalu pratinjau, salin, atau unduh Markdown dengan kode dan penanda revisi. Agent harus menilai mandiri; izin perubahan dinyatakan jelas. Laporan JSON tetap perlu diperiksa manusia. Klaim perbaikan bukan pengujian lulus. Ekspor tidak otomatis menjalankan atau menghubungi Agent lain.

## Jalankan pemeriksaan

Jalankan perintah secara eksplisit hanya pada proyek tepercaya dan periksa perintah, kode keluar, serta keluaran mentah. Skrip tidak ada berarti belum diverifikasi. Membaca, analisis statis, dan AI bukan bukti eksekusi; sudah dibaca hanya mencatat progres.

## AI bawaan dan penggunaan

Masuk melalui Google atau GitHub. Hanya model bawaan, tanpa pemilih, kunci sendiri, atau endpoint khusus. Pekerjaan AI yang diminta mengirim konteks pilihan ke penyedia terkelola. Pengecualian folder dependensi, build, dan kredensial umum tidak menjamin sumber bebas rahasia.

- [Ruang kerja API](introduction.md)
- [Tinjauan kode](code-quality.md)
- [AI bawaan dan penggunaan](ai-models.md)
- [Paket dan jumlah tugas](../cloud/billing.md)
- [Pasang dan mulai](../overview/installation.md)
- [Pahami setiap perubahan](../overview/quickstart.md)
