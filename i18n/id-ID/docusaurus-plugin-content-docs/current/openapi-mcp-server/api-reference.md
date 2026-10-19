---
sidebar_position: 5
title: "Referensi API"
description: "Referensi lengkap @powerduck/openapi-mcp-server: pemuatan spesifikasi, pembuatan alat, prompt dan sumber daya, penyusunan dan eksekusi permintaan, server MCP, transport, administrasi, autentikasi, registri layanan, dan CLI."
---

# Referensi API

Semua ekspor publik `@powerduck/openapi-mcp-server`, dikelompokkan menurut fungsi.

## Pemuatan spesifikasi

| Ekspor | Tanda tangan | Deskripsi |
| --- | --- | --- |
| `loadOpenApiSpec(filePath)` | `(string) => Promise<Oas32Document>` | Membaca berkas JSON atau YAML, memvalidasi, menyelesaikan referensi, dan memastikan ID operasi unik. YAML dikenali dari ekstensi `.ya?ml`. |
| `parseSpecContent(rawText, isYaml)` | `(string, boolean) => Promise<Oas32Document>` | Mengurai dokumen dari string. Input kosong atau tidak valid memicu exception. |

## Pembuatan alat

| Ekspor | Tanda tangan | Deskripsi |
| --- | --- | --- |
| `generateTools(spec)` | `(spec) => Tool[]` | Membuat definisi MCP `Tool` untuk setiap operasi. |
| `generateToolsDetailed(spec)` | `(spec) => GenerateToolsResult` | Mengembalikan `{ tools, bindings, issues }`. |
| `buildBindingIndex(spec)` | `(spec) => Map<string, ToolBinding>` | Memetakan nama alat yang dibuat ke `ToolBinding`-nya; alias dari `getBindingIndex`. |

Ekspor tipe: `ToolBinding`, `GeneratedToolWithBinding` (alias paket untuk `GeneratedTool`).

## Prompt dan sumber daya

| Ekspor | Tanda tangan | Deskripsi |
| --- | --- | --- |
| `generatePrompts(spec)` | `(spec) => GeneratedPrompt[]` | Mendaftar semua prompt yang dibuat. |
| `resolvePrompt(spec, name, args?)` | `(spec, string, Record?) => GetPromptResult \| null` | Mencari prompt berdasarkan nama; mengembalikan `null` jika tidak dikenal. |
| `generateResources(spec)` | `(spec) => GeneratedResource[]` | Mendaftar sumber daya katalog. |
| `readResource(spec, uri)` | `(spec, string) => ResourceContentItem \| null` | Membaca satu sumber daya berdasarkan URI. |

## Penyusunan dan eksekusi permintaan

| Ekspor | Tanda tangan | Deskripsi |
| --- | --- | --- |
| `buildRequest(baseUrl, templatePath, pathItem, operation, args, binding?)` | `=> BuiltRequest` | Menserialisasi argumen menjadi `{ url, query, headers, body, dropped }`. Menggunakan argumen posisi. |
| `executeToolCall(spec, toolName, args, context?)` | `(spec, string, Record?, ExecutionContext?) => Promise<ToolCallResult>` | Menjalankan alat yang dibuat terhadap API tujuan. Respons non-2xx dikembalikan sebagai data; kegagalan transport melempar exception. |

Kolom `ToolCallResult`: `status`, `statusText`, `headers`, `data`, `truncated`, `url`, `method`, `durationMs`, `correlationId`.

## Utilitas spesifikasi

| Ekspor | Deskripsi |
| --- | --- |
| `iterateOperations(spec, issues?)` | Generator yang menghasilkan semua operasi yang telah diresolusikan, termasuk `additionalOperations` OpenAPI 3.2. |
| `collectOperationParameters(pathItem, operation, issues?, context?)` | Menggabungkan parameter item jalur dan operasi berdasarkan kunci `(name, in)`. |
| `normalizeParameter(candidate)` | Menormalkan parameter mentah; mengembalikan `null` jika tidak dapat digunakan. |
| `synthesizeOperationId(method, pathTemplate)` | ID pengganti deterministik ketika operasi tidak mencantumkan `operationId`. |
| `ensureUniqueName(candidate, taken)` | Menambahkan akhiran angka agar nama tetap unik. |
| `extractPathTemplateVariables(pathTemplate)` | Mengekstrak variabel `{name}`, menghapus duplikat dengan mempertahankan kemunculan pertama. |
| `effectiveStyle(parameter)` | Menerapkan nilai bawaan `style` dari spesifikasi. |
| `effectiveExplode(parameter)` | Menerapkan nilai bawaan `explode` dari spesifikasi. |
| `findOperationById(spec, operationId)` | Pencarian O(1) setelah pembangunan pertama; mengembalikan `null` jika tidak dikenal. |
| `findDuplicateOperationIds(spec)` | Melaporkan ID duplikat yang dideklarasikan penulis. |
| `assertUniqueOperationIds(spec)` | Melempar exception jika ID operasi duplikat. |
| `isPlainObject(value)` | Mempersempit tipe menjadi objek biasa. |
| `truncateGeneratedName(name, limit=64)` | Memendekkan nama sambil mempertahankan keunikannya. |

Ekspor tipe: `OperationEntry`, `DuplicateOperationId`.

## Server MCP dan transport

| Ekspor | Deskripsi |
| --- | --- |
| `buildMcpServer(specProvider, contextProvider?, options?)` | Membangun `Server` SDK dengan handler alat, prompt, dan sumber daya. Menggunakan argumen posisi. |
| `startStdioServer(spec, context?, options?)` | Menyediakan satu dokumen melalui stdio; mengembalikan `{ closed, close() }`. |
| `attachMcpRoutes(app, options)` | Memasang rute Streamable HTTP (`/mcp`) dan SSE lama opsional (`/sse`). Menerima `AttachMcpRoutesOptions` dan mengembalikan `McpRouteHandle`. |
| `attachSseRoutes(app, specProvider, contextProvider, routeGuard?)` | Pembungkus usang dengan argumen posisi. Mengembalikan `{ activeSessionCount, closeAll }`. |
| `createStreamableSessionHost(options)` | Membuat host sesi Streamable HTTP mandiri untuk integrasi transport khusus. |

Tipe: `SpecProvider = () => Document | null`, `ContextProvider = () => ExecutionContext`, `AttachMcpRoutesOptions`, `McpRouteHandle`, `StreamableSessionHost`, `StreamableSessionHostOptions`, `McpSessionEvent`, `McpSessionInfo`, `SessionCloseReason`, `SessionKind`.

`attachMcpRoutes` diekspor dari akar paket. Atur `maxSessions`, `allowedOrigins`, `sessionIdleMs`, dan perlindungan DNS rebinding melalui opsinya. Handle menyediakan `activeSessionCount`, `pendingSessionCount`, `listSessions`, `closeSession`, `closeAll`, dan `dispose`. Gunakan `dispose()` saat penghentian untuk menghentikan pembersihan berkala serta menutup sesi.

## Server admin dan autentikasi (subjalur `./server`) {#admin-server-and-auth-server-subpath}

Impor `startAdminServer` dari `@powerduck/openapi-mcp-server/server` atau akar paket. Impor `createAuthMiddleware` dari akar paket; subjalur `./server` tidak mengekspornya.

| Ekspor | Tanda tangan | Deskripsi |
| --- | --- | --- |
| `startAdminServer(config)` | `Promise<AdminServerHandle>` | Memulai aplikasi admin Express dengan UI web dan rute MCP. Mengembalikan `{ app, server, port, close() }`. |
| `createAuthMiddleware(apiKey?)` | `RequestHandler` | Perlindungan akses Bearer atau `x-api-key`. Jangan sertakan kunci untuk menonaktifkannya. Menggunakan argumen posisi. |

## Runtime dan utilitas

| Ekspor | Deskripsi |
| --- | --- |
| `ServiceRegistry` | Kelas untuk `ManagedServiceRecord`: `upsert`, `list`, `get`, `remove`, `clear`, `start`, `stop`, `fail`. |
| `isAbortError(error)` | Benar untuk `AbortError` atau `CanceledError` axios. |
| `newId()` | UUID, dengan nilai cadangan berbasis stempel waktu. |

## CLI

Program **`openapi-mcp`**. Satu perintah, yaitu `serve`:

```
openapi-mcp serve [options]
```

| Opsi | Nilai bawaan | Deskripsi |
| --- | --- | --- |
| `--port <n>` | `3000` | Port HTTP untuk transport web. |
| `--host <host>` | `127.0.0.1` | Host HTTP. |
| `--transport <mode>` | `web` | `stdio` atau `web`. |
| `--spec <path>` | — | Jalur berkas OpenAPI, wajib dalam mode stdio. |
| `--base-url <url>` | — | Mengganti URL dasar layanan tujuan. |
| `--api-key <key>` | — | Kunci API admin. |
| `--upstream-header "Name: value"` | — | Header layanan tujuan yang dapat diulang. |
| `--timeout <ms>` | `30000` | Batas waktu layanan tujuan. |
| `--no-persist` | — | Menonaktifkan penyimpanan status persisten. |

## Tipe (diekspor ulang dari `types`)

`ServerConfig`, `SecurityContext`, `AppState`, `PersistedState`, `ExecutionContext`, `TransportMode`, `SpecSource`, `ServiceStatus`, `ProtocolHint`, `LogDirection`, `LogLevel`, `ParameterLocation`, `BodyEncoding`, `ServiceEndpointInfo`, `ManagedServiceRecord`, `SpecIssue`, `AdminStatus`, `GeneratedPrompt`, `GeneratedResource`, `GeneratedTool`, `ResourceContentItem`, `PromptMessageShape`, `RequestLogEntry`, `LogQueryOptions`, `LogQueryResult`; `ResolvedPrompt` sudah usang. Fungsi pemeriksa: `isSpecSource`, `isServiceStatus`, `isProtocolHint`, `isParameterLocation`, `isBodyEncoding`, `isPlainRecord`.

## Error dan perilaku

- ID alat, prompt, atau sumber daya yang tidak dikenal menghasilkan error MCP `InvalidParams`, bukan kegagalan di dalam hasil normal.
- Spesifikasi yang hilang saat sesi aktif menimbulkan `InternalError`.
- Respons 4xx/5xx dari layanan tujuan dikembalikan ke model sebagai konten dengan `isError: true`, tanpa exception. Hanya kegagalan transport (DNS, TLS, batas waktu, pembatalan) yang melempar exception.

## Lihat juga

- [Konfigurasi](../configuration/)
- [Contoh](../examples/)
