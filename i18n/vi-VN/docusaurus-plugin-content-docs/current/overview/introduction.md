---
sidebar_position: 1
title: Giới thiệu
description: "Powerduck là nền tảng API tích hợp AI, ưu tiên làm việc cục bộ và được xây dựng quanh một tệp YAML OpenAPI. Thiết kế, gỡ lỗi, kiểm thử, tạo mock, viết tài liệu và cung cấp công cụ MCP từ cùng một tệp trên máy tính, trên đám mây hoặc qua thư viện mã nguồn mở."
---

# Giới thiệu

Cách xây dựng API đang thay đổi. Trong hai thập kỷ, **người vận hành** là người thao tác trên giao diện đồ họa, còn **người sử dụng hợp đồng API** là người đọc tài liệu. Giờ đây, cả hai vai trò đều đang chuyển dịch:

- Bên vận hành ngày càng thường là **trợ lý AI**, chuyển ý định thành hành động;
- Bên sử dụng ngày càng thường là **tác nhân AI**, gọi API như một công cụ thông qua MCP.

Các công cụ của giai đoạn trước — ứng dụng khách API, trình xem đặc tả và bộ sưu tập yêu cầu — được thiết kế cho con người ngồi trước bàn phím. Powerduck được xây dựng cho giai đoạn mới. Đây không chỉ là một ứng dụng khách API tốt hơn hay một trình xem đặc tả đẹp hơn, mà là **nền tảng tích hợp AI bắt đầu từ một tệp OpenAPI duy nhất**.

## Nền tảng: một tệp OpenAPI cục bộ

Mọi thứ bắt đầu từ tệp `openapi.yaml` thông thường trong kho mã của bạn: định dạng mở, được quản lý phiên bản, con người và AI đều có thể đọc. Không phải cơ sở dữ liệu độc quyền hay tài khoản đám mây.

```text
                one local openapi.yaml
                         |
      you + AI -> design debug test mock docs data-model
                         |
                      MCP tools
                         |
               any AI coding agent
```

Tệp đó chính là hợp đồng. Mọi quy trình đều đọc từ tệp này, và bạn có thể cung cấp cùng tệp cho bất kỳ tác nhân lập trình AI nào qua MCP. Nhờ vậy, bạn, trợ lý tích hợp và mọi tác nhân bên ngoài đều dùng chung một nguồn thông tin chuẩn. Khi thiết kế, gỡ lỗi, kiểm thử, mock và tài liệu đều đọc cùng một tệp, việc giữ các công cụ đồng bộ không còn là công việc riêng. Đó là kết quả của thiết kế hệ thống.

Powerduck dùng OpenAPI 3.2 và đọc các tài liệu 3.0, 3.1 hiện có, cùng Swagger 2.0, bằng cách nâng cấp trực tiếp. Các API không dùng HTTP — SSE, WebSocket, GraphQL, gRPC và MCP — được mô hình hóa dưới dạng mục đường dẫn thông thường qua phần mở rộng `x-protocol`, thay vì bị ép vào cấu trúc chỉ dành cho REST.

## Làm việc với AI

- Mở một tệp YAML, trợ lý sẽ gợi ý ngay những việc bạn có thể làm;
- Mô tả kết quả mong muốn bằng ngôn ngữ tự nhiên, chẳng hạn “tạo các endpoint đơn hàng”, “chuẩn bị dữ liệu kiểm thử” hoặc “chạy quy trình thanh toán và gửi báo cáo”. Trợ lý sẽ chọn công cụ phù hợp và đề xuất thay đổi;
- Mỗi thay đổi được trình bày dưới dạng **thẻ để bạn xem xét**; chỉ được áp dụng sau khi bạn phê duyệt;
- Khi bạn tinh chỉnh một API, trợ lý tập trung vào API đó và chỉ sửa phần được yêu cầu, không tự ý chuyển sang phần khác của tài liệu;
- Tệp cục bộ vẫn nằm trên ổ đĩa. AI từ xa gửi ngữ cảnh liên quan đến dịch vụ mô hình mà bạn đã cấu hình, sử dụng thông tin xác thực của dịch vụ đó. Xuất bản lên Cloud sẽ tải lên nội dung đã chọn. Thống kê sử dụng là tùy chọn, mặc định tắt và được quản lý riêng; làm việc cục bộ không cần tài khoản.

## Ưu tiên làm việc cục bộ

Powerduck chạy trên máy của bạn, mở và lưu tệp thực, hoạt động ngoại tuyến, đồng thời giữ khóa API và lời nhắc ở ngoài trình duyệt. Đám mây là phần mở rộng tùy chọn để chia sẻ và xuất bản, không phải điều kiện để bắt đầu.

## Ba cách sử dụng Powerduck

| Sản phẩm | Mô tả | Phù hợp với |
|---|---|---|
| [**Ứng dụng máy tính**](/docs/vi-VN/client/introduction/) | Ứng dụng Electron ưu tiên hoạt động cục bộ, có trợ lý AI và không gian làm việc API đầy đủ | Lập trình viên muốn làm mọi việc trên máy của mình, làm việc ngoại tuyến và giữ khóa cùng lời nhắc ở cục bộ |
| [**Powerduck Cloud**](/docs/vi-VN/cloud/introduction/) | Dịch vụ lưu trữ OAS, tài liệu trực tuyến và MCP được quản lý | Chia sẻ API, xuất bản liên kết ổn định và cung cấp MCP mà không phải vận hành máy chủ |
| [**Thư viện mã nguồn mở**](/docs/vi-VN/opensource/) | Các gói npm `@powerduck/*` có thể kết hợp với nhau | Xây dựng công cụ riêng, quy trình CI hoặc thành phần nhúng |

Cả ba sản phẩm dùng chung các bộ xử lý nền tảng. Ứng dụng máy tính và dịch vụ đám mây đều được xây dựng từ các thư viện mã nguồn mở. Vì vậy, một tính năng hoạt động nhất quán dù bạn chạy cục bộ, gọi qua mạng hay nhập trực tiếp gói thư viện.

### Ứng dụng máy tính

[Ứng dụng máy tính](/docs/vi-VN/client/introduction/) chạy hoàn toàn trên máy của bạn. Nó mở và sửa tệp thực trên ổ đĩa, gửi yêu cầu qua tiến trình cục bộ, chạy mock cục bộ, đồng thời giữ lời nhắc AI và khóa API ngoài bảng điều khiển của trình duyệt. Bạn toàn quyền cấu hình mô hình. Mọi thay đổi được đề xuất đều xuất hiện trong thẻ để xem xét trước khi áp dụng.

### Powerduck Cloud

[Powerduck Cloud](/docs/vi-VN/cloud/introduction/) đưa cùng quy trình làm việc lên trực tuyến. Thêm tệp, kho Git hoặc URL; chọn các thao tác muốn cung cấp; rồi nhận liên kết ổn định đến tài liệu đã hiển thị và endpoint MCP được quản lý. Bạn có thể bảo vệ quyền truy cập bằng mật khẩu xem hoặc khóa truy cập MCP. Các gói trả phí bổ sung đồng bộ Git, tên miền riêng và hạn mức cao hơn.

### Thư viện mã nguồn mở

Các [thư viện](/docs/vi-VN/opensource/) là thành phần xử lý bên dưới sản phẩm: bộ phân tích và nâng cấp OpenAPI, CLI đa giao thức, bộ tạo mã, máy chủ MCP, bộ thực thi yêu cầu, công cụ chuyển đổi cURL và Postman, cùng các trình soạn thảo có thể nhúng. Mỗi thư viện được phát hành riêng trên npm, có hướng dẫn cài đặt và tài liệu tham chiếu API riêng. Đây là nơi cung cấp các chi tiết kỹ thuật cấp thấp.

## Điều gì thay đổi với bạn?

- **Bạn định hướng kết quả, không phải từng cú nhấp chuột.** Mô tả mục tiêu, trợ lý sẽ thực hiện qua các bước mà bạn có thể xem xét.
- **API sẵn sàng cho tác nhân AI.** Hợp đồng tạo tài liệu cũng tạo công cụ MCP, để tác nhân AI có thể gọi API đúng cách ngay từ đầu.
- **Mọi thứ luôn nhất quán.** Thiết kế, gỡ lỗi, kiểm thử, mock và tài liệu đều đọc một tệp.
- **Mọi giao thức trong cùng một nơi.** HTTP, SSE, WebSocket, GraphQL, gRPC và MCP nằm trong một đặc tả, thay vì sáu công cụ riêng.
- **Không bị ràng buộc với nhà cung cấp.** Chọn mô hình của riêng bạn, giữ khóa cục bộ trên máy tính và nắm quyền sở hữu tệp YAML trong kho mã.

## Bước tiếp theo

- Mới bắt đầu? Đọc [Cài đặt](/docs/vi-VN/overview/installation/) và [Bắt đầu nhanh](/docs/vi-VN/overview/quickstart/).
- Muốn có không gian làm việc cục bộ đầy đủ? Đọc [hướng dẫn ứng dụng máy tính](/docs/vi-VN/client/introduction/).
- Muốn xuất bản API trực tuyến? Đọc [hướng dẫn Cloud](/docs/vi-VN/cloud/introduction/).
- Đang xây dựng tích hợp riêng? Khám phá [các thư viện mã nguồn mở](/docs/vi-VN/opensource/).
