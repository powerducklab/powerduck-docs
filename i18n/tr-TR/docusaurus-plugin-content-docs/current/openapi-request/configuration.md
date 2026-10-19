---
sidebar_position: 4
title: "Yapılandırma"
description: "Yapılandırma üç katmana ayrılır: istemci/hata ayıklayıcı oluşturma seçenekleri, prepare() ve send() işlevlerine iletilen SendOptions nesnesi ve protokole özgü seçenekler."
---

# Yapılandırma

Yapılandırma üç katmana ayrılır: istemci/hata ayıklayıcı oluşturma seçenekleri, `prepare()` ve `send()` işlevlerine iletilen `SendOptions` nesnesi ve protokole özgü seçenekler.

## Oluşturma seçenekleri

### `CreateClientOptions`

`createClient(options?)` işlevine iletilir. Tüm alanlar isteğe bağlıdır.

| Alan | Tür | Açıklama |
| --- | --- | --- |
| `writeBack` | `WriteBackOptions` | Yanıtların belirtime nasıl birleştirileceğini belirler |
| `response` | `ToResponseOptions` | Yanıt nesnelerinin nasıl normalleştirileceğini belirler |

```typescript
import { createClient } from "@powerduck/openapi-request";

const client = createClient({
  writeBack: {
    overwriteExamples: true,
    // ... other WriteBackOptions
  },
  response: {
    includeExamples: false,
    // ... other ToResponseOptions
  },
});
```

### `DebuggerOptions`

`createDebugger(config?)` işlevine iletilir. Tüm alanlar isteğe bağlıdır.

| Alan | Tür | Açıklama |
| --- | --- | --- |
| `adapters` | `ProtocolAdapter[]` | Özel bağdaştırıcı listesi (varsayılanların tamamının yerini alır) |
| `extraAdapters` | `ProtocolAdapter[]` | Varsayılan kayıt defterine eklenecek bağdaştırıcılar |
| `writeBack` | `WriteBackOptions` | Geri yazma seçenekleri |
| `response` | `ToResponseOptions` | Yanıt normalleştirme seçenekleri |
| `writeBackTruncated` | `boolean` | Kesilen akışlardan çıkarılan şemayı geri yazar (varsayılan: `true`) |

```typescript
import { createDebugger, HttpAdapter, WebSocketAdapter } from "@powerduck/openapi-request";

// Use only HTTP and WebSocket adapters
const debugger1 = createDebugger({
  adapters: [new HttpAdapter(), new WebSocketAdapter()],
});

// Add a custom adapter to the defaults
const debugger2 = createDebugger({
  extraAdapters: [new MyCustomAdapter()],
  writeBackTruncated: true,
});
```

### Geri yazma ve kaydedilen örnekler

`WriteBackOptions`; `strategy` (`"merge"` veya `"replace"`, varsayılan `"merge"`), `keepExistingDescription` (varsayılan `true`), `allowedStatusCodes` (boşsa tümü), `protectComponentRefs` (varsayılan `true`), `overwriteExamples` (varsayılan `true`) ve `requirePassingTests` seçeneklerini destekler. Gönderim hattı, testlerin geçmesi koşulunu uygular; `writeBackResponse` doğrudan çağrıldığında bu koşul uygulanmaz.

`ToResponseOptions`; `includeExamples` (varsayılan `true`), `maxExampleChars` (varsayılan `4000`) ve `maxEventPreviewChars` (varsayılan `200`) seçeneklerini destekler. Gerçek yanıtlar kimlik bilgileri veya kişisel veriler içerebilir; örnek kaydetmeyi kapatın ya da yayımlamadan önce örnekleri inceleyin.

Gönderim hattı normalde değiştirilmiş bir kopyayı `patchedSpec` içinde döndürür; girdi belgesini değiştirmez veya dosya kaydetmez. Bu adımı atlamak için ilgili çağrıda `writeBack: false` ayarlayın. Oluşturma aşamasındaki `writeBack` nesnesi birleştirmeyi yapılandırır; çağrıya özgü boolean değeri ise geri yazmayı açar veya kapatır.

## `SendOptions`

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

```typescript
// By operationId (recommended)
const result1 = await client.send({
  spec,
  target: { operationId: "getUserById" },
});

// By method + path
const result2 = await client.send({
  spec,
  target: { method: "GET", path: "/users/{id}" },
});
```

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

### `ScriptConfig`

| Alan | Tür | Açıklama |
| --- | --- | --- |
| `collectionPreRequest` | `ScriptSource \| ScriptSource[]` | Koleksiyon düzeyinde istek öncesi betikler |
| `collectionTest` | `ScriptSource \| ScriptSource[]` | Koleksiyon düzeyinde test betikleri |
| `preRequest` | `ScriptSource \| ScriptSource[]` | İstek düzeyinde istek öncesi betikler |
| `test` | `ScriptSource \| ScriptSource[]` | İstek düzeyinde test betikleri |
| `fromSpecExtensions` | `boolean` | Belirtimden `x-postman-scripts` okur (varsayılan: `true`) |
| `captureLastResponse` | `boolean` | Son yanıtı sonraki isteklere sunan yerleşik yardımcıyı ekler |

`ScriptSource`:
```typescript
interface ScriptSource {
  exec: string | string[];  // Script body, either a single string or array of lines
  id?: string;               // Optional identifier surfaced in script results
}
```

İçe aktarılan bir belirtime gömülü betikleri çalıştırmak istemiyorsanız `scripts.fromSpecExtensions: false` ayarlayın. Geçerli varsayılan değer `true` olduğundan bunun ileride değişeceğine güvenmeyin.

## Protokole özgü seçenekler

### HTTP / SSE

Varsayılan bağdaştırıcı HTTP'dir. Bildirilen `text/event-stream` içeriği SSE kullanım niyetini belirtir; üstbilgiler geldiğinde yürütme süreci gerçek yanıtı da sınıflandırır. `probeStreamingResponse()`, açıkça çağrılan ayrı bir yoklamadır; her çağrıdan önce otomatik olarak çalışmaz.

Temel HTTP istekleri ek yapılandırma gerektirmez. Gelişmiş postman-runtime yapılandırması için `SendOptions.runner` kullanın.

### WebSocket

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "websocket",
  url: "wss://api.example.com/ws",
  // Manual-session options are distinct from SendOptions.websocket.
});
```

### MCP

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "mcp",
  endpoint: "https://api.example.com/mcp",
});
```

Varsayılan manuel MCP oturumu Streamable HTTP ve `endpoint` kullanır. stdio için `kind: "mcp"`, `transport: "stdio"`, yerel bir `command` ve isteğe bağlı `args` iletin; oturumu başlatmak yapılandırılmış süreci çalıştırır.

### gRPC

gRPC; bir adres, tanımlayıcı kaynağı (`.proto` dosyaları veya sunucu yansıması), tam nitelikli hizmet adı ve yöntem gerektirir:

```typescript
import { createManualSession } from "@powerduck/openapi-request";

const session = createManualSession({
  kind: "grpc",
  address: "localhost:50051",
  service: "powerduck.examples.Echo",
  method: "Echo",
  protoPaths: ["./echo.proto"],
});
```

Manuel oturum oluşturma işlevleri henüz açılmamış bir oturum döndürür. Göndermeden önce `open()`, kaynakları temizlerken `close()` çağırın. gRPC örneği uyumlu bir yerel sunucu ve proto dosyası gerektirir; manuel oturum seçenekleri `SendOptions.grpc` ile aynı nesne değildir.

## Tam örnek

```typescript
import { createClient } from "@powerduck/openapi-request";

const client = createClient({
  writeBack: { overwriteExamples: true },
});

const result = await client.send({
  spec: openApiDocument,
  target: { operationId: "updateUser" },
  values: {
    path: { id: "42" },
    query: { verbose: "true" },
    header: { "X-Request-Id": "req-abc" },
    body: { name: "Alice", email: "alice@example.com" },
  },
  serverUrl: "https://api.staging.example.com",
  auth: { type: "bearer", token: "staging-token" },
  timeout: 10000,
  variables: {
    environment: "staging",
  },
});

console.log(result.response.status);
console.log(result.response.body);
console.log(result.response.headers);
```

## Sonraki adımlar

- Dışa aktarılan tüm türler için [API Başvurusu](./api-reference.md) sayfasına bakın
- Protokole özgü kullanım örnekleri için [Örnekler](./examples.md) sayfasını inceleyin
