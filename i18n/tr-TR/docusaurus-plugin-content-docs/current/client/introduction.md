---
sidebar_position: 1
title: "Masaüstü istemcisi"
description: "Masaüstü istemcisi, yapay zekâ merkezli iş akışını kendi bilgisayarınıza taşır. Depodan bir openapi.yaml açar, ne istediğinizi anlatır ve sonucu incelersiniz. Belirtim düzenleyicisi, HTTP istemcisi, mock aracı, belge üreticisi ve test çalıştırıcısı arasında geçiş yapmanız veya başlamak için bulut hesabı açmanız gerekmez."
---

# Masaüstü istemcisi

Masaüstü dahil Powerduck kullanımı Google OAuth veya GitHub ile giriş gerektirir. Dosyalar diskte kalır. Yapay zekâ analizi seçilen bağlamı Powerduck tarafından yönetilen sağlayıcılara gönderir. Özel model adresleri ve API anahtarları artık desteklenmez.

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

Masaüstü dahil Powerduck kullanımı Google OAuth veya GitHub ile giriş gerektirir. Dosyalar diskte kalır. Yapay zekâ analizi seçilen bağlamı Powerduck tarafından yönetilen sağlayıcılara gönderir. Özel model adresleri ve API anahtarları artık desteklenmez.

## Yerel çalışmanın avantajları

Masaüstü dahil Powerduck kullanımı Google OAuth veya GitHub ile giriş gerektirir. Dosyalar diskte kalır. Yapay zekâ analizi seçilen bağlamı Powerduck tarafından yönetilen sağlayıcılara gönderir. Özel model adresleri ve API anahtarları artık desteklenmez.

## Powerduck · Free / Pro / Max

Free: günlük 300.000 credits, UTC 00:00’da yenilenir. Pro: aylık $39 ve her 7 günde 18.000.000 credits. Max: aylık $99 ve her 7 günde 60.000.000 credits. Döngü ilk abonelik başlangıcına dayanır ve aylık faturadan ayrıdır. Kullanılmayan credits devretmez. Masaüstü ve AI Chat kişisel planı paylaşır; kalıcı lisans ve etkinleştirme anahtarı satılmaz.

## Buradan başlayın

- [Asistanla tasarım](./design.md)
- [İstek çalışma alanı ve ortamlar](./debug.md)
- [Senaryo testleri ve raporlar](./scenario-testing.md)
- [Protokoller](./protocols.md)
- [Veri modeli ve ER diyagramı](./data-model.md)
- [Mock sunucusu](./mock-server.md)
- [Yapay zekâ ve modeller](./ai-models.md)
- [Ayarlar](./settings.md)
