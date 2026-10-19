---
sidebar_position: 6
title: "API-Referenz"
description: "Diese Seite beschreibt alle Exporte des Haupteinstiegspunkts @powerduck/md-editor und des Unterpfads ./react. Die Signaturen stammen direkt aus dem Quellcode."
---

# API-Referenz

Diese Seite beschreibt alle Exporte des Haupteinstiegspunkts `@powerduck/md-editor` und des Unterpfads `./react`. Die Signaturen stammen direkt aus dem Quellcode.

## `MarkdownEditor`

Die zentrale Editorklasse. Übergeben Sie dem Konstruktor einen Container und Optionen.

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

- `container: HTMLElement | string` — DOM-Element oder CSS-Selektor. Wenn kein Element passt, wird `MarkdownEditor: mount container not found` ausgelöst.
- `options?: MarkdownEditorOptions` — siehe [Konfiguration](./configuration.md).

Erstellt das Layout und den `CodeEditor`, richtet Tastenkürzel ein und erstellt im Modus `complex` die Symbol- und Statusleiste. Beim Erstellen erfolgen ein erster Renderdurchlauf und eine Aktualisierung der Statusleiste.

### `getValue(): string`

Gibt den aktuellen Markdown-Quelltext zurück.

### `setValue(value: string): void`

Ersetzt das gesamte Dokument, bricht ausstehende verzögerte Renderdurchläufe ab, rendert die Vorschau synchron neu und aktualisiert die Statusleiste.

### `getHtml(): string`

Rendert den aktuellen Quelltext über den internen `Renderer` zu HTML und gibt den String zurück.

### `renderNow(): void`

Bricht ausstehende verzögerte Renderdurchläufe ab und erzwingt sofort einen Renderdurchlauf der Vorschau. Nützlich, wenn `autoPreview` auf `false` steht.

### `setAutoPreview(auto: boolean): void`

Aktiviert oder deaktiviert die automatische Vorschauaktualisierung bei Änderungen. Beim Aktivieren wird der aktuelle Inhalt sofort gerendert.

### `setMode(mode: EditorMode): void`

Wechselt zwischen `'simple'` und `'complex'`. Symbol- und Statusleiste werden bei Bedarf entfernt und neu erstellt; Zeilennummern werden umgeschaltet. Bei unverändertem Modus geschieht nichts.

### `setTheme(theme: EditorTheme): void`

Setzt `data-theme` am Wurzelelement und konfiguriert das CodeMirror-Compartment für die Hervorhebung neu. Wechselt außerdem das Symbol des Themenumschalters zwischen Sonne und Mond.

### `focus(): void`

Setzt den Fokus in den CodeMirror-Editor.

### `destroy(): void`

Bricht ausstehende Renderdurchläufe ab, zerstört Code-Editor, Symbolleiste, Statusleiste, aktives Popup und inkrementellen Renderer, leert den Container und entfernt Klassen und Attribute. Beim Entfernen des Editors aufrufen.

## `CodeEditor`

Eine schlanke Hülle um CodeMirror 6 `EditorView` für erweiterte Einbettungen. Die meisten Anwendungen sollten stattdessen `MarkdownEditor` verwenden.

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

`CodeEditorOptions` (nicht über den Haupteinstiegspunkt erneut exportiert) akzeptiert `value`, `onChange`, `lineNumbers`, `placeholder`, `onImageFile`, `mention`, `docLink` und `theme`.

Wichtige Methoden:

- **`setKeymap(bindings)`** — ersetzt das benutzerdefinierte Keymap-Compartment durch die angegebenen CodeMirror-Tastenbindungen.
- **`insertAtCursor(text)`** — fügt Text an der Hauptauswahl ein und setzt den Cursor dahinter.
- **`wrapSelection(prefix, suffix, placeholder)`** — umschließt die Auswahl; ohne Auswahl wird `prefix + placeholder + suffix` eingefügt und der Platzhalter ausgewählt.
- **`wrapLines(prefix, placeholder)`** — stellt jeder ausgewählten Zeile oder der aktuellen Zeile `prefix` voran.
- **`toggleTaskList()`** — schaltet die Markierungen `- [ ]` / `- [x]` in der aktuellen oder den ausgewählten Zeilen um.

## `Renderer` und `renderMarkdown`

### `class Renderer`

```ts
class Renderer {
  readonly md: MarkdownIt;
  constructor(options?: RendererOptions);
  render(source: string): string;
  hydrate(container: HTMLElement): Promise<void>;
}
```

- **`constructor(options?)`** — erstellt eine markdown-it-Instanz mit `linkify: true` und `typographer: true`, aktiviert Formeln, Mindmaps, Codehervorhebung und Hinweisblöcke abhängig von den Optionen und registriert Aufgabenlisten-, Dokumentlink-, Erwähnungs- und Videoplugins immer.
- **`render(source)`** — rendert den Quelltext synchron als HTML-String.
- **`hydrate(container)`** — wandelt Mindmap-Platzhalter nach dem Einfügen des HTML in das DOM in SVG-Diagramme um. Bei deaktivierten Mindmaps geschieht nichts; Fehler werden unterdrückt.

### `function renderMarkdown`

```ts
function renderMarkdown(source: string, options?: RendererOptions): string;
```

Erstellt einen temporären `Renderer` und rendert den Quelltext. Wenn `theme` gesetzt ist, wird das Ergebnis in einen Container mit Thema eingebettet; `Renderer.render` selbst fügt diesen Container nicht hinzu. Zum Rendern von Markdown ohne Einbinden eines Editors.

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

Schaltflächen verwenden `mousedown` + `preventDefault`, damit der Editor vor dem Ausführen des Handlers nicht den Fokus verliert und die Auswahl aufhebt.

## `StatusBar` und `countText`

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

`StatusBarState` und `StatusBarCallbacks` beschreiben die akzeptierten Strukturen, werden aber nicht über den Haupteinstiegspunkt erneut exportiert.

- **`countText(value)`** — liefert `charCount` (unveränderte Stringlänge) und `wordCount` (nach dem Trimmen anhand von Leerraum getrennte Wörter).
- **`StatusBar.update(state)`** — zeigt `chars · words`, die Anzahl der Renderblöcke und die Schaltfläche „Refresh preview“ (Vorschau aktualisieren), die nur bei deaktiviertem `autoPreview` erscheint.

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

- **`update(source)`** — zerlegt den Quelltext in Blöcke, verwendet gecachte DOM-Knoten anhand ihres Blockschlüssels wieder und fügt die Knoten einem `DocumentFragment` hinzu. Gibt `{ rerenderedCount, totalCount }` zurück.
- **`getBlockCount()`** — gibt die Blockanzahl der letzten Aktualisierung zurück.

## Aufteilung in Blöcke

### `splitIntoBlocks`

```ts
function splitIntoBlocks(source: string): SourceBlock[];
```

Teilt den Quelltext an ATX-Überschriften auf und berücksichtigt dabei Codebegrenzungen und `:::`-Container.

### `interface SourceBlock`

```ts
interface SourceBlock {
  key: string;     // content hash + occurrence index, for DOM reuse
  hash: string;    // content hash for change detection
  source: string;  // original markdown source for this block
}
```

## Hilfsfunktionen zur Zeitplanung

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

`DebouncedFn` beschreibt den Rückgabewert, wird aber nicht über den Haupteinstiegspunkt erneut exportiert.

- **`debounce(fn, wait)`** — verzögerte Ausführung nach dem letzten Aufruf. Die zurückgegebene Funktion besitzt außerdem `.cancel()` und `.flush()`.
- **`adaptiveDebounceMs(docLength, base = 120, max = 600)`** — gibt `min(max, base + floor(max(0, docLength) / 20000) * 60)` zurück.
- **`scheduleIdle(callback, timeout = 300)`** — nutzt `requestIdleCallback`, falls verfügbar, andernfalls `setTimeout(0)`.
- **`cancelIdle(handle)`** — bricht den geplanten Leerlauf-Callback ab.

## Symbole

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

Jedes Symbol ist ein 16×16-Inline-SVG-String mit `currentColor`. Verwenden Sie `icons.<name>` als Überschreibung für `icon` in `ToolbarItemOverride`.

## `Popup`, `PopupConfig`, `PopupField`

Ein an einer Schaltfläche der Symbolleiste verankertes schwebendes Panel. Es wird intern für Einfügedialoge genutzt und steht für eigene Erweiterungen zur Verfügung.

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

Das Popup schließt sich bei einem Klick außerhalb, mit Escape oder nach erfolgreichem Absenden.

## Medien-Hilfsfunktionen

```ts
function extractYouTubeId(input: string): string | null;
function youTubeEmbedMarkdown(videoId: string, alt?: string): string; // alt default 'YouTube video'
function imageMarkdown(url: string, alt?: string): string;             // alt default 'image'
function videoMarkdown(url: string, alt?: string): string;             // alt default 'video'
function isVideoFile(url: string): boolean;
```

- **`extractYouTubeId`** — akzeptiert URLs mit `watch?v=`, `youtu.be/`, `embed/`, `shorts/`, `v/` oder eine reine ID aus 11 Zeichen; gibt bei unbekanntem Format `null` zurück.
- **`youTubeEmbedMarkdown`** — gibt `[![alt](https://img.youtube.com/vi/<id>/hqdefault.jpg)](https://www.youtube.com/watch?v=<id>)` zurück.
- **`isVideoFile`** — prüft die URL-Endung auf `.mp4`, `.webm`, `.ogg`, `.mov`, `.m4v`, `.avi`, `.mkv`; die Abfragezeichenfolge wird vorher entfernt.

## Tastatur-Hilfsfunktionen

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

- **`matchShortcut`** — analysiert eine Kombination aus `Mod`/`Ctrl`/`Alt`/`Shift`/Taste und vergleicht sie mit einem `KeyboardEvent`. `Mod` entspricht Meta unter macOS und sonst Ctrl.
- **`formatShortcut`** — formatiert ein Tastenkürzel als Text, etwa `Mod-b` → `Ctrl+B` (Windows) oder `Cmd+B` (macOS).
- **`formatShortcutHtml`** — erzeugt gestaltete `<kbd>`-Elemente mit Symbolen für Modifikatortasten.

## Typen für Erwähnungen

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

## Typen für Dokumentlinks

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

## Gemeinsame Optionstypen

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

Die Standardwerte aller Felder finden Sie unter [Konfiguration](./configuration.md).

## React-Unterpfad

Import aus `@powerduck/md-editor/react`:

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

## Nächste Schritte

- [Beispiele](./examples.md) — diese APIs in der Praxis.
- [Funktionen](./features.md) — Details zum Laufzeitverhalten.
