---
sidebar_position: 4
title: "API-Referenz"
description: "SchemaEditor-Props, Exporte des Kernmoduls und Sprachtypen des Editors."
---

# API-Referenz

## `<SchemaEditor />` — Prop

| Prop | Typ | Standardwert | Beschreibung |
|------|------|---------|-------------|
| `value` | `string` | erforderlich | Inhalt des Editors |
| `onChange` | `(value: string) => void` | — | Wird bei Inhaltsänderungen aufgerufen |
| `language` | `"json" \| "yaml" \| "javascript"` | erforderlich | Sprache des Inhalts |
| `schema` | `JsonSchema` | — | JSON Schema für Vervollständigung und Diagnosen (json/yaml) |
| `snippets` | `string[]` | — | Snippet-Strings für die Ghost-Text-Vervollständigung in JavaScript |
| `theme` | `"light" \| "dark"` | `"light"` | Darstellungsthema |
| `readOnly` | `boolean` | `false` | Deaktiviert die Bearbeitung |
| `placeholder` | `string` | — | Platzhaltertext bei leerem Inhalt |
| `showDiagnostics` | `boolean` | `true` | Zeigt die Diagnose-Statusleiste an |
| `enableInlineSuggestions` | `boolean` | `true` | Aktiviert Ghost-Text |
| `enableCompletion` | `boolean` | `true` | Aktiviert das Vervollständigungsfenster |
| `diagnosticsDebounceMs` | `number` | `250` | Entprellverzögerung für Diagnosen |

## Exporte des Kernmoduls (`@powerduck/schema-editor`)

| Funktion | Beschreibung |
|----------|-------------|
| `resolveSchemas(document)` | Löst `$ref`-Verweise in einem Schemadokument auf |
| `validateSchema(data, schema)` | Validiert Daten anhand eines Schemas |
| `generateSample(schema)` | Erzeugt Beispieldaten aus einem JSON Schema |
| `getCompletionItems(model, position)` | Liefert Vervollständigungseinträge an der Cursorposition |

## Typen

```typescript
import type { SchemaEditorProps } from "@powerduck/schema-editor/react";
```
