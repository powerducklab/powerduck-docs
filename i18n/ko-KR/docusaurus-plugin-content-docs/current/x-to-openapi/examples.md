---
sidebar_position: 5
title: "예제"
description: "공개 API를 사용하는 실용적인 실행 예제입니다"
---

# 예제

공개 API를 사용하는 실용적인 실행 예제입니다. 변환 함수는 비동기이므로 `await`를 사용하세요. 입력을 로컬에서 파싱할 뿐, 기록된 HTTP 요청을 전송하지 않습니다.

---

## 1. 기본 curl 명령

단일 curl 명령을 변환하고 생성된 문서를 확인합니다.

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  `curl -X POST https://api.example.com/users \
    -H 'Content-Type: application/json' \
    --data '{"name":"Ada","age":36,"tags":["admin","user"]}'`,
);

console.log(result.document.openapi);            // "3.2.0"
console.log(result.ok, result.documentValid);    // true true

const post = result.document.paths["/users"].post;
const body = post?.requestBody;
if (!body || !("content" in body)) throw new Error("Expected an inline request body");
const media = body.content["application/json"];
console.log(media && "schema" in media ? media.schema : undefined);
// {
//   type: "object",
//   properties: {
//     name: { type: "string" },
//     age: { type: "integer" },
//     tags: { type: "array", items: { type: "string" } }
//   },
//   required: ["name", "age", "tags"]
// }
```

성공한 경우에도 진단 정보가 반환됩니다.

```typescript
for (const d of result.diagnostics) {
  console.log(`[${d.severity}] ${d.code}: ${d.message}`);
}
```

---

## 2. 여러 curl 명령 일괄 변환

명령 배열이나 여러 명령이 들어 있는 문자열을 전달하세요. 메서드와 경로가 같은 요청은 병합되며 스키마는 구조적으로 결합됩니다.

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  [
    "curl https://api.example.com/users",
    "curl https://api.example.com/users/123",
    "curl https://api.example.com/users/456",
    `curl -X POST https://api.example.com/users \
       -H 'Content-Type: application/json' \
       --data '{"name":"Ada"}'`,
  ],
  {
    title: "User API",
    version: "2.0.0",
    useServerBasePath: false,
    inferPathParameters: true,
  },
);

// The two detail requests are grouped; /users remains a separate path.
console.log(Object.keys(result.document.paths)); // ["/users", "/users/{userId}"]
```

### 브라우저의 ‘모두 cURL로 복사’ 결과

블록 전체를 한 번에 붙여 넣을 수 있습니다. [`splitCurlCommands`](./api-reference.md#splitcurlcommands)가 따옴표, 줄 이어쓰기, 프롬프트, `curl.exe`를 처리합니다.

```typescript
const block = `
$ curl 'https://api.example.com/users/1?active=true'
> curl 'https://api.example.com/users/2' -X POST \
  -H 'Content-Type: application/json' --data '{"name":"Ada"}'`;

const result = await curlToOpenApi(block, { title: "Pasted traffic" });
```

---

## 3. Postman Collection

컬렉션 객체를 변환합니다. 중첩 폴더, 인증 상속, 테스트 스크립트도 반영합니다.

```typescript
import { postmanToOpenApi } from "@powerduck/x-to-openapi";

const collection = {
  info: {
    name: "User API",
    schema: "https://schema.postman.com/json/collection/v2.1.0/collection.json",
  },
  auth: { type: "bearer", bearer: [{ key: "token", value: "{{token}}" }] },
  item: [
    {
      name: "Users",
      item: [
        {
          name: "Create user",
          request: {
            method: "POST",
            url: "https://api.example.com/users",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: '{"name":"Ada","role":"admin"}',
              options: { raw: { language: "json" } },
            },
          },
          event: [
            {
              listen: "test",
              script: {
                type: "text/javascript",
                exec: ["pm.test('status is 201', () => pm.response.to.have.status(201));"],
              },
            },
          ],
        },
      ],
    },
  ],
};

const result = await postmanToOpenApi(collection, {
  title: collection.info.name,
  inferPathParameters: true,
});

// Collection-level bearer auth becomes a securityScheme + operation security.
console.log(result.document.components?.securitySchemes);
// { bearerAuth: { type: "http", scheme: "bearer" } }

// The Postman test script is preserved:
console.log(result.document.paths["/users"].post["x-postman-scripts"]);
// { test: "pm.test('status is 201', () => ...)" }
```

JSON 문자열도 사용할 수 있습니다.

```typescript
const fromText = await postmanToOpenApi(JSON.stringify(collection));
```

---

## 4. 경로 매개변수 추론

`inferPathParameters`가 켜져 있으면(기본값) 요청을 메서드, 오리진, 경로 형태로 그룹화합니다. 그룹에 요청이 최소 `pathParameterMinSamples`개 있고, 구간 값이 서로 다르며, **모든** 값이 식별자처럼 보일 때만 해당 구간을 템플릿으로 바꿉니다. 식별자는 숫자, UUID, ULID 또는 8자 이상의 16진수 문자열입니다.

```typescript
import { curlToOpenApi } from "@powerduck/x-to-openapi";

const result = await curlToOpenApi(
  [
    "curl https://api.example.com/users/123",
    "curl https://api.example.com/users/456",
    "curl https://api.example.com/users/123/posts/abc12345",
    "curl https://api.example.com/users/456/posts/def45678",
  ],
  { pathParameterMinSamples: 2 },
);

console.log(Object.keys(result.document.paths));
// [ "/users/{userId}", "/users/{userId}/posts/{postId}" ]
```

매개변수 이름은 앞쪽에서 가장 가까운 정적 구간을 단수형과 카멜 케이스로 바꿔 만듭니다.

| 경로 패턴 | 매개변수 이름 |
|---|---|
| `/users/{}` | `userId` |
| `/users/{}/posts/{}` | `userId`, `postId` |
| `/categories/{}/items/{}` | `categoryId`, `itemId` |
| `/{}` | `param1` |

같은 경로에서 이름이 중복되면 숫자 접미사를 붙입니다(`userId`, `userId2`).

원래 경로 구간을 유지하려면 추론을 끄세요.

```typescript
await curlToOpenApi(commands, { inferPathParameters: false });
```

---

## 5. 사용자 정의 어댑터

[`SourceAdapter`](./api-reference.md)를 구현하면 HAR, HTTPie, Insomnia 등의 입력 소스를 추가할 수 있습니다. 이후 `XToOpenApi`에 등록하세요.

```typescript
import {
  XToOpenApi,
  CurlAdapter,
  type SourceAdapter,
  type NormalizedRequest,
  type AdapterContext,
} from "@powerduck/x-to-openapi";

// A trivial adapter that emits a single GET request.
class PingAdapter implements SourceAdapter<{ url: string }> {
  readonly id = "ping";

  canHandle(input: unknown): boolean {
    return (
      typeof input === "object" &&
      input !== null &&
      "url" in (input as Record<string, unknown>)
    );
  }

  async parse(
    input: { url: string },
    context: AdapterContext,
  ): Promise<NormalizedRequest[]> {
    let url: URL;
    try {
      url = new URL(input.url);
    } catch (cause) {
      context.report({
        code: "ADAPTER_PARSE_FAILED",
        severity: "error",
        source: this.id,
        message: `Invalid URL: ${input.url}`,
        cause,
      });
      return [];
    }

    return [
      {
        source: this.id,
        sourceIndex: 0,
        method: "get",
        url,
        urlString: url.toString(),
        headers: [],
        query: [],
        cookies: [],
      },
    ];
  }
}

const converter = new XToOpenApi()
  .register(new PingAdapter())
  .register(new CurlAdapter());

// Explicit adapter id:
const a = await converter.convert("ping", { url: "https://api.example.com/health" });

// Auto-detect:
const b = await converter.convert("auto", { url: "https://api.example.com/health" });

console.log(a.document.paths["/health"]?.get?.operationId);
```

---

## 6. 오류 처리와 엄격 모드

문제는 `result.diagnostics`에 수집됩니다. `strict: true`에서는 오류 수준 진단이 [`ConversionError`](./api-reference.md#conversionerror)를 발생시키지만, 경고만으로는 예외를 발생시키지 않습니다. 잘못된 옵션이나 알 수 없는 어댑터 ID도 예외를 발생시킬 수 있습니다.

```typescript
import { curlToOpenApi, ConversionError } from "@powerduck/x-to-openapi";

// Soft mode: inspect diagnostics yourself.
const soft = await curlToOpenApi("curl https://api.example.com/health");
if (!soft.ok) {
  for (const d of soft.diagnostics) {
    console.error(`[${d.severity}] ${d.code}: ${d.message}`);
  }
}

// Strict mode: throw on the first error-severity diagnostic.
try {
  await curlToOpenApi("not a curl command at all", { strict: true });
} catch (error) {
  if (error instanceof ConversionError) {
    console.error("Conversion failed:", error.message);
    for (const d of error.diagnostics) console.error(`  ${d.code}`);
  }
}
```

현재 크기 검사는 문자열 또는 배열 내 문자열 요소의 길이 합계가 JavaScript 문자열 코드 단위로 10 × 1024 × 1024를 넘으면 `strict`와 관계없이 `ConversionError`를 발생시킵니다. UTF-8 바이트 제한이 아니며, 파싱된 객체의 크기는 측정하지 않습니다. 신뢰할 수 없는 입력을 받기 전에 별도의 바이트 제한을 적용하세요.

---

## 다음 단계

- [API 참조](./api-reference.md): 옵션 기본값과 진단 코드.
- [빠른 시작](./quickstart.md): 첫 전체 변환 과정.
