---
sidebar_position: 5
title: "範例"
description: "略過自動升級、無需 React 使用核心模組、自訂佈景主題，並瞭解渲染效能限制。"
---

# 範例

## 已有有效的 OAS 3.2 文件？

```tsx
// Skip auto-upgrade when your document is already 3.2
<OasDocument input={validOas32Doc} autoUpgrade={false} />
```

## 僅使用核心模組（無需 React）

在自訂介面或 Node.js 中使用核心進入點：

```typescript
import { loadOasDocument } from "@powerduck/oas-document";

const result = await loadOasDocument(spec, { autoUpgrade: true });

if (result.error) {
  console.error("Failed:", result.error);
} else {
  console.log("Operations:", result.operations.length);
  console.log("Tree nodes:", result.tree.length);
}
```

## 自訂樣式

根元素會設定 `data-theme="light"` 或 `data-theme="dark"`。所有色彩皆透過 `.pde-oas-root` 下的 CSS 變數解析。

```css
:is(.pde-oas-root, .pde-oas-theme) {
  --pde-color-accent: #635bff;
}

:is(.pde-oas-root, .pde-oas-theme)[data-theme="dark"] {
  --pde-color-accent: #a5a0ff;
}
```

## 效能說明

- 程式碼範例延後至距離可視區域 600px 以內才載入（IntersectionObserver）
- 語法醒目提示使用 LRU 快取（64 筆記錄 / 1MB）
- 捲動位置追蹤使用被動事件監聽器，並透過 rAF 節流
- 範例產生最多巢狀 6 層、包含 1,000 個節點
