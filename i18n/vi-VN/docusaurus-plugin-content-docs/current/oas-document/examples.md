---
sidebar_position: 5
title: "Ví dụ"
description: "Bỏ qua chuyển đổi tự động, dùng mô-đun lõi không cần React, tùy chỉnh giao diện và tìm hiểu giới hạn hiệu năng hiển thị."
---

# Ví dụ

## Bạn đã có tài liệu OAS 3.2 hợp lệ?

```tsx
// Skip auto-upgrade when your document is already 3.2
<OasDocument input={validOas32Doc} autoUpgrade={false} />
```

## Chỉ dùng mô-đun lõi (không cần React)

Dùng điểm vào của mô-đun lõi cho giao diện tùy chỉnh hoặc Node.js:

```typescript
import { loadOasDocument } from "@powerduck/oas-document";

const result = await loadOasDocument(spec, { autoUpgrade: true });

if (result.error) {
  console.error("Failed:", result.error);
} else {
  console.log("Operations:", result.operations.length);
  console.log("Tree nodes:", result.tree.length);
}
```

## Tùy chỉnh kiểu hiển thị

Phần tử gốc được gán `data-theme="light"` hoặc `data-theme="dark"`. Mọi màu sắc đều được xác định qua các biến CSS trong `.pde-oas-root`:

```css
:is(.pde-oas-root, .pde-oas-theme) {
  --pde-color-accent: #635bff;
}

:is(.pde-oas-root, .pde-oas-theme)[data-theme="dark"] {
  --pde-color-accent: #a5a0ff;
}
```

## Lưu ý về hiệu năng

- Các ví dụ mã chỉ được tải khi nằm trong phạm vi 600px tính từ vùng hiển thị (IntersectionObserver)
- Tô sáng cú pháp sử dụng bộ nhớ đệm LRU (64 mục / 1MB)
- Theo dõi cuộn sử dụng trình lắng nghe thụ động và giới hạn tần suất bằng rAF
- Việc tạo ví dụ được giới hạn ở 6 cấp lồng nhau và 1.000 nút
