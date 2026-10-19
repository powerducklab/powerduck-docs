---
sidebar_position: 7
title: "Örnekler"
description: "Aşağıdaki örnekler gerçek dışa aktarımları ve seçenek adlarını kullanır"
---

# Örnekler

Aşağıdaki örnekler gerçek dışa aktarımları ve seçenek adlarını kullanır. Çalıştırmadan önce `@powerduck/md-editor/dist/style.css` dosyasını bir kez içe aktarın. Sayfanızda başvurulan kapsayıcı öğeleri oluşturun ve yükleme örnekleri için kendi yükleme uç noktanızı sağlayın.

## 1. Yaygın seçeneklerle temel düzenleyici

Yaygın seçenekleri yapılandırılmış, saf JavaScript ile oluşturulan `complex` modunda bir `MarkdownEditor`:

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

## 2. Kontrollü değer kullanan React bileşeni

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

`value` ve `onChange` yeniden oluşturmayı tetiklemez; dolayısıyla yazı yazmak CodeMirror örneğini yok etmez.

## 3. Özel araç çubuğu (dizi ve kayıt biçimleri)

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

Geçerli 22 eylem adı [Özellikler](./features.md#toolbar-actions) bölümünde listelenmiştir.

## 4. Görsel yükleme entegrasyonu

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

Bir görsel dosyasını düzenleyiciye yapıştırın veya sürükleyin; kanca otomatik çağrılır. Oluşan Markdown imleç konumuna eklenir.

## 5. @mention entegrasyonu

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

`@` yazmak açılır listeyi açar. Bir öğe seçildiğinde `[@label](mention:id)` metni eklenir ve önizlemede biçimlendirilmiş rozet olarak gösterilir.

## 6. `renderMarkdown` işlevini bağımsız kullanma

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

`renderMarkdown` bir dize döndürür ve düzenleyici bağlamaz. Zihin haritaları etkin olmayan `<div>` yer tutucuları olarak üretilir; düzenleyici dışında etkileşimli diyagramlar gerekiyorsa `Renderer.hydrate` işlevini kendiniz çağırın.

## 7. Basit mod (araç çubuğu yok)

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

`simple` modunda araç çubuğu, durum çubuğu ve satır numaraları bulunmaz. Çalışma sırasında `editor.setMode('complex')` ile yine de `complex` moduna geçebilirsiniz.

## Sonraki adımlar

- [API başvurusu](./api-reference.md) — tüm yöntem imzaları.
- [Yapılandırma](./configuration.md) — seçeneklerin varsayılan değerleri.
