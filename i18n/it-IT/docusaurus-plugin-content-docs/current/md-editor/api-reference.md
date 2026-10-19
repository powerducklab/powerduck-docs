---
sidebar_position: 6
title: "Riferimento API"
description: "Questa pagina documenta tutte le esportazioni dell’entry point principale @powerduck/md-editor e del sottopercorso ./react. Le firme provengono direttamente dal codice sorgente."
---

# Riferimento API

Questa pagina documenta tutte le esportazioni dell’entry point principale `@powerduck/md-editor` e del sottopercorso `./react`. Le firme provengono direttamente dal codice sorgente.

## `MarkdownEditor`

La classe principale dell’editor. Il costruttore accetta un contenitore e le opzioni.

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

- `container: HTMLElement | string` — elemento DOM o selettore CSS. Se non trova un elemento, genera `MarkdownEditor: mount container not found`.
- `options?: MarkdownEditorOptions` — vedi [Configurazione](./configuration.md).

Costruisce il layout, crea il `CodeEditor`, collega le scorciatoie da tastiera e, in modalità `complex`, crea la barra degli strumenti e quella di stato. Alla costruzione esegue il rendering iniziale e aggiorna la barra di stato.

### `getValue(): string`

Restituisce il sorgente Markdown corrente.

### `setValue(value: string): void`

Sostituisce l’intero documento, annulla eventuali rendering differiti in attesa, rigenera l’anteprima in modo sincrono e aggiorna la barra di stato.

### `getHtml(): string`

Converte il sorgente corrente in HTML tramite il `Renderer` interno e restituisce la stringa.

### `renderNow(): void`

Annulla eventuali rendering differiti in attesa e forza subito il rendering dell’anteprima. Utile quando `autoPreview` è `false`.

### `setAutoPreview(auto: boolean): void`

Attiva o disattiva il rendering automatico dell’anteprima durante le modifiche. L’attivazione provoca il rendering immediato del valore corrente.

### `setMode(mode: EditorMode): void`

Passa tra `'simple'` e `'complex'`. Distrugge e ricrea le barre degli strumenti e di stato quando necessario, e attiva o disattiva i numeri di riga. Non fa nulla se la modalità non cambia.

### `setTheme(theme: EditorTheme): void`

Imposta `data-theme` sull’elemento radice e riconfigura il compartimento di evidenziazione di CodeMirror. Alterna inoltre l’icona del selettore del tema tra sole e luna.

### `focus(): void`

Sposta il focus sull’editor CodeMirror.

### `destroy(): void`

Annulla i rendering in attesa, distrugge l’editor di codice, le barre degli strumenti e di stato, il popup attivo e il renderer incrementale, svuota il contenitore e rimuove classi e attributi. Da chiamare quando si smonta l’editor.

## `CodeEditor`

Un sottile livello sopra `EditorView` di CodeMirror 6, esportato per integrazioni avanzate. Nella maggior parte dei casi è preferibile usare `MarkdownEditor`.

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

`CodeEditorOptions` (non riesportato dall’entry point principale) accetta `value`, `onChange`, `lineNumbers`, `placeholder`, `onImageFile`, `mention`, `docLink` e `theme`.

Metodi principali:

- **`setKeymap(bindings)`** — sostituisce il compartimento dei tasti personalizzato con le associazioni CodeMirror fornite.
- **`insertAtCursor(text)`** — inserisce il testo nella selezione principale e sposta il cursore subito dopo.
- **`wrapSelection(prefix, suffix, placeholder)`** — racchiude la selezione; se non è selezionato nulla, inserisce `prefix + placeholder + suffix` e seleziona il segnaposto.
- **`wrapLines(prefix, placeholder)`** — antepone `prefix` a ogni riga selezionata o alla riga corrente.
- **`toggleTaskList()`** — alterna i marcatori `- [ ]` / `- [x]` nella riga corrente o nelle righe selezionate.

## `Renderer` e `renderMarkdown`

### `class Renderer`

```ts
class Renderer {
  readonly md: MarkdownIt;
  constructor(options?: RendererOptions);
  render(source: string): string;
  hydrate(container: HTMLElement): Promise<void>;
}
```

- **`constructor(options?)`** — crea un’istanza markdown-it con `linkify: true` e `typographer: true`, abilita in base alle opzioni formule, mappe mentali, evidenziazione del codice e avvisi, e registra sempre i plugin per elenchi di attività, collegamenti a documenti, menzioni e video.
- **`render(source)`** — converte il sorgente in una stringa HTML in modo sincrono.
- **`hydrate(container)`** — dopo l’inserimento dell’HTML nel DOM, trasforma i segnaposto delle mappe mentali in diagrammi SVG. Non fa nulla se le mappe mentali sono disattivate; gli errori vengono ignorati.

### `function renderMarkdown`

```ts
function renderMarkdown(source: string, options?: RendererOptions): string;
```

Crea un `Renderer` temporaneo ed esegue il rendering del sorgente. Se `theme` è impostato, racchiude il risultato in un contenitore con tema; `Renderer.render` non aggiunge tale contenitore. Consente di renderizzare Markdown senza montare un editor.

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

I pulsanti usano `mousedown` + `preventDefault` per evitare che l’editor perda il focus e che la selezione si chiuda prima dell’esecuzione del gestore.

## `StatusBar` e `countText`

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

`StatusBarState` e `StatusBarCallbacks` descrivono le strutture accettate, ma non sono riesportati dall’entry point principale.

- **`countText(value)`** — restituisce `charCount` (lunghezza originale della stringa) e `wordCount` (elementi separati da spazi bianchi dopo la rimozione di quelli iniziali e finali).
- **`StatusBar.update(state)`** — mostra `chars · words`, il numero di blocchi renderizzati e il pulsante “Refresh preview” (aggiorna anteprima), visibile solo quando `autoPreview` è disattivato.

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

- **`update(source)`** — divide il sorgente in blocchi, riutilizza i nodi DOM in cache tramite la chiave del blocco e aggiunge i nodi a un `DocumentFragment`. Restituisce `{ rerenderedCount, totalCount }`.
- **`getBlockCount()`** — restituisce il numero di blocchi dell’ultimo aggiornamento.

## Suddivisione in blocchi

### `splitIntoBlocks`

```ts
function splitIntoBlocks(source: string): SourceBlock[];
```

Divide il sorgente in corrispondenza dei titoli ATX, rispettando i delimitatori dei blocchi di codice e i contenitori `:::`.

### `interface SourceBlock`

```ts
interface SourceBlock {
  key: string;     // content hash + occurrence index, for DOM reuse
  hash: string;    // content hash for change detection
  source: string;  // original markdown source for this block
}
```

## Utilità di pianificazione

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

`DebouncedFn` descrive il valore restituito, ma non è riesportato dall’entry point principale.

- **`debounce(fn, wait)`** — rinvia l’esecuzione fino al termine dell’intervallo successivo all’ultima chiamata. La funzione restituita offre anche `.cancel()` e `.flush()`.
- **`adaptiveDebounceMs(docLength, base = 120, max = 600)`** — restituisce `min(max, base + floor(max(0, docLength) / 20000) * 60)`.
- **`scheduleIdle(callback, timeout = 300)`** — usa `requestIdleCallback` se disponibile, altrimenti `setTimeout(0)`.
- **`cancelIdle(handle)`** — annulla il callback pianificato per un periodo di inattività.

## Icone

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

Ogni icona è una stringa SVG inline di 16×16 che usa `currentColor`. Usa `icons.<name>` per sostituire `icon` in `ToolbarItemOverride`.

## `Popup`, `PopupConfig`, `PopupField`

Pannello mobile ancorato a un pulsante della barra degli strumenti, usato internamente per i dialoghi di inserimento e disponibile per estensioni personalizzate.

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

Il popup si chiude facendo clic all’esterno, premendo Escape o completando correttamente l’invio.

## Utilità multimediali

```ts
function extractYouTubeId(input: string): string | null;
function youTubeEmbedMarkdown(videoId: string, alt?: string): string; // alt default 'YouTube video'
function imageMarkdown(url: string, alt?: string): string;             // alt default 'image'
function videoMarkdown(url: string, alt?: string): string;             // alt default 'video'
function isVideoFile(url: string): boolean;
```

- **`extractYouTubeId`** — accetta URL `watch?v=`, `youtu.be/`, `embed/`, `shorts/`, `v/` o un ID semplice di 11 caratteri; restituisce `null` se il formato non è riconosciuto.
- **`youTubeEmbedMarkdown`** — restituisce `[![alt](https://img.youtube.com/vi/<id>/hqdefault.jpg)](https://www.youtube.com/watch?v=<id>)`.
- **`isVideoFile`** — verifica se l’estensione dell’URL è `.mp4`, `.webm`, `.ogg`, `.mov`, `.m4v`, `.avi` o `.mkv`, dopo aver rimosso la stringa di query.

## Utilità per la tastiera

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

- **`matchShortcut`** — analizza una combinazione `Mod`/`Ctrl`/`Alt`/`Shift`/tasto e la confronta con un `KeyboardEvent`. `Mod` corrisponde a Meta su macOS e a Ctrl sugli altri sistemi.
- **`formatShortcut`** — formatta una scorciatoia come testo, ad esempio `Mod-b` → `Ctrl+B` (Windows) o `Cmd+B` (macOS).
- **`formatShortcutHtml`** — genera elementi `<kbd>` formattati con i simboli dei modificatori.

## Tipi delle menzioni

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

## Tipi dei collegamenti ai documenti

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

## Tipi di opzioni condivisi

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

I valori predefiniti di ogni campo sono descritti in [Configurazione](./configuration.md).

## Sottopercorso React

Importazione da `@powerduck/md-editor/react`:

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

## Passi successivi

- [Esempi](./examples.md) — queste API in pratica.
- [Funzionalità](./features.md) — dettagli sul comportamento in esecuzione.
