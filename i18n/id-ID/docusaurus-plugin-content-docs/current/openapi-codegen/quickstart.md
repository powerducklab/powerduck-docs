---
sidebar_position: 3
title: "Mulai cepat"
description: "Buat contoh permintaan pertama yang dapat dijalankan dengan @powerduck/openapi-codegen dan lihat generator yang tersedia."
---

# Mulai cepat

Panduan ini menjelaskan cara membuat contoh permintaan yang dapat dijalankan dan menemukan generator yang tersedia.

## 1. Instalasi

```bash npm2yarn2pnpm
npm install @powerduck/openapi-codegen
```

## 2. Membuat kode dari dokumen

Berikan dokumen OpenAPI yang **sudah diurai**, beserta `path`, `method`, `language`, dan `client` tujuan. `generate()` mengembalikan kode sumber sebagai string.

```typescript
import { generate } from "@powerduck/openapi-codegen";
import document from "./openapi.json" with { type: "json" };

const code = generate({
  document,
  path: "/pets/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
});

console.log(code);
```

Contoh setara dalam CommonJS:

```javascript
const { generate } = require("@powerduck/openapi-codegen");
const fs = require("node:fs");

const document = JSON.parse(fs.readFileSync("./openapi.json", "utf8"));

const code = generate({
  document,
  path: "/pets",
  method: "post",
  language: "python",
  client: "requests",
});

console.log(code);
```

## 3. Melihat daftar generator

`list()` mengembalikan deskriptor semua generator yang terdaftar:

```typescript
import { list } from "@powerduck/openapi-codegen";

for (const { language, client } of list()) {
  console.log(`${language}/${client}`);
}
```

Setiap deskriptor berbentuk `{ language: string; client: string }`. Pengenal membedakan huruf besar dan kecil; gunakan persis nilai yang tercantum dalam daftar generator di referensi API. [Referensi API](/docs/id-ID/openapi-codegen/api-reference/#built-in-generators-21-languages-41-clients).

Anda juga dapat memilih generator melalui kode:

```typescript
import { generate, list } from "@powerduck/openapi-codegen";

const picked = list().find(
  (g) => g.language === "javascript" && g.client === "fetch",
);

if (!picked) throw new Error("Generator not available");

const code = generate({
  document,
  path: "/pets",
  method: "get",
  language: picked.language,
  client: picked.client,
});
```

## 4. Memberikan kredensial

Gunakan `securityValues` untuk mengisi skema keamanan bernama. Kuncinya harus sesuai dengan nama skema dalam dokumen:

```typescript
const code = generate({
  document,
  path: "/pets/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
  securityValues: {
    bearerAuth: "YOUR_ACCESS_TOKEN",
    apiKey: "YOUR_API_KEY",
  },
});
```

## 5. Mengganti URL server

```typescript
const code = generate({
  document,
  path: "/pets",
  method: "get",
  language: "shell",
  client: "curl",
  serverUrl: "https://staging.example.com/v1",
});
```

## Penanganan kesalahan

`generate()` melempar pengecualian jika masukan tidak lengkap atau generator tidak didukung. Tangani pengecualian saat memproses dokumen yang tidak tepercaya:

```typescript
try {
  const code = generate({
    document,
    path: "/pets/{id}",
    method: "get",
    language: "javascript",
    client: "fetch",
  });
  console.log(code);
} catch (error) {
  console.error("Generation failed:", error instanceof Error ? error.message : error);
}
```

## Langkah berikutnya

- [Konfigurasi](/docs/id-ID/openapi-codegen/configuration/) — `GenerateOptions`, `RequestIR`, `Generator`, `Plugin`.
- [Contoh](/docs/id-ID/openapi-codegen/examples/) — JavaScript fetch, Python requests, cURL, generator kustom, plugin, dan penggunaan langsung `RequestIR`.
- [Referensi API](/docs/id-ID/openapi-codegen/api-reference/) — Semua ekspor.
