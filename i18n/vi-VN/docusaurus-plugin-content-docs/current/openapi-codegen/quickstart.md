---
sidebar_position: 3
title: "Bắt đầu nhanh"
description: "Tạo ví dụ yêu cầu có thể chạy đầu tiên bằng @powerduck/openapi-codegen và xem các bộ sinh mã có sẵn."
---

# Bắt đầu nhanh

Hướng dẫn này trình bày cách tạo ví dụ yêu cầu có thể chạy và tìm các bộ sinh mã có sẵn.

## 1. Cài đặt

```bash npm2yarn2pnpm
npm install @powerduck/openapi-codegen
```

## 2. Sinh mã từ tài liệu

Truyền tài liệu OpenAPI **đã phân tích cú pháp** cùng với `path`, `method`, `language` và `client` đích. `generate()` trả về mã nguồn dưới dạng chuỗi.

```typescript
import { generate } from "@powerduck/openapi-codegen";
import document from "./openapi.json" with { type: "json" };

const code = generate({
  document,
  path: "/pets/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
});

console.log(code);
```

Ví dụ tương đương bằng CommonJS:

```javascript
const { generate } = require("@powerduck/openapi-codegen");
const fs = require("node:fs");

const document = JSON.parse(fs.readFileSync("./openapi.json", "utf8"));

const code = generate({
  document,
  path: "/pets",
  method: "post",
  language: "python",
  client: "requests",
});

console.log(code);
```

## 3. Liệt kê các bộ sinh mã có sẵn

`list()` trả về thông tin mô tả của mọi bộ sinh mã đã đăng ký:

```typescript
import { list } from "@powerduck/openapi-codegen";

for (const { language, client } of list()) {
  console.log(`${language}/${client}`);
}
```

Mỗi đối tượng mô tả có dạng `{ language: string; client: string }`. Mã định danh phân biệt chữ hoa và chữ thường; hãy dùng đúng giá trị trong danh sách bộ sinh mã ở tài liệu tham chiếu API. [Tham chiếu API](/docs/vi-VN/openapi-codegen/api-reference/#built-in-generators-21-languages-41-clients).

Bạn cũng có thể chọn bộ sinh mã bằng mã chương trình:

```typescript
import { generate, list } from "@powerduck/openapi-codegen";

const picked = list().find(
  (g) => g.language === "javascript" && g.client === "fetch",
);

if (!picked) throw new Error("Generator not available");

const code = generate({
  document,
  path: "/pets",
  method: "get",
  language: picked.language,
  client: picked.client,
});
```

## 4. Cung cấp thông tin xác thực

Dùng `securityValues` để điền giá trị cho các sơ đồ bảo mật có tên. Khóa phải trùng với tên sơ đồ trong tài liệu:

```typescript
const code = generate({
  document,
  path: "/pets/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
  securityValues: {
    bearerAuth: "YOUR_ACCESS_TOKEN",
    apiKey: "YOUR_API_KEY",
  },
});
```

## 5. Ghi đè URL máy chủ

```typescript
const code = generate({
  document,
  path: "/pets",
  method: "get",
  language: "shell",
  client: "curl",
  serverUrl: "https://staging.example.com/v1",
});
```

## Xử lý lỗi

`generate()` ném ngoại lệ khi thiếu đầu vào hoặc bộ sinh mã không được hỗ trợ. Hãy bắt ngoại lệ khi xử lý tài liệu không đáng tin cậy:

```typescript
try {
  const code = generate({
    document,
    path: "/pets/{id}",
    method: "get",
    language: "javascript",
    client: "fetch",
  });
  console.log(code);
} catch (error) {
  console.error("Generation failed:", error instanceof Error ? error.message : error);
}
```

## Các bước tiếp theo

- [Cấu hình](/docs/vi-VN/openapi-codegen/configuration/) — `GenerateOptions`, `RequestIR`, `Generator`, `Plugin`.
- [Ví dụ](/docs/vi-VN/openapi-codegen/examples/) — JavaScript fetch, Python requests, cURL, bộ sinh mã tùy chỉnh, plugin và cách dùng trực tiếp `RequestIR`.
- [Tham chiếu API](/docs/vi-VN/openapi-codegen/api-reference/) — Tất cả thành phần được xuất.
