---
sidebar_position: 3
title: "Démarrage rapide"
description: "Montez MarkdownEditor en JavaScript, utilisez le composant React ou rendez du Markdown sans éditeur avec renderMarkdown."
---

# Démarrage rapide

Vous pouvez utiliser `@powerduck/md-editor` de trois façons : comme éditeur JavaScript sans framework, comme composant React ou comme moteur de rendu Markdown autonome. Importez la feuille de style une seule fois par application.

## JavaScript sans framework

Le constructeur a la signature `new MarkdownEditor(container, options?)`. Le premier argument est un `HTMLElement` ou une chaîne contenant un sélecteur CSS.

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

Si le conteneur est introuvable, le constructeur lève `MarkdownEditor: mount container not found`.

## React

Importez `MarkdownEditorReact` depuis le sous-chemin `./react`. Ce composant `forwardRef` prend en charge les modes contrôlé (`value`) et non contrôlé (`defaultValue`), avec une interface impérative accessible par `ref`.

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

Les options structurelles (`mode`, `math`, `mindmap`, `preview`, `autoPreview`, `renderDebounce`) recréent l’instance lorsqu’elles changent. `value`, `onChange` et `theme` utilisent une synchronisation légère sans recréation, pour conserver une bonne réactivité avec les documents volumineux.

## Rendu autonome

Utilisez `renderMarkdown(source, options?)` pour convertir du Markdown en HTML avec les mêmes plugins et styles que l’aperçu, sans monter d’éditeur.

```ts
import { renderMarkdown } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';

const html = renderMarkdown('# Hello\n\n$E=mc^2$', { math: true });
document.getElementById('output')!.innerHTML = html;
```

`renderMarkdown` renvoie une chaîne. Les espaces réservés aux cartes mentales ne deviennent pas automatiquement des SVG interactifs : leur hydratation se fait uniquement dans l’aperçu de l’éditeur via `Renderer.hydrate`.

## Pour aller plus loin

- [Configuration](/docs/fr-FR/md-editor/configuration/) — chaque champ de `MarkdownEditorOptions`.
- [Fonctionnalités](/docs/fr-FR/md-editor/features/) — fonctionnement des formules, cartes mentales, barres d’outils et raccourcis.
- [Référence de l’API](/docs/fr-FR/md-editor/api-reference/) — toute l’API publique.
- [Exemples](/docs/fr-FR/md-editor/examples/) — des exemples complets à copier-coller.
