---
sidebar_position: 4
title: "API 參考"
description: "Tree 元件屬性、配接器、核心工具函式與命令式控制方法。"
---

# API 參考

## 核心: `TreeNode<TMetadata>`

```typescript
interface TreeNode<TMetadata = unknown> {
  id: string;
  name: string;
  order?: number;
  children?: TreeNode<TMetadata>[];
  metadata?: TMetadata;
}
```

## 配接器

### `buildOpenApiTree(document, options?)`

建立 OpenAPI 導覽樹。

| 選項 | 型別 | 預設值 | 說明 |
|--------|------|---------|-------------|
| `showInternal` | `boolean` | `false` | 啟用時顯示帶有 `x-internal` 或 `x-scalar-ignore` 標記的節點 |
| `showComponents` | `boolean` | `true` | 顯示元件區段 |
| `showWebhooks` | `boolean` | `true` | 顯示 Webhook |
| `defaultExpandDepth` | `number` | `2` | 預設展開深度 |

導覽優先順序：OAS 3.2 原生巢狀標籤 → `x-tagGroups` → 平面標籤。

### `buildSchemaTree(schema, options?)`

| 選項 | 型別 | 預設值 | 說明 |
|--------|------|---------|-------------|
| `maxDepth` | `number` | `8` | 最大巢狀深度 |
| `showDeprecated` | `boolean` | `true` | 顯示已棄用的屬性 |
| `expandCombinators` | `boolean` | `true` | 展開 oneOf/anyOf/allOf |
| `showArrayItems` | `boolean` | `true` | 展開陣列項目 |

### `buildDocTree(document, options?)`

Stripe 風格的文件樹，每個操作可展開以顯示參數、請求本文與回應。

## React `<Tree />` 元件

### 主要屬性

| 屬性 | 型別 | 預設值 | 說明 |
|------|------|---------|-------------|
| `nodes` | `TreeNode[]` | 必填 | 要渲染的根節點 |
| `onSelect` | `(node) => void` | — | 選取節點時呼叫 |
| `searchable` | `boolean` | `false` | 顯示搜尋框 |
| `defaultExpandDepth` | `number` | `1` | 初始展開深度 |
| `showExpandAll` | `boolean` | `false` | 全部展開/摺疊切換 |
| `draggable` | `boolean` | `false` | 啟用拖放排序 |
| `onReorder` | `(result: ReorderResult) => void` | — | 在相同父節點下重新排序時呼叫 |
| `onMove` | `(nodes, movedNode, targetParentId) => void` | — | 跨層級移動時呼叫 |
| `canDrag` | `(node) => boolean` | — | 控制哪些節點可拖曳 |
| `canDrop` | `(dragged, target, position) => boolean` | — | 控制允許的放置目標 |
| `contextMenuItems` | `(node) => ContextMenuItem[]` | — | 右鍵功能表項目 |
| `onPatch` | `(ops, context) => void` | — | 重新排序時產生的 RFC 6902 修補操作 |
| `maxHeight` | `number \| string` | — | 出現捲動前的最大高度 |
| `size` | `"xs" \| "sm" \| "md"` | `"sm"` | 尺寸規格 |

### 命令式控制介面（透過 ref）

| 方法 | 說明 |
|--------|-------------|
| `expandAll()` | 展開所有節點 |
| `collapseAll()` | 摺疊所有節點 |
| `expandToDepth(depth)` | 展開至指定深度 |
| `getExpandedIds()` | 取得目前展開節點的 ID |
| `getSelectedNode()` | 取得目前選取的節點 |
| `scrollToNode(id)` | 將節點捲動至可視區域 |
| `locateNode(predicate)` | 尋找節點、展開祖先、選取並捲動至可視區域 |

## 核心工具函式

| 函式 | 說明 |
|----------|-------------|
| `findNode(nodes, id)` | 依 ID 尋找節點 |
| `findPath(nodes, id)` | 尋找從根節點開始的完整路徑 |
| `getLeaves(nodes)` | 取得所有葉節點 |
| `countNodes(nodes)` | 計算所有節點數量 |
| `filterTree(nodes, { query })` | 依搜尋條件篩選 |
| `flattenTree(nodes)` | 依前序走訪攤平成清單 |
| `updateNode(nodes, id, updater)` | 以不可變方式更新節點 |
| `removeNode(nodes, id)` | 以不可變方式移除節點 |
