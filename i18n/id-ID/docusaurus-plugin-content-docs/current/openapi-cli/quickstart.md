---
sidebar_position: 3
title: "Mulai cepat"
description: "Jalankan kumpulan pengujian pertama dengan @powerduck/openapi-cli melalui CLI dan Node.js."
---

# Mulai cepat

Panduan ini menjelaskan cara menguji dokumen OpenAPI pertama Anda.

## Prasyarat

- Node.js `>= 22.12.0`.
- Dokumen OpenAPI 3.2 dalam **JSON**. YAML tidak diterima; konversikan terlebih dahulu ke JSON. Dokumen harus memuat objek `paths` pada tingkat teratas.

## 1. Menjalankan melalui CLI

Eksekusi paling sederhana memuat spesifikasi lokal dan menguji semua operasi pada URL server pertama yang dinyatakan dalam dokumen:

```bash
openapi-cli --spec openapi.json
```

Ganti server tujuan dan simpan laporan ke direktori pilihan Anda:

```bash
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --output ./reports
```

Uji spesifikasi jarak jauh hanya untuk operasi `GET`, dengan 10 worker bersamaan:

```bash
openapi-cli --spec https://docs.example.com/openapi.json \
  --method get \
  --concurrency 10
```

Gunakan file konfigurasi JSON untuk pengaturan yang kompleks:

```bash
openapi-cli --config openapi-cli.config.json
```

Lihat semua opsi di [Perintah](/docs/id-ID/openapi-cli/commands/).

## 2. Menulis spesifikasi minimal

Dokumen OpenAPI minimal dengan asersi deklaratif:

```json
{
  "openapi": "3.2.0",
  "info": { "title": "Demo API", "version": "1.0.0" },
  "servers": [{ "url": "https://httpbin.org" }],
  "paths": {
    "/get": {
      "get": {
        "operationId": "getGet",
        "responses": { "200": { "description": "ok" } },
        "x-tests": [
          { "name": "status is 200", "assert": "status", "value": 200 },
          { "name": "response under 5s", "assert": "responseTime", "max": 5000 }
        ]
      }
    }
  }
}
```

Jika operasi **tidak** mendefinisikan asersi, runner menambahkan pemeriksaan keberhasilan protokol secara implisit. Untuk HTTP, status `2xx` diwajibkan agar respons 4xx/5xx tidak diam-diam dianggap lulus.

## 3. Menjalankan dari Node.js (API pemrograman)

Pustaka menyediakan alur yang sama melalui fungsi: `resolveConfig` → `runTests` → pembuat laporan.

```typescript
import {
  resolveConfig,
  runTests,
  printCliReport,
  generateJsonReport,
  generateHtmlReport,
} from "@powerduck/openapi-cli";

// 1. Build a CliConfig from CLI-style args.
const config = resolveConfig({
  spec: "./openapi.json",
  server: "https://api.staging.example.com",
  concurrency: 10,
});

// 2. Run all collected tests.
const report = await runTests(config);

// 3. Emit the reports you need.
printCliReport(report);
generateJsonReport(report, "./reports");
generateHtmlReport(report, "./reports");

// 4. Exit with the correct code for CI.
if (report.summary.failed > 0 || report.summary.errors > 0) {
  process.exit(1);
}
```

`resolveConfig` menerima bentuk opsi yang sama dengan CLI. `runTests` mengembalikan `TestReport` yang memuat `summary`, `results`, `config`, `generatedAt`, dan `version`. [Konfigurasi](/docs/id-ID/openapi-cli/configuration/).

## 4. Kode keluar untuk CI

| Kode | Arti |
|---|---|
| `0` | Semua pengujian lulus, atau `--no-fail-on-error` diaktifkan. |
| `1` | Satu atau beberapa pengujian gagal atau mengalami kesalahan. |
| `2` | Kesalahan konfigurasi, gagal memuat spesifikasi, atau kesalahan runtime fatal. |

## Langkah berikutnya

- [Konfigurasi](/docs/id-ID/openapi-cli/configuration/) — semua kolom `CliConfig` dan nilai bawaannya.
- [Perintah](/docs/id-ID/openapi-cli/commands/) — semua opsi CLI.
- [Contoh](/docs/id-ID/openapi-cli/examples/) — autentikasi, filter, laporan, dan asersi.
- [Referensi API](/docs/id-ID/openapi-cli/api-reference/) — semua fungsi dan tipe yang diekspor.
