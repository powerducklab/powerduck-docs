---
sidebar_position: 2
title: "설치"
description: "@powerduck/workspace-yaml를 설치합니다."
---

# 설치

```bash npm2yarn2pnpm
npm install @powerduck/workspace-yaml
```

피어 의존성(자동 설치):
- `@powerduck/conf-patch` — 원자적 쓰기 및 파일 잠금
- `@powerduck/openapi-parser` — OpenAPI 검증 및 업그레이드
- `yaml` — YAML 파싱 및 직렬화

## 진입점

| 가져오기 경로 | 설명 |
|--------|-------------|
| `@powerduck/workspace-yaml` | 파일 계층(Node.js / Electron): `createWorkspaceApi`, `initializeWorkspace`, `initializeOpenApi` |
| `@powerduck/workspace-yaml/core` | 핵심 계층(브라우저에서 사용 가능): `createWorkspaceYaml`, `createOpenApiYaml`, `createWorkspaceWithApi`, `parseWorkspaceYaml` |
