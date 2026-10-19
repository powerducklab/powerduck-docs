---
sidebar_position: 6
title: "مرجع API"
description: "توثّق هذه الصفحة جميع التصديرات من نقطة الدخول الرئيسية @powerduck/md-editor ومن المسار الفرعي ./react. التواقيع مأخوذة مباشرةً من الشيفرة المصدرية."
---

# مرجع API

توثّق هذه الصفحة جميع التصديرات من نقطة الدخول الرئيسية `@powerduck/md-editor` ومن المسار الفرعي `./react`. التواقيع مأخوذة مباشرةً من الشيفرة المصدرية.

## `MarkdownEditor`

فئة المحرر الرئيسية. أنشئها بتمرير حاوية وخيارات.

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

- `container: HTMLElement | string` — عنصر DOM أو محدِّد CSS. إذا لم يوجد عنصر مطابق، يُرمى الخطأ `MarkdownEditor: mount container not found`.
- `options?: MarkdownEditorOptions` — راجع [الإعدادات](./configuration.md).

يبني التخطيط، وينشئ `CodeEditor`، ويربط اختصارات لوحة المفاتيح، وينشئ شريط الأدوات وشريط الحالة في وضع `complex`. يُنفَّذ العرض الأولي وتحديث شريط الحالة عند الإنشاء.

### `getValue(): string`

يعيد مصدر Markdown الحالي.

### `setValue(value: string): void`

يستبدل المستند بأكمله، ويلغي أي عرض مؤجل ينتظر التنفيذ، ويعيد عرض المعاينة بصورة متزامنة، ويحدّث شريط الحالة.

### `getHtml(): string`

يحوّل المصدر الحالي إلى HTML عبر `Renderer` الداخلي ويعيد السلسلة النصية.

### `renderNow(): void`

يلغي أي عرض مؤجل ينتظر التنفيذ ويفرض عرض المعاينة فورًا. مفيد عندما تكون `autoPreview` مساوية لـ `false`.

### `setAutoPreview(auto: boolean): void`

يُفعّل أو يعطّل إعادة عرض المعاينة تلقائيًا عند التحرير. يؤدي التفعيل إلى عرض القيمة الحالية فورًا.

### `setMode(mode: EditorMode): void`

يبدّل بين `'simple'` و`'complex'`. يهدم شريط الأدوات وشريط الحالة ويعيد إنشاءهما عند الحاجة، ويبدّل عرض أرقام الأسطر. لا يفعل شيئًا إذا لم يتغير الوضع.

### `setTheme(theme: EditorTheme): void`

يضبط `data-theme` على العنصر الجذر ويعيد تهيئة قسم التمييز في CodeMirror. ويبدّل أيضًا أيقونة السمة بين الشمس والقمر في شريط الأدوات.

### `focus(): void`

ينقل التركيز إلى محرر CodeMirror.

### `destroy(): void`

يلغي عمليات العرض المعلّقة، ويهدم محرر الشيفرة وشريط الأدوات وشريط الحالة والنافذة النشطة والعارض التزايدي، ويفرغ الحاوية ويزيل الفئات والسمات. استدعِه عند إزالة المحرر من الصفحة.

## `CodeEditor`

غلاف خفيف حول `EditorView` من CodeMirror 6، مُصدَّر لحالات التضمين المتقدمة. يكفي لمعظم المستخدمين استعمال `MarkdownEditor`.

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

يقبل `CodeEditorOptions`، غير المعاد تصديره من نقطة الدخول الرئيسية، الخيارات `value` و`onChange` و`lineNumbers` و`placeholder` و`onImageFile` و`mention` و`docLink` و`theme`.

الأساليب الرئيسية:

- **`setKeymap(bindings)`** — يستبدل قسم اختصارات المفاتيح المخصص بربط مفاتيح CodeMirror المقدم.
- **`insertAtCursor(text)`** — يُدرج النص في التحديد الرئيسي وينقل المؤشر إلى ما بعده.
- **`wrapSelection(prefix, suffix, placeholder)`** — يحيط بالتحديد الحالي؛ وإذا لم يوجد تحديد، يُدرج `prefix + placeholder + suffix` ويحدد النص النائب.
- **`wrapLines(prefix, placeholder)`** — يضيف `prefix` إلى بداية كل سطر محدد أو السطر الحالي.
- **`toggleTaskList()`** — يبدّل علامتي `- [ ]` / `- [x]` في السطر الحالي أو الأسطر المحددة.

## `Renderer` و`renderMarkdown`

### `class Renderer`

```ts
class Renderer {
  readonly md: MarkdownIt;
  constructor(options?: RendererOptions);
  render(source: string): string;
  hydrate(container: HTMLElement): Promise<void>;
}
```

- **`constructor(options?)`** — ينشئ مثيل markdown-it مع `linkify: true` و`typographer: true`، ويُفعّل الصيغ والخرائط الذهنية وتمييز الشيفرة والتنبيهات وفق الخيارات، ويسجّل دائمًا إضافات قوائم المهام وروابط المستندات والإشارات والفيديو.
- **`render(source)`** — يحوّل المصدر إلى سلسلة HTML بصورة متزامنة.
- **`hydrate(container)`** — بعد إدراج HTML في DOM، يحوّل العناصر النائبة للخرائط الذهنية إلى مخططات SVG. لا يفعل شيئًا إذا كانت الخرائط الذهنية معطّلة؛ تُتجاهَل الأخطاء.

### `function renderMarkdown`

```ts
function renderMarkdown(source: string, options?: RendererOptions): string;
```

ينشئ `Renderer` مؤقتًا ويعرض المصدر. عند ضبط `theme`، يغلّف النتيجة بحاوية ذات سمة؛ لا يضيف `Renderer.render` هذا الغلاف بنفسه. استخدمه لعرض Markdown دون إنشاء محرر في الصفحة.

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

تستخدم الأزرار `mousedown` + `preventDefault` لمنع فقدان تركيز المحرر وانهيار التحديد قبل تشغيل المعالج.

## `StatusBar` و`countText`

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

يصف `StatusBarState` و`StatusBarCallbacks` البنى المقبولة، لكن لا يُعاد تصديرهما من نقطة الدخول الرئيسية.

- **`countText(value)`** — يعيد `charCount` (طول السلسلة الأصلي) و`wordCount` (عدد الأجزاء المفصولة بمحارف بيضاء بعد إزالة الفراغات من الطرفين).
- **`StatusBar.update(state)`** — يعرض `chars · words` وعدد كتل العرض وزر «Refresh preview» (تحديث المعاينة) الذي لا يظهر إلا عند تعطيل `autoPreview`.

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

- **`update(source)`** — يقسّم المصدر إلى كتل، ويعيد استخدام عقد DOM المخزنة مؤقتًا حسب مفتاح الكتلة، ويضيف العقد إلى `DocumentFragment`. يعيد `{ rerenderedCount, totalCount }`.
- **`getBlockCount()`** — يعيد عدد الكتل في آخر تحديث.

## تقسيم الكتل

### `splitIntoBlocks`

```ts
function splitIntoBlocks(source: string): SourceBlock[];
```

يقسّم المصدر عند عناوين ATX مع مراعاة أسوار الشيفرة وحاويات `:::`.

### `interface SourceBlock`

```ts
interface SourceBlock {
  key: string;     // content hash + occurrence index, for DOM reuse
  hash: string;    // content hash for change detection
  source: string;  // original markdown source for this block
}
```

## أدوات الجدولة

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

يصف `DebouncedFn` القيمة المعادة، لكن لا يُعاد تصديره من نقطة الدخول الرئيسية.

- **`debounce(fn, wait)`** — يؤخّر التنفيذ حتى انتهاء المهلة بعد آخر استدعاء. توفّر الدالة المعادة أيضًا `.cancel()` و`.flush()`.
- **`adaptiveDebounceMs(docLength, base = 120, max = 600)`** — يعيد `min(max, base + floor(max(0, docLength) / 20000) * 60)`.
- **`scheduleIdle(callback, timeout = 300)`** — يستخدم `requestIdleCallback` عند توفره، وإلا يستخدم `setTimeout(0)`.
- **`cancelIdle(handle)`** — يلغي رد النداء المجدول لفترة الخمول.

## الأيقونات

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

كل أيقونة سلسلة SVG مضمّنة بحجم 16×16 تستخدم `currentColor`. استخدم `icons.<name>` لتجاوز `icon` في `ToolbarItemOverride`.

## `Popup` و`PopupConfig` و`PopupField`

لوحة عائمة مرتبطة بزر في شريط الأدوات، تُستخدم داخليًا لنوافذ الإدراج ومتاحة للامتدادات المخصصة.

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

تُغلَق النافذة عند النقر خارجها أو ضغط Escape أو نجاح الإرسال.

## دوال الوسائط المساعدة

```ts
function extractYouTubeId(input: string): string | null;
function youTubeEmbedMarkdown(videoId: string, alt?: string): string; // alt default 'YouTube video'
function imageMarkdown(url: string, alt?: string): string;             // alt default 'image'
function videoMarkdown(url: string, alt?: string): string;             // alt default 'video'
function isVideoFile(url: string): boolean;
```

- **`extractYouTubeId`** — يقبل عناوين URL بصيغ `watch?v=` و`youtu.be/` و`embed/` و`shorts/` و`v/`، أو معرّفًا مجردًا من 11 محرفًا؛ يعيد `null` إذا لم يتعرّف عليه.
- **`youTubeEmbedMarkdown`** — يعيد `[![alt](https://img.youtube.com/vi/<id>/hqdefault.jpg)](https://www.youtube.com/watch?v=<id>)`.
- **`isVideoFile`** — يتحقق من امتداد URL مقابل `.mp4` و`.webm` و`.ogg` و`.mov` و`.m4v` و`.avi` و`.mkv` بعد إزالة سلسلة الاستعلام.

## أدوات لوحة المفاتيح

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

- **`matchShortcut`** — يحلّل تركيبة `Mod`/`Ctrl`/`Alt`/`Shift`/مفتاح ويقارنها مع `KeyboardEvent`. يقابل `Mod` مفتاح Meta على macOS وCtrl على الأنظمة الأخرى.
- **`formatShortcut`** — ينسّق الاختصار كنص، مثل `Mod-b` → `Ctrl+B` على Windows أو `Cmd+B` على macOS.
- **`formatShortcutHtml`** — ينتج عناصر `<kbd>` منسّقة تتضمن رموز مفاتيح التعديل.

## أنواع الإشارات

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

## أنواع روابط المستندات

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

## أنواع الخيارات المشتركة

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

تتوفر القيم الافتراضية لكل حقل في صفحة [الإعدادات](./configuration.md).

## المسار الفرعي لـ React

الاستيراد من `@powerduck/md-editor/react`:

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

## الخطوات التالية

- [أمثلة](./examples.md) — استخدام واجهات API عمليًا.
- [الميزات](./features.md) — تفاصيل السلوك أثناء التشغيل.
