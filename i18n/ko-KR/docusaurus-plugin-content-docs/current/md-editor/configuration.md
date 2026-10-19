---
sidebar_position: 4
title: "설정"
description: "MarkdownEditor 생성자는 컨테이너 요소나 선택자를 받은 다음 MarkdownEditorOptions 객체를 받습니다. 이 페이지는 각 필드의 타입, 기본값, 동작과 관련 옵션 타입을 설명합니다."
---

# 설정

`MarkdownEditor` 생성자는 컨테이너 요소나 선택자를 받은 다음 `MarkdownEditorOptions` 객체를 받습니다. 이 페이지는 각 필드의 타입, 기본값, 동작과 관련 옵션 타입을 설명합니다.

## `MarkdownEditorOptions`

```ts
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

| 옵션 | 타입 | 기본값 | 설명 |
|--------|------|---------|-------------|
| `value` | `string` | `''` | 초기 Markdown 콘텐츠입니다. |
| `mode` | `EditorMode` | `'simple'` | `'simple'`은 도구 모음과 상태 표시줄 없이 편집 영역과 미리보기를 표시합니다. `'complex'`는 두 표시줄을 추가합니다. |
| `theme` | `EditorTheme` | `'light'` | `data-theme` 속성으로 적용하는 테마입니다. `'light'` 또는 `'dark'`를 사용합니다. |
| `math` | `boolean` | `true` | KaTeX 수식을 활성화합니다. 인라인은 `$...$`, 블록은 `$$...$$`입니다. |
| `mindmap` | `boolean` | `true` | ```` ```mindmap ```` 코드 블록의 Markmap 마인드맵을 활성화합니다. |
| `codeHighlight` | `boolean` | `true` | 세 가지 색 점 헤더와 복사 버튼이 있는 highlight.js 코드 블록을 활성화합니다. |
| `tips` | `boolean` | `true` | `:::notice`, `:::warning` 등의 알림 블록을 활성화합니다. |
| `preview` | `boolean` | `true` | 미리보기 패널을 표시합니다. `false`이면 편집기 패널만 만듭니다. |
| `onChange` | `(value: string) => void` | — | 편집할 때마다 전체 문서 문자열을 인수로 호출합니다. |
| `toolbar` | `ToolbarConfig` | 모든 작업 | 표시할 도구 모음 작업을 정하고 레이블이나 아이콘을 재정의합니다. |
| `onImageUpload` | `(file: File) => Promise<string>` | — | 이미지 파일을 편집기에 붙여넣거나 드롭하면 호출하는 훅입니다. Promise는 이미지 URL을 반환해야 하며 `![alt](url)`로 삽입됩니다. 이미지 대화상자는 URL을 받으며 파일 선택기는 제공하지 않습니다. |
| `mention` | `MentionOptions` | — | @멘션 드롭다운 설정입니다. 생략하면 `@`를 입력해도 드롭다운이 열리지 않습니다. |
| `docLink` | `DocLinkOptions` | — | 문서 링크 삽입 설정입니다. 생략하면 트리거 문자를 입력해도 드롭다운이 열리지 않습니다. |
| `renderDebounce` | `number \| false` | 적응형 | 미리보기 디바운스 지연(밀리초)입니다. `false`이면 편집할 때마다 동기 렌더링하고, 숫자는 고정 지연을 지정합니다. 생략하면 `adaptiveDebounceMs(value.length)`를 사용하며 기본 120ms에서 최대 600ms까지 조정됩니다. |
| `autoPreview` | `boolean` | `true` | `true`이면 편집 후 디바운스를 거쳐 미리보기를 다시 렌더링합니다. `false`이면 `renderNow()`를 호출하거나 상태 표시줄의 새로 고침 버튼을 사용합니다. |

## `EditorMode`와 `EditorTheme`

```ts
type EditorMode = 'simple' | 'complex';
type EditorTheme = 'light' | 'dark';
```

- `'simple'`(기본값): 도구 모음, 상태 표시줄, 줄 번호를 표시하지 않습니다.
- `'complex'`: 도구 모음, 상태 표시줄, 줄 번호를 활성화합니다.
- `'light'`(기본값)와 `'dark'`는 구문 강조 색상과 CSS 사용자 정의 속성을 제어합니다.

둘 다 `setMode(mode)`와 `setTheme(theme)`로 실행 중 변경할 수 있습니다.

## `ToolbarConfig`

`ToolbarConfig`는 표시할 **작업 이름의 배열** 또는 **작업 이름을 재정의 설정에 연결하는 객체**입니다.

```ts
type ToolbarConfig = string[] | Record<string, ToolbarItemOverride>;
```

### 배열 형식(표시 항목 지정)

나열한 작업만 표시합니다. 순서는 내장 도구 모음 순서를 유지합니다. 배열은 표시 여부를 필터링하며 순서를 바꾸지는 않습니다.

```ts
new MarkdownEditor('#editor', {
  mode: 'complex',
  toolbar: ['heading', 'bold', 'italic', 'link', 'code'],
});
```

### 객체 형식(항목별 재정의)

기본적으로 모든 작업이 표시됩니다. 객체 형식으로 항목을 숨기거나 레이블과 아이콘을 바꿀 수 있습니다.

```ts
new MarkdownEditor('#editor', {
  mode: 'complex',
  toolbar: {
    bold: { label: 'Make bold', icon: '<b>B</b>' },
    image: { show: false },
    youtube: { show: false },
  },
});
```

### `ToolbarItemOverride`

```ts
interface ToolbarItemOverride {
  show?: boolean;  // Show this item. Default: true.
  label?: string;  // Custom tooltip / aria-label.
  icon?: string;   // Custom icon as an HTML string.
}
```

유효한 작업 이름의 전체 목록은 [기능](./features.md#toolbar-actions)을 참고하세요.

## `MentionOptions`

```ts
interface MentionOptions {
  onMentionSearch?: (query: string) => MentionItem[] | Promise<MentionItem[]>;
  onMentionSelect?: (item: MentionItem) => string;
  minChars?: number;
  maxItems?: number;
}
```

| 필드 | 타입 | 기본값 | 설명 |
|-------|------|---------|-------------|
| `onMentionSearch` | `(query: string) => MentionItem[] \| Promise<MentionItem[]>` | — | `@` 뒤에 입력한 텍스트로 호출하는 검색 훅입니다. 드롭다운을 활성화하려면 필요합니다. |
| `onMentionSelect` | `(item: MentionItem) => string` | `` (item) => `[@${item.label}](mention:${item.id})` `` | 커서 위치에서 `@query`를 대체할 텍스트를 반환합니다. 미리보기에서 배지를 표시하려면 `[@label](mention:id)` 형식을 반환하세요. |
| `minChars` | `number` | `0` | 드롭다운을 표시하는 데 필요한 최소 검색어 길이입니다. |
| `maxItems` | `number` | `8` | 드롭다운에 표시할 최대 항목 수입니다. |

`MentionItem`은 [API 레퍼런스](./api-reference.md)에 설명되어 있습니다.

## `DocLinkOptions`

```ts
interface DocLinkOptions {
  onDocSearch?: (query: string) => DocItem[] | Promise<DocItem[]>;
  onFetchDocMeta?: (url: string) => Promise<DocMeta>;
  insertStyle?: 'card' | 'link' | 'auto';
  triggerChar?: string;
  minChars?: number;
  maxItems?: number;
}
```

| 필드 | 타입 | 기본값 | 설명 |
|-------|------|---------|-------------|
| `onDocSearch` | `(query: string) => DocItem[] \| Promise<DocItem[]>` | — | 트리거 문자 입력 후 호출하는 검색 훅입니다. 드롭다운을 활성화하려면 필요합니다. |
| `onFetchDocMeta` | `(url: string) => Promise<DocMeta>` | 내장 fetch + DOMParser | 이 훅을 재정의해 백엔드 프록시로 메타데이터를 가져오면 브라우저 CORS 제한을 피할 수 있습니다. |
| `insertStyle` | `'card' \| 'link' \| 'auto'` | `'auto'` | `'card'`는 `:::doc-link` 카드를 삽입하며 메타데이터가 없으면 링크로 대체합니다. `'link'`는 항상 일반 Markdown 링크를, `'auto'`는 메타데이터가 있을 때 카드를 삽입합니다. |
| `triggerChar` | `string` | `'/'` | 문서 검색 드롭다운을 여는 문자입니다. |
| `minChars` | `number` | `0` | 검색을 시작하는 데 필요한 최소 검색어 길이입니다. |
| `maxItems` | `number` | `8` | 드롭다운에 표시할 최대 항목 수입니다. |

## `RendererOptions`

`Renderer` 생성자와 `renderMarkdown(source, options)`에서 사용합니다.

```ts
interface RendererOptions {
  math?: boolean;
  mindmap?: boolean;
  codeHighlight?: boolean;
  tips?: boolean;
  html?: boolean;
  breaks?: boolean;
  theme?: 'light' | 'dark';
}
```

| 옵션 | 타입 | 기본값 | 설명 |
|--------|------|---------|-------------|
| `math` | `boolean` | `true` | KaTeX 수식 렌더링을 활성화합니다. |
| `mindmap` | `boolean` | `true` | Markmap 마인드맵 렌더링을 활성화합니다. |
| `codeHighlight` | `boolean` | `true` | highlight.js 코드 블록을 활성화합니다. |
| `tips` | `boolean` | `true` | 알림 블록을 활성화합니다. |
| `html` | `boolean` | `false` | Markdown 소스의 원시 HTML을 허용합니다. 기본값 `false`가 더 안전합니다. |
| `breaks` | `boolean` | `false` | 일반 줄바꿈을 `<br>`로 변환합니다. |
| `theme` | `'light' \| 'dark'` | — | `renderMarkdown`에서는 HTML을 테마가 적용된 컨테이너로 감쌉니다. `Renderer.render`는 감싸지 않은 HTML을 반환하므로 컨테이너 스타일을 직접 설정하세요. |

작업 목록 체크박스, `:::doc-link` 카드, @멘션 배지는 항상 활성화되며 `RendererOptions`로 끌 수 없습니다.

## 다음 단계

- [기능](./features.md) — 각 옵션의 실행 시 동작입니다.
- [API 레퍼런스](./api-reference.md) — 전체 타입 정의입니다.
