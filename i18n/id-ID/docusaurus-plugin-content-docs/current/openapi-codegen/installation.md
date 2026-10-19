---
sidebar_position: 2
title: "Instalasi"
description: "Instal @powerduck/openapi-codegen dengan npm, yarn, atau pnpm dan gunakan di Node.js atau browser. Memerlukan Node.js 22.12.0 atau lebih baru."
---

# Instalasi

## Persyaratan

- Untuk penggunaan Node.js, diperlukan **Node.js** `>= 22.12.0` (dinyatakan dalam kolom `engines` paket).
- Dokumen OpenAPI yang **sudah diurai** sebagai objek JavaScript, bukan string JSON/YAML mentah.
- Browser modern dengan Fetch API untuk penggunaan browser.

Paket menyediakan build ESM (`dist/index.js`) dan CommonJS (`dist/index.cjs`) beserta deklarasi TypeScript. Tidak ada **dependensi runtime**.

## npm

```bash npm2yarn2pnpm
npm install @powerduck/openapi-codegen
```

## pnpm

```bash npm2yarn2pnpm
pnpm add @powerduck/openapi-codegen
```

## Yarn

```bash npm2yarn2pnpm
yarn add @powerduck/openapi-codegen
```

## Penggunaan di Node.js

```typescript
import { generate } from "@powerduck/openapi-codegen";
```

CommonJS:

```javascript
const { generate } = require("@powerduck/openapi-codegen");
```

Generator bawaan **terdaftar otomatis saat modul diimpor**, sehingga `generate` langsung berfungsi tanpa pengaturan tambahan.

## Penggunaan di browser

Pustaka sepenuhnya kompatibel dengan browser tanpa modul bawaan Node.js. Muat dari CDN ESM dan panggil langsung:

```html
<script type="module">
  import { generate, list } from "https://esm.sh/@powerduck/openapi-codegen";

  const document = {
    openapi: "3.1.0",
    info: { title: "Example API", version: "1.0.0" },
    servers: [{ url: "https://api.example.com" }],
    paths: {
      "/hello": { get: { responses: { "200": { description: "OK" } } } },
    },
  };

  const code = generate({
    document,
    path: "/hello",
    method: "get",
    language: "javascript",
    client: "fetch",
  });

  console.log(code);
</script>
```

Vite, esbuild, dan webpack juga langsung dapat digunakan; build ESM mendukung tree shaking.

## Memberikan dokumen

Berikan objek yang sudah diurai. Untuk JSON:

```typescript
import { readFile } from "node:fs/promises";

const document = JSON.parse(await readFile("./openapi.json", "utf8"));
```

Untuk YAML, uraikan terlebih dahulu dengan paket YAML terpisah:

```typescript
import YAML from "yaml";
const document = YAML.parse(await readFile("./openapi.yaml", "utf8"));
```

## Struktur paket

| Titik masuk | Jalur |
|-------|------|
| Titik masuk ESM | `dist/index.js` |
| Titik masuk CommonJS | `dist/index.cjs` |
| Definisi tipe | `dist/index.d.ts` |

Tidak ada program CLI; pustaka ini hanya digunakan melalui kode.

## Langkah berikutnya

- [Mulai cepat](/docs/id-ID/openapi-codegen/quickstart/) — hasilkan cuplikan kode pertama Anda.
- [Konfigurasi](/docs/id-ID/openapi-codegen/configuration/) — semua opsi pembuatan kode.
