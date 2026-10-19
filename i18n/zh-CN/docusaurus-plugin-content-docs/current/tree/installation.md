---
sidebar_position: 2
title: "安装"
description: "安装 @powerduck/tree 及其同级依赖。"
---

# 安装

```bash npm2yarn2pnpm
npm install @powerduck/tree
```

## 同级依赖

```bash
npm install react react-dom react-icons
```

## 导入 CSS

```tsx
import "@powerduck/tree/react/index.css";
```

## 入口

| 导入路径 | 说明 |
|--------|-------------|
| `@powerduck/tree` | 核心类型、工具函数和全部适配器 |
| `@powerduck/tree/react` | React Tree 组件和 Hooks |
| `@powerduck/tree/adapters` | OpenAPI、JSON Schema 和文档适配器 |
| `@powerduck/tree/core` | 仅包含核心类型和工具函数 |
