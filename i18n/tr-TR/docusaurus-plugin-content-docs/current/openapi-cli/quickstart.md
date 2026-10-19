---
sidebar_position: 3
title: "Hızlı başlangıç"
description: "@powerduck/openapi-cli ile ilk toplu testinizi CLI ve Node.js üzerinden çalıştırın."
---

# Hızlı başlangıç

Bu kılavuz, ilk OpenAPI belgenizi test etme adımlarını gösterir.

## Ön koşullar

- Node.js `>= 22.12.0`.
- **JSON** biçiminde bir OpenAPI 3.2 belgesi. YAML kabul edilmez; önce JSON’a dönüştürün. Belgenin en üst düzeyinde bir `paths` nesnesi bulunmalıdır.

## 1. CLI üzerinden çalıştırma

En basit çalıştırma yerel bir belirtimi yükler ve tüm işlemleri belgede tanımlanan ilk sunucu URL’sine karşı test eder:

```bash
openapi-cli --spec openapi.json
```

Hedef sunucuyu değiştirin ve raporları seçtiğiniz dizine yazın:

```bash
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --output ./reports
```

Uzak bir belirtimde yalnızca `GET` işlemlerini 10 eşzamanlı worker ile test edin:

```bash
openapi-cli --spec https://docs.example.com/openapi.json \
  --method get \
  --concurrency 10
```

Karmaşık ayarlar için JSON yapılandırma dosyası kullanın:

```bash
openapi-cli --config openapi-cli.config.json
```

Tüm seçenekler için bakın: [Komutlar](/docs/tr-TR/openapi-cli/commands/).

## 2. En küçük test belirtimini yazma

Bildirimsel doğrulamalar içeren en küçük OpenAPI belgesi:

```json
{
  "openapi": "3.2.0",
  "info": { "title": "Demo API", "version": "1.0.0" },
  "servers": [{ "url": "https://httpbin.org" }],
  "paths": {
    "/get": {
      "get": {
        "operationId": "getGet",
        "responses": { "200": { "description": "ok" } },
        "x-tests": [
          { "name": "status is 200", "assert": "status", "value": 200 },
          { "name": "response under 5s", "assert": "responseTime", "max": 5000 }
        ]
      }
    }
  }
}
```

Bir işlem **hiçbir** doğrulama tanımlamıyorsa çalıştırıcı örtük bir protokol başarı kontrolü ekler. HTTP için `2xx` durumu gerekir; böylece 4xx/5xx yanıtları sessizce başarılı sayılmaz.

## 3. Node.js üzerinden çalıştırma (programlama API’si)

Kütüphane aynı akışı işlevlerle sunar: `resolveConfig` → `runTests` → rapor üreticileri.

```typescript
import {
  resolveConfig,
  runTests,
  printCliReport,
  generateJsonReport,
  generateHtmlReport,
} from "@powerduck/openapi-cli";

// 1. Build a CliConfig from CLI-style args.
const config = resolveConfig({
  spec: "./openapi.json",
  server: "https://api.staging.example.com",
  concurrency: 10,
});

// 2. Run all collected tests.
const report = await runTests(config);

// 3. Emit the reports you need.
printCliReport(report);
generateJsonReport(report, "./reports");
generateHtmlReport(report, "./reports");

// 4. Exit with the correct code for CI.
if (report.summary.failed > 0 || report.summary.errors > 0) {
  process.exit(1);
}
```

`resolveConfig`, CLI ile aynı seçenek yapısını kabul eder. `runTests`; `summary`, `results`, `config`, `generatedAt` ve `version` içeren bir `TestReport` döndürür. [Yapılandırma](/docs/tr-TR/openapi-cli/configuration/).

## 4. CI için çıkış kodları

| Kod | Anlamı |
|---|---|
| `0` | Tüm testler geçti veya `--no-fail-on-error` ayarlandı. |
| `1` | Bir veya daha fazla test başarısız oldu ya da hatayla sonuçlandı. |
| `2` | Yapılandırma hatası, belirtim yükleme hatası veya kritik çalışma zamanı hatası. |

## Sonraki adımlar

- [Yapılandırma](/docs/tr-TR/openapi-cli/configuration/) — tüm `CliConfig` alanları ve varsayılan değerleri.
- [Komutlar](/docs/tr-TR/openapi-cli/commands/) — tüm CLI seçenekleri.
- [Örnekler](/docs/tr-TR/openapi-cli/examples/) — kimlik doğrulama, filtreleme, raporlar ve doğrulamalar.
- [API başvurusu](/docs/tr-TR/openapi-cli/api-reference/) — dışa aktarılan tüm işlev ve türler.
