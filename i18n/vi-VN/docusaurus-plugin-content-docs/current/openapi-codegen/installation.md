---
sidebar_position: 2
title: "Cài đặt"
description: "Cài @powerduck/openapi-codegen bằng npm, yarn hoặc pnpm và dùng trong Node.js hoặc trình duyệt. Yêu cầu Node.js 22.12.0 trở lên."
---

# Cài đặt

## Yêu cầu

- Để dùng trong Node.js, cần **Node.js** `>= 22.12.0` (được khai báo trong trường `engines` của gói).
- Tài liệu OpenAPI **đã phân tích** thành đối tượng JavaScript, không phải chuỗi JSON/YAML thô.
- Trình duyệt hiện đại có Fetch API để sử dụng trong trình duyệt.

Gói cung cấp bản dựng ESM (`dist/index.js`) và CommonJS (`dist/index.cjs`) kèm khai báo TypeScript. Gói **không có phụ thuộc lúc chạy**.

## npm

```bash npm2yarn2pnpm
npm install @powerduck/openapi-codegen
```

## pnpm

```bash npm2yarn2pnpm
pnpm add @powerduck/openapi-codegen
```

## Yarn

```bash npm2yarn2pnpm
yarn add @powerduck/openapi-codegen
```

## Dùng trong Node.js

```typescript
import { generate } from "@powerduck/openapi-codegen";
```

CommonJS:

```javascript
const { generate } = require("@powerduck/openapi-codegen");
```

Các bộ sinh mã tích hợp được **đăng ký tự động khi nhập mô-đun**, nên `generate` dùng được ngay mà không cần thiết lập thêm.

## Dùng trong trình duyệt

Thư viện hoàn toàn tương thích với trình duyệt và không dùng mô-đun tích hợp của Node.js. Tải từ CDN ESM rồi gọi trực tiếp:

```html
<script type="module">
  import { generate, list } from "https://esm.sh/@powerduck/openapi-codegen";

  const document = {
    openapi: "3.1.0",
    info: { title: "Example API", version: "1.0.0" },
    servers: [{ url: "https://api.example.com" }],
    paths: {
      "/hello": { get: { responses: { "200": { description: "OK" } } } },
    },
  };

  const code = generate({
    document,
    path: "/hello",
    method: "get",
    language: "javascript",
    client: "fetch",
  });

  console.log(code);
</script>
```

Vite, esbuild và webpack cũng dùng được ngay; bản dựng ESM hỗ trợ tree shaking để loại bỏ mã không sử dụng.

## Truyền tài liệu

Truyền một đối tượng đã phân tích. Với JSON:

```typescript
import { readFile } from "node:fs/promises";

const document = JSON.parse(await readFile("./openapi.json", "utf8"));
```

Với YAML, trước tiên hãy phân tích bằng một gói YAML riêng:

```typescript
import YAML from "yaml";
const document = YAML.parse(await readFile("./openapi.yaml", "utf8"));
```

## Cấu trúc gói

| Điểm vào | Đường dẫn |
|-------|------|
| Điểm vào ESM | `dist/index.js` |
| Điểm vào CommonJS | `dist/index.cjs` |
| Định nghĩa kiểu | `dist/index.d.ts` |

Không có chương trình CLI; thư viện chỉ được sử dụng từ mã.

## Bước tiếp theo

- [Bắt đầu nhanh](/docs/vi-VN/openapi-codegen/quickstart/) — tạo đoạn mã đầu tiên.
- [Cấu hình](/docs/vi-VN/openapi-codegen/configuration/) — tất cả tùy chọn sinh mã.
