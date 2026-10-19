---
sidebar_position: 2
title: "インストール"
description: "@powerduck/md-editor を npm、yarn、pnpm でインストールし、インポートパス、ピア依存関係、TypeScript 対応を確認します。"
---

# インストール

任意のパッケージマネージャーで `@powerduck/md-editor` をインストールします。

```bash
npm install @powerduck/md-editor
```

```bash
yarn add @powerduck/md-editor
```

```bash
pnpm add @powerduck/md-editor
```

## インポートパス

パッケージの `package.json` には、サブパスのエクスポートが明示的に定義されています。

| インポートパス | 内容 |
|---|---|
| `@powerduck/md-editor` | メインエントリー：`MarkdownEditor` クラスと、すべての独立したヘルパー、型、関数。 |
| `@powerduck/md-editor/react` | React サブパス：`MarkdownEditorReact` コンポーネントと、`MarkdownEditorProps`、`MarkdownEditorHandle` 型。 |
| `@powerduck/md-editor/dist/style.css` | コンパイル済みのエディタースタイルシート。1 回だけインポートしてください。 |
| `@powerduck/md-editor/styles/tokens.css` | デザイントークンの未加工の CSS カスタムプロパティ。 |

パッケージは ECMAScript モジュール（`"type": "module"`）として提供され、`dist/index.mjs`（ESM）と `dist/index.cjs`（CommonJS）の両ビルドを含みます。型宣言は `dist/index.d.ts` に出力されます。

```ts
// Vanilla JS main entry
import { MarkdownEditor, renderMarkdown } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';
```

```tsx
// React subpath
import { MarkdownEditorReact, type MarkdownEditorHandle } from '@powerduck/md-editor/react';
import '@powerduck/md-editor/dist/style.css';
```

## ピア依存関係

`react` と `react-dom` は**任意の**ピア依存関係（`>=17`）です。`./react` サブパスをインポートする場合にのみ必要です。

```bash
npm install react react-dom
```

フレームワークに依存しない `MarkdownEditor` クラスと独立した `renderMarkdown` 関数は React に依存しません。React をインストールせずに、任意のブラウザープロジェクトで利用できます。

## TypeScript 対応

パッケージに型宣言が含まれるため、追加の `@types/*` は不要です。メインエントリーは `MarkdownEditorOptions`、`EditorMode`、`EditorTheme`、`ToolbarConfig`、`RendererOptions` と全ヘルパー型を公開します。`./react` サブパスは `MarkdownEditorProps` と `MarkdownEditorHandle` を公開します。

```ts
import { MarkdownEditor, type MarkdownEditorOptions } from '@powerduck/md-editor';
import type { MarkdownEditorHandle } from '@powerduck/md-editor/react';
```

## CSS の副作用指定

`package.json` では `*.css` が副作用のあるファイルとして指定され、バンドラーの tree-shaking で削除されないようになっています。アプリのエントリーポイントで `dist/style.css` を 1 回インポートしてください。エディター UI、`github-markdown-css` によるプレビュー、KaTeX、全プラグインのスタイルが含まれます。

## 次のステップ

- [クイックスタート](/docs/ja-JP/md-editor/quickstart/) — 最初のエディターをマウントします。
- [設定](/docs/ja-JP/md-editor/configuration/) — `MarkdownEditorOptions` の全オプションを確認します。
