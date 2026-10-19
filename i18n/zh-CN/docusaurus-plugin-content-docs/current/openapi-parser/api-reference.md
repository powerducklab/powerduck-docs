---
sidebar_position: 4
title: "API 参考"
description: "@powerduck/openapi-parser 的所有导出：upgradeOasTo32、OpenApiUpgradeError、UpgradeErrorCode、类型，以及重新导出的 @scalar 辅助函数。"
---

# API 参考

## `upgradeOasTo32(input, options?)`

将 Swagger 2.0 或 OpenAPI 3.x 文档升级为 OpenAPI 3.2。

| 参数 | 类型 | 必填 | 说明 |
|-----------|------|----------|-------------|
| `input` | `OpenApiDocument \| string` | 是 | 以普通对象或 JSON/YAML 字符串表示的 Swagger 2.0 或 OpenAPI 3.x 文档 |
| `options` | `UpgradeOptions` | 否 | 可选配置 |

**返回:** `Promise<Oas32Document>` — 经过验证的 OpenAPI 3.2 文档。

**抛出:** `OpenApiUpgradeError` — 参见 [错误码](#error-codes).

### `UpgradeOptions`

| 属性 | 类型 | 默认值 | 说明 |
|----------|------|---------|-------------|
| `validateResult` | `boolean` | `true` | 对升级后的文档执行模式验证 |
| `checkVersion` | `boolean` | `true` | 断言输出声明的版本为 OpenAPI 3.2.x |
| `maxDepth` | `number` | `64` | 循环引用扫描深度。设为 `0` 可禁用 |

## `OpenApiUpgradeError`

```typescript
class OpenApiUpgradeError extends Error {
  readonly code: UpgradeErrorCode;
  readonly issues: readonly OpenApiValidationIssue[];
  readonly cause?: unknown;
}
```

## `isOpenApiUpgradeError(value)`

类型守卫。当值为 `OpenApiUpgradeError` 实例时返回 `true`。

## 错误码 {#error-codes}

| 错误码 | 值 | 触发条件 |
|------|-------|-----------------|
| `InvalidInput` | `"INVALID_INPUT"` | 输入不是字符串或普通对象 |
| `ParseOrValidateFailed` | `"PARSE_OR_VALIDATE_FAILED"` | 无法解析输入，或初始验证失败 |
| `FirstUpgradeFailed` | `"FIRST_UPGRADE_FAILED"` | 2.0/3.0 → 3.1 升级失败 |
| `SecondUpgradeFailed` | `"SECOND_UPGRADE_FAILED"` | 3.1 → 3.2 升级器抛出异常 |
| `VersionAssertionFailed` | `"VERSION_ASSERTION_FAILED"` | 输出未声明 OpenAPI 3.2.x |
| `ValidationFailed` | `"VALIDATION_FAILED"` | 升级后的文档未通过模式验证 |
| `CircularReference` | `"CIRCULAR_REFERENCE"` | 输入文档包含循环引用 |

## 类型导出

```typescript
import type {
  Oas20Document, Oas30Document, Oas31Document, Oas32Document,
  OpenApiDocument, OpenApiInput, UpgradedDocument,
  OpenApiValidationIssue, UpgradeOptions,
} from "@powerduck/openapi-parser";
```

OpenAPI 3.2 模式对象类型：

```typescript
import type {
  SchemaObject, OperationObject, ParameterObject, PathItemObject,
  RequestBodyObject, ResponseObject, ServerObject, TagObject, MediaTypeObject,
} from "@powerduck/openapi-parser";
```

## 重新导出的 @scalar 辅助函数

以下函数直接重新导出，供高级用法使用：

```typescript
import { dereference, upgrade, validate } from "@powerduck/openapi-parser";
```
