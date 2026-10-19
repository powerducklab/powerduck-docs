---
sidebar_position: 4
title: "API 参考"
description: "OasDocument 属性、useOasDocument Hook 和核心函数。"
---

# API 参考

## `<OasDocument />` — 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|---------|-------------|
| `input` | `OpenApiInput \| OpenApiDocument \| null` | 必填 | OpenAPI/Swagger 文档（对象、JSON 字符串或 YAML 字符串） |
| `autoUpgrade` | `boolean` | `true` | 通过 `@powerduck/openapi-parser` 验证并升级为 OAS 3.2 |
| `defaultOperationId` | `string` | — | 初次渲染时选中的操作 ID |
| `onOperationChange` | `(operation) => void` | — | 用户主动改变选择时触发的回调 |
| `className` | `string` | — | 根元素的附加 CSS 类 |
| `style` | `React.CSSProperties` | — | 根元素的行内样式 |
| `theme` | `"light" \| "dark"` | `"light"` | 初始主题。保存在 localStorage 中。 |
| `header` | `OasDocumentHeaderConfig` | — | 页头配置（标志、标题、导航链接） |
| `showTree` | `boolean` | `true` | 显示侧边栏树 |
| `treeWidth` | `number` | `340` | 侧边栏宽度，单位为像素（范围 240–480） |

### 页头配置

| 字段 | 类型 | 默认值 |
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

## 核心函数

| 函数 | 说明 |
|----------|-------------|
| `loadOasDocument(input, options?)` | 加载并升级文档，返回 `{ document, operations, navigationGroups, tree, warnings, error }` |
| `parseOperations(document)` | 从 OAS 文档提取操作 |
| `buildNavigationGroups(document)` | 构建分组导航结构 |
