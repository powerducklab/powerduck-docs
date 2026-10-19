---
sidebar_position: 1
title: "简介"
description: "使用 @powerduck/openapi-codegen 从 OpenAPI 生成可运行的 HTTP 请求示例：21 种语言、41 种客户端组合，兼容浏览器且无运行时依赖。"
---

# 简介

`@powerduck/openapi-codegen` 是一个 TypeScript 库，可将 OpenAPI 操作转换为指定语言和 HTTP 客户端的 **可运行 HTTP 请求示例代码**。适用于 API 文档网站、开发者门户、API 浏览器、CLI 工具和构建时的代码生成。

支持 **21 种语言**和 **41 种语言/客户端组合**，**兼容浏览器**，且 **没有运行时依赖**。

## 为什么选择 openapi-codegen

- **无运行时依赖** — 无需 Node 内置模块，即可在浏览器、Node.js、Electron 和边缘运行时使用。
- **双模块支持** — 提供原生 ESM 与 CommonJS（`require()`）构建。
- **OpenAPI 3.0 / 3.1 / 3.2** — 处理已解析的文档对象。JSON 和 YAML 均可使用，只需在调用 `generate()` 前解析。
- **41 个内置生成器** — 覆盖 21 种语言，导入时自动注册。
- **完整参数序列化** — 路径、查询、请求头和 Cookie 参数均遵循 OpenAPI 的 `style` / `explode` / `allowReserved` 规则。
- **安全方案** — 支持 API key（header/query/cookie）、HTTP bearer 和 HTTP basic。
- **请求体类型** — JSON、纯文本、URL 编码表单与 `multipart/form-data`。
- **`$ref` 解析** — 支持文档内的 JSON Pointer 引用、缓存、链式解析与循环引用检测。
- **自动示例** — 从 JSON Schema 的 `example`、`enum`、`default`、类型、格式及约束推断示例值。
- **插件系统** — 通过 `register()` 或 `use()` 注册自定义生成器。

## 工作原理

```
OpenAPI document  ──normalize──▶  RequestIR  ──generator.generate()──▶  source code string
```

1. `normalize` 解析 `$ref`，合并路径级与操作级参数，选择请求体媒体类型，生成示例值，解析安全方案，并产出规范化的 `RequestIR`。
2. 选定的 `Generator` 接收 `RequestIR`，返回可运行的源代码字符串。

通常只需调用统一入口 `generate({...})`，即可完成这两个步骤。

## 基本示例

```typescript
import { generate } from "@powerduck/openapi-codegen";

const code = generate({
  document,                 // parsed OpenAPI object
  path: "/users/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
});

console.log(code);          // a runnable fetch() snippet
```

## 下一步

- [安装](/docs/zh-CN/openapi-codegen/installation/) — npm / yarn / pnpm 安装及浏览器用法。
- [快速开始](/docs/zh-CN/openapi-codegen/quickstart/) — 生成首个代码片段并列出生成器。
- [配置](/docs/zh-CN/openapi-codegen/configuration/) — `GenerateOptions`、`RequestIR`、`Generator`、`Plugin`。
- [API 参考](/docs/zh-CN/openapi-codegen/api-reference/) — 全部导出项与完整的语言/客户端列表。
- [示例](/docs/zh-CN/openapi-codegen/examples/) — fetch、Python requests、cURL、自定义生成器、插件及直接使用 `RequestIR`。
