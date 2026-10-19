---
sidebar_position: 1
title: "Giriş"
description: "OpenAPI’yi MCP hizmetlerine dönüştürün: araçlar, istemler, kaynaklar, web yönetimi, stdio, HTTP ve openapi-mcp CLI."
keywords: ["openapi-mcp-server", "MCP", "OpenAPI", "stdio", "HTTP"]
---

# @powerduck/openapi-mcp-server — Giriş

`@powerduck/openapi-mcp-server`, OpenAPI belgesini çalışan bir MCP (Model Context Protocol) hizmetine dönüştürür. İşlemlerden **araçlar**, API meta verileri ve işlemlerinden **istemler**, API kataloğundan **kaynaklar** üretir. Bunları MCP protokolüyle sunar ve yerleşik bir web yönetim arayüzü içerir.

- **Paket adı:** `@powerduck/openapi-mcp-server`
- **Sürüm:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-mcp-server"/>
- **Lisans:** MIT
- **Node gereksinimi:** `>=22.12.0`
- **CLI programı:** `openapi-mcp`
- **Modül biçimi:** Tür bildirimleri içeren ESM ve CommonJS derlemeleri.

Doğrulama ve başvuruları çözümleme için `@powerduck/openapi-parser`, protokol için `@modelcontextprotocol/sdk` kullanılır.

## Üretilen içerik

- **Tools** — Her OpenAPI işlemi için bir MCP aracı: tam parametre serileştirmesi (path/query/header/cookie stilleri ve explode kuralları), istek gövdesi kodlaması (JSON, form-urlencoded, multipart, metin, ikili veri) ve MCP araç açıklamaları (`readOnlyHint`, `destructiveHint`, `idempotentHint`).
- **Prompts** — Genel istemler (`spec_overview`, `integration_guardrails`) ve işlem başına istemler (`explain_*`, `plan_*`, `sample_*`).
- **Resources** — `openapi://spec/summary`, `openapi://catalog/tools` ve `openapi://spec/document` gibi sabit katalog kaynakları.

## Aktarım yöntemleri

- **stdio** — `startStdioServer()`, Claude Desktop veya düzenleyici entegrasyonu gibi yerel bir MCP istemcisine tek bir belge sunar.
- **HTTP** — `attachMcpRoutes(app, options)`, Express uygulamanızda Streamable HTTP’yi `/mcp` yoluna ve isteğe bağlı eski SSE aktarımını `/sse` yoluna bağlar. Seçenekler oturum sınırlarını, boşta kalma zaman aşımlarını, CORS’u ve DNS rebinding korumasını denetler. `startAdminServer()` yönetim arayüzünü ekler ve varsayılan oturum sınırlarını kullanır. `attachSseRoutes()`, konumsal argüman alan kullanımdan kaldırılmış bir sarmalayıcı olarak korunur.

## Yönetim sunucusu

`startAdminServer()` şu işlevleri sunan bir Express uygulaması başlatır:

- belirtim yükleme veya yapıştırma, araçları, istemleri ve kaynakları inceleme, çalışan hizmetleri ve istek günlüklerini görüntüleme için web yönetim konsolu;
- MCP HTTP aktarım yöntemleri;
- API anahtarıyla kimlik doğrulama, hassas üst bilgileri maskeleyen istek günlükleri ve isteğe bağlı kalıcı durum saklama.

## Kurulum

```bash npm2yarn2pnpm
npm install @powerduck/openapi-mcp-server
```

## Hızlı başlangıç

```bash
openapi-mcp serve --transport web --port 3000 --api-key your-admin-key
```

## Sonraki adımlar

- [Kurulum](../installation/) — npm/yarn/pnpm, genel kurulum, `./server` alt yolu ve bağımlılıklar.
- [Hızlı başlangıç](../quickstart/) — CLI ve kod üzerinden kullanım.
- [Yapılandırma](../configuration/) — `ServerConfig` için tam açıklama.
- [API başvurusu](../api-reference/) — Tüm dışa aktarımlar ve CLI komutları.
- [Örnekler](../examples/) — Uygulamalı örnekler.

## Lisans

MIT.
