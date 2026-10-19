---
sidebar_position: 2
title: "Installation"
description: "Installieren Sie @powerduck/workspace-yaml."
---

# Installation

```bash npm2yarn2pnpm
npm install @powerduck/workspace-yaml
```

Peer-Abhängigkeiten (werden automatisch installiert):
- `@powerduck/conf-patch` — atomare Schreibvorgänge und Dateisperren
- `@powerduck/openapi-parser` — OpenAPI-Validierung und -Aktualisierung
- `yaml` — YAML-Parsing und -Serialisierung

## Einstiegspunkte

| Import | Beschreibung |
|--------|-------------|
| `@powerduck/workspace-yaml` | Dateischicht (Node.js / Electron): `createWorkspaceApi`, `initializeWorkspace`, `initializeOpenApi` |
| `@powerduck/workspace-yaml/core` | Kernschicht (für Browser geeignet): `createWorkspaceYaml`, `createOpenApiYaml`, `createWorkspaceWithApi`, `parseWorkspaceYaml` |
