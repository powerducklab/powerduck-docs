---
sidebar_position: 2
title: "インストール"
description: "@powerduck/workspace-yaml をインストールします。"
---

# インストール

```bash npm2yarn2pnpm
npm install @powerduck/workspace-yaml
```

ピア依存関係（自動的にインストールされます）：
- `@powerduck/conf-patch` — アトミックな書き込みとファイルロック
- `@powerduck/openapi-parser` — OpenAPI の検証とアップグレード
- `yaml` — YAML の解析とシリアライズ

## エントリーポイント

| インポート先 | 説明 |
|--------|-------------|
| `@powerduck/workspace-yaml` | ファイル層（Node.js / Electron）: `createWorkspaceApi`, `initializeWorkspace`, `initializeOpenApi` |
| `@powerduck/workspace-yaml/core` | コア層（ブラウザーで利用可能）: `createWorkspaceYaml`, `createOpenApiYaml`, `createWorkspaceWithApi`, `parseWorkspaceYaml` |
