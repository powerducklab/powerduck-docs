---
sidebar_position: 2
title: "Installation"
description: "Install @powerduck/md-editor via npm, yarn, or pnpm; know the import paths, peer dependencies, and TypeScript support."
keywords: ["installation", "npm", "yarn", "pnpm", "import", "typescript"]
---

# Installation

Install `@powerduck/md-editor` from your package manager of choice.

```bash
npm install @powerduck/md-editor
```

```bash
yarn add @powerduck/md-editor
```

```bash
pnpm add @powerduck/md-editor
```

## Import paths

The package defines explicit subpath exports in its `package.json`:

| Import path | What it resolves |
|-------------|-------------------|
| `@powerduck/md-editor` | Main entry: `MarkdownEditor` class and all standalone helpers, types, and functions. |
| `@powerduck/md-editor/react` | React subpath: `MarkdownEditorReact` component plus `MarkdownEditorProps` and `MarkdownEditorHandle` types. |
| `@powerduck/md-editor/dist/style.css` | Compiled editor stylesheet (must be imported once). |
| `@powerduck/md-editor/styles/tokens.css` | Raw design-token CSS custom properties. |

The package is shipped as an ECMAScript module (`"type": "module"`) with dual builds: `dist/index.mjs` (ESM) and `dist/index.cjs` (CommonJS). Type declarations are emitted to `dist/index.d.ts`.

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

## Peer dependencies

`react` and `react-dom` are declared as **optional** peer dependencies (`>=17`). You only need them if you import the `./react` subpath:

```bash
npm install react react-dom
```

The vanilla `MarkdownEditor` class and the standalone `renderMarkdown` function have no React dependency, so they work in any browser project without installing React.

## TypeScript support

The package ships its own type declarations. No additional `@types/*` packages are required. The main entry exposes `MarkdownEditorOptions`, `EditorMode`, `EditorTheme`, `ToolbarConfig`, `RendererOptions`, and all helper types; the `./react` subpath exposes `MarkdownEditorProps` and `MarkdownEditorHandle`.

```ts
import { MarkdownEditor, type MarkdownEditorOptions } from '@powerduck/md-editor';
import type { MarkdownEditorHandle } from '@powerduck/md-editor/react';
```

## CSS side effects

The package marks `*.css` files as side effects in `package.json`, so bundlers do not tree-shake them. Import `dist/style.css` once in your application entry point; it bundles the editor chrome, preview styling (via `github-markdown-css`), KaTeX styling, and all plugin styles.

## Next steps

- [Quick start](./quickstart) — mount your first editor.
- [Configuration](./configuration) — every option on `MarkdownEditorOptions`.
