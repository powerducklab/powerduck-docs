---
sidebar_position: 5
title: "API Başvurusu"
description: "@powerduck/openapi-request paketinin temel entegrasyon API'leri için başvuru kaynağıdır"
---

# API Başvurusu

`@powerduck/openapi-request` paketinin temel entegrasyon API'leri için başvuru kaynağıdır. Tablolar sözleşmeleri özetler; tüm aşırı yüklemeler ve isteğe bağlı parametreler için paketin TypeScript bildirimleri esastır. Ana giriş noktası ile protokol alt yollarının dışa aktardığı öğeler aynı değildir.

## Temel API'ler

### `createClient(options?): ProtoClient`

Arayüz odaklı istemciyi oluşturur. `options` bağımsız değişkeni isteğe bağlıdır.

**Parametreler:**

| Ad | Tür | Açıklama |
| --- | --- | --- |
| `options` | `CreateClientOptions` | İsteğe bağlı yapılandırma |
| `options.writeBack` | `WriteBackOptions` | Yanıtların belirtime nasıl birleştirileceğini belirler |
| `options.response` | `ToResponseOptions` | Yanıt nesnelerinin nasıl normalleştirileceğini belirler |

**Döndürür:** Aşağıdaki yöntemleri içeren `ProtoClient`:

| Yöntem | İmza | Açıklama |
| --- | --- | --- |
| `prepare` | `(sendOptions: SendOptions) => PreparedRequest` | İsteği planlar; protokolü, görüntüleme modunu ve akış türünü döndürür |
| `send` | `(sendOptions: SendOptions) => Promise<SendResult>` | Bir isteği yürütür |
| `sendMany` | `(spec, targets, shared?) => Promise<SendManyResult>` | Hedef başına sonuçlarla toplu yürütme; başarısızlıklar diğer sonuçları silmez |
| `connect` | `(connectOptions: ManualSessionOptions) => AnyManualSession` | Açılmamış bir websocket/mcp/grpc oturumu oluşturur; bağlanmak için `open()` çağırın |
| `discover` | `(discoverOptions) => Promise<any>` | MCP ve gRPC yeteneklerini keşfeder |
| `writeback` | `(spec, prepared, result, writeOptions?) => OpenApiDocument` | Gözlemlenen yanıtı belgeye birleştirir |
| `dispose` | `() => void` | Şu anda işlem yapmaz; çağıranlar oturumlarını kapatmalıdır |
| `probeStreamingResponse` | `(input: RequestInfo \| URL, init?: RequestInit) => Promise<{ ok: boolean; status: number; contentType?: string; kind: "none" \| "sse" \| "ndjson" \| "chunked"; response: Response }>` | Fetch isteği yapıp yanıtını sınıflandırır; dönen yanıt gövdesini tüketin veya iptal edin |

**Örnek:**

```typescript
import { createClient } from "@powerduck/openapi-request";

const client = createClient({
  writeBack: { overwriteExamples: true },
});

const plan = client.prepare({
  spec,
  target: { operationId: "getUserById" },
});

const result = await client.send({
  spec,
  target: { operationId: "getUserById" },
  values: { path: { id: "42" } },
});
```

### `createDebugger(config?): ProtoKit`

Otomasyon, betikler ve CI için betik destekli hata ayıklayıcıyı oluşturur.

**Parametreler:**

| Ad | Tür | Açıklama |
| --- | --- | --- |
| `config` | `DebuggerOptions` | İsteğe bağlı yapılandırma |
| `config.adapters` | `ProtocolAdapter[]` | Varsayılanların yerini alan özel bağdaştırıcı listesi |
| `config.extraAdapters` | `ProtocolAdapter[]` | Varsayılanlara eklenen bağdaştırıcılar |
| `config.writeBack` | `WriteBackOptions` | Geri yazma seçenekleri |
| `config.response` | `ToResponseOptions` | Yanıt normalleştirme seçenekleri |
| `config.writeBackTruncated` | `boolean` | Kesilmiş akışlardan çıkarılan şemayı geri yazar (varsayılan: true) |

**Döndürür:** `prepare`, `send`, `sendMany`, `toCollection` ve diğer yöntemleri içeren `ProtoKit`.

**Örnek:**

```typescript
import { createDebugger } from "@powerduck/openapi-request";

const dbg = createDebugger({
  writeBackTruncated: true,
});

const result = await dbg.send({
  spec,
  target: { operationId: "getUserById" },
  values: { path: { id: "42" } },
  serverUrl: "https://api.example.com",
});
```

### `createManualSession(options): AnyManualSession`

WebSocket, MCP ve gRPC için uzun ömürlü çift yönlü oturum oluşturur. Oluşturma işlevi G/Ç yapmaz; bağlantı `open()` ile açılır.

**Parametreler:**

| Ad | Tür | Açıklama |
| --- | --- | --- |
| `options.kind` | `"websocket" \| "mcp" \| "grpc"` | Kullanılacak protokol |
| `options.url` | `string` | WebSocket bağlantı URL'si |
| `options.endpoint` | `string` | MCP Streamable HTTP uç noktası |
| `options.transport` | `"streamable-http" \| "stdio"` | MCP aktarımı; varsayılan Streamable HTTP'dir |
| `options.command`, `options.args` | `string`, `string[]` | MCP stdio için yerel çalıştırılabilir dosya ve argümanlar |
| `options.address`, `options.service`, `options.method` | `string` | gRPC adresi, tam nitelikli hizmet adı ve yöntem |

gRPC için `protoPaths` veya `reflection` üzerinden bir tanımlayıcı kaynağı da sağlayın. Protokole özgü seçenekler [Yapılandırma](./configuration.md) bölümündedir.

**Döndürür:** `open()`, `send()`, `close()`, `onEvent()`, `waitForClose()`, `events` ve `state` içeren oturum. `onEvent()`, `unsubscribe()` yöntemi olan bir abonelik döndürür.

**Örnek:**

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "websocket",
  url: "wss://api.example.com/ws",
});

const subscription = session.onEvent((event) => {
  console.log(event.kind, event.data);
});
try {
  await session.open();
  await session.send({ type: "message", data: "hello" });
} finally {
  await session.close();
  subscription.unsubscribe();
}
```

### `AdapterRegistry`

`ProtocolAdapter` örneklerinin kayıt defteridir. Yeni kayıt defteri boştur; özel bir listeyle değiştirilmedikçe `createDebugger()` yerleşik HTTP, WebSocket, gRPC, MCP ve GraphQL bağdaştırıcılarını kaydeder. Seçimi yönetmek için `register()`, `unregister()`, `get()`, `list()`, `rank()` ve `resolve()` kullanın.

### `ProtoKitError`

Hata ayıklayıcı ve temel yürütme yolları tarafından fırlatılan türlendirilmiş hata. Kütüphane hatalarını beklenmeyen hatalardan ayırmak için `instanceof ProtoKitError` kullanın.

## Temel türler

### `SendOptions`

`prepare()` ve `send()` için temel girdi nesnesidir. Belirtim, hedef, değerler ve istek düzeyindeki tüm yapılandırma burada iletilir.

| Alan | Tür | Zorunlu | Açıklama |
| --- | --- | --- | --- |
| `spec` | `OpenApiDocument` | Evet | Eksiksiz OpenAPI 3.2 belgesi |
| `target` | `OperationTarget` | Evet | İşlem tanımlayıcısı (aşağıya bakın) |
| `values` | `RequestValues` | Hayır | Yol/sorgu/üstbilgi/çerez/gövde için somut değerler |
| `serverUrl` | `string` | Hayır | `spec.servers[0].url` değerini geçersiz kılar |
| `serverVariables` | `Record<string, string>` | Hayır | Sunucu URL şablonu değişkenleri |
| `variables` | `Record<string, string>` | Hayır | `{{name}}` biçiminde başvurulan ortam değişkenleri |
| `globals` | `Record<string, string>` | Hayır | Postman tarzı genel değişkenler |
| `localVariables` | `Record<string, string>` | Hayır | Yerel değişkenler |
| `collectionVariables` | `Record<string, string>` | Hayır | Koleksiyon düzeyindeki değişkenler |
| `auth` | `AuthConfig` | Hayır | Kimlik doğrulama yapılandırması |
| `scripts` | `ScriptConfig` | Hayır | İstek öncesi betikler ve test betikleri |
| `runner` | `RuntimeRunOptions` | Hayır | Tüm postman-runtime seçeneklerini doğrudan iletir (en yüksek öncelik) |
| `websocket` | `WebSocketOptions` | Hayır | WebSocket'e özgü seçenekler |
| `graphql` | `GraphQLOptions` | Hayır | GraphQL'e özgü seçenekler |
| `mcp` | `McpOptions` | Hayır | MCP'ye özgü seçenekler |
| `grpc` | `any` | Hayır | gRPC'ye özgü seçenekler |
| `timeout` | `number` | Hayır | İstek başına milisaniye cinsinden zaman aşımı (`runner.timeout.request` için kısayol) |

`SendOptions`, şu yürütme ve akış denetimlerini de kabul eder:

| Alan | Tür | Açıklama |
| --- | --- | --- |
| `fetch` | `typeof fetch` | Desteklendiğinde ana uygulamanın sağladığı yalıtılmış fetch aktarımı; HTTP/SSE, postman-runtime kullanmaya devam eder. |
| `writeBack` | `boolean` | `responseFragment` üretilmeye devam ederken `patchedSpec` değerinin undefined kalması için `false` olarak ayarlayın. |
| `signal` | `AbortSignal` | Yürütmeyi veya örneklemeyi iptal eder; yine de kısmi sonuç döndürülebilir. |
| `maxEvents` | `number` | Saklanacak en fazla akış olayı sayısı. |
| `maxStreamMs` | `number` | Milisaniye cinsinden en uzun akış örnekleme süresi. |
| `maxResponseSize` | `number` | Bayt cinsinden yanıt sınırı. |
| `maxBufferChars` | `number` | Olay sınırına ulaşılmadan önce SSE ayrıştırıcısının arabellek sınırı; varsayılan `4194304` karakter. |
| `maxEventChars` | `number` | SSE olayı başına saklanacak veri sınırı; varsayılan `1048576` karakter. |
| `inheritEventId` | `boolean` | SSE olayında kimlik yoksa son olay kimliğini devralır; varsayılan `true`. Daha sıkı şema çıkarımı için `false` olarak ayarlayın. |
| `onEvent` | `(event: StreamEvent) => void` | Akış olaylarını alır. |
| `onConsole` | `(log: ConsoleLog) => void` | Betik konsolu çıktısını alır. |
| `onAssertion` | `(assertion: AssertionResult) => void` | Doğrulama sonuçlarını alır. |
| `onResponseStart` | `(info: ResponseStartInfo) => void` | İlk HTTP/SSE üstbilgilerini ve `streaming` sınıflandırmasını inceler. |
| `onOpen` | `(info) => void` | WebSocket bağlantı ayrıntılarını alır: URL, protokol ve üstbilgiler. |

Protokol bağdaştırıcıları sınırları farklı yorumlayabilir. Arayüz geri çağrılarını hafif tutun; geri çağrıların fırlattığı hatalar yürütme katmanında yakalanır. HTTP istek ayarları için `runner.requester` kullanın; `maxResponseSize` belirtilirse sıfır değil, pozitif olmalıdır.

### `OperationTarget`

Tek bir işlemi tanımlar. `operationId` veya `method` + `path` seçeneklerinden birini tercih edin. İkisi de verilirse `operationId` önceliklidir.

| Alan | Tür | Açıklama |
| --- | --- | --- |
| `operationId` | `string` | Alternatif arama anahtarı; yol + yöntem çiftinden önceliklidir |
| `method` | `string` | Büyük/küçük harfe duyarsız HTTP yöntemi. `path` gerektirir. |
| `path` | `string` | Şablonlu yol, örneğin `/users/{id}`. `method` gerektirir. |

### `RequestValues`

Oluşturulan isteğe eklenecek somut değerler.

| Alan | Tür | Açıklama |
| --- | --- | --- |
| `path` | `Record<string, unknown>` | Yol parametresi değerleri |
| `query` | `Record<string, unknown>` | Sorgu parametresi değerleri |
| `header` | `Record<string, unknown>` | Üstbilgi değerleri |
| `cookie` | `Record<string, unknown>` | Çerez değerleri |
| `querystring` | `string` | Önceden kodlanmış ham sorgu dizesi (OpenAPI 3.2 `querystring` konumu) |
| `body` | `unknown` | İstek gövdesi |
| `contentType` | `string` | İşlem birden fazla istek medya türü bildiriyorsa belirli bir türü zorunlu kılar |

```typescript
const result = await client.send({
  spec,
  target: { operationId: "updateUser" },
  values: {
    path: { id: "42" },
    query: { version: "2" },
    header: { "X-Request-Id": "abc-123" },
    body: { name: "Alice", email: "alice@example.com" },
    contentType: "application/json",
  },
});
```

### `AuthConfig`

| Alan | Tür | Açıklama |
| --- | --- | --- |
| `type` | `AuthConfig["type"]` | Kimlik doğrulama türü |
| `token` | `string` | Bearer belirteci (`type: "bearer"` için) |
| `username` | `string` | Basic kimlik doğrulama kullanıcı adı (`type: "basic"` için) |
| `password` | `string` | Basic kimlik doğrulama parolası (`type: "basic"` için) |
| `key` | `string` | API anahtarı adı (`type: "apikey"` için) |
| `value` | `string` | API anahtarı değeri (`type: "apikey"` için) |
| `in` | `"header" \| "query"` | API anahtarı konumu (`type: "apikey"` için) |

```typescript
// Bearer token
const result1 = await client.send({
  spec,
  target: { operationId: "getUser" },
  auth: { type: "bearer", token: "your-jwt-token" },
});

// Basic auth
const result2 = await client.send({
  spec,
  target: { operationId: "getUser" },
  auth: { type: "basic", username: "admin", password: "secret" },
});

// API key in header
const result3 = await client.send({
  spec,
  target: { operationId: "getUser" },
  auth: { type: "apikey", key: "X-API-Key", value: "key-123", in: "header" },
});
```

Gelişmiş kimlik doğrulama türleri `digest`, `oauth1`, `oauth2`, `jwt`, `hawk`, `aws4`, `ntlm`, `asap` ve `edgegrid` olarak sıralanır. HTTP/SSE/GraphQL için Postman yardımcı alanlarını `parameters: Record<string, string | boolean | number>` üzerinden iletin. İsteğe bağlı `oauth2: OAuth2FlowConfig`, OAuth 2.0 türünde belirteç alma ve yenilemeyi etkinleştirir; her kimlik doğrulama yardımcısının tüm protokollerde geçerli olduğunu varsaymayın.

### `PreparedRequest`

`createClient().prepare()` tarafından döndürülür. Hata ayıklayıcının planlama sonucu farklıdır: `createDebugger().prepare()`, `located`, `adapter` ve `plan` içeren bir `PlanResult` döndürür.

| Alan | Tür | Açıklama |
| --- | --- | --- |
| `protocol` | `string` | Çözümlenen protokol (http, websocket, grpc, graphql, mcp) |
| `transport` | `string` | Çözümlenen aktarım |
| `target` | `OperationTarget` | Özgün hedef |
| `operation` | `any` | Çözümlenen OpenAPI işlem nesnesi |
| `display.mode` | `DisplayMode` | `"response" \| "event-list" \| "duplex-session"` |
| `stream.kind` | `StreamKind` | Akış sınıflandırması (aşağıya bakın) |
| `stream.expected` | `boolean` | Akış beklenip beklenmediği |
| `openapi.extensions` | `Record<string, unknown>` | Çözümlenen OpenAPI uzantıları |
| `warnings` | `string[]` | Planlama sırasında oluşan uyarılar |

### `StreamKind`

Ayrıntılı akış sınıflandırması: `"none" | "sse" | "ndjson" | "chunked" | "websocket" | "graphql-stream" | "grpc-unary" | "grpc-server-stream" | "grpc-client-stream" | "grpc-bidi" | "mcp-http-stream" | "mcp-stdio"`

## OpenAPI yardımcıları

| Dışa aktarılan öğe | İmza | Açıklama |
| --- | --- | --- |
| `locateOperation` | `(spec, target) => LocatedOperation` | `OperationTarget` üzerinden bir işlemi çözümler |
| `inferSchema` | `(value) => Schema` | Tek bir gözlemlenen değerden JSON Schema çıkarır |
| `inferSchemaFromMany` | `(values) => Schema` | Birden çok gözlemlenen değeri kapsayan şema çıkarır |
| `mergeSchema` | `(a, b) => Schema` | Çıkarılan iki şemayı birleştirir (birleşim veya kombinasyon) |
| `sampleFromSchema` | `(schema) => unknown` | Şema için gerçekçi bir örnek değer üretir |
| `toResponseObject` | `(result, options?) => { statusCode: string; response: any }` | Gözlemlenen sonuçtan OpenAPI yanıt nesnesi oluşturur |
| `writeBackResponse` | `(spec, path, method, fragment, options?) => spec` | Gözlemlenen bir yanıtı belgeye birleştirir |

Dışa aktarılan türler: `LocatedOperation`, `WriteBackOptions`, `ToResponseOptions`.

## HTTP / SSE

Aşağıdaki adlar ana giriş noktasında bulunur. `@powerduck/openapi-request/http` alt yolu `HttpAdapter`, `SseParser`, `buildCollection`, `buildEnvironment`, `resolveServerUrl`, `buildRunOptions` ve `runWithPostman` öğelerini dışa aktarır; algılama yardımcılarını ve `BUILTIN_CAPTURE_TEST` öğesini ana giriş noktasından içe aktarın.

| Dışa aktarılan öğe | Açıklama |
| --- | --- |
| `HttpAdapter` | HTTP/HTTPS için varsayılan protokol bağdaştırıcısı |
| `SseParser` | SSE bayt akışını yapılandırılmış olaylara dönüştüren akış ayrıştırıcısı |
| `isStreamingOperation` | Bildirilen içerik türlerinden işlemi akış olarak sınıflandırır |
| `isSseContentType` | İçerik türünün SSE belirtip belirtmediğini denetler |
| `isStreamingContentType` | İçerik türünün akış belirtip belirtmediğini denetler |
| `acceptHeaderFor` | İşlem için uygun Accept üstbilgisini üretir |
| `probeStreamingResponse` | Fetch isteği yapıp yanıtını sınıflandırır; dönen yanıt gövdesini tüketin veya iptal edin |
| `BUILTIN_CAPTURE_TEST` | Son yanıtı yakalayan yerleşik Postman test betiği |

## WebSocket

`@powerduck/openapi-request/ws` üzerinden içe aktarın.

| Dışa aktarılan öğe | Açıklama |
| --- | --- |
| `WebSocketAdapter` | WebSocket hedefleri için protokol bağdaştırıcısı |
| `createWsManualSession` | Çift yönlü manuel WebSocket oturumu oluşturur; `runWebSocketSession` ve `wsManualSession` adlarıyla da kullanılabilir |

## GraphQL

`@powerduck/openapi-request/graphql` üzerinden içe aktarın.

| Dışa aktarılan öğe | Açıklama |
| --- | --- |
| `GraphQLAdapter` | GraphQL hedefleri için protokol bağdaştırıcısı |
| `resolveGraphQLConfig` | İşlemden GraphQL yapılandırmasını çözümler |
| `runGraphQL` | GraphQL işlemi yürütür |
| `introspectSchema` | GraphQL uç noktasının şemasını iç gözlemle alır |
| `INTROSPECTION_QUERY` | Standart GraphQL iç gözlem sorgusu |
| `generateOperation` | İç gözlemle alınan GraphQL şeması ve bir alandan sorgu belgesi üretir |
| `generateAllOperations` | İç gözlemle alınan GraphQL şemasının alanları için sorgu belgeleri üretir |
| `writeGraphQLOperations` | Üretilen GraphQL işlemlerini belirtime geri yazar |
| `discoverAndWriteGraphQLSchema` | GraphQL şemasını keşfeder ve belirtime yazar |

## MCP (Model Context Protocol)

Aşağıdaki öğelerin çoğu `@powerduck/openapi-request/mcp` üzerinden kullanılabilir. `initializeMcpSession` öğesini ana giriş noktasından içe aktarın; alt yoldaki adı `initializeSession` şeklindedir. Alt yol ayrıca `runMcp`, `createMcpSessionCore` ve `createMcpStdioConnection` öğelerini sunar.

| Dışa aktarılan öğe | Açıklama |
| --- | --- |
| `McpAdapter` | MCP hedefleri için protokol bağdaştırıcısı |
| `createMcpManualSession` | Manuel MCP oturumu oluşturur; `mcpManualSession` adıyla da kullanılabilir |
| `createMcpStdioSession` | stdio üzerinden MCP oturumu oluşturur |
| `runMcpManualSession` | Kullanımı artık önerilmiyor: `createMcpManualSession` kullanın |
| `resolveMcpConfig` | İşlemden MCP yapılandırmasını çözümler |
| `initializeMcpSession` | MCP oturumunu başlatır (`initializeSession` diğer adıyla) |
| `discoverMcpCapabilities` | MCP sunucusunun yeteneklerini keşfeder |
| `MCP_PROTOCOL_VERSION` | Desteklenen MCP protokol sürümü |
| `generateMcpCall` | Tek bir MCP araç çağrısı üretir |
| `generateAllMcpCalls` | Tüm MCP araç çağrılarını üretir |
| `writeMcpOperations` | MCP işlemlerini belirtime geri yazar |
| `discoverAndWriteMcpCapabilities` | MCP yeteneklerini keşfeder ve belirtime yazar |
| `createHttpMcpTransport` | MCP için HTTP aktarımı oluşturur |
| `createStdioMcpTransport` | MCP için stdio aktarımı oluşturur |

## gRPC

Düşük düzeyli keşif, çağrı ve tanımlayıcı yardımcılarını `@powerduck/openapi-request/grpc` üzerinden içe aktarın. `GrpcProtocolAdapter`, `createGrpcManualSession`, `grpcManualSession`, `grpcDiscover` ve `discoverGrpc` öğelerini ana giriş noktasından içe aktarın; alt yol keşif için `discover` adını kullanır. Ayrıca `discoverFromCatalog`, `describeMethod` ve `describeFromCatalog` sunarak her yöntem için yansımayı tekrarlamak yerine kataloğu yeniden kullanmanızı sağlar.

| Dışa aktarılan öğe | Açıklama |
| --- | --- |
| `GrpcProtocolAdapter` | OpenAPI'ye yönelik gRPC protokol bağdaştırıcısı |
| `GrpcAdapter` | Düşük düzeyli gRPC bağdaştırıcısı |
| `grpcDiscover` / `discoverGrpc` | gRPC hizmetlerini ve yöntemlerini keşfeder |
| `createGrpcManualSession` / `grpcManualSession` | Manuel gRPC oturumu oluşturur |
| `grpcCall` | Tek bir gRPC çağrısı yürütür |
| `resolveMethod` | gRPC yöntem tanımlayıcısını çözümler |
| `buildMessageTemplate` | Tanımlayıcıdan ileti şablonu oluşturur |
| `buildCatalog` | Hizmet ve yöntem kataloğu oluşturur |
| `LOADER_OPTIONS` | Varsayılan proto yükleyici seçenekleri |
| `scanProtoFiles` | Dizinlerde proto dosyalarını tarar |
| `deriveIncludeDirsDetailed` | Proto dosya yollarından içerme dizinlerini türetir |
| `fetchDescriptorSet` | gRPC yansımasıyla tanımlayıcı kümesini alır |
| `fetchFullDescriptorSet` | Tüm bağımlılıklarıyla tam tanımlayıcı kümesini alır |
| `listServices` | Tanımlayıcı kümesindeki hizmetleri listeler |
| `listServicesDetailed` | Hizmetleri ayrıntılı yöntem bilgileriyle listeler |
| `serializeDescriptorSet` | Tanımlayıcı kümesini baytlara serileştirir |
| `decodeFileDescriptorProto` | Tek bir dosya tanımlayıcı proto'sunun kodunu çözer |
| `decodeFileDescriptorSet` | Dosya tanımlayıcı kümesinin kodunu çözer |
| `buildCredentials` | gRPC kimlik bilgilerini oluşturur (eşzamanlı) |
| `buildCredentialsAsync` | gRPC kimlik bilgilerini oluşturur (eşzamansız) |
| `buildCredentialsChecked` | Doğrulamayla kimlik bilgilerini oluşturur (eşzamanlı) |
| `buildCredentialsCheckedAsync` | Doğrulamayla kimlik bilgilerini oluşturur (eşzamansız) |
| `loadGrpc` | `@grpc/grpc-js` paketini dinamik olarak yükler |
| `isGrpcAvailable` | gRPC bağımlılıklarının kullanılabilirliğini denetler |
| `requireCapability` | Belirli bir gRPC yeteneğini gerektirir; kullanılamıyorsa hata fırlatır |

Ana giriş noktası `GrpcDiscoveryResult`, `GrpcDiscoveredMethod` ve `GrpcDiscoveredService` tür takma adlarını dışa aktarır. gRPC alt yolunda bunların adları `DiscoveryResult`, `DiscoveredMethod` ve `DiscoveredService` şeklindedir.

Hata türleri: `ReflectionProtocolError`, `ReflectionUnavailableError`, `DescriptorDecodeError`, `GrpcDependencyBrokenError`, `GrpcDependencyMissingError`.

## Ek yardımcılar

Ana giriş noktası ayrıca OAuth 2.0 yardımcıları `resolveOAuth2Token`, `acquireOAuth2Token`, `isOAuth2TokenExpired`, `oauth2RefreshStatuses` ve `authFromOAuth2Token`; kopyalama yardımcısı `toCloneable`; `UnifiedSession` temel sınıfı; gRPC geri yazma yardımcıları `writeGrpcOperations` ve `discoverAndWriteGrpcOperations` öğelerini dışa aktarır.

## Alt yol dışa aktarımları

```typescript
// Main integration entry
import { createClient, createDebugger } from "@powerduck/openapi-request";

// Protocol-specific entries
import { HttpAdapter } from "@powerduck/openapi-request/http";
import { WebSocketAdapter } from "@powerduck/openapi-request/ws";
import { GrpcAdapter } from "@powerduck/openapi-request/grpc";
import { McpAdapter } from "@powerduck/openapi-request/mcp";
import { GraphQLAdapter } from "@powerduck/openapi-request/graphql";
```
