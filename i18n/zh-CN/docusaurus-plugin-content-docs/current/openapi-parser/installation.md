---
sidebar_position: 2
title: "安装"
description: "安装 @powerduck/openapi-parser 并验证 ESM/CJS 构建。"
---

# 安装

```bash npm2yarn2pnpm
npm install @powerduck/openapi-parser
```

需要 Node.js 22.12.0 或更高版本。

## 包结构

```
@powerduck/openapi-parser
├── dist/index.js       # ESM build
├── dist/index.cjs      # CJS build (require())
└── dist/index.d.ts     # TypeScript declarations
```

## ESM（Node.js 22.12.0+、现代打包工具）

```typescript
import { upgradeOasTo32 } from "@powerduck/openapi-parser";
```

## CommonJS（Electron 主进程）

```javascript
const { upgradeOasTo32 } = require("@powerduck/openapi-parser");
```

## 无需同级依赖

此包没有同级依赖。`@scalar/openapi-parser` 和 `@scalar/openapi-upgrader` 已打包在内部。
