---
sidebar_position: 2
title: "설치"
description: "@powerduck/schema-editor 및 피어 의존성을 설치합니다."
---

# 설치

```bash npm2yarn2pnpm
npm install @powerduck/schema-editor
```

## 피어 의존성

```bash
npm install react react-dom monaco-editor @monaco-editor/react
```

## 진입점

| 가져오기 경로 | 설명 |
|--------|-------------|
| `@powerduck/schema-editor` | 핵심 API: 스키마 해석, 진단 및 샘플 생성 |
| `@powerduck/schema-editor/react` | React `<SchemaEditor />` 컴포넌트 |
| `@powerduck/schema-editor/core` | React 없이 브라우저에서 사용할 수 있는 핵심 모듈 |
