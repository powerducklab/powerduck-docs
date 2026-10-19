---
sidebar_position: 2
title: "Instalação"
description: "Instale @powerduck/md-editor com npm, yarn ou pnpm e conheça os caminhos de importação, dependências pares e tipos TypeScript."
---

# Instalação

Instale `@powerduck/md-editor` com o gerenciador de pacotes de sua preferência.

```bash
npm install @powerduck/md-editor
```

```bash
yarn add @powerduck/md-editor
```

```bash
pnpm add @powerduck/md-editor
```

## Caminhos de importação

O pacote declara explicitamente suas exportações de subcaminhos em `package.json`:

| Caminho de importação | Conteúdo |
|---|---|
| `@powerduck/md-editor` | Entrada principal: a classe `MarkdownEditor` e todas as funções auxiliares, tipos e funções independentes. |
| `@powerduck/md-editor/react` | Subcaminho React: o componente `MarkdownEditorReact` e os tipos `MarkdownEditorProps` e `MarkdownEditorHandle`. |
| `@powerduck/md-editor/dist/style.css` | Folha de estilos compilada do editor; importe uma única vez. |
| `@powerduck/md-editor/styles/tokens.css` | Propriedades CSS personalizadas dos tokens de design, sem compilação. |

O pacote é um módulo ECMAScript (`"type": "module"`) com dois builds: `dist/index.mjs` (ESM) e `dist/index.cjs` (CommonJS). As declarações de tipos ficam em `dist/index.d.ts`.

```ts
// Vanilla JS main entry
import { MarkdownEditor, renderMarkdown } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';
```

```tsx
// React subpath
import { MarkdownEditorReact, type MarkdownEditorHandle } from '@powerduck/md-editor/react';
import '@powerduck/md-editor/dist/style.css';
```

## Dependências pares

`react` e `react-dom` são dependências pares **opcionais** (`>=17`). São necessárias apenas ao importar o subcaminho `./react`:

```bash
npm install react react-dom
```

A classe `MarkdownEditor` sem framework e a função independente `renderMarkdown` não dependem de React, podendo ser usadas em qualquer projeto de navegador sem instalá-lo.

## Suporte a TypeScript

O pacote inclui suas próprias declarações; não são necessários pacotes `@types/*`. A entrada principal exporta `MarkdownEditorOptions`, `EditorMode`, `EditorTheme`, `ToolbarConfig`, `RendererOptions` e todos os tipos auxiliares. O subcaminho `./react` exporta `MarkdownEditorProps` e `MarkdownEditorHandle`.

```ts
import { MarkdownEditor, type MarkdownEditorOptions } from '@powerduck/md-editor';
import type { MarkdownEditorHandle } from '@powerduck/md-editor/react';
```

## Efeitos colaterais de CSS

Os arquivos `*.css` são marcados como efeitos colaterais em `package.json`, para que os empacotadores não os removam por tree-shaking. Importe `dist/style.css` uma vez na entrada da aplicação: ele reúne a interface do editor, a prévia via `github-markdown-css`, os estilos do KaTeX e de todos os plugins.

## Próximos passos

- [Início rápido](/docs/pt-BR/md-editor/quickstart/) — monte seu primeiro editor.
- [Configuração](/docs/pt-BR/md-editor/configuration/) — todas as opções de `MarkdownEditorOptions`.
