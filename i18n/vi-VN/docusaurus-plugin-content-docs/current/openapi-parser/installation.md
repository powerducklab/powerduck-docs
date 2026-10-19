---
sidebar_position: 2
title: "Cài đặt"
description: "Cài đặt @powerduck/openapi-parser và kiểm tra các bản dựng ESM/CJS."
---

# Cài đặt

```bash npm2yarn2pnpm
npm install @powerduck/openapi-parser
```

Yêu cầu Node.js 22.12.0 trở lên.

## Cấu trúc gói

```
@powerduck/openapi-parser
├── dist/index.js       # ESM build
├── dist/index.cjs      # CJS build (require())
└── dist/index.d.ts     # TypeScript declarations
```

## ESM (Node.js 22.12.0 trở lên, trình đóng gói hiện đại)

```typescript
import { upgradeOasTo32 } from "@powerduck/openapi-parser";
```

## CommonJS (tiến trình chính của Electron)

```javascript
const { upgradeOasTo32 } = require("@powerduck/openapi-parser");
```

## Không có phụ thuộc ngang hàng

Gói này không có phụ thuộc ngang hàng. `@scalar/openapi-parser` và `@scalar/openapi-upgrader` đã được tích hợp bên trong.
