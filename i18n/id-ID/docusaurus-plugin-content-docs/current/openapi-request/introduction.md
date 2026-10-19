---
sidebar_position: 1
title: "Pengantar @powerduck/openapi-request"
description: "@powerduck/openapi-request adalah debugger koleksi dan runtime permintaan untuk OpenAPI 3.2. Pustaka ini menyusun serta mengirim permintaan berdasarkan dokumen OpenAPI, mengenali respons streaming, dan dapat menghasilkan dokumen yang diperbarui dari respons yang diamati. Satu antarmuka ringkas mendukung enam protokol komunikasi."
---

# Pengantar @powerduck/openapi-request

`@powerduck/openapi-request` adalah debugger koleksi dan runtime permintaan untuk OpenAPI 3.2. Pustaka ini menyusun serta mengirim permintaan berdasarkan dokumen OpenAPI, mengenali respons streaming, dan dapat menghasilkan dokumen yang diperbarui dari respons yang diamati. Satu antarmuka ringkas mendukung enam protokol komunikasi.

- **Nama paket:** `@powerduck/openapi-request`
- **Versi:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-request"/>
- **Lisensi:** MIT
- **Format modul:** build ESM dan CommonJS dengan deklarasi tipe yang disertakan.

## Kegunaan

Pustaka ini memenuhi tiga kebutuhan dengan dokumen yang sama sebagai acuan:

- **Klien untuk antarmuka grafis** — `createClient()` mengembalikan objek dengan metode `prepare()`, `send()`, `connect()`, `discover()`, dan `writeback()` yang sesuai dengan tahapan pada editor permintaan grafis.
- **Debugger berbasis skrip** — `createDebugger()` mengembalikan `ProtoKit` dengan `send()`, `sendMany()`, dan `toCollection()` untuk otomatisasi, skrip, serta CI.
- **Sesi persisten yang dikelola manual** — `createManualSession()` mengembalikan objek sesi dua arah dengan operasi buka, kirim, tutup, dan aliran peristiwa. Strukturnya sama untuk WebSocket, MCP, dan gRPC, sehingga satu antarmuka dapat menangani ketiganya.

## Adaptor protokol

Inti pustaka tidak bergantung pada transport tertentu; perilaku protokol disediakan oleh adaptor yang terdaftar di `AdapterRegistry`.

- **HTTP / SSE** — didukung secara bawaan. Permintaan JSON biasa dan aliran Server-Sent Events dikenali otomatis dari tipe konten yang dideklarasikan atau header respons aktual.
- **WebSocket** — sesi teks atau biner dua arah dengan format peristiwa yang seragam.
- **gRPC** — panggilan unary, streaming server, streaming klien, dan streaming dua arah menggunakan berkas `.proto` atau refleksi server.
- **MCP** — pemanggilan alat Model Context Protocol melalui Streamable HTTP atau stdio.
- **GraphQL** — introspeksi, pembuatan, dan eksekusi operasi.

## Fitur utama

- **Model koleksi OpenAPI 3.2** — menemukan operasi melalui `operationId` atau `method`+`path`, lalu menyusun permintaan dari parameter, isi permintaan, dan contoh.
- **Deteksi streaming** — `isStreamingOperation()`, `isSseContentType()`, dan `isStreamingContentType()` mengklasifikasikan respons berdasarkan tipe konten yang dideklarasikan; `probeStreamingResponse()` memeriksa header respons aktual.
- **Penulisan balik respons** — `inferSchema()`, `mergeSchema()`, `toResponseObject()`, dan `writeBackResponse()` menyimpulkan skema respons dan mengembalikan dokumen yang diperbarui. Secara bawaan, `send()` mengembalikannya sebagai `patchedSpec` jika penulisan balik berhasil; atur `writeBack: false` untuk menonaktifkannya. Dokumen masukan tidak diubah dan tidak ada berkas yang disimpan otomatis. Periksa `writeBackSkippedReason` dan `writeBackWarnings` sebelum menyimpan hasil secara permanen.
- **Utilitas skema** — `sampleFromSchema()` menghasilkan data contoh dari skema.
- **Pemuatan tertunda untuk dependensi besar** — gRPC (`@grpc/grpc-js`, `@grpc/proto-loader`) dan MCP (`@modelcontextprotocol/sdk`) dimuat saat pertama kali digunakan. Pengguna yang hanya memakai HTTP tidak menanggung biaya pemuatannya.

## Instalasi

```bash npm2yarn2pnpm
npm install @powerduck/openapi-request
```

## Mulai cepat

```typescript
import { createClient } from "@powerduck/openapi-request";

const spec = {
  openapi: "3.2.0",
  info: { title: "Users", version: "1.0.0" },
  paths: {
    "/users/{id}": {
      get: {
        operationId: "getUserById",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "User" } },
      },
    },
  },
};

const client = createClient();

const plan = client.prepare({
  spec,
  target: { operationId: "getUserById" },
});

const result = await client.send({
  spec,
  target: { operationId: "getUserById" },
  values: { path: { id: "42" } },
  serverUrl: "https://api.example.com",
});
```

## Langkah berikutnya

- [Instalasi](./installation.md) — struktur paket, ekspor subjalur, dan dependensi peer untuk kemampuan protokol.
- [Mulai cepat](./quickstart.md) — permintaan pertama, menjalankan debugger, dan sesi manual.
- [Konfigurasi](./configuration.md) — `CreateClientOptions`, `DebuggerOptions`, dan konfigurasi per protokol.
- [Referensi API](./api-reference.md) — seluruh ekspor yang dikelompokkan berdasarkan fungsi.
- [Contoh](./examples.md) — contoh yang dapat dijalankan untuk HTTP, SSE, WebSocket, GraphQL, MCP, dan gRPC.

## Lisensi

MIT.
