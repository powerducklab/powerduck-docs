---
sidebar_position: 1
title: "簡介"
description: "可擴充的樹狀元件，用於 API 導覽、結構描述瀏覽與文件。以通用核心為基礎，並提供 OpenAPI、JSON Schema 與自訂資料來源配接器。"
keywords: ["tree", "powerduck", "React", "OpenAPI", "JSON Schema"]
---

# @powerduck/tree

可擴充的樹狀元件，用於 API 導覽、結構描述瀏覽與文件。以通用核心為基礎，並提供 OpenAPI、JSON Schema 與自訂資料來源配接器。

- **套件名稱:** `@powerduck/tree`
- **版本:** <img src="https://img.shields.io/npm/v/@powerduck/tree"/>
- **授權條款:** MIT

## 功能

- **通用核心** — `TreeNode<TMetadata>` 適用於任意資料來源
- **OpenAPI 配接器** — 以標籤為基礎的導覽，支援 OAS 3.2 巢狀標籤、`x-tagGroups`、`x-order`、`x-displayName` 與 `x-internal`
- **JSON Schema 配接器** — 深入展開巢狀屬性、陣列與組合結構描述，並提供 `jsonPath` 中繼資料
- **文件配接器** — Stripe 風格的文件樹，附操作數量徽章
- **React 元件** — 搜尋、展開與摺疊、鍵盤導覽、方法徽章及自訂渲染屬性
- **拖放** — 在相同父節點下重新排序，或跨層級移入資料夾
- **快顯功能表** — 透過右鍵或更多按鈕執行節點操作
- **命令式定位** — `locateNode(predicate)` 尋找節點、展開祖先節點、選取該節點並捲動至可視區域
- **JSON Patch 整合** — `onPatch` 回呼發出 RFC 6902 操作
- **CSS 變數佈景主題** — 相容於 Powerduck `tokens.css`，支援淺色與深色模式

## 後續步驟

- [安裝](/docs/zh-TW/tree/installation/)
- [快速入門](/docs/zh-TW/tree/quickstart/)
- [API 參考](/docs/zh-TW/tree/api-reference/)
- [範例](/docs/zh-TW/tree/examples/)
