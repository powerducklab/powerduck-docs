---
sidebar_position: 4
title: "Referensi API"
description: "Referensi titik masuk publik @powerduck/x-to-openapi"
---

# Referensi API

Referensi titik masuk publik `@powerduck/x-to-openapi`. Signature berikut merangkum API; lihat deklarasi TypeScript paket untuk anotasi readonly dan tipe impor yang lengkap.

---

## Fungsi bantu tanpa konfigurasi

### `curlToOpenApi`

Konversi sekali panggil: mendaftarkan [`CurlAdapter`](#curladapter) lalu memanggil [`convert`](#convertsource-input-options).

```typescript
function curlToOpenApi(
  input: string | readonly string[],
  options?: ConvertOptions,
): Promise<ConvertResult>;
```

| Parameter | Tipe | Deskripsi |
|---|---|---|
| `input` | `string \| readonly string[]` | Perintah curl, array perintah, atau keluaran “Copy all as cURL” dari browser; teks dengan beberapa perintah dipisahkan secara otomatis. |
| `options` | `ConvertOptions` | Pengaturan konversi opsional. |

**Mengembalikan:** [`ConvertResult`](#convertresult).

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  "curl -X POST https://api.example.com/users -H 'Content-Type: application/json' --data '{\"name\":\"Ada\"}'",
);
```

---

### `postmanToOpenApi`

Konversi sekali panggil: mendaftarkan [`PostmanAdapter`](#postmanadapter) lalu mengonversi objek koleksi yang telah diurai atau string JSON. Skrip pengujian dipertahankan sebagai `x-postman-scripts`.

```typescript
function postmanToOpenApi(
  input: unknown,
  options?: ConvertOptions,
): Promise<ConvertResult>;
```

| Parameter | Tipe | Deskripsi |
|---|---|---|
| `input` | `unknown` | Objek Postman Collection v2.0/v2.1.0 atau representasinya sebagai string JSON. |
| `options` | `ConvertOptions` | Pengaturan konversi opsional. |

**Mengembalikan:** [`ConvertResult`](#convertresult).

---

## Kerangka inti

### `XToOpenApi`

Kelas konverter. Menyimpan [`AdapterRegistry`](#adapterregistry) dan menjalankan alur penguraian → pembuatan → validasi.

```typescript
class XToOpenApi {
  register<I>(adapter: SourceAdapter<I>): this;
  adapters(): string[];
  convert(
    source: string,
    input: unknown,
    options?: ConvertOptions,
  ): Promise<ConvertResult>;
}
```

#### `register(adapter)`

Mendaftarkan adaptor. Mengembalikan `this` agar pemanggilan dapat dirangkai. Memvalidasi `id` adaptor dengan `/^[a-z][a-z0-9-]*$/`, mewajibkan metode `parse()`, dan menolak ID duplikat.

#### `adapters()`

Mengembalikan ID adaptor yang terdaftar sebagai `string[]`.

#### `convert(source, input, options?)`

Titik masuk tunggal.

| Parameter | Tipe | Deskripsi |
|---|---|---|
| `source` | `string` | ID adaptor (`"curl"`, `"postman"`, …) atau `"auto"` untuk memilih melalui `canHandle()`. |
| `input` | `unknown` | Data sumber; strukturnya bergantung pada adaptor. |
| `options` | `ConvertOptions` | Pengaturan konversi opsional. |

**Perilaku:**

1. Melengkapi opsi berdasarkan [`DEFAULT_OPTIONS`](#default_options) lalu memvalidasinya.
2. Menolak string, atau total elemen string dalam array, yang melebihi **10 × 1024 × 1024 unit kode JavaScript** dengan `ConversionError`. Ini bukan batas byte UTF-8; objek yang telah diurai tidak diukur.
3. Memilih adaptor melalui ID eksplisit atau deteksi `"auto"`.
4. Mengurai masukan menjadi `NormalizedRequest[]`; kegagalan penguraian menjadi diagnostik.
5. Membuat dokumen OpenAPI 3.2 melalui [`buildOpenApi32`](#buildopenapi32).
6. Jika `validate` bernilai `true`, memvalidasi melalui [`validateOpenApi32`](#validateopenapi32) dan menggabungkan diagnostik hasilnya.
7. Mengembalikan [`ConvertResult`](#convertresult).

```typescript
import { XToOpenApi, CurlAdapter } from "@powerduck/x-to-openapi";

const converter = new XToOpenApi().register(new CurlAdapter());
const result = await converter.convert("curl", curlText, { title: "My API" });
```

---

### `DEFAULT_OPTIONS`

Nilai bawaan yang digabungkan dengan setiap [`ConvertOptions`](#convertoptions). Diekspor sebagai `ResolvedConvertOptions`.

```typescript
const DEFAULT_OPTIONS: ResolvedConvertOptions = {
  openapiVersion: "3.2.0",
  title: "Generated API",
  version: "1.0.0",
  description: "",
  inferPathParameters: true,
  pathParameterMinSamples: 2,
  inferSecurity: true,
  includeCommonHeaders: false,
  includeCookies: false,
  includeExamples: false,
  useServerBasePath: false,
  validate: true,
  strict: false,
};
```

---

### `AdapterRegistry`

Menyimpan adaptor terdaftar berdasarkan ID.

```typescript
class AdapterRegistry {
  register<I>(adapter: SourceAdapter<I>): this;
  has(id: string): boolean;
  get(id: string): SourceAdapter<unknown>;
  detect(input: unknown): SourceAdapter<unknown> | undefined;
  ids(): string[];
}
```

| Metode | Deskripsi |
|---|---|
| `register(adapter)` | Memvalidasi ID (`/^[a-z][a-z0-9-]*$/`), memeriksa `parse()`, dan menolak duplikat. Mengembalikan `this`. |
| `has(id)` | Memeriksa apakah adaptor terdaftar. |
| `get(id)` | Mengembalikan adaptor atau melempar galat yang mencantumkan ID terdaftar. |
| `detect(input)` | Mengembalikan adaptor pertama yang `canHandle()`-nya menerima masukan. Pengecualian dalam predikat ditangkap dan adaptor tersebut dilewati. |
| `ids()` | Mencantumkan ID yang terdaftar. |

---

### `ConversionError`

Dilempar untuk diagnostik tingkat galat dalam mode `strict`, string masukan terlalu panjang, atau pemilihan adaptor otomatis yang gagal. Membawa diagnostik jika tersedia; daftarnya dapat kosong. Opsi tidak valid dan galat pendaftaran dapat melempar `TypeError` atau `Error`.

```typescript
class ConversionError extends Error {
  readonly diagnostics: readonly Diagnostic[];
  constructor(
    message: string,
    diagnostics: readonly Diagnostic[],
    options?: { cause?: unknown },
  );
}
```

---

### `DiagnosticBag`

Pengumpul internal yang digunakan oleh [`XToOpenApi.convert`](#convertsource-input-options). Menghapus diagnostik duplikat dan melempar `ConversionError` untuk entri tingkat galat saat `strict` bernilai `true`.

```typescript
class DiagnosticBag {
  constructor(strict?: boolean); // default false
  report(diagnostic: Diagnostic): void;
  get items(): Diagnostic[];
  hasErrors(): boolean;
}
```

---

## Adaptor

### `CurlAdapter`

Mengonversi perintah curl tunggal, kumpulan perintah, atau ekspor browser menjadi `NormalizedRequest[]`. Membungkus `curlconverter` dan menormalisasi keluarannya.

```typescript
class CurlAdapter implements SourceAdapter<string | readonly string[]> {
  readonly id = "curl";
  canHandle(input: unknown): boolean;
  parse(
    input: string | readonly string[],
    context: AdapterContext,
  ): Promise<NormalizedRequest[]>;
}
```

- `canHandle` menerima string, atau elemen pertama array, yang diawali prompt shell opsional (`$`, `#`, `>`) diikuti `curl` atau `curl.exe`.
- `parse` memisahkan masukan beberapa perintah melalui [`splitCurlCommands`](#splitcurlcommands), melewati URL selain HTTP(S), menghapus pseudo-header HTTP/2, mengurai isi dan cookie, serta menyimpulkan autentikasi.

> `resolveBackend`, `availableExports`, dan `resetBackend` adalah fungsi bantu integrasi internal, bukan ekspor paket yang didukung. Impor adaptor publik, bukan berkas internal.

---

### `splitCurlCommands`

Memisahkan keluaran “Copy all as cURL” dari browser menjadi perintah individual. Mendukung tanda kutip tunggal/ganda, kelanjutan baris dengan garis miring terbalik dan tanda pangkat (`^`), CRLF, prompt shell (`$`, `#`, `>`, `PS C:\>`), serta `curl.exe`.

```typescript
function splitCurlCommands(input: string): string[];
```

```typescript
import { splitCurlCommands } from "@powerduck/x-to-openapi";

const commands = splitCurlCommands(`
  $ curl https://api.example.com/users
  > curl https://api.example.com/users/123
`);
// ["curl https://api.example.com/users", "curl https://api.example.com/users/123"]
```

---

### `PostmanAdapter`

Mengonversi Postman Collections v2.0/v2.1.0 menjadi `NormalizedRequest[]`. Menelusuri folder bersarang, menyelesaikan autentikasi dengan prioritas item > folder > koleksi, memetakan mode isi, dan mempertahankan skrip pengujian.

```typescript
class PostmanAdapter implements SourceAdapter<PostmanCollection | string> {
  readonly id = "postman";
  canHandle(input: unknown): boolean;
  parse(
    input: PostmanCollection | string,
    context: AdapterContext,
  ): Promise<NormalizedRequest[]>;
}
```

- `canHandle` menerima objek atau string JSON yang telah diurai dengan objek `info` dan array `item`. URL skema v2.1.0 dan v2.0 diterima, begitu pula koleksi berstruktur valid tanpa URL skema.
- Peristiwa pengujian dan prapermintaan dikeluarkan pada operasi sebagai `x-postman-scripts`.

---

### `PostmanTypes`

Namespace yang memuat seluruh tipe koleksi Postman yang digunakan adaptor:

```typescript
import { PostmanTypes } from "@powerduck/x-to-openapi";

type Collection = PostmanTypes.PostmanCollection;
type Item = PostmanTypes.PostmanItem;
type Request = PostmanTypes.PostmanRequest;
type Body = PostmanTypes.PostmanBody;
type Auth = PostmanTypes.PostmanAuth;
type Script = PostmanTypes.PostmanScript;

// Runtime type guards are functions; the other members are TypeScript types.
const isFolder = PostmanTypes.isFolder;
const isRequestItem = PostmanTypes.isRequestItem;
```

Anggota utama: `PostmanCollection`, `PostmanInfo`, `PostmanVersion`, `PostmanItem`, `PostmanFolder`, `PostmanRequestItem`, `PostmanRequest`, `PostmanHeader`, `PostmanUrl`, `PostmanQueryParam`, `PostmanBodyMode`, `PostmanBody`, `PostmanUrlEncodedParam`, `PostmanFormDataParam`, `PostmanFileParam`, `PostmanGraphQLBody`, `PostmanAuthType`, `PostmanAuth`, `PostmanAuthParam`, `PostmanEvent`, `PostmanScript`, `PostmanVariable`, `PostmanDescription`, `isFolder`, `isRequestItem`.

---

## Komponen pembentuk OpenAPI

### `buildOpenApi32`

Pembuat tingkat rendah. Menyusun dokumen OpenAPI 3.2 dari array permintaan yang telah dinormalisasi. Biasanya dipanggil secara tidak langsung melalui [`XToOpenApi.convert`](#convertsource-input-options).

```typescript
function buildOpenApi32(
  requests: readonly NormalizedRequest[],
  options: ResolvedConvertOptions,
  report: (diagnostic: Diagnostic) => void,
): OpenApiDocument;
```

Mengelompokkan operasi berdasarkan jalur dan metode, mengumpulkan parameter kueri/header/cookie/jalur, menggabungkan skema isi, menghasilkan `securitySchemes`, menempatkan metode nonstandar di `additionalOperations`, serta menetapkan `operationId`/`tags`.

---

### `buildPathTemplates`

Mengelompokkan permintaan berstruktur sama dan membuat templat untuk segmen yang bervariasi dalam setidaknya `minSamples` sampel serta menyerupai pengenal di setiap sampel.

```typescript
function buildPathTemplates(
  requests: readonly NormalizedRequest[],
  minSamples: number,
  enabled: boolean,
): Map<number, PathTemplate>;
```

Mengembalikan peta dengan kunci `sourceIndex`. Setiap `PathTemplate` memiliki:

```typescript
interface PathTemplate {
  readonly path: string;                    // e.g. "/users/{userId}"
  readonly parameters: ReadonlyMap<number, string>; // segment index → name
}
```

Saat `enabled` bernilai `false`, setiap permintaan memperoleh templat statis yang sama dengan nama jalur aslinya.

---

### `looksLikeIdentifier`

Aturan terpusat untuk menentukan segmen yang dapat dijadikan templat.

```typescript
function looksLikeIdentifier(segment: string): boolean;
```

Mengembalikan `true` jika segmen berupa angka saja, UUID, ULID, atau string heksadesimal dengan setidaknya 8 karakter.

---

### `scalar`

Menyimpulkan JSON Schema dari satu sampel string dengan pendekatan yang sengaja konservatif.

```typescript
function scalar(value: string, includeExample?: boolean): Schema; // default false
```

Menyimpulkan `boolean`, `integer` dengan batas panjang bilangan bulat aman, `number`, atau `string` dengan `format` (`uuid`, `date`, `date-time`); selain itu menjadi `string` biasa.

---

### `jsonSchema`

Menyimpulkan JSON Schema dari nilai JSON apa pun: objek, array, atau skalar.

```typescript
function jsonSchema(value: unknown, includeExample?: boolean): Schema; // default false
```

Objek menjadi `{ type: "object", properties, required }`; array menjadi `{ type: "array", items }` dengan `{}` untuk array kosong; skalar mengikuti penentuan tipe seperti `scalar`.

---

### `mergeSchemas`

Menggabungkan beberapa skema sampel secara struktural. Properti objek disatukan; properti yang tidak ada pada salah satu sampel menjadi opsional. Array diproses secara rekursif; `integer` diperluas menjadi `number`; format dipertahankan hanya jika sama di seluruh sampel.

```typescript
function mergeSchemas(schemas: readonly Schema[]): Schema;
```

---

### `Schema`

Subset struktural JSON Schema yang digunakan untuk isi dan parameter hasil inferensi.

```typescript
interface Schema {
  type?: string | string[];
  format?: string;
  properties?: Record<string, Schema>;
  required?: string[];
  items?: Schema;
  example?: unknown;
  contentMediaType?: string;
  description?: string;
  nullable?: boolean;
  [key: string]: unknown; // OpenAPI extensions and unmodeled fields
}
```

---

## Tipe kanonis dan validasi

### `validateOpenApi32`

Memvalidasi dokumen OpenAPI terhadap skema OpenAPI 3.2 melalui `@powerduck/openapi-parser`.

```typescript
function validateOpenApi32(
  document: OpenApiDocument,
): Promise<ValidationOutcome>;

interface ValidationOutcome {
  valid: boolean;
  diagnostics: Diagnostic[];
}
```

Galat validasi dipetakan ke diagnostik berkode `OAS_VALIDATION_ERROR`; kegagalan validator dipetakan ke `OAS_VALIDATOR_FAILED`.

### `validateOpenApiDocument`

Alias kanonis untuk [`validateOpenApi32`](#validateopenapi32). Pustaka pengguna `@powerduck/*` sebaiknya mengimpor nama stabil ini.

```typescript
import { validateOpenApiDocument } from "@powerduck/x-to-openapi";

const { valid, diagnostics } = await validateOpenApiDocument(doc);
```

### `OpenApiDocument`

Tipe dokumen OpenAPI 3.2 kanonis, alias dari `Oas32Document` milik `@powerduck/openapi-parser`. Semua pustaka `@powerduck/*` sebaiknya menggunakan tipe ini, bukan mengakses paket tipe pihak ketiga secara langsung.

### `OpenApi32Document`

Alias `OpenApiDocument` khusus versi ini.

---

## Tipe

### `ConvertOptions`

Seluruh pengaturan konversi. Kolom yang tidak diatur menggunakan nilai [`DEFAULT_OPTIONS`](#default_options).

```typescript
interface ConvertOptions {
  openapiVersion?: "3.2.0";
  title?: string;
  version?: string;
  description?: string;
  inferPathParameters?: boolean;
  pathParameterMinSamples?: number;
  inferSecurity?: boolean;
  includeCommonHeaders?: boolean;
  includeCookies?: boolean;
  includeExamples?: boolean;
  useServerBasePath?: boolean;
  validate?: boolean;
  strict?: boolean;
}
```

| Opsi | Tipe | Bawaan | Deskripsi |
|---|---|---|---|
| `openapiVersion` | `"3.2.0"` | `"3.2.0"` | Hanya `"3.2.0"` yang didukung; nilai lain melempar galat. |
| `title` | `string` | `"Generated API"` | `info.title`. Tidak boleh kosong. |
| `version` | `string` | `"1.0.0"` | `info.version`. Tidak boleh kosong. |
| `description` | `string` | `""` | `info.description`. Dihilangkan jika kosong. |
| `inferPathParameters` | `boolean` | `true` | Membuat templat untuk segmen bervariasi yang menyerupai pengenal. |
| `pathParameterMinSamples` | `number` | `2` | Jumlah minimum permintaan dalam satu kelompok sebelum pembuatan templat. Harus bilangan bulat positif. |
| `inferSecurity` | `boolean` | `true` | Menghasilkan `securitySchemes` dan `security` per operasi. |
| `includeCommonHeaders` | `boolean` | `false` | Menyertakan header tambahan dari browser. Header transport selalu dikecualikan. |
| `includeCookies` | `boolean` | `false` | Menghasilkan cookie sebagai parameter. |
| `includeExamples` | `boolean` | `false` | Mengisi contoh skema dan parameter dari nilai yang diamati. |
| `useServerBasePath` | `boolean` | `false` | Menggabungkan awalan jalur yang sama ke dalam `servers[0].url` jika semua permintaan memiliki origin yang sama. |
| `validate` | `boolean` | `true` | Memvalidasi dokumen keluaran. Galat validasi menjadi diagnostik; mode ketat dapat mengubahnya menjadi pengecualian. |
| `strict` | `boolean` | `false` | Melempar `ConversionError` untuk setiap diagnostik tingkat galat. |

`ResolvedConvertOptions` adalah `Required<ConvertOptions> & { openapiVersion: "3.2.0" }`.

---

### `ConvertResult`

Nilai kembalian setiap konversi.

```typescript
interface ConvertResult {
  /** The generated OpenAPI 3.2 document. */
  document: OpenApiDocument;
  /** Normalized requests (urlString is populated for JSON serialization). */
  requests: NormalizedRequest[];
  /** All diagnostics produced during conversion. */
  diagnostics: Diagnostic[];
  /** True when no error-severity diagnostic was produced. */
  ok: boolean;
  /** True when the document passed validation (or validation was skipped). */
  documentValid: boolean;
}
```

---

### `NormalizedRequest`

Representasi perantara yang tidak bergantung pada adaptor dan dihasilkan oleh setiap adaptor.

```typescript
interface NormalizedRequest {
  source: string;            // adapter id, e.g. "curl"
  sourceIndex: number;       // index within the source
  method: string;            // lowercase token, e.g. "get", "post", "purge"
  url: URL;
  urlString?: string;        // string form, set for JSON-safe serialization
  headers: readonly Header[];
  query: readonly ParameterValue[];
  cookies: readonly ParameterValue[];
  body?: RequestBody;
  auth?: RequestAuth;
  /** x-* extensions merged onto the operation (first-wins per key). */
  extensions?: Readonly<Record<string, unknown>>;
}
```

---

### `Diagnostic` / `DiagnosticCode` / `Severity`

```typescript
type Severity = "info" | "warning" | "error";

interface Diagnostic {
  code: DiagnosticCode;
  message: string;
  severity: Severity;
  source?: string;   // adapter id
  index?: number;    // source command index
  path?: string;      // affected OpenAPI path
  cause?: unknown;    // underlying error
}
```

`DiagnosticCode` adalah union string dari seluruh kode yang dapat dilaporkan kerangka kerja:

`ADAPTER_PARSE_FAILED`, `CURL_PARSE_FAILED`, `CURL_EMPTY_INPUT`, `CURL_CAPABILITY_MISSING`, `CURL_BACKEND_JSON_FALLBACK`, `CURL_UNSUPPORTED_SCHEME`, `POSTMAN_INVALID_COLLECTION`, `POSTMAN_EMPTY_COLLECTION`, `POSTMAN_UNSUPPORTED_BODY_MODE`, `POSTMAN_VARIABLE_UNRESOLVED`, `BODY_JSON_INVALID`, `PATH_MERGE_CONFLICT`, `OPERATION_ID_COLLISION`, `PSEUDO_HEADER_DROPPED`, `MULTIPLE_SERVERS`, `NO_REQUESTS`, `OAS_VALIDATION_ERROR`, `OAS_VALIDATOR_FAILED`, `DISCOVERY_COMPONENT_NOT_FOUND`, `DISCOVERY_COMPONENT_NAME_COLLISION`, `DISCOVERY_PATH_PARAM_MISMATCH`, `DISCOVERY_MEDIA_WITHOUT_SCHEMA`, `DISCOVERY_RESPONSE_MISSING`, `DISCOVERY_SECURITY_SCHEME_MISSING`, `DISCOVERY_GAP`, `DISCOVERY_PATH_CONFLICT`.

---

### Tipe inti lainnya

```typescript
type JsonObject = Record<string, unknown>;

interface Header { readonly name: string; readonly value: string; }
interface ParameterValue { readonly name: string; readonly value: string; }
interface FormField {
  readonly name: string;
  readonly value?: string;
  readonly fileName?: string;
  readonly contentType?: string;
}

type BodyKind = "json" | "xml" | "form-urlencoded" | "multipart" | "text" | "binary";

interface RequestBody {
  readonly kind: BodyKind;
  readonly mediaType: string;
  readonly raw?: string;
  readonly fields?: readonly FormField[];
}

type RequestAuth =
  | { readonly type: "basic" }
  | { readonly type: "bearer" }
  | { readonly type: "apiKey"; readonly in: "header" | "query" | "cookie"; readonly name: string };

interface AdapterContext {
  readonly report: (diagnostic: Diagnostic) => void;
  readonly strict: boolean;
}

interface SourceAdapter<I = unknown> {
  readonly id: string;
  canHandle?(input: unknown): boolean;
  parse(input: I, context: AdapterContext): Promise<NormalizedRequest[]>;
}
```

---

## Konversi representasi perantara penemuan

### `discoveryToOpenApi`

Mengonversi `DiscoveredProject` yang diberikan menjadi OpenAPI 3.2. Tidak memindai berkas sumber sendiri. Rute yang belum terselesaikan menghasilkan peringatan dan tidak pernah ditambahkan diam-diam ke `paths`; lokasi sumber dan tingkat keyakinan tetap tersedia dalam proyek yang dikembalikan.

```typescript
function discoveryToOpenApi(
  project: DiscoveredProject,
  options?: DiscoveryOptions,
): Promise<DiscoveryResult>;

interface DiscoveryOptions {
  openapiVersion?: "3.2.0";
  allowGaps?: boolean; // default true
  validate?: boolean; // default true
}

interface DiscoveryResult {
  readonly document: OpenApiDocument;
  readonly project: DiscoveredProject;
  readonly diagnostics: Diagnostic[];
  readonly ok: boolean;
  readonly documentValid: boolean;
}
```

`allowGaps: false` menaikkan diagnostik kekurangan operasi/skema menjadi galat; opsi ini bukan sakelar pengecualian mode ketat. Selalu periksa `ok`, `documentValid`, dan `diagnostics`. Peringatan rute yang belum terselesaikan dilaporkan terpisah. Jika validasi dinonaktifkan, `documentValid` bernilai benar tanpa pemeriksaan skema.

### `buildDiscoveryOpenApi32`

Pembuat sinkron tingkat rendah untuk representasi perantara yang sama. Melaporkan diagnostik melalui callback yang diberikan dan tidak memvalidasi dokumen. Gunakan pembungkus asinkron jika memerlukan validasi dan objek hasil lengkap.

```typescript
function buildDiscoveryOpenApi32(
  project: DiscoveredProject,
  allowGaps: boolean,
  report: (diagnostic: Diagnostic) => void,
): OpenApiDocument;
```

Tipe penemuan yang diekspor dari titik masuk utama: `Confidence`, `GapCode`, `SourceLocation`, `JsonSchema`, `DiscoveredParameter`, `DiscoveredMediaType`, `DiscoveredRequestBody`, `DiscoveredResponse`, `DiscoveredOperation`, `DiscoveredComponent`, `DiscoveredSecurityScheme`, `DiscoveredServer`, `DiscoveredUnresolved`, `DiscoveredProject`, `DiscoveryOptions`, `DiscoveryResult`.

```typescript
import { discoveryToOpenApi } from "@powerduck/x-to-openapi";

const discovered = await discoveryToOpenApi({
  title: "Health API",
  operations: [{
    method: "get",
    path: "/health",
    responses: [{ statusCode: "204", description: "Healthy", confidence: "high" }],
    confidence: "high",
    origin: { file: "src/routes.ts", line: 1 },
  }],
});
console.log(discovered.ok, discovered.documentValid, discovered.diagnostics);
```

---

## Ringkasan ekspor

| Simbol | Jenis |
|---|---|
| `curlToOpenApi` | fungsi |
| `postmanToOpenApi` | fungsi |
| `XToOpenApi` | kelas |
| `DEFAULT_OPTIONS` | konstanta |
| `AdapterRegistry` | kelas |
| `ConversionError` | kelas |
| `DiagnosticBag` | kelas |
| `CurlAdapter` | kelas |
| `splitCurlCommands` | fungsi |
| `PostmanAdapter` | kelas |
| `PostmanTypes` | namespace |
| `buildOpenApi32` | fungsi |
| `buildPathTemplates` | fungsi |
| `looksLikeIdentifier` | fungsi |
| `scalar` | fungsi |
| `jsonSchema` | fungsi |
| `mergeSchemas` | fungsi |
| `Schema` | tipe |
| `discoveryToOpenApi` | fungsi |
| `buildDiscoveryOpenApi32` | fungsi |
| `validateOpenApi32` | fungsi |
| `validateOpenApiDocument` | fungsi (alias) |
| `OpenApiDocument` | tipe |
| `OpenApi32Document` | tipe |
| `DiscoveredProject`, `DiscoveryOptions`, `DiscoveryResult` | tipe |
| `ConvertOptions`, `ConvertResult`, `NormalizedRequest`, `SourceAdapter`, `AdapterContext`, `Diagnostic`, `DiagnosticCode`, `Severity`, `Header`, `ParameterValue`, `FormField`, `BodyKind`, `RequestBody`, `RequestAuth`, `JsonObject`, `ResolvedConvertOptions` | tipe |
