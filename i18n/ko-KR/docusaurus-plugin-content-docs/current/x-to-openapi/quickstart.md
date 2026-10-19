---
sidebar_position: 3
title: "빠른 시작"
description: "@powerduck/x-to-openapi 시작하기: curl 명령과 Postman 컬렉션을 변환하고 XToOpenApi로 사용자 정의 어댑터를 등록합니다."
---

# 빠른 시작

자주 쓰는 세 가지 방법인 `curlToOpenApi` 헬퍼, `postmanToOpenApi` 헬퍼, 사용자 정의 구성을 위한 `XToOpenApi` 클래스를 소개합니다.

사전 요구 사항: 패키지를 먼저 설치하세요. [설치](/docs/ko-KR/x-to-openapi/installation/)

:::note
모든 변환 함수는 **비동기**이며 [`ConvertResult`](/docs/ko-KR/x-to-openapi/api-reference/#convertresult)를 반환합니다. 항상 `await`를 사용하세요.
:::

## 1. curl 명령 변환

단일 curl 명령을 [`curlToOpenApi`](/docs/ko-KR/x-to-openapi/api-reference/#curltoopenapi)에 전달하세요. 결과의 `document`가 생성된 OpenAPI 3.2 객체입니다.

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  `curl -X POST https://api.example.com/users \
    -H 'Content-Type: application/json' \
    --data '{"name":"Ada","age":36}'`,
);

console.log(JSON.stringify(result.document, null, 2));
```

생성된 문서는 다음과 같습니다. 일부만 표시했습니다.

```json
{
  "openapi": "3.2.0",
  "info": { "title": "Generated API", "version": "1.0.0" },
  "servers": [{ "url": "https://api.example.com" }],
  "paths": {
    "/users": {
      "post": {
        "operationId": "postUsers",
        "tags": ["users"],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "name": { "type": "string" },
                  "age": { "type": "integer" }
                },
                "required": ["name", "age"]
              }
            }
          }
        },
        "responses": { "default": { "description": "Successful response" } }
      }
    }
  }
}
```

변환 성공 여부와 진단 정보를 확인하세요.

```typescript
if (!result.ok) {
  for (const d of result.diagnostics) {
    console.error(`[${d.severity}] ${d.code}: ${d.message}`);
  }
}
console.log("Document valid:", result.documentValid);
```

## 2. Postman 컬렉션 변환

파싱된 컬렉션 객체나 JSON 문자열을 [`postmanToOpenApi`](/docs/ko-KR/x-to-openapi/api-reference/)에 전달하세요. 테스트 스크립트는 `x-postman-scripts`로 보존됩니다.

```typescript
import { postmanToOpenApi } from "@powerduck/x-to-openapi";

const collection = {
  info: {
    name: "User API",
    schema: "https://schema.postman.com/json/collection/v2.1.0/collection.json",
  },
  item: [
    {
      name: "Get user",
      request: {
        method: "GET",
        url: "https://api.example.com/users/123",
        header: [{ key: "Authorization", value: "Bearer token" }],
      },
      event: [
        {
          listen: "test",
          script: {
            type: "text/javascript",
            exec: ["pm.test('status is 200', () => pm.response.to.have.status(200));"],
          },
        },
      ],
    },
  ],
  auth: { type: "bearer", bearer: [{ key: "token", value: "{{token}}" }] },
};

const result = await postmanToOpenApi(collection, {
  title: collection.info.name,
  inferPathParameters: true,
});

// The Postman test script survives on the operation:
console.log(result.document.paths["/users/123"]?.get?.["x-postman-scripts"]);
```

JSON 문자열도 사용할 수 있습니다.

```typescript
const fromText = await postmanToOpenApi('{"info":{"name":"API"},"item":[]}');
```

## 3. 사용자 정의 옵션으로 `XToOpenApi` 클래스 사용

등록된 어댑터와 [`ConvertOptions`](/docs/ko-KR/x-to-openapi/api-reference/#convertoptions)를 명시적으로 제어하려면 클래스를 사용하세요.

```typescript
import { XToOpenApi, CurlAdapter } from "@powerduck/x-to-openapi";

const converter = new XToOpenApi().register(new CurlAdapter());

const result = await converter.convert(
  "curl",
  "curl https://api.example.com/users/123",
  {
    title: "My API",
    version: "1.0.0",
    description: "Generated from curl commands",
    inferPathParameters: true,
    pathParameterMinSamples: 2,
    inferSecurity: true,
    includeCommonHeaders: false,
    includeCookies: false,
    includeExamples: false,
    useServerBasePath: false,
    validate: true,
    strict: false,
  },
);

console.log(result.document);
```

### 여러 어댑터 등록 및 `"auto"` 사용

```typescript
import { XToOpenApi, CurlAdapter, PostmanAdapter } from "@powerduck/x-to-openapi";

const converter = new XToOpenApi()
  .register(new CurlAdapter())
  .register(new PostmanAdapter());

// "auto" picks the first adapter whose canHandle(input) returns true.
const result = await converter.convert("auto", postmanCollectionOrCurlText);
```

## 4. 진단과 엄격 모드

기본적으로 변환 중 발견한 문제를 [`Diagnostic`](/docs/ko-KR/x-to-openapi/api-reference/) 항목으로 수집하고 결과를 반환합니다. `strict: true`를 지정하면 첫 오류 수준 진단에서 [`ConversionError`](/docs/ko-KR/x-to-openapi/api-reference/#conversionerror)를 발생시킵니다.

```typescript
import { curlToOpenApi, ConversionError } from "@powerduck/x-to-openapi";

try {
  await curlToOpenApi("curl https://api.example.com/users", { strict: true });
} catch (error) {
  if (error instanceof ConversionError) {
    console.error("Failed:", error.message);
    for (const d of error.diagnostics) console.error(`  [${d.code}] ${d.message}`);
  }
}
```

## 다음 단계

- [예제](/docs/ko-KR/x-to-openapi/examples/) — curl 일괄 변환, 경로 매개변수 추론, Postman 인증, 사용자 정의 어댑터.
- [API 참조](/docs/ko-KR/x-to-openapi/api-reference/) — 모든 내보내기, 옵션, 진단 코드.
