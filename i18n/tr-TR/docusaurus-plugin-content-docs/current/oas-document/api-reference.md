---
sidebar_position: 4
title: "API başvuru kaynağı"
description: "OasDocument özellikleri, useOasDocument hook’u ve çekirdek işlevleri."
---

# API başvuru kaynağı

## `<OasDocument />` — Özellik

| Özellik | Tür | Varsayılan | Açıklama |
|------|------|---------|-------------|
| `input` | `OpenApiInput \| OpenApiDocument \| null` | gerekli | OpenAPI/Swagger belgesi (nesne, JSON dizesi veya YAML dizesi) |
| `autoUpgrade` | `boolean` | `true` | `@powerduck/openapi-parser` ile doğrular ve OAS 3.2’ye dönüştürür |
| `defaultOperationId` | `string` | — | İlk görüntülemede seçilecek işlem kimliği |
| `onOperationChange` | `(operation) => void` | — | Kullanıcı seçimi değiştirdiğinde çağrılan geri çağrı |
| `className` | `string` | — | Kök öğe için ek CSS sınıfı |
| `style` | `React.CSSProperties` | — | Kök öğe için satır içi stiller |
| `theme` | `"light" \| "dark"` | `"light"` | İlk tema. localStorage’a kaydedilir. |
| `header` | `OasDocumentHeaderConfig` | — | Üst bilgi yapılandırması (logo, başlık, gezinme bağlantıları) |
| `showTree` | `boolean` | `true` | Kenar çubuğu ağacını gösterir |
| `treeWidth` | `number` | `340` | Kenar çubuğu genişliği, piksel olarak (240–480) |

### Üst bilgi yapılandırması

| Alan | Tür | Varsayılan |
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

## Çekirdek işlevleri

| İşlev | Açıklama |
|----------|-------------|
| `loadOasDocument(input, options?)` | Belgeyi yükler ve dönüştürür. `{ document, operations, navigationGroups, tree, warnings, error }` döndürür |
| `parseOperations(document)` | OAS belgesinden işlemleri çıkarır |
| `buildNavigationGroups(document)` | Gruplanmış gezinme yapısı oluşturur |
