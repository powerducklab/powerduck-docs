---
sidebar_position: 6
title: "API 참조"
description: "이 페이지는 기본 진입점 @powerduck/md-editor와 ./react 하위 경로의 모든 내보내기를 설명합니다. 시그니처는 소스 코드를 기준으로 작성했습니다."
---

# API 참조

이 페이지는 기본 진입점 `@powerduck/md-editor`와 `./react` 하위 경로의 모든 내보내기를 설명합니다. 시그니처는 소스 코드를 기준으로 작성했습니다.

## `MarkdownEditor`

최상위 편집기 클래스입니다. 컨테이너와 옵션을 전달해 생성합니다.

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

- `container: HTMLElement | string` — DOM 요소 또는 CSS 선택자입니다. 일치하는 요소가 없으면 `MarkdownEditor: mount container not found`를 던집니다.
- `options?: MarkdownEditorOptions` — [설정](./configuration.md)을 참조하세요.

레이아웃을 구성하고 `CodeEditor`를 생성하며 키보드 단축키를 연결합니다. `complex` 모드에서는 도구 모음과 상태 표시줄도 만듭니다. 생성 시 초기 렌더링과 상태 표시줄 갱신을 실행합니다.

### `getValue(): string`

현재 Markdown 소스를 반환합니다.

### `setValue(value: string): void`

문서 전체를 교체하고 대기 중인 디바운스 렌더링을 취소한 뒤 미리보기를 동기적으로 다시 렌더링하고 상태 표시줄을 갱신합니다.

### `getHtml(): string`

내부 `Renderer`로 현재 소스를 HTML로 렌더링하고 문자열을 반환합니다.

### `renderNow(): void`

대기 중인 디바운스 렌더링을 취소하고 즉시 미리보기를 강제로 렌더링합니다. `autoPreview`가 `false`일 때 유용합니다.

### `setAutoPreview(auto: boolean): void`

편집 시 미리보기 자동 렌더링을 켜거나 끕니다. 켜면 현재 값을 즉시 렌더링합니다.

### `setMode(mode: EditorMode): void`

`'simple'`과 `'complex'`를 전환합니다. 필요에 따라 도구 모음과 상태 표시줄을 제거하고 다시 만들며 줄 번호도 전환합니다. 모드가 같으면 아무 작업도 하지 않습니다.

### `setTheme(theme: EditorTheme): void`

루트 요소에 `data-theme`를 설정하고 CodeMirror 강조 표시 compartment를 재설정합니다. 도구 모음의 테마 전환 아이콘도 해와 달 사이에서 바꿉니다.

### `focus(): void`

CodeMirror 편집기로 포커스를 옮깁니다.

### `destroy(): void`

대기 중인 렌더링을 취소하고 코드 편집기, 도구 모음, 상태 표시줄, 열린 팝업, 증분 렌더러를 제거합니다. 컨테이너를 비우고 클래스와 속성도 제거합니다. 편집기를 마운트 해제할 때 호출하세요.

## `CodeEditor`

고급 임베딩을 위해 내보내는 CodeMirror 6 `EditorView`의 가벼운 래퍼입니다. 대부분의 사용자는 `MarkdownEditor`를 사용하면 됩니다.

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

`CodeEditorOptions`는 기본 진입점에서 다시 내보내지 않으며 `value`, `onChange`, `lineNumbers`, `placeholder`, `onImageFile`, `mention`, `docLink`, `theme`를 받습니다.

주요 메서드:

- **`setKeymap(bindings)`** — 사용자 지정 키맵 compartment를 제공된 CodeMirror 키 바인딩으로 교체합니다.
- **`insertAtCursor(text)`** — 기본 선택 영역에 텍스트를 삽입하고 커서를 그 뒤로 옮깁니다.
- **`wrapSelection(prefix, suffix, placeholder)`** — 선택 영역을 감쌉니다. 선택 영역이 없으면 `prefix + placeholder + suffix`를 삽입하고 자리표시자 텍스트를 선택합니다.
- **`wrapLines(prefix, placeholder)`** — 선택한 각 줄 또는 현재 줄의 앞에 `prefix`를 붙입니다.
- **`toggleTaskList()`** — 현재 줄 또는 선택한 줄의 `- [ ]` / `- [x]` 표시를 전환합니다.

## `Renderer`와 `renderMarkdown`

### `class Renderer`

```ts
class Renderer {
  readonly md: MarkdownIt;
  constructor(options?: RendererOptions);
  render(source: string): string;
  hydrate(container: HTMLElement): Promise<void>;
}
```

- **`constructor(options?)`** — `linkify: true`와 `typographer: true`로 markdown-it 인스턴스를 만듭니다. 수식, 마인드맵, 코드 강조 표시, 알림 블록은 옵션에 따라 켜고 작업 목록, 문서 링크, 멘션, 동영상 플러그인은 항상 등록합니다.
- **`render(source)`** — 소스를 동기적으로 HTML 문자열로 렌더링합니다.
- **`hydrate(container)`** — HTML을 DOM에 삽입한 후 마인드맵 자리표시자를 SVG 다이어그램으로 바꿉니다. 마인드맵이 꺼져 있으면 아무 작업도 하지 않으며 오류는 무시합니다.

### `function renderMarkdown`

```ts
function renderMarkdown(source: string, options?: RendererOptions): string;
```

임시 `Renderer`를 만들어 소스를 렌더링합니다. `theme`가 설정되어 있으면 테마 컨테이너로 결과를 감쌉니다. `Renderer.render` 자체는 이 래퍼를 추가하지 않습니다. 편집기를 마운트하지 않고 Markdown을 렌더링할 때 사용하세요.

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

버튼은 `mousedown` + `preventDefault`를 사용해 핸들러 실행 전에 편집기가 포커스를 잃거나 선택 영역이 접히는 것을 막습니다.

## `StatusBar`와 `countText`

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

`StatusBarState`와 `StatusBarCallbacks`는 허용되는 데이터 구조를 설명하지만 기본 진입점에서 다시 내보내지 않습니다.

- **`countText(value)`** — `charCount`(원본 문자열 길이)와 `wordCount`(앞뒤 공백을 제거한 후 공백으로 나눈 토큰 수)를 반환합니다.
- **`StatusBar.update(state)`** — `chars · words`, 렌더링 블록 수, 그리고 `autoPreview`가 꺼져 있을 때만 나타나는 “Refresh preview”(미리보기 새로고침) 버튼을 표시합니다.

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

- **`update(source)`** — 소스를 블록으로 나누고 블록 키로 캐시된 DOM 노드를 재사용한 뒤 노드를 `DocumentFragment`에 추가합니다. `{ rerenderedCount, totalCount }`를 반환합니다.
- **`getBlockCount()`** — 마지막 갱신의 블록 수를 반환합니다.

## 블록 분할

### `splitIntoBlocks`

```ts
function splitIntoBlocks(source: string): SourceBlock[];
```

코드 펜스와 `:::` 컨테이너를 고려해 ATX 제목에서 소스를 블록으로 나눕니다.

### `interface SourceBlock`

```ts
interface SourceBlock {
  key: string;     // content hash + occurrence index, for DOM reuse
  hash: string;    // content hash for change detection
  source: string;  // original markdown source for this block
}
```

## 스케줄링 유틸리티

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

`DebouncedFn`은 반환값의 구조를 설명하지만 기본 진입점에서 다시 내보내지 않습니다.

- **`debounce(fn, wait)`** — 마지막 호출 이후 대기 시간이 지나면 실행하는 디바운스입니다. 반환된 함수에는 `.cancel()`과 `.flush()`도 있습니다.
- **`adaptiveDebounceMs(docLength, base = 120, max = 600)`** — `min(max, base + floor(max(0, docLength) / 20000) * 60)`를 반환합니다.
- **`scheduleIdle(callback, timeout = 300)`** — 가능하면 `requestIdleCallback`을 사용하고, 아니면 `setTimeout(0)`을 사용합니다.
- **`cancelIdle(handle)`** — 예약된 유휴 콜백을 취소합니다.

## 아이콘

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

각 아이콘은 `currentColor`를 사용하는 16×16 인라인 SVG 문자열입니다. `ToolbarItemOverride`의 `icon` 재정의에 `icons.<name>`을 사용하세요.

## `Popup`, `PopupConfig`, `PopupField`

도구 모음 버튼에 고정된 플로팅 패널입니다. 내부 삽입 대화상자에 사용되며 사용자 지정 확장에도 사용할 수 있습니다.

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

팝업 바깥을 클릭하거나 Escape를 누르거나 제출이 성공하면 팝업이 닫힙니다.

## 미디어 도우미

```ts
function extractYouTubeId(input: string): string | null;
function youTubeEmbedMarkdown(videoId: string, alt?: string): string; // alt default 'YouTube video'
function imageMarkdown(url: string, alt?: string): string;             // alt default 'image'
function videoMarkdown(url: string, alt?: string): string;             // alt default 'video'
function isVideoFile(url: string): boolean;
```

- **`extractYouTubeId`** — `watch?v=`, `youtu.be/`, `embed/`, `shorts/`, `v/` URL 또는 11자 원시 ID를 받습니다. 인식하지 못하면 `null`을 반환합니다.
- **`youTubeEmbedMarkdown`** — `[![alt](https://img.youtube.com/vi/<id>/hqdefault.jpg)](https://www.youtube.com/watch?v=<id>)`를 반환합니다.
- **`isVideoFile`** — 쿼리 문자열을 제거한 URL의 확장자가 `.mp4`, `.webm`, `.ogg`, `.mov`, `.m4v`, `.avi`, `.mkv`인지 확인합니다.

## 키보드 유틸리티

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

- **`matchShortcut`** — `Mod`/`Ctrl`/`Alt`/`Shift`/키 조합을 해석하고 `KeyboardEvent`와 비교합니다. `Mod`는 macOS에서 Meta, 그 외에서는 Ctrl입니다.
- **`formatShortcut`** — 단축키를 텍스트로 표현합니다. 예: `Mod-b` → `Ctrl+B`(Windows) 또는 `Cmd+B`(macOS).
- **`formatShortcutHtml`** — 보조 키 기호와 스타일이 적용된 `<kbd>` 요소를 생성합니다.

## 멘션 타입

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

## 문서 링크 타입

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

## 공통 옵션 타입

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

각 필드의 기본값은 [설정](./configuration.md) 페이지에 있습니다.

## React 하위 경로

`@powerduck/md-editor/react`에서 가져옵니다.

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

## 다음 단계

- [예제](./examples.md) — API의 실제 사용 방법.
- [기능](./features.md) — 실행 시 동작의 세부 내용.
