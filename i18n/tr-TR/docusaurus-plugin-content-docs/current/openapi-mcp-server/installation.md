---
sidebar_position: 2
title: "Kurulum"
description: "@powerduck/openapi-mcp-server’ı npm, yarn, pnpm ile veya genel olarak kurun. openapi-mcp CLI, ./server alt yolu ve bağımlılıkları hakkında bilgi edinin. Node.js 22.12.0 veya üzeri gerekir."
---

# Kurulum

## Gereksinimler

- **Node.js `>=22.12.0`** (`engines` içinde belirtilir).

## Kurulum

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

Paket `openapi-mcp` programını kaydeder.

```bash
# global install
npm install -g @powerduck/openapi-mcp-server

# or run without installing
npx --package @powerduck/openapi-mcp-server openapi-mcp --help
```

CLI’ın tek komutu `serve`’dür (bkz. [Hızlı başlangıç](/docs/tr-TR/openapi-mcp-server/quickstart/)).

## ESM / CommonJS

Her iki derleme biçimi de tür bildirimlerini içerir. Ek `@types/*` gerekmez:

```javascript
// ESM
import { buildMcpServer, startStdioServer } from "@powerduck/openapi-mcp-server";

// CommonJS
const { buildMcpServer, startStdioServer } = require("@powerduck/openapi-mcp-server");
```

## Alt yol dışa aktarımı

| İçe aktarma | İçerik |
| --- | --- |
| `@powerduck/openapi-mcp-server` | Çekirdek kitaplık: belirtim yükleme, araç/prompt/kaynak üretimi, istek yürütme, MCP sunucusu oluşturma, stdio ve HTTP aktarımları. |
| `@powerduck/openapi-mcp-server/server` | Yönetim HTTP sunucusu ve kimlik doğrulama ara katmanı (`startAdminServer`, `createAuthMiddleware`). |

## Çalışma zamanı bağımlılıkları

Bu bağımlılıklar paketle birlikte otomatik kurulur:

- `@modelcontextprotocol/sdk` — MCP protokolü uygulaması.
- `@powerduck/openapi-parser` — OpenAPI doğrulaması, başvuru çözümleme ve sürüm yükseltme.
- `express` ve `cors` — yönetim HTTP sunucusu ve CORS.
- `axios` — araç yürütme sırasında hedef hizmete bağlanan HTTP istemcisi.
- `commander` — CLI çatısı.
- `js-yaml` — YAML ayrıştırma.
- `multer` — belirtim yüklemelerinin işlenmesi.
- `terser` — gömülü web arayüzü varlıklarının küçültülmesi.

## Doğrulama

```bash
npx --package @powerduck/openapi-mcp-server openapi-mcp --help
```

## Sonraki adımlar

- [Hızlı başlangıç](/docs/tr-TR/openapi-mcp-server/quickstart/)
- [Yapılandırma](/docs/tr-TR/openapi-mcp-server/configuration/)
