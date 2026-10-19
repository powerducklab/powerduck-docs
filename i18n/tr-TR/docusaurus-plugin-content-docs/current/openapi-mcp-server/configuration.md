---
sidebar_position: 4
title: "Yapılandırma"
description: "@powerduck/openapi-mcp-server için tam yapılandırma: ServerConfig, SecurityContext, ExecutionContext, TransportMode ve kaynak, durum, protokol, günlük düzeyi ve gövde kodlaması için değişmez değer birleşimleri."
---

# Yapılandırma

Temel yapılandırma nesnesi, `startAdminServer()` tarafından kabul edilen `ServerConfig` nesnesidir. İlgili bağlam türleri araç yürütmesinde kullanılır.

## `ServerConfig`

Yalnızca `port` zorunludur.

| Alan | Tür | Varsayılan | Açıklama |
| --- | --- | --- | --- |
| `port` | `number` | — (zorunlu) | Dinlenecek TCP bağlantı noktası; 0–65535 arasında tam sayı. |
| `host` | `string` | `"127.0.0.1"` | Dinlenecek arayüz; yanlışlıkla dış erişime açılmasını önlemek için varsayılan olarak geri döngü kullanılır. |
| `apiKey` | `string` | undefined | Ayarlandığında yönetim API’si ve HTTP aktarımının gerektirdiği ortak sır. |
| `specPath` | `string` | undefined | Başlangıçta bir kez yüklenen belirtim. |
| `baseUrlOverride` | `string` | undefined | `servers[0].url` üzerinden alınan hedef hizmetin temel URL’sini geçersiz kılar. |
| `upstreamHeaders` | `Record<string, string>` | undefined | Her hedef hizmet isteğine eklenen üst bilgiler. |
| `requestTimeoutMs` | `number` | undefined | Hedef hizmet isteği başına milisaniye cinsinden zaman aşımı. |
| `persistState` | `boolean` | `true` | Yüklenen belirtimi yeniden başlatmalar arasında korur. |
| `stateFilePath` | `string` | undefined | Kalıcı durum dosyasının konumu. |
| `allowedOrigins` | `string[]` | undefined | İzin verilen CORS kaynakları; boş bırakmak veya belirtmemek kaynaklar arası erişimi devre dışı bırakır. |
| `allowedHosts` | `string[]` | undefined | İzin verilen `Host` üst bilgisi değerleri. |
| `maxLogEntries` | `number` | 200 | Bellekte tutulan en fazla günlük kaydı sayısı. |
| `redactSensitiveHeaders` | `boolean` | `true` | Günlüğe yazmadan önce hassas üst bilgi değerlerini maskeler. |
| `redactHeaderNames` | `string[]` | undefined | Yerleşik listeye ek olarak maskelenecek üst bilgi adları. |
| `security` | `SecurityContext` | undefined | Her araç çağrısında hedef API’ye iletilen kimlik bilgileri. |

## `SecurityContext`

| Alan | Tür | Gönderim biçimi |
| --- | --- | --- |
| `bearerToken` | `string` | `Authorization: Bearer <token>` |
| `basicAuth` | `{ username, password }` | `Authorization: Basic <base64>` |
| `apiKeys` | `Record<string, string>` | Tam üst bilgi adı ve değer çiftleri. |

Kimlik bilgileri yürütücü tarafından eklenir ve modele sunulan araç argümanları olarak asla açığa çıkarılmaz.

## `ExecutionContext`

`executeToolCall` işlevine iletilen ve `ContextProvider` tarafından döndürülen çağrı başına bağlam:

| Alan | Tür | Açıklama |
| --- | --- | --- |
| `baseUrlOverride` | `string` | Bu çağrı için belirtimdeki sunucu URL’sini geçersiz kılar. |
| `upstreamHeaders` | `Record<string, string>` | Ek hedef hizmet üst bilgileri. |
| `requestTimeoutMs` | `number` | Çağrı başına zaman aşımı; en az 1 saniyedir. |
| `security` | `SecurityContext` | Çağrı başına kimlik bilgileri. |
| `correlationId` | `string` | Aynı çağrının günlük kayıtlarını ilişkilendirir. |
| `protocol` | `ProtocolHint` | Çağrıyı başlatan aktarım yöntemi. |
| `onLog` | `(entry) => void` | İstek/yanıt günlük kayıtlarını alır; istisna fırlatmamalıdır. |
| `signal` | `AbortSignal` | Devam eden hedef hizmet isteğini iptal eder. |

## Değişmez değer birleşimleri ve tür koruyucuları

| Birleşim | Değerler | Koruyucu işlev |
| --- | --- | --- |
| `TransportMode` | `"stdio" \| "web"` | — |
| `SpecSource` | `"startup-file" \| "upload" \| "paste" \| "runtime"` | `isSpecSource()` |
| `ServiceStatus` | `"running" \| "stopped" \| "error"` | `isServiceStatus()` |
| `ProtocolHint` | `"streamable-http" \| "sse" \| "stdio"` | `isProtocolHint()` |
| `LogDirection` | `"request" \| "response" \| "internal"` | — |
| `LogLevel` | `"debug" \| "info" \| "warn" \| "error"` | — |
| `ParameterLocation` | `"path" \| "query" \| "header" \| "cookie"` | `isParameterLocation()` |
| `BodyEncoding` | `"json" \| "form-urlencoded" \| "multipart" \| "text" \| "binary"` | `isBodyEncoding()` |

## `BuildMcpServerOptions`

`buildMcpServer()` işlevine üçüncü argüman olarak iletilir:

| Alan | Tür | Varsayılan | Açıklama |
| --- | --- | --- | --- |
| `protocol` | `ProtocolHint` | undefined | Duyurulan protokol ipucu. |
| `name` | `string` | `"openapi-mcp"` | Duyurulan sunucu adı. |
| `version` | `string` | `"1.1.0"` | Duyurulan sunucu sürümü. |
| `pageSize` | `number` | 100 | Liste yanıtı başına en fazla kayıt sayısı; üst sınır 500’dür. |
| `instructions` | `string` | yerleşik | MCP `instructions` üzerinden sunulan kullanım bilgisi. |

## Aktarım katmanı seçenekleri (`AttachMcpRoutesOptions`)

`attachMcpRoutes` işlevini `@powerduck/openapi-mcp-server` paketinden içe aktarın ve seçenek nesnesini ikinci argüman olarak geçirin. Eski `attachSseRoutes()` sarmalayıcısı yalnızca `(app, specProvider, contextProvider, routeGuard?)` konumsal argümanlarını kabul eder.

| Alan | Tür | Varsayılan | Açıklama |
| --- | --- | --- | --- |
| `specProvider` | `SpecProvider` | — (zorunlu) | Yeni oturumlar için belgeyi sağlar. |
| `contextProvider` | `ContextProvider` | — (zorunlu) | Her çağrı için hedef hizmet bağlamını sağlar. |
| `routeGuard` | `RequestHandler` | undefined | Her MCP rotasına uygulanan ara yazılım. |
| `maxSessions` | `number` | 64 | Eşzamanlı oturum üst sınırı. |
| `sessionIdleMs` | `number` | 600000 | Milisaniye cinsinden boşta kalma zaman aşımı; 0 devre dışı bırakır. |
| `allowedOrigins` | `string[]` | undefined | İzin verilen kaynaklar; boş olmayan liste DNS rebinding korumasını etkinleştirir. |
| `allowedHosts` | `string[]` | undefined | İzin verilen `Host` üst bilgisi değerleri. |
| `enableLegacySse` | `boolean` | `true` | Kullanımdan kaldırılmış HTTP+SSE aktarımını bağlar. |
| `onEvent` | `(event: McpSessionEvent) => void` | undefined | Yaşam döngüsü olaylarını alır; istisna fırlatmamalıdır. |

> Bunlar `attachMcpRoutes` seçenekleridir; ek `ServerConfig` alanları değildir. Yönetim sunucusu kaynak ve host ayarlarını iletir, ancak aktarımın varsayılan oturum sınırını ve boşta kalma zaman aşımını kullanır. Bu sınırları özelleştirmek için genel aktarım işlevini doğrudan kullanın.

## Ayrıca bakınız

- [API başvurusu](../api-reference/)
- [Örnekler](../examples/)
