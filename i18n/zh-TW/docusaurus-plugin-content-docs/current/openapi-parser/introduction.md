---
sidebar_position: 1
title: "簡介"
description: "透過一次呼叫，將任意 OpenAPI 文件（Swagger 2.0、OpenAPI 3.0、3.1 或 3.2）升級為 OpenAPI 3.2。"
keywords: ["openapi-parser", "powerduck", "Swagger", "OpenAPI 3.2"]
---

# @powerduck/openapi-parser

透過一次呼叫，將任意 OpenAPI 文件（Swagger 2.0、OpenAPI 3.0、3.1 或 3.2）升級為 OpenAPI 3.2。

這是下列兩個程式庫的輕量封裝： [`@scalar/openapi-parser`](https://github.com/scalar/openapi-parser), [`@scalar/openapi-upgrader`](https://github.com/scalar/openapi-parser/tree/main/packages/openapi-upgrader).
它不重新實作剖析、驗證或升級，而是將這些功能組合起來，並為每種失敗提供統一、可預期的錯誤結構與機器可讀的錯誤碼。

- **套件名稱:** `@powerduck/openapi-parser`
- **版本:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-parser"/>
- **授權條款:** MIT
- **Node.js:** >= 22.12.0

## 功能

- **一個函式支援所有版本** — Swagger 2.0、OpenAPI 3.0.x、3.1.x 與 3.2.x 皆可升級為經過驗證的 3.2 文件。
- **JSON 與 YAML 字串輸入** — 可傳入已剖析的物件或原始 JSON/YAML 字串。
- **機器可讀的錯誤碼** — 每次失敗都會拋出 `OpenApiUpgradeError`，其中包含一個 `UpgradeErrorCode` 列舉值。
- **不修改輸入** — 執行任何升級步驟前，先透過 `structuredClone` 深層複製輸入。
- **循環參照保護** — 提前偵測輸入中的循環參照，避免堆疊溢位。
- **輸出驗證** — 預設依照結構描述驗證升級後的 3.2 文件。
- **同時提供 ESM 與 CJS** — 在現代 Node 與打包工具中使用 `import`，在 Electron 主程序中使用 `require()`。

## 後續步驟

- [安裝](/docs/zh-TW/openapi-parser/installation/) — 安裝與環境需求
- [快速入門](/docs/zh-TW/openapi-parser/quickstart/) — 升級第一份文件
- [API 參考](/docs/zh-TW/openapi-parser/api-reference/) — 所有匯出、錯誤碼與選項
- [範例](/docs/zh-TW/openapi-parser/examples/) — 錯誤處理、選項與 CommonJS 用法
