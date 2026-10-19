---
sidebar_position: 1
title: "Ứng dụng desktop"
description: "Ứng dụng desktop mang quy trình làm việc lấy AI làm trọng tâm lên chính máy tính của bạn. Mở openapi.yaml từ kho mã, mô tả điều muốn thực hiện rồi kiểm tra kết quả—không cần chuyển qua lại giữa trình sửa đặc tả, ứng dụng HTTP, công cụ mock, trình tạo tài liệu và bộ chạy kiểm thử, cũng không cần tài khoản đám mây để bắt đầu."
---

# Ứng dụng desktop

Ứng dụng desktop mang quy trình làm việc lấy AI làm trọng tâm lên chính máy tính của bạn. Mở `openapi.yaml` từ kho mã, mô tả điều muốn thực hiện rồi kiểm tra kết quả—không cần chuyển qua lại giữa trình sửa đặc tả, ứng dụng HTTP, công cụ mock, trình tạo tài liệu và bộ chạy kiểm thử, cũng không cần tài khoản đám mây để bắt đầu.

Bạn vẫn nắm quyền kiểm soát: trợ lý đề xuất, bạn phê duyệt.

## Một ngày trong không gian làm việc

Ứng dụng được xây dựng xoay quanh các hoạt động sau.

- **Mở đặc tả và nắm tổng quan.** Trợ lý đọc tài liệu hiện tại rồi gợi ý ngay việc có thể làm: bổ sung phần thiếu, hoàn thiện tài liệu hoặc kiểm thử luồng.
- **Tạo API.** Mô tả tài nguyên để trợ lý đề xuất endpoint. Tiếp tục tinh chỉnh cùng thao tác—thêm tham số, làm rõ phản hồi, sửa mã trạng thái—mà không chuyển sang phần không liên quan của tài liệu.
- **Chuẩn bị dữ liệu kiểm thử.** Tạo các dòng dữ liệu mẫu thực tế từ lược đồ để yêu cầu và kịch bản có giá trị cụ thể.
- **Chạy yêu cầu hoặc cả kịch bản.** Gỡ lỗi một lời gọi hoặc nối nhiều endpoint thành luồng đầu cuối, rồi nhận báo cáo có thể chia sẻ về các bước thành công và thất bại.
- **Tiếp tục làm việc trước khi có backend.** Khởi động mock cục bộ trả lời theo hợp đồng trong khi dịch vụ thật vẫn đang được xây dựng.
- **Cung cấp API cho tác nhân lập trình.** Biến đặc tả thành máy chủ MCP để công cụ AI tìm và gọi đúng thao tác với đúng đối số.
- **Xem cơ sở dữ liệu phía sau API.** Suy ra bảng, quan hệ và SQL từ đặc tả, so sánh với cơ sở dữ liệu thật và xác định những thay đổi cần thiết.
- **Đổi thiết lập ngay trong trò chuyện.** Chỉ cần yêu cầu để đổi giao diện hoặc ngôn ngữ, đặt proxy hay quản lý biến môi trường.

## Các chế độ xem và công dụng

Một tài liệu phục vụ mọi chế độ xem; bộ chuyển nhỏ gọn giúp di chuyển giữa chúng.

| Chế độ xem | Công dụng |
|---|---|
| [**Đặc tả**](./design.md) | Màn hình chính: trò chuyện AI, tài liệu và bản xem trước trực tiếp |
| [**Không gian yêu cầu**](./debug.md) | Gửi và kiểm tra yêu cầu HTTP thực tế với tab và môi trường |
| [**Kiểm thử kịch bản**](./scenario-testing.md) | Nối endpoint thành luồng, chạy và nhận báo cáo |
| [**Tài liệu**](./protocols.md) | Đọc đặc tả dưới dạng tài liệu API đã kết xuất |
| [**MCP**](./protocols.md) | Kiểm tra và sử dụng máy chủ MCP được tạo từ đặc tả |
| [**Máy chủ mock**](./mock-server.md) | Chạy mock API cục bộ trong quá trình phát triển |
| [**Mô hình dữ liệu**](./data-model.md) | Suy ra bảng và quan hệ, so sánh với cơ sở dữ liệu, tạo SQL |
| [**Cài đặt**](./settings.md) | Giao diện, ngôn ngữ, proxy, chứng chỉ và tùy chọn không gian làm việc |

## Cách trợ lý phối hợp với bạn

Bạn mô tả ý định bằng ngôn ngữ tự nhiên; trợ lý chọn khả năng phù hợp, bộ máy xác định kiểm tra tính hợp lệ và bạn phê duyệt qua thẻ. Mô hình không tự ý chỉnh sửa tài liệu.

- Thay đổi đặc tả xuất hiện dưới dạng **thẻ bản vá** với thao tác chi tiết; sửa một thao tác hiện có chỉ thay đổi trường bạn yêu cầu;
- Thao tác chỉ đọc, như liệt kê thao tác, lấy lược đồ hoặc chạy truy vấn, trả về thông tin thực tế làm cơ sở cho câu trả lời của trợ lý;
- Thao tác ghi yêu cầu xác nhận trước khi chạy.

Bạn **tự cấu hình mô hình**: trỏ ứng dụng đến nhà cung cấp tương thích OpenAI rồi chọn trong cài đặt. Xem [AI và mô hình](./ai-models.md).

## Lợi ích của việc ưu tiên làm việc cục bộ

- **Tệp thật của bạn.** Ứng dụng mở, sửa và lưu các tệp thực trên ổ đĩa, đồng thời theo dõi thay đổi cục bộ.
- **Không vướng CORS.** Yêu cầu đi qua tiến trình cục bộ thay vì khung web nên giới hạn khác nguồn không chặn lời gọi.
- **Bạn chọn endpoint mô hình.** Desktop gửi yêu cầu qua tiến trình chính, nhưng lời nhắc, ngữ cảnh liên quan và thông tin xác thực vẫn được gửi đến nhà cung cấp đã cấu hình. Ưu tiên cục bộ không có nghĩa là yêu cầu AI từ xa không truyền dữ liệu.
- **Hoạt động ngoại tuyến.** Thiết kế, mock và tài liệu không cần mạng; mạng cần cho yêu cầu thực, đồng bộ Git hoặc mô hình từ xa.
- **Thực thi cục bộ.** Mock, bộ chạy kịch bản, truy cập cơ sở dữ liệu và terminal đều chạy trên máy của bạn.

## Giấy phép desktop

Ứng dụng desktop được bán với **giấy phép vĩnh viễn, thanh toán một lần**: mua một lần, làm việc ngoại tuyến mà không cần tài khoản. Khóa được tạo khi mua và chỉ hiển thị một lần. Giấy phép tách biệt với Powerduck Cloud, dịch vụ lưu trữ thuê bao hằng tháng. Xem [Thanh toán đám mây](../cloud/billing.md).

## Bắt đầu tại đây

- [Thiết kế cùng trợ lý](./design.md)
- [Không gian yêu cầu và môi trường](./debug.md)
- [Kiểm thử kịch bản và báo cáo](./scenario-testing.md)
- [Giao thức](./protocols.md)
- [Mô hình dữ liệu và sơ đồ ER](./data-model.md)
- [Máy chủ mock](./mock-server.md)
- [AI và mô hình](./ai-models.md)
- [Cài đặt](./settings.md)
