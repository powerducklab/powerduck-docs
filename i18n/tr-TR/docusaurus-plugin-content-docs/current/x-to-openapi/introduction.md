---
sidebar_position: 1
title: "@powerduck/x-to-openapi"
description: "@powerduck/x-to-openapi, curl komutlarını ve Postman koleksiyonlarını (v2.0 / v2.1.0) OpenAPI 3.2 belgelerine dönüştüren, genişletilebilir bir TypeScript çerçevesidir. CI işlem hatları, API belgesi oluşturma ve HTTP isteklerinden arayüzleri yeniden oluşturma için uygundur."
---

# @powerduck/x-to-openapi

**@powerduck/x-to-openapi**, **curl komutlarını** ve **Postman koleksiyonlarını (v2.0 / v2.1.0)** **OpenAPI 3.2** belgelerine dönüştüren, genişletilebilir bir TypeScript çerçevesidir. CI işlem hatları, API belgesi oluşturma ve HTTP isteklerinden arayüzleri yeniden oluşturma için uygundur.

Belge doğrulamasında [`@powerduck/openapi-parser`](https://www.npmjs.com/package/@powerduck/openapi-parser) kullanır.

- **Sürüm:** <img src="https://img.shields.io/npm/v/@powerduck/x-to-openapi"/>
- **Lisans:** MIT
- **Node.js gereksinimi:** `>= 22.12.0`
- **Çıktı:** yalnızca OpenAPI **3.2.0**
- **Kaynak kod:** [github.com/powerducklab/x-to-openapi](https://github.com/powerducklab/x-to-openapi)

---

## Nasıl çalışır?

```text
curl komutu → CurlAdapter
Postman koleksiyonu → PostmanAdapter
             ↓
     NormalizedRequest[]
             ↓
     buildOpenApi32() → OpenAPI 3.2 belgesi
             ↓
     validateOpenApi32() → tanılama
```

1. **Bağdaştırıcı**, curl metni veya Postman koleksiyonu gibi kaynakları ayrıştırarak [`NormalizedRequest`](./api-reference.md#normalizedrequest) nesnelerinden oluşan bir liste üretir.
2. **Oluşturucu**, istekleri yöntem ve yola göre birleştirir; şemaları, yol parametrelerini ve güvenlik tanımlarını çıkararak OpenAPI 3.2 belgesi oluşturur.
3. **Doğrulayıcı**, çıktıyı `@powerduck/openapi-parser` üzerinden OpenAPI şemasına göre denetler ve tanılama bilgileri döndürür.

---

## Özellikler

- **İki yerleşik bağdaştırıcı:** [`CurlAdapter`](./api-reference.md#curladapter), tek veya toplu komutları ve tarayıcının “Copy all as cURL” çıktısını destekler; [`PostmanAdapter`](./api-reference.md#postmanadapter), v2.0/v2.1.0, iç içe klasörler ve kimlik doğrulama mirasını destekler.
- **Yapılandırmasız yardımcılar:** [`curlToOpenApi`](./api-reference.md#curltoopenapi) ve [`postmanToOpenApi`](./api-reference.md), tek çağrıda bağdaştırıcıyı kaydeder ve dönüştürür.
- **OpenAPI 3.2 çıktısı:** her belge `openapi: "3.2.0"` bildirir. Doğrulama varsayılan olarak açıktır. Tanılamaları inceleyin veya hataları reddetmek için katı modu açın.
- **Çoklu istek birleştirme:** aynı yöntem ve yola sahip işlemler birleştirilir; sorgu, üstbilgi ve çerez parametreleri ile gövde şemaları yapısal olarak birleştirilir.
- **Yol parametresi çıkarımı:** sayısal kimlikler, UUID’ler, ULID’ler ve uzun onaltılık bölümler en az N örnekte değişiyorsa `/users/{userId}` gibi şablonlara dönüştürülür.
- **Güvenlik çıkarımı:** Bearer, Basic ve üstbilgi, sorgu veya çerezdeki API anahtarları algılanır; uygun `securitySchemes` oluşturulur.
- **Farklı gövde türleri:** JSON, XML, form-urlencoded, metin ve dosya içeren multipart/form-data, GraphQL, metin ve ikili veri.
- **Postman test betiklerini koruma:** `pm.test()` / `pm.expect()`, her işlemde `x-postman-scripts` olarak üretilir.
- **Tanılama:** her sorun önem derecesi, kod ve varsa kaynak ayrıntıları içerir; [`strict`](./api-reference.md#convertoptions) modu hatalarda istisna oluşturur.
- **Genişletilebilir:** HAR, HTTPie veya Insomnia kaynakları eklemek için [`SourceAdapter`](./api-reference.md) uygulayın.

---

## Eklenti mimarisi

Çerçeve, küçük bir bağdaştırıcı arayüzü üzerine kuruludur:

```typescript
interface SourceAdapter<I = unknown> {
  readonly id: string;                       // e.g. "curl", "postman", "har"
  canHandle?(input: unknown): boolean;       // used by "auto" detection
  parse(input: I, context: AdapterContext): Promise<NormalizedRequest[]>;
}
```

Bağdaştırıcılar, [`AdapterRegistry`](./api-reference.md#adapterregistry) aracılığıyla [`XToOpenApi`](./api-reference.md#xtoopenapi) örneğine kaydedilir:

```typescript
const converter = new XToOpenApi()
  .register(new CurlAdapter())
  .register(new PostmanAdapter());

// Explicit source id:
await converter.convert("curl", curlText);

// Auto-detect via canHandle():
await converter.convert("auto", someInput);
```

Yapılandırmasız yardımcılar iki yerleşik bağdaştırıcıyı zaten içerdiğinden, kayıt defterini doğrudan kullanmak genellikle gerekmez.

---

## Yardımcı işlev mi, sınıf mı?

| Kullanım durumu | API |
|---|---|
| Tek veya toplu curl komutlarını dönüştürme | [`curlToOpenApi`](./api-reference.md#curltoopenapi) |
| Postman koleksiyonunu nesne veya dize olarak dönüştürme | [`postmanToOpenApi`](./api-reference.md) |
| Özel seçenekler, birden fazla bağdaştırıcı, `"auto"` algılama veya özel bağdaştırıcı | [`new XToOpenApi()`](./api-reference.md#xtoopenapi) |

---

## Sonraki adımlar

- [Kurulum](./installation.md) — paketi ekleyin ve yapılandırmasız yardımcıları öğrenin.
- [Hızlı başlangıç](./quickstart.md) — curl komutlarını ve Postman koleksiyonlarını dönüştürün, özel bağdaştırıcı kullanın.
- [API başvurusu](./api-reference.md) — tüm dışa aktarımlar, türler, seçenekler, varsayılanlar ve tanılama kodları.
- [Örnekler](./examples.md) — curl, toplu komutlar, Postman koleksiyonları, özel bağdaştırıcılar ve yol çıkarımı.
