---
sidebar_position: 4
title: "API Başvurusu"
description: "@powerduck/openapi-codegen için eksiksiz API dokümantasyonu."
---

# API Başvurusu

`@powerduck/openapi-codegen` için eksiksiz API dokümantasyonu.

## Üst düzey işlevler

| Dışa aktarım | İmza | Açıklama |
|--------|-----------|-------------|
| `generate` | `(options: GenerateOptions) => string` | Bir işlem için çalıştırılabilir kaynak kodu üretir |
| `register` | `(generator: Generator) => void` | Özel üretici kaydeder |
| `get` | `(language: string, client: string) => Generator \| undefined` | Üretici arar |
| `list` | `() => Array<{ language: string; client: string }>` | Kayıtlı tüm üreticileri listeler |
| `use` | `(plugin: Plugin) => void` | Üretici kaydeden bir eklentiyi uygular |
| `registerBuiltins` | `() => void` | Tüm yerleşik üreticileri kaydeder; içe aktarılırken otomatik çağrılır |
| `normalize` | `(options) => NormalizedRequest` | Belge, yol ve yöntemi normalleştirilmiş isteğe dönüştürür |
| `builtinGenerators` | `Generator[]` | Tüm yerleşik üretici tanımlarının ham dizisi |

Yerleşik üreticiler modül yüklenirken otomatik kaydedildiğinden `registerBuiltins()` çağrısını elle yapmak isteğe bağlıdır.

## generate(options)

```ts
generate(options: GenerateOptions): string
```

Üretilen kaynak kodunu dize olarak döndürür. Üreticiyi `get(options.language, options.client)` ile bulur; `options.request` yoksa `normalize({ document, path, method, serverUrl, securityValues, softRefMode })`, ardından `generator.generate(request)` çağrılır.

Olası hatalar:

- `options` nesne değilse veya zorunlu girdiler eksikse `TypeError`.
- Bilinmeyen birleşim için `Error: Unsupported generator: <language>/<client>`.
- `normalize()` hataları: bilinmeyen yol/yöntem, geçersiz belge, `softRefMode` açık değilken bozuk veya döngüsel `$ref`.

Tüm seçenekler için [Yapılandırma](/docs/tr-TR/openapi-codegen/configuration/#generateoptions) tablosuna bakın.

## register(generator)

```ts
register({
  language: "mylang",
  client: "my-client",
  generate(request) {
    return `// ${request.method} ${request.path}`;
  },
});
```

Büyük/küçük harfe duyarsız iç depoya `language\0client` anahtarıyla kaydeder.

## get(language, client)

```ts
const generator = get("javascript", "fetch");
```

`Generator` döndürür; bulunamazsa `undefined` döner.

## list()

```ts
const combos = list();
// [{ language: "c", client: "libcurl" }, ...]
```

## use(plugin)

```ts
use({
  name: "my-plugin",
  register({ register }) {
    register(customGenerator);
  },
});
```

`plugin.register({ register })` çağrısına eşdeğerdir.

## registerBuiltins()

```ts
registerBuiltins();
```

İç bayrakla korunan eşgüçlü işlemdir. `builtinGenerators` içindeki her girdiyi kaydeder.

## normalize(options)

```ts
import { normalize } from "@powerduck/openapi-codegen";

const request = normalize({
  document,
  path: "/pets/{id}",
  method: "get",
  serverUrl: "https://example.com",
  securityValues: { bearerAuth: "token" },
  softRefMode: false,
});
```

`$ref` başvurularını çözer, yol/işlem parametrelerini birleştirir, gövde medya türünü seçer, örnek değerler üretir, güvenliği çözümler ve `baseUrl` hesaplar. Bilinmeyen yollar/yöntemler ve desteklenmeyen yöntemlerde hata fırlatır.

## Yerleşik üreticiler (21 dil, 41 istemci) {#built-in-generators-21-languages-41-clients}

`src/emitters/index.ts` içinde kayıtlı tam `language` / `client` tanımlayıcıları. Arama büyük/küçük harfe duyarsızdır; tabloda standart tanımlayıcılar yer alır.

| Dil | `language` | `client` değerleri |
|----------|-----------|-----------------|
| C | `c` | `libcurl` |
| C# | `csharp` | `httpclient`, `restsharp` |
| Clojure | `clojure` | `clj-http` |
| Dart | `dart` | `http` |
| F# | `fsharp` | `httpclient` |
| Go | `go` | `new-request` |
| HTTP istek dosyası | `http` | `http1` |
| Java | `java` | `asynchttp`, `java-net-http`, `okhttp`, `unirest` |
| JavaScript | `javascript` | `axios`, `fetch`, `jquery`, `ofetch`, `xhr` |
| Kotlin | `kotlin` | `okhttp` |
| Node.js | `node` | `axios`, `fetch`, `ofetch`, `undici` |
| Objective-C | `objc` | `nsurlsession` |
| OCaml | `ocaml` | `cohttp` |
| PHP | `php` | `curl`, `guzzle`, `laravel-http` |
| PowerShell | `powershell` | `invoke-restmethod`, `invoke-webrequest` |
| Python | `python` | `aiohttp`, `http-client`, `httpx-async`, `httpx-sync`, `requests` |
| R | `r` | `httr2` |
| Ruby | `ruby` | `net-http` |
| Rust | `rust` | `reqwest` |
| Shell | `shell` | `curl`, `httpie`, `wget` |
| Swift | `swift` | `nsurlsession` |

Toplam: 21 dil, 41 birleşim.

> Bir üreticinin bulunması, her istemcinin her işlemi temsil edebileceği anlamına gelmez. Örneğin `shell/wget` rastgele `multipart/form-data` isteklerini güvenle oluşturamaz; bunun yerine `shell/curl` veya `shell/httpie` kullanın.

## Temel türler

`./types` üzerinden yeniden dışa aktarılır:

```ts
type ParameterLocation = "path" | "query" | "querystring" | "header" | "cookie";

interface FileValue { __file: true; path?; name?; contentType?; data?; }
interface Parameter { name; in: ParameterLocation; value: unknown; style?; explode?; allowReserved?; }
interface Body { mediaType: string; value: unknown; encoding?: Record<string, unknown>; }
interface Security { name; type; scheme?; in?; paramName?; value: string; }
interface RequestIR { method; baseUrl; path; parameters: Parameter[]; headers: Parameter[]; body?; security: Security[]; }
interface GenerateResult { code: string; files?: Record<string, string>; metadata?: Record<string, unknown>; }
interface Generator { language: string; client: string; generate(request: RequestIR): string; }
interface Plugin { name: string; register(api: { register(g: Generator): void }): void; }
interface GenerateOptions { language; client; request?; document?; path?; method?; serverUrl?; securityValues?; softRefMode?; }
```

## Çekirdek işlevleri

Tümü paket kökünden yeniden dışa aktarılır.

### refs

| Dışa aktarım | Açıklama |
|--------|-------------|
| `RefResolver` | Belge içi `#/...` JSON Pointer çözümleme sınıfı. Kurucu: `(root, softMode = false)`. Yöntemler: `deref(value)`, `resolveRef(ref)`, `clearCache()`. Açık alan: `softMode`. `softMode` doğru değilse dış/bozuk/döngüsel başvurularda hata fırlatır. |

### example

| Dışa aktarım | Açıklama |
|--------|-------------|
| `example(schema, resolver, seen?, depth=0, ctx=default)` | JSON Schema'dan örnek değer üretir. `example`, `enum`, `const`, `default`, `oneOf`/`anyOf`/`allOf`, tür, biçim ve kısıtlamaları dikkate alır. |
| `ExampleGenContext` | `readOnly`/`writeOnly` süzmesini denetleyen `{ isRequestBody: boolean; isResponse: boolean }` türü. |
| `defaultExampleContext` | Varsayılan değer `{ isRequestBody: false, isResponse: false }`. |

### serialize

| Dışa aktarım | Açıklama |
|--------|-------------|
| `Pair` | `[string, string]` türü. |
| `parameter(parameter)` | Bir parametreyi OpenAPI `style`/`explode` kurallarına göre `Pair[]` olarak serileştirir: form, spaceDelimited, pipeDelimited, label, matrix, simple, deepObject. |
| `query(pairs)` | Çiftleri sorgu dizesine birleştirir. |
| `cookie(pairs)` | Çiftleri `Cookie` başlık değerine birleştirir. |
| `headerValue(value)` | Başlık değerinden CR/LF/NUL karakterlerini temizler. |

### generator

| Dışa aktarım | Açıklama |
|--------|-------------|
| `createGenerator(language, client, emit)` | `emit(request) => string` işlevini `Generator` içine sarar. |
| `GeneratorEmitter` | `(request: RequestIR) => string` türü. |

### registry

| Dışa aktarım | Açıklama |
|--------|-------------|
| `registerGenerator(generator)` | Büyük/küçük harfe duyarsız depoya ekler. |
| `getGenerator(language, client)` | Depodan okur. |
| `listGenerators()` | `[{ language, client }, ...]` döndürür. |

### plugin

| Dışa aktarım | Açıklama |
|--------|-------------|
| `PluginApi` | `{ register(generator: Generator): void }` türü. |
| `applyPlugin(plugin, api)` | `plugin.register(api)` çağırır. |

### request

| Dışa aktarım | Açıklama |
|--------|-------------|
| `CompiledRequest` | `{ url; headers: Array<[string,string]>; body?; queryPairs; cookiePairs }` türü. |
| `compile(request)` | Yol parametrelerini yerleştirir, query/header/cookie çiftlerini oluşturur, güvenliği uygular ve URL'yi birleştirir. |
| `form(value)` | Nesneyi `application/x-www-form-urlencoded` dizesine serileştirir. |

### helpers

Sık kullanılan yardımcılar:

| Dışa aktarım | Açıklama |
|--------|-------------|
| `isRecord(value)` | Düz nesneler için tür koruması. |
| `isFileValue(value)` | `FileValue` işaretçisi için tür koruması. |
| `firstDefined(...values)` | `undefined` olmayan ilk değer. |
| `nonBlankString(value, fallback?)` | Kenar boşlukları temizlenmiş boş olmayan dize veya `undefined`/yedek değer. |
| `normalizeMethod(method)` | Büyük harfli yöntem; yedek değer `GET`. |
| `supportsRequestBody(method)` | `GET`/`HEAD` için `false`. |
| `requiresRequestBody(method)` | `POST`/`PUT`/`PATCH` için `true`. |
| `mediaTypeOf(request, fallback)` | Gövde veya Content-Type başlığından geçerli medya türü. |
| `hasJsonBody(request)` | JSON veya `+json` medya türü. |
| `hasFormBody(request)` | `application/x-www-form-urlencoded`. |
| `hasMultipartBody(request)` | `multipart/form-data`. |
| `bodyText(request)` | Ham gövde metni veya biçimlendirilmiş JSON. |
| `toHeaderObject(headers)` | Çiftleri `Record<string,string>` nesnesine dönüştürür. |
| `toKeyValueBody(value)` | Multipart gövdeyi sıralı alan tanımlayıcılarına düzleştirir. |
| `collectByLocation(request, location)` | Parametreleri OpenAPI konumuna göre süzer. |
| `operationName(request)` | Yöntem ve yoldan snake_case işlev/değişken adı türetir. |
| `sanitizeIdentifier(value)` | Rastgele metni geçerli tanımlayıcıya dönüştürür. |
| `indent(text, prefix="  ")` | Boş olmayan her satırı girintiler. |
| `stringifyLiteral(value)` | Güvenli yedek davranışla biçimlendirilmiş JSON. |
| `kotlinValue(value)` / `formFieldValue(value)` | Değeri sabit ifade veya form alanı için serileştirir. |
| `fileComment(path, fieldName)` | Multipart yer tutucu yolu için TODO açıklaması oluşturur. |
| `mergeAllOfSchemas(schemas, resolver)` | `allOf` şemalarını yüzeysel birleştirir. |
| `lightweightOpenAPIPreCheck(doc)` | Belgenin yapısal uyarılarını döndürür. |
| `browserHeaders(headers, multipart)` | Tarayıcının yasakladığı başlıkları kaldırır. |
| `isBrowserForbiddenHeader(name)` | Başlığın tarayıcı ağ API'leri tarafından yönetilip yönetilmediği. |
| `escapeJs`, `escapePy`, `escapeSh`, `escapePhp`, `escapeRuby`, `escapePowerShell`, `escapeCSharp`, `escapeJava`, `escapeGo`, `escapeRust`, `escapeObjC`, `escapeSwift`, `escapeR`, `escapeOCaml`, `escapeFSharp`, `escapeClojure` | Dile özgü dize sabitleri için kaçış işlevleri. |
| `assertIsRecord`, `assertIsString`, `assertIsNumber` | Çalışma zamanı doğrulama korumaları. |
| `DEFAULT_FILE_PATH`, `DEFAULT_FILE_NAME`, `DEFAULT_BINARY_MEDIA_TYPE` | Yer tutucu dosya yüklemelerine ait sabitler. |
