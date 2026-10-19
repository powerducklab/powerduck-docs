---
sidebar_position: 6
title: "API संदर्भ"
description: "इस पृष्ठ में मुख्य प्रवेश बिंदु @powerduck/md-editor और ./react उपपथ के सभी एक्सपोर्ट का विवरण है। सिग्नेचर सीधे स्रोत कोड से लिए गए हैं।"
---

# API संदर्भ

इस पृष्ठ में मुख्य प्रवेश बिंदु `@powerduck/md-editor` और `./react` उपपथ के सभी एक्सपोर्ट का विवरण है। सिग्नेचर सीधे स्रोत कोड से लिए गए हैं।

## `MarkdownEditor`

संपादक की मुख्य क्लास। इसे कंटेनर और विकल्प देकर बनाएँ।

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

- `container: HTMLElement | string` — DOM एलिमेंट या CSS सिलेक्टर। कोई मेल न मिलने पर `MarkdownEditor: mount container not found` त्रुटि फेंकता है।
- `options?: MarkdownEditorOptions` — [कॉन्फ़िगरेशन](./configuration.md) देखें।

लेआउट बनाता है, `CodeEditor` तैयार करता है, कीबोर्ड शॉर्टकट जोड़ता है और `complex` मोड में टूलबार व स्टेटस बार बनाता है। निर्माण के समय शुरुआती रेंडरिंग और स्टेटस बार अपडेट होते हैं।

### `getValue(): string`

वर्तमान Markdown स्रोत लौटाता है।

### `setValue(value: string): void`

पूरा दस्तावेज़ बदलता है, लंबित डिबाउंस रेंडरिंग रद्द करता है, पूर्वावलोकन को समकालिक रूप से फिर रेंडर करता है और स्टेटस बार अपडेट करता है।

### `getHtml(): string`

अंदरूनी `Renderer` से वर्तमान स्रोत को HTML में रेंडर करके स्ट्रिंग लौटाता है।

### `renderNow(): void`

लंबित डिबाउंस रेंडरिंग रद्द करके पूर्वावलोकन तुरंत रेंडर करता है। `autoPreview` के `false` होने पर उपयोगी है।

### `setAutoPreview(auto: boolean): void`

संपादन के समय पूर्वावलोकन की स्वतः रेंडरिंग चालू या बंद करता है। चालू करने पर वर्तमान मान तुरंत रेंडर होता है।

### `setMode(mode: EditorMode): void`

`'simple'` और `'complex'` के बीच बदलता है। ज़रूरत के अनुसार टूलबार व स्टेटस बार हटाकर फिर बनाता है और पंक्ति संख्याएँ चालू या बंद करता है। मोड न बदलने पर कुछ नहीं करता।

### `setTheme(theme: EditorTheme): void`

रूट एलिमेंट पर `data-theme` सेट करता है और CodeMirror के हाइलाइटिंग compartment को फिर कॉन्फ़िगर करता है। टूलबार का थीम आइकन भी सूरज और चाँद के बीच बदलता है।

### `focus(): void`

फ़ोकस CodeMirror संपादक पर ले जाता है।

### `destroy(): void`

लंबित रेंडरिंग रद्द करता है; कोड संपादक, टूलबार, स्टेटस बार, सक्रिय पॉपअप और क्रमिक रेंडरर हटाता है; कंटेनर खाली करके क्लास व एट्रिब्यूट हटाता है। संपादक अनमाउंट करते समय इसे कॉल करें।

## `CodeEditor`

CodeMirror 6 के `EditorView` का हल्का रैपर, जो उन्नत एम्बेडिंग के लिए एक्सपोर्ट किया जाता है। अधिकांश उपयोगकर्ताओं को `MarkdownEditor` इस्तेमाल करना चाहिए।

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

`CodeEditorOptions` मुख्य प्रवेश बिंदु से फिर एक्सपोर्ट नहीं होता। यह `value`, `onChange`, `lineNumbers`, `placeholder`, `onImageFile`, `mention`, `docLink` और `theme` स्वीकार करता है।

मुख्य मेथड:

- **`setKeymap(bindings)`** — कस्टम कीमैप compartment को दिए गए CodeMirror की-बाइंडिंग से बदलता है।
- **`insertAtCursor(text)`** — मुख्य चयन पर पाठ जोड़ता है और कर्सर उसके बाद ले जाता है।
- **`wrapSelection(prefix, suffix, placeholder)`** — वर्तमान चयन को घेरता है; चयन न हो तो `prefix + placeholder + suffix` जोड़कर प्लेसहोल्डर चुनता है।
- **`wrapLines(prefix, placeholder)`** — हर चुनी गई पंक्ति या वर्तमान पंक्ति के शुरू में `prefix` जोड़ता है।
- **`toggleTaskList()`** — वर्तमान या चुनी गई पंक्तियों के `- [ ]` / `- [x]` मार्कर बदलता है।

## `Renderer` और `renderMarkdown`

### `class Renderer`

```ts
class Renderer {
  readonly md: MarkdownIt;
  constructor(options?: RendererOptions);
  render(source: string): string;
  hydrate(container: HTMLElement): Promise<void>;
}
```

- **`constructor(options?)`** — `linkify: true` और `typographer: true` के साथ markdown-it इंस्टेंस बनाता है। सूत्र, माइंडमैप, कोड हाइलाइटिंग और सूचना बॉक्स विकल्पों के अनुसार सक्रिय होते हैं; कार्य सूची, दस्तावेज़ लिंक, उल्लेख और वीडियो प्लगइन हमेशा पंजीकृत होते हैं।
- **`render(source)`** — स्रोत को समकालिक रूप से HTML स्ट्रिंग में रेंडर करता है।
- **`hydrate(container)`** — HTML को DOM में जोड़ने के बाद माइंडमैप प्लेसहोल्डर को SVG आरेखों में बदलता है। माइंडमैप बंद हों तो कुछ नहीं करता; त्रुटियाँ दबा दी जाती हैं।

### `function renderMarkdown`

```ts
function renderMarkdown(source: string, options?: RendererOptions): string;
```

अस्थायी `Renderer` बनाकर स्रोत रेंडर करता है। `theme` सेट होने पर परिणाम को थीम वाले कंटेनर में लपेटता है; `Renderer.render` खुद यह रैपर नहीं जोड़ता। संपादक माउंट किए बिना Markdown रेंडर करने के लिए इस्तेमाल करें।

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

बटन `mousedown` + `preventDefault` इस्तेमाल करते हैं, ताकि हैंडलर चलने से पहले संपादक का फ़ोकस न हटे और चयन न सिमटे।

## `StatusBar` और `countText`

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

`StatusBarState` और `StatusBarCallbacks` स्वीकार्य डेटा संरचनाएँ बताते हैं, लेकिन मुख्य प्रवेश बिंदु से फिर एक्सपोर्ट नहीं होते।

- **`countText(value)`** — `charCount` (मूल स्ट्रिंग की लंबाई) और `wordCount` (दोनों सिरों का रिक्त स्थान हटाने के बाद रिक्त स्थान से अलग किए गए हिस्सों की संख्या) लौटाता है।
- **`StatusBar.update(state)`** — `chars · words`, रेंडर ब्लॉक की संख्या और “Refresh preview” (पूर्वावलोकन ताज़ा करें) बटन दिखाता है। बटन केवल `autoPreview` बंद होने पर दिखता है।

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

- **`update(source)`** — स्रोत को ब्लॉक में बाँटता है, ब्लॉक कुंजी से कैश किए DOM नोड दोबारा इस्तेमाल करता है और नोड को `DocumentFragment` में जोड़ता है। `{ rerenderedCount, totalCount }` लौटाता है।
- **`getBlockCount()`** — अंतिम अपडेट के ब्लॉक की संख्या लौटाता है।

## ब्लॉक में विभाजन

### `splitIntoBlocks`

```ts
function splitIntoBlocks(source: string): SourceBlock[];
```

कोड फेंस और `:::` कंटेनर को ध्यान में रखते हुए ATX शीर्षकों पर स्रोत को ब्लॉक में बाँटता है।

### `interface SourceBlock`

```ts
interface SourceBlock {
  key: string;     // content hash + occurrence index, for DOM reuse
  hash: string;    // content hash for change detection
  source: string;  // original markdown source for this block
}
```

## शेड्यूलिंग यूटिलिटी

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

`DebouncedFn` लौटने वाले मान की संरचना बताता है, लेकिन मुख्य प्रवेश बिंदु से फिर एक्सपोर्ट नहीं होता।

- **`debounce(fn, wait)`** — अंतिम कॉल के बाद विराम पूरा होने पर निष्पादन करता है। लौटने वाले फ़ंक्शन में `.cancel()` और `.flush()` भी हैं।
- **`adaptiveDebounceMs(docLength, base = 120, max = 600)`** — `min(max, base + floor(max(0, docLength) / 20000) * 60)` लौटाता है।
- **`scheduleIdle(callback, timeout = 300)`** — उपलब्ध होने पर `requestIdleCallback`, अन्यथा `setTimeout(0)` इस्तेमाल करता है।
- **`cancelIdle(handle)`** — शेड्यूल किया गया निष्क्रिय समय का कॉलबैक रद्द करता है।

## आइकन

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

हर आइकन `currentColor` इस्तेमाल करने वाली 16×16 इनलाइन SVG स्ट्रिंग है। `ToolbarItemOverride` में `icon` बदलने के लिए `icons.<name>` इस्तेमाल करें।

## `Popup`, `PopupConfig`, `PopupField`

टूलबार बटन से जुड़ा फ़्लोटिंग पैनल। अंदरूनी तौर पर जोड़ने वाले संवादों में इस्तेमाल होता है और कस्टम एक्सटेंशन के लिए भी उपलब्ध है।

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

बाहर क्लिक करने, Escape दबाने या सफल सबमिट के बाद पॉपअप बंद होता है।

## मीडिया सहायक फ़ंक्शन

```ts
function extractYouTubeId(input: string): string | null;
function youTubeEmbedMarkdown(videoId: string, alt?: string): string; // alt default 'YouTube video'
function imageMarkdown(url: string, alt?: string): string;             // alt default 'image'
function videoMarkdown(url: string, alt?: string): string;             // alt default 'video'
function isVideoFile(url: string): boolean;
```

- **`extractYouTubeId`** — `watch?v=`, `youtu.be/`, `embed/`, `shorts/`, `v/` URL या सीधे 11 अक्षरों का ID स्वीकार करता है; पहचान न होने पर `null` लौटाता है।
- **`youTubeEmbedMarkdown`** — `[![alt](https://img.youtube.com/vi/<id>/hqdefault.jpg)](https://www.youtube.com/watch?v=<id>)` लौटाता है।
- **`isVideoFile`** — क्वेरी स्ट्रिंग हटाने के बाद URL का एक्सटेंशन `.mp4`, `.webm`, `.ogg`, `.mov`, `.m4v`, `.avi`, `.mkv` से मिलाता है।

## कीबोर्ड यूटिलिटी

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

- **`matchShortcut`** — `Mod`/`Ctrl`/`Alt`/`Shift`/कुंजी संयोजन पार्स करके `KeyboardEvent` से तुलना करता है। `Mod` का अर्थ macOS पर Meta और अन्य प्रणालियों पर Ctrl है।
- **`formatShortcut`** — शॉर्टकट को पाठ में बदलता है, जैसे `Mod-b` → `Ctrl+B` (Windows) या `Cmd+B` (macOS)।
- **`formatShortcutHtml`** — मॉडिफ़ायर कुंजियों के प्रतीकों वाले शैलीबद्ध `<kbd>` एलिमेंट बनाता है।

## उल्लेख के प्रकार

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

## दस्तावेज़ लिंक के प्रकार

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

## साझा विकल्प प्रकार

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

हर फ़ील्ड के डिफ़ॉल्ट मान [कॉन्फ़िगरेशन](./configuration.md) पृष्ठ पर हैं।

## React उपपथ

`@powerduck/md-editor/react` से आयात करें:

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

## अगले चरण

- [उदाहरण](./examples.md) — इन API का व्यावहारिक उपयोग।
- [सुविधाएँ](./features.md) — रनटाइम व्यवहार का विवरण।
