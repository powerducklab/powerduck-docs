---
sidebar_position: 3
title: "Inicio rápido"
description: "Monta MarkdownEditor con JavaScript, usa el componente React o renderiza Markdown sin editor con renderMarkdown."
---

# Inicio rápido

Hay tres formas de usar `@powerduck/md-editor`: como editor JavaScript sin framework, como componente React o como renderizador Markdown independiente. Importa la hoja de estilos una sola vez por aplicación.

## JavaScript sin framework

La firma del constructor es `new MarkdownEditor(container, options?)`. El primer argumento puede ser un `HTMLElement` o una cadena con un selector CSS.

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

Si no se encuentra el contenedor, el constructor lanza `MarkdownEditor: mount container not found`.

## React

Importa `MarkdownEditorReact` desde la subruta `./react`. Es un componente `forwardRef` que admite uso controlado (`value`) y no controlado (`defaultValue`), además de un manejador imperativo mediante `ref`.

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

Los cambios en opciones estructurales (`mode`, `math`, `mindmap`, `preview`, `autoPreview`, `renderDebounce`) recrean la instancia subyacente. `value`, `onChange` y `theme` se sincronizan de forma ligera sin recrearla, manteniendo una respuesta ágil con documentos grandes.

## Renderizado independiente

Usa `renderMarkdown(source, options?)` para convertir Markdown en HTML con los mismos plugins y estilos de la vista previa, sin montar un editor.

```ts
import { renderMarkdown } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';

const html = renderMarkdown('# Hello\n\n$E=mc^2$', { math: true });
document.getElementById('output')!.innerHTML = html;
```

`renderMarkdown` devuelve una cadena. Los marcadores de mapas mentales que produce no se convierten automáticamente en diagramas SVG interactivos; la hidratación solo ocurre dentro de la vista previa del editor mediante `Renderer.hydrate`.

## Siguientes pasos

- [Configuración](/docs/es-ES/md-editor/configuration/) — cada campo de `MarkdownEditorOptions`.
- [Funciones](/docs/es-ES/md-editor/features/) — cómo funcionan las fórmulas, los mapas mentales, las barras de herramientas y los atajos.
- [Referencia de API](/docs/es-ES/md-editor/api-reference/) — toda la API pública.
- [Ejemplos](/docs/es-ES/md-editor/examples/) — ejemplos completos listos para copiar.
