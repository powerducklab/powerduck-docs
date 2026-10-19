---
sidebar_position: 1
title: "简介"
description: "一次调用即可将任意 OpenAPI 文档（Swagger 2.0、OpenAPI 3.0、3.1 或 3.2）升级为 OpenAPI 3.2。"
keywords: ["openapi-parser", "powerduck", "Swagger", "OpenAPI 3.2"]
---

# @powerduck/openapi-parser

一次调用即可将任意 OpenAPI 文档（Swagger 2.0、OpenAPI 3.0、3.1 或 3.2）升级为 OpenAPI 3.2。

它是以下两个库的轻量封装： [`@scalar/openapi-parser`](https://github.com/scalar/openapi-parser), [`@scalar/openapi-upgrader`](https://github.com/scalar/openapi-parser/tree/main/packages/openapi-upgrader).
它不重新实现解析、验证或升级，而是将这些功能组合起来，并为每种失败提供统一、可预测的错误结构和机器可读的错误码。

- **包名:** `@powerduck/openapi-parser`
- **版本:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-parser"/>
- **许可证:** MIT
- **Node.js:** >= 22.12.0

## 功能

- **一个函数支持所有版本** — Swagger 2.0、OpenAPI 3.0.x、3.1.x 和 3.2.x 均可升级为经过验证的 3.2 文档。
- **JSON 和 YAML 字符串输入** — 可传入预先解析的对象或原始 JSON/YAML 字符串。
- **机器可读的错误码** — 每次失败都会抛出 `OpenApiUpgradeError`，其中包含一个 `UpgradeErrorCode` 枚举值。
- **不修改输入** — 执行任何升级步骤前，先通过 `structuredClone` 深拷贝输入。
- **循环引用保护** — 提前检测输入中的循环引用，避免堆栈溢出。
- **输出验证** — 默认根据模式验证升级后的 3.2 文档。
- **同时提供 ESM 和 CJS** — 在现代 Node 和打包器中使用 `import`，在 Electron 主进程中使用 `require()`。

## 后续步骤

- [安装](/docs/zh-CN/openapi-parser/installation/) — 安装与环境要求
- [快速开始](/docs/zh-CN/openapi-parser/quickstart/) — 升级第一份文档
- [API 参考](/docs/zh-CN/openapi-parser/api-reference/) — 所有导出、错误码和选项
- [示例](/docs/zh-CN/openapi-parser/examples/) — 错误处理、选项和 CommonJS 用法
