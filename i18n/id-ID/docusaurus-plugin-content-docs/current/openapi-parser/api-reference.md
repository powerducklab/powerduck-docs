---
sidebar_position: 4
title: "Referensi API"
description: "Semua ekspor @powerduck/openapi-parser: upgradeOasTo32, OpenApiUpgradeError, UpgradeErrorCode, tipe, dan utilitas @scalar yang diekspor ulang."
---

# Referensi API

## `upgradeOasTo32(input, options?)`

Mengonversi dokumen Swagger 2.0 atau OpenAPI 3.x ke OpenAPI 3.2.

| Parameter | Tipe | Wajib | Deskripsi |
|-----------|------|----------|-------------|
| `input` | `OpenApiDocument \| string` | Ya | Dokumen Swagger 2.0 atau OpenAPI 3.x sebagai objek biasa atau string JSON/YAML |
| `options` | `UpgradeOptions` | Tidak | Konfigurasi opsional |

**Mengembalikan:** `Promise<Oas32Document>` — Dokumen OpenAPI 3.2 yang tervalidasi.

**Melempar:** `OpenApiUpgradeError` — Lihat [Kode kesalahan](#error-codes).

### `UpgradeOptions`

| Properti | Tipe | Nilai bawaan | Deskripsi |
|----------|------|---------|-------------|
| `validateResult` | `boolean` | `true` | Menjalankan validasi skema pada dokumen hasil konversi |
| `checkVersion` | `boolean` | `true` | Memastikan output menyatakan OpenAPI 3.2.x |
| `maxDepth` | `number` | `64` | Kedalaman pemindaian referensi melingkar. Atur ke `0` untuk menonaktifkan |

## `OpenApiUpgradeError`

```typescript
class OpenApiUpgradeError extends Error {
  readonly code: UpgradeErrorCode;
  readonly issues: readonly OpenApiValidationIssue[];
  readonly cause?: unknown;
}
```

## `isOpenApiUpgradeError(value)`

Penjaga tipe. Mengembalikan `true` jika nilainya adalah instans `OpenApiUpgradeError`.

## Kode kesalahan {#error-codes}

| Kode | Nilai | Kapan terjadi |
|------|-------|-----------------|
| `InvalidInput` | `"INVALID_INPUT"` | Input bukan string atau objek biasa |
| `ParseOrValidateFailed` | `"PARSE_OR_VALIDATE_FAILED"` | Input tidak dapat diurai atau gagal dalam validasi awal |
| `FirstUpgradeFailed` | `"FIRST_UPGRADE_FAILED"` | Konversi 2.0/3.0 → 3.1 gagal |
| `SecondUpgradeFailed` | `"SECOND_UPGRADE_FAILED"` | Pengonversi 3.1 → 3.2 melempar pengecualian |
| `VersionAssertionFailed` | `"VERSION_ASSERTION_FAILED"` | Output tidak menyatakan OpenAPI 3.2.x |
| `ValidationFailed` | `"VALIDATION_FAILED"` | Dokumen hasil konversi gagal dalam validasi skema |
| `CircularReference` | `"CIRCULAR_REFERENCE"` | Dokumen input berisi referensi melingkar |

## Ekspor tipe

```typescript
import type {
  Oas20Document, Oas30Document, Oas31Document, Oas32Document,
  OpenApiDocument, OpenApiInput, UpgradedDocument,
  OpenApiValidationIssue, UpgradeOptions,
} from "@powerduck/openapi-parser";
```

Tipe objek skema OpenAPI 3.2:

```typescript
import type {
  SchemaObject, OperationObject, ParameterObject, PathItemObject,
  RequestBodyObject, ResponseObject, ServerObject, TagObject, MediaTypeObject,
} from "@powerduck/openapi-parser";
```

## Utilitas @scalar yang diekspor ulang

Untuk penggunaan lanjutan, fungsi berikut diekspor ulang secara langsung:

```typescript
import { dereference, upgrade, validate } from "@powerduck/openapi-parser";
```
