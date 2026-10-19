---
sidebar_position: 6
title: "Yapılandırma"
description: "Çözümleme önceliği CLI argümanları > yapılandırma dosyası > varsayılanlar şeklindedir. Sonuç, resolveConfig tarafından döndürülen CliConfig nesnesidir."
---

# Yapılandırma

Çözümleme önceliği **CLI argümanları > yapılandırma dosyası > varsayılanlar** şeklindedir. Sonuç, [`resolveConfig`](./api-reference.md#resolveconfig) tarafından döndürülen `CliConfig` nesnesidir.

## CliConfig

Temel yapılandırma türüdür. `specPath` dışındaki tüm alanlar isteğe bağlıdır.

| Alan | Tür | Varsayılan | Açıklama |
|-------|------|---------|-------------|
| `specPath` | `string` | **zorunlu** | OpenAPI 3.2 JSON belirtiminin yolu veya `http(s)://` URL'si |
| `serverUrl` | `string` | *(belirtimden)* | Belirtimdeki sunucu temel URL'sini geçersiz kılma |
| `outputDir` | `string` | `"./openapi-cli-report"` | Rapor dosyalarının yazılacağı dizin |
| `formats` | `ReportFormat[]` | `["json","cli","html"]` | Üretilecek rapor biçimleri |
| `filter` | `FilterConfig` | `undefined` | Test edilecek işlemleri filtreleme |
| `concurrency` | `number` | `5` | En fazla eşzamanlı istek sayısı; 1 ile 100 arasında tam sayı |
| `timeout` | `number` | `30000` | İstek başına ms cinsinden zaman aşımı; 1 ile 600000 arasında tam sayı. Uzak belirtim alınırken de geçerlidir |
| `proxy` | `string` | `undefined` | HTTP(S) proxy URL'si; ör. `http://proxy:8080` |
| `tls` | `TlsConfig` | `undefined` | TLS ve sertifika yapılandırması |
| `headers` | `Record<string, string>` | `undefined` | Her istekle gönderilen ek başlıklar |
| `auth` | `AuthConfig` | `undefined` | Kimlik doğrulama yapılandırması |
| `variables` | `Record<string, string>` | `undefined` | Eklenecek Postman `{{name}}` değişkenleri |
| `failOnError` | `boolean` | `true` | Yalnızca CLI: başarısız testten sonra sıfırdan farklı kod döndürme; kütüphane çağıranları raporu denetler |
| `envFile` | `string` | `undefined` | Her satırında `KEY=VALUE` bulunan `.env` dosyasının yolu |
| `grpcReflection` | `boolean` | otomatik | gRPC: önce açık yapılandırma, sonra işlem uzantısı kullanılır; ikisi de yoksa proto yolu verilmediğinde etkinleştirilir |
| `grpcProtoPaths` | `string[]` | `undefined` | gRPC: `.proto` dosya veya dizin yolları |
| `mcpTransport` | `"streamable-http" \| "stdio"` | `"streamable-http"` | MCP: MCP işlemlerinin taşıması |
| `mcpCommand` | `string` | `undefined` | MCP stdio: başlatılacak komut |
| `mcpArgs` | `string[]` | `undefined` | MCP stdio: komut argümanları |
| `mcpCwd` | `string` | `undefined` | MCP stdio: çalışma dizini |

`ReportFormat`, `"json" | "cli" | "html"` birleşim türüdür.

## Gelişmiş çalışma zamanı seçenekleri

Aşağıdaki alanlar da `CliConfig` kapsamındadır. `requester`, `maxEvents`, `maxStreamMs` ve `maxResponseSize` bir JSON dosyasında verilebilir. Yapılandırmayı çözümledikten sonra `signal`, `httpRuntime` ve `resolveTransport` alanlarını koddan doğrudan `runTests()` işlevine geçirin; bunlar JSON yapılandırması değil, çalışma zamanı nesneleridir.

```typescript
interface AdvancedRuntimeOptions {
  requester?: {
    followRedirects?: boolean;
    maxRedirects?: number;
    disableCookies?: boolean;
    protocolVersion?: "http1" | "http2" | "auto";
  };
  maxEvents?: number;
  maxStreamMs?: number;
  maxResponseSize?: number;
  signal?: AbortSignal;
  httpRuntime?: { certificates?: unknown; fileResolver?: unknown };
  resolveTransport?: (target: { protocol: string; url?: string }) => Promise<
    Pick<CliConfig, "proxy" | "tls" | "httpRuntime">
  >;
}
```

`requester`, HTTP yönlendirmelerini, çerezleri ve protokol seçimini kontrol eder. HTTP/SSE için `maxEvents` varsayılanı 50'dir; `maxStreamMs` verilmezse `timeout` kullanılır. `maxResponseSize`, istek çalışma zamanına iletilir. gRPC akış son süresi için `maxStreamMs`, ardından `timeout`, son olarak 30000 ms kullanır. `signal` çalıştırmayı iptal eder; `httpRuntime`, HTTP sertifika ve dosya işlemesini sağlar; `resolveTransport`, hedef başına taşıma ayarlarını çözümler.

## DEFAULT_CONFIG

Kütüphanenin dışa aktardığı yerleşik varsayılanlar nesnesi:

```ts
export const DEFAULT_CONFIG: Required<
  Pick<
    CliConfig,
    "outputDir" | "formats" | "concurrency" | "timeout" | "failOnError" | "grpcReflection" | "mcpTransport"
  >
> = {
  outputDir: "./openapi-cli-report",
  formats: ["json", "cli", "html"],
  concurrency: 5,
  timeout: 30000,
  failOnError: true,
  grpcReflection: true,
  mcpTransport: "streamable-http",
};
```

## FilterConfig

| Alan | Tür | Açıklama |
|-------|------|-------------|
| `methods` | `string[]` | Yalnızca bu HTTP yöntemlerini test etme; ör. `["get","post"]`. Dosyalarda küçük harf kullanın; CLI girdisi normalleştirilir |
| `paths` | `string[]` | Yalnızca düzenli ifadelerden biriyle eşleşen yolları test etme; ifade geçersizse alt dize eşleştirmesi kullanılır |
| `tags` | `string[]` | Yalnızca bu etiketlerden birini taşıyan işlemleri test etme |
| `operationIds` | `string[]` | Yalnızca tam olarak bu `operationId` değerlerini test etme |

Hiç anahtarı olmayan filtre `undefined` olarak çözümlenir; tüm işlemler çalışır.

## TlsConfig

| Alan | Tür | Açıklama |
|-------|------|-------------|
| `caCert` | `string` | PEM biçiminde CA sertifika paketinin yolu |
| `clientCert` | `string` | mTLS için PEM istemci sertifikasının yolu |
| `clientKey` | `string` | mTLS için PEM istemci özel anahtarının yolu |
| `strictSSL` | `boolean` | `false` olduğunda TLS sertifika doğrulamasını atlama; güvenli değildir |
| `pfx` | `string` | PFX sertifika paketinin yolu; gRPC bunun yerine PEM gerektirir |
| `passphrase` | `string` | Şifrelenmiş sertifika materyalinin parolası |

> Not: CLI seçeneği `--insecure`, `tls.strictSSL = false` değerine karşılık gelir; yani doğrulamayı **devre dışı bırakır**.

## AuthConfig

| Alan | Tür | Açıklama |
|-------|------|-------------|
| `type` | `AuthConfig["type"]` | Kimlik doğrulama şeması; desteklenen adlar aşağıdadır |
| `parameters` | `Record<string, string \| number \| boolean>` | İstek çalışma zamanına iletilen şemaya özgü parametreler |
| `token` | `string` | `type: "bearer"` için Bearer belirteci |
| `username` | `string` | `type: "basic"` için kullanıcı adı |
| `password` | `string` | `type: "basic"` için parola |
| `key` | `string` | `type: "apikey"` için API anahtarı adı |
| `value` | `string` | `type: "apikey"` için API anahtarı değeri |
| `in` | `"header" \| "query"` | API anahtarının yerleştirileceği konum |

Desteklenen `type` değerleri `bearer`, `basic`, `apikey`, `none`, `digest`, `oauth1`, `oauth2`, `jwt`, `hawk`, `aws4`, `ntlm`, `asap` ve `edgegrid` şeklindedir. Kullanılabilirlik ve gerekli parametreler protokole ve istek çalışma zamanına bağlıdır; yalnızca ad belirtmek kimlik doğrulamayı yapılandırmaz.

CLI seçeneği `--bearer` şu anda yalnızca `{ type: "bearer", token }` üretir. Daha kapsamlı `basic` / `apikey` yapılandırmaları dosyadan verilir.

## JSON yapılandırma dosyası

Dosya, `Partial<CliConfig>` ile eşleşen düz JSON'dur. `--config <path>` / `-c` ile verin. CLI argümanları her zaman dosya değerlerinden önce gelir.

```json
{
  "specPath": "./openapi.json",
  "serverUrl": "https://api.staging.example.com",
  "outputDir": "./reports",
  "formats": ["json", "html"],
  "concurrency": 10,
  "timeout": 15000,
  "failOnError": true,
  "proxy": "http://proxy.corp:8080",
  "tls": {
    "strictSSL": true,
    "caCert": "./ca-bundle.pem",
    "clientCert": "./client.crt",
    "clientKey": "./client.key"
  },
  "headers": {
    "X-API-Key": "${API_KEY}",
    "X-Environment": "staging"
  },
  "auth": {
    "type": "bearer",
    "token": "${BEARER_TOKEN}"
  },
  "variables": {
    "host": "api.staging.example.com"
  },
  "filter": {
    "methods": ["get", "post"],
    "tags": ["v2", "public"],
    "paths": ["^/api/v2"],
    "operationIds": ["getUser", "createUser"]
  },
  "grpcReflection": true,
  "grpcProtoPaths": ["./proto"],
  "mcpTransport": "streamable-http",
  "mcpCommand": "npx",
  "mcpArgs": ["-y", "@modelcontextprotocol/server-everything"],
  "mcpCwd": "./mcp-servers"
}
```

Eksik dosya `Config file not found: <path>`, geçersiz JSON ise `Invalid config file (must be JSON)` hatasını oluşturur.

## Ortam değişkeni genişletmesi

Bir `.env` dosyası `--env` / `envFile` ile yüklendikten sonra `${VAR_NAME}` başvuruları şu dize alanlarında genişletilir:

- `serverUrl`
- `proxy`
- `headers` değerleri
- `auth.token`
- `variables` değerleri

Örnek:

```bash
openapi-cli --spec openapi.json \
  --server 'https://${API_HOST}/v1' \
  --header 'Authorization: Bearer ${BEARER_TOKEN}'
```

`.env` davranışı: mevcut `process.env` girdilerinin üzerine **yazılmaz**; değerleri çevreleyen tek veya çift tırnaklar kaldırılır; boş satırlar ve `#` yorum satırları yok sayılır; eksik dosya sessizce atlanır.

## Koddan yapılandırma oluşturma

```typescript
import { resolveConfig, DEFAULT_CONFIG } from "@powerduck/openapi-cli";

const config = resolveConfig({
  spec: "./openapi.json",
  server: "https://api.staging.example.com",
  concurrency: 10,
  method: "get",
});
```

Belirtim verilmediğinde `resolveConfig`, `"No OpenAPI spec path provided..."` hatasını; `proxy` geçerli bir URL olmadığında ise `Invalid proxy URL: <url>` hatasını fırlatır.
