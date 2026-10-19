---
sidebar_position: 1
title: "Thư viện mã nguồn mở"
description: "Các gói npm @powerduck/* là nền tảng của ứng dụng máy tính và Cloud: phân tích, nâng cấp, CLI đa giao thức, tạo mã, MCP, thực thi yêu cầu, chuyển đổi và trình soạn thảo có thể nhúng."
---

# Thư viện mã nguồn mở

Powerduck được xây dựng từ các gói npm nhỏ có thể kết hợp. Ứng dụng máy tính và dịch vụ đám mây đều dùng các thư viện này, nên cùng một bộ thành phần có thể chạy cục bộ, qua mạng hoặc trong công cụ riêng của bạn.

Mỗi gói được phát hành độc lập, có hướng dẫn cài đặt, tham chiếu API và ví dụ riêng. Trang này trình bày vai trò và cách chúng kết hợp với nhau.

## Cấu trúc phân lớp

```text
Powerduck / Cloud
        ↓
Giao diện có thể nhúng
        ↓
Quy trình làm việc
        ↓
Nền tảng
```

Trình phân tích và bộ chuyển đổi tạo thành lớp nền. Các quy trình làm việc dựa trên lớp này, còn giao diện có thể nhúng nằm trên cùng. Dùng chung nền tảng thay vì triển khai lại việc phân tích trong từng gói giúp giữ hành vi nhất quán.

## Các gói

### Nền tảng

| Gói | Mục đích |
|---|---|
| [`@powerduck/openapi-parser`](../openapi-parser/introduction.md) | Phân tích, kiểm tra và nâng cấp tài liệu OpenAPI/Swagger |
| [`@powerduck/conf-patch`](../conf-patch/introduction.md) | Áp dụng bản vá cấu hình có cấu trúc và đã được kiểm tra |
| [`@powerduck/x-to-openapi`](../x-to-openapi/introduction.md) | Chuyển các định dạng khác, như cURL và Postman, sang OpenAPI |

### Quy trình làm việc

| Gói | Mục đích |
|---|---|
| [`@powerduck/openapi-cli`](../openapi-cli/introduction.md) | Quy trình đa giao thức qua dòng lệnh, bao gồm chạy kịch bản |
| [`@powerduck/openapi-codegen`](../openapi-codegen/introduction.md) | Tạo mã máy khách và các sản phẩm khác từ đặc tả |
| [`@powerduck/openapi-mcp-server`](../openapi-mcp-server/introduction.md) | Cung cấp đặc tả OpenAPI dưới dạng máy chủ MCP |
| [`@powerduck/openapi-request`](../openapi-request/introduction.md) | Thực thi yêu cầu được mô tả trong đặc tả |

### Giao diện có thể nhúng

| Gói | Mục đích |
|---|---|
| [`@powerduck/oas-document`](../oas-document/introduction.md) | Hiển thị OpenAPI thành tài liệu dễ đọc, có điểm nhập React |
| [`@powerduck/md-editor`](../md-editor/introduction.md) | Trình soạn thảo Markdown có thể nhúng |
| [`@powerduck/schema-editor`](../schema-editor/introduction.md) | Trình soạn thảo JSON Schema có thể nhúng |
| [`@powerduck/tree`](../tree/introduction.md) | Thành phần cây cho dữ liệu có cấu trúc |
| [`@powerduck/workspace-yaml`](../workspace-yaml/introduction.md) | Tích hợp YAML của không gian làm việc |

## Chọn gói phù hợp

- **Đọc, kiểm tra hoặc nâng cấp tệp OpenAPI:** bắt đầu với `openapi-parser`.
- **Chuyển cURL hoặc bộ sưu tập Postman sang OpenAPI:** dùng `x-to-openapi`.
- **Chạy kịch bản hoặc quy trình đa giao thức từ dòng lệnh hay CI:** dùng `openapi-cli`.
- **Tạo mã máy khách:** dùng `openapi-codegen`.
- **Cung cấp API dưới dạng công cụ cho tác nhân AI:** dùng `openapi-mcp-server`.
- **Nhúng tài liệu đã hiển thị vào ứng dụng React:** dùng `oas-document`, điểm nhập React và CSS đi kèm.
- **Nhúng trình soạn thảo:** dùng `md-editor` hoặc `schema-editor`.

## Chia sẻ khả năng với tác nhân

Gói máy chủ MCP cũng giúp các tác nhân AI bên ngoài sử dụng khả năng của Powerduck. Đặc tả được phục vụ qua `openapi-mcp-server` cung cấp các thao tác dưới dạng công cụ MCP. Tác nhân có thể gọi trực tiếp cùng hợp đồng đang dùng cho tài liệu và tạo mã. Nhờ đó, ứng dụng máy tính, Cloud và các công cụ tương thích MCP cùng dùng một định nghĩa chuẩn.

## Về các ví dụ

Ví dụ mã được viết theo API thực tế của gói và hướng đến việc chạy đúng như trình bày. Khi nâng cấp gói, hãy xem ghi chú phát hành để biết tham số hiện tại thay vì sao chép đoạn mã từ phiên bản cũ.

Dùng thanh bên để xem hướng dẫn cài đặt, cấu hình và tham chiếu API đầy đủ của từng gói.
