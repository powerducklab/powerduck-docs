---
sidebar_position: 1
title: "Pengantar"
description: "@powerduck/openapi-cli adalah alat baris perintah yang menguji dokumen OpenAPI 3.2 secara batch terhadap server nyata. Arahkan ke berkas spesifikasi atau URL: alat ini menjalankan operasi dalam dokumen, memeriksa setiap respons dengan asersi, dan menghasilkan tiga format laporan."
---

# Pengantar

`@powerduck/openapi-cli` adalah alat baris perintah yang menguji dokumen OpenAPI 3.2 secara batch terhadap server nyata. Arahkan ke berkas spesifikasi atau URL: alat ini menjalankan operasi dalam dokumen, memeriksa setiap respons dengan asersi, dan menghasilkan tiga format laporan.

Alat ini menggunakan [`@powerduck/openapi-request`](https://www.npmjs.com/package/@powerduck/openapi-request) untuk mengeksekusi permintaan dan [`@powerduck/openapi-parser`](https://www.npmjs.com/package/@powerduck/openapi-parser) untuk menguraikan referensi `$ref`.

## Mengapa menggunakan openapi-cli

- **Siap untuk CI** — secara bawaan, kode keluar bukan nol menandakan pengujian gagal atau kesalahan eksekusi. Alat ini dapat langsung diintegrasikan ke GitHub Actions, GitLab CI, atau pipeline lainnya.
- **Dukungan banyak protokol bawaan** — satu spesifikasi dapat menjelaskan operasi HTTP, SSE, WebSocket, GraphQL, gRPC, dan MCP; semuanya ditangani oleh runner yang sama.
- **Dua gaya asersi** — array deklaratif `x-tests` untuk pemeriksaan sederhana dan skrip bergaya Postman dengan `pm.test()` / `pm.expect()` untuk kasus kompleks.
- **Tiga format laporan** — JSON yang dapat dibaca mesin, keluaran CLI berwarna yang mudah dibaca, dan laporan HTML interaktif mandiri.
- **Spesifikasi lokal atau jarak jauh** — muat dokumen dari jalur berkas atau URL `http(s)://`, dengan dukungan pengalihan dan batas waktu.
- **Filter fleksibel** — pilih operasi berdasarkan metode, jalur, tag, atau operationId, dengan konkurensi terbatas.

## Protokol yang didukung

Runner mendeteksi protokol setiap operasi dari ekstensi OpenAPI atau tipe konten respons:

| Protokol | Pengenal | Cara pemilihan |
|----------|-----------|--------------------|
| HTTP | `http` | Bawaan untuk operasi standar |
| Peristiwa yang dikirim server | `sse` | Tipe konten respons `text/event-stream` atau `x-response-stream: true` |
| WebSocket | `websocket` | `x-protocol: "websocket"` |
| GraphQL | `graphql` | `x-protocol: "graphql"` |
| gRPC | `grpc` | `x-protocol: "grpc"` |
| MCP | `mcp` | `x-protocol: "mcp"` |

Protokol juga dapat ditentukan secara eksplisit melalui ekstensi `x-protocol` pada operasi atau item jalur.

## Laporan

Setelah pengujian, alat menghasilkan keluaran berikut; berkas disimpan secara bawaan di `./openapi-cli-report`:

- `report.json` — objek `TestReport` lengkap dalam JSON yang diformat rapi.
- `report.html` — laporan HTML mandiri tanpa dependensi, dengan ringkasan, bilah progres, tombol filter, dan baris pengujian yang dapat diperluas.
- Keluaran standar — ringkasan CLI berwarna dengan bilah progres dan asersi untuk setiap pengujian.

## Penggunaan dalam kode

Alur yang sama tersedia sebagai pustaka. Resolusikan konfigurasi, jalankan pengujian, lalu pilih pembuat laporan yang diperlukan:

```ts
import { resolveConfig, runTests, printCliReport, generateJsonReport } from "@powerduck/openapi-cli";

const config = resolveConfig({ spec: "./openapi.json" });
const report = await runTests(config);
printCliReport(report);
generateJsonReport(report, "./reports");
```

## Langkah berikutnya

- [Instalasi](./installation.md) — instal secara global atau sebagai dependensi pengembangan.
- [Mulai cepat](./quickstart.md) — jalankan rangkaian pengujian pertama.
- [Konfigurasi](./configuration.md) — referensi lengkap `CliConfig`.
- [Perintah](./commands.md) — seluruh opsi CLI dan kode keluar.
- [Referensi API](./api-reference.md) — seluruh fungsi dan tipe yang diekspor.
- [Contoh](./examples.md) — contoh yang siap dijalankan.
