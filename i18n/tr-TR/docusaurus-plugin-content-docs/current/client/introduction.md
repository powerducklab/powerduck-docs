---
sidebar_position: 1
title: "Masaüstü istemcisi"
description: "Masaüstü istemcisi, yapay zekâ merkezli iş akışını kendi bilgisayarınıza taşır. Depodan bir openapi.yaml açar, ne istediğinizi anlatır ve sonucu incelersiniz. Belirtim düzenleyicisi, HTTP istemcisi, mock aracı, belge üreticisi ve test çalıştırıcısı arasında geçiş yapmanız veya başlamak için bulut hesabı açmanız gerekmez."
---

# Masaüstü istemcisi

Masaüstü istemcisi, yapay zekâ merkezli iş akışını kendi bilgisayarınıza taşır. Depodan bir `openapi.yaml` açar, ne istediğinizi anlatır ve sonucu incelersiniz. Belirtim düzenleyicisi, HTTP istemcisi, mock aracı, belge üreticisi ve test çalıştırıcısı arasında geçiş yapmanız veya başlamak için bulut hesabı açmanız gerekmez.

Kontrol sizdedir: asistan önerir, siz onaylarsınız.

## Çalışma alanında bir gün

İstemci şu işler etrafında tasarlanmıştır.

- **Belirtimi açıp genel durumu anlama.** Asistan geçerli belgeyi okur ve doldurulacak eksikleri, tamamlanacak belgeleri veya test edilecek akışları önerir.
- **API oluşturma.** Kaynağı anlatın, asistan uç noktaları önersin. Parametre eklemek, yanıtı netleştirmek veya durum kodunu değiştirmek gibi düzenlemelerle aynı işlemi geliştirin; belgenin ilgisiz bölümlerine geçilmez.
- **Test verisi hazırlama.** Şemalardan gerçekçi örnek satırlar üretin; istekler ve senaryolar somut değerlerle çalışsın.
- **İstek veya tüm senaryoyu çalıştırma.** Tek çağrıda hata ayıklayın ya da birkaç uç noktayı uçtan uca akışa bağlayıp başarıları ve hataları gösteren paylaşılabilir rapor alın.
- **Backend hazır olmadan ilerleme.** Gerçek servis geliştirilirken sözleşmeye göre yanıt veren yerel bir mock başlatın.
- **API'yi kodlama ajanlarına sunma.** Belirtimi MCP sunucusuna dönüştürün; yapay zekâ araçları doğru işlemleri uygun argümanlarla keşfedip çağırsın.
- **API'nin arkasındaki veritabanını görme.** Belirtimden tablolar, ilişkiler ve SQL türetin; bunları gerçek veritabanıyla karşılaştırıp nelerin değişeceğini görün.
- **Sohbetten çıkmadan ayar değiştirme.** Tema veya dil değiştirmeyi, proxy ayarlamayı ya da ortam değişkenlerini yönetmeyi isteyin.

## Görünümler ve kullanım amaçları

Tek belge tüm görünümleri besler; kompakt bir seçiciyle aralarında geçiş yapılır.

| Görünüm | Kullanım amacı |
|---|---|
| [**Belirtim**](./design.md) | Ana görünüm: yapay zekâ sohbeti, belge ve canlı önizleme |
| [**İstek çalışma alanı**](./debug.md) | Sekmeler ve ortamlarla gerçek HTTP istekleri gönderme ve inceleme |
| [**Senaryo testleri**](./scenario-testing.md) | Uç noktaları akışlara bağlama, çalıştırma ve rapor alma |
| [**Dokümantasyon**](./protocols.md) | Belirtimi işlenmiş API dokümantasyonu olarak okuma |
| [**MCP**](./protocols.md) | Belirtimden türetilen MCP sunucusunu inceleme ve kullanma |
| [**Mock sunucusu**](./mock-server.md) | API geliştirilirken yerel mock çalıştırma |
| [**Veri modeli**](./data-model.md) | Tablo ve ilişki türetme, veritabanıyla karşılaştırma, SQL üretme |
| [**Ayarlar**](./settings.md) | Tema, dil, proxy, sertifikalar ve çalışma alanı tercihleri |

## Asistan sizinle nasıl çalışır?

Amacınızı doğal dille anlatırsınız; asistan uygun yeteneği seçer, deterministik motor doğrular ve siz kart üzerinden onaylarsınız. Model belgeyi kendi başına düzenlemez.

- Belirtim değişiklikleri ayrıntılı işlemler içeren **yama kartları** olarak gelir; mevcut işlem düzenlenirken yalnızca istediğiniz alan değişir;
- İşlemleri listeleme, şema alma veya sorgu yürütme gibi salt okunur eylemler, asistanın yanıtını dayandırdığı gerçekleri döndürür;
- Yazma eylemleri çalışmadan önce onay ister.

Modeli **siz yapılandırırsınız**: uygulamayı OpenAI uyumlu bir sağlayıcıya yönlendirin ve ayarlardan seçin. Bkz. [Yapay zekâ ve modeller](./ai-models.md).

## Yerel çalışmanın avantajları

- **Gerçek dosyalarınız.** Uygulama diskteki gerçek dosyaları açar, düzenler, kaydeder ve yerel değişiklikleri izler.
- **CORS engeli yok.** İstekler web görünümü yerine yerel süreçten geçtiğinden kökenler arası kısıtlamalar çağrıları engellemez.
- **Model uç noktasını siz seçersiniz.** Masaüstü istekleri ana süreçten gönderir; ancak istemler, ilgili bağlam ve kimlik bilgileri yapılandırdığınız sağlayıcıya iletilir. Yerel öncelikli çalışma, uzak yapay zekâ isteklerinin veri aktarmadığı anlamına gelmez.
- **Çevrimdışı çalışır.** Tasarım, mock ve dokümantasyon ağ gerektirmez; canlı istekler, Git eşitlemesi veya barındırılan model için ağ gerekir.
- **Yerel yürütme.** Mock, senaryo çalıştırıcısı, veritabanı erişimi ve terminal bilgisayarınızda çalışır.

## Masaüstü lisansı

Masaüstü istemcisi **tek ödemeli, süresiz lisansla** satılır: bir kez satın alır, hesap açmadan çevrimdışı çalışırsınız. Lisans anahtarı satın alırken oluşturulur ve bir kez gösterilir. Bu lisans, aylık abonelikle sunulan Powerduck Cloud barındırmasından ayrıdır. Bkz. [Bulut faturalandırması](../cloud/billing.md).

## Buradan başlayın

- [Asistanla tasarım](./design.md)
- [İstek çalışma alanı ve ortamlar](./debug.md)
- [Senaryo testleri ve raporlar](./scenario-testing.md)
- [Protokoller](./protocols.md)
- [Veri modeli ve ER diyagramı](./data-model.md)
- [Mock sunucusu](./mock-server.md)
- [Yapay zekâ ve modeller](./ai-models.md)
- [Ayarlar](./settings.md)
