---
sidebar_position: 4
title: "API başvuru kaynağı"
description: "@powerduck/openapi-parser dışa aktarımlarının tamamı: upgradeOasTo32, OpenApiUpgradeError, UpgradeErrorCode, türler ve yeniden dışa aktarılan @scalar yardımcıları."
---

# API başvuru kaynağı

## `upgradeOasTo32(input, options?)`

Swagger 2.0 veya OpenAPI 3.x belgesini OpenAPI 3.2’ye dönüştürür.

| Parametre | Tür | Gerekli | Açıklama |
|-----------|------|----------|-------------|
| `input` | `OpenApiDocument \| string` | Evet | Düz nesne veya JSON/YAML dizesi olarak Swagger 2.0 ya da OpenAPI 3.x belgesi |
| `options` | `UpgradeOptions` | Hayır | İsteğe bağlı yapılandırma |

**Döndürür:** `Promise<Oas32Document>` — Doğrulanmış OpenAPI 3.2 belgesi.

**Fırlatır:** `OpenApiUpgradeError` — Bkz. [Hata kodları](#error-codes).

### `UpgradeOptions`

| Özellik | Tür | Varsayılan | Açıklama |
|----------|------|---------|-------------|
| `validateResult` | `boolean` | `true` | Dönüştürülen belgede şema doğrulaması çalıştırır |
| `checkVersion` | `boolean` | `true` | Çıktının OpenAPI 3.2.x bildirdiğini doğrular |
| `maxDepth` | `number` | `64` | Döngüsel başvuru tarama derinliği. Devre dışı bırakmak için `0` kullanın |

## `OpenApiUpgradeError`

```typescript
class OpenApiUpgradeError extends Error {
  readonly code: UpgradeErrorCode;
  readonly issues: readonly OpenApiValidationIssue[];
  readonly cause?: unknown;
}
```

## `isOpenApiUpgradeError(value)`

Tür koruyucusu. Değer bir `OpenApiUpgradeError` örneğiyse `true` döndürür.

## Hata kodları {#error-codes}

| Kod | Değer | Oluşma koşulu |
|------|-------|-----------------|
| `InvalidInput` | `"INVALID_INPUT"` | Girdi dize veya düz nesne değil |
| `ParseOrValidateFailed` | `"PARSE_OR_VALIDATE_FAILED"` | Girdi ayrıştırılamadı veya ilk doğrulama başarısız |
| `FirstUpgradeFailed` | `"FIRST_UPGRADE_FAILED"` | 2.0/3.0 → 3.1 dönüştürmesi başarısız |
| `SecondUpgradeFailed` | `"SECOND_UPGRADE_FAILED"` | 3.1 → 3.2 dönüştürücüsü istisna fırlattı |
| `VersionAssertionFailed` | `"VERSION_ASSERTION_FAILED"` | Çıktı OpenAPI 3.2.x bildirmiyor |
| `ValidationFailed` | `"VALIDATION_FAILED"` | Dönüştürülen belge şema doğrulamasından geçemedi |
| `CircularReference` | `"CIRCULAR_REFERENCE"` | Girdi belgesinde döngüsel başvuru var |

## Tür dışa aktarımları

```typescript
import type {
  Oas20Document, Oas30Document, Oas31Document, Oas32Document,
  OpenApiDocument, OpenApiInput, UpgradedDocument,
  OpenApiValidationIssue, UpgradeOptions,
} from "@powerduck/openapi-parser";
```

OpenAPI 3.2 şema nesnesi türleri:

```typescript
import type {
  SchemaObject, OperationObject, ParameterObject, PathItemObject,
  RequestBodyObject, ResponseObject, ServerObject, TagObject, MediaTypeObject,
} from "@powerduck/openapi-parser";
```

## Yeniden dışa aktarılan @scalar yardımcıları

İleri düzey kullanım için şu işlevler doğrudan yeniden dışa aktarılır:

```typescript
import { dereference, upgrade, validate } from "@powerduck/openapi-parser";
```
