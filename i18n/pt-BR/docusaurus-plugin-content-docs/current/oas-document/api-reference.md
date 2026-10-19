---
sidebar_position: 4
title: "Referência da API"
description: "Propriedades de OasDocument, hook useOasDocument e funções do núcleo."
---

# Referência da API

## `<OasDocument />` — Propriedade

| Propriedade | Tipo | Padrão | Descrição |
|------|------|---------|-------------|
| `input` | `OpenApiInput \| OpenApiDocument \| null` | obrigatório | Documento OpenAPI/Swagger (objeto, string JSON ou string YAML) |
| `autoUpgrade` | `boolean` | `true` | Valida e converte para OAS 3.2 com `@powerduck/openapi-parser` |
| `defaultOperationId` | `string` | — | ID da operação selecionada na primeira renderização |
| `onOperationChange` | `(operation) => void` | — | Callback quando o usuário altera a seleção |
| `className` | `string` | — | Classe CSS adicional para o elemento raiz |
| `style` | `React.CSSProperties` | — | Estilos em linha do elemento raiz |
| `theme` | `"light" \| "dark"` | `"light"` | Tema inicial. Salvo no localStorage. |
| `header` | `OasDocumentHeaderConfig` | — | Configuração do cabeçalho (logo, título, links) |
| `showTree` | `boolean` | `true` | Mostra a árvore lateral |
| `treeWidth` | `number` | `340` | Largura da barra lateral em pixels (240–480) |

### Configuração do cabeçalho

| Campo | Tipo | Padrão |
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

## Funções do núcleo

| Função | Descrição |
|----------|-------------|
| `loadOasDocument(input, options?)` | Carrega e converte um documento. Retorna `{ document, operations, navigationGroups, tree, warnings, error }` |
| `parseOperations(document)` | Extrai operações de um documento OAS |
| `buildNavigationGroups(document)` | Cria a estrutura de navegação agrupada |
