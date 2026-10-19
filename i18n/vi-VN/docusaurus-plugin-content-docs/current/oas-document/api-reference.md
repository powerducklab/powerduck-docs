---
sidebar_position: 4
title: "Tài liệu tham khảo API"
description: "Thuộc tính OasDocument, hook useOasDocument và các hàm lõi."
---

# Tài liệu tham khảo API

## `<OasDocument />` — Thuộc tính

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|------|------|---------|-------------|
| `input` | `OpenApiInput \| OpenApiDocument \| null` | bắt buộc | Tài liệu OpenAPI/Swagger (đối tượng, chuỗi JSON hoặc chuỗi YAML) |
| `autoUpgrade` | `boolean` | `true` | Kiểm tra và chuyển sang OAS 3.2 qua `@powerduck/openapi-parser` |
| `defaultOperationId` | `string` | — | ID thao tác được chọn khi hiển thị lần đầu |
| `onOperationChange` | `(operation) => void` | — | Hàm gọi lại khi người dùng thay đổi lựa chọn |
| `className` | `string` | — | Lớp CSS bổ sung cho phần tử gốc |
| `style` | `React.CSSProperties` | — | Kiểu nội dòng cho phần tử gốc |
| `theme` | `"light" \| "dark"` | `"light"` | Giao diện ban đầu. Được lưu vào localStorage. |
| `header` | `OasDocumentHeaderConfig` | — | Cấu hình đầu trang (logo, tiêu đề, liên kết điều hướng) |
| `showTree` | `boolean` | `true` | Hiện cây ở thanh bên |
| `treeWidth` | `number` | `340` | Chiều rộng thanh bên tính bằng pixel (240–480) |

### Cấu hình đầu trang

| Trường | Kiểu | Mặc định |
|-------|------|---------|
| `logo` | `string \| ReactNode` | — |
| `title` | `string` | `"API Documentation"` |
| `navItems` | `Array<{ label, href?, onClick? }>` | `[]` |
| `showThemeToggle` | `boolean` | `true` |

## `useOasDocument(input, options?)`

```typescript
const {
  document,          // Oas32Document | null
  loading,           // boolean
  error,             // Error | null
  operations,        // OasOperation[]
  navigationGroups,  // OasNavigationGroup[]
  tree,              // TreeNode[]
  selectedOperation, // OasOperation | undefined
  setSelectedOperation,
  theme,             // "light" | "dark"
  setTheme,
} = useOasDocument(spec, { autoUpgrade: true });
```

## Hàm lõi

| Hàm | Mô tả |
|----------|-------------|
| `loadOasDocument(input, options?)` | Tải và chuyển đổi tài liệu. Trả về `{ document, operations, navigationGroups, tree, warnings, error }` |
| `parseOperations(document)` | Trích xuất thao tác từ tài liệu OAS |
| `buildNavigationGroups(document)` | Tạo cấu trúc điều hướng theo nhóm |
