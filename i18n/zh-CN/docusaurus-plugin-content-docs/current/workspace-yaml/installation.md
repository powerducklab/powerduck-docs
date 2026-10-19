---
sidebar_position: 2
title: "安装"
description: "安装 @powerduck/workspace-yaml。"
---

# 安装

```bash npm2yarn2pnpm
npm install @powerduck/workspace-yaml
```

同级依赖（自动安装）：
- `@powerduck/conf-patch` — 原子写入、文件锁
- `@powerduck/openapi-parser` — OpenAPI 校验与升级
- `yaml` — YAML 解析与序列化

## 入口

| 导入路径 | 说明 |
|--------|-------------|
| `@powerduck/workspace-yaml` | 文件层（Node.js / Electron）: `createWorkspaceApi`, `initializeWorkspace`, `initializeOpenApi` |
| `@powerduck/workspace-yaml/core` | 核心层（可用于浏览器）: `createWorkspaceYaml`, `createOpenApiYaml`, `createWorkspaceWithApi`, `parseWorkspaceYaml` |
