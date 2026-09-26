---
sidebar_position: 3
title: "Quick start"
description: "Mount your first MarkdownEditor in vanilla JS, use the React component, or render markdown standalone with renderMarkdown."
keywords: ["quickstart", "vanilla", "react", "renderMarkdown", "first editor"]
---

# Quick start

This page shows the three ways to use `@powerduck/md-editor`: as a vanilla JS editor, as a React component, and as a standalone markdown renderer. Remember to import the stylesheet once per application.

## Vanilla JS

The constructor signature is `new MarkdownEditor(container, options?)`. The first argument is either an `HTMLElement` or a CSS selector string.

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

If the mount container cannot be found, the constructor throws `MarkdownEditor: mount container not found`.

## React

Import `MarkdownEditorReact` from the `./react` subpath. It is a `forwardRef` component that supports both controlled (`value`) and uncontrolled (`defaultValue`) usage, plus an imperative handle exposed through `ref`.

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

Structural options (`mode`, `math`, `mindmap`, `preview`, `autoPreview`, `renderDebounce`) recreate the underlying instance when they change. `value`, `onChange`, and `theme` use lightweight sync paths and never recreate the instance, so controlled usage stays responsive on large documents.

## Standalone rendering

Use `renderMarkdown(source, options?)` to turn markdown into HTML with the same plugins and styling as the editor preview, without mounting an editor.

```ts
import { renderMarkdown } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';

const html = renderMarkdown('# Hello\n\n$E=mc^2$', { math: true });
document.getElementById('output')!.innerHTML = html;
```

`renderMarkdown` returns a string. Note that mindmap placeholders produced by `renderMarkdown` are not automatically hydrated into interactive SVG diagrams; hydration only happens inside the live editor preview via `Renderer.hydrate`.

## What next

- [Configuration](./configuration.md) — every field on `MarkdownEditorOptions`.
- [Features](./features.md) — how math, mindmaps, toolbars, and shortcuts work.
- [API reference](./api-reference.md) — the full public surface.
- [Examples](./examples.md) — copy-pasteable, complete examples.
