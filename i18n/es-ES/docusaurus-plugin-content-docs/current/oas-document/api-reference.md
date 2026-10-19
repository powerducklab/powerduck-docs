---
sidebar_position: 4
title: "Referencia de la API"
description: "Propiedades de OasDocument, hook useOasDocument y funciones del núcleo."
---

# Referencia de la API

## `<OasDocument />` — Propiedad

| Propiedad | Tipo | Valor predeterminado | Descripción |
|------|------|---------|-------------|
| `input` | `OpenApiInput \| OpenApiDocument \| null` | obligatorio | Documento OpenAPI/Swagger (objeto, cadena JSON o cadena YAML) |
| `autoUpgrade` | `boolean` | `true` | Valida y convierte a OAS 3.2 mediante `@powerduck/openapi-parser` |
| `defaultOperationId` | `string` | — | ID de la operación seleccionada en el primer renderizado |
| `onOperationChange` | `(operation) => void` | — | Callback al cambiar la selección por acción del usuario |
| `className` | `string` | — | Clase CSS adicional para el elemento raíz |
| `style` | `React.CSSProperties` | — | Estilos en línea del elemento raíz |
| `theme` | `"light" \| "dark"` | `"light"` | Tema inicial. Se guarda en localStorage. |
| `header` | `OasDocumentHeaderConfig` | — | Configuración de la cabecera (logo, título, enlaces) |
| `showTree` | `boolean` | `true` | Muestra el árbol lateral |
| `treeWidth` | `number` | `340` | Ancho de la barra lateral en píxeles (240–480) |

### Configuración de la cabecera

| Campo | Tipo | Valor predeterminado |
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

## Funciones del núcleo

| Función | Descripción |
|----------|-------------|
| `loadOasDocument(input, options?)` | Carga y convierte un documento. Devuelve `{ document, operations, navigationGroups, tree, warnings, error }` |
| `parseOperations(document)` | Extrae las operaciones de un documento OAS |
| `buildNavigationGroups(document)` | Crea una estructura de navegación agrupada |
