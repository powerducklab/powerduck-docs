---
sidebar_position: 3
title: "빠른 시작"
description: "@powerduck/openapi-codegen으로 실행 가능한 요청 예제를 만들고 사용할 수 있는 생성기를 확인합니다."
---

# 빠른 시작

이 가이드에서는 실행 가능한 요청 예제를 생성하고 사용 가능한 생성기를 찾는 방법을 설명합니다.

## 1. 설치

```bash npm2yarn2pnpm
npm install @powerduck/openapi-codegen
```

## 2. 문서에서 코드 생성

**파싱된** OpenAPI 문서와 대상 `path`, `method`, `language`, `client`를 전달합니다. `generate()`는 소스 코드를 문자열로 반환합니다.

```typescript
import { generate } from "@powerduck/openapi-codegen";
import document from "./openapi.json" with { type: "json" };

const code = generate({
  document,
  path: "/pets/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
});

console.log(code);
```

CommonJS로 작성한 동일한 예제:

```javascript
const { generate } = require("@powerduck/openapi-codegen");
const fs = require("node:fs");

const document = JSON.parse(fs.readFileSync("./openapi.json", "utf8"));

const code = generate({
  document,
  path: "/pets",
  method: "post",
  language: "python",
  client: "requests",
});

console.log(code);
```

## 3. 사용 가능한 생성기 목록 조회

`list()`는 등록된 모든 생성기의 설명자를 반환합니다.

```typescript
import { list } from "@powerduck/openapi-codegen";

for (const { language, client } of list()) {
  console.log(`${language}/${client}`);
}
```

각 설명자의 형식은 `{ language: string; client: string }`입니다. 식별자는 대소문자를 구분하므로 API 참조의 생성기 목록에 표시된 값을 그대로 사용하세요. [API 참조](/docs/ko-KR/openapi-codegen/api-reference/#built-in-generators-21-languages-41-clients).

코드로 생성기를 선택할 수도 있습니다.

```typescript
import { generate, list } from "@powerduck/openapi-codegen";

const picked = list().find(
  (g) => g.language === "javascript" && g.client === "fetch",
);

if (!picked) throw new Error("Generator not available");

const code = generate({
  document,
  path: "/pets",
  method: "get",
  language: picked.language,
  client: picked.client,
});
```

## 4. 인증 정보 제공

`securityValues`로 이름이 지정된 보안 스키마의 값을 설정합니다. 키는 문서에 정의된 보안 스키마 이름과 일치해야 합니다.

```typescript
const code = generate({
  document,
  path: "/pets/{id}",
  method: "get",
  language: "javascript",
  client: "fetch",
  securityValues: {
    bearerAuth: "YOUR_ACCESS_TOKEN",
    apiKey: "YOUR_API_KEY",
  },
});
```

## 5. 서버 URL 재정의

```typescript
const code = generate({
  document,
  path: "/pets",
  method: "get",
  language: "shell",
  client: "curl",
  serverUrl: "https://staging.example.com/v1",
});
```

## 오류 처리

입력이 누락되거나 지원하지 않는 생성기를 지정하면 `generate()`가 예외를 발생시킵니다. 신뢰할 수 없는 문서를 처리할 때는 예외를 처리하세요.

```typescript
try {
  const code = generate({
    document,
    path: "/pets/{id}",
    method: "get",
    language: "javascript",
    client: "fetch",
  });
  console.log(code);
} catch (error) {
  console.error("Generation failed:", error instanceof Error ? error.message : error);
}
```

## 다음 단계

- [설정](/docs/ko-KR/openapi-codegen/configuration/) — `GenerateOptions`, `RequestIR`, `Generator`, `Plugin`.
- [예제](/docs/ko-KR/openapi-codegen/examples/) — JavaScript fetch, Python requests, cURL, 사용자 정의 생성기, 플러그인, `RequestIR` 직접 사용.
- [API 참조](/docs/ko-KR/openapi-codegen/api-reference/) — 모든 내보내기 항목.
