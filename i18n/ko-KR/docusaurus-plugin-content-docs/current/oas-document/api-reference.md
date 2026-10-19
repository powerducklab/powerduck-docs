---
sidebar_position: 4
title: "API 참조"
description: "OasDocument 속성, useOasDocument 훅 및 코어 함수."
---

# API 참조

## `<OasDocument />` — 속성

| 속성 | 타입 | 기본값 | 설명 |
|------|------|---------|-------------|
| `input` | `OpenApiInput \| OpenApiDocument \| null` | 필수 | OpenAPI/Swagger 문서(객체, JSON 문자열 또는 YAML 문자열) |
| `autoUpgrade` | `boolean` | `true` | `@powerduck/openapi-parser`로 검증하고 OAS 3.2로 업그레이드 |
| `defaultOperationId` | `string` | — | 첫 렌더링에서 선택할 작업 ID |
| `onOperationChange` | `(operation) => void` | — | 사용자가 선택을 변경할 때 실행되는 콜백 |
| `className` | `string` | — | 루트 요소에 추가할 CSS 클래스 |
| `style` | `React.CSSProperties` | — | 루트 요소의 인라인 스타일 |
| `theme` | `"light" \| "dark"` | `"light"` | 초기 테마. localStorage에 저장됩니다. |
| `header` | `OasDocumentHeaderConfig` | — | 헤더 설정(로고, 제목, 탐색 링크) |
| `showTree` | `boolean` | `true` | 사이드바 트리 표시 |
| `treeWidth` | `number` | `340` | 사이드바 너비(픽셀, 범위 240–480) |

### 헤더 설정

| 필드 | 타입 | 기본값 |
|-------|------|---------|
| `logo` | `string \| ReactNode` | — |
| `title` | `string` | `"API Documentation"` |
| `navItems` | `Array<{ label, href?, onClick? }>` | `[]` |
| `showThemeToggle` | `boolean` | `true` |

## `useOasDocument(input, options?)`

```typescript
const {
  document,          // Oas32Document | null
  loading,           // boolean
  error,             // Error | null
  operations,        // OasOperation[]
  navigationGroups,  // OasNavigationGroup[]
  tree,              // TreeNode[]
  selectedOperation, // OasOperation | undefined
  setSelectedOperation,
  theme,             // "light" | "dark"
  setTheme,
} = useOasDocument(spec, { autoUpgrade: true });
```

## 코어 함수

| 함수 | 설명 |
|----------|-------------|
| `loadOasDocument(input, options?)` | 문서를 불러와 업그레이드하고 `{ document, operations, navigationGroups, tree, warnings, error }` 반환 |
| `parseOperations(document)` | OAS 문서에서 작업 추출 |
| `buildNavigationGroups(document)` | 그룹화된 탐색 구조 생성 |
