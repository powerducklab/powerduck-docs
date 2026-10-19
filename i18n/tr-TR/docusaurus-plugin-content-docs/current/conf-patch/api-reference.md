---
sidebar_position: 4
title: "API başvurusu"
description: "@powerduck/conf-patch için dışa aktarılan her sembolün imzasını ve varsayılan değerlerini içeren eksiksiz başvuru."
---

# API başvurusu

`@powerduck/conf-patch` için dışa aktarılan her sembolün imzasını ve varsayılan değerlerini içeren eksiksiz başvuru.

İki giriş noktası vardır:

- **`@powerduck/conf-patch`** — aşağıdaki tüm özellikler: çekirdek katman, dosya katmanı, OpenAPI doğrulaması ve yardımcılar.
- **`@powerduck/conf-patch/core`** — yalnızca tarayıcı uyumlu alt küme: `patchContent`, `setContentValue`, `deleteContentValue`, `PatchContentOptions`, doğrulama yardımcıları ve `ConfigFormat`, `JsonPatchOp`, `JsonPathSegment` türleri.

---

## Çekirdek katman (tarayıcı uyumlu)

### `patchContent`

Yapılandırma dizesine RFC 6902 yama işlemleri dizisi uygular. Dosya sistemine erişmeyen saf bir işlevdir.

```typescript
function patchContent(
  content: string,
  ops: JsonPatchOp[],
  format: ConfigFormat,
  options?: PatchContentOptions,
): string;
```

| Parametre | Tür | Açıklama |
|---|---|---|
| `content` | `string` | Ham yapılandırma içeriği. Belirtilen `format` için geçerli olmalıdır. |
| `ops` | `JsonPatchOp[]` | Sırayla uygulanacak işlemler. Boş dizi, `content` değerini değiştirmeden döndürür. |
| `format` | `ConfigFormat` | `"json" \| "jsonc" \| "yaml"`. |
| `options.strict` | `boolean` | `true` (varsayılan) olduğunda başarısız işlem istisna oluşturur. `false` olduğunda atlanır ve `console.warn` ile bildirilir. |

**Döndürür:** değiştirilmiş yapılandırma içeriği (`string`).

**İstisnalar:** `content` dize değilse veya `ops` geçersizse `TypeError`; `strict`, `true` olduğunda başarısız işlemi açıklayan hata.

```typescript
import { patchContent } from "@powerduck/conf-patch/core";

patchContent(
  '{"name": "app"}',
  [{ op: "add", path: ["version"], value: "1.0.0" }],
  "json",
);
// => '{\n  "name": "app",\n  "version": "1.0.0"\n}'
```

---

### `setContentValue`

Tek bir değeri ayarlar veya oluşturur. İçeride tek bir `add` işlemiyle `patchContent` çağırır. RFC 6902’ye göre `add`, mevcut nesne özelliğini değiştirir veya dizi indeksine ekler.

```typescript
function setContentValue(
  content: string,
  path: readonly (string | number)[],
  value: unknown,
  format: ConfigFormat,
): string;
```

| Parametre | Tür | Açıklama |
|---|---|---|
| `content` | `string` | Ham yapılandırma içeriği. |
| `path` | `readonly (string \| number)[]` | Bölümlere ayrılmış yol; örneğin `["server", "port"]`. Boş olamaz. |
| `value` | `unknown` | Yazılacak değer. |
| `format` | `ConfigFormat` | Yapılandırma biçimi. |

**Döndürür:** güncellenmiş içerik (`string`).

```typescript
setContentValue("server:\n  port: 3000\n", ["server", "port"], 8080, "yaml");
```

---

### `deleteContentValue`

Anahtar veya dizi öğesini kaldırır. İçeride tek bir `remove` işlemiyle `patchContent` çağırır. Yol mevcut olmalıdır.

```typescript
function deleteContentValue(
  content: string,
  path: readonly (string | number)[],
  format: ConfigFormat,
): string;
```

```typescript
deleteContentValue(
  '{"name": "app", "legacy": true}',
  ["legacy"],
  "json",
);
```

---

### `PatchContentOptions`

```typescript
interface PatchContentOptions {
  /** When true, failed operations throw. When false, they are skipped with a warning. Default: true */
  strict?: boolean;
}
```

---

## Dosya katmanı (yalnızca Node.js / Electron)

### `readConfigFile`

Yerel dosya yolundan veya `file://` URL’sinden UTF-8 metin okur.

```typescript
function readConfigFile(filePath: string): Promise<string>;
```

| Parametre | Tür | Açıklama |
|---|---|---|
| `filePath` | `string` | Mutlak yol, göreli yol veya `file://` URL’si. Boş olamaz. |

**Döndürür:** ham UTF-8 içerik (`Promise<string>`).

**İstisnalar:** dosya okunamıyorsa altta yatan dosya sistemi hatasını içeren bir hata.

---

### `writeConfigFile`

Geçici dosya ve yeniden adlandırmayla **atomik yazma** yapar; varsayılan olarak özel bir **dosya kilidi** kullanır. Üst dizinler kilitlemeden önce oluşturulur.

```typescript
function writeConfigFile(
  filePath: string,
  content: string,
  options?: WriteConfigOptions,
): Promise<void>;
```

| Parametre | Tür | Açıklama |
|---|---|---|
| `filePath` | `string` | Yapılandırma dosyasının yolu. |
| `content` | `string` | Yazılacak içerik. Dize olmalıdır. |
| `options` | `WriteConfigOptions` | Aşağıya bakın. |

**İstisnalar:** geçersiz girdide `TypeError`; yazma sırasında dosya sistemi hataları sarılarak iletilir.

#### `WriteConfigOptions`

| Seçenek | Tür | Varsayılan | Açıklama |
|---|---|---|---|
| `lock` | `boolean` | `true` | Yazma sırasında dosya kilidini etkinleştirir. |
| `lockTimeoutMs` | `number` | `withFileLock` varsayılanı (10 sn) | Kilidi almak için azami bekleme süresi, milisaniye. |
| `lockRetryDelayMs` | `number` | `withFileLock` varsayılanı (25 ms) | Üstel geri çekilmeden önceki ilk yeniden deneme gecikmesi, milisaniye. |
| `lockStaleThresholdMs` | `number` | `withFileLock` varsayılanı | Kurtarmaya izin verilen kilit yaşı, milisaniye. |
| `allowStaleRecovery` | `boolean` | `false` | Eski kilitlerin otomatik geri alınmasına izin verilip verilmeyeceği. |

```typescript
import { writeConfigFile } from "@powerduck/conf-patch";

await writeConfigFile("config.json", '{"name": "app"}');
```

---

### `patchConfigFile`

Dosya katmanının temel işlemi: kilit altında okur, `patchContent` uygular ve **yalnızca içerik değiştiyse** atomik olarak geri yazar. `options.format` verilmezse biçim uzantıdan algılanır.

```typescript
function patchConfigFile(
  filePath: string,
  ops: JsonPatchOp[],
  options?: PatchConfigOptions,
): Promise<void>;
```

| Parametre | Tür | Açıklama |
|---|---|---|
| `filePath` | `string` | Yapılandırma dosyasının yolu. Boş olamaz. |
| `ops` | `JsonPatchOp[]` | Uygulanacak işlemler. Boş dizi, okuma veya yazma yapmadan döner. |
| `options` | `PatchConfigOptions` | Aşağıya bakın. |

**İstisnalar:** `filePath` boşsa, kilit seçenekleri geçersizse veya biçim algılanamıyor ve `format` verilmiyorsa `TypeError`; `strict`, `true` olduğunda işlem hatası.

#### `PatchConfigOptions`

| Seçenek | Tür | Varsayılan | Açıklama |
|---|---|---|---|
| `format` | `ConfigFormat` | otomatik algılanır | Açıkça belirtilen biçim; uzantı algılamasını geçersiz kılar. |
| `strict` | `boolean` | `true` | Başarısız işlemler istisna oluşturur. |
| `lock` | `boolean` | `true` | Dosya kilitlemeyi etkinleştirir. |
| `lockTimeoutMs` | `number` | 10 sn | Negatif olmayan değer. Kilit için azami bekleme süresi. |
| `lockRetryDelayMs` | `number` | 25 ms | Pozitif değer. İlk yeniden deneme gecikmesi. |
| `lockStaleThresholdMs` | `number` | hesaplanır | Pozitif değer. Eski kilit kurtarması için gereken kilit yaşı. |
| `allowStaleRecovery` | `boolean` | `false` | Eski kilitleri otomatik geri alır. |

```typescript
await patchConfigFile("config.json", [
  { op: "replace", path: ["server", "host"], value: "0.0.0.0" },
  { op: "add", path: ["server", "ssl"], value: true },
  { op: "remove", path: ["legacySection"] },
]);
```

---

### `setConfigValue`

Dosyada iç içe bir değer ekler veya değiştirir. Tek bir `add` işlemini `patchConfigFile` işlevine devreder.

```typescript
function setConfigValue(
  filePath: string,
  path: readonly (string | number)[],
  value: unknown,
  options?: PatchConfigOptions,
): Promise<void>;
```

```typescript
await setConfigValue("config.yaml", ["database", "port"], 5432);
```

---

### `deleteConfigValue`

Dosyada var olan iç içe bir değeri kaldırır. Tek bir `remove` işlemini `patchConfigFile` işlevine devreder.

```typescript
function deleteConfigValue(
  filePath: string,
  path: readonly (string | number)[],
  options?: PatchConfigOptions,
): Promise<void>;
```

```typescript
await deleteConfigValue("config.json", ["features", "betaPreview"]);
```

---

### `withFileLock`

Süreç içi kuyruk **ve** özel kilit dosyası (`<file>.confedit.lock`) üzerinden asenkron geri çağırım çalıştırır. Kilitler sahiplik belirteci kullanır. Eski kilit yalnızca `allowStaleRecovery`, `true` olduğunda ve yaşı `staleThresholdMs` sınırını aştığında kurtarılır. PID’ler yeniden kullanılabildiğinden denetlenmez.

```typescript
function withFileLock<T>(
  filePath: string,
  callback: () => Promise<T>,
  options?: FileLockOptions,
): Promise<T>;
```

| Parametre | Tür | Açıklama |
|---|---|---|
| `filePath` | `string` | Kilitlenecek dosya. |
| `callback` | `() => Promise<T>` | Kilit tutulurken çalıştırılacak iş. |
| `options` | `FileLockOptions` | Aşağıya bakın. |

**Döndürür:** `callback` sonucu (`Promise<T>`). Geri çağırım istisna oluştursa bile kilit, `finally` bloğunda bırakılır.

#### `FileLockOptions`

| Seçenek | Tür | Varsayılan | Açıklama |
|---|---|---|---|
| `timeoutMs` | `number` | `10000` | Kilit için azami bekleme süresi, milisaniye. Negatif olamaz. |
| `retryDelayMs` | `number` | `25` | İlk gecikme, milisaniye. Pozitif olmalıdır. Gecikme 1,5 kat artar ve 1000 ms ile sınırlıdır. |
| `staleThresholdMs` | `number` | `max(timeoutMs * 2, 60000)` | Kurtarmaya izin veren kilit yaşı, milisaniye. Pozitif olmalıdır. |
| `allowStaleRecovery` | `boolean` | `false` | Eski kilitlerin otomatik geri alınması. Etkin işlemleri kesmemek için Electron’ın tek ana sürecinde varsayılan olarak kapalıdır. |

```typescript
import { withFileLock } from "@powerduck/conf-patch";

await withFileLock("state.json", async () => {
  // ... read, modify, write ...
}, { timeoutMs: 5000 });
```

---

### `releaseAllLocalLocks`

Geçerli sürecin sahip olduğu tüm kilit dosyalarını kaldırır. Uygulama kapanırken, etkin dosya işlemleri tamamlandıktan sonra kullanın. Electron’da asenkron temizlik için ilk çıkış olayını engelleyin ve temizlik bitince çıkışı sürdürün; örneklere bakın. Tek tek kilitlerde oluşan hatalar yok sayılır.

```typescript
function releaseAllLocalLocks(): Promise<void>;
```

---

## OpenAPI doğrulaması

### `validateOpenAPISpec`

Ham OpenAPI/Swagger içeriğini JSON veya YAML olarak doğrular. Girdi varsayılan olarak **içerik** sayılır; yalnızca `inputKind: "file"` ile dosya yolu olarak yorumlanır. Doğrulama `@powerduck/openapi-parser` işlevine devredilir; bu işlev güvenli girdi işleme ekler.

```typescript
function validateOpenAPISpec(
  input: string,
  options?: ValidateOpenApiOptions,
): Promise<AnyOpenAPIDocument>;
```

| Parametre | Tür | Açıklama |
|---|---|---|
| `input` | `string` | Ham belirtim içeriği veya `inputKind: "file"` olduğunda dosya yolu. |
| `options` | `ValidateOpenApiOptions` | Aşağıya bakın. |

**Döndürür:** başarı halinde doğrulanmış belge (`Promise<AnyOpenAPIDocument>`).

**İstisnalar:** boş veya dize olmayan girdide `TypeError`; geçersiz seçeneklerde veya doğrulama hatalarında [`OpenApiValidationError`](#openapivalidationerror).

---

### `validateOpenAPIFile`

`inputKind: "file"` ve verilen yol olarak ayarlanmış `baseFilePath` ile `validateOpenAPISpec` çağıran kolaylık işlevi. `allowedRootDirectory` gerektirir.

```typescript
function validateOpenAPIFile(
  filePath: string,
  options?: ValidateOpenApiOptions,
): Promise<AnyOpenAPIDocument>;
```

```typescript
import { validateOpenAPIFile } from "@powerduck/conf-patch";

const doc = await validateOpenAPIFile("./configs/openapi.yaml", {
  allowedRootDirectory: "./configs",
});
```

---

### `ValidateOpenApiOptions`

| Seçenek | Tür | Varsayılan | Açıklama |
|---|---|---|---|
| `inputKind` | `"content" \| "file"` | `"content"` | `input` değerinin nasıl yorumlanacağı. |
| `baseFilePath` | `string` | — | Başvuru çözümleme bağlamının temel yolu. |
| `allowedRootDirectory` | `string` | — | Dosya girdileri için kök dizin. `inputKind`, `"file"` olduğunda **zorunludur**. |
| `timeoutMs` | `number` | `15000` | İşlemin süre sınırı, milisaniye. |
| `maxInputBytes` | `number` | `5242880` (5 MB) | Ham girdinin azami boyutu, bayt. |
| `maxDocumentNodes` | `number` | `100000` | Ayrıştırılmış belgede azami düğüm sayısı; DoS koruması. |
| `maxDocumentDepth` | `number` | `100` | Azami iç içe geçme derinliği; DoS koruması. |
| `maxValidationErrors` | `number` | `50` | Hata iletisine dahil edilecek azami hata sayısı. |
| `maxErrorMessageLength` | `number` | `1000` | Doğrulama hatası başına azami karakter sayısı. |
| `signal` | `AbortSignal` | — | İsteğe bağlı iptal sinyali. |

---

### `OpenApiValidationError`

Doğrulama başarısız olduğunda oluşan yapılandırılmış hata. İstemciye döndürmeden önce hataları uygulama sınırında dönüştürün; iletiler ve nedenler yerel yollar veya belge ayrıntıları içerebilir.

```typescript
class OpenApiValidationError extends Error {
  readonly code: string;
  readonly cause?: unknown;
  constructor(code: string, message: string, cause?: unknown);
}
```

| Özellik | Tür | Açıklama |
|---|---|---|
| `code` | `string` | Program tarafından işlenebilir hata kodu; aşağıdaki tabloya bakın. |
| `message` | `string` | Kullanıcının okuyabileceği ayrıntı. |
| `cause` | `unknown` | İsteğe bağlı altta yatan hata. |

#### Hata kodları

| Kod | Anlam |
|---|---|
| `INVALID_OPTION` | Geçersiz seçenek değeri verildi. |
| `INPUT_TOO_LARGE` | Ham içerik `maxInputBytes` sınırını aşıyor. |
| `INPUT_FILE_TOO_LARGE` | Girdi dosyası boyut sınırını aşıyor. |
| `FILE_INPUT_FORBIDDEN` | `allowedRootDirectory` olmadan dosya girdisi kullanıldı. |
| `PATH_OUTSIDE_ROOT` | Çözümlenen dosya yolu `allowedRootDirectory` dışında. |
| `PARSE_ERROR` | JSON/YAML içeriği ayrıştırılamadı. |
| `INVALID_DOCUMENT_SHAPE` | Belge bir JSON nesnesi değil. |
| `UNSUPPORTED_VERSION` | Belge desteklenen OpenAPI/Swagger sürümünü bildirmiyor; yalnızca ana sürüm `2` ve `3` kabul edilir. |
| `DOCUMENT_TOO_DEEP` | Derinlik `maxDocumentDepth` sınırını aşıyor. |
| `DOCUMENT_TOO_LARGE` | Düğüm sayısı `maxDocumentNodes` sınırını aşıyor. |
| `SPEC_VALIDATION_FAILED` | Belirtim OpenAPI doğrulamasından geçemedi. |
| `OPERATION_TIMEOUT` | İşlem `timeoutMs` süresini aştı. |
| `OPERATION_ABORTED` | İşlem `signal` üzerinden iptal edildi. |
| `UNKNOWN_ERROR` | Beklenmeyen hata. |

---

## Yardımcı işlevler

### `detectFormat`

Dosya yolunun veya `file://` URL’sinin uzantısından [`ConfigFormat`](#configformat) algılar.

```typescript
function detectFormat(filePath: string): ConfigFormat;
```

| Uzantı | Sonuç |
|---|---|
| `.json` | `"json"` |
| `.jsonc` | `"jsonc"` |
| `.yaml`, `.yml` | `"yaml"` |
| diğer tüm uzantılar | hata oluşturur |

---

### `normalizeFilePath`

Yerel yolu veya `file:` URL’sini mutlak yerel sistem yoluna dönüştürür. Geçerli boşlukları ve Unicode dosya adlarını korur.

```typescript
function normalizeFilePath(filePath: string): string;
```

`file:` URL’si `fileURLToPath` ile çözümlenir; mutlak yol olduğu gibi döndürülür; göreli yol `process.cwd()` temel alınarak çözümlenir.

---

## Doğrulama yardımcıları

Gelişmiş kullanım ve dahili modüller için yeniden dışa aktarılır. Uygulama kodu bunlara nadiren doğrudan ihtiyaç duyar.

### `assertNonEmptyString`

```typescript
function assertNonEmptyString(value: unknown, label: string): asserts value is string;
```
`value`, boş olmayan bir dize değilse `TypeError` oluşturur.

### `assertPatchPath`

```typescript
function assertPatchPath(
  path: readonly (string | number)[],
  label?: string, // default "path"
): void;
```
`path`, bölümleri boş olmayan dizelerden veya güvenli, negatif olmayan tam sayılardan oluşan boş olmayan bir dizi değilse istisna oluşturur.

### `assertPatchOperations`

```typescript
function assertPatchOperations(ops: JsonPatchOp[]): void;
```
Her işlemi doğrular: `op`, `"add" | "replace" | "remove"` olmalı; `path`, `assertPatchPath` denetiminden geçmeli; `add`/`replace` kendi `value` özelliğini taşımalıdır.

### `assertConfigFormat`

```typescript
function assertConfigFormat(format: ConfigFormat): void;
```
`format`, `"json"`, `"jsonc"` veya `"yaml"` değilse istisna oluşturur.

### `getErrorMessage`

```typescript
function getErrorMessage(error: unknown): string;
```
`Error` örnekleri için `error.message`, diğer durumlarda `String(error)` döndürür.

### `createError`

```typescript
function createError(message: string, cause: unknown): Error;
```
Bir `Error` oluşturur ve `Object.defineProperty` ile `cause` özelliğini ekler; eski çalışma zamanları için alternatif yöntem sunar.

---

## Türler

### `ConfigFormat`

```typescript
type ConfigFormat = "json" | "jsonc" | "yaml";
```

### `JsonPathSegment`

```typescript
type JsonPathSegment = string | number;
```

### `JsonPatchOp`

```typescript
interface JsonPatchOp {
  op: "add" | "replace" | "remove";
  path: JsonPathSegment[];
  /** Required for "add" and "replace". */
  value?: unknown;
}
```

:::caution
Yalnızca `"add"`, `"replace"` ve `"remove"` desteklenir. `"move"`, `"copy"` ve `"test"` bilinçli olarak dışarıda bırakılmıştır.
:::

### `PatchConfigOptions`

```typescript
interface PatchConfigOptions {
  format?: ConfigFormat;
  strict?: boolean;
  lock?: boolean;
  lockTimeoutMs?: number;
  lockRetryDelayMs?: number;
  lockStaleThresholdMs?: number;
  /** Whether stale locks can be automatically reclaimed. Defaults to false. */
  allowStaleRecovery?: boolean;
}
```

### `FileLockOptions`

```typescript
interface FileLockOptions {
  /** Max time to wait for a lock. Defaults to 10 seconds. */
  timeoutMs?: number;
  /** Initial retry delay. Defaults to 25ms. */
  retryDelayMs?: number;
  /** Explicit lock age after which recovery is allowed. */
  staleThresholdMs?: number;
  /** Whether stale locks can be automatically reclaimed. Defaults to false. */
  allowStaleRecovery?: boolean;
}
```

### `WriteConfigOptions`

```typescript
interface WriteConfigOptions {
  lock?: boolean;
  lockTimeoutMs?: number;
  lockRetryDelayMs?: number;
  lockStaleThresholdMs?: number;
  allowStaleRecovery?: boolean;
}
```

### `PatchContentOptions`

```typescript
interface PatchContentOptions {
  strict?: boolean;
}
```

### `OpenApiInputKind`

```typescript
type OpenApiInputKind = "content" | "file";
```

### `AnyOpenAPIDocument`

Doğrulamanın döndürdüğü desteklenen OpenAPI/Swagger belge yapılarının birleşim türü:

```typescript
type AnyOpenAPIDocument =
  | OpenAPIV2.Document      // Swagger 2.0
  | OpenAPIV3.Document      // OpenAPI 3.0.x
  | OpenAPIV3_1.Document     // OpenAPI 3.1.x
  | OpenAPIV3_2Document;    // OpenAPI 3.2 (permissive structural type)
```

`OpenAPIV3_2Document`, esnek bir yapısal türdür:

```typescript
interface OpenAPIV3_2Document {
  openapi: string;
  info: Record<string, unknown>;
  paths?: Record<string, unknown>;
  [key: string]: unknown;
}
```

---

## Dışa aktarım özeti

| Sembol | Ana giriş | Çekirdek alt yolu | Kategori |
|---|:---:|:---:|---|
| `patchContent` | ✓ | ✓ | işlev |
| `setContentValue` | ✓ | ✓ | işlev |
| `deleteContentValue` | ✓ | ✓ | işlev |
| `PatchContentOptions` | ✓ | ✓ | tür |
| `assertNonEmptyString` | ✓ | ✓ | işlev |
| `assertPatchPath` | ✓ | ✓ | işlev |
| `assertPatchOperations` | ✓ | ✓ | işlev |
| `assertConfigFormat` | ✓ | ✓ | işlev |
| `getErrorMessage` | ✓ | ✓ | işlev |
| `createError` | ✓ | ✓ | işlev |
| `ConfigFormat` | ✓ | ✓ | tür |
| `JsonPatchOp` | ✓ | ✓ | tür |
| `JsonPathSegment` | ✓ | ✓ | tür |
| `readConfigFile` | ✓ | — | işlev |
| `writeConfigFile` | ✓ | — | işlev |
| `WriteConfigOptions` | ✓ | — | tür |
| `patchConfigFile` | ✓ | — | işlev |
| `setConfigValue` | ✓ | — | işlev |
| `deleteConfigValue` | ✓ | — | işlev |
| `withFileLock` | ✓ | — | işlev |
| `releaseAllLocalLocks` | ✓ | — | işlev |
| `PatchConfigOptions` | ✓ | — | tür |
| `FileLockOptions` | ✓ | — | tür |
| `detectFormat` | ✓ | — | işlev |
| `normalizeFilePath` | ✓ | — | işlev |
| `validateOpenAPISpec` | ✓ | — | işlev |
| `validateOpenAPIFile` | ✓ | — | işlev |
| `OpenApiValidationError` | ✓ | — | sınıf |
| `ValidateOpenApiOptions` | ✓ | — | tür |
| `OpenApiInputKind` | ✓ | — | tür |
| `AnyOpenAPIDocument` | ✓ | — | tür |