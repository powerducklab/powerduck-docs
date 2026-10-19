---
sidebar_position: 2
title: "Kurulum"
description: "@powerduck/workspace-yaml paketini yükleyin."
---

# Kurulum

```bash npm2yarn2pnpm
npm install @powerduck/workspace-yaml
```

Eş bağımlılıklar (otomatik yüklenir):
- `@powerduck/conf-patch` — atomik yazma ve dosya kilitleme
- `@powerduck/openapi-parser` — OpenAPI doğrulama ve yükseltme
- `yaml` — YAML ayrıştırma ve serileştirme

## Giriş noktaları

| İçe aktarma yolu | Açıklama |
|--------|-------------|
| `@powerduck/workspace-yaml` | Dosya katmanı (Node.js / Electron): `createWorkspaceApi`, `initializeWorkspace`, `initializeOpenApi` |
| `@powerduck/workspace-yaml/core` | Çekirdek katmanı (tarayıcıda kullanılabilir): `createWorkspaceYaml`, `createOpenApiYaml`, `createWorkspaceWithApi`, `parseWorkspaceYaml` |
