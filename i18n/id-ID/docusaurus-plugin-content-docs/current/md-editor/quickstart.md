---
sidebar_position: 3
title: "Mulai cepat"
description: "Pasang MarkdownEditor dengan JavaScript biasa, gunakan komponen React, atau render Markdown secara mandiri dengan renderMarkdown."
---

# Mulai cepat

`@powerduck/md-editor` dapat digunakan sebagai editor JavaScript biasa, komponen React, atau perender Markdown mandiri. Impor lembar gaya sekali untuk setiap aplikasi.

## JavaScript biasa

Tanda tangan konstruktornya adalah `new MarkdownEditor(container, options?)`. Argumen pertama berupa `HTMLElement` atau string selektor CSS.

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

Jika kontainer pemasangan tidak ditemukan, konstruktor melempar kesalahan `MarkdownEditor: mount container not found`.

## React

Impor `MarkdownEditorReact` dari subjalur `./react`. Komponen `forwardRef` ini mendukung penggunaan terkontrol (`value`) maupun tidak terkontrol (`defaultValue`), serta menyediakan antarmuka imperatif melalui `ref`.

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

Perubahan opsi struktural (`mode`, `math`, `mindmap`, `preview`, `autoPreview`, `renderDebounce`) membuat ulang instans internal. `value`, `onChange`, dan `theme` diperbarui melalui sinkronisasi ringan tanpa membuat ulang instans, sehingga editor terkontrol tetap responsif pada dokumen besar.

## Rendering mandiri

Gunakan `renderMarkdown(source, options?)` untuk mengubah Markdown menjadi HTML tanpa memasang editor, dengan plugin dan gaya yang sama seperti pratinjau editor.

```ts
import { renderMarkdown } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';

const html = renderMarkdown('# Hello\n\n$E=mc^2$', { math: true });
document.getElementById('output')!.innerHTML = html;
```

`renderMarkdown` mengembalikan string. Placeholder peta pikiran tidak otomatis menjadi diagram SVG interaktif. Hidrasi hanya dilakukan di dalam pratinjau editor aktif melalui `Renderer.hydrate`.

## Langkah berikutnya

- [Konfigurasi](/docs/id-ID/md-editor/configuration/) — Semua bidang `MarkdownEditorOptions`.
- [Fitur](/docs/id-ID/md-editor/features/) — Cara kerja rumus, peta pikiran, bilah alat, dan pintasan keyboard.
- [Referensi API](/docs/id-ID/md-editor/api-reference/) — Seluruh API publik.
- [Contoh](/docs/id-ID/md-editor/examples/) — Contoh lengkap yang siap disalin.
