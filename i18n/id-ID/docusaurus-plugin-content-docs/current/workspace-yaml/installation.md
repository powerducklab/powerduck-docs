---
sidebar_position: 2
title: "Instalasi"
description: "Instal @powerduck/workspace-yaml."
---

# Instalasi

```bash npm2yarn2pnpm
npm install @powerduck/workspace-yaml
```

Dependensi peer (diinstal secara otomatis):
- `@powerduck/conf-patch` — penulisan atomik dan penguncian berkas
- `@powerduck/openapi-parser` — validasi dan peningkatan versi OpenAPI
- `yaml` — penguraian dan serialisasi YAML

## Titik masuk

| Impor | Deskripsi |
|--------|-------------|
| `@powerduck/workspace-yaml` | Lapisan berkas (Node.js / Electron): `createWorkspaceApi`, `initializeWorkspace`, `initializeOpenApi` |
| `@powerduck/workspace-yaml/core` | Lapisan inti (dapat digunakan di browser): `createWorkspaceYaml`, `createOpenApiYaml`, `createWorkspaceWithApi`, `parseWorkspaceYaml` |
