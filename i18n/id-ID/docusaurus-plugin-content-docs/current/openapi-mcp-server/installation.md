---
sidebar_position: 2
title: "Instalasi"
description: "Instal @powerduck/openapi-mcp-server dengan npm, yarn, pnpm, atau secara global. Pelajari CLI openapi-mcp, subjalur ./server, dan dependensinya. Memerlukan Node.js 22.12.0 atau lebih baru."
---

# Instalasi

## Persyaratan

- **Node.js `>=22.12.0`** (dinyatakan dalam `engines`).

## Instalasi

```bash npm2yarn2pnpm
npm install @powerduck/openapi-mcp-server
```

Yarn:

```bash
yarn add @powerduck/openapi-mcp-server
```

pnpm:

```bash
pnpm add @powerduck/openapi-mcp-server
```

## CLI

Paket mendaftarkan program `openapi-mcp`.

```bash
# global install
npm install -g @powerduck/openapi-mcp-server

# or run without installing
npx --package @powerduck/openapi-mcp-server openapi-mcp --help
```

CLI memiliki satu perintah, yaitu `serve` (lihat [Mulai cepat](/docs/id-ID/openapi-mcp-server/quickstart/)).

## ESM / CommonJS

Kedua format build menyertakan deklarasi tipe. Tidak diperlukan `@types/*` tambahan:

```javascript
// ESM
import { buildMcpServer, startStdioServer } from "@powerduck/openapi-mcp-server";

// CommonJS
const { buildMcpServer, startStdioServer } = require("@powerduck/openapi-mcp-server");
```

## Ekspor subjalur

| Impor | Isi |
| --- | --- |
| `@powerduck/openapi-mcp-server` | Pustaka inti: memuat spesifikasi, menghasilkan alat/prompt/sumber daya, menjalankan permintaan, membangun server MCP, serta transport stdio dan HTTP. |
| `@powerduck/openapi-mcp-server/server` | Server HTTP administrasi dan middleware autentikasi (`startAdminServer`, `createAuthMiddleware`). |

## Dependensi runtime

Dependensi berikut terinstal otomatis bersama paket:

- `@modelcontextprotocol/sdk` — implementasi protokol MCP.
- `@powerduck/openapi-parser` — validasi, penyelesaian referensi, dan peningkatan versi OpenAPI.
- `express` dan `cors` — server HTTP administrasi dan CORS.
- `axios` — klien HTTP ke layanan tujuan saat menjalankan alat.
- `commander` — kerangka CLI.
- `js-yaml` — penguraian YAML.
- `multer` — penanganan unggahan spesifikasi.
- `terser` — minifikasi aset antarmuka web bawaan.

## Verifikasi

```bash
npx --package @powerduck/openapi-mcp-server openapi-mcp --help
```

## Langkah berikutnya

- [Mulai cepat](/docs/id-ID/openapi-mcp-server/quickstart/)
- [Konfigurasi](/docs/id-ID/openapi-mcp-server/configuration/)
