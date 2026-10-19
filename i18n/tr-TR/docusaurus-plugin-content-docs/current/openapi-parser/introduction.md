---
sidebar_position: 1
title: "Giriş"
description: "Herhangi bir Swagger 2.0, OpenAPI 3.0, 3.1 veya 3.2 belgesini tek bir çağrıyla OpenAPI 3.2’ye dönüştürün."
keywords: ["openapi-parser", "powerduck", "Swagger", "OpenAPI 3.2"]
---

# @powerduck/openapi-parser

Herhangi bir Swagger 2.0, OpenAPI 3.0, 3.1 veya 3.2 belgesini tek bir çağrıyla OpenAPI 3.2’ye dönüştürün.

Şu iki kitaplık üzerinde ince bir sarmalayıcıdır: [`@scalar/openapi-parser`](https://github.com/scalar/openapi-parser), [`@scalar/openapi-upgrader`](https://github.com/scalar/openapi-parser/tree/main/packages/openapi-upgrader).
Ayrıştırma, doğrulama veya dönüştürmeyi yeniden uygulamaz; bunları birbirine bağlar ve her hataya makine tarafından okunabilir bir hata koduyla tutarlı, öngörülebilir bir yapı kazandırır.

- **Paket adı:** `@powerduck/openapi-parser`
- **Sürüm:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-parser"/>
- **Lisans:** MIT
- **Node.js:** >= 22.12.0

## Özellikler

- **Tüm sürümler için tek işlev** — Swagger 2.0, OpenAPI 3.0.x, 3.1.x ve 3.2.x doğrulanmış bir 3.2 belgesine dönüştürülür.
- **JSON ve YAML dizesi girdisi** — Önceden ayrıştırılmış nesne veya ham JSON/YAML dizesi verin.
- **Makine tarafından okunabilir hata kodları** — Her hata, `UpgradeErrorCode` enum değeri içeren bir `OpenApiUpgradeError` olarak bildirilir.
- **Girdiyi değiştirmez** — Herhangi bir dönüştürme aşamasından önce girdi `structuredClone` ile derin kopyalanır.
- **Döngüsel başvuru koruması** — Girdideki döngüleri yığın taşmasına yol açmadan önce algılar.
- **Çıktı doğrulaması** — Dönüştürülen 3.2 belgesi varsayılan olarak şemaya göre doğrulanır.
- **ESM ve CJS** — Modern Node ve paketleyicilerde `import`, Electron ana sürecinde `require()` kullanın.

## Sonraki adımlar

- [Kurulum](/docs/tr-TR/openapi-parser/installation/) — kurulum ve gereksinimler
- [Hızlı başlangıç](/docs/tr-TR/openapi-parser/quickstart/) — ilk belgenizi dönüştürün
- [API başvuru kaynağı](/docs/tr-TR/openapi-parser/api-reference/) — tüm dışa aktarımlar, hata kodları ve seçenekler
- [Örnekler](/docs/tr-TR/openapi-parser/examples/) — hata işleme, seçenekler ve CommonJS kullanımı
