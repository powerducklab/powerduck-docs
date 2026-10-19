---
sidebar_position: 2
title: "Installation"
description: "Installez @powerduck/workspace-yaml."
---

# Installation

```bash npm2yarn2pnpm
npm install @powerduck/workspace-yaml
```

Dépendances homologues (installées automatiquement) :
- `@powerduck/conf-patch` — écritures atomiques et verrouillage des fichiers
- `@powerduck/openapi-parser` — validation et mise à niveau OpenAPI
- `yaml` — analyse et sérialisation YAML

## Points d’entrée

| Import | Description |
|--------|-------------|
| `@powerduck/workspace-yaml` | Couche fichiers (Node.js / Electron): `createWorkspaceApi`, `initializeWorkspace`, `initializeOpenApi` |
| `@powerduck/workspace-yaml/core` | Couche centrale (utilisable dans le navigateur): `createWorkspaceYaml`, `createOpenApiYaml`, `createWorkspaceWithApi`, `parseWorkspaceYaml` |
