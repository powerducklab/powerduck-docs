---
sidebar_position: 4
title: "API Reference"
description: "OasDocument props, useOasDocument hook, and core functions."
---

# API Reference

## `<OasDocument />` Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `input` | `OpenApiInput \| OpenApiDocument \| null` | required | The OpenAPI/Swagger document (object, JSON string, or YAML string) |
| `autoUpgrade` | `boolean` | `true` | Validate and upgrade to OAS 3.2 via `@powerduck/openapi-parser` |
| `defaultOperationId` | `string` | — | Operation ID to select on initial render |
| `onOperationChange` | `(operation) => void` | — | Callback on user-initiated selection changes |
| `className` | `string` | — | Additional CSS class for root |
| `style` | `React.CSSProperties` | — | Inline styles for root |
| `theme` | `"light" \| "dark"` | `"light"` | Initial theme. Persisted to localStorage. |
| `header` | `OasDocumentHeaderConfig` | — | Header configuration (logo, title, nav links) |
| `showTree` | `boolean` | `true` | Show sidebar tree |
| `treeWidth` | `number` | `340` | Sidebar width in pixels (range 240-480) |

### Header config

| Field | Type | Default |
|-------|------|---------|
| `logo` | `string \| ReactNode` | — |
| `title` | `string` | `"API Documentation"` |
| `navItems` | `Array<{ label, href?, onClick? }>` | `[]` |
| `showThemeToggle` | `boolean` | `true` |

## `useOasDocument(input, options?)`

```typescript
const {
  document,          // Oas32Document | null
  loading,           // boolean
  error,             // Error | null
  operations,        // OasOperation[]
  navigationGroups,  // OasNavigationGroup[]
  tree,              // TreeNode[]
  selectedOperation, // OasOperation | undefined
  setSelectedOperation,
  theme,             // "light" | "dark"
  setTheme,
} = useOasDocument(spec, { autoUpgrade: true });
```

## Core functions

| Function | Description |
|----------|-------------|
| `loadOasDocument(input, options?)` | Load and upgrade a document. Returns `{ document, operations, navigationGroups, tree, warnings, error }` |
| `parseOperations(document)` | Extract operations from an OAS document |
| `buildNavigationGroups(document)` | Build grouped navigation structure |
