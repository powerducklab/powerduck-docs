---
sidebar_position: 2
title: Bắt đầu nhanh với Cloud
description: "Đăng nhập, thêm đặc tả từ tệp, Git hoặc URL, chọn thao tác được cung cấp rồi mở liên kết tài liệu và MCP."
---

# Bắt đầu nhanh với Cloud

Hướng dẫn này giúp bạn chuyển đặc tả trên máy tính thành trang tài liệu có thể chia sẻ và điểm cuối MCP.

## 1. Đăng nhập

Tại trang đăng nhập, tiếp tục bằng **Google** hoặc **GitHub**. Sau khi xác thực OAuth, Powerduck tạo phiên riêng và mở bảng điều khiển. Một tổ chức cá nhân được tạo tự động.

## 2. Thêm đặc tả

Từ trang tổng quan, thêm đặc tả bằng một trong các nguồn được hỗ trợ:

- **Tải tệp lên** — tải trực tiếp một tệp OpenAPI;
- **Kho Git** — chỉ định kho, chọn nhánh và đường dẫn tệp;
- **URL** — nhập đặc tả từ một URL.

Các tài liệu OpenAPI 3.0/3.1 và Swagger hiện có sẽ được nâng cấp. Đầu vào cURL hoặc Postman có thể được chuyển đổi để xem trước trước khi lưu.

### Cách tải lên trực tiếp hoạt động

Tệp lớn được tải thẳng lên kho lưu trữ đối tượng thay vì đi qua máy chủ API:

1. Một tài liệu được tạo;
2. ứng dụng yêu cầu **URL tải lên**, kèm loại nội dung và kích thước;
3. tệp được tải trực tiếp lên kho lưu trữ bằng URL đã ký trước;
4. quá trình tải lên được **hoàn tất**, đồng thời ghi nhận phiên bản và SHA-256 của phiên bản đó.

Nhờ vậy, dữ liệu lớn không cần đi qua máy chủ API.

## 3. Chọn các thao tác được cung cấp

Sau khi thêm đặc tả, chọn thao tác nào sẽ được cung cấp công khai. Bạn có thể bật hoặc tắt từng thao tác mà không thay đổi tài liệu nguồn. Bắt đầu với toàn bộ thao tác, rồi loại bỏ những điểm cuối nội bộ hoặc quản trị không muốn cung cấp.

## 4. Mở các liên kết

Khi tài liệu đang hoạt động, không gian làm việc của tài liệu hiển thị các địa chỉ công khai:

- **Tài liệu** — tài liệu API đã kết xuất trong trình xem công khai;
- **MCP** — điểm cuối MCP được quản lý, sử dụng Streamable HTTP;
- dữ liệu đặc tả gốc cũng được cung cấp tại một URL ổn định.

Theo mặc định, tài liệu được bật và chỉ được bảo vệ khi bạn thêm mật khẩu. Trạng thái cung cấp MCP và khóa truy cập MCP được cấu hình riêng.

## 5. Bảo vệ quyền truy cập nếu cần

- Thêm **mật khẩu xem tài liệu** và đặt thời hạn nếu muốn;
- tạo **khóa truy cập MCP** cho điểm cuối MCP;
- tạm dừng tài liệu để ngắt cả hai dịch vụ trong thời gian cần thiết.

## 6. Cập nhật bằng phiên bản mới

Khi API thay đổi, hãy tải nội dung lên thành phiên bản mới thay vì ghi đè phiên bản cũ. Liên kết chia sẻ có thể trỏ đến tài liệu hiện tại hoặc cố định ở một phiên bản cụ thể. Như vậy, nội dung của liên kết gắn với một phiên bản sẽ không tự thay đổi đối với người đọc.

## Các bước tiếp theo

- [Tài liệu và phiên bản](/docs/vi-VN/cloud/documents-versions/)
- [Các thao tác được cung cấp](/docs/vi-VN/cloud/exposure/)
- [Kiểm soát truy cập](/docs/vi-VN/cloud/access-control/)
- [Tên miền tùy chỉnh](/docs/vi-VN/cloud/custom-domains/)
