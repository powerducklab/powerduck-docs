---
sidebar_position: 7
title: "Faturalandırma ve lisanslama"
description: "Powerduck, **iki farklı ödeme modeline sahip iki ayrı ürün** sunar. Faturalandırmayı anlamak için bu iki ürünü birbirinden ayırmak önemlidir."
---

# Faturalandırma ve lisanslama

Powerduck, **iki farklı ödeme modeline sahip iki ayrı ürün** sunar. Faturalandırmayı anlamak için bu iki ürünü birbirinden ayırmak önemlidir.

| | Masaüstü istemcisi | Powerduck Cloud |
|---|---|---|
| Satın alınan ürün | Masaüstü uygulaması | Barındırılan hizmet |
| Model | Tek seferlik satın alma | Ücretsiz plan veya ücretli abonelik |
| Geçerlilik | Süresiz: lisans kalıcı olarak sizindir | Ücretsiz erişim veya ödenen fatura dönemi |
| Sağlanan hak | Bir kez gösterilen **lisans anahtarı** | Plan kapsamındaki haklar, **anahtar yok** |
| Çevrimdışı çalışma | Evet | Hayır: barındırılan bir hizmettir |

Cloud satın alımı hiçbir zaman lisans anahtarı oluşturmaz; masaüstü satın alımı da abonelik değildir.

## Süresiz masaüstü lisansı

Masaüstü istemcisi bir kez satın alınır ve yenileme veya fatura dönemi olmadan süresiz olarak kullanılabilir. Satın alma sırasında bir lisans anahtarı oluşturulur:

- Anahtarlar artan bir kimlik veya zaman damgasından değil, kriptografik olarak güvenli rastgele baytlardan `PDC-XXXX-XXXX-…` biçiminde oluşturulur;
- Anahtarın kendisi **bir kez** gösterilir;
- Veritabanında yalnızca anahtarın **SHA-256 özeti** ve son dört karakteri tutulur; bu nedenle asıl anahtar veritabanından geri alınamaz.

### Lisans durumu

Bir lisans dört durumda bulunabilir:

| Durum | Anlamı |
|---|---|
| `ISSUED` | Oluşturuldu, henüz etkinleştirilmedi |
| `ACTIVE` | Etkinleştirildi ve kullanılabilir |
| `SUSPENDED` | Geçici olarak kullanılamaz; yeniden etkinleştirilebilir |
| `REVOKED` | Kalıcı olarak iptal edildi; yeniden etkinleştirilemez |

“Süresiz”, belirli bir tarihte sona ermediği anlamına gelir; lisansın hiçbir zaman askıya alınamayacağı veya iptal edilemeyeceği anlamına gelmez.

### Etkinleştirme ve denetim

Etkinleştirme işlemi anahtar biçimini doğrular, özetini hesaplayıp arar, durumunu kontrol eder ve lisansı bir veritabanı işlemi içinde bağlar. Anahtarları sistematik olarak tahmin etme girişimlerini zorlaştırmak için etkinleştirme uç noktasındaki istek sıklığı sınırlandırılır.

Her durum değişikliği lisans olayı olarak kaydedilir: oluşturma, etkinleştirme, askıya alma, yeniden etkinleştirme veya iptal. Böylece tüm yaşam döngüsü denetlenebilir.

## Cloud planları ve abonelikleri

Cloud, lisans anahtarı gerektirmeyen bir **Free planı** ve ücretli abonelikler sunar. Aşağıdaki yıllık fiyatlar aylık karşılıklardır; ödeme yıllık alınır:

| Plan | Aylık ödeme | Yıllık ödeme |
|---|---|---|
| Free | $0 | $0 |
| Pro | 19 ABD doları/ay | 15 ABD doları/ay |
| Team | 49 ABD doları/ay | 39 ABD doları/ay |

Durumu `ACTIVE` olan ve geçerli dönemi devam eden abonelik, planın özelliklerini sağlar. Yenileme sırasındaki gecikmeler için üç günlük kısa bir ek süre tanınır; bu süre dışında Free planının hakları uygulanır. Cloud özellikleri belirlenirken masaüstü lisanslarına bakılmaz.

### Planlar neleri belirler?

Planlar, adları kodun her yerine sabit yazılarak uygulanmaz. Her planın **kullanım hakları** vardır: açık/kapalı özellikler ve sayısal kotalar, tek bir hak denetimi hizmeti üzerinden kontrol edilir:

| Özellik | Free | Pro | Team |
|---|---|---|---|
| OAS barındırma | Evet | Evet | Evet |
| Git kaynağı | Hayır | Evet | Evet |
| Belgeler | Evet | Evet | Evet |
| MCP | Evet | Evet | Evet |
| Özel alan adı | Hayır | Evet | Evet |
| En fazla belge | 3 | 100 | 1,000 |
| En fazla sürüm | 20 | 200 | 1,000 |
| En büyük dosya boyutu | 1 MiB | 10 MiB | 50 MiB |
| En fazla sunulan işlem | 10 | 1,000 | 10,000 |
| En fazla üye | 1 | 1 | 10 |

## Ödeme sağlayıcıları

Ödeme, müşterilerin alışık olduğu sağlayıcıyı görebilmesi için bölgeye göre yönlendirilir. İki sağlayıcı **hiçbir zaman aynı anda gösterilmez**:

- **Antom**: Çin ana karası, Hong Kong, Makao, Tayvan ve Güneydoğu Asya;
- **Paddle**: ABD, Kanada, Avrupa, Japonya, Kore, Avustralya, Yeni Zelanda ve Birleşik Krallık.

Ülke, istemcinin saat diliminden veya `Accept-Language` başlığından tahmin edilir; harici GeoIP veritabanı gerekmez. Bölge belirlenemezse **Antom kullanılır**. Sağlayıcı yapılandırmadan da zorunlu olarak seçilebilir; böylece bir sorun yaşandığında işletim ekibi yedek kanala hemen geçebilir.

Ödemeler, tarayıcının dönüş sayfasına güvenmek yerine sağlayıcıların imzalı webhook bildirimleriyle doğrulanır. Paddle ve Antom için ayrı uç noktalar kullanılır.

## Hangisini seçmeliyim?

- Tam yerel çalışma alanı, çevrimdışı kullanım ve kalıcı lisans mı istiyorsunuz? **Masaüstü lisansını** bir kez satın alın.
- Belgeleri ve MCP'yi çevrimiçi yayımlayıp kalıcı bağlantılar paylaşmak mı istiyorsunuz? **Cloud Free** ile başlayın. Daha yüksek kotalar, Git kaynakları ve özel alan adları için **Pro**, birden fazla üye için **Team** seçin.
- Birçok ekip ikisini birlikte kullanır: istemcide yerel olarak tasarım ve test yapar, ardından yayımlanan API'yi Cloud'da barındırır.

İlgili sayfalar: [Cloud'a giriş](./introduction.md), [Masaüstü istemcisi](../client/introduction.md).
