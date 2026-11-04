---
sidebar_position: 15
title: "AI tích hợp và sử dụng"
description: "Powerduck giúp hiểu thay đổi do AI tạo ra cùng ngữ cảnh và quyết định vấn đề cần xử lý. Mở riêng không gian API hoặc rà soát mã từ trang chủ ứng dụng máy tính."
---

# AI tích hợp và sử dụng

Đăng nhập Google hoặc GitHub. Chỉ có mô hình tích hợp, không chọn mô hình, khóa riêng hay endpoint tùy chỉnh. Công việc AI được yêu cầu gửi ngữ cảnh chọn tới nhà cung cấp quản lý. Loại trừ thư mục phụ thuộc, build và thông tin đăng nhập phổ biến không bảo đảm mã không có bí mật.

## Rà soát AI tại dòng mã

AI chỉ rà soát khi yêu cầu, dùng các lô khác biệt và ngữ cảnh giới hạn thay vì toàn bộ từng tệp. Có thể dùng lại kết quả cache khớp. Độ ưu tiên, bằng chứng và đề xuất hiện tại mã. Xác nhận, đánh dấu báo sai hoặc chọn cho Agent. AI không chứng minh tính đúng hay việc đã chạy kiểm thử.

## Gói và số tác vụ

Một lượt hội thoại hoặc rà soát là một tác vụ, không tính riêng mỗi lệnh gọi nội bộ. Khi chạy sẽ giữ chỗ: kết quả đã giao tính một dù hủy sau đó; không có kết quả thành công sẽ giải phóng. Chia nhỏ rà soát lớn. Đọc cục bộ, Git/AST và kết quả lưu không tốn tác vụ. Thuê bao cũ có thể giữ credits; xem tài khoản.

- [Không gian API](introduction.md)
- [Rà soát mã](code-quality.md)
- [AI tích hợp và sử dụng](ai-models.md)
- [Gói và số tác vụ](../cloud/billing.md)
- [Cài đặt và bắt đầu](../overview/installation.md)
- [Hiểu từng thay đổi](../overview/quickstart.md)
