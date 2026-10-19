---
title: "Menghubungkan OpenAPI ke agen pemrograman"
description: "Menghubungkan OpenAPI ke agen pemrograman"
---

# Menghubungkan OpenAPI ke agen pemrograman

Gunakan **MCP pengembang** agar agen pemrograman dapat memeriksa kontrak dan memverifikasi backend. **API-to-MCP** menyediakan operasi API sebagai alat yang dapat dipanggil; ini merupakan alur kerja yang berbeda.

1. Buka berkas YAML/JSON melalui **Buka** di aplikasi desktop. Simpan salinan terpisah sebelum bereksperimen.
2. Buka **MCP dan Pemrograman** untuk spesifikasi saat ini. Sebagai alternatif, jalankan `npm ci` dan `npm run build` dari salinan lokal repositori MCP pengembang.
3. Konfigurasikan server MCP stdio di agen dengan program `node` dan argumen `/absolute/path/dev-mcp-server/dist/cli.mjs`, `--spec`, `/absolute/path/openapi.yaml`. Gunakan jalur absolut yang sebenarnya; jangan menyalin contoh pengganti tersebut apa adanya.
4. Minta agen membaca operasi dan skema responsnya sebelum mengubah backend. Setelah perubahan, minta agen memanggil `run_contract_tests` dengan `baseUrl` lokal backend yang ditentukan secara eksplisit.
5. Tinjau asersi yang dilaporkan dan patch kode yang diusulkan. Jalankan kembali pengujian setelah menerapkan perbaikan yang disetujui.

Server MCP pengembang memerlukan Node.js 22.12.0 atau lebih baru. Agen dapat mengirimkan hasil alat atau konteks kode ke model jarak jauh yang dikonfigurasi. Model tidak diperlukan untuk permintaan lokal manual dan pengujian kontrak. Penyedia Anda menagih penggunaan kunci Anda sendiri; kredit model yang dihosting dihitung secara terpisah. Pekerjaan lokal tidak memerlukan langganan Cloud.

[Unduh aplikasi desktop](https://www.powerduck.com/download.html) · [Mulai cepat](https://www.powerduck.com/docs/id-ID/overview/quickstart/)
