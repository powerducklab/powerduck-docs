---
sidebar_position: 3
title: "Быстрый старт"
description: "Подключите MarkdownEditor в обычном JavaScript, используйте React-компонент или отдельно преобразуйте Markdown через renderMarkdown."
---

# Быстрый старт

`@powerduck/md-editor` можно использовать как редактор на обычном JavaScript, React-компонент или самостоятельный рендерер Markdown. Импортируйте стили один раз на приложение.

## Обычный JavaScript

Сигнатура конструктора: `new MarkdownEditor(container, options?)`. Первый аргумент — `HTMLElement` или строка CSS-селектора.

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

Если контейнер не найден, конструктор выбрасывает `MarkdownEditor: mount container not found`.

## React

Импортируйте `MarkdownEditorReact` из подпути `./react`. Компонент использует `forwardRef`, поддерживает управляемый (`value`) и неуправляемый (`defaultValue`) режимы и предоставляет императивный интерфейс через `ref`.

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

Изменение структурных параметров (`mode`, `math`, `mindmap`, `preview`, `autoPreview`, `renderDebounce`) пересоздаёт внутренний экземпляр. `value`, `onChange` и `theme` синхронизируются без пересоздания, сохраняя отзывчивость управляемого редактора на больших документах.

## Самостоятельный рендеринг

Используйте `renderMarkdown(source, options?)`, чтобы преобразовать Markdown в HTML без подключения редактора, с теми же плагинами и стилями, что и в предпросмотре.

```ts
import { renderMarkdown } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';

const html = renderMarkdown('# Hello\n\n$E=mc^2$', { math: true });
document.getElementById('output')!.innerHTML = html;
```

`renderMarkdown` возвращает строку. Заготовки интеллект-карт не превращаются автоматически в интерактивные SVG. Гидратация происходит только в предпросмотре работающего редактора через `Renderer.hydrate`.

## Следующие шаги

- [Настройка](/docs/ru-RU/md-editor/configuration/) — все поля `MarkdownEditorOptions`.
- [Возможности](/docs/ru-RU/md-editor/features/) — работа формул, интеллект-карт, панелей инструментов и сочетаний клавиш.
- [Справочник API](/docs/ru-RU/md-editor/api-reference/) — весь публичный API.
- [Примеры](/docs/ru-RU/md-editor/examples/) — полные примеры для копирования.
