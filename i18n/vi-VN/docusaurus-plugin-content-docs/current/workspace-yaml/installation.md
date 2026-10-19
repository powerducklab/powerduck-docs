---
sidebar_position: 2
title: "Cài đặt"
description: "Cài đặt @powerduck/workspace-yaml."
---

# Cài đặt

```bash npm2yarn2pnpm
npm install @powerduck/workspace-yaml
```

Phụ thuộc ngang hàng (được cài đặt tự động):
- `@powerduck/conf-patch` — ghi nguyên tử và khóa tệp
- `@powerduck/openapi-parser` — xác thực và nâng cấp OpenAPI
- `yaml` — phân tích cú pháp và tuần tự hóa YAML

## Điểm vào

| Đường dẫn nhập | Mô tả |
|--------|-------------|
| `@powerduck/workspace-yaml` | Lớp tệp (Node.js / Electron): `createWorkspaceApi`, `initializeWorkspace`, `initializeOpenApi` |
| `@powerduck/workspace-yaml/core` | Lớp lõi (dùng được trong trình duyệt): `createWorkspaceYaml`, `createOpenApiYaml`, `createWorkspaceWithApi`, `parseWorkspaceYaml` |
