---
sidebar_position: 3
title: Belgeler ve Sürümler
description: "Belge yaşam döngüsünü, değişmez sürümleri ve dosya yükleme ya da Git eşitlemesiyle gelen kaynakları yönetin."
---

# Belgeler ve Sürümler

Belge, bir API'nin barındırılan temsilidir. Kuruluşunuza, isteğe bağlı olarak da kuruluş içindeki bir projeye aittir. Üzerine yazılmak yerine zaman içinde yeni sürümler biriktirir.

## Hiyerarşi

```text
Organization -> Project -> Document -> Versions
```

Belgeler doğrudan kuruluş altında veya bir projenin içinde oluşturulabilir. Hem proje hem kuruluş düzeyinde listelenirler.

## Durum yaşam döngüsü

Bir belge dört durumda bulunabilir:

| Durum | Anlamı | Herkese açık hizmetler |
|---|---|---|
| `ACTIVE` | Etkin | Ayrı ayrı etkinleştirilmiş olmaları koşuluyla dokümantasyon ve MCP sunulur |
| `PAUSED` | Geçici olarak duraklatılmış | Herkese açık hizmetler kullanılamaz |
| `ARCHIVED` | Saklanıyor ancak güncel sayılmıyor | Sunulmaz |
| `DELETED` | Mantıksal olarak silinmiş | Sunulmaz |

İzin verilen geçişler:

```text
pause:    ACTIVE  -> PAUSED
resume:   PAUSED  -> ACTIVE
archive:  ACTIVE / PAUSED -> ARCHIVED
restore:  ARCHIVED -> ACTIVE
delete:   ACTIVE / PAUSED / ARCHIVED -> DELETED
```

Duraklatma, bir belgeyi geçici olarak yayından kaldırıp yeniden etkinleştirmenin en hızlı yoludur. Arşivleme geçmişi korur ancak belgeyi güncel olarak değerlendirmez. Silme mantıksal olduğundan temel veriler hemen yok edilmez.

## Sürümler değişmezdir

Belirtim değiştiğinde yeni bir sürüm oluşturulur. Eski sürümün yerini almaz:

```text
v1 -> v2 -> v3 -> v4
```

Her sürüm şunları kaydeder:

- Nesne depolamadaki dosyanın **depolama anahtarı**;
- **SHA-256** sağlama toplamı;
- İçerik türü, boyutu ve oluşturulma zamanı.

Böylece geçmişi izlemek, önceki sürüme dönmek, değişiklikleri karşılaştırmak ve belirli bir sürüm için dokümantasyon ile MCP'yi yeniden oluşturmak mümkündür.

### Güncel sürüm ve sabit sürüm bağlantıları

- **Güncel** belge bağlantısı en son sürümü takip eder;
- **Sürüme sabitlenmiş** bağlantı belirli bir sürüme işaret eder; okuyucunun karşısındaki içerik kendiliğinden değişmez.

Sürüm notu veya sözleşme gibi değişmez bir referans gerektiğinde sabit sürüm bağlantısı kullanın. Her zaman en son sürümün açılmasını istiyorsanız güncel belge bağlantısını kullanın.

## Kaynaklar

Belge içeriği soyutlanmış bir kaynaktan gelir; böylece belge modeli dosya yüklemeye veya Git'e doğrudan bağlı değildir.

- **Yükleme** — doğrudan dosya ekleyin;
- **Git** — URL, dal ve dosya yoluyla bir depo bağlayın.

Git kaynağı, eşitlemenin etkin olup olmadığını ve son eşitleme zamanını kaydeder. Şunları yapabilirsiniz:

- Depo **bağlama**: depo URL'si ve dosya yolu zorunludur; dal isteğe bağlıdır;
- İsteğe bağlı **eşitleme**: en son içeriği yeni bir sürüm olarak alın.

Kaynak meta verileri belgeyle birlikte saklanır. Böylece içeriğin yüklenen bir dosyadan mı yoksa depodan mı geldiğini ve son eşitleme zamanını her zaman görebilirsiniz.

## Depolama

Dosyalar kuruluş/belge/sürüm düzeninde nesne depolamada tutulur. Veritabanı yalnızca meta verileri saklar: depolama anahtarı, sağlama toplamı, içerik türü ve boyut. Varsayılan olarak dosyalar depolama alanından doğrudan herkese açık biçimde okunamaz; herkese açık erişim belgenin yayınlama rotaları üzerinden sağlanır.

## Neden önemlidir?

Değişmez sürümler ve mantıksal silme, geçmişi kaybetmeden veya durdurmak istediğiniz belgeyi yanlışlıkla erişime açmadan hızla değişiklik yapmanızı sağlar. Geçici kesintiler için duraklatmayı, uzun süre saklamak için arşivlemeyi, kararlılık gerektiğinde ise sabit sürüm bağlantılarını kullanın.

İlgili konular: [Erişime açılan işlemler](/docs/tr-TR/cloud/exposure/), [Erişim denetimi](/docs/tr-TR/cloud/access-control/), [Özel alan adları](/docs/tr-TR/cloud/custom-domains/).
