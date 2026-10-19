---
sidebar_position: 4
title: "Tài liệu tham khảo API"
description: "Thuộc tính Tree, bộ điều hợp, tiện ích lõi và phương thức điều khiển bằng lệnh."
---

# Tài liệu tham khảo API

## Lõi: `TreeNode<TMetadata>`

```typescript
interface TreeNode<TMetadata = unknown> {
  id: string;
  name: string;
  order?: number;
  children?: TreeNode<TMetadata>[];
  metadata?: TMetadata;
}
```

## Bộ điều hợp

### `buildOpenApiTree(document, options?)`

Tạo cây điều hướng OpenAPI.

| Tùy chọn | Kiểu | Mặc định | Mô tả |
|--------|------|---------|-------------|
| `showInternal` | `boolean` | `false` | Hiện các nút có `x-internal` hoặc `x-scalar-ignore` khi bật |
| `showComponents` | `boolean` | `true` | Hiện phần thành phần |
| `showWebhooks` | `boolean` | `true` | Hiện webhook |
| `defaultExpandDepth` | `number` | `2` | Độ sâu mở rộng mặc định |

Ưu tiên điều hướng: thẻ lồng nhau gốc của OAS 3.2 → `x-tagGroups` → thẻ phẳng.

### `buildSchemaTree(schema, options?)`

| Tùy chọn | Kiểu | Mặc định | Mô tả |
|--------|------|---------|-------------|
| `maxDepth` | `number` | `8` | Độ sâu lồng nhau tối đa |
| `showDeprecated` | `boolean` | `true` | Hiện thuộc tính không còn được khuyến nghị |
| `expandCombinators` | `boolean` | `true` | Mở rộng oneOf/anyOf/allOf |
| `showArrayItems` | `boolean` | `true` | Mở rộng phần tử mảng |

### `buildDocTree(document, options?)`

Cây tài liệu kiểu Stripe, mỗi thao tác mở rộng để hiện tham số, nội dung yêu cầu và phản hồi.

## Thành phần React `<Tree />`

### Thuộc tính chính

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|------|------|---------|-------------|
| `nodes` | `TreeNode[]` | bắt buộc | Các nút gốc cần hiển thị |
| `onSelect` | `(node) => void` | — | Được gọi khi chọn nút |
| `searchable` | `boolean` | `false` | Hiện ô tìm kiếm |
| `defaultExpandDepth` | `number` | `1` | Độ sâu mở rộng ban đầu |
| `showExpandAll` | `boolean` | `false` | Nút mở rộng/thu gọn tất cả |
| `draggable` | `boolean` | `false` | Bật sắp xếp lại bằng kéo thả |
| `onReorder` | `(result: ReorderResult) => void` | — | Được gọi khi sắp xếp lại trong cùng nút cha |
| `onMove` | `(nodes, movedNode, targetParentId) => void` | — | Được gọi khi chuyển giữa các cấp |
| `canDrag` | `(node) => boolean` | — | Kiểm soát nút có thể kéo |
| `canDrop` | `(dragged, target, position) => boolean` | — | Kiểm soát vị trí thả được phép |
| `contextMenuItems` | `(node) => ContextMenuItem[]` | — | Mục trong menu nhấp chuột phải |
| `onPatch` | `(ops, context) => void` | — | Thao tác bản vá RFC 6902 khi sắp xếp lại |
| `maxHeight` | `number \| string` | — | Chiều cao tối đa trước khi cuộn |
| `size` | `"xs" \| "sm" \| "md"` | `"sm"` | Tùy chọn kích thước |

### Điều khiển bằng lệnh (qua ref)

| Phương thức | Mô tả |
|--------|-------------|
| `expandAll()` | Mở rộng mọi nút |
| `collapseAll()` | Thu gọn mọi nút |
| `expandToDepth(depth)` | Mở rộng đến độ sâu chỉ định |
| `getExpandedIds()` | Lấy ID các nút đang mở rộng |
| `getSelectedNode()` | Lấy nút đang được chọn |
| `scrollToNode(id)` | Cuộn nút vào vùng hiển thị |
| `locateNode(predicate)` | Tìm nút, mở rộng tổ tiên, chọn và cuộn vào vùng hiển thị |

## Tiện ích lõi

| Hàm | Mô tả |
|----------|-------------|
| `findNode(nodes, id)` | Tìm nút theo ID |
| `findPath(nodes, id)` | Tìm đường dẫn đầy đủ từ gốc |
| `getLeaves(nodes)` | Lấy mọi nút lá |
| `countNodes(nodes)` | Đếm mọi nút |
| `filterTree(nodes, { query })` | Lọc theo truy vấn tìm kiếm |
| `flattenTree(nodes)` | Làm phẳng thành danh sách duyệt tiền thứ tự |
| `updateNode(nodes, id, updater)` | Cập nhật nút mà không sửa dữ liệu gốc |
| `removeNode(nodes, id)` | Xóa nút mà không sửa dữ liệu gốc |
