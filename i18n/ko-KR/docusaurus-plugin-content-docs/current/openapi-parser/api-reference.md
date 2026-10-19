---
sidebar_position: 4
title: "API 참조"
description: "@powerduck/openapi-parser의 모든 내보내기: upgradeOasTo32, OpenApiUpgradeError, UpgradeErrorCode, 타입 및 다시 내보내는 @scalar 도우미 함수."
---

# API 참조

## `upgradeOasTo32(input, options?)`

Swagger 2.0 또는 OpenAPI 3.x 문서를 OpenAPI 3.2로 업그레이드합니다.

| 매개변수 | 타입 | 필수 | 설명 |
|-----------|------|----------|-------------|
| `input` | `OpenApiDocument \| string` | 예 | 일반 객체 또는 JSON/YAML 문자열 형식의 Swagger 2.0 또는 OpenAPI 3.x 문서 |
| `options` | `UpgradeOptions` | 아니요 | 선택적 설정 |

**반환값:** `Promise<Oas32Document>` — 검증된 OpenAPI 3.2 문서.

**발생 예외:** `OpenApiUpgradeError` — 참조: [오류 코드](#error-codes).

### `UpgradeOptions`

| 속성 | 타입 | 기본값 | 설명 |
|----------|------|---------|-------------|
| `validateResult` | `boolean` | `true` | 업그레이드된 문서의 스키마 검증 실행 |
| `checkVersion` | `boolean` | `true` | 출력이 OpenAPI 3.2.x를 선언하는지 확인 |
| `maxDepth` | `number` | `64` | 순환 참조 탐색 깊이. `0`으로 설정하면 비활성화 |

## `OpenApiUpgradeError`

```typescript
class OpenApiUpgradeError extends Error {
  readonly code: UpgradeErrorCode;
  readonly issues: readonly OpenApiValidationIssue[];
  readonly cause?: unknown;
}
```

## `isOpenApiUpgradeError(value)`

타입 가드. 값이 `OpenApiUpgradeError` 인스턴스이면 `true`를 반환합니다.

## 오류 코드 {#error-codes}

| 코드 | 값 | 발생 조건 |
|------|-------|-----------------|
| `InvalidInput` | `"INVALID_INPUT"` | 입력이 문자열이나 일반 객체가 아님 |
| `ParseOrValidateFailed` | `"PARSE_OR_VALIDATE_FAILED"` | 입력을 파싱할 수 없거나 초기 검증 실패 |
| `FirstUpgradeFailed` | `"FIRST_UPGRADE_FAILED"` | 2.0/3.0 → 3.1 업그레이드 실패 |
| `SecondUpgradeFailed` | `"SECOND_UPGRADE_FAILED"` | 3.1 → 3.2 업그레이더에서 예외 발생 |
| `VersionAssertionFailed` | `"VERSION_ASSERTION_FAILED"` | 출력이 OpenAPI 3.2.x를 선언하지 않음 |
| `ValidationFailed` | `"VALIDATION_FAILED"` | 업그레이드된 문서의 스키마 검증 실패 |
| `CircularReference` | `"CIRCULAR_REFERENCE"` | 입력 문서에 순환 참조가 있음 |

## 타입 내보내기

```typescript
import type {
  Oas20Document, Oas30Document, Oas31Document, Oas32Document,
  OpenApiDocument, OpenApiInput, UpgradedDocument,
  OpenApiValidationIssue, UpgradeOptions,
} from "@powerduck/openapi-parser";
```

OpenAPI 3.2 스키마 객체 타입:

```typescript
import type {
  SchemaObject, OperationObject, ParameterObject, PathItemObject,
  RequestBodyObject, ResponseObject, ServerObject, TagObject, MediaTypeObject,
} from "@powerduck/openapi-parser";
```

## 다시 내보내는 @scalar 도우미 함수

고급 사용을 위해 다음 함수를 직접 다시 내보냅니다:

```typescript
import { dereference, upgrade, validate } from "@powerduck/openapi-parser";
```
