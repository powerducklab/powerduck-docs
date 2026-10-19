---
sidebar_position: 3
title: Tài liệu và phiên bản
description: "Quản lý vòng đời tài liệu, các phiên bản bất biến và nguồn nội dung từ tệp tải lên hoặc đồng bộ Git."
---

# Tài liệu và phiên bản

Tài liệu là bản đại diện được lưu trữ của một API. Tài liệu thuộc tổ chức của bạn, có thể nằm trong một dự án, và tích lũy các phiên bản theo thời gian thay vì bị ghi đè.

## Cấu trúc phân cấp

```text
Organization -> Project -> Document -> Versions
```

Bạn có thể tạo tài liệu trực tiếp trong tổ chức hoặc trong dự án. Danh sách tài liệu có ở cả cấp dự án và tổ chức.

## Vòng đời trạng thái

Tài liệu có bốn trạng thái:

| Trạng thái | Ý nghĩa | Dịch vụ công khai |
|---|---|---|
| `ACTIVE` | Đang hoạt động | Tài liệu và MCP được phục vụ nếu từng dịch vụ đã được bật |
| `PAUSED` | Tạm dừng | Dịch vụ công khai không khả dụng |
| `ARCHIVED` | Được lưu trữ nhưng không còn là tài liệu hiện hành | Không được phục vụ |
| `DELETED` | Đã xóa mềm | Không được phục vụ |

Các chuyển đổi trạng thái được phép:

```text
pause:    ACTIVE  -> PAUSED
resume:   PAUSED  -> ACTIVE
archive:  ACTIVE / PAUSED -> ARCHIVED
restore:  ARCHIVED -> ACTIVE
delete:   ACTIVE / PAUSED / ARCHIVED -> DELETED
```

Tạm dừng là cách nhanh nhất để ngừng phục vụ tài liệu rồi bật lại. Lưu trữ giữ nguyên lịch sử nhưng không coi tài liệu là hiện hành. Thao tác xóa là xóa mềm, nên dữ liệu chính không bị hủy ngay lập tức.

## Phiên bản bất biến

Khi đặc tả thay đổi, hệ thống tạo phiên bản mới. Phiên bản gốc không bao giờ bị thay thế:

```text
v1 -> v2 -> v3 -> v4
```

Mỗi phiên bản ghi lại:

- **Khóa lưu trữ** của tệp trong kho lưu trữ đối tượng;
- Giá trị kiểm tra **SHA-256**;
- Loại nội dung, kích thước và thời điểm tạo.

Nhờ đó, bạn có thể xem lịch sử, quay lại phiên bản trước, so sánh thay đổi và tạo lại tài liệu cùng MCP từ một phiên bản cụ thể.

### Liên kết hiện hành và liên kết cố định phiên bản

- Liên kết đến tài liệu **hiện hành** luôn theo phiên bản mới nhất;
- Liên kết **cố định phiên bản** trỏ đến một phiên bản cụ thể, không tự thay đổi nội dung đối với người đọc.

Dùng liên kết cố định khi cần nguồn tham chiếu bất biến, chẳng hạn trong ghi chú phát hành hoặc hợp đồng. Dùng liên kết hiện hành khi muốn người đọc luôn thấy bản mới nhất.

## Nguồn nội dung

Nội dung đến từ một nguồn được trừu tượng hóa, để mô hình tài liệu không bị ràng buộc trực tiếp với phương thức tải lên hay Git.

- **Tải lên** — thêm tệp trực tiếp;
- **Git** — kết nối kho mã với URL, nhánh và đường dẫn tệp.

Nguồn Git theo dõi việc đồng bộ có được bật hay không và lần đồng bộ gần nhất. Bạn có thể:

- **Kết nối** kho mã: bắt buộc có URL kho mã và đường dẫn tệp; nhánh là tùy chọn;
- **Đồng bộ** khi cần để lấy nội dung mới nhất thành một phiên bản mới.

Siêu dữ liệu nguồn được lưu cùng tài liệu, giúp bạn luôn xác định được tài liệu đến từ tệp tải lên hay kho mã và kiểm tra lần đồng bộ gần nhất.

## Lưu trữ

Tệp thực tế nằm trong kho lưu trữ đối tượng theo cấu trúc tổ chức/tài liệu/phiên bản. Cơ sở dữ liệu chỉ lưu siêu dữ liệu: khóa lưu trữ, giá trị kiểm tra, loại nội dung và kích thước. Theo mặc định, không thể đọc công khai tệp trực tiếp từ kho lưu trữ; truy cập công khai đi qua các tuyến xuất bản của tài liệu.

## Lợi ích

Phiên bản bất biến kết hợp với xóa mềm giúp bạn cập nhật nhanh mà không mất lịch sử hoặc vô tình công khai tài liệu muốn ngừng phục vụ. Hãy tạm dừng khi cần ngắt truy cập tạm thời, lưu trữ để giữ lâu dài và cố định phiên bản trong liên kết khi cần tính ổn định.

Xem thêm: [Thao tác được công khai](/docs/vi-VN/cloud/exposure/), [Kiểm soát truy cập](/docs/vi-VN/cloud/access-control/), [Tên miền riêng](/docs/vi-VN/cloud/custom-domains/).
