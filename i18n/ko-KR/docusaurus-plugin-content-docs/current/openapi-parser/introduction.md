---
sidebar_position: 1
title: "소개"
description: "Swagger 2.0, OpenAPI 3.0, 3.1 또는 3.2 문서를 한 번의 호출로 OpenAPI 3.2로 업그레이드합니다."
keywords: ["openapi-parser", "powerduck", "Swagger", "OpenAPI 3.2"]
---

# @powerduck/openapi-parser

Swagger 2.0, OpenAPI 3.0, 3.1 또는 3.2 문서를 한 번의 호출로 OpenAPI 3.2로 업그레이드합니다.

다음 두 라이브러리를 가볍게 래핑합니다: [`@scalar/openapi-parser`](https://github.com/scalar/openapi-parser), [`@scalar/openapi-upgrader`](https://github.com/scalar/openapi-parser/tree/main/packages/openapi-upgrader).
파싱, 검증 또는 업그레이드를 다시 구현하지 않고 이 기능들을 연결합니다. 모든 실패는 기계가 읽을 수 있는 오류 코드를 포함한 일관되고 예측 가능한 형식으로 제공됩니다.

- **패키지 이름:** `@powerduck/openapi-parser`
- **버전:** <img src="https://img.shields.io/npm/v/@powerduck/openapi-parser"/>
- **라이선스:** MIT
- **Node.js:** >= 22.12.0

## 기능

- **하나의 함수로 모든 버전 지원** — Swagger 2.0, OpenAPI 3.0.x, 3.1.x, 3.2.x를 검증된 3.2 문서로 업그레이드합니다.
- **JSON 및 YAML 문자열 입력** — 파싱된 객체나 원시 JSON/YAML 문자열을 전달할 수 있습니다.
- **기계가 읽을 수 있는 오류 코드** — 모든 실패는 `UpgradeErrorCode` 열거형 값을 포함하는 `OpenApiUpgradeError`로 전달됩니다.
- **입력 변경 없음** — 업그레이드 단계가 실행되기 전에 `structuredClone`으로 입력을 깊은 복사합니다.
- **순환 참조 보호** — 스택 오버플로가 발생하기 전에 입력의 순환 참조를 감지합니다.
- **출력 검증** — 업그레이드된 3.2 문서는 기본적으로 스키마 검증을 거칩니다.
- **ESM 및 CJS 지원** — 최신 Node와 번들러에서는 `import`를, Electron 메인 프로세스에서는 `require()`를 사용합니다.

## 다음 단계

- [설치](/docs/ko-KR/openapi-parser/installation/) — 설치 및 요구 사항
- [빠른 시작](/docs/ko-KR/openapi-parser/quickstart/) — 첫 문서 업그레이드
- [API 참조](/docs/ko-KR/openapi-parser/api-reference/) — 모든 내보내기, 오류 코드 및 옵션
- [예제](/docs/ko-KR/openapi-parser/examples/) — 오류 처리, 옵션 및 CommonJS 사용법
