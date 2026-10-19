---
sidebar_position: 2
title: "설치"
description: "npm, yarn, pnpm으로 @powerduck/md-editor를 설치하고 가져오기 경로, 피어 의존성, TypeScript 지원을 확인합니다."
---

# 설치

원하는 패키지 관리자로 `@powerduck/md-editor`를 설치하세요.

```bash
npm install @powerduck/md-editor
```

```bash
yarn add @powerduck/md-editor
```

```bash
pnpm add @powerduck/md-editor
```

## 가져오기 경로

패키지의 `package.json`에 하위 경로 내보내기가 명시되어 있습니다.

| 가져오기 경로 | 내용 |
|---|---|
| `@powerduck/md-editor` | 기본 진입점: `MarkdownEditor` 클래스와 모든 독립형 헬퍼, 타입, 함수. |
| `@powerduck/md-editor/react` | React 하위 경로: `MarkdownEditorReact` 컴포넌트와 `MarkdownEditorProps`, `MarkdownEditorHandle` 타입. |
| `@powerduck/md-editor/dist/style.css` | 컴파일된 에디터 스타일시트. 한 번만 가져와야 합니다. |
| `@powerduck/md-editor/styles/tokens.css` | 디자인 토큰의 원본 CSS 사용자 지정 속성. |

패키지는 ECMAScript 모듈(`"type": "module"`)이며 `dist/index.mjs`(ESM)와 `dist/index.cjs`(CommonJS) 빌드를 함께 제공합니다. 타입 선언은 `dist/index.d.ts`에 있습니다.

```ts
// Vanilla JS main entry
import { MarkdownEditor, renderMarkdown } from '@powerduck/md-editor';
import '@powerduck/md-editor/dist/style.css';
```

```tsx
// React subpath
import { MarkdownEditorReact, type MarkdownEditorHandle } from '@powerduck/md-editor/react';
import '@powerduck/md-editor/dist/style.css';
```

## 피어 의존성

`react`와 `react-dom`은 **선택적** 피어 의존성(`>=17`)입니다. `./react` 하위 경로를 가져올 때만 필요합니다.

```bash
npm install react react-dom
```

프레임워크 독립적인 `MarkdownEditor` 클래스와 독립형 `renderMarkdown` 함수는 React에 의존하지 않으므로 React를 설치하지 않은 브라우저 프로젝트에서도 사용할 수 있습니다.

## TypeScript 지원

패키지에 타입 선언이 포함되어 있어 별도 `@types/*` 패키지는 필요하지 않습니다. 기본 진입점은 `MarkdownEditorOptions`, `EditorMode`, `EditorTheme`, `ToolbarConfig`, `RendererOptions`와 모든 헬퍼 타입을 내보냅니다. `./react` 하위 경로는 `MarkdownEditorProps`와 `MarkdownEditorHandle`을 내보냅니다.

```ts
import { MarkdownEditor, type MarkdownEditorOptions } from '@powerduck/md-editor';
import type { MarkdownEditorHandle } from '@powerduck/md-editor/react';
```

## CSS 부수 효과

`package.json`에서 `*.css` 파일을 부수 효과로 표시하여 번들러가 트리 셰이킹으로 제거하지 않게 합니다. 앱 진입점에서 `dist/style.css`를 한 번 가져오세요. 에디터 UI, `github-markdown-css` 기반 미리보기, KaTeX 및 모든 플러그인 스타일이 포함됩니다.

## 다음 단계

- [빠른 시작](/docs/ko-KR/md-editor/quickstart/) — 첫 에디터를 마운트합니다.
- [설정](/docs/ko-KR/md-editor/configuration/) — `MarkdownEditorOptions`의 모든 옵션을 확인합니다.
