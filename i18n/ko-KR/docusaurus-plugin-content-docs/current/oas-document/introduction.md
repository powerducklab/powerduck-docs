---
sidebar_position: 1
title: "소개"
description: "프로덕션 환경을 위한 React OpenAPI 문서 컴포넌트입니다. OAS 문서를 전달하면 헤더 탐색, 밝은 테마와 어두운 테마, 트리 탐색, 스크롤 위치 추적, 스키마 탐색 및 여러 언어의 코드 예제를 갖춘 Stripe 스타일의 API 문서 UI를 제공합니다."
keywords: ["oas-document", "powerduck", "React", "OpenAPI"]
---

# @powerduck/oas-document

프로덕션 환경을 위한 React OpenAPI 문서 컴포넌트입니다. OAS 문서를 전달하면 헤더 탐색, 밝은 테마와 어두운 테마, 트리 탐색, 스크롤 위치 추적, 스키마 탐색 및 여러 언어의 코드 예제를 갖춘 Stripe 스타일의 API 문서 UI를 제공합니다.

- **패키지 이름:** `@powerduck/oas-document`
- **버전:** <img src="https://img.shields.io/npm/v/@powerduck/oas-document"/>
- **라이선스:** MIT

기반 라이브러리: `@powerduck/openapi-parser` (검증 및 자동 업그레이드), `@powerduck/tree` (탐색), `@powerduck/md-editor` (Markdown 렌더링), `@powerduck/openapi-codegen` (요청 코드 생성).

## 기능

- **바로 사용 가능한 API 문서** — 파싱된 객체, JSON 문자열 또는 YAML 문자열 지원
- **Stripe 스타일 레이아웃** — 설정 가능한 헤더, 사이드바 트리 및 2열 작업 보기
- **밝은 테마와 어두운 테마** — 헤더에서 전환하며 선택을 localStorage에 저장
- **OAS 3.2로 자동 업그레이드** — `@powerduck/openapi-parser`로 검증 및 업그레이드
- **스크롤 연동 탐색** — 패시브 스크롤 리스너와 이진 검색 사용
- **Markdown 렌더링** — `@powerduck/md-editor`로 설명 렌더링
- **여러 언어의 코드 예제** — `@powerduck/openapi-codegen`으로 생성
- **스키마 탐색** — 펼치고 접을 수 있는 중첩 속성 표
- **반응형 레이아웃** — 모바일에서 사이드바를 오버레이로 전환

## 다음 단계

- [설치](/docs/ko-KR/oas-document/installation/)
- [빠른 시작](/docs/ko-KR/oas-document/quickstart/)
- [API 참조](/docs/ko-KR/oas-document/api-reference/)
- [예제](/docs/ko-KR/oas-document/examples/)
