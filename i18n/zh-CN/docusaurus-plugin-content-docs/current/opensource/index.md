---
sidebar_position: 1
title: "开源库"
description: "@powerduck/* npm 包为桌面客户端和 Cloud 提供解析升级、多协议 CLI、代码生成、MCP、请求执行、格式转换及可嵌入的编辑器和查看器。"
---

# 开源库

Powerduck 由一组小巧、可组合的 npm 包构建。桌面客户端和云服务都基于这些库，因此同一套基础能力既可在本地运行，也可通过网络提供服务，或集成到你自己的工具中。

每个包独立发布，拥有各自的安装说明、API 参考和示例。本页介绍它们的职责及组合方式。

## 分层方式

```text
Powerduck / Cloud
        ↓
可嵌入界面
        ↓
工作流
        ↓
基础能力
```

解析器和转换器构成基础层，上层工作流基于它们构建，可嵌入的界面位于最上层。复用共同的基础能力，而不是在每个包中重新实现解析逻辑，能够保持行为一致。

## 包列表

### 基础能力

| 包 | 用途 |
|---|---|
| [`@powerduck/openapi-parser`](../openapi-parser/introduction.md) | 解析、校验和升级 OpenAPI/Swagger 文档 |
| [`@powerduck/conf-patch`](../conf-patch/introduction.md) | 应用结构化、经过校验的配置补丁 |
| [`@powerduck/x-to-openapi`](../x-to-openapi/introduction.md) | 将 cURL、Postman 等格式转换为 OpenAPI |

### 工作流

| 包 | 用途 |
|---|---|
| [`@powerduck/openapi-cli`](../openapi-cli/introduction.md) | 多协议命令行工作流，包括场景运行 |
| [`@powerduck/openapi-codegen`](../openapi-codegen/introduction.md) | 从规范生成客户端代码及其他产物 |
| [`@powerduck/openapi-mcp-server`](../openapi-mcp-server/introduction.md) | 将 OpenAPI 规范作为 MCP 服务提供 |
| [`@powerduck/openapi-request`](../openapi-request/introduction.md) | 执行规范描述的请求 |

### 可嵌入界面

| 包 | 用途 |
|---|---|
| [`@powerduck/oas-document`](../oas-document/introduction.md) | 将 OpenAPI 渲染为易读的文档，并提供 React 入口 |
| [`@powerduck/md-editor`](../md-editor/introduction.md) | 可嵌入的 Markdown 编辑器 |
| [`@powerduck/schema-editor`](../schema-editor/introduction.md) | 可嵌入的 JSON Schema 编辑器 |
| [`@powerduck/tree`](../tree/introduction.md) | 用于结构化数据的树形组件 |
| [`@powerduck/workspace-yaml`](../workspace-yaml/introduction.md) | 工作区 YAML 集成 |

## 选择合适的包

- **读取、校验或升级 OpenAPI 文件：**从 `openapi-parser` 开始。
- **将 cURL 或 Postman 集合转为 OpenAPI：**使用 `x-to-openapi`。
- **通过命令行或 CI 运行场景、多协议工作流：**使用 `openapi-cli`。
- **生成客户端代码：**使用 `openapi-codegen`。
- **将 API 作为工具提供给 AI 代理：**使用 `openapi-mcp-server`。
- **在 React 应用中嵌入渲染后的文档：**使用 `oas-document` 的 React 入口及对应 CSS。
- **嵌入编辑器：**使用 `md-editor` 或 `schema-editor`。

## 向代理提供能力

MCP 服务包也让外部 AI 代理能够使用 Powerduck 的能力。通过 `openapi-mcp-server` 提供的规范会将操作暴露为 MCP 工具，因此驱动文档和代码生成的同一份契约，也能由代理直接调用。这让桌面客户端、Cloud 和其他兼容 MCP 的工具始终使用一致的权威定义。

## 关于示例

这些页面的代码示例依据包的真实 API 编写，目标是按示例即可运行。升级包后，应查阅发行说明确认当前参数，而不是直接沿用旧版本片段。

从侧边栏进入各包文档，可查看安装、配置和完整的 API 参考。
