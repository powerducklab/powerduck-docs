---
sidebar_position: 4
title: Các thao tác được cung cấp
description: "Chọn thao tác được cung cấp công khai mà không sửa tài liệu nguồn. Nhóm theo thẻ, tìm kiếm và bật hoặc tắt từng thao tác hay cả nhóm."
---

# Các thao tác được cung cấp

Không phải mọi thao tác trong đặc tả đều nên được công khai. Các điểm cuối quản trị, công cụ nội bộ và thao tác còn ở dạng nháp thường cần giữ trong tài liệu nhưng không xuất hiện trong tài liệu đã xuất bản hoặc MCP. Cấu hình này giúp bạn xác định rõ lựa chọn **mà không sửa tài liệu nguồn**.

## Cách hoạt động

Cấu hình được lưu riêng với đặc tả. Mỗi mục tham chiếu đến một thao tác và ghi nhận trạng thái bật hoặc tắt:

- ưu tiên `operationId` nếu có;
- đồng thời lưu `method` và `path` để xác thực và hỗ trợ đặc tả không có mã định danh thao tác.

Tài liệu gốc không thay đổi. Tài liệu xuất bản và MCP được tạo từ đặc tả kết hợp với danh sách thao tác được bật. Tắt một thao tác sẽ loại nó khỏi các giao diện đã xuất bản, nhưng không xóa nó khỏi tệp.

## Giao diện chọn thao tác

Giao diện được thiết kế để xử lý cả những đặc tả lớn:

- **Tìm kiếm** — lọc theo phương thức, đường dẫn, tóm tắt hoặc thẻ;
- **Nhóm theo thẻ** — dùng thẻ chính; các thao tác không có thẻ được gom thành nhóm riêng;
- **Bật/tắt từng thao tác** — thay đổi trạng thái một thao tác;
- **Thao tác theo nhóm** — bật hoặc tắt toàn bộ thao tác trong một nhóm thẻ;
- **Chọn tất cả kết quả đã lọc** — hộp kiểm chung chỉ áp dụng cho các thao tác khớp với tìm kiếm hiện tại.

Mỗi thao tác chỉ chiếm một hàng để trạng thái luôn rõ ràng, kể cả khi thao tác có nhiều thẻ.

## Cách bắt đầu thực tế

Bạn có thể bật toàn bộ thao tác rồi tắt những thao tác không muốn công khai:

- điểm cuối nội bộ và quản trị, chẳng hạn quản lý người dùng hoặc kiểm tra tình trạng nội bộ;
- thao tác còn đang được thiết kế;
- điểm cuối chỉ dùng để gỡ lỗi cục bộ.

Vì lựa chọn độc lập với tài liệu, bạn có thể điều chỉnh khi API phát triển mà không cần sửa đặc tả.

## Quan hệ với việc xuất bản

Cấu hình này quyết định **thao tác nào** xuất hiện. Các điều khiển khác quyết định **bản thân tài liệu có truy cập được hay không**:

- tài liệu phải ở trạng thái `ACTIVE`;
- tài liệu và MCP có cờ bật riêng;
- quyền truy cập có thể được bảo vệ bằng mật khẩu xem tài liệu hoặc khóa truy cập MCP.

Xem [Kiểm soát truy cập](/docs/vi-VN/cloud/access-control/) để biết đầy đủ các điều kiện.

## Giới hạn của gói

Mỗi gói giới hạn số thao tác được cung cấp:

- **Free** — tối đa 10;
- **Pro** — tối đa 1.000;
- **Team** — tối đa 10.000.

Liên quan: [Kiểm soát truy cập](/docs/vi-VN/cloud/access-control/), [Tài liệu và phiên bản](/docs/vi-VN/cloud/documents-versions/).
