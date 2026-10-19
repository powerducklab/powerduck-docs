---
sidebar_position: 4
title: "API 참조"
description: "SchemaEditor 속성, 코어 내보내기 및 편집기 언어 타입."
---

# API 참조

## `<SchemaEditor />` — 속성

| 속성 | 타입 | 기본값 | 설명 |
|------|------|---------|-------------|
| `value` | `string` | 필수 | 편집기 콘텐츠 |
| `onChange` | `(value: string) => void` | — | 콘텐츠가 변경될 때 호출 |
| `language` | `"json" \| "yaml" \| "javascript"` | 필수 | 콘텐츠 언어 |
| `schema` | `JsonSchema` | — | 자동 완성과 진단에 사용하는 JSON Schema(json/yaml) |
| `snippets` | `string[]` | — | JavaScript 인라인 자동 완성에 사용할 코드 조각 문자열 |
| `theme` | `"light" \| "dark"` | `"light"` | 화면 테마 |
| `readOnly` | `boolean` | `false` | 편집 비활성화 |
| `placeholder` | `string` | — | 내용이 비어 있을 때 표시할 안내 문구 |
| `showDiagnostics` | `boolean` | `true` | 진단 상태 표시줄 표시 |
| `enableInlineSuggestions` | `boolean` | `true` | 인라인 제안 활성화 |
| `enableCompletion` | `boolean` | `true` | 자동 완성 팝업 활성화 |
| `diagnosticsDebounceMs` | `number` | `250` | 진단 디바운스 지연 시간 |

## 코어 내보내기 (`@powerduck/schema-editor`)

| 함수 | 설명 |
|----------|-------------|
| `resolveSchemas(document)` | 스키마 문서의 `$ref` 포인터 해석 |
| `validateSchema(data, schema)` | 스키마에 따라 데이터 검증 |
| `generateSample(schema)` | JSON Schema에서 예제 데이터 생성 |
| `getCompletionItems(model, position)` | 커서 위치의 자동 완성 항목 가져오기 |

## 타입

```typescript
import type { SchemaEditorProps } from "@powerduck/schema-editor/react";
```
