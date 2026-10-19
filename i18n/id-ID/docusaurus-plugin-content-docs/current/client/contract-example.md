---
title: "Menemukan kesalahan implementasi dengan pengujian kontrak"
description: "Menemukan kesalahan implementasi dengan pengujian kontrak"
---

# Menemukan kesalahan implementasi dengan pengujian kontrak

Contoh ini menggunakan runner MCP pengembang, dengan validasi skema respons tersedia sejak versi 0.7.6. Diperlukan Node.js 22.12.0 atau lebih baru. Contoh memakai data fiktif dan backend yang hanya mendengarkan pada antarmuka loopback; setelah dependensi terpasang, tidak diperlukan akun, model, atau API publik.

```sh
git clone https://github.com/powerducklab/dev-mcp-server.git
cd dev-mcp-server
npm ci
npm run build
node examples/contract-total/verify.mjs
```

Responsnya adalah `{"total":"42"}`, sedangkan skema mengharuskan angka. Validator sebenarnya melaporkan `/total must be number` dan keluar dengan status 1.

```sh
node examples/contract-total/verify.mjs --correct
```

Backend kini mengembalikan `{"total":42}`; pemeriksaan yang sama lulus dan keluar dengan status 0. Untuk memperbaiki implementasi sendiri, ubah ekspresi `total` di `examples/contract-total/server.mjs` agar mengembalikan angka. Jangan melonggarkan kontrak untuk menyembunyikan kesalahan.

Setiap pemanggilan mengalokasikan port lokal yang kosong dan menutup servernya setelah selesai. Sumber dan perintah tersedia di [proyek contoh](https://github.com/powerducklab/dev-mcp-server/tree/main/examples/contract-total). Pemeriksaan skema saat ini mencakup respons JSON, tanpa validasi format atau pengambilan skema jarak jauh. Jenis konten yang tidak didukung tetapi memerlukan validasi skema akan dilaporkan sebagai batasan, bukan diluluskan diam-diam.

Ini menguji backend yang nyata. Permintaan Mock yang berhasil hanya menunjukkan alur contoh. Secara opsional, agen pemrograman dapat memakai `run_contract_tests` dengan `baseUrl` eksplisit untuk menjalankan verifikasi yang sama; tinjau patch sebelum menerapkannya.

[Unduh aplikasi desktop](https://www.powerduck.com/download.html) · [Panduan cepat](https://www.powerduck.com/docs/id-ID/overview/quickstart/)
