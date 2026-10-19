---
sidebar_position: 5
title: "CLI komutları"
description: "Paket tek bir yürütülebilir komut sağlar: openapi-cli. Seçenekleri doğrudan alır; run / validate / init alt komutları yoktur:"
---

# CLI komutları

Paket tek bir yürütülebilir komut sağlar: `openapi-cli`. Seçenekleri doğrudan alır; `run` / `validate` / `init` alt komutları **yoktur**:

```
openapi-cli [options]
```

## Sözdizimi

```bash
openapi-cli --spec openapi.json [options]
openapi-cli -c config.json
```

Bir belirtim **zorunludur**: `--spec` (veya `-s`) verin ya da `--config` ile yüklenen JSON yapılandırma dosyasında `specPath` ayarlayın. Diğer seçenekler isteğe bağlıdır.

## Temel seçenekler

| Seçenek | Kısa biçim | Varsayılan | Açıklama |
|--------|-------|---------|-------------|
| `--spec <path-or-url>` | `-s` | — | OpenAPI 3.2 JSON belirtiminin dosya yolu veya `http(s)://` URL'si |
| `--server <url>` | `-S` | *(belirtimden)* | Belirtimdeki sunucu URL'sini geçersiz kılma |
| `--output <dir>` | `-o` | `./openapi-cli-report` | Raporların çıktı dizini |
| `--format <formats>` | `-f` | `json,cli,html` | Virgülle ayrılmış rapor biçimleri: `json`, `cli`, `html` |
| `--config <path>` | `-c` | — | JSON yapılandırma dosyası yolu; CLI argümanları önceliklidir |

## Yürütme seçenekleri

| Seçenek | Kısa biçim | Varsayılan | Açıklama |
|--------|-------|---------|-------------|
| `--concurrency <n>` | `-n` | `5` | En fazla eşzamanlı istek sayısı; 1 ile 100 arasında tam sayı |
| `--timeout <ms>` | `-t` | `30000` | İstek başına ms cinsinden zaman aşımı; 1 ile 600000 arasında tam sayı. Uzak belirtim alınırken de kullanılır |
| `--no-fail-on-error` | — | kapalı | Tamamlanan bir çalıştırmadan sonra testler başarısız olsa bile `0` döndürme; yapılandırma hataları ve ölümcül hatalar yine başarısızlıkla sonuçlanır |

## Filtre seçenekleri

| Seçenek | Varsayılan | Açıklama |
|--------|---------|-------------|
| `--method <methods>` | — | Dahil edilecek HTTP yöntemleri, virgülle ayrılmış; ör. `get,post` |
| `--path <patterns>` | — | Her yolla eşleştirilecek, virgülle ayrılmış düzenli ifade kalıpları |
| `--tag <tags>` | — | Dahil edilecek, virgülle ayrılmış OpenAPI etiketleri |
| `--operation-id <ids>` | — | Dahil edilecek, virgülle ayrılmış `operationId` değerleri |

## Ağ ve TLS seçenekleri

| Seçenek | Kısa biçim | Varsayılan | Açıklama |
|--------|-------|---------|-------------|
| `--proxy <url>` | `-p` | — | HTTP(S) proxy URL'si; ör. `http://proxy.corp:8080` |
| `--ca <path>` | — | — | PEM biçiminde CA sertifika paketi |
| `--cert <path>` | — | — | mTLS için PEM istemci sertifikası |
| `--key <path>` | — | — | mTLS için PEM istemci özel anahtarı |
| `--insecure` | `-k` | kapalı | TLS sertifika doğrulamasını atlama |

## Kimlik doğrulama, başlıklar ve değişkenler

| Seçenek | Kısa biçim | Açıklama |
|--------|-------|-------------|
| `--header <headers...>` | `-H` | `Key: Value` biçiminde ek başlıklar; tekrarlanabilir |
| `--bearer <token>` | — | `Authorization` başlığında gönderilen Bearer belirteci |
| `--variable <vars...>` | `-v` | `KEY=VALUE` biçiminde Postman değişkenleri; tekrarlanabilir |
| `--env <path>` | — | `.env` dosyası yolu; mevcut ortam değişkenlerini geçersiz kılmaz |

## gRPC seçenekleri

| Seçenek | Varsayılan | Açıklama |
|--------|---------|-------------|
| `--grpc-no-reflection` | kapalı | gRPC sunucu yansımasını devre dışı bırakıp proto dosyalarını kullanma |
| `--grpc-proto <paths...>` | — | `.proto` dosyalarının veya bunları içeren dizinlerin yolları |

## MCP seçenekleri

| Seçenek | Varsayılan | Açıklama |
|--------|---------|-------------|
| `--mcp-transport <transport>` | `streamable-http` | MCP taşıması: `streamable-http` veya `stdio` |
| `--mcp-command <command>` | — | MCP stdio komutu; ör. `npx` |
| `--mcp-args <args>` | — | Boşluk veya virgülle ayrılmış MCP stdio argümanları |
| `--mcp-cwd <dir>` | — | MCP stdio alt sürecinin çalışma dizini |

## Bilgi seçenekleri

| Seçenek | Kısa biçim | Açıklama |
|--------|-------|-------------|
| `--help` | `-h` | Yardımı gösterme |
| `--version` | `-V` | Sürümü gösterme |

## Çıkış kodları

| Kod | Anlam |
|------|---------|
| `0` | Tüm testler başarılı veya `--no-fail-on-error` ayarlanmış |
| `1` | Bir veya daha fazla test başarısız ya da hatalı, veya CLI argümanlarının ayrıştırılması başarısız |
| `2` | Yapılandırma hatası, belirtim yükleme hatası veya ölümcül çalışma zamanı hatası |

Örneğin ne `--spec` ne de yapılandırılmış bir `specPath` sağlandığında `resolveConfig` hata fırlatır; CLI kırmızı `Error:` yazdırıp `2` ile çıkar. `runTests` hata fırlatırsa `Fatal error:` yazdırıp `2` ile çıkar. Tamamlanan bir çalıştırmadan sonra yalnızca `report.summary.failed > 0 || report.summary.errors > 0` ve `failOnError !== false` koşullarında `1` döndürür.

## Ortam değişkenleri

Özel `OPENAPI_CLI_*` değişkenleri yoktur. Yapılandırma seçenekler, yapılandırma dosyası ve aşağıdaki mekanizmalarla sağlanır:

- **`.env` dosyası** — `KEY=VALUE` çiftlerini `process.env` içine yüklemek için `--env .env` verin. Mevcut değişkenlerin üzerine yazılmaz.
- **`${VAR}` genişletmesi** — yüklemeden sonra `serverUrl`, `proxy`, `headers` değerleri, `auth.token` ve `variables` değerleri içindeki `${VAR_NAME}` yerine ilgili değer konur.

```bash
openapi-cli --spec openapi.json \
  --env .env \
  --server 'https://${API_HOST}/v1' \
  --bearer '${BEARER_TOKEN}'
```

## Çalıştırma örnekleri

```bash
# Test a local spec against its first server URL
openapi-cli --spec openapi.json

# Override the server and write JSON + HTML reports
openapi-cli --spec openapi.json \
  --server https://api.staging.example.com \
  --format json,html --output ./reports

# Only GET requests, 10 workers, with a bearer token
openapi-cli --spec openapi.json --method get --concurrency 10 --bearer "$TOKEN"

# Use a config file
openapi-cli --config openapi-cli.config.json
```
