---
sidebar_position: 6
title: "API 參考"
description: "本頁介紹主入口 @powerduck/md-editor 與 ./react 子路徑的所有匯出，簽章直接依據原始碼整理。"
---

# API 參考

本頁介紹主入口 `@powerduck/md-editor` 與 `./react` 子路徑的所有匯出，簽章直接依據原始碼整理。

## `MarkdownEditor`

頂層編輯器類別，建構時傳入容器與選項。

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

- `container: HTMLElement | string` — DOM 元素或 CSS 選擇器。找不到符合的元素時擲出 `MarkdownEditor: mount container not found`。
- `options?: MarkdownEditorOptions` — 請參閱[設定](./configuration.md)。

建立版面配置、建立 `CodeEditor`、綁定鍵盤快捷鍵，並在 `complex` 模式下建立工具列與狀態列。建構時執行初始渲染及狀態列更新。

### `getValue(): string`

回傳目前的 Markdown 原始碼。

### `setValue(value: string): void`

取代整份文件，取消待執行的防抖渲染，同步重新渲染預覽並更新狀態列。

### `getHtml(): string`

透過內部的 `Renderer` 將目前原始碼渲染為 HTML 並回傳字串。

### `renderNow(): void`

取消待執行的防抖渲染，立即強制重新渲染預覽，適用於 `autoPreview` 為 `false` 時。

### `setAutoPreview(auto: boolean): void`

啟用或停用編輯時自動重新渲染預覽。啟用後立即渲染目前內容。

### `setMode(mode: EditorMode): void`

在 `'simple'` 與 `'complex'` 之間切換，視需要銷毀並重建工具列及狀態列，同時切換行號。模式不變時不執行任何動作。

### `setTheme(theme: EditorTheme): void`

設定根元素的 `data-theme` 並重新設定 CodeMirror 的語法突顯設定區，同時將工具列的主題切換圖示在太陽與月亮之間切換。

### `focus(): void`

將焦點移至 CodeMirror 編輯器。

### `destroy(): void`

取消待執行的渲染，銷毀程式碼編輯器、工具列、狀態列、目前彈出視窗與增量渲染器，清空容器並移除類別名稱及屬性。卸載編輯器時應呼叫此方法。

## `CodeEditor`

對 CodeMirror 6 `EditorView` 的輕量封裝，供進階嵌入情境使用。大多數使用者應直接使用 `MarkdownEditor`。

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

`CodeEditorOptions`（未從主入口重新匯出）接受 `value`、`onChange`、`lineNumbers`、`placeholder`、`onImageFile`、`mention`、`docLink` 與 `theme`。

主要方法：

- **`setKeymap(bindings)`** — 以指定的 CodeMirror 按鍵綁定取代自訂鍵位設定區。
- **`insertAtCursor(text)`** — 在主要選取範圍插入文字，並將游標移至插入內容之後。
- **`wrapSelection(prefix, suffix, placeholder)`** — 包住目前選取範圍；沒有選取文字時插入 `prefix + placeholder + suffix`，並選取預留文字。
- **`wrapLines(prefix, placeholder)`** — 為每個選取行（或目前行）加上 `prefix` 前綴。
- **`toggleTaskList()`** — 切換目前行或選取行的 `- [ ]` / `- [x]` 標記。

## `Renderer` 與 `renderMarkdown`

### `class Renderer`

```ts
class Renderer {
  readonly md: MarkdownIt;
  constructor(options?: RendererOptions);
  render(source: string): string;
  hydrate(container: HTMLElement): Promise<void>;
}
```

- **`constructor(options?)`** — 建立啟用 `linkify: true` 與 `typographer: true` 的 markdown-it 實例，依條件啟用數學公式、心智圖、程式碼突顯及提示區塊，並一律註冊工作清單、文件連結、提及及影片外掛。
- **`render(source)`** — 同步將原始碼渲染為 HTML 字串。
- **`hydrate(container)`** — HTML 插入 DOM 後，將心智圖預留位置啟用為 SVG 圖形。停用心智圖時不執行動作；錯誤會被忽略。

### `function renderMarkdown`

```ts
function renderMarkdown(source: string, options?: RendererOptions): string;
```

建立暫時的 `Renderer` 並渲染原始碼。設定 `theme` 時會為結果加上具有主題的容器；`Renderer.render` 本身不會加上這層容器。適合在不掛載編輯器的情況下渲染 Markdown。

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

按鈕使用 `mousedown` + `preventDefault`，避免處理函式執行前編輯器失去焦點並收合選取範圍。

## `StatusBar` 與 `countText`

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

`StatusBarState` 與 `StatusBarCallbacks` 描述接受的資料結構，但未從主入口重新匯出。

- **`countText(value)`** — 回傳 `charCount`（原始字串長度）與 `wordCount`（去除首尾空白後，以空白分隔的詞元數量）。
- **`StatusBar.update(state)`** — 顯示 `chars · words`、渲染區塊數量，以及僅在關閉 `autoPreview` 時顯示的「Refresh preview」（重新整理預覽）按鈕。

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

- **`update(source)`** — 將原始碼分塊，依區塊鍵重用快取的 DOM 節點，並將節點附加至 `DocumentFragment`。回傳 `{ rerenderedCount, totalCount }`。
- **`getBlockCount()`** — 回傳最近一次更新的區塊數量。

## 區塊分割

### `splitIntoBlocks`

```ts
function splitIntoBlocks(source: string): SourceBlock[];
```

依 ATX 標題分割原始碼，同時保留程式碼圍欄與 `:::` 容器。

### `interface SourceBlock`

```ts
interface SourceBlock {
  key: string;     // content hash + occurrence index, for DOM reuse
  hash: string;    // content hash for change detection
  source: string;  // original markdown source for this block
}
```

## 排程工具

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

`DebouncedFn` 描述回傳值，但未從主入口重新匯出。

- **`debounce(fn, wait)`** — 尾端觸發的防抖處理。回傳函式也提供 `.cancel()` 與 `.flush()`。
- **`adaptiveDebounceMs(docLength, base = 120, max = 600)`** — 回傳 `min(max, base + floor(max(0, docLength) / 20000) * 60)`。
- **`scheduleIdle(callback, timeout = 300)`** — 可用時使用 `requestIdleCallback`，否則使用 `setTimeout(0)`。
- **`cancelIdle(handle)`** — 取消已排程的閒置回呼。

## 圖示

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

每個圖示都是使用 `currentColor` 的 16×16 行內 SVG 字串。可將 `icons.<name>` 用作 `ToolbarItemOverride` 的 `icon` 覆寫值。

## `Popup`、`PopupConfig`、`PopupField`

錨定至工具列按鈕的浮動面板，內部用於插入對話方塊，也可供自訂擴充使用。

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

點擊外部、按下 Escape 或成功提交後關閉彈出視窗。

## 媒體輔助函式

```ts
function extractYouTubeId(input: string): string | null;
function youTubeEmbedMarkdown(videoId: string, alt?: string): string; // alt default 'YouTube video'
function imageMarkdown(url: string, alt?: string): string;             // alt default 'image'
function videoMarkdown(url: string, alt?: string): string;             // alt default 'video'
function isVideoFile(url: string): boolean;
```

- **`extractYouTubeId`** — 接受 `watch?v=`、`youtu.be/`、`embed/`、`shorts/`、`v/` URL 或原始的 11 字元 ID；無法辨識時回傳 `null`。
- **`youTubeEmbedMarkdown`** — 回傳 `[![alt](https://img.youtube.com/vi/<id>/hqdefault.jpg)](https://www.youtube.com/watch?v=<id>)`。
- **`isVideoFile`** — 移除查詢字串後，檢查 URL 副檔名是否為 `.mp4`、`.webm`、`.ogg`、`.mov`、`.m4v`、`.avi` 或 `.mkv`。

## 鍵盤工具

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

- **`matchShortcut`** — 解析 `Mod`/`Ctrl`/`Alt`/`Shift`/按鍵組合，並與 `KeyboardEvent` 比較。`Mod` 在 macOS 上對應 Meta，在其他系統上對應 Ctrl。
- **`formatShortcut`** — 將快捷鍵格式化為文字，例如 `Mod-b` → `Ctrl+B`（Windows）或 `Cmd+B`（macOS）。
- **`formatShortcutHtml`** — 輸出帶有修飾鍵符號及樣式的 `<kbd>` 元素。

## 提及類型

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

## 文件連結類型

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

## 共用選項類型

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

各欄位的完整預設值請參閱[設定](./configuration.md)。

## React 子路徑

從 `@powerduck/md-editor/react` 匯入：

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

## 後續步驟

- [範例](./examples.md) — 查看這些 API 的實際用法。
- [功能](./features.md) — 瞭解執行階段行為。
