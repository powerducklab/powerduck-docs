---
sidebar_position: 15
title: "AI bawaan dan penggunaan"
description: "Powerduck membantu memahami perubahan buatan AI beserta konteksnya dan menentukan masalah yang perlu ditangani. Ruang API dan tinjauan kode dapat dibuka terpisah dari Beranda desktop."
---

# AI bawaan dan penggunaan

Masuk melalui Google atau GitHub. Hanya model bawaan, tanpa pemilih, kunci sendiri, atau endpoint khusus. Pekerjaan AI yang diminta mengirim konteks pilihan ke penyedia terkelola. Pengecualian folder dependensi, build, dan kredensial umum tidak menjamin sumber bebas rahasia.

## Tinjauan AI di kode

Tinjauan AI dimulai atas permintaan, memakai batch perbedaan dan konteks terbatas, bukan semua file lengkap. Hasil cache yang cocok dapat dipakai ulang. Prioritas, bukti, dan saran muncul di kode. Konfirmasi masalah, tandai positif palsu, atau pilih untuk Agent. AI tidak membuktikan kebenaran atau pelaksanaan pengujian.

## Paket dan jumlah tugas

Satu giliran percakapan atau operasi tinjauan adalah satu tugas, bukan tiap panggilan internal. Kuota dicadangkan saat berjalan: hasil terkirim memakai satu meski kemudian dibatalkan; tanpa hasil berhasil cadangan dilepas. Pecah tinjauan besar. Membaca lokal, Git/AST, dan hasil tersimpan tidak memakai tugas. Langganan lama bisa mempertahankan credits; lihat akun.

- [Ruang kerja API](introduction.md)
- [Tinjauan kode](code-quality.md)
- [AI bawaan dan penggunaan](ai-models.md)
- [Paket dan jumlah tugas](../cloud/billing.md)
- [Pasang dan mulai](../overview/installation.md)
- [Pahami setiap perubahan](../overview/quickstart.md)
