---
sidebar_position: 4
title: Sunulan işlemler
description: "Kaynak belgeyi değiştirmeden herkese açık işlemleri seçin. Etikete göre gruplayın, arayın ve işlemleri tek tek veya topluca açıp kapatın."
---

# Sunulan işlemler

Bir belirtimdeki her işlemin herkese açık olması gerekmez. Yönetim uç noktaları, dahili araçlar ve taslak işlemler belgede kalmalı, ancak yayımlanan dokümantasyonda ve MCP’de görünmemelidir. Sunum yapılandırması, **kaynak belgeyi değiştirmeden** bu seçimi açıkça belirtmenizi sağlar.

## Nasıl çalışır?

Yapılandırma, belirtimden ayrı saklanır. Her kayıt bir işlemi tanımlar ve etkin olup olmadığını tutar:

- varsa işlemin `operationId` değeri tercih edilir;
- işlem kimliği içermeyen belirtimler ve doğrulama için `method` ile `path` de saklanır.

Kaynak belge değiştirilmez. Dokümantasyon ve MCP, belirtim ile etkin işlemler birleştirilerek oluşturulur. Bir işlemi devre dışı bırakmak, onu dosyanızdan silmeden yayımlanan arayüzlerden kaldırır.

## İşlem seçme arayüzü

Arayüz, büyük belirtimleri de yönetebilecek şekilde tasarlanmıştır:

- **Arama** — yöntem, yol, özet veya etikete göre filtreleyin;
- **Etikete göre gruplama** — birincil etikete göre gruplanır; etiketsiz işlemler ayrı bir grupta toplanır;
- **Tek tek değiştirme** — bir işlemi açın veya kapatın;
- **Grup işlemleri** — bir etiket grubundaki tüm işlemleri aynı anda açın veya kapatın;
- **Filtrelenenlerin tümünü seçme** — genel onay kutusu yalnızca mevcut aramayla eşleşen işlemlere uygulanır.

Her işlem tek satırda gösterilir; birden fazla etiketi olsa bile etkinlik durumu belirsizleşmez.

## Pratik bir başlangıç

Basit bir yöntem, tüm işlemleri etkinleştirip herkese açık olmasını istemediklerinizi kapatmaktır:

- kullanıcı yönetimi veya dahili sağlık kontrolleri gibi dahili ve yönetim uç noktaları;
- tasarımı henüz tamamlanmamış işlemler;
- yalnızca yerel hata ayıklama için kullanılan uç noktalar.

Seçim belgeden bağımsız olduğu için API geliştikçe belirtimi düzenlemeden değiştirebilirsiniz.

## Yayımlamayla ilişkisi

Bu seçim **hangi işlemlerin** görüneceğini belirler. Diğer kontroller ise **belgenin erişilebilir olup olmadığını** belirler:

- belge `ACTIVE` olmalıdır;
- dokümantasyon ve MCP’nin ayrı etkinlik ayarları vardır;
- dokümantasyon için görüntüleme parolası, MCP için erişim anahtarı gerekebilir.

Tüm erişim koşulları için [Erişim denetimi](/docs/tr-TR/cloud/access-control/) bölümüne bakın.

## Plan sınırları

Planlar sunulabilecek işlem sayısını sınırlar:

- **Free** — en fazla 10;
- **Pro** — en fazla 1.000;
- **Team** — en fazla 10.000.

İlgili bölümler: [Erişim denetimi](/docs/tr-TR/cloud/access-control/), [Belgeler ve sürümler](/docs/tr-TR/cloud/documents-versions/).
