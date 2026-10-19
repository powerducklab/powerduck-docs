---
sidebar_position: 2
title: "安装"
description: "安装 @powerduck/schema-editor 及其同级依赖。"
---

# 安装

```bash npm2yarn2pnpm
npm install @powerduck/schema-editor
```

## 同级依赖

```bash
npm install react react-dom monaco-editor @monaco-editor/react
```

## 入口

| 导入路径 | 说明 |
|--------|-------------|
| `@powerduck/schema-editor` | 核心 API：Schema 解析、诊断和示例生成 |
| `@powerduck/schema-editor/react` | React `<SchemaEditor />` 组件 |
| `@powerduck/schema-editor/core` | 不依赖 React、可用于浏览器的核心模块 |
