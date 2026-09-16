---
sidebar_position: 2
title: "Installation"
description: "Install @powerduck/oas-document and its peer dependencies."
---

# Installation

```bash npm2yarn2pnpm
npm install @powerduck/oas-document
```

## Peer dependencies

```bash
npm install react react-dom
```

## CSS import

```tsx
import "@powerduck/oas-document/react/index.css";
```

The component bundles its own stylesheet (tree CSS, md-editor CSS) — no extra
CSS imports needed beyond the package entry.

## Entry points

| Import | Description |
|--------|-------------|
| `@powerduck/oas-document/react` | `<OasDocument />` component and `useOasDocument` hook |
| `@powerduck/oas-document` | Core: `loadOasDocument`, `parseOperations`, `buildNavigationGroups` |
