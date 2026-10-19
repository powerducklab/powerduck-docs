---
sidebar_position: 5
title: "Örnekler"
description: "Gerçekte desteklenen CLI seçeneklerini ve programlama API'sini kullanan @powerduck/openapi-cli örnekleri."
---

# Örnekler

Gerçekte desteklenen CLI seçeneklerini ve programlama API'sini kullanan `@powerduck/openapi-cli` örnekleri.

## 1. Temel CLI testi

Tüm işlemleri çalıştırmak için yerel bir OpenAPI belgesi belirtin:

```bash
openapi-cli --spec openapi.json
```

Sunucuyu değiştirin ve raporları özel bir dizine yazın:

```bash
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --output ./reports
```

Uzak bir URL'de barındırılan belirtimi test edin:

```bash
openapi-cli --spec https://docs.example.com/openapi.json --timeout 60000
```

## 2. Kimlik doğrulamayla kod içinden çalıştırma

Kütüphane API'sini Bearer belirteci, özel başlıklar ve eşzamanlılık ayarıyla kullanın:

```typescript
import {
  resolveConfig,
  runTests,
  printCliReport,
  generateJsonReport,
  generateHtmlReport,
} from "@powerduck/openapi-cli";

const config = resolveConfig({
  spec: "./openapi.json",
  server: "https://api.staging.example.com",
  concurrency: 10,
  timeout: 15000,
  bearer: process.env.BEARER_TOKEN,
  header: ["X-Environment: staging", "X-Team: platform"],
});

const report = await runTests(config);

printCliReport(report);
generateJsonReport(report, "./reports");
generateHtmlReport(report, "./reports");

console.log(
  `Passed ${report.summary.passed}/${report.summary.total} (${report.summary.passRate}%)`,
);
```

## 3. Filtrelenmiş test çalıştırma

Yöntem, etiket, yol düzenli ifadesi veya operationId ile işlemlerin yalnızca bir bölümünü çalıştırın:

```bash
# Only GET and POST requests
openapi-cli --spec openapi.json --method get,post

# Only operations tagged "public" or "v2"
openapi-cli --spec openapi.json --tag public,v2

# Only paths under /api/v2
openapi-cli --spec openapi.json --path "^/api/v2"

# Only specific operations
openapi-cli --spec openapi.json --operation-id getUser,createUser
```

Bu filtreleri birleştiren kod yapılandırması: farklı filtre kategorileri VE ile birleştirilir; aynı kategorideki etiketler VEYA ile eşleştirilir.

```typescript
const config = resolveConfig({
  spec: "./openapi.json",
  method: "get,post",
  tag: "public,v2",
  path: "^/api/v2",
  operationId: "getUser,createUser",
});
```

## 4. JSON ve HTML raporları oluşturma

Çıktı biçimlerini `--format` ile seçin. Varsayılan olarak üçü de üretilir:

```bash
# CLI to stdout only, no files
openapi-cli --spec openapi.json --format cli

# JSON + HTML files, no colored stdout report
openapi-cli --spec openapi.json --format json,html --output ./reports
```

Kod içindeki karşılığı:

```typescript
import { resolveConfig, runTests, generateJsonReport, generateHtmlReport } from "@powerduck/openapi-cli";

const config = resolveConfig({
  spec: "./openapi.json",
  format: "json,html",
  output: "./reports",
});

const report = await runTests(config);

const jsonPath = generateJsonReport(report, config.outputDir);
const htmlPath = generateHtmlReport(report, config.outputDir);

console.log("Wrote", jsonPath, "and", htmlPath);
```

`generateJsonReport`, `report.json` dosyasını; `generateHtmlReport` ise `report.html` dosyasını yazar. Her ikisi de çıktı dizini yoksa oluşturur ve dosya yolunu döndürür.

## 5. Belirtimde bildirimsel doğrulamalar

Bir işleme `x-tests` dizisi ekleyin. Her girdide bir `name` ve `assert` türü gerekir:

```json
{
  "paths": {
    "/users/{id}": {
      "get": {
        "operationId": "getUser",
        "x-tests": [
          { "name": "status is 200", "assert": "status", "value": 200 },
          { "name": "content-type is JSON", "assert": "header", "key": "content-type", "contains": "application/json" },
          { "name": "user id exists", "assert": "jsonPath", "path": "$.id", "exists": true },
          { "name": "user is active", "assert": "jsonPath", "path": "$.status", "equals": "active" },
          { "name": "response under 2s", "assert": "responseTime", "max": 2000 },
          { "name": "body contains email", "assert": "bodyContains", "contains": "@" }
        ],
        "responses": { "200": { "description": "ok" } }
      }
    }
  }
}
```

Doğrulama türleri:

| `assert` | Zorunlu alanlar | Amaç |
|----------|-----------------|---------|
| `status` | `value` | HTTP durumu `value` değerine eşittir |
| `header` | `key`; isteğe bağlı `contains` | Başlık vardır; isteğe bağlı olarak bir alt dize içerip içermediği denetlenir |
| `bodyContains` | `contains` | Yanıt gövdesi alt dizeyi içerir |
| `bodyEquals` | `body` | Yanıt gövdesi tam olarak `body` değerine eşittir |
| `jsonPath` | `path`; isteğe bağlı `equals` / `exists` | JSONPath'i çözümleyip değeri karşılaştırma veya varlığını denetleme |
| `responseTime` | `max` | Süre `<= max` ms olmalıdır |

## 6. Postman betikleri

`x-postman-scripts` üzerinden Postman tarzı bir test betiği gömün:

```json
{
  "paths": {
    "/users": {
      "get": {
        "operationId": "listUsers",
        "x-postman-scripts": {
          "test": "pm.test('status is 200', () => pm.response.to.have.status(200)); pm.test('users is an array', () => pm.expect(pm.response.json().users).to.be.an('array'));"
        },
        "responses": { "200": { "description": "ok" } }
      }
    }
  }
}
```

Bildirimsel `x-tests` ve `x-postman-scripts` aynı işlemde birlikte bulunabilir.

## 7. GitHub Actions ile CI entegrasyonu

```yaml
name: API Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - name: Run API tests
        run: npx @powerduck/openapi-cli --spec openapi.json --server "$API_URL" --bearer "$BEARER_TOKEN" --output ./reports
        env:
          API_URL: ${{ secrets.API_URL }}
          BEARER_TOKEN: ${{ secrets.BEARER_TOKEN }}
      - name: Upload reports
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: openapi-cli-reports
          path: ./reports
```

Varsayılan olarak başarısız testler `1`, yapılandırma veya ölümcül çalışma zamanı hataları `2` çıkış kodunu döndürür; böylece CI işi başarısız olur. Tamamlanmış bir test çalıştırmasının işlem hattını başarısız kılmaması için `--no-fail-on-error` kullanın; bu seçenek yapılandırma hatalarını veya ölümcül hataları bastırmaz.
