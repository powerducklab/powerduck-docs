---
sidebar_position: 4
title: "مرجع API"
description: "خصائص OasDocument، والخطاف useOasDocument، ودوال الوحدة الأساسية."
---

# مرجع API

## `<OasDocument />` — الخاصية

| الخاصية | النوع | القيمة الافتراضية | الوصف |
|------|------|---------|-------------|
| `input` | `OpenApiInput \| OpenApiDocument \| null` | مطلوب | مستند OpenAPI/Swagger (كائن أو سلسلة JSON أو سلسلة YAML) |
| `autoUpgrade` | `boolean` | `true` | التحقق والتحويل إلى OAS 3.2 عبر `@powerduck/openapi-parser` |
| `defaultOperationId` | `string` | — | معرّف العملية المحددة عند العرض الأول |
| `onOperationChange` | `(operation) => void` | — | رد نداء عند تغيير المستخدم للاختيار |
| `className` | `string` | — | فئة CSS إضافية للعنصر الجذر |
| `style` | `React.CSSProperties` | — | أنماط مضمنة للعنصر الجذر |
| `theme` | `"light" \| "dark"` | `"light"` | السمة الأولية، وتُحفظ في localStorage. |
| `header` | `OasDocumentHeaderConfig` | — | إعداد الترويسة (الشعار والعنوان وروابط التنقل) |
| `showTree` | `boolean` | `true` | عرض الشجرة الجانبية |
| `treeWidth` | `number` | `340` | عرض الشريط الجانبي بالبكسل (240–480) |

### إعداد الترويسة

| الحقل | النوع | القيمة الافتراضية |
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

## دوال الوحدة الأساسية

| الدالة | الوصف |
|----------|-------------|
| `loadOasDocument(input, options?)` | تحميل مستند وتحويله. يعيد `{ document, operations, navigationGroups, tree, warnings, error }` |
| `parseOperations(document)` | استخراج العمليات من مستند OAS |
| `buildNavigationGroups(document)` | بناء بنية تنقل مجمّعة |
