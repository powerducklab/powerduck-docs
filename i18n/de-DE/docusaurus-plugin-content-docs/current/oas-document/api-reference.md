---
sidebar_position: 4
title: "API-Referenz"
description: "OasDocument-Props, der Hook useOasDocument und Kernfunktionen."
---

# API-Referenz

## `<OasDocument />` — Prop

| Prop | Typ | Standardwert | Beschreibung |
|------|------|---------|-------------|
| `input` | `OpenApiInput \| OpenApiDocument \| null` | erforderlich | OpenAPI/Swagger-Dokument (Objekt, JSON-String oder YAML-String) |
| `autoUpgrade` | `boolean` | `true` | Validiert und konvertiert mit `@powerduck/openapi-parser` in OAS 3.2 |
| `defaultOperationId` | `string` | — | Beim ersten Rendern auszuwählende Operations-ID |
| `onOperationChange` | `(operation) => void` | — | Callback bei einer vom Benutzer ausgelösten Auswahländerung |
| `className` | `string` | — | Zusätzliche CSS-Klasse für das Wurzelelement |
| `style` | `React.CSSProperties` | — | Inline-Stile für das Wurzelelement |
| `theme` | `"light" \| "dark"` | `"light"` | Anfängliches Theme; wird in localStorage gespeichert. |
| `header` | `OasDocumentHeaderConfig` | — | Kopfzeilenkonfiguration (Logo, Titel, Navigationslinks) |
| `showTree` | `boolean` | `true` | Zeigt den Seitenleistenbaum an |
| `treeWidth` | `number` | `340` | Breite der Seitenleiste in Pixeln (240–480) |

### Kopfzeilenkonfiguration

| Feld | Typ | Standardwert |
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

## Kernfunktionen

| Funktion | Beschreibung |
|----------|-------------|
| `loadOasDocument(input, options?)` | Lädt und konvertiert ein Dokument. Gibt `{ document, operations, navigationGroups, tree, warnings, error }` zurück |
| `parseOperations(document)` | Extrahiert Operationen aus einem OAS-Dokument |
| `buildNavigationGroups(document)` | Erstellt eine gruppierte Navigationsstruktur |
