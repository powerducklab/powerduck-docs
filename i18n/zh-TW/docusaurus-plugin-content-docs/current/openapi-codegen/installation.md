---
sidebar_position: 2
title: "安裝"
description: "使用 npm、yarn 或 pnpm 安裝 @powerduck/openapi-codegen，在 Node.js 或瀏覽器中產生請求程式碼。需要 Node.js 22.12.0 以上版本。"
---

# 安裝

## 環境需求

- 在 Node.js 中使用時，需要 **Node.js** `>= 22.12.0`（套件的 `engines` 欄位已宣告）。
- **已解析**為 JavaScript 物件的 OpenAPI 文件，而非原始 JSON/YAML 字串。
- 在瀏覽器中使用時，需要支援 Fetch API 的現代瀏覽器。

套件提供 ESM（`dist/index.js`）與 CommonJS（`dist/index.cjs`）組建，包含 TypeScript 宣告，且**沒有執行階段相依套件**。

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

## 在 Node.js 中使用

```typescript
import { generate } from "@powerduck/openapi-codegen";
```

CommonJS:

```javascript
const { generate } = require("@powerduck/openapi-codegen");
```

內建產生器會**在匯入模組時自動註冊**，因此 `generate` 可直接使用，無須額外設定。

## 在瀏覽器中使用

程式庫完全相容於瀏覽器，不依賴 Node.js 內建模組。可以從 ESM CDN 載入並直接呼叫：

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

也可直接使用 Vite、esbuild 或 webpack 打包；ESM 組建支援 tree shaking，可移除未使用的程式碼。

## 傳入文件

請傳入已解析的物件。JSON 範例：

```typescript
import { readFile } from "node:fs/promises";

const document = JSON.parse(await readFile("./openapi.json", "utf8"));
```

對於 YAML，請先使用獨立的 YAML 套件解析：

```typescript
import YAML from "yaml";
const document = YAML.parse(await readFile("./openapi.yaml", "utf8"));
```

## 套件結構

| 進入點 | 路徑 |
|-------|------|
| ESM 進入點 | `dist/index.js` |
| CommonJS 進入點 | `dist/index.cjs` |
| 型別定義 | `dist/index.d.ts` |

本程式庫不提供 CLI 執行檔，僅供程式碼呼叫。

## 後續步驟

- [快速入門](/docs/zh-TW/openapi-codegen/quickstart/) — 產生第一個程式碼片段。
- [設定](/docs/zh-TW/openapi-codegen/configuration/) — 查看所有產生選項。
