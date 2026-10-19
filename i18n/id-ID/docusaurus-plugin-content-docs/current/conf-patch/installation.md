---
sidebar_position: 2
title: "Instalasi"
description: "Instal @powerduck/conf-patch dan pilih titik masuk file untuk Node.js atau subjalur ./core yang aman untuk browser."
---

# Instalasi

Instal `@powerduck/conf-patch` dengan pengelola paket pilihan Anda.

## Persyaratan

- **Node.js:** `>= 22.12.0`
- **TypeScript:** opsional; deklarasi tipe lengkap disertakan, sehingga `@types/...` tidak diperlukan.

## Instalasi

```bash npm2yarn2pnpm
npm install @powerduck/conf-patch
```

```bash
yarn add @powerduck/conf-patch
```

```bash
pnpm add @powerduck/conf-patch
```

## Dependensi runtime

conf-patch menyertakan tiga dependensi runtime yang dipasang otomatis:

| Paket | Versi | Kegunaan |
|---|---|---|
| `@powerduck/openapi-parser` | `^0.3.12` | Validasi OpenAPI/Swagger (`validateOpenAPISpec`, `validateOpenAPIFile`). |
| `jsonc-parser` | `^3.3.1` | Penyuntingan teks secara inkremental untuk JSON dan JSONC. |
| `yaml` | `^2.9.0` | Penguraian dan perubahan AST YAML. |

Anda tidak perlu menggunakan dependensi tersebut secara langsung.

## Dua titik masuk

Paket menyediakan **dua ekspor subjalur**. Pilih sesuai lingkungan Anda.

### Titik masuk utama — `@powerduck/conf-patch`

Mencakup **lapisan file** (`readConfigFile`, `writeConfigFile`, `patchConfigFile`, `setConfigValue`, `deleteConfigValue`, `withFileLock`, `releaseAllLocalLocks`), lapisan inti, dan validasi OpenAPI. Gunakan pada Node.js dan Electron. Bergantung pada `node:fs`, `node:path`, dan `node:crypto`.

### Subjalur inti — `@powerduck/conf-patch/core`

Mengekspor **hanya lapisan inti yang aman untuk browser**: `patchContent`, `setContentValue`, `deleteContentValue`, helper asersi, dan tipe inti. Tanpa dependensi Node.js, sehingga dapat dibundel untuk browser, Edge Functions, dan service worker.

:::tip
Untuk browser, selalu impor dari `@powerduck/conf-patch/core`. Ini menjaga lapisan file beserta dependensi `node:fs` agar tidak masuk ke bundle.
:::

## Sistem modul: CJS dan ESM

Paket **tidak** menetapkan `"type": "module"`, sehingga file `.js` dianggap CommonJS secara bawaan. Peta `exports` dalam `package.json` mengarahkan kondisi `import` dan `require` secara eksplisit ke build yang benar.

| Titik masuk | CJS (`require`) | ESM (`import`) | Tipe |
|---|---|---|---|
| Titik masuk utama | `dist/index.js` | `dist/index.mjs` | `dist/index.d.ts` |
| Subjalur inti | `dist/core.js` | `dist/core.mjs` | `dist/core.d.ts` |

### CommonJS (Node.js / proses utama Electron)

```javascript
// Full library (includes file IO)
const { setConfigValue, readConfigFile } = require("@powerduck/conf-patch");

// Core layer only (browser-safe, no fs dependency)
const { patchContent, setContentValue } = require("@powerduck/conf-patch/core");
```

### ES Modules (Node.js modern / browser / bundler)

```typescript
// Full library
import { setConfigValue, readConfigFile } from "@powerduck/conf-patch";

// Core layer only (browser-safe)
import { patchContent, setContentValue } from "@powerduck/conf-patch/core";
```

## Memverifikasi instalasi

```bash
# Check the installed version
npm list @powerduck/conf-patch

# Verify the main entry loads
node -e "const lib = require('@powerduck/conf-patch'); console.log('exports:', Object.keys(lib).length);"

# Verify the core subpath loads
node -e "const core = require('@powerduck/conf-patch/core'); console.log('core exports:', Object.keys(core).length);"
```

## Langkah berikutnya

- [Mulai cepat](/docs/id-ID/conf-patch/quickstart/) — ubah string di browser dan file pada disk.
- [Referensi API](/docs/id-ID/conf-patch/api-reference/) — semua ekspor, tipe, dan opsi.
