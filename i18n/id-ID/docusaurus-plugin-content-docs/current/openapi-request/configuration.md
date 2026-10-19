---
sidebar_position: 4
title: "Konfigurasi"
description: "Konfigurasi terbagi menjadi tiga lapisan: opsi fungsi pembuat klien/debugger, objek SendOptions yang diteruskan ke prepare() dan send(), serta opsi khusus protokol."
---

# Konfigurasi

Konfigurasi terbagi menjadi tiga lapisan: opsi fungsi pembuat klien/debugger, objek `SendOptions` yang diteruskan ke `prepare()` dan `send()`, serta opsi khusus protokol.

## Opsi fungsi pembuat

### `CreateClientOptions`

Diteruskan ke `createClient(options?)`. Semua kolom bersifat opsional.

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `writeBack` | `WriteBackOptions` | Mengatur cara respons digabungkan kembali ke spesifikasi |
| `response` | `ToResponseOptions` | Mengatur cara objek respons dinormalisasi |

```typescript
import { createClient } from "@powerduck/openapi-request";

const client = createClient({
  writeBack: {
    overwriteExamples: true,
    // ... other WriteBackOptions
  },
  response: {
    includeExamples: false,
    // ... other ToResponseOptions
  },
});
```

### `DebuggerOptions`

Diteruskan ke `createDebugger(config?)`. Semua kolom bersifat opsional.

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `adapters` | `ProtocolAdapter[]` | Daftar adaptor kustom (menggantikan seluruh adaptor bawaan) |
| `extraAdapters` | `ProtocolAdapter[]` | Adaptor tambahan untuk registri bawaan |
| `writeBack` | `WriteBackOptions` | Opsi penulisan kembali |
| `response` | `ToResponseOptions` | Opsi normalisasi respons |
| `writeBackTruncated` | `boolean` | Menuliskan kembali skema yang disimpulkan dari aliran terpotong (bawaan: `true`) |

```typescript
import { createDebugger, HttpAdapter, WebSocketAdapter } from "@powerduck/openapi-request";

// Use only HTTP and WebSocket adapters
const debugger1 = createDebugger({
  adapters: [new HttpAdapter(), new WebSocketAdapter()],
});

// Add a custom adapter to the defaults
const debugger2 = createDebugger({
  extraAdapters: [new MyCustomAdapter()],
  writeBackTruncated: true,
});
```

### Penulisan kembali dan contoh yang direkam

`WriteBackOptions` mendukung `strategy` (`"merge"` atau `"replace"`, bawaan `"merge"`), `keepExistingDescription` (bawaan `true`), `allowedStatusCodes` (kosong berarti semua), `protectComponentRefs` (bawaan `true`), `overwriteExamples` (bawaan `true`), dan `requirePassingTests`. Alur pengiriman menerapkan syarat kelulusan pengujian; pemanggilan langsung `writeBackResponse` tidak menerapkannya.

`ToResponseOptions` mendukung `includeExamples` (bawaan `true`), `maxExampleChars` (bawaan `4000`), dan `maxEventPreviewChars` (bawaan `200`). Nonaktifkan perekaman contoh atau tinjau sebelum diterbitkan: respons nyata dapat memuat kredensial atau data pribadi.

Alur pengiriman biasanya mengembalikan salinan yang telah diubah melalui `patchedSpec`; alur ini tidak mengubah dokumen masukan atau menyimpan berkas. Atur `writeBack: false` pada pemanggilan untuk melewati langkah tersebut. Objek `writeBack` pada fungsi pembuat mengatur penggabungan; nilai boolean per pemanggilan mengaktifkan atau menonaktifkannya.

## `SendOptions`

Objek masukan utama untuk `prepare()` dan `send()`. Di sini Anda meneruskan spesifikasi, target, nilai, dan seluruh konfigurasi tingkat permintaan.

| Kolom | Tipe | Wajib | Keterangan |
| --- | --- | --- | --- |
| `spec` | `OpenApiDocument` | Ya | Dokumen OpenAPI 3.2 lengkap |
| `target` | `OperationTarget` | Ya | Pengenal operasi (lihat di bawah) |
| `values` | `RequestValues` | Tidak | Nilai konkret untuk path/query/header/cookie/body |
| `serverUrl` | `string` | Tidak | Menggantikan `spec.servers[0].url` |
| `serverVariables` | `Record<string, string>` | Tidak | Variabel templat URL server |
| `variables` | `Record<string, string>` | Tidak | Variabel lingkungan yang dirujuk sebagai `{{name}}` |
| `globals` | `Record<string, string>` | Tidak | Variabel global bergaya Postman |
| `localVariables` | `Record<string, string>` | Tidak | Variabel lokal |
| `collectionVariables` | `Record<string, string>` | Tidak | Variabel tingkat koleksi |
| `auth` | `AuthConfig` | Tidak | Konfigurasi autentikasi |
| `scripts` | `ScriptConfig` | Tidak | Skrip prapermintaan dan pengujian |
| `runner` | `RuntimeRunOptions` | Tidak | Penerusan seluruh opsi postman-runtime secara langsung (prioritas tertinggi) |
| `websocket` | `WebSocketOptions` | Tidak | Opsi khusus WebSocket |
| `graphql` | `GraphQLOptions` | Tidak | Opsi khusus GraphQL |
| `mcp` | `McpOptions` | Tidak | Opsi khusus MCP |
| `grpc` | `any` | Tidak | Opsi khusus gRPC |
| `timeout` | `number` | Tidak | Batas waktu per permintaan dalam milidetik (pintasan untuk `runner.timeout.request`) |

`SendOptions` juga menerima kontrol eksekusi dan streaming berikut:

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `fetch` | `typeof fetch` | Transport fetch terisolasi yang disediakan host jika didukung; HTTP/SSE tetap menggunakan postman-runtime. |
| `writeBack` | `boolean` | Atur ke `false` agar `patchedSpec` tetap undefined sementara `responseFragment` tetap dihasilkan. |
| `signal` | `AbortSignal` | Membatalkan eksekusi atau pengambilan sampel; hasil parsial masih dapat dikembalikan. |
| `maxEvents` | `number` | Jumlah maksimum peristiwa streaming yang disimpan. |
| `maxStreamMs` | `number` | Durasi maksimum pengambilan sampel streaming dalam milidetik. |
| `maxResponseSize` | `number` | Batas ukuran respons dalam byte. |
| `maxBufferChars` | `number` | Batas buffer parser SSE sebelum batas peristiwa; bawaan `4194304` karakter. |
| `maxEventChars` | `number` | Batas data yang disimpan per peristiwa SSE; bawaan `1048576` karakter. |
| `inheritEventId` | `boolean` | Mewarisi ID peristiwa SSE terakhir jika tidak ada ID baru; bawaan `true`. Atur ke `false` untuk inferensi skema yang lebih ketat. |
| `onEvent` | `(event: StreamEvent) => void` | Menerima peristiwa streaming. |
| `onConsole` | `(log: ConsoleLog) => void` | Menerima keluaran konsol skrip. |
| `onAssertion` | `(assertion: AssertionResult) => void` | Menerima hasil asersi. |
| `onResponseStart` | `(info: ResponseStartInfo) => void` | Memeriksa header awal HTTP/SSE dan klasifikasi `streaming`. |
| `onOpen` | `(info) => void` | Menerima detail koneksi WebSocket: URL, protokol, dan header. |

Adaptor protokol dapat menafsirkan batas secara berbeda. Pastikan callback UI tetap ringan; pengecualian yang dilempar callback ditangkap oleh lapisan eksekusi. Untuk pengaturan peminta HTTP, gunakan `runner.requester`; jika diberikan, `maxResponseSize` harus positif, bukan nol.

### `OperationTarget`

Mengidentifikasi satu operasi. Sebaiknya gunakan `operationId` atau `method` + `path`. Jika keduanya diberikan, `operationId` diutamakan.

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `operationId` | `string` | Kunci pencarian alternatif; diutamakan daripada path + method |
| `method` | `string` | Metode HTTP, tidak peka huruf besar-kecil. Memerlukan `path`. |
| `path` | `string` | Path bertemplat, misalnya `/users/{id}`. Memerlukan `method`. |

```typescript
// By operationId (recommended)
const result1 = await client.send({
  spec,
  target: { operationId: "getUserById" },
});

// By method + path
const result2 = await client.send({
  spec,
  target: { method: "GET", path: "/users/{id}" },
});
```

### `RequestValues`

Nilai konkret yang dimasukkan ke permintaan yang dihasilkan.

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `path` | `Record<string, unknown>` | Nilai parameter path |
| `query` | `Record<string, unknown>` | Nilai parameter kueri |
| `header` | `Record<string, unknown>` | Nilai header |
| `cookie` | `Record<string, unknown>` | Nilai cookie |
| `querystring` | `string` | String kueri mentah yang sudah dienkode (lokasi `querystring` pada OpenAPI 3.2) |
| `body` | `unknown` | Isi permintaan |
| `contentType` | `string` | Memaksa tipe media permintaan tertentu saat operasi mendeklarasikan beberapa tipe |

```typescript
const result = await client.send({
  spec,
  target: { operationId: "updateUser" },
  values: {
    path: { id: "42" },
    query: { version: "2" },
    header: { "X-Request-Id": "abc-123" },
    body: { name: "Alice", email: "alice@example.com" },
    contentType: "application/json",
  },
});
```

### `AuthConfig`

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `type` | `AuthConfig["type"]` | Jenis autentikasi |
| `token` | `string` | Token Bearer (untuk `type: "bearer"`) |
| `username` | `string` | Nama pengguna autentikasi Basic (untuk `type: "basic"`) |
| `password` | `string` | Kata sandi autentikasi Basic (untuk `type: "basic"`) |
| `key` | `string` | Nama kunci API (untuk `type: "apikey"`) |
| `value` | `string` | Nilai kunci API (untuk `type: "apikey"`) |
| `in` | `"header" \| "query"` | Lokasi kunci API (untuk `type: "apikey"`) |

```typescript
// Bearer token
const result1 = await client.send({
  spec,
  target: { operationId: "getUser" },
  auth: { type: "bearer", token: "your-jwt-token" },
});

// Basic auth
const result2 = await client.send({
  spec,
  target: { operationId: "getUser" },
  auth: { type: "basic", username: "admin", password: "secret" },
});

// API key in header
const result3 = await client.send({
  spec,
  target: { operationId: "getUser" },
  auth: { type: "apikey", key: "X-API-Key", value: "key-123", in: "header" },
});
```

Jenis autentikasi lanjutan meliputi `digest`, `oauth1`, `oauth2`, `jwt`, `hawk`, `aws4`, `ntlm`, `asap`, dan `edgegrid`. Teruskan kolom helper Postman untuk HTTP/SSE/GraphQL melalui `parameters: Record<string, string | boolean | number>`. Opsi `oauth2: OAuth2FlowConfig` mengaktifkan perolehan dan penyegaran token untuk jenis OAuth 2.0; jangan menganggap semua helper autentikasi berlaku untuk semua protokol.

### `ScriptConfig`

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `collectionPreRequest` | `ScriptSource \| ScriptSource[]` | Skrip prapermintaan tingkat koleksi |
| `collectionTest` | `ScriptSource \| ScriptSource[]` | Skrip pengujian tingkat koleksi |
| `preRequest` | `ScriptSource \| ScriptSource[]` | Skrip prapermintaan tingkat permintaan |
| `test` | `ScriptSource \| ScriptSource[]` | Skrip pengujian tingkat permintaan |
| `fromSpecExtensions` | `boolean` | Membaca `x-postman-scripts` dari spesifikasi (bawaan: `true`) |
| `captureLastResponse` | `boolean` | Menambahkan helper bawaan yang menyediakan respons terakhir bagi permintaan berikutnya |

`ScriptSource`:
```typescript
interface ScriptSource {
  exec: string | string[];  // Script body, either a single string or array of lines
  id?: string;               // Optional identifier surfaced in script results
}
```

Atur `scripts.fromSpecExtensions: false` jika Anda tidak ingin menjalankan skrip yang tertanam dalam spesifikasi impor. Nilai bawaan saat ini adalah `true`; jangan mengandalkan perubahan nilai bawaan di masa mendatang.

## Opsi khusus protokol

### HTTP / SSE

HTTP adalah adaptor bawaan. Deklarasi konten `text/event-stream` menunjukkan penggunaan SSE; saat header diterima, eksekusi juga mengklasifikasikan respons nyata. `probeStreamingResponse()` adalah pemeriksaan eksplisit terpisah, bukan prasyarat otomatis untuk setiap pemanggilan.

Permintaan HTTP dasar tidak memerlukan konfigurasi tambahan. Gunakan `SendOptions.runner` untuk konfigurasi lanjutan postman-runtime.

### WebSocket

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "websocket",
  url: "wss://api.example.com/ws",
  // Manual-session options are distinct from SendOptions.websocket.
});
```

### MCP

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "mcp",
  endpoint: "https://api.example.com/mcp",
});
```

Sesi manual MCP bawaan menggunakan Streamable HTTP dan `endpoint`. Untuk stdio, teruskan `kind: "mcp"`, `transport: "stdio"`, serta `command` lokal dengan `args` opsional; memulai sesi akan menjalankan proses yang dikonfigurasi.

### gRPC

gRPC memerlukan alamat, sumber deskriptor (berkas `.proto` atau refleksi server), serta nama layanan lengkap dan metode:

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "grpc",
  address: "localhost:50051",
  service: "powerduck.examples.Echo",
  method: "Echo",
  protoPaths: ["./echo.proto"],
});
```

Fungsi pembuat sesi manual mengembalikan sesi yang belum dibuka. Panggil `open()` sebelum mengirim dan `close()` saat membersihkan sumber daya. Contoh gRPC memerlukan server lokal dan berkas proto yang sesuai; opsi sesi manual bukan objek yang sama dengan `SendOptions.grpc`.

## Contoh lengkap

```typescript
import { createClient } from "@powerduck/openapi-request";

const client = createClient({
  writeBack: { overwriteExamples: true },
});

const result = await client.send({
  spec: openApiDocument,
  target: { operationId: "updateUser" },
  values: {
    path: { id: "42" },
    query: { verbose: "true" },
    header: { "X-Request-Id": "req-abc" },
    body: { name: "Alice", email: "alice@example.com" },
  },
  serverUrl: "https://api.staging.example.com",
  auth: { type: "bearer", token: "staging-token" },
  timeout: 10000,
  variables: {
    environment: "staging",
  },
});

console.log(result.response.status);
console.log(result.response.body);
console.log(result.response.headers);
```

## Langkah berikutnya

- Lihat [Referensi API](./api-reference.md) untuk seluruh tipe yang diekspor
- Jelajahi [Contoh](./examples.md) untuk panduan khusus protokol
