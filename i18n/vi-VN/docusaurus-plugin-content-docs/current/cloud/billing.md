---
sidebar_position: 7
title: "Thanh toán và giấy phép"
description: "Powerduck cung cấp **hai sản phẩm riêng biệt với hai mô hình thanh toán khác nhau**. Phân biệt hai sản phẩm là điều quan trọng nhất khi tìm hiểu về thanh toán."
---

# Thanh toán và giấy phép

Powerduck cung cấp **hai sản phẩm riêng biệt với hai mô hình thanh toán khác nhau**. Phân biệt hai sản phẩm là điều quan trọng nhất khi tìm hiểu về thanh toán.

| | Ứng dụng máy tính | Powerduck Cloud |
|---|---|---|
| Sản phẩm mua | Ứng dụng máy tính | Dịch vụ được lưu trữ |
| Mô hình | Mua một lần | Gói miễn phí hoặc đăng ký trả phí |
| Thời hạn | Vĩnh viễn: giấy phép thuộc về bạn lâu dài | Quyền truy cập miễn phí hoặc kỳ thanh toán trả phí |
| Được cấp dưới dạng | **Khóa giấy phép**, chỉ hiển thị một lần | Quyền sử dụng theo gói, **không có khóa** |
| Hoạt động ngoại tuyến | Có | Không: đây là dịch vụ được lưu trữ |

Mua Cloud không bao giờ tạo khóa giấy phép, còn mua ứng dụng máy tính không phải đăng ký thuê bao.

## Giấy phép máy tính vĩnh viễn

Ứng dụng máy tính được mua một lần và sở hữu lâu dài, không có gia hạn hay kỳ thanh toán. Khi mua, hệ thống tạo khóa giấy phép:

- Khóa được tạo từ các byte ngẫu nhiên an toàn về mật mã theo định dạng `PDC-XXXX-XXXX-…`, không phải từ ID tăng dần hoặc dấu thời gian;
- Khóa gốc chỉ hiển thị **một lần**;
- Cơ sở dữ liệu chỉ lưu **giá trị băm SHA-256** của khóa và bốn ký tự cuối, nên không thể khôi phục khóa gốc từ cơ sở dữ liệu.

### Trạng thái giấy phép

Giấy phép có bốn trạng thái:

| Trạng thái | Ý nghĩa |
|---|---|
| `ISSUED` | Đã tạo nhưng chưa kích hoạt |
| `ACTIVE` | Đã kích hoạt và có thể sử dụng |
| `SUSPENDED` | Tạm thời không dùng được; có thể kích hoạt lại |
| `REVOKED` | Đã thu hồi vĩnh viễn; không thể kích hoạt lại |

“Vĩnh viễn” nghĩa là giấy phép không hết hạn theo lịch, không có nghĩa là không bao giờ bị tạm ngưng hoặc thu hồi.

### Kích hoạt và kiểm toán

Quá trình kích hoạt kiểm tra định dạng khóa, tính và tra cứu giá trị băm, kiểm tra trạng thái rồi liên kết giấy phép trong một giao dịch. Điểm cuối kích hoạt giới hạn tần suất yêu cầu nhằm hạn chế việc dò khóa hàng loạt.

Mỗi thay đổi trạng thái được ghi thành sự kiện giấy phép: tạo, kích hoạt, tạm ngưng, kích hoạt lại hoặc thu hồi. Nhờ đó có thể kiểm tra toàn bộ vòng đời.

## Các gói và đăng ký Cloud

Cloud cung cấp **gói Free** cùng các gói đăng ký trả phí, không dùng khóa giấy phép. Mức giá hằng năm dưới đây được quy đổi theo tháng nhưng thu tiền theo năm:

| Gói | Thanh toán tháng | Thanh toán năm |
|---|---|---|
| Free | $0 | $0 |
| Pro | 19 USD/tháng | 15 USD/tháng |
| Team | 49 USD/tháng | 39 USD/tháng |

Đăng ký có trạng thái `ACTIVE` và còn trong kỳ hiện tại được cấp các tính năng của gói. Khoảng gia hạn ba ngày giúp xử lý chậm trễ khi gia hạn; sau khoảng này, quyền truy cập trở về gói Free. Giấy phép máy tính không được dùng để xác định các tính năng Cloud.

### Những gì gói dịch vụ kiểm soát

Hệ thống không áp dụng gói bằng cách ghi cứng tên gói khắp mã nguồn. Mỗi gói có **quyền sử dụng**, gồm các tính năng bật/tắt và hạn mức dạng số, được kiểm tra qua một dịch vụ quản lý quyền thống nhất:

| Tính năng | Free | Pro | Team |
|---|---|---|---|
| Lưu trữ OAS | Có | Có | Có |
| Nguồn Git | Không | Có | Có |
| Tài liệu | Có | Có | Có |
| MCP | Có | Có | Có |
| Tên miền riêng | Không | Có | Có |
| Số tài liệu tối đa | 3 | 100 | 1,000 |
| Số phiên bản tối đa | 20 | 200 | 1,000 |
| Kích thước tệp tối đa | 1 MiB | 10 MiB | 50 MiB |
| Số thao tác được cung cấp tối đa | 10 | 1,000 | 10,000 |
| Số thành viên tối đa | 1 | 1 | 10 |

## Nhà cung cấp thanh toán

Hệ thống chọn nhà cung cấp theo khu vực để khách hàng sử dụng phương thức quen thuộc. Hai nhà cung cấp **không bao giờ được hiển thị cùng lúc**:

- **Antom**: Trung Quốc đại lục, Hồng Kông, Ma Cao, Đài Loan và Đông Nam Á;
- **Paddle**: Hoa Kỳ, Canada, châu Âu, Nhật Bản, Hàn Quốc, Úc, New Zealand và Vương quốc Anh.

Quốc gia được suy ra từ múi giờ của máy khách hoặc tiêu đề `Accept-Language`; không cần cơ sở dữ liệu GeoIP bên ngoài. Nếu không xác định được khu vực, **Antom là phương án mặc định**. Đội vận hành cũng có thể chỉ định nhà cung cấp bằng cấu hình để chuyển ngay sang kênh dự phòng khi có sự cố.

Thanh toán được xác nhận qua webhook có chữ ký của nhà cung cấp, với điểm cuối riêng cho Paddle và Antom, thay vì tin vào trang quay lại trong trình duyệt.

## Nên chọn sản phẩm nào?

- Cần không gian làm việc cục bộ đầy đủ, dùng ngoại tuyến và sở hữu lâu dài? Mua **giấy phép máy tính** một lần.
- Muốn xuất bản tài liệu và MCP trực tuyến rồi chia sẻ liên kết ổn định? Bắt đầu với **Cloud Free**. Chọn **Pro** để có hạn mức cao hơn, nguồn Git và tên miền riêng, hoặc **Team** cho nhiều thành viên.
- Nhiều nhóm dùng cả hai: thiết kế và kiểm thử cục bộ trong ứng dụng, sau đó lưu trữ API đã xuất bản trên Cloud.

Liên quan: [Giới thiệu Cloud](./introduction.md), [Ứng dụng máy tính](../client/introduction.md).
