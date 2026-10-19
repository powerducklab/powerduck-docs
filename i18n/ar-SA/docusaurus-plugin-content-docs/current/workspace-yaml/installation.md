---
sidebar_position: 2
title: "التثبيت"
description: "ثبّت @powerduck/workspace-yaml."
---

# التثبيت

```bash npm2yarn2pnpm
npm install @powerduck/workspace-yaml
```

الاعتماديات النظيرة (تُثبّت تلقائيًا):
- `@powerduck/conf-patch` — الكتابة الذرّية وقفل الملفات
- `@powerduck/openapi-parser` — التحقق من OpenAPI وترقيته
- `yaml` — تحليل YAML وتسلسله

## نقاط الدخول

| مسار الاستيراد | الوصف |
|--------|-------------|
| `@powerduck/workspace-yaml` | طبقة الملفات (Node.js / Electron): `createWorkspaceApi`, `initializeWorkspace`, `initializeOpenApi` |
| `@powerduck/workspace-yaml/core` | الطبقة الأساسية (متوافقة مع المتصفح): `createWorkspaceYaml`, `createOpenApiYaml`, `createWorkspaceWithApi`, `parseWorkspaceYaml` |
