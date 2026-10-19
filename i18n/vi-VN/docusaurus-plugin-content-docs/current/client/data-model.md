---
sidebar_position: 6
title: "Mô hình dữ liệu và sơ đồ ER"
description: "Khu vực Mô hình dữ liệu kết nối hợp đồng API với cơ sở dữ liệu. Hệ thống có thể suy ra mô hình quan hệ đầy đủ từ các schema OpenAPI, so sánh với cơ sở dữ liệu hiện có và giúp giữ hai bên nhất quán khi một bên thay đổi. Sơ đồ ER cung cấp cái nhìn tổng thể."
---

# Mô hình dữ liệu và sơ đồ ER

Khu vực Mô hình dữ liệu kết nối hợp đồng API với cơ sở dữ liệu. Hệ thống có thể suy ra mô hình quan hệ đầy đủ từ các schema OpenAPI, so sánh với cơ sở dữ liệu hiện có và giúp giữ hai bên nhất quán khi một bên thay đổi. Sơ đồ ER cung cấp cái nhìn tổng thể.

Cả hai điểm xuất phát đều được hỗ trợ:

- **Chưa có bảng.** Suy ra mọi bảng, cột, khóa ngoại và bảng liên kết trực tiếp từ API hiện tại, cùng SQL để tạo chúng.
- **Đã có cơ sở dữ liệu.** Đọc các bảng thực tế và ràng buộc khóa ngoại đang áp dụng, đối chiếu với mô hình suy ra từ API để tìm điểm khớp và khác biệt.

## Đối chiếu bốn lớp

Quá trình đối chiếu (`datamodel.reconcile`) trả về thông tin làm căn cứ theo bốn lớp:

| Lớp | Nội dung |
|---|---|
| **Quan sát được** | Các bảng thực tế không có đối tượng tương ứng trong mô hình, cùng khóa ngoại chỉ có trong cơ sở dữ liệu hoặc được áp dụng dưới dạng ràng buộc |
| **Đã mô hình hóa** | Trạng thái từng bảng (`missing`, `drift`, `matched`, `extra`), cặp cột trong mô hình và cơ sở dữ liệu, khác biệt từng trường, thao tác API bị ảnh hưởng và các quan hệ đã mô hình hóa |
| **Đề xuất** | Kế hoạch di chuyển dữ liệu theo hướng bổ sung, có thứ tự, phụ thuộc `blockedBy` và SQL cho từng bước |
| **Suy ra** | Bảng liên kết nhiều-nhiều được suy ra tự động, câu hỏi chưa giải quyết và các kiểm tra bảo vệ |

Mô hình căn cứ vào kết quả này cho từng bảng, cột, quan hệ và câu lệnh, không tự bịa DDL.

### Trạng thái bảng

- **Thiếu (mới)**: được suy ra từ API nhưng chưa có trong cơ sở dữ liệu;
- **Sai lệch**: có ở cả hai bên nhưng cột hoặc ràng buộc khác nhau;
- **Khớp**: đã có và nhất quán;
- **Bổ sung**: có trong cơ sở dữ liệu nhưng không được suy ra từ API hiện tại.

## Bảng liên kết và chỉ mục được suy ra tự động

Bạn không phải tự mô hình hóa bảng liên kết. Khi schema thể hiện quan hệ nhiều-nhiều, chẳng hạn giữa tài nguyên `user` và `product`, lớp **suy ra** tạo mô hình bảng liên kết cùng các chỉ mục liên quan, thay vì chỉ dừng ở hai bảng cơ sở. Chỉ mục phụ được đưa vào SQL tạo ra.

Nếu không thể suy ra rõ ràng logic nghiệp vụ, kết quả nêu câu hỏi còn mở thay vì phỏng đoán; các kiểm tra bảo vệ đánh dấu những phần cần người dùng xem xét.

## Sơ đồ ER trực quan

Chế độ ER hiển thị mô hình dưới dạng đồ thị, giúp nhìn thấy ngay quan hệ và khóa ngoại thay vì phải đọc danh sách bảng:

- Bảng là các nút, được bố trí tự động để giảm đường nối giao nhau;
- Quan hệ khóa ngoại được vẽ bằng các đường nối;
- Trạng thái nút phản ánh kết quả đối chiếu: mới, sai lệch, khớp hoặc bổ sung;
- Bảng bên liệt kê các bước di chuyển cụ thể gồm `create_table`, `alter_table` và mục cần xem xét, cùng SQL của bảng đang chọn.

Nhờ đó, bạn có cả góc nhìn tổng thể về schema lẫn lộ trình chính xác, có thứ tự để đưa cơ sở dữ liệu về trạng thái nhất quán.

## Phân tích ảnh hưởng hai chiều

Vì mô hình biết cả thao tác API lẫn bảng, ảnh hưởng của thay đổi được thể hiện rõ:

- **Khi API thay đổi**, quá trình đối chiếu xác định bảng bị ảnh hưởng, gồm bảng hiện có bị sai lệch và bảng mới cần thêm, kèm SQL tương ứng;
- **Khi cơ sở dữ liệu thay đổi**, các thao tác truy cập bảng bị ảnh hưởng được đánh dấu.

Sau khi sửa một bên, bạn có thể **làm mới và so sánh lại** cho đến khi mô hình khớp với cơ sở dữ liệu.

## Tập lệnh triển khai

Với cơ sở dữ liệu mới, `datamodel.deploymentScript` tạo một tập lệnh SQL có tính lũy đẳng, chỉ thực hiện thay đổi theo chiều tiến:

- `CREATE TABLE IF NOT EXISTS` theo thứ tự phụ thuộc khóa ngoại;
- Chỉ mục phụ;
- Các dòng dữ liệu mẫu có tính xác định, tùy chọn từ 0–50 dòng, mặc định 0; bảng liên kết không bao giờ được điền dữ liệu mẫu.

Với cơ sở dữ liệu hiện có, hãy dùng quá trình đối chiếu để tạo các câu lệnh `ALTER` theo hướng bổ sung trong kế hoạch di chuyển có thứ tự.

## Kết nối cơ sở dữ liệu

Kết nối được quản lý dưới dạng hồ sơ lưu sẵn gồm ID, tên, hệ cơ sở dữ liệu, máy chủ, cổng, người dùng và cơ sở dữ liệu; mật khẩu không bao giờ được trả về. Các hệ được hỗ trợ là **MySQL**, **SQL Server** và **Oracle**.

- `database.runSelect` chạy `SELECT` chỉ đọc trên hồ sơ đã lưu, trả về tập dòng có giới hạn và được cắt bớt; thao tác ghi và DDL bị chặn;
- `database.prefillConnection` mở hộp thoại kết nối mới, điền sẵn thông tin bạn cung cấp để bạn tự nhập mật khẩu thay vì đưa mật khẩu vào lời nhắc.

## Chỉ tạo SQL, không tự thực thi

Trong toàn bộ khu vực này, SQL được **tạo để xem xét**, không chạy trên cơ sở dữ liệu của bạn. Bạn quyết định thời điểm và cách áp dụng; quyền chỉ đọc giúp bảo vệ dữ liệu hiện có. Bạn có thể tìm hiểu và tinh chỉnh mô hình trước khi thay đổi cơ sở dữ liệu.

Liên quan: [Giao thức](./protocols.md), [Không gian làm việc yêu cầu](./debug.md), [Cài đặt](./settings.md).
