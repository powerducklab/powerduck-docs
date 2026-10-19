---
sidebar_position: 5
title: "Referensi API"
description: "Referensi API integrasi utama @powerduck/openapi-request"
---

# Referensi API

Referensi API integrasi utama `@powerduck/openapi-request`. Tabel merangkum kontrak; deklarasi TypeScript paket menjadi acuan lengkap untuk overload dan parameter opsional. Ekspor dari titik masuk utama dan subpath protokol tidak sama persis.

## API inti

### `createClient(options?): ProtoClient`

Membuat klien yang dirancang untuk antarmuka pengguna. Argumen `options` bersifat opsional.

**Parameter:**

| Nama | Tipe | Keterangan |
| --- | --- | --- |
| `options` | `CreateClientOptions` | Konfigurasi opsional |
| `options.writeBack` | `WriteBackOptions` | Mengatur cara respons digabungkan kembali ke spesifikasi |
| `options.response` | `ToResponseOptions` | Mengatur cara objek respons dinormalisasi |

**Mengembalikan:** `ProtoClient` dengan metode berikut:

| Metode | Tanda tangan | Keterangan |
| --- | --- | --- |
| `prepare` | `(sendOptions: SendOptions) => PreparedRequest` | Merencanakan permintaan dan mengembalikan protokol, mode tampilan, serta jenis aliran |
| `send` | `(sendOptions: SendOptions) => Promise<SendResult>` | Menjalankan permintaan |
| `sendMany` | `(spec, targets, shared?) => Promise<SendManyResult>` | Eksekusi batch dengan hasil per target; kegagalan tidak membuang hasil target lain |
| `connect` | `(connectOptions: ManualSessionOptions) => AnyManualSession` | Membuat sesi websocket/mcp/grpc yang belum dibuka; panggil `open()` untuk terhubung |
| `discover` | `(discoverOptions) => Promise<any>` | Menemukan kemampuan MCP dan gRPC |
| `writeback` | `(spec, prepared, result, writeOptions?) => OpenApiDocument` | Menggabungkan respons yang diamati ke dokumen |
| `dispose` | `() => void` | Saat ini tidak melakukan tindakan; pemanggil harus menutup sesinya sendiri |
| `probeStreamingResponse` | `(input: RequestInfo \| URL, init?: RequestInit) => Promise<{ ok: boolean; status: number; contentType?: string; kind: "none" \| "sse" \| "ndjson" \| "chunked"; response: Response }>` | Menjalankan permintaan fetch dan mengklasifikasikan responsnya; baca atau batalkan isi respons yang dikembalikan |

**Contoh:**

```typescript
import { createClient } from "@powerduck/openapi-request";

const client = createClient({
  writeBack: { overwriteExamples: true },
});

const plan = client.prepare({
  spec,
  target: { operationId: "getUserById" },
});

const result = await client.send({
  spec,
  target: { operationId: "getUserById" },
  values: { path: { id: "42" } },
});
```

### `createDebugger(config?): ProtoKit`

Membuat debugger berbasis skrip untuk otomatisasi, skrip, dan CI.

**Parameter:**

| Nama | Tipe | Keterangan |
| --- | --- | --- |
| `config` | `DebuggerOptions` | Konfigurasi opsional |
| `config.adapters` | `ProtocolAdapter[]` | Daftar adaptor kustom yang menggantikan adaptor bawaan |
| `config.extraAdapters` | `ProtocolAdapter[]` | Adaptor tambahan untuk adaptor bawaan |
| `config.writeBack` | `WriteBackOptions` | Opsi penulisan kembali |
| `config.response` | `ToResponseOptions` | Opsi normalisasi respons |
| `config.writeBackTruncated` | `boolean` | Menuliskan skema yang disimpulkan dari aliran terpotong (bawaan: true) |

**Mengembalikan:** `ProtoKit` dengan `prepare`, `send`, `sendMany`, `toCollection`, dan lainnya.

**Contoh:**

```typescript
import { createDebugger } from "@powerduck/openapi-request";

const dbg = createDebugger({
  writeBackTruncated: true,
});

const result = await dbg.send({
  spec,
  target: { operationId: "getUserById" },
  values: { path: { id: "42" } },
  serverUrl: "https://api.example.com",
});
```

### `createManualSession(options): AnyManualSession`

Membuat sesi dupleks berumur panjang untuk WebSocket, MCP, dan gRPC. Fungsi pembuat tidak melakukan I/O; koneksi dibuka melalui `open()`.

**Parameter:**

| Nama | Tipe | Keterangan |
| --- | --- | --- |
| `options.kind` | `"websocket" \| "mcp" \| "grpc"` | Protokol yang digunakan |
| `options.url` | `string` | URL koneksi WebSocket |
| `options.endpoint` | `string` | Endpoint MCP Streamable HTTP |
| `options.transport` | `"streamable-http" \| "stdio"` | Transport MCP; bawaannya Streamable HTTP |
| `options.command`, `options.args` | `string`, `string[]` | Program lokal dan argumen untuk MCP stdio |
| `options.address`, `options.service`, `options.method` | `string` | Alamat gRPC, nama layanan lengkap, dan metode |

Untuk gRPC, berikan juga sumber deskriptor melalui `protoPaths` atau `reflection`. Opsi per protokol tersedia di [Konfigurasi](./configuration.md).

**Mengembalikan:** sesi dengan `open()`, `send()`, `close()`, `onEvent()`, `waitForClose()`, `events`, dan `state`. `onEvent()` mengembalikan objek langganan dengan `unsubscribe()`.

**Contoh:**

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "websocket",
  url: "wss://api.example.com/ws",
});

const subscription = session.onEvent((event) => {
  console.log(event.kind, event.data);
});
try {
  await session.open();
  await session.send({ type: "message", data: "hello" });
} finally {
  await session.close();
  subscription.unsubscribe();
}
```

### `AdapterRegistry`

Registri instans `ProtocolAdapter`. Registri baru dimulai dalam keadaan kosong; `createDebugger()` mendaftarkan adaptor bawaan HTTP, WebSocket, gRPC, MCP, dan GraphQL kecuali digantikan daftar kustom. Gunakan `register()`, `unregister()`, `get()`, `list()`, `rank()`, dan `resolve()` untuk mengelola pemilihan.

### `ProtoKitError`

Galat bertipe yang dilempar debugger dan jalur eksekusi inti. Gunakan `instanceof ProtoKitError` untuk membedakan galat pustaka dari kegagalan tak terduga.

## Tipe inti

### `SendOptions`

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

### `PreparedRequest`

Dikembalikan oleh `createClient().prepare()`. Debugger memiliki hasil perencanaan berbeda: `createDebugger().prepare()` mengembalikan `PlanResult` dengan `located`, `adapter`, dan `plan`.

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `protocol` | `string` | Protokol yang ditentukan (http, websocket, grpc, graphql, mcp) |
| `transport` | `string` | Transport yang ditentukan |
| `target` | `OperationTarget` | Target asli |
| `operation` | `any` | Objek operasi OpenAPI yang ditemukan |
| `display.mode` | `DisplayMode` | `"response" \| "event-list" \| "duplex-session"` |
| `stream.kind` | `StreamKind` | Klasifikasi aliran (lihat di bawah) |
| `stream.expected` | `boolean` | Apakah streaming diharapkan |
| `openapi.extensions` | `Record<string, unknown>` | Ekstensi OpenAPI yang ditentukan |
| `warnings` | `string[]` | Peringatan selama perencanaan |

### `StreamKind`

Klasifikasi aliran yang terperinci: `"none" | "sse" | "ndjson" | "chunked" | "websocket" | "graphql-stream" | "grpc-unary" | "grpc-server-stream" | "grpc-client-stream" | "grpc-bidi" | "mcp-http-stream" | "mcp-stdio"`

## Fungsi pembantu OpenAPI

| Ekspor | Tanda tangan | Keterangan |
| --- | --- | --- |
| `locateOperation` | `(spec, target) => LocatedOperation` | Menemukan operasi berdasarkan `OperationTarget` |
| `inferSchema` | `(value) => Schema` | Menyimpulkan JSON Schema dari satu nilai yang diamati |
| `inferSchemaFromMany` | `(values) => Schema` | Menyimpulkan skema yang mencakup beberapa nilai yang diamati |
| `mergeSchema` | `(a, b) => Schema` | Menggabungkan dua skema hasil inferensi (gabungan atau kombinasi) |
| `sampleFromSchema` | `(schema) => unknown` | Menghasilkan nilai contoh yang realistis untuk skema |
| `toResponseObject` | `(result, options?) => { statusCode: string; response: any }` | Membuat objek respons OpenAPI dari hasil yang diamati |
| `writeBackResponse` | `(spec, path, method, fragment, options?) => spec` | Menggabungkan respons yang diamati ke dalam dokumen |

Tipe yang diekspor: `LocatedOperation`, `WriteBackOptions`, `ToResponseOptions`.

## HTTP / SSE

Nama berikut tersedia dari titik masuk utama. Subpath `@powerduck/openapi-request/http` mengekspor `HttpAdapter`, `SseParser`, `buildCollection`, `buildEnvironment`, `resolveServerUrl`, `buildRunOptions`, dan `runWithPostman`; impor fungsi deteksi dan `BUILTIN_CAPTURE_TEST` dari titik masuk utama.

| Ekspor | Keterangan |
| --- | --- |
| `HttpAdapter` | Adaptor protokol bawaan untuk HTTP/HTTPS |
| `SseParser` | Parser streaming yang mengubah aliran byte SSE menjadi peristiwa terstruktur |
| `isStreamingOperation` | Mengklasifikasikan operasi sebagai streaming berdasarkan tipe konten yang dideklarasikan |
| `isSseContentType` | Memeriksa apakah tipe konten menunjukkan SSE |
| `isStreamingContentType` | Memeriksa apakah tipe konten menunjukkan streaming |
| `acceptHeaderFor` | Menghasilkan header Accept yang sesuai untuk operasi |
| `probeStreamingResponse` | Menjalankan permintaan fetch dan mengklasifikasikan responsnya; baca atau batalkan isi respons yang dikembalikan |
| `BUILTIN_CAPTURE_TEST` | Skrip pengujian Postman bawaan untuk merekam respons terakhir |

## WebSocket

Impor dari `@powerduck/openapi-request/ws`.

| Ekspor | Keterangan |
| --- | --- |
| `WebSocketAdapter` | Adaptor protokol untuk target WebSocket |
| `createWsManualSession` | Membuat sesi WebSocket manual dupleks, juga tersedia sebagai `runWebSocketSession` dan `wsManualSession` |

## GraphQL

Impor dari `@powerduck/openapi-request/graphql`.

| Ekspor | Keterangan |
| --- | --- |
| `GraphQLAdapter` | Adaptor protokol untuk target GraphQL |
| `resolveGraphQLConfig` | Menentukan konfigurasi GraphQL dari operasi |
| `runGraphQL` | Menjalankan operasi GraphQL |
| `introspectSchema` | Melakukan introspeksi skema endpoint GraphQL |
| `INTROSPECTION_QUERY` | Kueri introspeksi GraphQL standar |
| `generateOperation` | Menghasilkan dokumen kueri dari skema GraphQL hasil introspeksi dan suatu field |
| `generateAllOperations` | Menghasilkan dokumen kueri untuk field pada skema GraphQL hasil introspeksi |
| `writeGraphQLOperations` | Menuliskan operasi GraphQL yang dihasilkan ke spesifikasi |
| `discoverAndWriteGraphQLSchema` | Menemukan skema GraphQL dan menuliskannya ke spesifikasi |

## MCP (Model Context Protocol)

Sebagian besar entri berikut tersedia dari `@powerduck/openapi-request/mcp`. Impor `initializeMcpSession` dari titik masuk utama; pada subpath namanya `initializeSession`. Subpath juga menyediakan `runMcp`, `createMcpSessionCore`, dan `createMcpStdioConnection`.

| Ekspor | Keterangan |
| --- | --- |
| `McpAdapter` | Adaptor protokol untuk target MCP |
| `createMcpManualSession` | Membuat sesi MCP manual, juga tersedia sebagai `mcpManualSession` |
| `createMcpStdioSession` | Membuat sesi MCP melalui stdio |
| `runMcpManualSession` | Usang: gunakan `createMcpManualSession` |
| `resolveMcpConfig` | Menentukan konfigurasi MCP dari operasi |
| `initializeMcpSession` | Menginisialisasi sesi MCP (alias dari `initializeSession`) |
| `discoverMcpCapabilities` | Menemukan kemampuan server MCP |
| `MCP_PROTOCOL_VERSION` | Versi protokol MCP yang didukung |
| `generateMcpCall` | Menghasilkan satu pemanggilan alat MCP |
| `generateAllMcpCalls` | Menghasilkan semua pemanggilan alat MCP |
| `writeMcpOperations` | Menuliskan operasi MCP ke spesifikasi |
| `discoverAndWriteMcpCapabilities` | Menemukan kemampuan MCP dan menuliskannya ke spesifikasi |
| `createHttpMcpTransport` | Membuat transport HTTP untuk MCP |
| `createStdioMcpTransport` | Membuat transport stdio untuk MCP |

## gRPC

Impor fungsi tingkat rendah untuk penemuan, pemanggilan, dan deskriptor dari `@powerduck/openapi-request/grpc`. Impor `GrpcProtocolAdapter`, `createGrpcManualSession`, `grpcManualSession`, `grpcDiscover`, dan `discoverGrpc` dari titik masuk utama; subpath menggunakan `discover` untuk penemuan. Subpath juga menyediakan `discoverFromCatalog`, `describeMethod`, dan `describeFromCatalog` agar katalog dapat digunakan kembali tanpa mengulang refleksi untuk setiap metode.

| Ekspor | Keterangan |
| --- | --- |
| `GrpcProtocolAdapter` | Adaptor protokol gRPC untuk OpenAPI |
| `GrpcAdapter` | Adaptor gRPC tingkat rendah |
| `grpcDiscover` / `discoverGrpc` | Menemukan layanan dan metode gRPC |
| `createGrpcManualSession` / `grpcManualSession` | Membuat sesi gRPC manual |
| `grpcCall` | Menjalankan satu pemanggilan gRPC |
| `resolveMethod` | Menentukan deskriptor metode gRPC |
| `buildMessageTemplate` | Membuat templat pesan dari deskriptor |
| `buildCatalog` | Membuat katalog layanan dan metode |
| `LOADER_OPTIONS` | Opsi bawaan pemuat proto |
| `scanProtoFiles` | Memindai direktori untuk mencari berkas proto |
| `deriveIncludeDirsDetailed` | Menentukan direktori penyertaan dari path berkas proto |
| `fetchDescriptorSet` | Mengambil kumpulan deskriptor melalui refleksi gRPC |
| `fetchFullDescriptorSet` | Mengambil kumpulan deskriptor lengkap beserta seluruh dependensi |
| `listServices` | Menampilkan daftar layanan dari kumpulan deskriptor |
| `listServicesDetailed` | Menampilkan layanan beserta informasi metode terperinci |
| `serializeDescriptorSet` | Menserialisasi kumpulan deskriptor menjadi byte |
| `decodeFileDescriptorProto` | Mendekode satu proto deskriptor berkas |
| `decodeFileDescriptorSet` | Mendekode kumpulan deskriptor berkas |
| `buildCredentials` | Membuat kredensial gRPC secara sinkron |
| `buildCredentialsAsync` | Membuat kredensial gRPC secara asinkron |
| `buildCredentialsChecked` | Membuat kredensial dengan validasi secara sinkron |
| `buildCredentialsCheckedAsync` | Membuat kredensial dengan validasi secara asinkron |
| `loadGrpc` | Memuat paket `@grpc/grpc-js` secara dinamis |
| `isGrpcAvailable` | Memeriksa ketersediaan dependensi gRPC |
| `requireCapability` | Mensyaratkan kemampuan gRPC tertentu dan melempar galat jika tidak tersedia |

Titik masuk utama mengekspor alias tipe `GrpcDiscoveryResult`, `GrpcDiscoveredMethod`, dan `GrpcDiscoveredService`. Subpath gRPC menamainya `DiscoveryResult`, `DiscoveredMethod`, dan `DiscoveredService`.

Tipe galat: `ReflectionProtocolError`, `ReflectionUnavailableError`, `DescriptorDecodeError`, `GrpcDependencyBrokenError`, `GrpcDependencyMissingError`.

## Utilitas tambahan

Titik masuk utama juga mengekspor fungsi OAuth 2.0 `resolveOAuth2Token`, `acquireOAuth2Token`, `isOAuth2TokenExpired`, `oauth2RefreshStatuses`, dan `authFromOAuth2Token`; utilitas penyalinan `toCloneable`; kelas dasar `UnifiedSession`; serta fungsi penulisan kembali gRPC `writeGrpcOperations` dan `discoverAndWriteGrpcOperations`.

## Ekspor subpath

```typescript
// Main integration entry
import { createClient, createDebugger } from "@powerduck/openapi-request";

// Protocol-specific entries
import { HttpAdapter } from "@powerduck/openapi-request/http";
import { WebSocketAdapter } from "@powerduck/openapi-request/ws";
import { GrpcAdapter } from "@powerduck/openapi-request/grpc";
import { McpAdapter } from "@powerduck/openapi-request/mcp";
import { GraphQLAdapter } from "@powerduck/openapi-request/graphql";
```
