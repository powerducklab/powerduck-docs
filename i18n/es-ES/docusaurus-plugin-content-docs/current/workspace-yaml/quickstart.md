---
sidebar_position: 3
title: "Inicio rápido"
description: "Inicializa un espacio de trabajo y un archivo YAML de OpenAPI con una sola llamada."
---

# Inicio rápido

## Node.js / Electron

```typescript
import { createWorkspaceApi } from "@powerduck/workspace-yaml";

const { workspaceFilePath, openApiFilePath } = await createWorkspaceApi({
  workspaceDirectory: "./my-project",
  oasId: "users-api",
  name: "Users API",
  title: "Users API Documentation",
  version: "1.0.0",
});

console.log("Workspace:", workspaceFilePath);
console.log("OpenAPI:", openApiFilePath);
```

## Navegador (sin sistema de archivos)

```typescript
import { createWorkspaceYaml, createOpenApiYaml } from "@powerduck/workspace-yaml/core";

// Generate YAML content strings — save to IndexedDB, localStorage, or send to an API
const workspaceContent = createWorkspaceYaml();
const openApiContent = createOpenApiYaml({ title: "My API" });
```
