---
sidebar_position: 2
title: "Kurulum"
description: "Powerduck masaüstü istemcisi yerel çalışmayı önceliklendiren bir uygulamadır. Diğer masaüstü programları gibi kurulur, diskteki gerçek dosyaları açar ve başlamak için hesap gerektirmez."
---

# Kurulum

Powerduck masaüstü istemcisi yerel çalışmayı önceliklendiren bir uygulamadır. Diğer masaüstü programları gibi kurulur, diskteki gerçek dosyaları açar ve başlamak için hesap gerektirmez.

## İndirme

Platformunuza uygun yükleyiciyi [Powerduck web sitesinden](https://www.powerduck.com/#download) indirin. Aşağıdaki derlemeler `electron-builder` ile üretilir:

| Platform | Yükleyici | Mimari |
|---|---|---|
| macOS | `.dmg` ve otomatik güncelleme için `.zip` | Apple Silicon (`arm64`) ve Intel (`x64`) |
| Windows | NSIS yükleyicisi (`.exe`) | `x64` |
| Linux | AppImage (`.AppImage`) | `x64` |

## macOS

1. `.dmg` dosyasını açın ve Powerduck'ı **Uygulamalar** klasörüne sürükleyin.
2. İlk açılışta macOS, App Store dışından indirilen uygulama için onay isteyebilir. Açmadan önce resmî indirme sayfasından geldiğini doğrulayın; sistem güvenlik denetimlerini kapatmayın.
3. İki derleme yayımlanır: Apple Silicon (M serisi) için `arm64`, Intel Mac'ler için `x64`. Bilgisayarınıza uygun olanı indirin.

## Windows

1. NSIS yükleyicisini (`.exe`) çalıştırın ve kurulum adımlarını izleyin.
2. SmartScreen tanınmayan yayıncı uyarısı gösterirse önce yükleyicinin resmî indirme sayfasından geldiğini kontrol edin. Yalnızca kaynağı doğruladıktan sonra devam edin; güvenilmeyen bir indirme için uyarıyı atlamayın.

## Linux

1. `.AppImage` dosyasını indirin.
2. Çalıştırma izni verin ve başlatın:

```bash
chmod +x Powerduck-*.AppImage
./Powerduck-*.AppImage
```

AppImage, sistem genelinde kurulum gerektirmeden çalışır. Bazı dağıtımlarda dosyayı bağlamak için FUSE kurmanız gerekebilir.

## Bilgisayarınızda çalışan bileşenler

Masaüstü istemcisi iki parçadan oluşan bir Electron uygulamasıdır:

- Dosya erişimini, giden HTTP isteklerini, yerel mock sunucusunu, veritabanı bağlantılarını ve tümleşik terminali yöneten **ana süreç** (Node.js);
- Belirtimi, yapay zekâ sohbetini ve tüm araçları gösteren **görüntüleme süreci** (React çalışma alanı).

Masaüstü yapay zekâ aktarımı, tamamlama isteklerini ana süreç üzerinden gönderir; bu nedenle tarayıcı ile sağlayıcı arasındaki CORS kısıtlamaları uygulanmaz. İstemler, ilgili bağlam ve kimlik bilgileri yine de yapılandırdığınız model uç noktasına gönderilir; barındırılan bir modeli kullanmak çevrimdışı bir işlem değildir. Süreç ayrımı, sırların günlüklerde veya geliştirici araçlarında asla görünmeyeceğini garanti etmez. Bkz. [Yapay zekâ ve modeller](../client/ai-models.md).

## Sistem gereksinimleri

- macOS 11 veya üstü, Windows 10 veya üstü ya da Electron 37 ile uyumlu, yaygın bir Linux masaüstü dağıtımı;
- Uygulama için yeterli disk alanı; açtığınız belirtimler özgün konumlarında kalır;
- İstek gönderirken, Git kaynağını eşitlerken veya barındırılan bir yapay zekâ modelini çağırırken ağ erişimi; diğer işlemler çevrimdışı çalışabilir.

## Lisanslama

Masaüstü istemcisini süre sınırı olmadan değerlendirebilirsiniz. Tek ödemeli, **süresiz** lisansla satılır: bir kez satın alınır, abonelik gerekmez. Lisans anahtarı satın alma sırasında üretilir ve yalnızca bir kez gösterilir. Bulut barındırma, abonelik tabanlı ayrı bir hizmettir. Ayrım için [Bulut faturalandırması](../cloud/billing.md) sayfasına bakın.

Sonraki adım: [Hızlı başlangıç](./quickstart.md).
