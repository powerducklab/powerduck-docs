---
sidebar_position: 2
title: "安装"
description: "使用 npm、yarn 或 pnpm 安装 @powerduck/openapi-codegen，在 Node.js 或浏览器中生成请求代码。需要 Node.js 22.12.0 及以上版本。"
---

# 安装

## 环境要求

- 在 Node.js 中使用时，需要 **Node.js** `>= 22.12.0`（包的 `engines` 字段中已声明）。
- **已解析**为 JavaScript 对象的 OpenAPI 文档，而不是原始 JSON/YAML 字符串。
- 在浏览器中使用时，需要支持 Fetch API 的现代浏览器。

包提供 ESM（`dist/index.js`）和 CommonJS（`dist/index.cjs`）构建，包含 TypeScript 声明，且**没有运行时依赖**。

## npm

```bash npm2yarn2pnpm
npm install @powerduck/openapi-codegen
```

## pnpm

```bash npm2yarn2pnpm
pnpm add @powerduck/openapi-codegen
```

## Yarn

```bash npm2yarn2pnpm
yarn add @powerduck/openapi-codegen
```

## 在 Node.js 中使用

```typescript
import { generate } from "@powerduck/openapi-codegen";
```

CommonJS:

```javascript
const { generate } = require("@powerduck/openapi-codegen");
```

内置生成器会**在导入模块时自动注册**，因此 `generate` 可以直接使用，无需额外设置。

## 在浏览器中使用

库完全兼容浏览器，不依赖 Node.js 内置模块。可以从 ESM CDN 加载并直接调用：

```html
<script type="module">
  import { generate, list } from "https://esm.sh/@powerduck/openapi-codegen";

  const document = {
    openapi: "3.1.0",
    info: { title: "Example API", version: "1.0.0" },
    servers: [{ url: "https://api.example.com" }],
    paths: {
      "/hello": { get: { responses: { "200": { description: "OK" } } } },
    },
  };

  const code = generate({
    document,
    path: "/hello",
    method: "get",
    language: "javascript",
    client: "fetch",
  });

  console.log(code);
</script>
```

也可直接使用 Vite、esbuild 或 webpack 打包；ESM 构建支持 tree shaking，可去除未使用的代码。

## 传入文档

请传入已解析的对象。JSON 示例：

```typescript
import { readFile } from "node:fs/promises";

const document = JSON.parse(await readFile("./openapi.json", "utf8"));
```

对于 YAML，请先使用独立的 YAML 包解析：

```typescript
import YAML from "yaml";
const document = YAML.parse(await readFile("./openapi.yaml", "utf8"));
```

## 包结构

| 入口 | 路径 |
|-------|------|
| ESM 入口 | `dist/index.js` |
| CommonJS 入口 | `dist/index.cjs` |
| 类型定义 | `dist/index.d.ts` |

本库不提供 CLI 可执行文件，仅供代码调用。

## 后续步骤

- [快速入门](/docs/zh-CN/openapi-codegen/quickstart/) — 生成第一个代码片段。
- [配置](/docs/zh-CN/openapi-codegen/configuration/) — 查看所有生成选项。
