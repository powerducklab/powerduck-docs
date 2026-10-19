---
sidebar_position: 2
title: "Cài đặt"
description: "Cài @powerduck/conf-patch và chọn điểm vào xử lý tệp cho Node.js hoặc đường dẫn ./core an toàn cho trình duyệt."
---

# Cài đặt

Cài `@powerduck/conf-patch` bằng trình quản lý gói bạn chọn.

## Yêu cầu

- **Node.js:** `>= 22.12.0`
- **TypeScript:** tùy chọn; gói có đầy đủ khai báo kiểu nên không cần `@types/...`.

## Cài đặt

```bash npm2yarn2pnpm
npm install @powerduck/conf-patch
```

```bash
yarn add @powerduck/conf-patch
```

```bash
pnpm add @powerduck/conf-patch
```

## Phụ thuộc lúc chạy

conf-patch có ba phụ thuộc khi chạy được cài tự động:

| Gói | Phiên bản | Mục đích |
|---|---|---|
| `@powerduck/openapi-parser` | `^0.3.12` | Xác thực OpenAPI/Swagger (`validateOpenAPISpec`, `validateOpenAPIFile`). |
| `jsonc-parser` | `^3.3.1` | Chỉnh sửa văn bản tăng dần cho JSON và JSONC. |
| `yaml` | `^2.9.0` | Phân tích và sửa AST của YAML. |

Bạn không cần trực tiếp sử dụng các phụ thuộc này.

## Hai điểm vào

Gói cung cấp **hai đường dẫn xuất con**. Chọn theo môi trường sử dụng.

### Điểm vào chính — `@powerduck/conf-patch`

Gồm **lớp xử lý tệp** (`readConfigFile`, `writeConfigFile`, `patchConfigFile`, `setConfigValue`, `deleteConfigValue`, `withFileLock`, `releaseAllLocalLocks`), lớp lõi và xác thực OpenAPI. Dùng trong Node.js và Electron; phụ thuộc `node:fs`, `node:path` và `node:crypto`.

### Đường dẫn con của lõi — `@powerduck/conf-patch/core`

**Chỉ xuất lớp lõi an toàn cho trình duyệt**: `patchContent`, `setContentValue`, `deleteContentValue`, tiện ích kiểm tra và các kiểu lõi. Không phụ thuộc Node.js, có thể đóng gói cho trình duyệt, Edge Functions và service worker.

:::tip
Khi dùng trong trình duyệt, luôn nhập từ `@powerduck/conf-patch/core` để loại lớp xử lý tệp và phụ thuộc `node:fs` khỏi bản đóng gói.
:::

## Hệ thống mô-đun: CJS và ESM

Gói **không** đặt `"type": "module"`, nên tệp `.js` mặc định được xem là CommonJS. Bản đồ `exports` trong `package.json` ánh xạ rõ điều kiện `import` và `require` tới đúng bản dựng.

| Điểm vào | CJS (`require`) | ESM (`import`) | Kiểu |
|---|---|---|---|
| Điểm vào chính | `dist/index.js` | `dist/index.mjs` | `dist/index.d.ts` |
| Đường dẫn con của lõi | `dist/core.js` | `dist/core.mjs` | `dist/core.d.ts` |

### CommonJS (Node.js / tiến trình chính Electron)

```javascript
// Full library (includes file IO)
const { setConfigValue, readConfigFile } = require("@powerduck/conf-patch");

// Core layer only (browser-safe, no fs dependency)
const { patchContent, setContentValue } = require("@powerduck/conf-patch/core");
```

### ES Modules (Node.js hiện đại / trình duyệt / công cụ đóng gói)

```typescript
// Full library
import { setConfigValue, readConfigFile } from "@powerduck/conf-patch";

// Core layer only (browser-safe)
import { patchContent, setContentValue } from "@powerduck/conf-patch/core";
```

## Kiểm tra cài đặt

```bash
# Check the installed version
npm list @powerduck/conf-patch

# Verify the main entry loads
node -e "const lib = require('@powerduck/conf-patch'); console.log('exports:', Object.keys(lib).length);"

# Verify the core subpath loads
node -e "const core = require('@powerduck/conf-patch/core'); console.log('core exports:', Object.keys(core).length);"
```

## Các bước tiếp theo

- [Bắt đầu nhanh](/docs/vi-VN/conf-patch/quickstart/) — sửa chuỗi trong trình duyệt và tệp trên đĩa.
- [Tham chiếu API](/docs/vi-VN/conf-patch/api-reference/) — mọi thành phần xuất, kiểu và tùy chọn.
