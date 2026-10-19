---
sidebar_position: 4
title: "Konfigurasi"
description: "Opsi pembuatan kode @powerduck/openapi-codegen: GenerateOptions, RequestIR, serta antarmuka Generator dan Plugin."
---

# Konfigurasi

Tidak ada file konfigurasi terpisah. Pembuatan kode dikontrol oleh objek `GenerateOptions` yang diberikan ke [`generate()`](/docs/id-ID/openapi-codegen/api-reference/).

## GenerateOptions

```ts
interface GenerateOptions {
  language: string;
  client: string;
  request?: RequestIR;
  document?: unknown;
  path?: string;
  method?: string;
  serverUrl?: string;
  securityValues?: Record<string, string>;
  softRefMode?: boolean;
}
```

| Opsi | Tipe | Wajib | Deskripsi |
|---|---|---|---|
| `language` | `string` | ya | Pengenal bahasa tujuan tanpa membedakan huruf besar-kecil, misalnya `"javascript"` |
| `client` | `string` | ya | Pengenal klien HTTP tujuan, misalnya `"fetch"` |
| `request` | `RequestIR` | salah satu* | Permintaan yang sudah dinormalisasi; melewati `normalize` |
| `document` | `unknown` | salah satu* | Objek dokumen OpenAPI yang sudah diparsing |
| `path` | `string` | dengan `document` | Templat jalur OpenAPI yang persis, misalnya `"/pets/{id}"` |
| `method` | `string` | dengan `document` | Metode HTTP, misalnya `"get"` / `"post"` |
| `serverUrl` | `string` | tidak | Mengganti URL server dari dokumen |
| `securityValues` | `Record<string, string>` | tidak | Kredensial dengan kunci berupa nama skema keamanan |
| `softRefMode` | `boolean` | tidak | Tidak melempar kesalahan untuk `$ref` rusak atau melingkar; mengembalikan nilai parsial |

\* Berikan hanya `request`, atau gabungan `document` + `path` + `method`. Jika `request` diberikan, `document`, `path`, `method`, `serverUrl`, `securityValues`, dan `softRefMode` diabaikan.

### Kesalahan validasi input

`generate()` melempar kesalahan jika input wajib tidak ada:

- `TypeError: generate() requires an options object` — Objek opsi tidak tersedia.
- `Error: Unsupported generator: <language>/<client>` — Kombinasi tidak dikenal.
- `TypeError: generate() requires either a 'request' or a 'document' option`
- `TypeError: generate() requires a 'path' option when using 'document'`
- `TypeError: generate() requires a 'method' option when using 'document'`

`normalize()` sendiri melempar `Error` untuk metode yang tidak didukung, `paths` yang tidak ada, jalur tidak dikenal, dan operasi yang tidak ada; serta `TypeError` jika dokumen bukan objek.

## RequestIR

Representasi satu permintaan yang dinormalisasi dan tidak bergantung pada pembuat kode. Anda dapat menyusunnya langsung dan memberikannya sebagai `options.request` untuk melewati `normalize`.

```ts
interface RequestIR {
  method: string;
  baseUrl: string;
  path: string;
  parameters: Parameter[];
  headers: Parameter[];
  body?: Body;
  security: Security[];
}
```

### Parameter

```ts
interface Parameter {
  name: string;
  in: ParameterLocation;
  value: unknown;
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
}

type ParameterLocation = "path" | "query" | "querystring" | "header" | "cookie";
```

### Body

```ts
interface Body {
  mediaType: string;
  value: unknown;
  encoding?: Record<string, unknown>;
}
```

### Security

```ts
interface Security {
  name: string;
  type: string;       // e.g. "apiKey" | "http"
  scheme?: string;    // e.g. "bearer" | "basic"
  in?: string;        // e.g. "header" | "query" | "cookie"
  paramName?: string;
  value: string;
}
```

### FileValue

Placeholder file multipart memakai struktur penanda berikut:

```ts
interface FileValue {
  __file: true;
  path?: string;
  name?: string;
  contentType?: string;
  data?: string | ArrayBuffer | Uint8Array | Blob;
}
```

## Generator

Generator adalah objek apa pun yang sesuai dengan antarmuka ini. Generator bawaan dibuat dengan `createGenerator(language, client, emit)`, tetapi Anda juga dapat mendaftarkan generator sendiri:

```ts
interface Generator {
  language: string;
  client: string;
  generate(request: RequestIR): string;
}
```

`generate` menerima `RequestIR` dan mengembalikan kode sumber yang dihasilkan sebagai string.

## Plugin

Plugin mendaftarkan satu atau beberapa generator melalui `use()`:

```ts
interface Plugin {
  name: string;
  register(api: { register(generator: Generator): void }): void;
}
```

Contoh:

```typescript
import { use } from "@powerduck/openapi-codegen";

use({
  name: "my-plugin",
  register({ register }) {
    register({
      language: "mylang",
      client: "my-client",
      generate(request) {
        return `// ${request.method} ${request.path}`;
      },
    });
  },
});
```

## GenerateResult

Tipe ini disiapkan untuk keluaran generator di masa depan yang dapat mencakup beberapa file. Saat ini `generate()` tetap mengembalikan `string`:

```ts
interface GenerateResult {
  code: string;
  files?: Record<string, string>;
  metadata?: Record<string, unknown>;
}
```

## Struktur keluaran normalize

Memanggil `normalize()` secara langsung (lihat [referensi API](/docs/id-ID/openapi-codegen/api-reference/#normalizeoptions)) mengembalikan objek yang sedikit lebih luas daripada `RequestIR`:

```ts
{
  preWarnings: string[];   // lightweight structural warnings
  method: string;          // uppercase
  baseUrl: string;
  path: string;
  parameters: NormalizedParameter[];
  headers: NormalizedParameter[];   // parameters filtered to in === "header"
  body?: { mediaType, value, encoding? };
  security: NormalizedSecurity[];
}
```

## Urutan penentuan URL server

`baseUrl` menggunakan nilai pertama yang tidak kosong dari:

1. `options.serverUrl`
2. `servers` pada operasi
3. `servers` pada item jalur
4. `servers` di tingkat akar
5. nilai cadangan `"https://example.com"`

Placeholder server `{variable}` diisi dari `server.variables` menggunakan nilai `default`, lalu `example` jika tidak ada, dengan pengodean URI.
