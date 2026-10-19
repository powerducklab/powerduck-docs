---
sidebar_position: 2
title: "Instalasi"
description: "Instal @powerduck/openapi-cli secara global, sebagai dependensi pengembangan, atau jalankan dengan npx. Memerlukan Node.js 22.12.0 atau lebih baru."
---

# Instalasi

## Persyaratan

- **Node.js**: `>= 22.12.0` (dinyatakan dalam kolom `engines` paket).
- Pengelola paket: npm, yarn, atau pnpm.

Paket menyediakan build ESM (`dist/index.js`) dan CommonJS (`dist/index.cjs`), beserta deklarasi TypeScript (`dist/index.d.ts`). Tidak diperlukan paket `@types` tambahan.

## Instalasi global (disarankan untuk CLI)

Instalasi global membuat program `openapi-cli` tersedia melalui `PATH` Anda:

```bash npm2yarn2pnpm
npm install -g @powerduck/openapi-cli
```

Periksa programnya:

```bash
openapi-cli --help
```

## Instalasi dalam proyek (disarankan untuk CI)

Tetapkan versi dalam proyek agar CI menggunakan rilis yang diketahui:

```bash npm2yarn2pnpm
npm install --save-dev @powerduck/openapi-cli
```

Lalu jalankan perintah melalui pengelola paket:

```bash
npx openapi-cli --spec openapi.json
# or
pnpm exec openapi-cli --spec openapi.json
```

## Sekali jalan dengan npx

Tanpa instalasi sebelumnya:

```bash
npx @powerduck/openapi-cli --spec openapi.json
```

## Struktur paket

| Titik masuk | Jalur |
|-------|------|
| Titik masuk ESM | `dist/index.js` |
| Titik masuk CommonJS | `dist/index.cjs` |
| Definisi tipe | `dist/index.d.ts` |
| Titik masuk CLI (bin) | `dist/cli.js` |
| Nama program | `openapi-cli` |

Paket menyatakan `"type": "module"` dan hanya menyediakan subjalur `.` serta `./package.json`.

## Impor dalam kode

```typescript
// ESM
import { runTests, resolveConfig } from "@powerduck/openapi-cli";

// CommonJS
const { runTests, resolveConfig } = require("@powerduck/openapi-cli");
```

## Dependensi runtime

Paket yang dipublikasikan bergantung pada:

- `@powerduck/openapi-parser` (`^0.3.12`) — penyelesaian referensi `$ref` internal.
- `@powerduck/openapi-request` (`0.2.22`) — eksekusi permintaan protokol.
- `commander` (`^12.1.0`) — penguraian argumen CLI.
- `https-proxy-agent` (`^5.0.1`) — dukungan proksi untuk transport HTTP.

## Langkah berikutnya

- [Mulai cepat](/docs/id-ID/openapi-cli/quickstart/) — jalankan rangkaian pengujian pertama Anda.
- [Perintah](/docs/id-ID/openapi-cli/commands/) — referensi lengkap opsi.
