---
sidebar_position: 2
title: "Kurulum"
description: "@powerduck/openapi-codegen’i npm, yarn veya pnpm ile kurun; Node.js ya da tarayıcıda kullanın. Node.js 22.12.0 veya üzeri gerekir."
---

# Kurulum

## Gereksinimler

- Node.js kullanımı için **Node.js** `>= 22.12.0` gerekir (paketin `engines` alanında belirtilir).
- Ham JSON/YAML dizesi değil, JavaScript nesnesi olarak **ayrıştırılmış** bir OpenAPI belgesi.
- Tarayıcı kullanımı için Fetch API destekleyen modern bir tarayıcı.

Paket, TypeScript bildirimleriyle birlikte ESM (`dist/index.js`) ve CommonJS (`dist/index.cjs`) derlemelerini içerir. **Çalışma zamanı bağımlılığı yoktur**.

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

## Node.js’te kullanım

```typescript
import { generate } from "@powerduck/openapi-codegen";
```

CommonJS:

```javascript
const { generate } = require("@powerduck/openapi-codegen");
```

Yerleşik üreticiler **modül içe aktarılırken otomatik kaydedilir**; böylece `generate` ek kurulum olmadan hemen çalışır.

## Tarayıcıda kullanım

Kitaplık tarayıcılarla tamamen uyumludur ve yerleşik Node.js modüllerini kullanmaz. Bir ESM CDN’den yükleyip doğrudan çağırın:

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

Vite, esbuild ve webpack de ek ayar olmadan çalışır; ESM derlemesi tree shaking destekler.

## Belgeyi iletme

Ayrıştırılmış bir nesne iletin. JSON için:

```typescript
import { readFile } from "node:fs/promises";

const document = JSON.parse(await readFile("./openapi.json", "utf8"));
```

YAML için önce ayrı bir YAML paketiyle ayrıştırın:

```typescript
import YAML from "yaml";
const document = YAML.parse(await readFile("./openapi.yaml", "utf8"));
```

## Paket yapısı

| Giriş | Yol |
|-------|------|
| ESM girişi | `dist/index.js` |
| CommonJS girişi | `dist/index.cjs` |
| Tür tanımları | `dist/index.d.ts` |

CLI programı yoktur; bu kitaplık yalnızca kod içinden kullanılır.

## Sonraki adımlar

- [Hızlı başlangıç](/docs/tr-TR/openapi-codegen/quickstart/) — ilk kod parçanızı üretin.
- [Yapılandırma](/docs/tr-TR/openapi-codegen/configuration/) — tüm üretim seçenekleri.
