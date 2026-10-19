---
sidebar_position: 2
title: "Instalación"
description: "Instala @powerduck/workspace-yaml."
---

# Instalación

```bash npm2yarn2pnpm
npm install @powerduck/workspace-yaml
```

Dependencias de pares (se instalan automáticamente):
- `@powerduck/conf-patch` — escrituras atómicas y bloqueo de archivos
- `@powerduck/openapi-parser` — validación y actualización de OpenAPI
- `yaml` — análisis y serialización de YAML

## Puntos de entrada

| Importación | Descripción |
|--------|-------------|
| `@powerduck/workspace-yaml` | Capa de archivos (Node.js / Electron): `createWorkspaceApi`, `initializeWorkspace`, `initializeOpenApi` |
| `@powerduck/workspace-yaml/core` | Capa principal (compatible con el navegador): `createWorkspaceYaml`, `createOpenApiYaml`, `createWorkspaceWithApi`, `parseWorkspaceYaml` |
