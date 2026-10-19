---
sidebar_position: 6
title: Tên miền tùy chỉnh
description: "Gắn tên máy chủ, hoặc tên máy chủ kèm đường dẫn, với tài liệu. Xác minh quyền sở hữu qua DNS TXT rồi cung cấp tài liệu và MCP trên tên miền của bạn."
---

# Tên miền tùy chỉnh

Theo mặc định, tài liệu được cung cấp qua các địa chỉ dùng chung của Powerduck. Tên miền tùy chỉnh cho phép tài liệu và MCP xuất hiện dưới **tên máy chủ riêng của bạn**, để xuất bản API theo thương hiệu của bạn thay vì dùng liên kết chung.

Đây là tính năng trả phí trong các gói **Pro và Team**, được kiểm tra qua quyền `oas.custom_domain`.

## Gắn toàn bộ máy chủ hoặc đường dẫn con

Bạn có thể gắn:

- **Toàn bộ máy chủ** — `api.example.com` cung cấp một tài liệu tại đường dẫn gốc;
- **Máy chủ kèm đường dẫn con** — `example.com/v1` cung cấp tài liệu dưới `/v1`.

Liên kết theo đường dẫn con cho phép một tên máy chủ cung cấp nhiều tài liệu:

```text
example.com/v1  -> document A
example.com/v2  -> document B
```

Nhờ đó, mỗi máy chủ không còn bị giới hạn ở một tài liệu và có thể dùng đường dẫn cơ sở theo phiên bản.

## Địa chỉ trên tên miền tùy chỉnh

Các giao diện trên địa chỉ dùng chung cũng được cung cấp dưới tên miền đã gắn, bằng những đường dẫn ngắn và ổn định:

| Giao diện | Toàn bộ máy chủ | Đường dẫn con |
|---|---|---|
| Đặc tả hiện tại | `/oas` | `/v1/oas` |
| Đặc tả của phiên bản cố định | `/v/:version/oas` | `/v1/v/:version/oas` |
| MCP | `/mcp` | `/v1/mcp` |

Tên máy chủ và đường dẫn yêu cầu xác định tài liệu được liên kết. Yêu cầu kiểm tra trước CORS được xử lý cho từng đường dẫn này.

## Thêm và xác minh tên miền

Tên miền chỉ được tin cậy sau khi xác minh quyền sở hữu:

1. **Thêm** tên máy chủ, có thể kèm đường dẫn, vào tài liệu;
2. dịch vụ trả về liên kết và **hướng dẫn DNS**;
3. tạo bản ghi DNS rồi **xác minh**;
4. liên kết chuyển từ chờ xác minh sang đã xác minh và bắt đầu phục vụ.

Việc kiểm tra quyền sở hữu dùng **bản ghi TXT**:

| Trường | Giá trị |
|---|---|
| Loại bản ghi | `TXT` |
| Máy chủ | `_powerduck-challenge.<your-domain>` |
| Giá trị | `powerduck-verify=<verification-token>` |

Quá trình xác minh đọc bản ghi TXT qua DNS và so sánh token trong thời gian hằng số. Liên kết đã xác minh giữ nguyên trạng thái mà không kiểm tra lại.

### Ví dụ

Với `api.example.com`, thêm bản ghi TXT:

```text
_powerduck-challenge.api.example.com
TXT "powerduck-verify=<the-token-shown-for-the-binding>"
```

Sau đó chọn **Xác minh** trong không gian làm việc của tài liệu. Khi xác minh thành công, tài liệu và MCP được cung cấp qua tên miền, với điều kiện tài liệu đang hoạt động và từng giao diện đã được bật.

## Quản lý liên kết

- **Liệt kê** các tên miền gắn với tài liệu, gồm trạng thái và đường dẫn cơ sở;
- **xác minh** liên kết đang chờ sau khi thêm bản ghi DNS;
- **xóa** liên kết để ngừng cung cấp tài liệu qua tên miền đó.

Thay đổi cờ truy cập làm mất hiệu lực bộ nhớ đệm phân giải máy chủ, tránh tiếp tục dùng liên kết cũ.

## Kiểm soát truy cập vẫn được áp dụng

Tên miền tùy chỉnh là địa chỉ bổ sung, không phải cách bỏ qua kiểm soát:

- tài liệu phải ở trạng thái `ACTIVE`;
- tài liệu và MCP có cờ bật riêng;
- mật khẩu vẫn bảo vệ tài liệu, còn khóa truy cập MCP vẫn bảo vệ MCP.

Xem [Kiểm soát truy cập](/docs/vi-VN/cloud/access-control/).

Liên quan: [Tài liệu và phiên bản](/docs/vi-VN/cloud/documents-versions/), [Thanh toán](/docs/vi-VN/cloud/billing/).
