---
sidebar_position: 2
title: "Cài đặt"
description: "Cài @powerduck/x-to-openapi bằng npm, yarn hoặc pnpm. ESM có hỗ trợ CommonJS; dùng curlToOpenApi và postmanToOpenApi mà không cần cấu hình."
---

# Cài đặt

Cài `@powerduck/x-to-openapi` bằng trình quản lý gói bạn thích.

## Yêu cầu

- **Node.js:** `>= 22.12.0`
- **TypeScript:** tùy chọn; gói kèm đầy đủ định nghĩa kiểu.

## Cài đặt

```bash npm2yarn2pnpm
npm install @powerduck/x-to-openapi
```

```bash
yarn add @powerduck/x-to-openapi
```

```bash
pnpm add @powerduck/x-to-openapi
```

## Phụ thuộc lúc chạy

| Gói | Phiên bản | Mục đích |
|---|---|---|
| `@powerduck/openapi-parser` | `^0.3.12` | Kiểu OpenAPI chuẩn và xác thực đầu ra |
| `curlconverter` | `^4.12.0` | Phân tích lệnh curl thành yêu cầu có cấu trúc |

Cả hai phụ thuộc đều được cài tự động.

---

## Hệ thống mô-đun: ưu tiên ESM, hỗ trợ CJS

Gói khai báo `"type": "module"` và cung cấp cả hai bản dựng qua cùng một điểm vào:

| Bản dựng | Điều kiện | Tệp |
|---|---|---|
| ESM | `import` | `./dist/index.js` |
| CommonJS | `require` | `./dist/index.cjs` |
| Kiểu | — | `./dist/index.d.ts` |

```typescript
// ESM (Node.js, bundlers)
import { curlToOpenApi, postmanToOpenApi } from "@powerduck/x-to-openapi";
```

```javascript
// CommonJS (require)
const { curlToOpenApi, postmanToOpenApi } = require("@powerduck/x-to-openapi");
```

Gói khai báo `"sideEffects": false`, nên tree shaking có thể loại bỏ bộ chuyển đổi không dùng.

---

## Hàm tiện ích không cần cấu hình

Hầu hết người dùng chỉ cần hai hàm. Chúng tạo một thể hiện [`XToOpenApi`](/docs/vi-VN/x-to-openapi/api-reference/#xtoopenapi), đăng ký bộ chuyển đổi tương ứng và gọi `convert`:

```typescript
import {
  curlToOpenApi,    // string | string[]  → OpenAPI 3.2
  postmanToOpenApi, // collection object | JSON string → OpenAPI 3.2
} from "@powerduck/x-to-openapi";
```

Dùng lớp [`XToOpenApi`](/docs/vi-VN/x-to-openapi/api-reference/#xtoopenapi) đầy đủ khi cần tùy chọn riêng, nhiều bộ chuyển đổi, phát hiện `"auto"` hoặc bộ chuyển đổi tùy chỉnh.

---

## Kiểm tra

```bash
# Check the installed version
npm list @powerduck/x-to-openapi

# Verify the package loads and the helpers exist
node -e "const x = require('@powerduck/x-to-openapi'); console.log(typeof x.curlToOpenApi, typeof x.postmanToOpenApi, typeof x.XToOpenApi);"
```

---

## Bước tiếp theo

- [Bắt đầu nhanh](/docs/vi-VN/x-to-openapi/quickstart/) — chuyển đổi lệnh curl và bộ sưu tập Postman, rồi đăng ký bộ chuyển đổi tùy chỉnh.
- [Tham khảo API](/docs/vi-VN/x-to-openapi/api-reference/) — tất cả mục xuất và tùy chọn.
