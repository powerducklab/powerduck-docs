---
sidebar_position: 5
title: "示例"
description: "跳过自动升级、不依赖 React 使用核心模块、自定义主题，并了解渲染性能限制。"
---

# 示例

## 已有有效的 OAS 3.2 文档？

```tsx
// Skip auto-upgrade when your document is already 3.2
<OasDocument input={validOas32Doc} autoUpgrade={false} />
```

## 仅使用核心模块（无需 React）

在自定义界面或 Node.js 中使用核心入口：

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

## 自定义样式

根元素会设置 `data-theme="light"` 或 `data-theme="dark"`。所有颜色均通过 `.pde-oas-root` 下的 CSS 变量解析。

```css
:is(.pde-oas-root, .pde-oas-theme) {
  --pde-color-accent: #635bff;
}

:is(.pde-oas-root, .pde-oas-theme)[data-theme="dark"] {
  --pde-color-accent: #a5a0ff;
}
```

## 性能说明

- 代码示例延迟到距视口 600px 以内才加载（IntersectionObserver）
- 语法高亮使用 LRU 缓存（64 条记录 / 1MB）
- 滚动位置跟踪使用被动事件监听器，并通过 rAF 节流
- 示例生成最多嵌套 6 层、包含 1,000 个节点
