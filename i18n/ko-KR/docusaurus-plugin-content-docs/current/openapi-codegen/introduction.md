---
sidebar_position: 1
title: "소개"
description: "@powerduck/openapi-codegen으로 OpenAPI에서 실행 가능한 HTTP 예제를 생성하세요. 21개 언어, 41개 클라이언트, 브라우저 호환, 런타임 의존성 없음."
---

# 소개

`@powerduck/openapi-codegen`은 OpenAPI 연산을 선택한 언어와 HTTP 클라이언트의 **실행 가능한 HTTP 요청 예제 코드**로 변환하는 TypeScript 라이브러리입니다. API 문서 사이트, 개발자 포털, API 탐색기, CLI 도구, 빌드 시 코드 생성에 적합합니다.

**21개 언어**와 **41개 언어/클라이언트 조합**을 지원하며, **브라우저와 호환**되고 **런타임 의존성이 없습니다**.

## openapi-codegen을 선택하는 이유

- **런타임 의존성 없음** — Node 내장 모듈 없이 브라우저, Node.js, Electron, 엣지 환경에서 동작합니다.
- **두 모듈 형식** — 네이티브 ESM과 CommonJS(`require()`) 빌드를 제공합니다.
- **OpenAPI 3.0 / 3.1 / 3.2** — 파싱된 문서 객체를 처리합니다. `generate()` 호출 전에 파싱하면 JSON과 YAML을 모두 사용할 수 있습니다.
- **기본 생성기 41개** — 21개 언어를 지원하며 가져올 때 자동으로 등록됩니다.
- **완전한 매개변수 직렬화** — path, query, header, cookie에 OpenAPI `style` / `explode` / `allowReserved` 규칙을 적용합니다.
- **보안 스키마** — API 키(header/query/cookie), HTTP bearer, HTTP basic을 지원합니다.
- **본문 형식** — JSON, 일반 텍스트, URL 인코딩 폼, `multipart/form-data`.
- **`$ref` 해석** — 문서 내부 JSON Pointer 참조에 캐시, 연쇄 참조, 순환 감지를 적용합니다.
- **자동 예제** — JSON Schema의 `example`, `enum`, `default`, 타입, 형식, 제약 조건에서 예제 값을 추론합니다.
- **플러그인** — `register()` 또는 `use()`로 사용자 정의 생성기를 등록합니다.

## 동작 방식

```
OpenAPI document  ──normalize──▶  RequestIR  ──generator.generate()──▶  source code string
```

1. `normalize`는 `$ref`를 해석하고 경로와 연산 매개변수를 병합하며, 본문 미디어 타입 선택, 예제 값 생성, 보안 스키마 해석을 거쳐 정규화된 `RequestIR`을 만듭니다.
2. 선택한 `Generator`가 `RequestIR`을 받아 실행 가능한 소스 코드 문자열을 반환합니다.

보통 `generate({...})` 하나를 호출하면 두 단계가 모두 실행됩니다.

## 기본 예제

```typescript
import { generate } from "@powerduck/openapi-codegen";

const code = generate({
  document,                 // parsed OpenAPI object
  path: "/users/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
});

console.log(code);          // a runnable fetch() snippet
```

## 다음 단계

- [설치](/docs/ko-KR/openapi-codegen/installation/) — npm / yarn / pnpm 및 브라우저 사용.
- [빠른 시작](/docs/ko-KR/openapi-codegen/quickstart/) — 첫 코드 조각 생성 및 생성기 목록 조회.
- [설정](/docs/ko-KR/openapi-codegen/configuration/) — `GenerateOptions`, `RequestIR`, `Generator`, `Plugin`.
- [API 참조](/docs/ko-KR/openapi-codegen/api-reference/) — 모든 내보내기와 전체 언어/클라이언트 목록.
- [예제](/docs/ko-KR/openapi-codegen/examples/) — fetch, Python requests, cURL, 사용자 정의 생성기, 플러그인, 직접 구성한 `RequestIR`.
