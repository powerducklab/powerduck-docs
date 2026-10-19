---
sidebar_position: 5
title: "API başvurusu"
description: "@powerduck/openapi-mcp-server için tam API başvurusu: belirtim yükleme, araç, istem ve kaynak üretimi, istek oluşturma ve yürütme, MCP sunucusu, aktarım yöntemleri, yönetim, kimlik doğrulama, hizmet kaydı ve CLI."
---

# API başvurusu

`@powerduck/openapi-mcp-server` paketinin tüm genel dışa aktarımları, işlev alanına göre gruplandırılmıştır.

## Belirtim yükleme

| Dışa aktarım | İmza | Açıklama |
| --- | --- | --- |
| `loadOpenApiSpec(filePath)` | `(string) => Promise<Oas32Document>` | JSON veya YAML dosyasını okur, doğrular, başvuruları çözümler ve işlem kimliklerinin benzersizliğini denetler. YAML, `.ya?ml` uzantısıyla algılanır. |
| `parseSpecContent(rawText, isYaml)` | `(string, boolean) => Promise<Oas32Document>` | Bir dizeden belge ayrıştırır. Boş veya geçersiz girdide istisna fırlatır. |

## Araç üretimi

| Dışa aktarım | İmza | Açıklama |
| --- | --- | --- |
| `generateTools(spec)` | `(spec) => Tool[]` | Her işlem için MCP `Tool` tanımları üretir. |
| `generateToolsDetailed(spec)` | `(spec) => GenerateToolsResult` | `{ tools, bindings, issues }` döndürür. |
| `buildBindingIndex(spec)` | `(spec) => Map<string, ToolBinding>` | Üretilen araç adlarını ilgili `ToolBinding` ile eşler; `getBindingIndex` için takma addır. |

Dışa aktarılan türler: `ToolBinding`, `GeneratedToolWithBinding` (paketteki `GeneratedTool` takma adı).

## İstemler ve kaynaklar

| Dışa aktarım | İmza | Açıklama |
| --- | --- | --- |
| `generatePrompts(spec)` | `(spec) => GeneratedPrompt[]` | Üretilen tüm istemleri listeler. |
| `resolvePrompt(spec, name, args?)` | `(spec, string, Record?) => GetPromptResult \| null` | İstemi adına göre bulur; bilinmiyorsa `null` döndürür. |
| `generateResources(spec)` | `(spec) => GeneratedResource[]` | Katalog kaynaklarını listeler. |
| `readResource(spec, uri)` | `(spec, string) => ResourceContentItem \| null` | URI ile tek bir kaynak okur. |

## İstek oluşturma ve yürütme

| Dışa aktarım | İmza | Açıklama |
| --- | --- | --- |
| `buildRequest(baseUrl, templatePath, pathItem, operation, args, binding?)` | `=> BuiltRequest` | Argümanları `{ url, query, headers, body, dropped }` biçimine serileştirir. Konumsal argümanlar kullanılır. |
| `executeToolCall(spec, toolName, args, context?)` | `(spec, string, Record?, ExecutionContext?) => Promise<ToolCallResult>` | Üretilen aracı hedef API üzerinde yürütür. 2xx dışındaki yanıtlar veri olarak döndürülür; aktarım hataları istisna fırlatır. |

`ToolCallResult` alanları: `status`, `statusText`, `headers`, `data`, `truncated`, `url`, `method`, `durationMs`, `correlationId`.

## Belirtim yardımcıları

| Dışa aktarım | Açıklama |
| --- | --- |
| `iterateOperations(spec, issues?)` | OpenAPI 3.2 `additionalOperations` dahil çözümlenen tüm işlemleri üreten oluşturucu. |
| `collectOperationParameters(pathItem, operation, issues?, context?)` | Yol öğesi ve işlem parametrelerini `(name, in)` anahtarıyla birleştirir. |
| `normalizeParameter(candidate)` | Ham parametreyi normalleştirir; kullanılamıyorsa `null` döndürür. |
| `synthesizeOperationId(method, pathTemplate)` | İşlemde `operationId` yoksa deterministik bir yedek kimlik üretir. |
| `ensureUniqueName(candidate, taken)` | Adı benzersiz tutmak için sayısal son ek ekler. |
| `extractPathTemplateVariables(pathTemplate)` | `{name}` değişkenlerini çıkarır; ilk görünümü koruyarak tekrarları kaldırır. |
| `effectiveStyle(parameter)` | Belirtimin varsayılan `style` değerini uygular. |
| `effectiveExplode(parameter)` | Belirtimin varsayılan `explode` değerini uygular. |
| `findOperationById(spec, operationId)` | İlk oluşturmadan sonra O(1) arama; bilinmiyorsa `null` döndürür. |
| `findDuplicateOperationIds(spec)` | Yazar tarafından tanımlanmış yinelenen kimlikleri bildirir. |
| `assertUniqueOperationIds(spec)` | Yinelenen işlem kimliklerinde istisna fırlatır. |
| `isPlainObject(value)` | Türü düz nesneye daraltır. |
| `truncateGeneratedName(name, limit=64)` | Benzersizliğini koruyarak adı kısaltır. |

Dışa aktarılan türler: `OperationEntry`, `DuplicateOperationId`.

## MCP sunucusu ve aktarım yöntemleri

| Dışa aktarım | Açıklama |
| --- | --- |
| `buildMcpServer(specProvider, contextProvider?, options?)` | Araç, istem ve kaynak işleyicilerini bağlayan SDK `Server` nesnesini oluşturur. Konumsal argümanlar kullanılır. |
| `startStdioServer(spec, context?, options?)` | stdio üzerinden tek belge sunar; `{ closed, close() }` döndürür. |
| `attachMcpRoutes(app, options)` | Streamable HTTP (`/mcp`) ve isteğe bağlı eski SSE (`/sse`) rotalarını bağlar. `AttachMcpRoutesOptions` alır ve `McpRouteHandle` döndürür. |
| `attachSseRoutes(app, specProvider, contextProvider, routeGuard?)` | Kullanımdan kaldırılmış konumsal sarmalayıcı. `{ activeSessionCount, closeAll }` döndürür. |
| `createStreamableSessionHost(options)` | Özel aktarım entegrasyonları için bağımsız bir Streamable HTTP oturum yöneticisi oluşturur. |

Türler: `SpecProvider = () => Document | null`, `ContextProvider = () => ExecutionContext`, `AttachMcpRoutesOptions`, `McpRouteHandle`, `StreamableSessionHost`, `StreamableSessionHostOptions`, `McpSessionEvent`, `McpSessionInfo`, `SessionCloseReason`, `SessionKind`.

`attachMcpRoutes`, paketin kökünden dışa aktarılır. Seçeneklerinde `maxSessions`, `allowedOrigins`, `sessionIdleMs` ve DNS rebinding korumasını yapılandırın. Döndürülen nesne `activeSessionCount`, `pendingSessionCount`, `listSessions`, `closeSession`, `closeAll` ve `dispose` sağlar. Kapanışta hem düzenli temizliği durdurmak hem de oturumları kapatmak için `dispose()` kullanın.

## Yönetim sunucusu ve kimlik doğrulama (`./server` alt yolu) {#admin-server-and-auth-server-subpath}

`startAdminServer` işlevini `@powerduck/openapi-mcp-server/server` veya paket kökünden içe aktarın. `createAuthMiddleware` işlevini paket kökünden içe aktarın; `./server` alt yolundan dışa aktarılmaz.

| Dışa aktarım | İmza | Açıklama |
| --- | --- | --- |
| `startAdminServer(config)` | `Promise<AdminServerHandle>` | Web arayüzü ve MCP rotalarıyla Express yönetim uygulamasını başlatır. `{ app, server, port, close() }` döndürür. |
| `createAuthMiddleware(apiKey?)` | `RequestHandler` | Bearer veya `x-api-key` erişim koruması. Anahtarı belirtmemek korumayı kapatır. Konumsal argüman kullanılır. |

## Çalışma zamanı ve yardımcılar

| Dışa aktarım | Açıklama |
| --- | --- |
| `ServiceRegistry` | `ManagedServiceRecord` sınıfı: `upsert`, `list`, `get`, `remove`, `clear`, `start`, `stop`, `fail`. |
| `isAbortError(error)` | `AbortError` veya axios `CanceledError` için doğrudur. |
| `newId()` | UUID; yedek olarak zaman damgalı bir değer kullanılır. |

## CLI

Çalıştırılabilir program **`openapi-mcp`**. Tek komut `serve`:

```
openapi-mcp serve [options]
```

| Seçenek | Varsayılan | Açıklama |
| --- | --- | --- |
| `--port <n>` | `3000` | Web aktarımının HTTP bağlantı noktası. |
| `--host <host>` | `127.0.0.1` | HTTP host değeri. |
| `--transport <mode>` | `web` | `stdio` veya `web`. |
| `--spec <path>` | — | OpenAPI dosya yolu; stdio modunda zorunludur. |
| `--base-url <url>` | — | Hedef hizmetin temel URL’sini geçersiz kılar. |
| `--api-key <key>` | — | Yönetim API anahtarı. |
| `--upstream-header "Name: value"` | — | Tekrarlanabilen hedef hizmet üst bilgisi. |
| `--timeout <ms>` | `30000` | Hedef hizmet zaman aşımı. |
| `--no-persist` | — | Kalıcı durum saklamayı devre dışı bırakır. |

## Türler (`types` üzerinden yeniden dışa aktarılır)

`ServerConfig`, `SecurityContext`, `AppState`, `PersistedState`, `ExecutionContext`, `TransportMode`, `SpecSource`, `ServiceStatus`, `ProtocolHint`, `LogDirection`, `LogLevel`, `ParameterLocation`, `BodyEncoding`, `ServiceEndpointInfo`, `ManagedServiceRecord`, `SpecIssue`, `AdminStatus`, `GeneratedPrompt`, `GeneratedResource`, `GeneratedTool`, `ResourceContentItem`, `PromptMessageShape`, `RequestLogEntry`, `LogQueryOptions`, `LogQueryResult`; `ResolvedPrompt` kullanımdan kaldırılmıştır. Tür koruyucuları: `isSpecSource`, `isServiceStatus`, `isProtocolHint`, `isParameterLocation`, `isBodyEncoding`, `isPlainRecord`.

## Hatalar ve davranış

- Bilinmeyen araç, istem veya kaynak kimlikleri normal sonucun içindeki hatalar yerine MCP `InvalidParams` hataları oluşturur.
- Etkin oturum sırasında belirtimin bulunmaması `InternalError` üretir.
- Hedef hizmetin 4xx/5xx yanıtları istisna fırlatmadan modele `isError: true` içeriği olarak döndürülür. Yalnızca aktarım hataları (DNS, TLS, zaman aşımı, iptal) istisna fırlatır.

## Ayrıca bakınız

- [Yapılandırma](../configuration/)
- [Örnekler](../examples/)
