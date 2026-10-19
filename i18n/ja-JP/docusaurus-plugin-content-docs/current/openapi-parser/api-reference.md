---
sidebar_position: 4
title: "API リファレンス"
description: "@powerduck/openapi-parser の全エクスポート：upgradeOasTo32、OpenApiUpgradeError、UpgradeErrorCode、型、再エクスポートされる @scalar ヘルパー。"
---

# API リファレンス

## `upgradeOasTo32(input, options?)`

Swagger 2.0 または OpenAPI 3.x ドキュメントを OpenAPI 3.2 に変換します。

| パラメーター | 型 | 必須 | 説明 |
|-----------|------|----------|-------------|
| `input` | `OpenApiDocument \| string` | はい | プレーンオブジェクトまたは JSON/YAML 文字列形式の Swagger 2.0／OpenAPI 3.x ドキュメント |
| `options` | `UpgradeOptions` | いいえ | 省略可能な設定 |

**戻り値:** `Promise<Oas32Document>` — 検証済みの OpenAPI 3.2 ドキュメント。

**例外:** `OpenApiUpgradeError` — 参照： [エラーコード](#error-codes).

### `UpgradeOptions`

| プロパティ | 型 | 既定値 | 説明 |
|----------|------|---------|-------------|
| `validateResult` | `boolean` | `true` | 変換後のドキュメントにスキーマ検証を実行 |
| `checkVersion` | `boolean` | `true` | 出力が OpenAPI 3.2.x を宣言していることを確認 |
| `maxDepth` | `number` | `64` | 循環参照の探索深度。`0` で無効化 |

## `OpenApiUpgradeError`

```typescript
class OpenApiUpgradeError extends Error {
  readonly code: UpgradeErrorCode;
  readonly issues: readonly OpenApiValidationIssue[];
  readonly cause?: unknown;
}
```

## `isOpenApiUpgradeError(value)`

型ガード。値が `OpenApiUpgradeError` のインスタンスなら `true` を返します。

## エラーコード {#error-codes}

| コード | 値 | 発生条件 |
|------|-------|-----------------|
| `InvalidInput` | `"INVALID_INPUT"` | 入力が文字列でもプレーンオブジェクトでもない |
| `ParseOrValidateFailed` | `"PARSE_OR_VALIDATE_FAILED"` | 入力の解析または初期検証に失敗 |
| `FirstUpgradeFailed` | `"FIRST_UPGRADE_FAILED"` | 2.0/3.0 → 3.1 への変換に失敗 |
| `SecondUpgradeFailed` | `"SECOND_UPGRADE_FAILED"` | 3.1 → 3.2 への変換で例外が発生 |
| `VersionAssertionFailed` | `"VERSION_ASSERTION_FAILED"` | 出力が OpenAPI 3.2.x を宣言していない |
| `ValidationFailed` | `"VALIDATION_FAILED"` | 変換後のドキュメントがスキーマ検証に失敗 |
| `CircularReference` | `"CIRCULAR_REFERENCE"` | 入力ドキュメントに循環参照が含まれる |

## 型のエクスポート

```typescript
import type {
  Oas20Document, Oas30Document, Oas31Document, Oas32Document,
  OpenApiDocument, OpenApiInput, UpgradedDocument,
  OpenApiValidationIssue, UpgradeOptions,
} from "@powerduck/openapi-parser";
```

OpenAPI 3.2 のスキーマオブジェクト型：

```typescript
import type {
  SchemaObject, OperationObject, ParameterObject, PathItemObject,
  RequestBodyObject, ResponseObject, ServerObject, TagObject, MediaTypeObject,
} from "@powerduck/openapi-parser";
```

## 再エクスポートされる @scalar ヘルパー

高度な用途向けに、次の関数を直接再エクスポートしています：

```typescript
import { dereference, upgrade, validate } from "@powerduck/openapi-parser";
```
