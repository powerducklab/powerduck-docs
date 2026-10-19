---
sidebar_position: 1
title: "Giới thiệu"
description: "Tạo ví dụ HTTP chạy được từ OpenAPI bằng @powerduck/openapi-codegen: 21 ngôn ngữ, 41 máy khách, tương thích trình duyệt, không có phụ thuộc khi chạy."
---

# Giới thiệu

`@powerduck/openapi-codegen` là thư viện TypeScript chuyển thao tác OpenAPI thành **mã ví dụ yêu cầu HTTP có thể chạy**, với ngôn ngữ và máy khách HTTP bạn chọn. Thư viện phục vụ trang tài liệu API, cổng nhà phát triển, trình khám phá API, công cụ CLI và tạo mã khi build.

Hỗ trợ **21 ngôn ngữ** và **41 tổ hợp ngôn ngữ/máy khách**, **tương thích trình duyệt** và **không có phụ thuộc khi chạy**.

## Vì sao dùng openapi-codegen

- **Không có phụ thuộc khi chạy** — hoạt động trong trình duyệt, Node.js, Electron và môi trường edge mà không cần mô-đun tích hợp của Node.
- **Hai định dạng mô-đun** — bản dựng ESM gốc và CommonJS (`require()`).
- **OpenAPI 3.0 / 3.1 / 3.2** — xử lý đối tượng tài liệu đã phân tích cú pháp. JSON và YAML đều dùng được nếu phân tích trước khi gọi `generate()`.
- **41 bộ sinh mã có sẵn** cho 21 ngôn ngữ, tự động đăng ký khi nhập.
- **Tuần tự hóa tham số đầy đủ** — path, query, header, cookie theo quy tắc OpenAPI `style` / `explode` / `allowReserved`.
- **Lược đồ bảo mật** — khóa API trong header/query/cookie, HTTP bearer và HTTP basic.
- **Loại nội dung thân** — JSON, văn bản thuần, biểu mẫu mã hóa URL và `multipart/form-data`.
- **Phân giải `$ref`** — tham chiếu JSON Pointer trong tài liệu với bộ nhớ đệm, chuỗi tham chiếu và phát hiện vòng lặp.
- **Ví dụ tự động** — suy luận giá trị từ JSON Schema (`example`, `enum`, `default`, kiểu, định dạng, ràng buộc).
- **Hệ thống plugin** — đăng ký bộ sinh mã riêng qua `register()` hoặc `use()`.

## Cách hoạt động

```
OpenAPI document  ──normalize──▶  RequestIR  ──generator.generate()──▶  source code string
```

1. `normalize` phân giải `$ref`, hợp nhất tham số ở cấp đường dẫn và thao tác, chọn loại phương tiện cho thân yêu cầu, tạo giá trị ví dụ, xử lý lược đồ bảo mật và tạo `RequestIR` đã chuẩn hóa.
2. `Generator` được chọn nhận `RequestIR` và trả về chuỗi mã nguồn chạy được.

Thông thường chỉ cần gọi `generate({...})`, hàm này thực hiện cả hai bước.

## Ví dụ cơ bản

```typescript
import { generate } from "@powerduck/openapi-codegen";

const code = generate({
  document,                 // parsed OpenAPI object
  path: "/users/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
});

console.log(code);          // a runnable fetch() snippet
```

## Các bước tiếp theo

- [Cài đặt](/docs/vi-VN/openapi-codegen/installation/) — npm / yarn / pnpm và sử dụng trong trình duyệt.
- [Bắt đầu nhanh](/docs/vi-VN/openapi-codegen/quickstart/) — Tạo đoạn mã đầu tiên và liệt kê bộ sinh mã.
- [Cấu hình](/docs/vi-VN/openapi-codegen/configuration/) — `GenerateOptions`, `RequestIR`, `Generator`, `Plugin`.
- [Tham chiếu API](/docs/vi-VN/openapi-codegen/api-reference/) — Tất cả mục xuất và danh sách đầy đủ ngôn ngữ/máy khách.
- [Ví dụ](/docs/vi-VN/openapi-codegen/examples/) — fetch, Python requests, cURL, bộ sinh mã tùy chỉnh, plugin và `RequestIR` trực tiếp.
