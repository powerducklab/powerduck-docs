---
sidebar_position: 6
title: "Konfigurasi"
description: "Prioritas konfigurasi adalah argumen CLI > berkas konfigurasi > nilai bawaan. Hasilnya berupa objek CliConfig yang dikembalikan oleh resolveConfig."
---

# Konfigurasi

Prioritas konfigurasi adalah **argumen CLI > berkas konfigurasi > nilai bawaan**. Hasilnya berupa objek `CliConfig` yang dikembalikan oleh [`resolveConfig`](./api-reference.md#resolveconfig).

## CliConfig

Tipe konfigurasi utama. Semua kolom selain `specPath` bersifat opsional.

| Kolom | Tipe | Bawaan | Deskripsi |
|-------|------|---------|-------------|
| `specPath` | `string` | **wajib** | Jalur atau URL `http(s)://` ke spesifikasi JSON OpenAPI 3.2 |
| `serverUrl` | `string` | *(dari spesifikasi)* | Ganti URL dasar server dari spesifikasi |
| `outputDir` | `string` | `"./openapi-cli-report"` | Direktori untuk berkas laporan |
| `formats` | `ReportFormat[]` | `["json","cli","html"]` | Format laporan yang akan dibuat |
| `filter` | `FilterConfig` | `undefined` | Filter operasi yang akan diuji |
| `concurrency` | `number` | `5` | Maksimum permintaan bersamaan; bilangan bulat 1 hingga 100 |
| `timeout` | `number` | `30000` | Batas waktu per permintaan dalam ms, bilangan bulat 1 hingga 600000; juga berlaku untuk pengambilan spesifikasi jarak jauh |
| `proxy` | `string` | `undefined` | URL proxy HTTP(S), misalnya `http://proxy:8080` |
| `tls` | `TlsConfig` | `undefined` | Konfigurasi TLS dan sertifikat |
| `headers` | `Record<string, string>` | `undefined` | Header tambahan yang dikirim pada setiap permintaan |
| `auth` | `AuthConfig` | `undefined` | Konfigurasi autentikasi |
| `variables` | `Record<string, string>` | `undefined` | Variabel Postman `{{name}}` yang akan disisipkan |
| `failOnError` | `boolean` | `true` | Khusus CLI: kembalikan kode bukan nol setelah pengujian gagal; pemanggil pustaka memeriksa laporan |
| `envFile` | `string` | `undefined` | Jalur berkas `.env` dengan satu pasangan `KEY=VALUE` per baris |
| `grpcReflection` | `boolean` | otomatis | gRPC: konfigurasi eksplisit didahulukan, lalu ekstensi operasi; jika keduanya tidak ada, aktif saat tidak ada jalur proto |
| `grpcProtoPaths` | `string[]` | `undefined` | gRPC: jalur berkas `.proto` atau direktori |
| `mcpTransport` | `"streamable-http" \| "stdio"` | `"streamable-http"` | MCP: transport untuk operasi MCP |
| `mcpCommand` | `string` | `undefined` | MCP stdio: perintah yang dijalankan |
| `mcpArgs` | `string[]` | `undefined` | MCP stdio: argumen perintah |
| `mcpCwd` | `string` | `undefined` | MCP stdio: direktori kerja |

`ReportFormat` adalah union `"json" | "cli" | "html"`.

## Opsi runtime lanjutan

Kolom berikut juga merupakan bagian dari `CliConfig`. `requester`, `maxEvents`, `maxStreamMs`, dan `maxResponseSize` dapat diberikan dalam berkas JSON. Setelah konfigurasi diuraikan, berikan `signal`, `httpRuntime`, dan `resolveTransport` langsung ke `runTests()` melalui kode: ketiganya adalah objek runtime, bukan konfigurasi JSON.

```typescript
interface AdvancedRuntimeOptions {
  requester?: {
    followRedirects?: boolean;
    maxRedirects?: number;
    disableCookies?: boolean;
    protocolVersion?: "http1" | "http2" | "auto";
  };
  maxEvents?: number;
  maxStreamMs?: number;
  maxResponseSize?: number;
  signal?: AbortSignal;
  httpRuntime?: { certificates?: unknown; fileResolver?: unknown };
  resolveTransport?: (target: { protocol: string; url?: string }) => Promise<
    Pick<CliConfig, "proxy" | "tls" | "httpRuntime">
  >;
}
```

`requester` mengatur pengalihan HTTP, cookie, dan pemilihan protokol. Untuk HTTP/SSE, nilai bawaan `maxEvents` adalah 50 dan `maxStreamMs` memakai `timeout` jika tidak ditentukan; `maxResponseSize` diteruskan ke runtime permintaan. gRPC menggunakan `maxStreamMs` sebagai tenggat aliran, lalu `timeout`, kemudian 30000 ms sebagai cadangan terakhir. `signal` membatalkan eksekusi; `httpRuntime` menyediakan penanganan sertifikat dan berkas HTTP; `resolveTransport` menentukan pengaturan transport per target.

## DEFAULT_CONFIG

Objek nilai bawaan yang diekspor oleh pustaka:

```ts
export const DEFAULT_CONFIG: Required<
  Pick<
    CliConfig,
    "outputDir" | "formats" | "concurrency" | "timeout" | "failOnError" | "grpcReflection" | "mcpTransport"
  >
> = {
  outputDir: "./openapi-cli-report",
  formats: ["json", "cli", "html"],
  concurrency: 5,
  timeout: 30000,
  failOnError: true,
  grpcReflection: true,
  mcpTransport: "streamable-http",
};
```

## FilterConfig

| Kolom | Tipe | Deskripsi |
|-------|------|-------------|
| `methods` | `string[]` | Hanya uji metode HTTP ini, misalnya `["get","post"]`; gunakan huruf kecil dalam berkas, sedangkan masukan CLI dinormalisasi |
| `paths` | `string[]` | Hanya uji jalur yang cocok dengan salah satu pola regex; beralih ke pencocokan substring jika regex tidak valid |
| `tags` | `string[]` | Hanya uji operasi dengan salah satu tag ini |
| `operationIds` | `string[]` | Hanya uji nilai `operationId` yang sama persis |

Filter tanpa kunci diuraikan menjadi `undefined`, sehingga semua operasi dijalankan.

## TlsConfig

| Kolom | Tipe | Deskripsi |
|-------|------|-------------|
| `caCert` | `string` | Jalur kumpulan sertifikat CA dalam format PEM |
| `clientCert` | `string` | Jalur sertifikat klien PEM untuk mTLS |
| `clientKey` | `string` | Jalur kunci privat klien PEM untuk mTLS |
| `strictSSL` | `boolean` | Lewati verifikasi sertifikat TLS jika `false`; tidak aman |
| `pfx` | `string` | Jalur kumpulan sertifikat PFX; gRPC memerlukan PEM |
| `passphrase` | `string` | Frasa sandi untuk materi sertifikat terenkripsi |

> Catatan: opsi CLI `--insecure` dipetakan ke `tls.strictSSL = false`, sehingga **menonaktifkan** verifikasi.

## AuthConfig

| Kolom | Tipe | Deskripsi |
|-------|------|-------------|
| `type` | `AuthConfig["type"]` | Skema autentikasi; nama yang didukung tercantum di bawah |
| `parameters` | `Record<string, string \| number \| boolean>` | Parameter khusus skema yang diteruskan ke runtime permintaan |
| `token` | `string` | Token Bearer untuk `type: "bearer"` |
| `username` | `string` | Nama pengguna untuk `type: "basic"` |
| `password` | `string` | Kata sandi untuk `type: "basic"` |
| `key` | `string` | Nama kunci API untuk `type: "apikey"` |
| `value` | `string` | Nilai kunci API untuk `type: "apikey"` |
| `in` | `"header" \| "query"` | Lokasi penempatan kunci API |

Nilai `type` yang didukung adalah `bearer`, `basic`, `apikey`, `none`, `digest`, `oauth1`, `oauth2`, `jwt`, `hawk`, `aws4`, `ntlm`, `asap`, dan `edgegrid`. Ketersediaan serta parameter wajib bergantung pada protokol dan runtime permintaan; menyebut namanya saja belum mengonfigurasi autentikasi.

Saat ini opsi CLI `--bearer` hanya menghasilkan `{ type: "bearer", token }`. Konfigurasi `basic` / `apikey` yang lebih lengkap diberikan melalui berkas konfigurasi.

## Berkas konfigurasi JSON

Berkas berupa JSON biasa yang sesuai dengan `Partial<CliConfig>`. Berikan dengan `--config <path>` / `-c`. Argumen CLI selalu mengungguli nilai dalam berkas.

```json
{
  "specPath": "./openapi.json",
  "serverUrl": "https://api.staging.example.com",
  "outputDir": "./reports",
  "formats": ["json", "html"],
  "concurrency": 10,
  "timeout": 15000,
  "failOnError": true,
  "proxy": "http://proxy.corp:8080",
  "tls": {
    "strictSSL": true,
    "caCert": "./ca-bundle.pem",
    "clientCert": "./client.crt",
    "clientKey": "./client.key"
  },
  "headers": {
    "X-API-Key": "${API_KEY}",
    "X-Environment": "staging"
  },
  "auth": {
    "type": "bearer",
    "token": "${BEARER_TOKEN}"
  },
  "variables": {
    "host": "api.staging.example.com"
  },
  "filter": {
    "methods": ["get", "post"],
    "tags": ["v2", "public"],
    "paths": ["^/api/v2"],
    "operationIds": ["getUser", "createUser"]
  },
  "grpcReflection": true,
  "grpcProtoPaths": ["./proto"],
  "mcpTransport": "streamable-http",
  "mcpCommand": "npx",
  "mcpArgs": ["-y", "@modelcontextprotocol/server-everything"],
  "mcpCwd": "./mcp-servers"
}
```

Berkas yang tidak ada memicu `Config file not found: <path>`; JSON tidak valid memicu `Invalid config file (must be JSON)`.

## Ekspansi variabel lingkungan

Setelah berkas `.env` dimuat melalui `--env` / `envFile`, referensi `${VAR_NAME}` diperluas dalam kolom string berikut:

- `serverUrl`
- `proxy`
- Nilai `headers`
- `auth.token`
- Nilai `variables`

Contoh:

```bash
openapi-cli --spec openapi.json \
  --server 'https://${API_HOST}/v1' \
  --header 'Authorization: Bearer ${BEARER_TOKEN}'
```

Perilaku `.env`: entri `process.env` yang sudah ada **tidak** ditimpa; tanda petik tunggal atau ganda yang mengapit nilai dihapus; baris kosong dan komentar `#` diabaikan; berkas yang tidak ada dilewati tanpa pemberitahuan.

## Menyusun konfigurasi dalam kode

```typescript
import { resolveConfig, DEFAULT_CONFIG } from "@powerduck/openapi-cli";

const config = resolveConfig({
  spec: "./openapi.json",
  server: "https://api.staging.example.com",
  concurrency: 10,
  method: "get",
});
```

`resolveConfig` melempar `"No OpenAPI spec path provided..."` jika spesifikasi tidak diberikan, dan `Invalid proxy URL: <url>` jika `proxy` bukan URL yang valid.
