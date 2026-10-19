---
sidebar_position: 2
title: "安裝"
description: "全域安裝 @powerduck/openapi-cli、加入開發相依套件，或透過 npx 執行。需要 Node.js 22.12.0 以上版本。"
---

# 安裝

## 環境需求

- **Node.js**：`>= 22.12.0`（在套件的 `engines` 欄位中宣告）。
- 套件管理工具：npm、yarn 或 pnpm。

套件同時提供 ESM（`dist/index.js`）與 CommonJS（`dist/index.cjs`）組建，以及 TypeScript 型別宣告（`dist/index.d.ts`），無須額外安裝 `@types` 套件。

## 全域安裝（建議用於命令列）

全域安裝後，可透過 `PATH` 找到 `openapi-cli` 執行檔：

```bash npm2yarn2pnpm
npm install -g @powerduck/openapi-cli
```

確認命令可正常執行：

```bash
openapi-cli --help
```

## 專案內安裝（建議用於 CI）

在專案中固定版本，確保 CI 使用已知版本：

```bash npm2yarn2pnpm
npm install --save-dev @powerduck/openapi-cli
```

接著透過套件管理工具執行命令：

```bash
npx openapi-cli --spec openapi.json
# or
pnpm exec openapi-cli --spec openapi.json
```

## 使用 npx 臨時執行

無須預先安裝：

```bash
npx @powerduck/openapi-cli --spec openapi.json
```

## 套件結構

| 進入點 | 路徑 |
|-------|------|
| ESM 進入點 | `dist/index.js` |
| CommonJS 進入點 | `dist/index.cjs` |
| 型別定義 | `dist/index.d.ts` |
| CLI 進入點（bin） | `dist/cli.js` |
| 執行檔名稱 | `openapi-cli` |

套件宣告了 `"type": "module"`，且僅匯出 `.` 與 `./package.json` 兩個子路徑。

## 在程式碼中匯入

```typescript
// ESM
import { runTests, resolveConfig } from "@powerduck/openapi-cli";

// CommonJS
const { runTests, resolveConfig } = require("@powerduck/openapi-cli");
```

## 執行階段相依套件

發布的套件依賴下列程式庫：

- `@powerduck/openapi-parser` (`^0.3.12`) — 解析內部 `$ref` 參照。
- `@powerduck/openapi-request` (`0.2.22`) — 執行各協定的請求。
- `commander` (`^12.1.0`) — 解析命令列引數。
- `https-proxy-agent` (`^5.0.1`) — 為 HTTP 傳輸提供代理支援。

## 後續步驟

- [快速入門](/docs/zh-TW/openapi-cli/quickstart/) — 執行第一組測試。
- [命令參考](/docs/zh-TW/openapi-cli/commands/) — 查看完整的命令列選項。
