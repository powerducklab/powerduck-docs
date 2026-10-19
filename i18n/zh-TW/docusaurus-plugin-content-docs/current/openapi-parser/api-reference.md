---
sidebar_position: 4
title: "API 參考"
description: "@powerduck/openapi-parser 的所有匯出：upgradeOasTo32、OpenApiUpgradeError、UpgradeErrorCode、型別，以及重新匯出的 @scalar 輔助函式。"
---

# API 參考

## `upgradeOasTo32(input, options?)`

將 Swagger 2.0 或 OpenAPI 3.x 文件升級為 OpenAPI 3.2。

| 參數 | 型別 | 必填 | 說明 |
|-----------|------|----------|-------------|
| `input` | `OpenApiDocument \| string` | 是 | 以一般物件或 JSON/YAML 字串表示的 Swagger 2.0 或 OpenAPI 3.x 文件 |
| `options` | `UpgradeOptions` | 否 | 選用設定 |

**回傳:** `Promise<Oas32Document>` — 經過驗證的 OpenAPI 3.2 文件。

**拋出:** `OpenApiUpgradeError` — 請參閱 [錯誤碼](#error-codes).

### `UpgradeOptions`

| 屬性 | 型別 | 預設值 | 說明 |
|----------|------|---------|-------------|
| `validateResult` | `boolean` | `true` | 對升級後的文件執行結構描述驗證 |
| `checkVersion` | `boolean` | `true` | 確認輸出宣告的版本為 OpenAPI 3.2.x |
| `maxDepth` | `number` | `64` | 循環參照掃描深度。設為 `0` 可停用 |

## `OpenApiUpgradeError`

```typescript
class OpenApiUpgradeError extends Error {
  readonly code: UpgradeErrorCode;
  readonly issues: readonly OpenApiValidationIssue[];
  readonly cause?: unknown;
}
```

## `isOpenApiUpgradeError(value)`

型別守衛。當值為 `OpenApiUpgradeError` 執行個體時回傳 `true`。

## 錯誤碼 {#error-codes}

| 錯誤碼 | 值 | 觸發條件 |
|------|-------|-----------------|
| `InvalidInput` | `"INVALID_INPUT"` | 輸入不是字串或一般物件 |
| `ParseOrValidateFailed` | `"PARSE_OR_VALIDATE_FAILED"` | 無法剖析輸入，或初始驗證失敗 |
| `FirstUpgradeFailed` | `"FIRST_UPGRADE_FAILED"` | 2.0/3.0 → 3.1 升級失敗 |
| `SecondUpgradeFailed` | `"SECOND_UPGRADE_FAILED"` | 3.1 → 3.2 升級器拋出例外 |
| `VersionAssertionFailed` | `"VERSION_ASSERTION_FAILED"` | 輸出未宣告 OpenAPI 3.2.x |
| `ValidationFailed` | `"VALIDATION_FAILED"` | 升級後的文件未通過結構描述驗證 |
| `CircularReference` | `"CIRCULAR_REFERENCE"` | 輸入文件包含循環參照 |

## 型別匯出

```typescript
import type {
  Oas20Document, Oas30Document, Oas31Document, Oas32Document,
  OpenApiDocument, OpenApiInput, UpgradedDocument,
  OpenApiValidationIssue, UpgradeOptions,
} from "@powerduck/openapi-parser";
```

OpenAPI 3.2 結構描述物件型別：

```typescript
import type {
  SchemaObject, OperationObject, ParameterObject, PathItemObject,
  RequestBodyObject, ResponseObject, ServerObject, TagObject, MediaTypeObject,
} from "@powerduck/openapi-parser";
```

## 重新匯出的 @scalar 輔助函式

以下函式直接重新匯出，供進階用法使用：

```typescript
import { dereference, upgrade, validate } from "@powerduck/openapi-parser";
```
