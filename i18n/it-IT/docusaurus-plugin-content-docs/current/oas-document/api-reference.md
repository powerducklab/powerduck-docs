---
sidebar_position: 4
title: "Riferimento API"
description: "Proprietà di OasDocument, hook useOasDocument e funzioni del modulo principale."
---

# Riferimento API

## `<OasDocument />` — Proprietà

| Proprietà | Tipo | Valore predefinito | Descrizione |
|------|------|---------|-------------|
| `input` | `OpenApiInput \| OpenApiDocument \| null` | obbligatorio | Documento OpenAPI/Swagger (oggetto, stringa JSON o stringa YAML) |
| `autoUpgrade` | `boolean` | `true` | Valida e converte in OAS 3.2 tramite `@powerduck/openapi-parser` |
| `defaultOperationId` | `string` | — | ID dell’operazione da selezionare al primo rendering |
| `onOperationChange` | `(operation) => void` | — | Callback quando l’utente cambia la selezione |
| `className` | `string` | — | Classe CSS aggiuntiva per l’elemento radice |
| `style` | `React.CSSProperties` | — | Stili in linea dell’elemento radice |
| `theme` | `"light" \| "dark"` | `"light"` | Tema iniziale. Salvato in localStorage. |
| `header` | `OasDocumentHeaderConfig` | — | Configurazione dell’intestazione (logo, titolo, link) |
| `showTree` | `boolean` | `true` | Mostra l’albero laterale |
| `treeWidth` | `number` | `340` | Larghezza della barra laterale in pixel (240–480) |

### Configurazione dell’intestazione

| Campo | Tipo | Valore predefinito |
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

## Funzioni del modulo principale

| Funzione | Descrizione |
|----------|-------------|
| `loadOasDocument(input, options?)` | Carica e converte un documento. Restituisce `{ document, operations, navigationGroups, tree, warnings, error }` |
| `parseOperations(document)` | Estrae le operazioni da un documento OAS |
| `buildNavigationGroups(document)` | Crea una struttura di navigazione raggruppata |
