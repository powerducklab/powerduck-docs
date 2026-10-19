---
sidebar_position: 2
title: "Cài đặt"
description: "Cài @powerduck/openapi-cli trên toàn hệ thống, thêm làm phụ thuộc phát triển hoặc chạy bằng npx. Yêu cầu Node.js 22.12.0 trở lên."
---

# Cài đặt

## Yêu cầu

- **Node.js**: `>= 22.12.0` (được khai báo trong trường `engines` của gói).
- Trình quản lý gói: npm, yarn hoặc pnpm.

Gói cung cấp cả bản dựng ESM (`dist/index.js`) và CommonJS (`dist/index.cjs`), kèm khai báo TypeScript (`dist/index.d.ts`). Không cần gói `@types` bổ sung.

## Cài đặt toàn hệ thống (khuyên dùng cho CLI)

Cài đặt toàn hệ thống giúp gọi chương trình `openapi-cli` qua `PATH`:

```bash npm2yarn2pnpm
npm install -g @powerduck/openapi-cli
```

Kiểm tra chương trình:

```bash
openapi-cli --help
```

## Cài đặt trong dự án (khuyên dùng cho CI)

Cố định phiên bản trong dự án để CI sử dụng một bản phát hành đã xác định:

```bash npm2yarn2pnpm
npm install --save-dev @powerduck/openapi-cli
```

Sau đó chạy lệnh qua trình quản lý gói:

```bash
npx openapi-cli --spec openapi.json
# or
pnpm exec openapi-cli --spec openapi.json
```

## Chạy một lần bằng npx

Không cần cài đặt trước:

```bash
npx @powerduck/openapi-cli --spec openapi.json
```

## Cấu trúc gói

| Điểm vào | Đường dẫn |
|-------|------|
| Điểm vào ESM | `dist/index.js` |
| Điểm vào CommonJS | `dist/index.cjs` |
| Định nghĩa kiểu | `dist/index.d.ts` |
| Điểm vào CLI (bin) | `dist/cli.js` |
| Tên chương trình | `openapi-cli` |

Gói khai báo `"type": "module"` và chỉ cung cấp hai đường dẫn con `.` và `./package.json`.

## Nhập trong mã

```typescript
// ESM
import { runTests, resolveConfig } from "@powerduck/openapi-cli";

// CommonJS
const { runTests, resolveConfig } = require("@powerduck/openapi-cli");
```

## Phụ thuộc lúc chạy

Gói được phát hành phụ thuộc vào:

- `@powerduck/openapi-parser` (`^0.3.12`) — phân giải tham chiếu `$ref` nội bộ.
- `@powerduck/openapi-request` (`0.2.22`) — thực thi yêu cầu theo giao thức.
- `commander` (`^12.1.0`) — phân tích đối số CLI.
- `https-proxy-agent` (`^5.0.1`) — hỗ trợ proxy cho truyền tải HTTP.

## Bước tiếp theo

- [Bắt đầu nhanh](/docs/vi-VN/openapi-cli/quickstart/) — chạy bộ kiểm thử đầu tiên.
- [Lệnh](/docs/vi-VN/openapi-cli/commands/) — tham khảo đầy đủ các tùy chọn.
