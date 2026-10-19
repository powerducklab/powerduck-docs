---
sidebar_position: 4
title: "API 参考"
description: "Tree 组件属性、适配器、核心工具函数和命令式句柄方法。"
---

# API 参考

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

## 适配器

### `buildOpenApiTree(document, options?)`

构建 OpenAPI 导航树。

| 选项 | 类型 | 默认值 | 说明 |
|--------|------|---------|-------------|
| `showInternal` | `boolean` | `false` | 启用时显示带 `x-internal` 或 `x-scalar-ignore` 标记的节点 |
| `showComponents` | `boolean` | `true` | 显示组件部分 |
| `showWebhooks` | `boolean` | `true` | 显示 Webhook |
| `defaultExpandDepth` | `number` | `2` | 默认展开深度 |

导航优先级：OAS 3.2 原生嵌套标签 → `x-tagGroups` → 扁平标签。

### `buildSchemaTree(schema, options?)`

| 选项 | 类型 | 默认值 | 说明 |
|--------|------|---------|-------------|
| `maxDepth` | `number` | `8` | 最大嵌套深度 |
| `showDeprecated` | `boolean` | `true` | 显示已弃用的属性 |
| `expandCombinators` | `boolean` | `true` | 展开 oneOf/anyOf/allOf |
| `showArrayItems` | `boolean` | `true` | 展开数组元素 |

### `buildDocTree(document, options?)`

Stripe 风格的文档树，每个操作可展开以显示参数、请求体和响应。

## React `<Tree />` 组件

### 主要属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|---------|-------------|
| `nodes` | `TreeNode[]` | 必填 | 要渲染的根节点 |
| `onSelect` | `(node) => void` | — | 选中节点时调用 |
| `searchable` | `boolean` | `false` | 显示搜索框 |
| `defaultExpandDepth` | `number` | `1` | 初始展开深度 |
| `showExpandAll` | `boolean` | `false` | 全部展开/折叠开关 |
| `draggable` | `boolean` | `false` | 启用拖放排序 |
| `onReorder` | `(result: ReorderResult) => void` | — | 在同一父节点下重新排序时调用 |
| `onMove` | `(nodes, movedNode, targetParentId) => void` | — | 跨层级移动时调用 |
| `canDrag` | `(node) => boolean` | — | 控制哪些节点可拖动 |
| `canDrop` | `(dragged, target, position) => boolean` | — | 控制允许的放置目标 |
| `contextMenuItems` | `(node) => ContextMenuItem[]` | — | 右键菜单项 |
| `onPatch` | `(ops, context) => void` | — | 重新排序时产生的 RFC 6902 补丁操作 |
| `maxHeight` | `number \| string` | — | 出现滚动前的最大高度 |
| `size` | `"xs" \| "sm" \| "md"` | `"sm"` | 尺寸规格 |

### 命令式句柄（通过 ref）

| 方法 | 说明 |
|--------|-------------|
| `expandAll()` | 展开所有节点 |
| `collapseAll()` | 折叠所有节点 |
| `expandToDepth(depth)` | 展开至指定深度 |
| `getExpandedIds()` | 获取当前展开节点的 ID |
| `getSelectedNode()` | 获取当前选中的节点 |
| `scrollToNode(id)` | 将节点滚动到可视区域 |
| `locateNode(predicate)` | 查找节点、展开祖先、选中并滚动到可视区域 |

## 核心工具函数

| 函数 | 说明 |
|----------|-------------|
| `findNode(nodes, id)` | 按 ID 查找节点 |
| `findPath(nodes, id)` | 查找从根节点开始的完整路径 |
| `getLeaves(nodes)` | 获取所有叶节点 |
| `countNodes(nodes)` | 统计所有节点 |
| `filterTree(nodes, { query })` | 根据搜索条件筛选 |
| `flattenTree(nodes)` | 按前序遍历展开为列表 |
| `updateNode(nodes, id, updater)` | 不可变地更新节点 |
| `removeNode(nodes, id)` | 不可变地删除节点 |
