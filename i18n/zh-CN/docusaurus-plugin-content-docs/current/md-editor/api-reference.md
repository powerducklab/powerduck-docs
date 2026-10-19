---
sidebar_position: 6
title: "API 参考"
description: "本页介绍主入口 @powerduck/md-editor 和 ./react 子路径的全部导出，签名直接依据源码整理。"
---

# API 参考

本页介绍主入口 `@powerduck/md-editor` 和 `./react` 子路径的全部导出，签名直接依据源码整理。

## `MarkdownEditor`

顶层编辑器类，构造时传入容器和选项。

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

- `container: HTMLElement | string` — DOM 元素或 CSS 选择器。没有匹配元素时抛出 `MarkdownEditor: mount container not found`。
- `options?: MarkdownEditorOptions` — 参见[配置](./configuration.md)。

构建布局、创建 `CodeEditor`、绑定键盘快捷键，并在 `complex` 模式下创建工具栏和状态栏。构造时执行初始渲染和状态栏更新。

### `getValue(): string`

返回当前 Markdown 源码。

### `setValue(value: string): void`

替换整个文档，取消待执行的防抖渲染，同步重新渲染预览并刷新状态栏。

### `getHtml(): string`

通过内部 `Renderer` 将当前源码渲染为 HTML 并返回字符串。

### `renderNow(): void`

取消待执行的防抖渲染并立即强制刷新预览，适用于 `autoPreview` 为 `false` 的情况。

### `setAutoPreview(auto: boolean): void`

启用或禁用编辑时自动刷新预览。启用后立即渲染当前内容。

### `setMode(mode: EditorMode): void`

在 `'simple'` 和 `'complex'` 之间切换，按需销毁和重建工具栏、状态栏，并切换行号。模式未改变时不执行操作。

### `setTheme(theme: EditorTheme): void`

设置根元素的 `data-theme` 并重新配置 CodeMirror 高亮配置区，同时将工具栏的主题切换图标在太阳和月亮之间切换。

### `focus(): void`

将焦点移至 CodeMirror 编辑器。

### `destroy(): void`

取消待执行的渲染，销毁代码编辑器、工具栏、状态栏、当前弹窗及增量渲染器，清空容器并移除类名和属性。卸载编辑器时应调用此方法。

## `CodeEditor`

对 CodeMirror 6 `EditorView` 的轻量封装，供高级嵌入场景使用。多数使用者应直接使用 `MarkdownEditor`。

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

`CodeEditorOptions`（未从主入口重新导出）接受 `value`、`onChange`、`lineNumbers`、`placeholder`、`onImageFile`、`mention`、`docLink` 和 `theme`。

主要方法：

- **`setKeymap(bindings)`** — 使用给定的 CodeMirror 按键绑定替换自定义键位配置区。
- **`insertAtCursor(text)`** — 在主选区插入文本，并将光标移到插入内容之后。
- **`wrapSelection(prefix, suffix, placeholder)`** — 包裹当前选区；未选中文本时插入 `prefix + placeholder + suffix`，并选中占位文本。
- **`wrapLines(prefix, placeholder)`** — 为每个选中行（或当前行）添加 `prefix` 前缀。
- **`toggleTaskList()`** — 切换当前行或选中行的 `- [ ]` / `- [x]` 标记。

## `Renderer` 和 `renderMarkdown`

### `class Renderer`

```ts
class Renderer {
  readonly md: MarkdownIt;
  constructor(options?: RendererOptions);
  render(source: string): string;
  hydrate(container: HTMLElement): Promise<void>;
}
```

- **`constructor(options?)`** — 创建启用了 `linkify: true` 和 `typographer: true` 的 markdown-it 实例，按条件启用数学公式、思维导图、代码高亮和提示块，并始终注册任务列表、文档链接、提及和视频插件。
- **`render(source)`** — 同步将源码渲染为 HTML 字符串。
- **`hydrate(container)`** — HTML 插入 DOM 后，将思维导图占位符激活为 SVG 图形。禁用思维导图时不执行操作；错误会被忽略。

### `function renderMarkdown`

```ts
function renderMarkdown(source: string, options?: RendererOptions): string;
```

创建临时 `Renderer` 并渲染源码。设置 `theme` 时会为结果添加带主题的容器；`Renderer.render` 本身不会添加该容器。可用于不挂载编辑器的 Markdown 渲染。

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

按钮使用 `mousedown` + `preventDefault`，避免处理器运行前编辑器失去焦点、选区被折叠。

## `StatusBar` 和 `countText`

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

`StatusBarState` 和 `StatusBarCallbacks` 描述接受的数据结构，但未从主入口重新导出。

- **`countText(value)`** — 返回 `charCount`（原始字符串长度）和 `wordCount`（去除首尾空白后按空白分隔的词元数量）。
- **`StatusBar.update(state)`** — 显示 `chars · words`、渲染块数量，以及仅在关闭 `autoPreview` 时显示的“Refresh preview”（刷新预览）按钮。

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

- **`update(source)`** — 将源码分块，根据块键复用缓存的 DOM 节点，并将节点追加到 `DocumentFragment`。返回 `{ rerenderedCount, totalCount }`。
- **`getBlockCount()`** — 返回最近一次更新的块数量。

## 分块

### `splitIntoBlocks`

```ts
function splitIntoBlocks(source: string): SourceBlock[];
```

按 ATX 标题分割源码，同时保留代码围栏和 `:::` 容器。

### `interface SourceBlock`

```ts
interface SourceBlock {
  key: string;     // content hash + occurrence index, for DOM reuse
  hash: string;    // content hash for change detection
  source: string;  // original markdown source for this block
}
```

## 调度工具

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

`DebouncedFn` 描述返回值，但未从主入口重新导出。

- **`debounce(fn, wait)`** — 尾沿防抖。返回的函数还提供 `.cancel()` 和 `.flush()`。
- **`adaptiveDebounceMs(docLength, base = 120, max = 600)`** — 返回 `min(max, base + floor(max(0, docLength) / 20000) * 60)`。
- **`scheduleIdle(callback, timeout = 300)`** — 可用时使用 `requestIdleCallback`，否则使用 `setTimeout(0)`。
- **`cancelIdle(handle)`** — 取消已安排的空闲回调。

## 图标

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

每个图标都是使用 `currentColor` 的 16×16 内联 SVG 字符串。可将 `icons.<name>` 用作 `ToolbarItemOverride` 的 `icon` 覆盖值。

## `Popup`、`PopupConfig`、`PopupField`

锚定到工具栏按钮的浮动面板，内部用于插入对话框，也可用于自定义扩展。

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

点击外部、按 Escape 或成功提交后关闭弹窗。

## 媒体辅助函数

```ts
function extractYouTubeId(input: string): string | null;
function youTubeEmbedMarkdown(videoId: string, alt?: string): string; // alt default 'YouTube video'
function imageMarkdown(url: string, alt?: string): string;             // alt default 'image'
function videoMarkdown(url: string, alt?: string): string;             // alt default 'video'
function isVideoFile(url: string): boolean;
```

- **`extractYouTubeId`** — 接受 `watch?v=`、`youtu.be/`、`embed/`、`shorts/`、`v/` URL 或原始的 11 字符 ID；无法识别时返回 `null`。
- **`youTubeEmbedMarkdown`** — 返回 `[![alt](https://img.youtube.com/vi/<id>/hqdefault.jpg)](https://www.youtube.com/watch?v=<id>)`。
- **`isVideoFile`** — 去除查询字符串后，检查 URL 扩展名是否为 `.mp4`、`.webm`、`.ogg`、`.mov`、`.m4v`、`.avi` 或 `.mkv`。

## 键盘工具

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

- **`matchShortcut`** — 解析 `Mod`/`Ctrl`/`Alt`/`Shift`/按键组合，并与 `KeyboardEvent` 比较。`Mod` 在 macOS 上对应 Meta，在其他系统上对应 Ctrl。
- **`formatShortcut`** — 将快捷键格式化为文本，例如 `Mod-b` → `Ctrl+B`（Windows）或 `Cmd+B`（macOS）。
- **`formatShortcutHtml`** — 输出带修饰键符号和样式的 `<kbd>` 元素。

## 提及类型

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

## 文档链接类型

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

## 共享选项类型

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

逐字段的默认值详见[配置](./configuration.md)。

## React 子路径

从 `@powerduck/md-editor/react` 导入：

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

## 后续步骤

- [示例](./examples.md) — 查看这些 API 的实际用法。
- [功能](./features.md) — 了解运行时行为。
