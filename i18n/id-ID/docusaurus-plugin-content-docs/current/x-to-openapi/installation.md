---
sidebar_position: 2
title: "Instalasi"
description: "Instal @powerduck/x-to-openapi dengan npm, yarn, atau pnpm. ESM dengan dukungan CommonJS; curlToOpenApi dan postmanToOpenApi tanpa konfigurasi."
---

# Instalasi

Instal `@powerduck/x-to-openapi` dengan pengelola paket pilihan Anda.

## Persyaratan

- **Node.js:** `>= 22.12.0`
- **TypeScript:** opsional; definisi tipe lengkap disertakan dalam paket.

## Instalasi

```bash npm2yarn2pnpm
npm install @powerduck/x-to-openapi
```

```bash
yarn add @powerduck/x-to-openapi
```

```bash
pnpm add @powerduck/x-to-openapi
```

## Dependensi runtime

| Paket | Versi | Kegunaan |
|---|---|---|
| `@powerduck/openapi-parser` | `^0.3.12` | Tipe OpenAPI kanonis dan validasi keluaran |
| `curlconverter` | `^4.12.0` | Mengurai perintah curl menjadi permintaan terstruktur |

Kedua dependensi terinstal otomatis.

---

## Sistem modul: ESM dengan dukungan CJS

Paket menyatakan `"type": "module"` dan menyediakan kedua build melalui satu titik masuk:

| Build | Kondisi | Berkas |
|---|---|---|
| ESM | `import` | `./dist/index.js` |
| CommonJS | `require` | `./dist/index.cjs` |
| Tipe | — | `./dist/index.d.ts` |

```typescript
// ESM (Node.js, bundlers)
import { curlToOpenApi, postmanToOpenApi } from "@powerduck/x-to-openapi";
```

```javascript
// CommonJS (require)
const { curlToOpenApi, postmanToOpenApi } = require("@powerduck/x-to-openapi");
```

Paket menyatakan `"sideEffects": false`, sehingga tree shaking membuang adaptor yang tidak digunakan.

---

## Fungsi bantu tanpa konfigurasi

Kebanyakan pengguna hanya memerlukan dua fungsi. Keduanya membuat instans [`XToOpenApi`](/docs/id-ID/x-to-openapi/api-reference/#xtoopenapi), mendaftarkan adaptor yang sesuai, lalu memanggil `convert`:

```typescript
import {
  curlToOpenApi,    // string | string[]  → OpenAPI 3.2
  postmanToOpenApi, // collection object | JSON string → OpenAPI 3.2
} from "@powerduck/x-to-openapi";
```

Gunakan kelas [`XToOpenApi`](/docs/id-ID/x-to-openapi/api-reference/#xtoopenapi) lengkap jika memerlukan opsi khusus, beberapa adaptor, deteksi `"auto"`, atau adaptor buatan sendiri.

---

## Verifikasi

```bash
# Check the installed version
npm list @powerduck/x-to-openapi

# Verify the package loads and the helpers exist
node -e "const x = require('@powerduck/x-to-openapi'); console.log(typeof x.curlToOpenApi, typeof x.postmanToOpenApi, typeof x.XToOpenApi);"
```

---

## Langkah berikutnya

- [Mulai cepat](/docs/id-ID/x-to-openapi/quickstart/) — konversi perintah curl dan koleksi Postman, lalu daftarkan adaptor khusus.
- [Referensi API](/docs/id-ID/x-to-openapi/api-reference/) — semua ekspor dan opsi.
