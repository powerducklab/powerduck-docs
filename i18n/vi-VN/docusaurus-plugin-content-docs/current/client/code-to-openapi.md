---
title: "Tạo OpenAPI từ mã nguồn hiện có"
description: "Tạo OpenAPI từ mã nguồn hiện có"
---

# Tạo OpenAPI từ mã nguồn hiện có

Trong ứng dụng máy tính, chọn **Quét mã để tạo OpenAPI** (Beta), chọn thư mục mã nguồn cục bộ rồi chọn **Bắt đầu quét**. Hãy bắt đầu với một dịch vụ nhỏ. Kiểm tra các tuyến, tham số và phản hồi được phát hiện trước khi sử dụng đặc tả đã tạo.

Quét tĩnh có thể không xác định được lược đồ phản hồi nếu hàm xử lý phụ thuộc vào mã động hoặc phần phụ thuộc không có sẵn. ‘Xác nhận thủ công’ chỉ ghi nhận việc bạn đã kiểm tra, không tái tạo các kiểu bị thiếu. Chỉnh sửa hợp đồng API dựa trên bằng chứng hoặc nhờ AI kiểm tra hàm xử lý đã chọn. Thao tác AI này gửi mã nguồn đã chọn và ngữ cảnh đến nhà cung cấp mô hình được cấu hình.

Lưu kết quả thành tệp mới. Không thay thế hợp đồng hiện có khi chưa xem xét thay đổi. Sau đó chạy [ví dụ hợp đồng](/docs/vi-VN/client/contract-example/) với backend đang hoạt động, hoặc kết nối [tác nhân lập trình](/docs/vi-VN/client/coding-agent/). Quét thành công không chứng minh rằng cách triển khai tuân thủ hợp đồng.

Quy trình này chỉ có trên ứng dụng máy tính; ngôn ngữ và framework được hỗ trợ tùy thuộc bộ quét. Quét tĩnh không cần khóa mô hình. Hãy coi các phát hiện chưa giải quyết là chưa biết, không phải sự thật đã suy ra.

[Tải ứng dụng máy tính](https://www.powerduck.com/download.html) · [Bắt đầu nhanh](https://www.powerduck.com/docs/vi-VN/overview/quickstart/)
