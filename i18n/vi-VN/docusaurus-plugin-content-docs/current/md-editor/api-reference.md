---
sidebar_position: 6
title: "Tham chiếu API"
description: "Trang này mô tả mọi thành phần được xuất từ điểm vào chính @powerduck/md-editor và đường dẫn con ./react. Chữ ký được lấy trực tiếp từ mã nguồn."
---

# Tham chiếu API

Trang này mô tả mọi thành phần được xuất từ điểm vào chính `@powerduck/md-editor` và đường dẫn con `./react`. Chữ ký được lấy trực tiếp từ mã nguồn.

## `MarkdownEditor`

Lớp trình soạn thảo cấp cao nhất. Khởi tạo bằng phần tử chứa và các tùy chọn.

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

- `container: HTMLElement | string` — phần tử DOM hoặc bộ chọn CSS. Nếu không có phần tử phù hợp, ném lỗi `MarkdownEditor: mount container not found`.
- `options?: MarkdownEditorOptions` — xem [Cấu hình](./configuration.md).

Tạo bố cục, khởi tạo `CodeEditor`, kết nối phím tắt và tạo thanh công cụ cùng thanh trạng thái trong chế độ `complex`. Việc khởi tạo thực hiện lần kết xuất đầu tiên và cập nhật thanh trạng thái.

### `getValue(): string`

Trả về mã nguồn Markdown hiện tại.

### `setValue(value: string): void`

Thay toàn bộ tài liệu, hủy lần kết xuất trì hoãn đang chờ, kết xuất lại bản xem trước một cách đồng bộ và cập nhật thanh trạng thái.

### `getHtml(): string`

Kết xuất nguồn hiện tại thành HTML qua `Renderer` nội bộ rồi trả về chuỗi.

### `renderNow(): void`

Hủy lần kết xuất trì hoãn đang chờ và buộc kết xuất bản xem trước ngay lập tức. Hữu ích khi `autoPreview` là `false`.

### `setAutoPreview(auto: boolean): void`

Bật hoặc tắt tự động kết xuất lại bản xem trước khi chỉnh sửa. Khi bật, giá trị hiện tại được kết xuất ngay.

### `setMode(mode: EditorMode): void`

Chuyển giữa `'simple'` và `'complex'`. Hủy và tạo lại thanh công cụ, thanh trạng thái khi cần, đồng thời bật hoặc tắt số dòng. Không làm gì nếu chế độ không đổi.

### `setTheme(theme: EditorTheme): void`

Đặt `data-theme` trên phần tử gốc và cấu hình lại compartment tô sáng của CodeMirror. Đồng thời đổi biểu tượng chuyển giao diện trên thanh công cụ giữa mặt trời và mặt trăng.

### `focus(): void`

Chuyển tiêu điểm đến trình soạn thảo CodeMirror.

### `destroy(): void`

Hủy các lần kết xuất đang chờ, hủy trình soạn thảo mã, thanh công cụ, thanh trạng thái, popup đang mở và bộ kết xuất tăng dần, làm trống phần tử chứa rồi xóa các lớp và thuộc tính. Gọi khi tháo trình soạn thảo khỏi trang.

## `CodeEditor`

Lớp bọc mỏng quanh `EditorView` của CodeMirror 6, được xuất cho các trường hợp nhúng nâng cao. Hầu hết ứng dụng nên dùng `MarkdownEditor`.

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

`CodeEditorOptions` (không được xuất lại từ điểm vào chính) nhận `value`, `onChange`, `lineNumbers`, `placeholder`, `onImageFile`, `mention`, `docLink` và `theme`.

Các phương thức chính:

- **`setKeymap(bindings)`** — thay compartment ánh xạ phím tùy chỉnh bằng các liên kết phím CodeMirror được cung cấp.
- **`insertAtCursor(text)`** — chèn văn bản vào vùng chọn chính và chuyển con trỏ ra sau văn bản đó.
- **`wrapSelection(prefix, suffix, placeholder)`** — bao vùng chọn hiện tại; nếu không có vùng chọn, chèn `prefix + placeholder + suffix` và chọn văn bản giữ chỗ.
- **`wrapLines(prefix, placeholder)`** — thêm `prefix` vào đầu mỗi dòng được chọn hoặc dòng hiện tại.
- **`toggleTaskList()`** — chuyển dấu `- [ ]` / `- [x]` trên dòng hiện tại hoặc các dòng được chọn.

## `Renderer` và `renderMarkdown`

### `class Renderer`

```ts
class Renderer {
  readonly md: MarkdownIt;
  constructor(options?: RendererOptions);
  render(source: string): string;
  hydrate(container: HTMLElement): Promise<void>;
}
```

- **`constructor(options?)`** — tạo phiên bản markdown-it với `linkify: true` và `typographer: true`, bật công thức, sơ đồ tư duy, tô sáng mã và hộp chú thích theo tùy chọn; luôn đăng ký các plugin danh sách công việc, liên kết tài liệu, đề cập và video.
- **`render(source)`** — kết xuất nguồn thành chuỗi HTML một cách đồng bộ.
- **`hydrate(container)`** — sau khi HTML được chèn vào DOM, chuyển phần tử giữ chỗ của sơ đồ tư duy thành sơ đồ SVG. Không làm gì nếu sơ đồ tư duy bị tắt; lỗi được bỏ qua.

### `function renderMarkdown`

```ts
function renderMarkdown(source: string, options?: RendererOptions): string;
```

Tạo `Renderer` tạm thời và kết xuất nguồn. Nếu đặt `theme`, kết quả được bọc trong phần tử chứa có giao diện tương ứng; bản thân `Renderer.render` không thêm lớp bọc này. Dùng để kết xuất Markdown mà không gắn trình soạn thảo.

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

Các nút dùng `mousedown` + `preventDefault` để trình soạn thảo không mất tiêu điểm và vùng chọn không bị thu gọn trước khi hàm xử lý chạy.

## `StatusBar` và `countText`

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

`StatusBarState` và `StatusBarCallbacks` mô tả cấu trúc được chấp nhận nhưng không được xuất lại từ điểm vào chính.

- **`countText(value)`** — trả về `charCount` (độ dài chuỗi gốc) và `wordCount` (số phần tách bằng ký tự trắng sau khi bỏ khoảng trắng ở hai đầu).
- **`StatusBar.update(state)`** — hiển thị `chars · words`, số khối kết xuất và nút “Refresh preview” (làm mới bản xem trước), chỉ xuất hiện khi `autoPreview` tắt.

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

- **`update(source)`** — chia nguồn thành các khối, tái sử dụng nút DOM trong bộ nhớ đệm theo khóa khối và thêm nút vào `DocumentFragment`. Trả về `{ rerenderedCount, totalCount }`.
- **`getBlockCount()`** — trả về số khối trong lần cập nhật gần nhất.

## Chia khối

### `splitIntoBlocks`

```ts
function splitIntoBlocks(source: string): SourceBlock[];
```

Chia nguồn tại các tiêu đề ATX, đồng thời bảo toàn hàng rào mã và vùng chứa `:::`.

### `interface SourceBlock`

```ts
interface SourceBlock {
  key: string;     // content hash + occurrence index, for DOM reuse
  hash: string;    // content hash for change detection
  source: string;  // original markdown source for this block
}
```

## Tiện ích lập lịch

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

`DebouncedFn` mô tả giá trị trả về nhưng không được xuất lại từ điểm vào chính.

- **`debounce(fn, wait)`** — trì hoãn thực thi đến sau khoảng chờ tính từ lần gọi cuối. Hàm trả về còn có `.cancel()` và `.flush()`.
- **`adaptiveDebounceMs(docLength, base = 120, max = 600)`** — trả về `min(max, base + floor(max(0, docLength) / 20000) * 60)`.
- **`scheduleIdle(callback, timeout = 300)`** — dùng `requestIdleCallback` nếu có, nếu không dùng `setTimeout(0)`.
- **`cancelIdle(handle)`** — hủy callback đã lên lịch cho thời gian nhàn rỗi.

## Biểu tượng

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

Mỗi biểu tượng là chuỗi SVG nội tuyến 16×16 dùng `currentColor`. Dùng `icons.<name>` để ghi đè `icon` trong `ToolbarItemOverride`.

## `Popup`, `PopupConfig`, `PopupField`

Bảng nổi neo vào nút trên thanh công cụ, được dùng nội bộ cho hộp thoại chèn và cũng dành cho phần mở rộng tùy chỉnh.

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

Popup đóng khi nhấp bên ngoài, nhấn Escape hoặc gửi thành công.

## Hàm hỗ trợ đa phương tiện

```ts
function extractYouTubeId(input: string): string | null;
function youTubeEmbedMarkdown(videoId: string, alt?: string): string; // alt default 'YouTube video'
function imageMarkdown(url: string, alt?: string): string;             // alt default 'image'
function videoMarkdown(url: string, alt?: string): string;             // alt default 'video'
function isVideoFile(url: string): boolean;
```

- **`extractYouTubeId`** — nhận URL `watch?v=`, `youtu.be/`, `embed/`, `shorts/`, `v/` hoặc ID thuần 11 ký tự; trả về `null` nếu không nhận diện được.
- **`youTubeEmbedMarkdown`** — trả về `[![alt](https://img.youtube.com/vi/<id>/hqdefault.jpg)](https://www.youtube.com/watch?v=<id>)`.
- **`isVideoFile`** — sau khi bỏ chuỗi truy vấn, kiểm tra phần mở rộng URL có phải `.mp4`, `.webm`, `.ogg`, `.mov`, `.m4v`, `.avi` hoặc `.mkv` hay không.

## Tiện ích bàn phím

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

- **`matchShortcut`** — phân tích tổ hợp `Mod`/`Ctrl`/`Alt`/`Shift`/phím và so sánh với `KeyboardEvent`. `Mod` tương ứng Meta trên macOS và Ctrl trên các hệ thống khác.
- **`formatShortcut`** — biểu diễn phím tắt thành văn bản, ví dụ `Mod-b` → `Ctrl+B` (Windows) hoặc `Cmd+B` (macOS).
- **`formatShortcutHtml`** — tạo phần tử `<kbd>` có định dạng kèm ký hiệu phím bổ trợ.

## Kiểu dữ liệu đề cập

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

## Kiểu dữ liệu liên kết tài liệu

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

## Kiểu tùy chọn dùng chung

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

Giá trị mặc định của từng trường được trình bày trong [Cấu hình](./configuration.md).

## Đường dẫn con React

Nhập từ `@powerduck/md-editor/react`:

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

## Bước tiếp theo

- [Ví dụ](./examples.md) — cách dùng các API trong thực tế.
- [Tính năng](./features.md) — chi tiết hành vi khi chạy.
