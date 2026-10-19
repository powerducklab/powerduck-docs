---
sidebar_position: 1
title: "Powerduck Cloud"
description: "Powerduck Cloud giúp biến tệp OpenAPI thành nội dung có thể **chia sẻ**. Thêm đặc tả, chọn thao tác muốn cung cấp, rồi gửi cho người dùng các liên kết ổn định đến tài liệu và máy chủ MCP được quản lý, mà không cần tự lưu trữ hay vận hành những dịch vụ này."
---

# Powerduck Cloud

Powerduck Cloud giúp biến tệp OpenAPI thành nội dung có thể **chia sẻ**. Thêm đặc tả, chọn thao tác muốn cung cấp, rồi gửi cho người dùng các liên kết ổn định đến tài liệu và máy chủ MCP được quản lý, mà không cần tự lưu trữ hay vận hành những dịch vụ này.

Đây là quy trình lấy hợp đồng API làm nền tảng và có AI hỗ trợ giống ứng dụng máy tính, được đưa lên môi trường trực tuyến cho nhóm và người dùng API. Gói Free bao gồm dịch vụ lưu trữ tài liệu và MCP trong hạn mức; các gói trả phí bổ sung dung lượng, nguồn Git và tên miền riêng. API nghiệp vụ vẫn chạy trên hệ thống backend của bạn.

## Quy trình sử dụng

1. **Thêm đặc tả** bằng cách tải tệp lên, chỉ định kho Git hoặc dán URL. Bạn có thể bắt đầu ngay trên website và đăng nhập khi sẵn sàng, không cần tải tệp lên lần nữa.
2. **Chọn nội dung muốn cung cấp.** Bật hoặc tắt từng thao tác; tệp gốc không bị thay đổi.
3. **Mở ngay liên kết tài liệu.** Tài liệu API được bật theo mặc định. Điểm cuối MCP được quản lý có công tắc riêng và sẽ tắt cho đến khi bạn quyết định cung cấp công cụ cho các tác tử.
4. **Kiểm soát truy cập.** Đặt mật khẩu và thời hạn xem tài liệu, cùng khóa truy cập MCP riêng dành cho tác tử.
5. **Xuất bản và chia sẻ.** Xuất bản bản dựng đã sẵn sàng của phiên bản hiện tại để các liên kết hoạt động; các tùy chọn nâng cao luôn dễ truy cập.
6. **Duy trì cập nhật.** Mỗi thay đổi tạo một phiên bản mới để so sánh hoặc khôi phục; nguồn Git có thể đồng bộ khi được cập nhật.
7. **Quản lý vòng đời.** Tạm dừng, tiếp tục hoặc lưu trữ tài liệu; xem nhanh trạng thái, phiên bản và nguồn.

## Những tính năng được cung cấp

- **Liên kết tài liệu ổn định**, vẫn truy cập được khi bạn xuất bản phiên bản mới;
- **Điểm cuối MCP được quản lý**, giúp tác tử AI của người dùng khác tìm và gọi các thao tác bạn đã chọn;
- **Kiểm soát từng thao tác**, để các điểm cuối nội bộ hoặc chưa hoàn thiện không xuất hiện trên giao diện công khai;
- **Kiểm soát truy cập** bằng mật khẩu xem tài liệu, thời hạn và khóa truy cập MCP;
- **Lịch sử phiên bản** hỗ trợ so sánh và khôi phục, không ghi đè bản gốc;
- **Đồng bộ Git**, chuyển cập nhật trong kho mã thành phiên bản lưu trữ mới;
- **Tên miền riêng**, bao gồm cấu hình đường dẫn con, giúp đồng bộ trải nghiệm với thương hiệu của bạn.

### Một tài liệu, nhiều phiên bản

Mỗi lần chỉnh sửa tạo một phiên bản mới thay vì ghi đè bản gốc. Bạn có thể so sánh các phiên bản, quay lại bản trước và xuất bản lại tài liệu cùng MCP từ một trạng thái xác định. Tài liệu và MCP luôn gắn với một tài liệu và phiên bản cụ thể, không phải một bản “mới nhất” không rõ ràng.

### Vì sao liên kết có thể không mở được

Liên kết tài liệu hoặc MCP hoạt động khi đáp ứng ba điều kiện. Không gian làm việc của tài liệu hiển thị cả ba và đánh dấu điều kiện đầu tiên chưa đáp ứng:

1. Tài liệu đang **hoạt động**: tạm dừng tài liệu sẽ đồng thời ngừng cung cấp tài liệu và MCP;
2. Dịch vụ bạn chia sẻ được **bật**: tài liệu và MCP có công tắc riêng; mặc định tài liệu bật còn MCP tắt;
3. Bản dựng hiện tại đã được **xuất bản**: hệ thống tự tạo bản dựng sau khi bạn thêm phiên bản hoặc thay đổi các thao tác được cung cấp, nên thường không cần can thiệp; vẫn có thể xuất bản thủ công khi cần.

Ngoài ba điều kiện này, hệ thống còn kiểm tra mật khẩu xem tài liệu, thời hạn hoặc khóa truy cập MCP nếu được thiết lập.

## Đăng nhập và quyền sở hữu

Đăng nhập bằng **Google** hoặc **GitHub**. Sau quá trình OAuth, Powerduck tạo phiên riêng bằng cookie bảo mật có thuộc tính HttpOnly; token của nhà cung cấp không được dùng làm danh tính lâu dài của bạn. Mọi tài nguyên thuộc về một **tổ chức**. Tổ chức cá nhân được tạo tự động; sau này nhóm có thể dùng chung một tổ chức mà không phải thiết kế lại hệ thống.

## Bảng điều khiển

- **Tổng quan**: thêm đặc tả và xem tài liệu gần đây, với liên kết nhanh và thao tác bắt đầu hoặc dừng;
- **Dự án**: sắp xếp tài liệu;
- **Không gian làm việc của tài liệu**: trạng thái, tài liệu, MCP, thao tác được cung cấp, phiên bản, nguồn và tên miền trong các mục có nhãn rõ ràng;
- **Thanh toán**: trạng thái gói đăng ký và đơn hàng được trình bày riêng;
- **Hub**: xuất bản và tìm xem tài liệu cùng máy chủ MCP công khai;
- **Cài đặt** và **Hoạt động**: hồ sơ, tùy chọn và nhật ký kiểm toán.

Người đọc tài liệu công khai sử dụng trình xem riêng và không cần tài khoản Powerduck. Nếu có mật khẩu xem tài liệu, họ phải nhập mật khẩu đó; mật khẩu của tài liệu và việc đăng nhập tài khoản là hai yêu cầu riêng biệt.

## So sánh Cloud với ứng dụng máy tính

| | Ứng dụng máy tính | Cloud |
|---|---|---|
| Nơi chạy | Trên máy của bạn | Dịch vụ được lưu trữ |
| Mô hình thanh toán | Giấy phép vĩnh viễn, thanh toán một lần | Gói miễn phí và các gói đăng ký trả phí |
| Quyền nhận được | Khóa giấy phép, chỉ hiển thị một lần | Quyền sử dụng theo gói, không có khóa giấy phép |
| Phù hợp nhất với | Không gian làm việc đầy đủ, cục bộ và ngoại tuyến | Chia sẻ và xuất bản trực tuyến |

Hai sản phẩm bổ trợ cho nhau. Cloud có gói Free; các gói Cloud trả phí và giấy phép ứng dụng máy tính được mua riêng. Xem [Thanh toán](./billing.md).

## Bắt đầu tại đây

- [Bắt đầu nhanh với Cloud](./quickstart.md)
- [Tài liệu và phiên bản](./documents-versions.md)
- [Các thao tác được cung cấp](./exposure.md)
- [Kiểm soát truy cập](./access-control.md)
- [Tên miền riêng](./custom-domains.md)
- [Thanh toán](./billing.md)
