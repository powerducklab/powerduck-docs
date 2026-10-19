---
sidebar_position: 6
title: "API リファレンス"
description: "このページでは、メインエントリ @powerduck/md-editor とサブパス ./react のすべてのエクスポートを説明します。シグネチャはソースコードに基づいています。"
---

# API リファレンス

このページでは、メインエントリ `@powerduck/md-editor` とサブパス `./react` のすべてのエクスポートを説明します。シグネチャはソースコードに基づいています。

## `MarkdownEditor`

エディターの最上位クラスです。コンテナーとオプションを渡して作成します。

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

- `container: HTMLElement | string` — DOM 要素または CSS セレクター。一致する要素がなければ `MarkdownEditor: mount container not found` をスローします。
- `options?: MarkdownEditorOptions` — [設定](./configuration.md)を参照してください。

レイアウトを構築し、`CodeEditor` を作成してキーボードショートカットを登録します。`complex` モードではツールバーとステータスバーも作成します。作成時に初回レンダリングとステータスバーの更新を実行します。

### `getValue(): string`

現在の Markdown ソースを返します。

### `setValue(value: string): void`

文書全体を置き換え、保留中のデバウンス処理を取り消し、プレビューを同期的に再描画してステータスバーを更新します。

### `getHtml(): string`

内部の `Renderer` で現在のソースを HTML に変換し、文字列を返します。

### `renderNow(): void`

保留中のデバウンス処理を取り消し、プレビューをただちに強制描画します。`autoPreview` が `false` の場合に便利です。

### `setAutoPreview(auto: boolean): void`

編集時のプレビュー自動更新を有効または無効にします。有効にすると現在の値をただちに描画します。

### `setMode(mode: EditorMode): void`

`'simple'` と `'complex'` を切り替えます。必要に応じてツールバーとステータスバーを破棄・再作成し、行番号も切り替えます。モードが同じなら何もしません。

### `setTheme(theme: EditorTheme): void`

ルート要素の `data-theme` を設定し、CodeMirror のハイライト用 compartment を再設定します。ツールバーのテーマ切り替えアイコンも太陽と月の間で切り替えます。

### `focus(): void`

CodeMirror エディターにフォーカスを移します。

### `destroy(): void`

保留中の描画を取り消し、コードエディター、ツールバー、ステータスバー、開いているポップアップ、差分レンダラーを破棄します。コンテナーを空にし、クラスと属性を削除します。エディターのアンマウント時に呼び出してください。

## `CodeEditor`

CodeMirror 6 の `EditorView` を薄くラップしたクラスで、高度な組み込み用途向けに公開されています。通常は `MarkdownEditor` を使用します。

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

`CodeEditorOptions`（メインエントリからは再エクスポートされません）は `value`、`onChange`、`lineNumbers`、`placeholder`、`onImageFile`、`mention`、`docLink`、`theme` を受け取ります。

主なメソッド：

- **`setKeymap(bindings)`** — カスタムキーマップの compartment を、指定した CodeMirror のキーバインドに置き換えます。
- **`insertAtCursor(text)`** — メインの選択範囲にテキストを挿入し、カーソルをその直後に移します。
- **`wrapSelection(prefix, suffix, placeholder)`** — 選択範囲を囲みます。未選択なら `prefix + placeholder + suffix` を挿入し、プレースホルダーを選択します。
- **`wrapLines(prefix, placeholder)`** — 選択した各行、または現在の行の先頭に `prefix` を付けます。
- **`toggleTaskList()`** — 現在の行または選択行の `- [ ]` / `- [x]` マーカーを切り替えます。

## `Renderer` と `renderMarkdown`

### `class Renderer`

```ts
class Renderer {
  readonly md: MarkdownIt;
  constructor(options?: RendererOptions);
  render(source: string): string;
  hydrate(container: HTMLElement): Promise<void>;
}
```

- **`constructor(options?)`** — `linkify: true` と `typographer: true` を指定した markdown-it インスタンスを作成します。数式、マインドマップ、コードハイライト、通知ブロックは条件に応じて有効にし、タスクリスト、文書リンク、メンション、動画のプラグインは常に登録します。
- **`render(source)`** — ソースを同期的に HTML 文字列へ変換します。
- **`hydrate(container)`** — HTML を DOM に挿入した後、マインドマップのプレースホルダーを SVG 図に変換します。マインドマップが無効なら何もしません。エラーは無視されます。

### `function renderMarkdown`

```ts
function renderMarkdown(source: string, options?: RendererOptions): string;
```

一時的な `Renderer` を作成してソースを描画します。`theme` が設定されていれば、テーマ付きコンテナーで結果を囲みます。`Renderer.render` 自体はこのラッパーを追加しません。エディターをマウントせず Markdown を描画する用途に使えます。

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

ボタンでは `mousedown` + `preventDefault` を使い、ハンドラー実行前にエディターのフォーカスや選択範囲が失われるのを防ぎます。

## `StatusBar` と `countText`

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

`StatusBarState` と `StatusBarCallbacks` は受け取るデータ構造を表しますが、メインエントリからは再エクスポートされません。

- **`countText(value)`** — `charCount`（元の文字列長）と `wordCount`（前後の空白を除去してから空白文字で分割したトークン数）を返します。
- **`StatusBar.update(state)`** — `chars · words`、描画ブロック数、および `autoPreview` が無効な場合にのみ表示される「Refresh preview」（プレビュー更新）ボタンを表示します。

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

- **`update(source)`** — ソースをブロックに分け、ブロックキーに基づきキャッシュ済み DOM ノードを再利用して `DocumentFragment` に追加します。`{ rerenderedCount, totalCount }` を返します。
- **`getBlockCount()`** — 直前の更新時のブロック数を返します。

## ブロック分割

### `splitIntoBlocks`

```ts
function splitIntoBlocks(source: string): SourceBlock[];
```

コードフェンスと `:::` コンテナーを考慮しながら、ATX 見出しの位置でソースを分割します。

### `interface SourceBlock`

```ts
interface SourceBlock {
  key: string;     // content hash + occurrence index, for DOM reuse
  hash: string;    // content hash for change detection
  source: string;  // original markdown source for this block
}
```

## スケジューリング用ユーティリティ

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

`DebouncedFn` は戻り値の型を表しますが、メインエントリからは再エクスポートされません。

- **`debounce(fn, wait)`** — 最後の呼び出しから一定時間待って実行します。返される関数には `.cancel()` と `.flush()` もあります。
- **`adaptiveDebounceMs(docLength, base = 120, max = 600)`** — `min(max, base + floor(max(0, docLength) / 20000) * 60)` を返します。
- **`scheduleIdle(callback, timeout = 300)`** — 利用できれば `requestIdleCallback`、なければ `setTimeout(0)` を使います。
- **`cancelIdle(handle)`** — 予約済みのアイドルコールバックを取り消します。

## アイコン

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

各アイコンは `currentColor` を使った 16×16 のインライン SVG 文字列です。`ToolbarItemOverride` の `icon` を上書きする際に `icons.<name>` を使えます。

## `Popup`、`PopupConfig`、`PopupField`

ツールバーボタンを基準に配置するフローティングパネルです。内部では挿入ダイアログに使われ、独自の拡張にも利用できます。

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

外側のクリック、Escape、または送信成功でポップアップが閉じます。

## メディア用ヘルパー

```ts
function extractYouTubeId(input: string): string | null;
function youTubeEmbedMarkdown(videoId: string, alt?: string): string; // alt default 'YouTube video'
function imageMarkdown(url: string, alt?: string): string;             // alt default 'image'
function videoMarkdown(url: string, alt?: string): string;             // alt default 'video'
function isVideoFile(url: string): boolean;
```

- **`extractYouTubeId`** — `watch?v=`、`youtu.be/`、`embed/`、`shorts/`、`v/` の URL、または 11 文字の ID を受け取ります。認識できなければ `null` を返します。
- **`youTubeEmbedMarkdown`** — `[![alt](https://img.youtube.com/vi/<id>/hqdefault.jpg)](https://www.youtube.com/watch?v=<id>)` を返します。
- **`isVideoFile`** — クエリ文字列を除去した URL の拡張子が `.mp4`、`.webm`、`.ogg`、`.mov`、`.m4v`、`.avi`、`.mkv` のいずれかかを調べます。

## キーボード用ユーティリティ

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

- **`matchShortcut`** — `Mod`/`Ctrl`/`Alt`/`Shift`/キーの組み合わせを解析し、`KeyboardEvent` と比較します。`Mod` は macOS では Meta、それ以外では Ctrl に対応します。
- **`formatShortcut`** — ショートカットを文字列にします。例：`Mod-b` → `Ctrl+B`（Windows）または `Cmd+B`（macOS）。
- **`formatShortcutHtml`** — 修飾キーの記号を含む装飾済み `<kbd>` 要素を生成します。

## メンションの型

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

## 文書リンクの型

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

## 共通オプションの型

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

各フィールドの既定値は[設定](./configuration.md)に記載しています。

## React サブパス

`@powerduck/md-editor/react` からインポートします。

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

## 次のステップ

- [使用例](./examples.md) — API の実際の使い方。
- [機能](./features.md) — 実行時の動作の詳細。
