---
sidebar_position: 10
title: "Kod incelemesi"
description: "Powerduck, AI tarafından üretilen değişiklikleri bağlamıyla anlamanıza ve hangi soruna müdahale edeceğinize karar vermenize yardımcı olur. Masaüstü Ana Sayfasından API alanını veya kod incelemesini ayrı açın."
---

# Kod incelemesi

Klasör seçimi proje yapısını açar. Tam dosyayı yalnız kaynak, tam karşılaştırma veya yalnız değişiklik görünümünde okuyun. Eklenen/silinen satırlar, karakter vurguları, değişiklik gezintisi ve arama düzenlemeyi buldurur.

## Karşılaştırma ve tur geçmişi

Geçerli tur, kaydedilen başlangıcı diskteki dosyalarla karşılaştırır. İlk açılış başlangıç oluşturur, mevcut her şeyi yeni saymaz. Tüm commit edilmemiş değişiklikler Git HEAD ile karşılaştırılır. Yeni turu bilinçli başlatın, öncekileri yerel geçmişte seçin. Bu Git yedeği değildir; önce dosyaları kaydedin.

## Proje yapısı ve ilişkili kod

Git ve ayrıştırıcılar blokları, çözümlenen tanımları, çağıranları ve içe aktarımları bulur. Desteklenen sembollerin üzerine gelerek tanımı görün, ilişkili kodu değişikliğin yanında açın. Yapı sık başvurulan, geçici adlı, aynı içerikli ve gelen başvuru bulunamayan dosyaları işaretler. Dinamik yükleme ve dış kullanım eksik olabilir; başvuru yokluğu güvenle silinebilir demek değildir.

## Kod içinde AI incelemesi

AI incelemesi istekle başlar, sınırlı fark ve bağlamı gruplar hâlinde işler; her tam dosyayı göndermez. Eşleşen önbellek kullanılabilir. Öncelik, kanıt ve öneri kod yanında görünür. Sorunu onaylayın, yanlış pozitif işaretleyin veya Agent için seçin. AI doğruluğu ya da test çalıştığını kanıtlamaz.

## Agent görev paketleri

Şüpheleri seçip kod ve sürüm işaretleri içeren Markdown paketini önizleyin, kopyalayın veya indirin. Agent bağımsız değerlendirmeli; değişiklik izni açıkça belirtilir. JSON raporu insan kontrolü gerektirir. Onarım iddiası başarılı test değildir. Dışa aktarma başka Agent başlatmaz veya iletişim kurmaz.

## Kontrolleri çalıştırın

Yalnız güvenilir projelerin komutlarını açıkça çalıştırın; komut, çıkış kodu ve ham çıktıyı inceleyin. Eksik betik doğrulanmamıştır. Okuma, statik analiz ve AI çalıştırma kanıtı değildir; okundu yalnız okuma ilerlemesidir.

## Yerleşik AI ve kullanım

Google veya GitHub ile giriş yapın. Yalnız yerleşik model; model seçimi, kişisel anahtar ve özel uç nokta yoktur. İstenen AI işi seçilen bağlamı yönetilen sağlayıcılara yollar. Yaygın bağımlılık, derleme ve kimlik yolları dışlansa da kaynakta sır bulunmadığı garanti edilmez.

- [API çalışma alanı](introduction.md)
- [Kod incelemesi](code-quality.md)
- [Yerleşik AI ve kullanım](ai-models.md)
- [Planlar ve görevler](../cloud/billing.md)
- [Kurulum ve başlangıç](../overview/installation.md)
- [Her değişikliği anlayın](../overview/quickstart.md)
