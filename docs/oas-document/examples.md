---
sidebar_position: 5
title: "Examples"
description: "Server selector, custom theming, and core-only usage."
---

# Examples

## Already have a valid OAS 3.2 document?

```tsx
// Skip auto-upgrade when your document is already 3.2
<OasDocument input={validOas32Doc} autoUpgrade={false} />
```

## Core-only (no React)

Use the core entry for custom shells or Node.js:

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

## Custom styling

The root element receives `data-theme="light"` or `data-theme="dark"`.
All colors resolve through CSS variables under `.pde-oas-root`:

```css
:is(.pde-oas-root, .pde-oas-theme) {
  --pde-color-accent: #635bff;
}

:is(.pde-oas-root, .pde-oas-theme)[data-theme="dark"] {
  --pde-color-accent: #a5a0ff;
}
```

## Performance notes

- Code examples are deferred until within 600px of the viewport (IntersectionObserver)
- Syntax highlighting uses an LRU cache (64 entries / 1MB)
- Scroll-spy uses passive listeners with rAF throttling
- Example generation is bounded to 6 nesting levels and 1,000 nodes
