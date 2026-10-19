---
sidebar_position: 1
title: "소개"
description: "workspace.yaml과 OpenAPI 3.2 YAML 파일을 안정적으로 초기화합니다. 브라우저에서 안전하게 실행되는 순수 함수로 YAML 콘텐츠 문자열을 생성합니다. 파일 시스템에는 접근하지 않습니다. Node.js / Electron에서 코어 계층에 원자적 쓰기, 파일 잠금 및 경로 정규화를 제공합니다."
keywords: ["workspace-yaml", "powerduck", "YAML", "OpenAPI"]
---

# @powerduck/workspace-yaml

workspace.yaml과 OpenAPI 3.2 YAML 파일을 안정적으로 초기화합니다.

2계층 아키텍처:
- **코어 계층**: 브라우저에서 안전하게 실행되는 순수 함수로 YAML 콘텐츠 문자열을 생성합니다. 파일 시스템에는 접근하지 않습니다.
- **파일 계층**: Node.js / Electron에서 코어 계층에 원자적 쓰기, 파일 잠금 및 경로 정규화를 제공합니다.

- **패키지 이름:** `@powerduck/workspace-yaml`
- **버전:** <img src="https://img.shields.io/npm/v/@powerduck/workspace-yaml"/>
- **라이선스:** MIT

이 라이브러리는 **파일 초기화만** 수행하며 새 파일 만들기나 수동 생성에 사용합니다. YAML 파일의 읽기, 패치 또는 업데이트 기능을 다시 구현하지 **않습니다**. 이러한 작업에는 다음 패키지를 사용하세요: [`@powerduck/conf-patch`](https://www.npmjs.com/package/@powerduck/conf-patch).

## 다음 단계

- [설치](/docs/ko-KR/workspace-yaml/installation/)
- [빠른 시작](/docs/ko-KR/workspace-yaml/quickstart/)
- [API 참조](/docs/ko-KR/workspace-yaml/api-reference/)
- [예제](/docs/ko-KR/workspace-yaml/examples/)
