---
sidebar_position: 4
title: "API-Referenz"
description: "Alle Exporte von @powerduck/openapi-parser: upgradeOasTo32, OpenApiUpgradeError, UpgradeErrorCode, Typen und erneut exportierte @scalar-Hilfsfunktionen."
---

# API-Referenz

## `upgradeOasTo32(input, options?)`

Konvertiert ein Swagger-2.0- oder OpenAPI-3.x-Dokument in OpenAPI 3.2.

| Parameter | Typ | Erforderlich | Beschreibung |
|-----------|------|----------|-------------|
| `input` | `OpenApiDocument \| string` | Ja | Swagger-2.0- oder OpenAPI-3.x-Dokument als einfaches Objekt oder JSON/YAML-String |
| `options` | `UpgradeOptions` | Nein | Optionale Konfiguration |

**Rückgabe:** `Promise<Oas32Document>` — Ein validiertes OpenAPI-3.2-Dokument.

**Wirft:** `OpenApiUpgradeError` — Siehe [Fehlercodes](#error-codes).

### `UpgradeOptions`

| Eigenschaft | Typ | Standardwert | Beschreibung |
|----------|------|---------|-------------|
| `validateResult` | `boolean` | `true` | Führt eine Schemavalidierung des konvertierten Dokuments aus |
| `checkVersion` | `boolean` | `true` | Prüft, ob die Ausgabe OpenAPI 3.2.x deklariert |
| `maxDepth` | `number` | `64` | Suchtiefe für zirkuläre Referenzen. Mit `0` deaktivieren |

## `OpenApiUpgradeError`

```typescript
class OpenApiUpgradeError extends Error {
  readonly code: UpgradeErrorCode;
  readonly issues: readonly OpenApiValidationIssue[];
  readonly cause?: unknown;
}
```

## `isOpenApiUpgradeError(value)`

Typwächter. Gibt `true` zurück, wenn der Wert eine Instanz von `OpenApiUpgradeError` ist.

## Fehlercodes {#error-codes}

| Code | Wert | Auslöser |
|------|-------|-----------------|
| `InvalidInput` | `"INVALID_INPUT"` | Eingabe ist weder String noch einfaches Objekt |
| `ParseOrValidateFailed` | `"PARSE_OR_VALIDATE_FAILED"` | Eingabe konnte nicht geparst werden oder die anfängliche Validierung schlug fehl |
| `FirstUpgradeFailed` | `"FIRST_UPGRADE_FAILED"` | Konvertierung 2.0/3.0 → 3.1 fehlgeschlagen |
| `SecondUpgradeFailed` | `"SECOND_UPGRADE_FAILED"` | Konvertierung 3.1 → 3.2 löste eine Ausnahme aus |
| `VersionAssertionFailed` | `"VERSION_ASSERTION_FAILED"` | Ausgabe deklariert nicht OpenAPI 3.2.x |
| `ValidationFailed` | `"VALIDATION_FAILED"` | Konvertiertes Dokument hat die Schemavalidierung nicht bestanden |
| `CircularReference` | `"CIRCULAR_REFERENCE"` | Eingabedokument enthält eine zirkuläre Referenz |

## Typexporte

```typescript
import type {
  Oas20Document, Oas30Document, Oas31Document, Oas32Document,
  OpenApiDocument, OpenApiInput, UpgradedDocument,
  OpenApiValidationIssue, UpgradeOptions,
} from "@powerduck/openapi-parser";
```

OpenAPI-3.2-Schemaobjekttypen:

```typescript
import type {
  SchemaObject, OperationObject, ParameterObject, PathItemObject,
  RequestBodyObject, ResponseObject, ServerObject, TagObject, MediaTypeObject,
} from "@powerduck/openapi-parser";
```

## Erneut exportierte @scalar-Hilfsfunktionen

Für fortgeschrittene Anwendungsfälle werden diese Funktionen direkt erneut exportiert:

```typescript
import { dereference, upgrade, validate } from "@powerduck/openapi-parser";
```
