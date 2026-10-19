---
sidebar_position: 4
title: "Справочник API"
description: "Все экспорты @powerduck/openapi-parser: upgradeOasTo32, OpenApiUpgradeError, UpgradeErrorCode, типы и реэкспортируемые функции @scalar."
---

# Справочник API

## `upgradeOasTo32(input, options?)`

Преобразует документ Swagger 2.0 или OpenAPI 3.x в OpenAPI 3.2.

| Параметр | Тип | Обязателен | Описание |
|-----------|------|----------|-------------|
| `input` | `OpenApiDocument \| string` | Да | Документ Swagger 2.0 или OpenAPI 3.x в виде обычного объекта или строки JSON/YAML |
| `options` | `UpgradeOptions` | Нет | Необязательные настройки |

**Возвращает:** `Promise<Oas32Document>` — Проверенный документ OpenAPI 3.2.

**Выбрасывает:** `OpenApiUpgradeError` — См. [Коды ошибок](#error-codes).

### `UpgradeOptions`

| Свойство | Тип | По умолчанию | Описание |
|----------|------|---------|-------------|
| `validateResult` | `boolean` | `true` | Выполняет проверку преобразованного документа по схеме |
| `checkVersion` | `boolean` | `true` | Проверяет, что в результате объявлена версия OpenAPI 3.2.x |
| `maxDepth` | `number` | `64` | Глубина поиска циклических ссылок. Значение `0` отключает проверку |

## `OpenApiUpgradeError`

```typescript
class OpenApiUpgradeError extends Error {
  readonly code: UpgradeErrorCode;
  readonly issues: readonly OpenApiValidationIssue[];
  readonly cause?: unknown;
}
```

## `isOpenApiUpgradeError(value)`

Проверка типа. Возвращает `true`, если значение — экземпляр `OpenApiUpgradeError`.

## Коды ошибок {#error-codes}

| Код | Значение | Условие возникновения |
|------|-------|-----------------|
| `InvalidInput` | `"INVALID_INPUT"` | Входные данные не являются строкой или обычным объектом |
| `ParseOrValidateFailed` | `"PARSE_OR_VALIDATE_FAILED"` | Не удалось разобрать входные данные или выполнить начальную проверку |
| `FirstUpgradeFailed` | `"FIRST_UPGRADE_FAILED"` | Ошибка преобразования 2.0/3.0 → 3.1 |
| `SecondUpgradeFailed` | `"SECOND_UPGRADE_FAILED"` | Преобразователь 3.1 → 3.2 выбросил исключение |
| `VersionAssertionFailed` | `"VERSION_ASSERTION_FAILED"` | В результате не объявлена версия OpenAPI 3.2.x |
| `ValidationFailed` | `"VALIDATION_FAILED"` | Преобразованный документ не прошёл проверку по схеме |
| `CircularReference` | `"CIRCULAR_REFERENCE"` | Входной документ содержит циклическую ссылку |

## Экспорты типов

```typescript
import type {
  Oas20Document, Oas30Document, Oas31Document, Oas32Document,
  OpenApiDocument, OpenApiInput, UpgradedDocument,
  OpenApiValidationIssue, UpgradeOptions,
} from "@powerduck/openapi-parser";
```

Типы объектов схемы OpenAPI 3.2:

```typescript
import type {
  SchemaObject, OperationObject, ParameterObject, PathItemObject,
  RequestBodyObject, ResponseObject, ServerObject, TagObject, MediaTypeObject,
} from "@powerduck/openapi-parser";
```

## Реэкспортируемые функции @scalar

Для продвинутых сценариев напрямую реэкспортируются следующие функции:

```typescript
import { dereference, upgrade, validate } from "@powerduck/openapi-parser";
```
