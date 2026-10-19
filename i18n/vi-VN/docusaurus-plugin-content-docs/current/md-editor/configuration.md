---
sidebar_position: 4
title: "Cấu hình"
description: "Hàm khởi tạo MarkdownEditor nhận phần tử chứa hoặc bộ chọn, sau đó là đối tượng MarkdownEditorOptions. Trang này mô tả kiểu, giá trị mặc định và hành vi của từng trường cùng các kiểu tùy chọn liên quan."
---

# Cấu hình

Hàm khởi tạo `MarkdownEditor` nhận phần tử chứa hoặc bộ chọn, sau đó là đối tượng `MarkdownEditorOptions`. Trang này mô tả kiểu, giá trị mặc định và hành vi của từng trường cùng các kiểu tùy chọn liên quan.

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

| Tùy chọn | Kiểu | Mặc định | Mô tả |
|--------|------|---------|-------------|
| `value` | `string` | `''` | Nội dung Markdown ban đầu. |
| `mode` | `EditorMode` | `'simple'` | `'simple'` hiển thị vùng soạn thảo và xem trước, không có thanh công cụ hay trạng thái. `'complex'` thêm cả hai thanh. |
| `theme` | `EditorTheme` | `'light'` | Giao diện màu áp dụng qua thuộc tính `data-theme`: `'light'` hoặc `'dark'`. |
| `math` | `boolean` | `true` | Bật công thức KaTeX: `$...$` nội dòng và `$$...$$` dạng khối. |
| `mindmap` | `boolean` | `true` | Bật sơ đồ tư duy Markmap từ khối mã có dấu rào ```` ```mindmap ````. |
| `codeHighlight` | `boolean` | `true` | Bật khối mã highlight.js với thanh đầu ba chấm màu và nút sao chép. |
| `tips` | `boolean` | `true` | Bật khối thông báo như `:::notice`, `:::warning`. |
| `preview` | `boolean` | `true` | Hiển thị vùng xem trước. Với `false`, chỉ tạo vùng soạn thảo. |
| `onChange` | `(value: string) => void` | — | Được gọi sau mỗi lần chỉnh sửa với chuỗi toàn bộ tài liệu. |
| `toolbar` | `ToolbarConfig` | mọi thao tác | Chọn các thao tác hiển thị trên thanh công cụ và thay nhãn hoặc biểu tượng. |
| `onImageUpload` | `(file: File) => Promise<string>` | — | Hook được gọi khi dán hoặc kéo thả tệp ảnh vào trình soạn thảo. Promise phải trả về URL ảnh để chèn dưới dạng `![alt](url)`. Hộp thoại ảnh nhận URL, không có bộ chọn tệp. |
| `mention` | `MentionOptions` | — | Cấu hình danh sách @đề cập. Nếu bỏ qua, gõ `@` không mở danh sách. |
| `docLink` | `DocLinkOptions` | — | Cấu hình chèn liên kết tài liệu. Nếu bỏ qua, gõ ký tự kích hoạt không mở danh sách. |
| `renderDebounce` | `number \| false` | thích ứng | Độ trễ debounce của bản xem trước, tính bằng mili giây. `false` kết xuất đồng bộ sau mỗi chỉnh sửa; số đặt độ trễ cố định. Nếu bỏ qua, dùng `adaptiveDebounceMs(value.length)`, từ 120 ms đến 600 ms. |
| `autoPreview` | `boolean` | `true` | Với `true`, bản xem trước được kết xuất lại sau chỉnh sửa, có debounce. Với `false`, gọi `renderNow()` hoặc dùng nút làm mới trên thanh trạng thái. |

## `EditorMode` và `EditorTheme`

```ts
type EditorMode = 'simple' | 'complex';
type EditorTheme = 'light' | 'dark';
```

- `'simple'` (mặc định): không có thanh công cụ, thanh trạng thái hay số dòng.
- `'complex'`: bật thanh công cụ, thanh trạng thái và số dòng.
- `'light'` (mặc định) và `'dark'` điều khiển bảng màu tô sáng cú pháp cùng thuộc tính CSS tùy chỉnh.

Có thể đổi cả hai khi đang chạy bằng `setMode(mode)` và `setTheme(theme)`.

## `ToolbarConfig`

`ToolbarConfig` là **mảng tên thao tác** cần hiển thị hoặc **đối tượng ánh xạ tên thao tác tới thiết lập ghi đè**:

```ts
type ToolbarConfig = string[] | Record<string, ToolbarItemOverride>;
```

### Dạng mảng (danh sách được hiển thị)

Chỉ hiển thị các thao tác được liệt kê. Thứ tự vẫn là thứ tự tích hợp của thanh công cụ; mảng lọc khả năng hiển thị, không thay đổi thứ tự:

```ts
new MarkdownEditor('#editor', {
  mode: 'complex',
  toolbar: ['heading', 'bold', 'italic', 'link', 'code'],
});
```

### Dạng đối tượng (ghi đè từng mục)

Mặc định mọi thao tác đều hiển thị. Dạng đối tượng cho phép ẩn mục hoặc thay nhãn và biểu tượng:

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

Danh sách đầy đủ tên thao tác hợp lệ nằm trong [Tính năng](./features.md#toolbar-actions).

## `MentionOptions`

```ts
interface MentionOptions {
  onMentionSearch?: (query: string) => MentionItem[] | Promise<MentionItem[]>;
  onMentionSelect?: (item: MentionItem) => string;
  minChars?: number;
  maxItems?: number;
}
```

| Trường | Kiểu | Mặc định | Mô tả |
|-------|------|---------|-------------|
| `onMentionSearch` | `(query: string) => MentionItem[] \| Promise<MentionItem[]>` | — | Hook tìm kiếm nhận văn bản gõ sau `@`. Cần có để bật danh sách thả xuống. |
| `onMentionSelect` | `(item: MentionItem) => string` | `` (item) => `[@${item.label}](mention:${item.id})` `` | Trả về văn bản chèn tại con trỏ để thay `@query`. Dùng dạng `[@label](mention:id)` để bản xem trước hiển thị thành nhãn. |
| `minChars` | `number` | `0` | Độ dài truy vấn tối thiểu để hiện danh sách. |
| `maxItems` | `number` | `8` | Số mục tối đa hiển thị trong danh sách. |

`MentionItem` được mô tả trong [tham chiếu API](./api-reference.md).

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

| Trường | Kiểu | Mặc định | Mô tả |
|-------|------|---------|-------------|
| `onDocSearch` | `(query: string) => DocItem[] \| Promise<DocItem[]>` | — | Hook tìm kiếm được gọi sau ký tự kích hoạt. Cần có để bật danh sách thả xuống. |
| `onFetchDocMeta` | `(url: string) => Promise<DocMeta>` | fetch + DOMParser tích hợp | Ghi đè hook này để lấy siêu dữ liệu qua proxy phía máy chủ và tránh giới hạn CORS của trình duyệt. |
| `insertStyle` | `'card' \| 'link' \| 'auto'` | `'auto'` | `'card'` chèn thẻ `:::doc-link`, hoặc liên kết nếu không có siêu dữ liệu; `'link'` luôn chèn liên kết Markdown thường; `'auto'` chèn thẻ khi có siêu dữ liệu. |
| `triggerChar` | `string` | `'/'` | Ký tự mở danh sách tìm kiếm tài liệu. |
| `minChars` | `number` | `0` | Độ dài truy vấn tối thiểu trước khi tìm kiếm. |
| `maxItems` | `number` | `8` | Số mục tối đa hiển thị trong danh sách. |

## `RendererOptions`

Dùng cho hàm khởi tạo `Renderer` và `renderMarkdown(source, options)`.

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

| Tùy chọn | Kiểu | Mặc định | Mô tả |
|--------|------|---------|-------------|
| `math` | `boolean` | `true` | Bật kết xuất công thức KaTeX. |
| `mindmap` | `boolean` | `true` | Bật kết xuất sơ đồ tư duy Markmap. |
| `codeHighlight` | `boolean` | `true` | Bật khối mã highlight.js. |
| `tips` | `boolean` | `true` | Bật khối thông báo. |
| `html` | `boolean` | `false` | Cho phép HTML thô trong nguồn Markdown. Giá trị mặc định `false` an toàn hơn. |
| `breaks` | `boolean` | `false` | Chuyển xuống dòng mềm thành `<br>`. |
| `theme` | `'light' \| 'dark'` | — | Với `renderMarkdown`, bọc HTML trong vùng chứa có giao diện màu. `Renderer.render` trả về HTML không có lớp bọc; hãy tự đặt kiểu hiển thị cho vùng chứa. |

Ô đánh dấu của danh sách việc cần làm, thẻ `:::doc-link` và nhãn @đề cập luôn bật, không thể tắt qua `RendererOptions`.

## Bước tiếp theo

- [Tính năng](./features.md) — hành vi của từng tùy chọn khi chạy.
- [Tham chiếu API](./api-reference.md) — toàn bộ kiểu dữ liệu.
