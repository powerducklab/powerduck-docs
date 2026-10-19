---
sidebar_position: 2
title: "安装"
description: "安装 @powerduck/conf-patch，选择用于 Node.js 的文件层入口或浏览器可用的 ./core 子路径。"
---

# 安装

使用常用的包管理器安装 `@powerduck/conf-patch`。

## 环境要求

- **Node.js:** `>= 22.12.0`
- **TypeScript：**可选。包内提供完整类型声明，无须安装 `@types/...`。

## 安装

```bash npm2yarn2pnpm
npm install @powerduck/conf-patch
```

```bash
yarn add @powerduck/conf-patch
```

```bash
pnpm add @powerduck/conf-patch
```

## 运行时依赖

conf-patch 的三个运行时依赖会自动安装：

| 包 | 版本 | 用途 |
|---|---|---|
| `@powerduck/openapi-parser` | `^0.3.12` | OpenAPI/Swagger 规范验证（`validateOpenAPISpec`、`validateOpenAPIFile`）。 |
| `jsonc-parser` | `^3.3.1` | JSON 和 JSONC 的增量文本编辑。 |
| `yaml` | `^2.9.0` | YAML 的 AST 解析和修改。 |

你无须直接操作这些依赖。

## 两个入口

包提供**两个子路径导出**，请按运行环境选择。

### 主入口 — `@powerduck/conf-patch`

包含**文件层**（`readConfigFile`、`writeConfigFile`、`patchConfigFile`、`setConfigValue`、`deleteConfigValue`、`withFileLock`、`releaseAllLocalLocks`）、核心层和 OpenAPI 验证。适用于 Node.js 和 Electron，依赖 `node:fs`、`node:path` 和 `node:crypto`。

### 核心子路径 — `@powerduck/conf-patch/core`

**仅导出浏览器可用的核心层**：`patchContent`、`setContentValue`、`deleteContentValue`、断言辅助工具和核心类型。没有 Node.js 依赖，可用于浏览器、Edge Functions 和 Service Worker。

:::tip
面向浏览器时，请始终从 `@powerduck/conf-patch/core` 导入，避免将文件层及其 `node:fs` 依赖打包进去。
:::

## 模块系统：CJS 和 ESM

包**没有**设置 `"type": "module"`，因此 `.js` 默认按 CommonJS 处理。`package.json` 中的 `exports` 映射将 `import` 和 `require` 条件明确指向对应构建。

| 入口 | CJS (`require`) | ESM (`import`) | 类型 |
|---|---|---|---|
| 主入口 | `dist/index.js` | `dist/index.mjs` | `dist/index.d.ts` |
| 核心子路径 | `dist/core.js` | `dist/core.mjs` | `dist/core.d.ts` |

### CommonJS（Node.js / Electron 主进程）

```javascript
// Full library (includes file IO)
const { setConfigValue, readConfigFile } = require("@powerduck/conf-patch");

// Core layer only (browser-safe, no fs dependency)
const { patchContent, setContentValue } = require("@powerduck/conf-patch/core");
```

### ES Modules（现代 Node.js / 浏览器 / 打包器）

```typescript
// Full library
import { setConfigValue, readConfigFile } from "@powerduck/conf-patch";

// Core layer only (browser-safe)
import { patchContent, setContentValue } from "@powerduck/conf-patch/core";
```

## 验证安装

```bash
# Check the installed version
npm list @powerduck/conf-patch

# Verify the main entry loads
node -e "const lib = require('@powerduck/conf-patch'); console.log('exports:', Object.keys(lib).length);"

# Verify the core subpath loads
node -e "const core = require('@powerduck/conf-patch/core'); console.log('core exports:', Object.keys(core).length);"
```

## 下一步

- [快速开始](/docs/zh-CN/conf-patch/quickstart/) — 在浏览器中修改字符串，在磁盘上修改文件。
- [API 参考](/docs/zh-CN/conf-patch/api-reference/) — 全部导出项、类型和选项。
