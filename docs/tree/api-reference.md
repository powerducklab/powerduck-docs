---
sidebar_position: 4
title: "API Reference"
description: "Tree component props, adapters, core utilities, and imperative handle methods."
---

# API Reference

## Core: `TreeNode<TMetadata>`

```typescript
interface TreeNode<TMetadata = unknown> {
  id: string;
  name: string;
  order?: number;
  children?: TreeNode<TMetadata>[];
  metadata?: TMetadata;
}
```

## Adapters

### `buildOpenApiTree(document, options?)`

Builds an OpenAPI navigation tree.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `showInternal` | `boolean` | `false` | Hide `x-internal` operations |
| `showComponents` | `boolean` | `true` | Show components section |
| `showWebhooks` | `boolean` | `true` | Show webhooks |
| `defaultExpandDepth` | `number` | `2` | Default expansion depth |

Navigation priority: OAS 3.2 native nested tags → `x-tagGroups` → flat tags.

### `buildSchemaTree(schema, options?)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxDepth` | `number` | `8` | Max nesting depth |
| `showDeprecated` | `boolean` | `true` | Show deprecated properties |
| `expandCombinators` | `boolean` | `true` | Expand oneOf/anyOf/allOf |
| `showArrayItems` | `boolean` | `true` | Expand array items |

### `buildDocTree(document, options?)`

Stripe-style documentation tree where each operation expands to show
parameters, request body, and responses.

## React `<Tree />` Component

### Key props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `nodes` | `TreeNode[]` | required | Root nodes to render |
| `onSelect` | `(node) => void` | — | Called when a node is selected |
| `searchable` | `boolean` | `false` | Show search input |
| `defaultExpandDepth` | `number` | `1` | Initial expansion depth |
| `showExpandAll` | `boolean` | `false` | Expand/collapse all toggle |
| `draggable` | `boolean` | `false` | Enable drag-and-drop reordering |
| `onReorder` | `(result: ReorderResult) => void` | — | Called on reorder within same parent |
| `onMove` | `(nodes, movedNode, targetParentId) => void` | — | Called on cross-level move |
| `canDrag` | `(node) => boolean` | — | Control which nodes can be dragged |
| `canDrop` | `(dragged, target, position) => boolean` | — | Control allowed drop targets |
| `contextMenuItems` | `(node) => ContextMenuItem[]` | — | Right-click menu items |
| `onPatch` | `(ops, context) => void` | — | RFC 6902 patch ops on reorder |
| `maxHeight` | `number \| string` | — | Max height before scrolling |
| `size` | `"xs" \| "sm" \| "md"` | `"sm"` | Size variant |

### Imperative handle (via ref)

| Method | Description |
|--------|-------------|
| `expandAll()` | Expand all nodes |
| `collapseAll()` | Collapse all nodes |
| `expandToDepth(depth)` | Expand to a specific depth |
| `getExpandedIds()` | Get currently expanded node IDs |
| `getSelectedNode()` | Get the currently selected node |
| `scrollToNode(id)` | Scroll a node into view |
| `locateNode(predicate)` | Find a node, expand ancestors, select, and scroll into view |

## Core utilities

| Function | Description |
|----------|-------------|
| `findNode(nodes, id)` | Find a node by ID |
| `findPath(nodes, id)` | Find full path from root |
| `getLeaves(nodes)` | Get all leaf nodes |
| `countNodes(nodes)` | Count all nodes |
| `filterTree(nodes, { query })` | Filter by search query |
| `flattenTree(nodes)` | Flatten to pre-order list |
| `updateNode(nodes, id, updater)` | Immutable node update |
| `removeNode(nodes, id)` | Immutable node removal |
