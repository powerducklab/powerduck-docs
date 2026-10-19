---
sidebar_position: 7
title: "Exemples"
description: "Les exemples ci-dessous utilisent les exports et les noms d’options réels"
---

# Exemples

Les exemples ci-dessous utilisent les exports et les noms d’options réels. Importez `@powerduck/md-editor/dist/style.css` une seule fois avant leur exécution. Créez les conteneurs référencés dans votre page et fournissez votre propre endpoint pour les exemples d’envoi de fichiers.

## 1. Éditeur de base avec les options courantes

Un `MarkdownEditor` en JavaScript natif, en mode `complex`, avec les options courantes configurées :

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

## 2. Composant React avec valeur contrôlée

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

`value` et `onChange` ne déclenchent pas la recréation de l’instance : la saisie ne détruit donc pas l’instance CodeMirror.

## 3. Barre d’outils personnalisée (tableau et objet)

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

Les 22 noms d’actions valides sont répertoriés dans les [Fonctionnalités](./features.md#toolbar-actions).

## 4. Intégration de l’envoi d’images

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

Collez ou déposez un fichier image dans l’éditeur : le hook est appelé automatiquement. Le Markdown produit est inséré à la position du curseur.

## 5. Intégration de @mention

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

La saisie de `@` ouvre la liste déroulante. Sélectionner un élément insère le texte `[@label](mention:id)`, affiché sous forme de badge dans l’aperçu.

## 6. Utilisation autonome de `renderMarkdown`

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

`renderMarkdown` renvoie une chaîne sans monter d’éditeur. Les cartes mentales sont émises sous forme de `<div>` inertes ; appelez vous-même `Renderer.hydrate` pour obtenir des diagrammes interactifs hors de l’éditeur.

## 7. Mode simple (sans barre d’outils)

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

Le mode `simple` n’a ni barre d’outils, ni barre d’état, ni numéros de ligne. Vous pouvez néanmoins passer à `complex` à l’exécution avec `editor.setMode('complex')`.

## Pour aller plus loin

- [Référence API](./api-reference.md) — toutes les signatures des méthodes.
- [Configuration](./configuration.md) — valeurs par défaut des options.
