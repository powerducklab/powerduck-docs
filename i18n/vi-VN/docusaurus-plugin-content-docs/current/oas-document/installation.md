---
sidebar_position: 2
title: "Cài đặt"
description: "Cài đặt @powerduck/oas-document và các phụ thuộc ngang hàng của gói."
---

# Cài đặt

```bash npm2yarn2pnpm
npm install @powerduck/oas-document
```

## Phụ thuộc ngang hàng

```bash
npm install react react-dom
```

## Nhập CSS

```tsx
import "@powerduck/oas-document/react/index.css";
```

Thành phần đã tích hợp các biểu định kiểu riêng (CSS của tree và md-editor), nên không cần nhập thêm CSS ngoài điểm vào của gói.

## Điểm vào

| Đường dẫn nhập | Mô tả |
|--------|-------------|
| `@powerduck/oas-document/react` | Thành phần `<OasDocument />` và hook `useOasDocument` |
| `@powerduck/oas-document` | Phần lõi: `loadOasDocument`, `parseOperations`, `buildNavigationGroups` |
