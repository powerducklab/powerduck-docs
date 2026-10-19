---
sidebar_position: 7
title: "예제"
description: "아래 예제는 실제 내보내기와 옵션 이름을 사용합니다"
---

# 예제

아래 예제는 실제 내보내기와 옵션 이름을 사용합니다. 실행 전에 `@powerduck/md-editor/dist/style.css`를 한 번 가져오세요. 페이지에 예제에서 참조하는 컨테이너 요소를 만들고, 업로드 예제에는 자체 업로드 엔드포인트를 제공해야 합니다.

## 1. 자주 쓰는 옵션을 설정한 기본 편집기

일반 JS로 `complex` 모드의 `MarkdownEditor`를 만들고 자주 쓰는 옵션을 설정합니다.

```ts
import { MarkdownEditor, type MarkdownEditorOptions } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';

const options: MarkdownEditorOptions = {
  value: '# Hello\n\nStart writing here...',
  mode: 'complex',
  theme: 'light',
  math: true,
  mindmap: true,
  codeHighlight: true,
  tips: true,
  preview: true,
  autoPreview: true,
  renderDebounce: false, // render synchronously for this demo
  onChange: (value) => console.log('changed:', value.length, 'chars'),
  onImageUpload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.url as string;
  },
  toolbar: ['heading', 'bold', 'italic', 'link', 'image', 'code'],
};

const editor = new MarkdownEditor('#editor', options);
// Call editor.destroy() when removing this editor from the page.

document.querySelector('#save')?.addEventListener('click', () => {
  console.log(editor.getValue());
});
```

## 2. 값을 제어하는 React 컴포넌트

```tsx
import { useRef, useState } from 'react';
import { MarkdownEditorReact, type MarkdownEditorHandle } from '@powerduck/md-editor/react';
import '@powerduck/md-editor/dist/style.css';

function NoteEditor() {
  const [value, setValue] = useState('# Draft\n\nWrite something...');
  const handleRef = useRef<MarkdownEditorHandle>(null);

  return (
    <div>
      <button onClick={() => handleRef.current?.getHtml()}>Render HTML</button>
      <MarkdownEditorReact
        ref={handleRef}
        value={value}
        onChange={setValue}
        mode="complex"
        theme="light"
      />
    </div>
  );
}

export default NoteEditor;
```

`value`와 `onChange`는 인스턴스 재생성 조건에서 제외되므로 입력할 때 CodeMirror 인스턴스가 제거되지 않습니다.

## 3. 사용자 지정 도구 모음(배열 및 레코드 형식)

```ts
import { MarkdownEditor } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';

// Array form: an include-list. Actions retain the built-in toolbar order.
new MarkdownEditor('#editor-array', {
  mode: 'complex',
  toolbar: ['bold', 'italic', 'link', 'code', 'math'],
});

// Record form: per-item overrides. Everything not listed stays visible.
new MarkdownEditor('#editor-record', {
  mode: 'complex',
  toolbar: {
    bold: { label: 'Make bold' },
    image: { show: false },
    youtube: { show: false },
    theme: { icon: '<svg>...</svg>' },
  },
});
```

사용 가능한 동작 이름은 [기능](./features.md#toolbar-actions)에 나열된 22개입니다.

## 4. 이미지 업로드 연동

```ts
import { MarkdownEditor } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';

const editor = new MarkdownEditor('#editor', {
  mode: 'complex',
  onImageUpload: async (file: File): Promise<string> => {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: form });
    if (!res.ok) throw new Error('Upload failed');
    const { url } = await res.json();
    return url; // inserted as ![filename](url)
  },
});
```

이미지 파일을 편집기에 붙여넣거나 끌어다 놓으면 훅이 자동으로 호출됩니다. 생성된 Markdown은 커서 위치에 삽입됩니다.

## 5. @mention 연동

```ts
import { MarkdownEditor, type MentionItem } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';

const USERS: MentionItem[] = [
  { id: '1', label: 'Alice', avatar: 'https://example.com/a.png', description: 'alice@example.com' },
  { id: '2', label: 'Bob', description: 'bob@example.com' },
];

new MarkdownEditor('#editor', {
  mode: 'complex',
  mention: {
    onMentionSearch: async (query) =>
      USERS.filter((u) => u.label.toLowerCase().includes(query.toLowerCase())),
    onMentionSelect: (item) => `[@${item.label}](mention:${item.id})`,
    minChars: 0,
    maxItems: 8,
  },
});
```

`@`를 입력하면 드롭다운이 열립니다. 항목을 선택하면 `[@label](mention:id)` 텍스트가 삽입되고 미리보기에서 스타일이 적용된 배지로 표시됩니다.

## 6. `renderMarkdown` 독립 사용

```ts
import { renderMarkdown } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';

const source = [
  '# Hello',
  '',
  'Inline: $E=mc^2$.',
  '',
  '```ts',
  'const x: number = 1;',
  '```',
  '',
  ':::tip',
  'Callout block.',
  ':::',
].join('\n');

const html = renderMarkdown(source, { math: true, tips: true });
document.getElementById('output')!.innerHTML = html;
```

`renderMarkdown`은 문자열을 반환하며 편집기를 마운트하지 않습니다. 마인드맵은 아직 활성화되지 않은 `<div>` 자리표시자로 출력됩니다. 편집기 밖에서 대화형 다이어그램을 사용하려면 `Renderer.hydrate`를 직접 호출하세요.

## 7. 간단 모드(도구 모음 없음)

```ts
import { MarkdownEditor } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';

const editor = new MarkdownEditor('#editor', {
  value: '# Minimal editor\n\nNo toolbar, no status bar.',
  mode: 'simple',   // default; pure edit + preview
  theme: 'dark',
  preview: true,
});
```

`simple` 모드에는 도구 모음, 상태 표시줄, 줄 번호가 없습니다. 실행 중에도 `editor.setMode('complex')`를 사용해 `complex`로 전환할 수 있습니다.

## 다음 단계

- [API 참조](./api-reference.md) — 모든 메서드 시그니처.
- [설정](./configuration.md) — 옵션 기본값.
