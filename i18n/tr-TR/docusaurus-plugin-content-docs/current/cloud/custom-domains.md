---
sidebar_position: 6
title: Özel alan adları
description: "Bir ana makine adını veya yol içeren ana makine adını belgeye bağlayın. DNS TXT ile sahipliği doğrulayın, dokümantasyon ve MCP’yi kendi alan adınızdan sunun."
---

# Özel alan adları

Belgeler varsayılan olarak Powerduck’ın ortak adreslerinden sunulur. Özel alan adı, dokümantasyon ve MCP’nin **kendi ana makine adınız** altında görünmesini sağlar. Böylece API’nizi ortak bir bağlantı yerine kendi markanızla yayımlayabilirsiniz.

Özel alan adları **Pro ve Team** planlarında sunulan ücretli bir özelliktir; erişim `oas.custom_domain` yetkisiyle kontrol edilir.

## Ana makinenin tamamını veya alt yolu bağlama

Bağlama şu hedeflerden birine yapılabilir:

- **Ana makinenin tamamı** — `api.example.com`, kök yolda tek bir belge sunar;
- **Ana makine ve alt yol** — `example.com/v1`, belgeyi `/v1` altında sunar.

Alt yol bağlamaları, tek bir ana makine adının birden fazla belge sunmasını sağlar:

```text
example.com/v1  -> document A
example.com/v2  -> document B
```

Bu sayede her belge için ayrı ana makine gerekmez ve sürümlendirilmiş temel yollar kullanılabilir.

## Özel alan adındaki adresler

Ortak adreste sunulan arayüzler, bağlanan alan adında da kısa ve sabit yollarla sunulur:

| Arayüz | Ana makinenin tamamı | Alt yol |
|---|---|---|
| Güncel belirtim | `/oas` | `/v1/oas` |
| Belirli sürüme sabitlenmiş belirtim | `/v/:version/oas` | `/v1/v/:version/oas` |
| MCP | `/mcp` | `/v1/mcp` |

İsteğin ana makine adı ve yolu kullanılarak bağlı belge belirlenir. Bu yolların her biri için CORS ön kontrol istekleri işlenir.

## Alan adı ekleme ve doğrulama

Sahiplik doğrulanana kadar alan adına güvenilmez:

1. Ana makine adını, gerekiyorsa yoluyla birlikte belgeye **ekleyin**;
2. hizmet, bağlamayı ve **DNS yönergelerini** döndürür;
3. DNS kaydını oluşturup **doğrulayın**;
4. bağlama beklemede durumundan doğrulanmış durumuna geçer ve içerik sunmaya başlar.

Sahiplik denetimi bir **TXT kaydı** kullanır:

| Alan | Değer |
|---|---|
| Kayıt türü | `TXT` |
| Ana makine | `_powerduck-challenge.<your-domain>` |
| Değer | `powerduck-verify=<verification-token>` |

Doğrulama, TXT kaydını DNS üzerinden okur ve belirteci sabit zamanlı karşılaştırmayla denetler. Doğrulanmış bir bağlama, yeniden denetlenmeden doğrulanmış olarak kalır.

### Örnek

`api.example.com` için şu TXT kaydını ekleyin:

```text
_powerduck-challenge.api.example.com
TXT "powerduck-verify=<the-token-shown-for-the-binding>"
```

Ardından belgenin çalışma alanında **Doğrula** seçeneğini kullanın. Doğrulama başarılı olduğunda, belge etkinse ve ilgili arayüzler açıksa dokümantasyon ve MCP alan adından sunulur.

## Bağlamaları yönetme

- Belgeye bağlı alan adlarını, durumlarını ve temel yollarını **listeleyin**;
- DNS kaydını ekledikten sonra bekleyen bağlamayı **doğrulayın**;
- belgenin o alan adından sunulmasını durdurmak için bağlamayı **silin**.

Erişim ayarlarındaki değişiklikler ana makine çözümleme önbelleğini geçersiz kılar; eski bağlamaların kullanılmaya devam etmesi önlenir.

## Erişim denetimi geçerliliğini korur

Özel alan adı ek bir adrestir; kontrolleri atlatmaz:

- belge `ACTIVE` olmalıdır;
- dokümantasyon ve MCP’nin ayrı etkinlik ayarları vardır;
- görüntüleme parolası dokümantasyonu, MCP erişim anahtarı MCP’yi korumaya devam eder.

[Erişim denetimi](/docs/tr-TR/cloud/access-control/) bölümüne bakın.

İlgili bölümler: [Belgeler ve sürümler](/docs/tr-TR/cloud/documents-versions/), [Faturalandırma](/docs/tr-TR/cloud/billing/).
