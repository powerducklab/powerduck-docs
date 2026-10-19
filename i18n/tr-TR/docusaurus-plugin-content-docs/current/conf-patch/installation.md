---
sidebar_position: 2
title: "Kurulum"
description: "@powerduck/conf-patch paketini kurun; Node.js dosya girişini veya tarayıcıya uygun ./core alt yolunu seçin."
---

# Kurulum

`@powerduck/conf-patch` paketini tercih ettiğiniz paket yöneticisiyle kurun.

## Gereksinimler

- **Node.js:** `>= 22.12.0`
- **TypeScript:** isteğe bağlıdır; tam tür bildirimleri pakete dahildir, `@types/...` gerekmez.

## Kurulum

```bash npm2yarn2pnpm
npm install @powerduck/conf-patch
```

```bash
yarn add @powerduck/conf-patch
```

```bash
pnpm add @powerduck/conf-patch
```

## Çalışma zamanı bağımlılıkları

conf-patch otomatik kurulan üç çalışma zamanı bağımlılığı içerir:

| Paket | Sürüm | Kullanım |
|---|---|---|
| `@powerduck/openapi-parser` | `^0.3.12` | OpenAPI/Swagger doğrulaması (`validateOpenAPISpec`, `validateOpenAPIFile`). |
| `jsonc-parser` | `^3.3.1` | JSON ve JSONC için artımlı metin düzenlemeleri. |
| `yaml` | `^2.9.0` | YAML AST ayrıştırma ve değiştirme. |

Bu bağımlılıkları doğrudan kullanmanız gerekmez.

## İki giriş noktası

Paket **iki alt yol dışa aktarımı** sunar. Ortamınıza uygun olanı seçin.

### Ana giriş — `@powerduck/conf-patch`

**Dosya katmanını** (`readConfigFile`, `writeConfigFile`, `patchConfigFile`, `setConfigValue`, `deleteConfigValue`, `withFileLock`, `releaseAllLocalLocks`), çekirdeği ve OpenAPI doğrulamasını içerir. Node.js ve Electron’da kullanın. `node:fs`, `node:path` ve `node:crypto` bağımlılıkları vardır.

### Çekirdek alt yolu — `@powerduck/conf-patch/core`

**Yalnızca tarayıcıya uygun çekirdeği** dışa aktarır: `patchContent`, `setContentValue`, `deleteContentValue`, doğrulama yardımcıları ve çekirdek türleri. Node.js bağımlılığı yoktur; tarayıcılar, Edge Functions ve service worker’lar için paketlenebilir.

:::tip
Tarayıcı hedeflerken her zaman `@powerduck/conf-patch/core` üzerinden içe aktarın. Böylece dosya katmanı ve `node:fs` bağımlılığı pakete girmez.
:::

## Modül sistemi: CJS ve ESM

Paket `"type": "module"` **ayarlamaz**; bu nedenle `.js` dosyaları varsayılan olarak CommonJS kabul edilir. `package.json` içindeki `exports` haritası `import` ve `require` koşullarını açıkça doğru derlemeye yönlendirir.

| Giriş | CJS (`require`) | ESM (`import`) | Türler |
|---|---|---|---|
| Ana giriş | `dist/index.js` | `dist/index.mjs` | `dist/index.d.ts` |
| Çekirdek alt yolu | `dist/core.js` | `dist/core.mjs` | `dist/core.d.ts` |

### CommonJS (Node.js / Electron ana işlemi)

```javascript
// Full library (includes file IO)
const { setConfigValue, readConfigFile } = require("@powerduck/conf-patch");

// Core layer only (browser-safe, no fs dependency)
const { patchContent, setContentValue } = require("@powerduck/conf-patch/core");
```

### ES Modules (modern Node.js / tarayıcılar / paketleyiciler)

```typescript
// Full library
import { setConfigValue, readConfigFile } from "@powerduck/conf-patch";

// Core layer only (browser-safe)
import { patchContent, setContentValue } from "@powerduck/conf-patch/core";
```

## Kurulumu doğrulama

```bash
# Check the installed version
npm list @powerduck/conf-patch

# Verify the main entry loads
node -e "const lib = require('@powerduck/conf-patch'); console.log('exports:', Object.keys(lib).length);"

# Verify the core subpath loads
node -e "const core = require('@powerduck/conf-patch/core'); console.log('core exports:', Object.keys(core).length);"
```

## Sonraki adımlar

- [Hızlı başlangıç](/docs/tr-TR/conf-patch/quickstart/) — tarayıcıda bir dizeyi, diskte bir dosyayı değiştirin.
- [API başvurusu](/docs/tr-TR/conf-patch/api-reference/) — tüm dışa aktarımlar, türler ve seçenekler.
