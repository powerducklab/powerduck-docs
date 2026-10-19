---
sidebar_position: 4
title: "API 參考"
description: "SchemaEditor 屬性、核心匯出與編輯器語言型別。"
---

# API 參考

## `<SchemaEditor />` — 屬性

| 屬性 | 型別 | 預設值 | 說明 |
|------|------|---------|-------------|
| `value` | `string` | 必填 | 編輯器內容 |
| `onChange` | `(value: string) => void` | — | 內容變更時呼叫 |
| `language` | `"json" \| "yaml" \| "javascript"` | 必填 | 內容語言 |
| `schema` | `JsonSchema` | — | 用於補全與診斷的 JSON Schema（json/yaml） |
| `snippets` | `string[]` | — | 用於 JavaScript 行內預覽補全的程式碼片段字串 |
| `theme` | `"light" \| "dark"` | `"light"` | 介面佈景主題 |
| `readOnly` | `boolean` | `false` | 禁止編輯 |
| `placeholder` | `string` | — | 內容為空時的預留位置文字 |
| `showDiagnostics` | `boolean` | `true` | 顯示診斷狀態列 |
| `enableInlineSuggestions` | `boolean` | `true` | 啟用行內預覽建議 |
| `enableCompletion` | `boolean` | `true` | 啟用快顯補全 |
| `diagnosticsDebounceMs` | `number` | `250` | 診斷防彈跳延遲 |

## 核心匯出 (`@powerduck/schema-editor`)

| 函式 | 說明 |
|----------|-------------|
| `resolveSchemas(document)` | 解析結構描述文件中的 `$ref` 指標 |
| `validateSchema(data, schema)` | 根據結構描述驗證資料 |
| `generateSample(schema)` | 根據 JSON Schema 產生範例資料 |
| `getCompletionItems(model, position)` | 取得游標位置的補全項目 |

## 型別

```typescript
import type { SchemaEditorProps } from "@powerduck/schema-editor/react";
```
