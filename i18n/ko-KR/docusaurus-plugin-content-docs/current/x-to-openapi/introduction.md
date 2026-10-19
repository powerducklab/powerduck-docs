---
sidebar_position: 1
title: "@powerduck/x-to-openapi"
description: "@powerduck/x-to-openapi는 curl 명령과 Postman 컬렉션(v2.0 / v2.1.0)을 OpenAPI 3.2 문서로 변환하는 확장 가능한 TypeScript 프레임워크입니다. CI 파이프라인, API 문서 생성, HTTP 요청으로부터 인터페이스를 재구성하는 작업에 적합합니다."
---

# @powerduck/x-to-openapi

**@powerduck/x-to-openapi**는 **curl 명령**과 **Postman 컬렉션(v2.0 / v2.1.0)**을 **OpenAPI 3.2** 문서로 변환하는 확장 가능한 TypeScript 프레임워크입니다. CI 파이프라인, API 문서 생성, HTTP 요청으로부터 인터페이스를 재구성하는 작업에 적합합니다.

문서 검증에는 [`@powerduck/openapi-parser`](https://www.npmjs.com/package/@powerduck/openapi-parser)를 사용합니다.

- **버전:** <img src="https://img.shields.io/npm/v/@powerduck/x-to-openapi"/>
- **라이선스:** MIT
- **Node.js 요구 사항:** `>= 22.12.0`
- **출력:** OpenAPI **3.2.0**만 지원
- **소스 코드:** [github.com/powerducklab/x-to-openapi](https://github.com/powerducklab/x-to-openapi)

---

## 작동 방식

```text
curl 명령 → CurlAdapter
Postman 컬렉션 → PostmanAdapter
             ↓
     NormalizedRequest[]
             ↓
     buildOpenApi32() → OpenAPI 3.2 문서
             ↓
     validateOpenApi32() → 진단 정보
```

1. **어댑터**가 curl 텍스트나 Postman 컬렉션을 파싱하여 [`NormalizedRequest`](./api-reference.md#normalizedrequest) 객체 목록으로 만듭니다.
2. **빌더**가 메서드와 경로별로 요청을 병합하고 스키마, 경로 매개변수, 보안 정의를 추론하여 OpenAPI 3.2 문서를 생성합니다.
3. **검증기**가 `@powerduck/openapi-parser`를 통해 OpenAPI 스키마에 맞는지 확인하고 진단 정보를 반환합니다.

---

## 기능

- **내장 어댑터 2개:** [`CurlAdapter`](./api-reference.md#curladapter)는 단일·일괄 명령과 브라우저의 ‘Copy all as cURL’ 출력을 지원하며, [`PostmanAdapter`](./api-reference.md#postmanadapter)는 v2.0/v2.1.0, 중첩 폴더, 인증 상속을 지원합니다.
- **설정 없는 도우미 함수:** [`curlToOpenApi`](./api-reference.md#curltoopenapi)와 [`postmanToOpenApi`](./api-reference.md)는 한 번의 호출로 어댑터를 등록하고 변환합니다.
- **OpenAPI 3.2 출력:** 모든 문서는 `openapi: "3.2.0"`을 선언합니다. 검증은 기본적으로 켜져 있습니다. 진단 정보를 확인하거나 엄격 모드를 켜서 오류가 있는 변환을 거부하세요.
- **여러 요청 병합:** 메서드와 경로가 같은 작업을 결합하고 쿼리·헤더·쿠키 매개변수와 본문 스키마를 구조적으로 병합합니다.
- **경로 매개변수 추론:** 숫자 ID, UUID, ULID, 긴 16진수 구간이 최소 N개 샘플에서 달라지면 `/users/{userId}` 같은 템플릿으로 바꿉니다.
- **보안 추론:** Bearer, Basic, 헤더·쿼리·쿠키의 API 키를 감지하고 적절한 `securitySchemes`를 생성합니다.
- **다양한 본문 유형:** JSON, XML, form-urlencoded, multipart/form-data(텍스트와 파일), GraphQL, 텍스트, 바이너리.
- **Postman 테스트 스크립트 보존:** `pm.test()` / `pm.expect()`를 각 작업의 `x-postman-scripts`로 출력합니다.
- **진단 정보:** 각 문제는 심각도와 코드를 포함하며, 가능한 경우 출처 세부 정보도 제공합니다. [`strict`](./api-reference.md#convertoptions) 모드는 오류 시 예외를 발생시킵니다.
- **확장 가능:** [`SourceAdapter`](./api-reference.md)를 구현하여 HAR, HTTPie, Insomnia 등의 소스를 추가할 수 있습니다.

---

## 플러그인 구조

프레임워크는 작은 어댑터 인터페이스를 중심으로 구성됩니다.

```typescript
interface SourceAdapter<I = unknown> {
  readonly id: string;                       // e.g. "curl", "postman", "har"
  canHandle?(input: unknown): boolean;       // used by "auto" detection
  parse(input: I, context: AdapterContext): Promise<NormalizedRequest[]>;
}
```

[`AdapterRegistry`](./api-reference.md#adapterregistry)를 통해 [`XToOpenApi`](./api-reference.md#xtoopenapi) 인스턴스에 어댑터를 등록합니다.

```typescript
const converter = new XToOpenApi()
  .register(new CurlAdapter())
  .register(new PostmanAdapter());

// Explicit source id:
await converter.convert("curl", curlText);

// Auto-detect via canHandle():
await converter.convert("auto", someInput);
```

설정 없는 도우미 함수에는 두 내장 어댑터가 이미 연결되어 있어, 대부분 레지스트리를 직접 다룰 필요가 없습니다.

---

## 도우미 함수와 클래스 선택

| 사용 사례 | API |
|---|---|
| curl 명령 하나 또는 여러 개 변환 | [`curlToOpenApi`](./api-reference.md#curltoopenapi) |
| Postman 컬렉션 객체 또는 문자열 변환 | [`postmanToOpenApi`](./api-reference.md) |
| 사용자 지정 옵션, 여러 어댑터, `"auto"` 감지 또는 사용자 지정 어댑터 | [`new XToOpenApi()`](./api-reference.md#xtoopenapi) |

---

## 다음 단계

- [설치](./installation.md) — 패키지를 추가하고 설정 없는 도우미 함수를 알아봅니다.
- [빠른 시작](./quickstart.md) — curl 명령, Postman 컬렉션을 변환하고 사용자 지정 어댑터를 사용합니다.
- [API 참조](./api-reference.md) — 모든 내보내기, 타입, 옵션, 기본값, 진단 코드를 확인합니다.
- [예제](./examples.md) — curl, 일괄 명령, Postman 컬렉션, 사용자 지정 어댑터, 경로 추론 예제입니다.
