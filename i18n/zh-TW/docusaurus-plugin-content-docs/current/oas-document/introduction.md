---
sidebar_position: 1
title: "簡介"
description: "適用於正式環境的 React OpenAPI 文件元件。傳入 OAS 文件，即可取得完整的 Stripe 風格 API 文件介面，支援頁首導覽、淺色與深色佈景主題、樹狀導覽、捲動位置追蹤、結構描述瀏覽及多語言程式碼範例。"
keywords: ["oas-document", "powerduck", "React", "OpenAPI"]
---

# @powerduck/oas-document

適用於正式環境的 React OpenAPI 文件元件。傳入 OAS 文件，即可取得完整的 Stripe 風格 API 文件介面，支援頁首導覽、淺色與深色佈景主題、樹狀導覽、捲動位置追蹤、結構描述瀏覽及多語言程式碼範例。

- **套件名稱:** `@powerduck/oas-document`
- **版本:** <img src="https://img.shields.io/npm/v/@powerduck/oas-document"/>
- **授權條款:** MIT

建構基礎: `@powerduck/openapi-parser` (驗證與自動升級), `@powerduck/tree` (導覽), `@powerduck/md-editor` (Markdown 渲染), `@powerduck/openapi-codegen` (請求程式碼產生).

## 功能

- **即用型 API 文件** — 接受已剖析物件、JSON 字串或 YAML 字串
- **Stripe 風格版面** — 可設定頁首、側邊欄樹與雙欄操作檢視
- **淺色與深色佈景主題** — 在頁首切換，選擇儲存於 localStorage
- **自動升級至 OAS 3.2** — 透過 `@powerduck/openapi-parser` 驗證與升級
- **捲動追蹤導覽** — 使用被動捲動監聽器與二分搜尋
- **Markdown 渲染** — 描述透過 `@powerduck/md-editor` 渲染
- **多語言程式碼範例** — 透過 `@powerduck/openapi-codegen` 產生
- **結構描述瀏覽** — 支援展開與摺疊的巢狀屬性表
- **響應式版面** — 行動裝置上的側邊欄會收合為覆蓋層

## 後續步驟

- [安裝](/docs/zh-TW/oas-document/installation/)
- [快速入門](/docs/zh-TW/oas-document/quickstart/)
- [API 參考](/docs/zh-TW/oas-document/api-reference/)
- [範例](/docs/zh-TW/oas-document/examples/)
