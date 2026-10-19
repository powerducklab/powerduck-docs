---
sidebar_position: 4
title: "API 參考"
description: "OasDocument 屬性、useOasDocument Hook 與核心函式。"
---

# API 參考

## `<OasDocument />` — 屬性

| 屬性 | 型別 | 預設值 | 說明 |
|------|------|---------|-------------|
| `input` | `OpenApiInput \| OpenApiDocument \| null` | 必填 | OpenAPI/Swagger 文件（物件、JSON 字串或 YAML 字串） |
| `autoUpgrade` | `boolean` | `true` | 透過 `@powerduck/openapi-parser` 驗證並升級為 OAS 3.2 |
| `defaultOperationId` | `string` | — | 初次渲染時選取的操作 ID |
| `onOperationChange` | `(operation) => void` | — | 使用者主動變更選取項目時觸發的回呼 |
| `className` | `string` | — | 根元素的附加 CSS 類別 |
| `style` | `React.CSSProperties` | — | 根元素的行內樣式 |
| `theme` | `"light" \| "dark"` | `"light"` | 初始佈景主題。儲存於 localStorage。 |
| `header` | `OasDocumentHeaderConfig` | — | 頁首設定（標誌、標題、導覽連結） |
| `showTree` | `boolean` | `true` | 顯示側邊欄樹 |
| `treeWidth` | `number` | `340` | 側邊欄寬度，以像素為單位（範圍 240–480） |

### 頁首設定

| 欄位 | 型別 | 預設值 |
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

## 核心函式

| 函式 | 說明 |
|----------|-------------|
| `loadOasDocument(input, options?)` | 載入並升級文件，回傳 `{ document, operations, navigationGroups, tree, warnings, error }` |
| `parseOperations(document)` | 從 OAS 文件擷取操作 |
| `buildNavigationGroups(document)` | 建立分組導覽結構 |
