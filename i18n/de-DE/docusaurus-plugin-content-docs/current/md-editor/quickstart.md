---
sidebar_position: 3
title: "Schnellstart"
description: "Binde MarkdownEditor mit JavaScript ein, nutze die React-Komponente oder rendere Markdown ohne Editor mit renderMarkdown."
---

# Schnellstart

`@powerduck/md-editor` lässt sich als frameworkunabhängiger JavaScript-Editor, React-Komponente oder eigenständiger Markdown-Renderer verwenden. Importiere das Stylesheet einmal pro Anwendung.

## JavaScript ohne Framework

Die Konstruktorsignatur lautet `new MarkdownEditor(container, options?)`. Das erste Argument ist ein `HTMLElement` oder ein CSS-Selektor als String.

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

Wird der Zielcontainer nicht gefunden, löst der Konstruktor `MarkdownEditor: mount container not found` aus.

## React

Importiere `MarkdownEditorReact` aus dem Unterpfad `./react`. Die `forwardRef`-Komponente unterstützt kontrollierte (`value`) und unkontrollierte (`defaultValue`) Nutzung sowie eine imperative Schnittstelle über `ref`.

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

Änderungen an strukturellen Optionen (`mode`, `math`, `mindmap`, `preview`, `autoPreview`, `renderDebounce`) erzeugen die zugrunde liegende Instanz neu. `value`, `onChange` und `theme` werden ohne Neuerstellung leichtgewichtig synchronisiert, damit auch große Dokumente reaktionsschnell bleiben.

## Eigenständiges Rendern

Mit `renderMarkdown(source, options?)` wandelst du Markdown ohne Editor in HTML um. Dabei kommen dieselben Plugins und Stile wie in der Editorvorschau zum Einsatz.

```ts
import { renderMarkdown } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';

const html = renderMarkdown('# Hello\n\n$E=mc^2$', { math: true });
document.getElementById('output')!.innerHTML = html;
```

`renderMarkdown` gibt einen String zurück. Mindmap-Platzhalter werden nicht automatisch zu interaktiven SVG-Diagrammen hydratisiert. Das geschieht nur in der laufenden Editorvorschau über `Renderer.hydrate`.

## Nächste Schritte

- [Konfiguration](/docs/de-DE/md-editor/configuration/) — alle Felder von `MarkdownEditorOptions`.
- [Funktionen](/docs/de-DE/md-editor/features/) — Funktionsweise von Formeln, Mindmaps, Werkzeugleisten und Tastenkürzeln.
- [API-Referenz](/docs/de-DE/md-editor/api-reference/) — die vollständige öffentliche API.
- [Beispiele](/docs/de-DE/md-editor/examples/) — vollständige Beispiele zum Kopieren.
