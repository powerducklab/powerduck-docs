---
sidebar_position: 2
title: "설치"
description: "@powerduck/oas-document 및 피어 의존성을 설치합니다."
---

# 설치

```bash npm2yarn2pnpm
npm install @powerduck/oas-document
```

## 피어 의존성

```bash
npm install react react-dom
```

## CSS 가져오기

```tsx
import "@powerduck/oas-document/react/index.css";
```

컴포넌트에 자체 스타일시트(tree CSS, md-editor CSS)가 포함되어 있으므로 패키지 진입점 외에 CSS를 추가로 가져올 필요가 없습니다.

## 진입점

| 가져오기 경로 | 설명 |
|--------|-------------|
| `@powerduck/oas-document/react` | `<OasDocument />` 컴포넌트 및 `useOasDocument` 훅 |
| `@powerduck/oas-document` | 핵심: `loadOasDocument`, `parseOperations`, `buildNavigationGroups` |
