---
sidebar_position: 1
title: "Giới thiệu"
description: "@powerduck/md-editor là trình soạn thảo Markdown hiệu năng cao có thể nhúng vào trình duyệt. Thư viện kết hợp vùng soạn thảo CodeMirror 6 với bản xem trước trực tiếp do markdown-it kết xuất, đồng thời cung cấp công thức KaTeX, sơ đồ tư duy Markmap, tô sáng mã, khối thông báo, thanh công cụ tùy chỉnh, phím tắt, hook tải ảnh lên, @đề cập và chèn liên kết tài liệu."
---

# Giới thiệu

`@powerduck/md-editor` là trình soạn thảo Markdown hiệu năng cao có thể nhúng vào trình duyệt. Thư viện kết hợp vùng soạn thảo [CodeMirror 6](https://codemirror.net) với bản xem trước trực tiếp do [markdown-it](https://github.com/markdown-it/markdown-it) kết xuất, đồng thời cung cấp công thức KaTeX, sơ đồ tư duy Markmap, tô sáng mã, khối thông báo, thanh công cụ tùy chỉnh, phím tắt, hook tải ảnh lên, @đề cập và chèn liên kết tài liệu.

- **Tên gói:** `@powerduck/md-editor` <img src="https://img.shields.io/npm/v/@powerduck/md-editor"/>
- **Giấy phép:** MIT
- **Định dạng mô-đun:** mô-đun ECMAScript (`type: "module"`), có bản dựng ESM (`dist/index.mjs`), CJS (`dist/index.cjs`) và khai báo kiểu đi kèm (`dist/index.d.ts`).

## Tính năng chính

Các tính năng sau tương ứng với những mô-đun đã được triển khai trong mã nguồn:

- **Soạn thảo Markdown** bằng CodeMirror 6, với tô sáng cú pháp Markdown và giao diện tô sáng sáng/tối.
- **Công thức KaTeX** qua plugin markdown-it độc lập: nội dòng `$...$` và dạng khối `$$...$$`. Các giá trị tiền tệ như `$5` được loại khỏi việc phân tích công thức bằng quy tắc nhận diện.
- **Sơ đồ tư duy Markmap** được kết xuất từ khối mã có dấu rào ```` ```mindmap ````. markmap-lib và markmap-view được nhập động nên không làm tăng gói tải ban đầu khi không có sơ đồ tư duy.
- **Tô sáng mã** bằng highlight.js, với thanh đầu có ba chấm màu kiểu macOS, nhãn ngôn ngữ và nút sao chép một lần nhấp.
- **Khối thông báo** (`:::notice`, `:::info`, `:::tip`, `:::success`, `:::warning`, `:::danger`) có biểu tượng và màu sắc tương ứng.
- **Bản xem trước kiểu GitHub** sử dụng `github-markdown-css`.
- **Thanh công cụ đầy đủ** với 22 thao tác, hộp thoại chèn ảnh, video, YouTube và bảng, bộ chọn mẫu công thức và sơ đồ tư duy, cùng hộp thoại trợ giúp liệt kê mọi phím tắt.
- **Phím tắt** sử dụng `Mod`, tương ứng với Ctrl trên Windows/Linux và Cmd trên macOS.
- **Thanh công cụ tùy chỉnh** qua mảng các mục cần hiển thị hoặc thiết lập riêng từng mục (`show`, `label`, `icon`).
- **Hook tải ảnh lên** (`onImageUpload`) được gọi khi dán hoặc kéo thả ảnh vào trình soạn thảo.
- **Danh sách thả xuống @đề cập** được cấu hình qua `mention`; các đề cập đã chọn hiển thị dưới dạng nhãn có định dạng trong bản xem trước.
- **Chèn liên kết tài liệu** được cấu hình qua `docLink`: liên kết thường hoặc thẻ xem trước `:::doc-link`. Siêu dữ liệu được lấy bằng trình tải tích hợp hoặc hook tùy chỉnh; yêu cầu khác nguồn chịu quy tắc CORS của trình duyệt.
- **Kết xuất video:** cú pháp ảnh có URL kết thúc bằng `.mp4`, `.webm`, `.ogg` hoặc phần mở rộng được nhận diện khác sẽ tạo phần tử `<video controls>`.
- **Bộ kết xuất độc lập** (`renderMarkdown(source, options)`) tạo HTML với cùng plugin và kiểu hiển thị như bản xem trước mà không cần gắn trình soạn thảo.
- **Kết xuất tăng dần theo khối:** nguồn được chia tại các tiêu đề ATX và chỉ khối thay đổi được kết xuất lại. Khối không đổi tái sử dụng nút DOM hiện có, kể cả SVG sơ đồ tư duy đã khởi tạo. Kết quả được lưu đệm theo mã băm nội dung.
- **Debounce thích ứng:** độ trễ cập nhật bản xem trước thay đổi theo độ dài tài liệu, từ 120 ms đến tối đa 600 ms.
- **Hai chế độ soạn thảo:** `simple` (soạn thảo và xem trước, không có thanh công cụ) và `complex` (có thanh công cụ và thanh trạng thái), chuyển đổi được khi đang chạy.
- **Hai giao diện:** `light` và `dark`, áp dụng qua thuộc tính `data-theme` và thuộc tính CSS tùy chỉnh.

## Tổng quan kiến trúc

Thư viện cung cấp hai giao diện lập trình:

1. **Lớp JavaScript thuần** — API chính xoay quanh `MarkdownEditor`, được khởi tạo với phần tử chứa. Lớp này kết hợp `CodeEditor` (lớp bọc CodeMirror), `Renderer` (lớp bọc markdown-it), `IncrementalRenderer` cho bản xem trước và, trong chế độ `complex`, `Toolbar` cùng `StatusBar`. Hộp thoại, bộ điều khiển @đề cập và bộ điều khiển liên kết tài liệu là các mô-đun được gắn khi cần.

2. **Mục xuất React qua đường dẫn con** — `MarkdownEditorReact` là thành phần `forwardRef` được xuất từ `./react`. Nó bọc phiên bản `MarkdownEditor` thuần, hỗ trợ `value` có kiểm soát và không kiểm soát, đồng thời cung cấp `MarkdownEditorHandle` kiểu mệnh lệnh qua ref. Điểm vào React tách riêng nên dự án không dùng React không bắt buộc cài `react` và `react-dom`.

Quá trình kết xuất gồm bước markdown-it đồng bộ tạo HTML giữ chỗ cho sơ đồ tư duy và bước khởi tạo bất đồng bộ bằng `Renderer.hydrate` để chuyển chúng thành sơ đồ SVG tương tác. `renderMarkdown` trả về HTML đồng bộ; để tạo SVG, hãy dùng `Renderer.render`, chèn HTML vào DOM rồi gọi `Renderer.hydrate`. Bộ kết xuất tăng dần thao tác trực tiếp trên vùng chứa bản xem trước.

## Hỗ trợ trình duyệt

Thư viện hướng tới trình duyệt hiện đại có DOM. CodeMirror 6, KaTeX và markmap-view là gói phụ thuộc, không phải tính năng trình duyệt; sơ đồ tư duy tương tác dùng `ResizeObserver`. API Clipboard được dùng khi có sẵn. Nếu `navigator.clipboard` không khả dụng, chẳng hạn ngoài HTTPS, việc sao chép khối mã dùng `document.execCommand('copy')`. Mô-đun sơ đồ tư duy chỉ đăng ký bản triển khai rỗng của `ResizeObserver` khi đối tượng toàn cục chưa tồn tại, nhằm tránh lỗi khi nhập mô-đun; bản này không cung cấp thông báo thay đổi kích thước thực sự.

## Giấy phép

`@powerduck/md-editor` được phát hành theo giấy phép **MIT**.

## Bước tiếp theo

- [Cài đặt](./installation.md) — cài gói và tìm hiểu đường dẫn nhập.
- [Bắt đầu nhanh](./quickstart.md) — gắn trình soạn thảo đầu tiên bằng JavaScript thuần hoặc React.
- [Cấu hình](./configuration.md) — mọi tùy chọn của `MarkdownEditorOptions`.
- [Tính năng](./features.md) — tìm hiểu chi tiết từng tính năng tích hợp.
- [Tham chiếu API](./api-reference.md) — mọi lớp, hàm và kiểu được xuất.
- [Ví dụ](./examples.md) — đoạn mã đầy đủ, có thể chạy.
