---
sidebar_position: 1
title: "소개"
description: "API 탐색, 스키마 탐색 및 문서를 위한 확장 가능한 트리 컴포넌트입니다. 범용 코어를 기반으로 OpenAPI, JSON Schema 및 사용자 정의 데이터 소스 어댑터를 제공합니다."
keywords: ["tree", "powerduck", "React", "OpenAPI", "JSON Schema"]
---

# @powerduck/tree

API 탐색, 스키마 탐색 및 문서를 위한 확장 가능한 트리 컴포넌트입니다. 범용 코어를 기반으로 OpenAPI, JSON Schema 및 사용자 정의 데이터 소스 어댑터를 제공합니다.

- **패키지 이름:** `@powerduck/tree`
- **버전:** <img src="https://img.shields.io/npm/v/@powerduck/tree"/>
- **라이선스:** MIT

## 기능

- **범용 코어** — `TreeNode<TMetadata>`는 모든 데이터 소스와 함께 사용 가능
- **OpenAPI 어댑터** — OAS 3.2 중첩 태그, `x-tagGroups`, `x-order`, `x-displayName`, `x-internal`을 지원하는 태그 기반 탐색
- **JSON Schema 어댑터** — 중첩 속성, 배열 및 조합 스키마를 깊이 펼치고 `jsonPath` 메타데이터 제공
- **문서 어댑터** — 작업 수 배지가 있는 Stripe 스타일 문서 트리
- **React 컴포넌트** — 검색, 펼치기/접기, 키보드 탐색, 메서드 배지 및 사용자 정의 렌더링 props
- **드래그 앤 드롭** — 동일한 부모 아래에서 순서를 바꾸거나 다른 계층의 폴더로 이동
- **컨텍스트 메뉴** — 마우스 오른쪽 버튼이나 더 보기 버튼으로 노드별 작업 실행
- **명령형 위치 지정** — `locateNode(predicate)`가 노드를 찾아 상위 노드를 펼치고 선택한 뒤 보이는 위치로 스크롤
- **JSON Patch 통합** — `onPatch` 콜백이 RFC 6902 작업 전달
- **CSS 변수 테마** — Powerduck `tokens.css`와 호환되며 밝은 모드와 어두운 모드 지원

## 다음 단계

- [설치](/docs/ko-KR/tree/installation/)
- [빠른 시작](/docs/ko-KR/tree/quickstart/)
- [API 참조](/docs/ko-KR/tree/api-reference/)
- [예제](/docs/ko-KR/tree/examples/)
