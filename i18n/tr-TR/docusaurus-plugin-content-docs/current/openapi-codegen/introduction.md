---
sidebar_position: 1
title: "Giriş"
description: "@powerduck/openapi-codegen ile OpenAPI'den çalıştırılabilir HTTP örnekleri üretin: 21 dil, 41 istemci, tarayıcı uyumu ve sıfır çalışma zamanı bağımlılığı."
---

# Giriş

`@powerduck/openapi-codegen`, bir OpenAPI işlemini seçtiğiniz dil ve HTTP istemcisiyle **çalıştırılabilir HTTP isteği örnek koduna** dönüştüren TypeScript kütüphanesidir. API dokümantasyon siteleri, geliştirici portalları, API gezginleri, CLI araçları ve derleme sırasında kod üretimi için tasarlanmıştır.

**21 dil** ve **41 dil/istemci birleşimi** destekler, **tarayıcıyla uyumludur** ve **çalışma zamanı bağımlılığı yoktur**.

## Neden openapi-codegen

- **Çalışma zamanı bağımlılığı yok** — Node yerleşik modüllerine gerek duymadan tarayıcı, Node.js, Electron ve edge ortamlarında çalışır.
- **İki modül biçimi** — yerel ESM ve CommonJS (`require()`) derlemeleri.
- **OpenAPI 3.0 / 3.1 / 3.2** — ayrıştırılmış belge nesnesini işler. `generate()` çağrısından önce ayrıştırılarak JSON ve YAML kullanılabilir.
- **41 yerleşik üretici** — 21 dili kapsar; içe aktarma sırasında otomatik kaydedilir.
- **Tam parametre serileştirmesi** — yol, sorgu, başlık ve çerez parametrelerinde OpenAPI `style` / `explode` / `allowReserved` kuralları.
- **Güvenlik şemaları** — header/query/cookie içinde API anahtarı, HTTP bearer ve HTTP basic.
- **Gövde türleri** — JSON, düz metin, URL kodlu form ve `multipart/form-data`.
- **`$ref` çözümleme** — önbellek, zincirleme ve döngü algılamayla belge içi JSON Pointer başvuruları.
- **Otomatik örnekler** — JSON Schema'dan değer çıkarımı: `example`, `enum`, `default`, türler, biçimler ve kısıtlamalar.
- **Eklenti sistemi** — `register()` veya `use()` ile özel üreticiler kaydedin.

## Nasıl çalışır

```
OpenAPI document  ──normalize──▶  RequestIR  ──generator.generate()──▶  source code string
```

1. `normalize`, `$ref` başvurularını çözer, yol ve işlem düzeyindeki parametreleri birleştirir, gövde medya türünü seçer, örnek değerler üretir, güvenlik şemalarını çözer ve normalleştirilmiş bir `RequestIR` oluşturur.
2. Seçilen `Generator`, `RequestIR` alır ve çalıştırılabilir kaynak kodu dizesi döndürür.

Genellikle iki adımı da yapan `generate({...})` çağrısı yeterlidir.

## Temel örnek

```typescript
import { generate } from "@powerduck/openapi-codegen";

const code = generate({
  document,                 // parsed OpenAPI object
  path: "/users/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
});

console.log(code);          // a runnable fetch() snippet
```

## Sonraki adımlar

- [Kurulum](/docs/tr-TR/openapi-codegen/installation/) — npm / yarn / pnpm ve tarayıcıda kullanım.
- [Hızlı başlangıç](/docs/tr-TR/openapi-codegen/quickstart/) — İlk kod parçasını üretme ve üreticileri listeleme.
- [Yapılandırma](/docs/tr-TR/openapi-codegen/configuration/) — `GenerateOptions`, `RequestIR`, `Generator`, `Plugin`.
- [API başvurusu](/docs/tr-TR/openapi-codegen/api-reference/) — Tüm dışa aktarımlar ve eksiksiz dil/istemci listesi.
- [Örnekler](/docs/tr-TR/openapi-codegen/examples/) — fetch, Python requests, cURL, özel üreticiler, eklentiler ve doğrudan `RequestIR`.
