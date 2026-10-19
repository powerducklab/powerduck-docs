---
sidebar_position: 1
title: "@powerduck/conf-patch"
description: "@powerduck/conf-patch, açık bir iki katmanlı mimariye sahip yapılandırma düzenleme kitaplığıdır. JSON, JSONC ve YAML dizelerini RFC 6902 JSON Patch kurallarına göre değiştirirken yorumları ve biçimlendirmeyi korur; Node.js ve Electron için atomik yazma ve süreçler arası dosya kilitleme sağlar."
---

# @powerduck/conf-patch

**@powerduck/conf-patch**, açık bir **iki katmanlı mimariye** sahip yapılandırma düzenleme kitaplığıdır. JSON, JSONC ve YAML dizelerini [RFC 6902 JSON Patch](https://datatracker.ietf.org/doc/html/rfc6902) kurallarına göre değiştirirken yorumları ve biçimlendirmeyi korur; Node.js ve Electron için atomik yazma ve süreçler arası dosya kilitleme sağlar.

- **Sürüm:** <img src="https://img.shields.io/npm/v/@powerduck/conf-patch"/>
- **Lisans:** MIT
- **Node.js gereksinimi:** `>= 22.12.0`
- **Kaynak kod:** [github.com/powerducklab/conf-patch](https://github.com/powerducklab/conf-patch)

---

## Neden conf-patch?

Yapılandırma dosyalarını kodla düzenlerken genellikle yorumları ve biçimlendirmeyi değiştirebilen tam serileştirme ile hataya açık metin işlemleri arasında seçim yapmak gerekir. conf-patch şunları sunar:

- JSON/JSONC için `jsonc-parser` ile **yorumları koruyan artımlı düzenleme**, YAML için `yaml` ile AST değişiklikleri. JSON/JSONC bütünüyle yeniden serileştirilmez; YAML ise değiştirilmiş AST’yi yeniden serileştirir.
- Geçici dosya ve ardından yeniden adlandırma yoluyla **atomik yazma**; böylece hedef dosyanın kısmen yazılmış kalması önlenir.
- Sahiplik belirteçleri, üstel geri çekilme ve eski kilitleri kurtarma özellikleriyle **süreçler arası kilitleme**.
- **Farklı ortamlarda çalışan API:** çekirdek katman tarayıcılarda, Edge işlevlerinde ve IndexedDB kullanan uygulamalarda da çalışır.

---

## İki katmanlı mimari

```
┌──────────────────────────────────────────────────────────────┐
│                     Application code                          │
├──────────────────────────────────────────────────────────────┤
│  File layer (Node.js / Electron only)                         │
│  ┌───────────────┐ ┌────────────────┐ ┌──────────────────┐  │
│  │ readConfigFile │ │ writeConfigFile│ │ patchConfigFile   │  │
│  │ setConfigValue │ │ deleteConfig…  │ │ withFileLock     │  │
│  └──────┬────────┘ └───────┬────────┘ └────────┬─────────┘  │
│         │                  │                   │            │
│  ┌──────▼──────────────────▼───────────────────▼───────────┐ │
│  │           Core layer (browser-safe, zero Node deps)      │ │
│  │  patchContent   setContentValue   deleteContentValue     │ │
│  └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### Çekirdek katman — `@powerduck/conf-patch/core` (tarayıcı uyumlu)

**Dizeler** üzerinde çalışan saf işlevlerdir. `node:fs`, `node:path` veya Node.js’ye özgü başka API’lere bağımlı değildir. Bu alt yol tarayıcı, Edge işlevi veya service worker koduna dahil edilebilir.

| İşlev | Amaç |
|---|---|
| [`patchContent`](../api-reference/#patchcontent) | Yapılandırma dizesine RFC 6902 işlemleri uygulamak |
| [`setContentValue`](../api-reference/#setcontentvalue) | İç içe bir değeri ayarlamak veya oluşturmak (`add` ile) |
| [`deleteContentValue`](../api-reference/#deletecontentvalue) | Anahtar veya dizi öğesini silmek (`remove` ile) |

### Dosya katmanı — `@powerduck/conf-patch` (Node.js / Electron)

Gerçek dosyaları okuyan ve yazan, çekirdek katmana atomik yazma ve kilitleme ekleyen asenkron işlevlerdir.

| İşlev | Amaç |
|---|---|
| [`readConfigFile`](../api-reference/#readconfigfile) | Dosya yolundan veya `file://` URL’sinden UTF-8 metin okumak |
| [`writeConfigFile`](../api-reference/#writeconfigfile) | İçeriği isteğe bağlı kilitle atomik olarak yazmak |
| [`patchConfigFile`](../api-reference/#patchconfigfile) | Dosya kilidi içinde okuma-değiştirme-yazma işlemi yapmak |
| [`setConfigValue`](../api-reference/#setconfigvalue) | Dosyada iç içe bir değeri ayarlamak |
| [`deleteConfigValue`](../api-reference/#deleteconfigvalue) | Dosyadan iç içe bir değeri silmek |
| [`withFileLock`](../api-reference/#withfilelock) | Özel kilit altında görev çalıştırmak |
| [`releaseAllLocalLocks`](../api-reference/#releasealllocallocks) | Geçerli sürecin sahip olduğu tüm kilitleri bırakmak |

---

## Desteklenen biçimler

| Biçim | Uzantı | Davranış |
|---|---|---|
| **JSON** | `.json` | Standart JSON. `jsonc-parser` ile artımlı düzenleme. |
| **JSONC** | `.jsonc` | Yorumları ve sondaki virgülleri destekleyen JSON. Yorumlar korunur. |
| **YAML** | `.yaml`, `.yml` | YAML 1.2. AST değişiklikleri yorumları, çapaları ve girintiyi korur. |

[`detectFormat`](../api-reference/#detectformat), dosya uzantılarını bir [`ConfigFormat`](../api-reference/#configformat) ile eşleştirir. `format` açıkça belirtilmezse diğer uzantılar hata oluşturur.

---

## RFC 6902 işlemleri

conf-patch, RFC 6902’nin bir alt kümesini uygular. Yalnızca şu işlemler desteklenir:

| `op` | Davranış |
|---|---|
| `"add"` | Dizi indeksine ekler veya nesne özelliği ekler/değiştirir |
| `"replace"` | Var olan değeri değiştirir; yol mevcut olmalıdır |
| `"remove"` | Var olan anahtarı veya dizi öğesini siler; yol mevcut olmalıdır |

:::caution
`"move"`, `"copy"` ve `"test"` **desteklenmez**. [`JsonPatchOp`](../api-reference/#jsonpatchop) türü, `op` değerini `"add" | "replace" | "remove"` ile sınırlar.
:::

Davranış notları:

- Dizi indeksindeki `add`, öğe **ekler** (RFC 6902). Var olan öğeyi değiştirmek için `replace` kullanın.
- `add`, üst yolun önceden var olmasını gerektirir. Alt öğelerden önce üst öğeleri oluşturun.
- `replace` ve `remove`, hedef yolun var olmasını gerektirir.
- `strict: true` (varsayılan) kullanıldığında başarısız işlem istisna oluşturur. `strict: false` kullanıldığında işlem atlanır ve uyarı kaydedilir.

---

## Yorumları ve biçimlendirmeyi koruma

- **JSON/JSONC:** değişiklikler sözdizimi ağacına göre metin aralıkları olarak hesaplanır; çevredeki yorumlar, sondaki virgüller ve girintiler korunur.
- **YAML:** `yaml` AST’si yerinde değiştirilip yeniden serileştirilir; yorumlar, çapalar, takma adlar ve girintiler korunur.

---

## OpenAPI doğrulaması

conf-patch, OpenAPI/Swagger belgelerini `@powerduck/openapi-parser` için ek korumalar içeren bir arayüz üzerinden doğrular:

- [`validateOpenAPISpec`](../api-reference/#validateopenapispec), ham JSON veya YAML içeriğini doğrular.
- [`validateOpenAPIFile`](../api-reference/#validateopenapifile), belgeyi dosya yolundan doğrular.
- Girdi işleme; boyut sınırları, yol kısıtlamaları (`allowedRootDirectory`), yapısal karmaşıklık denetimleri, süre sınırları ve `AbortSignal` ile iptal uygular.
- Hatalar, programın işleyebileceği bir `code` içeren [`OpenApiValidationError`](../api-reference/#openapivalidationerror) oluşturur.

---

## Sonraki adımlar

- [Kurulum](../installation/) — conf-patch’i ekleyin ve iki giriş noktasını öğrenin.
- [Hızlı başlangıç](../quickstart/) — tarayıcıdaki bir dizeyi ve diskteki bir dosyayı değiştirin.
- [API başvurusu](../api-reference/) — tüm dışa aktarımlar, türler ve seçenekler.
- [Örnekler](../examples/) — JSON, YAML, JSONC, OpenAPI doğrulaması ve kilitleme için çalıştırılabilir örnekler.
