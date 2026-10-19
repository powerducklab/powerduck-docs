---
sidebar_position: 4
title: "Referencia de la API"
description: "Todas las exportaciones de @powerduck/openapi-parser: upgradeOasTo32, OpenApiUpgradeError, UpgradeErrorCode, tipos y utilidades de @scalar reexportadas."
---

# Referencia de la API

## `upgradeOasTo32(input, options?)`

Convierte un documento Swagger 2.0 u OpenAPI 3.x a OpenAPI 3.2.

| Parámetro | Tipo | Obligatorio | Descripción |
|-----------|------|----------|-------------|
| `input` | `OpenApiDocument \| string` | Sí | Documento Swagger 2.0 u OpenAPI 3.x como objeto simple o cadena JSON/YAML |
| `options` | `UpgradeOptions` | No | Configuración opcional |

**Devuelve:** `Promise<Oas32Document>` — Un documento OpenAPI 3.2 validado.

**Lanza:** `OpenApiUpgradeError` — Consulta [Códigos de error](#error-codes).

### `UpgradeOptions`

| Propiedad | Tipo | Valor predeterminado | Descripción |
|----------|------|---------|-------------|
| `validateResult` | `boolean` | `true` | Valida el documento convertido frente al esquema |
| `checkVersion` | `boolean` | `true` | Comprueba que la salida declara OpenAPI 3.2.x |
| `maxDepth` | `number` | `64` | Profundidad de búsqueda de referencias circulares. Usa `0` para desactivarla |

## `OpenApiUpgradeError`

```typescript
class OpenApiUpgradeError extends Error {
  readonly code: UpgradeErrorCode;
  readonly issues: readonly OpenApiValidationIssue[];
  readonly cause?: unknown;
}
```

## `isOpenApiUpgradeError(value)`

Guarda de tipo. Devuelve `true` si el valor es una instancia de `OpenApiUpgradeError`.

## Códigos de error {#error-codes}

| Código | Valor | Cuándo ocurre |
|------|-------|-----------------|
| `InvalidInput` | `"INVALID_INPUT"` | La entrada no es una cadena ni un objeto simple |
| `ParseOrValidateFailed` | `"PARSE_OR_VALIDATE_FAILED"` | No se pudo analizar la entrada o falló la validación inicial |
| `FirstUpgradeFailed` | `"FIRST_UPGRADE_FAILED"` | Falló la conversión de 2.0/3.0 a 3.1 |
| `SecondUpgradeFailed` | `"SECOND_UPGRADE_FAILED"` | El conversor de 3.1 a 3.2 lanzó una excepción |
| `VersionAssertionFailed` | `"VERSION_ASSERTION_FAILED"` | La salida no declara OpenAPI 3.2.x |
| `ValidationFailed` | `"VALIDATION_FAILED"` | El documento convertido no superó la validación del esquema |
| `CircularReference` | `"CIRCULAR_REFERENCE"` | El documento de entrada contiene una referencia circular |

## Exportaciones de tipos

```typescript
import type {
  Oas20Document, Oas30Document, Oas31Document, Oas32Document,
  OpenApiDocument, OpenApiInput, UpgradedDocument,
  OpenApiValidationIssue, UpgradeOptions,
} from "@powerduck/openapi-parser";
```

Tipos de objetos del esquema OpenAPI 3.2:

```typescript
import type {
  SchemaObject, OperationObject, ParameterObject, PathItemObject,
  RequestBodyObject, ResponseObject, ServerObject, TagObject, MediaTypeObject,
} from "@powerduck/openapi-parser";
```

## Utilidades de @scalar reexportadas

Para usos avanzados, se reexportan directamente estas funciones:

```typescript
import { dereference, upgrade, validate } from "@powerduck/openapi-parser";
```
