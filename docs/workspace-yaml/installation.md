---
sidebar_position: 2
title: "Installation"
description: "Install @powerduck/workspace-yaml."
---

# Installation

```bash npm2yarn2pnpm
npm install @powerduck/workspace-yaml
```

Peer dependencies (automatically installed):
- `@powerduck/conf-patch` — atomic writes, file locking
- `@powerduck/openapi-parser` — OpenAPI validation and upgrade
- `yaml` — YAML parsing and serialization

## Entry points

| Import | Description |
|--------|-------------|
| `@powerduck/workspace-yaml` | File layer (Node.js / Electron): `createWorkspaceApi`, `initializeWorkspace`, `initializeOpenApi` |
| `@powerduck/workspace-yaml/core` | Core layer (browser-safe): `createWorkspaceYaml`, `createOpenApiYaml`, `createWorkspaceWithApi`, `parseWorkspaceYaml` |
