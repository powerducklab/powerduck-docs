---
sidebar_position: 1
title: "@powerduck/conf-patch"
description: "@powerduck/conf-patch는 명확한 2계층 구조의 설정 편집 라이브러리입니다. RFC 6902 JSON Patch 의미에 따라 JSON, JSONC, YAML 문자열을 수정하면서 주석과 서식을 보존하고, Node.js와 Electron에 원자적 쓰기와 프로세스 간 파일 잠금을 제공합니다."
---

# @powerduck/conf-patch

**@powerduck/conf-patch**는 명확한 **2계층 구조**의 설정 편집 라이브러리입니다. [RFC 6902 JSON Patch](https://datatracker.ietf.org/doc/html/rfc6902) 의미에 따라 JSON, JSONC, YAML 문자열을 수정하면서 주석과 서식을 보존하고, Node.js와 Electron에 원자적 쓰기와 프로세스 간 파일 잠금을 제공합니다.

- **버전:** <img src="https://img.shields.io/npm/v/@powerduck/conf-patch"/>
- **라이선스:** MIT
- **Node.js 요구 사항:** `>= 22.12.0`
- **소스 코드:** [github.com/powerducklab/conf-patch](https://github.com/powerducklab/conf-patch)

---

## conf-patch를 사용하는 이유

코드로 설정 파일을 편집할 때는 문서 전체를 다시 직렬화하여 주석과 서식이 바뀔 위험을 감수하거나, 오류가 발생하기 쉬운 문자열 처리를 직접 구현해야 하는 경우가 많습니다. conf-patch는 다음을 제공합니다.

- **주석을 보존하는 증분 편집:** JSON/JSONC에는 `jsonc-parser`를, YAML의 AST 수정에는 `yaml`을 사용합니다. JSON/JSONC는 전체를 다시 직렬화하지 않으며, YAML은 수정한 AST를 다시 직렬화합니다.
- **원자적 쓰기:** 임시 파일을 작성한 뒤 이름을 변경하여 대상 파일에 일부 내용만 기록되는 것을 방지합니다.
- **프로세스 간 파일 잠금:** 소유권 토큰, 지수 백오프, 오래된 잠금 복구를 지원합니다.
- **다양한 환경에 적용하는 API:** 핵심 계층은 브라우저, 에지 함수, IndexedDB 저장소를 사용하는 애플리케이션에서도 동작합니다.

---

## 2계층 구조

```
┌──────────────────────────────────────────────────────────────┐
│                     Application code                          │
├──────────────────────────────────────────────────────────────┤
│  File layer (Node.js / Electron only)                         │
│  ┌───────────────┐ ┌────────────────┐ ┌──────────────────┐  │
│  │ readConfigFile │ │ writeConfigFile│ │ patchConfigFile   │  │
│  │ setConfigValue │ │ deleteConfig…  │ │ withFileLock     │  │
│  └──────┬────────┘ └───────┬────────┘ └────────┬─────────┘  │
│         │                  │                   │            │
│  ┌──────▼──────────────────▼───────────────────▼───────────┐ │
│  │           Core layer (browser-safe, zero Node deps)      │ │
│  │  patchContent   setContentValue   deleteContentValue     │ │
│  └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### 핵심 계층 — `@powerduck/conf-patch/core`(브라우저 호환)

**문자열**을 처리하는 순수 함수입니다. `node:fs`, `node:path` 등 Node.js 전용 API에 의존하지 않습니다. 이 하위 경로는 브라우저, 에지 함수 또는 서비스 워커 코드에 포함할 수 있습니다.

| 함수 | 용도 |
|---|---|
| [`patchContent`](../api-reference/#patchcontent) | 설정 문자열에 RFC 6902 작업 적용 |
| [`setContentValue`](../api-reference/#setcontentvalue) | 중첩 값 설정 또는 생성(`add` 사용) |
| [`deleteContentValue`](../api-reference/#deletecontentvalue) | 키 또는 배열 요소 삭제(`remove` 사용) |

### 파일 계층 — `@powerduck/conf-patch`(Node.js / Electron)

실제 파일을 읽고 쓰는 비동기 함수로, 핵심 계층에 원자적 쓰기와 잠금을 추가합니다.

| 함수 | 용도 |
|---|---|
| [`readConfigFile`](../api-reference/#readconfigfile) | 파일 경로나 `file://` URL에서 UTF-8 텍스트 읽기 |
| [`writeConfigFile`](../api-reference/#writeconfigfile) | 내용을 원자적으로 쓰기. 필요하면 잠금 사용 |
| [`patchConfigFile`](../api-reference/#patchconfigfile) | 파일 잠금 안에서 읽기·수정·쓰기 트랜잭션 실행 |
| [`setConfigValue`](../api-reference/#setconfigvalue) | 파일의 중첩 값 설정 |
| [`deleteConfigValue`](../api-reference/#deleteconfigvalue) | 파일의 중첩 값 삭제 |
| [`withFileLock`](../api-reference/#withfilelock) | 배타적 잠금 상태에서 작업 실행 |
| [`releaseAllLocalLocks`](../api-reference/#releasealllocallocks) | 현재 프로세스가 소유한 모든 잠금 해제 |

---

## 지원 형식

| 형식 | 확장자 | 동작 |
|---|---|---|
| **JSON** | `.json` | 표준 JSON. `jsonc-parser`로 증분 편집합니다. |
| **JSONC** | `.jsonc` | 주석과 후행 쉼표를 허용하는 JSON. 주석을 보존합니다. |
| **YAML** | `.yaml`, `.yml` | YAML 1.2. AST 수정 시 주석, 앵커, 들여쓰기를 보존합니다. |

[`detectFormat`](../api-reference/#detectformat)은 파일 확장자를 [`ConfigFormat`](../api-reference/#configformat)에 대응시킵니다. 다른 확장자는 `format`을 명시하지 않으면 오류를 발생시킵니다.

---

## RFC 6902 작업

conf-patch는 RFC 6902의 일부를 구현하며 다음 작업만 지원합니다.

| `op` | 동작 |
|---|---|
| `"add"` | 배열 인덱스에 삽입하거나 객체 속성을 추가·교체 |
| `"replace"` | 기존 값 교체. 경로가 존재해야 함 |
| `"remove"` | 기존 키 또는 배열 요소 삭제. 경로가 존재해야 함 |

:::caution
`"move"`, `"copy"`, `"test"`는 **지원하지 않습니다**. [`JsonPatchOp`](../api-reference/#jsonpatchop) 타입은 `op`를 `"add" | "replace" | "remove"`로 제한합니다.
:::

동작 참고 사항:

- 배열 인덱스에 `add`를 적용하면 요소를 **삽입**합니다(RFC 6902). 기존 요소를 교체하려면 `replace`를 사용하세요.
- `add`는 부모 경로가 먼저 존재해야 합니다. 자식보다 부모를 먼저 생성하세요.
- `replace`와 `remove`는 대상 경로가 존재해야 합니다.
- `strict: true`(기본값)에서는 작업 실패 시 예외가 발생합니다. `strict: false`에서는 해당 작업을 건너뛰고 경고를 기록합니다.

---

## 주석과 서식 보존

- **JSON/JSONC:** 구문 트리를 기준으로 수정할 텍스트 범위를 계산하므로 주변 주석, 후행 쉼표, 들여쓰기를 유지합니다.
- **YAML:** `yaml` AST를 직접 수정한 뒤 다시 직렬화하여 주석, 앵커, 별칭, 들여쓰기를 보존합니다.

---

## OpenAPI 검증

conf-patch는 `@powerduck/openapi-parser`에 안전장치를 더한 인터페이스로 OpenAPI/Swagger 문서를 검증합니다.

- [`validateOpenAPISpec`](../api-reference/#validateopenapispec)은 원본 JSON 또는 YAML 내용을 검증합니다.
- [`validateOpenAPIFile`](../api-reference/#validateopenapifile)은 파일 경로로 문서를 검증합니다.
- 입력 처리에는 크기 제한, 경로 제한(`allowedRootDirectory`), 구조 복잡도 검사, 시간 제한, `AbortSignal` 취소가 적용됩니다.
- 실패하면 프로그램에서 처리할 수 있는 `code`를 포함한 [`OpenApiValidationError`](../api-reference/#openapivalidationerror)가 발생합니다.

---

## 다음 단계

- [설치](../installation/) — conf-patch를 추가하고 두 진입점을 알아봅니다.
- [빠른 시작](../quickstart/) — 브라우저의 문자열과 디스크의 파일을 수정합니다.
- [API 참조](../api-reference/) — 모든 내보내기, 타입, 옵션을 확인합니다.
- [예제](../examples/) — JSON, YAML, JSONC, OpenAPI 검증, 잠금의 실행 가능한 예제입니다.
