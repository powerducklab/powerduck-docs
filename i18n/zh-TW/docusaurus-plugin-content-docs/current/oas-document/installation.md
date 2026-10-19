---
sidebar_position: 2
title: "安裝"
description: "安裝 @powerduck/oas-document 及其對等相依套件。"
---

# 安裝

```bash npm2yarn2pnpm
npm install @powerduck/oas-document
```

## 對等相依套件

```bash
npm install react react-dom
```

## 匯入 CSS

```tsx
import "@powerduck/oas-document/react/index.css";
```

元件已包含自己的樣式表（tree CSS、md-editor CSS）；除了套件進入點的樣式外，不必另外匯入 CSS。

## 進入點

| 匯入路徑 | 說明 |
|--------|-------------|
| `@powerduck/oas-document/react` | `<OasDocument />` 元件與 `useOasDocument` Hook |
| `@powerduck/oas-document` | 核心: `loadOasDocument`, `parseOperations`, `buildNavigationGroups` |
