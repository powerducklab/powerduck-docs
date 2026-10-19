---
sidebar_position: 1
title: "Powerduck Cloud"
description: "Powerduck Cloud, OpenAPI dosyanızı **paylaşılabilir** hâle getirir. Bir belirtim ekleyin, hangi işlemleri sunacağınızı seçin ve belgeler ile yönetilen MCP sunucusu için kalıcı bağlantıları paylaşın. Bu hizmetleri kendiniz barındırmanız veya çalıştırmanız gerekmez."
---

# Powerduck Cloud

Powerduck Cloud, OpenAPI dosyanızı **paylaşılabilir** hâle getirir. Bir belirtim ekleyin, hangi işlemleri sunacağınızı seçin ve belgeler ile yönetilen MCP sunucusu için kalıcı bağlantıları paylaşın. Bu hizmetleri kendiniz barındırmanız veya çalıştırmanız gerekmez.

Masaüstü istemcisindeki API sözleşmesini temel alan, yapay zekâ destekli iş akışını ekipler ve API kullanıcıları için çevrimiçi ortama taşır. Free planı, kendi sınırları içinde belge ve MCP barındırmayı kapsar; ücretli planlar daha yüksek kapasite, Git kaynakları ve özel alan adları sunar. Uygulamanızın API'si kendi arka uç sisteminizde çalışmaya devam eder.

## İş akışı

1. **Bir belirtim ekleyin.** Dosya yükleyin, bir Git deposu belirtin veya URL yapıştırın. İşleme web sitesinden başlayıp hazır olduğunuzda oturum açabilirsiniz; dosyayı tekrar yüklemeniz gerekmez.
2. **Hangi işlemleri sunacağınızı seçin.** İşlemleri tek tek açıp kapatın; özgün dosyanız hiçbir zaman değiştirilmez.
3. **Belge bağlantısını hemen açın.** Görüntülenebilir API belgeleri varsayılan olarak etkindir. Yönetilen MCP uç noktası ayrı bir anahtarla açılır ve araçları ajanlara sunmayı seçene kadar kapalı kalır.
4. **Erişimi denetleyin.** Belgeleri görüntülemek için parola ve son kullanma zamanı, ajanlar içinse ayrı bir MCP erişim anahtarı belirleyin.
5. **Yayımlayın ve paylaşın.** Bağlantıların çalışması için geçerli sürümün hazır çıktısını yayımlayın; gelişmiş ayarlar her zaman kolayca erişilebilir durumdadır.
6. **Güncel tutun.** Her değişiklik, karşılaştırabileceğiniz veya geri dönebileceğiniz yeni bir sürüm oluşturur. Git kaynakları güncellendiğinde eşitlenebilir.
7. **Yaşam döngüsünü yönetin.** Bir belgeyi duraklatın, yeniden etkinleştirin veya arşivleyin; durumunu, sürümlerini ve kaynağını tek bakışta görün.

## Sunulan özellikler

- Yeni sürümler yayımladığınızda da çalışmaya devam eden **kalıcı belge bağlantıları**;
- Başka kullanıcıların yapay zekâ ajanlarının seçtiğiniz işlemleri keşfedip çağırmasını sağlayan **yönetilen MCP uç noktası**;
- Dahili veya henüz tamamlanmamış uç noktaları herkese açık arayüzün dışında tutan **işlem bazında erişim ayarları**;
- Görüntüleme parolaları, son kullanma süreleri ve MCP erişim anahtarlarıyla **erişim denetimi**;
- Özgün içeriğin üzerine yazmadan karşılaştırma ve geri alma sağlayan **sürüm geçmişi**;
- Depo güncellemelerini barındırılan yeni sürümlere dönüştüren **Git eşitlemesi**;
- Markanıza uygun bir deneyim için alt yol yapılandırmalarını da destekleyen **özel alan adları**.

### Tek belge, birden çok sürüm

Her düzenleme, özgün sürümün üzerine yazmak yerine yeni bir sürüm oluşturur. Böylece sürümleri karşılaştırabilir, önceki bir sürüme dönebilir ve bilinen bir durumdan belgeleri ve MCP'yi yeniden yayımlayabilirsiniz. Belgeler ve MCP her zaman belirli bir belgeye ve sürüme bağlıdır; belirsiz bir “en son” sürüme değil.

### Bir bağlantı neden açılmayabilir?

Belge veya MCP bağlantısının çalışması için üç koşulun sağlanması gerekir. Belge çalışma alanı tümünü gösterir ve karşılanmayan ilk koşulu vurgular:

1. Belge **etkin** olmalıdır: duraklatılması hem belgeleri hem MCP'yi aynı anda çevrimdışı bırakır;
2. Paylaştığınız hizmet **açık** olmalıdır: belgelerin ve MCP'nin ayrı anahtarları vardır; varsayılan olarak belgeler açık, MCP kapalıdır;
3. Güncel çıktı **yayımlanmış** olmalıdır: bir sürüm eklediğinizde veya sunulan işlemleri değiştirdiğinizde otomatik oluşturulur; genellikle ek işlem gerekmez, ihtiyaç hâlinde elle yayımlama da kullanılabilir.

Görüntüleme parolası, son kullanma zamanı veya MCP erişim anahtarı gibi erişim kontrolleri bu üç koşula ek olarak uygulanır.

## Oturum açma ve sahiplik

**Google** veya **GitHub** ile oturum açın. OAuth işleminin ardından Powerduck, güvenli ve HttpOnly bir çerezle kendi oturumunu oluşturur; sağlayıcının belirteci kalıcı kimliğiniz olarak kullanılmaz. Tüm kaynaklar bir **kuruluşa** aittir. Kişisel kuruluş otomatik oluşturulur; ekipler daha sonra sistemi yeniden tasarlamak zorunda kalmadan ortak bir kuruluş kullanabilir.

## Yönetim konsolu

- **Kontrol paneli**: belirtim ekleyin; son belgeleri, hızlı bağlantıları ve başlatma/durdurma işlemlerini görün;
- **Projeler**: belgeleri düzenleyin;
- **Belge çalışma alanı**: durum, belgeler, MCP, sunulan işlemler, sürümler, kaynak ve alan adlarını açıkça etiketlenmiş bölümlerde yönetin;
- **Faturalandırma**: abonelik durumunu ve siparişleri ayrı ayrı izleyin;
- **Hub**: herkese açık belgeleri ve MCP sunucularını yayımlayın ve inceleyin;
- **Ayarlar** ve **Etkinlik**: profil, tercihler ve denetim günlüğüne erişin.

Herkese açık belgeleri okuyanlar özel belge görüntüleyicisini kullanır ve Powerduck hesabına ihtiyaç duymaz. Görüntüleme parolası ayarlanmışsa bu parolayı girmeleri gerekir; belge parolası ve hesapta oturum açma ayrı gereksinimlerdir.

## Cloud ve masaüstü istemcisi

| | Masaüstü istemcisi | Cloud |
|---|---|---|
| Çalıştığı yer | Bilgisayarınızda | Barındırılan hizmet |
| Ödeme modeli | Tek seferlik ödemeyle süresiz lisans | Ücretsiz plan ve ücretli abonelikler |
| Sağlanan hak | Bir kez gösterilen lisans anahtarı | Lisans anahtarı olmadan plan kapsamındaki haklar |
| En uygun kullanım | Tam kapsamlı yerel ve çevrimdışı çalışma alanı | Çevrimiçi paylaşım ve yayımlama |

İki ürün birbirini tamamlar. Cloud'un Free planı vardır; ücretli Cloud abonelikleri ve masaüstü lisansları ayrı satın alınır. Bkz. [Faturalandırma](./billing.md).

## Buradan başlayın

- [Cloud hızlı başlangıç](./quickstart.md)
- [Belgeler ve sürümler](./documents-versions.md)
- [Sunulan işlemler](./exposure.md)
- [Erişim denetimi](./access-control.md)
- [Özel alan adları](./custom-domains.md)
- [Faturalandırma](./billing.md)
