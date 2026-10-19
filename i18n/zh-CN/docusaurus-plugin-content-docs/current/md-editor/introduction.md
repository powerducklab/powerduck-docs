---
sidebar_position: 1
title: "简介"
description: "@powerduck/md-editor 是面向浏览器的高性能可嵌入 Markdown 编辑器。它将 CodeMirror 6 编辑区与 markdown-it 渲染的实时预览结合，支持 KaTeX 公式、Markmap 思维导图、代码高亮、提示块、可配置工具栏、快捷键、图片上传钩子、@提及和文档链接插入。"
---

# 简介

`@powerduck/md-editor` 是面向浏览器的高性能可嵌入 Markdown 编辑器。它将 [CodeMirror 6](https://codemirror.net) 编辑区与 [markdown-it](https://github.com/markdown-it/markdown-it) 渲染的实时预览结合，支持 KaTeX 公式、Markmap 思维导图、代码高亮、提示块、可配置工具栏、快捷键、图片上传钩子、@提及和文档链接插入。

- **包名：** `@powerduck/md-editor` <img src="https://img.shields.io/npm/v/@powerduck/md-editor"/>
- **许可证：** MIT
- **模块格式：** ECMAScript 模块（`type: "module"`），同时提供 ESM（`dist/index.mjs`）和 CJS（`dist/index.cjs`）构建，以及类型声明（`dist/index.d.ts`）。

## 核心功能

以下功能均对应已实现的源码模块：

- **Markdown 编辑：** 基于 CodeMirror 6，支持 Markdown 语法高亮及明暗高亮主题。
- **KaTeX 公式：** 通过独立的 markdown-it 插件支持行内 `$...$` 和块级 `$$...$$` 公式，并通过启发式规则排除 `$5` 等金额。
- **Markmap 思维导图：** 渲染 ```` ```mindmap ```` 围栏代码块。markmap-lib 和 markmap-view 按需动态导入，不含思维导图的页面无需在初始加载时载入这些模块。
- **代码高亮：** 使用 highlight.js，配有 macOS 风格的三色圆点标题栏、语言标签和一键复制按钮。
- **提示块：** `:::notice`、`:::info`、`:::tip`、`:::success`、`:::warning` 和 `:::danger` 块带有图标及对应配色。
- **GitHub 风格预览：** 使用 `github-markdown-css`。
- **完整工具栏：** 提供 22 种操作，包含图片、视频、YouTube 和表格插入弹窗、公式与思维导图模板选择器，以及列出所有快捷键的帮助弹窗。
- **键盘快捷键：** `Mod` 在 Windows/Linux 上对应 Ctrl，在 macOS 上对应 Cmd。
- **可配置工具栏：** 支持通过数组指定显示项，或用逐项配置覆盖 `show`、`label` 和 `icon`。
- **图片上传钩子：** 向编辑器粘贴或拖放图片时触发 `onImageUpload`。
- **@提及下拉列表：** 通过 `mention` 选项配置，选中的提及在预览中显示为带样式的标签。
- **文档链接插入：** 通过 `docLink` 配置，支持普通链接或 `:::doc-link` 预览卡片。元数据由内置加载器或自定义钩子获取；跨域请求受浏览器 CORS 规则约束。
- **视频渲染：** 图片语法中的 URL 若以 `.mp4`、`.webm`、`.ogg` 等已知扩展名结尾，会渲染为 `<video controls>` 元素。
- **独立渲染器：** `renderMarkdown(source, options)` 无需挂载编辑器，即可使用与编辑器预览相同的插件和样式生成 HTML。
- **块级增量渲染：** 按 ATX 标题将源文档拆分为块，只重新渲染发生变化的块。未变更的块复用现有 DOM 节点，包括已完成初始化的思维导图 SVG；渲染结果按内容哈希缓存。
- **自适应防抖：** 预览渲染延迟随文档长度调整，基础值为 120 毫秒，上限为 600 毫秒。
- **两种编辑模式：** `simple` 仅提供编辑与预览，不含工具栏；`complex` 包含工具栏和状态栏，可在运行时切换。
- **两种主题：** `light` 和 `dark`，通过 `data-theme` 属性与 CSS 自定义属性应用。

## 架构概览

该库提供两种使用方式：

1. **原生 JavaScript 类：** 主要 API 围绕 `MarkdownEditor` 类展开，创建时传入容器元素。内部组合了 `CodeEditor`（CodeMirror 封装）、`Renderer`（markdown-it 封装）和预览用的 `IncrementalRenderer`；在 `complex` 模式下还包括 `Toolbar` 与 `StatusBar`。弹窗、@提及控制器和文档链接控制器是按需挂载的可插拔模块。

2. **React 子路径导出：** `MarkdownEditorReact` 是从 `./react` 子路径导出的 `forwardRef` 组件。它封装原生 `MarkdownEditor` 实例，支持受控和非受控的 `value` 用法，并通过 ref 暴露命令式的 `MarkdownEditorHandle`。React 入口独立提供，因此不使用 React 的项目无需安装 `react` 和 `react-dom`。

渲染分为同步的 markdown-it 阶段和异步初始化阶段。前者为思维导图生成占位 HTML，后者通过 `Renderer.hydrate` 将占位内容转为可交互的 SVG。`renderMarkdown` 返回同步 HTML；如需生成思维导图 SVG，应先调用 `Renderer.render`，将 HTML 插入 DOM 后再调用 `Renderer.hydrate`。增量渲染器直接操作预览容器。

## 浏览器支持

该库面向具有 DOM 的现代浏览器。CodeMirror 6、KaTeX 和 markmap-view 是包依赖，并非浏览器内置功能；交互式思维导图使用 `ResizeObserver`。可用时使用 Clipboard API；当 `navigator.clipboard` 不可用（例如非 HTTPS 环境）时，代码块复制回退到 `document.execCommand('copy')`。思维导图模块仅在全局未定义 `ResizeObserver` 时安装空实现，以避免导入时因缺少该 API 报错；空实现不会提供真实的尺寸变化通知。

## 许可证

`@powerduck/md-editor` 采用 **MIT** 许可证。

## 后续阅读

- [安装](./installation.md) — 安装包并了解导入路径。
- [快速开始](./quickstart.md) — 在原生 JavaScript 或 React 中挂载第一个编辑器。
- [配置](./configuration.md) — 查看 `MarkdownEditorOptions` 的全部选项。
- [功能](./features.md) — 深入了解各项内置功能。
- [API 参考](./api-reference.md) — 查看所有导出的类、函数和类型。
- [示例](./examples.md) — 完整、可运行的代码片段。
