---
sidebar_position: 2
title: "Kurulum"
description: "@powerduck/x-to-openapi’yi npm, yarn veya pnpm ile kurun. ESM ve CommonJS desteği; ayar gerektirmeyen curlToOpenApi ve postmanToOpenApi işlevleri."
---

# Kurulum

`@powerduck/x-to-openapi` paketini tercih ettiğiniz paket yöneticisiyle kurun.

## Gereksinimler

- **Node.js:** `>= 22.12.0`
- **TypeScript:** isteğe bağlıdır; tüm tür tanımları pakete dahildir.

## Kurulum

```bash npm2yarn2pnpm
npm install @powerduck/x-to-openapi
```

```bash
yarn add @powerduck/x-to-openapi
```

```bash
pnpm add @powerduck/x-to-openapi
```

## Çalışma zamanı bağımlılıkları

| Paket | Sürüm | Kullanım |
|---|---|---|
| `@powerduck/openapi-parser` | `^0.3.12` | Standart OpenAPI türleri ve çıktı doğrulaması |
| `curlconverter` | `^4.12.0` | curl komutlarını yapılandırılmış isteklere ayrıştırma |

Her iki bağımlılık otomatik kurulur.

---

## Modül sistemi: ESM öncelikli, CJS destekli

Paket `"type": "module"` bildirir ve tek bir giriş noktasından iki derlemeyi de sunar:

| Derleme | Koşul | Dosya |
|---|---|---|
| ESM | `import` | `./dist/index.js` |
| CommonJS | `require` | `./dist/index.cjs` |
| Türler | — | `./dist/index.d.ts` |

```typescript
// ESM (Node.js, bundlers)
import { curlToOpenApi, postmanToOpenApi } from "@powerduck/x-to-openapi";
```

```javascript
// CommonJS (require)
const { curlToOpenApi, postmanToOpenApi } = require("@powerduck/x-to-openapi");
```

Paket `"sideEffects": false` bildirir; böylece tree shaking kullanılmayan bağdaştırıcıları kaldırır.

---

## Ayar gerektirmeyen yardımcı işlevler

Çoğu kullanıcıya iki işlev yeter. Bu işlevler bir [`XToOpenApi`](/docs/tr-TR/x-to-openapi/api-reference/#xtoopenapi) örneği oluşturur, uygun bağdaştırıcıyı kaydeder ve `convert` çağırır:

```typescript
import {
  curlToOpenApi,    // string | string[]  → OpenAPI 3.2
  postmanToOpenApi, // collection object | JSON string → OpenAPI 3.2
} from "@powerduck/x-to-openapi";
```

Özel seçenekler, birden fazla bağdaştırıcı, `"auto"` algılama veya özel bağdaştırıcı gerektiğinde tam [`XToOpenApi`](/docs/tr-TR/x-to-openapi/api-reference/#xtoopenapi) sınıfını kullanın.

---

## Doğrulama

```bash
# Check the installed version
npm list @powerduck/x-to-openapi

# Verify the package loads and the helpers exist
node -e "const x = require('@powerduck/x-to-openapi'); console.log(typeof x.curlToOpenApi, typeof x.postmanToOpenApi, typeof x.XToOpenApi);"
```

---

## Sonraki adımlar

- [Hızlı başlangıç](/docs/tr-TR/x-to-openapi/quickstart/) — bir curl komutunu ve Postman koleksiyonunu dönüştürün, özel bağdaştırıcı kaydedin.
- [API başvurusu](/docs/tr-TR/x-to-openapi/api-reference/) — tüm dışa aktarımlar ve seçenekler.
