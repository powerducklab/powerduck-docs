---
sidebar_position: 3
title: "Hesap veya yapay zekâ modeli olmadan ilk yerel isteğinizi gönderin"
description: "Hesap veya yapay zekâ modeli olmadan ilk yerel isteğinizi gönderin"
---

# Hesap veya yapay zekâ modeli olmadan ilk yerel isteğinizi gönderin

## Yerel örneği deneyin

Masaüstü uygulamasında boş bir çalışma alanı açın, **Örneği dene** seçeneğini seçin ve çalıştırın. Powerduck bağımsız bir örnek oluşturur, yerel Mock sunucusunu başlatır, atanan bağlantı noktasına `GET /orders/summary` gönderir ve gerçek yanıtı gösterir. Örnek ancak HTTP 200 yanıtından sonra tamamlanmış sayılır. Mock sunucusu istekten sonra veya örneği kapattığınızda durur. Örneği istediğiniz zaman yeniden çalıştırabilirsiniz. Önce uygulamayı kurun; bu yerel işlem için internet, oturum açma veya model API anahtarı gerekmez.

## Kendi spesifikasyonunuzu açın

YAML veya JSON biçimindeki OpenAPI belgenizi **Aç** seçeneğiyle içe aktarın. Örnek, mevcut dosyaların üzerine yazmaz. Ücretsiz kullanımda spesifikasyon sayısı sınırlıdır. Sınıra ulaşırsanız gereksiz bir belgeyi kaydedip kapatın veya kaldırın. Örneği çalıştırmak için kaydedilmemiş değişiklikleri silmeyin. Mevcut projenizin kodunu tarayarak da OpenAPI oluşturabilirsiniz. Sonuca güvenmeden önce belirsiz alanları kontrol edin.

## Gerçek sunucuyu doğrulayın

Başarılı bir Mock isteği, gerçek sunucunun spesifikasyona uyduğunu kanıtlamaz. [Sözleşme hatası örneğini](/docs/tr-TR/client/contract-example/) uygulayın ve isterseniz [bir kodlama asistanı bağlayın](/docs/tr-TR/client/coding-agent/). Elle doğrulama için yapay zekâ modeli gerekmez.

## İsteğe bağlı modeller ve yaygın hatalar

- **Model yapılandırılmamış:** yerel istekler, Mock sunucusu ve elle sözleşme kontrolleri çalışmaya devam eder. Yalnızca yapay zekâ kullanmak istiyorsanız ayarlardan model yapılandırın.
- **Model hizmetine bağlanılamıyor:** ayarlardaki hizmet adresini, anahtarı ve proxy’yi kontrol edin. Hata bildirimlerinde anahtarları veya istek başlıklarını yayımlamayın.
- **Hedef API’ye ulaşılamıyor:** sunucunun çalıştığından emin olun; hata ayıklayıcıda URL’yi, bağlantı noktasını ve istek ayarlarını kontrol edin.
- **HTTP 401/403:** hedef API’nin kimlik doğrulamasını ve izinlerini kontrol edin. Bu, Powerduck’ta oturum açmanız gerektiği anlamına gelmez.
- **Sözleşme kontrolü başarısız:** doğrulama sonucundaki alan yolunu ve beklenen türü inceleyin. Sunucuyu veya hatalı spesifikasyonu düzeltip kontrolü tekrarlayın.

Yerel dosyalar bilgisayarınızda okunur ve kaydedilir. Uzak modellere gerekli bağlam gönderilir; bulutta yayımlama sırasında seçtiğiniz içerik yüklenir. İsteğe bağlı kullanım istatistikleri ayarlarda varsayılan olarak kapalıdır ve lisans doğrulamasından bağımsızdır.

[İndir](https://www.powerduck.com/download.html) · [Masaüstü lisansı](https://www.powerduck.com/pricing?product=client)
