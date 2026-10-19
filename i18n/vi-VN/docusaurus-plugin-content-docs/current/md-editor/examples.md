---
sidebar_position: 7
title: "Ví dụ"
description: "Các ví dụ dưới đây dùng tên tùy chọn và thành phần xuất thực tế"
---

# Ví dụ

Các ví dụ dưới đây dùng tên tùy chọn và thành phần xuất thực tế. Nhập `@powerduck/md-editor/dist/style.css` một lần trước khi chạy. Tạo các phần tử chứa được tham chiếu trong trang và cung cấp endpoint tải lên riêng cho các ví dụ tải tệp.

## 1. Trình soạn thảo cơ bản với các tùy chọn thường dùng

Một `MarkdownEditor` bằng JavaScript thuần ở chế độ `complex`, được cấu hình các tùy chọn thường dùng:

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

## 2. Thành phần React với giá trị được kiểm soát

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

`value` và `onChange` không kích hoạt việc tạo lại phiên bản, nên thao tác nhập không hủy phiên bản CodeMirror.

## 3. Thanh công cụ tùy chỉnh (dạng mảng và đối tượng)

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

Có 22 tên thao tác hợp lệ được liệt kê trong [Tính năng](./features.md#toolbar-actions).

## 4. Tích hợp tải hình ảnh lên

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

Dán hoặc thả tệp ảnh vào trình soạn thảo; hook sẽ được gọi tự động. Markdown tạo ra được chèn tại vị trí con trỏ.

## 5. Tích hợp @mention

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

Nhập `@` sẽ mở danh sách thả xuống. Chọn một mục sẽ chèn văn bản `[@label](mention:id)`, được hiển thị thành nhãn có định dạng trong bản xem trước.

## 6. Dùng `renderMarkdown` độc lập

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

`renderMarkdown` trả về chuỗi và không gắn trình soạn thảo. Sơ đồ tư duy được xuất dưới dạng phần tử giữ chỗ `<div>` chưa hoạt động; hãy tự gọi `Renderer.hydrate` nếu cần sơ đồ tương tác ngoài trình soạn thảo.

## 7. Chế độ đơn giản (không có thanh công cụ)

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

Chế độ `simple` không có thanh công cụ, thanh trạng thái hay số dòng. Bạn vẫn có thể chuyển sang `complex` khi đang chạy bằng `editor.setMode('complex')`.

## Bước tiếp theo

- [Tham chiếu API](./api-reference.md) — chữ ký của tất cả phương thức.
- [Cấu hình](./configuration.md) — giá trị mặc định của các tùy chọn.
