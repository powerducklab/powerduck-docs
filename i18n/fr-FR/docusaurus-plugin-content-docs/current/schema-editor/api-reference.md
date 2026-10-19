---
sidebar_position: 4
title: "Référence de l’API"
description: "Propriétés de SchemaEditor, exports du noyau et types de langage de l’éditeur."
---

# Référence de l’API

## `<SchemaEditor />` — Propriété

| Propriété | Type | Valeur par défaut | Description |
|------|------|---------|-------------|
| `value` | `string` | obligatoire | Contenu de l’éditeur |
| `onChange` | `(value: string) => void` | — | Appelé lors d’une modification du contenu |
| `language` | `"json" \| "yaml" \| "javascript"` | obligatoire | Langage du contenu |
| `schema` | `JsonSchema` | — | JSON Schema utilisé pour la complétion et les diagnostics (json/yaml) |
| `snippets` | `string[]` | — | Chaînes de code pour la complétion par texte fantôme en JavaScript |
| `theme` | `"light" \| "dark"` | `"light"` | Thème visuel |
| `readOnly` | `boolean` | `false` | Désactive l’édition |
| `placeholder` | `string` | — | Texte indicatif lorsque le contenu est vide |
| `showDiagnostics` | `boolean` | `true` | Affiche la barre d’état des diagnostics |
| `enableInlineSuggestions` | `boolean` | `true` | Active le texte fantôme |
| `enableCompletion` | `boolean` | `true` | Active la fenêtre de complétion |
| `diagnosticsDebounceMs` | `number` | `250` | Délai d’attente des diagnostics après les modifications |

## Exports du noyau (`@powerduck/schema-editor`)

| Fonction | Description |
|----------|-------------|
| `resolveSchemas(document)` | Résout les pointeurs `$ref` dans un document de schéma |
| `validateSchema(data, schema)` | Valide les données par rapport à un schéma |
| `generateSample(schema)` | Génère des données d’exemple depuis un JSON Schema |
| `getCompletionItems(model, position)` | Récupère les suggestions de complétion à la position du curseur |

## Types

```typescript
import type { SchemaEditorProps } from "@powerduck/schema-editor/react";
```
