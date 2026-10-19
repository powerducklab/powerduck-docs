---
sidebar_position: 2
title: "安装"
description: "全局安装 @powerduck/openapi-cli、将其添加为开发依赖，或通过 npx 运行。需要 Node.js 22.12.0 及以上版本。"
---

# 安装

## 环境要求

- **Node.js**：`>= 22.12.0`（在包的 `engines` 字段中声明）。
- 包管理器：npm、yarn 或 pnpm。

包同时提供 ESM（`dist/index.js`）和 CommonJS（`dist/index.cjs`）构建，以及 TypeScript 类型声明（`dist/index.d.ts`），无需额外安装 `@types` 包。

## 全局安装（推荐用于命令行）

全局安装后，可通过 `PATH` 找到 `openapi-cli` 可执行文件：

```bash npm2yarn2pnpm
npm install -g @powerduck/openapi-cli
```

验证命令是否可用：

```bash
openapi-cli --help
```

## 项目内安装（推荐用于 CI）

在项目中固定版本，确保 CI 使用已知版本：

```bash npm2yarn2pnpm
npm install --save-dev @powerduck/openapi-cli
```

然后通过包管理器执行命令：

```bash
npx openapi-cli --spec openapi.json
# or
pnpm exec openapi-cli --spec openapi.json
```

## 使用 npx 临时运行

无需预先安装：

```bash
npx @powerduck/openapi-cli --spec openapi.json
```

## 包结构

| 入口 | 路径 |
|-------|------|
| ESM 入口 | `dist/index.js` |
| CommonJS 入口 | `dist/index.cjs` |
| 类型定义 | `dist/index.d.ts` |
| CLI 入口（bin） | `dist/cli.js` |
| 可执行文件名 | `openapi-cli` |

包声明了 `"type": "module"`，且仅导出 `.` 和 `./package.json` 两个子路径。

## 在代码中导入

```typescript
// ESM
import { runTests, resolveConfig } from "@powerduck/openapi-cli";

// CommonJS
const { runTests, resolveConfig } = require("@powerduck/openapi-cli");
```

## 运行时依赖

发布的包依赖以下库：

- `@powerduck/openapi-parser` (`^0.3.12`) — 解析内部 `$ref` 引用。
- `@powerduck/openapi-request` (`0.2.22`) — 执行各协议的请求。
- `commander` (`^12.1.0`) — 解析命令行参数。
- `https-proxy-agent` (`^5.0.1`) — 为 HTTP 传输提供代理支持。

## 后续步骤

- [快速入门](/docs/zh-CN/openapi-cli/quickstart/) — 运行第一组测试。
- [命令参考](/docs/zh-CN/openapi-cli/commands/) — 查看完整的命令行选项。
