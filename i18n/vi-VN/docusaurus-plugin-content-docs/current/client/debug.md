---
sidebar_position: 3
title: "Không gian yêu cầu và môi trường"
description: "Không gian yêu cầu biến một thao tác đã thiết kế thành lời gọi thực tế. Ứng dụng gửi yêu cầu qua tiến trình chính cục bộ, hiển thị phản hồi và dùng môi trường cùng biến cho những giá trị thay đổi giữa các lần chạy."
---

# Không gian yêu cầu và môi trường

Không gian yêu cầu biến một thao tác đã thiết kế thành lời gọi thực tế. Ứng dụng gửi yêu cầu qua tiến trình chính cục bộ, hiển thị phản hồi và dùng môi trường cùng biến cho những giá trị thay đổi giữa các lần chạy.

## Gửi yêu cầu

1. Mở một thao tác trong không gian yêu cầu. Phương thức, đường dẫn, tham số, tiêu đề và nội dung được lấy từ đặc tả.
2. Điền các giá trị cần dữ liệu cụ thể, chẳng hạn tham số đường dẫn hoặc token.
3. Gửi yêu cầu. Mã trạng thái, tiêu đề, nội dung và thời gian được hiển thị trong tab đó.
4. Giữ nhiều yêu cầu mở trong các **tab** để so sánh hoặc xem lại.

Vì yêu cầu được thực thi trong tiến trình chính thay vì khung web, giới hạn CORS của trình duyệt không chặn lời gọi và chi tiết yêu cầu không xuất hiện trong bảng mạng của trình duyệt.

## Môi trường và máy chủ OAS

Hai khái niệm này liên quan nhưng khác nhau. Hiểu rõ sự khác biệt sẽ tránh được một nhầm lẫn thường gặp.

| | Môi trường tùy chỉnh | OAS `servers` |
|---|---|---|
| Nơi lưu | Thiết lập cục bộ của ứng dụng | Trong tài liệu OpenAPI |
| Có thể sửa từ công cụ yêu cầu | Có | Không; phải dùng bản vá đặc tả |
| Mục đích | URL cơ sở mặc định cho tab yêu cầu mới và lần chạy kịch bản | Các URL cơ sở do chính hợp đồng khai báo |
| Được chia sẻ cùng tài liệu | Không | Có |

Khi trợ lý liệt kê URL cơ sở (`env.listServers`), các môi trường tùy chỉnh có thể chỉnh sửa được trả về trước, sau đó là các máy chủ chỉ đọc được khai báo trong tài liệu hiện tại.

- Để **thêm hoặc chọn URL cơ sở cục bộ**, tạo hoặc kích hoạt môi trường tùy chỉnh (`env.upsertServer`, `env.selectServer`). Việc này không sửa tài liệu.
- Để **thay đổi máy chủ trong hợp đồng**, hãy đề xuất bản vá đặc tả.

Cách này tách URL gỡ lỗi cá nhân khỏi hợp đồng, đồng thời vẫn cho phép dùng các máy chủ được khai báo trong tài liệu để gửi yêu cầu.

## Biến

Biến được quản lý theo bốn phạm vi:

- **globals** — dùng được trong mọi bộ sưu tập;
- **collection** — giới hạn trong một bộ sưu tập;
- **environment** — gắn với môi trường đang hoạt động; áp dụng cho mọi máy chủ trừ khi chỉ định máy chủ cụ thể;
- **local** — riêng cho phiên cục bộ.

Trợ lý có thể liệt kê biến (`env.listVariables`, tùy chọn lọc theo phạm vi) và tạo hoặc cập nhật biến (`env.setVariable`, theo tên và phạm vi). Mỗi biến có thể gắn với một máy chủ cụ thể và có trạng thái bật/tắt. Đặt biến là thao tác của ứng dụng, không phải thay đổi tài liệu API.

Các giá trị thường lưu trong biến gồm token truy cập, ID dùng lại giữa các lời gọi và cờ tính năng.

## Khi thiếu URL cơ sở

Yêu cầu cần một URL đầy đủ. Nếu cả `servers` của tài liệu lẫn môi trường đang hoạt động đều không cung cấp URL cơ sở, ứng dụng sẽ yêu cầu bạn nhập trước khi chạy, thay vì tự đoán và âm thầm gọi nhầm máy chủ.

## Từ một yêu cầu đến một luồng

Sau khi một lời gọi hoạt động, bạn có thể nối nhiều lời gọi để một giá trị trong phản hồi trước trở thành đầu vào cho yêu cầu tiếp theo. Đó là [kiểm thử kịch bản](./scenario-testing.md).

Xem thêm: [Thiết kế cùng trợ lý](./design.md), [Kiểm thử kịch bản](./scenario-testing.md), [Cài đặt](./settings.md).

## Tác nhân A2A

Thiết kế và gỡ lỗi thông điệp tác nhân theo phiên bản, thao tác tác vụ và cập nhật SSE bằng `x-protocol: a2a`. Xem [Tác nhân A2A](./a2a.md) để biết các trường mở rộng và liên kết JSON-RPC, REST, gRPC trên desktop.
