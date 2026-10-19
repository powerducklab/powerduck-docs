---
sidebar_position: 5
title: Kiểm soát truy cập
description: "Bảo vệ tài liệu bằng mật khẩu và thời hạn, endpoint MCP bằng khóa truy cập, đồng thời cấu hình xác thực MCP với API thượng nguồn."
---

# Kiểm soát truy cập

Powerduck tách quyền **người đọc truy cập tài liệu** khỏi quyền **máy khách truy cập endpoint MCP**, vì hai dịch vụ được sử dụng theo cách khác nhau. Cách máy chủ MCP xác thực với API thượng nguồn cũng được cấu hình riêng.

## Thứ tự kiểm tra

Khả năng truy cập dịch vụ công khai phụ thuộc vào nhiều điều kiện. Kiểm tra đầy đủ giúp bạn xác định vì sao không mở được tài liệu.

1. **Trạng thái tài liệu** — phải là `ACTIVE`, không bị tạm dừng, lưu trữ hay xóa;
2. **Dịch vụ được bật** — `documentationEnabled` cho tài liệu, `mcpEnabled` cho MCP;
3. **Thông tin xác thực truy cập** — mật khẩu xem tài liệu hoặc khóa truy cập MCP, nếu đã cấu hình;
4. **Thời hạn** — quyền xem tài liệu có thể hết hạn vào thời điểm đã đặt.

Nội dung xuất bản được tạo tự động sau khi thêm phiên bản hoặc thay đổi các thao tác được công khai, nên thông thường không cần bước xuất bản thủ công.

Hai dịch vụ độc lập với nhau: tắt MCP không ảnh hưởng đến tài liệu, và mật khẩu tài liệu không kiểm soát MCP.

## Mật khẩu xem tài liệu

Mật khẩu bảo vệ cả tài liệu đã kết xuất lẫn dữ liệu đặc tả được phục vụ:

- Mật khẩu được băm bằng **scrypt**, dùng salt ngẫu nhiên riêng cho từng mật khẩu; không lưu văn bản gốc;
- Khi đã đặt mật khẩu, người đọc phải cung cấp mật khẩu trước khi nhận được tài liệu;
- Mật khẩu chỉ bảo vệ **tài liệu**; endpoint MCP dùng khóa truy cập riêng và không kiểm tra mật khẩu xem.

Bạn cũng có thể đặt **thời hạn xem**. Sau thời hạn, quyền truy cập bị từ chối kể cả khi nhập đúng mật khẩu. Xóa mật khẩu hoặc thời hạn để bỏ hạn chế tương ứng.

## Khóa truy cập endpoint MCP

Endpoint MCP được bảo vệ bằng **khóa truy cập** riêng:

- Tạo hoặc thay khóa: khóa đầy đủ chỉ được trả về **một lần**; sau đó chỉ hiển thị bốn ký tự cuối;
- Khi khóa đã được cấu hình, mỗi yêu cầu MCP phải gửi khóa dưới dạng token `Bearer`;
- Khóa được so sánh trong **thời gian hằng định**. Thiếu khóa hoặc khóa sai sẽ nhận `401`.

Xóa khóa để mở endpoint MCP không cần khóa, với điều kiện tài liệu đang hoạt động và MCP được bật.

## Xác thực MCP với API thượng nguồn

Độc lập với việc bảo vệ endpoint, bạn có thể cấu hình cách máy chủ MCP xác thực với **API thượng nguồn** được mô tả trong đặc tả. Các loại được hỗ trợ:

| `authType` | Cấu hình |
|---|---|
| `NONE` | Không xác thực với API thượng nguồn |
| `BEARER` | Token bearer |
| `BASIC` | Tên người dùng và mật khẩu xác thực cơ bản |
| `APIKEY` | Tên và giá trị khóa API trong header hoặc query |

Các giá trị bí mật như token bearer, mật khẩu và giá trị khóa API có thể được ghi nhưng không thể đọc lại. Cấu hình chỉ cho biết chúng đã được thiết lập hay chưa.

Các cấu hình MCP khác:

- **Ghi đè URL cơ sở** — thay URL cơ sở của API thượng nguồn thay vì dùng giá trị trong đặc tả;
- **Thời gian chờ yêu cầu** — giới hạn chờ khi máy chủ MCP gọi API thượng nguồn.

## Thiết lập đề xuất

- **Tài liệu công khai:** bật tài liệu và không đặt mật khẩu cho API mở, hoặc đặt mật khẩu cùng thời hạn để chia sẻ có kiểm soát;
- **MCP cho tác nhân của bạn:** bật MCP và tạo khóa truy cập để chỉ máy khách của bạn gọi được;
- **Xác thực thượng nguồn:** cấu hình máy chủ MCP theo yêu cầu của API thực tế, tách biệt với quyền gọi endpoint MCP.

Xem thêm: [Thao tác được công khai](/docs/vi-VN/cloud/exposure/), [Tài liệu và phiên bản](/docs/vi-VN/cloud/documents-versions/), [Tên miền riêng](/docs/vi-VN/cloud/custom-domains/).
