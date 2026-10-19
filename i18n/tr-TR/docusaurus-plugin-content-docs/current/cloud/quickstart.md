---
sidebar_position: 2
title: Cloud hızlı başlangıç
description: "Oturum açın, dosya, Git veya URL üzerinden bir belirtim ekleyin, sunulacak işlemleri seçin ve dokümantasyon ile MCP bağlantılarını açın."
---

# Cloud hızlı başlangıç

Bu kılavuz, bilgisayarınızdaki bir belirtimi paylaşılabilir bir dokümantasyon sayfasına ve MCP uç noktasına dönüştürür.

## 1. Oturum açın

Giriş sayfasında **Google** veya **GitHub** ile devam edin. OAuth kimlik doğrulamasından sonra Powerduck kendi oturumunu oluşturur ve konsolu açar. Kişisel organizasyonunuz otomatik olarak oluşturulur.

## 2. Bir belirtim ekleyin

Kontrol panelinden desteklenen kaynaklardan birini kullanarak belirtim ekleyin:

- **Dosya yükleme** — bir OpenAPI dosyasını doğrudan yükleyin;
- **Git deposu** — depoyu belirtin, dalı ve dosya yolunu seçin;
- **URL** — bir URL’den belirtim içe aktarın.

Mevcut OpenAPI 3.0/3.1 ve Swagger belgeleri yükseltilir. cURL veya Postman girdileri kaydedilmeden önce önizleme için dönüştürülebilir.

### Doğrudan yükleme nasıl çalışır?

Büyük dosyalar API sunucusundan geçirilmek yerine doğrudan nesne depolamaya yüklenir:

1. Bir belge oluşturulur;
2. uygulama, içerik türü ve boyutuyla bir **yükleme URL’si** ister;
3. dosya, önceden imzalanmış URL üzerinden doğrudan depolamaya yüklenir;
4. yükleme **tamamlanır** ve sürüm ile SHA-256 değeri kaydedilir.

Böylece büyük veri yükleri API sunucusundan geçmez.

## 3. Sunulacak işlemleri seçin

Belirtim eklendikten sonra hangi işlemlerin dışarıya sunulacağını seçin. İşlemler tek tek açılıp kapatılabilir; kaynak belge değiştirilmez. Tüm işlemlerle başlayıp yayımlamak istemediğiniz dahili veya yönetim uç noktalarını çıkarın.

## 4. Bağlantıları açın

Belge etkin olduğunda çalışma alanında herkese açık adresler görünür:

- **Dokümantasyon** — genel görüntüleyicide işlenen API belgeleri;
- **MCP** — yönetilen Streamable HTTP MCP uç noktası;
- ham belirtim verileri de sabit bir URL’den sunulur.

Dokümantasyon varsayılan olarak etkindir ve yalnızca parola eklerseniz korunur. MCP’nin kullanılabilirliği ve erişim anahtarı ayrı yapılandırılır.

## 5. Gerekirse erişimi koruyun

- Dokümantasyon için bir **görüntüleme parolası** ve isteğe bağlı son kullanma süresi ekleyin;
- MCP uç noktası için bir **MCP erişim anahtarı** oluşturun;
- ikisini de geçici olarak çevrimdışı bırakmak için belgeyi duraklatın.

## 6. Yeni sürümlerle devam edin

API değiştiğinde eski sürümün üzerine yazmak yerine yeni içeriği yeni bir sürüm olarak yükleyin. Paylaşım bağlantıları güncel belgeye yönlendirilebilir veya belirli bir sürüme sabitlenebilir. Böylece sürüme sabitlenmiş bir bağlantının içeriği okuyucu için değişmez.

## Sonraki adımlar

- [Belgeler ve sürümler](/docs/tr-TR/cloud/documents-versions/)
- [Sunulan işlemler](/docs/tr-TR/cloud/exposure/)
- [Erişim denetimi](/docs/tr-TR/cloud/access-control/)
- [Özel alan adları](/docs/tr-TR/cloud/custom-domains/)
