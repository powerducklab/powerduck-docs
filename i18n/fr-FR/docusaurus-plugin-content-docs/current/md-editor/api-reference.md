---
sidebar_position: 6
title: "Référence API"
description: "Cette page couvre tous les exports de l’entrée principale @powerduck/md-editor et du sous-chemin ./react. Les signatures proviennent directement du code source."
---

# Référence API

Cette page couvre tous les exports de l’entrée principale `@powerduck/md-editor` et du sous-chemin `./react`. Les signatures proviennent directement du code source.

## `MarkdownEditor`

La classe principale de l’éditeur. Son constructeur reçoit un conteneur et des options.

```ts
class MarkdownEditor {
  constructor(container: HTMLElement | string, options?: MarkdownEditorOptions);

  getValue(): string;
  setValue(value: string): void;
  getHtml(): string;
  renderNow(): void;
  setAutoPreview(auto: boolean): void;
  setMode(mode: EditorMode): void;
  setTheme(theme: EditorTheme): void;
  focus(): void;
  destroy(): void;
}
```

### `constructor(container, options?)`

- `container: HTMLElement | string` — élément DOM ou sélecteur CSS. Si aucun élément ne correspond, lève `MarkdownEditor: mount container not found`.
- `options?: MarkdownEditorOptions` — voir [Configuration](./configuration.md).

Construit la mise en page, crée le `CodeEditor`, connecte les raccourcis clavier et, en mode `complex`, crée la barre d’outils et la barre d’état. Le rendu initial et la mise à jour de la barre d’état ont lieu à la construction.

### `getValue(): string`

Renvoie la source Markdown actuelle.

### `setValue(value: string): void`

Remplace le document entier, annule tout rendu différé en attente, régénère l’aperçu de façon synchrone et actualise la barre d’état.

### `getHtml(): string`

Convertit la source actuelle en HTML via le `Renderer` interne et renvoie la chaîne obtenue.

### `renderNow(): void`

Annule tout rendu différé en attente et force immédiatement le rendu de l’aperçu. Utile lorsque `autoPreview` vaut `false`.

### `setAutoPreview(auto: boolean): void`

Active ou désactive le rendu automatique de l’aperçu lors des modifications. L’activation déclenche immédiatement le rendu de la valeur actuelle.

### `setMode(mode: EditorMode): void`

Bascule entre `'simple'` et `'complex'`. Détruit et recrée les barres d’outils et d’état si nécessaire, et active ou masque les numéros de ligne. Ne fait rien si le mode ne change pas.

### `setTheme(theme: EditorTheme): void`

Définit `data-theme` sur l’élément racine et reconfigure le compartiment de coloration de CodeMirror. Remplace aussi l’icône de changement de thème par le soleil ou la lune.

### `focus(): void`

Place le focus dans l’éditeur CodeMirror.

### `destroy(): void`

Annule les rendus en attente, détruit l’éditeur de code, les barres d’outils et d’état, la fenêtre active et le moteur de rendu incrémental, vide le conteneur et retire les classes et attributs. À appeler lors du démontage de l’éditeur.

## `CodeEditor`

Une fine couche autour d’un `EditorView` CodeMirror 6, exportée pour les intégrations avancées. La plupart des utilisateurs emploieront plutôt `MarkdownEditor`.

```ts
class CodeEditor {
  readonly view: EditorView;
  constructor(container: HTMLElement, options: CodeEditorOptions);

  setKeymap(bindings: Array<{ key: string; run: (view: EditorView) => boolean }>): void;
  getValue(): string;
  setValue(value: string): void;
  setLineNumbers(enabled: boolean): void;
  setTheme(theme: EditorTheme): void;
  insertAtCursor(text: string): void;
  wrapSelection(prefix: string, suffix: string, placeholder: string): void;
  getSelection(): string;
  wrapLines(prefix: string, placeholder: string): void;
  focus(): void;
  insertMention(): void;
  insertDocLink(): void;
  toggleTaskList(): void;
  destroy(): void;
}
```

`CodeEditorOptions` (non réexporté depuis l’entrée principale) accepte `value`, `onChange`, `lineNumbers`, `placeholder`, `onImageFile`, `mention`, `docLink` et `theme`.

Méthodes principales :

- **`setKeymap(bindings)`** — remplace le compartiment de raccourcis personnalisé par les associations CodeMirror fournies.
- **`insertAtCursor(text)`** — insère le texte dans la sélection principale et place le curseur à sa suite.
- **`wrapSelection(prefix, suffix, placeholder)`** — encadre la sélection ; si elle est vide, insère `prefix + placeholder + suffix` et sélectionne le texte indicatif.
- **`wrapLines(prefix, placeholder)`** — ajoute `prefix` au début de chaque ligne sélectionnée, ou de la ligne actuelle.
- **`toggleTaskList()`** — bascule les marqueurs `- [ ]` / `- [x]` sur la ligne actuelle ou les lignes sélectionnées.

## `Renderer` et `renderMarkdown`

### `class Renderer`

```ts
class Renderer {
  readonly md: MarkdownIt;
  constructor(options?: RendererOptions);
  render(source: string): string;
  hydrate(container: HTMLElement): Promise<void>;
}
```

- **`constructor(options?)`** — crée une instance markdown-it avec `linkify: true` et `typographer: true`, active selon les options les formules, cartes mentales, coloration du code et encadrés, et enregistre toujours les plugins de listes de tâches, liens de documents, mentions et vidéos.
- **`render(source)`** — convertit la source en chaîne HTML de façon synchrone.
- **`hydrate(container)`** — après insertion du HTML dans le DOM, transforme les emplacements de cartes mentales en diagrammes SVG. Ne fait rien si les cartes mentales sont désactivées ; les erreurs sont ignorées.

### `function renderMarkdown`

```ts
function renderMarkdown(source: string, options?: RendererOptions): string;
```

Crée un `Renderer` temporaire et rend la source. Si `theme` est défini, enveloppe le résultat dans un conteneur thématique ; `Renderer.render` n’ajoute pas lui-même cette enveloppe. Permet de rendre du Markdown sans monter d’éditeur.

### `interface RendererOptions`

```ts
interface RendererOptions {
  math?: boolean;       // default true
  mindmap?: boolean;    // default true
  codeHighlight?: boolean; // default true
  tips?: boolean;       // default true
  html?: boolean;       // default false
  breaks?: boolean;     // default false
  theme?: 'light' | 'dark'; // wrapper added by renderMarkdown only
}
```

## `Toolbar`

```ts
class Toolbar {
  readonly el: HTMLDivElement;
  constructor(actions: readonly ToolbarAction[]);
  setActive(name: string, active: boolean): void;
  setIcon(name: string, icon: string): void;
  destroy(): void;
}
```

### `interface ToolbarAction`

```ts
interface ToolbarAction {
  name: string;
  title: string;
  icon: string;
  handler: (button: HTMLButtonElement) => void;
  groupEnd?: boolean;
  toggle?: boolean;
  active?: boolean;
}
```

Les boutons utilisent `mousedown` + `preventDefault` pour éviter que l’éditeur perde le focus et que la sélection se replie avant l’exécution du gestionnaire.

## `StatusBar` et `countText`

```ts
class StatusBar {
  readonly el: HTMLDivElement;
  constructor(callbacks: StatusBarCallbacks);
  update(state: StatusBarState): void;
  destroy(): void;
}

interface StatusBarState {
  charCount: number;
  wordCount: number;
  blockCount: number;
  mode: 'simple' | 'complex';
  autoPreview: boolean;
}
interface StatusBarCallbacks {
  onRefreshPreview: () => void;
}

function countText(value: string): { charCount: number; wordCount: number };
```

`StatusBarState` et `StatusBarCallbacks` décrivent les structures acceptées, mais ne sont pas réexportés depuis l’entrée principale.

- **`countText(value)`** — renvoie `charCount` (longueur brute de la chaîne) et `wordCount` (éléments séparés par des espaces blancs après suppression des blancs aux extrémités).
- **`StatusBar.update(state)`** — affiche `chars · words`, le nombre de blocs de rendu et un bouton « Refresh preview » (actualiser l’aperçu), visible uniquement si `autoPreview` est désactivé.

## `IncrementalRenderer`

```ts
class IncrementalRenderer {
  constructor(
    container: HTMLElement,
    renderBlock: (source: string) => string,
    maxCacheEntries?: number, // default 800
  );
  update(source: string): IncrementalRenderResult;
  getBlockCount(): number;
  destroy(): void;
}
```

- **`update(source)`** — découpe la source en blocs, réutilise les nœuds DOM en cache selon leur clé et ajoute les nœuds à un `DocumentFragment`. Renvoie `{ rerenderedCount, totalCount }`.
- **`getBlockCount()`** — renvoie le nombre de blocs de la dernière mise à jour.

## Découpage en blocs

### `splitIntoBlocks`

```ts
function splitIntoBlocks(source: string): SourceBlock[];
```

Découpe la source aux titres ATX, en respectant les blocs de code délimités et les conteneurs `:::`.

### `interface SourceBlock`

```ts
interface SourceBlock {
  key: string;     // content hash + occurrence index, for DOM reuse
  hash: string;    // content hash for change detection
  source: string;  // original markdown source for this block
}
```

## Utilitaires de planification

```ts
interface DebouncedFn<A extends unknown[]> {
  (...args: A): void;
  cancel(): void;
  flush(): void;
}

function debounce<A extends unknown[]>(
  fn: (...args: A) => void,
  wait: number,
): DebouncedFn<A>;

function adaptiveDebounceMs(docLength: number, base?: number, max?: number): number;

function scheduleIdle(callback: () => void, timeout?: number): number;
function cancelIdle(handle: number): void;
```

`DebouncedFn` décrit la valeur renvoyée, mais n’est pas réexporté depuis l’entrée principale.

- **`debounce(fn, wait)`** — temporisation après le dernier appel. La fonction renvoyée expose aussi `.cancel()` et `.flush()`.
- **`adaptiveDebounceMs(docLength, base = 120, max = 600)`** — renvoie `min(max, base + floor(max(0, docLength) / 20000) * 60)`.
- **`scheduleIdle(callback, timeout = 300)`** — utilise `requestIdleCallback` si disponible, sinon `setTimeout(0)`.
- **`cancelIdle(handle)`** — annule le rappel planifié pour une période d’inactivité.

## Icônes

```ts
const icons: {
  bold: string; italic: string; heading: string; link: string; code: string;
  image: string; video: string; youtube: string;
  quote: string; list: string; listOrdered: string; taskList: string;
  mention: string; fileText: string; table: string; hr: string; alert: string;
  sigma: string; mindmap: string; eye: string; help: string;
  moon: string; sun: string; refresh: string;
};
type IconName = keyof typeof icons;
```

Chaque icône est une chaîne SVG intégrée de 16×16 utilisant `currentColor`. Utilisez `icons.<name>` pour remplacer `icon` dans `ToolbarItemOverride`.

## `Popup`, `PopupConfig`, `PopupField`

Panneau flottant ancré à un bouton de la barre d’outils, utilisé pour les dialogues d’insertion et disponible pour vos extensions.

```ts
class Popup {
  readonly el: HTMLDivElement;
  constructor(anchor: HTMLElement, config: PopupConfig);
  show(): void;
  hide(): void;
  destroy(): void;
}

interface PopupConfig {
  title: string;
  fields: readonly PopupField[];
  submitLabel?: string;
  theme?: 'light' | 'dark';
  onSubmit: (values: Record<string, string>) => void;
}

interface PopupField {
  name: string;
  label: string;
  placeholder?: string;
  type?: 'text' | 'textarea';
  required?: boolean;
}
```

La fenêtre se ferme après un clic à l’extérieur, avec Escape ou après un envoi réussi.

## Utilitaires multimédias

```ts
function extractYouTubeId(input: string): string | null;
function youTubeEmbedMarkdown(videoId: string, alt?: string): string; // alt default 'YouTube video'
function imageMarkdown(url: string, alt?: string): string;             // alt default 'image'
function videoMarkdown(url: string, alt?: string): string;             // alt default 'video'
function isVideoFile(url: string): boolean;
```

- **`extractYouTubeId`** — accepte les URL `watch?v=`, `youtu.be/`, `embed/`, `shorts/`, `v/` ou un identifiant brut de 11 caractères ; renvoie `null` si le format n’est pas reconnu.
- **`youTubeEmbedMarkdown`** — renvoie `[![alt](https://img.youtube.com/vi/<id>/hqdefault.jpg)](https://www.youtube.com/watch?v=<id>)`.
- **`isVideoFile`** — vérifie l’extension de l’URL parmi `.mp4`, `.webm`, `.ogg`, `.mov`, `.m4v`, `.avi`, `.mkv`, après suppression de la chaîne de requête.

## Utilitaires clavier

```ts
const DEFAULT_SHORTCUTS: readonly ShortcutDef[];

interface ShortcutDef {
  action: string;
  key: string;        // e.g. 'Mod-b'
  description: string;
}

function matchShortcut(shortcut: string, e: KeyboardEvent): boolean;
function formatShortcut(shortcut: string): string;
function formatShortcutHtml(shortcut: string): string;
```

- **`matchShortcut`** — analyse une combinaison `Mod`/`Ctrl`/`Alt`/`Shift`/touche et la compare à un `KeyboardEvent`. `Mod` correspond à Meta sur macOS et à Ctrl ailleurs.
- **`formatShortcut`** — formate un raccourci en texte, par exemple `Mod-b` → `Ctrl+B` (Windows) ou `Cmd+B` (macOS).
- **`formatShortcutHtml`** — produit des éléments `<kbd>` stylisés avec les symboles des touches modificatrices.

## Types des mentions

```ts
interface MentionItem {
  id: string;
  label: string;
  avatar?: string;
  description?: string;
  [key: string]: unknown;
}

interface MentionOptions {
  onMentionSearch?: (query: string) => MentionItem[] | Promise<MentionItem[]>;
  onMentionSelect?: (item: MentionItem) => string;
  minChars?: number;  // default 0
  maxItems?: number;  // default 8
}
```

## Types des liens de documents

```ts
interface DocItem {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  description?: string;
  [key: string]: unknown;
}

interface DocMeta {
  title?: string;
  thumbnail?: string;
  description?: string;
}

interface DocLinkOptions {
  onDocSearch?: (query: string) => DocItem[] | Promise<DocItem[]>;
  onFetchDocMeta?: (url: string) => Promise<DocMeta>;
  insertStyle?: 'card' | 'link' | 'auto'; // default 'auto'
  triggerChar?: string;                    // default '/'
  minChars?: number;                       // default 0
  maxItems?: number;                       // default 8
}
```

## Types d’options partagés

```ts
type EditorMode = 'simple' | 'complex';
type EditorTheme = 'light' | 'dark';

interface ToolbarItemOverride {
  show?: boolean;
  label?: string;
  icon?: string;
}

type ToolbarConfig = string[] | Record<string, ToolbarItemOverride>;

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

Les valeurs par défaut de chaque champ figurent dans [Configuration](./configuration.md).

## Sous-chemin React

À importer depuis `@powerduck/md-editor/react` :

```tsx
import {
  MarkdownEditorReact,
  type MarkdownEditorProps,
  type MarkdownEditorHandle,
} from '@powerduck/md-editor/react';
```

### `MarkdownEditorProps`

```ts
interface MarkdownEditorProps extends Omit<MarkdownEditorOptions, 'value' | 'onChange'> {
  value?: string;        // controlled value
  defaultValue?: string; // uncontrolled initial value (mount only)
  onChange?: (value: string) => void;
  className?: string;
  style?: CSSProperties;
}
```

### `MarkdownEditorHandle`

```ts
interface MarkdownEditorHandle {
  getValue: () => string;
  setValue: (value: string) => void;
  getHtml: () => string;
  focus: () => void;
  setMode: (mode: EditorMode) => void;
  setTheme: (theme: EditorTheme) => void;
  renderNow: () => void;
}
```

## Pour aller plus loin

- [Exemples](./examples.md) — utiliser ces API en pratique.
- [Fonctionnalités](./features.md) — détails du comportement à l’exécution.
