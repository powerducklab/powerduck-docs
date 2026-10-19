---
sidebar_position: 1
title: "简介"
description: "可扩展的树组件，用于 API 导航、模式浏览和文档。基于通用核心构建，并提供 OpenAPI、JSON Schema 和自定义数据源适配器。"
keywords: ["tree", "powerduck", "React", "OpenAPI", "JSON Schema"]
---

# @powerduck/tree

可扩展的树组件，用于 API 导航、模式浏览和文档。基于通用核心构建，并提供 OpenAPI、JSON Schema 和自定义数据源适配器。

- **包名:** `@powerduck/tree`
- **版本:** <img src="https://img.shields.io/npm/v/@powerduck/tree"/>
- **许可证:** MIT

## 功能

- **通用核心** — `TreeNode<TMetadata>` 适用于任意数据源
- **OpenAPI 适配器** — 基于标签的导航，支持 OAS 3.2 嵌套标签、`x-tagGroups`、`x-order`、`x-displayName` 和 `x-internal`
- **JSON Schema 适配器** — 深入展开嵌套属性、数组和组合模式，并提供 `jsonPath` 元数据
- **文档适配器** — Stripe 风格的文档树，带操作数量徽标
- **React 组件** — 搜索、展开与折叠、键盘导航、方法徽标和自定义渲染属性
- **拖放** — 在同一父节点下重新排序，或跨层级移入文件夹
- **上下文菜单** — 通过右键或更多按钮执行节点操作
- **命令式定位** — `locateNode(predicate)` 查找节点、展开祖先节点、选中该节点并滚动到可视区域
- **JSON Patch 集成** — `onPatch` 回调发出 RFC 6902 操作
- **CSS 变量主题** — 兼容 Powerduck `tokens.css`，支持浅色与深色模式

## 后续步骤

- [安装](/docs/zh-CN/tree/installation/)
- [快速开始](/docs/zh-CN/tree/quickstart/)
- [API 参考](/docs/zh-CN/tree/api-reference/)
- [示例](/docs/zh-CN/tree/examples/)
