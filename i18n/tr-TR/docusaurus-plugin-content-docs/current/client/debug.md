---
sidebar_position: 3
title: "İstek çalışma alanı ve ortamlar"
description: "İstek çalışma alanı, tasarlanan işlemi gerçek bir çağrıya dönüştürür. İsteği yerel ana süreç üzerinden gönderir, yanıtı gösterir ve çalıştırmalar arasında değişen değerler için ortamları ve değişkenleri kullanır."
---

# İstek çalışma alanı ve ortamlar

İstek çalışma alanı, tasarlanan işlemi gerçek bir çağrıya dönüştürür. İsteği yerel ana süreç üzerinden gönderir, yanıtı gösterir ve çalıştırmalar arasında değişen değerler için ortamları ve değişkenleri kullanır.

## İstek gönderme

1. İstek çalışma alanında bir işlem açın. Yöntem, yol, parametreler, üstbilgiler ve gövde belirtimden alınır.
2. Yol parametresi veya belirteç gibi somut bir değer gerektiren alanları doldurun.
3. İsteği gönderin. Durum kodu, üstbilgiler, gövde ve süre bilgileri ilgili sekmede gösterilir.
4. Karşılaştırmak veya yeniden incelemek için birden çok isteği **sekmelerde** açık tutun.

Yürütme web görünümü yerine ana süreçte gerçekleştiğinden tarayıcının CORS kısıtlamaları çağrıları engellemez ve istek ayrıntıları tarayıcının ağ panelinde görünmez.

## Ortamlar ve OAS sunucuları

Bunlar ilişkili ancak farklı kavramlardır. Aralarındaki farkı anlamak yaygın bir karışıklığı giderir.

| | Özel ortam | OAS `servers` |
|---|---|---|
| Saklandığı yer | Yerel uygulama ayarı | OpenAPI belgesinin içinde |
| İstek araçlarından değiştirilebilir mi? | Evet | Hayır; belirtim yaması gerekir |
| Amaç | Yeni istek sekmeleri ve senaryo çalıştırmaları için varsayılan temel URL | Sözleşmenin tanımladığı temel URL'ler |
| Belgeyle birlikte paylaşılır mı? | Hayır | Evet |

Asistan temel URL'leri listelerken (`env.listServers`) önce değiştirilebilir özel ortamları, ardından etkin belgede tanımlı salt okunur sunucuları döndürür.

- **Yerel bir temel URL eklemek veya seçmek** için özel ortam oluşturun ya da etkinleştirin (`env.upsertServer`, `env.selectServer`). Bu işlem belgeyi değiştirmez.
- **Sözleşmedeki sunucuları değiştirmek** için belirtim yaması önerin.

Böylece kişisel hata ayıklama URL'si sözleşmeden ayrı kalırken belgede tanımlanan sunucular da istekler için kullanılabilir.

## Değişkenler

Değişkenler dört kapsamda yönetilir:

- **globals** — tüm koleksiyonlarda kullanılabilir;
- **collection** — bir koleksiyonla sınırlıdır;
- **environment** — etkin ortama bağlıdır; belirli bir sunucu seçilmedikçe tüm sunuculara uygulanır;
- **local** — yerel oturuma özeldir.

Asistan değişkenleri listeleyebilir (`env.listVariables`, isteğe bağlı kapsam filtresiyle), oluşturabilir veya güncelleyebilir (`env.setVariable`, ad ve kapsama göre). Değişken belirli bir sunucuya bağlanabilir ve her değişkenin etkinlik durumu vardır. Değişken ayarlamak bir uygulama işlemidir; API belgesini değiştirmez.

Değişkenlerde genellikle erişim belirteçleri, çağrılar arasında yeniden kullanılan kimlikler ve özellik bayrakları tutulur.

## Temel URL eksikse

İsteğin eksiksiz bir URL'ye ihtiyacı vardır. Ne belgenin `servers` alanı ne de etkin ortam temel URL sağlıyorsa uygulama tahmin yürütmez; çalıştırmadan önce sizden URL ister. Böylece yanlış sunucuya sessizce çağrı yapılmaz.

## Tek istekten bir akışa

Tek çağrı çalıştıktan sonra, bir yanıtın değeri sonraki isteğe girdi olacak şekilde çağrıları zincirleyebilirsiniz. Bu, [senaryo testidir](./scenario-testing.md).

İlgili: [Asistanla tasarım](./design.md), [Senaryo testleri](./scenario-testing.md), [Ayarlar](./settings.md).

## A2A ajanları

`x-protocol: a2a` ile sürüme göre ajan mesajları, görev işlemleri ve SSE güncellemeleri tasarlayın ve bunlarda hata ayıklayın. Uzantı alanları ile JSON-RPC, REST ve masaüstü gRPC bağlamaları için [A2A ajanları](./a2a.md) sayfasına bakın.
