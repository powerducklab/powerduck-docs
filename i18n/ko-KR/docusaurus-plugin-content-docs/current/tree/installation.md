---
sidebar_position: 2
title: "설치"
description: "@powerduck/tree 및 피어 의존성을 설치합니다."
---

# 설치

```bash npm2yarn2pnpm
npm install @powerduck/tree
```

## 피어 의존성

```bash
npm install react react-dom react-icons
```

## CSS 가져오기

```tsx
import "@powerduck/tree/react/index.css";
```

## 진입점

| 가져오기 경로 | 설명 |
|--------|-------------|
| `@powerduck/tree` | 핵심 타입, 유틸리티 및 모든 어댑터 |
| `@powerduck/tree/react` | React Tree 컴포넌트 및 훅 |
| `@powerduck/tree/adapters` | OpenAPI, JSON Schema 및 문서 어댑터 |
| `@powerduck/tree/core` | 핵심 타입 및 유틸리티만 포함 |
