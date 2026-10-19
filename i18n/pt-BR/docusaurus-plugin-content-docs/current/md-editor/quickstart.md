---
sidebar_position: 3
title: "Início rápido"
description: "Monte MarkdownEditor em JavaScript, use o componente React ou renderize Markdown sem editor com renderMarkdown."
---

# Início rápido

Há três formas de usar `@powerduck/md-editor`: editor JavaScript sem framework, componente React ou renderizador Markdown independente. Importe a folha de estilos uma vez por aplicação.

## JavaScript sem framework

A assinatura do construtor é `new MarkdownEditor(container, options?)`. O primeiro argumento pode ser um `HTMLElement` ou uma string com seletor CSS.

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

Se o contêiner não for encontrado, o construtor lança `MarkdownEditor: mount container not found`.

## React

Importe `MarkdownEditorReact` pelo subcaminho `./react`. É um componente `forwardRef` que aceita uso controlado (`value`) e não controlado (`defaultValue`), além de uma interface imperativa por `ref`.

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

Mudanças nas opções estruturais (`mode`, `math`, `mindmap`, `preview`, `autoPreview`, `renderDebounce`) recriam a instância interna. `value`, `onChange` e `theme` usam sincronização leve sem recriá-la, mantendo a resposta ágil em documentos grandes.

## Renderização independente

Use `renderMarkdown(source, options?)` para converter Markdown em HTML com os mesmos plugins e estilos da prévia, sem montar um editor.

```ts
import { renderMarkdown } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';

const html = renderMarkdown('# Hello\n\n$E=mc^2$', { math: true });
document.getElementById('output')!.innerHTML = html;
```

`renderMarkdown` retorna uma string. Os marcadores de mapas mentais não são convertidos automaticamente em diagramas SVG interativos: a hidratação só ocorre na prévia do editor por `Renderer.hydrate`.

## Próximos passos

- [Configuração](/docs/pt-BR/md-editor/configuration/) — todos os campos de `MarkdownEditorOptions`.
- [Recursos](/docs/pt-BR/md-editor/features/) — como funcionam fórmulas, mapas mentais, barras de ferramentas e atalhos.
- [Referência da API](/docs/pt-BR/md-editor/api-reference/) — toda a API pública.
- [Exemplos](/docs/pt-BR/md-editor/examples/) — exemplos completos para copiar e colar.
