---
sidebar_position: 10
title: "Rà soát mã"
description: "Powerduck giúp hiểu thay đổi do AI tạo ra cùng ngữ cảnh và quyết định vấn đề cần xử lý. Mở riêng không gian API hoặc rà soát mã từ trang chủ ứng dụng máy tính."
---

# Rà soát mã

Chọn thư mục để mở cấu trúc dự án. Đọc toàn bộ tệp ở chế độ chỉ mã nguồn, so sánh đầy đủ hoặc chỉ thay đổi. Đánh dấu dòng và ký tự, điều hướng thay đổi và tìm kiếm giúp xác định phần sửa.

## So sánh và lịch sử vòng

Vòng hiện tại so sánh mốc đầu đã lưu với tệp trên đĩa. Lần mở đầu tạo mốc, không coi mọi nội dung là mới. Toàn bộ thay đổi chưa commit so với Git HEAD. Chủ động bắt đầu vòng mới và xem vòng cũ trong lịch sử cục bộ; đây không phải bản sao lưu Git. Hãy lưu tệp trước.

## Cấu trúc và mã liên quan

Git và bộ phân tích tìm khối, định nghĩa, nơi gọi và import phân giải được. Di chuột lên ký hiệu hỗ trợ để xem định nghĩa, mở mã liên quan cạnh thay đổi. Cấu trúc đánh dấu nhiều tham chiếu, tên tạm, nội dung giống hệt và không tìm thấy tham chiếu vào. Tải động và bên dùng ngoài có thể bị bỏ sót; không tham chiếu không có nghĩa là xóa an toàn.

## Rà soát AI tại dòng mã

AI chỉ rà soát khi yêu cầu, dùng các lô khác biệt và ngữ cảnh giới hạn thay vì toàn bộ từng tệp. Có thể dùng lại kết quả cache khớp. Độ ưu tiên, bằng chứng và đề xuất hiện tại mã. Xác nhận, đánh dấu báo sai hoặc chọn cho Agent. AI không chứng minh tính đúng hay việc đã chạy kiểm thử.

## Gói tác vụ Agent

Chọn nghi vấn để xem trước, sao chép hoặc tải Markdown gồm mã và mốc phiên bản. Agent cần đánh giá độc lập; quyền sửa được ghi rõ. Báo cáo JSON vẫn cần người kiểm tra. Tuyên bố đã sửa không phải kiểm thử đạt. Xuất gói không tự chạy hay liên hệ Agent khác.

## Chạy kiểm tra

Chỉ chủ động chạy lệnh dự án đáng tin và xem lệnh, mã thoát, đầu ra gốc. Thiếu script là chưa xác minh. Đọc, phân tích tĩnh và AI không phải bằng chứng thực thi; đã đọc chỉ ghi tiến độ đọc.

## AI tích hợp và sử dụng

Đăng nhập Google hoặc GitHub. Chỉ có mô hình tích hợp, không chọn mô hình, khóa riêng hay endpoint tùy chỉnh. Công việc AI được yêu cầu gửi ngữ cảnh chọn tới nhà cung cấp quản lý. Loại trừ thư mục phụ thuộc, build và thông tin đăng nhập phổ biến không bảo đảm mã không có bí mật.

- [Không gian API](introduction.md)
- [Rà soát mã](code-quality.md)
- [AI tích hợp và sử dụng](ai-models.md)
- [Gói và số tác vụ](../cloud/billing.md)
- [Cài đặt và bắt đầu](../overview/installation.md)
- [Hiểu từng thay đổi](../overview/quickstart.md)
