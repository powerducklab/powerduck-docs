---
sidebar_position: 1
title: "Giới thiệu"
description: "Chuyển đổi mọi tài liệu Swagger 2.0, OpenAPI 3.0, 3.1 hoặc 3.2 sang OpenAPI 3.2 chỉ bằng một lần gọi."
keywords: ["openapi-parser", "powerduck", "Swagger", "OpenAPI 3.2"]
---

# @powerduck/openapi-parser

Chuyển đổi mọi tài liệu Swagger 2.0, OpenAPI 3.0, 3.1 hoặc 3.2 sang OpenAPI 3.2 chỉ bằng một lần gọi.

Một lớp bọc gọn nhẹ cho hai thư viện sau: [`@scalar/openapi-parser`](https://github.com/scalar/openapi-parser), [`@scalar/openapi-upgrader`](https://github.com/scalar/openapi-parser/tree/main/packages/openapi-upgrader).
Không triển khai lại việc phân tích cú pháp, kiểm tra hay chuyển đổi, mà kết nối các chức năng đó và cung cấp cấu trúc lỗi thống nhất, có thể dự đoán, kèm mã lỗi máy có thể đọc.

- **Tên gói:** `@powerduck/openapi-parser`
- **Phiên bản:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-parser"/>
- **Giấy phép:** MIT
- **Node.js:** >= 22.12.0

## Tính năng

- **Một hàm cho mọi phiên bản** — Swagger 2.0, OpenAPI 3.0.x, 3.1.x và 3.2.x đều được chuyển thành tài liệu 3.2 đã kiểm tra tính hợp lệ.
- **Đầu vào là chuỗi JSON và YAML** — Truyền vào đối tượng đã phân tích cú pháp hoặc chuỗi JSON/YAML thô.
- **Mã lỗi máy có thể đọc** — Mỗi lỗi được biểu diễn bằng `OpenApiUpgradeError` chứa một giá trị liệt kê `UpgradeErrorCode`.
- **Không thay đổi đầu vào** — Đầu vào được sao chép sâu bằng `structuredClone` trước khi bất kỳ bước chuyển đổi nào chạy.
- **Bảo vệ khỏi tham chiếu vòng** — Phát hiện chu kỳ trong đầu vào trước khi gây tràn ngăn xếp.
- **Kiểm tra đầu ra** — Theo mặc định, tài liệu 3.2 sau chuyển đổi được kiểm tra theo lược đồ.
- **Hỗ trợ ESM và CJS** — Dùng `import` trong Node hiện đại và công cụ đóng gói, dùng `require()` trong tiến trình chính của Electron.

## Bước tiếp theo

- [Cài đặt](/docs/vi-VN/openapi-parser/installation/) — cài đặt và yêu cầu
- [Bắt đầu nhanh](/docs/vi-VN/openapi-parser/quickstart/) — chuyển đổi tài liệu đầu tiên
- [Tài liệu tham khảo API](/docs/vi-VN/openapi-parser/api-reference/) — mọi hàm xuất, mã lỗi và tùy chọn
- [Ví dụ](/docs/vi-VN/openapi-parser/examples/) — xử lý lỗi, tùy chọn và sử dụng CommonJS
