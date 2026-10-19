---
sidebar_position: 1
title: "Giriş"
description: "@powerduck/openapi-cli, bir OpenAPI 3.2 belgesini çalışan bir sunucuya karşı toplu olarak test eden komut satırı aracıdır. Bir belirtim dosyası veya URL verin: belgedeki işlemleri çalıştırır, her yanıtı doğrulamalarla denetler ve üç biçimde rapor üretir."
---

# Giriş

`@powerduck/openapi-cli`, bir OpenAPI 3.2 belgesini çalışan bir sunucuya karşı toplu olarak test eden komut satırı aracıdır. Bir belirtim dosyası veya URL verin: belgedeki işlemleri çalıştırır, her yanıtı doğrulamalarla denetler ve üç biçimde rapor üretir.

İstek yürütmek için [`@powerduck/openapi-request`](https://www.npmjs.com/package/@powerduck/openapi-request), `$ref` başvurularını çözümlemek için [`@powerduck/openapi-parser`](https://www.npmjs.com/package/@powerduck/openapi-parser) kullanır.

## Neden openapi-cli?

- **CI için hazır** — varsayılan olarak sıfırdan farklı çıkış kodu, test başarısızlığını veya yürütme hatasını bildirir. GitHub Actions, GitLab CI veya başka bir işlem hattına doğrudan entegre edilebilir.
- **Yerleşik çoklu protokol desteği** — tek bir belirtim HTTP, SSE, WebSocket, GraphQL, gRPC ve MCP işlemlerini tanımlayabilir; aynı çalıştırıcı tümünü işler.
- **İki doğrulama biçimi** — basit kontroller için bildirimsel `x-tests` dizileri, karmaşık durumlar için Postman tarzı `pm.test()` / `pm.expect()` betikleri.
- **Üç rapor biçimi** — makine tarafından okunabilir JSON, okunaklı renkli CLI çıktısı ve bağımsız etkileşimli HTML raporu.
- **Yerel veya uzak belirtimler** — dosya yolundan ya da `http(s)://` URL'sinden yükleme; yönlendirmeleri izleme ve zaman aşımı desteği.
- **Esnek filtreleme** — yöntem, yol, etiket veya operationId ile işlem seçimi ve sınırlı eşzamanlılık.

## Desteklenen protokoller

Çalıştırıcı, her işlemin protokolünü OpenAPI uzantılarından veya yanıt içerik türlerinden algılar:

| Protokol | Tanımlayıcı | Seçilme koşulu |
|----------|-----------|--------------------|
| HTTP | `http` | Standart işlemler için varsayılan |
| Sunucudan gönderilen olaylar | `sse` | Yanıt içerik türü `text/event-stream` veya `x-response-stream: true` |
| WebSocket | `websocket` | `x-protocol: "websocket"` |
| GraphQL | `graphql` | `x-protocol: "graphql"` |
| gRPC | `grpc` | `x-protocol: "grpc"` |
| MCP | `mcp` | `x-protocol: "mcp"` |

Protokol, işlem veya yol öğesi üzerindeki `x-protocol` uzantısıyla açıkça da belirtilebilir.

## Raporlar

Çalıştırma tamamlandığında araç aşağıdaki çıktıları üretir; dosyalar varsayılan olarak `./openapi-cli-report` dizinine yazılır:

- `report.json` — biçimlendirilmiş JSON olarak tam `TestReport` nesnesi.
- `report.html` — özet şeridi, ilerleme çubuğu, filtre düğmeleri ve genişletilebilir test satırları içeren, bağımlılıksız ve bağımsız HTML raporu.
- Standart çıktı — ilerleme çubuğu ve test başına doğrulamalar içeren renkli CLI özeti.

## Kod içinden kullanım

Aynı akış kütüphane olarak da kullanılabilir. Yapılandırmayı çözümleyin, testleri çalıştırın ve istediğiniz rapor oluşturucularını seçin:

```ts
import { resolveConfig, runTests, printCliReport, generateJsonReport } from "@powerduck/openapi-cli";

const config = resolveConfig({ spec: "./openapi.json" });
const report = await runTests(config);
printCliReport(report);
generateJsonReport(report, "./reports");
```

## Sonraki adımlar

- [Kurulum](./installation.md) — genel olarak veya geliştirme bağımlılığı olarak kurulum.
- [Hızlı başlangıç](./quickstart.md) — ilk test paketini çalıştırma.
- [Yapılandırma](./configuration.md) — eksiksiz `CliConfig` başvurusu.
- [Komutlar](./commands.md) — tüm CLI seçenekleri ve çıkış kodları.
- [API başvurusu](./api-reference.md) — dışa aktarılan tüm işlevler ve türler.
- [Örnekler](./examples.md) — çalıştırmaya hazır örnekler.
