---
sidebar_position: 2
title: "安裝"
description: "透過 npm、yarn 或 pnpm 安裝 @powerduck/md-editor，了解匯入路徑、對等相依套件與 TypeScript 支援。"
---

# 安裝

使用慣用的套件管理工具安裝 `@powerduck/md-editor`。

```bash
npm install @powerduck/md-editor
```

```bash
yarn add @powerduck/md-editor
```

```bash
pnpm add @powerduck/md-editor
```

## 匯入路徑

套件在 `package.json` 中明確宣告了子路徑匯出：

| 匯入路徑 | 內容 |
|---|---|
| `@powerduck/md-editor` | 主要進入點：`MarkdownEditor` 類別，以及所有獨立輔助工具、型別與函式。 |
| `@powerduck/md-editor/react` | React 子路徑：`MarkdownEditorReact` 元件，以及 `MarkdownEditorProps` 和 `MarkdownEditorHandle` 型別。 |
| `@powerduck/md-editor/dist/style.css` | 編譯後的編輯器樣式表，必須匯入一次。 |
| `@powerduck/md-editor/styles/tokens.css` | 設計變數的原始 CSS 自訂屬性。 |

套件以 ECMAScript 模組（`"type": "module"`）發布，同時提供 `dist/index.mjs`（ESM）與 `dist/index.cjs`（CommonJS）兩種建置。型別宣告輸出至 `dist/index.d.ts`。

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

## 對等相依套件

`react` 與 `react-dom` 宣告為**選用**對等相依套件（`>=17`）。只有匯入 `./react` 子路徑時才需要安裝：

```bash
npm install react react-dom
```

原生 `MarkdownEditor` 類別與獨立的 `renderMarkdown` 函式不依賴 React，不必安裝 React 就能用於任何瀏覽器專案。

## TypeScript 支援

套件內含型別宣告，不必額外安裝 `@types/*`。主要進入點提供 `MarkdownEditorOptions`、`EditorMode`、`EditorTheme`、`ToolbarConfig`、`RendererOptions` 及所有輔助型別；`./react` 子路徑提供 `MarkdownEditorProps` 和 `MarkdownEditorHandle`。

```ts
import { MarkdownEditor, type MarkdownEditorOptions } from '@powerduck/md-editor';
import type { MarkdownEditorHandle } from '@powerduck/md-editor/react';
```

## CSS 副作用宣告

套件在 `package.json` 中將 `*.css` 標記為具有副作用，避免打包工具在 tree-shaking 時移除。請在應用程式進入點匯入一次 `dist/style.css`，其中包含編輯器介面、透過 `github-markdown-css` 提供的預覽樣式、KaTeX 樣式與所有外掛程式樣式。

## 後續步驟

- [快速入門](/docs/zh-TW/md-editor/quickstart/) — 掛載第一個編輯器。
- [設定](/docs/zh-TW/md-editor/configuration/) — 了解 `MarkdownEditorOptions` 的所有選項。
