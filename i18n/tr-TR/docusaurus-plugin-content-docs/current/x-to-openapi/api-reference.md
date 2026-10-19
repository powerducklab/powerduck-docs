---
sidebar_position: 4
title: "API Başvurusu"
description: "@powerduck/x-to-openapi paketinin genel giriş noktası için başvuru kaynağı"
---

# API Başvurusu

`@powerduck/x-to-openapi` paketinin genel giriş noktası için başvuru kaynağı. Aşağıdaki imzalar API'yi özetler; tüm readonly belirteçleri ve içe aktarılan türler için paketin TypeScript bildirimlerine bakın.

---

## Yapılandırma gerektirmeyen yardımcılar

### `curlToOpenApi`

Tek çağrıyla dönüştürme: bir [`CurlAdapter`](#curladapter) kaydeder ve [`convert`](#convertsource-input-options) çağrısını yapar.

```typescript
function curlToOpenApi(
  input: string | readonly string[],
  options?: ConvertOptions,
): Promise<ConvertResult>;
```

| Parametre | Tür | Açıklama |
|---|---|---|
| `input` | `string \| readonly string[]` | Bir curl komutu, komut dizisi veya tarayıcının “Copy all as cURL” çıktısı; birden çok komut içeren metin otomatik olarak bölünür. |
| `options` | `ConvertOptions` | İsteğe bağlı dönüştürme ayarları. |

**Dönüş değeri:** [`ConvertResult`](#convertresult).

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  "curl -X POST https://api.example.com/users -H 'Content-Type: application/json' --data '{\"name\":\"Ada\"}'",
);
```

---

### `postmanToOpenApi`

Tek çağrıyla dönüştürme: bir [`PostmanAdapter`](#postmanadapter) kaydeder ve ayrıştırılmış koleksiyon nesnesini ya da JSON dizesini dönüştürür. Test betikleri `x-postman-scripts` olarak korunur.

```typescript
function postmanToOpenApi(
  input: unknown,
  options?: ConvertOptions,
): Promise<ConvertResult>;
```

| Parametre | Tür | Açıklama |
|---|---|---|
| `input` | `unknown` | Postman Collection v2.0/v2.1.0 nesnesi veya bu nesnenin JSON dizesi. |
| `options` | `ConvertOptions` | İsteğe bağlı dönüştürme ayarları. |

**Dönüş değeri:** [`ConvertResult`](#convertresult).

---

## Temel yapı

### `XToOpenApi`

Dönüştürücü sınıfı. Bir [`AdapterRegistry`](#adapterregistry) tutar ve ayrıştırma → oluşturma → doğrulama akışını yürütür.

```typescript
class XToOpenApi {
  register<I>(adapter: SourceAdapter<I>): this;
  adapters(): string[];
  convert(
    source: string,
    input: unknown,
    options?: ConvertOptions,
  ): Promise<ConvertResult>;
}
```

#### `register(adapter)`

Bir bağdaştırıcı kaydeder. Çağrıları zincirlemek için `this` döndürür. Bağdaştırıcının `id` değerini `/^[a-z][a-z0-9-]*$/` ile doğrular, `parse()` yöntemini zorunlu tutar ve yinelenen kimlikleri reddeder.

#### `adapters()`

Kayıtlı bağdaştırıcı kimliklerini `string[]` olarak döndürür.

#### `convert(source, input, options?)`

Tek giriş noktası.

| Parametre | Tür | Açıklama |
|---|---|---|
| `source` | `string` | Bağdaştırıcı kimliği (`"curl"`, `"postman"`, …) veya `canHandle()` üzerinden seçim için `"auto"`. |
| `input` | `unknown` | Kaynak veri; yapısı bağdaştırıcıya bağlıdır. |
| `options` | `ConvertOptions` | İsteğe bağlı dönüştürme ayarları. |

**Davranış:**

1. Seçenekleri [`DEFAULT_OPTIONS`](#default_options) ile tamamlar ve doğrular.
2. **10 × 1024 × 1024 JavaScript kod birimini** aşan dizeleri veya bir dizideki dize öğelerinin toplamını `ConversionError` ile reddeder. Bu, UTF-8 bayt sınırı değildir; ayrıştırılmış nesneler ölçülmez.
3. Açık kimlikle veya `"auto"` algılamasıyla bağdaştırıcı seçer.
4. Girdiyi `NormalizedRequest[]` olarak ayrıştırır; ayrıştırma hataları tanılara dönüştürülür.
5. [`buildOpenApi32`](#buildopenapi32) ile OpenAPI 3.2 belgesini oluşturur.
6. `validate` değeri `true` ise [`validateOpenApi32`](#validateopenapi32) ile doğrular ve sonuç tanılarını birleştirir.
7. Bir [`ConvertResult`](#convertresult) döndürür.

```typescript
import { XToOpenApi, CurlAdapter } from "@powerduck/x-to-openapi";

const converter = new XToOpenApi().register(new CurlAdapter());
const result = await converter.convert("curl", curlText, { title: "My API" });
```

---

### `DEFAULT_OPTIONS`

Her [`ConvertOptions`](#convertoptions) ile birleştirilen varsayılan değerler. `ResolvedConvertOptions` olarak dışa aktarılır.

```typescript
const DEFAULT_OPTIONS: ResolvedConvertOptions = {
  openapiVersion: "3.2.0",
  title: "Generated API",
  version: "1.0.0",
  description: "",
  inferPathParameters: true,
  pathParameterMinSamples: 2,
  inferSecurity: true,
  includeCommonHeaders: false,
  includeCookies: false,
  includeExamples: false,
  useServerBasePath: false,
  validate: true,
  strict: false,
};
```

---

### `AdapterRegistry`

Kayıtlı bağdaştırıcıları kimliklerine göre tutar.

```typescript
class AdapterRegistry {
  register<I>(adapter: SourceAdapter<I>): this;
  has(id: string): boolean;
  get(id: string): SourceAdapter<unknown>;
  detect(input: unknown): SourceAdapter<unknown> | undefined;
  ids(): string[];
}
```

| Yöntem | Açıklama |
|---|---|
| `register(adapter)` | Kimliği (`/^[a-z][a-z0-9-]*$/`) doğrular, `parse()` yöntemini kontrol eder ve yinelemeleri reddeder. `this` döndürür. |
| `has(id)` | Bağdaştırıcının kayıtlı olup olmadığını denetler. |
| `get(id)` | Bağdaştırıcıyı döndürür veya kayıtlı kimlikleri listeleyen bir hata fırlatır. |
| `detect(input)` | `canHandle()` yöntemi girdiyi kabul eden ilk bağdaştırıcıyı döndürür. Koşul işlevlerinin fırlattığı istisnalar yakalanır ve ilgili bağdaştırıcı atlanır. |
| `ids()` | Kayıtlı kimlikleri listeler. |

---

### `ConversionError`

`strict` modunda hata düzeyindeki tanılarda, aşırı uzun dize girdisinde veya otomatik bağdaştırıcı seçimi başarısız olduğunda fırlatılır. Varsa tanıları içerir; liste boş olabilir. Geçersiz seçenekler ve kayıt hataları bunun yerine `TypeError` veya `Error` fırlatabilir.

```typescript
class ConversionError extends Error {
  readonly diagnostics: readonly Diagnostic[];
  constructor(
    message: string,
    diagnostics: readonly Diagnostic[],
    options?: { cause?: unknown },
  );
}
```

---

### `DiagnosticBag`

[`XToOpenApi.convert`](#convertsource-input-options) tarafından kullanılan dahili toplayıcı. Yinelenen tanıları kaldırır ve `strict` değeri `true` olduğunda hata düzeyindeki girdiler için `ConversionError` fırlatır.

```typescript
class DiagnosticBag {
  constructor(strict?: boolean); // default false
  report(diagnostic: Diagnostic): void;
  get items(): Diagnostic[];
  hasErrors(): boolean;
}
```

---

## Bağdaştırıcılar

### `CurlAdapter`

Tek curl komutunu, komut gruplarını veya tarayıcı dışa aktarımını `NormalizedRequest[]` biçimine dönüştürür. `curlconverter` kitaplığını sarar ve çıktısını normalleştirir.

```typescript
class CurlAdapter implements SourceAdapter<string | readonly string[]> {
  readonly id = "curl";
  canHandle(input: unknown): boolean;
  parse(
    input: string | readonly string[],
    context: AdapterContext,
  ): Promise<NormalizedRequest[]>;
}
```

- `canHandle`, isteğe bağlı kabuk isteminden (`$`, `#`, `>`) sonra `curl` veya `curl.exe` ile başlayan bir dizeyi ya da dizinin ilk öğesini kabul eder.
- `parse`, çok komutlu girdiyi [`splitCurlCommands`](#splitcurlcommands) ile böler, HTTP(S) dışındaki URL'leri atlar, HTTP/2 sözde üstbilgilerini kaldırır, gövdeleri ve çerezleri ayrıştırır ve kimlik doğrulamayı çıkarır.

> `resolveBackend`, `availableExports` ve `resetBackend`, dahili entegrasyon yardımcılarıdır; desteklenen paket dışa aktarımları değildir. Dahili dosyalar yerine genel bağdaştırıcıyı içe aktarın.

---

### `splitCurlCommands`

Tarayıcının “Copy all as cURL” çıktısını ayrı komutlara böler. Tek/çift tırnakları, ters eğik çizgi ve düzeltme işareti (`^`) ile satır devamlarını, CRLF'yi, kabuk istemlerini (`$`, `#`, `>`, `PS C:\>`) ve `curl.exe` biçimini destekler.

```typescript
function splitCurlCommands(input: string): string[];
```

```typescript
import { splitCurlCommands } from "@powerduck/x-to-openapi";

const commands = splitCurlCommands(`
  $ curl https://api.example.com/users
  > curl https://api.example.com/users/123
`);
// ["curl https://api.example.com/users", "curl https://api.example.com/users/123"]
```

---

### `PostmanAdapter`

Postman Collections v2.0/v2.1.0 verisini `NormalizedRequest[]` biçimine dönüştürür. İç içe klasörleri gezer, öğe > klasör > koleksiyon önceliğiyle kimlik doğrulamayı çözer, gövde modlarını eşler ve test betiklerini korur.

```typescript
class PostmanAdapter implements SourceAdapter<PostmanCollection | string> {
  readonly id = "postman";
  canHandle(input: unknown): boolean;
  parse(
    input: PostmanCollection | string,
    context: AdapterContext,
  ): Promise<NormalizedRequest[]>;
}
```

- `canHandle`, `info` nesnesi ve `item` dizisi içeren bir nesneyi veya ayrıştırılmış JSON dizesini kabul eder. v2.1.0 ve v2.0 şema URL'lerinin yanı sıra şema URL'sini içermeyen, yapısal olarak geçerli koleksiyonlar da kabul edilir.
- Test ve istek öncesi olaylar, işlem üzerinde `x-postman-scripts` olarak üretilir.

---

### `PostmanTypes`

Bağdaştırıcının kullandığı tüm Postman koleksiyonu türlerini içeren ad alanı:

```typescript
import { PostmanTypes } from "@powerduck/x-to-openapi";

type Collection = PostmanTypes.PostmanCollection;
type Item = PostmanTypes.PostmanItem;
type Request = PostmanTypes.PostmanRequest;
type Body = PostmanTypes.PostmanBody;
type Auth = PostmanTypes.PostmanAuth;
type Script = PostmanTypes.PostmanScript;

// Runtime type guards are functions; the other members are TypeScript types.
const isFolder = PostmanTypes.isFolder;
const isRequestItem = PostmanTypes.isRequestItem;
```

Başlıca üyeler: `PostmanCollection`, `PostmanInfo`, `PostmanVersion`, `PostmanItem`, `PostmanFolder`, `PostmanRequestItem`, `PostmanRequest`, `PostmanHeader`, `PostmanUrl`, `PostmanQueryParam`, `PostmanBodyMode`, `PostmanBody`, `PostmanUrlEncodedParam`, `PostmanFormDataParam`, `PostmanFileParam`, `PostmanGraphQLBody`, `PostmanAuthType`, `PostmanAuth`, `PostmanAuthParam`, `PostmanEvent`, `PostmanScript`, `PostmanVariable`, `PostmanDescription`, `isFolder`, `isRequestItem`.

---

## OpenAPI yapı taşları

### `buildOpenApi32`

Düşük seviyeli oluşturucu. Normalleştirilmiş istek dizisinden OpenAPI 3.2 belgesi oluşturur. Genellikle [`XToOpenApi.convert`](#convertsource-input-options) üzerinden dolaylı olarak çağrılır.

```typescript
function buildOpenApi32(
  requests: readonly NormalizedRequest[],
  options: ResolvedConvertOptions,
  report: (diagnostic: Diagnostic) => void,
): OpenApiDocument;
```

İşlemleri yol ve yönteme göre gruplar; sorgu, üstbilgi, çerez ve yol parametrelerini toplar; gövde şemalarını birleştirir; `securitySchemes` üretir; standart dışı yöntemleri `additionalOperations` içine yerleştirir ve `operationId`/`tags` atar.

---

### `buildPathTemplates`

Aynı yapıdaki istekleri gruplar; en az `minSamples` örnekte değişen ve her örnekte tanımlayıcıya benzeyen bölümleri şablonlaştırır.

```typescript
function buildPathTemplates(
  requests: readonly NormalizedRequest[],
  minSamples: number,
  enabled: boolean,
): Map<number, PathTemplate>;
```

Anahtarı `sourceIndex` olan bir eşleme döndürür. Her `PathTemplate` şunları içerir:

```typescript
interface PathTemplate {
  readonly path: string;                    // e.g. "/users/{userId}"
  readonly parameters: ReadonlyMap<number, string>; // segment index → name
}
```

`enabled` değeri `false` olduğunda her istek, ham yol adına eşit bir statik şablon alır.

---

### `looksLikeIdentifier`

Hangi bölümlerin şablonlaştırılabileceğini belirleyen merkezi kural.

```typescript
function looksLikeIdentifier(segment: string): boolean;
```

Bölüm yalnızca sayısal, UUID, ULID veya en az 8 karakterli onaltılık dize ise `true` döndürür.

---

### `scalar`

Tek bir dize örneğinden, bilinçli olarak temkinli bir yaklaşımla JSON Schema çıkarır.

```typescript
function scalar(value: string, includeExample?: boolean): Schema; // default false
```

`boolean`, güvenli tamsayı uzunluğu sınırı olan `integer`, `number` veya `format` (`uuid`, `date`, `date-time`) içeren `string` çıkarır; diğer durumlarda düz `string` kullanır.

---

### `jsonSchema`

Herhangi bir JSON değerinden (nesne, dizi, skaler) JSON Schema çıkarır.

```typescript
function jsonSchema(value: unknown, includeExample?: boolean): Schema; // default false
```

Nesneler `{ type: "object", properties, required }`, diziler `{ type: "array", items }` olur; boş diziler için `{}` kullanılır. Skalerler `scalar` benzeri tür kurallarını izler.

---

### `mergeSchemas`

Birden çok örnek şemayı yapısal olarak birleştirir. Nesne özellikleri birleştirilir; herhangi bir örnekte eksik olan özellik isteğe bağlı olur. Diziler özyinelemeli işlenir; `integer`, `number` olarak genişletilir. Biçimler yalnızca tüm örneklerde aynıysa korunur.

```typescript
function mergeSchemas(schemas: readonly Schema[]): Schema;
```

---

### `Schema`

Çıkarılan gövde ve parametrelerde kullanılan yapısal JSON Schema alt kümesi.

```typescript
interface Schema {
  type?: string | string[];
  format?: string;
  properties?: Record<string, Schema>;
  required?: string[];
  items?: Schema;
  example?: unknown;
  contentMediaType?: string;
  description?: string;
  nullable?: boolean;
  [key: string]: unknown; // OpenAPI extensions and unmodeled fields
}
```

---

## Kanonik tür ve doğrulama

### `validateOpenApi32`

Bir OpenAPI belgesini `@powerduck/openapi-parser` aracılığıyla OpenAPI 3.2 şemasına göre doğrular.

```typescript
function validateOpenApi32(
  document: OpenApiDocument,
): Promise<ValidationOutcome>;

interface ValidationOutcome {
  valid: boolean;
  diagnostics: Diagnostic[];
}
```

Doğrulama hataları `OAS_VALIDATION_ERROR` kodlu tanılara, doğrulayıcı hataları ise `OAS_VALIDATOR_FAILED` koduna eşlenir.

### `validateOpenApiDocument`

[`validateOpenApi32`](#validateopenapi32) için kanonik takma ad. Bağımlı `@powerduck/*` kitaplıkları bu kararlı adı içe aktarmalıdır.

```typescript
import { validateOpenApiDocument } from "@powerduck/x-to-openapi";

const { valid, diagnostics } = await validateOpenApiDocument(doc);
```

### `OpenApiDocument`

Kanonik OpenAPI 3.2 belge türü; `@powerduck/openapi-parser` içindeki `Oas32Document` türünün takma adıdır. Tüm `@powerduck/*` kitaplıkları üçüncü taraf tür paketlerine doğrudan erişmek yerine bunu kullanmalıdır.

### `OpenApi32Document`

`OpenApiDocument` için sürüme özgü takma ad.

---

## Türler

### `ConvertOptions`

Tüm dönüştürme ayarları. Ayarlanmayan alanlar [`DEFAULT_OPTIONS`](#default_options) değerlerini kullanır.

```typescript
interface ConvertOptions {
  openapiVersion?: "3.2.0";
  title?: string;
  version?: string;
  description?: string;
  inferPathParameters?: boolean;
  pathParameterMinSamples?: number;
  inferSecurity?: boolean;
  includeCommonHeaders?: boolean;
  includeCookies?: boolean;
  includeExamples?: boolean;
  useServerBasePath?: boolean;
  validate?: boolean;
  strict?: boolean;
}
```

| Seçenek | Tür | Varsayılan | Açıklama |
|---|---|---|---|
| `openapiVersion` | `"3.2.0"` | `"3.2.0"` | Yalnızca `"3.2.0"` desteklenir; diğer değerler hata fırlatır. |
| `title` | `string` | `"Generated API"` | `info.title`. Boş olamaz. |
| `version` | `string` | `"1.0.0"` | `info.version`. Boş olamaz. |
| `description` | `string` | `""` | `info.description`. Boşsa atlanır. |
| `inferPathParameters` | `boolean` | `true` | Tanımlayıcıya benzeyen değişken bölümleri şablonlaştırır. |
| `pathParameterMinSamples` | `number` | `2` | Şablonlaştırma için bir grupta gereken en az istek sayısı. Pozitif tamsayı olmalıdır. |
| `inferSecurity` | `boolean` | `true` | `securitySchemes` ve işlem başına `security` üretir. |
| `includeCommonHeaders` | `boolean` | `false` | Tarayıcının eklediği yardımcı üstbilgileri dahil eder. Aktarım üstbilgileri her zaman hariç tutulur. |
| `includeCookies` | `boolean` | `false` | Çerezleri parametre olarak üretir. |
| `includeExamples` | `boolean` | `false` | Gözlemlenen değerlerden şema ve parametre örneklerini doldurur. |
| `useServerBasePath` | `boolean` | `false` | Tüm istekler aynı kökene sahipse ortak yol önekini `servers[0].url` içine alır. |
| `validate` | `boolean` | `true` | Çıktı belgesini doğrular. Doğrulama hataları tanı olur; katı mod bunları istisnaya dönüştürebilir. |
| `strict` | `boolean` | `false` | Hata düzeyindeki herhangi bir tanıda `ConversionError` fırlatır. |

`ResolvedConvertOptions`, `Required<ConvertOptions> & { openapiVersion: "3.2.0" }` türüdür.

---

### `ConvertResult`

Her dönüştürmenin dönüş değeri.

```typescript
interface ConvertResult {
  /** The generated OpenAPI 3.2 document. */
  document: OpenApiDocument;
  /** Normalized requests (urlString is populated for JSON serialization). */
  requests: NormalizedRequest[];
  /** All diagnostics produced during conversion. */
  diagnostics: Diagnostic[];
  /** True when no error-severity diagnostic was produced. */
  ok: boolean;
  /** True when the document passed validation (or validation was skipped). */
  documentValid: boolean;
}
```

---

### `NormalizedRequest`

Her bağdaştırıcının ürettiği, bağdaştırıcıdan bağımsız ara gösterim.

```typescript
interface NormalizedRequest {
  source: string;            // adapter id, e.g. "curl"
  sourceIndex: number;       // index within the source
  method: string;            // lowercase token, e.g. "get", "post", "purge"
  url: URL;
  urlString?: string;        // string form, set for JSON-safe serialization
  headers: readonly Header[];
  query: readonly ParameterValue[];
  cookies: readonly ParameterValue[];
  body?: RequestBody;
  auth?: RequestAuth;
  /** x-* extensions merged onto the operation (first-wins per key). */
  extensions?: Readonly<Record<string, unknown>>;
}
```

---

### `Diagnostic` / `DiagnosticCode` / `Severity`

```typescript
type Severity = "info" | "warning" | "error";

interface Diagnostic {
  code: DiagnosticCode;
  message: string;
  severity: Severity;
  source?: string;   // adapter id
  index?: number;    // source command index
  path?: string;      // affected OpenAPI path
  cause?: unknown;    // underlying error
}
```

`DiagnosticCode`, çerçevenin bildirebileceği tüm kodlardan oluşan bir dize birleşim türüdür:

`ADAPTER_PARSE_FAILED`, `CURL_PARSE_FAILED`, `CURL_EMPTY_INPUT`, `CURL_CAPABILITY_MISSING`, `CURL_BACKEND_JSON_FALLBACK`, `CURL_UNSUPPORTED_SCHEME`, `POSTMAN_INVALID_COLLECTION`, `POSTMAN_EMPTY_COLLECTION`, `POSTMAN_UNSUPPORTED_BODY_MODE`, `POSTMAN_VARIABLE_UNRESOLVED`, `BODY_JSON_INVALID`, `PATH_MERGE_CONFLICT`, `OPERATION_ID_COLLISION`, `PSEUDO_HEADER_DROPPED`, `MULTIPLE_SERVERS`, `NO_REQUESTS`, `OAS_VALIDATION_ERROR`, `OAS_VALIDATOR_FAILED`, `DISCOVERY_COMPONENT_NOT_FOUND`, `DISCOVERY_COMPONENT_NAME_COLLISION`, `DISCOVERY_PATH_PARAM_MISMATCH`, `DISCOVERY_MEDIA_WITHOUT_SCHEMA`, `DISCOVERY_RESPONSE_MISSING`, `DISCOVERY_SECURITY_SCHEME_MISSING`, `DISCOVERY_GAP`, `DISCOVERY_PATH_CONFLICT`.

---

### Diğer temel türler

```typescript
type JsonObject = Record<string, unknown>;

interface Header { readonly name: string; readonly value: string; }
interface ParameterValue { readonly name: string; readonly value: string; }
interface FormField {
  readonly name: string;
  readonly value?: string;
  readonly fileName?: string;
  readonly contentType?: string;
}

type BodyKind = "json" | "xml" | "form-urlencoded" | "multipart" | "text" | "binary";

interface RequestBody {
  readonly kind: BodyKind;
  readonly mediaType: string;
  readonly raw?: string;
  readonly fields?: readonly FormField[];
}

type RequestAuth =
  | { readonly type: "basic" }
  | { readonly type: "bearer" }
  | { readonly type: "apiKey"; readonly in: "header" | "query" | "cookie"; readonly name: string };

interface AdapterContext {
  readonly report: (diagnostic: Diagnostic) => void;
  readonly strict: boolean;
}

interface SourceAdapter<I = unknown> {
  readonly id: string;
  canHandle?(input: unknown): boolean;
  parse(input: I, context: AdapterContext): Promise<NormalizedRequest[]>;
}
```

---

## Keşif ara gösteriminin dönüştürülmesi

### `discoveryToOpenApi`

Verilen `DiscoveredProject` nesnesini OpenAPI 3.2'ye dönüştürür. Kaynak dosyaları kendisi taramaz. Çözümlenemeyen rotalar uyarı üretir ve hiçbir zaman sessizce `paths` içine eklenmez; kaynak konumları ve güven düzeyi döndürülen projede kullanılabilir durumda kalır.

```typescript
function discoveryToOpenApi(
  project: DiscoveredProject,
  options?: DiscoveryOptions,
): Promise<DiscoveryResult>;

interface DiscoveryOptions {
  openapiVersion?: "3.2.0";
  allowGaps?: boolean; // default true
  validate?: boolean; // default true
}

interface DiscoveryResult {
  readonly document: OpenApiDocument;
  readonly project: DiscoveredProject;
  readonly diagnostics: Diagnostic[];
  readonly ok: boolean;
  readonly documentValid: boolean;
}
```

`allowGaps: false`, işlem/şema eksikliği tanılarını hataya yükseltir; katı mod istisnalarını açan bir anahtar değildir. Her zaman `ok`, `documentValid` ve `diagnostics` alanlarını kontrol edin. Çözümlenemeyen rota uyarıları ayrı bildirilir. Doğrulama kapatıldığında, şema doğrulaması yapılmadan `documentValid` doğru olur.

### `buildDiscoveryOpenApi32`

Aynı ara gösterim için düşük seviyeli eşzamanlı oluşturucu. Tanıları verilen geri çağırma işleviyle bildirir ve belge doğrulaması çalıştırmaz. Doğrulama ve eksiksiz bir sonuç nesnesi gerektiğinde eşzamansız sarmalayıcıyı tercih edin.

```typescript
function buildDiscoveryOpenApi32(
  project: DiscoveredProject,
  allowGaps: boolean,
  report: (diagnostic: Diagnostic) => void,
): OpenApiDocument;
```

Ana giriş noktasından dışa aktarılan keşif türleri: `Confidence`, `GapCode`, `SourceLocation`, `JsonSchema`, `DiscoveredParameter`, `DiscoveredMediaType`, `DiscoveredRequestBody`, `DiscoveredResponse`, `DiscoveredOperation`, `DiscoveredComponent`, `DiscoveredSecurityScheme`, `DiscoveredServer`, `DiscoveredUnresolved`, `DiscoveredProject`, `DiscoveryOptions`, `DiscoveryResult`.

```typescript
import { discoveryToOpenApi } from "@powerduck/x-to-openapi";

const discovered = await discoveryToOpenApi({
  title: "Health API",
  operations: [{
    method: "get",
    path: "/health",
    responses: [{ statusCode: "204", description: "Healthy", confidence: "high" }],
    confidence: "high",
    origin: { file: "src/routes.ts", line: 1 },
  }],
});
console.log(discovered.ok, discovered.documentValid, discovered.diagnostics);
```

---

## Dışa aktarımların özeti

| Simge | Kategori |
|---|---|
| `curlToOpenApi` | işlev |
| `postmanToOpenApi` | işlev |
| `XToOpenApi` | sınıf |
| `DEFAULT_OPTIONS` | sabit |
| `AdapterRegistry` | sınıf |
| `ConversionError` | sınıf |
| `DiagnosticBag` | sınıf |
| `CurlAdapter` | sınıf |
| `splitCurlCommands` | işlev |
| `PostmanAdapter` | sınıf |
| `PostmanTypes` | ad alanı |
| `buildOpenApi32` | işlev |
| `buildPathTemplates` | işlev |
| `looksLikeIdentifier` | işlev |
| `scalar` | işlev |
| `jsonSchema` | işlev |
| `mergeSchemas` | işlev |
| `Schema` | tür |
| `discoveryToOpenApi` | işlev |
| `buildDiscoveryOpenApi32` | işlev |
| `validateOpenApi32` | işlev |
| `validateOpenApiDocument` | işlev (takma ad) |
| `OpenApiDocument` | tür |
| `OpenApi32Document` | tür |
| `DiscoveredProject`, `DiscoveryOptions`, `DiscoveryResult` | türler |
| `ConvertOptions`, `ConvertResult`, `NormalizedRequest`, `SourceAdapter`, `AdapterContext`, `Diagnostic`, `DiagnosticCode`, `Severity`, `Header`, `ParameterValue`, `FormField`, `BodyKind`, `RequestBody`, `RequestAuth`, `JsonObject`, `ResolvedConvertOptions` | türler |
