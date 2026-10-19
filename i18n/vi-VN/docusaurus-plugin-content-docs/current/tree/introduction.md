---
sidebar_position: 1
title: "Giới thiệu"
description: "Thành phần cây có thể mở rộng cho điều hướng API, khám phá lược đồ và tài liệu. Dựa trên lõi tổng quát với bộ điều hợp cho OpenAPI, JSON Schema và nguồn dữ liệu tùy chỉnh."
keywords: ["tree", "powerduck", "React", "OpenAPI", "JSON Schema"]
---

# @powerduck/tree

Thành phần cây có thể mở rộng cho điều hướng API, khám phá lược đồ và tài liệu. Dựa trên lõi tổng quát với bộ điều hợp cho OpenAPI, JSON Schema và nguồn dữ liệu tùy chỉnh.

- **Tên gói:** `@powerduck/tree`
- **Phiên bản:** <img src="https://img.shields.io/npm/v/@powerduck/tree"/>
- **Giấy phép:** MIT

## Tính năng

- **Lõi tổng quát** — `TreeNode<TMetadata>` hoạt động với mọi nguồn dữ liệu
- **Bộ điều hợp OpenAPI** — Điều hướng theo thẻ với thẻ lồng nhau OAS 3.2, `x-tagGroups`, `x-order`, `x-displayName` và `x-internal`
- **Bộ điều hợp JSON Schema** — Mở rộng sâu các thuộc tính lồng nhau, mảng và bộ kết hợp kèm siêu dữ liệu `jsonPath`
- **Bộ điều hợp tài liệu** — Cây tài liệu kiểu Stripe với huy hiệu số lượng thao tác
- **Thành phần React** — Tìm kiếm, mở rộng và thu gọn, điều hướng bàn phím, huy hiệu phương thức và render props tùy chỉnh
- **Kéo và thả** — Sắp xếp lại trong cùng nút cha và chuyển vào thư mục ở cấp khác
- **Menu ngữ cảnh** — Thao tác cho từng nút bằng nhấp chuột phải hoặc nút tùy chọn khác
- **Định vị bằng lệnh** — `locateNode(predicate)` tìm nút, mở rộng các nút tổ tiên, chọn nút và cuộn đến vùng hiển thị
- **Tích hợp JSON Patch** — Hàm gọi lại `onPatch` phát các thao tác RFC 6902
- **Giao diện qua biến CSS** — Tương thích với `tokens.css` của Powerduck, hỗ trợ chế độ sáng và tối

## Bước tiếp theo

- [Cài đặt](/docs/vi-VN/tree/installation/)
- [Bắt đầu nhanh](/docs/vi-VN/tree/quickstart/)
- [Tài liệu tham khảo API](/docs/vi-VN/tree/api-reference/)
- [Ví dụ](/docs/vi-VN/tree/examples/)
