---
sidebar_position: 3
title: "快速开始"
description: "在原生 JavaScript 中挂载 MarkdownEditor，使用 React 组件，或通过 renderMarkdown 独立渲染 Markdown。"
---

# 快速开始

`@powerduck/md-editor` 有三种用法：原生 JavaScript 编辑器、React 组件和独立 Markdown 渲染器。每个应用只需导入一次样式表。

## 原生 JavaScript

构造函数签名为 `new MarkdownEditor(container, options?)`。第一个参数可以是 `HTMLElement`，也可以是 CSS 选择器字符串。

```ts
import { MarkdownEditor } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';

const editor = new MarkdownEditor('#editor', {
  value: '# Hello\n\nStart typing...',
  mode: 'complex', // 'simple' (default) | 'complex'
  theme: 'light',  // 'light' (default) | 'dark'
  math: true,
  mindmap: true,
  onChange: (value) => console.log(value),
});

// Read and write content
const markdown = editor.getValue();
editor.setValue('# Updated content');
```

找不到挂载容器时，构造函数会抛出 `MarkdownEditor: mount container not found`。

## React

从 `./react` 子路径导入 `MarkdownEditorReact`。这是一个 `forwardRef` 组件，支持受控（`value`）和非受控（`defaultValue`）用法，并通过 `ref` 提供命令式操作句柄。

```tsx
import { useRef, useState } from 'react';
import { MarkdownEditorReact, type MarkdownEditorHandle } from '@powerduck/md-editor/react';
import '@powerduck/md-editor/dist/style.css';

function App() {
  const [value, setValue] = useState('# Hello');
  const editorRef = useRef<MarkdownEditorHandle>(null);

  return (
    <MarkdownEditorReact
      ref={editorRef}
      value={value}
      onChange={setValue}
      mode="complex"
      theme="light"
    />
  );
}
```

结构选项（`mode`、`math`、`mindmap`、`preview`、`autoPreview`、`renderDebounce`）变化时会重建底层实例。`value`、`onChange` 和 `theme` 通过轻量同步更新，不会重建实例，使大文档的受控编辑保持响应流畅。

## 独立渲染

使用 `renderMarkdown(source, options?)` 可在不挂载编辑器的情况下，将 Markdown 转为 HTML，并使用与编辑器预览一致的插件和样式。

```ts
import { renderMarkdown } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';

const html = renderMarkdown('# Hello\n\n$E=mc^2$', { math: true });
document.getElementById('output')!.innerHTML = html;
```

`renderMarkdown` 返回字符串。生成的思维导图占位符不会自动变成交互式 SVG；只有编辑器预览内部会通过 `Renderer.hydrate` 完成激活。

## 下一步

- [配置](/docs/zh-CN/md-editor/configuration/) — `MarkdownEditorOptions` 的全部字段。
- [功能](/docs/zh-CN/md-editor/features/) — 公式、思维导图、工具栏和快捷键的工作方式。
- [API 参考](/docs/zh-CN/md-editor/api-reference/) — 完整的公开 API。
- [示例](/docs/zh-CN/md-editor/examples/) — 可直接复制的完整示例。
