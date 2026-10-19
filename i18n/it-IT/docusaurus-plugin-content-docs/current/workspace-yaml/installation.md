---
sidebar_position: 2
title: "Installazione"
description: "Installa @powerduck/workspace-yaml."
---

# Installazione

```bash npm2yarn2pnpm
npm install @powerduck/workspace-yaml
```

Dipendenze peer (installate automaticamente):
- `@powerduck/conf-patch` — scritture atomiche e blocco dei file
- `@powerduck/openapi-parser` — validazione e aggiornamento di OpenAPI
- `yaml` — parsing e serializzazione YAML

## Punti di ingresso

| Importazione | Descrizione |
|--------|-------------|
| `@powerduck/workspace-yaml` | Livello file (Node.js / Electron): `createWorkspaceApi`, `initializeWorkspace`, `initializeOpenApi` |
| `@powerduck/workspace-yaml/core` | Livello principale (compatibile con il browser): `createWorkspaceYaml`, `createOpenApiYaml`, `createWorkspaceWithApi`, `parseWorkspaceYaml` |
