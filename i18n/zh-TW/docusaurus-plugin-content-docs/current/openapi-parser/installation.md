---
sidebar_position: 2
title: "安裝"
description: "安裝 @powerduck/openapi-parser 並確認 ESM/CJS 建置版本可正常使用。"
---

# 安裝

```bash npm2yarn2pnpm
npm install @powerduck/openapi-parser
```

需要 Node.js 22.12.0 或更新版本。

## 套件結構

```
@powerduck/openapi-parser
├── dist/index.js       # ESM build
├── dist/index.cjs      # CJS build (require())
└── dist/index.d.ts     # TypeScript declarations
```

## ESM（Node.js 22.12.0+、現代打包工具）

```typescript
import { upgradeOasTo32 } from "@powerduck/openapi-parser";
```

## CommonJS（Electron 主程序）

```javascript
const { upgradeOasTo32 } = require("@powerduck/openapi-parser");
```

## 不需要對等相依套件

這個套件沒有對等相依套件。`@scalar/openapi-parser` 與 `@scalar/openapi-upgrader` 已包含在套件內。
