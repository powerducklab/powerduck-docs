---
sidebar_position: 6
title: "Справочник API"
description: "На этой странице описаны все экспорты главной точки входа @powerduck/md-editor и подпути ./react. Сигнатуры взяты непосредственно из исходного кода."
---

# Справочник API

На этой странице описаны все экспорты главной точки входа `@powerduck/md-editor` и подпути `./react`. Сигнатуры взяты непосредственно из исходного кода.

## `MarkdownEditor`

Главный класс редактора. В конструктор передаются контейнер и параметры.

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

- `container: HTMLElement | string` — элемент DOM или CSS-селектор. Если элемент не найден, выбрасывает `MarkdownEditor: mount container not found`.
- `options?: MarkdownEditorOptions` — см. [Настройка](./configuration.md).

Создаёт разметку и `CodeEditor`, подключает сочетания клавиш, а в режиме `complex` — панель инструментов и строку состояния. При создании выполняются первый рендеринг и обновление строки состояния.

### `getValue(): string`

Возвращает текущий исходный текст Markdown.

### `setValue(value: string): void`

Заменяет весь документ, отменяет ожидающий отложенный рендеринг, синхронно перерисовывает предпросмотр и обновляет строку состояния.

### `getHtml(): string`

Преобразует текущий исходный текст в HTML через внутренний `Renderer` и возвращает строку.

### `renderNow(): void`

Отменяет ожидающий отложенный рендеринг и немедленно перерисовывает предпросмотр. Полезно, когда `autoPreview` равен `false`.

### `setAutoPreview(auto: boolean): void`

Включает или отключает автоматическую перерисовку предпросмотра при редактировании. При включении сразу отображает текущее значение.

### `setMode(mode: EditorMode): void`

Переключает `'simple'` и `'complex'`. При необходимости уничтожает и заново создаёт панель инструментов и строку состояния, переключает номера строк. Если режим не меняется, ничего не делает.

### `setTheme(theme: EditorTheme): void`

Устанавливает `data-theme` корневого элемента и перенастраивает compartment подсветки CodeMirror. Также меняет значок переключения темы между солнцем и луной.

### `focus(): void`

Переводит фокус в редактор CodeMirror.

### `destroy(): void`

Отменяет ожидающий рендеринг, уничтожает редактор кода, панель инструментов, строку состояния, активное всплывающее окно и инкрементальный рендерер, очищает контейнер и удаляет классы и атрибуты. Вызывайте при размонтировании редактора.

## `CodeEditor`

Тонкая оболочка над `EditorView` из CodeMirror 6, экспортируемая для расширенного встраивания. Обычно достаточно `MarkdownEditor`.

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

`CodeEditorOptions` (не реэкспортируется из главной точки входа) принимает `value`, `onChange`, `lineNumbers`, `placeholder`, `onImageFile`, `mention`, `docLink` и `theme`.

Основные методы:

- **`setKeymap(bindings)`** — заменяет пользовательский compartment привязок клавиш указанными привязками CodeMirror.
- **`insertAtCursor(text)`** — вставляет текст в основное выделение и перемещает курсор за него.
- **`wrapSelection(prefix, suffix, placeholder)`** — обрамляет выделение; если его нет, вставляет `prefix + placeholder + suffix` и выделяет текст-заполнитель.
- **`wrapLines(prefix, placeholder)`** — добавляет `prefix` в начало каждой выделенной строки или текущей строки.
- **`toggleTaskList()`** — переключает маркеры `- [ ]` / `- [x]` в текущей или выделенных строках.

## `Renderer` и `renderMarkdown`

### `class Renderer`

```ts
class Renderer {
  readonly md: MarkdownIt;
  constructor(options?: RendererOptions);
  render(source: string): string;
  hydrate(container: HTMLElement): Promise<void>;
}
```

- **`constructor(options?)`** — создаёт экземпляр markdown-it с `linkify: true` и `typographer: true`, включает формулы, интеллект-карты, подсветку кода и уведомления согласно параметрам и всегда регистрирует плагины списков задач, ссылок на документы, упоминаний и видео.
- **`render(source)`** — синхронно преобразует исходный текст в строку HTML.
- **`hydrate(container)`** — после вставки HTML в DOM преобразует заполнители интеллект-карт в диаграммы SVG. При отключённых интеллект-картах ничего не делает; ошибки подавляются.

### `function renderMarkdown`

```ts
function renderMarkdown(source: string, options?: RendererOptions): string;
```

Создаёт временный `Renderer` и обрабатывает исходный текст. Если задан `theme`, оборачивает результат в контейнер с темой; сам `Renderer.render` такую оболочку не добавляет. Подходит для отображения Markdown без монтирования редактора.

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

Кнопки используют `mousedown` + `preventDefault`, чтобы редактор не терял фокус и выделение не сворачивалось до выполнения обработчика.

## `StatusBar` и `countText`

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

`StatusBarState` и `StatusBarCallbacks` описывают принимаемые структуры, но не реэкспортируются из главной точки входа.

- **`countText(value)`** — возвращает `charCount` (исходную длину строки) и `wordCount` (число частей, разделённых пробельными символами, после удаления пробелов по краям).
- **`StatusBar.update(state)`** — показывает `chars · words`, число блоков рендеринга и кнопку «Refresh preview» (обновить предпросмотр), которая появляется только при отключённом `autoPreview`.

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

- **`update(source)`** — разбивает исходный текст на блоки, повторно использует кешированные узлы DOM по ключу блока и добавляет их в `DocumentFragment`. Возвращает `{ rerenderedCount, totalCount }`.
- **`getBlockCount()`** — возвращает число блоков последнего обновления.

## Разбиение на блоки

### `splitIntoBlocks`

```ts
function splitIntoBlocks(source: string): SourceBlock[];
```

Разбивает исходный текст по заголовкам ATX с учётом ограждений блоков кода и контейнеров `:::`.

### `interface SourceBlock`

```ts
interface SourceBlock {
  key: string;     // content hash + occurrence index, for DOM reuse
  hash: string;    // content hash for change detection
  source: string;  // original markdown source for this block
}
```

## Утилиты планирования

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

`DebouncedFn` описывает возвращаемое значение, но не реэкспортируется из главной точки входа.

- **`debounce(fn, wait)`** — выполняет вызов после паузы с момента последнего обращения. Возвращаемая функция также предоставляет `.cancel()` и `.flush()`.
- **`adaptiveDebounceMs(docLength, base = 120, max = 600)`** — возвращает `min(max, base + floor(max(0, docLength) / 20000) * 60)`.
- **`scheduleIdle(callback, timeout = 300)`** — использует `requestIdleCallback`, если он доступен, иначе `setTimeout(0)`.
- **`cancelIdle(handle)`** — отменяет запланированный callback периода простоя.

## Значки

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

Каждый значок — встроенная строка SVG размером 16×16, использующая `currentColor`. Применяйте `icons.<name>` как новое значение `icon` в `ToolbarItemOverride`.

## `Popup`, `PopupConfig`, `PopupField`

Плавающая панель, привязанная к кнопке инструментов. Используется внутри библиотеки для диалогов вставки и доступна для собственных расширений.

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

Окно закрывается по щелчку снаружи, нажатию Escape или после успешной отправки.

## Вспомогательные функции мультимедиа

```ts
function extractYouTubeId(input: string): string | null;
function youTubeEmbedMarkdown(videoId: string, alt?: string): string; // alt default 'YouTube video'
function imageMarkdown(url: string, alt?: string): string;             // alt default 'image'
function videoMarkdown(url: string, alt?: string): string;             // alt default 'video'
function isVideoFile(url: string): boolean;
```

- **`extractYouTubeId`** — принимает URL `watch?v=`, `youtu.be/`, `embed/`, `shorts/`, `v/` или отдельный ID из 11 символов; возвращает `null`, если формат не распознан.
- **`youTubeEmbedMarkdown`** — возвращает `[![alt](https://img.youtube.com/vi/<id>/hqdefault.jpg)](https://www.youtube.com/watch?v=<id>)`.
- **`isVideoFile`** — проверяет расширение URL на соответствие `.mp4`, `.webm`, `.ogg`, `.mov`, `.m4v`, `.avi`, `.mkv` после удаления строки запроса.

## Утилиты клавиатуры

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

- **`matchShortcut`** — разбирает комбинацию `Mod`/`Ctrl`/`Alt`/`Shift`/клавиша и сравнивает с `KeyboardEvent`. `Mod` соответствует Meta в macOS и Ctrl в остальных системах.
- **`formatShortcut`** — представляет сочетание текстом, например `Mod-b` → `Ctrl+B` (Windows) или `Cmd+B` (macOS).
- **`formatShortcutHtml`** — создаёт оформленные элементы `<kbd>` с символами клавиш-модификаторов.

## Типы упоминаний

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

## Типы ссылок на документы

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

## Общие типы параметров

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

Значения по умолчанию для всех полей приведены в разделе [Настройка](./configuration.md).

## Подпуть React

Импорт из `@powerduck/md-editor/react`:

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

## Дальнейшие шаги

- [Примеры](./examples.md) — применение API на практике.
- [Возможности](./features.md) — подробности поведения во время работы.
