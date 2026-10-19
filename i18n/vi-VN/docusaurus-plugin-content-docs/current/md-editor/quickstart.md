---
sidebar_position: 3
title: "Bắt đầu nhanh"
description: "Gắn MarkdownEditor bằng JavaScript thuần, dùng thành phần React hoặc kết xuất Markdown độc lập với renderMarkdown."
---

# Bắt đầu nhanh

Bạn có thể dùng `@powerduck/md-editor` theo ba cách: trình soạn thảo JavaScript thuần, thành phần React hoặc bộ kết xuất Markdown độc lập. Chỉ nhập tệp định kiểu một lần cho mỗi ứng dụng.

## JavaScript thuần

Chữ ký hàm khởi tạo là `new MarkdownEditor(container, options?)`. Đối số đầu tiên là một `HTMLElement` hoặc chuỗi bộ chọn CSS.

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

Nếu không tìm thấy phần tử chứa để gắn trình soạn thảo, hàm khởi tạo sẽ phát sinh lỗi `MarkdownEditor: mount container not found`.

## React

Nhập `MarkdownEditorReact` từ đường dẫn con `./react`. Thành phần `forwardRef` này hỗ trợ cả chế độ có kiểm soát (`value`) và không kiểm soát (`defaultValue`), đồng thời cung cấp giao diện điều khiển bằng lệnh qua `ref`.

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

Thay đổi các tùy chọn cấu trúc (`mode`, `math`, `mindmap`, `preview`, `autoPreview`, `renderDebounce`) sẽ tạo lại phiên bản nội bộ. `value`, `onChange` và `theme` được đồng bộ nhẹ mà không tạo lại phiên bản, giúp chế độ có kiểm soát vẫn phản hồi nhanh với tài liệu lớn.

## Kết xuất độc lập

Dùng `renderMarkdown(source, options?)` để chuyển Markdown thành HTML mà không cần gắn trình soạn thảo, với cùng plugin và định kiểu như bản xem trước của trình soạn thảo.

```ts
import { renderMarkdown } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';

const html = renderMarkdown('# Hello\n\n$E=mc^2$', { math: true });
document.getElementById('output')!.innerHTML = html;
```

`renderMarkdown` trả về một chuỗi. Các phần giữ chỗ cho sơ đồ tư duy không tự động trở thành sơ đồ SVG tương tác. Việc kích hoạt tương tác chỉ diễn ra trong bản xem trước của trình soạn thảo đang hoạt động, thông qua `Renderer.hydrate`.

## Các bước tiếp theo

- [Cấu hình](/docs/vi-VN/md-editor/configuration/) — Tất cả trường của `MarkdownEditorOptions`.
- [Tính năng](/docs/vi-VN/md-editor/features/) — Cách hoạt động của công thức, sơ đồ tư duy, thanh công cụ và phím tắt.
- [Tham chiếu API](/docs/vi-VN/md-editor/api-reference/) — Toàn bộ API công khai.
- [Ví dụ](/docs/vi-VN/md-editor/examples/) — Các ví dụ hoàn chỉnh có thể sao chép.
