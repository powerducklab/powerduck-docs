---
sidebar_position: 3
title: "Gửi yêu cầu cục bộ đầu tiên mà không cần tài khoản hay mô hình AI"
description: "Gửi yêu cầu cục bộ đầu tiên mà không cần tài khoản hay mô hình AI"
---

# Gửi yêu cầu cục bộ đầu tiên mà không cần tài khoản hay mô hình AI

## Thử ví dụ cục bộ

Trong không gian làm việc trống của ứng dụng máy tính, chọn **Thử ví dụ** rồi bắt đầu chạy. Powerduck tạo một ví dụ độc lập, khởi động máy chủ Mock cục bộ, gửi `GET /orders/summary` đến cổng được cấp và hiển thị phản hồi thực tế. Ví dụ chỉ được đánh dấu hoàn tất sau khi nhận HTTP 200. Máy chủ Mock dừng sau yêu cầu hoặc khi bạn đóng ví dụ. Bạn có thể chạy lại bất cứ lúc nào. Hãy cài ứng dụng trước; quy trình cục bộ này không cần Internet, đăng nhập hay khóa mô hình AI.

## Mở đặc tả của bạn

Dùng **Mở** để nhập tài liệu OpenAPI ở định dạng YAML hoặc JSON. Ví dụ không bao giờ ghi đè tệp hiện có. Bản miễn phí giới hạn số lượng đặc tả. Nếu đã đạt giới hạn, hãy lưu rồi đóng hoặc loại bỏ tài liệu không còn cần thiết. Đừng bỏ những thay đổi chưa lưu chỉ để chạy ví dụ. Bạn cũng có thể tạo OpenAPI bằng cách quét mã nguồn của dự án hiện có; hãy kiểm tra các trường chưa chắc chắn trước khi sử dụng kết quả.

## Kiểm tra backend thực tế

Yêu cầu Mock thành công chưa chứng minh backend tuân thủ đặc tả. Làm theo [ví dụ về lỗi hợp đồng API](/docs/vi-VN/client/contract-example/), rồi [kết nối trợ lý lập trình](/docs/vi-VN/client/coding-agent/) nếu cần. Kiểm tra thủ công không cần mô hình AI.

## Mô hình tùy chọn và các lỗi thường gặp

- **Chưa cấu hình mô hình:** yêu cầu cục bộ, Mock và kiểm tra hợp đồng thủ công vẫn hoạt động. Chỉ cấu hình mô hình trong phần cài đặt khi bạn muốn dùng AI.
- **Không kết nối được dịch vụ mô hình:** kiểm tra địa chỉ dịch vụ, khóa và proxy trong phần cài đặt. Không công khai khóa hoặc tiêu đề yêu cầu trong báo cáo lỗi.
- **Không truy cập được API đích:** xác nhận máy chủ đang chạy, rồi kiểm tra URL, cổng và cấu hình yêu cầu trong trình gỡ lỗi.
- **HTTP 401/403:** kiểm tra xác thực và quyền truy cập của API đích. Đây không phải yêu cầu đăng nhập vào Powerduck.
- **Kiểm tra hợp đồng thất bại:** xem đường dẫn trường và kiểu dữ liệu mong đợi trong kết quả xác nhận. Sửa backend hoặc đặc tả không chính xác rồi kiểm tra lại.

Tệp cục bộ được đọc và lưu trên máy tính của bạn. Mô hình từ xa nhận ngữ cảnh cần thiết; khi xuất bản lên đám mây, nội dung được chọn sẽ được tải lên. Thống kê sử dụng là tùy chọn, mặc định tắt trong phần cài đặt và tách biệt với việc xác minh giấy phép.

[Tải xuống](https://www.powerduck.com/download.html) · [Giấy phép ứng dụng máy tính](https://www.powerduck.com/pricing?product=client)
