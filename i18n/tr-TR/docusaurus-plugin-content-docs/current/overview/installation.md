---
sidebar_position: 2
title: "Kurulum"
description: "Powerduck · Google OAuth / GitHub · Free / Pro / Max"
---

# Kurulum

Masaüstü dahil Powerduck kullanımı Google OAuth veya GitHub ile giriş gerektirir. Dosyalar diskte kalır. Yapay zekâ analizi seçilen bağlamı Powerduck tarafından yönetilen sağlayıcılara gönderir. Özel model adresleri ve API anahtarları artık desteklenmez.

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

Masaüstü dahil Powerduck kullanımı Google OAuth veya GitHub ile giriş gerektirir. Dosyalar diskte kalır. Yapay zekâ analizi seçilen bağlamı Powerduck tarafından yönetilen sağlayıcılara gönderir. Özel model adresleri ve API anahtarları artık desteklenmez.

## Sistem gereksinimleri

- macOS 11 veya üstü, Windows 10 veya üstü ya da Electron 37 ile uyumlu, yaygın bir Linux masaüstü dağıtımı;
- Uygulama için yeterli disk alanı; açtığınız belirtimler özgün konumlarında kalır;
- Masaüstü dahil Powerduck kullanımı Google OAuth veya GitHub ile giriş gerektirir. Dosyalar diskte kalır. Yapay zekâ analizi seçilen bağlamı Powerduck tarafından yönetilen sağlayıcılara gönderir. Özel model adresleri ve API anahtarları artık desteklenmez.

## Powerduck · Free / Pro / Max

Free: günlük 300.000 credits, UTC 00:00’da yenilenir. Pro: aylık $39 ve her 7 günde 18.000.000 credits. Max: aylık $99 ve her 7 günde 60.000.000 credits. Döngü ilk abonelik başlangıcına dayanır ve aylık faturadan ayrıdır. Kullanılmayan credits devretmez. Masaüstü ve AI Chat kişisel planı paylaşır; kalıcı lisans ve etkinleştirme anahtarı satılmaz.

Sonraki adım: [Hızlı başlangıç](./quickstart.md).
