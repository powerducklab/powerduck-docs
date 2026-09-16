---
sidebar_position: 1
title: "Introduction"
description: "Extensible tree component for API navigation, schema exploration, and documentation. Generic core with OpenAPI, JSON Schema, and doc adapters. React component with search, drag-and-drop, keyboard navigation, and context menus."
keywords: ["tree", "powerduck", "React", "navigation", "OpenAPI", "JSON Schema", "introduction"]
---

# @powerduck/tree

Extensible tree component for API navigation, schema exploration, and
documentation. Built on a generic core with adapters for OpenAPI, JSON
Schema, and custom data sources.

- **Package name:** `@powerduck/tree`
- **Version:** <img src="https://img.shields.io/npm/v/@powerduck/tree"/>
- **License:** MIT

## Features

- **Generic core** — `TreeNode<TMetadata>` works with any data source
- **OpenAPI adapter** — tag-based navigation with OAS 3.2 nested tags, `x-tagGroups`, `x-order`, `x-displayName`, `x-internal`
- **JSON Schema adapter** — deep expansion of nested properties, arrays, combinators with `jsonPath` metadata
- **Doc adapter** — Stripe-style documentation tree with operation count badges
- **React component** — search, expand/collapse, keyboard navigation, method badges, custom render props
- **Drag and drop** — reorder within the same parent and cross-level move into folders
- **Context menu** — right-click or more button for per-node actions
- **Imperative locate** — `locateNode(predicate)` finds a node, expands ancestors, selects it, and scrolls into view
- **JSON Patch integration** — `onPatch` callback emits RFC 6902 operations
- **CSS variable theming** — compatible with powerduck `tokens.css`, light/dark mode

## Next steps

- [Installation](./installation)
- [Quickstart](./quickstart)
- [API Reference](./api-reference)
- [Examples](./examples)
