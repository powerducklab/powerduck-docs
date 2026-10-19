---
sidebar_position: 2
title: "Установка"
description: "Установите @powerduck/workspace-yaml."
---

# Установка

```bash npm2yarn2pnpm
npm install @powerduck/workspace-yaml
```

Одноранговые зависимости (устанавливаются автоматически):
- `@powerduck/conf-patch` — атомарная запись и блокировка файлов
- `@powerduck/openapi-parser` — проверка и обновление OpenAPI
- `yaml` — разбор и сериализация YAML

## Точки входа

| Импорт | Описание |
|--------|-------------|
| `@powerduck/workspace-yaml` | Файловый слой (Node.js / Electron): `createWorkspaceApi`, `initializeWorkspace`, `initializeOpenApi` |
| `@powerduck/workspace-yaml/core` | Основной слой (работает в браузере): `createWorkspaceYaml`, `createOpenApiYaml`, `createWorkspaceWithApi`, `parseWorkspaceYaml` |
