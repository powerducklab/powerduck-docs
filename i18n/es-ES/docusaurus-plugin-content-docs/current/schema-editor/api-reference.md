---
sidebar_position: 4
title: "Referencia de la API"
description: "Propiedades de SchemaEditor, exportaciones del núcleo y tipos de lenguaje del editor."
---

# Referencia de la API

## `<SchemaEditor />` — Propiedad

| Propiedad | Tipo | Valor predeterminado | Descripción |
|------|------|---------|-------------|
| `value` | `string` | obligatorio | Contenido del editor |
| `onChange` | `(value: string) => void` | — | Se invoca cuando cambia el contenido |
| `language` | `"json" \| "yaml" \| "javascript"` | obligatorio | Lenguaje del contenido |
| `schema` | `JsonSchema` | — | JSON Schema utilizado para el autocompletado y el diagnóstico (json/yaml) |
| `snippets` | `string[]` | — | Cadenas de fragmentos para la compleción mediante texto fantasma en JavaScript |
| `theme` | `"light" \| "dark"` | `"light"` | Tema visual |
| `readOnly` | `boolean` | `false` | Desactiva la edición |
| `placeholder` | `string` | — | Texto de marcador cuando el contenido está vacío |
| `showDiagnostics` | `boolean` | `true` | Muestra la barra de estado del diagnóstico |
| `enableInlineSuggestions` | `boolean` | `true` | Activa el texto fantasma |
| `enableCompletion` | `boolean` | `true` | Activa el autocompletado emergente |
| `diagnosticsDebounceMs` | `number` | `250` | Retardo de espera del diagnóstico tras los cambios |

## Exportaciones del núcleo (`@powerduck/schema-editor`)

| Función | Descripción |
|----------|-------------|
| `resolveSchemas(document)` | Resuelve los punteros `$ref` de un documento de esquema |
| `validateSchema(data, schema)` | Valida datos frente a un esquema |
| `generateSample(schema)` | Genera datos de ejemplo a partir de un JSON Schema |
| `getCompletionItems(model, position)` | Obtiene los elementos de autocompletado en la posición del cursor |

## Tipos

```typescript
import type { SchemaEditorProps } from "@powerduck/schema-editor/react";
```
