---
sidebar_position: 6
title: "Referensi API"
description: "Halaman ini mendokumentasikan semua ekspor dari titik masuk utama @powerduck/md-editor dan subpath ./react. Tanda tangan diambil langsung dari kode sumber."
---

# Referensi API

Halaman ini mendokumentasikan semua ekspor dari titik masuk utama `@powerduck/md-editor` dan subpath `./react`. Tanda tangan diambil langsung dari kode sumber.

## `MarkdownEditor`

Kelas editor tingkat atas. Buat instans dengan kontainer dan opsi.

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

- `container: HTMLElement | string` — elemen DOM atau selektor CSS. Jika tidak ada elemen yang cocok, melempar `MarkdownEditor: mount container not found`.
- `options?: MarkdownEditorOptions` — lihat [Konfigurasi](./configuration.md).

Membangun tata letak, membuat `CodeEditor`, menghubungkan pintasan keyboard, dan membuat bilah alat serta bilah status dalam mode `complex`. Rendering awal dan pembaruan bilah status dijalankan saat konstruksi.

### `getValue(): string`

Mengembalikan sumber Markdown saat ini.

### `setValue(value: string): void`

Mengganti seluruh dokumen, membatalkan rendering tertunda yang masih menunggu, merender ulang pratinjau secara sinkron, dan memperbarui bilah status.

### `getHtml(): string`

Merender sumber saat ini menjadi HTML melalui `Renderer` internal dan mengembalikan string.

### `renderNow(): void`

Membatalkan rendering tertunda yang masih menunggu dan memaksa rendering pratinjau segera. Berguna ketika `autoPreview` bernilai `false`.

### `setAutoPreview(auto: boolean): void`

Mengaktifkan atau menonaktifkan rendering ulang pratinjau otomatis saat mengedit. Mengaktifkannya langsung merender nilai saat ini.

### `setMode(mode: EditorMode): void`

Beralih antara `'simple'` dan `'complex'`. Menghancurkan dan membuat ulang bilah alat serta bilah status sesuai kebutuhan, sekaligus mengalihkan nomor baris. Tidak melakukan apa pun jika mode tidak berubah.

### `setTheme(theme: EditorTheme): void`

Menetapkan `data-theme` pada elemen akar dan mengonfigurasi ulang kompartemen penyorotan CodeMirror. Juga mengganti ikon pengalih tema antara matahari dan bulan.

### `focus(): void`

Memindahkan fokus ke editor CodeMirror.

### `destroy(): void`

Membatalkan rendering tertunda, menghancurkan editor kode, bilah alat, bilah status, popup aktif, dan renderer inkremental, mengosongkan kontainer, serta menghapus kelas dan atribut. Panggil saat melepas editor dari halaman.

## `CodeEditor`

Pembungkus tipis untuk `EditorView` CodeMirror 6, diekspor untuk penyematan tingkat lanjut. Sebagian besar pengguna sebaiknya memakai `MarkdownEditor`.

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

`CodeEditorOptions` (tidak diekspor ulang dari titik masuk utama) menerima `value`, `onChange`, `lineNumbers`, `placeholder`, `onImageFile`, `mention`, `docLink`, dan `theme`.

Metode utama:

- **`setKeymap(bindings)`** — mengganti kompartemen keymap kustom dengan pengikatan tombol CodeMirror yang diberikan.
- **`insertAtCursor(text)`** — menyisipkan teks pada seleksi utama dan memindahkan kursor ke setelahnya.
- **`wrapSelection(prefix, suffix, placeholder)`** — membungkus seleksi; jika tidak ada seleksi, menyisipkan `prefix + placeholder + suffix` dan memilih teks placeholder.
- **`wrapLines(prefix, placeholder)`** — menambahkan `prefix` di awal setiap baris yang dipilih atau baris saat ini.
- **`toggleTaskList()`** — mengalihkan penanda `- [ ]` / `- [x]` pada baris saat ini atau baris yang dipilih.

## `Renderer` dan `renderMarkdown`

### `class Renderer`

```ts
class Renderer {
  readonly md: MarkdownIt;
  constructor(options?: RendererOptions);
  render(source: string): string;
  hydrate(container: HTMLElement): Promise<void>;
}
```

- **`constructor(options?)`** — membuat instans markdown-it dengan `linkify: true` dan `typographer: true`, mengaktifkan rumus, peta pikiran, penyorotan kode, serta kotak keterangan sesuai opsi, dan selalu mendaftarkan plugin daftar tugas, tautan dokumen, sebutan, dan video.
- **`render(source)`** — merender sumber secara sinkron menjadi string HTML.
- **`hydrate(container)`** — setelah HTML dimasukkan ke DOM, mengubah placeholder peta pikiran menjadi diagram SVG. Tidak melakukan apa pun jika peta pikiran dinonaktifkan; kesalahan diabaikan.

### `function renderMarkdown`

```ts
function renderMarkdown(source: string, options?: RendererOptions): string;
```

Membuat `Renderer` sementara dan merender sumber. Jika `theme` ditetapkan, hasilnya dibungkus dalam kontainer bertema; `Renderer.render` sendiri tidak menambahkan pembungkus ini. Gunakan untuk merender Markdown tanpa memasang editor.

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

Tombol menggunakan `mousedown` + `preventDefault` agar editor tidak kehilangan fokus dan seleksi tidak menghilang sebelum penangan dijalankan.

## `StatusBar` dan `countText`

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

`StatusBarState` dan `StatusBarCallbacks` menjelaskan struktur yang diterima, tetapi tidak diekspor ulang dari titik masuk utama.

- **`countText(value)`** — mengembalikan `charCount` (panjang string mentah) dan `wordCount` (token yang dipisahkan karakter spasi setelah spasi di kedua ujung dihapus).
- **`StatusBar.update(state)`** — menampilkan `chars · words`, jumlah blok rendering, serta tombol “Refresh preview” (segarkan pratinjau) yang hanya muncul ketika `autoPreview` nonaktif.

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

- **`update(source)`** — membagi sumber menjadi blok, menggunakan kembali node DOM dalam cache berdasarkan kunci blok, lalu menambahkan node ke `DocumentFragment`. Mengembalikan `{ rerenderedCount, totalCount }`.
- **`getBlockCount()`** — mengembalikan jumlah blok dari pembaruan terakhir.

## Pemisahan blok

### `splitIntoBlocks`

```ts
function splitIntoBlocks(source: string): SourceBlock[];
```

Membagi sumber pada judul ATX dengan tetap memperhatikan pagar kode dan kontainer `:::`.

### `interface SourceBlock`

```ts
interface SourceBlock {
  key: string;     // content hash + occurrence index, for DOM reuse
  hash: string;    // content hash for change detection
  source: string;  // original markdown source for this block
}
```

## Utilitas penjadwalan

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

`DebouncedFn` menjelaskan nilai kembalian, tetapi tidak diekspor ulang dari titik masuk utama.

- **`debounce(fn, wait)`** — menunda eksekusi hingga jeda setelah panggilan terakhir. Fungsi yang dikembalikan juga memiliki `.cancel()` dan `.flush()`.
- **`adaptiveDebounceMs(docLength, base = 120, max = 600)`** — mengembalikan `min(max, base + floor(max(0, docLength) / 20000) * 60)`.
- **`scheduleIdle(callback, timeout = 300)`** — menggunakan `requestIdleCallback` jika tersedia, atau `setTimeout(0)` jika tidak.
- **`cancelIdle(handle)`** — membatalkan callback waktu senggang yang sudah dijadwalkan.

## Ikon

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

Setiap ikon berupa string SVG inline 16×16 yang menggunakan `currentColor`. Gunakan `icons.<name>` sebagai pengganti `icon` pada `ToolbarItemOverride`.

## `Popup`, `PopupConfig`, `PopupField`

Panel mengambang yang ditambatkan ke tombol bilah alat, digunakan secara internal untuk dialog penyisipan dan tersedia bagi ekstensi kustom.

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

Popup ditutup saat mengeklik di luarnya, menekan Escape, atau berhasil mengirim formulir.

## Pembantu media

```ts
function extractYouTubeId(input: string): string | null;
function youTubeEmbedMarkdown(videoId: string, alt?: string): string; // alt default 'YouTube video'
function imageMarkdown(url: string, alt?: string): string;             // alt default 'image'
function videoMarkdown(url: string, alt?: string): string;             // alt default 'video'
function isVideoFile(url: string): boolean;
```

- **`extractYouTubeId`** — menerima URL `watch?v=`, `youtu.be/`, `embed/`, `shorts/`, `v/`, atau ID mentah 11 karakter; mengembalikan `null` jika tidak dikenali.
- **`youTubeEmbedMarkdown`** — mengembalikan `[![alt](https://img.youtube.com/vi/<id>/hqdefault.jpg)](https://www.youtube.com/watch?v=<id>)`.
- **`isVideoFile`** — memeriksa apakah ekstensi URL berupa `.mp4`, `.webm`, `.ogg`, `.mov`, `.m4v`, `.avi`, atau `.mkv`, setelah string kueri dihapus.

## Utilitas keyboard

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

- **`matchShortcut`** — mengurai kombinasi `Mod`/`Ctrl`/`Alt`/`Shift`/tombol dan membandingkannya dengan `KeyboardEvent`. `Mod` berarti Meta di macOS dan Ctrl di sistem lain.
- **`formatShortcut`** — memformat pintasan sebagai teks, misalnya `Mod-b` → `Ctrl+B` (Windows) atau `Cmd+B` (macOS).
- **`formatShortcutHtml`** — menghasilkan elemen `<kbd>` berformat dengan simbol tombol pengubah.

## Tipe sebutan

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

## Tipe tautan dokumen

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

## Tipe opsi bersama

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

Nilai bawaan setiap bidang dijelaskan di halaman [Konfigurasi](./configuration.md).

## Subpath React

Diimpor dari `@powerduck/md-editor/react`:

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

## Langkah berikutnya

- [Contoh](./examples.md) — penggunaan API dalam praktik.
- [Fitur](./features.md) — rincian perilaku saat runtime.
