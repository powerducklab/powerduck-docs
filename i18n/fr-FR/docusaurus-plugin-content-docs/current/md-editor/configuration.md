---
sidebar_position: 4
title: "Configuration"
description: "Le constructeur MarkdownEditor reçoit un élément conteneur ou un sélecteur, puis un objet MarkdownEditorOptions. Cette page décrit le type, la valeur par défaut et le comportement de chaque champ, ainsi que les types d’options associés."
---

# Configuration

Le constructeur `MarkdownEditor` reçoit un élément conteneur ou un sélecteur, puis un objet `MarkdownEditorOptions`. Cette page décrit le type, la valeur par défaut et le comportement de chaque champ, ainsi que les types d’options associés.

## `MarkdownEditorOptions`

```ts
interface MarkdownEditorOptions {
  value?: string;
  mode?: EditorMode;
  theme?: EditorTheme;
  math?: boolean;
  mindmap?: boolean;
  codeHighlight?: boolean;
  tips?: boolean;
  preview?: boolean;
  onChange?: (value: string) => void;
  toolbar?: ToolbarConfig;
  onImageUpload?: (file: File) => Promise<string>;
  mention?: MentionOptions;
  docLink?: DocLinkOptions;
  renderDebounce?: number | false;
  autoPreview?: boolean;
}
```

| Option | Type | Valeur par défaut | Description |
|--------|------|---------|-------------|
| `value` | `string` | `''` | Contenu Markdown initial. |
| `mode` | `EditorMode` | `'simple'` | `'simple'` affiche l’éditeur et l’aperçu sans barre d’outils ni barre d’état. `'complex'` ajoute ces deux barres. |
| `theme` | `EditorTheme` | `'light'` | Thème appliqué avec l’attribut `data-theme` : `'light'` ou `'dark'`. |
| `math` | `boolean` | `true` | Activer les formules KaTeX : `$...$` en ligne et `$$...$$` en bloc. |
| `mindmap` | `boolean` | `true` | Activer les cartes mentales Markmap issues des blocs délimités ```` ```mindmap ````. |
| `codeHighlight` | `boolean` | `true` | Activer les blocs de code highlight.js avec l’en-tête à trois pastilles et le bouton de copie. |
| `tips` | `boolean` | `true` | Activer les encadrés d’information (`:::notice`, `:::warning`, etc.). |
| `preview` | `boolean` | `true` | Afficher le volet d’aperçu. Avec `false`, seul le volet d’édition est créé. |
| `onChange` | `(value: string) => void` | — | Fonction appelée à chaque modification avec le texte intégral du document. |
| `toolbar` | `ToolbarConfig` | toutes les actions | Choisir les actions visibles et remplacer leurs libellés ou icônes. |
| `onImageUpload` | `(file: File) => Promise<string>` | — | Fonction appelée lorsqu’un fichier image est collé ou déposé dans l’éditeur. La promesse doit fournir l’URL de l’image, insérée sous la forme `![alt](url)`. Le dialogue d’image accepte une URL et ne propose pas de sélecteur de fichier. |
| `mention` | `MentionOptions` | — | Configuration de la liste des @mentions. Si elle est omise, saisir `@` n’ouvre aucune liste. |
| `docLink` | `DocLinkOptions` | — | Configuration de l’insertion de liens documentaires. Si elle est omise, saisir le caractère déclencheur n’ouvre aucune liste. |
| `renderDebounce` | `number \| false` | adaptative | Délai de temporisation de l’aperçu en millisecondes. `false` déclenche un rendu synchrone à chaque modification ; un nombre fixe le délai. En l’absence de valeur, `adaptiveDebounceMs(value.length)` est utilisé, de 120 ms à 600 ms. |
| `autoPreview` | `boolean` | `true` | Avec `true`, l’aperçu est recalculé après les modifications, avec temporisation. Avec `false`, appelez `renderNow()` ou utilisez le bouton d’actualisation de la barre d’état. |

## `EditorMode` et `EditorTheme`

```ts
type EditorMode = 'simple' | 'complex';
type EditorTheme = 'light' | 'dark';
```

- `'simple'` (par défaut) : ni barre d’outils, ni barre d’état, ni numéros de ligne.
- `'complex'` : barre d’outils, barre d’état et numéros de ligne activés.
- `'light'` (par défaut) et `'dark'` contrôlent la palette de coloration syntaxique et les propriétés CSS personnalisées.

Ces deux réglages peuvent être modifiés à l’exécution avec `setMode(mode)` et `setTheme(theme)`.

## `ToolbarConfig`

`ToolbarConfig` est soit un **tableau de noms d’actions** à inclure, soit un **objet associant les noms d’actions à leurs réglages** :

```ts
type ToolbarConfig = string[] | Record<string, ToolbarItemOverride>;
```

### Tableau des actions à inclure

Seules les actions indiquées sont visibles. Elles gardent l’ordre intégré de la barre d’outils : le tableau filtre la visibilité, sans modifier l’ordre.

```ts
new MarkdownEditor('#editor', {
  mode: 'complex',
  toolbar: ['heading', 'bold', 'italic', 'link', 'code'],
});
```

### Objet de réglages par action

Toutes les actions sont visibles par défaut. L’objet permet de masquer des éléments ou de remplacer leurs libellés et icônes :

```ts
new MarkdownEditor('#editor', {
  mode: 'complex',
  toolbar: {
    bold: { label: 'Make bold', icon: '<b>B</b>' },
    image: { show: false },
    youtube: { show: false },
  },
});
```

### `ToolbarItemOverride`

```ts
interface ToolbarItemOverride {
  show?: boolean;  // Show this item. Default: true.
  label?: string;  // Custom tooltip / aria-label.
  icon?: string;   // Custom icon as an HTML string.
}
```

La liste complète des noms d’actions valides figure dans [Fonctionnalités](./features.md#toolbar-actions).

## `MentionOptions`

```ts
interface MentionOptions {
  onMentionSearch?: (query: string) => MentionItem[] | Promise<MentionItem[]>;
  onMentionSelect?: (item: MentionItem) => string;
  minChars?: number;
  maxItems?: number;
}
```

| Champ | Type | Valeur par défaut | Description |
|-------|------|---------|-------------|
| `onMentionSearch` | `(query: string) => MentionItem[] \| Promise<MentionItem[]>` | — | Fonction de recherche appelée avec le texte saisi après `@`. Nécessaire pour activer la liste déroulante. |
| `onMentionSelect` | `(item: MentionItem) => string` | `` (item) => `[@${item.label}](mention:${item.id})` `` | Renvoie le texte à insérer au curseur pour remplacer `@query`. Utilisez la forme `[@label](mention:id)` pour afficher une étiquette dans l’aperçu. |
| `minChars` | `number` | `0` | Longueur minimale de la recherche avant l’affichage de la liste. |
| `maxItems` | `number` | `8` | Nombre maximal d’éléments affichés dans la liste. |

`MentionItem` est décrit dans la [référence API](./api-reference.md).

## `DocLinkOptions`

```ts
interface DocLinkOptions {
  onDocSearch?: (query: string) => DocItem[] | Promise<DocItem[]>;
  onFetchDocMeta?: (url: string) => Promise<DocMeta>;
  insertStyle?: 'card' | 'link' | 'auto';
  triggerChar?: string;
  minChars?: number;
  maxItems?: number;
}
```

| Champ | Type | Valeur par défaut | Description |
|-------|------|---------|-------------|
| `onDocSearch` | `(query: string) => DocItem[] \| Promise<DocItem[]>` | — | Fonction de recherche appelée après le caractère déclencheur. Nécessaire pour activer la liste déroulante. |
| `onFetchDocMeta` | `(url: string) => Promise<DocMeta>` | fetch + DOMParser intégrés | Remplacez cette fonction pour récupérer les métadonnées via un proxy côté serveur et éviter les restrictions CORS du navigateur. |
| `insertStyle` | `'card' \| 'link' \| 'auto'` | `'auto'` | `'card'` insère une carte `:::doc-link`, ou un lien si les métadonnées manquent ; `'link'` insère toujours un lien Markdown simple ; `'auto'` insère une carte si des métadonnées sont disponibles. |
| `triggerChar` | `string` | `'/'` | Caractère qui ouvre la liste de recherche de documents. |
| `minChars` | `number` | `0` | Longueur minimale de la requête avant la recherche. |
| `maxItems` | `number` | `8` | Nombre maximal d’éléments affichés dans la liste. |

## `RendererOptions`

Utilisé par le constructeur `Renderer` et par `renderMarkdown(source, options)`.

```ts
interface RendererOptions {
  math?: boolean;
  mindmap?: boolean;
  codeHighlight?: boolean;
  tips?: boolean;
  html?: boolean;
  breaks?: boolean;
  theme?: 'light' | 'dark';
}
```

| Option | Type | Valeur par défaut | Description |
|--------|------|---------|-------------|
| `math` | `boolean` | `true` | Activer le rendu des formules KaTeX. |
| `mindmap` | `boolean` | `true` | Activer le rendu des cartes mentales Markmap. |
| `codeHighlight` | `boolean` | `true` | Activer les blocs de code highlight.js. |
| `tips` | `boolean` | `true` | Activer les encadrés d’information. |
| `html` | `boolean` | `false` | Autoriser le HTML brut dans le Markdown. La valeur par défaut `false` est plus sûre. |
| `breaks` | `boolean` | `false` | Convertir les retours à la ligne simples en `<br>`. |
| `theme` | `'light' \| 'dark'` | — | Avec `renderMarkdown`, envelopper le HTML dans un conteneur avec thème. `Renderer.render` renvoie du HTML sans enveloppe : appliquez vous-même le style au conteneur. |

Les cases des listes de tâches, les cartes `:::doc-link` et les étiquettes de @mentions sont toujours activées et ne peuvent pas être désactivées avec `RendererOptions`.

## Pour aller plus loin

- [Fonctionnalités](./features.md) — effet des options à l’exécution.
- [Référence API](./api-reference.md) — l’ensemble des types disponibles.
