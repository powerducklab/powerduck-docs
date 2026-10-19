---
sidebar_position: 2
title: "Kurulum"
description: "@powerduck/openapi-cli’yi genel olarak veya geliştirme bağımlılığı olarak kurun ya da npx ile çalıştırın. Node.js 22.12.0 veya daha yeni bir sürüm gerekir."
---

# Kurulum

## Gereksinimler

- **Node.js**: `>= 22.12.0` (paketin `engines` alanında belirtilir).
- Bir paket yöneticisi: npm, yarn veya pnpm.

Paket, ESM (`dist/index.js`) ve CommonJS (`dist/index.cjs`) derlemelerinin yanı sıra TypeScript bildirimlerini (`dist/index.d.ts`) içerir. Ek `@types` paketleri gerekmez.

## Genel kurulum (CLI için önerilir)

Genel kurulum, `openapi-cli` programını `PATH` üzerinden erişilebilir kılar:

```bash npm2yarn2pnpm
npm install -g @powerduck/openapi-cli
```

Programı doğrulayın:

```bash
openapi-cli --help
```

## Proje içine kurulum (CI için önerilir)

CI’ın bilinen bir sürümü kullanması için proje içindeki sürümü sabitleyin:

```bash npm2yarn2pnpm
npm install --save-dev @powerduck/openapi-cli
```

Ardından komutu paket yöneticisi aracılığıyla çalıştırın:

```bash
npx openapi-cli --spec openapi.json
# or
pnpm exec openapi-cli --spec openapi.json
```

## npx ile tek seferlik çalıştırma

Önceden kurulum gerekmez:

```bash
npx @powerduck/openapi-cli --spec openapi.json
```

## Paket yapısı

| Giriş | Yol |
|-------|------|
| ESM girişi | `dist/index.js` |
| CommonJS girişi | `dist/index.cjs` |
| Tür tanımları | `dist/index.d.ts` |
| CLI girişi (bin) | `dist/cli.js` |
| Program adı | `openapi-cli` |

Paket `"type": "module"` bildirir ve yalnızca `.` ile `./package.json` alt yollarını dışa açar.

## Kod içinde içe aktarma

```typescript
// ESM
import { runTests, resolveConfig } from "@powerduck/openapi-cli";

// CommonJS
const { runTests, resolveConfig } = require("@powerduck/openapi-cli");
```

## Çalışma zamanı bağımlılıkları

Yayımlanan paket şunlara bağımlıdır:

- `@powerduck/openapi-parser` (`^0.3.12`) — dahili `$ref` başvurularının çözümlenmesi.
- `@powerduck/openapi-request` (`0.2.22`) — protokol isteklerinin yürütülmesi.
- `commander` (`^12.1.0`) — CLI bağımsız değişkenlerinin ayrıştırılması.
- `https-proxy-agent` (`^5.0.1`) — HTTP aktarımı için proxy desteği.

## Sonraki adımlar

- [Hızlı başlangıç](/docs/tr-TR/openapi-cli/quickstart/) — ilk test paketinizi çalıştırın.
- [Komutlar](/docs/tr-TR/openapi-cli/commands/) — tüm seçeneklerin başvuru kaynağı.
