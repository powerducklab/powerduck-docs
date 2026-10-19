---
sidebar_position: 2
title: "安裝"
description: "安裝 @powerduck/workspace-yaml。"
---

# 安裝

```bash npm2yarn2pnpm
npm install @powerduck/workspace-yaml
```

對等相依套件（自動安裝）：
- `@powerduck/conf-patch` — 原子寫入與檔案鎖定
- `@powerduck/openapi-parser` — OpenAPI 驗證與升級
- `yaml` — YAML 解析與序列化

## 進入點

| 匯入路徑 | 說明 |
|--------|-------------|
| `@powerduck/workspace-yaml` | 檔案層（Node.js / Electron）: `createWorkspaceApi`, `initializeWorkspace`, `initializeOpenApi` |
| `@powerduck/workspace-yaml/core` | 核心層（可在瀏覽器中使用）: `createWorkspaceYaml`, `createOpenApiYaml`, `createWorkspaceWithApi`, `parseWorkspaceYaml` |
