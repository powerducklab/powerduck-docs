---
sidebar_position: 2
title: "安裝"
description: "安裝 @powerduck/tree 及其對等相依套件。"
---

# 安裝

```bash npm2yarn2pnpm
npm install @powerduck/tree
```

## 對等相依套件

```bash
npm install react react-dom react-icons
```

## 匯入 CSS

```tsx
import "@powerduck/tree/react/index.css";
```

## 進入點

| 匯入路徑 | 說明 |
|--------|-------------|
| `@powerduck/tree` | 核心型別、工具函式與所有轉接器 |
| `@powerduck/tree/react` | React Tree 元件與 Hooks |
| `@powerduck/tree/adapters` | OpenAPI、JSON Schema 與文件轉接器 |
| `@powerduck/tree/core` | 僅包含核心型別與工具函式 |
