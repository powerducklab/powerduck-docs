---
sidebar_position: 2
title: "Installazione"
description: "Installa @powerduck/md-editor con npm, yarn o pnpm e scopri percorsi di importazione, dipendenze peer e tipi TypeScript."
---

# Installazione

Installa `@powerduck/md-editor` con il gestore di pacchetti che preferisci.

```bash
npm install @powerduck/md-editor
```

```bash
yarn add @powerduck/md-editor
```

```bash
pnpm add @powerduck/md-editor
```

## Percorsi di importazione

Il pacchetto definisce esplicitamente le esportazioni dei sottopercorsi in `package.json`:

| Percorso di importazione | Contenuto |
|---|---|
| `@powerduck/md-editor` | Voce principale: la classe `MarkdownEditor` e tutti gli helper, tipi e funzioni autonomi. |
| `@powerduck/md-editor/react` | Sottopercorso React: il componente `MarkdownEditorReact` e i tipi `MarkdownEditorProps` e `MarkdownEditorHandle`. |
| `@powerduck/md-editor/dist/style.css` | Foglio di stile compilato dell’editor, da importare una sola volta. |
| `@powerduck/md-editor/styles/tokens.css` | Proprietà CSS personalizzate dei token di design, non compilate. |

Il pacchetto è un modulo ECMAScript (`"type": "module"`) con due build: `dist/index.mjs` (ESM) e `dist/index.cjs` (CommonJS). Le dichiarazioni dei tipi sono in `dist/index.d.ts`.

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

## Dipendenze peer

`react` e `react-dom` sono dipendenze peer **opzionali** (`>=17`). Servono solo se importi il sottopercorso `./react`:

```bash
npm install react react-dom
```

La classe `MarkdownEditor` senza framework e la funzione autonoma `renderMarkdown` non dipendono da React e funzionano in qualsiasi progetto browser senza installarlo.

## Supporto TypeScript

Il pacchetto include le proprie dichiarazioni dei tipi; non servono pacchetti `@types/*` aggiuntivi. La voce principale espone `MarkdownEditorOptions`, `EditorMode`, `EditorTheme`, `ToolbarConfig`, `RendererOptions` e tutti i tipi ausiliari. Il sottopercorso `./react` espone `MarkdownEditorProps` e `MarkdownEditorHandle`.

```ts
import { MarkdownEditor, type MarkdownEditorOptions } from '@powerduck/md-editor';
import type { MarkdownEditorHandle } from '@powerduck/md-editor/react';
```

## Effetti collaterali CSS

I file `*.css` sono indicati come effetti collaterali in `package.json`, così i bundler non li eliminano con il tree-shaking. Importa `dist/style.css` una volta nel punto di ingresso dell’applicazione: include l’interfaccia dell’editor, l’anteprima tramite `github-markdown-css`, gli stili KaTeX e quelli di tutti i plugin.

## Passaggi successivi

- [Guida rapida](/docs/it-IT/md-editor/quickstart/) — monta il tuo primo editor.
- [Configurazione](/docs/it-IT/md-editor/configuration/) — tutte le opzioni di `MarkdownEditorOptions`.
