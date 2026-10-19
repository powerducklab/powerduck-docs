---
sidebar_position: 2
title: "安装"
description: "通过 npm、yarn 或 pnpm 安装 @powerduck/md-editor，了解导入路径、对等依赖和 TypeScript 支持。"
---

# 安装

使用你常用的包管理器安装 `@powerduck/md-editor`。

```bash
npm install @powerduck/md-editor
```

```bash
yarn add @powerduck/md-editor
```

```bash
pnpm add @powerduck/md-editor
```

## 导入路径

包在 `package.json` 中显式声明了子路径导出：

| 导入路径 | 内容 |
|---|---|
| `@powerduck/md-editor` | 主入口：`MarkdownEditor` 类，以及全部独立辅助工具、类型和函数。 |
| `@powerduck/md-editor/react` | React 子路径：`MarkdownEditorReact` 组件，以及 `MarkdownEditorProps` 和 `MarkdownEditorHandle` 类型。 |
| `@powerduck/md-editor/dist/style.css` | 编译后的编辑器样式表，必须导入一次。 |
| `@powerduck/md-editor/styles/tokens.css` | 设计令牌的原始 CSS 自定义属性。 |

该包以 ECMAScript 模块（`"type": "module"`）发布，同时提供 `dist/index.mjs`（ESM）和 `dist/index.cjs`（CommonJS）两种构建。类型声明输出到 `dist/index.d.ts`。

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

## 对等依赖

`react` 和 `react-dom` 被声明为**可选**对等依赖（`>=17`）。只有导入 `./react` 子路径时才需要安装：

```bash
npm install react react-dom
```

原生 `MarkdownEditor` 类和独立的 `renderMarkdown` 函数不依赖 React，无须安装 React 即可用于任意浏览器项目。

## TypeScript 支持

包自带类型声明，无须额外安装 `@types/*`。主入口提供 `MarkdownEditorOptions`、`EditorMode`、`EditorTheme`、`ToolbarConfig`、`RendererOptions` 及全部辅助类型；`./react` 子路径提供 `MarkdownEditorProps` 和 `MarkdownEditorHandle`。

```ts
import { MarkdownEditor, type MarkdownEditorOptions } from '@powerduck/md-editor';
import type { MarkdownEditorHandle } from '@powerduck/md-editor/react';
```

## CSS 副作用声明

包在 `package.json` 中将 `*.css` 标为具有副作用，防止打包器在 tree-shaking 时移除。请在应用入口导入一次 `dist/style.css`；其中包含编辑器界面、基于 `github-markdown-css` 的预览样式、KaTeX 样式和所有插件样式。

## 下一步

- [快速开始](/docs/zh-CN/md-editor/quickstart/) — 挂载第一个编辑器。
- [配置](/docs/zh-CN/md-editor/configuration/) — 了解 `MarkdownEditorOptions` 的全部选项。
