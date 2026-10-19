---
sidebar_position: 4
title: "Referensi API"
description: "Dokumentasi API lengkap untuk @powerduck/openapi-codegen."
---

# Referensi API

Dokumentasi API lengkap untuk `@powerduck/openapi-codegen`.

## Fungsi tingkat atas

| Ekspor | Tanda tangan | Deskripsi |
|--------|-----------|-------------|
| `generate` | `(options: GenerateOptions) => string` | Menghasilkan kode sumber yang dapat dijalankan untuk satu operasi |
| `register` | `(generator: Generator) => void` | Mendaftarkan generator kustom |
| `get` | `(language: string, client: string) => Generator \| undefined` | Mencari generator |
| `list` | `() => Array<{ language: string; client: string }>` | Menampilkan semua generator terdaftar |
| `use` | `(plugin: Plugin) => void` | Menerapkan plugin yang mendaftarkan generator |
| `registerBuiltins` | `() => void` | Mendaftarkan semua generator bawaan, otomatis saat impor |
| `normalize` | `(options) => NormalizedRequest` | Mengubah dokumen, jalur, dan metode menjadi permintaan yang dinormalisasi |
| `builtinGenerators` | `Generator[]` | Array asli seluruh definisi generator bawaan |

Generator bawaan otomatis terdaftar saat modul dimuat, jadi pemanggilan `registerBuiltins()` secara manual bersifat opsional.

## generate(options)

```ts
generate(options: GenerateOptions): string
```

Mengembalikan kode sumber yang dihasilkan sebagai string. Mencari generator dengan `get(options.language, options.client)`; jika `options.request` tidak ada, memanggil `normalize({ document, path, method, serverUrl, securityValues, softRefMode })`; lalu memanggil `generator.generate(request)`.

Kesalahan yang dapat dilempar:

- `TypeError` jika `options` bukan objek atau input wajib tidak ada.
- `Error: Unsupported generator: <language>/<client>` untuk kombinasi yang tidak dikenal.
- Kesalahan dari `normalize()` untuk jalur/metode tidak dikenal, dokumen tidak valid, atau `$ref` rusak/melingkar, kecuali `softRefMode` aktif.

Lihat [Konfigurasi](/docs/id-ID/openapi-codegen/configuration/#generateoptions) untuk tabel opsi lengkap.

## register(generator)

```ts
register({
  language: "mylang",
  client: "my-client",
  generate(request) {
    return `// ${request.method} ${request.path}`;
  },
});
```

Mendaftarkan ke penyimpanan internal yang tidak membedakan huruf besar-kecil, dengan kunci `language\0client`.

## get(language, client)

```ts
const generator = get("javascript", "fetch");
```

Mengembalikan `Generator`, atau `undefined` jika tidak ditemukan.

## list()

```ts
const combos = list();
// [{ language: "c", client: "libcurl" }, ...]
```

## use(plugin)

```ts
use({
  name: "my-plugin",
  register({ register }) {
    register(customGenerator);
  },
});
```

Setara dengan memanggil `plugin.register({ register })`.

## registerBuiltins()

```ts
registerBuiltins();
```

Idempoten, dilindungi penanda internal. Mendaftarkan setiap entri dalam `builtinGenerators`.

## normalize(options)

```ts
import { normalize } from "@powerduck/openapi-codegen";

const request = normalize({
  document,
  path: "/pets/{id}",
  method: "get",
  serverUrl: "https://example.com",
  securityValues: { bearerAuth: "token" },
  softRefMode: false,
});
```

Menyelesaikan `$ref`, menggabungkan parameter jalur/operasi, memilih jenis media body, menghasilkan nilai contoh, menyelesaikan keamanan, dan menghitung `baseUrl`. Melempar kesalahan untuk jalur/metode tidak dikenal dan metode yang tidak didukung.

## Generator bawaan (21 bahasa, 41 klien) {#built-in-generators-21-languages-41-clients}

Pengenal `language` / `client` persis seperti yang terdaftar dalam `src/emitters/index.ts`. Pencarian tidak membedakan huruf besar-kecil; tabel menampilkan pengenal baku.

| Bahasa | `language` | Nilai `client` |
|----------|-----------|-----------------|
| C | `c` | `libcurl` |
| C# | `csharp` | `httpclient`, `restsharp` |
| Clojure | `clojure` | `clj-http` |
| Dart | `dart` | `http` |
| F# | `fsharp` | `httpclient` |
| Go | `go` | `new-request` |
| File permintaan HTTP | `http` | `http1` |
| Java | `java` | `asynchttp`, `java-net-http`, `okhttp`, `unirest` |
| JavaScript | `javascript` | `axios`, `fetch`, `jquery`, `ofetch`, `xhr` |
| Kotlin | `kotlin` | `okhttp` |
| Node.js | `node` | `axios`, `fetch`, `ofetch`, `undici` |
| Objective-C | `objc` | `nsurlsession` |
| OCaml | `ocaml` | `cohttp` |
| PHP | `php` | `curl`, `guzzle`, `laravel-http` |
| PowerShell | `powershell` | `invoke-restmethod`, `invoke-webrequest` |
| Python | `python` | `aiohttp`, `http-client`, `httpx-async`, `httpx-sync`, `requests` |
| R | `r` | `httr2` |
| Ruby | `ruby` | `net-http` |
| Rust | `rust` | `reqwest` |
| Shell | `shell` | `curl`, `httpie`, `wget` |
| Swift | `swift` | `nsurlsession` |

Jumlah: 21 bahasa, 41 kombinasi.

> Tersedianya generator tidak berarti setiap klien dapat mewakili semua operasi. Misalnya, `shell/wget` tidak dapat membangun sembarang permintaan `multipart/form-data` dengan aman; gunakan `shell/curl` atau `shell/httpie`.

## Tipe inti

Diekspor ulang dari `./types`:

```ts
type ParameterLocation = "path" | "query" | "querystring" | "header" | "cookie";

interface FileValue { __file: true; path?; name?; contentType?; data?; }
interface Parameter { name; in: ParameterLocation; value: unknown; style?; explode?; allowReserved?; }
interface Body { mediaType: string; value: unknown; encoding?: Record<string, unknown>; }
interface Security { name; type; scheme?; in?; paramName?; value: string; }
interface RequestIR { method; baseUrl; path; parameters: Parameter[]; headers: Parameter[]; body?; security: Security[]; }
interface GenerateResult { code: string; files?: Record<string, string>; metadata?: Record<string, unknown>; }
interface Generator { language: string; client: string; generate(request: RequestIR): string; }
interface Plugin { name: string; register(api: { register(g: Generator): void }): void; }
interface GenerateOptions { language; client; request?; document?; path?; method?; serverUrl?; securityValues?; softRefMode?; }
```

## Fungsi inti

Semuanya diekspor ulang dari akar paket.

### refs

| Ekspor | Deskripsi |
|--------|-------------|
| `RefResolver` | Kelas untuk resolusi JSON Pointer `#/...` di dalam dokumen. Konstruktor: `(root, softMode = false)`. Metode: `deref(value)`, `resolveRef(ref)`, `clearCache()`. Bidang publik: `softMode`. Melempar kesalahan pada referensi eksternal/rusak/melingkar kecuali `softMode` bernilai benar. |

### example

| Ekspor | Deskripsi |
|--------|-------------|
| `example(schema, resolver, seen?, depth=0, ctx=default)` | Menghasilkan nilai contoh dari JSON Schema. Mematuhi `example`, `enum`, `const`, `default`, `oneOf`/`anyOf`/`allOf`, tipe, format, dan batasan. |
| `ExampleGenContext` | Tipe `{ isRequestBody: boolean; isResponse: boolean }` yang mengatur penyaringan `readOnly`/`writeOnly`. |
| `defaultExampleContext` | Nilai bawaan `{ isRequestBody: false, isResponse: false }`. |

### serialize

| Ekspor | Deskripsi |
|--------|-------------|
| `Pair` | Tipe `[string, string]`. |
| `parameter(parameter)` | Menyerialkan satu parameter menjadi `Pair[]` mengikuti aturan OpenAPI `style`/`explode`: form, spaceDelimited, pipeDelimited, label, matrix, simple, deepObject. |
| `query(pairs)` | Menggabungkan pasangan menjadi string query. |
| `cookie(pairs)` | Menggabungkan pasangan menjadi nilai header `Cookie`. |
| `headerValue(value)` | Membersihkan nilai header dengan menghapus CR/LF/NUL. |

### generator

| Ekspor | Deskripsi |
|--------|-------------|
| `createGenerator(language, client, emit)` | Membungkus fungsi `emit(request) => string` menjadi `Generator`. |
| `GeneratorEmitter` | Tipe `(request: RequestIR) => string`. |

### registry

| Ekspor | Deskripsi |
|--------|-------------|
| `registerGenerator(generator)` | Memasukkan ke penyimpanan tanpa membedakan huruf besar-kecil. |
| `getGenerator(language, client)` | Membaca dari penyimpanan. |
| `listGenerators()` | Mengembalikan `[{ language, client }, ...]`. |

### plugin

| Ekspor | Deskripsi |
|--------|-------------|
| `PluginApi` | Tipe `{ register(generator: Generator): void }`. |
| `applyPlugin(plugin, api)` | Memanggil `plugin.register(api)`. |

### request

| Ekspor | Deskripsi |
|--------|-------------|
| `CompiledRequest` | Tipe `{ url; headers: Array<[string,string]>; body?; queryPairs; cookiePairs }`. |
| `compile(request)` | Mengganti parameter jalur, membuat pasangan query/header/cookie, menerapkan keamanan, dan menyusun URL. |
| `form(value)` | Menyerialkan objek menjadi string `application/x-www-form-urlencoded`. |

### helpers

Utilitas yang sering digunakan:

| Ekspor | Deskripsi |
|--------|-------------|
| `isRecord(value)` | Penjaga tipe untuk objek biasa. |
| `isFileValue(value)` | Penjaga tipe untuk penanda `FileValue`. |
| `firstDefined(...values)` | Nilai pertama yang bukan `undefined`. |
| `nonBlankString(value, fallback?)` | String tidak kosong setelah spasi tepi dihapus, atau `undefined`/nilai cadangan. |
| `normalizeMethod(method)` | Metode dalam huruf besar, dengan `GET` sebagai nilai cadangan. |
| `supportsRequestBody(method)` | `false` untuk `GET`/`HEAD`. |
| `requiresRequestBody(method)` | `true` untuk `POST`/`PUT`/`PATCH`. |
| `mediaTypeOf(request, fallback)` | Jenis media efektif dari body atau header Content-Type. |
| `hasJsonBody(request)` | Jenis media JSON atau `+json`. |
| `hasFormBody(request)` | `application/x-www-form-urlencoded`. |
| `hasMultipartBody(request)` | `multipart/form-data`. |
| `bodyText(request)` | Teks body mentah atau JSON yang diformat. |
| `toHeaderObject(headers)` | Mengubah pasangan menjadi `Record<string,string>`. |
| `toKeyValueBody(value)` | Meratakan body multipart menjadi deskriptor bidang berurutan. |
| `collectByLocation(request, location)` | Menyaring parameter menurut lokasi OpenAPI. |
| `operationName(request)` | Menurunkan nama fungsi/variabel snake_case dari metode dan jalur. |
| `sanitizeIdentifier(value)` | Mengubah teks apa pun menjadi pengenal valid. |
| `indent(text, prefix="  ")` | Memberi indentasi pada setiap baris tidak kosong. |
| `stringifyLiteral(value)` | JSON terformat dengan alternatif yang aman. |
| `kotlinValue(value)` / `formFieldValue(value)` | Menyerialkan nilai untuk literal atau bidang formulir. |
| `fileComment(path, fieldName)` | Membuat komentar TODO untuk jalur multipart placeholder. |
| `mergeAllOfSchemas(schemas, resolver)` | Menggabungkan skema `allOf` secara dangkal. |
| `lightweightOpenAPIPreCheck(doc)` | Mengembalikan peringatan struktur dokumen. |
| `browserHeaders(headers, multipart)` | Menghapus header yang dilarang browser. |
| `isBrowserForbiddenHeader(name)` | Menentukan apakah header dikendalikan API jaringan browser. |
| `escapeJs`, `escapePy`, `escapeSh`, `escapePhp`, `escapeRuby`, `escapePowerShell`, `escapeCSharp`, `escapeJava`, `escapeGo`, `escapeRust`, `escapeObjC`, `escapeSwift`, `escapeR`, `escapeOCaml`, `escapeFSharp`, `escapeClojure` | Fungsi escape literal string untuk setiap bahasa. |
| `assertIsRecord`, `assertIsString`, `assertIsNumber` | Penjaga asersi saat runtime. |
| `DEFAULT_FILE_PATH`, `DEFAULT_FILE_NAME`, `DEFAULT_BINARY_MEDIA_TYPE` | Konstanta placeholder unggahan file. |
