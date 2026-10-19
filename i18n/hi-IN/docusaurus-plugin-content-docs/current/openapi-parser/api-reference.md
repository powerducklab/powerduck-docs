---
sidebar_position: 4
title: "API संदर्भ"
description: "@powerduck/openapi-parser के सभी एक्सपोर्ट: upgradeOasTo32, OpenApiUpgradeError, UpgradeErrorCode, टाइप और दोबारा एक्सपोर्ट किए गए @scalar हेल्पर।"
---

# API संदर्भ

## `upgradeOasTo32(input, options?)`

Swagger 2.0 या OpenAPI 3.x दस्तावेज़ को OpenAPI 3.2 में बदलता है।

| पैरामीटर | टाइप | ज़रूरी | विवरण |
|-----------|------|----------|-------------|
| `input` | `OpenApiDocument \| string` | हाँ | साधारण ऑब्जेक्ट या JSON/YAML स्ट्रिंग के रूप में Swagger 2.0 या OpenAPI 3.x दस्तावेज़ |
| `options` | `UpgradeOptions` | नहीं | वैकल्पिक कॉन्फ़िगरेशन |

**वापसी मान:** `Promise<Oas32Document>` — जाँचा गया OpenAPI 3.2 दस्तावेज़।

**थ्रो होता है:** `OpenApiUpgradeError` — देखें [त्रुटि कोड](#error-codes).

### `UpgradeOptions`

| प्रॉपर्टी | टाइप | डिफ़ॉल्ट | विवरण |
|----------|------|---------|-------------|
| `validateResult` | `boolean` | `true` | बदले गए दस्तावेज़ का स्कीमा वैलिडेशन चलाएँ |
| `checkVersion` | `boolean` | `true` | जाँचें कि आउटपुट में OpenAPI 3.2.x घोषित है |
| `maxDepth` | `number` | `64` | चक्रीय संदर्भ खोजने की गहराई। बंद करने के लिए `0` सेट करें |

## `OpenApiUpgradeError`

```typescript
class OpenApiUpgradeError extends Error {
  readonly code: UpgradeErrorCode;
  readonly issues: readonly OpenApiValidationIssue[];
  readonly cause?: unknown;
}
```

## `isOpenApiUpgradeError(value)`

टाइप गार्ड। मान `OpenApiUpgradeError` का इंस्टेंस होने पर `true` लौटाता है।

## त्रुटि कोड {#error-codes}

| कोड | मान | कब होता है |
|------|-------|-----------------|
| `InvalidInput` | `"INVALID_INPUT"` | इनपुट स्ट्रिंग या साधारण ऑब्जेक्ट नहीं है |
| `ParseOrValidateFailed` | `"PARSE_OR_VALIDATE_FAILED"` | इनपुट पार्स नहीं हुआ या शुरुआती वैलिडेशन विफल हुआ |
| `FirstUpgradeFailed` | `"FIRST_UPGRADE_FAILED"` | 2.0/3.0 → 3.1 रूपांतरण विफल हुआ |
| `SecondUpgradeFailed` | `"SECOND_UPGRADE_FAILED"` | 3.1 → 3.2 कन्वर्टर ने अपवाद थ्रो किया |
| `VersionAssertionFailed` | `"VERSION_ASSERTION_FAILED"` | आउटपुट में OpenAPI 3.2.x घोषित नहीं है |
| `ValidationFailed` | `"VALIDATION_FAILED"` | बदले गए दस्तावेज़ का स्कीमा वैलिडेशन विफल हुआ |
| `CircularReference` | `"CIRCULAR_REFERENCE"` | इनपुट दस्तावेज़ में चक्रीय संदर्भ है |

## टाइप एक्सपोर्ट

```typescript
import type {
  Oas20Document, Oas30Document, Oas31Document, Oas32Document,
  OpenApiDocument, OpenApiInput, UpgradedDocument,
  OpenApiValidationIssue, UpgradeOptions,
} from "@powerduck/openapi-parser";
```

OpenAPI 3.2 स्कीमा ऑब्जेक्ट टाइप:

```typescript
import type {
  SchemaObject, OperationObject, ParameterObject, PathItemObject,
  RequestBodyObject, ResponseObject, ServerObject, TagObject, MediaTypeObject,
} from "@powerduck/openapi-parser";
```

## दोबारा एक्सपोर्ट किए गए @scalar हेल्पर

उन्नत उपयोग के लिए ये फ़ंक्शन सीधे दोबारा एक्सपोर्ट किए जाते हैं:

```typescript
import { dereference, upgrade, validate } from "@powerduck/openapi-parser";
```
