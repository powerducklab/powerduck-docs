---
sidebar_position: 4
title: "مرجع API"
description: "جميع صادرات @powerduck/openapi-parser: الدوال upgradeOasTo32 وOpenApiUpgradeError وUpgradeErrorCode والأنواع وأدوات @scalar المعاد تصديرها."
---

# مرجع API

## `upgradeOasTo32(input, options?)`

يحوّل مستند Swagger 2.0 أو OpenAPI 3.x إلى OpenAPI 3.2.

| المعامل | النوع | مطلوب | الوصف |
|-----------|------|----------|-------------|
| `input` | `OpenApiDocument \| string` | نعم | مستند Swagger 2.0 أو OpenAPI 3.x ككائن عادي أو سلسلة JSON/YAML |
| `options` | `UpgradeOptions` | لا | إعداد اختياري |

**القيمة المعادة:** `Promise<Oas32Document>` — مستند OpenAPI 3.2 تم التحقق منه.

**الاستثناء:** `OpenApiUpgradeError` — راجع [رموز الأخطاء](#error-codes).

### `UpgradeOptions`

| الخاصية | النوع | القيمة الافتراضية | الوصف |
|----------|------|---------|-------------|
| `validateResult` | `boolean` | `true` | التحقق من مطابقة المستند المحوّل للمخطط |
| `checkVersion` | `boolean` | `true` | التأكد من أن المخرجات تعلن OpenAPI 3.2.x |
| `maxDepth` | `number` | `64` | عمق فحص المراجع الدائرية. اضبطه على `0` للتعطيل |

## `OpenApiUpgradeError`

```typescript
class OpenApiUpgradeError extends Error {
  readonly code: UpgradeErrorCode;
  readonly issues: readonly OpenApiValidationIssue[];
  readonly cause?: unknown;
}
```

## `isOpenApiUpgradeError(value)`

حارس نوع. يعيد `true` عندما تكون القيمة مثيلًا من `OpenApiUpgradeError`.

## رموز الأخطاء {#error-codes}

| الرمز | القيمة | متى يحدث |
|------|-------|-----------------|
| `InvalidInput` | `"INVALID_INPUT"` | الإدخال ليس سلسلة نصية ولا كائنًا عاديًا |
| `ParseOrValidateFailed` | `"PARSE_OR_VALIDATE_FAILED"` | تعذر تحليل الإدخال أو فشل التحقق الأولي |
| `FirstUpgradeFailed` | `"FIRST_UPGRADE_FAILED"` | فشل التحويل من 2.0/3.0 إلى 3.1 |
| `SecondUpgradeFailed` | `"SECOND_UPGRADE_FAILED"` | أطلق محول 3.1 إلى 3.2 استثناءً |
| `VersionAssertionFailed` | `"VERSION_ASSERTION_FAILED"` | المخرجات لا تعلن OpenAPI 3.2.x |
| `ValidationFailed` | `"VALIDATION_FAILED"` | فشل التحقق من مطابقة المستند المحوّل للمخطط |
| `CircularReference` | `"CIRCULAR_REFERENCE"` | مستند الإدخال يحتوي على مرجع دائري |

## صادرات الأنواع

```typescript
import type {
  Oas20Document, Oas30Document, Oas31Document, Oas32Document,
  OpenApiDocument, OpenApiInput, UpgradedDocument,
  OpenApiValidationIssue, UpgradeOptions,
} from "@powerduck/openapi-parser";
```

أنواع كائنات مخطط OpenAPI 3.2:

```typescript
import type {
  SchemaObject, OperationObject, ParameterObject, PathItemObject,
  RequestBodyObject, ResponseObject, ServerObject, TagObject, MediaTypeObject,
} from "@powerduck/openapi-parser";
```

## أدوات @scalar المعاد تصديرها

للاستخدام المتقدم، تُعاد مباشرةً صادرات الدوال التالية:

```typescript
import { dereference, upgrade, validate } from "@powerduck/openapi-parser";
```
