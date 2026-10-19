---
sidebar_position: 4
title: "API リファレンス"
description: "Tree コンポーネントのプロパティ、アダプター、コアユーティリティ、命令的ハンドルのメソッド。"
---

# API リファレンス

## コア: `TreeNode<TMetadata>`

```typescript
interface TreeNode<TMetadata = unknown> {
  id: string;
  name: string;
  order?: number;
  children?: TreeNode<TMetadata>[];
  metadata?: TMetadata;
}
```

## アダプター

### `buildOpenApiTree(document, options?)`

OpenAPI ナビゲーションツリーを構築します。

| オプション | 型 | 既定値 | 説明 |
|--------|------|---------|-------------|
| `showInternal` | `boolean` | `false` | 有効時は `x-internal` または `x-scalar-ignore` 付きのノードを表示 |
| `showComponents` | `boolean` | `true` | コンポーネントセクションを表示 |
| `showWebhooks` | `boolean` | `true` | Webhook を表示 |
| `defaultExpandDepth` | `number` | `2` | 既定の展開深度 |

ナビゲーションの優先順位：OAS 3.2 のネイティブなネストタグ → `x-tagGroups` → フラットなタグ。

### `buildSchemaTree(schema, options?)`

| オプション | 型 | 既定値 | 説明 |
|--------|------|---------|-------------|
| `maxDepth` | `number` | `8` | 最大ネスト深度 |
| `showDeprecated` | `boolean` | `true` | 非推奨のプロパティを表示 |
| `expandCombinators` | `boolean` | `true` | oneOf/anyOf/allOf を展開 |
| `showArrayItems` | `boolean` | `true` | 配列の要素を展開 |

### `buildDocTree(document, options?)`

各操作を展開するとパラメーター、リクエスト本文、レスポンスが表示される Stripe 風ドキュメントツリー。

## React の `<Tree />` コンポーネント

### 主なプロパティ

| プロパティ | 型 | 既定値 | 説明 |
|------|------|---------|-------------|
| `nodes` | `TreeNode[]` | 必須 | 描画するルートノード |
| `onSelect` | `(node) => void` | — | ノード選択時に呼び出す |
| `searchable` | `boolean` | `false` | 検索入力欄を表示 |
| `defaultExpandDepth` | `number` | `1` | 初期展開深度 |
| `showExpandAll` | `boolean` | `false` | すべて展開／折りたたみの切り替え |
| `draggable` | `boolean` | `false` | ドラッグ＆ドロップによる並べ替えを有効化 |
| `onReorder` | `(result: ReorderResult) => void` | — | 同じ親の下で並べ替えたときに呼び出す |
| `onMove` | `(nodes, movedNode, targetParentId) => void` | — | 階層をまたぐ移動時に呼び出す |
| `canDrag` | `(node) => boolean` | — | ドラッグ可能なノードを制御 |
| `canDrop` | `(dragged, target, position) => boolean` | — | 許可するドロップ先を制御 |
| `contextMenuItems` | `(node) => ContextMenuItem[]` | — | 右クリックメニューの項目 |
| `onPatch` | `(ops, context) => void` | — | 並べ替え時の RFC 6902 パッチ操作 |
| `maxHeight` | `number \| string` | — | スクロールが必要になるまでの最大高さ |
| `size` | `"xs" \| "sm" \| "md"` | `"sm"` | サイズの種類 |

### 命令的ハンドル（ref 経由）

| メソッド | 説明 |
|--------|-------------|
| `expandAll()` | すべてのノードを展開 |
| `collapseAll()` | すべてのノードを折りたたむ |
| `expandToDepth(depth)` | 指定深度まで展開 |
| `getExpandedIds()` | 現在展開されているノードの ID を取得 |
| `getSelectedNode()` | 現在選択中のノードを取得 |
| `scrollToNode(id)` | ノードを表示範囲までスクロール |
| `locateNode(predicate)` | ノードを検索し、祖先を展開して選択し、表示範囲までスクロール |

## コアユーティリティ

| 関数 | 説明 |
|----------|-------------|
| `findNode(nodes, id)` | ID でノードを検索 |
| `findPath(nodes, id)` | ルートからの完全なパスを検索 |
| `getLeaves(nodes)` | すべての葉ノードを取得 |
| `countNodes(nodes)` | すべてのノードを数える |
| `filterTree(nodes, { query })` | 検索クエリで絞り込む |
| `flattenTree(nodes)` | 前順走査のリストに平坦化 |
| `updateNode(nodes, id, updater)` | 元のデータを変更せずにノードを更新 |
| `removeNode(nodes, id)` | 元のデータを変更せずにノードを削除 |
