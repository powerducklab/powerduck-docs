---
sidebar_position: 2
title: "安裝"
description: "使用 npm、yarn 或 pnpm 安裝 @powerduck/x-to-openapi。支援 ESM 與 CommonJS，提供零設定的 curlToOpenApi 與 postmanToOpenApi 轉換函式。"
---

# 安裝

使用你慣用的套件管理工具安裝 `@powerduck/x-to-openapi`。

## 環境需求

- **Node.js:** `>= 22.12.0`
- **TypeScript：**選用；套件包含完整的型別定義。

## 安裝

```bash npm2yarn2pnpm
npm install @powerduck/x-to-openapi
```

```bash
yarn add @powerduck/x-to-openapi
```

```bash
pnpm add @powerduck/x-to-openapi
```

## 執行階段相依套件

| 套件 | 版本 | 用途 |
|---|---|---|
| `@powerduck/openapi-parser` | `^0.3.12` | 標準 OpenAPI 型別與輸出驗證 |
| `curlconverter` | `^4.12.0` | 將 curl 命令解析為結構化請求 |

這兩個相依套件會自動安裝。

---

## 模組系統：優先使用 ESM，同時支援 CJS

套件宣告了 `"type": "module"`，透過同一個進入點提供兩種組建：

| 組建 | 條件 | 檔案 |
|---|---|---|
| ESM | `import` | `./dist/index.js` |
| CommonJS | `require` | `./dist/index.cjs` |
| 型別 | — | `./dist/index.d.ts` |

```typescript
// ESM (Node.js, bundlers)
import { curlToOpenApi, postmanToOpenApi } from "@powerduck/x-to-openapi";
```

```javascript
// CommonJS (require)
const { curlToOpenApi, postmanToOpenApi } = require("@powerduck/x-to-openapi");
```

套件宣告了 `"sideEffects": false`，tree shaking 可移除未使用的轉接器。

---

## 零設定輔助函式

多數使用者只需要兩個函式。它們會建立 [`XToOpenApi`](/docs/zh-TW/x-to-openapi/api-reference/#xtoopenapi) 實例，註冊對應轉接器，然後呼叫 `convert`：

```typescript
import {
  curlToOpenApi,    // string | string[]  → OpenAPI 3.2
  postmanToOpenApi, // collection object | JSON string → OpenAPI 3.2
} from "@powerduck/x-to-openapi";
```

需要自訂選項、多個轉接器、`"auto"` 偵測或自訂轉接器時，請使用完整的 [`XToOpenApi`](/docs/zh-TW/x-to-openapi/api-reference/#xtoopenapi) 類別。

---

## 確認安裝

```bash
# Check the installed version
npm list @powerduck/x-to-openapi

# Verify the package loads and the helpers exist
node -e "const x = require('@powerduck/x-to-openapi'); console.log(typeof x.curlToOpenApi, typeof x.postmanToOpenApi, typeof x.XToOpenApi);"
```

---

## 後續步驟

- [快速入門](/docs/zh-TW/x-to-openapi/quickstart/) — 轉換 curl 命令、Postman 集合，並註冊自訂轉接器。
- [API 參考](/docs/zh-TW/x-to-openapi/api-reference/) — 查看全部匯出項目與選項。
