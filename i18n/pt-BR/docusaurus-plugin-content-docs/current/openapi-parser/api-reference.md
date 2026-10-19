---
sidebar_position: 4
title: "Referência da API"
description: "Todas as exportações de @powerduck/openapi-parser: upgradeOasTo32, OpenApiUpgradeError, UpgradeErrorCode, tipos e utilitários @scalar reexportados."
---

# Referência da API

## `upgradeOasTo32(input, options?)`

Converte um documento Swagger 2.0 ou OpenAPI 3.x para OpenAPI 3.2.

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|----------|-------------|
| `input` | `OpenApiDocument \| string` | Sim | Documento Swagger 2.0 ou OpenAPI 3.x como objeto simples ou string JSON/YAML |
| `options` | `UpgradeOptions` | Não | Configuração opcional |

**Retorna:** `Promise<Oas32Document>` — Um documento OpenAPI 3.2 validado.

**Lança:** `OpenApiUpgradeError` — Consulte [Códigos de erro](#error-codes).

### `UpgradeOptions`

| Propriedade | Tipo | Padrão | Descrição |
|----------|------|---------|-------------|
| `validateResult` | `boolean` | `true` | Valida o documento convertido em relação ao esquema |
| `checkVersion` | `boolean` | `true` | Verifica se a saída declara OpenAPI 3.2.x |
| `maxDepth` | `number` | `64` | Profundidade da busca de referências circulares. Use `0` para desativar |

## `OpenApiUpgradeError`

```typescript
class OpenApiUpgradeError extends Error {
  readonly code: UpgradeErrorCode;
  readonly issues: readonly OpenApiValidationIssue[];
  readonly cause?: unknown;
}
```

## `isOpenApiUpgradeError(value)`

Guarda de tipo. Retorna `true` quando o valor é uma instância de `OpenApiUpgradeError`.

## Códigos de erro {#error-codes}

| Código | Valor | Quando ocorre |
|------|-------|-----------------|
| `InvalidInput` | `"INVALID_INPUT"` | A entrada não é uma string nem um objeto simples |
| `ParseOrValidateFailed` | `"PARSE_OR_VALIDATE_FAILED"` | A entrada não pôde ser interpretada ou falhou na validação inicial |
| `FirstUpgradeFailed` | `"FIRST_UPGRADE_FAILED"` | A conversão 2.0/3.0 → 3.1 falhou |
| `SecondUpgradeFailed` | `"SECOND_UPGRADE_FAILED"` | O conversor 3.1 → 3.2 lançou uma exceção |
| `VersionAssertionFailed` | `"VERSION_ASSERTION_FAILED"` | A saída não declara OpenAPI 3.2.x |
| `ValidationFailed` | `"VALIDATION_FAILED"` | O documento convertido falhou na validação do esquema |
| `CircularReference` | `"CIRCULAR_REFERENCE"` | O documento de entrada contém uma referência circular |

## Exportações de tipos

```typescript
import type {
  Oas20Document, Oas30Document, Oas31Document, Oas32Document,
  OpenApiDocument, OpenApiInput, UpgradedDocument,
  OpenApiValidationIssue, UpgradeOptions,
} from "@powerduck/openapi-parser";
```

Tipos de objetos do esquema OpenAPI 3.2:

```typescript
import type {
  SchemaObject, OperationObject, ParameterObject, PathItemObject,
  RequestBodyObject, ResponseObject, ServerObject, TagObject, MediaTypeObject,
} from "@powerduck/openapi-parser";
```

## Utilitários @scalar reexportados

Para uso avançado, estas funções são reexportadas diretamente:

```typescript
import { dereference, upgrade, validate } from "@powerduck/openapi-parser";
```
