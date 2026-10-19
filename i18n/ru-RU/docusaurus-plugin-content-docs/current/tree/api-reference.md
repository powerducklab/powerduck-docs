---
sidebar_position: 4
title: "Справочник API"
description: "Свойства Tree, адаптеры, утилиты ядра и методы императивного управления."
---

# Справочник API

## Ядро: `TreeNode<TMetadata>`

```typescript
interface TreeNode<TMetadata = unknown> {
  id: string;
  name: string;
  order?: number;
  children?: TreeNode<TMetadata>[];
  metadata?: TMetadata;
}
```

## Адаптеры

### `buildOpenApiTree(document, options?)`

Строит дерево навигации OpenAPI.

| Параметр | Тип | По умолчанию | Описание |
|--------|------|---------|-------------|
| `showInternal` | `boolean` | `false` | При включении показывает узлы с `x-internal` или `x-scalar-ignore` |
| `showComponents` | `boolean` | `true` | Показывает раздел компонентов |
| `showWebhooks` | `boolean` | `true` | Показывает вебхуки |
| `defaultExpandDepth` | `number` | `2` | Глубина раскрытия по умолчанию |

Приоритет навигации: встроенные вложенные теги OAS 3.2 → `x-tagGroups` → плоские теги.

### `buildSchemaTree(schema, options?)`

| Параметр | Тип | По умолчанию | Описание |
|--------|------|---------|-------------|
| `maxDepth` | `number` | `8` | Максимальная глубина вложенности |
| `showDeprecated` | `boolean` | `true` | Показывает устаревшие свойства |
| `expandCombinators` | `boolean` | `true` | Раскрывает oneOf/anyOf/allOf |
| `showArrayItems` | `boolean` | `true` | Раскрывает элементы массивов |

### `buildDocTree(document, options?)`

Дерево документации в стиле Stripe: каждая операция раскрывается для просмотра параметров, тела запроса и ответов.

## React-компонент `<Tree />`

### Основные свойства

| Свойство | Тип | По умолчанию | Описание |
|------|------|---------|-------------|
| `nodes` | `TreeNode[]` | обязательно | Корневые узлы для отображения |
| `onSelect` | `(node) => void` | — | Вызывается при выборе узла |
| `searchable` | `boolean` | `false` | Показывает поле поиска |
| `defaultExpandDepth` | `number` | `1` | Начальная глубина раскрытия |
| `showExpandAll` | `boolean` | `false` | Переключатель раскрытия и сворачивания всех узлов |
| `draggable` | `boolean` | `false` | Включает изменение порядка перетаскиванием |
| `onReorder` | `(result: ReorderResult) => void` | — | Вызывается при изменении порядка внутри одного родителя |
| `onMove` | `(nodes, movedNode, targetParentId) => void` | — | Вызывается при перемещении между уровнями |
| `canDrag` | `(node) => boolean` | — | Определяет, какие узлы можно перетаскивать |
| `canDrop` | `(dragged, target, position) => boolean` | — | Определяет допустимые цели перетаскивания |
| `contextMenuItems` | `(node) => ContextMenuItem[]` | — | Пункты контекстного меню |
| `onPatch` | `(ops, context) => void` | — | Операции патча RFC 6902 при изменении порядка |
| `maxHeight` | `number \| string` | — | Максимальная высота до появления прокрутки |
| `size` | `"xs" \| "sm" \| "md"` | `"sm"` | Вариант размера |

### Императивное управление (через ref)

| Метод | Описание |
|--------|-------------|
| `expandAll()` | Раскрывает все узлы |
| `collapseAll()` | Сворачивает все узлы |
| `expandToDepth(depth)` | Раскрывает до заданной глубины |
| `getExpandedIds()` | Возвращает ID раскрытых узлов |
| `getSelectedNode()` | Возвращает выбранный узел |
| `scrollToNode(id)` | Прокручивает узел в видимую область |
| `locateNode(predicate)` | Находит узел, раскрывает предков, выбирает его и прокручивает к нему |

## Утилиты ядра

| Функция | Описание |
|----------|-------------|
| `findNode(nodes, id)` | Находит узел по ID |
| `findPath(nodes, id)` | Находит полный путь от корня |
| `getLeaves(nodes)` | Возвращает все листовые узлы |
| `countNodes(nodes)` | Подсчитывает все узлы |
| `filterTree(nodes, { query })` | Фильтрует по поисковому запросу |
| `flattenTree(nodes)` | Преобразует в плоский список в порядке прямого обхода |
| `updateNode(nodes, id, updater)` | Обновляет узел без изменения исходных данных |
| `removeNode(nodes, id)` | Удаляет узел без изменения исходных данных |
