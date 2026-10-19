---
sidebar_position: 3
title: "Guida rapida"
description: "Monta MarkdownEditor con JavaScript, usa il componente React oppure renderizza Markdown senza editor con renderMarkdown."
---

# Guida rapida

Puoi usare `@powerduck/md-editor` in tre modi: editor JavaScript senza framework, componente React o renderer Markdown autonomo. Importa il foglio di stile una sola volta per applicazione.

## JavaScript senza framework

La firma del costruttore è `new MarkdownEditor(container, options?)`. Il primo argomento può essere un `HTMLElement` o una stringa con un selettore CSS.

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

Se il contenitore non viene trovato, il costruttore genera `MarkdownEditor: mount container not found`.

## React

Importa `MarkdownEditorReact` dal sottopercorso `./react`. È un componente `forwardRef` che supporta l’uso controllato (`value`) e non controllato (`defaultValue`), oltre a un’interfaccia imperativa tramite `ref`.

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

Le modifiche alle opzioni strutturali (`mode`, `math`, `mindmap`, `preview`, `autoPreview`, `renderDebounce`) ricreano l’istanza sottostante. `value`, `onChange` e `theme` usano una sincronizzazione leggera senza ricrearla, mantenendo la reattività con documenti grandi.

## Rendering autonomo

Usa `renderMarkdown(source, options?)` per convertire Markdown in HTML con gli stessi plugin e stili dell’anteprima, senza montare un editor.

```ts
import { renderMarkdown } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';

const html = renderMarkdown('# Hello\n\n$E=mc^2$', { math: true });
document.getElementById('output')!.innerHTML = html;
```

`renderMarkdown` restituisce una stringa. I segnaposto delle mappe mentali non diventano automaticamente diagrammi SVG interattivi: l’idratazione avviene solo nell’anteprima dell’editor tramite `Renderer.hydrate`.

## Passaggi successivi

- [Configurazione](/docs/it-IT/md-editor/configuration/) — ogni campo di `MarkdownEditorOptions`.
- [Funzionalità](/docs/it-IT/md-editor/features/) — funzionamento di formule, mappe mentali, barre degli strumenti e scorciatoie.
- [Riferimento API](/docs/it-IT/md-editor/api-reference/) — l’intera API pubblica.
- [Esempi](/docs/it-IT/md-editor/examples/) — esempi completi pronti da copiare.
