---
sidebar_position: 4
title: "Riferimento API"
description: "Tutte le esportazioni di @powerduck/openapi-parser: upgradeOasTo32, OpenApiUpgradeError, UpgradeErrorCode, tipi e utilità @scalar riesportate."
---

# Riferimento API

## `upgradeOasTo32(input, options?)`

Converte un documento Swagger 2.0 o OpenAPI 3.x in OpenAPI 3.2.

| Parametro | Tipo | Obbligatorio | Descrizione |
|-----------|------|----------|-------------|
| `input` | `OpenApiDocument \| string` | Sì | Documento Swagger 2.0 o OpenAPI 3.x come oggetto semplice o stringa JSON/YAML |
| `options` | `UpgradeOptions` | No | Configurazione facoltativa |

**Restituisce:** `Promise<Oas32Document>` — Un documento OpenAPI 3.2 validato.

**Genera:** `OpenApiUpgradeError` — Vedi [Codici di errore](#error-codes).

### `UpgradeOptions`

| Proprietà | Tipo | Valore predefinito | Descrizione |
|----------|------|---------|-------------|
| `validateResult` | `boolean` | `true` | Esegue la validazione dello schema sul documento convertito |
| `checkVersion` | `boolean` | `true` | Verifica che l’output dichiari OpenAPI 3.2.x |
| `maxDepth` | `number` | `64` | Profondità di ricerca dei riferimenti circolari. Usa `0` per disabilitarla |

## `OpenApiUpgradeError`

```typescript
class OpenApiUpgradeError extends Error {
  readonly code: UpgradeErrorCode;
  readonly issues: readonly OpenApiValidationIssue[];
  readonly cause?: unknown;
}
```

## `isOpenApiUpgradeError(value)`

Guardia di tipo. Restituisce `true` quando il valore è un’istanza di `OpenApiUpgradeError`.

## Codici di errore {#error-codes}

| Codice | Valore | Quando si verifica |
|------|-------|-----------------|
| `InvalidInput` | `"INVALID_INPUT"` | L’input non è una stringa né un oggetto semplice |
| `ParseOrValidateFailed` | `"PARSE_OR_VALIDATE_FAILED"` | Impossibile analizzare l’input o validazione iniziale non riuscita |
| `FirstUpgradeFailed` | `"FIRST_UPGRADE_FAILED"` | Conversione 2.0/3.0 → 3.1 non riuscita |
| `SecondUpgradeFailed` | `"SECOND_UPGRADE_FAILED"` | Il convertitore 3.1 → 3.2 ha generato un’eccezione |
| `VersionAssertionFailed` | `"VERSION_ASSERTION_FAILED"` | L’output non dichiara OpenAPI 3.2.x |
| `ValidationFailed` | `"VALIDATION_FAILED"` | Il documento convertito non ha superato la validazione dello schema |
| `CircularReference` | `"CIRCULAR_REFERENCE"` | Il documento di input contiene un riferimento circolare |

## Esportazioni di tipi

```typescript
import type {
  Oas20Document, Oas30Document, Oas31Document, Oas32Document,
  OpenApiDocument, OpenApiInput, UpgradedDocument,
  OpenApiValidationIssue, UpgradeOptions,
} from "@powerduck/openapi-parser";
```

Tipi degli oggetti dello schema OpenAPI 3.2:

```typescript
import type {
  SchemaObject, OperationObject, ParameterObject, PathItemObject,
  RequestBodyObject, ResponseObject, ServerObject, TagObject, MediaTypeObject,
} from "@powerduck/openapi-parser";
```

## Utilità @scalar riesportate

Per utilizzi avanzati, queste funzioni vengono riesportate direttamente:

```typescript
import { dereference, upgrade, validate } from "@powerduck/openapi-parser";
```
