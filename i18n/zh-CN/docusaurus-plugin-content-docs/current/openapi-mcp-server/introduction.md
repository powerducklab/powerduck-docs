---
sidebar_position: 1
title: "简介"
description: "将 OpenAPI 转为 MCP 服务：生成工具、提示词和资源，提供 Web 管理界面、stdio、HTTP 和 openapi-mcp CLI。"
keywords: ["openapi-mcp-server", "MCP", "OpenAPI", "stdio", "HTTP"]
---

# @powerduck/openapi-mcp-server — 简介

`@powerduck/openapi-mcp-server` 将 OpenAPI 文档转换为可运行的 MCP（Model Context Protocol）服务。它从操作生成**工具**，从 API 元数据和操作生成**提示词**，从 API 目录生成**资源**，通过 MCP 协议对外提供，并内置 Web 管理界面。

- **包名:** `@powerduck/openapi-mcp-server`
- **版本:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-mcp-server"/>
- **许可证:** MIT
- **Node 版本要求:** `>=22.12.0`
- **CLI 命令:** `openapi-mcp`
- **模块格式:** 同时提供 ESM 和 CommonJS 构建，并附带类型声明。

基于 `@powerduck/openapi-parser` 进行校验和引用解析，基于 `@modelcontextprotocol/sdk` 实现协议。

## 生成内容

- **Tools** — 每个 OpenAPI 操作对应一个 MCP 工具，支持完整的参数序列化（path/query/header/cookie 样式及 explode 规则）、请求体编码（JSON、form-urlencoded、multipart、文本和二进制）以及 MCP 工具注解（`readOnlyHint`、`destructiveHint`、`idempotentHint`）。
- **Prompts** — 全局提示词（`spec_overview`、`integration_guardrails`）以及各操作的提示词（`explain_*`、`plan_*`、`sample_*`）。
- **Resources** — 固定的目录资源，例如 `openapi://spec/summary`、`openapi://catalog/tools`、`openapi://spec/document`。

## 传输方式

- **stdio** — `startStdioServer()` 将一份文档提供给本地 MCP 客户端，例如 Claude Desktop 或编辑器集成。
- **HTTP** — `attachMcpRoutes(app, options)` 在 Express 应用的 `/mcp` 挂载 Streamable HTTP，并可选地在 `/sse` 挂载旧版 SSE。选项可控制会话上限、空闲超时、CORS 和 DNS 重绑定防护。`startAdminServer()` 增加管理界面，并使用传输层的默认会话上限。`attachSseRoutes()` 仍保留为已弃用的位置参数包装函数。

## 管理服务

`startAdminServer()` 启动一个 Express 应用，提供：

- Web 管理控制台：上传或粘贴规范，检查工具、提示词和资源，查看运行中的服务及请求日志；
- MCP HTTP 传输；
- API 密钥认证、对敏感请求头进行脱敏的请求日志，以及可选的状态持久化。

## 安装

```bash npm2yarn2pnpm
npm install @powerduck/openapi-mcp-server
```

## 快速开始

```bash
openapi-mcp serve --transport web --port 3000 --api-key your-admin-key
```

## 后续阅读

- [安装](../installation/) — npm/yarn/pnpm、全局安装、`./server` 子路径和依赖。
- [快速开始](../quickstart/) — CLI 和编程调用方式。
- [配置](../configuration/) — 完整的 `ServerConfig` 配置。
- [API 参考](../api-reference/) — 全部导出接口与 CLI 命令。
- [示例](../examples/) — 常见用法。

## 许可证

MIT.
