---
sidebar_position: 3
title: "クイックスタート"
description: "JavaScript で MarkdownEditor を配置する方法、React コンポーネントの使い方、renderMarkdown 単体での描画を説明します。"
---

# クイックスタート

`@powerduck/md-editor` は、素の JavaScript エディター、React コンポーネント、独立した Markdown レンダラーの 3 通りで利用できます。アプリごとにスタイルシートを 1 回インポートしてください。

## 素の JavaScript

コンストラクターは `new MarkdownEditor(container, options?)` です。第 1 引数には `HTMLElement` または CSS セレクター文字列を渡します。

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

コンテナーが見つからない場合、`MarkdownEditor: mount container not found` がスローされます。

## React

`./react` サブパスから `MarkdownEditorReact` をインポートします。`forwardRef` コンポーネントで、制御モード（`value`）と非制御モード（`defaultValue`）に対応し、`ref` で命令的な操作ハンドルを公開します。

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

構造に関わるオプション（`mode`、`math`、`mindmap`、`preview`、`autoPreview`、`renderDebounce`）を変更すると内部インスタンスが再生成されます。`value`、`onChange`、`theme` は軽量な同期のみで更新され、再生成されないため、大きなドキュメントでも操作性を保てます。

## 単体でのレンダリング

`renderMarkdown(source, options?)` を使うと、エディターを配置せずに、プレビューと同じプラグイン・スタイルで Markdown を HTML に変換できます。

```ts
import { renderMarkdown } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';

const html = renderMarkdown('# Hello\n\n$E=mc^2$', { math: true });
document.getElementById('output')!.innerHTML = html;
```

`renderMarkdown` は文字列を返します。マインドマップのプレースホルダーは、自動で対話的な SVG にはなりません。ハイドレーションは、エディターのプレビュー内で `Renderer.hydrate` によって行われます。

## 次のステップ

- [設定](/docs/ja-JP/md-editor/configuration/) — `MarkdownEditorOptions` の全フィールド。
- [機能](/docs/ja-JP/md-editor/features/) — 数式、マインドマップ、ツールバー、ショートカットの動作。
- [API リファレンス](/docs/ja-JP/md-editor/api-reference/) — 公開 API の全体。
- [使用例](/docs/ja-JP/md-editor/examples/) — コピーして使える完全な例。
