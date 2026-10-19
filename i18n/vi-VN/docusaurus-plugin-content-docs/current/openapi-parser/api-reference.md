---
sidebar_position: 4
title: "Tài liệu tham khảo API"
description: "Mọi thành phần xuất từ @powerduck/openapi-parser: upgradeOasTo32, OpenApiUpgradeError, UpgradeErrorCode, các kiểu và hàm hỗ trợ @scalar được xuất lại."
---

# Tài liệu tham khảo API

## `upgradeOasTo32(input, options?)`

Chuyển đổi tài liệu Swagger 2.0 hoặc OpenAPI 3.x sang OpenAPI 3.2.

| Tham số | Kiểu | Bắt buộc | Mô tả |
|-----------|------|----------|-------------|
| `input` | `OpenApiDocument \| string` | Có | Tài liệu Swagger 2.0 hoặc OpenAPI 3.x ở dạng đối tượng thuần hoặc chuỗi JSON/YAML |
| `options` | `UpgradeOptions` | Không | Cấu hình tùy chọn |

**Trả về:** `Promise<Oas32Document>` — Tài liệu OpenAPI 3.2 đã được kiểm tra tính hợp lệ.

**Ném lỗi:** `OpenApiUpgradeError` — Xem [Mã lỗi](#error-codes).

### `UpgradeOptions`

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|----------|------|---------|-------------|
| `validateResult` | `boolean` | `true` | Kiểm tra tài liệu sau chuyển đổi theo lược đồ |
| `checkVersion` | `boolean` | `true` | Xác nhận đầu ra khai báo OpenAPI 3.2.x |
| `maxDepth` | `number` | `64` | Độ sâu quét tham chiếu vòng. Đặt thành `0` để tắt |

## `OpenApiUpgradeError`

```typescript
class OpenApiUpgradeError extends Error {
  readonly code: UpgradeErrorCode;
  readonly issues: readonly OpenApiValidationIssue[];
  readonly cause?: unknown;
}
```

## `isOpenApiUpgradeError(value)`

Hàm kiểm tra kiểu. Trả về `true` khi giá trị là một thực thể `OpenApiUpgradeError`.

## Mã lỗi {#error-codes}

| Mã | Giá trị | Điều kiện xảy ra |
|------|-------|-----------------|
| `InvalidInput` | `"INVALID_INPUT"` | Đầu vào không phải chuỗi hay đối tượng thuần |
| `ParseOrValidateFailed` | `"PARSE_OR_VALIDATE_FAILED"` | Không thể phân tích đầu vào hoặc kiểm tra ban đầu thất bại |
| `FirstUpgradeFailed` | `"FIRST_UPGRADE_FAILED"` | Chuyển đổi 2.0/3.0 → 3.1 thất bại |
| `SecondUpgradeFailed` | `"SECOND_UPGRADE_FAILED"` | Bộ chuyển đổi 3.1 → 3.2 ném ngoại lệ |
| `VersionAssertionFailed` | `"VERSION_ASSERTION_FAILED"` | Đầu ra không khai báo OpenAPI 3.2.x |
| `ValidationFailed` | `"VALIDATION_FAILED"` | Tài liệu sau chuyển đổi không vượt qua kiểm tra lược đồ |
| `CircularReference` | `"CIRCULAR_REFERENCE"` | Tài liệu đầu vào chứa tham chiếu vòng |

## Các kiểu được xuất

```typescript
import type {
  Oas20Document, Oas30Document, Oas31Document, Oas32Document,
  OpenApiDocument, OpenApiInput, UpgradedDocument,
  OpenApiValidationIssue, UpgradeOptions,
} from "@powerduck/openapi-parser";
```

Các kiểu đối tượng lược đồ OpenAPI 3.2:

```typescript
import type {
  SchemaObject, OperationObject, ParameterObject, PathItemObject,
  RequestBodyObject, ResponseObject, ServerObject, TagObject, MediaTypeObject,
} from "@powerduck/openapi-parser";
```

## Hàm hỗ trợ @scalar được xuất lại

Cho nhu cầu nâng cao, các hàm sau được xuất lại trực tiếp:

```typescript
import { dereference, upgrade, validate } from "@powerduck/openapi-parser";
```
