---
sidebar_position: 7
title: "使用例"
description: "以下の例では、実際に公開されているエクスポートとオプション名を使っています"
---

# 使用例

以下の例では、実際に公開されているエクスポートとオプション名を使っています。実行前に `@powerduck/md-editor/dist/style.css` を一度インポートしてください。参照先のコンテナー要素をページに用意し、アップロードの例には独自のアップロードエンドポイントを実装してください。

## 1. よく使うオプションを設定した基本エディター

素の JS で `complex` モードの `MarkdownEditor` を作成し、よく使うオプションを設定します。

```ts
import { MarkdownEditor, type MarkdownEditorOptions } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';

const options: MarkdownEditorOptions = {
  value: '# Hello\n\nStart writing here...',
  mode: 'complex',
  theme: 'light',
  math: true,
  mindmap: true,
  codeHighlight: true,
  tips: true,
  preview: true,
  autoPreview: true,
  renderDebounce: false, // render synchronously for this demo
  onChange: (value) => console.log('changed:', value.length, 'chars'),
  onImageUpload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.url as string;
  },
  toolbar: ['heading', 'bold', 'italic', 'link', 'image', 'code'],
};

const editor = new MarkdownEditor('#editor', options);
// Call editor.destroy() when removing this editor from the page.

document.querySelector('#save')?.addEventListener('click', () => {
  console.log(editor.getValue());
});
```

## 2. 値を制御する React コンポーネント

```tsx
import { useRef, useState } from 'react';
import { MarkdownEditorReact, type MarkdownEditorHandle } from '@powerduck/md-editor/react';
import '@powerduck/md-editor/dist/style.css';

function NoteEditor() {
  const [value, setValue] = useState('# Draft\n\nWrite something...');
  const handleRef = useRef<MarkdownEditorHandle>(null);

  return (
    <div>
      <button onClick={() => handleRef.current?.getHtml()}>Render HTML</button>
      <MarkdownEditorReact
        ref={handleRef}
        value={value}
        onChange={setValue}
        mode="complex"
        theme="light"
      />
    </div>
  );
}

export default NoteEditor;
```

`value` と `onChange` はインスタンス再作成の対象外なので、入力のたびに CodeMirror インスタンスが破棄されることはありません。

## 3. ツールバーのカスタマイズ（配列形式とレコード形式）

```ts
import { MarkdownEditor } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';

// Array form: an include-list. Actions retain the built-in toolbar order.
new MarkdownEditor('#editor-array', {
  mode: 'complex',
  toolbar: ['bold', 'italic', 'link', 'code', 'math'],
});

// Record form: per-item overrides. Everything not listed stays visible.
new MarkdownEditor('#editor-record', {
  mode: 'complex',
  toolbar: {
    bold: { label: 'Make bold' },
    image: { show: false },
    youtube: { show: false },
    theme: { icon: '<svg>...</svg>' },
  },
});
```

有効なアクション名は[機能](./features.md#toolbar-actions)に記載された 22 種類です。

## 4. 画像アップロードの組み込み

```ts
import { MarkdownEditor } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';

const editor = new MarkdownEditor('#editor', {
  mode: 'complex',
  onImageUpload: async (file: File): Promise<string> => {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: form });
    if (!res.ok) throw new Error('Upload failed');
    const { url } = await res.json();
    return url; // inserted as ![filename](url)
  },
});
```

画像ファイルをエディターに貼り付けるかドロップすると、フックが自動的に呼び出されます。生成された Markdown はカーソル位置に挿入されます。

## 5. @mention の組み込み

```ts
import { MarkdownEditor, type MentionItem } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';

const USERS: MentionItem[] = [
  { id: '1', label: 'Alice', avatar: 'https://example.com/a.png', description: 'alice@example.com' },
  { id: '2', label: 'Bob', description: 'bob@example.com' },
];

new MarkdownEditor('#editor', {
  mode: 'complex',
  mention: {
    onMentionSearch: async (query) =>
      USERS.filter((u) => u.label.toLowerCase().includes(query.toLowerCase())),
    onMentionSelect: (item) => `[@${item.label}](mention:${item.id})`,
    minChars: 0,
    maxItems: 8,
  },
});
```

`@` を入力するとドロップダウンが開きます。項目を選択すると `[@label](mention:id)` が挿入され、プレビューでは装飾されたバッジになります。

## 6. `renderMarkdown` の単独使用

```ts
import { renderMarkdown } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';

const source = [
  '# Hello',
  '',
  'Inline: $E=mc^2$.',
  '',
  '```ts',
  'const x: number = 1;',
  '```',
  '',
  ':::tip',
  'Callout block.',
  ':::',
].join('\n');

const html = renderMarkdown(source, { math: true, tips: true });
document.getElementById('output')!.innerHTML = html;
```

`renderMarkdown` は文字列を返し、エディターをマウントしません。マインドマップは未有効化の `<div>` プレースホルダーとして出力されます。エディター外で対話型の図を使う場合は、自分で `Renderer.hydrate` を呼び出してください。

## 7. シンプルモード（ツールバーなし）

```ts
import { MarkdownEditor } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';

const editor = new MarkdownEditor('#editor', {
  value: '# Minimal editor\n\nNo toolbar, no status bar.',
  mode: 'simple',   // default; pure edit + preview
  theme: 'dark',
  preview: true,
});
```

`simple` モードにはツールバー、ステータスバー、行番号がありません。実行時に `editor.setMode('complex')` を使って `complex` に切り替えることはできます。

## 次のステップ

- [API リファレンス](./api-reference.md) — すべてのメソッドシグネチャ。
- [設定](./configuration.md) — オプションの既定値。
