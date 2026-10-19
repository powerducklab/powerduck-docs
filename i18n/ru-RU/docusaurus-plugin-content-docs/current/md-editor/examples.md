---
sidebar_position: 7
title: "Примеры"
description: "Примеры ниже используют реальные экспорты и имена параметров"
---

# Примеры

Примеры ниже используют реальные экспорты и имена параметров. Перед запуском один раз импортируйте `@powerduck/md-editor/dist/style.css`. Создайте на странице указанные элементы-контейнеры, а для примеров загрузки предоставьте собственный эндпоинт.

## 1. Базовый редактор с распространёнными параметрами

`MarkdownEditor` на обычном JavaScript в режиме `complex` с настроенными распространёнными параметрами:

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

## 2. Компонент React с управляемым значением

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

`value` и `onChange` не запускают пересоздание, поэтому ввод текста не уничтожает экземпляр CodeMirror.

## 3. Собственная панель инструментов (массив и объект)

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

22 допустимых имени действий перечислены в разделе [Возможности](./features.md#toolbar-actions).

## 4. Интеграция загрузки изображений

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

Вставьте или перетащите файл изображения в редактор: обработчик вызовется автоматически. Полученный Markdown вставляется в позицию курсора.

## 5. Интеграция @mention

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

Ввод `@` открывает список. Выбор элемента вставляет текст `[@label](mention:id)`, который в предпросмотре отображается как оформленный значок.

## 6. Отдельное использование `renderMarkdown`

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

`renderMarkdown` возвращает строку и не монтирует редактор. Интеллект-карты выводятся как неактивные заполнители `<div>`; вызовите `Renderer.hydrate` самостоятельно, если нужны интерактивные диаграммы вне редактора.

## 7. Простой режим (без панели инструментов)

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

В режиме `simple` нет панели инструментов, строки состояния и номеров строк. Во время работы можно переключиться на `complex` через `editor.setMode('complex')`.

## Дальнейшие шаги

- [Справочник API](./api-reference.md) — сигнатуры всех методов.
- [Настройка](./configuration.md) — значения параметров по умолчанию.
