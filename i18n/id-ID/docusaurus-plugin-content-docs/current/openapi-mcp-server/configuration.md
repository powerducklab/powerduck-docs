---
sidebar_position: 4
title: "Konfigurasi"
description: "Konfigurasi lengkap @powerduck/openapi-mcp-server: ServerConfig, SecurityContext, ExecutionContext, TransportMode, serta union literal untuk sumber, status, protokol, tingkat log, dan pengodean isi."
---

# Konfigurasi

Objek konfigurasi utama adalah `ServerConfig`, yang diterima oleh `startAdminServer()`. Tipe konteks terkait digunakan dalam eksekusi alat.

## `ServerConfig`

Hanya `port` yang wajib diisi.

| Kolom | Tipe | Nilai bawaan | Deskripsi |
| --- | --- | --- | --- |
| `port` | `number` | — (wajib) | Port TCP untuk mendengarkan, bilangan bulat 0–65535. |
| `host` | `string` | `"127.0.0.1"` | Antarmuka jaringan; loopback secara bawaan untuk menghindari akses eksternal yang tidak disengaja. |
| `apiKey` | `string` | undefined | Rahasia bersama yang diwajibkan oleh API admin dan transport HTTP jika ditetapkan. |
| `specPath` | `string` | undefined | Spesifikasi yang dimuat sekali saat mulai. |
| `baseUrlOverride` | `string` | undefined | Mengganti URL dasar layanan tujuan yang berasal dari `servers[0].url`. |
| `upstreamHeaders` | `Record<string, string>` | undefined | Header yang digabungkan ke setiap permintaan layanan tujuan. |
| `requestTimeoutMs` | `number` | undefined | Batas waktu per permintaan layanan tujuan dalam milidetik. |
| `persistState` | `boolean` | `true` | Menyimpan spesifikasi yang dimuat agar tetap tersedia setelah mulai ulang. |
| `stateFilePath` | `string` | undefined | Lokasi berkas status persisten. |
| `allowedOrigins` | `string[]` | undefined | Origin CORS yang diizinkan; kosong atau tidak disertakan menonaktifkan akses lintas origin. |
| `allowedHosts` | `string[]` | undefined | Nilai header `Host` yang diizinkan. |
| `maxLogEntries` | `number` | 200 | Jumlah maksimum entri log yang disimpan dalam memori. |
| `redactSensitiveHeaders` | `boolean` | `true` | Menyamarkan nilai header sensitif sebelum dicatat. |
| `redactHeaderNames` | `string[]` | undefined | Nama header tambahan yang disamarkan selain daftar bawaan. |
| `security` | `SecurityContext` | undefined | Kredensial yang diteruskan ke API tujuan untuk setiap panggilan alat. |

## `SecurityContext`

| Kolom | Tipe | Dikirim sebagai |
| --- | --- | --- |
| `bearerToken` | `string` | `Authorization: Bearer <token>` |
| `basicAuth` | `{ username, password }` | `Authorization: Basic <base64>` |
| `apiKeys` | `Record<string, string>` | Pasangan nama header dan nilai yang persis. |

Kredensial disisipkan oleh eksekutor dan tidak pernah diekspos sebagai argumen alat yang diterima model.

## `ExecutionContext`

Konteks per panggilan yang diteruskan ke `executeToolCall` dan dikembalikan oleh `ContextProvider`:

| Kolom | Tipe | Deskripsi |
| --- | --- | --- |
| `baseUrlOverride` | `string` | Mengganti URL server spesifikasi untuk panggilan ini. |
| `upstreamHeaders` | `Record<string, string>` | Header tambahan untuk layanan tujuan. |
| `requestTimeoutMs` | `number` | Batas waktu per panggilan, dengan minimum 1 detik. |
| `security` | `SecurityContext` | Kredensial per panggilan. |
| `correlationId` | `string` | Menghubungkan entri log dari satu pemanggilan. |
| `protocol` | `ProtocolHint` | Transport yang memulai panggilan. |
| `onLog` | `(entry) => void` | Menerima entri log permintaan/respons; tidak boleh melempar exception. |
| `signal` | `AbortSignal` | Membatalkan permintaan layanan tujuan yang sedang berlangsung. |

## Union literal dan fungsi pemeriksa

| Union | Nilai | Fungsi pemeriksa |
| --- | --- | --- |
| `TransportMode` | `"stdio" \| "web"` | — |
| `SpecSource` | `"startup-file" \| "upload" \| "paste" \| "runtime"` | `isSpecSource()` |
| `ServiceStatus` | `"running" \| "stopped" \| "error"` | `isServiceStatus()` |
| `ProtocolHint` | `"streamable-http" \| "sse" \| "stdio"` | `isProtocolHint()` |
| `LogDirection` | `"request" \| "response" \| "internal"` | — |
| `LogLevel` | `"debug" \| "info" \| "warn" \| "error"` | — |
| `ParameterLocation` | `"path" \| "query" \| "header" \| "cookie"` | `isParameterLocation()` |
| `BodyEncoding` | `"json" \| "form-urlencoded" \| "multipart" \| "text" \| "binary"` | `isBodyEncoding()` |

## `BuildMcpServerOptions`

Diteruskan sebagai argumen ketiga ke `buildMcpServer()`:

| Kolom | Tipe | Nilai bawaan | Deskripsi |
| --- | --- | --- | --- |
| `protocol` | `ProtocolHint` | undefined | Petunjuk protokol yang diumumkan. |
| `name` | `string` | `"openapi-mcp"` | Nama server yang diumumkan. |
| `version` | `string` | `"1.1.0"` | Versi server yang diumumkan. |
| `pageSize` | `number` | 100 | Jumlah maksimum entri per respons daftar, dibatasi hingga 500. |
| `instructions` | `string` | bawaan | Petunjuk penggunaan yang disediakan melalui MCP `instructions`. |

## Opsi lapisan transport (`AttachMcpRoutesOptions`)

Impor `attachMcpRoutes` dari `@powerduck/openapi-mcp-server` dan berikan objek opsi sebagai argumen kedua. Pembungkus lama `attachSseRoutes()` hanya menerima argumen posisi `(app, specProvider, contextProvider, routeGuard?)`.

| Kolom | Tipe | Nilai bawaan | Deskripsi |
| --- | --- | --- | --- |
| `specProvider` | `SpecProvider` | — (wajib) | Menyediakan dokumen untuk sesi baru. |
| `contextProvider` | `ContextProvider` | — (wajib) | Menyediakan konteks layanan tujuan untuk setiap panggilan. |
| `routeGuard` | `RequestHandler` | undefined | Middleware yang diterapkan ke setiap rute MCP. |
| `maxSessions` | `number` | 64 | Batas jumlah sesi bersamaan. |
| `sessionIdleMs` | `number` | 600000 | Batas waktu tidak aktif dalam milidetik; 0 menonaktifkannya. |
| `allowedOrigins` | `string[]` | undefined | Origin yang diizinkan; daftar yang tidak kosong mengaktifkan perlindungan DNS rebinding. |
| `allowedHosts` | `string[]` | undefined | Nilai header `Host` yang diizinkan. |
| `enableLegacySse` | `boolean` | `true` | Memasang transport HTTP+SSE yang sudah usang. |
| `onEvent` | `(event: McpSessionEvent) => void` | undefined | Menerima peristiwa siklus hidup; tidak boleh melempar exception. |

> Ini adalah opsi untuk `attachMcpRoutes`, bukan kolom tambahan `ServerConfig`. Server admin meneruskan pengaturan origin dan host, tetapi menggunakan batas sesi dan batas waktu tidak aktif bawaan transport. Gunakan fungsi transport publik secara langsung jika perlu menyesuaikan batas tersebut.

## Lihat juga

- [Referensi API](../api-reference/)
- [Contoh](../examples/)
