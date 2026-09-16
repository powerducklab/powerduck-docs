---
sidebar_position: 2
title: "Installation"
description: "Install @powerduck/schema-editor and its peer dependencies."
---

# Installation

```bash npm2yarn2pnpm
npm install @powerduck/schema-editor
```

## Peer dependencies

```bash
npm install react react-dom monaco-editor @monaco-editor/react
```

## Entry points

| Import | Description |
|--------|-------------|
| `@powerduck/schema-editor` | Core API: schema resolution, diagnostics, sample generation |
| `@powerduck/schema-editor/react` | React `<SchemaEditor />` component |
| `@powerduck/schema-editor/core` | Browser-safe core without React |
