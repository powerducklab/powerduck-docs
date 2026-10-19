---
sidebar_position: 2
title: "安裝"
description: "安裝 @powerduck/conf-patch，選擇 Node.js 檔案層進入點或瀏覽器適用的 ./core 子路徑。"
---

# 安裝

使用慣用的套件管理工具安裝 `@powerduck/conf-patch`。

## 環境需求

- **Node.js:** `>= 22.12.0`
- **TypeScript：**選用。套件提供完整型別宣告，不必安裝 `@types/...`。

## 安裝

```bash npm2yarn2pnpm
npm install @powerduck/conf-patch
```

```bash
yarn add @powerduck/conf-patch
```

```bash
pnpm add @powerduck/conf-patch
```

## 執行階段相依套件

conf-patch 的三個執行階段相依套件會自動安裝：

| 套件 | 版本 | 用途 |
|---|---|---|
| `@powerduck/openapi-parser` | `^0.3.12` | OpenAPI/Swagger 規格驗證（`validateOpenAPISpec`、`validateOpenAPIFile`）。 |
| `jsonc-parser` | `^3.3.1` | JSON 與 JSONC 的增量文字編輯。 |
| `yaml` | `^2.9.0` | YAML 的 AST 剖析與修改。 |

不必直接操作這些相依套件。

## 兩個進入點

套件提供**兩個子路徑匯出**，請依執行環境選擇。

### 主要進入點 — `@powerduck/conf-patch`

包含**檔案層**（`readConfigFile`、`writeConfigFile`、`patchConfigFile`、`setConfigValue`、`deleteConfigValue`、`withFileLock`、`releaseAllLocalLocks`）、核心層與 OpenAPI 驗證。適用於 Node.js 和 Electron，依賴 `node:fs`、`node:path` 與 `node:crypto`。

### 核心子路徑 — `@powerduck/conf-patch/core`

**僅匯出瀏覽器適用的核心層**：`patchContent`、`setContentValue`、`deleteContentValue`、斷言輔助工具與核心型別。沒有 Node.js 相依性，可用於瀏覽器、Edge Functions 與 Service Worker。

:::tip
瀏覽器程式碼請一律從 `@powerduck/conf-patch/core` 匯入，避免將檔案層及其 `node:fs` 相依套件納入組合。
:::

## 模組系統：CJS 與 ESM

套件**未設定** `"type": "module"`，所以 `.js` 預設按 CommonJS 處理。`package.json` 的 `exports` 對應會將 `import` 與 `require` 條件明確指向正確建置。

| 進入點 | CJS (`require`) | ESM (`import`) | 型別 |
|---|---|---|---|
| 主要進入點 | `dist/index.js` | `dist/index.mjs` | `dist/index.d.ts` |
| 核心子路徑 | `dist/core.js` | `dist/core.mjs` | `dist/core.d.ts` |

### CommonJS（Node.js / Electron 主處理程序）

```javascript
// Full library (includes file IO)
const { setConfigValue, readConfigFile } = require("@powerduck/conf-patch");

// Core layer only (browser-safe, no fs dependency)
const { patchContent, setContentValue } = require("@powerduck/conf-patch/core");
```

### ES Modules（現代 Node.js / 瀏覽器 / 打包工具）

```typescript
// Full library
import { setConfigValue, readConfigFile } from "@powerduck/conf-patch";

// Core layer only (browser-safe)
import { patchContent, setContentValue } from "@powerduck/conf-patch/core";
```

## 驗證安裝

```bash
# Check the installed version
npm list @powerduck/conf-patch

# Verify the main entry loads
node -e "const lib = require('@powerduck/conf-patch'); console.log('exports:', Object.keys(lib).length);"

# Verify the core subpath loads
node -e "const core = require('@powerduck/conf-patch/core'); console.log('core exports:', Object.keys(core).length);"
```

## 後續步驟

- [快速入門](/docs/zh-TW/conf-patch/quickstart/) — 在瀏覽器修改字串，在磁碟修改檔案。
- [API 參考](/docs/zh-TW/conf-patch/api-reference/) — 所有匯出項目、型別與選項。
