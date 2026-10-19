---
sidebar_position: 1
title: "簡介"
description: "可靠地初始化 workspace.yaml 與 OpenAPI 3.2 YAML 檔案。 可在瀏覽器中安全執行：透過純函式產生 YAML 內容字串，不存取檔案系統。 在 Node.js / Electron 中為核心層提供不可分割寫入、檔案鎖定與路徑正規化。"
keywords: ["workspace-yaml", "powerduck", "YAML", "OpenAPI"]
---

# @powerduck/workspace-yaml

可靠地初始化 workspace.yaml 與 OpenAPI 3.2 YAML 檔案。

雙層架構：
- **核心層**: 可在瀏覽器中安全執行：透過純函式產生 YAML 內容字串，不存取檔案系統。
- **檔案層**: 在 Node.js / Electron 中為核心層提供不可分割寫入、檔案鎖定與路徑正規化。

- **套件名稱:** `@powerduck/workspace-yaml`
- **版本:** <img src="https://img.shields.io/npm/v/@powerduck/workspace-yaml"/>
- **授權條款:** MIT

此程式庫**僅初始化檔案**，適用於「新增檔案」或「手動建立」情境。它**不會**重複實作 YAML 檔案的讀取、修補或更新功能。這些操作請使用 [`@powerduck/conf-patch`](https://www.npmjs.com/package/@powerduck/conf-patch).

## 後續步驟

- [安裝](/docs/zh-TW/workspace-yaml/installation/)
- [快速入門](/docs/zh-TW/workspace-yaml/quickstart/)
- [API 參考](/docs/zh-TW/workspace-yaml/api-reference/)
- [範例](/docs/zh-TW/workspace-yaml/examples/)
