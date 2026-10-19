---
sidebar_position: 4
title: "API 參考"
description: "核心層與檔案層的函式、選項與錯誤碼。"
---

# API 參考

## 核心層 (`@powerduck/workspace-yaml/core`)

| 函式 | 說明 |
|----------|-------------|
| `createWorkspaceYaml(options?)` | 產生 workspace.yaml 內容字串 |
| `createOpenApiYaml(options)` | 產生 OpenAPI 3.2 YAML 內容字串 |
| `createWorkspaceWithApi(options)` | 同時產生工作區與 OpenAPI 內容 |
| `parseWorkspaceYaml(content)` | 剖析並驗證 workspace.yaml 字串 |

### `createOpenApiYaml(options)` — 選項

| 選項 | 型別 | 必填 | 說明 |
|--------|------|----------|-------------|
| `title` | `string` | 是 | API 標題 |
| `version` | `string` | 否 | 預設值 `"1.0.0"` |
| `description` | `string` | 否 | API 描述 |
| `contact` | `{ name?, url?, email? }` | 否 | 聯絡資訊 |
| `license` | `{ name, url? }` | 否 | 授權資訊 |
| `servers` | `Array<{ url, description? }>` | 否 | 伺服器清單 |

## 檔案層 (`@powerduck/workspace-yaml`)

| 函式 | 說明 |
|----------|-------------|
| `initializeWorkspace(options)` | 在磁碟上建立 workspace.yaml 檔案 |
| `initializeOpenApi(options)` | 在磁碟上建立 OpenAPI YAML 檔案 |
| `createWorkspaceApi(options)` | 以不可分割操作建立兩個檔案（失敗時回復） |

### `createWorkspaceApi(options)` — 選項

| 選項 | 型別 | 必填 | 說明 |
|--------|------|----------|-------------|
| `workspaceDirectory` | `string` | 是 | 目標目錄 |
| `oasId` | `string` | 是 | 唯一 API 識別碼 |
| `name` | `string` | 是 | 顯示名稱 |
| `file` | `string` | 否 | 相對路徑（預設值：`oasFiles/${oasId}.openapi.yaml`） |
| `title` | `string` | 否 | API 標題（預設為 `name`） |
| `version` | `string` | 否 | API 版本（預設值：`"1.0.0"`） |
| `overwriteOpenApi` | `boolean` | 否 | 預設值 `false` |

## 錯誤

所有錯誤都是 `WorkspaceYamlError` 執行個體，並帶有機器可讀的 `code`：

| 錯誤碼 | 說明 |
|------|-------------|
| `INVALID_ARGUMENT` | 無效的輸入參數 |
| `ALREADY_EXISTS` | 檔案已存在（且覆寫選項為 false） |
| `NOT_FOUND` | 找不到檔案 |
| `IO_ERROR` | 檔案系統操作失敗 |
| `INVALID_WORKSPACE` | 無效的工作區設定 |
| `INVALID_OPENAPI` | 無效的 OpenAPI 文件 |
| `ROLLBACK_FAILED` | 交易回復失敗 |
