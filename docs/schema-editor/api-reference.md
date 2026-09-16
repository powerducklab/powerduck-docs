---
sidebar_position: 4
title: "API Reference"
description: "SchemaEditor props, core exports, and editor language types."
---

# API Reference

## `<SchemaEditor />` Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | required | The editor content |
| `onChange` | `(value: string) => void` | — | Called when content changes |
| `language` | `"json" \| "yaml" \| "javascript"` | required | Content language |
| `schema` | `JsonSchema` | — | JSON Schema driving completion and diagnostics (json/yaml) |
| `snippets` | `string[]` | — | Snippet strings for JavaScript ghost completion |
| `theme` | `"light" \| "dark"` | `"light"` | Visual theme |
| `readOnly` | `boolean` | `false` | Disable editing |
| `placeholder` | `string` | — | Placeholder text when empty |
| `showDiagnostics` | `boolean` | `true` | Show diagnostics status bar |
| `enableInlineSuggestions` | `boolean` | `true` | Enable ghost text |
| `enableCompletion` | `boolean` | `true` | Enable popup completion |
| `diagnosticsDebounceMs` | `number` | `250` | Diagnostics debounce delay |

## Core exports (`@powerduck/schema-editor`)

| Function | Description |
|----------|-------------|
| `resolveSchemas(document)` | Resolve `$ref` pointers in a schema document |
| `validateSchema(data, schema)` | Validate data against a schema |
| `generateSample(schema)` | Generate example data from a JSON Schema |
| `getCompletionItems(model, position)` | Get completion items at a cursor position |

## Types

```typescript
import type { SchemaEditorProps } from "@powerduck/schema-editor/react";
```
