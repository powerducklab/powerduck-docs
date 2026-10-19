---
sidebar_position: 1
title: "简介"
description: "面向生产环境的 React OpenAPI 文档组件。传入 OAS 文档，即可获得完整的 Stripe 风格 API 文档界面，支持页头导航、浅色与深色主题、树形导航、滚动位置跟踪、模式浏览和多语言代码示例。"
keywords: ["oas-document", "powerduck", "React", "OpenAPI"]
---

# @powerduck/oas-document

面向生产环境的 React OpenAPI 文档组件。传入 OAS 文档，即可获得完整的 Stripe 风格 API 文档界面，支持页头导航、浅色与深色主题、树形导航、滚动位置跟踪、模式浏览和多语言代码示例。

- **包名:** `@powerduck/oas-document`
- **版本:** <img src="https://img.shields.io/npm/v/@powerduck/oas-document"/>
- **许可证:** MIT

构建基础: `@powerduck/openapi-parser` (验证与自动升级), `@powerduck/tree` (导航), `@powerduck/md-editor` (Markdown 渲染), `@powerduck/openapi-codegen` (请求代码生成).

## 功能

- **开箱即用的 API 文档** — 接受已解析对象、JSON 字符串或 YAML 字符串
- **Stripe 风格布局** — 可配置页头、侧边栏树和双栏操作视图
- **浅色与深色主题** — 在页头切换，选择保存在 localStorage 中
- **自动升级至 OAS 3.2** — 通过 `@powerduck/openapi-parser` 验证和升级
- **滚动跟踪导航** — 使用被动滚动监听器和二分查找
- **Markdown 渲染** — 描述通过 `@powerduck/md-editor` 渲染
- **多语言代码示例** — 通过 `@powerduck/openapi-codegen` 生成
- **模式浏览** — 支持展开和折叠的嵌套属性表
- **响应式布局** — 移动端侧边栏折叠为覆盖层

## 后续步骤

- [安装](/docs/zh-CN/oas-document/installation/)
- [快速开始](/docs/zh-CN/oas-document/quickstart/)
- [API 参考](/docs/zh-CN/oas-document/api-reference/)
- [示例](/docs/zh-CN/oas-document/examples/)
