---
sidebar_position: 6
title: "API reference"
description: "Complete public API for @powerduck/md-editor: MarkdownEditor, CodeEditor, Renderer, Toolbar, StatusBar, incremental rendering, popups, media helpers, keyboard utilities, and all types."
keywords: ["api reference", "MarkdownEditor", "CodeEditor", "Renderer", "Toolbar", "Popup", "types"]
---

# API reference

This page documents everything exported from the main entry `@powerduck/md-editor` and from the `./react` subpath. Signatures are taken directly from the source.

## `MarkdownEditor`

The top-level editor class. Construct it with a container and options.

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

- `container: HTMLElement | string` — a DOM element or CSS selector. If no element matches, throws `MarkdownEditor: mount container not found`.
- `options?: MarkdownEditorOptions` — see [Configuration](./configuration.md).

Builds the layout, creates the `CodeEditor`, wires keyboard shortcuts, and (in `complex` mode) builds the toolbar and status bar. An initial render and status-bar update run on construction.

### `getValue(): string`

Returns the current Markdown source.

### `setValue(value: string): void`

Replaces the entire document, cancels any pending debounced render, re-renders the preview synchronously, and refreshes the status bar.

### `getHtml(): string`

Renders the current source to HTML via the internal `Renderer` and returns the string.

### `renderNow(): void`

Cancels any pending debounced render and forces a preview render immediately. Useful when `autoPreview` is `false`.

### `setAutoPreview(auto: boolean): void`

Enables or disables automatic preview re-rendering on edit. Enabling immediately renders the current value.

### `setMode(mode: EditorMode): void`

Switches between `'simple'` and `'complex'`. Destroying and recreating the toolbar and status bar as needed; toggles line numbers. No-op when the mode is unchanged.

### `setTheme(theme: EditorTheme): void`

Sets `data-theme` on the root element and reconfigures the CodeMirror highlight compartment. Also swaps the toolbar theme-toggle icon between sun and moon.

### `focus(): void`

Moves focus to the CodeMirror editor.

### `destroy(): void`

Cancels pending renders, destroys the code editor, toolbar, status bar, active popup, and incremental renderer, empties the container, and removes classes and attributes. Call this when unmounting the editor.

## `CodeEditor`

A thin wrapper around a CodeMirror 6 `EditorView`, exported for advanced embedding. Most consumers use `MarkdownEditor` instead.

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

`CodeEditorOptions` (not re-exported from the main entry) accepts `value`, `onChange`, `lineNumbers`, `placeholder`, `onImageFile`, `mention`, `docLink`, and `theme`.

Key methods:

- **`setKeymap(bindings)`** — replaces the custom keymap compartment with the given CodeMirror keymap bindings.
- **`insertAtCursor(text)`** — inserts text at the main selection and moves the cursor past it.
- **`wrapSelection(prefix, suffix, placeholder)`** — wraps the current selection; if nothing is selected, inserts `prefix + placeholder + suffix` and selects the placeholder.
- **`wrapLines(prefix, placeholder)`** — prefixes each selected line (or the current line) with `prefix`.
- **`toggleTaskList()`** — toggles `- [ ]` / `- [x]` markers on the current or selected lines.

## `Renderer` and `renderMarkdown`

### `class Renderer`

```ts
class Renderer {
  readonly md: MarkdownIt;
  constructor(options?: RendererOptions);
  render(source: string): string;
  hydrate(container: HTMLElement): Promise<void>;
}
```

- **`constructor(options?)`** — builds a markdown-it instance with `linkify: true` and `typographer: true`, then conditionally registers math, mindmap, code-highlight, tips, task-list, doc-link, mention, and video plugins.
- **`render(source)`** — synchronously renders source to an HTML string.
- **`hydrate(container)`** — after the HTML is inserted into the DOM, hydrates mindmap placeholders into SVG diagrams. No-op when mindmaps are disabled; failures are swallowed.

### `function renderMarkdown`

```ts
function renderMarkdown(source: string, options?: RendererOptions): string;
```

Creates a throwaway `Renderer` and returns `renderer.render(source)`. Use this to render markdown consistently without mounting an editor.

### `interface RendererOptions`

```ts
interface RendererOptions {
  math?: boolean;       // default true
  mindmap?: boolean;    // default true
  codeHighlight?: boolean; // default true
  tips?: boolean;       // default true
  html?: boolean;       // default false
  breaks?: boolean;     // default false
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

Buttons use `mousedown` + `preventDefault` so the editor does not lose focus and collapse the selection before the handler runs.

## `StatusBar` and `countText`

```ts
class StatusBar {
  readonly el: HTMLDivElement;
  constructor(callbacks: StatusBarCallbacks);
  update(state: StatusBarState): void;
  destroy(): void;
}

function countText(value: string): { charCount: number; wordCount: number };
```

- **`countText(value)`** — returns `charCount` (the raw string length) and `wordCount` (whitespace-split tokens after trimming).
- **`StatusBar.update(state)`** — displays `chars · words`, a render-block count, and a "Refresh preview" button that only appears when `autoPreview` is off.

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

- **`update(source)`** — splits source into blocks, reuses cached DOM nodes by block key, and appends nodes to a `DocumentFragment`. Returns `{ rerenderedCount, totalCount }`.
- **`getBlockCount()`** — returns the number of blocks from the last update.

## Block splitting

### `splitIntoBlocks`

```ts
function splitIntoBlocks(source: string): SourceBlock[];
```

Splits source into blocks at ATX headings, respecting code fences and `:::` containers.

### `interface SourceBlock`

```ts
interface SourceBlock {
  key: string;     // content hash + occurrence index, for DOM reuse
  hash: string;    // content hash for change detection
  source: string;  // original markdown source for this block
}
```

## Scheduling utilities

```ts
function debounce<A extends unknown[]>(
  fn: (...args: A) => void,
  wait: number,
): DebouncedFn<A>;

function adaptiveDebounceMs(docLength: number, base?: number, max?: number): number;

function scheduleIdle(callback: () => void, timeout?: number): number;
function cancelIdle(handle: number): void;
```

- **`debounce(fn, wait)`** — trailing-edge debounce. The returned function also has `.cancel()` and `.flush()`.
- **`adaptiveDebounceMs(docLength, base = 120, max = 600)`** — returns `min(max, base + floor(docLength / 20000) * 60)`.
- **`scheduleIdle(callback, timeout = 300)`** — uses `requestIdleCallback` when available, otherwise `setTimeout(0)`.
- **`cancelIdle(handle)`** — cancels the scheduled idle callback.

## Icons

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

Each icon is a 16×16 inline SVG string using `currentColor`. Use `icons.<name>` as the `icon` override in `ToolbarItemOverride`.

## `Popup`, `PopupConfig`, `PopupField`

A floating panel anchored to a toolbar button, used internally for insertion dialogs and available for custom extensions.

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

The popup closes on outside click, Escape, or successful submit.

## Media helpers

```ts
function extractYouTubeId(input: string): string | null;
function youTubeEmbedMarkdown(videoId: string, alt?: string): string; // alt default 'YouTube video'
function imageMarkdown(url: string, alt?: string): string;             // alt default 'image'
function videoMarkdown(url: string, alt?: string): string;             // alt default 'video'
function isVideoFile(url: string): boolean;
```

- **`extractYouTubeId`** — accepts `watch?v=`, `youtu.be/`, `embed/`, `shorts/`, `v/` URLs, or a raw 11-character ID; returns `null` if unrecognized.
- **`youTubeEmbedMarkdown`** — returns `[![alt](https://img.youtube.com/vi/<id>/hqdefault.jpg)](https://www.youtube.com/watch?v=<id>)`.
- **`isVideoFile`** — checks the URL extension against `.mp4`, `.webm`, `.ogg`, `.mov`, `.m4v`, `.avi`, `.mkv` (query string stripped).

## Keyboard utilities

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

- **`matchShortcut`** — parses a `Mod`/`Ctrl`/`Alt`/`Shift`/key combo and compares it against a `KeyboardEvent`. `Mod` resolves to Meta on macOS and Ctrl elsewhere.
- **`formatShortcut`** — renders a shortcut as text, e.g. `Mod-b` → `Ctrl+B` (Windows) or `Cmd+B` (macOS).
- **`formatShortcutHtml`** — renders styled `<kbd>` elements with modifier symbols.

## Mention types

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

## Document-link types

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

## Shared option types

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

Full field-by-field defaults live on the [Configuration](./configuration.md) page.

## React subpath

Imported from `@powerduck/md-editor/react`:

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

## Next steps

- [Examples](./examples.md) — see these APIs in action.
- [Features](./features.md) — runtime behavior details.
