---
sidebar_position: 4
title: "Tài liệu tham khảo API"
description: "Thuộc tính SchemaEditor, các hàm xuất của mô-đun lõi và kiểu ngôn ngữ của trình soạn thảo."
---

# Tài liệu tham khảo API

## `<SchemaEditor />` — Thuộc tính

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|------|------|---------|-------------|
| `value` | `string` | bắt buộc | Nội dung trình soạn thảo |
| `onChange` | `(value: string) => void` | — | Được gọi khi nội dung thay đổi |
| `language` | `"json" \| "yaml" \| "javascript"` | bắt buộc | Ngôn ngữ nội dung |
| `schema` | `JsonSchema` | — | JSON Schema dùng cho tự động hoàn thành và chẩn đoán (json/yaml) |
| `snippets` | `string[]` | — | Chuỗi đoạn mã dùng cho gợi ý mờ trong JavaScript |
| `theme` | `"light" \| "dark"` | `"light"` | Giao diện hiển thị |
| `readOnly` | `boolean` | `false` | Tắt chỉnh sửa |
| `placeholder` | `string` | — | Văn bản gợi ý khi nội dung trống |
| `showDiagnostics` | `boolean` | `true` | Hiện thanh trạng thái chẩn đoán |
| `enableInlineSuggestions` | `boolean` | `true` | Bật văn bản gợi ý mờ |
| `enableCompletion` | `boolean` | `true` | Bật cửa sổ tự động hoàn thành |
| `diagnosticsDebounceMs` | `number` | `250` | Độ trễ debounce của chẩn đoán |

## Các hàm xuất của mô-đun lõi (`@powerduck/schema-editor`)

| Hàm | Mô tả |
|----------|-------------|
| `resolveSchemas(document)` | Phân giải con trỏ `$ref` trong tài liệu lược đồ |
| `validateSchema(data, schema)` | Kiểm tra dữ liệu theo lược đồ |
| `generateSample(schema)` | Tạo dữ liệu mẫu từ JSON Schema |
| `getCompletionItems(model, position)` | Lấy các mục tự động hoàn thành tại vị trí con trỏ |

## Kiểu

```typescript
import type { SchemaEditorProps } from "@powerduck/schema-editor/react";
```
