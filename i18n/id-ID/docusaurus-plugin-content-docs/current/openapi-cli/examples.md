---
sidebar_position: 5
title: "Contoh"
description: "Contoh praktis @powerduck/openapi-cli berdasarkan opsi CLI dan API pemrograman yang benar-benar tersedia."
---

# Contoh

Contoh praktis `@powerduck/openapi-cli` berdasarkan opsi CLI dan API pemrograman yang benar-benar tersedia.

## 1. Pengujian CLI dasar

Arahkan CLI ke dokumen OpenAPI lokal untuk menjalankan semua operasi:

```bash
openapi-cli --spec openapi.json
```

Ganti server dan simpan laporan ke direktori pilihan:

```bash
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --output ./reports
```

Uji spesifikasi yang dihosting pada URL jarak jauh:

```bash
openapi-cli --spec https://docs.example.com/openapi.json --timeout 60000
```

## 2. Menjalankan dari kode dengan autentikasi

Gunakan API pustaka dengan token Bearer, header khusus, dan konkurensi:

```typescript
import {
  resolveConfig,
  runTests,
  printCliReport,
  generateJsonReport,
  generateHtmlReport,
} from "@powerduck/openapi-cli";

const config = resolveConfig({
  spec: "./openapi.json",
  server: "https://api.staging.example.com",
  concurrency: 10,
  timeout: 15000,
  bearer: process.env.BEARER_TOKEN,
  header: ["X-Environment: staging", "X-Team: platform"],
});

const report = await runTests(config);

printCliReport(report);
generateJsonReport(report, "./reports");
generateHtmlReport(report, "./reports");

console.log(
  `Passed ${report.summary.passed}/${report.summary.total} (${report.summary.passRate}%)`,
);
```

## 3. Pengujian dengan filter

Jalankan sebagian operasi berdasarkan metode, tag, pola regex jalur, atau operationId:

```bash
# Only GET and POST requests
openapi-cli --spec openapi.json --method get,post

# Only operations tagged "public" or "v2"
openapi-cli --spec openapi.json --tag public,v2

# Only paths under /api/v2
openapi-cli --spec openapi.json --path "^/api/v2"

# Only specific operations
openapi-cli --spec openapi.json --operation-id getUser,createUser
```

Konfigurasi dalam kode yang menggabungkan filter tersebut: kategori filter yang berbeda digabungkan dengan AND; tag dalam kategori yang sama dicocokkan dengan OR.

```typescript
const config = resolveConfig({
  spec: "./openapi.json",
  method: "get,post",
  tag: "public,v2",
  path: "^/api/v2",
  operationId: "getUser,createUser",
});
```

## 4. Membuat laporan JSON dan HTML

Pilih format keluaran dengan `--format`. Secara bawaan, ketiganya dihasilkan:

```bash
# CLI to stdout only, no files
openapi-cli --spec openapi.json --format cli

# JSON + HTML files, no colored stdout report
openapi-cli --spec openapi.json --format json,html --output ./reports
```

Padanan dalam kode:

```typescript
import { resolveConfig, runTests, generateJsonReport, generateHtmlReport } from "@powerduck/openapi-cli";

const config = resolveConfig({
  spec: "./openapi.json",
  format: "json,html",
  output: "./reports",
});

const report = await runTests(config);

const jsonPath = generateJsonReport(report, config.outputDir);
const htmlPath = generateHtmlReport(report, config.outputDir);

console.log("Wrote", jsonPath, "and", htmlPath);
```

`generateJsonReport` menulis `report.json`; `generateHtmlReport` menulis `report.html`. Keduanya membuat direktori keluaran jika belum ada dan mengembalikan jalur berkas.

## 5. Asersi deklaratif dalam spesifikasi

Tambahkan array `x-tests` pada operasi. Setiap entri memerlukan `name` dan tipe `assert`:

```json
{
  "paths": {
    "/users/{id}": {
      "get": {
        "operationId": "getUser",
        "x-tests": [
          { "name": "status is 200", "assert": "status", "value": 200 },
          { "name": "content-type is JSON", "assert": "header", "key": "content-type", "contains": "application/json" },
          { "name": "user id exists", "assert": "jsonPath", "path": "$.id", "exists": true },
          { "name": "user is active", "assert": "jsonPath", "path": "$.status", "equals": "active" },
          { "name": "response under 2s", "assert": "responseTime", "max": 2000 },
          { "name": "body contains email", "assert": "bodyContains", "contains": "@" }
        ],
        "responses": { "200": { "description": "ok" } }
      }
    }
  }
}
```

Tipe asersi:

| `assert` | Kolom wajib | Tujuan |
|----------|-----------------|---------|
| `status` | `value` | Status HTTP sama dengan `value` |
| `header` | `key`; `contains` opsional | Header ada; secara opsional memeriksa apakah memuat substring |
| `bodyContains` | `contains` | Isi respons memuat substring |
| `bodyEquals` | `body` | Isi respons sama persis dengan `body` |
| `jsonPath` | `path`; `equals` / `exists` opsional | Uraikan JSONPath lalu bandingkan nilai atau periksa keberadaannya |
| `responseTime` | `max` | Durasi harus `<= max` ms |

## 6. Skrip Postman

Sisipkan skrip pengujian bergaya Postman melalui `x-postman-scripts`:

```json
{
  "paths": {
    "/users": {
      "get": {
        "operationId": "listUsers",
        "x-postman-scripts": {
          "test": "pm.test('status is 200', () => pm.response.to.have.status(200)); pm.test('users is an array', () => pm.expect(pm.response.json().users).to.be.an('array'));"
        },
        "responses": { "200": { "description": "ok" } }
      }
    }
  }
}
```

Asersi deklaratif `x-tests` dan `x-postman-scripts` dapat digunakan bersamaan pada operasi yang sama.

## 7. Integrasi CI dengan GitHub Actions

```yaml
name: API Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - name: Run API tests
        run: npx @powerduck/openapi-cli --spec openapi.json --server "$API_URL" --bearer "$BEARER_TOKEN" --output ./reports
        env:
          API_URL: ${{ secrets.API_URL }}
          BEARER_TOKEN: ${{ secrets.BEARER_TOKEN }}
      - name: Upload reports
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: openapi-cli-reports
          path: ./reports
```

Secara bawaan, pengujian yang gagal mengembalikan kode keluar `1`, sedangkan kesalahan konfigurasi atau runtime fatal mengembalikan `2`, sehingga job CI gagal. Gunakan `--no-fail-on-error` agar proses pengujian yang sudah selesai tidak menggagalkan pipeline; opsi ini tidak mengabaikan kesalahan konfigurasi atau kesalahan fatal.
