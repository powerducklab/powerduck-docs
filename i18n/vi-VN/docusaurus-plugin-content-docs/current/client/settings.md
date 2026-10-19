---
sidebar_position: 9
title: "Cài đặt"
description: "Cài đặt desktop kiểm soát giao diện ứng dụng và cách gửi yêu cầu. Tùy chọn ứng dụng tách biệt với thay đổi tài liệu API, nên đổi giao diện hay cấu hình proxy không làm thay đổi hợp đồng."
---

# Cài đặt

Cài đặt desktop kiểm soát giao diện ứng dụng và cách gửi yêu cầu. Tùy chọn ứng dụng tách biệt với thay đổi tài liệu API, nên đổi giao diện hay cấu hình proxy không làm thay đổi hợp đồng.

## Giao diện

- **Chủ đề** — chuyển giữa sáng và tối (`theme.get`, `theme.set`). Lựa chọn áp dụng cho toàn ứng dụng và được lưu lại.
- **Ngôn ngữ giao diện** — chọn một trong mười sáu ngôn ngữ hoặc tự động theo hệ thống:

| | | |
|---|---|---|
| English (US) | 简体中文 | 繁體中文 |
| 日本語 | 한국어 | Français |
| Deutsch | Español | Português (Brasil) |
| العربية | Italiano | Русский |
| हिन्दी | Bahasa Indonesia | Tiếng Việt |
| Türkçe | | |

Tiếng Ả Rập hiển thị từ phải sang trái. Chọn `auto` để dùng ngôn ngữ hệ thống.

## Hành vi yêu cầu

Các thiết lập này kiểm soát yêu cầu gửi ra từ không gian yêu cầu và kịch bản:

- **Thời gian chờ yêu cầu** (`requestTimeoutMs`) — tính bằng mili giây; `0` nghĩa là không giới hạn;
- **SSL nghiêm ngặt** (`strictSSL`) — xác minh chứng chỉ TLS; tắt để làm việc với máy chủ có chứng chỉ tự ký hoặc không đáng tin cậy;
- **Theo chuyển hướng** (`followRedirects`) và **số chuyển hướng tối đa** (`maxRedirects`);
- **Phiên bản HTTP** (`protocolVersion`) — `http1`, `http2` hoặc `auto`;
- **Tắt cookie** (`disableCookies`) — tắt xử lý cookie cho yêu cầu.

## Proxy

Cấu hình proxy gửi ra bằng chế độ (`off`, `system` hoặc `custom`):

- `off` — không dùng proxy;
- `system` — dùng proxy của hệ điều hành;
- `custom` — dùng URL proxy, tùy chọn thêm tên người dùng, mật khẩu và danh sách bỏ qua.

Danh sách bỏ qua chấp nhận máy chủ và mẫu, như `localhost,127.0.0.1` hoặc tên máy chủ có ký tự đại diện. Mật khẩu proxy có thể ghi nhưng không được đọc lại; ghi giá trị trống sẽ xóa mật khẩu.

## TLS và chứng chỉ máy khách

Dành cho môi trường có cơ quan tin cậy tùy chỉnh hoặc TLS hai chiều:

- **CA tùy chỉnh** — bật chứng chỉ CA và cung cấp đường dẫn để yêu cầu tin cậy chứng chỉ gốc nội bộ hoặc tự ký;
- **Chứng chỉ máy khách (mTLS)** — cấu hình theo máy chủ bằng cặp chứng chỉ/khóa hoặc tệp PFX, có thể thêm mật khẩu bảo vệ. Máy chủ và cổng giới hạn phạm vi áp dụng.

Có thể thêm chứng chỉ, xóa theo ID hoặc xóa toàn bộ. Mật khẩu bảo vệ chỉ được ghi và không được trả về.

## Terminal tích hợp

Ứng dụng có bảng terminal ở phía dưới:

- `terminal.open` hiển thị bảng; truyền `{"cwd":"document"}` để mở trong thư mục tài liệu hiện tại, được ứng dụng phân giải thành đường dẫn tuyệt đối thực;
- `terminal.run` nhập và chạy một lệnh shell cụ thể sau thẻ xác nhận.

Lệnh chỉ chạy khi bạn yêu cầu rõ ràng; mở bảng không thực thi lệnh nào.

## Thao tác tệp và hệ thống

- `shell.revealFile` — hiển thị tài liệu hiện tại hoặc đường dẫn được chỉ định trong trình quản lý tệp hệ thống;
- `shell.openPath` — mở tài liệu bằng ứng dụng mặc định;
- `shell.openExternal` — mở trang bên thứ ba trong trình duyệt hệ thống.

Trang chính thức của Powerduck dùng công cụ liên kết riêng (`app.officialLink`) để hiển thị thẻ trong trò chuyện thay vì rời ứng dụng.

## Mẫu mã máy khách

Với mọi thao tác, trợ lý có thể tạo mã máy khách sẵn chạy (`clientcode.generate`) và hiển thị trong thẻ có bộ chọn ngôn ngữ và thư viện. Các ngôn ngữ hỗ trợ gồm C, C#, Go, Java, JavaScript, Node, Kotlin, PHP, Python, Ruby, Rust, shell, Swift và nhiều ngôn ngữ khác. Mã nằm trong thẻ thay vì được dán vào trò chuyện.

## Đổi cài đặt qua trợ lý

Yêu cầu cấp ứng dụng, như đổi chủ đề hoặc ngôn ngữ, đặt proxy, bỏ qua lỗi chứng chỉ hay đổi phiên bản HTTP, được xử lý bằng công cụ cài đặt thay vì xem là yêu cầu thiết kế API. Mọi thay đổi cài đặt cần xác nhận trước khi áp dụng.

Xem thêm: [AI và mô hình](./ai-models.md), [Không gian yêu cầu](./debug.md).
