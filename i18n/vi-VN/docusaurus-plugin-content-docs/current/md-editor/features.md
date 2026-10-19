---
sidebar_position: 5
title: "Tính năng"
description: "Trang này mô tả từng tính năng tích hợp theo đúng cách triển khai trong mã nguồn."
---

# Tính năng

Trang này mô tả từng tính năng tích hợp theo đúng cách triển khai trong mã nguồn.

## Kết xuất tăng dần

Bản xem trước kết xuất tăng dần theo từng khối để duy trì khả năng phản hồi với tài liệu lớn:

- **Chia khối** (`splitIntoBlocks`): nội dung nguồn được chia tại các dòng tiêu đề ATX (từ `#` đến `######`). Nội dung nằm trong khối mã có hàng rào dấu huyền hoặc dấu ngã không được dùng làm điểm chia; tiêu đề trong vùng chứa tùy chỉnh `:::` cũng được giữ nguyên. Tài liệu không có tiêu đề được xử lý thành một khối duy nhất.
- **Kết xuất từng khối**: chỉ các khối có mã băm nội dung thay đổi mới được xử lý lại qua markdown-it / KaTeX. Các khối không đổi dùng lại trực tiếp nút DOM hiện có, kể cả SVG sơ đồ tư duy đã được kích hoạt tương tác.
- **Bộ nhớ đệm theo mã băm nội dung**: kết quả kết xuất được lưu theo mã băm (hàm băm nhanh kiểu djb2 kết hợp độ dài), nên thao tác hoàn tác/làm lại và sao chép đoạn văn giống nhau cũng tận dụng được bộ nhớ đệm. Khi số mục vượt quá 800, các mã băm không còn trong tài liệu sẽ bị loại bỏ. Mục tương ứng với khối hiện tại vẫn được giữ lại, vì vậy tài liệu có hơn 800 khối khác nhau có thể vượt ngưỡng này.
- **Sắp xếp lại**: khối được đổi vị trí bằng cách thêm các nút hiện có vào một `DocumentFragment`.
- **Trì hoãn thích ứng** (`adaptiveDebounceMs(docLength, base = 120, max = 600)`): thời gian chờ trước khi kết xuất là `base + floor(docLength / 20000) * 60`, tối đa bằng `max`. Ghi đè bằng `renderDebounce`, hoặc đặt `renderDebounce: false` để kết xuất đồng bộ.
- **`content-visibility: auto`**: mỗi khối được bọc trong phần tử `.md-editor-block` để bỏ qua việc bố trí và vẽ các khối ngoài màn hình.

Lỗi kết xuất ở một khối không làm trống toàn bộ bản xem trước; thay vào đó, mã nguồn của khối được escape và hiển thị trong `<pre>`.

## Công thức KaTeX

Plugin toán học markdown-it độc lập kết xuất công thức bằng KaTeX (không phụ thuộc `markdown-it-texmath`):

- **Công thức trong dòng**: `$E=mc^2$` — nội dung không được rỗng, chứa `$` hoặc ký tự xuống dòng. Các chuỗi giống số tiền như `$5` hay `$10.50` được loại trừ bằng quy tắc nhận diện gần đúng.
- **Công thức dạng khối**:
  ```markdown
  $$
  \int_0^1 x^2 \, dx
  $$
  ```
  Hỗ trợ cả dạng một dòng (`$$ ... $$`) và nhiều dòng. CSS của KaTeX được đóng gói sẵn. Tắt bằng `math: false`.

## Sơ đồ tư duy Markmap

Viết một khối có hàng rào ```` ```mindmap ```` với nội dung là dàn ý Markdown:

````markdown
```mindmap
# Root topic
## Branch one
- Child A
- Child B
## Branch two
- Child C
```
````

Quy tắc xử lý khối theo dõi độ sâu lồng nhau của hàng rào để giữ nguyên các khối mã bên trong sơ đồ tư duy. Lượt kết xuất đồng bộ tạo phần tử giữ chỗ `<div>`; `Renderer.hydrate(container)` nhập bất đồng bộ `markmap-lib` và `markmap-view`, rồi chuyển từng phần tử giữ chỗ thành SVG tương tác. Lỗi kích hoạt tương tác không làm dừng toàn bộ quá trình. Tắt bằng `mindmap: false`.

## Tô sáng mã kèm nút sao chép

Các khối mã có hàng rào được tô sáng bằng highlight.js. Bản dựng đăng ký một tập ngôn ngữ cố định: JavaScript, TypeScript, Python, JSON, Bash/Shell, CSS, XML/HTML/SVG, SQL, YAML, Markdown, Go, Rust, Java, C và C++ (cùng các bí danh phổ biến như `js`, `ts`, `py`, `sh`, `yml`, `md`, `rs`, `c++`). Ngôn ngữ không xác định được tự động nhận diện; nếu nhận diện thất bại, nội dung được hiển thị dưới dạng văn bản thuần đã escape.

Mỗi khối được tô sáng nằm trong vùng chứa kiểu macOS với ba chấm màu, nhãn ngôn ngữ và nút **Sao chép**. Nút sao chép dùng cơ chế ủy quyền sự kiện trên khung xem trước và chuyển sang `document.execCommand('copy')` khi Clipboard API không khả dụng. Tắt bằng `codeHighlight: false`.

## Thao tác trên thanh công cụ {#toolbar-actions}

Ở chế độ `complex`, thanh công cụ gồm 22 thao tác sau theo thứ tự mặc định:

| # | Tên thao tác | Chức năng |
|---|-------------|---------------|
| 1 | `heading` | Tiêu đề |
| 2 | `bold` | In đậm (Ctrl+B) |
| 3 | `italic` | In nghiêng (Ctrl+I) |
| 4 | `link` | Liên kết (Ctrl+K) |
| 5 | `image` | Chèn hình ảnh |
| 6 | `video` | Chèn video |
| 7 | `youtube` | Chèn video YouTube |
| 8 | `quote` | Trích dẫn |
| 9 | `ul` | Danh sách không thứ tự |
| 10 | `ol` | Danh sách có thứ tự |
| 11 | `tasklist` | Danh sách công việc |
| 12 | `mention` | Đề cập (@) |
| 13 | `doclink` | Chèn liên kết tài liệu |
| 14 | `code` | Khối mã |
| 15 | `table` | Bảng |
| 16 | `math` | Công thức toán |
| 17 | `mindmap` | Chèn sơ đồ tư duy |
| 18 | `hr` | Đường kẻ ngang |
| 19 | `tips` | Chèn hộp chú thích |
| 20 | `preview` | Bật/tắt xem trước |
| 21 | `help` | Phím tắt |
| 22 | `theme` | Đổi giao diện |

Các nhãn tích hợp dùng tiếng Anh. Ghi đè `label` của từng mục để bản địa hóa chú giải và tên hỗ trợ tiếp cận. Một số thao tác mở hộp thoại hoặc bộ chọn mẫu: hình ảnh, video, YouTube, bảng, công thức (mẫu), sơ đồ tư duy (mẫu), hộp chú thích (lưới loại) và trợ giúp. Cấu hình thanh công cụ bằng tùy chọn `toolbar` theo hướng dẫn trong [Cấu hình](./configuration.md#toolbarconfig).

## Phím tắt

Các phím tắt tích hợp được định nghĩa trong `DEFAULT_SHORTCUTS`. `Mod` tương ứng với Ctrl trên Windows/Linux và Cmd trên macOS.

| Phím | Thao tác | Mô tả |
|-----|--------|-------------|
| `Mod-b` | `bold` | In đậm |
| `Mod-i` | `italic` | In nghiêng |
| `Mod-Alt-1` | `heading` | Tiêu đề |
| `Mod-k` | `link` | Chèn liên kết |
| `Mod-Alt-c` | `code` | Khối mã |
| `Mod-Shift-.` | `quote` | Khối trích dẫn |
| `Mod-Shift-8` | `ul` | Danh sách không thứ tự |
| `Mod-Shift-7` | `ol` | Danh sách có thứ tự |
| `Mod-Shift-9` | `tasklist` | Danh sách công việc |
| `Mod-Alt-m` | `math` | Công thức toán |
| `Mod-Alt-p` | `preview` | Bật/tắt xem trước |
| `Mod-Shift-l` | `theme` | Đổi giao diện |

Nút **Trợ giúp** trên thanh công cụ mở hộp thoại liệt kê phím tắt dưới dạng phím trực quan, kèm phần tra cứu nhanh về danh sách công việc, đề cập, liên kết tài liệu, công thức, sơ đồ tư duy và hộp chú thích.

## Tải hình ảnh lên

Cung cấp `onImageUpload: (file: File) => Promise<string>`. Hook được gọi khi tệp ảnh được dán hoặc thả vào trình soạn thảo. Hộp thoại hình ảnh nhận URL và không có chức năng chọn tệp. Trả về URL ảnh công khai; trình soạn thảo chèn `![alt](url)` tại con trỏ (dùng tên tệp bỏ phần mở rộng làm văn bản thay thế). Lỗi tải lên được bỏ qua mà không hiện thông báo, cho phép người dùng thử lại.

## @mention

Truyền tùy chọn `mention` để bật danh sách tìm kiếm khi người dùng nhập `@`:

- `onMentionSearch(query)` trả về các mục `MentionItem` phù hợp.
- `onMentionSelect(item)` trả về văn bản cần chèn. Mặc định là `[@label](mention:id)`, được bộ kết xuất chuyển thành nhãn có định dạng.
- `minChars` (mặc định `0`) và `maxItems` (mặc định `8`) điều chỉnh danh sách.

Danh sách hỗ trợ điều hướng bằng ArrowUp/ArrowDown, Enter/Tab và Escape, đồng thời đóng khi trình soạn thảo mất tiêu điểm. Trong bản xem trước, văn bản `@` thuần như `@media` không trở thành nhãn; chỉ liên kết dùng lược đồ `mention:` mới được hiển thị như vậy. Trong trình soạn thảo, hook tìm kiếm đã cấu hình vẫn có thể được kích hoạt bởi văn bản này.

## Liên kết tài liệu

Truyền tùy chọn `docLink` để bật danh sách tìm kiếm tài liệu sau ký tự kích hoạt (mặc định `/`):

- `onDocSearch(query)` trả về các mục `DocItem` phù hợp.
- `onFetchDocMeta(url)` lấy tiêu đề, ảnh thu nhỏ và mô tả. Triển khai tích hợp dùng `fetch` + `DOMParser` để đọc thẻ Open Graph và có thể thất bại nếu máy chủ khác nguồn không cho phép CORS. Khi cần, hãy dùng proxy phía máy chủ tùy chỉnh.
- `insertStyle` kiểm soát cách chèn: `'auto'` (thẻ khi có siêu dữ liệu), `'card'` hoặc `'link'`.

Tài liệu được chọn được chèn dưới dạng liên kết thuần hoặc thẻ `:::doc-link`, hiển thị tiêu đề, ảnh thu nhỏ, mô tả và tên máy chủ trong một thẻ xem trước có thể nhấp.

## Khối thông báo / chú thích

Viết vùng chứa `:::` với một trong sáu loại. Có thể thêm tiêu đề sau tên loại trên dòng mở đầu:

```markdown
:::notice
This is a notice.
:::

:::warning Title here
Warning content.
:::
```

Các loại được hỗ trợ: `notice`, `info`, `tip`, `success`, `warning`, `danger`. Mỗi loại có biểu tượng, đường viền trái có màu và tiêu đề. Nút chú thích trên thanh công cụ mở bộ chọn trực quan cho cả sáu loại. Tắt bằng `tips: false`.

## Danh sách công việc

Các mục khớp với `- [ ]` hoặc `- [x]` (cho phép khoảng trắng tùy ý trong ngoặc) được hiển thị thành hộp kiểm bị vô hiệu hóa. Lưu ý quy ước của dự án: **`- [ ]` hiển thị đã chọn (màu xanh lá), còn `- [x]` hiển thị chưa chọn** — ngược với GitHub Flavored Markdown. Nút danh sách công việc trên thanh công cụ bật/tắt dấu đánh dấu ở dòng hiện tại hoặc các dòng được chọn.

## Bước tiếp theo

- [Cấu hình](./configuration.md) — điều chỉnh tính năng bằng các tùy chọn.
- [Tham chiếu API](./api-reference.md) — điều khiển trình soạn thảo bằng mã.
