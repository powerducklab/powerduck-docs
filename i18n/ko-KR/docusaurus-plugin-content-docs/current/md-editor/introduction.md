---
sidebar_position: 1
title: "소개"
description: "@powerduck/md-editor는 브라우저에 내장할 수 있는 고성능 Markdown 편집기입니다. CodeMirror 6 편집 영역과 markdown-it으로 렌더링하는 실시간 미리보기를 결합하고, KaTeX 수식, Markmap 마인드맵, 코드 강조, 알림 블록, 구성 가능한 도구 모음, 키보드 단축키, 이미지 업로드 훅, @멘션, 문서 링크 삽입을 제공합니다."
---

# 소개

`@powerduck/md-editor`는 브라우저에 내장할 수 있는 고성능 Markdown 편집기입니다. [CodeMirror 6](https://codemirror.net) 편집 영역과 [markdown-it](https://github.com/markdown-it/markdown-it)으로 렌더링하는 실시간 미리보기를 결합하고, KaTeX 수식, Markmap 마인드맵, 코드 강조, 알림 블록, 구성 가능한 도구 모음, 키보드 단축키, 이미지 업로드 훅, @멘션, 문서 링크 삽입을 제공합니다.

- **패키지 이름:** `@powerduck/md-editor` <img src="https://img.shields.io/npm/v/@powerduck/md-editor"/>
- **라이선스:** MIT
- **모듈 형식:** ECMAScript 모듈(`type: "module"`)이며 ESM(`dist/index.mjs`)과 CJS(`dist/index.cjs`) 빌드 및 타입 선언(`dist/index.d.ts`)을 함께 제공합니다.

## 주요 기능

다음 기능은 실제 구현된 소스 모듈을 기준으로 설명합니다.

- **Markdown 편집:** CodeMirror 6 기반으로 Markdown 구문 강조와 밝은 테마 및 어두운 테마를 지원합니다.
- **KaTeX 수식:** 독립적인 markdown-it 플러그인으로 인라인 `$...$`와 블록 `$$...$$`를 지원합니다. `$5` 같은 금액은 휴리스틱 규칙으로 수식 파싱에서 제외합니다.
- **Markmap 마인드맵:** ```` ```mindmap ```` 코드 블록에서 렌더링합니다. markmap-lib와 markmap-view는 동적으로 가져오므로 마인드맵이 없으면 초기 번들 크기를 늘리지 않습니다.
- **코드 강조:** highlight.js를 사용하며 macOS 스타일의 세 가지 색 점 헤더, 언어 레이블, 클릭 한 번으로 복사하는 버튼을 제공합니다.
- **알림 블록:** `:::notice`, `:::info`, `:::tip`, `:::success`, `:::warning`, `:::danger`에 아이콘과 색상 스타일을 적용합니다.
- **GitHub 스타일 미리보기:** `github-markdown-css`를 사용합니다.
- **다양한 도구 모음:** 22개 작업, 이미지·동영상·YouTube·표 삽입 대화상자, 수식과 마인드맵 템플릿 선택기, 모든 단축키를 안내하는 도움말을 제공합니다.
- **키보드 단축키:** `Mod`는 Windows/Linux에서 Ctrl, macOS에서 Cmd에 해당합니다.
- **도구 모음 구성:** 표시할 항목의 배열이나 항목별 설정(`show`, `label`, `icon`)으로 조정할 수 있습니다.
- **이미지 업로드 훅:** 편집기에 이미지를 붙여넣거나 드롭하면 `onImageUpload`를 호출합니다.
- **@멘션 드롭다운:** `mention` 옵션으로 설정하며, 선택한 멘션은 미리보기에서 스타일이 적용된 배지로 표시됩니다.
- **문서 링크 삽입:** `docLink`로 설정하고 일반 링크 또는 `:::doc-link` 미리보기 카드를 삽입합니다. 메타데이터는 내장 로더나 사용자 정의 훅으로 가져오며, 교차 출처 요청에는 브라우저의 CORS 규칙이 적용됩니다.
- **동영상 렌더링:** 이미지 문법의 URL이 `.mp4`, `.webm`, `.ogg` 등 알려진 확장자로 끝나면 `<video controls>` 요소로 렌더링합니다.
- **독립형 렌더러:** `renderMarkdown(source, options)`는 편집기를 마운트하지 않고 미리보기와 동일한 플러그인 및 스타일로 HTML을 생성합니다.
- **블록 단위 증분 렌더링:** ATX 제목을 기준으로 소스를 나누고 변경된 블록만 다시 렌더링합니다. 변경되지 않은 블록은 초기화된 마인드맵 SVG를 포함한 기존 DOM 노드를 재사용합니다. 렌더링 결과는 콘텐츠 해시로 캐시합니다.
- **적응형 디바운스:** 미리보기 렌더링 지연은 문서 길이에 따라 기본 120ms에서 최대 600ms까지 조정됩니다.
- **두 가지 편집 모드:** `simple`은 도구 모음 없이 편집과 미리보기를 제공하고, `complex`는 도구 모음과 상태 표시줄을 제공합니다. 실행 중 전환할 수 있습니다.
- **두 가지 테마:** `light`와 `dark`를 `data-theme` 속성 및 CSS 사용자 정의 속성으로 적용합니다.

## 아키텍처 개요

라이브러리는 두 가지 인터페이스를 제공합니다.

1. **네이티브 JavaScript 클래스:** 주요 API는 컨테이너 요소로 생성하는 `MarkdownEditor`를 중심으로 구성됩니다. `CodeEditor`(CodeMirror 래퍼), `Renderer`(markdown-it 래퍼), 미리보기용 `IncrementalRenderer`를 결합하며, `complex` 모드에서는 `Toolbar`와 `StatusBar`도 사용합니다. 대화상자, @멘션 컨트롤러, 문서 링크 컨트롤러는 필요할 때 마운트하는 모듈입니다.

2. **React 하위 경로 내보내기:** `MarkdownEditorReact`는 `./react`에서 내보내는 `forwardRef` 컴포넌트입니다. 네이티브 `MarkdownEditor` 인스턴스를 감싸고 제어 및 비제어 `value` 사용을 지원하며, ref를 통해 명령형 `MarkdownEditorHandle`을 제공합니다. React 진입점이 분리되어 있어 React를 쓰지 않는 프로젝트는 `react`와 `react-dom`을 설치할 필요가 없습니다.

렌더링은 마인드맵 자리표시자 HTML을 생성하는 동기 markdown-it 단계와, `Renderer.hydrate`로 이를 대화형 SVG로 바꾸는 비동기 초기화 단계로 나뉩니다. `renderMarkdown`은 동기 HTML을 반환합니다. 마인드맵 SVG를 만들려면 `Renderer.render`를 사용하고 HTML을 DOM에 삽입한 뒤 `Renderer.hydrate`를 호출하세요. 증분 렌더러는 미리보기 컨테이너를 직접 조작합니다.

## 브라우저 지원

DOM을 갖춘 최신 브라우저를 대상으로 합니다. CodeMirror 6, KaTeX, markmap-view는 브라우저 기능이 아니라 패키지 의존성입니다. 대화형 마인드맵은 `ResizeObserver`를 사용합니다. Clipboard API를 사용할 수 있으면 이를 사용하고, HTTPS가 아닌 환경 등에서 `navigator.clipboard`를 사용할 수 없으면 코드 블록 복사에 `document.execCommand('copy')`를 사용합니다. 마인드맵 모듈은 전역 `ResizeObserver`가 없을 때만 빈 구현을 등록해 가져오기 오류를 방지합니다. 이 구현은 실제 크기 변경 알림을 제공하지 않습니다.

## 라이선스

`@powerduck/md-editor`는 **MIT** 라이선스로 배포됩니다.

## 다음 단계

- [설치](./installation.md) — 패키지를 설치하고 가져오기 경로를 확인합니다.
- [빠른 시작](./quickstart.md) — 네이티브 JavaScript 또는 React에서 첫 편집기를 마운트합니다.
- [설정](./configuration.md) — `MarkdownEditorOptions`의 모든 옵션을 확인합니다.
- [기능](./features.md) — 각 내장 기능을 자세히 살펴봅니다.
- [API 레퍼런스](./api-reference.md) — 내보내는 모든 클래스, 함수, 타입을 확인합니다.
- [예제](./examples.md) — 완전한 실행 가능 코드 예제를 제공합니다.
