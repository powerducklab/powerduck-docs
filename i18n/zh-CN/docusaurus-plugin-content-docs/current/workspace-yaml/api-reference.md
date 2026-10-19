---
sidebar_position: 4
title: "API 参考"
description: "核心层与文件层的函数、选项和错误码。"
---

# API 参考

## 核心层 (`@powerduck/workspace-yaml/core`)

| 函数 | 说明 |
|----------|-------------|
| `createWorkspaceYaml(options?)` | 生成 workspace.yaml 内容字符串 |
| `createOpenApiYaml(options)` | 生成 OpenAPI 3.2 YAML 内容字符串 |
| `createWorkspaceWithApi(options)` | 同时生成工作区和 OpenAPI 内容 |
| `parseWorkspaceYaml(content)` | 解析并验证 workspace.yaml 字符串 |

### `createOpenApiYaml(options)` — 选项

| 选项 | 类型 | 必填 | 说明 |
|--------|------|----------|-------------|
| `title` | `string` | 是 | API 标题 |
| `version` | `string` | 否 | 默认值 `"1.0.0"` |
| `description` | `string` | 否 | API 描述 |
| `contact` | `{ name?, url?, email? }` | 否 | 联系信息 |
| `license` | `{ name, url? }` | 否 | 许可证信息 |
| `servers` | `Array<{ url, description? }>` | 否 | 服务器列表 |

## 文件层 (`@powerduck/workspace-yaml`)

| 函数 | 说明 |
|----------|-------------|
| `initializeWorkspace(options)` | 在磁盘上创建 workspace.yaml 文件 |
| `initializeOpenApi(options)` | 在磁盘上创建 OpenAPI YAML 文件 |
| `createWorkspaceApi(options)` | 原子性地创建两个文件（失败时回滚） |

### `createWorkspaceApi(options)` — 选项

| 选项 | 类型 | 必填 | 说明 |
|--------|------|----------|-------------|
| `workspaceDirectory` | `string` | 是 | 目标目录 |
| `oasId` | `string` | 是 | 唯一 API 标识符 |
| `name` | `string` | 是 | 显示名称 |
| `file` | `string` | 否 | 相对路径（默认值：`oasFiles/${oasId}.openapi.yaml`） |
| `title` | `string` | 否 | API 标题（默认为 `name`） |
| `version` | `string` | 否 | API 版本（默认值：`"1.0.0"`） |
| `overwriteOpenApi` | `boolean` | 否 | 默认值 `false` |

## 错误

所有错误都是 `WorkspaceYamlError` 实例，并带有机器可读的 `code`：

| 错误码 | 说明 |
|------|-------------|
| `INVALID_ARGUMENT` | 无效的输入参数 |
| `ALREADY_EXISTS` | 文件已存在（且覆盖选项为 false） |
| `NOT_FOUND` | 找不到文件 |
| `IO_ERROR` | 文件系统操作失败 |
| `INVALID_WORKSPACE` | 无效的工作区配置 |
| `INVALID_OPENAPI` | 无效的 OpenAPI 文档 |
| `ROLLBACK_FAILED` | 事务回滚失败 |
