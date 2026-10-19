---
sidebar_position: 2
title: "安装"
description: "安装 @powerduck/oas-document 及其同级依赖。"
---

# 安装

```bash npm2yarn2pnpm
npm install @powerduck/oas-document
```

## 同级依赖

```bash
npm install react react-dom
```

## 导入 CSS

```tsx
import "@powerduck/oas-document/react/index.css";
```

组件已包含自身样式（tree CSS、md-editor CSS），除包入口样式外，无需额外导入 CSS。

## 入口

| 导入路径 | 说明 |
|--------|-------------|
| `@powerduck/oas-document/react` | `<OasDocument />` 组件和 `useOasDocument` Hook |
| `@powerduck/oas-document` | 核心: `loadOasDocument`, `parseOperations`, `buildNavigationGroups` |
