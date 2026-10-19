---
sidebar_position: 7
title: "Máy chủ mock cục bộ"
description: "Chạy bản mô phỏng API OpenAPI cục bộ với cổng, đường dẫn cơ sở, độ trễ và phản hồi ghi đè tùy chọn, đồng thời kiểm tra các yêu cầu nhận được."
---

# Máy chủ mock cục bộ

Máy chủ mock tạo một API thay thế hoạt động được trực tiếp từ đặc tả, giúp tiếp tục phát triển frontend và ứng dụng khách trước khi backend sẵn sàng mà không cần hạ tầng bên ngoài. Máy chủ chạy trong tiến trình chính của ứng dụng máy tính.

## Khởi động mock

Bạn có thể khởi động mock từ màn hình Máy chủ mock hoặc ngay trong cuộc trò chuyện với AI. Khi khởi động từ cuộc trò chuyện, ứng dụng xác nhận địa chỉ đang phục vụ.

Có các tùy chọn sau:

| Tùy chọn | Phạm vi / dạng | Mục đích |
|---|---|---|
| `port` | Số nguyên `1`–`65535` | Cổng cục bộ để lắng nghe kết nối |
| `basePath` | Tiền tố đường dẫn URL | Phục vụ mock dưới một đường dẫn cơ sở |
| `latencyMs` | `0`–`10000` | Thêm độ trễ nhân tạo để mô phỏng độ trễ mạng |
| `overrides` | Tối đa 100 phản hồi ghi đè | Trả về phản hồi cụ thể cho các thao tác đã chọn |

Cổng hoặc độ trễ không hợp lệ bị từ chối kèm thông báo rõ ràng, thay vì khởi động một máy chủ không hoạt động.

## Nhiều mock cùng lúc

Bạn có thể chạy nhiều mock đồng thời, chẳng hạn mỗi tài liệu đang mở có một mock. Ứng dụng liệt kê các mock đang chạy (`mock:list`) và có thể dừng từng mock (`mock:stop`). Mỗi mock gắn với ID và tên tài liệu để dễ phân biệt.

## Kiểm tra yêu cầu nhận được

Mock ghi lại các yêu cầu nhận được. Bạn có thể truy vấn chúng (`mock:requests`) với giới hạn số lượng tùy chọn và xóa các bản ghi. Điều này giúp xác nhận ứng dụng khách đã gọi đúng thao tác với tham số mong đợi, ngay cả khi chưa có backend thực.

## Ghi đè phản hồi

Khi ví dụ mặc định hoặc phản hồi sinh từ lược đồ chưa đủ, bạn có thể chỉ định phản hồi riêng cho một thao tác. Số phản hồi ghi đè bị giới hạn ở mức 100 để cấu hình luôn dễ kiểm soát.

## Khi nào nên dùng

- Tiếp tục phát triển frontend theo hợp đồng trong khi backend vẫn đang được xây dựng;
- Tái hiện tình trạng chậm hoặc trường hợp biên bằng cách điều chỉnh độ trễ và phản hồi;
- Trình diễn luồng API mà không cần môi trường đã triển khai;
- Xác minh ứng dụng khách được sinh ra gọi các thao tác đúng thiết kế.

Mock đọc cùng đặc tả với các công cụ khác, nên luôn đồng bộ với hợp đồng khi thiết kế thay đổi.

Xem thêm: [Kiểm thử kịch bản](/docs/vi-VN/client/scenario-testing/), [Thiết kế cùng trợ lý](/docs/vi-VN/client/design/).
