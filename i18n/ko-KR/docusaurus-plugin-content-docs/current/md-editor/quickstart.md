---
sidebar_position: 3
title: "빠른 시작"
description: "JavaScript에서 MarkdownEditor를 마운트하거나 React 컴포넌트를 사용하고, renderMarkdown으로 독립 렌더링하는 방법을 설명합니다."
---

# 빠른 시작

`@powerduck/md-editor`는 프레임워크 없는 JavaScript 에디터, React 컴포넌트, 독립형 Markdown 렌더러로 사용할 수 있습니다. 앱마다 스타일시트를 한 번 가져오세요.

## 프레임워크 없는 JavaScript

생성자 시그니처는 `new MarkdownEditor(container, options?)`입니다. 첫 인수는 `HTMLElement` 또는 CSS 선택자 문자열입니다.

```ts
import { MarkdownEditor } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';

const editor = new MarkdownEditor('#editor', {
  value: '# Hello\n\nStart typing...',
  mode: 'complex', // 'simple' (default) | 'complex'
  theme: 'light',  // 'light' (default) | 'dark'
  math: true,
  mindmap: true,
  onChange: (value) => console.log(value),
});

// Read and write content
const markdown = editor.getValue();
editor.setValue('# Updated content');
```

마운트 컨테이너를 찾지 못하면 생성자가 `MarkdownEditor: mount container not found` 오류를 발생시킵니다.

## React

`./react` 하위 경로에서 `MarkdownEditorReact`를 가져오세요. 제어 방식(`value`)과 비제어 방식(`defaultValue`)을 모두 지원하는 `forwardRef` 컴포넌트이며 `ref`를 통해 명령형 핸들을 제공합니다.

```tsx
import { useRef, useState } from 'react';
import { MarkdownEditorReact, type MarkdownEditorHandle } from '@powerduck/md-editor/react';
import '@powerduck/md-editor/dist/style.css';

function App() {
  const [value, setValue] = useState('# Hello');
  const editorRef = useRef<MarkdownEditorHandle>(null);

  return (
    <MarkdownEditorReact
      ref={editorRef}
      value={value}
      onChange={setValue}
      mode="complex"
      theme="light"
    />
  );
}
```

구조 옵션(`mode`, `math`, `mindmap`, `preview`, `autoPreview`, `renderDebounce`)이 바뀌면 내부 인스턴스를 다시 만듭니다. `value`, `onChange`, `theme`는 인스턴스를 재생성하지 않고 가볍게 동기화하므로 큰 문서에서도 제어 방식의 반응성을 유지합니다.

## 독립 렌더링

`renderMarkdown(source, options?)`로 에디터를 마운트하지 않고 Markdown을 HTML로 바꿀 수 있습니다. 에디터 미리보기와 같은 플러그인과 스타일을 사용합니다.

```ts
import { renderMarkdown } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';

const html = renderMarkdown('# Hello\n\n$E=mc^2$', { math: true });
document.getElementById('output')!.innerHTML = html;
```

`renderMarkdown`은 문자열을 반환합니다. 생성된 마인드맵 자리표시자는 자동으로 대화형 SVG가 되지 않습니다. 하이드레이션은 에디터 미리보기 안에서 `Renderer.hydrate`를 통해서만 수행됩니다.

## 다음 단계

- [설정](/docs/ko-KR/md-editor/configuration/) — `MarkdownEditorOptions`의 모든 필드.
- [기능](/docs/ko-KR/md-editor/features/) — 수식, 마인드맵, 도구 모음, 단축키의 동작.
- [API 참조](/docs/ko-KR/md-editor/api-reference/) — 전체 공개 API.
- [예제](/docs/ko-KR/md-editor/examples/) — 복사해서 사용할 수 있는 완전한 예제.
