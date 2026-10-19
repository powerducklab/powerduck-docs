---
sidebar_position: 4
title: "API リファレンス"
description: "OasDocument のプロパティ、useOasDocument フック、コア関数。"
---

# API リファレンス

## `<OasDocument />` — プロパティ

| プロパティ | 型 | 既定値 | 説明 |
|------|------|---------|-------------|
| `input` | `OpenApiInput \| OpenApiDocument \| null` | 必須 | OpenAPI/Swagger ドキュメント（オブジェクト、JSON 文字列、YAML 文字列） |
| `autoUpgrade` | `boolean` | `true` | `@powerduck/openapi-parser` で検証して OAS 3.2 に変換 |
| `defaultOperationId` | `string` | — | 初期描画時に選択する操作 ID |
| `onOperationChange` | `(operation) => void` | — | ユーザーによる選択変更時のコールバック |
| `className` | `string` | — | ルート要素に追加する CSS クラス |
| `style` | `React.CSSProperties` | — | ルート要素のインラインスタイル |
| `theme` | `"light" \| "dark"` | `"light"` | 初期テーマ。localStorage に保存されます。 |
| `header` | `OasDocumentHeaderConfig` | — | ヘッダー設定（ロゴ、タイトル、ナビゲーションリンク） |
| `showTree` | `boolean` | `true` | サイドバーツリーを表示 |
| `treeWidth` | `number` | `340` | サイドバーの幅（ピクセル単位、240～480） |

### ヘッダー設定

| フィールド | 型 | 既定値 |
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

## コア関数

| 関数 | 説明 |
|----------|-------------|
| `loadOasDocument(input, options?)` | ドキュメントを読み込んで変換し、`{ document, operations, navigationGroups, tree, warnings, error }` を返す |
| `parseOperations(document)` | OAS ドキュメントから操作を抽出 |
| `buildNavigationGroups(document)` | グループ化したナビゲーション構造を構築 |
