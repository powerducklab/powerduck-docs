---
sidebar_position: 4
title: "Справочник API"
description: "Свойства OasDocument, хук useOasDocument и функции ядра."
---

# Справочник API

## `<OasDocument />` — Свойство

| Свойство | Тип | По умолчанию | Описание |
|------|------|---------|-------------|
| `input` | `OpenApiInput \| OpenApiDocument \| null` | обязательно | Документ OpenAPI/Swagger (объект, строка JSON или строка YAML) |
| `autoUpgrade` | `boolean` | `true` | Проверка и преобразование в OAS 3.2 через `@powerduck/openapi-parser` |
| `defaultOperationId` | `string` | — | ID операции для выбора при первой отрисовке |
| `onOperationChange` | `(operation) => void` | — | Обратный вызов при изменении выбора пользователем |
| `className` | `string` | — | Дополнительный CSS-класс корневого элемента |
| `style` | `React.CSSProperties` | — | Встроенные стили корневого элемента |
| `theme` | `"light" \| "dark"` | `"light"` | Начальная тема. Сохраняется в localStorage. |
| `header` | `OasDocumentHeaderConfig` | — | Настройка шапки (логотип, заголовок, ссылки навигации) |
| `showTree` | `boolean` | `true` | Показывает дерево в боковой панели |
| `treeWidth` | `number` | `340` | Ширина боковой панели в пикселях (240–480) |

### Настройка шапки

| Поле | Тип | По умолчанию |
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

## Функции ядра

| Функция | Описание |
|----------|-------------|
| `loadOasDocument(input, options?)` | Загружает и преобразует документ. Возвращает `{ document, operations, navigationGroups, tree, warnings, error }` |
| `parseOperations(document)` | Извлекает операции из документа OAS |
| `buildNavigationGroups(document)` | Строит сгруппированную структуру навигации |
