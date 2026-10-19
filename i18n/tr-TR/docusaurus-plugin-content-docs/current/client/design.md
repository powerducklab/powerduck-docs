---
sidebar_position: 2
title: "Asistanla tasarım"
description: "API'ler Belirtim alanında tasarlanır. Bu alan, yapay zekâ sohbetini güncel belge ve önizlemeyle bir araya getirir. Böylece amacınızı doğal dille anlatırken gerçekten uygulanacak değişiklikleri denetleyebilirsiniz."
---

# Asistanla tasarım

API'ler Belirtim alanında tasarlanır. Bu alan, yapay zekâ sohbetini güncel belge ve önizlemeyle bir araya getirir. Böylece amacınızı doğal dille anlatırken gerçekten uygulanacak değişiklikleri denetleyebilirsiniz.

## Onay döngüsü

Model belgeyi doğrudan düzenlemez. Süreç bilinçli olarak açık adımlara ayrılmıştır:

```text
you describe an intent
        |
the model reads current state and proposes operations
        |
the host validates the proposal
        |
you review a patch card and Apply or Reject
        |
the change is merged into the document
```

Bu ayrım temel bir tasarım kararıdır. **Model** amacı anlar ve yapı önerir; **ana uygulama** her işlemi belirli kurallarla doğrular; **siz** her değişikliği onaylarsınız. Onayınız olmadan hiçbir öneri uygulanmış sayılmaz.

## Değişiklik kartları

Değişiklik kartı, yapılacak değişikliği özetler ve işlemleri tam olarak listeler. Örneğin yeni bir yol ekleme:

```json
{
  "type": "patch",
  "summary": "Add GET /products endpoint",
  "ops": [
    { "op": "add", "path": ["paths", "/products"], "value": { "get": {} } }
  ],
  "affects": { "paths": ["/paths/~1products"], "resources": ["Product"] }
}
```

Yol bölümleri JSON Pointer dizeleri değil, dizi elemanlarıdır. Yeni bir yol eklemek için `["paths", "/products"]` hedeflenir; üst kapsayıcılar otomatik oluşturulur.

### Mevcut işlemlerde ayrıntılı düzenleme

Mevcut bir işlemi düzenlerken asistan tüm işlemi yeniden **göndermez**; böyle yapmak, tekrar gönderilmeyen alanları silerdi. Bunun yerine, iç içe yapılardaki yalnızca değiştirmek istediğiniz bölümü etkileyen küçük işlemler üretir:

- Bir sorgu parametresi ekleme:

```json
{ "op": "add", "path": ["paths", "/products", "get", "parameters", "-"], "value": {} }
```

- Yanıt şemasını genişletme:

```json
{ "op": "replace", "path": ["paths", "/products", "get", "responses", "200", "content", "application/json", "schema", "properties", "total"], "value": { "type": "integer" } }
```

- Tek bir alanı değiştirme:

```json
{ "op": "replace", "path": ["paths", "/products", "get", "summary"], "value": "..." }
```

Dizilere eleman eklemek için tüm diziyi yeniden göndermek yerine `"-"` belirteci kullanılır. Parametreler `(in, name)` çiftiyle tanımlanır; böylece mevcut parametreler yinelenmez. Uygulama önerilen değeri mevcut işlemle birleştirir ve değişiklikte belirtilmeyen her şeyi korur.

Bu yaklaşım, art arda yapılan iyileştirmeleri güvenilir kılar: “şimdi limit parametresi ekle” veya “adı zorunlu yap” dediğinizde yalnızca ilgili alan değişir, işlemin geri kalanı korunur.

## Okuma araçları önerilere temel oluşturur

Model, yanıt vermeden önce tahmin yürütmek yerine salt okunur araçlarla güncel durumu tam olarak öğrenebilir:

- `spec.overview`: başlık, sürüm, protokoller, sayılar, etiketler, sunucular ve güvenlik;
- `spec.listOperations`: özet ve etiketlerle birlikte `METHOD /path` biçiminde tüm işlemler;
- `spec.presentOperations`: tüm işlemleri gösteren salt okunur liste kartı;
- `spec.getOperation`: bir işlemin tam tanımı ve başvurduğu şemalar;
- `spec.getSchema`: zorunlu alanlar ve açıklamalar dâhil tek bir bileşen şeması.

Bir işlemin tüm yapısı görünmüyorsa modelin düzenlemeden önce onu okuması beklenir.

## Geniş kapsamlı istekler aşamalara ayrılır

“Bir e-ticaret API'si oluştur” gibi büyük bir istekte asistan her şeyi tek seferde üretmez:

1. Önce temel kararlarla ilgili bir **netleştirme sorusu** sorar;
2. Yanıtınızdan sonra her kartta iki ila beş işlem olacak şekilde **birer odaklı değişiklik** önerir;
3. Yalnızca son isteğiniz bu hedefin kapsamında kaldığı sürece devam eder.

Kapsam netleşir netleşmez asistan oluşturacağı uç noktalar için bir `plan` da üretir. Böylece değişikliklerden önce işin yapısını görebilirsiniz.

## Hedeften sapmayı önleme

Uygulama, çalışmanın istenen yönde kalması için bazı kurallar uygular:

- **Güncel belge** geçerli durumun esas kaynağıdır; belge aksini gösteriyorsa model önceki bir değişikliğin uygulanmış olduğunu varsaymaz;
- Odaklı modda yalnızca etkin hedef ve açıkça başvurulan bileşen şemaları değiştirilir; diğer uç noktalarda ek düzenleme yapılmaz;
- Farklı bir `METHOD /path` açıkça belirtilirse bu, bilinçli görev değişikliği olarak kabul edilir;
- Uygulanan ve reddedilen öneriler geçmişten izlenir; zaten mevcut bir değişiklik yeniden önerilmez.

Gerekli ayrıntılar görünmüyorsa asistan bunları uydurmak yerine belirli bir soru sorar.

## Diğer kartlar

Her yanıt bir değişiklik önerisi değildir:

- **Soru kartları**, seçenekler arasından seçim yapmanızı ister;
- **Doğrulama kartları**, kalite kontrollerini başarılı, uyarı ve hata durumlarıyla gösterir;
- **Eylem kartları**, senaryo çalıştırmak veya çalışma alanı açmak gibi somut sonraki adımlar sunar;
- **Veri tablosu kartları**, bir uç nokta veya şema için örnek ya da test satırları gösterir.

İlgili sayfalar: [İstek çalışma alanı](./debug.md), [Senaryo testleri](./scenario-testing.md), [Yapay zekâ ve modeller](./ai-models.md).

## A2A ajanları

`x-protocol: a2a` ile sürümlü ajan mesajlarını, görev işlemlerini ve SSE güncellemelerini tasarlayıp hata ayıklayın. Uzantı alanları ile JSON-RPC, REST ve masaüstü gRPC bağlamaları için [A2A ajanları](./a2a.md) sayfasına bakın.
