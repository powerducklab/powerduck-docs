---
title: "İstekleri kaydetme ve protokol örnekleri"
description: "Powerduck, denediğiniz isteği yayımladığınız API sözleşmesinden ayrı tutar."
---

# İstekleri kaydetme ve protokol örnekleri

Powerduck, denediğiniz isteği yayımladığınız API sözleşmesinden ayrı tutar.

| İşlem | Sonuç |
| --- | --- |
| URL çubuğunda Kaydet | Bu isteğin yerel hata ayıklama yapılandırmasını kaydeder. OpenAPI belgesini değiştirmez. |
| Hızlı istek: belirtime kaydet | Seçilen belgeye ve klasöre bir işlem ekler. |
| Belirtim isteği: belirtimi güncelle | Sözleşmeyi güncellemeden önce hedef yöntemi, yolu ve tanım önizlemesini gösterir. |
| Belgeyi kaydet / Cmd+S veya Ctrl+S | Geçerli OpenAPI belgesini diske yazar. Hızlı istek sekmesinde kısayol, o hızlı isteği kaydeder. |

Yerel istek; seçilen sunucuyu, URL'yi, yöntemi, parametre değerlerini, gövdeyi, betikleri ve aktarım ayarlarını içerir. Belirtim isteği taslakları düzenleme sırasında bellekte kalır; URL çubuğundaki Kaydet bunları uygulamanın oluşturucu süreç depolamasında `powerduck.debug.v1:` altında kalıcılaştırır. Kayıtlar belge kimliği, yol ve yönteme göre ayrılır. Tarayıcı veya masaüstü uygulaması verilerini silmek bu yerel durumu da siler; OAS dosyasını dışa aktarmak bu durumu içermez. Bu depolama **şifrelenmiş bir gizli bilgi kasası değildir**: istek URL'lerinde, başlıklarında veya gövdelerinde açık kimlik bilgileri yerine ortam başvuruları kullanın. Kimlik doğrulama kontrolleri ayrı bir kimlik bilgisi kalıcılaştırma yolu kullanır.

`x-powerduck-request` **resmî bir sözleşme uzantısı değildir**. Belirtime ekleme veya belirtimi güncelleme işlemleri bunu üretmez. Yöntem, parametre, istek gövdesi veya yanıt tanımlamak için kullanılmamalıdır. Bir belgeyi açmak, ilgisiz işlemlerdeki mevcut kopyaları yeniden yazmaz.

## Tanımı açıkça güncelleme

Belirtimi güncelle, hedef yöntem ve yolu önizler; mevcut yanıtları ve şemaları korur. Parametre tanımları yalnızca seçilirse eklenir; hata ayıklama parametre değerleri kopyalanmaz. JSON gövdesi ancak açıkça seçildiğinde örnek olarak eklenir. Yaygın kimlik bilgisi alan adları dışlanır; yine de **yayımlamadan önce serbest metinleri ve örnekleri gözden geçirin**. Betikler ve kimlik doğrulama geçersiz kılmaları sözleşme alanları değildir.

Yöntem veya yol değiştirilerek mevcut bir hedef işlemin üzerine yazılamaz. Yerel işlem başvuruları yeni hedefe yönlendirilir. `PURGE` gibi özel bir yöntem `paths./cache.additionalOperations.PURGE` altında saklanır ve OpenAPI 3.2 gerektirir. Önizleme bu gereksinimi belirtir; güncelleme uygulandığında belge sürümü 3.2.0 olur. Belgeyi kullanacak araçların bu sürümü desteklediğini de kontrol edin.

Protokol şemaları Belgeleri düzenle üzerinden değiştirilebilir. Bu işlem tanımı açıkça değiştirir; hata ayıklama isteğini göndermek veya kaydetmek protokol şemalarını sessizce yeniden yazmaz.

## İndirilebilir resmî örnekler

Bunlar bakımı sürdürülen **örnek tanımlardır**; Powerduck'ın herkese açık API hizmetleri değildir. Tüm uç noktalar sizin sağlayacağınız yerel hizmetlere yönelir. Dosya içe aktarmak hizmetleri başlatmaz, otomatik bağlantı kurmaz veya kimlik bilgisi vermez.

- [Tüm protokoller](https://www.powerduck.com/docs/examples/protocols/all-protocols.yaml)
- [HTTP ve özel PURGE](https://www.powerduck.com/docs/examples/protocols/http.yaml)
- [SSE](https://www.powerduck.com/docs/examples/protocols/sse.yaml)
- [WebSocket](https://www.powerduck.com/docs/examples/protocols/websocket.yaml)
- [GraphQL](https://www.powerduck.com/docs/examples/protocols/graphql.yaml)
- [gRPC](https://www.powerduck.com/docs/examples/protocols/grpc.yaml) ve [echo.proto](https://www.powerduck.com/docs/examples/protocols/echo.proto)
- [MCP Streamable HTTP](https://www.powerduck.com/docs/examples/protocols/mcp.yaml)
- [A2A 1.0 JSON-RPC](https://www.powerduck.com/docs/examples/protocols/a2a.yaml)

gRPC için `echo.proto` dosyasını YAML dosyasının yanına indirin ve gerekirse istemcide gerçek yerel yolunu seçin. Sunucu, 50051 bağlantı noktasında `powerduck.examples.Echo/Echo` hizmetini uygulamalıdır. Diğer örnekler de uyumlu bir sunucu gerektirir; çalışan arka uç doğrulamasının gösterimleri değildir.

## Sözleşme uzantıları başvurusu

Her işlemde normal bir OAS yöntemi, operationId, summary ve responses bulunur. HTTP dışı bağlamalar, belge referans noktası olarak OAS işlemi kullanır; gRPC örneğindeki `post`, gRPC'nin REST uç noktasına dönüştürüldüğü anlamına gelmez.

| Uzantı | Anlamı ve örneklerde kullanılan alanlar |
| --- | --- |
| `x-protocol` | `sse`, `websocket`, `graphql`, `grpc`, `mcp` veya `a2a`. HTTP için atlanabilir. |
| `x-session` | Uzun ömürlü protokol oturumu bildirir; örneklerde WebSocket ve MCP için kullanılır. |
| `x-websocket` | `url`, isteğe bağlı `subprotocols`, `headers` ve `messages`. Belgelenen her iletide `id`, `name`, `type`, `body`, `requestSchema`, `responseSchema` bulunur. Başlıklara kimlik bilgisi koymayın. |
| `x-graphql` | `endpoint`, `query`, `operationName`, `variablesSchema`, yayımlanabilir `variables`, `responseSchema`. |
| `x-grpc` | `address`, `service`, `method`, `kind`, `reflection`, `protoPaths`, `includeDirs` ve belgelenmiş `messages`. `kind`, unary/server_streaming/client_streaming/bidi_streaming değerlerini destekler. Yerel proto yolları dağıtıma bağlıdır. |
| `x-mcp` | `transport`, `endpoint`, `method` ve yönteme özel `name`, `argumentsSchema`, yayımlanabilir `arguments`, `responseSchema`. Kaynak işlemleri `uri` kullanır; ilgisiz yöntem alanlarını birleştirmeyin. |
| `x-a2a` | Açıkça belirtilen `version`, `binding`, `endpoint`, `method`, `requestSchema`, `responseSchema` ve yayımlanabilir `example`. 0.3 ve 1.0 veri yükleri farklıdır; [A2A](./a2a.md) bölümüne bakın. |
| `x-response-stream` | Gerçek sunucu ve aktarım akışı desteklediğinde kullanılan isteğe bağlı GraphQL akış niyeti. Normal GraphQL isteklerinde gerekli değildir. |

SSE, her olayın veri yükünü tanımlamak için standart `responses.200.content.text/event-stream.itemSchema` kullanır. HTTP; standart parametreler, requestBody, responses ve güvenlik şemalarını kullanır. Bir `x-sse` yapılandırma bloğu uydurmayın veya hata ayıklama durumunu sözleşme uzantısı olarak saklamayın.

Örnekler, birbirini dışlayan tüm seçenekleri değil, seçilen bağlama için eksiksiz ve kullanılabilir yapılandırmaları içerir. MCP stdio ayrı yapılandırılmış yerel bir çalıştırılabilir dosya gerektirir; indirilebilir örnekler bunu bilinçli olarak otomatik başlatmaz.

## Paket entegrasyonu

Masaüstü arayüzü, yerel hata ayıklama durumunun kalıcılaştırılmasını ve açık belirtim yazımlarını yönetir. `@powerduck/openapi-parser`, özel yöntemleri zaten `additionalOperations` üzerinden okur; `@powerduck/tree` ve `@powerduck/oas-document` bu sözleşme yapısını kullanır. `@powerduck/openapi-request`, çalışma zamanı argümanlarını belirtimden ayrı alır. İstek yürütmek için `x-powerduck-request` gerekmez.

Kaydetme ayrımı, herkese açık yeni npm parametreleri getirmez. Sözleşme verileri için mevcut protokol uzantılarını kullanın ve geçerli hata ayıklama değerlerini istek yürütme API'sine iletin. Dışa aktarıcıları, üreticileri veya MCP araçlarını özel istek durumu yapısına bağımlı hâle getirmeyin.
