---
sidebar_position: 2
title: "安装"
description: "通过 npm、yarn、pnpm 或全局方式安装 @powerduck/openapi-mcp-server，了解 openapi-mcp 命令行、./server 子路径及运行时依赖。需要 Node.js 22.12.0 及以上版本。"
---

# 安装

## 环境要求

- **Node.js `>=22.12.0`**（在 `engines` 中声明）。

## 安装

```bash npm2yarn2pnpm
npm install @powerduck/openapi-mcp-server
```

Yarn:

```bash
yarn add @powerduck/openapi-mcp-server
```

pnpm:

```bash
pnpm add @powerduck/openapi-mcp-server
```

## CLI

包注册了 `openapi-mcp` 可执行文件。

```bash
# global install
npm install -g @powerduck/openapi-mcp-server

# or run without installing
npx --package @powerduck/openapi-mcp-server openapi-mcp --help
```

CLI 仅提供 `serve` 命令（参见[快速入门](/docs/zh-CN/openapi-mcp-server/quickstart/)）。

## ESM / CommonJS

同时提供两种模块构建和类型声明，无需额外安装 `@types/*`：

```javascript
// ESM
import { buildMcpServer, startStdioServer } from "@powerduck/openapi-mcp-server";

// CommonJS
const { buildMcpServer, startStdioServer } = require("@powerduck/openapi-mcp-server");
```

## 子路径导出

| 导入路径 | 内容 |
| --- | --- |
| `@powerduck/openapi-mcp-server` | 核心库：加载规范、生成工具/提示词/资源、执行请求、构建 MCP 服务器，以及 stdio 和 HTTP 传输。 |
| `@powerduck/openapi-mcp-server/server` | 管理 HTTP 服务器与认证中间件（`startAdminServer`、`createAuthMiddleware`）。 |

## 运行时依赖

以下依赖会随包自动安装：

- `@modelcontextprotocol/sdk` — MCP 协议实现。
- `@powerduck/openapi-parser` — OpenAPI 验证、引用解析和升级。
- `express` 和 `cors` — 管理 HTTP 服务器与 CORS。
- `axios` — 执行工具时访问上游服务的 HTTP 客户端。
- `commander` — 命令行框架。
- `js-yaml` — YAML 解析。
- `multer` — 处理规范上传。
- `terser` — 压缩内嵌 Web 界面的资源。

## 验证安装

```bash
npx --package @powerduck/openapi-mcp-server openapi-mcp --help
```

## 后续步骤

- [快速入门](/docs/zh-CN/openapi-mcp-server/quickstart/)
- [配置](/docs/zh-CN/openapi-mcp-server/configuration/)
