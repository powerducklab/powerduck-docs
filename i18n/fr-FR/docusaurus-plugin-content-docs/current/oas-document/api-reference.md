---
sidebar_position: 4
title: "Référence de l’API"
description: "Propriétés de OasDocument, hook useOasDocument et fonctions du noyau."
---

# Référence de l’API

## `<OasDocument />` — Propriété

| Propriété | Type | Valeur par défaut | Description |
|------|------|---------|-------------|
| `input` | `OpenApiInput \| OpenApiDocument \| null` | obligatoire | Document OpenAPI/Swagger (objet, chaîne JSON ou chaîne YAML) |
| `autoUpgrade` | `boolean` | `true` | Valide et convertit vers OAS 3.2 via `@powerduck/openapi-parser` |
| `defaultOperationId` | `string` | — | ID de l’opération sélectionnée au premier rendu |
| `onOperationChange` | `(operation) => void` | — | Callback lors d’un changement de sélection par l’utilisateur |
| `className` | `string` | — | Classe CSS supplémentaire pour l’élément racine |
| `style` | `React.CSSProperties` | — | Styles en ligne de l’élément racine |
| `theme` | `"light" \| "dark"` | `"light"` | Thème initial, enregistré dans localStorage. |
| `header` | `OasDocumentHeaderConfig` | — | Configuration de l’en-tête (logo, titre, liens) |
| `showTree` | `boolean` | `true` | Affiche l’arborescence latérale |
| `treeWidth` | `number` | `340` | Largeur de la barre latérale en pixels (240–480) |

### Configuration de l’en-tête

| Champ | Type | Valeur par défaut |
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

## Fonctions du noyau

| Fonction | Description |
|----------|-------------|
| `loadOasDocument(input, options?)` | Charge et convertit un document. Renvoie `{ document, operations, navigationGroups, tree, warnings, error }` |
| `parseOperations(document)` | Extrait les opérations d’un document OAS |
| `buildNavigationGroups(document)` | Construit une structure de navigation groupée |
