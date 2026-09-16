---
sidebar_position: 4
title: "API Reference"
description: "All exports from @powerduck/openapi-parser: upgradeOasTo32, OpenApiUpgradeError, UpgradeErrorCode, types, and re-exported @scalar helpers."
---

# API Reference

## `upgradeOasTo32(input, options?)`

Upgrades a Swagger 2.0 or OpenAPI 3.x document to OpenAPI 3.2.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `input` | `OpenApiDocument \| string` | Yes | A Swagger 2.0 or OpenAPI 3.x document, as a plain object or JSON/YAML string |
| `options` | `UpgradeOptions` | No | Optional configuration |

**Returns:** `Promise<Oas32Document>` — A validated OpenAPI 3.2 document.

**Throws:** `OpenApiUpgradeError` — See [Error Codes](#error-codes).

### `UpgradeOptions`

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `validateResult` | `boolean` | `true` | Run schema validation on the upgraded document |
| `checkVersion` | `boolean` | `true` | Assert the output declares OpenAPI 3.2.x |
| `maxDepth` | `number` | `64` | Circular-reference scan depth. Set to `0` to disable |

## `OpenApiUpgradeError`

```typescript
class OpenApiUpgradeError extends Error {
  readonly code: UpgradeErrorCode;
  readonly issues: readonly OpenApiValidationIssue[];
  readonly cause?: unknown;
}
```

## `isOpenApiUpgradeError(value)`

Type guard. Returns `true` when the value is an `OpenApiUpgradeError` instance.

## Error Codes

| Code | Value | When it happens |
|------|-------|-----------------|
| `InvalidInput` | `"INVALID_INPUT"` | Input is not a string or plain object |
| `ParseOrValidateFailed` | `"PARSE_OR_VALIDATE_FAILED"` | Input could not be parsed or failed initial validation |
| `FirstUpgradeFailed` | `"FIRST_UPGRADE_FAILED"` | The 2.0/3.0 → 3.1 upgrader failed |
| `SecondUpgradeFailed` | `"SECOND_UPGRADE_FAILED"` | The 3.1 → 3.2 upgrader threw |
| `VersionAssertionFailed` | `"VERSION_ASSERTION_FAILED"` | Output does not declare OpenAPI 3.2.x |
| `ValidationFailed` | `"VALIDATION_FAILED"` | Upgraded document failed schema validation |
| `CircularReference` | `"CIRCULAR_REFERENCE"` | Input document contains a circular reference |

## Type exports

```typescript
import type {
  Oas20Document, Oas30Document, Oas31Document, Oas32Document,
  OpenApiDocument, OpenApiInput, UpgradedDocument,
  OpenApiValidationIssue, UpgradeOptions,
} from "@powerduck/openapi-parser";
```

OpenAPI 3.2 schema object types:

```typescript
import type {
  SchemaObject, OperationObject, ParameterObject, PathItemObject,
  RequestBodyObject, ResponseObject, ServerObject, TagObject, MediaTypeObject,
} from "@powerduck/openapi-parser";
```

## Re-exported @scalar helpers

For advanced use, these are re-exported directly:

```typescript
import { dereference, upgrade, validate } from "@powerduck/openapi-parser";
```
