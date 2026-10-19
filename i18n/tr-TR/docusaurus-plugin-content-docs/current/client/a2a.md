---
sidebar_position: 6
title: "A2A ajanları"
description: "Bir ajan başka bir ajana iş devrettiğinde A2A kullanın. MCP araçları ve kaynakları sunar; A2A ise ajan mesajlarını, görevleri, durum güncellemelerini ve çıktı nesnelerini tanımlar. İkisini aynı yerel belirtimde tutabilirsiniz, ancak aynı protokol olarak değerlendirmeyin."
---

# A2A ajanları

Bir ajan başka bir ajana iş devrettiğinde A2A kullanın. MCP araçları ve kaynakları sunar; A2A ise ajan mesajlarını, görevleri, durum güncellemelerini ve çıktı nesnelerini tanımlar. İkisini aynı yerel belirtimde tutabilirsiniz, ancak aynı protokol olarak değerlendirmeyin.

## Oluşturma ve hata ayıklama

1. Hata ayıklama bölümünde **Yeni istek → A2A** seçin. Varsayılan, HTTP üzerinden JSON-RPC kullanan A2A **1.0**'dır.
2. Ajanın JSON-RPC uç noktasını URL çubuğuna girin. Eski ajanlar için **0.3** sürümünü açıkça seçin; Powerduck sürümler arasında sessiz dönüşüm yapmaz.
3. Protokol sekmesinde bir yöntem seçip **İstek gövdesi oluştur** düğmesine tıklayın. Önizlemeyi inceleyin, ardından uygulamak için **İstek gövdesini değiştir** seçeneğini kullanın. İptal etmek veya yöntemi değiştirmek mevcut taslağı korur.
4. Gövde sekmesinde `params` alanını düzenleyin. Kimlik bilgilerini Kimlik doğrulama ve Başlıklar üzerinden belirtin; gönderirken seçilen `A2A-Version` başlığı eklenir.
5. İsteği gönderin. JSON-RPC zarfının tamamını inceleyin: HTTP 200 yanıtı yine de `error` içerebilir. Başarılı 1.0 yanıtları, `result` içinde bir `task` veya `message` taşır; 0.3 kendi yanıt yapılarını kullanır.
6. Hızlı isteği eklemek için **Belirtime kaydet** kullanın. Mevcut işlemde **Kaydet** yerel hata ayıklama ayarlarını saklar; **Belirtimi güncelle** tanımı açıkça günceller. Sürüm, uç nokta, yöntem ve belgelenmiş şemalar `x-a2a` içinde yer alır; yerel istek taslakları OAS'a aktarılmaz. Protokol sözleşmesini düzenlemek için **Belgeleri düzenle** kullanın.

Mesaj kimlikleri ile JSON-RPC istek kimlikleri ayrıdır. Yeni örnek, yeni kimlikler oluşturur. Konuşmayı sürdürmek için dönen bağlam/görev kimliklerini seçilen protokol sürümünün gerektirdiği şekilde sonraki mesajda koruyun.

## Agent Card

Genellikle `/.well-known/agent-card.json` olan açık bir URL ile **Herkese açık Agent Card getir** seçeneğini kullanın. Uç noktayı ayarlamadan önce bildirilen arayüzleri, sürümü, becerileri, kimlik doğrulamasını ve yetenekleri inceleyin. Kartı getirmek istek URL'sini otomatik değiştirmez veya kimlik bilgilerini başka bir kaynağa iletmez.

Herkese açık keşif, istek kimlik bilgilerini göndermez ve yönlendirmeleri reddeder. Masaüstü yerel HTTP çalıştırıcısını kullanır; tarayıcıda keşif CORS gerektirir. Yanıtlar 1 MiB ile sınırlıdır. A2A 1.0 için **JWS imzasını doğrula** bölümünü açıp güvenilir genel JWKS'yi yapıştırın. Doğrulama yereldir, asimetrik imzaları destekler ve kartın verdiği anahtar URL'lerini hiçbir zaman izlemez. Zorunlu boş değerler, projede sürümü sabitlenen A2A proto tanımına göre korunur. Standart kart şeması dışındaki özel alanlar doğrulanmaz. İmzasız ve doğrulanmamış kartlar açıkça işaretlenir; anlık görüntü kaydetmek bir güven kararını kaydetmez. Korunan meta veriler için isteğin kimlik doğrulamasıyla genişletilmiş kart RPC'sini kullanın. **Kartı belirtime kaydet** yalnızca anlık görüntü saklar; belirtimi paylaşmadan veya barındırmadan önce özel meta verileri çıkarın.

## Görevler ve akış

1.0 için `SendStreamingMessage` veya `SubscribeToTask`, 0.3 için `message/stream` veya `tasks/resubscribe` kullanın. Yanıtlar, yanıt sınırları ve iptal denetimleriyle mevcut SSE olay görüntüleyicisinde gösterilir. Ham durum ve çıktı güncellemeleri incelenebilir durumda kalır.

**Durdur**, yerel isteğin bağlantısını keser; uzaktaki işi iptal etmez. Uzaktan iptal istemek için dönen görev kimliğiyle 1.0'da `CancelTask`, 0.3'te `tasks/cancel` gönderin. Son duruma ulaşmış bir görev doğrudan yeniden başlatılamaz.

Görev getirme, 1.0'da listeleme, genişletilmiş kartlar ve push bildirimi yapılandırma yöntemleri kullanılabilir. A2A 1.0 bunları üç bağlama üzerinden de sunar; 0.3 JSON-RPC kullanır. İsteğe bağlı işlemler ajanın bildirdiği yeteneklere bağlıdır. Powerduck bir push bildirimi alıcısı barındırmaz.

## OpenAPI uzantısı

`x-a2a`, Powerduck'a ait bir OpenAPI uzantısıdır; standart A2A Agent Card veya standart OpenAPI anahtar sözcüğü değildir. JSON-RPC işlemleri `post` kullanır. OpenAPI yolu belgelenen işlemi tanımlar; `endpoint` gerçek uzak JSON-RPC URL'sidir.

```yaml
openapi: 3.2.0
info:
  title: Research agent
  version: 1.0.0
paths:
  /agents/research/send:
    post:
      summary: Ask the research agent
      x-protocol: a2a
      x-a2a:
        version: '1.0'
        binding: JSONRPC
        endpoint: https://agent.example.com/rpc
        agentCardUrl: https://agent.example.com/.well-known/agent-card.json
        method: SendMessage
        requestSchema:
          type: object
          description: Application-specific message parameters
        responseSchema:
          type: object
          description: JSON-RPC response envelope
        example:
          jsonrpc: '2.0'
          id: request-1
          method: SendMessage
          params:
            message:
              messageId: message-1
              role: ROLE_USER
              parts:
                - text: Summarize the release notes
      responses:
        '200':
          description: A2A response; inspect result or error
          content:
            application/json:
              schema:
                type: object
```

Akış yanıtları için bir JSON-RPC olayını tanımlayan OAS 3.2 `itemSchema` ile `text/event-stream` kullanın. Tasarım düzenleyicisi bağımsız istek ve yanıt şemalarını destekler. Yayımlanan belgeler ve LLM için kopyalama, A2A yapılandırmasını ve belgelenmiş sözleşmeleri korur.

| Alan | Anlamı |
| --- | --- |
| `version` | Desteklenen iletim sürümü: `1.0` veya `0.3` |
| `binding` | `JSONRPC`; A2A 1.0 ayrıca `HTTP+JSON` ve `GRPC` destekler |
| `endpoint` | JSON-RPC uç noktası, REST temel URL'si veya HTTP(S) gRPC sunucu adresi |
| `method` | Sürüme özgü yöntem: REST/gRPC bu seçimi, JSON-RPC gövdedeki yöntemi kullanır |
| `agentCardUrl` | Herkese açık keşif URL'si |
| `agentCard` | İsteğe bağlı kaydedilmiş meta veri anlık görüntüsü |
| `requestSchema`, `responseSchema` | Tek bir yakalanan yanıttan çıkarılmayan, açıkça belgelenmiş sözleşmeler |
| `example` | JSON-RPC zarfı veya doğrudan REST/gRPC istek nesnesi |

## REST ve gRPC

Sürüm ve yöntemden bağımsız bir **Taşıma bağlaması** seçin. A2A 1.0; JSON-RPC, REST ve yerel gRPC destekler. A2A 0.3, JSON-RPC desteğini korur; desteklenmeyen birleşimler sessizce dönüştürülmek yerine reddedilir.

REST için URL çubuğu temel URL'yi içerir; örneğin `https://agent.example/rest`. Yöntem, HTTP fiilini ve yol son ekini belirler. Gövde alanında `jsonrpc`, `id` ve `params` zarf alanları olmadan doğrudan istek nesnesini düzenleyin. Görev kimlikleri yol bölümleri olarak kodlanır; filtreleme ve sayfalama sorgu parametrelerine dönüşür. Hata ayıklama ve belge kodu üretimi aynı eşlemeyi kullanır.

Yerel gRPC masaüstü uygulaması gerektirir. Sistem sertifikalarına güvenen TLS için `https://host:port`, yerel şifresiz test için `http://localhost:port` kullanın. Yol bileşeni bulunmaz. Başlıklar gRPC meta verisine dönüşür. Çağrılar, iç içe veriler, enum'lar ve ikili alanlar için ProtoJSON dönüşümüyle resmi `lf.a2a.v1.A2AService` tanımlayıcısını kullanır. Durdur, yerel çağrıyı iptal eder; uzak görevi iptal etmez. HTTP betikleri, proxy'ler ve özel TLS ayarları bu bağlamada sessizce yok sayılmak yerine reddedilir.

Sürüm veya bağlama değişikliği taslağı korur. **İstek gövdesi oluştur** seçeneğini kullanın, şablonu inceleyin ve doğru yapıyı uygulamak için **İstek gövdesini değiştir** seçeneğini onaylayın. Uyuşmayan zarf gönderimden önce reddedilir. Keşfedilen arayüzler açıkça uygulanabilir; A2A artık ilgisiz belge sunucusunu otomatik devralmaz.

## Sunucu oluşturma

**Sunucu oluştur → Sunucu projesini indir** bölümünü açın. Arşiv, tek bir HTTP iş mantığı işleyicisi üzerinden JSON-RPC, REST ve gRPC sunan Node 22+ projesi ile herkese açık Agent Card içerir. `npm install` çalıştırın, en az 32 rastgele karakterle `A2A_TOKEN` ve `HANDLER_URL` ayarlayın, ardından `npm start` çalıştırın.

İşleyici `{message, contextId}` alır ve boş olmayan `parts` içeren bir Message döndürür. İndirme dosyasına gizli bilgi veya mevcut istek kimlik bilgisi eklenmez. Üretilen hizmette veri boyutu sınırları, işleyici için 60 saniyelik süre sınırı, eşzamanlılık sınırı, kapanışta kaynak temizliği ve `SIGNING_JWK_FILE` üzerinden isteğe bağlı JWS imzalama vardır.

Bu bir **durumsuz mesaj bağdaştırıcısıdır**; otonom model veya kalıcı görev motoru değildir. Kalıcı görevler, görev iptali ve push teslimi özel bir yürütücü ve kalıcı depolama gerektirir. Kart push desteği bildirmez. Herkese açık dağıtımdan önce genel URL'leri, TLS'yi ve HTTP ters proxy hız sınırlarını ayarlayın; birden fazla kullanıcıya hizmet veriyorsanız ortak token kimliğini değiştirin. Bu dağıtım gereksinimleri üretilen README'de bulunur.

## İmza uyumluluğu

Doğrulama, zorunlu boş dizeler/diziler ve açıkça bulunan isteğe bağlı boole değerleri dâhil A2A 1.0 alan varlığı kurallarını ve RFC 8785 kanonik JSON'u izler. Zorunlu alanları silen bir imzalayıcının ürettiği imzalar reddedilir; uyumlu bir kanonikleştiriciyle yeniden imzalayın. Başarılı imza doğrulaması, standart alanları verilen genel anahtara karşı doğrular; güvenilmeyen bir anahtarın iddia edilen kuruluşa ait olduğunu kanıtlamaz.

Kaynaklar: [A2A 1.0 belirtimi](https://a2a-protocol.org/v1.0.0/specification/) ve [A2A 0.3 belirtimi](https://a2a-protocol.org/v0.3.0/specification/).

## Çalıştırılabilir yerel örnek

Powerduck React deposu `examples/a2a-demo` içerir. Node.js 22+ ile bu dizinde `npm ci` ve `npm start` çalıştırın. Aynı yerel hesap makinesi üzerinde JSON-RPC, REST ve masaüstü gRPC hata ayıklaması yapmak için `openapi.json` dosyasını içe aktarın. README; demo bearer token'ını, Agent Card keşfini, güvenilir yerel JWKS'yi ve akış yönergelerini içerir. `npm test`, harici hizmet olmadan gerçek taşıma yöntemlerini ve değiştirilmiş imzaların reddini doğrular.

Protokol panelinde **İstek gövdesi oluştur**, seçilen yöntemin şablonunu önizler. **İstek gövdesini değiştir** bunu açıkça uygular; iptal veya yöntem değişikliği mevcut taslağı korur.

```bash
cd powerduck-react/examples/a2a-demo
npm ci
npm start
# In another terminal, in the same directory:
npm test
```

Yerel uç noktalar: JSON-RPC `http://127.0.0.1:9999/rpc`, REST `http://127.0.0.1:9999/rest`, gRPC `http://127.0.0.1:9998`. Herkese açık kart `http://127.0.0.1:9999/.well-known/agent-card.json` adresindedir. Demo bearer token'ı `powerduck-local-demo-token-0123456789` değerini kullanın. `[12,30]` sayıları gönderildiğinde `Sum: 42` ve yapılandırılmış `total: 42` döner. Güvenilir genel anahtar `.runtime/trusted-jwks.json` dosyasındadır ve yeniden başlatmada değişir. Demo yalnızca yerel bağlantıları dinler; yapay zekâ anahtarı gerektirmez, kalıcı görev motoru veya push teslimi içermez ve demo token'ıyla herkese açık dağıtılmamalıdır. Varsayılan tarayıcı kaynakları `http://localhost:3000` ve `http://127.0.0.1:3000` adresleridir; diğerleri için `CORS_ORIGINS` kullanın. Üretilen sunucu da bu açık izin listesini destekler.
