---
sidebar_position: 1
title: "開源函式庫"
description: "@powerduck/* npm 套件為桌面用戶端與 Cloud 提供解析升級、多協定 CLI、程式碼產生、MCP、請求執行、格式轉換，以及可嵌入的編輯器與檢視器。"
---

# 開源函式庫

Powerduck 由一組小巧、可組合的 npm 套件建構。桌面用戶端與雲端服務皆使用這些函式庫，因此相同的基礎能力可在本機執行、透過網路提供服務，或整合到自己的工具中。

每個套件獨立發行，提供各自的安裝說明、API 參考與範例。本頁介紹它們的用途與組合方式。

## 分層方式

```text
Powerduck / Cloud
        ↓
可嵌入介面
        ↓
工作流程
        ↓
基礎能力
```

解析器與轉換器構成基礎層，上層工作流程以此建構，可嵌入介面則位於最上層。共用基礎能力，而非在每個套件重新實作解析邏輯，可確保行為一致。

## 套件清單

### 基礎能力

| 套件 | 用途 |
|---|---|
| [`@powerduck/openapi-parser`](../openapi-parser/introduction.md) | 解析、驗證與升級 OpenAPI/Swagger 文件 |
| [`@powerduck/conf-patch`](../conf-patch/introduction.md) | 套用結構化且經過驗證的設定修補 |
| [`@powerduck/x-to-openapi`](../x-to-openapi/introduction.md) | 將 cURL、Postman 等格式轉換為 OpenAPI |

### 工作流程

| 套件 | 用途 |
|---|---|
| [`@powerduck/openapi-cli`](../openapi-cli/introduction.md) | 多協定命令列工作流程，包含情境執行 |
| [`@powerduck/openapi-codegen`](../openapi-codegen/introduction.md) | 從規格產生用戶端程式碼及其他產出 |
| [`@powerduck/openapi-mcp-server`](../openapi-mcp-server/introduction.md) | 將 OpenAPI 規格作為 MCP 服務提供 |
| [`@powerduck/openapi-request`](../openapi-request/introduction.md) | 執行規格描述的請求 |

### 可嵌入介面

| 套件 | 用途 |
|---|---|
| [`@powerduck/oas-document`](../oas-document/introduction.md) | 將 OpenAPI 呈現為易讀文件，並提供 React 入口 |
| [`@powerduck/md-editor`](../md-editor/introduction.md) | 可嵌入的 Markdown 編輯器 |
| [`@powerduck/schema-editor`](../schema-editor/introduction.md) | 可嵌入的 JSON Schema 編輯器 |
| [`@powerduck/tree`](../tree/introduction.md) | 結構化資料的樹狀元件 |
| [`@powerduck/workspace-yaml`](../workspace-yaml/introduction.md) | 工作區 YAML 整合 |

## 選擇合適的套件

- **讀取、驗證或升級 OpenAPI 檔案：**從 `openapi-parser` 開始。
- **將 cURL 或 Postman 集合轉為 OpenAPI：**使用 `x-to-openapi`。
- **從命令列或 CI 執行情境與多協定工作流程：**使用 `openapi-cli`。
- **產生用戶端程式碼：**使用 `openapi-codegen`。
- **將 API 作為工具提供給 AI 代理：**使用 `openapi-mcp-server`。
- **在 React 應用程式中嵌入文件：**使用 `oas-document` 的 React 入口及對應 CSS。
- **嵌入編輯器：**使用 `md-editor` 或 `schema-editor`。

## 向代理提供能力

MCP 服務套件也讓外部 AI 代理能使用 Powerduck 的能力。透過 `openapi-mcp-server` 提供的規格會將操作公開為 MCP 工具，因此用於文件與程式碼產生的同一份契約，也能由代理直接呼叫。桌面用戶端、Cloud 與其他相容 MCP 的工具便能共用一致的權威定義。

## 關於範例

這些頁面的程式碼範例依套件的實際 API 撰寫，目標是可依範例直接執行。套件升級後，請查閱版本說明確認目前參數，避免直接套用舊版片段。

從側邊欄進入各套件文件，可查看安裝、設定與完整 API 參考。
