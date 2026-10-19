---
sidebar_position: 6
title: "API başvurusu"
description: "Bu sayfa, @powerduck/md-editor ana girişinden ve ./react alt yolundan yapılan tüm dışa aktarımları belgeler. İmzalar doğrudan kaynak koddan alınmıştır."
---

# API başvurusu

Bu sayfa, `@powerduck/md-editor` ana girişinden ve `./react` alt yolundan yapılan tüm dışa aktarımları belgeler. İmzalar doğrudan kaynak koddan alınmıştır.

## `MarkdownEditor`

Üst düzey düzenleyici sınıfıdır. Bir kapsayıcı ve seçeneklerle oluşturulur.

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

- `container: HTMLElement | string` — DOM öğesi veya CSS seçicisi. Eşleşen öğe yoksa `MarkdownEditor: mount container not found` hatasını fırlatır.
- `options?: MarkdownEditorOptions` — [Yapılandırma](./configuration.md) bölümüne bakın.

Yerleşimi kurar, `CodeEditor` oluşturur, klavye kısayollarını bağlar ve `complex` modunda araç çubuğuyla durum çubuğunu oluşturur. Oluşturulurken ilk render ve durum çubuğu güncellemesi çalışır.

### `getValue(): string`

Geçerli Markdown kaynağını döndürür.

### `setValue(value: string): void`

Belgenin tamamını değiştirir, bekleyen gecikmeli render işlemini iptal eder, önizlemeyi eşzamanlı olarak yeniden oluşturur ve durum çubuğunu günceller.

### `getHtml(): string`

Geçerli kaynağı iç `Renderer` aracılığıyla HTML'e dönüştürür ve dizeyi döndürür.

### `renderNow(): void`

Bekleyen gecikmeli render işlemini iptal eder ve önizlemeyi hemen zorla oluşturur. `autoPreview` değeri `false` olduğunda kullanışlıdır.

### `setAutoPreview(auto: boolean): void`

Düzenleme sırasında önizlemenin otomatik yenilenmesini açar veya kapatır. Açıldığında geçerli değer hemen oluşturulur.

### `setMode(mode: EditorMode): void`

`'simple'` ile `'complex'` arasında geçiş yapar. Araç çubuğu ve durum çubuğunu gerektiğinde yok edip yeniden oluşturur; satır numaralarını açar veya kapatır. Mod değişmediyse işlem yapmaz.

### `setTheme(theme: EditorTheme): void`

Kök öğede `data-theme` değerini ayarlar ve CodeMirror vurgulama bölmesini yeniden yapılandırır. Araç çubuğundaki tema simgesini de güneş ve ay arasında değiştirir.

### `focus(): void`

Odağı CodeMirror düzenleyicisine taşır.

### `destroy(): void`

Bekleyen render işlemlerini iptal eder; kod düzenleyicisini, araç çubuğunu, durum çubuğunu, etkin açılır paneli ve artımlı oluşturucuyu yok eder. Kapsayıcıyı boşaltır, sınıfları ve öznitelikleri kaldırır. Düzenleyiciyi kaldırırken çağırın.

## `CodeEditor`

Gelişmiş gömme senaryoları için dışa aktarılan, CodeMirror 6 `EditorView` üzerinde ince bir sarmalayıcıdır. Çoğu kullanıcı bunun yerine `MarkdownEditor` kullanır.

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

Ana girişten yeniden dışa aktarılmayan `CodeEditorOptions`; `value`, `onChange`, `lineNumbers`, `placeholder`, `onImageFile`, `mention`, `docLink` ve `theme` seçeneklerini kabul eder.

Temel yöntemler:

- **`setKeymap(bindings)`** — özel tuş haritası bölmesini verilen CodeMirror tuş bağlamalarıyla değiştirir.
- **`insertAtCursor(text)`** — ana seçime metin ekler ve imleci metnin sonuna taşır.
- **`wrapSelection(prefix, suffix, placeholder)`** — geçerli seçimi sarar; seçim yoksa `prefix + placeholder + suffix` ekler ve yer tutucuyu seçer.
- **`wrapLines(prefix, placeholder)`** — seçili her satırın veya geçerli satırın başına `prefix` ekler.
- **`toggleTaskList()`** — geçerli ya da seçili satırlardaki `- [ ]` / `- [x]` işaretlerini değiştirir.

## `Renderer` ve `renderMarkdown`

### `class Renderer`

```ts
class Renderer {
  readonly md: MarkdownIt;
  constructor(options?: RendererOptions);
  render(source: string): string;
  hydrate(container: HTMLElement): Promise<void>;
}
```

- **`constructor(options?)`** — `linkify: true` ve `typographer: true` ile markdown-it örneği oluşturur. Formülleri, zihin haritalarını, kod vurgulamayı ve bilgi kutularını seçeneklere göre açar; görev listesi, belge bağlantısı, bahsetme ve video eklentilerini her zaman kaydeder.
- **`render(source)`** — kaynağı eşzamanlı olarak HTML dizesine dönüştürür.
- **`hydrate(container)`** — HTML DOM'a eklendikten sonra zihin haritası yer tutucularını SVG diyagramlarına dönüştürür. Zihin haritaları kapalıysa işlem yapmaz; hatalar yutulur.

### `function renderMarkdown`

```ts
function renderMarkdown(source: string, options?: RendererOptions): string;
```

Geçici bir `Renderer` oluşturur ve kaynağı işler. `theme` ayarlandığında sonucu temalı bir kapsayıcıyla sarar; `Renderer.render` bu sarmalayıcıyı kendisi eklemez. Düzenleyici bağlamadan Markdown oluşturmak için kullanın.

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

Düğmeler `mousedown` + `preventDefault` kullanır; böylece işleyici çalışmadan önce düzenleyici odağı kaybetmez ve seçim kapanmaz.

## `StatusBar` ve `countText`

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

`StatusBarState` ve `StatusBarCallbacks` kabul edilen veri yapılarını açıklar, ancak ana girişten yeniden dışa aktarılmaz.

- **`countText(value)`** — `charCount` (ham dize uzunluğu) ve `wordCount` (uçlardaki boşluklar temizlendikten sonra boşluk karakterleriyle ayrılan öğe sayısı) döndürür.
- **`StatusBar.update(state)`** — `chars · words`, render bloğu sayısı ve yalnızca `autoPreview` kapalıyken görünen “Refresh preview” (önizlemeyi yenile) düğmesini gösterir.

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

- **`update(source)`** — kaynağı bloklara böler, önbellekteki DOM düğümlerini blok anahtarına göre yeniden kullanır ve düğümleri bir `DocumentFragment` içine ekler. `{ rerenderedCount, totalCount }` döndürür.
- **`getBlockCount()`** — son güncellemedeki blok sayısını döndürür.

## Bloklara ayırma

### `splitIntoBlocks`

```ts
function splitIntoBlocks(source: string): SourceBlock[];
```

Kod çitlerini ve `:::` kapsayıcılarını gözeterek kaynağı ATX başlıklarında bloklara ayırır.

### `interface SourceBlock`

```ts
interface SourceBlock {
  key: string;     // content hash + occurrence index, for DOM reuse
  hash: string;    // content hash for change detection
  source: string;  // original markdown source for this block
}
```

## Zamanlama yardımcıları

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

`DebouncedFn` dönüş değerini açıklar, ancak ana girişten yeniden dışa aktarılmaz.

- **`debounce(fn, wait)`** — son çağrıdan sonra bekleme süresi dolunca çalışır. Dönen işlev ayrıca `.cancel()` ve `.flush()` sunar.
- **`adaptiveDebounceMs(docLength, base = 120, max = 600)`** — `min(max, base + floor(max(0, docLength) / 20000) * 60)` döndürür.
- **`scheduleIdle(callback, timeout = 300)`** — varsa `requestIdleCallback`, yoksa `setTimeout(0)` kullanır.
- **`cancelIdle(handle)`** — zamanlanan boşta kalma geri çağırımını iptal eder.

## Simgeler

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

Her simge, `currentColor` kullanan 16×16 satır içi SVG dizesidir. `ToolbarItemOverride` içindeki `icon` değerini değiştirmek için `icons.<name>` kullanın.

## `Popup`, `PopupConfig`, `PopupField`

Araç çubuğu düğmesine bağlı bir yüzen paneldir. Ekleme iletişim kutularında kullanılır ve özel uzantılar için de kullanılabilir.

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

Dışarı tıklanınca, Escape'e basılınca veya gönderim başarılı olunca panel kapanır.

## Medya yardımcıları

```ts
function extractYouTubeId(input: string): string | null;
function youTubeEmbedMarkdown(videoId: string, alt?: string): string; // alt default 'YouTube video'
function imageMarkdown(url: string, alt?: string): string;             // alt default 'image'
function videoMarkdown(url: string, alt?: string): string;             // alt default 'video'
function isVideoFile(url: string): boolean;
```

- **`extractYouTubeId`** — `watch?v=`, `youtu.be/`, `embed/`, `shorts/`, `v/` URL'lerini veya 11 karakterlik ham kimliği kabul eder; tanınmıyorsa `null` döndürür.
- **`youTubeEmbedMarkdown`** — `[![alt](https://img.youtube.com/vi/<id>/hqdefault.jpg)](https://www.youtube.com/watch?v=<id>)` döndürür.
- **`isVideoFile`** — sorgu dizesini çıkardıktan sonra URL uzantısını `.mp4`, `.webm`, `.ogg`, `.mov`, `.m4v`, `.avi`, `.mkv` ile karşılaştırır.

## Klavye yardımcıları

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

- **`matchShortcut`** — `Mod`/`Ctrl`/`Alt`/`Shift`/tuş birleşimini ayrıştırır ve bir `KeyboardEvent` ile karşılaştırır. `Mod`, macOS'te Meta, diğer sistemlerde Ctrl olarak yorumlanır.
- **`formatShortcut`** — kısayolu metne dönüştürür; örneğin `Mod-b` → `Ctrl+B` (Windows) veya `Cmd+B` (macOS).
- **`formatShortcutHtml`** — değiştirici tuş simgeleri içeren biçimlendirilmiş `<kbd>` öğeleri üretir.

## Bahsetme türleri

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

## Belge bağlantısı türleri

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

## Paylaşılan seçenek türleri

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

Her alanın varsayılan değeri [Yapılandırma](./configuration.md) sayfasında açıklanır.

## React alt yolu

`@powerduck/md-editor/react` üzerinden içe aktarılır:

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

## Sonraki adımlar

- [Örnekler](./examples.md) — API'lerin uygulamalı kullanımı.
- [Özellikler](./features.md) — çalışma sırasındaki davranış ayrıntıları.
