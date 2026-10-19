---
sidebar_position: 5
title: "Perintah CLI"
description: "Paket ini menyediakan satu program, openapi-cli. Program menerima daftar opsi secara langsung; tidak ada subperintah run / validate / init:"
---

# Perintah CLI

Paket ini menyediakan satu program, `openapi-cli`. Program menerima daftar opsi secara langsung; **tidak ada** subperintah `run` / `validate` / `init`:

```
openapi-cli [options]
```

## Sintaks

```bash
openapi-cli --spec openapi.json [options]
openapi-cli -c config.json
```

Spesifikasi **wajib** disediakan: gunakan `--spec` (atau `-s`), atau tetapkan `specPath` dalam berkas JSON yang dimuat dengan `--config`. Opsi lainnya bersifat opsional.

## Opsi utama

| Opsi | Bentuk singkat | Bawaan | Deskripsi |
|--------|-------|---------|-------------|
| `--spec <path-or-url>` | `-s` | — | Jalur atau URL `http(s)://` ke spesifikasi JSON OpenAPI 3.2 |
| `--server <url>` | `-S` | *(dari spesifikasi)* | Ganti URL server dari spesifikasi |
| `--output <dir>` | `-o` | `./openapi-cli-report` | Direktori keluaran laporan |
| `--format <formats>` | `-f` | `json,cli,html` | Format laporan yang dipisahkan koma: `json`, `cli`, `html` |
| `--config <path>` | `-c` | — | Jalur berkas konfigurasi JSON; argumen CLI diprioritaskan |

## Opsi eksekusi

| Opsi | Bentuk singkat | Bawaan | Deskripsi |
|--------|-------|---------|-------------|
| `--concurrency <n>` | `-n` | `5` | Maksimum permintaan bersamaan; bilangan bulat 1 hingga 100 |
| `--timeout <ms>` | `-t` | `30000` | Batas waktu per permintaan dalam ms, bilangan bulat 1 hingga 600000; juga digunakan saat mengambil spesifikasi jarak jauh |
| `--no-fail-on-error` | — | nonaktif | Keluar dengan `0` setelah proses selesai meskipun pengujian gagal; kesalahan konfigurasi dan kesalahan fatal tetap menyebabkan kegagalan |

## Opsi filter

| Opsi | Bawaan | Deskripsi |
|--------|---------|-------------|
| `--method <methods>` | — | Metode HTTP yang disertakan, dipisahkan koma, misalnya `get,post` |
| `--path <patterns>` | — | Pola ekspresi reguler yang dipisahkan koma untuk dicocokkan dengan setiap jalur |
| `--tag <tags>` | — | Tag OpenAPI yang disertakan, dipisahkan koma |
| `--operation-id <ids>` | — | Nilai `operationId` yang disertakan, dipisahkan koma |

## Opsi jaringan dan TLS

| Opsi | Bentuk singkat | Bawaan | Deskripsi |
|--------|-------|---------|-------------|
| `--proxy <url>` | `-p` | — | URL proxy HTTP(S), misalnya `http://proxy.corp:8080` |
| `--ca <path>` | — | — | Kumpulan sertifikat CA dalam format PEM |
| `--cert <path>` | — | — | Sertifikat klien PEM untuk mTLS |
| `--key <path>` | — | — | Kunci privat klien PEM untuk mTLS |
| `--insecure` | `-k` | nonaktif | Lewati verifikasi sertifikat TLS |

## Autentikasi, header, dan variabel

| Opsi | Bentuk singkat | Deskripsi |
|--------|-------|-------------|
| `--header <headers...>` | `-H` | Header tambahan dengan format `Key: Value`; dapat diulang |
| `--bearer <token>` | — | Token Bearer yang dikirim dalam header `Authorization` |
| `--variable <vars...>` | `-v` | Variabel Postman dengan format `KEY=VALUE`; dapat diulang |
| `--env <path>` | — | Jalur berkas `.env`; tidak menimpa variabel lingkungan yang sudah ada |

## Opsi gRPC

| Opsi | Bawaan | Deskripsi |
|--------|---------|-------------|
| `--grpc-no-reflection` | nonaktif | Nonaktifkan refleksi server gRPC dan gunakan berkas proto |
| `--grpc-proto <paths...>` | — | Jalur berkas `.proto` atau direktori yang memuatnya |

## Opsi MCP

| Opsi | Bawaan | Deskripsi |
|--------|---------|-------------|
| `--mcp-transport <transport>` | `streamable-http` | Transport MCP: `streamable-http` atau `stdio` |
| `--mcp-command <command>` | — | Perintah MCP stdio, misalnya `npx` |
| `--mcp-args <args>` | — | Argumen MCP stdio yang dipisahkan spasi atau koma |
| `--mcp-cwd <dir>` | — | Direktori kerja subproses MCP stdio |

## Opsi informasi

| Opsi | Bentuk singkat | Deskripsi |
|--------|-------|-------------|
| `--help` | `-h` | Tampilkan bantuan |
| `--version` | `-V` | Tampilkan versi |

## Kode keluar

| Kode | Arti |
|------|---------|
| `0` | Semua pengujian lulus atau `--no-fail-on-error` diaktifkan |
| `1` | Satu atau lebih pengujian gagal atau mengalami kesalahan, atau penguraian argumen CLI gagal |
| `2` | Kesalahan konfigurasi, kegagalan memuat spesifikasi, atau kesalahan runtime fatal |

CLI menampilkan `Error:` berwarna merah dan keluar dengan `2` saat `resolveConfig` melempar kesalahan, misalnya ketika tidak ada `--spec` maupun `specPath` yang dikonfigurasi. CLI menampilkan `Fatal error:` dan keluar dengan `2` saat `runTests` melempar kesalahan. Setelah proses selesai, kode keluar `1` hanya digunakan jika `report.summary.failed > 0 || report.summary.errors > 0` dan `failOnError !== false`.

## Variabel lingkungan

Tidak ada variabel khusus `OPENAPI_CLI_*`. Konfigurasi diberikan melalui opsi, berkas konfigurasi, serta mekanisme berikut:

- **Berkas `.env`** — berikan `--env .env` untuk memuat pasangan `KEY=VALUE` ke `process.env`. Variabel yang sudah ada tidak ditimpa.
- **Ekspansi `${VAR}`** — setelah pemuatan, `${VAR_NAME}` diganti di `serverUrl`, `proxy`, nilai `headers`, `auth.token`, dan nilai `variables`.

```bash
openapi-cli --spec openapi.json \
  --env .env \
  --server 'https://${API_HOST}/v1' \
  --bearer '${BEARER_TOKEN}'
```

## Contoh menjalankan

```bash
# Test a local spec against its first server URL
openapi-cli --spec openapi.json

# Override the server and write JSON + HTML reports
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --format json,html --output ./reports

# Only GET requests, 10 workers, with a bearer token
openapi-cli --spec openapi.json --method get --concurrency 10 --bearer "$TOKEN"

# Use a config file
openapi-cli --config openapi-cli.config.json
```
