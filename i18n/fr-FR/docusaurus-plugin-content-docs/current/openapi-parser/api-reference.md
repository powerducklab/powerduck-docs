---
sidebar_position: 4
title: "Référence de l’API"
description: "Tous les exports de @powerduck/openapi-parser : upgradeOasTo32, OpenApiUpgradeError, UpgradeErrorCode, types et utilitaires @scalar réexportés."
---

# Référence de l’API

## `upgradeOasTo32(input, options?)`

Convertit un document Swagger 2.0 ou OpenAPI 3.x en OpenAPI 3.2.

| Paramètre | Type | Obligatoire | Description |
|-----------|------|----------|-------------|
| `input` | `OpenApiDocument \| string` | Oui | Document Swagger 2.0 ou OpenAPI 3.x sous forme d’objet simple ou de chaîne JSON/YAML |
| `options` | `UpgradeOptions` | Non | Configuration facultative |

**Renvoie:** `Promise<Oas32Document>` — Un document OpenAPI 3.2 validé.

**Lève:** `OpenApiUpgradeError` — Voir [Codes d’erreur](#error-codes).

### `UpgradeOptions`

| Propriété | Type | Valeur par défaut | Description |
|----------|------|---------|-------------|
| `validateResult` | `boolean` | `true` | Valide le document converti par rapport au schéma |
| `checkVersion` | `boolean` | `true` | Vérifie que la sortie déclare OpenAPI 3.2.x |
| `maxDepth` | `number` | `64` | Profondeur de recherche des références circulaires. `0` désactive la vérification |

## `OpenApiUpgradeError`

```typescript
class OpenApiUpgradeError extends Error {
  readonly code: UpgradeErrorCode;
  readonly issues: readonly OpenApiValidationIssue[];
  readonly cause?: unknown;
}
```

## `isOpenApiUpgradeError(value)`

Garde de type. Renvoie `true` si la valeur est une instance de `OpenApiUpgradeError`.

## Codes d’erreur {#error-codes}

| Code | Valeur | Condition de déclenchement |
|------|-------|-----------------|
| `InvalidInput` | `"INVALID_INPUT"` | L’entrée n’est ni une chaîne ni un objet simple |
| `ParseOrValidateFailed` | `"PARSE_OR_VALIDATE_FAILED"` | L’analyse de l’entrée ou sa validation initiale a échoué |
| `FirstUpgradeFailed` | `"FIRST_UPGRADE_FAILED"` | La conversion 2.0/3.0 → 3.1 a échoué |
| `SecondUpgradeFailed` | `"SECOND_UPGRADE_FAILED"` | Le convertisseur 3.1 → 3.2 a levé une exception |
| `VersionAssertionFailed` | `"VERSION_ASSERTION_FAILED"` | La sortie ne déclare pas OpenAPI 3.2.x |
| `ValidationFailed` | `"VALIDATION_FAILED"` | Le document converti n’a pas passé la validation du schéma |
| `CircularReference` | `"CIRCULAR_REFERENCE"` | Le document d’entrée contient une référence circulaire |

## Exports de types

```typescript
import type {
  Oas20Document, Oas30Document, Oas31Document, Oas32Document,
  OpenApiDocument, OpenApiInput, UpgradedDocument,
  OpenApiValidationIssue, UpgradeOptions,
} from "@powerduck/openapi-parser";
```

Types d’objets du schéma OpenAPI 3.2 :

```typescript
import type {
  SchemaObject, OperationObject, ParameterObject, PathItemObject,
  RequestBodyObject, ResponseObject, ServerObject, TagObject, MediaTypeObject,
} from "@powerduck/openapi-parser";
```

## Utilitaires @scalar réexportés

Pour les usages avancés, ces fonctions sont réexportées directement :

```typescript
import { dereference, upgrade, validate } from "@powerduck/openapi-parser";
```
