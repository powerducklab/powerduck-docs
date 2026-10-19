---
sidebar_position: 2
title: "Installation"
description: "Installez @powerduck/md-editor avec npm, yarn ou pnpm et découvrez les chemins d’import, les dépendances homologues et les types TypeScript."
---

# Installation

Installez `@powerduck/md-editor` avec le gestionnaire de paquets de votre choix.

```bash
npm install @powerduck/md-editor
```

```bash
yarn add @powerduck/md-editor
```

```bash
pnpm add @powerduck/md-editor
```

## Chemins d’import

Le paquet déclare explicitement ses sous-chemins d’export dans `package.json` :

| Chemin d’import | Contenu |
|---|---|
| `@powerduck/md-editor` | Entrée principale : la classe `MarkdownEditor` ainsi que tous les utilitaires, types et fonctions autonomes. |
| `@powerduck/md-editor/react` | Sous-chemin React : le composant `MarkdownEditorReact` et les types `MarkdownEditorProps` et `MarkdownEditorHandle`. |
| `@powerduck/md-editor/dist/style.css` | Feuille de style compilée de l’éditeur, à importer une seule fois. |
| `@powerduck/md-editor/styles/tokens.css` | Propriétés CSS personnalisées des jetons de design, non compilées. |

Le paquet est un module ECMAScript (`"type": "module"`) fourni en deux versions : `dist/index.mjs` (ESM) et `dist/index.cjs` (CommonJS). Les déclarations de types sont émises dans `dist/index.d.ts`.

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

## Dépendances homologues

`react` et `react-dom` sont des dépendances homologues **facultatives** (`>=17`). Elles ne sont nécessaires que si vous importez le sous-chemin `./react` :

```bash
npm install react react-dom
```

La classe `MarkdownEditor` sans framework et la fonction autonome `renderMarkdown` ne dépendent pas de React ; elles fonctionnent dans tout projet navigateur sans l’installer.

## Prise en charge de TypeScript

Le paquet inclut ses déclarations de types ; aucun paquet `@types/*` supplémentaire n’est nécessaire. L’entrée principale expose `MarkdownEditorOptions`, `EditorMode`, `EditorTheme`, `ToolbarConfig`, `RendererOptions` et tous les types utilitaires. Le sous-chemin `./react` expose `MarkdownEditorProps` et `MarkdownEditorHandle`.

```ts
import { MarkdownEditor, type MarkdownEditorOptions } from '@powerduck/md-editor';
import type { MarkdownEditorHandle } from '@powerduck/md-editor/react';
```

## Effets de bord CSS

Les fichiers `*.css` sont déclarés comme effets de bord dans `package.json`, afin que les outils de bundling ne les suppriment pas. Importez `dist/style.css` une seule fois dans le point d’entrée de l’application : il regroupe l’interface de l’éditeur, l’aperçu via `github-markdown-css`, les styles KaTeX et ceux de tous les plugins.

## Pour aller plus loin

- [Démarrage rapide](/docs/fr-FR/md-editor/quickstart/) — montez votre premier éditeur.
- [Configuration](/docs/fr-FR/md-editor/configuration/) — toutes les options de `MarkdownEditorOptions`.
