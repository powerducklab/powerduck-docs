---
sidebar_position: 2
title: "安装"
description: "使用 npm、yarn 或 pnpm 安装 @powerduck/x-to-openapi。支持 ESM 和 CommonJS，提供零配置的 curlToOpenApi 与 postmanToOpenApi 转换函数。"
---

# 安装

使用你习惯的包管理器安装 `@powerduck/x-to-openapi`。

## 环境要求

- **Node.js:** `>= 22.12.0`
- **TypeScript：**可选；包中包含完整的类型定义。

## 安装

```bash npm2yarn2pnpm
npm install @powerduck/x-to-openapi
```

```bash
yarn add @powerduck/x-to-openapi
```

```bash
pnpm add @powerduck/x-to-openapi
```

## 运行时依赖

| 包 | 版本 | 用途 |
|---|---|---|
| `@powerduck/openapi-parser` | `^0.3.12` | 规范的 OpenAPI 类型与输出验证 |
| `curlconverter` | `^4.12.0` | 将 curl 命令解析为结构化请求 |

这两个依赖会自动安装。

---

## 模块系统：优先 ESM，同时支持 CJS

包声明了 `"type": "module"`，通过同一个入口提供两种构建：

| 构建 | 条件 | 文件 |
|---|---|---|
| ESM | `import` | `./dist/index.js` |
| CommonJS | `require` | `./dist/index.cjs` |
| 类型 | — | `./dist/index.d.ts` |

```typescript
// ESM (Node.js, bundlers)
import { curlToOpenApi, postmanToOpenApi } from "@powerduck/x-to-openapi";
```

```javascript
// CommonJS (require)
const { curlToOpenApi, postmanToOpenApi } = require("@powerduck/x-to-openapi");
```

包声明了 `"sideEffects": false`，tree shaking 可移除未使用的适配器。

---

## 零配置辅助函数

多数用户只需两个函数。它们会创建 [`XToOpenApi`](/docs/zh-CN/x-to-openapi/api-reference/#xtoopenapi) 实例，注册对应适配器，然后调用 `convert`：

```typescript
import {
  curlToOpenApi,    // string | string[]  → OpenAPI 3.2
  postmanToOpenApi, // collection object | JSON string → OpenAPI 3.2
} from "@powerduck/x-to-openapi";
```

需要自定义选项、多个适配器、`"auto"` 检测或自定义适配器时，请使用完整的 [`XToOpenApi`](/docs/zh-CN/x-to-openapi/api-reference/#xtoopenapi) 类。

---

## 验证安装

```bash
# Check the installed version
npm list @powerduck/x-to-openapi

# Verify the package loads and the helpers exist
node -e "const x = require('@powerduck/x-to-openapi'); console.log(typeof x.curlToOpenApi, typeof x.postmanToOpenApi, typeof x.XToOpenApi);"
```

---

## 后续步骤

- [快速入门](/docs/zh-CN/x-to-openapi/quickstart/) — 转换 curl 命令、Postman 集合，并注册自定义适配器。
- [API 参考](/docs/zh-CN/x-to-openapi/api-reference/) — 查看全部导出项和选项。
