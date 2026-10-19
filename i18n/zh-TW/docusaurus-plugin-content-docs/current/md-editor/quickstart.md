---
sidebar_position: 3
title: "快速入門"
description: "在原生 JavaScript 掛載 MarkdownEditor、使用 React 元件，或透過 renderMarkdown 獨立轉譯 Markdown。"
---

# 快速入門

`@powerduck/md-editor` 有三種用法：原生 JavaScript 編輯器、React 元件與獨立 Markdown 轉譯器。每個應用程式只需匯入一次樣式表。

## 原生 JavaScript

建構函式簽章為 `new MarkdownEditor(container, options?)`。第一個參數可以是 `HTMLElement`，或是 CSS 選取器字串。

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

找不到掛載容器時，建構函式會擲回 `MarkdownEditor: mount container not found`。

## React

從 `./react` 子路徑匯入 `MarkdownEditorReact`。這是 `forwardRef` 元件，支援受控（`value`）與非受控（`defaultValue`）用法，並透過 `ref` 提供命令式操作介面。

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

結構選項（`mode`、`math`、`mindmap`、`preview`、`autoPreview`、`renderDebounce`）變更時會重建底層執行個體。`value`、`onChange` 與 `theme` 使用輕量同步，不會重建執行個體，讓大型文件的受控編輯保持順暢。

## 獨立轉譯

使用 `renderMarkdown(source, options?)`，即可在不掛載編輯器的情況下將 Markdown 轉為 HTML，並使用與編輯器預覽相同的外掛程式和樣式。

```ts
import { renderMarkdown } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';

const html = renderMarkdown('# Hello\n\n$E=mc^2$', { math: true });
document.getElementById('output')!.innerHTML = html;
```

`renderMarkdown` 傳回字串。產生的心智圖預留位置不會自動成為互動式 SVG；只有編輯器預覽內部會透過 `Renderer.hydrate` 完成互動初始化。

## 後續步驟

- [設定](/docs/zh-TW/md-editor/configuration/) — `MarkdownEditorOptions` 的所有欄位。
- [功能](/docs/zh-TW/md-editor/features/) — 公式、心智圖、工具列與快速鍵的運作方式。
- [API 參考](/docs/zh-TW/md-editor/api-reference/) — 完整的公開 API。
- [範例](/docs/zh-TW/md-editor/examples/) — 可直接複製的完整範例。
