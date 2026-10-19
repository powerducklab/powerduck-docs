---
sidebar_position: 7
title: "Beispiele"
description: "Die folgenden Beispiele verwenden tatsächlich verfügbare Exporte und Optionsnamen"
---

# Beispiele

Die folgenden Beispiele verwenden tatsächlich verfügbare Exporte und Optionsnamen. Importieren Sie `@powerduck/md-editor/dist/style.css` vor der Ausführung einmalig. Erstellen Sie die referenzierten Containerelemente auf Ihrer Seite und stellen Sie für die Upload-Beispiele einen eigenen Upload-Endpunkt bereit.

## 1. Einfacher Editor mit gängigen Optionen

Ein `MarkdownEditor` in reinem JavaScript im Modus `complex` mit gängigen Optionen:

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

## 2. React-Komponente mit kontrolliertem Wert

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

`value` und `onChange` lösen keine Neuerstellung aus. Eingaben zerstören daher nicht die CodeMirror-Instanz.

## 3. Eigene Symbolleiste (Array- und Record-Form)

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

Die 22 gültigen Aktionsnamen finden Sie unter [Funktionen](./features.md#toolbar-actions).

## 4. Bild-Upload integrieren

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

Fügen Sie eine Bilddatei ein oder ziehen Sie sie in den Editor; der Hook wird automatisch aufgerufen. Das erzeugte Markdown wird an der Cursorposition eingefügt.

## 5. @mention integrieren

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

Die Eingabe von `@` öffnet die Auswahlliste. Die Auswahl eines Eintrags fügt `[@label](mention:id)` ein, das in der Vorschau als gestaltetes Badge erscheint.

## 6. `renderMarkdown` eigenständig verwenden

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

`renderMarkdown` gibt einen String zurück und bindet keinen Editor ein. Mindmaps werden zunächst als inaktive `<div>`-Platzhalter ausgegeben. Rufen Sie `Renderer.hydrate` selbst auf, wenn Sie interaktive Diagramme außerhalb des Editors benötigen.

## 7. Einfacher Modus (ohne Symbolleiste)

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

Im Modus `simple` gibt es keine Symbolleiste, Statusleiste oder Zeilennummern. Mit `editor.setMode('complex')` können Sie zur Laufzeit weiterhin zu `complex` wechseln.

## Nächste Schritte

- [API-Referenz](./api-reference.md) — sämtliche Methodensignaturen.
- [Konfiguration](./configuration.md) — Standardwerte der Optionen.
