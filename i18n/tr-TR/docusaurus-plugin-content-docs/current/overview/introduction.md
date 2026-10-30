---
sidebar_position: 1
title: Giriş
description: "Powerduck, tek bir OpenAPI YAML dosyasını temel alan, yapay zekâ destekli ve yerel çalışmaya öncelik veren bir API platformudur. Aynı dosyadan tasarım, hata ayıklama, test, mock, belgelendirme ve MCP araçları sunma işlemlerini masaüstünde, bulutta veya açık kaynak kütüphanelerle gerçekleştirin."
---

# Giriş

API geliştirme biçimi değişiyor. Yirmi yıl boyunca **işlemleri yapan**, grafik arayüzde tıklayan bir insandı; API sözleşmesini **kullanan** ise belgeleri okuyan bir insandı. Şimdi her iki taraf da dönüşüyor:

- İşlemleri giderek daha fazla, niyeti eyleme dönüştüren bir **yapay zekâ asistanı** gerçekleştiriyor;
- Sözleşmeyi kullanan ise giderek daha fazla, API'yi MCP üzerinden bir araç olarak çağıran bir **yapay zekâ ajanı** oluyor.

Önceki dönemin araçları — API istemcisi, spesifikasyon görüntüleyicisi ve istek koleksiyonu — klavye başındaki insan için tasarlanmıştı. Powerduck bu yeni dönem için geliştirildi. Yalnızca daha iyi bir API istemcisi veya daha şık bir spesifikasyon görüntüleyicisi değil; **tek bir OpenAPI dosyasıyla başlayan, yapay zekâyı merkezine alan bir platformdur**.

## Temel: tek bir yerel OpenAPI dosyası

Masaüstü dahil Powerduck kullanımı Google OAuth veya GitHub ile giriş gerektirir. Dosyalar diskte kalır. Yapay zekâ analizi seçilen bağlamı Powerduck tarafından yönetilen sağlayıcılara gönderir. Özel model adresleri ve API anahtarları artık desteklenmez.

```text
                one local openapi.yaml
                         |
      you + AI -> design debug test mock docs data-model
                         |
                      MCP tools
                         |
               any AI coding agent
```

Sözleşme bu dosyadır. Her iş akışı onu okur; aynı dosya MCP üzerinden herhangi bir yapay zekâ kodlama ajanına da sunulabilir. Böylece siz, yerleşik asistan ve tüm harici ajanlar tek bir doğruluk kaynağını paylaşırsınız. Tasarım, hata ayıklama, testler, mock'lar ve belgeler aynı dosyayı okuyunca araçları eşzamanlı tutmak ayrı bir iş olmaktan çıkar. Bu, tasarımın doğal sonucudur.

Powerduck OpenAPI 3.2 ile çalışır; mevcut 3.0 ve 3.1 belgelerini ve Swagger 2.0 belgelerini yerinde yükselterek okur. HTTP dışındaki API'ler — SSE, WebSocket, GraphQL, gRPC ve MCP — yalnızca REST'e uygun bir yapıya zorlanmak yerine `x-protocol` uzantısıyla normal yol öğeleri olarak modellenir.

## Yapay zekâyla çalışma

- Bir YAML dosyası açtığınızda asistan onunla neler yapabileceğinizi hemen önerir;
- İstediğiniz sonucu doğal dille belirtin: “sipariş uç noktalarını oluştur”, “test verilerini hazırla” veya “ödeme akışını çalıştır ve rapor ver”. Asistan doğru aracı seçer ve değişikliği önerir;
- Her değişiklik **inceleyebileceğiniz bir kart** olarak sunulur; siz onaylamadan uygulanmaz;
- Bir API'yi düzenlerken asistan o API'ye odaklanır ve belgenin başka yerlerine kaymadan yalnızca istediğiniz değişiklikleri yapar;
- Masaüstü dahil Powerduck kullanımı Google OAuth veya GitHub ile giriş gerektirir. Dosyalar diskte kalır. Yapay zekâ analizi seçilen bağlamı Powerduck tarafından yönetilen sağlayıcılara gönderir. Özel model adresleri ve API anahtarları artık desteklenmez.

## Varsayılan olarak yerel çalışma

Masaüstü dahil Powerduck kullanımı Google OAuth veya GitHub ile giriş gerektirir. Dosyalar diskte kalır. Yapay zekâ analizi seçilen bağlamı Powerduck tarafından yönetilen sağlayıcılara gönderir. Özel model adresleri ve API anahtarları artık desteklenmez.

## Powerduck'ı kullanmanın üç yolu

| Ürün | Açıklama | Kimler için uygun? |
|---|---|---|
| [Desktop](../client/introduction.md) | Google OAuth / GitHub | AI Chat · Code Quality · OpenAPI |
| [**Powerduck Cloud**](/docs/tr-TR/cloud/introduction/) | OAS barındırma, çevrimiçi belgeler ve yönetilen MCP hizmeti | API paylaşmak, kalıcı bağlantılar yayımlamak ve sunucu çalıştırmadan MCP sunmak isteyenler |
| [**Açık kaynak kütüphaneler**](/docs/tr-TR/opensource/) | Birlikte kullanılabilen `@powerduck/*` npm paketleri | Özel araçlar, CI işlem hatları veya gömülü bileşenler geliştirenler |

Üç ürün de aynı motorları kullanır. Masaüstü istemcisi ve bulut, açık kaynak kütüphanelerden oluşturulur. Bu nedenle bir özellik yerel olarak çalıştırıldığında, ağ üzerinden çağrıldığında veya doğrudan paket olarak içe aktarıldığında aynı biçimde davranır.

### Masaüstü İstemcisi

Masaüstü dahil Powerduck kullanımı Google OAuth veya GitHub ile giriş gerektirir. Dosyalar diskte kalır. Yapay zekâ analizi seçilen bağlamı Powerduck tarafından yönetilen sağlayıcılara gönderir. Özel model adresleri ve API anahtarları artık desteklenmez.

### Powerduck Cloud

[Powerduck Cloud](/docs/tr-TR/cloud/introduction/) aynı iş akışını çevrimiçi ortama taşır. Bir dosya, Git deposu veya URL ekleyin; sunmak istediğiniz işlemleri seçin; oluşturulan belgeler ve yönetilen MCP uç noktası için kalıcı bağlantılar alın. Erişim, görüntüleme parolası veya MCP erişim anahtarıyla korunabilir. Ücretli planlar Git eşitlemesi, özel alan adları ve daha yüksek limitler sunar.

### Açık kaynak kütüphaneler

[Kütüphaneler](/docs/tr-TR/opensource/), ürünün altında çalışan motorlardır: OpenAPI ayrıştırıcısı ve yükselticisi, çok protokollü CLI, kod oluşturucu, MCP sunucusu, istek çalıştırıcısı, cURL ve Postman dönüştürücüleri ve gömülebilen editörler. Her biri kendi kurulum kılavuzu ve API başvurusuyla npm'de bağımsız olarak yayımlanır. Ayrıntılı teknik açıklamalar bu bölümlerde yer alır.

## Sizin için ne değişiyor?

- **Tıklamaları değil, sonucu yönlendirirsiniz.** Hedefinizi anlatırsınız; asistan işi inceleyebileceğiniz adımlarla yürütür.
- **API'leriniz ajanlara hazır olur.** Belgeleri oluşturan sözleşme MCP araçlarını da üretir; böylece yapay zekâ ajanları API'nizi en baştan doğru çağırabilir.
- **Her şey uyumlu kalır.** Tasarım, hata ayıklama, testler, mock'lar ve belgeler tek dosyayı okur.
- **Tüm protokoller tek yerde bulunur.** HTTP, SSE, WebSocket, GraphQL, gRPC ve MCP, altı ayrı araç yerine tek bir spesifikasyonda yer alır.
- Masaüstü dahil Powerduck kullanımı Google OAuth veya GitHub ile giriş gerektirir. Dosyalar diskte kalır. Yapay zekâ analizi seçilen bağlamı Powerduck tarafından yönetilen sağlayıcılara gönderir. Özel model adresleri ve API anahtarları artık desteklenmez.

## Sonraki adımlar

- Yeni mi başlıyorsunuz? [Kurulum](/docs/tr-TR/overview/installation/) ve [Hızlı başlangıç](/docs/tr-TR/overview/quickstart/) sayfalarını okuyun.
- Eksiksiz yerel çalışma alanını mı istiyorsunuz? [Masaüstü İstemcisi kılavuzuna](/docs/tr-TR/client/introduction/) bakın.
- Bir API'yi çevrimiçi yayımlamak mı istiyorsunuz? [Cloud kılavuzunu](/docs/tr-TR/cloud/introduction/) okuyun.
- Kendi entegrasyonunuzu mu geliştiriyorsunuz? [Açık kaynak kütüphaneleri](/docs/tr-TR/opensource/) inceleyin.
