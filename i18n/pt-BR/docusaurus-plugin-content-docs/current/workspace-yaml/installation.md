---
sidebar_position: 2
title: "Instalação"
description: "Instale @powerduck/workspace-yaml."
---

# Instalação

```bash npm2yarn2pnpm
npm install @powerduck/workspace-yaml
```

Dependências pares (instaladas automaticamente):
- `@powerduck/conf-patch` — gravações atômicas e bloqueio de arquivos
- `@powerduck/openapi-parser` — validação e atualização de OpenAPI
- `yaml` — análise e serialização de YAML

## Pontos de entrada

| Importação | Descrição |
|--------|-------------|
| `@powerduck/workspace-yaml` | Camada de arquivos (Node.js / Electron): `createWorkspaceApi`, `initializeWorkspace`, `initializeOpenApi` |
| `@powerduck/workspace-yaml/core` | Camada principal (compatível com navegadores): `createWorkspaceYaml`, `createOpenApiYaml`, `createWorkspaceWithApi`, `parseWorkspaceYaml` |
