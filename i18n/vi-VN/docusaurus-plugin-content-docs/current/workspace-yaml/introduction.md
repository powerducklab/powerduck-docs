---
sidebar_position: 1
title: "Giới thiệu"
description: "Khởi tạo tệp workspace.yaml và tệp YAML OpenAPI 3.2 một cách tin cậy. Dùng được an toàn trong trình duyệt: các hàm thuần tạo chuỗi nội dung YAML mà không truy cập hệ thống tệp. Trong Node.js / Electron, bổ sung thao tác ghi nguyên tử, khóa tệp và chuẩn hóa đường dẫn cho lớp lõi."
keywords: ["workspace-yaml", "powerduck", "YAML", "OpenAPI"]
---

# @powerduck/workspace-yaml

Khởi tạo tệp workspace.yaml và tệp YAML OpenAPI 3.2 một cách tin cậy.

Kiến trúc hai lớp:
- **Lớp lõi**: Dùng được an toàn trong trình duyệt: các hàm thuần tạo chuỗi nội dung YAML mà không truy cập hệ thống tệp.
- **Lớp tệp**: Trong Node.js / Electron, bổ sung thao tác ghi nguyên tử, khóa tệp và chuẩn hóa đường dẫn cho lớp lõi.

- **Tên gói:** `@powerduck/workspace-yaml`
- **Phiên bản:** <img src="https://img.shields.io/npm/v/@powerduck/workspace-yaml"/>
- **Giấy phép:** MIT

Thư viện này **chỉ khởi tạo tệp**, dành cho trường hợp tạo tệp mới hoặc tạo thủ công. Thư viện **không** triển khai lại việc đọc, áp dụng bản vá hoặc cập nhật tệp YAML. Để thực hiện các thao tác đó, hãy dùng [`@powerduck/conf-patch`](https://www.npmjs.com/package/@powerduck/conf-patch).

## Bước tiếp theo

- [Cài đặt](/docs/vi-VN/workspace-yaml/installation/)
- [Bắt đầu nhanh](/docs/vi-VN/workspace-yaml/quickstart/)
- [Tài liệu tham khảo API](/docs/vi-VN/workspace-yaml/api-reference/)
- [Ví dụ](/docs/vi-VN/workspace-yaml/examples/)
