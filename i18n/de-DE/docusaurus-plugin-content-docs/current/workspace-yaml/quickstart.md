---
sidebar_position: 3
title: "Schnellstart"
description: "Initialisieren Sie einen Arbeitsbereich und eine OpenAPI-YAML-Datei mit einem einzigen Aufruf."
---

# Schnellstart

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

## Browser (ohne Dateisystem)

```typescript
import { createWorkspaceYaml, createOpenApiYaml } from "@powerduck/workspace-yaml/core";

// Generate YAML content strings — save to IndexedDB, localStorage, or send to an API
const workspaceContent = createWorkspaceYaml();
const openApiContent = createOpenApiYaml({ title: "My API" });
```
