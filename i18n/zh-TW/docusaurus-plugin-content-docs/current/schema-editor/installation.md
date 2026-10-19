---
sidebar_position: 2
title: "安裝"
description: "安裝 @powerduck/schema-editor 及其對等相依套件。"
---

# 安裝

```bash npm2yarn2pnpm
npm install @powerduck/schema-editor
```

## 對等相依套件

```bash
npm install react react-dom monaco-editor @monaco-editor/react
```

## 進入點

| 匯入路徑 | 說明 |
|--------|-------------|
| `@powerduck/schema-editor` | 核心 API：結構描述解析、診斷與範例產生 |
| `@powerduck/schema-editor/react` | React `<SchemaEditor />` 元件 |
| `@powerduck/schema-editor/core` | 不依賴 React、可在瀏覽器中使用的核心模組 |
