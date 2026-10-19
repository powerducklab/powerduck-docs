---
sidebar_position: 2
title: "Cài đặt"
description: "Cài @powerduck/md-editor bằng npm, yarn hoặc pnpm và tìm hiểu đường dẫn nhập, phụ thuộc peer cùng hỗ trợ TypeScript."
---

# Cài đặt

Cài `@powerduck/md-editor` bằng trình quản lý gói bạn chọn.

```bash
npm install @powerduck/md-editor
```

```bash
yarn add @powerduck/md-editor
```

```bash
pnpm add @powerduck/md-editor
```

## Đường dẫn nhập

Gói khai báo rõ các đường dẫn xuất con trong `package.json`:

| Đường dẫn nhập | Nội dung |
|---|---|
| `@powerduck/md-editor` | Điểm vào chính: lớp `MarkdownEditor` cùng mọi tiện ích, kiểu và hàm độc lập. |
| `@powerduck/md-editor/react` | Đường dẫn con React: thành phần `MarkdownEditorReact` cùng các kiểu `MarkdownEditorProps` và `MarkdownEditorHandle`. |
| `@powerduck/md-editor/dist/style.css` | Stylesheet đã biên dịch của trình soạn thảo; cần nhập một lần. |
| `@powerduck/md-editor/styles/tokens.css` | Các thuộc tính CSS tùy chỉnh gốc của token thiết kế. |

Gói được phát hành dưới dạng mô-đun ECMAScript (`"type": "module"`) với hai bản dựng: `dist/index.mjs` (ESM) và `dist/index.cjs` (CommonJS). Khai báo kiểu nằm trong `dist/index.d.ts`.

```ts
// Vanilla JS main entry
import { MarkdownEditor, renderMarkdown } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';
```

```tsx
// React subpath
import { MarkdownEditorReact, type MarkdownEditorHandle } from '@powerduck/md-editor/react';
import '@powerduck/md-editor/dist/style.css';
```

## Phụ thuộc peer

`react` và `react-dom` là phụ thuộc peer **tùy chọn** (`>=17`). Chỉ cần chúng khi nhập đường dẫn con `./react`:

```bash
npm install react react-dom
```

Lớp `MarkdownEditor` không gắn với framework và hàm độc lập `renderMarkdown` không phụ thuộc React, nên có thể dùng trong mọi dự án trình duyệt mà không cài React.

## Hỗ trợ TypeScript

Gói có sẵn khai báo kiểu; không cần thêm gói `@types/*`. Điểm vào chính xuất `MarkdownEditorOptions`, `EditorMode`, `EditorTheme`, `ToolbarConfig`, `RendererOptions` và mọi kiểu tiện ích. Đường dẫn con `./react` xuất `MarkdownEditorProps` và `MarkdownEditorHandle`.

```ts
import { MarkdownEditor, type MarkdownEditorOptions } from '@powerduck/md-editor';
import type { MarkdownEditorHandle } from '@powerduck/md-editor/react';
```

## Tác dụng phụ của CSS

Các tệp `*.css` được đánh dấu có tác dụng phụ trong `package.json` để công cụ đóng gói không loại bỏ khi tree-shaking. Nhập `dist/style.css` một lần tại điểm vào ứng dụng; tệp này gồm giao diện trình soạn thảo, kiểu xem trước qua `github-markdown-css`, kiểu KaTeX và kiểu của mọi plugin.

## Các bước tiếp theo

- [Bắt đầu nhanh](/docs/vi-VN/md-editor/quickstart/) — gắn trình soạn thảo đầu tiên.
- [Cấu hình](/docs/vi-VN/md-editor/configuration/) — mọi tùy chọn của `MarkdownEditorOptions`.
