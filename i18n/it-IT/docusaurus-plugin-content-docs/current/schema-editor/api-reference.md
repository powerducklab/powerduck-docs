---
sidebar_position: 4
title: "Riferimento API"
description: "Proprietà di SchemaEditor, esportazioni del modulo principale e tipi di linguaggio dell’editor."
---

# Riferimento API

## `<SchemaEditor />` — Proprietà

| Proprietà | Tipo | Valore predefinito | Descrizione |
|------|------|---------|-------------|
| `value` | `string` | obbligatorio | Contenuto dell’editor |
| `onChange` | `(value: string) => void` | — | Richiamata quando cambia il contenuto |
| `language` | `"json" \| "yaml" \| "javascript"` | obbligatorio | Linguaggio del contenuto |
| `schema` | `JsonSchema` | — | JSON Schema usato per il completamento e la diagnostica (json/yaml) |
| `snippets` | `string[]` | — | Stringhe di frammenti per il completamento con testo fantasma in JavaScript |
| `theme` | `"light" \| "dark"` | `"light"` | Tema visivo |
| `readOnly` | `boolean` | `false` | Disabilita la modifica |
| `placeholder` | `string` | — | Testo segnaposto quando il contenuto è vuoto |
| `showDiagnostics` | `boolean` | `true` | Mostra la barra di stato della diagnostica |
| `enableInlineSuggestions` | `boolean` | `true` | Abilita il testo fantasma |
| `enableCompletion` | `boolean` | `true` | Abilita il completamento a comparsa |
| `diagnosticsDebounceMs` | `number` | `250` | Ritardo di debounce della diagnostica |

## Esportazioni del modulo principale (`@powerduck/schema-editor`)

| Funzione | Descrizione |
|----------|-------------|
| `resolveSchemas(document)` | Risolve i puntatori `$ref` in un documento di schema |
| `validateSchema(data, schema)` | Valida i dati rispetto a uno schema |
| `generateSample(schema)` | Genera dati di esempio da un JSON Schema |
| `getCompletionItems(model, position)` | Ottiene i suggerimenti di completamento nella posizione del cursore |

## Tipi

```typescript
import type { SchemaEditorProps } from "@powerduck/schema-editor/react";
```
